import { Module } from '@nestjs/common';
import { createCrudModuleMetadata } from '../../common/crud/crud.module-metadata';
import { getCrudToken } from '../../common/crud/crud.types';
import type { CrudResourceDefinition } from '../../common/crud/crud.types';
import { EmployeesService } from './employees.service';

const employeeSelfReadRoles = ['Superadmin', 'Approver', 'Employee'] as const;

const resources = [
  {
    path: 'employees',
    model: 'employee',
    label: 'Employee',
    readRoles: employeeSelfReadRoles,
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
  {
    path: 'employments',
    model: 'employment',
    label: 'Employment',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
  {
    path: 'employee-profiles',
    model: 'employeeProfile',
    label: 'Employee profile',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
  {
    path: 'education-records',
    model: 'educationRecord',
    label: 'Education record',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
  {
    path: 'exam-records',
    model: 'examRecord',
    label: 'Exam record',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
  {
    path: 'employment-history-records',
    model: 'employmentHistoryRecord',
    label: 'Employment history record',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
  {
    path: 'reference-contacts',
    model: 'referenceContact',
    label: 'Reference contact',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
    searchFields: ['firstName', 'lastName', 'business'],
  },
  {
    path: 'family-members',
    model: 'familyMember',
    label: 'Family member',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
  {
    path: 'emergency-contacts',
    model: 'emergencyContact',
    label: 'Emergency contact',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
    searchFields: ['firstName', 'lastName'],
  },
  {
    path: 'pis-tabs',
    model: 'pisTab',
    label: 'PIS tab',
    searchFields: ['name', 'code'],
  },
  {
    path: 'pis-fields',
    model: 'pisField',
    label: 'PIS field',
    searchFields: ['label', 'code'],
  },
  {
    path: 'pis-field-options',
    model: 'pisFieldOption',
    label: 'PIS field option',
  },
  {
    path: 'pis-field-policies',
    model: 'pisFieldPolicy',
    label: 'PIS field policy',
  },
  {
    path: 'employee-field-values',
    model: 'employeeFieldValue',
    label: 'Employee field value',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
  {
    path: 'employee-field-value-histories',
    aliases: ['employee-field-value-history'],
    model: 'employeeFieldValueHistory',
    label: 'Employee field value history',
  },
  {
    path: 'employee-onboarding-records',
    model: 'employeeOnboardingRecord',
    label: 'Employee onboarding record',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
  {
    path: 'employee-offboarding-records',
    model: 'employeeOffboardingRecord',
    label: 'Employee offboarding record',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
  {
    path: 'employee-loa-records',
    model: 'employeeLoaRecord',
    label: 'Employee LOA record',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
  {
    path: 'paf-records',
    model: 'pafRecord',
    label: 'PAF record',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
  {
    path: 'employee-profile-histories',
    aliases: ['employee-profile-history'],
    model: 'employeeProfileHistory',
    label: 'Employee profile history',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
] as const satisfies readonly CrudResourceDefinition[];

const metadata = createCrudModuleMetadata('personnel', resources);

@Module({
  ...metadata,
  providers: [
    ...(metadata.providers ?? []),
    EmployeesService,
    {
      provide: getCrudToken('personnel', 'employee'),
      useExisting: EmployeesService,
    },
  ],
})
export class PersonnelModule {}
