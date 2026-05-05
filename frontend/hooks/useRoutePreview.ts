import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buildApiPath } from '../config/api';
import type { RoutePreview } from '../config/appShellRoutes';

interface PreviewSample {
  [key: string]: string;
}

export interface RoutePreviewResult {
  label: string;
  path: string;
  count: number;
  samples: PreviewSample[];
}

interface RoutePreviewState {
  status: 'idle' | 'loading' | 'success' | 'error';
  results: RoutePreviewResult[];
  errorMessage?: string;
}

function resolvePath(path: string, params: Record<string, string | undefined>): string | null {
  const resolvedPath = path.replace(/:([a-zA-Z0-9_]+)/g, (_, key: string) => params[key] ?? `:${key}`);
  return resolvedPath.includes(':') ? null : resolvedPath;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.length === 0 ? '—' : `${value.length} item${value.length === 1 ? '' : 's'}`;
  }

  return JSON.stringify(value);
}

function pickFields(record: Record<string, unknown>, fields: string[]): PreviewSample {
  return Object.fromEntries(fields.map((field) => [field, formatValue(record[field])]));
}

export function useRoutePreview(preview?: RoutePreview): RoutePreviewState {
  const params = useParams();
  const [state, setState] = useState<RoutePreviewState>({
    status: preview?.sources.length ? 'loading' : 'idle',
    results: [],
  });

  useEffect(() => {
    if (!preview?.sources.length) {
      setState({ status: 'idle', results: [] });
      return;
    }

    let isCancelled = false;

    setState({ status: 'loading', results: [] });

    Promise.all(
      preview.sources.map(async (source) => {
        const resolvedPath = resolvePath(source.path, params);

        if (!resolvedPath) {
          return {
            label: source.label,
            path: source.path,
            count: 0,
            samples: [],
          };
        }

        const response = await fetch(buildApiPath(resolvedPath));

        if (!response.ok) {
          throw new Error(`${source.label} preview is unavailable.`);
        }

        const payload = (await response.json()) as Record<string, unknown> | Array<Record<string, unknown>>;
        const records = Array.isArray(payload) ? payload : [payload];

        return {
          label: source.label,
          path: resolvedPath,
          count: records.length,
          samples: records.slice(0, 3).map((record) => pickFields(record, source.fields)),
        };
      }),
    )
      .then((results) => {
        if (!isCancelled) {
          setState({ status: 'success', results });
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setState({
            status: 'error',
            results: [],
            errorMessage: error instanceof Error ? error.message : 'Unable to load preview data.',
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [params, preview]);

  return state;
}
