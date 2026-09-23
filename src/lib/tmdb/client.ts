import 'server-only';

import { TMDB_BASE_URL } from '@/lib/constants';

/**
 * Server-only TMDB fetch wrapper. This module is the ONLY place that reads
 * TMDB_API_KEY. The key is never prefixed with NEXT_PUBLIC_ and this file is
 * never imported from a "use client" module, so it cannot reach the browser.
 */

export class TmdbError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'TmdbError';
    this.status = status;
  }
}

function apiKey(): string | null {
  const key = process.env.TMDB_API_KEY;
  return typeof key === 'string' && key.trim().length > 0 ? key.trim() : null;
}

export function hasTmdbKey(): boolean {
  return apiKey() !== null;
}

/** Per-render in-memory cache so repeated requests in one pass hit the network once. */
const requestCache = new Map<string, Promise<unknown>>();

type QueryValue = string | number | boolean | undefined | null;

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, QueryValue> = {},
): Promise<T> {
  const key = apiKey();
  if (!key) throw new TmdbError('TMDB_API_KEY is not configured');

  const search = new URLSearchParams();
  const sortedKeys = Object.keys(params).sort();
  for (const name of sortedKeys) {
    const value = params[name];
    if (value === undefined || value === null || value === '') continue;
    search.set(name, String(value));
  }

  const cacheKey = `${path}?${search.toString()}`;
  const cached = requestCache.get(cacheKey);
  if (cached) return cached as Promise<T>;

  const promise = (async (): Promise<T> => {
    const url = `${TMDB_BASE_URL}${path}?${search.toString()}`;
    let response: Response;
    try {
      response = await fetch(url, {
        headers: { Authorization: `Bearer ${key}`, accept: 'application/json' },
        next: { revalidate: 3600 },
      });
    } catch (cause) {
      throw new TmdbError(
        `TMDB network error for ${path}: ${(cause as Error).message}`,
      );
    }

    if (response.status === 401 || response.status === 403) {
      throw new TmdbError('TMDB rejected the API key', response.status);
    }
    if (response.status === 404) {
      throw new TmdbError(`TMDB resource not found: ${path}`, 404);
    }
    if (!response.ok) {
      throw new TmdbError(
        `TMDB request failed (${response.status}) for ${path}`,
        response.status,
      );
    }

    return (await response.json()) as T;
  })();

  requestCache.set(cacheKey, promise);

  try {
    return await promise;
  } catch (error) {
    requestCache.delete(cacheKey);
    throw error;
  }
}

/**
 * `Authorization: Bearer <key>` works for TMDB v4 read tokens. v3 keys are also
 * accepted by TMDB when passed as a query parameter, so we retry once with
 * `api_key` if the bearer attempt is rejected. The retry never logs the key.
 */
export async function tmdbFetchWithKeyFallback<T>(
  path: string,
  params: Record<string, QueryValue> = {},
): Promise<T> {
  try {
    return await tmdbFetch<T>(path, params);
  } catch (error) {
    if (error instanceof TmdbError && error.status === 401) {
      const key = apiKey();
      if (!key) throw error;
      const search = new URLSearchParams({ ...params, api_key: key } as Record<
        string,
        string
      >);
      const url = `${TMDB_BASE_URL}${path}?${search.toString()}`;
      const response = await fetch(url, { next: { revalidate: 3600 } });
      if (!response.ok) {
        throw new TmdbError(
          `TMDB request failed (${response.status}) for ${path}`,
          response.status,
        );
      }
      return (await response.json()) as T;
    }
    throw error;
  }
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof TmdbError && error.status === 404;
}
