import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import {
  type ReadAllOptions,
  type ReadModelName,
  type ReadResourceDefinition,
} from '../../common/api/read-resource.types';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import {
  assertDateOrder,
  assertNonEmptyPayload,
  assertRecordExists,
  assertRequiredFields,
  auditWrite,
  pickDefinedFields,
  readModelLabel,
  requireActor,
  type WriteDelegate,
  type WritePayload,
} from '../../common/api/domain-write.helpers';
import { projectApiRecord } from '../../common/api/response-projection';
import { PrismaService } from '../../core/prisma/prisma.service';

type OrgStructureResourceKey =
  | 'companyProfiles'
  | 'hierarchyLevels'
  | 'orgUnits'
  | 'orgUnitClosures'
  | 'orgUnitVersions'
  | 'sites'
  | 'ranks'
  | 'rankLevels'
  | 'positionTemplates'
  | 'positionProfiles'
  | 'positionSubLevels'
  | 'positions'
  | 'positionAssignments';

const resources = {
  companyProfiles: {
    model: 'companyProfile',
    label: 'Company profile',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['registeredName', 'displayName', 'tin', 'registrationNo'],
    filterFields: ['status', 'countryCode'],
  },
  hierarchyLevels: {
    model: 'hierarchyLevel',
    label: 'Hierarchy level',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['label', 'description'],
    filterFields: [{ query: 'levelNo', field: 'levelNo', type: 'number' }],
  },
  orgUnits: {
    model: 'orgUnit',
    label: 'Org unit',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['code', 'name'],
    filterFields: [
      { query: 'parentOrgUnitId', field: 'parentOrgUnitId', type: 'number' },
      { query: 'hierarchyLevelId', field: 'hierarchyLevelId', type: 'number' },
      { query: 'isActive', field: 'isActive', type: 'boolean' },
      { query: 'active', field: 'isActive', type: 'boolean' },
    ],
  },
  orgUnitClosures: {
    model: 'orgUnitClosure',
    label: 'Org unit closure row',
    readPermission: PERMISSION_CODES.ORG_READ,
    filterFields: [
      {
        query: 'ancestorOrgUnitId',
        field: 'ancestorOrgUnitId',
        type: 'number',
      },
      {
        query: 'descendantOrgUnitId',
        field: 'descendantOrgUnitId',
        type: 'number',
      },
      { query: 'depth', field: 'depth', type: 'number' },
    ],
  },
  orgUnitVersions: {
    model: 'orgUnitVersion',
    label: 'Org unit version',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['name', 'changeReason'],
    filterFields: [
      { query: 'orgUnitId', field: 'orgUnitId', type: 'number' },
      { query: 'isCurrent', field: 'isCurrent', type: 'boolean' },
      { query: 'current', field: 'isCurrent', type: 'boolean' },
    ],
  },
  sites: {
    model: 'site',
    label: 'Site',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['code', 'name', 'city', 'region'],
    filterFields: [
      'countryCode',
      { query: 'isActive', field: 'isActive', type: 'boolean' },
      { query: 'active', field: 'isActive', type: 'boolean' },
    ],
  },
  ranks: {
    model: 'rank',
    label: 'Rank',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['name', 'mode'],
    filterFields: ['mode'],
  },
  rankLevels: {
    model: 'rankLevel',
    label: 'Rank level',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['code'],
    filterFields: [{ query: 'rankId', field: 'rankId', type: 'number' }],
  },
  positionTemplates: {
    model: 'positionTemplate',
    label: 'Position template',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['name', 'family', 'category', 'description'],
    filterFields: ['family', 'category'],
  },
  positionProfiles: {
    model: 'positionProfile',
    label: 'Position profile',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['label', 'progressionMode'],
    filterFields: [
      {
        query: 'positionTemplateId',
        field: 'positionTemplateId',
        type: 'number',
      },
      { query: 'rankId', field: 'rankId', type: 'number' },
      { query: 'rankLevelId', field: 'rankLevelId', type: 'number' },
      'progressionMode',
    ],
  },
  positionSubLevels: {
    model: 'positionSubLevel',
    label: 'Position sub level',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['name'],
    filterFields: [
      {
        query: 'positionProfileId',
        field: 'positionProfileId',
        type: 'number',
      },
      { query: 'salaryGradeId', field: 'salaryGradeId', type: 'number' },
    ],
  },
  positions: {
    model: 'position',
    label: 'Position',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['title', 'employmentStatus'],
    filterFields: [
      { query: 'orgUnitId', field: 'orgUnitId', type: 'number' },
      {
        query: 'positionProfileId',
        field: 'positionProfileId',
        type: 'number',
      },
      {
        query: 'supervisorPositionId',
        field: 'supervisorPositionId',
        type: 'number',
      },
      'employmentStatus',
    ],
  },
  positionAssignments: {
    model: 'positionAssignment',
    label: 'Position assignment',
    readPermission: PERMISSION_CODES.ORG_READ,
    searchFields: ['assignmentType'],
    filterFields: [
      { query: 'positionId', field: 'positionId', type: 'number' },
      { query: 'employeeId', field: 'employeeId', type: 'number' },
      'assignmentType',
    ],
  },
} as const satisfies Record<OrgStructureResourceKey, ReadResourceDefinition>;

const resourceKeyByPath: Readonly<Record<string, OrgStructureResourceKey>> = {
  'company-profiles': 'companyProfiles',
  'company-profile': 'companyProfiles',
  'hierarchy-levels': 'hierarchyLevels',
  'org-units': 'orgUnits',
  'org-unit-closures': 'orgUnitClosures',
  'org-unit-closure': 'orgUnitClosures',
  'org-unit-versions': 'orgUnitVersions',
  sites: 'sites',
  ranks: 'ranks',
  'rank-levels': 'rankLevels',
  'position-templates': 'positionTemplates',
  'position-profiles': 'positionProfiles',
  'position-sub-levels': 'positionSubLevels',
  positions: 'positions',
  'position-assignments': 'positionAssignments',
};

