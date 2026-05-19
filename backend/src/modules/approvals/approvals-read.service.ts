import { Injectable, NotFoundException } from '@nestjs/common';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import {
  type ReadAllOptions,
  type ReadResourceDefinition,
} from '../../common/api/read-resource.types';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';

export type ApprovalsResourceKey =
  | 'approvalSetups'
  | 'approverSequences'
  | 'approvalSequenceSecondaryApprovers'
  | 'approvalDelegations'
  | 'workflowAssignments'
  | 'approvalRequests'
  | 'approvalWorkflows'
  | 'approvalWorkflowNotes';

const resources = {
  approvalSetups: {
    model: 'approvalSetup',
    label: 'Approval setup',
    readPermission: PERMISSION_CODES.APPROVALS_READ,
  },
  approverSequences: {
    model: 'approverSequence',
    label: 'Approver sequence',
    readPermission: PERMISSION_CODES.APPROVALS_READ,
  },
  approvalSequenceSecondaryApprovers: {
    model: 'approvalSequenceSecondaryApprover',
    label: 'Approval sequence secondary approver',
    readPermission: PERMISSION_CODES.APPROVALS_READ,
  },
  approvalDelegations: {
    model: 'approvalDelegation',
    label: 'Approval delegation',
    readPermission: PERMISSION_CODES.APPROVALS_READ,
  },
  workflowAssignments: {
    model: 'workflowAssignment',
    label: 'Workflow assignment',
    readPermission: PERMISSION_CODES.APPROVALS_READ,
  },
  approvalRequests: {
    model: 'approvalRequest',
    label: 'Approval request',
    readPermission: PERMISSION_CODES.APPROVALS_READ,
    selfReadPermission: PERMISSION_CODES.APPROVALS_SELF_READ,
    employeeReadScope: { field: 'employeeId' },
    searchFields: ['referenceType', 'status'],
    filterFields: ['status', 'referenceType'],
  },
  approvalWorkflows: {
    model: 'approvalWorkflow',
    label: 'Approval workflow',
    readPermission: PERMISSION_CODES.APPROVALS_READ,
  },
  approvalWorkflowNotes: {
    model: 'approvalWorkflowNote',
    label: 'Approval workflow note',
    readPermission: PERMISSION_CODES.APPROVALS_READ,
  },
} as const satisfies Record<ApprovalsResourceKey, ReadResourceDefinition>;

const resourceKeyByPath: Readonly<Record<string, ApprovalsResourceKey>> = {
  'approval-setups': 'approvalSetups',
  'approver-sequences': 'approverSequences',
  'approval-sequence-secondary-approvers': 'approvalSequenceSecondaryApprovers',
  'approval-delegations': 'approvalDelegations',
  'workflow-assignments': 'workflowAssignments',
  'approval-requests': 'approvalRequests',
  'approval-workflows': 'approvalWorkflows',
  'approval-workflow-notes': 'approvalWorkflowNotes',
};

@Injectable()
export class ApprovalsReadService {
  constructor(private readonly readService: ReadResourceService) {}

  findAll(
    resourceKey: ApprovalsResourceKey,
    options: ReadAllOptions,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findAll(resources[resourceKey], options, actor);
  }

  findOne(
    resourceKey: ApprovalsResourceKey,
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findOne(resources[resourceKey], id, actor);
  }

  rejectGenericMutation(resourceKey: ApprovalsResourceKey): never {
    return this.readService.rejectGenericMutation(resources[resourceKey].label);
  }

  rejectGenericMutationByPath(resourcePath: string): never {
    const resourceKey = resourceKeyByPath[resourcePath];

    if (!resourceKey) {
      throw new NotFoundException(
        `Approvals resource ${resourcePath} was not found.`,
      );
    }

    return this.rejectGenericMutation(resourceKey);
  }
}
