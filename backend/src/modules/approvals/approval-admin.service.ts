import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  assertDateOrder,
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
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class ApprovalAdminService {
  constructor(private readonly prisma: PrismaService) {}

  createApprovalSetup(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord('approvalSetup', 'ApprovalSetup', data, actor, {
      eventType: 'APPROVAL_SETUP_CREATED',
      allowedFields: [
        'code',
        'name',
        'moduleKey',
        'actionType',
        'description',
        'status',
      ],
      requiredFields: ['code', 'name', 'moduleKey', 'actionType'],
    });
  }

  updateApprovalSetup(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'approvalSetup',
      'ApprovalSetup',
      id,
      data,
      actor,
      {
        eventType: 'APPROVAL_SETUP_UPDATED',
        allowedFields: [
          'code',
          'name',
          'moduleKey',
          'actionType',
          'description',
          'status',
        ],
      },
    );
  }

  createApproverSequence(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    this.assertApproverSource(data);

    return this.createRecord(
      'approverSequence',
      'ApproverSequence',
      data,
      actor,
      {
        eventType: 'APPROVAL_SEQUENCE_CREATED',
        allowedFields: [
          'approvalSetupId',
          'stepNo',
          'name',
          'approverType',
          'approverRoleId',
          'approverUserId',
          'approverPositionId',
          'requiredApprovals',
          'isAutoApproved',
        ],
        requiredFields: ['approvalSetupId', 'stepNo', 'name'],
      },
    );
  }

  updateApproverSequence(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    this.assertApproverSource(data);

    return this.updateRecord(
      'approverSequence',
      'ApproverSequence',
      id,
      data,
      actor,
      {
        eventType: 'APPROVAL_SEQUENCE_UPDATED',
        allowedFields: [
          'stepNo',
          'name',
          'approverType',
          'approverRoleId',
          'approverUserId',
          'approverPositionId',
          'requiredApprovals',
          'isAutoApproved',
        ],
      },
    );
  }

  createDelegation(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'startDate', 'endDate');

    return this.createRecord(
      'approvalDelegation',
      'ApprovalDelegation',
      data,
      actor,
      {
        eventType: 'APPROVAL_DELEGATION_CREATED',
        allowedFields: [
          'fromUserId',
          'toUserId',
          'startDate',
          'endDate',
          'reason',
          'status',
        ],
        requiredFields: ['fromUserId', 'toUserId', 'startDate', 'endDate'],
      },
    );
  }

  updateDelegation(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    assertDateOrder(data, 'startDate', 'endDate');

    return this.updateRecord(
      'approvalDelegation',
      'ApprovalDelegation',
      id,
      data,
      actor,
      {
        eventType: 'APPROVAL_DELEGATION_UPDATED',
        allowedFields: [
          'fromUserId',
          'toUserId',
          'startDate',
          'endDate',
          'reason',
          'status',
        ],
      },
    );
  }

  createWorkflowAssignment(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord(
      'workflowAssignment',
      'WorkflowAssignment',
      data,
      actor,
      {
        eventType: 'APPROVAL_WORKFLOW_ASSIGNMENT_CREATED',
        allowedFields: [
          'scopeType',
          'scopeRefId',
          'approvalSetupId',
          'priority',
          'isActive',
          'notes',
        ],
        requiredFields: ['scopeType', 'approvalSetupId'],
      },
    );
  }

  updateWorkflowAssignment(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.updateRecord(
      'workflowAssignment',
      'WorkflowAssignment',
      id,
      data,
      actor,
      {
        eventType: 'APPROVAL_WORKFLOW_ASSIGNMENT_UPDATED',
        allowedFields: [
          'scopeType',
          'scopeRefId',
          'approvalSetupId',
          'priority',
          'isActive',
          'notes',
        ],
      },
    );
  }

  createWorkflowNote(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.createRecord(
      'approvalWorkflowNote',
      'ApprovalWorkflowNote',
      data,
      actor,
      {
        eventType: 'APPROVAL_WORKFLOW_NOTE_CREATED',
        allowedFields: [
          'approvalWorkflowId',
          'authorUserId',
          'noteType',
          'note',
        ],
        requiredFields: ['approvalWorkflowId', 'noteType', 'note'],
        forcedFields: {
          authorUserId: requireActor(actor).backendUserId,
        },
      },
    );
  }

  private assertApproverSource(data: WritePayload): void {
    const approverType = data.approverType;

    if (!approverType) {
      return;
    }

    const sourceFields = [
      'approverRoleId',
      'approverUserId',
      'approverPositionId',
    ].filter((field) => data[field] !== undefined && data[field] !== null);

    if (sourceFields.length !== 1 && data.isAutoApproved !== true) {
      throw new BadRequestException(
        'A non-auto approval sequence requires exactly one approver source.',
      );
    }
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
    const payload = pickDefinedFields(data, options.allowedFields);
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
