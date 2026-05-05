import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildApiPath } from '../config/api';

type QueryStatus = 'idle' | 'loading' | 'success' | 'error';

interface CacheEntry {
  data: unknown;
  fetchedAt: number;
}

const CACHE_TTL_MS = 60_000;
const responseCache = new Map<string, CacheEntry>();
const inFlightCache = new Map<string, Promise<unknown>>();

// Token getter — set by AuthProvider via setApiToken()
let _getToken: (() => string | null) | null = null;

export function setApiTokenGetter(getter: () => string | null): void {
  _getToken = getter;
}

function getAuthHeaders(): Record<string, string> {
  const token = _getToken?.();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/** Emits a custom event so AuthContext can react to 401s without a circular dep */
function emitUnauthorized(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hris:unauthorized'));
  }
}

async function fetchJson<T>(path: string, ignoreCache = false): Promise<T> {
  const now = Date.now();
  const cached = responseCache.get(path);

  if (!ignoreCache && cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data as T;
  }

  const existingRequest = inFlightCache.get(path);

  if (!ignoreCache && existingRequest) {
    return (await existingRequest) as T;
  }

  const request = fetch(buildApiPath(path), {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  }).then(async (response) => {
    if (response.status === 401) {
      emitUnauthorized();
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      throw new Error(`Unable to load ${path}.`);
    }

    return (await response.json()) as T;
  });

  inFlightCache.set(path, request);

  try {
    const data = await request;
    responseCache.set(path, { data, fetchedAt: Date.now() });
    return data;
  } finally {
    inFlightCache.delete(path);
  }
}

/** Invalidate the entire cache (call after mutations) */
export function invalidateApiCache(): void {
  responseCache.clear();
}

/** Invalidate a specific path from cache */
export function invalidateApiPath(path: string): void {
  responseCache.delete(path);
}

export interface ApiCollectionState<T> {
  status: QueryStatus;
  data: T[];
  errorMessage?: string;
  refresh: () => Promise<void>;
}

export function useApiCollection<T>(
  path: string | null,
  options?: { enabled?: boolean },
): ApiCollectionState<T> {
  const enabled = options?.enabled ?? true;
  const [status, setStatus] = useState<QueryStatus>(
    path && enabled ? 'loading' : 'idle',
  );
  const [data, setData] = useState<T[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const load = useCallback(
    async (ignoreCache = false) => {
      if (!path || !enabled) {
        setStatus('idle');
        setData([]);
        setErrorMessage(undefined);
        return;
      }

      setStatus('loading');
      setErrorMessage(undefined);

      try {
        const payload = await fetchJson<T[]>(path, ignoreCache);
        setData(payload);
        setStatus('success');
      } catch (error) {
        setStatus('error');
        setData([]);
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to load data.',
        );
      }
    },
    [enabled, path],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  const refresh = useCallback(async () => {
    await load(true);
  }, [load]);

  return { status, data, errorMessage, refresh };
}

type QueryMap = Record<string, string>;
type QueryResultMap<T extends QueryMap> = { [K in keyof T]: unknown[] };

export interface ApiCollectionsState<T extends QueryMap> {
  status: QueryStatus;
  data: QueryResultMap<T>;
  errorMessage?: string;
  refresh: () => Promise<void>;
}

function buildEmptyDataFromEntries<T extends QueryMap>(
  queryEntries: Array<[keyof T, string]>,
): QueryResultMap<T> {
  return Object.fromEntries(
    queryEntries.map(([key]) => [key, []]),
  ) as unknown as QueryResultMap<T>;
}

export function useApiCollections<T extends QueryMap>(
  queries: T,
  options?: { enabled?: boolean },
): ApiCollectionsState<T> {
  const enabled = options?.enabled ?? true;
  const querySignature = Object.entries(queries)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, path]) => `${key}:${path}`)
    .join('|');
  const queryEntries = useMemo(
    () => Object.entries(queries) as Array<[keyof T, string]>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [querySignature],
  );
  const [status, setStatus] = useState<QueryStatus>(
    enabled && queryEntries.length > 0 ? 'loading' : 'idle',
  );
  const [data, setData] = useState<QueryResultMap<T>>(() =>
    buildEmptyDataFromEntries(queryEntries),
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  // Track whether component is still mounted
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const load = useCallback(
    async (ignoreCache = false) => {
      if (!enabled || queryEntries.length === 0) {
        setStatus('idle');
        setData(buildEmptyDataFromEntries(queryEntries));
        setErrorMessage(undefined);
        return;
      }

      setStatus('loading');
      setErrorMessage(undefined);

      try {
        const resolvedEntries = await Promise.all(
          queryEntries.map(
            async ([key, path]) =>
              [key, await fetchJson<unknown[]>(path, ignoreCache)] as const,
          ),
        );

        if (!mountedRef.current) return;
        setData(Object.fromEntries(resolvedEntries) as QueryResultMap<T>);
        setStatus('success');
      } catch (error) {
        if (!mountedRef.current) return;
        setStatus('error');
        setData(buildEmptyDataFromEntries(queryEntries));
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to load data.',
        );
      }
    },
    [enabled, queryEntries],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  const refresh = useCallback(async () => {
    await load(true);
  }, [load]);

  return { status, data, errorMessage, refresh };
}
