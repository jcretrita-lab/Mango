// Shape returned to clients after login and attached to requests after authorization.
export interface AuthenticatedUser {
  id: string;
  backendUserId: number;
  name: string;
  email: string;
  role: string;
  roles: string[];
  employeeId?: string;
  permissions: string[];
}

// Same authenticated user shape, plus the database session id used for logout/session revocation.
export interface AuthenticatedRequestUser extends AuthenticatedUser {
  sessionId: number;
}

// Minimal JWT payload stored inside the signed access token.
export interface AuthTokenPayload {
  sub: string;
  backendUserId: number;
  sid: number;
  email: string;
}

// Role assignment shape loaded from Prisma when building the authenticated user object.
export interface UserAccessRoleAssignment {
  isPrimary?: boolean | null;
  role: {
    name: string;
    code: string;
    rolePermissionAssignments: Array<{
      permission: {
        code: string;
      };
    }>;
  };
}

// User shape loaded with active roles and permissions for auth/RBAC decisions.
export interface UserAccessRecord {
  id: number;
  email: string;
  displayName: string;
  employeeId?: number | null;
  roleAssignments: UserAccessRoleAssignment[];
}

// Converts the Prisma user/role/permission graph into the safe user object returned by login.
export function buildAuthenticatedUser(
  user: UserAccessRecord,
): AuthenticatedUser {
  const activeRoles = user.roleAssignments.map((assignment) => ({
    isPrimary: assignment.isPrimary === true,
    code: assignment.role.code,
    name: assignment.role.name,
    permissions: assignment.role.rolePermissionAssignments.map(
      (rolePermission) => rolePermission.permission.code,
    ),
  }));
  const primaryRole = activeRoles.find((role) => role.isPrimary) ??
    activeRoles[0] ?? { name: 'Unassigned', permissions: [] };
  const permissions = Array.from(
    new Set(activeRoles.flatMap((role) => role.permissions)),
  ).sort();

  return {
    id: `user-${user.id}`,
    backendUserId: user.id,
    name: user.displayName,
    email: user.email,
    role: primaryRole.name,
    roles: activeRoles.map((role) => role.name),
    employeeId:
      user.employeeId !== undefined && user.employeeId !== null
        ? String(user.employeeId)
        : undefined,
    permissions,
  };
}

// Adds the active session id to the authenticated user object for request-time authorization.
export function buildAuthenticatedRequestUser(
  user: UserAccessRecord,
  sessionId: number,
): AuthenticatedRequestUser {
  return {
    ...buildAuthenticatedUser(user),
    sessionId,
  };
}
