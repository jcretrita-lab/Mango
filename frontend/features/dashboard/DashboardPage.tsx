import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileCheck,
  Layout,
  PieChart,
  Settings,
  ShieldAlert,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  compareDateDesc,
  formatDate,
  formatOrgPath,
  formatStatusLabel,
  groupBy,
  type ApprovalRequestRecord,
  type ApprovalWorkflowRecord,
  type EmployeeRecord,
  type EmploymentRecord,
  type EarningTemplateFamilyRecord,
  type OrgUnitRecord,
  type PositionAssignmentRecord,
  type PositionRecord,
  type SalaryGradeRecord,
  type UserRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';
import {
  ErrorState,
  LoadingState,
  StatusBadge,
} from '../../components/phase1/Phase1Ui';
import { useApiQueries } from '../../hooks/useQueries';

type WidgetKey =
  | 'stats'
  | 'departmentDist'
  | 'workforce'
  | 'recentApprovals'
  | 'recentHires'
  | 'notifications';

type DashboardConfig = Record<WidgetKey, boolean>;

interface ApprovalDashboardRow {
  request: ApprovalRequestRecord;
  employee?: EmployeeRecord;
  approver?: UserRecord;
}

interface RecentHireRow {
  employment: EmploymentRecord;
  employee: EmployeeRecord;
}

interface DepartmentCount {
  department: string;
  count: number;
}

interface DashboardView {
  employees: EmployeeRecord[];
  orgUnits: OrgUnitRecord[];
  positions: PositionRecord[];
  activeEmployees: EmployeeRecord[];
  pendingApprovals: ApprovalRequestRecord[];
  resolvedApprovals: ApprovalRequestRecord[];
  filledPositions: number;
  openPositions: number;
  activeSalaryGrades: SalaryGradeRecord[];
  activeTemplates: EarningTemplateFamilyRecord[];
  departmentCounts: DepartmentCount[];
  recentHires: RecentHireRow[];
  approvalRows: ApprovalDashboardRow[];
  myPendingRows: ApprovalDashboardRow[];
  myResolvedRows: ApprovalWorkflowRecord[];
  rolesLoaded: number;
}

interface DashboardStat {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
}

type CoverageTone = 'indigo' | 'emerald' | 'amber' | 'blue';

interface CoverageCardProps {
  label: string;
  value: string;
  helper: string;
  tone: CoverageTone;
}

