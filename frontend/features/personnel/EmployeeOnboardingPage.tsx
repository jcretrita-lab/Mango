import React, { useDeferredValue, useMemo, useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
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
  EmployeeRecord,
  EmployeeOnboardingRecord,
  compareDateDesc,
  formatDate,
  countChecklistItems,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';

export default function EmployeeOnboardingPage() {
  usePageTitle('Employee Onboarding');

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const { status, data, errorMessage, refresh } = useApiQueries({
    employees: '/personnel/employees',
    onboardingRecords: '/personnel/employee-onboarding-records',
  });

  const rows = useMemo(() => {
    const employees = data.employees as EmployeeRecord[];
    const onboardingRecords = data.onboardingRecords as EmployeeOnboardingRecord[];

    return onboardingRecords
      .map((record) => ({
        record,
        employee: employees.find((employee) => employee.id === record.employeeId),
      }))
      .filter((item) => item.employee)
      .filter((item) => {
        const query = deferredSearch.trim().toLowerCase();
        return (
          !query ||
          [item.employee?.displayName, item.employee?.roleTitle, item.employee?.employeeNumber]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        );
      })
      .sort((left, right) => compareDateDesc(left.record.startDate, right.record.startDate));
  }, [data, deferredSearch]);

  if (status === 'loading') {
    return <LoadingState description="Loading seeded onboarding records and linked employees." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Onboarding records are unavailable"
        description={errorMessage ?? 'The onboarding page could not reach the backend.'}
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

  const inProgress = rows.filter((item) => item.record.status.toUpperCase().includes('PROGRESS')).length;
  const completed = rows.filter((item) => item.record.status.toUpperCase().includes('COMPLETE')).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Employee Lifecycle"
        title="Employee Onboarding"
        description="Onboarding records now render the real seeded lifecycle dataset with linked employees, checklist counts, and start windows."
        actions={<SearchField value={searchTerm} onChange={setSearchTerm} placeholder="Search onboarding employees" />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Onboarding Cases" value={rows.length} helper="Seeded onboarding records" icon={ClipboardList} accent="indigo" />
        <StatCard label="In Progress" value={inProgress} helper="Records not yet completed" icon={CalendarClock} accent="amber" />
        <StatCard label="Completed" value={completed} helper="Fully finished onboardings" icon={CheckCircle2} accent="emerald" />
      </div>

      <SectionCard title="Onboarding Queue" description="This table mirrors the seeded rollout data for new hires and onboarding progress.">
        {rows.length === 0 ? (
          <EmptyState
            title="No onboarding records are available"
            description="The page is ready to show onboarding workflows as soon as the dataset returns rows."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Employee</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Status</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Start Date</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Completed Steps</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(({ record, employee }) => (
                  <tr key={record.id}>
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-slate-900">{employee?.displayName}</div>
                      <div className="mt-1 text-xs font-medium text-slate-500">
                        {employee?.roleTitle ?? 'Unassigned role'} | {employee?.employeeNumber}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge value={record.status} />
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{formatDate(record.startDate)}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {countChecklistItems(record.completedStepsJson)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{record.notes || '—'}</td>
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
