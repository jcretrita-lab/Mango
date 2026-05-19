import { Module } from '@nestjs/common';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { ApprovalAdminController } from './approval-admin.controller';
import { ApprovalAdminService } from './approval-admin.service';
import { ApprovalRequestsController } from './approval-requests.controller';
import { ApprovalRequestsService } from './approval-requests.service';
import { ApprovalsReadController } from './approvals-read.controller';
import { ApprovalsReadService } from './approvals-read.service';

@Module({
  controllers: [
    ApprovalAdminController,
    ApprovalRequestsController,
    ApprovalsReadController,
  ],
  providers: [
    ApprovalAdminService,
    ApprovalRequestsService,
    ApprovalsReadService,
    ReadResourceService,
  ],
})
export class ApprovalsModule {}
