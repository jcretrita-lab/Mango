import { Injectable, NotFoundException } from '@nestjs/common';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import {
  type ReadAllOptions,
  type ReadResourceDefinition,
} from '../../common/api/read-resource.types';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';

export type PersonnelResourceKey =
  | 'employees'
  | 'employments'
  | 'employeeProfiles'
  | 'educationRecords'
  | 'examRecords'
  | 'employmentHistoryRecords'
  | 'referenceContacts'
  | 'familyMembers'
  | 'emergencyContacts'
  | 'pisTabs'
  | 'pisFields'
  | 'pisFieldOptions'
  | 'pisFieldPolicies'
  | 'employeeFieldValues'
  | 'employeeFieldValueHistories'
  | 'employeeOnboardingRecords'
  | 'employeeOffboardingRecords'
  | 'employeeLoaRecords'
  | 'pafRecords'
  | 'employeeProfileHistories';

const employeeSelfReadPermission = PERMISSION_CODES.PERSONNEL_SELF_READ;

const resources = {
  employees: {
    model: 'employee',
    label: 'Employee',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'id' },
    searchFields: [
      'firstName',
      'lastName',
      'displayName',
      'email',
      'employeeNumber',
    ],
    filterFields: [
      'status',
      'jobType',
      { query: 'department', field: 'orgUnitJson', jsonPath: ['department'] },
    ],
  },
  employments: {
    model: 'employment',
    label: 'Employment',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
  },
  employeeProfiles: {
    model: 'employeeProfile',
    label: 'Employee profile',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
  },
  educationRecords: {
    model: 'educationRecord',
    label: 'Education record',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
  },
  examRecords: {
    model: 'examRecord',
    label: 'Exam record',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
  },
  employmentHistoryRecords: {
    model: 'employmentHistoryRecord',
    label: 'Employment history record',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
  },
  referenceContacts: {
    model: 'referenceContact',
    label: 'Reference contact',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
    searchFields: ['firstName', 'lastName', 'business'],
  },
  familyMembers: {
    model: 'familyMember',
    label: 'Family member',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
  },
  emergencyContacts: {
    model: 'emergencyContact',
    label: 'Emergency contact',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
    searchFields: ['firstName', 'lastName'],
  },
  pisTabs: {
    model: 'pisTab',
    label: 'PIS tab',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    searchFields: ['name', 'code'],
  },
  pisFields: {
    model: 'pisField',
    label: 'PIS field',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    searchFields: ['label', 'code'],
  },
  pisFieldOptions: {
    model: 'pisFieldOption',
    label: 'PIS field option',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
  },
  pisFieldPolicies: {
    model: 'pisFieldPolicy',
    label: 'PIS field policy',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
  },
  employeeFieldValues: {
    model: 'employeeFieldValue',
    label: 'Employee field value',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
  },
  employeeFieldValueHistories: {
    model: 'employeeFieldValueHistory',
    label: 'Employee field value history',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
  },
  employeeOnboardingRecords: {
    model: 'employeeOnboardingRecord',
    label: 'Employee onboarding record',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
  },
  employeeOffboardingRecords: {
    model: 'employeeOffboardingRecord',
    label: 'Employee offboarding record',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
  },
  employeeLoaRecords: {
    model: 'employeeLoaRecord',
    label: 'Employee LOA record',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
  },
  pafRecords: {
    model: 'pafRecord',
    label: 'PAF record',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
    searchFields: ['actionType', 'status'],
    filterFields: [
      { query: 'employeeId', field: 'employeeId', type: 'number' },
      { query: 'approvalSetupId', field: 'approvalSetupId', type: 'number' },
      {
        query: 'approvalRequestId',
        field: 'approvalRequestId',
        type: 'number',
      },
      'actionType',
      'status',
    ],
  },
  employeeProfileHistories: {
    model: 'employeeProfileHistory',
    label: 'Employee profile history',
    readPermission: PERMISSION_CODES.PERSONNEL_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
  },
} as const satisfies Record<PersonnelResourceKey, ReadResourceDefinition>;

const resourceKeyByPath: Readonly<Record<string, PersonnelResourceKey>> = {
  employees: 'employees',
  employments: 'employments',
  'employee-profiles': 'employeeProfiles',
  'education-records': 'educationRecords',
  'exam-records': 'examRecords',
  'employment-history-records': 'employmentHistoryRecords',
  'reference-contacts': 'referenceContacts',
  'family-members': 'familyMembers',
  'emergency-contacts': 'emergencyContacts',
  'pis-tabs': 'pisTabs',
  'pis-fields': 'pisFields',
  'pis-field-options': 'pisFieldOptions',
  'pis-field-policies': 'pisFieldPolicies',
  'employee-field-values': 'employeeFieldValues',
  'employee-field-value-histories': 'employeeFieldValueHistories',
  'employee-field-value-history': 'employeeFieldValueHistories',
  'employee-onboarding-records': 'employeeOnboardingRecords',
  'employee-offboarding-records': 'employeeOffboardingRecords',
  'employee-loa-records': 'employeeLoaRecords',
  'paf-records': 'pafRecords',
  'employee-profile-histories': 'employeeProfileHistories',
  'employee-profile-history': 'employeeProfileHistories',
};

@Injectable()
export class PersonnelReadService {
  constructor(private readonly readService: ReadResourceService) {}

  findAll(
    resourceKey: PersonnelResourceKey,
    options: ReadAllOptions,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findAll(resources[resourceKey], options, actor);
  }

  findOne(
    resourceKey: PersonnelResourceKey,
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findOne(resources[resourceKey], id, actor);
  }

  rejectGenericMutation(resourceKey: PersonnelResourceKey): never {
    return this.readService.rejectGenericMutation(resources[resourceKey].label);
  }

  rejectGenericMutationByPath(resourcePath: string): never {
    const resourceKey = resourceKeyByPath[resourcePath];

    if (!resourceKey) {
      throw new NotFoundException(
        `Personnel resource ${resourcePath} was not found.`,
      );
    }

    return this.rejectGenericMutation(resourceKey);
  }
}
