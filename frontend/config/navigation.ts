import {
  Building2,
  CheckSquare,
  ClipboardList,
  LayoutDashboard,
  LayoutGrid,
  Lock,
  type LucideIcon,
  ShieldAlert,
  ShieldCheck,
  UserCircle,
  UserCog,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import type { User, UserRole } from '../types';

type SearchItemType = 'Page' | 'Setting';

export interface SearchItem {
  id: string;
  path: string;
  title: string;
  type: SearchItemType;
}

export interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
  profileTab?: string;
}

export interface NavigationSection {
  section: string;
  items: NavigationItem[];
  icon?: LucideIcon;
  isCollapsible?: boolean;
}

function createItem(
  icon: LucideIcon,
  label: string,
  path: string,
  options?: Pick<NavigationItem, 'profileTab'>,
): NavigationItem {
  return {
    icon,
    label,
    path,
    ...options,
  };
}

function createSection(
  section: string,
  items: NavigationItem[],
  options?: Pick<NavigationSection, 'icon' | 'isCollapsible'>,
): NavigationSection {
  return {
    section,
    items,
    isCollapsible: true,
    ...options,
  };
}

function createEmployeePrimaryNavigation(employeeBasePath: string): NavigationSection[] {
  return [
    createSection(
      'My Workspace',
      [
        createItem(UserCircle, 'Profile', `${employeeBasePath}?tab=Profile`, { profileTab: 'Profile' }),
        createItem(LayoutGrid, 'Pay Profile', `${employeeBasePath}?tab=Pay%20Profile`, { profileTab: 'Pay Profile' }),
        createItem(ClipboardList, 'Action Forms', `${employeeBasePath}?tab=Personnel%20Action%20Form`, {
          profileTab: 'Personnel Action Form',
        }),
      ],
      { icon: UserCircle, isCollapsible: false },
    ),
  ];
}

function toSearchItems(sections: NavigationSection[]): SearchItem[] {
  const uniqueItems = new Map<string, SearchItem>();

  sections.flatMap((section) => section.items).forEach((item) => {
    const type: SearchItemType = item.path.startsWith('/settings/') ? 'Setting' : 'Page';

    if (!uniqueItems.has(item.path)) {
      uniqueItems.set(item.path, {
        id: item.path,
        path: item.path,
        title: item.label,
        type,
      });
    }
  });

  return [...uniqueItems.values()].sort((left, right) => left.title.localeCompare(right.title));
}

const HOME_SECTION = createSection(
  'Home',
  [createItem(LayoutDashboard, 'Dashboard', '/dashboard')],
  { isCollapsible: false },
);

const ORGANIZATION_AND_PEOPLE_SECTION = createSection(
  'Organization & People',
  [
    createItem(Users, 'Employee Directory', '/manage/employee'),
    createItem(UserPlus, 'Onboarding', '/manage/employee/onboarding'),
    createItem(UserMinus, 'Offboarding', '/manage/employee/offboarding'),
    createItem(ClipboardList, 'Personnel Action Forms', '/manage/paf'),
  ],
  { icon: Users },
);

const APPROVER_TASKS_SECTION = createSection(
  'Tasks & Team',
  [
    createItem(CheckSquare, 'Pending Approvals', '/monitor/approvals'),
    createItem(Users, 'Employee Directory', '/manage/employee'),
  ],
  { icon: CheckSquare },
);

const PAY_STRUCTURE_SECTION = createSection(
  'Payroll & Compensation',
  [createItem(LayoutGrid, 'Pay Structure', '/manage/pay-structure')],
  { icon: LayoutGrid },
);

const SETTINGS_OVERVIEW_SECTION = createSection(
  'Overview',
  [createItem(ShieldCheck, 'Settings Overview', '/settings/overview')],
  { icon: ShieldCheck, isCollapsible: false },
);

const SYSTEM_ADMIN_SETTINGS_SECTION = createSection(
  'System Administration',
  [
    createItem(UserCog, 'Users', '/settings/users'),
    createItem(ShieldCheck, 'Roles', '/settings/roles'),
    createItem(Lock, 'Permissions', '/settings/permissions'),
  ],
  { icon: UserCog },
);

const ORG_AND_PAY_SETTINGS_SECTION = createSection(
  'Organization & Pay',
  [
    createItem(Building2, 'Org Structure', '/settings/structure'),
    createItem(ShieldCheck, 'Ranks', '/settings/ranks'),
    createItem(ClipboardList, 'Employee Tabs & Fields', '/settings/employee-fields'),
    createItem(ShieldAlert, 'Approval Setup', '/settings/approvals'),
    createItem(LayoutGrid, 'Salary Grade', '/settings/salary-grade'),
    createItem(UserCog, 'Position Template', '/settings/position-templates'),
  ],
  { icon: Building2 },
);

const SUPERADMIN_PRIMARY_NAV = [
  HOME_SECTION,
  ORGANIZATION_AND_PEOPLE_SECTION,
  PAY_STRUCTURE_SECTION,
  APPROVER_TASKS_SECTION,
];

const APPROVER_PRIMARY_NAV = [HOME_SECTION, APPROVER_TASKS_SECTION];

const SUPERADMIN_SETTINGS_NAV = [
  SETTINGS_OVERVIEW_SECTION,
  SYSTEM_ADMIN_SETTINGS_SECTION,
  ORG_AND_PAY_SETTINGS_SECTION,
];

export function isApproverRole(role?: UserRole | null): boolean {
  return role === 'Approver';
}

export function getPrimaryNavigation(
  role: User['role'] | null | undefined,
  employeeBasePath: string,
): NavigationSection[] {
  switch (role) {
    case 'Superadmin':
      return SUPERADMIN_PRIMARY_NAV;
    case 'Approver':
      return APPROVER_PRIMARY_NAV;
    case 'Employee':
      return createEmployeePrimaryNavigation(employeeBasePath);
    default:
      return [];
  }
}

export function getSettingsNavigation(role: User['role'] | null | undefined): NavigationSection[] {
  return role === 'Superadmin' ? SUPERADMIN_SETTINGS_NAV : [];
}

export function canAccessSettingsNavigation(role: User['role'] | null | undefined): boolean {
  return role === 'Superadmin';
}

export function getSearchItems(
  role: User['role'] | null | undefined,
  employeeBasePath: string,
): SearchItem[] {
  return toSearchItems([
    ...getPrimaryNavigation(role, employeeBasePath),
    ...getSettingsNavigation(role),
  ]);
}
