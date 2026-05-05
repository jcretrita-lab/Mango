import { compareDateDesc, EmployeeRecord, EmploymentRecord, PositionAssignmentRecord, PositionRecord, EmployeePayProfileRecord } from '../../config/phase1-data';

export function getCurrentEmployment(employeeId: number, employments: EmploymentRecord[]) {
  return [...employments]
    .filter((employment) => employment.employeeId === employeeId)
    .sort((left, right) => compareDateDesc(left.startDate, right.startDate))[0];
}

export function getCurrentPayProfile(employeeId: number, payProfiles: EmployeePayProfileRecord[]) {
  return [...payProfiles]
    .filter((profile) => profile.employeeId === employeeId)
    .sort((left, right) => compareDateDesc(left.effectiveStartDate, right.effectiveStartDate))[0];
}

export function getAssignmentPosition(
  employee: EmployeeRecord,
  employments: EmploymentRecord[],
  assignments: PositionAssignmentRecord[],
  positions: PositionRecord[],
) {
  const employment = getCurrentEmployment(employee.id, employments);
  const assignmentId =
    employment?.positionAssignmentId ?? employee.primaryPositionAssignmentId ?? undefined;
  const assignment =
    assignments.find((item) => item.id === assignmentId) ??
    assignments.find((item) => item.employeeId === employee.id && !item.endDate);
  const position = assignment ? positions.find((item) => item.id === assignment.positionId) : undefined;

  return { employment, assignment, position };
}

export function getInitials(displayName: string) {
  return displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function normalizeEmployeeTab(value: string | null): string {
  const normalized = (value ?? 'profile').trim().toLowerCase();

  switch (normalized) {
    case 'profile':
      return 'profile';
    case 'employment':
    case 'schedule':
      return 'employment';
    case 'pay profile':
    case 'pay-profile':
    case 'payroll':
      return 'pay-profile';
    case 'personnel action form':
    case 'personnel-action-form':
    case 'action forms':
    case 'paf':
      return 'paf';
    case 'history':
    case 'attendance':
    case 'contributions':
      return 'history';
    default:
      return 'profile';
  }
}
