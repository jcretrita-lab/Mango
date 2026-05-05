export type RoutePhase = 'phase1' | 'future';

export interface RoutePreviewSource {
  label: string;
  path: string;
  fields: string[];
}

export interface RoutePreview {
  summary?: string;
  sources: RoutePreviewSource[];
}

export interface ShellRoute {
  path: string;
  title: string;
  description: string;
  phase: RoutePhase;
  preview?: RoutePreview;
}

export const staticShellRoutes: ShellRoute[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Enterprise Phase 1 overview driven by seeded headcount, org design, compensation, and approvals data.',
    phase: 'phase1',
    preview: {
      summary: 'Live Phase 1 overview from the seeded personnel, org, pay, and approval datasets.',
      sources: [
        { label: 'Employees', path: '/personnel/employees', fields: ['employeeNumber', 'displayName', 'status'] },
        { label: 'Org Units', path: '/org-structure/org-units', fields: ['code', 'name', 'isActive'] },
        { label: 'Approval Requests', path: '/approvals/approval-requests', fields: ['referenceType', 'status', 'submittedAt'] },
        { label: 'Salary Grades', path: '/pay-structure/salary-grades', fields: ['code', 'name', 'status'] },
        { label: 'Template Families', path: '/pay-structure/earning-template-families', fields: ['code', 'name', 'templateKind'] },
      ],
    },
  },
  {
    path: '/manage/employee',
    title: 'Employee Directory',
    description: 'Employee directory data is backed by the seeded Phase 1 personnel records, employments, and profile snapshots.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Employees', path: '/personnel/employees', fields: ['employeeNumber', 'displayName', 'roleTitle'] },
        { label: 'Employments', path: '/personnel/employments', fields: ['employeeId', 'status', 'jobType'] },
        { label: 'Employee Profiles', path: '/personnel/employee-profiles', fields: ['employeeId', 'gender', 'civilStatus'] },
      ],
    },
  },
  {
    path: '/manage/employee/onboarding',
    title: 'Employee Onboarding',
    description: 'Onboarding status, start windows, and completed-step snapshots are available from the Phase 1 seed.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Onboarding Records', path: '/personnel/employee-onboarding-records', fields: ['employeeId', 'status', 'startDate'] },
        { label: 'Employees', path: '/personnel/employees', fields: ['employeeNumber', 'displayName', 'status'] },
      ],
    },
  },
  {
    path: '/manage/employee/offboarding',
    title: 'Employee Offboarding',
    description: 'Offboarding and separation data reflects the seeded enterprise workforce lifecycle records.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Offboarding Records', path: '/personnel/employee-offboarding-records', fields: ['employeeId', 'reason', 'clearanceStatus'] },
        { label: 'Employees', path: '/personnel/employees', fields: ['employeeNumber', 'displayName', 'status'] },
      ],
    },
  },
  {
    path: '/manage/paf',
    title: 'Personnel Action Forms',
    description: 'PAF submissions, lifecycle changes, and downstream profile history are seeded for Phase 1.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'PAF Records', path: '/personnel/paf-records', fields: ['employeeId', 'actionType', 'status'] },
        { label: 'Profile History', path: '/personnel/employee-profile-histories', fields: ['employeeId', 'fieldName', 'changeSource'] },
        { label: 'Approval Requests', path: '/approvals/approval-requests', fields: ['referenceType', 'status', 'submittedAt'] },
      ],
    },
  },
  {
    path: '/manage/pay-structure',
    title: 'Pay Structure',
    description: 'Pay components, formulas, template families, and employee pay profiles are available from the seed.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Components', path: '/pay-structure/earning-components', fields: ['code', 'name', 'category'] },
        { label: 'Template Families', path: '/pay-structure/earning-template-families', fields: ['code', 'name', 'templateKind'] },
        { label: 'Employee Pay Profiles', path: '/pay-structure/employee-pay-profiles', fields: ['employeeId', 'payBasis', 'status'] },
      ],
    },
  },
  {
    path: '/monitor/approvals',
    title: 'Approvals',
    description: 'Approval setup, pending actions, and workflow trails use the Phase 1 seeded approval engine.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Approval Requests', path: '/approvals/approval-requests', fields: ['referenceType', 'status', 'submittedAt'] },
        { label: 'Approval Workflow', path: '/approvals/approval-workflows', fields: ['approvalRequestId', 'status', 'actedAt'] },
        { label: 'Approval Setups', path: '/approvals/approval-setups', fields: ['code', 'name', 'moduleKey'] },
      ],
    },
  },
  {
    path: '/settings/overview',
    title: 'Settings Overview',
    description: 'Phase 1 settings revolve around RBAC, org structure, PIS configuration, approvals, and pay architecture.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Roles', path: '/rbac/roles', fields: ['code', 'name', 'status'] },
        { label: 'Org Units', path: '/org-structure/org-units', fields: ['code', 'name', 'isActive'] },
        { label: 'PIS Fields', path: '/personnel/pis-fields', fields: ['code', 'label', 'dataType'] },
        { label: 'Salary Grades', path: '/pay-structure/salary-grades', fields: ['code', 'name', 'status'] },
      ],
    },
  },
  {
    path: '/settings/roles',
    title: 'Role Management',
    description: 'The seeded RBAC model is aligned to the three active system roles: Superadmin, Approver, and Employee.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Roles', path: '/rbac/roles', fields: ['code', 'name', 'description'] },
        { label: 'Assignments', path: '/rbac/user-role-assignments', fields: ['userId', 'roleId', 'assignedAt'] },
      ],
    },
  },
  {
    path: '/settings/users',
    title: 'User Management',
    description: 'Seeded user accounts back the demo logins and approval-routing actors in the Phase 1 environment.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Users', path: '/rbac/users', fields: ['displayName', 'email', 'status'] },
        { label: 'Sessions', path: '/rbac/user-sessions', fields: ['userId', 'status', 'lastSeenAt'] },
      ],
    },
  },
  {
    path: '/settings/permissions',
    title: 'Permissions',
    description: 'Permission coverage in Phase 1 tracks org structure, personnel, pay structure, approvals, and RBAC.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Permissions', path: '/rbac/permissions', fields: ['code', 'name', 'description'] },
        { label: 'Role Permissions', path: '/rbac/role-permission-assignments', fields: ['roleId', 'permissionId', 'systemModuleId'] },
      ],
    },
  },
  {
    path: '/settings/ranks',
    title: 'Ranks',
    description: 'Enterprise job architecture, ranks, and progression levels are seeded for organization setup.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Ranks', path: '/org-structure/ranks', fields: ['name', 'mode', 'sortOrder'] },
        { label: 'Rank Levels', path: '/org-structure/rank-levels', fields: ['rankId', 'code', 'sortOrder'] },
      ],
    },
  },
  {
    path: '/settings/position-templates',
    title: 'Position Template',
    description: 'Position templates and template profiles mirror the seeded enterprise job catalog.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Position Templates', path: '/org-structure/position-templates', fields: ['name', 'family', 'category'] },
        { label: 'Position Profiles', path: '/org-structure/position-profiles', fields: ['positionTemplateId', 'label', 'progressionMode'] },
      ],
    },
  },
  {
    path: '/settings/salary-grade',
    title: 'Salary Grade',
    description: 'Salary grades and step ladders reflect the imported enterprise compensation structure.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Salary Grades', path: '/pay-structure/salary-grades', fields: ['code', 'name', 'status'] },
        { label: 'Salary Steps', path: '/pay-structure/salary-grade-steps', fields: ['salaryGradeId', 'stepNo', 'amount'] },
      ],
    },
  },
  {
    path: '/settings/structure',
    title: 'Org Structure',
    description: 'Org units, versions, and closure records reflect the seeded corporate hierarchy.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Org Units', path: '/org-structure/org-units', fields: ['code', 'name', 'isActive'] },
        { label: 'Versions', path: '/org-structure/org-unit-versions', fields: ['orgUnitId', 'name', 'isCurrent'] },
        { label: 'Closures', path: '/org-structure/org-unit-closures', fields: ['ancestorOrgUnitId', 'descendantOrgUnitId', 'depth'] },
      ],
    },
  },
  {
    path: '/settings/approvals',
    title: 'Approval Setup',
    description: 'Approval chains, assignments, and fallback approvers are seeded for personnel and pay actions.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Approval Setups', path: '/approvals/approval-setups', fields: ['code', 'name', 'moduleKey'] },
        { label: 'Approver Sequences', path: '/approvals/approver-sequences', fields: ['approvalSetupId', 'stepNo', 'name'] },
        { label: 'Workflow Assignments', path: '/approvals/workflow-assignments', fields: ['approvalSetupId', 'scopeType', 'scopeRefId'] },
      ],
    },
  },
  {
    path: '/settings/employee-fields',
    title: 'Employee Tabs & Fields',
    description: 'PIS tabs, fields, options, and policies are populated from the imported personnel model.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'PIS Tabs', path: '/personnel/pis-tabs', fields: ['code', 'name', 'sortOrder'] },
        { label: 'PIS Fields', path: '/personnel/pis-fields', fields: ['code', 'label', 'dataType'] },
        { label: 'Field Options', path: '/personnel/pis-field-options', fields: ['pisFieldId', 'code', 'label'] },
      ],
    },
  },

  { path: '/manage/schedule', title: 'Schedules', description: 'Schedule management is planned after the current Phase 1 delivery.', phase: 'future' },
  { path: '/manage/leave-balances', title: 'Leave Balances', description: 'Leave balances are outside the mounted Phase 1 backend scope.', phase: 'future' },
  { path: '/manage/payroll', title: 'Payroll Runs', description: 'Payroll processing is planned after the current Phase 1 delivery.', phase: 'future' },
  { path: '/monitor/notifications', title: 'Notifications', description: 'Notifications remain a later-phase module.', phase: 'future' },
  { path: '/monitor/attendance', title: 'Attendance Monitor', description: 'Attendance monitoring is not mounted in the current Phase 1 backend.', phase: 'future' },
  { path: '/monitor/reports', title: 'Reports', description: 'Report generation is planned after the current Phase 1 delivery.', phase: 'future' },
  { path: '/settings/policies', title: 'Company Policy', description: 'Policy services are outside the current Phase 1 mount.', phase: 'future' },
];

export const dynamicShellRoutes: ShellRoute[] = [
  {
    path: '/manage/employee/:id',
    title: 'Employee Record',
    description: 'Employee detail previews use the seeded employee, employment, profile, and pay-profile records.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Employee', path: '/personnel/employees/:id', fields: ['employeeNumber', 'displayName', 'roleTitle', 'status'] },
        { label: 'Employee Profile', path: '/personnel/employee-profiles/:id', fields: ['employeeId', 'gender', 'civilStatus', 'bankName'] },
        { label: 'Employee Pay Profile', path: '/pay-structure/employee-pay-profiles/:id', fields: ['employeeId', 'payBasis', 'status', 'effectiveStartDate'] },
      ],
    },
  },
  {
    path: '/monitor/approvals/:id',
    title: 'Approval Detail',
    description: 'Approval detail previews use the seeded approval request and workflow records.',
    phase: 'phase1',
    preview: {
      sources: [
        { label: 'Approval Request', path: '/approvals/approval-requests/:id', fields: ['referenceType', 'status', 'submittedAt', 'resolvedAt'] },
        { label: 'Approval Workflow', path: '/approvals/approval-workflows/:id', fields: ['approvalRequestId', 'status', 'actedAt', 'comments'] },
      ],
    },
  },
];