export default function DashboardPage() {
  usePageTitle('Dashboard');

  const navigate = useNavigate();
  const { user } = useAuth();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<DashboardConfig>({
    stats: true,
    departmentDist: true,
    workforce: true,
    recentApprovals: true,
    recentHires: true,
    notifications: true,
  });

  const { status, data, errorMessage, refresh } = useApiQueries({
    employees: '/personnel/employees',
    employments: '/personnel/employments',
    orgUnits: '/org-structure/org-units',
    positions: '/org-structure/positions',
    positionAssignments: '/org-structure/position-assignments',
    salaryGrades: '/pay-structure/salary-grades',
    templateFamilies: '/pay-structure/earning-template-families',
    approvalRequests: '/approvals/approval-requests',
    approvalWorkflows: '/approvals/approval-workflows',
    users: '/rbac/users',
  });

  const view = useMemo<DashboardView>(() => {
    const employees = (data.employees ?? []) as EmployeeRecord[];
    const employments = (data.employments ?? []) as EmploymentRecord[];
    const orgUnits = (data.orgUnits ?? []) as OrgUnitRecord[];
    const positions = (data.positions ?? []) as PositionRecord[];
    const positionAssignments = (data.positionAssignments ?? []) as PositionAssignmentRecord[];
    const salaryGrades = (data.salaryGrades ?? []) as SalaryGradeRecord[];
    const templateFamilies = (data.templateFamilies ?? []) as EarningTemplateFamilyRecord[];
    const approvalRequests = (data.approvalRequests ?? []) as ApprovalRequestRecord[];
    const approvalWorkflows = (data.approvalWorkflows ?? []) as ApprovalWorkflowRecord[];
    const users = (data.users ?? []) as UserRecord[];

    const activeEmployees = employees.filter(
      (employee) => employee.status.toUpperCase() === 'ACTIVE',
    );
    const pendingApprovals = approvalRequests.filter(
      (request) => request.status.toUpperCase() === 'PENDING',
    );
    const resolvedApprovals = approvalRequests.filter(
      (request) => Boolean(request.resolvedAt),
    );
    const activeAssignments = positionAssignments.filter((assignment) => !assignment.endDate);
    const filledPositionIds = new Set(
      activeAssignments
        .filter((assignment) => assignment.employeeId)
        .map((assignment) => assignment.positionId),
    );

    const openPositions = positions.reduce((total, position) => {
      const filledCount = activeAssignments.filter(
        (assignment) => assignment.positionId === position.id && assignment.employeeId,
      ).length;
      return total + Math.max(position.plannedHeadcount - filledCount, 0);
    }, 0);

    const departmentCounts = Array.from(
      groupBy(activeEmployees, (employee) => {
        const department = employee.orgUnitJson?.department;
        return typeof department === 'string' && department.trim()
          ? department
          : 'Unassigned';
      }).entries(),
    )
      .map(([department, members]) => ({ department, count: members.length }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 6);

    const recentHires = [...employments]
      .sort((left, right) => compareDateDesc(left.startDate, right.startDate))
      .slice(0, 5)
      .map((employment) => ({
        employment,
        employee: employees.find((record) => record.id === employment.employeeId),
      }))
      .filter(
        (
          item,
        ): item is { employment: EmploymentRecord; employee: EmployeeRecord } =>
          Boolean(item.employee),
      );

    const approvalRows = approvalRequests
      .map((request) => {
        const employee = request.employeeId
          ? employees.find((record) => record.id === request.employeeId)
          : undefined;
        const currentStep = approvalWorkflows.find(
          (workflow) =>
            workflow.approvalRequestId === request.id &&
            workflow.status.toUpperCase() === 'PENDING',
        );
        const approver = currentStep?.approverUserId
          ? users.find((record) => record.id === currentStep.approverUserId)
          : undefined;

        return { request, employee, approver };
      })
      .sort((left, right) =>
        compareDateDesc(left.request.submittedAt, right.request.submittedAt),
      );

    const currentUserRecord = users.find(
      (record) => record.email.toLowerCase() === user?.email?.toLowerCase(),
    );
    const myPendingRows =
      user?.role === 'Approver' && currentUserRecord
        ? approvalRows.filter(
            (row) => row.approver?.id === currentUserRecord.id && !row.request.resolvedAt,
          )
        : approvalRows.filter((row) => row.request.status.toUpperCase() === 'PENDING');

    const myResolvedRows =
      user?.role === 'Approver' && currentUserRecord
        ? approvalWorkflows.filter(
            (workflow) =>
              workflow.approverUserId === currentUserRecord.id &&
              workflow.status.toUpperCase() !== 'PENDING',
          )
        : approvalWorkflows.filter(
            (workflow) => workflow.status.toUpperCase() !== 'PENDING',
          );

    const rolesLoaded = new Set(users.map((record) => record.email)).size;

    return {
      employees,
      orgUnits,
      positions,
      activeEmployees,
      pendingApprovals,
      resolvedApprovals,
      filledPositions: filledPositionIds.size,
      openPositions,
      activeSalaryGrades: salaryGrades.filter(
        (grade) => grade.status.toUpperCase() === 'ACTIVE',
      ),
      activeTemplates: templateFamilies.filter(
        (family) => family.status.toUpperCase() === 'ACTIVE',
      ),
      departmentCounts,
      recentHires,
      approvalRows,
      myPendingRows,
      myResolvedRows,
      rolesLoaded,
    };
  }, [data, user?.email, user?.role]);

  if (status === 'loading') {
    return (
      <LoadingState description="Loading enterprise seed metrics, approvals, and workforce coverage." />
    );
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Dashboard data is unavailable"
        description={errorMessage ?? 'The seeded dashboard could not connect to the backend.'}
        action={
          <button
            onClick={() => void refresh()}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Retry
          </button>
        }
      />
    );
  }

  const firstName = user?.name?.split(' ')[0] ?? 'Admin';

  return (
    <div className="relative space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Morning, {firstName}
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Here's your {user?.role} dashboard overview.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsConfigOpen((previous) => !previous)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings size={14} />
            Configure View
          </button>
          <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            System Live
          </span>
        </div>
      </div>

      {isConfigOpen ? (
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-3">
          {[
            { key: 'stats', label: 'Key Statistics Cards', icon: Activity },
            { key: 'departmentDist', label: 'Department Distribution', icon: PieChart },
            { key: 'workforce', label: 'Workforce Coverage', icon: TrendingUp },
            { key: 'recentApprovals', label: 'Recent Approvals', icon: FileCheck },
            { key: 'recentHires', label: 'Recent Hires', icon: CalendarCheck },
            { key: 'notifications', label: 'Action Feed', icon: Bell },
          ].map((item) => {
            const checked = visibleWidgets[item.key as WidgetKey];
            const Icon = item.icon;

            return (
              <label
                key={item.key}
                className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-4 transition ${
                  checked ? 'border-indigo-200 bg-indigo-50/70' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                  <div className="rounded-lg bg-white p-2 text-slate-500">
                    <Icon size={16} />
                  </div>
                  {item.label}
                </div>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setVisibleWidgets((previous) => ({
                      ...previous,
                      [item.key]: !previous[item.key as WidgetKey],
                    }))
                  }
                  className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            );
          })}
        </div>
      ) : null}

      {user?.role === 'Approver' ? (
        <ApproverDashboard
          pendingRows={view.myPendingRows}
          resolvedCount={view.myResolvedRows.length}
          navigate={navigate}
          showStats={visibleWidgets.stats}
        />
      ) : user?.role === 'Employee' ? (
        <EmployeeDashboard
          employeeCount={view.activeEmployees.length}
          approvalRows={view.approvalRows.slice(0, 4)}
          navigate={navigate}
          showStats={visibleWidgets.stats}
        />
      ) : (
        <SuperadminDashboard
          view={view}
          navigate={navigate}
          visibleWidgets={visibleWidgets}
        />
      )}
    </div>
  );
}

