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
import { RbacReadService, type RbacResourceKey } from './rbac-read.service';

type RbacReadRequest = Request & {
  user?: AuthenticatedRequestUser;
};

@Controller('rbac')
export class RbacReadController {
  constructor(private readonly rbacReadService: RbacReadService) {}

  private findAll(
    resourceKey: RbacResourceKey,
    request: RbacReadRequest,
    query: ApiQuery,
  ) {
    return this.rbacReadService.findAll(
      resourceKey,
      buildReadOptions(query),
      request.user,
    );
  }

  private findOne(
    resourceKey: RbacResourceKey,
    id: number,
    request: RbacReadRequest,
  ) {
    return this.rbacReadService.findOne(resourceKey, id, request.user);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('users')
  findUsers(@Req() request: RbacReadRequest, @Query() query: ApiQuery) {
    return this.findAll('users', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('users/:id')
  findUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacReadRequest,
  ) {
    return this.findOne('users', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('user-sessions')
  findUserSessions(@Req() request: RbacReadRequest, @Query() query: ApiQuery) {
    return this.findAll('userSessions', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('user-sessions/:id')
  findUserSession(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacReadRequest,
  ) {
    return this.findOne('userSessions', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('roles')
  findRoles(@Req() request: RbacReadRequest, @Query() query: ApiQuery) {
    return this.findAll('roles', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('roles/:id')
  findRole(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacReadRequest,
  ) {
    return this.findOne('roles', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('user-role-assignments')
  findUserRoleAssignments(
    @Req() request: RbacReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('userRoleAssignments', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('user-role-assignments/:id')
  findUserRoleAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacReadRequest,
  ) {
    return this.findOne('userRoleAssignments', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('permissions')
  findPermissions(@Req() request: RbacReadRequest, @Query() query: ApiQuery) {
    return this.findAll('permissions', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('permissions/:id')
  findPermission(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacReadRequest,
  ) {
    return this.findOne('permissions', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('system-modules')
  findSystemModules(@Req() request: RbacReadRequest, @Query() query: ApiQuery) {
    return this.findAll('systemModules', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('system-modules/:id')
  findSystemModule(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacReadRequest,
  ) {
    return this.findOne('systemModules', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('permission-module-configs')
  findPermissionModuleConfigs(
    @Req() request: RbacReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('permissionModuleConfigs', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('permission-module-configs/:id')
  findPermissionModuleConfig(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacReadRequest,
  ) {
    return this.findOne('permissionModuleConfigs', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('permission-module-config-scopes')
  findPermissionModuleConfigScopes(
    @Req() request: RbacReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('permissionModuleConfigScopes', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('permission-module-config-scopes/:id')
  findPermissionModuleConfigScope(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacReadRequest,
  ) {
    return this.findOne('permissionModuleConfigScopes', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('permission-module-config-actions')
  findPermissionModuleConfigActions(
    @Req() request: RbacReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('permissionModuleConfigActions', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('permission-module-config-actions/:id')
  findPermissionModuleConfigAction(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacReadRequest,
  ) {
    return this.findOne('permissionModuleConfigActions', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('permission-module-config-states')
  findPermissionModuleConfigStates(
    @Req() request: RbacReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('permissionModuleConfigStates', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('permission-module-config-states/:id')
  findPermissionModuleConfigState(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacReadRequest,
  ) {
    return this.findOne('permissionModuleConfigStates', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('role-permission-assignments')
  findRolePermissionAssignments(
    @Req() request: RbacReadRequest,
    @Query() query: ApiQuery,
  ) {
    return this.findAll('rolePermissionAssignments', request, query);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_READ)
  @Get('role-permission-assignments/:id')
  findRolePermissionAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacReadRequest,
  ) {
    return this.findOne('rolePermissionAssignments', id, request);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Post(':resourcePath')
  createResource(@Param('resourcePath') resourcePath: string) {
    return this.rbacReadService.rejectGenericMutationByPath(resourcePath);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Patch(':resourcePath/:id')
  updateResource(@Param('resourcePath') resourcePath: string) {
    return this.rbacReadService.rejectGenericMutationByPath(resourcePath);
  }

  @RequirePermissions(PERMISSION_CODES.RBAC_MANAGE)
  @Delete(':resourcePath/:id')
  deleteResource(@Param('resourcePath') resourcePath: string) {
    return this.rbacReadService.rejectGenericMutationByPath(resourcePath);
  }
}
