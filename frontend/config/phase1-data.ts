export interface EmployeeRecord {
  id: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  displayName: string;
  orgUnitJson?: Record<string, unknown> | null;
  roleTitle?: string | null;
  email: string;
  phone?: string | null;
  status: string;
  jobType: string;
  avatarUrl?: string | null;
  primaryPositionAssignmentId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmploymentRecord {
  id: number;
  employeeId: number;
  positionAssignmentId?: number | null;
  status: string;
  jobType: string;
  payScheduleId?: number | null;
  startDate: string;
  endDate?: string | null;
  remarks?: string | null;
}

export interface EmployeeProfileRecord {
  id: number;
  employeeId: number;
  birthDate?: string | null;
  gender?: string | null;
  civilStatus?: string | null;
  residentialAddress?: string | null;
  sssNo?: string | null;
  tinNo?: string | null;
  philhealthNo?: string | null;
  pagibigNo?: string | null;
  bankName?: string | null;
  bankAccountNo?: string | null;
}

export interface EducationRecord {
  id: number;
  employeeId: number;
  attainment: string;
  course?: string | null;
  school: string;
  dateGraduated?: string | null;
}

export interface ExamRecord {
  id: number;
  employeeId: number;
  dateTaken?: string | null;
  name: string;
  rating?: string | null;
  description?: string | null;
}

export interface EmploymentHistoryRecord {
  id: number;
  employeeId: number;
  company: string;
  address?: string | null;
  position?: string | null;
  department?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ReferenceContactRecord {
  id: number;
  employeeId: number;
  firstName: string;
  lastName: string;
  position?: string | null;
  contactNo?: string | null;
  business?: string | null;
  address?: string | null;
}

export interface FamilyMemberRecord {
  id: number;
  employeeId: number;
  relationship: string;
  firstName: string;
  lastName: string;
  birthday?: string | null;
  occupation?: string | null;
  address?: string | null;
}

export interface EmergencyContactRecord {
  id: number;
  employeeId: number;
  relationship: string;
  firstName: string;
  lastName: string;
  contactNo?: string | null;
  email?: string | null;
}

export interface PisTabRecord {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  isSystem: boolean;
}

export interface PisFieldRecord {
  id: number;
  pisTabId: number;
  code: string;
  label: string;
  dataType: string;
  validationRegex?: string | null;
  isSensitive: boolean;
  sortOrder: number;
  isSystem: boolean;
  sourceTable?: string | null;
  sourceColumn?: string | null;
  placeholder?: string | null;
  helpText?: string | null;
}

export interface PisFieldOptionRecord {
  id: number;
  pisFieldId: number;
  code: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export interface PisFieldPolicyRecord {
  id: number;
  pisFieldId: number;
  scopeType: string;
  scopeId?: number | null;
  isEnabled: boolean;
  isRequired: boolean;
  priority: number;
}

export interface EmployeeFieldValueRecord {
  id: number;
  employeeId: number;
  pisFieldId: number;
  valueJson: unknown;
  updatedAt: string;
}

export interface EmployeeOnboardingRecord {
  id: number;
  employeeId: number;
  status: string;
  startDate?: string | null;
  completedStepsJson?: unknown;
  notes?: string | null;
}

export interface EmployeeOffboardingRecord {
  id: number;
  employeeId: number;
  reason: string;
  effectiveDate?: string | null;
  clearanceStatus: string;
  notes?: string | null;
}

export interface PafRecord {
  id: number;
  employeeId: number;
  approvalSetupId?: number | null;
  approvalRequestId?: number | null;
  actionType: string;
  effectiveDate: string;
  payloadJson: unknown;
  status: string;
  submittedAt?: string | null;
  appliedAt?: string | null;
}

export interface EmployeeProfileHistoryRecord {
  id: number;
  employeeId: number;
  fieldName: string;
  previousValue?: string | null;
  newValue?: string | null;
  effectiveDate?: string | null;
  changeSource: string;
  pafRecordId?: number | null;
  changeReason?: string | null;
  changedAt: string;
  changedBy?: number | null;
}

export interface CompanyProfileRecord {
  id: number;
  registeredName: string;
  displayName: string;
  registrationType: string;
  registrationNo: string;
  tin: string;
  branchCode?: string | null;
  rdoCode?: string | null;
  sssEmployerNo?: string | null;
  philhealthEmployerNo?: string | null;
  pagibigEmployerNo?: string | null;
  businessAddress: string;
  countryCode: string;
  rootOrgUnitId?: number | null;
  status: string;
}

export interface HierarchyLevelRecord {
  id: number;
  levelNo: number;
  label: string;
  description?: string | null;
}

export interface SiteRecord {
  id: number;
  code: string;
  name: string;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  countryCode: string;
  isActive: boolean;
  sortOrder: number;
}

export interface OrgUnitRecord {
  id: number;
  parentOrgUnitId?: number | null;
  hierarchyLevelId: number;
  headPositionId?: number | null;
  code: string;
  name: string;
  isActive: boolean;
}

export interface OrgUnitVersionRecord {
  id: number;
  orgUnitId: number;
  parentOrgUnitId?: number | null;
  hierarchyLevelId: number;
  headPositionId?: number | null;
  name: string;
  effectiveStartDate: string;
  effectiveEndDate?: string | null;
  isCurrent: boolean;
  changeReason?: string | null;
}

export interface RankRecord {
  id: number;
  name: string;
  sortOrder: number;
  color?: string | null;
  mode: string;
}

export interface RankLevelRecord {
  id: number;
  rankId: number;
  code: string;
  sortOrder: number;
}

export interface PositionTemplateRecord {
  id: number;
  name: string;
  family?: string | null;
  category?: string | null;
  description?: string | null;
}

export interface PositionProfileRecord {
  id: number;
  positionTemplateId: number;
  label: string;
  rankId?: number | null;
  rankLevelId?: number | null;
  progressionMode: string;
  defaultSalaryGradeId?: number | null;
}

export interface PositionSubLevelRecord {
  id: number;
  positionProfileId: number;
  name: string;
  sortOrder: number;
  salaryGradeId?: number | null;
}

export interface PositionRecord {
  id: number;
  orgUnitId: number;
  positionProfileId: number;
  positionSubLevelId?: number | null;
  salaryGradeId?: number | null;
  salaryGradeStepId?: number | null;
  supervisorPositionId?: number | null;
  title: string;
  employmentStatus: string;
  defaultBasePay: string | number;
  plannedHeadcount: number;
  fte: string | number;
}

export interface PositionAssignmentRecord {
  id: number;
  positionId: number;
  employeeId?: number | null;
  startDate: string;
  endDate?: string | null;
  assignmentType: string;
  fte: string | number;
  version: number;
}

export interface SalaryGradeRecord {
  id: number;
  code: string;
  name: string;
  rateType: string;
  minSalary?: string | number | null;
  maxSalary?: string | number | null;
  currency: string;
  status: string;
}

export interface SalaryGradeStepRecord {
  id: number;
  salaryGradeId: number;
  stepNumber: number;
  name: string;
  amount: string | number;
}

export interface EarningTemplateFamilyRecord {
  id: number;
  baseEarningTemplateFamilyId?: number | null;
  code: string;
  name: string;
  templateKind: string;
  showInDefaultPicker: boolean;
  payBasisApplicability: string;
  status: string;
  description?: string | null;
}

export interface EarningTemplateFamilyScopeRecord {
  id: number;
  earningTemplateFamilyId: number;
  scopeType: string;
  scopeRefId?: number | null;
  isPrimary: boolean;
  notes?: string | null;
}

export interface EarningTemplateRevisionRecord {
  id: number;
  earningTemplateFamilyId: number;
  versionNo: string;
  currencyCode: string;
  effectiveStartDate: string;
  effectiveEndDate?: string | null;
  isCurrent: boolean;
  changeSummary?: string | null;
}

export interface EarningTemplateRevisionLineRecord {
  id: number;
  earningTemplateRevisionId: number;
  earningComponentId: number;
  sortOrder: number;
  isRequired: boolean;
}

export interface FormulaRecord {
  id: number;
  code: string;
  name: string;
  expression: string;
  description?: string | null;
  status: string;
}

export interface FormulaVersionRecord {
  id: number;
  formulaId: number;
  versionNo: string;
  expression: string;
  effectiveStartDate: string;
  effectiveEndDate?: string | null;
  isCurrent: boolean;
  changeSummary?: string | null;
}

export interface EarningComponentRecord {
  id: number;
  code: string;
  name: string;
  category: string;
  valueSource: string;
  orgReferenceType?: string | null;
  fixedAmount?: string | number | null;
  formulaVersionId?: number | null;
  lookupTableVersionId?: number | null;
  isTaxableDefault: boolean;
  includeIn13thMonthDefault: boolean;
  status: string;
  isSystem: boolean;
  description?: string | null;
}

export interface EmployeePayProfileRecord {
  id: number;
  employeeId: number;
  earningTemplateFamilyId: number;
  payScheduleId?: number | null;
  approvalRequestId?: number | null;
  payBasis: string;
  effectiveStartDate: string;
  effectiveEndDate?: string | null;
  status: string;
  notes?: string | null;
}

export interface ApprovalSetupRecord {
  id: number;
  code: string;
  name: string;
  moduleKey: string;
  actionType: string;
  description?: string | null;
  status: string;
}

export interface ApproverSequenceRecord {
  id: number;
  approvalSetupId: number;
  stepNo: number;
  name: string;
  approverRoleId?: number | null;
  approverUserId?: number | null;
  approverPositionId?: number | null;
  requiredApprovals: number;
}

export interface WorkflowAssignmentRecord {
  id: number;
  approvalSetupId: number;
  scopeType: string;
  scopeRefId?: number | null;
  isActive: boolean;
  notes?: string | null;
}

export interface ApprovalRequestRecord {
  id: number;
  approvalSetupId: number;
  requestedByUserId?: number | null;
  employeeId?: number | null;
  referenceType: string;
  referenceId: number;
  status: string;
  submittedAt?: string | null;
  resolvedAt?: string | null;
}

export interface ApprovalWorkflowRecord {
  id: number;
  approvalRequestId: number;
  approverSequenceId: number;
  approverUserId?: number | null;
  status: string;
  actedAt?: string | null;
  comments?: string | null;
}

export interface ApprovalWorkflowNoteRecord {
  id: number;
  approvalWorkflowId: number;
  authorUserId?: number | null;
  noteType: string;
  note: string;
  createdAt: string;
}

export interface UserRecord {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSessionRecord {
  id: number;
  userId: number;
  status: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  lastSeenAt?: string | null;
  expiresAt?: string | null;
}

export interface RoleRecord {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  status: string;
}

export interface UserRoleAssignmentRecord {
  id: number;
  userId: number;
  roleId: number;
  isActive: boolean;
  assignedAt: string;
}

export interface PermissionRecord {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  status: string;
}

export interface SystemModuleRecord {
  id: number;
  code: string;
  name: string;
  description?: string | null;
}

export interface PermissionModuleConfigRecord {
  id: number;
  systemModuleId: number;
  code: string;
  name: string;
  description?: string | null;
}

export interface PermissionModuleConfigScopeRecord {
  id: number;
  permissionModuleConfigId: number;
  code: string;
  name: string;
}

export interface PermissionModuleConfigActionRecord {
  id: number;
  permissionModuleConfigId: number;
  code: string;
  name: string;
}

export interface PermissionModuleConfigStateRecord {
  id: number;
  permissionModuleConfigId: number;
  code: string;
  name: string;
}

export interface RolePermissionAssignmentRecord {
  id: number;
  roleId: number;
  permissionId: number;
  systemModuleId?: number | null;
  permissionModuleConfigId?: number | null;
  permissionModuleConfigScopeId?: number | null;
  permissionModuleConfigActionId?: number | null;
  permissionModuleConfigStateId?: number | null;
  isActive: boolean;
}

export function parseNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numeric = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export function formatCurrency(
  value: string | number | null | undefined,
  currency = 'PHP',
): string {
  const numeric = parseNumber(value);

  if (numeric === null) {
    return '—';
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatDate(
  value: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(date);
}

export function formatDateTime(value: string | null | undefined): string {
  return formatDate(value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  if (!start && !end) {
    return '—';
  }

  return `${formatDate(start)}${end ? ` to ${formatDate(end)}` : ' onwards'}`;
}

export function titleCaseWords(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }

  return value
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function formatStatusLabel(value: string | null | undefined): string {
  return titleCaseWords(value);
}

export function getInitials(value: string | null | undefined): string {
  if (!value) {
    return 'HR';
  }

  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token.charAt(0).toUpperCase())
    .join('');
}

export function valueOrDash(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return String(value);
}

export function formatOrgPath(orgUnitJson?: Record<string, unknown> | null): string {
  if (!orgUnitJson) {
    return 'Unassigned';
  }

  const orderedKeys = ['company', 'group', 'division', 'department', 'section', 'site'];
  const values = orderedKeys
    .map((key) => orgUnitJson[key])
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

  return values.length > 0 ? values.join(' / ') : 'Unassigned';
}

export function countChecklistItems(value: unknown): number {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).length;
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      return countChecklistItems(JSON.parse(value));
    } catch {
      return 1;
    }
  }

  return 0;
}

export function describeJsonValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.length ? value.map((item) => describeJsonValue(item)).join(', ') : '—';
  }

  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .slice(0, 4)
      .map(([key, item]) => `${titleCaseWords(key)}: ${describeJsonValue(item)}`)
      .join(' | ');
  }

  return '—';
}

export function buildIdMap<T extends { id: number }>(items: T[]): Map<number, T> {
  return new Map(items.map((item) => [item.id, item]));
}

export function groupBy<T, Key extends string | number>(
  items: T[],
  getKey: (item: T) => Key,
): Map<Key, T[]> {
  const grouped = new Map<Key, T[]>();

  items.forEach((item) => {
    const key = getKey(item);
    const current = grouped.get(key);

    if (current) {
      current.push(item);
    } else {
      grouped.set(key, [item]);
    }
  });

  return grouped;
}

export function sortByString<T>(
  items: T[],
  getLabel: (item: T) => string | null | undefined,
): T[] {
  return [...items].sort((left, right) =>
    (getLabel(left) ?? '').localeCompare(getLabel(right) ?? ''),
  );
}

export function compareDateDesc(
  left: string | null | undefined,
  right: string | null | undefined,
): number {
  const leftValue = left ? new Date(left).getTime() : 0;
  const rightValue = right ? new Date(right).getTime() : 0;

  return rightValue - leftValue;
}

export function isResolvedApproval(status: string): boolean {
  return ['APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'].includes(status.toUpperCase());
}
