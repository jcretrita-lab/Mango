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
  type ApprovalSetupRecord,
  type ApproverSequenceRecord,
  type WorkflowAssignmentRecord,
  type OrgUnitRecord,
  type UserRecord,
  type PositionRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';
import { MiniMetric } from './components/SettingsUi';

export default function ApprovalSetupPage() {
  usePageTitle('Approval Setup');

  const { status, data, errorMessage, refresh } = useApiQueries({
    approvalSetups: '/approvals/approval-setups',
    approverSequences: '/approvals/approver-sequences',
    workflowAssignments: '/approvals/workflow-assignments',
    orgUnits: '/org-structure/org-units',
    users: '/rbac/users',
    positions: '/org-structure/positions',
  });
  const [selectedSetupId, setSelectedSetupId] = useState<number | null>(null);

  const view = useMemo(() => {
    const approvalSetups = data.approvalSetups as ApprovalSetupRecord[];
    const approverSequences = data.approverSequences as ApproverSequenceRecord[];
    const workflowAssignments = data.workflowAssignments as WorkflowAssignmentRecord[];
    const orgUnits = data.orgUnits as OrgUnitRecord[];
    const users = data.users as UserRecord[];
    const positions = data.positions as PositionRecord[];

    const setupCards = approvalSetups.map((setup) => ({
      setup,
      sequences: approverSequences
        .filter((sequence) => sequence.approvalSetupId === setup.id)
        .sort((left, right) => left.stepNo - right.stepNo),
      assignments: workflowAssignments.filter((assignment) => assignment.approvalSetupId === setup.id),
    }));

    const selectedSetup =
      setupCards.find((item) => item.setup.id === selectedSetupId) ?? setupCards[0] ?? null;

    return {
      setupCards,
      selectedSetup,
      orgUnits,
      users,
      positions,
    };
  }, [data, selectedSetupId]);

  if (status === 'loading') {
    return <LoadingState description="Loading seeded approval setups, sequences, and workflow assignments." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Approval setup is unavailable"
        description={errorMessage ?? 'The approval-setup page could not reach the backend.'}
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

  if (!view.selectedSetup) {
    return (
      <EmptyState
        title="No approval setups are available"
        description="The approval setup shell stays empty until seeded workflow definitions are present."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Approval Engine"
        title="Approval Setup"
        description="This page now renders the seeded setup catalog, approver sequences, and workflow assignment scopes used by the live approval queue."
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr,1.2fr]">
        <SectionCard title="Setup Catalog" description="Each card below is backed by a real seeded approval setup definition.">
          <div className="space-y-3">
            {view.setupCards.map((item) => (
              <button
                key={item.setup.id}
                onClick={() => setSelectedSetupId(item.setup.id)}
                className={`w-full rounded-3xl border p-5 text-left transition ${
                  view.selectedSetup?.setup.id === item.setup.id
                    ? 'border-indigo-200 bg-indigo-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{item.setup.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.setup.description ?? 'No description'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">{item.setup.moduleKey}</span>
                    <StatusBadge value={item.setup.status} />
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MiniMetric label="Steps" value={String(item.sequences.length)} />
                  <MiniMetric label="Assignments" value={String(item.assignments.length)} />
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Approver Sequence"
            description="The sequence of users, roles, or positions required to complete this workflow."
          >
            {view.selectedSetup.sequences.length === 0 ? (
              <EmptyState title="No steps configured" description="This setup has no approver sequences defined in the seed." />
            ) : (
              <div className="space-y-4">
                {view.selectedSetup.sequences.map((step) => {
                  const approverName = step.approverUserId
                    ? view.users.find((u) => u.id === step.approverUserId)?.displayName
                    : step.approverPositionId
                    ? view.positions.find((p) => p.id === step.approverPositionId)?.id
                    : 'Role Derived Approver';

                  return (
                    <div key={step.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-indigo-600 shadow-sm">
                        {step.stepNo}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">{step.name}</div>
                        <div className="text-xs text-slate-500">{approverName} | Required: {step.requiredApprovals}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Workflow Assignments"
            description="Defines the organizational scope (Unit, Position, etc.) where this setup is active."
          >
            {view.selectedSetup.assignments.length === 0 ? (
              <EmptyState title="No assignments" description="This setup is not currently assigned to any organizational scope." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {view.selectedSetup.assignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{assignment.scopeType}</div>
                      <StatusBadge value={assignment.isActive ? 'Active' : 'Inactive'} />
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">
                      {assignment.scopeType === 'OrgUnit'
                        ? view.orgUnits.find((u) => u.id === assignment.scopeRefId)?.name ?? 'All Units'
                        : `Ref ID: ${assignment.scopeRefId ?? 'Global'}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
