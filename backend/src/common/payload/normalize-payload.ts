const ISO_DATE_STRING_PATTERN = /^\d{4}-\d{2}-\d{2}(T.*)?$/;

export type PayloadRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is PayloadRecord {
  return Object.prototype.toString.call(value) === '[object Object]';
}

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

export function normalizeRecordPayload<T extends object>(
  payload: T,
): PayloadRecord {
  return normalizePayloadValue(payload) as PayloadRecord;
}
