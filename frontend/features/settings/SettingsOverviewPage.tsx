import React from 'react';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardList,
  Lock,
  ShieldCheck,
  UserCog,
  Users,
  Workflow,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ErrorState,
  LoadingState,
} from '../../components/phase1/Phase1Ui';
import { useApiQueries } from '../../hooks/useQueries';
import { usePageTitle } from '../../hooks/usePageTitle';
import { 
  type ApprovalSetupRecord, 
  type OrgUnitRecord, 
  type PermissionRecord, 
  type PisFieldRecord, 
  type RoleRecord, 
  type SalaryGradeRecord,
  type UserRecord,
  type PositionTemplateRecord
} from '../../config/phase1-data';

export default function SettingsOverviewPage() {
  usePageTitle('Settings Overview');

  const navigate = useNavigate();
  const { status, data, errorMessage, refresh } = useApiQueries({
    users: '/rbac/users',
    roles: '/rbac/roles',
    permissions: '/rbac/permissions',
    orgUnits: '/org-structure/org-units',
    ranks: '/org-structure/ranks',
    salaryGrades: '/pay-structure/salary-grades',
    approvalSetups: '/approvals/approval-setups',
    positionTemplates: '/org-structure/position-templates',
    pisFields: '/personnel/pis-fields',
  });

  if (status === 'loading') {
    return <LoadingState description="Loading settings counts across RBAC, org structure, pay setup, approvals, and personnel fields." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Settings overview is unavailable"
        description={errorMessage ?? 'The settings overview could not reach the backend.'}
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

  const cards = [
    {
      title: 'Users',
      description: 'Seeded user accounts, session tracking, and login identities.',
      icon: UserCog,
      path: '/settings/users',
      value: (data.users as UserRecord[]).length,
    },
    {
      title: 'Roles',
      description: 'The three production roles for the current Phase 1 shell.',
      icon: ShieldCheck,
      path: '/settings/roles',
      value: (data.roles as RoleRecord[]).length,
    },
    {
      title: 'Permissions',
      description: 'Module permissions and effective role coverage for Phase 1.',
      icon: Lock,
      path: '/settings/permissions',
      value: (data.permissions as PermissionRecord[]).length,
    },
    {
      title: 'Org Structure',
      description: 'Corporate hierarchy, org units, and live positions.',
      icon: Building2,
      path: '/settings/structure',
      value: (data.orgUnits as OrgUnitRecord[]).length,
    },
    {
      title: 'Ranks',
      description: 'Job architecture levels and the profiles attached to them.',
      icon: Users,
      path: '/settings/ranks',
      value: (data.ranks as RoleRecord[]).length,
    },
    {
      title: 'Position Templates',
      description: 'Reusable job titles and profile classification templates.',
      icon: Briefcase,
      path: '/settings/position-templates',
      value: (data.positionTemplates as PositionTemplateRecord[]).length,
    },
    {
      title: 'Employee Fields',
      description: 'PIS tabs, field definitions, visibility, and required flags.',
      icon: ClipboardList,
      path: '/settings/employee-fields',
      value: (data.pisFields as PisFieldRecord[]).length,
    },
    {
      title: 'Approval Setup',
      description: 'Workflow setups, sequences, and scope assignments.',
      icon: Workflow,
      path: '/settings/approvals',
      value: (data.approvalSetups as ApprovalSetupRecord[]).length,
    },
    {
      title: 'Salary Grade',
      description: 'Compensation ladder and step structures.',
      icon: CheckCircle2,
      path: '/settings/salary-grade',
      value: (data.salaryGrades as SalaryGradeRecord[]).length,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-900">
            System Configuration
            <SettingsIcon size={24} className="text-indigo-600" />
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Manage global settings, policies, and system behavior.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:border-indigo-200 hover:shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 transition-transform group-hover:scale-110">
                <card.icon size={20} />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-700">
              {card.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-500">{card.description}</p>
            <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {card.value} seeded rows
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
