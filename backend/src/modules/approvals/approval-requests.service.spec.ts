import { ApprovalRequestsService } from './approval-requests.service';
import { PHASE1_STATUS } from '../../common/constants/domain-status.constants';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import type { PrismaService } from '../../core/prisma/prisma.service';

const actor: AuthenticatedRequestUser = {
  id: 'user-10',
  backendUserId: 10,
  sessionId: 700,
  email: 'approver@diwalearning.local',
  name: 'Approver',
  role: 'Approver',
  roles: ['Approver'],
  permissions: [],
};

function buildService(prismaMock: unknown): ApprovalRequestsService {
  return new ApprovalRequestsService(prismaMock as PrismaService);
}

describe('ApprovalRequestsService', () => {
  it('advances an approved request to the next approval step when one exists', async () => {
    const firstWorkflow = {
      id: 301,
      approverUserId: actor.backendUserId,
      approverSequence: {
        id: 201,
        stepNo: 1,
      },
    };
    const nextSequence = {
      id: 202,
      stepNo: 3,
      approverUserId: 11,
    };
    const tx = {
      approvalRequest: {
        findUnique: jest.fn().mockResolvedValue({
          id: 100,
          approvalSetupId: 50,
          status: PHASE1_STATUS.PENDING,
          currentStepNo: 1,
          workflows: [firstWorkflow],
        }),
        update: jest.fn().mockResolvedValue({
          id: 100,
          approvalSetupId: 50,
          status: PHASE1_STATUS.PENDING,
          currentStepNo: nextSequence.stepNo,
          resolvedAt: null,
        }),
      },
      approvalWorkflow: {
        update: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue({}),
      },
      approverSequence: {
        findFirst: jest.fn().mockResolvedValue(nextSequence),
      },
      approvalDelegation: {
        findFirst: jest.fn(),
      },
      auditEvent: {
        create: jest.fn().mockResolvedValue({}),
      },
    };
    const prismaMock = {
      $transaction: jest.fn((callback: (transaction: typeof tx) => unknown) =>
        callback(tx),
      ),
    };

    const result = await buildService(prismaMock).approveRequest(
      100,
      'Looks good',
      actor,
    );

    expect(tx.approverSequence.findFirst).toHaveBeenCalledWith({
      where: {
        approvalSetupId: 50,
        stepNo: { gt: 1 },
      },
      orderBy: { stepNo: 'asc' },
    });
    expect(tx.approvalRequest.update).toHaveBeenCalledWith({
      where: { id: 100 },
      data: {
        status: PHASE1_STATUS.PENDING,
        currentStepNo: nextSequence.stepNo,
        resolvedAt: null,
        updatedBy: actor.backendUserId,
      },
    });
    expect(tx.approvalWorkflow.create).toHaveBeenCalledWith({
      data: {
        approvalRequestId: 100,
        approverSequenceId: nextSequence.id,
        approverUserId: nextSequence.approverUserId,
        status: PHASE1_STATUS.PENDING,
        createdBy: actor.backendUserId,
        updatedBy: actor.backendUserId,
      },
    });
    expect(result).toMatchObject({
      id: 100,
      status: PHASE1_STATUS.PENDING,
      currentStepNo: nextSequence.stepNo,
    });
  });

  it('marks an approved request resolved when the current step is final', async () => {
    const finalWorkflow = {
      id: 301,
      approverUserId: actor.backendUserId,
      approverSequence: {
        id: 201,
        stepNo: 2,
      },
    };
    const tx = {
      approvalRequest: {
        findUnique: jest.fn().mockResolvedValue({
          id: 100,
          approvalSetupId: 50,
          status: PHASE1_STATUS.PENDING,
          currentStepNo: 2,
          workflows: [finalWorkflow],
        }),
        update: jest.fn().mockResolvedValue({
          id: 100,
          approvalSetupId: 50,
          status: PHASE1_STATUS.APPROVED,
          currentStepNo: 2,
          resolvedAt: new Date('2026-05-20T00:00:00.000Z'),
        }),
      },
      approvalWorkflow: {
        update: jest.fn().mockResolvedValue({}),
        create: jest.fn(),
      },
      approverSequence: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      approvalDelegation: {
        findFirst: jest.fn(),
      },
      auditEvent: {
        create: jest.fn().mockResolvedValue({}),
      },
    };
    const prismaMock = {
      $transaction: jest.fn((callback: (transaction: typeof tx) => unknown) =>
        callback(tx),
      ),
    };

    const result = await buildService(prismaMock).approveRequest(
      100,
      undefined,
      actor,
    );

    expect(tx.approvalWorkflow.create).not.toHaveBeenCalled();
    expect(tx.approvalRequest.update).toHaveBeenCalledWith({
      where: { id: 100 },
      data: {
        status: PHASE1_STATUS.APPROVED,
        resolvedAt: expect.any(Date) as Date,
        updatedBy: actor.backendUserId,
      },
    });
    expect(result).toMatchObject({
      id: 100,
      status: PHASE1_STATUS.APPROVED,
    });
  });
});
