export enum EmployeeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: EmployeeStatus;
  avatar: string;
  phone: string;
  jobType: string;
  // Added for Pay Template Simulator
  positionId?: string;
  firstName?: string;
  lastName?: string;
  payScheduleId?: string; // links employee to a PaySchedule
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Superadmin' | 'Employee' | 'HR Admin' | 'HR Payroll Personnel' | 'HR Attendance Personnel' | 'Approver' | 'Approver 1' | 'Approver 2' | 'HR Recruiter';
  employeeId?: string; // Links to the Employee record
  permissions: string[];
  encryptedSignature?: string; // Encrypted Base64 string of the signature image
}

export interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface RoleSetup {
  id: string;
  name: string;
  connectedEmployees: number;
  dateAdded: string;
  lastModifiedBy: string;
  lastModified: string;
}

export interface CutoffRange {
  startDay: number;
  endDay: number;
  payDay: number;
  endDayNextMonth?: boolean;
  payDayNextMonth?: boolean;
}

export interface MonthOverride {
  month: number; // 0-11
  year: number;
  cutoffs: CutoffRange[];
  note?: string;
}

export interface PaySchedule {
  id: string;
  name: string;
  frequency: 'Weekly' | 'Semi-Monthly' | 'Monthly' | 'Daily';
  targetType: 'Global' | 'Department' | 'Position' | 'Employee';
  targetId: string | null;
  firstCutoff?: number;
  firstPayDate?: number | string;
  secondCutoff?: number;
  secondPayDate?: number;
  divisorId?: string;
  firstCutoffRange?: CutoffRange;
  secondCutoffRange?: CutoffRange;
  extraCutoffs?: CutoffRange[]; // Added array for dynamically added cutoffs
  monthOverrides?: MonthOverride[];
  applyToAllMonths?: boolean;
  dailyStartTime?: string;
  dailyEndTime?: string;
  dailyPayTime?: string;
  universalCutoffId?: string;
}

export interface Divisor {
  id: string;
  name: string;
  days: number;
}

export interface VersionHistory {
  version: string;
  date: string;
  author: string;
  dataSnapshot: any; // Snapshot of the object state at that time
}

export interface Formula {
  id: string;
  name: string;
  description: string;
  expression: string;
  variables: string[];
  currentVersion?: string;
  versions?: VersionHistory[];
}

export interface LookupTableRow {
  id: string;
  min: number;
  max: number | null;
  baseAmount: number;     // Used for Standard Calculation
  rate: number;           // Used for Standard Calculation
  employeeShare?: number; // Used for Contribution Tables (SSS)
  employerShare?: number; // Used for Contribution Tables (SSS)
}

export interface LookupTable {
  id: string;
  name: string;
  description: string;
  type?: 'standard' | 'contribution'; // Added to distinguish logic
  rows: LookupTableRow[];
  currentVersion?: string;
  versions?: VersionHistory[];
}

export interface PayComponent {
  id: string;
  name: string;
  type: 'earning' | 'deduction';
  isTaxable: boolean;
  valueType: 'fixed' | 'formula' | 'table' | 'installment';
  fixedValue?: number;

  // added to know loans exist
  category?: 'loan' | 'government' | 'other';
  loanProvider?: string;
  loanDeductionCap?: string;
  requiresConsent?: boolean;
  autoSuspendOnLowPay?: boolean;
  loanPrincipalAmount?: number;
  loanInstallmentAmount?: number;
  loanRemainingBalance?: number;
  loanStartDate?: string;
  loanEndDate?: string;

  installmentId?: string; // Added for installment reference

  formulaId?: string;
  tableId?: string;
  archiveAfterDays?: number;
  isArchived?: boolean;
  includeIn13thMonth?: boolean; // Added field
  isSystem?: boolean; // Added to prevent deletion of critical components like Basic Pay
  frequency?: 'Monthly' | 'Semi-Monthly' | 'Weekly' | 'Daily'; // Added field
  distribution?: { period: string; amount: number }[]; // Added for period-specific splits
  currentVersion?: string;
  versions?: VersionHistory[];
}

export interface AdjustmentType {
  id: string;
  code: string;
  name: string;
  category: 'Earning' | 'Deduction';
  isTaxable: boolean;
  description?: string;
}

export interface OrgUnit {
  id: string;
  name: string;
  type: string;
  hierarchyLevelId?: string;
  parentId?: string | null;
  children: OrgUnit[];
  headPositionId?: string; // Position.id of the person who leads this unit
}

export interface OrgUnitType {
  id: string;
  name: string;
  level: number;
}

export interface OrganizationStructureConfig {
  level1Label: string;
  level2Label: string;
  level3Label: string;
  level4Label: string;
  level5Label?: string;
  level6Label?: string;
}

export interface RankStructureConfig {
  rankLabel: string;
  subRankLabel: string;
  subLevelStepLabel: string;
}

