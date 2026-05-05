import { Module } from '@nestjs/common';
import { createCrudModuleMetadata } from '../../common/crud/crud.module-metadata';
import type { CrudResourceDefinition } from '../../common/crud/crud.types';

const resources = [
  { path: 'users', model: 'user', label: 'User' },
  { path: 'user-sessions', model: 'userSession', label: 'User session' },
  { path: 'roles', model: 'role', label: 'Role' },
  {
    path: 'user-role-assignments',
    model: 'userRoleAssignment',
    label: 'User role assignment',
  },
  { path: 'permissions', model: 'permission', label: 'Permission' },
  { path: 'system-modules', model: 'systemModule', label: 'System module' },
  {
    path: 'permission-module-configs',
    model: 'permissionModuleConfig',
    label: 'Permission module config',
  },
  {
    path: 'permission-module-config-scopes',
    model: 'permissionModuleConfigScope',
    label: 'Permission module config scope',
  },
  {
    path: 'permission-module-config-actions',
    model: 'permissionModuleConfigAction',
    label: 'Permission module config action',
  },
  {
    path: 'permission-module-config-states',
    model: 'permissionModuleConfigState',
    label: 'Permission module config state',
  },
  {
    path: 'role-permission-assignments',
    model: 'rolePermissionAssignment',
    label: 'Role permission assignment',
  },
] as const satisfies readonly CrudResourceDefinition[];

@Module(createCrudModuleMetadata('rbac', resources))
export class RbacModule {}
