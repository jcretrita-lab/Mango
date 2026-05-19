import {
  ForbiddenException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedRequestUser } from '../auth/auth.types';
import { PrismaService } from '../../core/prisma/prisma.service';
import { PERMISSION_CODES } from '../constants/permissions.constants';
import type { PaginatedResponseDto } from './paginated-response.dto';
import { projectApiRecord } from './response-projection';
import type {
  ApiQuery,
  ReadAllOptions,
  ReadDelegate,
  ReadFilterFieldDefinition,
  ReadFindManyArgs,
  ReadResourceDefinition,
} from './read-resource.types';

const DEFAULT_PAGE_LIMIT = 200;
const MAX_PAGE_LIMIT = 500;
const RESERVED_QUERY_PARAMS = new Set(['page', 'limit', 'search']);
const SENSITIVE_READ_MODELS = new Set([
  'employeeProfile',
  'familyMember',
  'emergencyContact',
  'referenceContact',
  'employeeFieldValue',
  'employeeFieldValueHistory',
  'employeeProfileHistory',
]);

export function firstQueryValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function buildReadOptions(query: ApiQuery): ReadAllOptions {
  const page = firstQueryValue(query.page);
  const limit = firstQueryValue(query.limit);

  return {
    page: page ? parseInt(page, 10) : undefined,
    limit: limit ? parseInt(limit, 10) : undefined,
    search: firstQueryValue(query.search),
    filters: Object.fromEntries(
      Object.entries(query)
        .filter(([key]) => !RESERVED_QUERY_PARAMS.has(key))
        .map(([key, value]) => [key, firstQueryValue(value)?.trim()])
        .filter((entry): entry is [string, string] => Boolean(entry[1])),
    ),
  };
}

function mergeWhere(
  left: Record<string, unknown> | undefined,
  right: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  return { AND: [left, right] };
}

function normalizeFilterField(
  field: string | ReadFilterFieldDefinition,
): ReadFilterFieldDefinition {
  return typeof field === 'string' ? { query: field, field } : field;
}

