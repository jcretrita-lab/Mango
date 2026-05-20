import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { projectApiRecord } from '../../common/api/response-projection';
import {
  auditWrite,
  requireActor,
  type WritePayload,
} from '../../common/api/domain-write.helpers';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PHASE1_STATUS } from '../../common/constants/domain-status.constants';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { PrismaService } from '../../core/prisma/prisma.service';

const PAF_REFERENCE_TYPE = 'PAF_RECORD';

const PAF_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  VERIFIED: 'VERIFIED',
  APPLIED: 'APPLIED',
  CANCELLED: 'CANCELLED',
} as const;

const terminalStatuses = new Set<string>([
  PAF_STATUS.APPLIED,
  PAF_STATUS.CANCELLED,
]);

interface PafListQuery {
  page?: string | string[];
  limit?: string | string[];
  pageSize?: string | string[];
  search?: string | string[];
  employeeId?: string | string[];
  actionType?: string | string[];
  status?: string | string[];
  effectiveFrom?: string | string[];
  effectiveTo?: string | string[];
}

export interface PafValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  actionType: string;
}

@Injectable()
export class PafRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: PafListQuery,
    actor: AuthenticatedRequestUser | undefined,
    forcedEmployeeId?: number,
  ) {
    const requestActor = this.requireReadActor(actor);
    const page = this.readPage(query.page);
    const limit = this.readLimit(query.limit ?? query.pageSize);
    const where = this.buildPafWhere(query, requestActor, forcedEmployeeId);

    const [records, total] = await Promise.all([
      this.prisma.pafRecord.findMany({
        where,
        orderBy: { id: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.pafRecord.count({ where }),
    ]);

    return {
      data: records.map((record) =>
        projectApiRecord('pafRecord', record, requestActor),
      ),
      total,
      page,
      limit,
    };
  }

  async findMine(
    query: PafListQuery,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const employeeId = this.readActorEmployeeId(requestActor);
    return this.findAll(query, requestActor, employeeId);
  }

  async findOne(id: number, actor: AuthenticatedRequestUser | undefined) {
    const requestActor = this.requireReadActor(actor);
    const record = await this.prisma.pafRecord.findFirst({
      where: this.mergeEmployeeReadScope({ id }, requestActor),
    });

    if (!record) {
      throw new NotFoundException(`PAF record ${id} was not found.`);
    }

    return projectApiRecord('pafRecord', record, requestActor);
  }

  async create(
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const payload = this.readPafPayload(data.payloadJson ?? data.payload);
    const validation = this.validatePayloadShape(
      this.readRequiredString(data.actionType, 'actionType'),
      payload,
    );

    if (!validation.valid) {
      throw new BadRequestException(validation.errors.join(' '));
    }

    const record = await this.prisma.$transaction(async (tx) => {
      const saved = await tx.pafRecord.create({
        data: {
          employeeId: this.readPositiveInteger(data.employeeId, 'employeeId'),
          approvalSetupId: this.readOptionalPositiveInteger(
            data.approvalSetupId,
            'approvalSetupId',
          ),
          approvalRequestId: this.readOptionalPositiveInteger(
            data.approvalRequestId,
            'approvalRequestId',
          ),
          actionType: this.readRequiredString(data.actionType, 'actionType'),
          effectiveDate: this.readDate(data.effectiveDate, 'effectiveDate'),
          payloadJson: payload as Prisma.InputJsonValue,
          status: this.readStatus(data.status, PAF_STATUS.DRAFT),
          submittedAt: this.readOptionalDate(data.submittedAt, 'submittedAt'),
          appliedAt: this.readOptionalDate(data.appliedAt, 'appliedAt'),
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
      });

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_RECORD_CREATED',
        'PafRecord',
        saved.id,
      );

      return saved;
    });

    return projectApiRecord('pafRecord', record, requestActor);
  }

  async update(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const record = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.pafRecord.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`PAF record ${id} was not found.`);
      }
      this.assertEditable(existing.status);

      const updateData = this.pickPafUpdateData(data);
      if (Object.keys(updateData).length === 0) {
        throw new BadRequestException('No supported PAF fields provided.');
      }

      const actionType =
        typeof updateData.actionType === 'string'
          ? updateData.actionType
          : existing.actionType;
      const payload = updateData.payloadJson ?? existing.payloadJson;
      const validation = this.validatePayloadShape(
        actionType,
        this.asRecord(payload),
      );
      if (!validation.valid) {
        throw new BadRequestException(validation.errors.join(' '));
      }

      const saved = await tx.pafRecord.update({
        where: { id },
        data: { ...updateData, updatedBy: requestActor.backendUserId },
      });

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_RECORD_UPDATED',
        'PafRecord',
        id,
      );

      return saved;
    });

    return projectApiRecord('pafRecord', record, requestActor);
  }

  async delete(id: number, actor: AuthenticatedRequestUser | undefined) {
    const requestActor = requireActor(actor);

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.pafRecord.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`PAF record ${id} was not found.`);
      }

      const downstreamCount =
        (await tx.employeeProfileHistory.count({
          where: { pafRecordId: id },
        })) +
        (await tx.employeeLoaRecord.count({ where: { pafRecordId: id } }));

      if (existing.approvalRequestId || downstreamCount > 0) {
        const saved = await tx.pafRecord.update({
          where: { id },
          data: {
            status: PAF_STATUS.CANCELLED,
            updatedBy: requestActor.backendUserId,
          },
        });
        await auditWrite(
          tx.auditEvent,
          requestActor.backendUserId,
          'PAF_RECORD_CANCELLED_BY_DELETE',
          'PafRecord',
          id,
        );

        return { id, deleted: false, status: saved.status };
      }

      await tx.pafRecord.delete({ where: { id } });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_RECORD_DELETED',
        'PafRecord',
        id,
      );

      return { id, deleted: true };
    });
  }

  async submit(id: number, actor: AuthenticatedRequestUser | undefined) {
    const requestActor = requireActor(actor);
    const record = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.pafRecord.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`PAF record ${id} was not found.`);
      }
      this.assertEditable(existing.status);

      const validation = this.validatePayloadShape(
        existing.actionType,
        this.asRecord(existing.payloadJson),
      );
      if (!validation.valid) {
        throw new BadRequestException(validation.errors.join(' '));
      }

      const submittedAt = new Date();
      let approvalRequestId = existing.approvalRequestId;
      let status: string = PAF_STATUS.SUBMITTED;

      if (existing.approvalSetupId) {
        const approvalRequest = await this.ensureSubmittedApprovalRequest(
          tx,
          existing,
          requestActor.backendUserId,
          submittedAt,
        );
        approvalRequestId = approvalRequest.id;
        status = PAF_STATUS.PENDING_APPROVAL;
      }

      const saved = await tx.pafRecord.update({
        where: { id },
        data: {
          approvalRequestId,
          status,
          submittedAt,
          updatedBy: requestActor.backendUserId,
        },
      });

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_RECORD_SUBMITTED',
        'PafRecord',
        id,
      );

      return saved;
    });

    return projectApiRecord('pafRecord', record, requestActor);
  }

  async cancel(id: number, actor: AuthenticatedRequestUser | undefined) {
    const requestActor = requireActor(actor);
    const record = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.pafRecord.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`PAF record ${id} was not found.`);
      }
      if (this.normalizeStatus(existing.status) === PAF_STATUS.APPLIED) {
        throw new BadRequestException(
          'Applied PAF records cannot be cancelled.',
        );
      }

      if (existing.approvalRequestId) {
        await tx.approvalRequest.updateMany({
          where: {
            id: existing.approvalRequestId,
            status: { in: [PHASE1_STATUS.DRAFT, PHASE1_STATUS.PENDING] },
          },
          data: {
            status: PHASE1_STATUS.CANCELLED,
            resolvedAt: new Date(),
            updatedBy: requestActor.backendUserId,
          },
        });
        await tx.approvalWorkflow.updateMany({
          where: {
            approvalRequestId: existing.approvalRequestId,
            status: PHASE1_STATUS.PENDING,
          },
          data: {
            status: PHASE1_STATUS.CANCELLED,
            updatedBy: requestActor.backendUserId,
          },
        });
      }

      const saved = await tx.pafRecord.update({
        where: { id },
        data: {
          status: PAF_STATUS.CANCELLED,
          updatedBy: requestActor.backendUserId,
        },
      });

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_RECORD_CANCELLED',
        'PafRecord',
        id,
      );

      return saved;
    });

    return projectApiRecord('pafRecord', record, requestActor);
  }

  async verify(id: number, actor: AuthenticatedRequestUser | undefined) {
    const requestActor = requireActor(actor);
    const record = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.pafRecord.findUnique({
        where: { id },
        include: { approvalRequest: true },
      });
      if (!existing) {
        throw new NotFoundException(`PAF record ${id} was not found.`);
      }

      const approvalStatus = existing.approvalRequest?.status;
      const pafStatus = this.normalizeStatus(existing.status);
      const canVerify = approvalStatus
        ? approvalStatus === PHASE1_STATUS.APPROVED
        : new Set<string>([PAF_STATUS.APPROVED, PAF_STATUS.VERIFIED]).has(
            pafStatus,
          );
      if (!canVerify) {
        throw new BadRequestException(
          'Only approved PAF records can be verified.',
        );
      }

      const saved = await tx.pafRecord.update({
        where: { id },
        data: {
          status: PAF_STATUS.VERIFIED,
          updatedBy: requestActor.backendUserId,
        },
      });

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_RECORD_VERIFIED',
        'PafRecord',
        id,
      );

      return saved;
    });

    return projectApiRecord('pafRecord', record, requestActor);
  }

  async apply(id: number, actor: AuthenticatedRequestUser | undefined) {
    const requestActor = requireActor(actor);
    const record = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.pafRecord.findUnique({
        where: { id },
        include: { approvalRequest: true },
      });
      if (!existing) {
        throw new NotFoundException(`PAF record ${id} was not found.`);
      }

      const normalized = this.normalizeStatus(existing.status);
      if (
        !new Set<string>([
          PAF_STATUS.APPROVED,
          PAF_STATUS.VERIFIED,
          PAF_STATUS.APPLIED,
        ]).has(normalized)
      ) {
        throw new BadRequestException(
          'Only approved or verified PAF records can be applied.',
        );
      }

      const saved = await tx.pafRecord.update({
        where: { id },
        data: {
          status: PAF_STATUS.APPLIED,
          appliedAt: new Date(),
          updatedBy: requestActor.backendUserId,
        },
      });

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_RECORD_APPLIED',
        'PafRecord',
        id,
      );

      return saved;
    });

    return projectApiRecord('pafRecord', record, requestActor);
  }

  async linkApprovalSetup(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const approvalSetupId = this.readPositiveInteger(
      data.approvalSetupId,
      'approvalSetupId',
    );

    const record = await this.prisma.$transaction(async (tx) => {
      const setup = await tx.approvalSetup.findUnique({
        where: { id: approvalSetupId },
      });
      if (!setup) {
        throw new NotFoundException(
          `Approval setup ${approvalSetupId} was not found.`,
        );
      }

      const saved = await tx.pafRecord.update({
        where: { id },
        data: { approvalSetupId, updatedBy: requestActor.backendUserId },
      });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_RECORD_APPROVAL_SETUP_LINKED',
        'PafRecord',
        id,
      );
      return saved;
    });

    return projectApiRecord('pafRecord', record, requestActor);
  }

  async createApprovalRequest(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const result = await this.prisma.$transaction(async (tx) => {
      const paf = await tx.pafRecord.findUnique({ where: { id } });
      if (!paf) {
        throw new NotFoundException(`PAF record ${id} was not found.`);
      }
      if (paf.approvalRequestId) {
        throw new BadRequestException(
          'PAF record already has an approval request.',
        );
      }

      const approvalSetupId =
        this.readOptionalPositiveInteger(
          data.approvalSetupId,
          'approvalSetupId',
        ) ?? paf.approvalSetupId;
      if (!approvalSetupId) {
        throw new BadRequestException('approvalSetupId is required.');
      }

      const approvalRequest = await tx.approvalRequest.create({
        data: {
          approvalSetupId,
          requestedByUserId: requestActor.backendUserId,
          employeeId: paf.employeeId,
          referenceType: PAF_REFERENCE_TYPE,
          referenceId: paf.id,
          payloadJson: this.buildApprovalPayload(paf),
          status: PHASE1_STATUS.DRAFT,
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
      });

      const saved = await tx.pafRecord.update({
        where: { id },
        data: {
          approvalSetupId,
          approvalRequestId: approvalRequest.id,
          updatedBy: requestActor.backendUserId,
        },
      });

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_APPROVAL_REQUEST_CREATED',
        'PafRecord',
        id,
        { approvalRequestId: approvalRequest.id },
      );

      return { pafRecord: saved, approvalRequest };
    });

    return {
      pafRecord: projectApiRecord('pafRecord', result.pafRecord, requestActor),
      approvalRequest: projectApiRecord(
        'approvalRequest',
        result.approvalRequest,
        requestActor,
      ),
    };
  }

  async getApprovalTrail(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = this.requireReadActor(actor);
    await this.assertReadablePaf(id, requestActor);

    const paf = await this.prisma.pafRecord.findUnique({ where: { id } });
    if (!paf?.approvalRequestId) {
      return { pafRecordId: id, approvalRequest: null, workflows: [] };
    }

    const approvalRequest = await this.prisma.approvalRequest.findUnique({
      where: { id: paf.approvalRequestId },
      include: {
        approvalSetup: true,
        workflows: {
          orderBy: { id: 'asc' },
          include: {
            approverSequence: true,
            workflowNotes: true,
          },
        },
      },
    });

    return { pafRecordId: id, approvalRequest };
  }

  async getPayload(id: number, actor: AuthenticatedRequestUser | undefined) {
    const requestActor = this.requireReadActor(actor);
    const paf = await this.assertReadablePaf(id, requestActor);
    return {
      pafRecordId: id,
      actionType: paf.actionType,
      payloadJson: paf.payloadJson,
    };
  }

  async updatePayload(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);
    const payload = this.readPafPayload(data.payloadJson ?? data.payload);

    const record = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.pafRecord.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`PAF record ${id} was not found.`);
      }
      this.assertEditable(existing.status);
      const validation = this.validatePayloadShape(
        existing.actionType,
        payload,
      );
      if (!validation.valid) {
        throw new BadRequestException(validation.errors.join(' '));
      }

      const saved = await tx.pafRecord.update({
        where: { id },
        data: {
          payloadJson: payload as Prisma.InputJsonValue,
          updatedBy: requestActor.backendUserId,
        },
      });
      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_PAYLOAD_UPDATED',
        'PafRecord',
        id,
      );
      return saved;
    });

    return projectApiRecord('pafRecord', record, requestActor);
  }

  validatePayload(data: WritePayload): PafValidationResult {
    const actionType = this.readRequiredString(data.actionType, 'actionType');
    const payload = this.readPafPayload(data.payloadJson ?? data.payload);
    return this.validatePayloadShape(actionType, payload);
  }

  async getProfileHistories(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = this.requireReadActor(actor);
    await this.assertReadablePaf(id, requestActor);
    const rows = await this.prisma.employeeProfileHistory.findMany({
      where: { pafRecordId: id },
      orderBy: { changedAt: 'asc' },
    });
    return {
      data: rows.map((row) =>
        projectApiRecord('employeeProfileHistory', row, requestActor),
      ),
      total: rows.length,
    };
  }

  async getLoaRecords(id: number, actor: AuthenticatedRequestUser | undefined) {
    const requestActor = this.requireReadActor(actor);
    await this.assertReadablePaf(id, requestActor);
    const rows = await this.prisma.employeeLoaRecord.findMany({
      where: { pafRecordId: id },
      orderBy: { startDate: 'asc' },
    });
    return {
      data: rows.map((row) =>
        projectApiRecord('employeeLoaRecord', row, requestActor),
      ),
      total: rows.length,
    };
  }

  async generateProfileHistory(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const rows = await this.prisma.$transaction(async (tx) => {
      const paf = await tx.pafRecord.findUnique({ where: { id } });
      if (!paf) {
        throw new NotFoundException(`PAF record ${id} was not found.`);
      }

      const entries = this.buildProfileHistoryEntries(paf, data);
      if (entries.length === 0) {
        throw new BadRequestException(
          'No profile history fields could be derived from the PAF payload.',
        );
      }

      const created = [];
      for (const entry of entries) {
        created.push(
          await tx.employeeProfileHistory.create({
            data: {
              ...entry,
              createdBy: requestActor.backendUserId,
              updatedBy: requestActor.backendUserId,
            },
          }),
        );
      }

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_PROFILE_HISTORY_GENERATED',
        'PafRecord',
        id,
        { count: created.length },
      );

      return created;
    });

    return {
      data: rows.map((row) =>
        projectApiRecord('employeeProfileHistory', row, requestActor),
      ),
      total: rows.length,
    };
  }

  async generateLoaRecord(
    id: number,
    data: WritePayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const row = await this.prisma.$transaction(async (tx) => {
      const paf = await tx.pafRecord.findUnique({ where: { id } });
      if (!paf) {
        throw new NotFoundException(`PAF record ${id} was not found.`);
      }
      const payload = { ...this.asRecord(paf.payloadJson), ...data };
      const loaType = this.readRequiredString(payload.loaType, 'loaType');

      const created = await tx.employeeLoaRecord.create({
        data: {
          employeeId: paf.employeeId,
          loaType,
          startDate: this.readDate(
            payload.startDate ?? paf.effectiveDate,
            'startDate',
          ),
          expectedReturnDate: this.readOptionalDate(
            payload.expectedReturnDate,
            'expectedReturnDate',
          ),
          actualReturnDate: this.readOptionalDate(
            payload.actualReturnDate,
            'actualReturnDate',
          ),
          pauseAccruals: this.readBoolean(payload.pauseAccruals, true),
          haltPayrollExpectations: this.readBoolean(
            payload.haltPayrollExpectations,
            true,
          ),
          pafRecordId: id,
          notes: this.readOptionalString(payload.notes ?? payload.remarks),
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
      });

      await auditWrite(
        tx.auditEvent,
        requestActor.backendUserId,
        'PAF_LOA_RECORD_GENERATED',
        'PafRecord',
        id,
        { loaRecordId: created.id },
      );

      return created;
    });

    return projectApiRecord('employeeLoaRecord', row, requestActor);
  }

  async renderPrintDocument(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = this.requireReadActor(actor);
    const paf = await this.assertReadablePaf(id, requestActor);
    const payload = JSON.stringify(paf.payloadJson, null, 2)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>PAF ${paf.id}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
    h1 { font-size: 20px; margin-bottom: 4px; }
    dl { display: grid; grid-template-columns: 180px 1fr; gap: 8px 16px; }
    dt { font-weight: 700; }
    pre { background: #f3f4f6; padding: 16px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Personnel Action Form</h1>
  <dl>
    <dt>PAF ID</dt><dd>${paf.id}</dd>
    <dt>Employee ID</dt><dd>${paf.employeeId}</dd>
    <dt>Action Type</dt><dd>${paf.actionType}</dd>
    <dt>Effective Date</dt><dd>${paf.effectiveDate.toISOString()}</dd>
    <dt>Status</dt><dd>${paf.status}</dd>
  </dl>
  <h2>Payload</h2>
  <pre>${payload}</pre>
</body>
</html>`;
  }

  async renderPdfDocument(
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = this.requireReadActor(actor);
    const paf = await this.assertReadablePaf(id, requestActor);
    const text = [
      'Personnel Action Form',
      `PAF ID: ${paf.id}`,
      `Employee ID: ${paf.employeeId}`,
      `Action Type: ${paf.actionType}`,
      `Effective Date: ${paf.effectiveDate.toISOString().slice(0, 10)}`,
      `Status: ${paf.status}`,
    ].join('\\n');

    return Buffer.from(this.createMinimalPdf(text), 'binary');
  }

  private buildPafWhere(
    query: PafListQuery,
    actor: AuthenticatedRequestUser,
    forcedEmployeeId?: number,
  ): Prisma.PafRecordWhereInput {
    const where: Prisma.PafRecordWhereInput = {};
    const actorScopeEmployeeId = this.employeeScopeId(actor);
    if (
      forcedEmployeeId &&
      actorScopeEmployeeId &&
      forcedEmployeeId !== actorScopeEmployeeId
    ) {
      throw new ForbiddenException(
        'PAF records are outside the current employee scope.',
      );
    }

    const scopedEmployeeId = forcedEmployeeId ?? actorScopeEmployeeId;
    if (scopedEmployeeId) {
      where.employeeId = scopedEmployeeId;
    }

    const employeeId = this.firstValue(query.employeeId);
    if (employeeId && !scopedEmployeeId) {
      where.employeeId = this.readPositiveInteger(employeeId, 'employeeId');
    }

    const actionType = this.firstValue(query.actionType);
    if (actionType) {
      where.actionType = actionType;
    }

    const status = this.firstValue(query.status);
    if (status) {
      where.status = status;
    }

    const effectiveFrom = this.firstValue(query.effectiveFrom);
    const effectiveTo = this.firstValue(query.effectiveTo);
    if (effectiveFrom || effectiveTo) {
      where.effectiveDate = {
        ...(effectiveFrom
          ? { gte: this.readDate(effectiveFrom, 'effectiveFrom') }
          : {}),
        ...(effectiveTo
          ? { lte: this.readDate(effectiveTo, 'effectiveTo') }
          : {}),
      };
    }

    const search = this.firstValue(query.search)?.trim();
    if (search) {
      const or: Prisma.PafRecordWhereInput[] = [
        { actionType: { contains: search, mode: 'insensitive' } },
        { status: { contains: search, mode: 'insensitive' } },
      ];
      if (Number.isInteger(Number(search))) {
        or.push({ id: Number(search) }, { employeeId: Number(search) });
      }
      where.OR = or;
    }

    return where;
  }

  private mergeEmployeeReadScope(
    where: Prisma.PafRecordWhereInput,
    actor: AuthenticatedRequestUser,
  ): Prisma.PafRecordWhereInput {
    const scopedEmployeeId = this.employeeScopeId(actor);
    if (!scopedEmployeeId) {
      return where;
    }
    return { AND: [where, { employeeId: scopedEmployeeId }] };
  }

  private employeeScopeId(actor: AuthenticatedRequestUser): number | undefined {
    if (
      actor.permissions.includes(PERMISSION_CODES.PERSONNEL_SELF_READ) &&
      !actor.permissions.includes(PERMISSION_CODES.PERSONNEL_READ)
    ) {
      return this.readActorEmployeeId(actor);
    }

    return undefined;
  }

  private requireReadActor(
    actor: AuthenticatedRequestUser | undefined,
  ): AuthenticatedRequestUser {
    const requestActor = requireActor(actor);
    if (
      !requestActor.permissions.includes(PERMISSION_CODES.PERSONNEL_READ) &&
      !requestActor.permissions.includes(PERMISSION_CODES.PERSONNEL_SELF_READ)
    ) {
      throw new ForbiddenException(
        'PAF records are outside this session scope.',
      );
    }
    return requestActor;
  }

  private async assertReadablePaf(id: number, actor: AuthenticatedRequestUser) {
    const paf = await this.prisma.pafRecord.findFirst({
      where: this.mergeEmployeeReadScope({ id }, actor),
    });
    if (!paf) {
      throw new NotFoundException(`PAF record ${id} was not found.`);
    }
    return paf;
  }

  private assertEditable(status: string) {
    if (terminalStatuses.has(this.normalizeStatus(status))) {
      throw new BadRequestException(
        'Applied or cancelled PAF records cannot be edited.',
      );
    }
  }

  private async ensureSubmittedApprovalRequest(
    tx: Prisma.TransactionClient,
    paf: {
      id: number;
      employeeId: number;
      approvalSetupId: number | null;
      approvalRequestId: number | null;
      actionType: string;
      effectiveDate: Date;
      payloadJson: Prisma.JsonValue;
    },
    actorUserId: number,
    submittedAt: Date,
  ) {
    if (!paf.approvalSetupId) {
      throw new BadRequestException('approvalSetupId is required.');
    }

    const firstSequence = await tx.approverSequence.findFirst({
      where: { approvalSetupId: paf.approvalSetupId, stepNo: 1 },
      orderBy: { stepNo: 'asc' },
    });
    if (!firstSequence) {
      throw new BadRequestException('Approval setup has no approver sequence.');
    }

    const approvalRequest = paf.approvalRequestId
      ? await tx.approvalRequest.update({
          where: { id: paf.approvalRequestId },
          data: {
            status: PHASE1_STATUS.PENDING,
            submittedAt,
            currentStepNo: 1,
            payloadJson: this.buildApprovalPayload(paf),
            updatedBy: actorUserId,
          },
        })
      : await tx.approvalRequest.create({
          data: {
            approvalSetupId: paf.approvalSetupId,
            requestedByUserId: actorUserId,
            employeeId: paf.employeeId,
            referenceType: PAF_REFERENCE_TYPE,
            referenceId: paf.id,
            payloadJson: this.buildApprovalPayload(paf),
            status: PHASE1_STATUS.PENDING,
            currentStepNo: 1,
            submittedAt,
            createdBy: actorUserId,
            updatedBy: actorUserId,
          },
        });

    await tx.approvalWorkflow.upsert({
      where: {
        approvalRequestId_approverSequenceId: {
          approvalRequestId: approvalRequest.id,
          approverSequenceId: firstSequence.id,
        },
      },
      update: {
        status: PHASE1_STATUS.PENDING,
        approverUserId: firstSequence.approverUserId,
        updatedBy: actorUserId,
      },
      create: {
        approvalRequestId: approvalRequest.id,
        approverSequenceId: firstSequence.id,
        approverUserId: firstSequence.approverUserId,
        status: PHASE1_STATUS.PENDING,
        createdBy: actorUserId,
        updatedBy: actorUserId,
      },
    });

    return approvalRequest;
  }

  private buildApprovalPayload(paf: {
    id: number;
    actionType: string;
    effectiveDate: Date;
    payloadJson: Prisma.JsonValue;
  }): Prisma.InputJsonValue {
    return {
      pafRecordId: paf.id,
      actionType: paf.actionType,
      effectiveDate: paf.effectiveDate.toISOString(),
      payloadJson: paf.payloadJson as Prisma.InputJsonValue,
    };
  }

  private pickPafUpdateData(data: WritePayload): WritePayload {
    const updateData: WritePayload = {};
    if (data.employeeId !== undefined) {
      updateData.employeeId = this.readPositiveInteger(
        data.employeeId,
        'employeeId',
      );
    }
    if (data.approvalSetupId !== undefined) {
      updateData.approvalSetupId = this.readOptionalPositiveInteger(
        data.approvalSetupId,
        'approvalSetupId',
      );
    }
    if (data.approvalRequestId !== undefined) {
      updateData.approvalRequestId = this.readOptionalPositiveInteger(
        data.approvalRequestId,
        'approvalRequestId',
      );
    }
    if (data.actionType !== undefined) {
      updateData.actionType = this.readRequiredString(
        data.actionType,
        'actionType',
      );
    }
    if (data.effectiveDate !== undefined) {
      updateData.effectiveDate = this.readDate(
        data.effectiveDate,
        'effectiveDate',
      );
    }
    if (data.payloadJson !== undefined || data.payload !== undefined) {
      updateData.payloadJson = this.readPafPayload(
        data.payloadJson ?? data.payload,
      ) as Prisma.InputJsonValue;
    }
    if (data.status !== undefined) {
      updateData.status = this.readStatus(data.status, PAF_STATUS.DRAFT);
    }
    return updateData;
  }

  private validatePayloadShape(
    actionType: string,
    payload: Record<string, unknown>,
  ): PafValidationResult {
    const normalized = actionType.trim().toLowerCase();
    const errors: string[] = [];
    const warnings: string[] = [];

    const requireAny = (fields: string[], message: string) => {
      if (!fields.some((field) => payload[field] !== undefined)) {
        errors.push(message);
      }
    };

    if (normalized.includes('regular')) {
      requireAny(
        ['recommendedStatus', 'proposedEmploymentStatus'],
        'Regularization PAF requires recommendedStatus or proposedEmploymentStatus.',
      );
    } else if (normalized.includes('transfer')) {
      requireAny(
        ['toOrgUnitId', 'proposedOrgUnitId'],
        'Transfer PAF requires toOrgUnitId or proposedOrgUnitId.',
      );
    } else if (normalized.includes('promotion')) {
      requireAny(
        ['proposedPositionId', 'proposedRankId', 'proposedRank'],
        'Promotion PAF requires a proposed position or rank.',
      );
    } else if (
      normalized.includes('salary') ||
      normalized.includes('pay') ||
      normalized.includes('compensation')
    ) {
      requireAny(
        ['proposedSalaryGradeId', 'proposedPayTemplateId', 'payComponents'],
        'Salary or pay PAF requires proposed salary grade, pay template, or pay components.',
      );
    } else if (
      normalized.includes('loa') ||
      normalized.includes('leave') ||
      normalized.includes('medical')
    ) {
      requireAny(['loaType'], 'LOA or leave PAF requires loaType.');
    } else if (normalized.includes('separation')) {
      requireAny(
        ['separationReason', 'lastWorkingDate'],
        'Separation PAF requires separationReason or lastWorkingDate.',
      );
    } else if (Object.keys(payload).length === 0) {
      warnings.push('Unknown action type has an empty payload.');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      actionType,
    };
  }

  private buildProfileHistoryEntries(
    paf: {
      id: number;
      employeeId: number;
      actionType: string;
      effectiveDate: Date;
      payloadJson: Prisma.JsonValue;
    },
    data: WritePayload,
  ) {
    if (Array.isArray(data.fields)) {
      return data.fields.map((field) => {
        if (!field || typeof field !== 'object' || Array.isArray(field)) {
          throw new BadRequestException('Each fields item must be an object.');
        }
        const row = field as Record<string, unknown>;
        return {
          employeeId: paf.employeeId,
          fieldName: this.readRequiredString(row.fieldName, 'fieldName'),
          previousValue: this.readOptionalString(row.previousValue),
          newValue: this.readOptionalString(row.newValue),
          effectiveDate: this.readOptionalDate(
            row.effectiveDate ?? paf.effectiveDate,
            'effectiveDate',
          ),
          changeSource: 'PAF',
          pafRecordId: paf.id,
          changeReason: this.readOptionalString(
            row.changeReason ?? row.reason ?? data.changeReason,
          ),
          changedBy: this.readOptionalPositiveInteger(
            row.changedBy,
            'changedBy',
          ),
        };
      });
    }

    const payload = this.asRecord(paf.payloadJson);
    const derivedFieldMap: Record<string, string> = {
      proposedPayTemplate: 'payTemplate',
      proposedPayTemplateId: 'payTemplateId',
      proposedRank: 'rank',
      proposedRankId: 'rankId',
      proposedEmploymentStatus: 'employmentStatus',
      recommendedStatus: 'employmentStatus',
      proposedPosition: 'position',
      proposedPositionId: 'positionId',
      proposedSupervisor: 'supervisor',
      proposedSupervisorPositionId: 'supervisorPositionId',
      proposedDepartmentHead: 'departmentHead',
      proposedCompany: 'company',
      proposedSalaryGradeId: 'salaryGradeId',
      toOrgUnitId: 'orgUnitId',
      proposedOrgUnitId: 'orgUnitId',
    };

    return Object.entries(derivedFieldMap)
      .filter(([payloadField]) => payload[payloadField] !== undefined)
      .map(([payloadField, fieldName]) => ({
        employeeId: paf.employeeId,
        fieldName,
        previousValue: this.readOptionalString(
          payload[`current${this.capitalize(fieldName)}`] ??
            payload[`from${this.capitalize(fieldName)}`],
        ),
        newValue: this.readOptionalString(payload[payloadField]),
        effectiveDate: paf.effectiveDate,
        changeSource: 'PAF',
        pafRecordId: paf.id,
        changeReason: this.readOptionalString(
          data.changeReason ?? payload.reason ?? payload.remarks,
        ),
        changedBy: undefined,
      }));
  }

  private normalizeStatus(value: unknown): string {
    const normalized = (typeof value === 'string' ? value : '')
      .trim()
      .replaceAll(' ', '_')
      .replaceAll('-', '_')
      .toUpperCase();

    if (normalized === 'DRAFT') return PAF_STATUS.DRAFT;
    if (normalized === 'PENDING' || normalized === 'PENDING_APPROVAL') {
      return PAF_STATUS.PENDING_APPROVAL;
    }
    if (normalized === 'SUBMITTED') return PAF_STATUS.SUBMITTED;
    if (normalized === 'APPROVED') return PAF_STATUS.APPROVED;
    if (normalized === 'REJECTED') return PAF_STATUS.REJECTED;
    if (normalized === 'VERIFIED') return PAF_STATUS.VERIFIED;
    if (normalized === 'COMPLETE' || normalized === 'APPLIED') {
      return PAF_STATUS.APPLIED;
    }
    if (normalized === 'CANCELLED' || normalized === 'CANCELED') {
      return PAF_STATUS.CANCELLED;
    }

    return normalized;
  }

  private readStatus(value: unknown, fallback: string): string {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }
    const status = this.normalizeStatus(value);
    if (!Object.values(PAF_STATUS).includes(status as never)) {
      throw new BadRequestException(
        `status must be one of: ${Object.values(PAF_STATUS).join(', ')}.`,
      );
    }
    return status;
  }

  private readRequiredString(value: unknown, field: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new BadRequestException(`${field} is required.`);
    }
    return value.trim();
  }

  private readOptionalString(value: unknown): string | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return String(value);
    }
    return JSON.stringify(value);
  }

  private readPositiveInteger(value: unknown, field: string): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException(`${field} must be a positive integer.`);
    }
    return parsed;
  }

  private readOptionalPositiveInteger(
    value: unknown,
    field: string,
  ): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return this.readPositiveInteger(value, field);
  }

  private readDate(value: unknown, field: string): Date {
    let candidate: unknown = value;
    if (Array.isArray(value)) {
      candidate = value[0];
    }

    if (candidate === undefined || candidate === null || candidate === '') {
      throw new BadRequestException(`${field} is required.`);
    }

    const date =
      candidate instanceof Date
        ? candidate
        : typeof candidate === 'string' || typeof candidate === 'number'
          ? new Date(candidate)
          : undefined;

    if (!date || Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${field} must be a valid date.`);
    }
    return date;
  }

  private readOptionalDate(value: unknown, field: string): Date | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return this.readDate(value, field);
  }

  private readBoolean(value: unknown, fallback: boolean): boolean {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      if (['true', '1', 'yes'].includes(value.toLowerCase())) return true;
      if (['false', '0', 'no'].includes(value.toLowerCase())) return false;
    }
    throw new BadRequestException('Boolean field must be true or false.');
  }

  private readPafPayload(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException('payloadJson must be an object.');
    }
    return value as Record<string, unknown>;
  }

  private asRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }
    return value as Record<string, unknown>;
  }

  private readPage(value: string | string[] | undefined): number {
    const parsed = Number(this.firstValue(value) ?? 1);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }

  private readLimit(value: string | string[] | undefined): number {
    const parsed = Number(this.firstValue(value) ?? 200);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return 200;
    }
    return Math.min(parsed, 500);
  }

  private firstValue(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
  }

  private readActorEmployeeId(actor: AuthenticatedRequestUser): number {
    return this.readPositiveInteger(actor.employeeId, 'employeeId');
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private createMinimalPdf(text: string): string {
    const escaped = text
      .replaceAll('\\', '\\\\')
      .replaceAll('(', '\\(')
      .replaceAll(')', '\\)')
      .replaceAll('\n', ') Tj T* (');
    const stream = `BT /F1 12 Tf 72 760 Td (${escaped}) Tj ET`;
    const objects = [
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
      '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      `5 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    for (const object of objects) {
      offsets.push(pdf.length);
      pdf += `${object}\n`;
    }
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (const offset of offsets.slice(1)) {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return pdf;
  }
}
