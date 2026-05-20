import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import {
  assertNonEmptyPayload,
  assertRecordExists,
  assertRequiredFields,
  auditWrite,
  pickDefinedFields,
  requireActor,
  type WriteDelegate,
  type WritePayload,
} from '../../common/api/domain-write.helpers';
import type { ReadModelName } from '../../common/api/read-resource.types';
import { projectApiRecord } from '../../common/api/response-projection';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PHASE1_STATUS } from '../../common/constants/domain-status.constants';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  createRole(data: WritePayload, actor: AuthenticatedRequestUser | undefined) {
    return this.createRecord('role', 'Role', data, actor, {
      eventType: 'RBAC_ROLE_CREATED',
      allowedFields: ['code', 'name', 'description', 'status'],
      requiredFields: ['code', 'name'],
    });
  }

  updateRole(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord('role', 'Role', id, data, actor, {
      eventType: 'RBAC_ROLE_UPDATED',
      allowedFields: ['code', 'name', 'description', 'status'],
    });
  }

  createPermission(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord('permission', 'Permission', data, actor, {
      eventType: 'RBAC_PERMISSION_CREATED',
      allowedFields: ['code', 'name', 'description', 'status'],
      requiredFields: ['code', 'name'],
    });
  }

  updatePermission(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord('permission', 'Permission', id, data, actor, {
      eventType: 'RBAC_PERMISSION_UPDATED',
      allowedFields: ['code', 'name', 'description', 'status'],
    });
  }

  createSystemModule(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord('systemModule', 'SystemModule', data, actor, {
      eventType: 'RBAC_SYSTEM_MODULE_CREATED',
      allowedFields: ['code', 'name', 'description', 'sortOrder', 'isActive'],
      requiredFields: ['code', 'name'],
    });
  }

  updateSystemModule(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord('systemModule', 'SystemModule', id, data, actor, {
      eventType: 'RBAC_SYSTEM_MODULE_UPDATED',
      allowedFields: ['code', 'name', 'description', 'sortOrder', 'isActive'],
    });
  }

  async assignRole(
    userId: number,
    roleId: number,
    isPrimary: boolean | undefined,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const assignment = await this.prisma.$transaction(async (tx) => {
      if (isPrimary === true) {
        await tx.userRoleAssignment.updateMany({
          where: { userId, isActive: true },
          data: { isPrimary: false, updatedBy: requestActor.backendUserId },
        });
      }

      const savedAssignment = await tx.userRoleAssignment.upsert({
        where: { userId_roleId: { userId, roleId } },
        create: {
          userId,
          roleId,
          isActive: true,
          isPrimary: isPrimary ?? false,
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
        update: {
          isActive: true,
          isPrimary: isPrimary ?? false,
          updatedBy: requestActor.backendUserId,
        },
      });

      await tx.auditEvent.create({
        data: {
          actorUserId: requestActor.backendUserId,
          eventType: 'RBAC_USER_ROLE_ASSIGNED',
          entityType: 'UserRoleAssignment',
          entityId: String(savedAssignment.id),
          metadataJson: { userId, roleId },
        },
      });

      return savedAssignment;
    });

    return projectApiRecord('userRoleAssignment', assignment, requestActor);
  }

  async assignPermission(
    roleId: number,
    permissionId: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const assignment = await this.prisma.$transaction(async (tx) => {
      const savedAssignment = await tx.rolePermissionAssignment.create({
        data: {
          roleId,
          permissionId,
          isActive: true,
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
      });

      await tx.auditEvent.create({
        data: {
          actorUserId: requestActor.backendUserId,
          eventType: 'RBAC_ROLE_PERMISSION_ASSIGNED',
          entityType: 'RolePermissionAssignment',
          entityId: String(savedAssignment.id),
          metadataJson: { roleId, permissionId },
        },
      });

      return savedAssignment;
    });

    return projectApiRecord(
      'rolePermissionAssignment',
      assignment,
      requestActor,
    );
  }

  async revokeRole(
    userId: number,
    roleId: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const assignment = await this.prisma.$transaction(async (tx) => {
      const savedAssignment = await tx.userRoleAssignment.update({
        where: { userId_roleId: { userId, roleId } },
        data: {
          isActive: false,
          isPrimary: false,
          updatedBy: requestActor.backendUserId,
        },
      });

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'RBAC_USER_ROLE_REVOKED',
        'UserRoleAssignment',
        savedAssignment.id,
        { userId, roleId },
      );

      return savedAssignment;
    });

    return projectApiRecord('userRoleAssignment', assignment, requestActor);
  }

  async revokePermission(
    roleId: number,
    permissionId: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const assignment = await this.prisma.$transaction(async (tx) => {
      const savedAssignment = await tx.rolePermissionAssignment.updateMany({
        where: { roleId, permissionId, isActive: true },
        data: {
          isActive: false,
          updatedBy: requestActor.backendUserId,
        },
      });

      await tx.auditEvent.create({
        data: {
          actorUserId: requestActor.backendUserId,
          eventType: 'RBAC_ROLE_PERMISSION_REVOKED',
          entityType: 'RolePermissionAssignment',
          entityId: `${roleId}:${permissionId}`,
          metadataJson: { roleId, permissionId },
        },
      });

      return savedAssignment;
    });

    return assignment;
  }

  revokeSession(id: number, actor: AuthenticatedRequestUser | undefined) {
    return this.updateRecord('userSession', 'UserSession', id, {}, actor, {
      eventType: 'RBAC_USER_SESSION_REVOKED',
      allowedFields: [],
      forcedFields: {
        status: PHASE1_STATUS.REVOKED,
        revokedAt: new Date(),
      },
    });
  }

  private async createRecord(
    model: ReadModelName,
    entityType: string,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
    options: WriteOptions,
  ) {
    const requestActor = requireActor(actor);
    const payload = {
      ...pickDefinedFields(data, options.allowedFields),
      ...(options.forcedFields ?? {}),
    };
    assertRequiredFields(payload, options.requiredFields ?? [], entityType);

    const record = await this.prisma.$transaction(async (tx) => {
      const saved = (await this.getDelegate(tx, model).create({
        data: {
          ...payload,
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
      })) as { id: number };

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        options.eventType,
        entityType,
        saved.id,
      );

      return saved;
    });

    return projectApiRecord(model, record, requestActor);
  }

  private async updateRecord(
    model: ReadModelName,
    entityType: string,
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
    options: WriteOptions,
  ) {
    const requestActor = requireActor(actor);
    const payload = {
      ...pickDefinedFields(data, options.allowedFields),
      ...(options.forcedFields ?? {}),
    };
    assertNonEmptyPayload(payload);

    const record = await this.prisma.$transaction(async (tx) => {
      const delegate = this.getDelegate(tx, model);
      await assertRecordExists(delegate, id, entityType);
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
        entityType,
        saved.id,
      );

      return saved;
    });

    return projectApiRecord(model, record, requestActor);
  }

  private getDelegate(
    tx: Prisma.TransactionClient,
    model: ReadModelName,
  ): WriteDelegate {
    return tx[model] as unknown as WriteDelegate;
  }
}

interface WriteOptions {
  readonly eventType: string;
  readonly allowedFields: readonly string[];
  readonly requiredFields?: readonly string[];
  readonly forcedFields?: WritePayload;
}
