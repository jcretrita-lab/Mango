import { Injectable, NotFoundException } from '@nestjs/common';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import {
  type ReadAllOptions,
  type ReadResourceDefinition,
} from '../../common/api/read-resource.types';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';

export type RbacResourceKey =
  | 'users'
  | 'userSessions'
  | 'roles'
  | 'userRoleAssignments'
  | 'permissions'
  | 'systemModules'
  | 'permissionModuleConfigs'
  | 'permissionModuleConfigScopes'
  | 'permissionModuleConfigActions'
  | 'permissionModuleConfigStates'
  | 'rolePermissionAssignments';

const resources = {
  users: {
    model: 'user',
    label: 'User',
    readPermission: PERMISSION_CODES.RBAC_READ,
  },
  userSessions: {
    model: 'userSession',
    label: 'User session',
    readPermission: PERMISSION_CODES.RBAC_READ,
  },
  roles: {
    model: 'role',
    label: 'Role',
    readPermission: PERMISSION_CODES.RBAC_READ,
  },
  userRoleAssignments: {
    model: 'userRoleAssignment',
    label: 'User role assignment',
    readPermission: PERMISSION_CODES.RBAC_READ,
  },
  permissions: {
    model: 'permission',
    label: 'Permission',
    readPermission: PERMISSION_CODES.RBAC_READ,
  },
  systemModules: {
    model: 'systemModule',
    label: 'System module',
    readPermission: PERMISSION_CODES.RBAC_READ,
  },
  permissionModuleConfigs: {
    model: 'permissionModuleConfig',
    label: 'Permission module config',
    readPermission: PERMISSION_CODES.RBAC_READ,
  },
  permissionModuleConfigScopes: {
    model: 'permissionModuleConfigScope',
    label: 'Permission module config scope',
    readPermission: PERMISSION_CODES.RBAC_READ,
  },
  permissionModuleConfigActions: {
    model: 'permissionModuleConfigAction',
    label: 'Permission module config action',
    readPermission: PERMISSION_CODES.RBAC_READ,
  },
  permissionModuleConfigStates: {
    model: 'permissionModuleConfigState',
    label: 'Permission module config state',
    readPermission: PERMISSION_CODES.RBAC_READ,
  },
  rolePermissionAssignments: {
    model: 'rolePermissionAssignment',
    label: 'Role permission assignment',
    readPermission: PERMISSION_CODES.RBAC_READ,
  },
} as const satisfies Record<RbacResourceKey, ReadResourceDefinition>;

const resourceKeyByPath: Readonly<Record<string, RbacResourceKey>> = {
  users: 'users',
  'user-sessions': 'userSessions',
  roles: 'roles',
  'user-role-assignments': 'userRoleAssignments',
  permissions: 'permissions',
  'system-modules': 'systemModules',
  'permission-module-configs': 'permissionModuleConfigs',
  'permission-module-config-scopes': 'permissionModuleConfigScopes',
  'permission-module-config-actions': 'permissionModuleConfigActions',
  'permission-module-config-states': 'permissionModuleConfigStates',
  'role-permission-assignments': 'rolePermissionAssignments',
};

@Injectable()
export class RbacReadService {
  constructor(private readonly readService: ReadResourceService) {}

  findAll(
    resourceKey: RbacResourceKey,
    options: ReadAllOptions,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findAll(resources[resourceKey], options, actor);
  }

  findOne(
    resourceKey: RbacResourceKey,
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findOne(resources[resourceKey], id, actor);
  }

  rejectGenericMutation(resourceKey: RbacResourceKey): never {
    return this.readService.rejectGenericMutation(resources[resourceKey].label);
  }

  rejectGenericMutationByPath(resourcePath: string): never {
    const resourceKey = resourceKeyByPath[resourcePath];

    if (!resourceKey) {
      throw new NotFoundException(
        `RBAC resource ${resourcePath} was not found.`,
      );
    }

    return this.rejectGenericMutation(resourceKey);
  }
}
