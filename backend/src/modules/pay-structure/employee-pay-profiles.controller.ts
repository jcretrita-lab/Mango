import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { UpdateEmployeePayProfileDto } from './dto/update-employee-pay-profile.dto';
import { EmployeePayProfilesService } from './employee-pay-profiles.service';

type PayStructureRequest = Request & {
  user?: AuthenticatedRequestUser;
};

type WriteBody = Record<string, unknown>;

@Controller('pay-structure/employee-pay-profiles')
export class EmployeePayProfilesController {
  constructor(
    private readonly payProfilesService: EmployeePayProfilesService,
  ) {}

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch(':id')
  updatePayProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEmployeePayProfileDto,
    @Req() request: PayStructureRequest,
  ) {
    return this.payProfilesService.updatePayProfile(
      id,
      {
        ...body,
        effectiveStartDate: body.effectiveStartDate
          ? new Date(body.effectiveStartDate)
          : undefined,
        effectiveEndDate: body.effectiveEndDate
          ? new Date(body.effectiveEndDate)
          : undefined,
      },
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.PAY_STRUCTURE_MANAGE)
  @Patch(':id/end')
  endPayProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: PayStructureRequest,
  ) {
    return this.payProfilesService.endPayProfile(id, body, request.user);
  }
}