@Injectable()
export class OrgStructureService {
  constructor(
    private readonly readService: ReadResourceService,
    private readonly prisma: PrismaService,
  ) {}

  findAll(
    resourceKey: OrgStructureResourceKey,
    options: ReadAllOptions,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findAll(resources[resourceKey], options, actor);
  }

  findOne(
    resourceKey: OrgStructureResourceKey,
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findOne(resources[resourceKey], id, actor);
  }

  rejectGenericMutation(resourceKey: OrgStructureResourceKey): never {
    return this.readService.rejectGenericMutation(resources[resourceKey].label);
  }

  rejectGenericMutationByPath(resourcePath: string): never {
    const resourceKey = resourceKeyByPath[resourcePath];

    if (!resourceKey) {
      throw new NotFoundException(
        `Org structure resource ${resourcePath} was not found.`,
      );
    }

    return this.rejectGenericMutation(resourceKey);
  }

  createCompanyProfile(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createResource('companyProfile', data, actor, {
      label: 'Company profile',
      eventType: 'ORG_COMPANY_PROFILE_CREATED',
      allowedFields: [
        'registeredName',
        'displayName',
        'registrationType',
        'registrationNo',
        'tin',
        'branchCode',
        'rdoCode',
        'sssEmployerNo',
        'philhealthEmployerNo',
        'pagibigEmployerNo',
        'businessAddress',
        'countryCode',
        'rootOrgUnitId',
        'status',
      ],
      requiredFields: [
        'registeredName',
        'displayName',
        'registrationType',
        'registrationNo',
        'tin',
        'businessAddress',
      ],
    });
  }

  updateCompanyProfile(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource('companyProfile', id, data, actor, {
      label: 'Company profile',
      eventType: 'ORG_COMPANY_PROFILE_UPDATED',
      allowedFields: [
        'registeredName',
        'displayName',
        'registrationType',
        'registrationNo',
        'tin',
        'branchCode',
        'rdoCode',
        'sssEmployerNo',
        'philhealthEmployerNo',
        'pagibigEmployerNo',
        'businessAddress',
        'countryCode',
        'rootOrgUnitId',
        'status',
      ],
    });
  }

  updateCompanyProfileStatus(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource(
      'companyProfile',
      id,
      { status: data.status },
      actor,
      {
        label: 'Company profile',
        eventType: 'ORG_COMPANY_PROFILE_STATUS_UPDATED',
        allowedFields: ['status'],
        requiredFields: ['status'],
      },
    );
  }

  createHierarchyLevel(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createResource('hierarchyLevel', data, actor, {
      label: 'Hierarchy level',
      eventType: 'ORG_HIERARCHY_LEVEL_CREATED',
      allowedFields: ['levelNo', 'label', 'description'],
      requiredFields: ['levelNo', 'label'],
    });
  }

  updateHierarchyLevel(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource('hierarchyLevel', id, data, actor, {
      label: 'Hierarchy level',
      eventType: 'ORG_HIERARCHY_LEVEL_UPDATED',
      allowedFields: ['levelNo', 'label', 'description'],
    });
  }

  createSite(data: WritePayload, actor: AuthenticatedRequestUser | undefined) {
    return this.createResource('site', data, actor, {
      label: 'Site',
      eventType: 'ORG_SITE_CREATED',
      allowedFields: [
        'code',
        'name',
        'address',
        'city',
        'region',
        'countryCode',
        'isActive',
        'sortOrder',
      ],
      requiredFields: ['code', 'name'],
    });
  }

  updateSite(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource('site', id, data, actor, {
      label: 'Site',
      eventType: 'ORG_SITE_UPDATED',
      allowedFields: [
        'code',
        'name',
        'address',
        'city',
        'region',
        'countryCode',
        'isActive',
        'sortOrder',
      ],
    });
  }

  updateSiteStatus(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource(
      'site',
      id,
      { isActive: this.readBooleanStatus(data) },
      actor,
      {
        label: 'Site',
        eventType: 'ORG_SITE_STATUS_UPDATED',
        allowedFields: ['isActive'],
        requiredFields: ['isActive'],
      },
    );
  }

  createOrgUnit(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createResource('orgUnit', data, actor, {
      label: 'Org unit',
      eventType: 'ORG_UNIT_CREATED',
      allowedFields: [
        'parentOrgUnitId',
        'hierarchyLevelId',
        'headPositionId',
        'code',
        'name',
        'isActive',
      ],
      requiredFields: ['hierarchyLevelId', 'code', 'name'],
      afterCreate: async (tx, record, requestActor) => {
        await this.rebuildClosureRows(
          tx,
          record.id,
          record.parentOrgUnitId,
          requestActor.backendUserId,
        );
      },
    });
  }

  updateOrgUnit(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource('orgUnit', id, data, actor, {
      label: 'Org unit',
      eventType: 'ORG_UNIT_UPDATED',
      allowedFields: [
        'hierarchyLevelId',
        'headPositionId',
        'code',
        'name',
        'isActive',
      ],
    });
  }

  updateOrgUnitStatus(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource(
      'orgUnit',
      id,
      { isActive: this.readBooleanStatus(data) },
      actor,
      {
        label: 'Org unit',
        eventType: 'ORG_UNIT_STATUS_UPDATED',
        allowedFields: ['isActive'],
        requiredFields: ['isActive'],
      },
    );
  }

