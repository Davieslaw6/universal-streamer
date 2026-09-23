import 'server-only';

import type { MediaDetail, MediaItem, MediaType } from '@/types/media';
import type { ProviderId } from '@/types/provider';
import { LIST_LIMIT } from './constants';
import { isNotFoundError, hasTmdbKey, TmdbError } from './tmdb/client';
import * as tmdb from './tmdb/endpoints';
import type { TmdbListItem, TmdbRegionWatch } from './tmdb/types';
import {
  availabilityToProviderIds,
  extractAvailability,
  normalizeListItem,
  normalizeMovieDetail,
  normalizeTVDetail,
} from './tmdb/normalize';
import { PROVIDERS } from './providers/catalog';
import * as mock from './mock';

/**
 * THE single switch between live TMDB and bundled mock data.
 * Server-only: this module must never be imported from a "use client" file.
 */

export { hasTmdbKey };

type MediaFilter = MediaType | 'all';

function limit<T>(items: T[], count = LIST_LIMIT): T[] {
  return items.slice(0, count);
}

/** Fetches region watch data for a batch of ids, tolerating individual failures. */
async function hydrateProviders(
  items: readonly TmdbListItem[],
  mediaType: MediaType,
  region: string,
): Promise<Map<number, ProviderId[]>> {
  const map = new Map<number, ProviderId[]>();
  const slice = items.slice(0, LIST_LIMIT);

  const settled = await Promise.allSettled(
    slice.map((item) => tmdb.watchProviders(mediaType, item.id, region)),
  );

  settled.forEach((result, index) => {
    const item = slice[index];
    if (!item) return;
    if (result.status !== 'fulfilled' || result.value === null) {
      map.set(item.id, []);
      return;
    }
    const ids = regionWatchToProviderIds(result.value);
    map.set(item.id, ids);
  });

  return map;
}

function regionWatchToProviderIds(watch: TmdbRegionWatch): ProviderId[] {
  const payload = { results: { __: watch } };
  const availability = extractAvailability(payload, '__');
  return availabilityToProviderIds(availability);
}

async function liveList(
  fetcher: () => Promise<{ results: TmdbListItem[] }>,
  mediaType: MediaType,
  region: string,
): Promise<MediaItem[]> {
  const page = await fetcher();
  const raw = limit(
    page.results.filter(
      (item) => item.media_type !== 'person' && typeof item.id === 'number',
    ),
  );
  const providers = await hydrateProviders(raw, mediaType, region);
  return raw.map((item) => normalizeListItem(item, mediaType, providers.get(item.id) ?? []));
}

export async function getTrending(region: string): Promise<MediaItem[]> {
  if (!hasTmdbKey()) return mock.pickMockTrending();
  try {
    const page = await tmdb.trending('week');
    const raw = limit(
      page.results.filter(
        (item) =>
          (item.media_type === 'movie' || item.media_type === 'tv') &&
          typeof item.id === 'number',
      ),
    );
    const movies = raw.filter((i) => i.media_type === 'movie');
    const shows = raw.filter((i) => i.media_type === 'tv');

    const [movieProviders, tvProviders] = await Promise.all([
      hydrateProviders(movies, 'movie', region),
      hydrateProviders(shows, 'tv', region),
    ]);

    return raw.map((item) => {
      const type: MediaType = item.media_type === 'tv' ? 'tv' : 'movie';
      const providers = type === 'tv' ? tvProviders : movieProviders;
      return normalizeListItem(item, type, providers.get(item.id) ?? []);
    });
  } catch (error) {
    console.error('[data-source] getTrending fell back to mock:', error);
    return mock.pickMockTrending();
  }
}

export async function getPopularMovies(region: string): Promise<MediaItem[]> {
  if (!hasTmdbKey()) return mock.pickMockPopularMovies();
  try {
    return await liveList(() => tmdb.popularMovies(), 'movie', region);
  } catch (error) {
    console.error('[data-source] getPopularMovies fell back to mock:', error);
    return mock.pickMockPopularMovies();
  }
}

export async function getPopularTV(region: string): Promise<MediaItem[]> {
  if (!hasTmdbKey()) return mock.pickMockPopularTV();
  try {
    return await liveList(() => tmdb.popularTV(), 'tv', region);
  } catch (error) {
    console.error('[data-source] getPopularTV fell back to mock:', error);
    return mock.pickMockPopularTV();
  }
}

