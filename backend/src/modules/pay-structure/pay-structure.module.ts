import { Module } from '@nestjs/common';
import { createCrudModuleMetadata } from '../../common/crud/crud.module-metadata';
import type { CrudResourceDefinition } from '../../common/crud/crud.types';

const employeeSelfReadRoles = ['Superadmin', 'Approver', 'Employee'] as const;

const resources = [
  { path: 'salary-grades', model: 'salaryGrade', label: 'Salary grade' },
  {
    path: 'salary-grade-steps',
    model: 'salaryGradeStep',
    label: 'Salary grade step',
  },
  {
    path: 'earning-template-families',
    model: 'earningTemplateFamily',
    label: 'Earning template family',
  },
  {
    path: 'earning-template-family-scopes',
    model: 'earningTemplateFamilyScope',
    label: 'Earning template family scope',
  },
  {
    path: 'earning-template-revisions',
    model: 'earningTemplateRevision',
    label: 'Earning template revision',
  },
  {
    path: 'earning-template-revision-lines',
    model: 'earningTemplateRevisionLine',
    label: 'Earning template revision line',
  },
  {
    path: 'earning-components',
    model: 'earningComponent',
    label: 'Earning component',
  },
  { path: 'formulas', model: 'formula', label: 'Formula' },
  {
    path: 'formula-versions',
    model: 'formulaVersion',
    label: 'Formula version',
  },
  {
    path: 'employee-pay-profiles',
    model: 'employeePayProfile',
    label: 'Employee pay profile',
    readRoles: employeeSelfReadRoles,
    employeeReadScope: { field: 'employeeId' },
  },
] as const satisfies readonly CrudResourceDefinition[];

@Module(createCrudModuleMetadata('pay-structure', resources))
export class PayStructureModule {}