function SuperadminDashboard({
  view,
  navigate,
  visibleWidgets,
}: {
  view: DashboardView;
  navigate: ReturnType<typeof useNavigate>;
  visibleWidgets: DashboardConfig;
}) {
  return (
    <div className="space-y-8">
      {visibleWidgets.stats ? (
        <StatsGrid
          stats={[
            {
              label: 'Active Employees',
              value: String(view.activeEmployees.length),
              change: `${view.employees.length} total`,
              icon: <Users size={20} />,
              color: 'bg-indigo-500',
            },
            {
              label: 'Pending Approvals',
              value: String(view.pendingApprovals.length),
              change: 'Awaiting action',
              icon: <FileCheck size={20} />,
              color: 'bg-amber-500',
            },
            {
              label: 'Open Headcount',
              value: String(view.openPositions),
              change: `${view.filledPositions} filled`,
              icon: <Briefcase size={20} />,
              color: 'bg-emerald-500',
            },
            {
              label: 'Template Families',
              value: String(view.activeTemplates.length),
              change: `${view.activeSalaryGrades.length} salary grades`,
              icon: <Wallet size={20} />,
              color: 'bg-blue-500',
            },
          ]}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {visibleWidgets.notifications ? (
          <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Bell className="text-amber-500" size={16} /> Recent Approval Feed
              </h3>
              <button
                onClick={() => navigate('/monitor/approvals')}
                className="text-xs font-bold text-indigo-600 transition-colors hover:text-indigo-800"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {view.approvalRows.slice(0, 5).map((row) => (
                <button
                  key={row.request.id}
                  onClick={() => navigate(`/monitor/approvals/${row.request.id}`)}
                  className="group relative flex w-full items-start gap-3 rounded-xl border border-transparent p-3 text-left transition-colors hover:border-slate-100 hover:bg-slate-50"
                >
                  {!row.request.resolvedAt ? (
                    <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-amber-500" />
                  ) : null}
                  <div className="flex-1 pl-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-700">
                        {row.employee?.displayName ?? `Request #${row.request.id}`}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">
                        {formatDate(row.request.submittedAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {formatStatusLabel(row.request.referenceType)}
                      {row.approver ? ` • Pending ${row.approver.displayName}` : ''}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {visibleWidgets.workforce ? (
          <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <BarChart3 size={16} className="text-indigo-600" /> Workforce Coverage
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  Seeded headcount, organization footprint, and compensation architecture.
                </p>
              </div>
              <div className="flex gap-3 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-3 rounded-full bg-indigo-500" />
                  Workforce
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="inline-block h-1.5 w-3 rounded-full bg-emerald-500" />
                  Filled
                </span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <CoverageCard
                label="Org Units"
                value={String(view.orgUnits.length)}
                helper="Corporate hierarchy nodes"
                tone="indigo"
              />
              <CoverageCard
                label="Positions"
                value={String(view.positions.length)}
                helper={`${view.filledPositions} filled, ${view.openPositions} open`}
                tone="emerald"
              />
              <CoverageCard
                label="Salary Grades"
                value={String(view.activeSalaryGrades.length)}
                helper="Seeded compensation ladder"
                tone="amber"
              />
              <CoverageCard
                label="Resolved Approvals"
                value={String(view.resolvedApprovals.length)}
                helper="Completed workflow history"
                tone="blue"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        {visibleWidgets.departmentDist ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Department Distribution</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Active workforce distribution across the seeded enterprise structure.
                </p>
              </div>
              <PieChart size={18} className="text-slate-300" />
            </div>
            <div className="space-y-4">
              {view.departmentCounts.map((department, index) => {
                const width = Math.max(
                  12,
                  Math.round(
                    (department.count / Math.max(view.activeEmployees.length, 1)) * 100,
                  ),
                );
                const colors = [
                  'bg-blue-500',
                  'bg-indigo-500',
                  'bg-purple-500',
                  'bg-emerald-500',
                  'bg-amber-500',
                  'bg-orange-500',
                ];

                return (
                  <div key={department.department}>
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        {department.department}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {department.count}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-50 relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.7, delay: index * 0.07, ease: 'easeOut' }}
                        className={`absolute top-0 bottom-0 left-0 rounded-full ${colors[index % colors.length]}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {visibleWidgets.recentHires ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Hires</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Newest employment records already present in the seeded personnel data.
                </p>
              </div>
              <button
                onClick={() => navigate('/manage/employee')}
                className="text-xs font-bold text-indigo-600 transition-colors hover:text-indigo-800"
              >
                Open Directory
              </button>
            </div>
            <div className="space-y-3">
              {view.recentHires.map(({ employee, employment }) => (
                <button
                  key={employment.id}
                  onClick={() => navigate(`/manage/employee/${employee.id}`)}
                  className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-left transition-all hover:border-indigo-200 hover:bg-white hover:shadow-sm"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-700">
                      {employee.displayName}
                    </div>
                    <div className="mt-1 text-xs font-medium text-slate-500">
                      {employee.roleTitle ?? 'Unclassified role'} •{' '}
                      {formatOrgPath(employee.orgUnitJson)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Started
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-700">
                      {formatDate(employment.startDate)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ApproverDashboard({
  pendingRows,
  resolvedCount,
  navigate,
  showStats,
}: {
  pendingRows: ApprovalDashboardRow[];
  resolvedCount: number;
  navigate: ReturnType<typeof useNavigate>;
  showStats: boolean;
}) {
  return (
    <div className="space-y-8">
      {showStats ? (
        <StatsGrid
          stats={[
            {
              label: 'Pending My Action',
              value: String(pendingRows.length),
              change: 'Urgent',
              icon: <FileCheck size={20} />,
              color: 'bg-indigo-500',
            },
            {
              label: 'Approved Queue',
              value: String(resolvedCount),
              change: 'Processed',
              icon: <CheckCircle2 size={20} />,
              color: 'bg-emerald-500',
            },
            {
              label: 'Escalations',
              value: String(Math.min(2, pendingRows.length)),
              change: 'Returned',
              icon: <XCircle size={20} />,
              color: 'bg-rose-500',
            },
            {
              label: 'Average Response',
              value: pendingRows.length ? '4h' : '0h',
              change: 'Fast',
              icon: <Clock size={20} />,
              color: 'bg-blue-500',
            },
          ]}
        />
      ) : null}

      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Task Queue</h2>
            <p className="text-sm text-slate-500">Requests waiting for your sign-off.</p>
          </div>
          <button
            onClick={() => navigate('/monitor/approvals')}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800"
          >
            Go to Approval Desk
          </button>
        </div>

        <div className="space-y-4">
          {pendingRows.slice(0, 6).map((task) => (
            <button
              key={task.request.id}
              onClick={() => navigate(`/monitor/approvals/${task.request.id}`)}
              className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                    {formatStatusLabel(task.request.referenceType)} -{' '}
                    {task.employee?.displayName ?? `Request ${task.request.id}`}
                  </h4>
                  <p className="text-xs font-medium text-slate-500">
                    Submitted {formatDate(task.request.submittedAt)} • Reference #
                    {task.request.referenceId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded border border-rose-100 bg-rose-50 px-2 py-1 text-[10px] font-bold uppercase text-rose-600">
                  Pending
                </span>
                <ArrowUpRight
                  className="text-slate-300 transition-colors group-hover:text-indigo-600"
                  size={20}
                />
              </div>
            </button>
          ))}
          {pendingRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <div className="text-lg font-bold text-slate-900">No pending approvals</div>
              <p className="mt-1 text-sm text-slate-500">
                Your queue is currently clear in the seeded workflow data.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EmployeeDashboard({
  employeeCount,
  approvalRows,
  navigate,
  showStats,
}: {
  employeeCount: number;
  approvalRows: ApprovalDashboardRow[];
  navigate: ReturnType<typeof useNavigate>;
  showStats: boolean;
}) {
  return (
    <div className="space-y-8">
      {showStats ? (
        <StatsGrid
          stats={[
            {
              label: 'Company Headcount',
              value: String(employeeCount),
              change: 'Seeded workforce',
              icon: <Users size={20} />,
              color: 'bg-indigo-500',
            },
            {
              label: 'My Workspace',
              value: 'Ready',
              change: 'Profile access',
              icon: <Layout size={20} />,
              color: 'bg-emerald-500',
            },
            {
              label: 'Approvals Feed',
              value: String(approvalRows.length),
              change: 'Recent activity',
              icon: <Bell size={20} />,
              color: 'bg-blue-500',
            },
            {
              label: 'Security State',
              value: 'Good',
              change: 'No issues',
              icon: <ShieldAlert size={20} />,
              color: 'bg-amber-500',
            },
          ]}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Self-Service Workspace</h2>
          <p className="mt-1 text-sm text-slate-500">
            Open your employee record to review profile, pay profile, and action forms.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <QuickActionCard
              icon={Users}
              label="Open Profile"
              description="View employee information"
              onClick={() => navigate('/my-profile')}
            />
            <QuickActionCard
              icon={Wallet}
              label="Pay Profile"
              description="Check salary mapping"
              onClick={() => navigate('/my-profile')}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Recent Workflow Activity</h2>
          <p className="mt-1 text-sm text-slate-500">
            Latest requests across the Phase 1 seed, useful for testing status displays.
          </p>
          <div className="mt-5 space-y-3">
            {approvalRows.map((row) => (
              <button
                key={row.request.id}
                onClick={() => navigate(`/monitor/approvals/${row.request.id}`)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-4 text-left transition hover:border-indigo-200 hover:bg-white"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {formatStatusLabel(row.request.referenceType)}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-500 text-truncate">
                    Reference #{row.request.referenceId}
                  </div>
                </div>
                <StatusBadge value={row.request.status} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {stat.label}
              </div>
              <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                {stat.value}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                {stat.change}
              </div>
            </div>
            <div className={`rounded-2xl p-3.5 text-white ${stat.color} shadow-lg shadow-indigo-100`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickActionCard({ icon: Icon, label, description, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition-all hover:border-indigo-300 hover:bg-white hover:shadow-md"
    >
      <div className="rounded-xl bg-white p-2.5 text-slate-500 shadow-sm transition-colors group-hover:bg-indigo-600 group-hover:text-white">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-sm font-bold text-slate-900">{label}</div>
        <div className="mt-1 text-xs font-medium text-slate-500">{description}</div>
      </div>
    </button>
  );
}

function CoverageCard({ label, value, helper, tone }: CoverageCardProps) {
  const tones = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  };
  const color = tones[tone];

  return (
    <div className={`rounded-2xl border ${color.border} ${color.bg} p-4`}>
      <div className={`text-[10px] font-bold uppercase tracking-wider ${color.text} opacity-70`}>
        {label}
      </div>
      <div className={`mt-1 text-xl font-bold ${color.text}`}>{value}</div>
      <div className={`mt-0.5 text-[10px] font-bold ${color.text} opacity-60 uppercase`}>
        {helper}
      </div>
    </div>
  );
}
