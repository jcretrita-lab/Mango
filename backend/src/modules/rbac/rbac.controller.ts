import {
  Body,
  Controller,
  Delete,
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
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RbacService } from './rbac.service';

type WriteBody = Record<string, unknown>;

type RbacRequest = Request & {
  user?: AuthenticatedRequestUser;
};

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Post('roles')
  createRole(@Body() body: WriteBody, @Req() request: RbacRequest) {
    return this.rbacService.createRole(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Patch('roles/:id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: RbacRequest,
  ) {
    return this.rbacService.updateRole(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Post('permissions')
  createPermission(@Body() body: WriteBody, @Req() request: RbacRequest) {
    return this.rbacService.createPermission(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Patch('permissions/:id')
  updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: RbacRequest,
  ) {
    return this.rbacService.updatePermission(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Post('system-modules')
  createSystemModule(@Body() body: WriteBody, @Req() request: RbacRequest) {
    return this.rbacService.createSystemModule(body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Patch('system-modules/:id')
  updateSystemModule(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteBody,
    @Req() request: RbacRequest,
  ) {
    return this.rbacService.updateSystemModule(id, body, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Post('users/:userId/roles')
  assignRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: AssignRoleDto,
    @Req() request: RbacRequest,
  ) {
    return this.rbacService.assignRole(
      userId,
      body.roleId,
      body.isPrimary,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Post('roles/:roleId/permissions')
  assignPermission(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() body: AssignPermissionDto,
    @Req() request: RbacRequest,
  ) {
    return this.rbacService.assignPermission(
      roleId,
      body.permissionId,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Delete('users/:userId/roles/:roleId')
  revokeRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Req() request: RbacRequest,
  ) {
    return this.rbacService.revokeRole(userId, roleId, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Delete('roles/:roleId/permissions/:permissionId')
  revokePermission(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
    @Req() request: RbacRequest,
  ) {
    return this.rbacService.revokePermission(
      roleId,
      permissionId,
      request.user,
    );
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Post('user-sessions/:id/revoke')
  revokeSession(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacRequest,
  ) {
    return this.rbacService.revokeSession(id, request.user);
  }
}
