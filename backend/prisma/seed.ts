import { PrismaClient } from '@prisma/client';
import { normalizeRecordPayload } from '../src/common/payload/normalize-payload';
import type {
  CrudDelegate,
  CrudModelName,
} from '../src/common/crud/crud.types';
import { seedData } from './dummy-data';

const prisma = new PrismaClient();

type SeedDeleteDelegate = {
  deleteMany: () => Promise<unknown>;
};

const deleteOrder: readonly CrudModelName[] = [
  'employeePayProfile',
  'earningTemplateRevisionLine',
  'earningTemplateRevision',
  'earningTemplateFamilyScope',
  'earningTemplateFamily',
  'earningComponent',
  'formulaVersion',
  'formula',
  'employeeProfileHistory',
  'employeeLoaRecord',
  'pafRecord',
  'approvalWorkflowNote',
  'approvalWorkflow',
  'approvalRequest',
  'workflowAssignment',
  'approvalDelegation',
  'approvalSequenceSecondaryApprover',
  'approverSequence',
  'approvalSetup',
  'employeeOnboardingRecord',
  'employeeOffboardingRecord',
  'employeeFieldValueHistory',
  'employeeFieldValue',
  'pisFieldPolicy',
  'pisFieldOption',
  'pisField',
  'pisTab',
  'emergencyContact',
  'familyMember',
  'referenceContact',
  'employmentHistoryRecord',
  'examRecord',
  'educationRecord',
  'employeeProfile',
  'employment',
  'employee',
  'positionAssignment',
  'position',
  'positionSubLevel',
  'positionProfile',
  'positionTemplate',
  'salaryGradeStep',
  'salaryGrade',
  'rankLevel',
  'rank',
  'orgUnitVersion',
  'orgUnitClosure',
  'companyProfile',
  'orgUnit',
  'site',
  'hierarchyLevel',
  'rolePermissionAssignment',
  'userRoleAssignment',
  'permissionModuleConfigState',
  'permissionModuleConfigAction',
  'permissionModuleConfigScope',
  'permissionModuleConfig',
  'systemModule',
  'permission',
  'role',
  'userAuthToken',
  'userSession',
  'user',
];

async function resetDatabase(): Promise<void> {
  for (const model of deleteOrder) {
    const delegate = prisma[model] as unknown as SeedDeleteDelegate;
    await delegate.deleteMany();
  }
}

async function insertRows<T extends object>(
  model: CrudModelName,
  rows: readonly T[],
): Promise<void> {
  const delegate = prisma[model] as unknown as Pick<CrudDelegate, 'create'>;

  for (const row of rows) {
    await delegate.create({
      data: normalizeRecordPayload(row),
    });
  }
}

