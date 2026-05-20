import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import type { Request } from 'express';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { ApprovalActionDto } from './dto/approval-action.dto';
import { CreateApprovalRequestDto } from './dto/create-approval-request.dto';
import { ApprovalRequestsService } from './approval-requests.service';

type ApprovalRequestWithActor = Request & {
  user?: AuthenticatedRequestUser;
};

type ApprovalActionBody = ApprovalActionDto & {
  action?: string;
};

@Controller('approvals/approval-requests')
export class ApprovalRequestsController {
  constructor(
    private readonly approvalRequestsService: ApprovalRequestsService,
  ) {}

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Post()
  createRequest(
    @Body() body: CreateApprovalRequestDto,
    @Req() request: ApprovalRequestWithActor,
  ) {
    return this.approvalRequestsService.createRequest(
      {
        ...body,
        payloadJson: body.payloadJson as Prisma.InputJsonValue | undefined,
      },
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Post(':id/submit')
  submitRequest(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: ApprovalRequestWithActor,
  ) {
    return this.approvalRequestsService.submitRequest(id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_APPROVE)
  @Post(':id/approve')
  approveRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApprovalActionDto,
    @Req() request: ApprovalRequestWithActor,
  ) {
    return this.approvalRequestsService.approveRequest(
      id,
      body.comments,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_APPROVE)
  @Post(':id/reject')
  rejectRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApprovalActionDto,
    @Req() request: ApprovalRequestWithActor,
  ) {
    return this.approvalRequestsService.rejectRequest(
      id,
      body.comments,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.APPROVALS_MANAGE)
  @Post(':id/cancel')
  cancelRequest(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: ApprovalRequestWithActor,
  ) {
    return this.approvalRequestsService.cancelRequest(id, request.user);
  }

  @RequirePermissions(
    PERMISSION_CODES.APPROVALS_APPROVE,
    PERMISSION_CODES.APPROVALS_MANAGE,
  )
  @Post(':id/actions')
  actOnRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApprovalActionBody,
    @Req() request: ApprovalRequestWithActor,
  ) {
    const action = body.action?.trim().toLowerCase();

    if (action === 'approve') {
      return this.approvalRequestsService.approveRequest(
        id,
        body.comments,
        request.user,
      );
    }

    if (action === 'reject') {
      return this.approvalRequestsService.rejectRequest(
        id,
        body.comments,
        request.user,
      );
    }

    if (action === 'cancel') {
      return this.approvalRequestsService.cancelRequest(id, request.user);
    }

    if (action === 'submit') {
      return this.approvalRequestsService.submitRequest(id, request.user);
    }

    throw new BadRequestException(
      'action must be approve, reject, cancel, or submit.',
    );
  }
}
