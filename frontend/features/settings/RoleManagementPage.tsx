import React, { useMemo, useState } from 'react';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SectionCard,
  StatusBadge,
} from '../../components/phase1/Phase1Ui';
import {
  type RoleRecord,
  type UserRecord,
  type UserRoleAssignmentRecord,
  type PermissionRecord,
  type RolePermissionAssignmentRecord,
  type SystemModuleRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';
import { InfoGrid } from '../personnel/components/EmployeeProfileComponents';
import { MiniMetric } from './components/SettingsUi';

export default function RoleManagementPage() {
  usePageTitle('Role Management');

  const { status, data, errorMessage, refresh } = useApiQueries({
    roles: '/rbac/roles',
    users: '/rbac/users',
    userRoleAssignments: '/rbac/user-role-assignments',
    permissions: '/rbac/permissions',
    rolePermissionAssignments: '/rbac/role-permission-assignments',
    systemModules: '/rbac/system-modules',
  });
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const view = useMemo(() => {
    const roles = data.roles as RoleRecord[];
    const users = data.users as UserRecord[];
    const userRoleAssignments = data.userRoleAssignments as UserRoleAssignmentRecord[];
    const permissions = data.permissions as PermissionRecord[];
    const rolePermissionAssignments = data.rolePermissionAssignments as RolePermissionAssignmentRecord[];
    const systemModules = data.systemModules as SystemModuleRecord[];

    const roleCards = roles.map((role) => {
      const memberIds = userRoleAssignments
        .filter((assignment) => assignment.roleId === role.id && assignment.isActive)
        .map((assignment) => assignment.userId);
      const members = users.filter((user) => memberIds.includes(user.id));
      const permissionLinks = rolePermissionAssignments.filter(
        (assignment) => assignment.roleId === role.id && assignment.isActive,
      );
      const modules = permissionLinks.map(
        (assignment) => systemModules.find((module) => module.id === assignment.systemModuleId)?.name,
      );

      return {
        role,
        members,
        permissionLinks,
        moduleNames: Array.from(new Set(modules.filter(Boolean) as string[])),
        permissionNames: permissionLinks.map(
          (assignment) => permissions.find((permission) => permission.id === assignment.permissionId)?.name,
        ),
      };
    });

    return {
      roleCards,
      selectedRole:
        roleCards.find((item) => item.role.id === selectedRoleId) ??
        roleCards[0] ??
        null,
    };
  }, [data, selectedRoleId]);

  if (status === 'loading') {
    return <LoadingState description="Loading roles, assigned users, and effective module permissions." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Role management is unavailable"
        description={errorMessage ?? 'The role page could not reach the backend.'}
        action={
          <button
            onClick={() => void refresh()}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!view.selectedRole) {
    return (
      <EmptyState
        title="No roles are available"
        description="The role-management shell still preserves an empty state when no seeded roles are loaded."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="RBAC"
        title="Role Management"
        description="The Phase 1 role model is now rendered directly from the seeded RBAC tables, including members and module permissions."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <SectionCard title="Role Catalog" description="The three system roles are now displayed as real RBAC records instead of placeholder tiles.">
          <div className="space-y-3">
            {view.roleCards.map((item) => (
              <button
                key={item.role.id}
                onClick={() => setSelectedRoleId(item.role.id)}
                className={`w-full rounded-3xl border p-5 text-left transition ${
                  view.selectedRole?.role.id === item.role.id
                    ? 'border-indigo-200 bg-indigo-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{item.role.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.role.description ?? 'No description'}</div>
                  </div>
                  <StatusBadge value={item.role.status} />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MiniMetric label="Members" value={String(item.members.length)} />
                  <MiniMetric label="Permissions" value={String(item.permissionLinks.length)} />
                  <MiniMetric label="Modules" value={String(item.moduleNames.length)} />
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={view.selectedRole.role.name} description="Selected role coverage, members, and module access from the seeded RBAC assignments.">
          <div className="space-y-6">
            <InfoGrid
              items={[
                ['Description', view.selectedRole.role.description ?? '—'],
                ['Members', String(view.selectedRole.members.length)],
                ['Permissions', String(view.selectedRole.permissionLinks.length)],
                ['Modules', view.selectedRole.moduleNames.join(', ') || '—'],
              ]}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="text-sm font-bold text-slate-900">Assigned Members</div>
                {view.selectedRole.members.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    No members are assigned to this role.
                  </div>
                ) : (
                  view.selectedRole.members.map((member) => (
                    <div key={member.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
                      <div className="text-sm font-bold text-slate-900">{member.displayName}</div>
                      <div className="mt-1 text-xs text-slate-500">{member.email}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3">
                <div className="text-sm font-bold text-slate-900">Effective Permissions</div>
                {view.selectedRole.permissionNames.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    No permissions are assigned to this role.
                  </div>
                ) : (
                  view.selectedRole.permissionNames.map((permissionName) => (
                    <div key={permissionName ?? 'unknown'} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
                      <div className="text-sm font-bold text-slate-900">{permissionName ?? 'Unknown permission'}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