export const defaultRankStructureConfig: RankStructureConfig = {
  rankLabel: "Rank",
  subRankLabel: "Level",
  subLevelStepLabel: "Sub-Level",
};

export const defaultOrgStructureConfig: OrganizationStructureConfig = {
  level1Label: "Division",
  level2Label: "Department",
  level3Label: "Section",
  level4Label: "Rank",
  level5Label: "Position",
  level6Label: "Sub-Level",
};

export interface SalaryStep {
  id: string;
  name: string;
  amount: number;
}

export interface SalaryGrade {
  id: string;
  code: string;
  name: string;
  amount?: number; // Legacy single amount
  rateType?: 'fixed' | 'range';
  type?: 'ALIGNED' | 'RANGE';
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  steps?: SalaryStep[];
}

export interface HierarchyLevel {
  id: string;
  name: string;
  order: number;
  description?: string;
}

export type PositionProgressionMode = 'base_grade' | 'sub_levels';

export interface PositionSubLevel {
  id: string;
  name: string;
  order: number;
  salaryGradeId: string;
}

export interface PositionProfile {
  id: string;
  label: string;
  rankId?: string;
  rankLevelId?: string;
  defaultGradeId?: string;
  validGradeIds: string[];
  progressionMode: PositionProgressionMode;
  subLevels: PositionSubLevel[];
  legacyRankPositionId?: string;
}

export interface PositionTemplate {
  id: string;
  name: string;
  family?: string;
  category?: string;
  description?: string;
  profiles: PositionProfile[];
}

export interface JobArchitectureData {
  salaryGrades: SalaryGrade[];
  ranks: Rank[];
  positionTemplates: PositionTemplate[];
  hierarchyLevels: HierarchyLevel[];
  orgUnits: OrgUnit[];
  positions: Position[];
}

// --- RANK SYSTEM (4-tier hierarchy) ---

/** One step in a Sub-Level — has its own salary grade */
export interface SubLevelStep {
  id: string;
  name: string;          // e.g. "Senior Developer 1"
  salaryGradeId: string; // each step gets its own grade
}

/**
 * A position template within a Rank Level.
 * - If subLevels is empty/undefined → salaryGradeId is used.
 * - If subLevels has entries → each step carries its own grade;
 *   salaryGradeId on the position is ignored.
 */
export interface RankPosition {
  id: string;
  name: string;                         // e.g. "Senior Developer"
  salaryGradeId?: string;              // used when no sub-level
  subLevels?: SubLevelStep[]; // optional
}

/** A level / sub-rank code within a leveled Rank */
export interface RankLevel {
  id: string;
  code: string;          // e.g. "4A", "5", "0"
  positions: RankPosition[];
}

/**
 * Top-level Rank category.
 * mode = 'flat'    → positions[] is used directly (no levels)
 * mode = 'leveled' → levels[] is used; positions inside each level
 *                    may optionally have a Sub-Level
 */
export interface Rank {
  id: string;
  name: string;
  order: number;          // display/sort order
  color?: string;
  mode: 'flat' | 'leveled';
  positions?: RankPosition[];  // only when mode = 'flat'
  levels?: RankLevel[];         // only when mode = 'leveled'
}

// Keep SubRank as a legacy alias so other files don't break immediately
/** @deprecated Use RankLevel instead */
export interface SubRank {
  id: string;
  name: string;
  salaryGradeId: string;
}

export interface Position {
  id: string;
  title: string;
  orgUnitId: string;
  salaryGradeId?: string;
  salaryGradeStepId?: string;
  rankId?: string;
  rankLevelId?: string;          // replaces subRankId (which level within the rank)
  rankPositionId?: string;       // which RankPosition template
  positionTemplateId?: string;
  positionProfileId?: string;
  subLevelsStepId?: string; // which step the employee is currently at
  /** @deprecated use rankLevelId */
  subRankId?: string;
  defaultBasePay: number;
  employmentStatus?: string;
  supervisorId?: string;
  plannedHeadcount?: number;
  fte?: number;
}

export interface PayTemplate {
  id: string;
  name: string;
  targetType: 'Position' | 'Global' | 'Division' | 'Department' | 'Section' | 'Rank' | 'Employee' | 'Sub-Level';
  targetId: string; // The ID of the target unit/individual
  targetSubLevelStepId?: string; // The sub-level step ID, if applicable
  basePay: number; // Added to assign basic pay to each template
  components: string[]; // IDs of PayComponents
  isTaxExempt?: boolean;
  taxRate?: number;
}

export interface DailyPayTemplateComponent {
  name: string;
  amount: number;
  type: 'earning' | 'deduction';
}

export interface DailyPayTemplate {
  id: string;
  name: string;
  dailyRate: number;
  targetType: 'Global' | 'Department' | 'Position';
  targetId: string | null;
  additionalComponents: DailyPayTemplateComponent[];
  isActive: boolean;
}
