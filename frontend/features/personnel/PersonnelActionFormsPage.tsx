import React, { useDeferredValue, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
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
} from '../../components/phase1/Phase1Ui';
import {
  EmployeeRecord,
  PafRecord,
  ApprovalRequestRecord,
  ApprovalSetupRecord,
  compareDateDesc,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';

export default function PersonnelActionFormsPage() {
  usePageTitle('Personnel Action Forms');

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const { status, data, errorMessage, refresh } = useApiQueries({
    employees: '/personnel/employees',
    pafRecords: '/personnel/paf-records',
    approvalRequests: '/approvals/approval-requests',
    approvalSetups: '/approvals/approval-setups',
  });

  const rows = useMemo(() => {
    const employees = data.employees as EmployeeRecord[];
    const pafRecords = data.pafRecords as PafRecord[];
    const approvalRequests = data.approvalRequests as ApprovalRequestRecord[];
    const approvalSetups = data.approvalSetups as ApprovalSetupRecord[];

    return pafRecords
      .map((record) => ({
        record,
        employee: employees.find((employee) => employee.id === record.employeeId),
        approvalRequest: record.approvalRequestId
          ? approvalRequests.find((request) => request.id === record.approvalRequestId)
          : undefined,
        approvalSetup: record.approvalSetupId
          ? approvalSetups.find((setup) => setup.id === record.approvalSetupId)
          : undefined,
      }))
      .filter((item) => {
        const query = deferredSearch.trim().toLowerCase();
        return (
          !query ||
          [item.employee?.displayName, item.record.actionType, item.approvalSetup?.name]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        );
      })
      .sort((left, right) => compareDateDesc(left.record.effectiveDate, right.record.effectiveDate));
  }, [data, deferredSearch]);

  if (status === 'loading') {
    return <LoadingState description="Loading seeded personnel action forms and linked approval records." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="PAF records are unavailable"
        description={errorMessage ?? 'The PAF page could not reach the backend.'}
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
        eyebrow="Personnel Workflow"
        title="Personnel Action Forms"
        description="This register surfaces the seeded action forms that already drive approvals, pay-profile changes, and employee history updates in the Phase 1 demo."
        actions={<SearchField value={searchTerm} onChange={setSearchTerm} placeholder="Search action type, employee, or approval setup" />}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="PAF Records" value={rows.length} helper="Seeded action forms" icon={ClipboardList} accent="indigo" />
        <StatCard label="Pending" value={rows.filter((item) => item.record.status.toUpperCase() === 'PENDING').length} helper="Still awaiting completion" icon={FileCheck} accent="amber" />
        <StatCard label="Applied" value={rows.filter((item) => item.record.appliedAt).length} helper="Changes already posted" icon={CheckCircle2} accent="emerald" />
        <StatCard label="Linked Approvals" value={rows.filter((item) => item.approvalRequest).length} helper="Forms routed through approval setup" icon={ShieldCheck} accent="blue" />
      </div>

      <SectionCard title="PAF Register" description="Each row is connected to the seeded approval engine and payload snapshot used for the Phase 1 product walkthrough.">
        {rows.length === 0 ? (
          <EmptyState
            title="No personnel action forms are available"
            description="The page remains ready for empty states even when the seed returns no PAF rows."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Employee</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Action Type</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Approval Setup</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Status</th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Effective Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(({ record, employee, approvalSetup }) => (
                  <tr key={record.id}>
                    <td className="px-5 py-4 text-sm font-bold text-slate-900">{employee?.displayName || '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{record.actionType}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{approvalSetup?.name || 'Manual Action'}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{record.status}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{new Date(record.effectiveDate).toLocaleDateString()}</td>
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
