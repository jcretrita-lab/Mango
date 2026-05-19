import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { ApprovalAdminService } from './approval-admin.service';

type ApprovalsRequest = Request & {
  user?: AuthenticatedRequestUser;
};
type WriteBody = Record<string, unknown>;

@Controller('approvals')
export class ApprovalAdminController {
  constructor(private readonly approvalAdminService: ApprovalAdminService) {}

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Post('approval-setups')
  createApprovalSetup(
    @Body() body: WriteBody,
    @Req() request: ApprovalsRequest,
  ) {
    return this.approvalAdminService.createApprovalSetup(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Patch('approval-setups/:id')
  updateApprovalSetup(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: ApprovalsRequest,
  ) {
    return this.approvalAdminService.updateApprovalSetup(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Post('approver-sequences')
  createApproverSequence(
    @Body() body: WriteBody,
    @Req() request: ApprovalsRequest,
  ) {
    return this.approvalAdminService.createApproverSequence(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Patch('approver-sequences/:id')
  updateApproverSequence(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: ApprovalsRequest,
  ) {
    return this.approvalAdminService.updateApproverSequence(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Post('approval-delegations')
  createDelegation(@Body() body: WriteBody, @Req() request: ApprovalsRequest) {
    return this.approvalAdminService.createDelegation(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Patch('approval-delegations/:id')
  updateDelegation(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: ApprovalsRequest,
  ) {
    return this.approvalAdminService.updateDelegation(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Post('workflow-assignments')
  createWorkflowAssignment(
    @Body() body: WriteBody,
    @Req() request: ApprovalsRequest,
  ) {
    return this.approvalAdminService.createWorkflowAssignment(
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Patch('workflow-assignments/:id')
  updateWorkflowAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: ApprovalsRequest,
  ) {
    return this.approvalAdminService.updateWorkflowAssignment(
      id,
      body,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Post('approval-workflow-notes')
  createWorkflowNote(
    @Body() body: WriteBody,
    @Req() request: ApprovalsRequest,
  ) {
    return this.approvalAdminService.createWorkflowNote(body, request.user);
  }
}
