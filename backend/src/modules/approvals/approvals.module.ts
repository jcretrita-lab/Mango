import { Module } from '@nestjs/common';
import { createCrudModuleMetadata } from '../../common/crud/crud.module-metadata';
import type { CrudResourceDefinition } from '../../common/crud/crud.types';

const employeeSelfReadRoles = ['Superadmin', 'Approver', 'Employee'] as const;

const resources = [
  { path: 'approval-setups', model: 'approvalSetup', label: 'Approval setup' },
  {
    path: 'approver-sequences',
    model: 'approverSequence',
    label: 'Approver sequence',
  },
  {
    path: 'approval-sequence-secondary-approvers',
    model: 'approvalSequenceSecondaryApprover',
    label: 'Approval sequence secondary approver',
  },
  {
    path: 'approval-delegations',
    model: 'approvalDelegation',
    label: 'Approval delegation',
  },
  {
    path: 'workflow-assignments',
    model: 'workflowAssignment',
    label: 'Workflow assignment',
  },
  {
    path: 'approval-requests',
    model: 'approvalRequest',
    label: 'Approval request',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
    searchFields: ['referenceType', 'status'],
    filterFields: ['status', 'referenceType'],
  },
  {
    path: 'approval-workflows',
    model: 'approvalWorkflow',
    label: 'Approval workflow',
  },
  {
    path: 'approval-workflow-notes',
    model: 'approvalWorkflowNote',
    label: 'Approval workflow note',
  },
] as const satisfies readonly CrudResourceDefinition[];

import { getCrudToken } from '../../common/crud/crud.types';
import { ApprovalRequestsService } from './approval-requests.service';

const metadata = createCrudModuleMetadata('approvals', resources);

@Module({
  ...metadata,
  providers: [
    ...(metadata.providers ?? []),
    ApprovalRequestsService,
    {
      provide: getCrudToken('approvals', 'approvalRequest'),
      useExisting: ApprovalRequestsService,
    },
  ],
})
export class ApprovalsModule {}
