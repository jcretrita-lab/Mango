import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import type { AuthTokenPayload } from '../guards/jwt-auth.guard';
import { normalizeRecordPayload } from '../payload/normalize-payload';
import type {
  CrudDelegate,
  CrudFilterFieldDefinition,
  CrudFindManyArgs,
  CrudModelName,
  CrudMutationPayload,
  CrudResourceDefinition,
} from './crud.types';

export interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, string>;
}

const DEFAULT_PAGE_LIMIT = 200; // generous default for Phase 1 local data
const MAX_PAGE_LIMIT = 500;
const PROTECTED_MUTATION_FIELDS = new Set([
  'id',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isJsonPayloadField(fieldName: string): boolean {
  return fieldName.toLowerCase().endsWith('json');
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
  field: string | CrudFilterFieldDefinition,
): CrudFilterFieldDefinition {
  return typeof field === 'string' ? { query: field, field } : field;
}

@Injectable()
export class PrismaCrudService<
  ModelName extends CrudModelName = CrudModelName,
> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly resource: CrudResourceDefinition<ModelName>,
  ) {}

  private get delegate(): CrudDelegate {
    return this.prisma[this.resource.model] as unknown as CrudDelegate;
  }

  private buildNotFoundMessage(id: number): string {
    return `${this.resource.label} ${id} was not found.`;
  }

  private buildConflictMessage(target: unknown): string {
    const fields = Array.isArray(target)
      ? target.join(', ')
      : 'unique field(s)';
    return `${this.resource.label} conflicts with an existing record on ${fields}.`;
  }

  private rethrowKnownError(error: unknown, id?: number): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025' && id !== undefined) {
        throw new NotFoundException(this.buildNotFoundMessage(id));
      }

      if (error.code === 'P2002') {
        throw new ConflictException(
          this.buildConflictMessage(error.meta?.target),
        );
      }

      if (error.code === 'P2003') {
        throw new BadRequestException(
          `${this.resource.label} references a related record that does not exist.`,
        );
      }
    }

    throw error;
  }

  async findAll(options: FindAllOptions = {}, actor?: AuthTokenPayload) {
    const normalizedPage =
      options.page !== undefined && Number.isFinite(options.page)
        ? Math.max(1, Math.trunc(options.page))
        : undefined;
    const normalizedLimit =
      options.limit !== undefined && Number.isFinite(options.limit)
        ? Math.min(MAX_PAGE_LIMIT, Math.max(1, Math.trunc(options.limit)))
        : DEFAULT_PAGE_LIMIT;
    const { filters, search } = options;

    const where = [
      this.buildSearchWhere(search),
      this.buildFilterWhere(filters),
      this.buildEmployeeScopeWhere(actor),
    ]
      .filter((condition): condition is Record<string, unknown> =>
        Boolean(condition),
      )
      .reduce<Record<string, unknown> | undefined>(
        (merged, condition) => mergeWhere(merged, condition),
        undefined,
      );

    const args: CrudFindManyArgs = {
      orderBy: { id: 'asc' },
      where,
    };

    if (normalizedPage !== undefined) {
      args.skip = (normalizedPage - 1) * normalizedLimit;
      args.take = normalizedLimit;
    }

    const countDelegate = this.delegate as CrudDelegate & {
      count: (args: { where?: Record<string, unknown> }) => Promise<number>;
    };
    const [data, total] = await Promise.all([
      this.delegate.findMany(args),
      countDelegate.count({ where }),
    ]);

    return {
      data,
      total,
      page: normalizedPage ?? 1,
      limit: normalizedLimit,
    };
  }

  async findOne(id: number, actor?: AuthTokenPayload) {
    const record = await this.delegate.findFirst({
      where: mergeWhere({ id }, this.buildEmployeeScopeWhere(actor)),
    });

    if (!record) {
      throw new NotFoundException(this.buildNotFoundMessage(id));
    }

    return record;
  }

  private buildEmployeeScopeWhere(
    actor: AuthTokenPayload | undefined,
  ): Record<string, unknown> | undefined {
    if (actor?.role !== 'Employee') {
      return undefined;
    }

    const scope = this.resource.employeeReadScope;

    if (!scope) {
      throw new ForbiddenException(
        `${this.resource.label} is not available to employee self-service.`,
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

  private buildSearchWhere(
    search: string | undefined,
  ): Record<string, unknown> | undefined {
    if (!search?.trim() || !this.resource.searchFields?.length) {
      return undefined;
    }

    const term = search.trim();

    return {
      OR: this.resource.searchFields.map((field) => ({
        [field]: { contains: term, mode: 'insensitive' },
      })),
    };
  }

  private buildFilterWhere(
    filters: Record<string, string> | undefined,
  ): Record<string, unknown> | undefined {
    if (!filters || !this.resource.filterFields?.length) {
      return undefined;
    }

    const entries = this.resource.filterFields
      .map((field) => {
        const definition = normalizeFilterField(field);
        return [definition, filters[definition.query]?.trim()] as const;
      })
      .filter((entry): entry is readonly [CrudFilterFieldDefinition, string] =>
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

  private async executeMutation<T>(
    operation: () => Promise<T>,
    id?: number,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.rethrowKnownError(error, id);
    }
  }

  private assertGenericMutationsEnabled(): void {
    if (this.resource.genericMutations !== true) {
      throw new MethodNotAllowedException(
        `${this.resource.label} must be changed through a domain-specific workflow.`,
      );
    }
  }

  private sanitizeMutationPayload(
    data: CrudMutationPayload,
  ): CrudMutationPayload {
    const entries = Object.entries(data);
    const rejectedFields = entries
      .filter(([key, value]) => {
        if (PROTECTED_MUTATION_FIELDS.has(key)) {
          return true;
        }

        if (isJsonPayloadField(key)) {
          return false;
        }

        return isPlainObject(value) || Array.isArray(value);
      })
      .map(([key]) => key);

    if (rejectedFields.length > 0) {
      throw new BadRequestException(
        `${this.resource.label} payload contains protected or unsupported fields: ${rejectedFields.join(', ')}.`,
      );
    }

    return data;
  }

  async create(data: CrudMutationPayload) {
    this.assertGenericMutationsEnabled();

    return this.executeMutation(() =>
      this.delegate.create({
        data: normalizeRecordPayload(this.sanitizeMutationPayload(data)),
      }),
    );
  }

  async update(id: number, data: CrudMutationPayload) {
    this.assertGenericMutationsEnabled();

    return this.executeMutation(
      () =>
        this.delegate.update({
          where: { id },
          data: normalizeRecordPayload(this.sanitizeMutationPayload(data)),
        }),
      id,
    );
  }

  async remove(id: number) {
    this.assertGenericMutationsEnabled();

    return this.executeMutation(
      () =>
        this.delegate.delete({
          where: { id },
        }),
      id,
    );
  }
}
