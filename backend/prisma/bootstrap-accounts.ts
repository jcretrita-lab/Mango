import { MOCK_EMPLOYEES } from './source/unified-hris/data/corporateMockData';

export type PhaseOneRole = 'Superadmin' | 'Approver' | 'Employee';

export interface BootstrapAccount {
  key: 'superadmin' | 'approver' | 'employee';
  userId: number;
  sourceEmployeeId?: string;
  employeeId?: number;
  role: PhaseOneRole;
  email: string;
  displayName: string;
  description: string;
}

export const BOOTSTRAP_PASSWORD = 'DiwaPhase1!';

function toSeedEmail(email: string): string {
  return email.replace(/@.+$/, '@diwalearning.local');
}

function findEmployeeIndex(
  predicate: (employee: (typeof MOCK_EMPLOYEES)[number]) => boolean,
  label: string,
): number {
  const index = MOCK_EMPLOYEES.findIndex(predicate);

  if (index < 0) {
    throw new Error(`Unable to locate ${label} bootstrap account source employee.`);
  }

  return index;
}

const approverIndex = findEmployeeIndex(
  (employee) => employee.role === 'VP of HRMD',
  'approver',
);

const employeeIndex = findEmployeeIndex(
  (employee) =>
    employee.department === 'Information Technology' &&
    !/(chief|vp|manager|supervisor|director|head)/i.test(employee.role),
  'employee',
);

const approverSourceEmployee = MOCK_EMPLOYEES[approverIndex];
const employeeSourceEmployee = MOCK_EMPLOYEES[employeeIndex];

export const BOOTSTRAP_ACCOUNTS: readonly BootstrapAccount[] = [
  {
    key: 'superadmin',
    userId: 1,
    role: 'Superadmin',
    email: 'platform.admin@diwalearning.seed',
    displayName: 'Platform Admin',
    description: 'Enterprise platform owner with full Phase 1 access.',
  },
  {
    key: 'approver',
    userId: 3,
    sourceEmployeeId: approverSourceEmployee.id,
    employeeId: approverIndex + 1,
    role: 'Approver',
    email: toSeedEmail(approverSourceEmployee.email),
    displayName: approverSourceEmployee.name,
    description:
      'Functional approver for personnel and compensation workflows.',
  },
  {
    key: 'employee',
    userId: 9,
    sourceEmployeeId: employeeSourceEmployee.id,
    employeeId: employeeIndex + 1,
    role: 'Employee',
    email: toSeedEmail(employeeSourceEmployee.email),
    displayName: employeeSourceEmployee.name,
    description:
      'Regular employee self-service account for Phase 1 validation.',
  },
] as const;

export const BOOTSTRAP_ACCOUNT_MAP = Object.fromEntries(
  BOOTSTRAP_ACCOUNTS.map((account) => [account.key, account]),
) as Record<BootstrapAccount['key'], BootstrapAccount>;
