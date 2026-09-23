import 'server-only';

import { tmdbFetch, tmdbFetchWithKeyFallback } from './client';
import type {
  TmdbListItem,
  TmdbMovieDetail,
  TmdbPaged,
  TmdbTVDetail,
  TmdbWatchProviders,
  TmdbRegionWatch,
} from './types';

export function trending(
  window: 'day' | 'week' = 'week',
): Promise<TmdbPaged<TmdbListItem>> {
  return tmdbFetchWithKeyFallback<TmdbPaged<TmdbListItem>>(
    `/trending/all/${window}`,
  );
}

export function popularMovies(page = 1): Promise<TmdbPaged<TmdbListItem>> {
  return tmdbFetchWithKeyFallback<TmdbPaged<TmdbListItem>>('/movie/popular', {
    page,
  });
}

export function popularTV(page = 1): Promise<TmdbPaged<TmdbListItem>> {
  return tmdbFetchWithKeyFallback<TmdbPaged<TmdbListItem>>('/tv/popular', {
    page,
  });
}

export function topRatedMovies(page = 1): Promise<TmdbPaged<TmdbListItem>> {
  return tmdbFetchWithKeyFallback<TmdbPaged<TmdbListItem>>(
    '/movie/top_rated',
    { page },
  );
}

export function discoverByProvider(
  tmdbProviderId: number,
  mediaType: 'movie' | 'tv',
  region: string,
  page = 1,
): Promise<TmdbPaged<TmdbListItem>> {
  return tmdbFetchWithKeyFallback<TmdbPaged<TmdbListItem>>(
    `/discover/${mediaType}`,
    {
      with_watch_providers: tmdbProviderId,
      watch_region: region,
      sort_by: 'popularity.desc',
      page,
    },
  );
}

export function searchMulti(
  query: string,
  page = 1,
): Promise<TmdbPaged<TmdbListItem>> {
  return tmdbFetchWithKeyFallback<TmdbPaged<TmdbListItem>>('/search/multi', {
    query,
    page,
    include_adult: false,
  });
}

export function movieDetail(id: number): Promise<TmdbMovieDetail> {
  return tmdbFetchWithKeyFallback<TmdbMovieDetail>(`/movie/${id}`, {
    append_to_response: 'credits,similar,watch/providers',
  });
}

export function tvDetail(id: number): Promise<TmdbTVDetail> {
  return tmdbFetchWithKeyFallback<TmdbTVDetail>(`/tv/${id}`, {
    append_to_response: 'credits,similar,watch/providers',
  });
}

/**
 * Watch providers for a single title, reduced to the region buckets we care
 * about. Used to hydrate provider badges onto list/carousel items.
 */
export async function watchProviders(
  mediaType: 'movie' | 'tv',
  id: number,
  region: string,
): Promise<TmdbRegionWatch | null> {
  const data = await tmdbFetchWithKeyFallback<TmdbWatchProviders>(
    `/${mediaType}/${id}/watch/providers`,
  );
  return data.results?.[region] ?? null;
}

export { tmdbFetch };
