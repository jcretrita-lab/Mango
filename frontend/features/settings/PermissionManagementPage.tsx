import React from 'react';
import {
  Lock,
  ShieldCheck,
  UserCog,
  Workflow,
} from 'lucide-react';
import {
  ErrorState,
  LoadingState,
  PageHeader,
  SectionCard,
  StatCard,
} from '../../components/phase1/Phase1Ui';
import {
  type RoleRecord,
  type PermissionRecord,
  type RolePermissionAssignmentRecord,
  type SystemModuleRecord,
  type PermissionModuleConfigRecord,
  type PermissionModuleConfigScopeRecord,
  type PermissionModuleConfigActionRecord,
  type PermissionModuleConfigStateRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';
import { ChipRow } from './components/SettingsUi';

export default function PermissionManagementPage() {
  usePageTitle('Permissions');

  const { status, data, errorMessage, refresh } = useApiQueries({
    permissions: '/rbac/permissions',
    systemModules: '/rbac/system-modules',
    permissionModuleConfigs: '/rbac/permission-module-configs',
    permissionModuleConfigScopes: '/rbac/permission-module-config-scopes',
    permissionModuleConfigActions: '/rbac/permission-module-config-actions',
    permissionModuleConfigStates: '/rbac/permission-module-config-states',
    roles: '/rbac/roles',
    rolePermissionAssignments: '/rbac/role-permission-assignments',
  });

  if (status === 'loading') {
    return <LoadingState description="Loading permission modules, scopes, actions, states, and role coverage." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Permission management is unavailable"
        description={errorMessage ?? 'The permissions page could not reach the backend.'}
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

  const permissions = data.permissions as PermissionRecord[];
  const systemModules = data.systemModules as SystemModuleRecord[];
  const permissionModuleConfigs = data.permissionModuleConfigs as PermissionModuleConfigRecord[];
  const permissionModuleConfigScopes = data.permissionModuleConfigScopes as PermissionModuleConfigScopeRecord[];
  const permissionModuleConfigActions = data.permissionModuleConfigActions as PermissionModuleConfigActionRecord[];
  const permissionModuleConfigStates = data.permissionModuleConfigStates as PermissionModuleConfigStateRecord[];
  const roles = data.roles as RoleRecord[];
  const rolePermissionAssignments = data.rolePermissionAssignments as RolePermissionAssignmentRecord[];

  const moduleCards = permissionModuleConfigs.map((config) => ({
    config,
    module: systemModules.find((module) => module.id === config.systemModuleId),
    scopes: permissionModuleConfigScopes.filter((scope) => scope.permissionModuleConfigId === config.id),
    actions: permissionModuleConfigActions.filter((action) => action.permissionModuleConfigId === config.id),
    states: permissionModuleConfigStates.filter((state) => state.permissionModuleConfigId === config.id),
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="RBAC"
        title="Permissions"
        description="The permission page now reflects the seeded module configs, scopes, actions, states, and role-to-permission assignments."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Permission Modules" value={moduleCards.length} helper="Seeded module configs" icon={Lock} accent="indigo" />
        <StatCard label="Scopes" value={permissionModuleConfigScopes.length} helper="Coverage dimensions" icon={ShieldCheck} accent="blue" />
        <StatCard label="Actions" value={permissionModuleConfigActions.length} helper="Allowed operations" icon={UserCog} accent="emerald" />
        <StatCard label="States" value={permissionModuleConfigStates.length} helper="Workflow state markers" icon={Workflow} accent="amber" />
      </div>

      <SectionCard title="Module Coverage" description="Each module card shows the seeded config, scope, action, and state definitions used by the permission model.">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {moduleCards.map(({ config, module, scopes, actions, states }) => (
            <div key={config.id} className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="text-lg font-bold text-slate-900">{module?.name ?? config.name}</div>
              <div className="mt-1 text-sm text-slate-500">{config.description ?? 'No description'}</div>
              <div className="mt-4 space-y-3">
                <ChipRow label="Scopes" values={scopes.map((scope) => scope.name)} />
                <ChipRow label="Actions" values={actions.map((action) => action.name)} />
                <ChipRow label="States" values={states.map((state) => state.name)} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Permission Matrix" description="This matrix reflects the actual role-to-permission assignments seeded into the Phase 1 RBAC tables.">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Permission</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Module</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Assigned Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissions.map((permission) => {
                const assignments = rolePermissionAssignments.filter(
                  (assignment) => assignment.permissionId === permission.id && assignment.isActive,
                );
                const moduleName = assignments[0]?.systemModuleId
                  ? systemModules.find((module) => module.id === assignments[0].systemModuleId)?.name
                  : '—';

                return (
                  <tr key={permission.id}>
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-slate-900">{permission.name}</div>
                      <div className="mt-1 text-xs font-medium text-slate-500">
                        {permission.code} | {permission.description ?? 'No description'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{moduleName}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {assignments.length
                        ? assignments
                            .map((assignment) => roles.find((role) => role.id === assignment.roleId)?.name ?? 'Unmapped role')
                            .join(', ')
                        : 'Unassigned'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
