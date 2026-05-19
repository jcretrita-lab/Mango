import { PrismaClient } from '@prisma/client';
import { seedData } from './dummy-data';

const prisma = new PrismaClient();
const fixtureTableNames = [
  'Role',
  'Permission',
  'SystemModule',
  'PermissionModuleConfig',
  'PermissionModuleConfigScope',
  'PermissionModuleConfigAction',
  'PermissionModuleConfigState',
  'RolePermissionAssignment',
  'ApprovalSetup',
] as const;

function withoutId<T extends { id: number }>(value: T): Omit<T, 'id'> {
  const { id: _id, ...rest } = value;
  return rest;
}

function moduleCodeForPermission(code: string): string {
  if (code.startsWith('ORG_')) {
    return 'ORG_STRUCTURE';
  }
  if (code.startsWith('PERSONNEL_')) {
    return 'PERSONNEL';
  }
  if (code.startsWith('PAY_STRUCTURE_')) {
    return 'PAY_STRUCTURE';
  }
  if (code.startsWith('APPROVALS_')) {
    return 'APPROVALS';
  }
  if (code.startsWith('RBAC_')) {
    return 'RBAC';
  }

  throw new Error(`No module mapping for permission ${code}.`);
}

async function resetFixtureSequences(): Promise<void> {
  for (const tableName of fixtureTableNames) {
    await prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('"${tableName}"', 'id'),
        COALESCE((SELECT MAX("id") FROM "${tableName}"), 1),
        (SELECT COUNT(*) FROM "${tableName}") > 0
      )
    `);
  }
}

async function seedFixtures(): Promise<void> {
  await resetFixtureSequences();

  for (const role of seedData.roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      create: withoutId(role),
      update: {
        name: role.name,
        description: role.description,
        status: 'ACTIVE',
      },
    });
  }

  for (const permission of seedData.permissions) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      create: withoutId(permission),
      update: {
        name: permission.name,
        description: permission.description,
        status: 'ACTIVE',
      },
    });
  }

  for (const systemModule of seedData.systemModules) {
    await prisma.systemModule.upsert({
      where: { code: systemModule.code },
      create: withoutId(systemModule),
      update: {
        name: systemModule.name,
        description: systemModule.description,
      },
    });
  }

  const systemModules = await prisma.systemModule.findMany();
  const systemModuleIdByCode = new Map(
    systemModules.map((systemModule) => [systemModule.code, systemModule.id]),
  );

  for (const config of seedData.permissionModuleConfigs) {
    const seededModule = seedData.systemModules.find(
      (systemModule) => systemModule.id === config.systemModuleId,
    );
    const systemModuleId = seededModule
      ? systemModuleIdByCode.get(seededModule.code)
      : undefined;

    if (!systemModuleId) {
      throw new Error(`Missing system module for config ${config.code}.`);
    }

    await prisma.permissionModuleConfig.upsert({
      where: { code: config.code },
      create: { ...withoutId(config), systemModuleId },
      update: {
        systemModuleId,
        name: config.name,
        description: config.description,
      },
    });
  }

  const moduleConfigs = await prisma.permissionModuleConfig.findMany();
  const moduleConfigIdBySeedId = new Map(
    seedData.permissionModuleConfigs.map((config) => [
      config.id,
      moduleConfigs.find((stored) => stored.code === config.code)?.id,
    ]),
  );

  for (const scope of seedData.permissionModuleConfigScopes) {
    const permissionModuleConfigId = moduleConfigIdBySeedId.get(
      scope.permissionModuleConfigId,
    );

    if (!permissionModuleConfigId) {
      throw new Error(`Missing permission module config for scope ${scope.code}.`);
    }

    await prisma.permissionModuleConfigScope.upsert({
      where: { code: scope.code },
      create: { ...withoutId(scope), permissionModuleConfigId },
      update: {
        permissionModuleConfigId,
        name: scope.name,
      },
    });
  }

  for (const action of seedData.permissionModuleConfigActions) {
    const permissionModuleConfigId = moduleConfigIdBySeedId.get(
      action.permissionModuleConfigId,
    );

    if (!permissionModuleConfigId) {
      throw new Error(
        `Missing permission module config for action ${action.code}.`,
      );
    }

    await prisma.permissionModuleConfigAction.upsert({
      where: { code: action.code },
      create: { ...withoutId(action), permissionModuleConfigId },
      update: {
        permissionModuleConfigId,
        name: action.name,
      },
    });
  }

  for (const state of seedData.permissionModuleConfigStates) {
    const permissionModuleConfigId = moduleConfigIdBySeedId.get(
      state.permissionModuleConfigId,
    );

    if (!permissionModuleConfigId) {
      throw new Error(`Missing permission module config for state ${state.code}.`);
    }

    await prisma.permissionModuleConfigState.upsert({
      where: { code: state.code },
      create: { ...withoutId(state), permissionModuleConfigId },
      update: {
        permissionModuleConfigId,
        name: state.name,
      },
    });
  }

  const [roles, permissions] = await Promise.all([
    prisma.role.findMany(),
    prisma.permission.findMany(),
  ]);
  const roleIdBySeedId = new Map(
    seedData.roles.map((role) => [
      role.id,
      roles.find((stored) => stored.code === role.code)?.id,
    ]),
  );
  const permissionBySeedId = new Map(
    seedData.permissions.map((permission) => [
      permission.id,
      permissions.find((stored) => stored.code === permission.code),
    ]),
  );

  for (const assignment of seedData.rolePermissionAssignments) {
    const roleId = roleIdBySeedId.get(assignment.roleId);
    const permission = permissionBySeedId.get(assignment.permissionId);
    const systemModuleId = permission
      ? systemModuleIdByCode.get(moduleCodeForPermission(permission.code))
      : undefined;

    if (!roleId || !permission || !systemModuleId) {
      throw new Error('Unable to resolve role-permission fixture assignment.');
    }

    const existingAssignment = await prisma.rolePermissionAssignment.findFirst({
      where: {
        roleId,
        permissionId: permission.id,
        systemModuleId,
      },
    });

    if (existingAssignment) {
      await prisma.rolePermissionAssignment.update({
        where: { id: existingAssignment.id },
        data: { isActive: true },
      });
      continue;
    }

    await prisma.rolePermissionAssignment.create({
      data: {
        roleId,
        permissionId: permission.id,
        systemModuleId,
        isActive: true,
      },
    });
  }

  for (const approvalSetup of seedData.approvalSetups) {
    await prisma.approvalSetup.upsert({
      where: { code: approvalSetup.code },
      create: withoutId(approvalSetup),
      update: {
        name: approvalSetup.name,
        moduleKey: approvalSetup.moduleKey,
        actionType: approvalSetup.actionType,
        description: approvalSetup.description,
        status: 'ACTIVE',
      },
    });
  }

  await resetFixtureSequences();
}

async function main(): Promise<void> {
  try {
    await seedFixtures();
    console.log('Production-safe Phase 1 fixtures seeded.');
  } catch (error) {
    console.error('Fixture seed failed.', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
