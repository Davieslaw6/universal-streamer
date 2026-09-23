import { describe, expect, it } from 'vitest';
import {
  availabilityToProviderIds,
  extractAvailability,
  normalizeListItem,
  normalizeMovieDetail,
  normalizeTVDetail,
} from '@/lib/tmdb/normalize';
import type { TmdbMovieDetail, TmdbTVDetail, TmdbWatchProviders } from '@/lib/tmdb/types';

const PROVIDERS_PAYLOAD: TmdbWatchProviders = {
  results: {
    US: {
      link: 'https://www.themoviedb.org/movie/550/watch?locale=US',
      flatrate: [{ provider_id: 8, provider_name: 'Netflix' }],
      rent: [
        { provider_id: 2, provider_name: 'Apple TV' },
        { provider_id: 9, provider_name: 'Amazon Prime Video' },
      ],
      buy: [{ provider_id: 192, provider_name: 'YouTube' }],
    },
    GB: {
      link: 'https://www.themoviedb.org/movie/550/watch?locale=GB',
      flatrate: [{ provider_id: 337, provider_name: 'Disney Plus' }],
    },
  },
};

describe('normalizeListItem', () => {
  it('maps TMDB fields to the internal MediaItem shape', () => {
    const result = normalizeListItem(
      {
        id: 550,
        media_type: 'movie',
        title: 'Fight Club',
        overview: 'An insomniac…',
        poster_path: '/poster.jpg',
        backdrop_path: null,
        release_date: '1999-10-15',
        vote_average: 8.4,
        vote_count: 28500,
        popularity: 62.4,
        genre_ids: [18, 53],
      },
      'movie',
      ['netflix'],
    );

    expect(result).toEqual({
      id: 550,
      mediaType: 'movie',
      title: 'Fight Club',
      overview: 'An insomniac…',
      posterPath: '/poster.jpg',
      backdropPath: null,
      releaseDate: '1999-10-15',
      voteAverage: 8.4,
      voteCount: 28500,
      popularity: 62.4,
      genreIds: [18, 53],
      providerIds: ['netflix'],
    });
  });

  it('falls back to name/first_air_date for TV entries', () => {
    const result = normalizeListItem(
      { id: 1399, media_type: 'tv', name: 'Game of Thrones', first_air_date: '2011-04-17' },
      'tv',
    );
    expect(result.title).toBe('Game of Thrones');
    expect(result.releaseDate).toBe('2011-04-17');
    expect(result.mediaType).toBe('tv');
  });

  it('uses the fallback type when media_type is absent', () => {
    const result = normalizeListItem({ id: 1, title: 'Unknown' }, 'movie');
    expect(result.mediaType).toBe('movie');
  });

  it('tolerates missing optional fields', () => {
    const result = normalizeListItem({ id: 2 }, 'tv');
    expect(result.title).toBe('Untitled');
    expect(result.overview).toBe('');
    expect(result.voteAverage).toBe(0);
    expect(result.genreIds).toEqual([]);
    expect(result.providerIds).toEqual([]);
  });

  it('orders provider ids deterministically', () => {
    const result = normalizeListItem({ id: 3 }, 'movie', ['youtube', 'netflix', 'hulu']);
    expect(result.providerIds).toEqual(['netflix', 'hulu', 'youtube']);
  });
});