export async function getTopRated(region: string): Promise<MediaItem[]> {
  if (!hasTmdbKey()) return mock.pickMockTopRated();
  try {
    return await liveList(() => tmdb.topRatedMovies(), 'movie', region);
  } catch (error) {
    console.error('[data-source] getTopRated fell back to mock:', error);
    return mock.pickMockTopRated();
  }
}

export async function getByProvider(
  providerId: ProviderId,
  region: string,
  mediaType: MediaFilter = 'all',
): Promise<MediaItem[]> {
  if (!hasTmdbKey()) return mock.pickMockByProvider(providerId, mediaType);

  const provider = PROVIDERS[providerId];
  const types: MediaType[] =
    mediaType === 'all' ? ['movie', 'tv'] : [mediaType];

  try {
    const pages = await Promise.all(
      types.map((type) =>
        tmdb.discoverByProvider(provider.tmdbId, type, region),
      ),
    );

    const merged: MediaItem[] = [];
    pages.forEach((page, index) => {
      const type = types[index];
      if (!type) return;
      for (const raw of limit(page.results, LIST_LIMIT)) {
        if (typeof raw.id !== 'number') continue;
        merged.push(normalizeListItem(raw, type, [providerId]));
      }
    });

    return merged
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, LIST_LIMIT);
  } catch (error) {
    console.error(
      `[data-source] getByProvider(${providerId}) fell back to mock:`,
      error,
    );
    return mock.pickMockByProvider(providerId, mediaType);
  }
}

export async function searchMedia(
  query: string,
  region: string,
): Promise<MediaItem[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  if (!hasTmdbKey()) return mock.pickMockSearch(trimmed);

  try {
    const page = await tmdb.searchMulti(trimmed);
    const raw = limit(
      page.results.filter(
        (item) =>
          (item.media_type === 'movie' || item.media_type === 'tv') &&
          typeof item.id === 'number',
      ),
      20,
    );

    const movies = raw.filter((i) => i.media_type === 'movie');
    const shows = raw.filter((i) => i.media_type === 'tv');

    const [movieProviders, tvProviders] = await Promise.all([
      hydrateProviders(movies, 'movie', region),
      hydrateProviders(shows, 'tv', region),
    ]);

    return raw.map((item) => {
      const type: MediaType = item.media_type === 'tv' ? 'tv' : 'movie';
      const providers = type === 'tv' ? tvProviders : movieProviders;
      return normalizeListItem(item, type, providers.get(item.id) ?? []);
    });
  } catch (error) {
    console.error('[data-source] searchMedia fell back to mock:', error);
    return mock.pickMockSearch(trimmed);
  }
}

async function getDetail(
  mediaType: MediaType,
  id: number,
  region: string,
): Promise<MediaDetail | null> {
  if (!Number.isFinite(id) || id <= 0) return null;

  if (!hasTmdbKey()) {
    return mock.pickMockDetail(mediaType, id, region);
  }

  try {
    if (mediaType === 'movie') {
      const raw = await tmdb.movieDetail(id);
      return normalizeMovieDetail(raw, region);
    }
    const raw = await tmdb.tvDetail(id);
    return normalizeTVDetail(raw, region);
  } catch (error) {
    if (isNotFoundError(error)) {
      // A genuine 404 is a real 404, not a transient failure: fall through to
      // mock so a bundled id still resolves, otherwise return null -> notFound().
      const fallback = mock.pickMockDetail(mediaType, id, region);
      return fallback;
    }
    if (error instanceof TmdbError) {
      console.error(
        `[data-source] getDetail(${mediaType}/${id}) fell back to mock:`,
        error,
      );
      return mock.pickMockDetail(mediaType, id, region);
    }
    console.error('[data-source] unexpected detail error:', error);
    return mock.pickMockDetail(mediaType, id, region);
  }
}

export function getMovieDetail(id: number, region: string): Promise<MediaDetail | null> {
  return getDetail('movie', id, region);
}

export function getTVDetail(id: number, region: string): Promise<MediaDetail | null> {
  return getDetail('tv', id, region);
}