async function seed(): Promise<void> {
  await resetDatabase();

  await insertRows('user', seedData.users);
  await insertRows('role', seedData.roles);
  await insertRows('permission', seedData.permissions);
  await insertRows('systemModule', seedData.systemModules);
  await insertRows('permissionModuleConfig', seedData.permissionModuleConfigs);
  await insertRows(
    'permissionModuleConfigScope',
    seedData.permissionModuleConfigScopes,
  );
  await insertRows(
    'permissionModuleConfigAction',
    seedData.permissionModuleConfigActions,
  );
  await insertRows(
    'permissionModuleConfigState',
    seedData.permissionModuleConfigStates,
  );
  await insertRows('userRoleAssignment', seedData.userRoleAssignments);
  await insertRows(
    'rolePermissionAssignment',
    seedData.rolePermissionAssignments,
  );
  await insertRows('userSession', seedData.userSessions);
  await insertRows('userAuthToken', seedData.userAuthTokens);

  await insertRows('hierarchyLevel', seedData.hierarchyLevels);
  await insertRows('site', seedData.sites);
  // Pass 1: Insert OrgUnits without headPositionId to avoid circular dependency
  await insertRows(
    'orgUnit',
    seedData.orgUnits.map((u) => ({ ...u, headPositionId: null })),
  );
  await insertRows('companyProfile', seedData.companyProfiles);
  await insertRows('orgUnitClosure', seedData.orgUnitClosures);
  // Pass 1: Insert OrgUnitVersions without headPositionId
  await insertRows(
    'orgUnitVersion',
    seedData.orgUnitVersions.map((v) => ({ ...v, headPositionId: null })),
  );
  await insertRows('rank', seedData.ranks);
  await insertRows('rankLevel', seedData.rankLevels);
  await insertRows('salaryGrade', seedData.salaryGrades);
  await insertRows('salaryGradeStep', seedData.salaryGradeSteps);
  await insertRows('positionTemplate', seedData.positionTemplates);
  await insertRows('positionProfile', seedData.positionProfiles);
  await insertRows('positionSubLevel', seedData.positionSubLevels);
  // Pass 1: Insert Positions without supervisorPositionId
  await insertRows(
    'position',
    seedData.positions.map((p) => ({ ...p, supervisorPositionId: null })),
  );
  // Pass 1: Insert PositionAssignments without employeeId
  await insertRows(
    'positionAssignment',
    seedData.positionAssignments.map((pa) => ({ ...pa, employeeId: null })),
  );

  // Pass 1: Insert Employees without primaryPositionAssignmentId
  await insertRows(
    'employee',
    seedData.employees.map((e) => ({ ...e, primaryPositionAssignmentId: null })),
  );
  await insertRows('employment', seedData.employments);
  await insertRows('employeeProfile', seedData.employeeProfiles);
  await insertRows('educationRecord', seedData.educationRecords);
  await insertRows('examRecord', seedData.examRecords);
  await insertRows(
    'employmentHistoryRecord',
    seedData.employmentHistoryRecords,
  );
  await insertRows('referenceContact', seedData.referenceContacts);
  await insertRows('familyMember', seedData.familyMembers);
  await insertRows('emergencyContact', seedData.emergencyContacts);
  await insertRows('pisTab', seedData.pisTabs);
  await insertRows('pisField', seedData.pisFields);
  await insertRows('pisFieldOption', seedData.pisFieldOptions);
  await insertRows('pisFieldPolicy', seedData.pisFieldPolicies);
  await insertRows('employeeFieldValue', seedData.employeeFieldValues);
  await insertRows(
    'employeeFieldValueHistory',
    seedData.employeeFieldValueHistory,
  );
  await insertRows(
    'employeeOnboardingRecord',
    seedData.employeeOnboardingRecords,
  );
  await insertRows(
    'employeeOffboardingRecord',
    seedData.employeeOffboardingRecords,
  );

  await insertRows('formula', seedData.formulas);
  await insertRows('formulaVersion', seedData.formulaVersions);
  await insertRows('earningComponent', seedData.earningComponents);
  await insertRows('earningTemplateFamily', seedData.earningTemplateFamilies);
  await insertRows(
    'earningTemplateFamilyScope',
    seedData.earningTemplateFamilyScopes,
  );
  await insertRows(
    'earningTemplateRevision',
    seedData.earningTemplateRevisions,
  );
  await insertRows(
    'earningTemplateRevisionLine',
    seedData.earningTemplateRevisionLines,
  );

  await insertRows('approvalSetup', seedData.approvalSetups);
  await insertRows('approverSequence', seedData.approverSequences);
  await insertRows(
    'approvalSequenceSecondaryApprover',
    seedData.approvalSequenceSecondaryApprovers,
  );
  await insertRows('approvalDelegation', seedData.approvalDelegations);
  await insertRows('workflowAssignment', seedData.workflowAssignments);
  await insertRows('approvalRequest', seedData.approvalRequests);
  await insertRows('approvalWorkflow', seedData.approvalWorkflows);
  await insertRows('approvalWorkflowNote', seedData.approvalWorkflowNotes);

  await insertRows('pafRecord', seedData.pafRecords);
  await insertRows('employeeLoaRecord', seedData.employeeLoaRecords);
  await insertRows('employeeProfileHistory', seedData.employeeProfileHistory);
  await insertRows('employeePayProfile', seedData.employeePayProfiles);

  // Pass 2: Update OrgUnits and OrgUnitVersions with headPositionId now that Positions exist
  console.log('Updating headPositionId in OrgUnits and OrgUnitVersions...');
  for (const unit of seedData.orgUnits) {
    if (unit.headPositionId) {
      await prisma.orgUnit.update({
        where: { id: unit.id },
        data: { headPositionId: unit.headPositionId },
      });
    }
  }
  for (const version of seedData.orgUnitVersions) {
    if (version.headPositionId) {
      await prisma.orgUnitVersion.update({
        where: { id: version.id },
        data: { headPositionId: version.headPositionId },
      });
    }
  }

  // Pass 2: Update Positions with supervisorPositionId
  console.log('Updating supervisorPositionId in Positions...');
  for (const position of seedData.positions) {
    if (position.supervisorPositionId) {
      await prisma.position.update({
        where: { id: position.id },
        data: { supervisorPositionId: position.supervisorPositionId },
      });
    }
  }

  // Pass 2: Update Employees with primaryPositionAssignmentId
  console.log('Updating primaryPositionAssignmentId in Employees...');
  for (const employee of seedData.employees) {
    if (employee.primaryPositionAssignmentId) {
      await prisma.employee.update({
        where: { id: employee.id },
        data: {
          primaryPositionAssignmentId: employee.primaryPositionAssignmentId,
        },
      });
    }
  }

  // Pass 2: Update PositionAssignments with employeeId
  console.log('Updating employeeId in PositionAssignments...');
  for (const pa of seedData.positionAssignments) {
    if (pa.employeeId) {
      await prisma.positionAssignment.update({
        where: { id: pa.id },
        data: { employeeId: pa.employeeId },
      });
    }
  }
}

async function main(): Promise<void> {
  try {
    await seed();
    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seed failed.', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
