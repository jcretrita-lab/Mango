import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { buildReadOptions } from '../../common/api/read-resource.service';
import type { ApiQuery } from '../../common/api/read-resource.types';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import {
  ApprovalsReadService,
  type ApprovalsResourceKey,
} from './approvals-read.service';

type ApprovalsReadRequest = Request & {
  user?: AuthenticatedRequestUser;
};

@Controller('approvals')
export class ApprovalsReadController {
  constructor(private readonly approvalsReadService: ApprovalsReadService) {}

  private findAll(
    resourceKey: ApprovalsResourceKey,
    request: ApprovalsReadRequest,
    query: ApiQuery,
  ) {
    return this.approvalsReadService.findAll(
      resourceKey,
      buildReadOptions(query),
      request.user,
    );
  }

  private findOne(
    resourceKey: ApprovalsResourceKey,
    id: number,
    request: ApprovalsReadRequest,
  ) {
    return this.approvalsReadService.findOne(resourceKey, id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approval-setups')
  findApprovalSetups(
    @Req() request: ApprovalsReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('approvalSetups', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approval-setups/:id')
  findApprovalSetup(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: ApprovalsReadRequest,
  ) {
    return this.findOne('approvalSetups', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approver-sequences')
  findApproverSequences(
    @Req() request: ApprovalsReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('approverSequences', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approver-sequences/:id')
  findApproverSequence(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: ApprovalsReadRequest,
  ) {
    return this.findOne('approverSequences', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approval-sequence-secondary-approvers')
  findApprovalSequenceSecondaryApprovers(
    @Req() request: ApprovalsReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('approvalSequenceSecondaryApprovers', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approval-sequence-secondary-approvers/:id')
  findApprovalSequenceSecondaryApprover(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: ApprovalsReadRequest,
  ) {
    return this.findOne('approvalSequenceSecondaryApprovers', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approval-delegations')
  findApprovalDelegations(
    @Req() request: ApprovalsReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('approvalDelegations', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approval-delegations/:id')
  findApprovalDelegation(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: ApprovalsReadRequest,
  ) {
    return this.findOne('approvalDelegations', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('workflow-assignments')
  findWorkflowAssignments(
    @Req() request: ApprovalsReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('workflowAssignments', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('workflow-assignments/:id')
  findWorkflowAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: ApprovalsReadRequest,
  ) {
    return this.findOne('workflowAssignments', id, request);
  }

  @RequirePermissions(
    PERMISSION_CODES.APPROVALS_READ,
    PERMISSION_CODES.APPROVALS_SELF_READ,
  )
  @Get('approval-requests')
  findApprovalRequests(
    @Req() request: ApprovalsReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('approvalRequests', request, query);
  }

  @RequirePermissions(
    PERMISSION_CODES.APPROVALS_READ,
    PERMISSION_CODES.APPROVALS_SELF_READ,
  )
  @Get('approval-requests/:id')
  findApprovalRequest(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: ApprovalsReadRequest,
  ) {
    return this.findOne('approvalRequests', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approval-workflows')
  findApprovalWorkflows(
    @Req() request: ApprovalsReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('approvalWorkflows', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approval-workflows/:id')
  findApprovalWorkflow(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: ApprovalsReadRequest,
  ) {
    return this.findOne('approvalWorkflows', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approval-workflow-notes')
  findApprovalWorkflowNotes(
    @Req() request: ApprovalsReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('approvalWorkflowNotes', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_READ)
  @Get('approval-workflow-notes/:id')
  findApprovalWorkflowNote(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: ApprovalsReadRequest,
  ) {
    return this.findOne('approvalWorkflowNotes', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Post(':resourcePath')
  createResource(@Param('resourcePath') resourcePath: string) {
    return this.approvalsReadService.rejectGenericMutationByPath(resourcePath);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Patch(':resourcePath/:id')
  updateResource(@Param('resourcePath') resourcePath: string) {
    return this.approvalsReadService.rejectGenericMutationByPath(resourcePath);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Delete(':resourcePath/:id')
  deleteResource(@Param('resourcePath') resourcePath: string) {
    return this.approvalsReadService.rejectGenericMutationByPath(resourcePath);
  }
}
