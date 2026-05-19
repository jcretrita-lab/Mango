import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
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
  },
  hierarchyLevels: {
    model: 'hierarchyLevel',
    label: 'Hierarchy level',
    readPermission: PERMISSION_CODES.ORG_READ,
  },
  orgUnits: {
    model: 'orgUnit',
    label: 'Org unit',
    readPermission: PERMISSION_CODES.ORG_READ,
  },
  orgUnitClosures: {
    model: 'orgUnitClosure',
    label: 'Org unit closure row',
    readPermission: PERMISSION_CODES.ORG_READ,
  },
  orgUnitVersions: {
    model: 'orgUnitVersion',
    label: 'Org unit version',
    readPermission: PERMISSION_CODES.ORG_READ,
  },
  sites: {
    model: 'site',
    label: 'Site',
    readPermission: PERMISSION_CODES.ORG_READ,
  },
  ranks: {
    model: 'rank',
    label: 'Rank',
    readPermission: PERMISSION_CODES.ORG_READ,
  },
  rankLevels: {
    model: 'rankLevel',
    label: 'Rank level',
    readPermission: PERMISSION_CODES.ORG_READ,
  },
  positionTemplates: {
    model: 'positionTemplate',
    label: 'Position template',
    readPermission: PERMISSION_CODES.ORG_READ,
  },
  positionProfiles: {
    model: 'positionProfile',
    label: 'Position profile',
    readPermission: PERMISSION_CODES.ORG_READ,
  },
  positionSubLevels: {
    model: 'positionSubLevel',
    label: 'Position sub level',
    readPermission: PERMISSION_CODES.ORG_READ,
  },
  positions: {
    model: 'position',
    label: 'Position',
    readPermission: PERMISSION_CODES.ORG_READ,
  },
  positionAssignments: {
    model: 'positionAssignment',
    label: 'Position assignment',
    readPermission: PERMISSION_CODES.ORG_READ,
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

  createPositionAssignment(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'startDate', 'endDate');

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
        'version',
      ],
      requiredFields: ['positionId', 'startDate', 'assignmentType', 'fte'],
    });
  }

  updatePositionAssignment(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'startDate', 'endDate');

    return this.updateResource('positionAssignment', id, data, actor, {
      label: 'Position assignment',
      eventType: 'ORG_POSITION_ASSIGNMENT_UPDATED',
      allowedFields: [
        'positionId',
        'employeeId',
        'startDate',
        'endDate',
        'assignmentType',
        'fte',
        'version',
      ],
    });
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

  private project(
    model: ReadModelName,
    record: unknown,
    actor: AuthenticatedRequestUser,
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
