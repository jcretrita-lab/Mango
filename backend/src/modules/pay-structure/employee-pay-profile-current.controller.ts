import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { EmployeePayProfilesService } from './employee-pay-profiles.service';

type PayStructureRequest = Request & {
  user?: AuthenticatedRequestUser;
};

@Controller('employees')
export class EmployeePayProfileCurrentController {
  constructor(
    private readonly payProfilesService: EmployeePayProfilesService,
  ) {}

  @RequirePermissions(
    PERMISSION_CODES.PAY_STRUCTURE_READ,
    PERMISSION_CODES.PAY_STRUCTURE_SELF_READ,
  )
  @Get(':employeeId/pay-profile/current')
  findCurrentEmployeePayProfile(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query('date') date: string | undefined,
    @Req() request: PayStructureRequest,
  ) {
    return this.payProfilesService.findCurrentEmployeePayProfile(
      employeeId,
      date,
      request.user,
    );
  }
}
