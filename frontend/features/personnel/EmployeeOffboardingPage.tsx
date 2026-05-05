import React, { useDeferredValue, useMemo, useState } from 'react';
import {
  CheckCircle2,
  FileCheck,
  ShieldCheck,
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
  EmployeeOffboardingRecord,
  compareDateDesc,
  formatDate,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';

export default function EmployeeOffboardingPage() {
  usePageTitle('Employee Offboarding');

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const { status, data, errorMessage, refresh } = useApiQueries({
    employees: '/personnel/employees',
    offboardingRecords: '/personnel/employee-offboarding-records',
  });

  const rows = useMemo(() => {
    const employees = data.employees as EmployeeRecord[];
    const offboardingRecords = data.offboardingRecords as EmployeeOffboardingRecord[];

    return offboardingRecords
      .map((record) => ({
        record,
        employee: employees.find((employee) => employee.id === record.employeeId),
      }))
      .filter((item) => item.employee)
      .filter((item) => {
        const query = deferredSearch.trim().toLowerCase();
        return (
          !query ||
          [item.employee?.displayName, item.employee?.roleTitle, item.record.reason]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        );
      })
      .sort((left, right) => compareDateDesc(left.record.effectiveDate, right.record.effectiveDate));
  }, [data, deferredSearch]);

  if (status === 'loading') {
    return <LoadingState description="Loading seeded separation and clearance records." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Offboarding records are unavailable"
        description={errorMessage ?? 'The offboarding page could not reach the backend.'}
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

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Employee Lifecycle"
        title="Employee Offboarding"
        description="Offboarding now surfaces the seeded separation data, clearance states, and effective dates from the enterprise demo dataset."
        actions={<SearchField value={searchTerm} onChange={setSearchTerm} placeholder="Search separated employees" />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Offboarding Cases" value={rows.length} helper="Seeded separation workflows" icon={FileCheck} accent="indigo" />
        <StatCard label="Clearance Progress" value={rows.filter((item) => item.record.clearanceStatus.toUpperCase() !== 'COMPLETE').length} helper="Cases still being cleared" icon={ShieldCheck} accent="amber" />
        <StatCard label="Completed" value={rows.filter((item) => item.record.clearanceStatus.toUpperCase() === 'COMPLETE').length} helper="Fully cleared exits" icon={CheckCircle2} accent="emerald" />
      </div>

      <SectionCard title="Offboarding Register" description="The seeded exit dataset is shown here with reasons, effective dates, and current clearance status.">
        {rows.length === 0 ? (
          <EmptyState
            title="No offboarding records are available"
            description="The page still preserves an empty state when there are no seeded exits."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Employee</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Reason</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Effective Date</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Clearance</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(({ record, employee }) => (
                  <tr key={record.id}>
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-slate-900">{employee?.displayName}</div>
                      <div className="mt-1 text-xs font-medium text-slate-500">
                        {employee?.roleTitle ?? 'Unassigned role'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{record.reason}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{formatDate(record.effectiveDate)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge value={record.clearanceStatus} />
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
