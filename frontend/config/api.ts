export const API_PREFIX = '/api';

export function buildApiPath(path: string): string {
  if (path.startsWith(API_PREFIX)) {
    return path;
  }

  return `${API_PREFIX}${path.startsWith('/') ? path : `/${path}`}`;
}
