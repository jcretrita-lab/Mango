import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { SystemSettingsService } from './system-settings.service';

type SettingsRequest = Request & {
  user?: AuthenticatedRequestUser;
};

type WriteBody = Record<string, unknown>;

@Controller('system-settings')
export class SystemSettingsController {
  constructor(private readonly systemSettingsService: SystemSettingsService) {}

  @RequirePermissions(PERMISSION_CODES.ORG_READ)
  @Get('rank-terminology')
  getRankTerminology() {
    return this.systemSettingsService.getRankTerminology();
  }

  @RequirePermissions(PERMISSION_CODES.ORG_MANAGE)
  @Patch('rank-terminology')
  updateRankTerminology(
    @Body() body: WriteBody,
    @Req() request: SettingsRequest,
  ) {
    return this.systemSettingsService.updateRankTerminology(body, request.user);
  }
}
