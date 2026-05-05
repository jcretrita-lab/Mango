import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  FileCheck,
  MoreHorizontal,
  Search,
  Settings,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
} from '../../components/phase1/Phase1Ui';
import { PaginationControls } from '../../components/phase1/PaginationControls';
import {
  compareDateDesc,
  formatDate,
  formatStatusLabel,
  type ApprovalRequestRecord,
  type ApprovalSetupRecord,
  type ApprovalWorkflowRecord,
  type EmployeeRecord,
  type UserRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { buildQueryPath, useApiQueries } from '../../hooks/useQueries';
import { FilterSelect } from '../personnel/components/FilterSelect';

const APPROVAL_PAGE_SIZE = 25;

interface ApprovalQueueRow {
  request: ApprovalRequestRecord;
  employee?: EmployeeRecord;
  approvalSetup?: ApprovalSetupRecord;
  currentApprover?: UserRecord;
}

export default function ApprovalListPage() {
  usePageTitle('Approvals');

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [referenceTypeFilter, setReferenceTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const deferredSearch = useDeferredValue(searchTerm);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, referenceTypeFilter, statusFilter]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, deferredSearch, referenceTypeFilter, statusFilter]);

  const approvalRequestPath = useMemo(
    () =>
      buildQueryPath('/approvals/approval-requests', {
        page,
        limit: APPROVAL_PAGE_SIZE,
        search: deferredSearch.trim(),
        status: statusFilter,
        referenceType: referenceTypeFilter,
      }),
    [deferredSearch, page, referenceTypeFilter, statusFilter],
  );

  const { status, data, pages, errorMessage, refresh } = useApiQueries({
    approvalRequests: approvalRequestPath,
    approvalRequestFilterOptions: '/approvals/approval-requests?limit=500',
    approvalWorkflows: '/approvals/approval-workflows',
    approvalSetups: '/approvals/approval-setups',
    employees: '/personnel/employees',
    users: '/rbac/users',
  });

  const rows = useMemo<ApprovalQueueRow[]>(() => {
    const approvalRequests = (data.approvalRequests ?? []) as ApprovalRequestRecord[];
    const approvalWorkflows = (data.approvalWorkflows ?? []) as ApprovalWorkflowRecord[];
    const approvalSetups = (data.approvalSetups ?? []) as ApprovalSetupRecord[];
    const employees = (data.employees ?? []) as EmployeeRecord[];
    const users = (data.users ?? []) as UserRecord[];

    return approvalRequests
      .map((request) => {
        const relatedWorkflows = approvalWorkflows.filter(
          (workflow) => workflow.approvalRequestId === request.id,
        );
        const currentWorkflow = relatedWorkflows.find(
          (workflow) => workflow.status.toUpperCase() === 'PENDING',
        );

        return {
          request,
          employee: request.employeeId
            ? employees.find((employee) => employee.id === request.employeeId)
            : undefined,
          approvalSetup: approvalSetups.find((setup) => setup.id === request.approvalSetupId),
          currentApprover: currentWorkflow?.approverUserId
            ? users.find((user) => user.id === currentWorkflow.approverUserId)
            : undefined,
        };
      })
      .sort((left, right) => compareDateDesc(left.request.submittedAt, right.request.submittedAt));
  }, [data]);

  const filterOptions = useMemo(() => {
    const approvalRequests = (data.approvalRequestFilterOptions ?? []) as ApprovalRequestRecord[];
    const statuses = Array.from(new Set(approvalRequests.map((request) => request.status))).sort(
      (left, right) => left.localeCompare(right),
    );
    const referenceTypes = Array.from(
      new Set(approvalRequests.map((request) => request.referenceType)),
    ).sort((left, right) => left.localeCompare(right));

    return { statuses, referenceTypes };
  }, [data.approvalRequestFilterOptions]);

  if (status === 'loading') {
    return (
      <LoadingState description="Loading seeded approval requests, routed steps, and current approver data." />
    );
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Approval queue is unavailable"
        description={errorMessage ?? 'The approval page could not reach the backend.'}
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

  const pendingCount = rows.filter(
    (item) => item.request.status.toUpperCase() === 'PENDING',
  ).length;
  const resolvedCount = rows.filter((item) => item.request.resolvedAt).length;

  const toggleSelection = (id: number) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Approval Management
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Monitor, verify, and manage pending requests across the organization.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/settings/approvals')}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800"
          >
            <Settings size={18} />
            Manage Approvals
          </button>
        </div>
      </div>

      <div className="flex min-h-[600px] flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-50 bg-white p-5 lg:flex-row">
          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
            <FilterSelect
              icon={CheckCircle2}
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All statuses', value: 'all' },
                ...filterOptions.statuses.map((value) => ({
                  label: formatStatusLabel(value),
                  value,
                })),
              ]}
            />
            <FilterSelect
              icon={FileCheck}
              label="Approval Type"
              value={referenceTypeFilter}
              onChange={setReferenceTypeFilter}
              options={[
                { label: 'All types', value: 'all' },
                ...filterOptions.referenceTypes.map((value) => ({
                  label: formatStatusLabel(value),
                  value,
                })),
              ]}
            />
          </div>

          <div className="relative w-full lg:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search approval type or status..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="flex h-14 items-center gap-4 border-b border-slate-100 bg-slate-50/50 px-6 text-xs font-bold text-slate-500">
          <span className="mr-2 uppercase tracking-widest">Action Buttons:</span>
          <button className="flex items-center gap-1.5 transition-colors hover:text-indigo-600">
            <CheckCircle2 size={16} /> Verify
          </button>
          <button className="flex items-center gap-1.5 transition-colors hover:text-emerald-600">
            <Check size={16} strokeWidth={3} /> HR Approve
          </button>
          <button className="flex items-center gap-1.5 transition-colors hover:text-rose-600">
            <X size={16} strokeWidth={3} /> Reject
          </button>
        </div>

        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No approvals match the current search"
              description="The queue preserves a clean empty state when the current filter returns no seeded requests."
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-50">
                <thead className="bg-slate-50/20 text-left">
                  <tr>
                    <th className="w-12 px-6 py-4">
                      <div className="flex h-5 w-5 items-center justify-center rounded border-2 border-slate-300" />
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Employee Name
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Approval Type
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Current Approver
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Date Modified
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Approval Setup
                    </th>
                    <th className="w-10 px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rows.map(({ request, employee, approvalSetup, currentApprover }) => {
                    const isSelected = selectedIds.has(request.id);

                    return (
                      <tr
                        key={request.id}
                        onClick={() => navigate(`/monitor/approvals/${request.id}`)}
                        className="group cursor-pointer transition-colors hover:bg-slate-50/80"
                      >
                        <td
                          className="px-6 py-4"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleSelection(request.id);
                          }}
                        >
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-600'
                                : 'border-slate-300 hover:border-slate-400'
                            }`}
                          >
                            {isSelected ? (
                              <Check size={12} className="text-white" strokeWidth={3} />
                            ) : null}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
                              {employee
                                ? employee.displayName
                                    .split(' ')
                                    .slice(0, 2)
                                    .map((token) => token[0])
                                    .join('')
                                : 'AR'}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                                {employee?.displayName ?? `Request ${request.id}`}
                              </div>
                              <div className="text-[10px] font-medium text-slate-500">
                                {employee?.roleTitle ?? formatStatusLabel(request.referenceType)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <StatusBadge value={request.status} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="text-sm font-bold text-slate-700">
                            {formatStatusLabel(request.referenceType)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="text-xs font-medium text-slate-600">
                            {currentApprover?.displayName ?? 'Workflow complete'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="font-mono text-xs font-medium text-slate-500">
                            {formatDate(request.resolvedAt ?? request.submittedAt)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                            {approvalSetup?.name ?? 'Unconfigured'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(event) => event.stopPropagation()}
                            className="rounded-lg p-2 text-slate-300 opacity-0 transition-all hover:bg-white hover:text-indigo-600 group-hover:opacity-100"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div>
              <div className="border-t border-slate-100 bg-slate-50/30 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Current page: {pendingCount} Pending | {resolvedCount} Resolved
              </div>
              <PaginationControls
                page={pages.approvalRequests}
                noun="Requests"
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
