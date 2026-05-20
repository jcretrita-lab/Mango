import { Injectable, NotFoundException } from '@nestjs/common';
import type { AuthenticatedRequestUser } from '../../common/auth/auth.types';
import {
  type ReadAllOptions,
  type ReadResourceDefinition,
} from '../../common/api/read-resource.types';
import { ReadResourceService } from '../../common/api/read-resource.service';
import { PERMISSION_CODES } from '../../common/constants/permissions.constants';

export type PayStructureResourceKey =
  | 'salaryGrades'
  | 'salaryGradeSteps'
  | 'earningTemplateFamilies'
  | 'earningTemplateFamilyScopes'
  | 'earningTemplateRevisions'
  | 'earningTemplateRevisionLines'
  | 'earningComponents'
  | 'formulas'
  | 'formulaVersions'
  | 'employeePayProfiles';

const employeeSelfReadPermission = PERMISSION_CODES.PAY_STRUCTURE_SELF_READ;

const resources = {
  salaryGrades: {
    model: 'salaryGrade',
    label: 'Salary grade',
    readPermission: PERMISSION_CODES.PAY_STRUCTURE_READ,
    searchFields: ['code', 'name', 'rateType'],
    filterFields: ['status', 'rateType', 'currency'],
  },
  salaryGradeSteps: {
    model: 'salaryGradeStep',
    label: 'Salary grade step',
    readPermission: PERMISSION_CODES.PAY_STRUCTURE_READ,
    searchFields: ['name'],
    filterFields: [
      { query: 'salaryGradeId', field: 'salaryGradeId', type: 'number' },
      { query: 'stepNumber', field: 'stepNumber', type: 'number' },
    ],
  },
  earningTemplateFamilies: {
    model: 'earningTemplateFamily',
    label: 'Earning template family',
    readPermission: PERMISSION_CODES.PAY_STRUCTURE_READ,
    searchFields: ['code', 'name', 'templateKind', 'description'],
    filterFields: [
      'templateKind',
      'status',
      'payBasisApplicability',
      {
        query: 'baseEarningTemplateFamilyId',
        field: 'baseEarningTemplateFamilyId',
        type: 'number',
      },
    ],
  },
  earningTemplateFamilyScopes: {
    model: 'earningTemplateFamilyScope',
    label: 'Earning template family scope',
    readPermission: PERMISSION_CODES.PAY_STRUCTURE_READ,
    searchFields: ['scopeType', 'notes'],
    filterFields: [
      {
        query: 'earningTemplateFamilyId',
        field: 'earningTemplateFamilyId',
        type: 'number',
      },
      'scopeType',
      { query: 'scopeRefId', field: 'scopeRefId', type: 'number' },
      { query: 'isPrimary', field: 'isPrimary', type: 'boolean' },
      { query: 'primary', field: 'isPrimary', type: 'boolean' },
    ],
  },
  earningTemplateRevisions: {
    model: 'earningTemplateRevision',
    label: 'Earning template revision',
    readPermission: PERMISSION_CODES.PAY_STRUCTURE_READ,
    searchFields: ['versionNo', 'currencyCode', 'changeSummary'],
    filterFields: [
      {
        query: 'earningTemplateFamilyId',
        field: 'earningTemplateFamilyId',
        type: 'number',
      },
      'currencyCode',
      { query: 'isCurrent', field: 'isCurrent', type: 'boolean' },
      { query: 'current', field: 'isCurrent', type: 'boolean' },
    ],
  },
  earningTemplateRevisionLines: {
    model: 'earningTemplateRevisionLine',
    label: 'Earning template revision line',
    readPermission: PERMISSION_CODES.PAY_STRUCTURE_READ,
    filterFields: [
      {
        query: 'earningTemplateRevisionId',
        field: 'earningTemplateRevisionId',
        type: 'number',
      },
      {
        query: 'earningComponentId',
        field: 'earningComponentId',
        type: 'number',
      },
      { query: 'isRequired', field: 'isRequired', type: 'boolean' },
    ],
  },
  earningComponents: {
    model: 'earningComponent',
    label: 'Earning component',
    readPermission: PERMISSION_CODES.PAY_STRUCTURE_READ,
    searchFields: ['code', 'name', 'category', 'valueSource', 'description'],
    filterFields: [
      'category',
      'valueSource',
      'status',
      'orgReferenceType',
      { query: 'formulaVersionId', field: 'formulaVersionId', type: 'number' },
      {
        query: 'lookupTableVersionId',
        field: 'lookupTableVersionId',
        type: 'number',
      },
      { query: 'isSystem', field: 'isSystem', type: 'boolean' },
    ],
  },
  formulas: {
    model: 'formula',
    label: 'Formula',
    readPermission: PERMISSION_CODES.PAY_STRUCTURE_READ,
    searchFields: ['code', 'name', 'expression', 'description'],
    filterFields: ['status'],
  },
  formulaVersions: {
    model: 'formulaVersion',
    label: 'Formula version',
    readPermission: PERMISSION_CODES.PAY_STRUCTURE_READ,
    searchFields: ['versionNo', 'expression', 'changeSummary'],
    filterFields: [
      { query: 'formulaId', field: 'formulaId', type: 'number' },
      { query: 'isCurrent', field: 'isCurrent', type: 'boolean' },
      { query: 'current', field: 'isCurrent', type: 'boolean' },
    ],
  },
  employeePayProfiles: {
    model: 'employeePayProfile',
    label: 'Employee pay profile',
    readPermission: PERMISSION_CODES.PAY_STRUCTURE_READ,
    selfReadPermission: employeeSelfReadPermission,
    employeeReadScope: { field: 'employeeId' },
    searchFields: ['payBasis', 'status', 'notes'],
    filterFields: [
      { query: 'employeeId', field: 'employeeId', type: 'number' },
      {
        query: 'earningTemplateFamilyId',
        field: 'earningTemplateFamilyId',
        type: 'number',
      },
      { query: 'payScheduleId', field: 'payScheduleId', type: 'number' },
      'payBasis',
      'status',
    ],
  },
} as const satisfies Record<PayStructureResourceKey, ReadResourceDefinition>;

