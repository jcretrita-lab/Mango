import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { projectApiRecord } from '../../common/api/response-projection';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PHASE1_STATUS } from '../../common/constants/domain-status.constants';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { PrismaService } from '../../core/prisma/prisma.service';

interface CreateApprovalRequestPayload {
  approvalSetupId: number;
  employeeId?: number;
  referenceType?: string;
  referenceId?: number;
  payloadJson?: Prisma.InputJsonValue;
}

function requireActor(
  actor: AuthenticatedRequestUser | undefined,
): AuthenticatedRequestUser {
  if (!actor) {
    throw new UnauthorizedException('No authenticated session provided.');
  }

  return actor;
}

@Injectable()
export class ApprovalRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds pending approval requests assigned to a user and includes employee/setup data for approver queue features.
   */
  async findPendingByApprover(userId: number) {
    return this.prisma.approvalRequest.findMany({
      where: {
        status: 'PENDING',
        workflows: {
          some: {
            approverUserId: userId,
            status: 'PENDING',
          },
        },
      },
      include: {
        employee: true,
        approvalSetup: true,
      },
    });
  }

  async createRequest(
    data: CreateApprovalRequestPayload,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const request = await this.prisma.$transaction(async (tx) => {
      const createdRequest = await tx.approvalRequest.create({
        data: {
          approvalSetupId: data.approvalSetupId,
          requestedByUserId: requestActor.backendUserId,
          employeeId: data.employeeId,
          referenceType: data.referenceType,
          referenceId: data.referenceId,
          payloadJson: data.payloadJson,
          status: PHASE1_STATUS.DRAFT,
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
      });

      await tx.auditEvent.create({
        data: {
          actorUserId: requestActor.backendUserId,
          eventType: 'APPROVAL_REQUEST_CREATED',
          entityType: 'ApprovalRequest',
          entityId: String(createdRequest.id),
        },
      });

      return createdRequest;
    });

    return projectApiRecord('approvalRequest', request, requestActor);
  }

  async submitRequest(id: number, actor: AuthenticatedRequestUser | undefined) {
    const requestActor = requireActor(actor);

    const request = await this.prisma.$transaction(async (tx) => {
      const existingRequest = await tx.approvalRequest.findUnique({
        where: { id },
      });

      if (!existingRequest) {
        throw new NotFoundException(`Approval request ${id} was not found.`);
      }

      if (existingRequest.status !== PHASE1_STATUS.DRAFT) {
        throw new BadRequestException(
          'Only draft approval requests can be submitted.',
        );
      }

      const firstSequence = await tx.approverSequence.findFirst({
        where: { approvalSetupId: existingRequest.approvalSetupId, stepNo: 1 },
        orderBy: { stepNo: 'asc' },
      });

      if (!firstSequence) {
        throw new BadRequestException(
          'Approval setup has no approver sequence.',
        );
      }

      const updatedRequest = await tx.approvalRequest.update({
        where: { id },
        data: {
          status: PHASE1_STATUS.PENDING,
          currentStepNo: 1,
          submittedAt: new Date(),
          updatedBy: requestActor.backendUserId,
        },
      });

      await tx.approvalWorkflow.create({
        data: {
          approvalRequestId: id,
          approverSequenceId: firstSequence.id,
          approverUserId: firstSequence.approverUserId,
          status: PHASE1_STATUS.PENDING,
          createdBy: requestActor.backendUserId,
          updatedBy: requestActor.backendUserId,
        },
      });

      await this.writeWorkflowAudit(
        tx,
        requestActor.backendUserId,
        'APPROVAL_REQUEST_SUBMITTED',
        id,
      );

      return updatedRequest;
    });

    return projectApiRecord('approvalRequest', request, requestActor);
  }

  async approveRequest(
    id: number,
    comments: string | undefined,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.actOnPendingWorkflow(
      id,
      PHASE1_STATUS.APPROVED,
      'APPROVAL_REQUEST_APPROVED',
      comments,
      actor,
    );
  }

  async rejectRequest(
    id: number,
    comments: string | undefined,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.actOnPendingWorkflow(
      id,
      PHASE1_STATUS.REJECTED,
      'APPROVAL_REQUEST_REJECTED',
      comments,
      actor,
    );
  }

  async cancelRequest(id: number, actor: AuthenticatedRequestUser | undefined) {
    const requestActor = requireActor(actor);

    const request = await this.prisma.$transaction(async (tx) => {
      const existingRequest = await tx.approvalRequest.findUnique({
        where: { id },
      });

      if (!existingRequest) {
        throw new NotFoundException(`Approval request ${id} was not found.`);
      }

      if (
        existingRequest.status === PHASE1_STATUS.APPROVED ||
        existingRequest.status === PHASE1_STATUS.REJECTED
      ) {
        throw new BadRequestException(
          'Resolved approval requests cannot be cancelled.',
        );
      }

      if (
        existingRequest.requestedByUserId !== requestActor.backendUserId &&
        !requestActor.permissions.includes(PERMISSION_CODES.APPROVALS_MANAGE)
      ) {
        throw new ForbiddenException(
          'Only the requester or approvals manager can cancel this request.',
        );
      }

      const updatedRequest = await tx.approvalRequest.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          resolvedAt: new Date(),
          updatedBy: requestActor.backendUserId,
        },
      });

      await tx.approvalWorkflow.updateMany({
        where: { approvalRequestId: id, status: PHASE1_STATUS.PENDING },
        data: {
          status: 'CANCELLED',
          updatedBy: requestActor.backendUserId,
        },
      });

      await this.writeWorkflowAudit(
        tx,
        requestActor.backendUserId,
        'APPROVAL_REQUEST_CANCELLED',
        id,
      );

      return updatedRequest;
    });

    return projectApiRecord('approvalRequest', request, requestActor);
  }

  private async actOnPendingWorkflow(
    id: number,
    outcome: typeof PHASE1_STATUS.APPROVED | typeof PHASE1_STATUS.REJECTED,
    eventType: string,
    comments: string | undefined,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    const requestActor = requireActor(actor);

    const request = await this.prisma.$transaction(async (tx) => {
      const existingRequest = await tx.approvalRequest.findUnique({
        where: { id },
        include: {
          workflows: {
            where: { status: PHASE1_STATUS.PENDING },
            orderBy: { id: 'asc' },
          },
        },
      });

      if (!existingRequest) {
        throw new NotFoundException(`Approval request ${id} was not found.`);
      }

      if (existingRequest.status !== PHASE1_STATUS.PENDING) {
        throw new BadRequestException(
          'Only pending approval requests can be acted on.',
        );
      }

      const workflow = existingRequest.workflows[0];

      if (!workflow) {
        throw new BadRequestException(
          'Approval request has no pending workflow step.',
        );
      }

      const canAct = await this.canActorApprove(
        tx,
        workflow.approverUserId,
        requestActor.backendUserId,
      );

      if (!canAct) {
        throw new ForbiddenException(
          'This approval step is not assigned to the current user.',
        );
      }

      await tx.approvalWorkflow.update({
        where: { id: workflow.id },
        data: {
          status: outcome,
          actedAt: new Date(),
          comments,
          updatedBy: requestActor.backendUserId,
        },
      });

      const updatedRequest = await tx.approvalRequest.update({
        where: { id },
        data: {
          status: outcome,
          resolvedAt: new Date(),
          updatedBy: requestActor.backendUserId,
        },
      });

      await this.writeWorkflowAudit(
        tx,
        requestActor.backendUserId,
        eventType,
        id,
      );

      return updatedRequest;
    });

    return projectApiRecord('approvalRequest', request, requestActor);
  }

  private async canActorApprove(
    tx: Prisma.TransactionClient,
    assignedUserId: number | null,
    actorUserId: number,
  ): Promise<boolean> {
    if (assignedUserId === actorUserId) {
      return true;
    }

    if (!assignedUserId) {
      return false;
    }

    const delegation = await tx.approvalDelegation.findFirst({
      where: {
        fromUserId: assignedUserId,
        toUserId: actorUserId,
        status: PHASE1_STATUS.ACTIVE,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });

    return Boolean(delegation);
  }

  private async writeWorkflowAudit(
    tx: Prisma.TransactionClient,
    actorUserId: number,
    eventType: string,
    approvalRequestId: number,
  ): Promise<void> {
    await tx.auditEvent.create({
      data: {
        actorUserId,
        eventType,
        entityType: 'ApprovalRequest',
        entityId: String(approvalRequestId),
      },
    });
  }
}
