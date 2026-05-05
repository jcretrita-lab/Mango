import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from '../../common/crud/prisma-crud.service';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class ApprovalRequestsService extends PrismaCrudService<'approvalRequest'> {
  constructor(prisma: PrismaService) {
    super(prisma, {
      path: 'approval-requests',
      model: 'approvalRequest',
      label: 'Approval request',
      employeeReadScope: { field: 'employeeId' },
      searchFields: ['referenceType', 'status'],
      filterFields: ['status', 'referenceType'],
    });
  }

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
}