const resourceKeyByPath: Readonly<Record<string, PayStructureResourceKey>> = {
  'salary-grades': 'salaryGrades',
  'salary-grade-steps': 'salaryGradeSteps',
  'earning-template-families': 'earningTemplateFamilies',
  'earning-template-family-scopes': 'earningTemplateFamilyScopes',
  'earning-template-revisions': 'earningTemplateRevisions',
  'earning-template-revision-lines': 'earningTemplateRevisionLines',
  'earning-components': 'earningComponents',
  formulas: 'formulas',
  'formula-versions': 'formulaVersions',
  'employee-pay-profiles': 'employeePayProfiles',
};

@Injectable()
export class PayStructureReadService {
  constructor(private readonly readService: ReadResourceService) {}

  findAll(
    resourceKey: PayStructureResourceKey,
    options: ReadAllOptions,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findAll(resources[resourceKey], options, actor);
  }

  findOne(
    resourceKey: PayStructureResourceKey,
    id: number,
    actor: AuthenticatedRequestUser | undefined,
  ) {
    return this.readService.findOne(resources[resourceKey], id, actor);
  }

  rejectGenericMutation(resourceKey: PayStructureResourceKey): never {
    return this.readService.rejectGenericMutation(resources[resourceKey].label);
  }

  rejectGenericMutationByPath(resourcePath: string): never {
    const resourceKey = resourceKeyByPath[resourcePath];

    if (!resourceKey) {
      throw new NotFoundException(
        `Pay structure resource ${resourcePath} was not found.`,
      );
    }

    return this.rejectGenericMutation(resourceKey);
  }
}