  async moveOrgUnit(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const parentOrgUnitId =
      data.parentOrgUnitId === null ? null : Number(data.parentOrgUnitId);

    if (
      parentOrgUnitId !== null &&
      (!Number.isInteger(parentOrgUnitId) || parentOrgUnitId <= 0)
    ) {
      throw new BadRequestException(
        'parentOrgUnitId must be a positive integer or null.',
      );
    }

    const movedUnit = await this.prisma.$transaction(async (tx) => {
      if (parentOrgUnitId === id) {
        throw new BadRequestException(
          'An org unit cannot be moved under itself.',
        );
      }

      if (parentOrgUnitId) {
        const descendant = await tx.orgUnitClosure.findFirst({
          where: {
            ancestorOrgUnitId: id,
            descendantOrgUnitId: parentOrgUnitId,
          },
        });

        if (descendant) {
          throw new BadRequestException(
            'An org unit cannot be moved under its descendant.',
          );
        }
      }

      const subtreeRows = await tx.orgUnitClosure.findMany({
        where: { ancestorOrgUnitId: id },
        orderBy: { depth: 'asc' },
      });
      const subtreeOrgUnitIds = subtreeRows.map(
        (row) => row.descendantOrgUnitId,
      );

      const updated = await tx.orgUnit.update({
        where: { id },
        data: {
          parentOrgUnitId,
          updatedBy: requestActor.backendUserId,
        },
      });

      await tx.orgUnitClosure.deleteMany({
        where: {
          descendantOrgUnitId: { in: subtreeOrgUnitIds },
          ancestorOrgUnitId: { notIn: subtreeOrgUnitIds },
        },
      });

      if (parentOrgUnitId) {
        const parentAncestors = await tx.orgUnitClosure.findMany({
          where: { descendantOrgUnitId: parentOrgUnitId },
          orderBy: { depth: 'asc' },
        });

        await tx.orgUnitClosure.createMany({
          data: parentAncestors.flatMap((ancestor) =>
            subtreeRows.map((subtreeRow) => ({
              ancestorOrgUnitId: ancestor.ancestorOrgUnitId,
              descendantOrgUnitId: subtreeRow.descendantOrgUnitId,
              depth: ancestor.depth + subtreeRow.depth + 1,
              createdBy: requestActor.backendUserId,
              updatedBy: requestActor.backendUserId,
            })),
          ),
          skipDuplicates: true,
        });
      }

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'ORG_UNIT_MOVED',
        'OrgUnit',
        id,
        { parentOrgUnitId },
      );

      return updated;
    });