describe('extractAvailability', () => {
  it('reads the requested region and keeps only curated providers', () => {
    const availability = extractAvailability(PROVIDERS_PAYLOAD, 'US');
    expect(availability.region).toBe('US');
    expect(availability.link).toBe(
      'https://www.themoviedb.org/movie/550/watch?locale=US',
    );
    expect(availability.groups.flatrate.map((e) => e.providerId)).toEqual(['netflix']);
    // provider_id 2 (Apple TV) is not in the curated nine
    expect(availability.groups.rent.map((e) => e.providerId)).toEqual(['prime-video']);
    expect(availability.groups.buy.map((e) => e.providerId)).toEqual(['youtube']);
    expect(availability.groups.free).toEqual([]);
  });

  it('returns an empty structure for an unknown region', () => {
    const availability = extractAvailability(PROVIDERS_PAYLOAD, 'ZZ');
    expect(availability.region).toBe('ZZ');
    expect(availability.link).toBeNull();
    expect(availability.groups.flatrate).toEqual([]);
  });

  it('returns an empty structure when the payload is missing entirely', () => {
    const availability = extractAvailability(undefined, 'US');
    expect(availability.link).toBeNull();
    expect(availabilityToProviderIds(availability)).toEqual([]);
  });

  it('attaches the region link to every provider entry', () => {
    const availability = extractAvailability(PROVIDERS_PAYLOAD, 'GB');
    expect(availability.groups.flatrate[0]?.tmdbLink).toBe(
      'https://www.themoviedb.org/movie/550/watch?locale=GB',
    );
    expect(availability.groups.flatrate[0]?.providerId).toBe('disney-plus');
  });

  it('de-duplicates a provider appearing in multiple buckets for badge rendering', () => {
    const availability = extractAvailability(PROVIDERS_PAYLOAD, 'US');
    const ids = availabilityToProviderIds(availability);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(['netflix', 'prime-video', 'youtube']);
  });
});

describe('normalizeMovieDetail', () => {
  const raw: TmdbMovieDetail = {
    id: 550,
    title: 'Fight Club',
    overview: 'An insomniac…',
    tagline: 'Mischief. Mayhem. Soap.',
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '1999-10-15',
    vote_average: 8.433,
    vote_count: 28500,
    popularity: 62.4,
    runtime: 139,
    genres: [
      { id: 18, name: 'Drama' },
      { id: 53, name: 'Thriller' },
    ],
    credits: {
      cast: Array.from({ length: 15 }).map((_, index) => ({
        id: index + 1,
        name: `Actor ${index + 1}`,
        character: `Role ${index + 1}`,
        profile_path: null,
      })),
    },
    similar: {
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [{ id: 999, media_type: 'movie', title: 'Similar One' }],
    },
    'watch/providers': PROVIDERS_PAYLOAD,
  };

  it('produces a MediaDetail with every required field', () => {
    const detail = normalizeMovieDetail(raw, 'US');
    expect(detail.mediaType).toBe('movie');
    expect(detail.title).toBe('Fight Club');
    expect(detail.runtime).toBe(139);
    expect(detail.numberOfSeasons).toBeNull();
    expect(detail.genres.map((g) => g.name)).toEqual(['Drama', 'Thriller']);
    expect(detail.availability.region).toBe('US');
    expect(detail.providerIds).toEqual(['netflix', 'prime-video', 'youtube']);
    expect(detail.similar.map((s) => s.id)).toEqual([999]);
  });

  it('caps the cast list at ten members', () => {
    const detail = normalizeMovieDetail(raw, 'US');
    expect(detail.cast).toHaveLength(10);
  });
});

describe('normalizeTVDetail', () => {
  const raw: TmdbTVDetail = {
    id: 1399,
    name: 'Game of Thrones',
    overview: 'Seven noble families…',
    first_air_date: '2011-04-17',
    vote_average: 8.44,
    vote_count: 23500,
    popularity: 91.2,
    number_of_seasons: 8,
    number_of_episodes: 73,
    genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }],
    credits: { cast: [{ id: 1, name: 'Emilia Clarke', character: 'Daenerys', profile_path: null }] },
    similar: { page: 1, total_pages: 1, total_results: 0, results: [] },
    'watch/providers': PROVIDERS_PAYLOAD,
  };

  it('produces a MediaDetail with TV-specific fields', () => {
    const detail = normalizeTVDetail(raw, 'GB');
    expect(detail.mediaType).toBe('tv');
    expect(detail.title).toBe('Game of Thrones');
    expect(detail.runtime).toBeNull();
    expect(detail.numberOfSeasons).toBe(8);
    expect(detail.numberOfEpisodes).toBe(73);
    expect(detail.providerIds).toEqual(['disney-plus']);
    expect(detail.similar).toEqual([]);
  });

  it('handles a detail response with no providers payload', () => {
    const detail = normalizeTVDetail({ id: 1 }, 'US');
    expect(detail.providerIds).toEqual([]);
    expect(detail.availability.groups.flatrate).toEqual([]);
    expect(detail.title).toBe('Untitled');
  });
});
