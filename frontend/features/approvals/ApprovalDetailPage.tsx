import React, { useMemo } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck,
  MessageSquare,
  UserCheck,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SectionCard,
  StatCard,
  StatusBadge,
} from '../../components/phase1/Phase1Ui';
import {
  compareDateDesc,
  formatDate,
  formatDateRange,
  formatStatusLabel,
  type ApprovalRequestRecord,
  type ApprovalSetupRecord,
  type ApprovalWorkflowNoteRecord,
  type ApprovalWorkflowRecord,
  type ApproverSequenceRecord,
  type EmployeePayProfileRecord,
  type EmployeeRecord,
  type PafRecord,
  type UserRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';
import { InfoGrid } from '../personnel/components/EmployeeProfileComponents';

export default function ApprovalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { status, data, errorMessage, refresh } = useApiQueries(
    {
      approvalRequests: '/approvals/approval-requests',
      approvalWorkflows: '/approvals/approval-workflows',
      approvalWorkflowNotes: '/approvals/approval-workflow-notes',
      approvalSetups: '/approvals/approval-setups',
      approverSequences: '/approvals/approver-sequences',
      employees: '/personnel/employees',
      users: '/rbac/users',
      pafRecords: '/personnel/paf-records',
      payProfiles: '/pay-structure/employee-pay-profiles',
    },
    { enabled: Boolean(id) },
  );

  const view = useMemo(() => {
    const approvalRequests = data.approvalRequests as ApprovalRequestRecord[] ?? [];
    const approvalWorkflows = data.approvalWorkflows as ApprovalWorkflowRecord[] ?? [];
    const approvalWorkflowNotes = data.approvalWorkflowNotes as ApprovalWorkflowNoteRecord[] ?? [];
    const approvalSetups = data.approvalSetups as ApprovalSetupRecord[] ?? [];
    const approverSequences = data.approverSequences as ApproverSequenceRecord[] ?? [];
    const employees = data.employees as EmployeeRecord[] ?? [];
    const users = data.users as UserRecord[] ?? [];
    const pafRecords = data.pafRecords as PafRecord[] ?? [];
    const payProfiles = data.payProfiles as EmployeePayProfileRecord[] ?? [];

    const request = approvalRequests.find((item) => String(item.id) === id);

    if (!request) {
      return null;
    }

    const approvalSetup = approvalSetups.find((setup) => setup.id === request.approvalSetupId);
    const employee = request.employeeId
      ? employees.find((record) => record.id === request.employeeId)
      : undefined;
    const requester = request.requestedByUserId
      ? users.find((record) => record.id === request.requestedByUserId)
      : undefined;
    const relatedRecord =
      request.referenceType === 'PAF_RECORD'
        ? pafRecords.find((record) => record.id === request.referenceId)
        : request.referenceType === 'EMPLOYEE_PAY_PROFILE'
          ? payProfiles.find((record) => record.id === request.referenceId)
          : undefined;

    const workflowSteps = approvalWorkflows
      .filter((workflow) => workflow.approvalRequestId === request.id)
      .map((workflow) => ({
        workflow,
        sequence: approverSequences.find((sequence) => sequence.id === workflow.approverSequenceId),
        approver: workflow.approverUserId
          ? users.find((record) => record.id === workflow.approverUserId)
          : undefined,
        notes: approvalWorkflowNotes
          .filter((note) => note.approvalWorkflowId === workflow.id)
          .map((note) => ({
            note,
            author: note.authorUserId ? users.find((record) => record.id === note.authorUserId) : undefined,
          }))
          .sort((left, right) => compareDateDesc(left.note.createdAt, right.note.createdAt)),
      }))
      .sort((left, right) => (left.sequence?.stepNo ?? 0) - (right.sequence?.stepNo ?? 0));

    return {
      request,
      approvalSetup,
      employee,
      requester,
      relatedRecord,
      workflowSteps,
    };
  }, [data, id]);

  usePageTitle(view ? `Approval #${view.request.id}` : 'Approval Detail');

  if (!id) {
    return (
      <EmptyState
        title="Approval request is missing"
        description="No approval identifier was provided for the detail route."
      />
    );
  }

  if (status === 'loading') {
    return <LoadingState description="Loading seeded approval detail, workflow routing, and notes." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Approval detail is unavailable"
        description={errorMessage ?? 'The approval detail page could not reach the backend.'}
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

  if (!view) {
    return (
      <EmptyState
        title="Approval request not found"
        description="The requested approval id does not exist in the seeded approval dataset."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/monitor/approvals')}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back to Approvals
        </button>
      </div>

      <PageHeader
        eyebrow="Approval Engine"
        title={`Approval #${view.request.id}`}
        description="This detail route now renders the actual seeded approval request, its workflow trail, and workflow notes."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Request Status" value={formatStatusLabel(view.request.status)} helper={view.approvalSetup?.name ?? 'No approval setup'} icon={FileCheck} accent="indigo" />
        <StatCard label="Workflow Steps" value={view.workflowSteps.length} helper="Total routed approvers" icon={UserCheck} accent="blue" />
        <StatCard label="Submitted" value={formatDate(view.request.submittedAt)} helper="Request creation window" icon={Clock3} accent="amber" />
        <StatCard label="Resolved" value={view.request.resolvedAt ? formatDate(view.request.resolvedAt) : 'Open'} helper="Final resolution date" icon={CheckCircle2} accent={view.request.resolvedAt ? 'emerald' : 'amber'} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <SectionCard title="Request Summary" description="The request metadata below is joined from the seeded approval and related domain records.">
          <InfoGrid
            items={[
              ['Employee', view.employee?.displayName ?? '—'],
              ['Requester', view.requester?.displayName ?? '—'],
              ['Reference Type', formatStatusLabel(view.request.referenceType)],
              ['Reference Record', view.relatedRecord ? `#${view.request.referenceId}` : `#${view.request.referenceId}`],
              ['Setup', view.approvalSetup?.name ?? '—'],
              ['Submitted', formatDate(view.request.submittedAt)],
              ['Resolved', formatDate(view.request.resolvedAt)],
              ['Lifecycle', formatDateRange(view.request.submittedAt, view.request.resolvedAt)],
            ]}
          />
        </SectionCard>

        <SectionCard title="Workflow Trail" description="Every routed step is shown below with the seeded approver assignment, current status, and comments.">
          <div className="space-y-4">
            {view.workflowSteps.map(({ workflow, sequence, approver, notes }) => (
              <div key={workflow.id} className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-slate-900">
                        Step {sequence?.stepNo ?? '—'} | {sequence?.name ?? 'Workflow step'}
                      </div>
                      <StatusBadge value={workflow.status} />
                    </div>
                    <div className="text-sm text-slate-600">
                      {approver?.displayName ?? 'Unassigned approver'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {workflow.comments ?? 'No workflow comment for this step.'}
                    </div>
                  </div>
                  <div className="text-right text-xs font-semibold text-slate-500">
                    <div>{workflow.actedAt ? formatDate(workflow.actedAt) : 'Awaiting action'}</div>
                    <div className="mt-1">{notes.length} note{notes.length === 1 ? '' : 's'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Workflow Notes" description="Notes are grouped from the seeded approval workflow note table and stay visible even if a workflow has no comments.">
        {view.workflowSteps.every((step) => step.notes.length === 0) ? (
          <EmptyState
            title="No workflow notes were recorded"
            description="This approval still preserves a proper empty state when there are no note entries."
          />
        ) : (
          <div className="space-y-4">
            {view.workflowSteps.flatMap((step) =>
              step.notes.map(({ note, author }) => (
                <div key={note.id} className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={15} className="text-indigo-600" />
                        <div className="text-sm font-bold text-slate-900">{author?.displayName ?? 'Workflow author'}</div>
                        <StatusBadge value={note.noteType} />
                      </div>
                      <div className="text-sm leading-6 text-slate-600">{note.note}</div>
                    </div>
                    <div className="text-right text-xs font-semibold text-slate-500">
                      {formatDate(note.createdAt)}
                    </div>
                  </div>
                </div>
              )),
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
