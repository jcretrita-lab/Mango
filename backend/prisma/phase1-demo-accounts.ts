import { MOCK_EMPLOYEES } from './source/unified-hris/data/corporateMockData';

export type PhaseOneRole = 'Superadmin' | 'Approver' | 'Employee';

export interface PhaseOneDemoAccount {
  key: 'superadmin' | 'approver' | 'employee';
  userId: number;
  employeeId?: number;
  role: PhaseOneRole;
  email: string;
  displayName: string;
  description: string;
}

export const PHASE1_DEMO_PASSWORD = 'DiwaPhase1!';

function toSeedEmail(email: string): string {
  return email.replace(/@.+$/, '@diwalearning.local');
}

function findEmployeeIndex(
  predicate: (employee: (typeof MOCK_EMPLOYEES)[number]) => boolean,
  label: string,
): number {
  const index = MOCK_EMPLOYEES.findIndex(predicate);

  if (index < 0) {
    throw new Error(`Unable to locate ${label} demo account source employee.`);
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

export const PHASE1_DEMO_ACCOUNTS: readonly PhaseOneDemoAccount[] = [
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
    employeeId: approverIndex + 1,
    role: 'Approver',
    email: toSeedEmail(approverSourceEmployee.email),
    displayName: approverSourceEmployee.name,
    description: 'Functional approver for personnel and compensation workflows.',
  },
  {
    key: 'employee',
    userId: 9,
    employeeId: employeeIndex + 1,
    role: 'Employee',
    email: toSeedEmail(employeeSourceEmployee.email),
    displayName: employeeSourceEmployee.name,
    description: 'Regular employee self-service account for Phase 1 validation.',
  },
] as const;

export const PHASE1_DEMO_ACCOUNT_MAP = Object.fromEntries(
  PHASE1_DEMO_ACCOUNTS.map((account) => [account.key, account]),
) as Record<PhaseOneDemoAccount['key'], PhaseOneDemoAccount>;
