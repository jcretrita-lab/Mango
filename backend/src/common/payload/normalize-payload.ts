const ISO_DATE_STRING_PATTERN = /^\d{4}-\d{2}-\d{2}(T.*)?$/;

export type PayloadRecord = Record<string, unknown>;

/**
 * Detects plain object payload branches so normalizePayloadValue can recurse without touching class instances.
 */
function isPlainObject(value: unknown): value is PayloadRecord {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Converts nested ISO date strings to Date objects before generic CRUD writes pass payloads into Prisma.
 */
export function normalizePayloadValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizePayloadValue(entry));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        normalizePayloadValue(entry),
      ]),
    );
  }

  if (typeof value === 'string' && ISO_DATE_STRING_PATTERN.test(value)) {
    return new Date(value);
  }

  return value;
}

/**
 * Normalizes object payloads before they are passed into Prisma writes.
 */
export function normalizeRecordPayload<T extends object>(
  payload: T,
): PayloadRecord {
  return normalizePayloadValue(payload) as PayloadRecord;
}
