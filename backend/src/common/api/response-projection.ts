import type { AuthenticatedRequestUser } from '../auth/auth.types';
import { PERMISSION_CODES } from '../constants/permissions.constants';
import type { ReadModelName } from './read-resource.types';

type RecordValue = Record<string, unknown>;

const ALWAYS_OMIT_FIELDS = new Set([
  'passwordHash',
  'tokenHash',
  'metadataJson',
  'ipAddress',
  'userAgent',
]);

const SENSITIVE_PERSONNEL_FIELDS = new Set([
  'birthDate',
  'birthday',
  'residentialAddress',
  'address',
  'contactNo',
  'sssNo',
  'tinNo',
  'philhealthNo',
  'pagibigNo',
  'bankAccountNo',
]);

const SENSITIVE_MODELS = new Set<ReadModelName>([
  'employeeProfile',
  'familyMember',
  'emergencyContact',
  'referenceContact',
  'employeeFieldValue',
  'employeeFieldValueHistory',
  'employeeProfileHistory',
]);

function hasSensitivePersonnelRead(
  actor: AuthenticatedRequestUser | undefined,
): boolean {
  return Boolean(
    actor?.permissions.includes(PERMISSION_CODES.PERSONNEL_SENSITIVE_READ),
  );
}

function maskRecordValue(
  model: ReadModelName,
  key: string,
  value: unknown,
  actor: AuthenticatedRequestUser | undefined,
): unknown {
  if (ALWAYS_OMIT_FIELDS.has(key)) {
    return undefined;
  }

  if (
    SENSITIVE_MODELS.has(model) &&
    SENSITIVE_PERSONNEL_FIELDS.has(key) &&
    !hasSensitivePersonnelRead(actor)
  ) {
    return null;
  }

  return value;
}

export function projectApiRecord(
  model: ReadModelName,
  record: unknown,
  actor: AuthenticatedRequestUser | undefined,
): unknown {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return record;
  }

  const projectedEntries = Object.entries(record as RecordValue)
    .map(([key, value]) => [key, maskRecordValue(model, key, value, actor)])
    .filter((entry): entry is [string, unknown] => entry[1] !== undefined);

  return Object.fromEntries(projectedEntries);
}
