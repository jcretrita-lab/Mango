import { Module } from '@nestjs/common';
import { createCrudModuleMetadata } from '../../common/crud/crud.module-metadata';
import type { CrudResourceDefinition } from '../../common/crud/crud.types';

const resources = [
  {
    path: 'company-profiles',
    aliases: ['company-profile'],
    model: 'companyProfile',
    label: 'Company profile',
  },
  {
    path: 'hierarchy-levels',
    model: 'hierarchyLevel',
    label: 'Hierarchy level',
  },
  { path: 'org-units', model: 'orgUnit', label: 'Org unit' },
  {
    path: 'org-unit-closures',
    aliases: ['org-unit-closure'],
    model: 'orgUnitClosure',
    label: 'Org unit closure row',
  },
  {
    path: 'org-unit-versions',
    model: 'orgUnitVersion',
    label: 'Org unit version',
  },
  { path: 'sites', model: 'site', label: 'Site' },
  { path: 'ranks', model: 'rank', label: 'Rank' },
  { path: 'rank-levels', model: 'rankLevel', label: 'Rank level' },
  {
    path: 'position-templates',
    model: 'positionTemplate',
    label: 'Position template',
  },
  {
    path: 'position-profiles',
    model: 'positionProfile',
    label: 'Position profile',
  },
  {
    path: 'position-sub-levels',
    model: 'positionSubLevel',
    label: 'Position sub level',
  },
  { path: 'positions', model: 'position', label: 'Position' },
  {
    path: 'position-assignments',
    model: 'positionAssignment',
    label: 'Position assignment',
  },
] as const satisfies readonly CrudResourceDefinition[];

@Module(createCrudModuleMetadata('org-structure', resources))
export class OrgStructureModule {}
