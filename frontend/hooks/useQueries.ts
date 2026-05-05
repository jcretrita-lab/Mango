import { useQuery, useQueries as useTanStackQueries } from '@tanstack/react-query';
import { buildApiPath } from '../config/api';

export interface ApiPage<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

type QueryMap = Record<string, string>;
type QueryData<T extends QueryMap> = { [K in keyof T]: unknown[] };
type QueryPages<T extends QueryMap> = { [K in keyof T]: ApiPage };

export type QueryParamValue = string | number | boolean | null | undefined;

export function buildQueryPath(
  path: string,
  params: Record<string, QueryParamValue>,
): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === 'all') {
      return;
    }

    query.set(key, String(value));
  });

  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

// Token getter, set by AuthProvider via setApiTokenGetter().
let _getToken: (() => string | null) | null = null;

export function setApiTokenGetter(getter: () => string | null): void {
  _getToken = getter;
}

function getAuthHeaders(): Record<string, string> {
  const token = _getToken?.();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

function emitUnauthorized(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hris:unauthorized'));
  }
}

async function requestJson(path: string): Promise<unknown> {
  const response = await fetch(buildApiPath(path), {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (response.status === 401) {
    emitUnauthorized();
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    throw new Error(`Unable to load ${path}.`);
  }

  return response.json();
}

function isApiPage(value: unknown): value is ApiPage {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<ApiPage>;
  return (
    Array.isArray(candidate.data) &&
    typeof candidate.total === 'number' &&
    typeof candidate.page === 'number' &&
    typeof candidate.limit === 'number'
  );
}

function toApiPage(value: unknown): ApiPage {
  if (isApiPage(value)) {
    return value;
  }

  const data = Array.isArray(value) ? value : [];
  return {
    data,
    total: data.length,
    page: 1,
    limit: data.length,
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  const json = await requestJson(path);

  if (isApiPage(json)) {
    return json.data as T;
  }

  return json as T;
}

async function fetchApiPage(path: string): Promise<ApiPage> {
  return toApiPage(await requestJson(path));
}

export function usePersonnelQuery<T>(path: string, options?: { enabled?: boolean }) {
  return useQuery<T>({
    queryKey: [path],
    queryFn: () => fetchJson<T>(path),
    enabled: options?.enabled,
  });
}

/**
 * Use multiple queries at once. `data` preserves the existing array contract,
 * while `pages` exposes pagination metadata from backend envelopes.
 */
export function useApiQueries<T extends QueryMap>(
  queries: T,
  options?: { enabled?: boolean },
) {
  const queryKeys = Object.entries(queries);

  const results = useTanStackQueries({
    queries: queryKeys.map(([, path]) => ({
      queryKey: [path],
      queryFn: () => fetchApiPage(path),
      enabled: options?.enabled ?? true,
    })),
  });

  const status = results.some((result) => result.isPending)
    ? 'loading'
    : results.some((result) => result.isError)
      ? 'error'
      : 'success';

  const data = Object.fromEntries(
    queryKeys.map(([key], index) => [key, results[index].data?.data ?? []]),
  ) as QueryData<T>;

  const pages = Object.fromEntries(
    queryKeys.map(([key], index) => [key, results[index].data ?? toApiPage([])]),
  ) as QueryPages<T>;

  const errorMessage = results.find((result) => result.error)?.error?.message;

  const refresh = async () => {
    await Promise.all(results.map((result) => result.refetch()));
  };

  return { status, data, pages, errorMessage, refresh };
}
