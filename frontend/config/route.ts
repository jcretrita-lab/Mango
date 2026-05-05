/**
 * Shared route configuration - single source of truth for URL segment labels.
 *
 * Used by:
 * - components/Breadcrumb.tsx - renders the navigation trail
 * - components/Layout.tsx - builds global search items from route paths
 *
 * Every static route segment defined in App.tsx should have an entry here.
 * Dynamic ID segments, for example ":id", are intentionally absent; they fall
 * back to "Details" in the breadcrumb and are excluded from the global search.
 */
export const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',

  // /manage/* - namespace prefix itself is hidden (see HIDDEN_SEGMENTS)
  employee: 'Employees',
  schedule: 'Schedules',
  'leave-balances': 'Leave Balances',
  'leave-request': 'Leave Request',
  payroll: 'Payroll',
  deductions: 'Deductions',
  batch: 'Batch Processing',
  'pay-schedule': 'Pay Schedule',
  'pay-structure': 'Pay Structure',
  onboarding: 'Onboard Employee',
  offboarding: 'Offboard Employee',
  'year-end-prep': 'Year-End Preparation',
  'year-end': 'Year-End',
  '13th': '13th Month Pay',
  'leave-conversion': 'Leave Conversion',
  tax: 'Tax Annualization',
  gov: 'Government Contributions',
  paf: 'Personnel Action Forms',
  'yearly-report': 'Yearly Report',
  'batch-13th': 'Batch 13th Month Pay',
  'year-end-batch-tax': 'Batch Tax Processing',

  // /monitor/* - namespace prefix itself is hidden (see HIDDEN_SEGMENTS)
  'audit-logs': 'Audit Logs',
  approvals: 'Approvals',
  notifications: 'Notifications',
  attendance: 'Attendance',
  overtime: 'Overtime',
  timekeeping: 'Timekeeping Summary',
  logs: 'Daily Time Record',
  reports: 'Reports',

  // /settings/*
  settings: 'Settings',
  overview: 'Overview',
  roles: 'Role Management',
  users: 'User Management',
  permissions: 'Permissions',
  ranks: 'Ranks',
  'position-templates': 'Position Template',
  'salary-grade': 'Salary Grade',
  structure: 'Org Structure',
  shift: 'Shifts',
  leave: 'Leaves',
  holiday: 'Holiday Management',
  policies: 'Company Policy',
  'employee-fields': 'Employee Tabs & Fields',
  adjustments: 'Adjustments',
  audit: 'Audit Logs',
  'employee-schedule': 'Employee Schedule',
  'data-migration': 'Data Migration',
};

/**
 * URL namespace segments that exist only to group routes and have no page of
 * their own. Skipped in breadcrumb rendering and ignored when building global
 * search item labels.
 */
export const HIDDEN_SEGMENTS = new Set(['manage', 'monitor', 'dtr']);
