import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FILTER_STATE,
  applyFilters,
  hasActiveFilters,
  type FilterState,
} from '@/lib/filters';
import type { MediaItem } from '@/types/media';

function item(partial: Partial<MediaItem> & Pick<MediaItem, 'id'>): MediaItem {
  return {
    mediaType: 'movie',
    title: `Title ${partial.id}`,
    overview: '',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2020-01-01',
    voteAverage: 5,
    voteCount: 100,
    popularity: 10,
    genreIds: [],
    providerIds: [],
    ...partial,
  };
}

const CATALOGUE: MediaItem[] = [
  item({ id: 1, mediaType: 'movie', popularity: 50, voteAverage: 7, releaseDate: '2015-01-01', genreIds: [28], providerIds: ['netflix'] }),
  item({ id: 2, mediaType: 'tv', popularity: 90, voteAverage: 9, releaseDate: '2022-01-01', genreIds: [35], providerIds: ['prime-video'] }),
  item({ id: 3, mediaType: 'movie', popularity: 20, voteAverage: 6, releaseDate: '1999-01-01', genreIds: [28, 35], providerIds: [] }),
  item({ id: 4, mediaType: 'tv', popularity: 70, voteAverage: 8, releaseDate: '2001-01-01', genreIds: [18], providerIds: ['netflix', 'hulu'] }),
];

function withFilters(partial: Partial<FilterState>): FilterState {
  return { ...DEFAULT_FILTER_STATE, ...partial };
}

describe('applyFilters', () => {
  it('returns everything with default filters, sorted by popularity desc', () => {
    const result = applyFilters(CATALOGUE, DEFAULT_FILTER_STATE);
    expect(result.map((r) => r.id)).toEqual([2, 4, 1, 3]);
  });

  it('filters by media type', () => {
    const result = applyFilters(CATALOGUE, withFilters({ type: 'tv' }));
    expect(result.map((r) => r.id)).toEqual([2, 4]);
  });

  it('filters by service (any-of semantics)', () => {
    const result = applyFilters(
      CATALOGUE,
      withFilters({ services: ['netflix'] }),
    );
    expect(result.map((r) => r.id)).toEqual([1, 4]);
  });

  it('supports multiple services', () => {
    const result = applyFilters(
      CATALOGUE,
      withFilters({ services: ['hulu', 'prime-video'] }),
    );
    expect(result.map((r) => r.id)).toEqual([2, 4]);
  });

  it('filters by genre', () => {
    const result = applyFilters(CATALOGUE, withFilters({ genreId: 28 }));
    expect(result.map((r) => r.id)).toEqual([1, 3]);
  });

  it('sorts by rating desc, tie-broken by vote count', () => {
    const result = applyFilters(CATALOGUE, withFilters({ sort: 'rating' }));
    expect(result.map((r) => r.id)).toEqual([2, 4, 1, 3]);
  });

  it('sorts by release date desc', () => {
    const result = applyFilters(CATALOGUE, withFilters({ sort: 'release' }));
    expect(result.map((r) => r.id)).toEqual([2, 1, 4, 3]);
  });

  it('does not mutate the input array', () => {
    const snapshot = CATALOGUE.map((entry) => entry.id);
    applyFilters(CATALOGUE, withFilters({ sort: 'rating' }));
    expect(CATALOGUE.map((entry) => entry.id)).toEqual(snapshot);
  });

  it('combines type + service + genre filters', () => {
    const result = applyFilters(
      CATALOGUE,
      withFilters({ type: 'movie', services: ['netflix'], genreId: 28 }),
    );
    expect(result.map((r) => r.id)).toEqual([1]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(
      applyFilters(CATALOGUE, withFilters({ services: ['peacock'] })),
    ).toEqual([]);
  });
});

describe('hasActiveFilters', () => {
  it('is false for the default state', () => {
    expect(hasActiveFilters(DEFAULT_FILTER_STATE)).toBe(false);
  });

  it('is true when any facet is set', () => {
    expect(hasActiveFilters(withFilters({ type: 'movie' }))).toBe(true);
    expect(hasActiveFilters(withFilters({ services: ['netflix'] }))).toBe(true);
    expect(hasActiveFilters(withFilters({ genreId: 28 }))).toBe(true);
    expect(hasActiveFilters(withFilters({ sort: 'rating' }))).toBe(true);
  });
});