    return this.project('orgUnit', movedUnit, requestActor);
  }

  async findOrgUnitChildren(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const records = await this.prisma.orgUnit.findMany({
      where: { parentOrgUnitId: id },
      orderBy: { id: 'asc' },
    });

    return {
      data: records.map((record) => this.project('orgUnit', record, actor)),
    };
  }

  async findOrgUnitAncestors(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const rows = await this.prisma.orgUnitClosure.findMany({
      where: { descendantOrgUnitId: id, depth: { gt: 0 } },
      orderBy: { depth: 'desc' },
    });
    const records = await this.prisma.orgUnit.findMany({
      where: { id: { in: rows.map((row) => row.ancestorOrgUnitId) } },
    });
    const byId = new Map(records.map((record) => [record.id, record]));

    return {
      data: rows
        .map((row) => byId.get(row.ancestorOrgUnitId))
        .filter((record): record is NonNullable<typeof record> =>
          Boolean(record),
        )
        .map((record) => this.project('orgUnit', record, actor)),
    };
  }

  async findOrgUnitDescendants(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const rows = await this.prisma.orgUnitClosure.findMany({
      where: { ancestorOrgUnitId: id, depth: { gt: 0 } },
      orderBy: { depth: 'asc' },
    });
    const records = await this.prisma.orgUnit.findMany({
      where: { id: { in: rows.map((row) => row.descendantOrgUnitId) } },
    });
    const byId = new Map(records.map((record) => [record.id, record]));

    return {
      data: rows
        .map((row) => byId.get(row.descendantOrgUnitId))
        .filter((record): record is NonNullable<typeof record> =>
          Boolean(record),
        )
        .map((record) => this.project('orgUnit', record, actor)),
    };
  }

  async rebuildOrgUnitClosure(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const result = await this.prisma.$transaction(async (tx) => {
      const units = await tx.orgUnit.findMany({ orderBy: { id: 'asc' } });
      if (!units.some((unit) => unit.id === id)) {
        throw new NotFoundException(`Org unit ${id} was not found.`);
      }

      const childrenByParentId = new Map<number | null, number[]>();
      const parentById = new Map<number, number | null>();
      for (const unit of units) {
        parentById.set(unit.id, unit.parentOrgUnitId ?? null);
        const parentId = unit.parentOrgUnitId ?? null;
        childrenByParentId.set(parentId, [
          ...(childrenByParentId.get(parentId) ?? []),
          unit.id,
        ]);
      }

      const subtreeIds = this.collectSubtreeIds(id, childrenByParentId);
      const closureRows = subtreeIds.flatMap((orgUnitId) =>
        this.buildClosureRowsForOrgUnit(
          orgUnitId,
          parentById,
          requestActor.backendUserId,
        ),
      );

      await tx.orgUnitClosure.deleteMany({
        where: { descendantOrgUnitId: { in: subtreeIds } },
      });
      await tx.orgUnitClosure.createMany({
        data: closureRows,
        skipDuplicates: true,
      });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'ORG_UNIT_CLOSURE_REBUILT',
        'OrgUnit',
        id,
        { rebuiltOrgUnitIds: subtreeIds },
      );

      return { rebuiltOrgUnitIds: subtreeIds, closureRows: closureRows.length };
    });

    return result;
  }

  createOrgUnitVersion(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'effectiveStartDate', 'effectiveEndDate');

    return this.createCurrentOrgUnitVersion(data, actor);
  }

  async findOrgUnitsAsOf(
    dateValue: unknown,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const asOf = this.readDate(dateValue, 'date');
    const versions = await this.prisma.orgUnitVersion.findMany({
      where: {
        effectiveStartDate: { lte: asOf },
        OR: [{ effectiveEndDate: null }, { effectiveEndDate: { gte: asOf } }],
      },
      orderBy: [{ orgUnitId: 'asc' }, { effectiveStartDate: 'desc' }],
    });
    const latestByOrgUnitId = new Map<number, (typeof versions)[number]>();
    for (const version of versions) {
      if (!latestByOrgUnitId.has(version.orgUnitId)) {
        latestByOrgUnitId.set(version.orgUnitId, version);
      }
    }
    const data = Array.from(latestByOrgUnitId.values()).map((record) =>
      this.project('orgUnitVersion', record, actor),
    );

    return { data, total: data.length, asOf: asOf.toISOString() };
  }

  createRank(data: WritePayload, actor: AuthenticatedRequestUser | undefined) {
    return this.createResource('rank', data, actor, {
      label: 'Rank',
      eventType: 'ORG_RANK_CREATED',
      allowedFields: ['name', 'sortOrder', 'color', 'mode'],
      requiredFields: ['name', 'sortOrder', 'mode'],
    });
  }

  updateRank(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource('rank', id, data, actor, {
      label: 'Rank',
      eventType: 'ORG_RANK_UPDATED',
      allowedFields: ['name', 'sortOrder', 'color', 'mode'],
    });
  }

  createRankLevel(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createResource('rankLevel', data, actor, {
      label: 'Rank level',
      eventType: 'ORG_RANK_LEVEL_CREATED',
      allowedFields: ['rankId', 'code', 'sortOrder'],
      requiredFields: ['rankId', 'code', 'sortOrder'],
    });
  }

  updateRankLevel(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource('rankLevel', id, data, actor, {
      label: 'Rank level',
      eventType: 'ORG_RANK_LEVEL_UPDATED',
      allowedFields: ['rankId', 'code', 'sortOrder'],
    });
  }

  createPositionTemplate(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createResource('positionTemplate', data, actor, {
      label: 'Position template',
      eventType: 'ORG_POSITION_TEMPLATE_CREATED',
      allowedFields: ['name', 'family', 'category', 'description'],
      requiredFields: ['name'],
    });
  }

  updatePositionTemplate(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource('positionTemplate', id, data, actor, {
      label: 'Position template',
      eventType: 'ORG_POSITION_TEMPLATE_UPDATED',
      allowedFields: ['name', 'family', 'category', 'description'],
    });
  }

  createPositionProfile(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createResource('positionProfile', data, actor, {
      label: 'Position profile',
      eventType: 'ORG_POSITION_PROFILE_CREATED',
      allowedFields: [
        'positionTemplateId',
        'label',
        'rankId',
        'rankLevelId',
        'progressionMode',
        'defaultSalaryGradeId',
      ],
      requiredFields: ['positionTemplateId', 'label', 'progressionMode'],
    });
  }

  updatePositionProfile(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource('positionProfile', id, data, actor, {
      label: 'Position profile',
      eventType: 'ORG_POSITION_PROFILE_UPDATED',
      allowedFields: [
        'positionTemplateId',
        'label',
        'rankId',
        'rankLevelId',
        'progressionMode',
        'defaultSalaryGradeId',
      ],
    });
  }

  createPositionSubLevel(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createResource('positionSubLevel', data, actor, {
      label: 'Position sub level',
      eventType: 'ORG_POSITION_SUB_LEVEL_CREATED',
      allowedFields: [
        'positionProfileId',
        'name',
        'sortOrder',
        'salaryGradeId',
      ],
      requiredFields: ['positionProfileId', 'name', 'sortOrder'],
    });
  }

  updatePositionSubLevel(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource('positionSubLevel', id, data, actor, {
      label: 'Position sub level',
      eventType: 'ORG_POSITION_SUB_LEVEL_UPDATED',
      allowedFields: [
        'positionProfileId',
        'name',
        'sortOrder',
        'salaryGradeId',
      ],
    });
  }

  createPosition(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createResource('position', data, actor, {
      label: 'Position',
      eventType: 'ORG_POSITION_CREATED',
      allowedFields: [
        'orgUnitId',
        'positionProfileId',
        'positionSubLevelId',
        'salaryGradeId',
        'salaryGradeStepId',
        'supervisorPositionId',
        'title',
        'employmentStatus',
        'defaultBasePay',
        'plannedHeadcount',
        'fte',
      ],
      requiredFields: [
        'orgUnitId',
        'positionProfileId',
        'title',
        'employmentStatus',
        'defaultBasePay',
        'fte',
      ],
    });
  }

  updatePosition(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource('position', id, data, actor, {
      label: 'Position',
      eventType: 'ORG_POSITION_UPDATED',
      allowedFields: [
        'orgUnitId',
        'positionProfileId',
        'positionSubLevelId',
        'salaryGradeId',
        'salaryGradeStepId',
        'supervisorPositionId',
        'title',
        'employmentStatus',
        'defaultBasePay',
        'plannedHeadcount',
        'fte',
      ],
    });
  }

  async updatePositionSupervisor(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const supervisorPositionId =
      data.supervisorPositionId === null
        ? null
        : this.readPositiveInteger(
            data.supervisorPositionId,
            'supervisorPositionId',
          );

    if (supervisorPositionId === id) {
      throw new BadRequestException('A position cannot supervise itself.');
    }

    const requestActor = requireActor(actor);
    const record = await this.prisma.$transaction(async (tx) => {
      await assertRecordExists(
        tx.position as unknown as WriteDelegate,
        id,
        'Position',
      );

      if (supervisorPositionId) {
        await assertRecordExists(
          tx.position as unknown as WriteDelegate,
          supervisorPositionId,
          'Supervisor position',
        );
        await this.assertNoSupervisorCycle(tx, id, supervisorPositionId);
      }

      const saved = await tx.position.update({
        where: { id },
        data: { supervisorPositionId, updatedBy: requestActor.backendUserId },
      });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'ORG_POSITION_SUPERVISOR_UPDATED',
        'Position',
        id,
        { supervisorPositionId },
      );

      return saved;
    });

    return this.project('position', record, requestActor);
  }

  async assignOrgUnitHeadPosition(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const headPositionId =
      data.headPositionId === null
        ? null
        : this.readPositiveInteger(data.headPositionId, 'headPositionId');
    const requestActor = requireActor(actor);

    const record = await this.prisma.$transaction(async (tx) => {
      await assertRecordExists(
        tx.orgUnit as unknown as WriteDelegate,
        id,
        'Org unit',
      );

      if (headPositionId) {
        const position = await tx.position.findUnique({
          where: { id: headPositionId },
        });
        if (!position) {
          throw new NotFoundException(
            `Position ${headPositionId} was not found.`,
          );
        }
        if (position.orgUnitId !== id) {
          throw new BadRequestException(
            'Head position must belong to the org unit it heads.',
          );
        }
      }

      const saved = await tx.orgUnit.update({
        where: { id },
        data: { headPositionId, updatedBy: requestActor.backendUserId },
      });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'ORG_UNIT_HEAD_POSITION_UPDATED',
        'OrgUnit',
        id,
        { headPositionId },
      );

      return saved;
    });

    return this.project('orgUnit', record, requestActor);
  }

  async findPositionHeadcountSummary(
    query: Record<string, string | string[] | undefined>,
  ) {
    const asOf = this.readDate(query.date, 'date', new Date());
    const orgUnitId = query.orgUnitId
      ? this.readPositiveInteger(
          Array.isArray(query.orgUnitId) ? query.orgUnitId[0] : query.orgUnitId,
          'orgUnitId',
        )
      : undefined;
    const positions = await this.prisma.position.findMany({
      where: orgUnitId ? { orgUnitId } : undefined,
      orderBy: { id: 'asc' },
    });
    const assignments = await this.prisma.positionAssignment.findMany({
      where: {
        positionId: { in: positions.map((position) => position.id) },
        startDate: { lte: asOf },
        OR: [{ endDate: null }, { endDate: { gte: asOf } }],
      },
    });
    const assignmentsByPositionId = new Map<number, typeof assignments>();
    for (const assignment of assignments) {
      assignmentsByPositionId.set(assignment.positionId, [
        ...(assignmentsByPositionId.get(assignment.positionId) ?? []),
        assignment,
      ]);
    }

    return {
      asOf: asOf.toISOString(),
      data: positions.map((position) => {
        const positionAssignments =
          assignmentsByPositionId.get(position.id) ?? [];
        const assignedFte = positionAssignments.reduce(
          (total, assignment) => total + this.decimalToNumber(assignment.fte),
          0,
        );
        const positionFte = this.decimalToNumber(position.fte);
        const capacityFte = positionFte * position.plannedHeadcount;

        return {
          positionId: position.id,
          orgUnitId: position.orgUnitId,
          title: position.title,
          plannedHeadcount: position.plannedHeadcount,
          assignedHeadcount: positionAssignments.length,
          vacancyHeadcount: Math.max(
            0,
            position.plannedHeadcount - positionAssignments.length,
          ),
          positionFte,
          capacityFte,
          assignedFte,
          vacancyFte: Math.max(0, capacityFte - assignedFte),
        };
      }),
    };
  }

  async createPositionAssignment(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'startDate', 'endDate');
    await this.assertAssignmentFteCapacity(data);

    return this.createResource('positionAssignment', data, actor, {
      label: 'Position assignment',
      eventType: 'ORG_POSITION_ASSIGNMENT_CREATED',
      allowedFields: [
        'positionId',
        'employeeId',
        'startDate',
        'endDate',
        'assignmentType',
        'fte',
      ],
      requiredFields: ['positionId', 'startDate', 'assignmentType', 'fte'],
    });
  }

  async updatePositionAssignment(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'startDate', 'endDate');
    const requestActor = requireActor(actor);
    const expectedVersion =
      data.version === undefined
        ? undefined
        : this.readPositiveInteger(data.version, 'version');
    const payload = pickDefinedFields(data, [
      'positionId',
      'employeeId',
      'startDate',
      'endDate',
      'assignmentType',
      'fte',
    ]);
    assertNonEmptyPayload(payload);

    const record = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.positionAssignment.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Position assignment ${id} was not found.`);
      }

      if (
        expectedVersion !== undefined &&
        existing.version !== expectedVersion
      ) {
        throw new ConflictException(
          `Position assignment ${id} was changed by another request.`,
        );
      }

      await this.assertAssignmentFteCapacity(
        { ...existing, ...payload },
        id,
        tx,
      );

      const saved = await tx.positionAssignment.update({
        where: { id },
        data: {
          ...payload,
          version: { increment: 1 },
          updatedBy: requestActor.backendUserId,
        },
      });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'ORG_POSITION_ASSIGNMENT_UPDATED',
        'PositionAssignment',
        saved.id,
      );

      return saved;
    });

    return this.project('positionAssignment', record, requestActor);
  }

  endPositionAssignment(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateResource(
      'positionAssignment',
      id,
      { endDate: data.endDate },
      actor,
      {
        label: 'Position assignment',
        eventType: 'ORG_POSITION_ASSIGNMENT_ENDED',
        allowedFields: ['endDate'],
        requiredFields: ['endDate'],
      },
    );
  }

  deleteHierarchyLevel(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.deleteResourceWhenUnused(
      'hierarchyLevel',
      'Hierarchy level',
      id,
      actor,
      'ORG_HIERARCHY_LEVEL_DELETED',
      [
        {
          model: 'orgUnit',
          where: { hierarchyLevelId: id },
          label: 'org units',
        },
        {
          model: 'orgUnitVersion',
          where: { hierarchyLevelId: id },
          label: 'org unit versions',
        },
      ],
    );
  }

  async deleteOrgUnit(id: number, actor: AuthenticatedRequestUser | undefined) {
    const requestActor = requireActor(actor);

    const result = await this.prisma.$transaction(async (tx) => {
      const root = await tx.orgUnit.findUnique({ where: { id } });
      if (!root) {
        throw new NotFoundException(`Org unit ${id} was not found.`);
      }

      const closureRows = await tx.orgUnitClosure.findMany({
        where: { ancestorOrgUnitId: id },
        orderBy: { depth: 'desc' },
      });
      const subtreeIds = closureRows.length
        ? closureRows.map((row) => row.descendantOrgUnitId)
        : [id];

      await this.assertNoReferences(tx, [
        {
          model: 'position',
          where: { orgUnitId: { in: subtreeIds } },
          label: 'positions',
        },
        {
          model: 'companyProfile',
          where: { rootOrgUnitId: { in: subtreeIds } },
          label: 'company profiles',
        },
      ]);

      await tx.orgUnitVersion.deleteMany({
        where: { orgUnitId: { in: subtreeIds } },
      });
      await tx.orgUnitClosure.deleteMany({
        where: {
          OR: [
            { ancestorOrgUnitId: { in: subtreeIds } },
            { descendantOrgUnitId: { in: subtreeIds } },
          ],
        },
      });

      for (const orgUnitId of [...subtreeIds].reverse()) {
        await tx.orgUnit.delete({ where: { id: orgUnitId } });
      }

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'ORG_UNIT_DELETED',
        'OrgUnit',
        id,
        { deletedOrgUnitIds: subtreeIds },
      );

      return { deletedOrgUnitIds: subtreeIds };
    });

    return result;
  }

  deleteRank(id: number, actor: AuthenticatedRequestUser | undefined) {
    return this.deleteResourceWhenUnused(
      'rank',
      'Rank',
      id,
      actor,
      'ORG_RANK_DELETED',
      [
        { model: 'rankLevel', where: { rankId: id }, label: 'rank levels' },
        {
          model: 'positionProfile',
          where: { rankId: id },
          label: 'position profiles',
        },
      ],
    );
  }

  deleteRankLevel(id: number, actor: AuthenticatedRequestUser | undefined) {
    return this.deleteResourceWhenUnused(
      'rankLevel',
      'Rank level',
      id,
      actor,
      'ORG_RANK_LEVEL_DELETED',
      [
        {
          model: 'positionProfile',
          where: { rankLevelId: id },
          label: 'position profiles',
        },
      ],
    );
  }

  deletePositionTemplate(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.deleteResourceWhenUnused(
      'positionTemplate',
      'Position template',
      id,
      actor,
      'ORG_POSITION_TEMPLATE_DELETED',
      [
        {
          model: 'positionProfile',
          where: { positionTemplateId: id },
          label: 'position profiles',
        },
      ],
    );
  }

  deletePositionProfile(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.deleteResourceWhenUnused(
      'positionProfile',
      'Position profile',
      id,
      actor,
      'ORG_POSITION_PROFILE_DELETED',
      [
        {
          model: 'positionSubLevel',
          where: { positionProfileId: id },
          label: 'position sub levels',
        },
        {
          model: 'position',
          where: { positionProfileId: id },
          label: 'positions',
        },
      ],
    );
  }

  deletePositionSubLevel(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.deleteResourceWhenUnused(
      'positionSubLevel',
      'Position sub level',
      id,
      actor,
      'ORG_POSITION_SUB_LEVEL_DELETED',
      [
        {
          model: 'position',
          where: { positionSubLevelId: id },
          label: 'positions',
        },
      ],
    );
  }

  deletePosition(id: number, actor: AuthenticatedRequestUser | undefined) {
    return this.deleteResourceWhenUnused(
      'position',
      'Position',
      id,
      actor,
      'ORG_POSITION_DELETED',
      [
        {
          model: 'positionAssignment',
          where: { positionId: id },
          label: 'position assignments',
        },
        {
          model: 'position',
          where: { supervisorPositionId: id },
          label: 'subordinate positions',
        },
        {
          model: 'orgUnit',
          where: { headPositionId: id },
          label: 'headed org units',
        },
        {
          model: 'orgUnitVersion',
          where: { headPositionId: id },
          label: 'headed org unit versions',
        },
        {
          model: 'approverSequence',
          where: { approverPositionId: id },
          label: 'approval sequences',
        },
        {
          model: 'approvalSequenceSecondaryApprover',
          where: { positionId: id },
          label: 'secondary approval sequences',
        },
      ],
    );
  }

  private readBooleanStatus(data: WritePayload): boolean {
    const value = data.isActive ?? data.active ?? data.status;

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['active', 'true', '1', 'yes'].includes(normalized)) {
        return true;
      }
      if (
        ['inactive', 'deactivated', 'false', '0', 'no'].includes(normalized)
      ) {
        return false;
      }
    }

    throw new BadRequestException(
      'Status must be active/inactive or isActive must be a boolean.',
    );
  }

  private readPositiveInteger(value: unknown, field: string): number {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException(`${field} must be a positive integer.`);
    }

    return parsed;
  }

  private readDate(value: unknown, field: string, fallback?: Date): Date {
    let candidate: unknown = value;
    if (Array.isArray(value)) {
      candidate = value[0] as unknown;
    }

    if (candidate === undefined || candidate === null || candidate === '') {
      if (fallback) {
        return fallback;
      }
      throw new BadRequestException(`${field} is required.`);
    }

    const date =
      candidate instanceof Date
        ? candidate
        : typeof candidate === 'string' || typeof candidate === 'number'
          ? new Date(candidate)
          : undefined;
    if (!date) {
      throw new BadRequestException(`${field} must be a valid date.`);
    }
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${field} must be a valid date.`);
    }

    return date;
  }

  private readString(value: unknown, field: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestException(`${field} must be a string.`);
    }

    return value;
  }

  private decimalToNumber(value: unknown): number {
    return Number(value?.toString() ?? 0);
  }

  private collectSubtreeIds(
    rootId: number,
    childrenByParentId: Map<number | null, number[]>,
  ): number[] {
    const result: number[] = [];
    const stack = [rootId];

    while (stack.length > 0) {
      const currentId = stack.pop() as number;
      result.push(currentId);
      stack.push(...(childrenByParentId.get(currentId) ?? []));
    }

    return result;
  }

  private buildClosureRowsForOrgUnit(
    orgUnitId: number,
    parentById: Map<number, number | null>,
    actorUserId: number,
  ) {
    const rows = [
      {
        ancestorOrgUnitId: orgUnitId,
        descendantOrgUnitId: orgUnitId,
        depth: 0,
        createdBy: actorUserId,
        updatedBy: actorUserId,
      },
    ];
    const visited = new Set<number>([orgUnitId]);
    let parentId = parentById.get(orgUnitId) ?? null;
    let depth = 1;

    while (parentId) {
      if (visited.has(parentId)) {
        throw new BadRequestException('Org unit hierarchy contains a cycle.');
      }

      rows.push({
        ancestorOrgUnitId: parentId,
        descendantOrgUnitId: orgUnitId,
        depth,
        createdBy: actorUserId,
        updatedBy: actorUserId,
      });
      visited.add(parentId);
      parentId = parentById.get(parentId) ?? null;
      depth += 1;
    }

    return rows;
  }

  private async createCurrentOrgUnitVersion(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const payload = pickDefinedFields(data, [
      'orgUnitId',
      'parentOrgUnitId',
      'hierarchyLevelId',
      'headPositionId',
      'name',
      'effectiveStartDate',
      'effectiveEndDate',
      'isCurrent',
      'changeReason',
    ]);
    assertRequiredFields(
      payload,
      ['orgUnitId', 'hierarchyLevelId', 'name', 'effectiveStartDate'],
      'Org unit version',
    );

    const record = await this.prisma.$transaction(async (tx) => {
      const isCurrent =
        payload.isCurrent === undefined ? true : payload.isCurrent === true;
      const changeReason = payload.changeReason;
      const versionData = {
        orgUnitId: this.readPositiveInteger(payload.orgUnitId, 'orgUnitId'),
        parentOrgUnitId:
          payload.parentOrgUnitId === undefined ||
          payload.parentOrgUnitId === null
            ? null
            : this.readPositiveInteger(
                payload.parentOrgUnitId,
                'parentOrgUnitId',
              ),
        hierarchyLevelId: this.readPositiveInteger(
          payload.hierarchyLevelId,
          'hierarchyLevelId',
        ),
        headPositionId:
          payload.headPositionId === undefined ||
          payload.headPositionId === null
            ? null
            : this.readPositiveInteger(
                payload.headPositionId,
                'headPositionId',
              ),
        name: String(payload.name),
        effectiveStartDate: this.readDate(
          payload.effectiveStartDate,
          'effectiveStartDate',
        ),
        effectiveEndDate:
          payload.effectiveEndDate === undefined ||
          payload.effectiveEndDate === null
            ? null
            : this.readDate(payload.effectiveEndDate, 'effectiveEndDate'),
        isCurrent,
        changeReason:
          changeReason === undefined || changeReason === null
            ? null
            : this.readString(changeReason, 'changeReason'),
        createdBy: requestActor.backendUserId,
        updatedBy: requestActor.backendUserId,
      };

      if (isCurrent) {
        await tx.orgUnitVersion.updateMany({
          where: { orgUnitId: versionData.orgUnitId, isCurrent: true },
          data: {
            isCurrent: false,
            updatedBy: requestActor.backendUserId,
          },
        });
      }

      const saved = await tx.orgUnitVersion.create({
        data: versionData,
      });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'ORG_UNIT_VERSION_CREATED',
        'OrgUnitVersion',
        saved.id,
      );

      return saved;
    });

    return this.project('orgUnitVersion', record, requestActor);
  }

  private async assertNoSupervisorCycle(
    tx: Prisma.TransactionClient,
    positionId: number,
    supervisorPositionId: number,
  ): Promise<void> {
    let currentId: number | null = supervisorPositionId;
    const visited = new Set<number>();

    while (currentId) {
      if (currentId === positionId) {
        throw new BadRequestException(
          'Supervisor assignment would create a reporting cycle.',
        );
      }

      if (visited.has(currentId)) {
        throw new BadRequestException(
          'Position supervision already contains a cycle.',
        );
      }

      visited.add(currentId);
      const current: { supervisorPositionId: number | null } | null =
        await tx.position.findUnique({
          where: { id: currentId },
          select: { supervisorPositionId: true },
        });
      currentId = current?.supervisorPositionId ?? null;
    }
  }

  private async assertAssignmentFteCapacity(
    data: WritePayload,
    excludeAssignmentId?: number,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    const positionId = this.readPositiveInteger(data.positionId, 'positionId');
    const assignmentFte = Number(data.fte);
    if (!Number.isFinite(assignmentFte) || assignmentFte <= 0) {
      throw new BadRequestException('fte must be greater than zero.');
    }

    const startDate = this.readDate(data.startDate, 'startDate');
    const endDate =
      data.endDate === null || data.endDate === undefined
        ? null
        : this.readDate(data.endDate, 'endDate');
    const position = await tx.position.findUnique({
      where: { id: positionId },
    });
    if (!position) {
      throw new NotFoundException(`Position ${positionId} was not found.`);
    }

    const overlappingAssignments = await tx.positionAssignment.findMany({
      where: {
        positionId,
        ...(excludeAssignmentId ? { id: { not: excludeAssignmentId } } : {}),
        startDate: endDate ? { lte: endDate } : undefined,
        OR: [{ endDate: null }, { endDate: { gte: startDate } }],
      },
    });
    const assignedFte = overlappingAssignments.reduce(
      (total, assignment) => total + this.decimalToNumber(assignment.fte),
      0,
    );
    const capacityFte =
      this.decimalToNumber(position.fte) * position.plannedHeadcount;

    if (assignedFte + assignmentFte > capacityFte) {
      throw new BadRequestException(
        `Assigned FTE would exceed position capacity (${capacityFte}).`,
      );
    }
  }

  private async assertNoReferences(
    tx: Prisma.TransactionClient,
    checks: readonly ReferenceCheck[],
  ): Promise<void> {
    for (const check of checks) {
      const count = await this.getCountDeleteDelegate(tx, check.model).count({
        where: check.where,
      });
      if (count > 0) {
        throw new BadRequestException(
          `Cannot delete record while it is used by ${check.label}.`,
        );
      }
    }
  }

  private async deleteResourceWhenUnused(
    model: ReadModelName,
    entityType: string,
    id: number,
    actor: AuthenticatedRequestUser | undefined,
    eventType: string,
    referenceChecks: readonly ReferenceCheck[],
  ) {
    const requestActor = requireActor(actor);

    await this.prisma.$transaction(async (tx) => {
      const delegate = this.getDelegate(tx, model);
      await assertRecordExists(delegate, id, entityType);
      await this.assertNoReferences(tx, referenceChecks);
      await this.getCountDeleteDelegate(tx, model).delete({ where: { id } });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        eventType,
        entityType,
        id,
      );
    });

    return { id, deleted: true };
  }

  private async createResource(
    model: ReadModelName,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
    options: WriteResourceOptions,
  ) {
    const requestActor = requireActor(actor);
    const payload = pickDefinedFields(data, options.allowedFields);
    assertRequiredFields(payload, options.requiredFields ?? [], options.label);

    const record = await this.prisma.$transaction(async (tx) => {
      const saved = (await this.getDelegate(tx, model).create({
        data: {
          ...payload,
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
      })) as { id: number; parentOrgUnitId?: number | null };

      if (options.afterCreate) {
        await options.afterCreate(tx, saved, requestActor);
      }

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        options.eventType,
        readModelLabel(model),
        saved.id,
      );

      return saved;
    });

    return this.project(model, record, requestActor);
  }

  private async updateResource(
    model: ReadModelName,
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
    options: WriteResourceOptions,
  ) {
    const requestActor = requireActor(actor);
    const payload = pickDefinedFields(data, options.allowedFields);
    assertRequiredFields(payload, options.requiredFields ?? [], options.label);
    assertNonEmptyPayload(payload);

    const record = await this.prisma.$transaction(async (tx) => {
      const delegate = this.getDelegate(tx, model);
      await assertRecordExists(delegate, id, options.label);
      const saved = (await delegate.update({
        where: { id },
        data: {
          ...payload,
          updatedBy: requestActor.backendUserId,
        },
      })) as { id: number };

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        options.eventType,
        readModelLabel(model),
        saved.id,
      );

      return saved;
    });

    return this.project(model, record, requestActor);
  }

  private getDelegate(
    tx: Prisma.TransactionClient,
    model: ReadModelName,
  ): WriteDelegate {
    return tx[model] as unknown as WriteDelegate;
  }

  private getCountDeleteDelegate(
    tx: Prisma.TransactionClient,
    model: ReadModelName,
  ): CountDeleteDelegate {
    return tx[model] as unknown as CountDeleteDelegate;
  }

  private project(
    model: ReadModelName,
    record: unknown,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return projectApiRecord(model, record, actor);
  }

  private async rebuildClosureRows(
    tx: Prisma.TransactionClient,
    orgUnitId: number,
    parentOrgUnitId: number | null | undefined,
    actorUserId: number,
  ): Promise<void> {
    await tx.orgUnitClosure.create({
      data: {
        ancestorOrgUnitId: orgUnitId,
        descendantOrgUnitId: orgUnitId,
        depth: 0,
        createdBy: actorUserId,
        updatedBy: actorUserId,
      },
    });

    if (!parentOrgUnitId) {
      return;
    }

    const parentAncestors = await tx.orgUnitClosure.findMany({
      where: { descendantOrgUnitId: parentOrgUnitId },
      orderBy: { depth: 'asc' },
    });

    await tx.orgUnitClosure.createMany({
      data: parentAncestors.map((ancestor) => ({
        ancestorOrgUnitId: ancestor.ancestorOrgUnitId,
        descendantOrgUnitId: orgUnitId,
        depth: ancestor.depth + 1,
        createdBy: actorUserId,
        updatedBy: actorUserId,
      })),
      skipDuplicates: true,
    });
  }
}

interface WriteResourceOptions {
  readonly label: string;
  readonly eventType: string;
  readonly allowedFields: readonly string[];
  readonly requiredFields?: readonly string[];
  readonly afterCreate?: (
    tx: Prisma.TransactionClient,
    record: { id: number; parentOrgUnitId?: number | null },
    actor: AuthenticatedRequestUser,
  ) => Promise<void>;
}

interface ReferenceCheck {
  readonly model: ReadModelName;
  readonly where: Record<string, unknown>;
  readonly label: string;
}

interface CountDeleteDelegate {
  count(args: { where: Record<string, unknown> }): Promise<number>;
  delete(args: { where: { id: number } }): Promise<unknown>;
}