@Injectable()
export class ReadResourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    resource: ReadResourceDefinition,
    options: ReadAllOptions = {},
    actor?: AuthenticatedRequestUser,
  ): Promise<PaginatedResponseDto<unknown>> {
    const normalizedPage =
      options.page !== undefined && Number.isFinite(options.page)
        ? Math.max(1, Math.trunc(options.page))
        : undefined;
    const normalizedLimit =
      options.limit !== undefined && Number.isFinite(options.limit)
        ? Math.min(MAX_PAGE_LIMIT, Math.max(1, Math.trunc(options.limit)))
        : DEFAULT_PAGE_LIMIT;

    const where = [
      this.buildSearchWhere(resource, options.search),
      this.buildFilterWhere(resource, options.filters),
      this.buildEmployeeScopeWhere(resource, actor),
    ]
      .filter((condition): condition is Record<string, unknown> =>
        Boolean(condition),
      )
      .reduce<Record<string, unknown> | undefined>(
        (merged, condition) => mergeWhere(merged, condition),
        undefined,
      );

    const args: ReadFindManyArgs = {
      orderBy: { id: 'asc' },
      where,
      skip: ((normalizedPage ?? 1) - 1) * normalizedLimit,
      take: normalizedLimit,
    };

    const delegate = this.getDelegate(resource);
    const [data, total] = await Promise.all([
      delegate.findMany(args) as Promise<unknown[]>,
      delegate.count({ where }) as Promise<number>,
    ]);
    await this.auditSensitiveRead(resource, actor, 'collection');

    return {
      data: data.map((record) =>
        projectApiRecord(resource.model, record, actor),
      ),
      total,
      page: normalizedPage ?? 1,
      limit: normalizedLimit,
    };
  }

  async findOne(
    resource: ReadResourceDefinition,
    id: number,
    actor?: AuthenticatedRequestUser,
  ) {
    const record = await this.getDelegate(resource).findFirst({
      where: mergeWhere({ id }, this.buildEmployeeScopeWhere(resource, actor)),
    });

    if (!record) {
      throw new NotFoundException(`${resource.label} ${id} was not found.`);
    }
    await this.auditSensitiveRead(resource, actor, String(id));

    return projectApiRecord(resource.model, record, actor);
  }

  rejectGenericMutation(resourceLabel: string): never {
    throw new MethodNotAllowedException(
      `${resourceLabel} must be changed through a domain-specific workflow.`,
    );
  }

  private getDelegate(resource: ReadResourceDefinition): ReadDelegate {
    return this.prisma[resource.model] as unknown as ReadDelegate;
  }

  private buildEmployeeScopeWhere(
    resource: ReadResourceDefinition,
    actor: AuthenticatedRequestUser | undefined,
  ): Record<string, unknown> | undefined {
    if (!actor || !this.shouldApplyEmployeeScope(resource, actor)) {
      return undefined;
    }

    const scope = resource.employeeReadScope;

    if (!scope) {
      throw new ForbiddenException(
        `${resource.label} is not available to employee self-service.`,
      );
    }

    const employeeId = Number.parseInt(actor.employeeId ?? '', 10);

    if (!Number.isInteger(employeeId) || employeeId <= 0) {
      throw new ForbiddenException(
        'This session is not linked to an employee record.',
      );
    }

    return { [scope.field]: employeeId };
  }

  private shouldApplyEmployeeScope(
    resource: ReadResourceDefinition,
    actor: AuthenticatedRequestUser,
  ): boolean {
    const selfReadPermission = resource.selfReadPermission;

    if (
      !selfReadPermission ||
      !actor.permissions.includes(selfReadPermission)
    ) {
      return false;
    }

    const globalReadPermission = resource.readPermission;

    return (
      !globalReadPermission || !actor.permissions.includes(globalReadPermission)
    );
  }

  private buildSearchWhere(
    resource: ReadResourceDefinition,
    search: string | undefined,
  ): Record<string, unknown> | undefined {
    if (!search?.trim() || !resource.searchFields?.length) {
      return undefined;
    }

    const term = search.trim();

    return {
      OR: resource.searchFields.map((field) => ({
        [field]: { contains: term, mode: 'insensitive' },
      })),
    };
  }

  private buildFilterWhere(
    resource: ReadResourceDefinition,
    filters: Record<string, string> | undefined,
  ): Record<string, unknown> | undefined {
    if (!filters || !resource.filterFields?.length) {
      return undefined;
    }

    const entries = resource.filterFields
      .map((field) => {
        const definition = normalizeFilterField(field);
        return [definition, filters[definition.query]?.trim()] as const;
      })
      .filter((entry): entry is readonly [ReadFilterFieldDefinition, string] =>
        Boolean(entry[1] && entry[1].toLowerCase() !== 'all'),
      );

    if (entries.length === 0) {
      return undefined;
    }

    return Object.fromEntries(
      entries.map(([definition, value]) => [
        definition.field,
        definition.jsonPath?.length
          ? { path: [...definition.jsonPath], equals: value }
          : value,
      ]),
    );
  }

  private async auditSensitiveRead(
    resource: ReadResourceDefinition,
    actor: AuthenticatedRequestUser | undefined,
    entityId: string,
  ): Promise<void> {
    if (
      !actor ||
      !SENSITIVE_READ_MODELS.has(resource.model) ||
      !actor.permissions.includes(PERMISSION_CODES.PERSONNEL_SENSITIVE_READ)
    ) {
      return;
    }

    await this.prisma.auditEvent.create({
      data: {
        actorUserId: actor.backendUserId,
        eventType: 'PERSONNEL_SENSITIVE_READ',
        entityType: resource.label,
        entityId,
      },
    });
  }
}
