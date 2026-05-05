import React, { useDeferredValue, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  UserCog,
} from 'lucide-react';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SearchField,
  SectionCard,
  StatCard,
  StatusBadge,
} from '../../components/phase1/Phase1Ui';
import {
  formatDate,
  type RoleRecord,
  type UserRecord,
  type UserRoleAssignmentRecord,
  type UserSessionRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';

export default function UserManagementPage() {
  usePageTitle('User Management');

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const { status, data, errorMessage, refresh } = useApiQueries({
    users: '/rbac/users',
    userSessions: '/rbac/user-sessions',
    userRoleAssignments: '/rbac/user-role-assignments',
    roles: '/rbac/roles',
  });

  const rows = useMemo(() => {
    const users = data.users as UserRecord[];
    const userSessions = data.userSessions as UserSessionRecord[];
    const userRoleAssignments = data.userRoleAssignments as UserRoleAssignmentRecord[];
    const roles = data.roles as RoleRecord[];

    return users
      .map((user) => {
        const roleNames = userRoleAssignments
          .filter((assignment) => assignment.userId === user.id && assignment.isActive)
          .map((assignment) => roles.find((role) => role.id === assignment.roleId)?.name ?? 'Unmapped role');
        const activeSession = [...userSessions]
          .filter((session) => session.userId === user.id)
          .sort((left, right) => (right.lastSeenAt ?? '').localeCompare(left.lastSeenAt ?? ''))[0];

        return { user, roleNames, activeSession };
      })
      .filter((item) => {
        const query = deferredSearch.trim().toLowerCase();
        return (
          !query ||
          [item.user.displayName, item.user.email, item.roleNames.join(' ')]
            .join(' ')
            .toLowerCase()
            .includes(query)
        );
      })
      .sort((left, right) => left.user.displayName.localeCompare(right.user.displayName));
  }, [data, deferredSearch]);

  if (status === 'loading') {
    return <LoadingState description="Loading seeded users, role assignments, and last-seen sessions." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="User management is unavailable"
        description={errorMessage ?? 'The user page could not reach the backend.'}
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

  const activeSessions = rows.filter((item) => item.activeSession?.status.toUpperCase() === 'ACTIVE').length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="RBAC"
        title="User Management"
        description="This page now renders real seeded user accounts, their role assignments, and the latest recorded session state."
        actions={<SearchField value={searchTerm} onChange={setSearchTerm} placeholder="Search user, email, or role" />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Users" value={rows.length} helper="Seeded logins and approvers" icon={UserCog} accent="indigo" />
        <StatCard label="Active Sessions" value={activeSessions} helper="Current seeded session states" icon={CheckCircle2} accent="emerald" />
        <StatCard label="Role Coverage" value={new Set(rows.flatMap((item) => item.roleNames)).size} helper="Distinct roles in use" icon={ShieldCheck} accent="blue" />
      </div>

      <SectionCard title="User Accounts" description="Rows combine seeded user identities with their current role assignments and latest session snapshots.">
        {rows.length === 0 ? (
          <EmptyState
            title="No users match the current search"
            description="The user table preserves an empty state when no seeded identities match the filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">User</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Roles</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Status</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(({ user, roleNames, activeSession }) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-slate-900">{user.displayName}</div>
                      <div className="mt-1 text-xs font-medium text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {roleNames.length ? roleNames.join(', ') : 'No active role'}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge value={activeSession?.status ?? user.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {formatDate(activeSession?.lastSeenAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
