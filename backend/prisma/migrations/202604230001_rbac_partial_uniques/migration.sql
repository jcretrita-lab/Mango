-- Prisma cannot model PostgreSQL partial unique indexes directly.
-- These indexes prevent duplicate role-permission assignments for nullable
-- scope references while still allowing the scope columns to remain optional.

CREATE UNIQUE INDEX "role_permission_global_uq"
ON "RolePermissionAssignment" ("roleId", "permissionId")
WHERE
  "systemModuleId" IS NULL
  AND "permissionModuleConfigId" IS NULL
  AND "permissionModuleConfigScopeId" IS NULL
  AND "permissionModuleConfigActionId" IS NULL
  AND "permissionModuleConfigStateId" IS NULL;

CREATE UNIQUE INDEX "role_permission_system_module_uq"
ON "RolePermissionAssignment" ("roleId", "permissionId", "systemModuleId")
WHERE "systemModuleId" IS NOT NULL;

CREATE UNIQUE INDEX "role_permission_module_config_uq"
ON "RolePermissionAssignment" ("roleId", "permissionId", "permissionModuleConfigId")
WHERE "permissionModuleConfigId" IS NOT NULL;

CREATE UNIQUE INDEX "role_permission_scope_uq"
ON "RolePermissionAssignment" ("roleId", "permissionId", "permissionModuleConfigScopeId")
WHERE "permissionModuleConfigScopeId" IS NOT NULL;

CREATE UNIQUE INDEX "role_permission_action_uq"
ON "RolePermissionAssignment" ("roleId", "permissionId", "permissionModuleConfigActionId")
WHERE "permissionModuleConfigActionId" IS NOT NULL;

CREATE UNIQUE INDEX "role_permission_state_uq"
ON "RolePermissionAssignment" ("roleId", "permissionId", "permissionModuleConfigStateId")
WHERE "permissionModuleConfigStateId" IS NOT NULL;
