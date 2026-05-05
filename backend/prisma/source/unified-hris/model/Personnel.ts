export type PersonnelEmployeeStatus = "Active" | "Suspended" | "Terminated";
export type PersonnelJobType = "Full-Time" | "Part-Time" | "Contract" | "Internship";
export type PersonnelAssignmentType = "Primary" | "Acting" | "Concurrent";

export type PersonnelTabCode =
  | "personal_details"
  | "company_details"
  | "other_details"
  | string;

export type PersonnelFieldDataType =
  | "text"
  | "textarea"
  | "date"
  | "enum"
  | "email"
  | "phone"
  | "number";

export type PersonnelFieldScopeType = "global" | "department" | "position";

export type PersonnelSourceTable =
  | "employees"
  | "employments"
  | "employee_profiles"
  | "education_records"
  | "exam_records"
  | "employment_history_records"
  | "reference_contacts"
  | "family_members"
  | "emergency_contacts"
  | "employee_field_values";

export type PersonnelCollectionTable =
  | "education_records"
  | "exam_records"
  | "employment_history_records"
  | "reference_contacts"
  | "family_members"
  | "emergency_contacts";

export interface PersonnelEmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  displayName: string;
  orgUnitJson: Record<string, string>;
  roleTitle: string;
  email: string;
  phone: string;
  status: PersonnelEmployeeStatus;
  jobType: PersonnelJobType;
  payScheduleId?: string;
  avatar: string;
  primaryPositionAssignmentId?: string;
}

export interface PersonnelEmployment {
  id: string;
  employeeId: string;
  positionAssignmentId?: string;
  status: PersonnelEmployeeStatus;
  jobType: PersonnelJobType;
  payScheduleId?: string;
  startDate: string;
  endDate?: string;
}

export interface PersonnelEmployeeProfile {
  employeeId: string;
  birthDate?: string;
  gender?: string;
  civilStatus?: string;
  residentialAddress?: string;
  sssNo?: string;
  tinNo?: string;
  philhealthNo?: string;
  pagibigNo?: string;
  bankName?: string;
  bankAccountNo?: string;
}

export interface PersonnelPositionAssignment {
  id: string;
  positionId: string;
  employeeId: string;
  startDate: string;
  endDate?: string;
  assignmentType: PersonnelAssignmentType;
  fte: number;
  orgUnitSummary?: string;
  roleTitleSummary?: string;
}

export interface PersonnelEducationRecord {
  id: string;
  employeeId: string;
  attainment?: string;
  course?: string;
  school?: string;
  dateGraduated?: string;
}

export interface PersonnelExamRecord {
  id: string;
  employeeId: string;
  dateTaken?: string;
  name?: string;
  rating?: string;
  description?: string;
}

export interface PersonnelEmploymentHistoryRecord {
  id: string;
  employeeId: string;
  company?: string;
  address?: string;
  position?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
}

export interface PersonnelReferenceContact {
  id: string;
  employeeId: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  contactNo?: string;
  business?: string;
  address?: string;
}

export interface PersonnelFamilyMember {
  id: string;
  employeeId: string;
  relationship?: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
  occupation?: string;
  address?: string;
}

export interface PersonnelEmergencyContact {
  id: string;
  employeeId: string;
  relationship?: string;
  firstName?: string;
  lastName?: string;
  contactNo?: string;
  email?: string;
}

export interface PisTab {
  id: string;
  code: PersonnelTabCode;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  isSystem: boolean;
}

export interface PisField {
  id: string;
  tabId: string;
  code: string;
  label: string;
  dataType: PersonnelFieldDataType;
  validationRegex?: string;
  isSensitive: boolean;
  sortOrder: number;
  isSystem: boolean;
  sourceTable: PersonnelSourceTable;
  sourceColumn: string;
  placeholder?: string;
  helpText?: string;
}

export interface PisFieldOption {
  id: string;
  fieldId: string;
  code: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export interface PisFieldPolicy {
  id: string;
  fieldId: string;
  scopeType: PersonnelFieldScopeType;
  scopeId?: string | null;
  isEnabled: boolean;
  isRequired: boolean;
  priority: number;
}

export interface EmployeeFieldValue {
  id: string;
  employeeId: string;
  fieldId: string;
  valueJson: { value: unknown };
  updatedAt: string;
  updatedBy?: string;
}

export interface EmployeeFieldValueHistory {
  id: string;
  employeeFieldValueId: string;
  previousValueJson: { value: unknown };
  changedAt: string;
  changedBy?: string;
  changeReason?: string;
}

export interface PersonnelDataset {
  employees: PersonnelEmployee[];
  employments: PersonnelEmployment[];
  employeeProfiles: PersonnelEmployeeProfile[];
  positionAssignments: PersonnelPositionAssignment[];
  educationRecords: PersonnelEducationRecord[];
  examRecords: PersonnelExamRecord[];
  employmentHistoryRecords: PersonnelEmploymentHistoryRecord[];
  referenceContacts: PersonnelReferenceContact[];
  familyMembers: PersonnelFamilyMember[];
  emergencyContacts: PersonnelEmergencyContact[];
  pisTabs: PisTab[];
  pisFields: PisField[];
  pisFieldOptions: PisFieldOption[];
  pisFieldPolicies: PisFieldPolicy[];
  employeeFieldValues: EmployeeFieldValue[];
  employeeFieldValueHistory: EmployeeFieldValueHistory[];
}

export interface PersonnelEmployeeRecord {
  employee: PersonnelEmployee;
  employments: PersonnelEmployment[];
  employeeProfile: PersonnelEmployeeProfile;
  positionAssignments: PersonnelPositionAssignment[];
  educationRecords: PersonnelEducationRecord[];
  examRecords: PersonnelExamRecord[];
  employmentHistoryRecords: PersonnelEmploymentHistoryRecord[];
  referenceContacts: PersonnelReferenceContact[];
  familyMembers: PersonnelFamilyMember[];
  emergencyContacts: PersonnelEmergencyContact[];
  customFieldValues: Record<string, unknown>;
}
