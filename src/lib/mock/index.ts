import type {
  CastMember,
  Genre,
  MediaDetail,
  MediaItem,
  MediaType,
} from '@/types/media';
import type {
  Availability,
  AvailabilityType,
  ProviderAvailability,
  ProviderId,
} from '@/types/provider';
import { GENRES } from '@/lib/constants';
import { PROVIDER_IDS } from '@/lib/providers/catalog';
import { MOCK_MOVIES, type MockEntry } from './movies';
import { MOCK_TV } from './tv';

const ALL_ENTRIES: MockEntry[] = [...MOCK_MOVIES, ...MOCK_TV];

function sortProviderIds(ids: Iterable<ProviderId>): ProviderId[] {
  const set = new Set(ids);
  return PROVIDER_IDS.filter((id) => set.has(id));
}

function entryProviderIds(entry: MockEntry): ProviderId[] {
  return sortProviderIds([
    ...(entry.flatrate ?? []),
    ...(entry.free ?? []),
    ...(entry.ads ?? []),
    ...(entry.rent ?? []),
    ...(entry.buy ?? []),
  ]);
}

export function toMediaItem(entry: MockEntry): MediaItem {
  return {
    id: entry.id,
    mediaType: entry.mediaType,
    title: entry.title,
    overview: entry.overview,
    posterPath: null,
    backdropPath: null,
    releaseDate: entry.releaseDate,
    voteAverage: entry.voteAverage,
    voteCount: entry.voteCount,
    popularity: entry.popularity,
    genreIds: entry.genreIds,
    providerIds: entryProviderIds(entry),
  };
}

function bucket(
  ids: ProviderId[] | undefined,
  type: AvailabilityType,
  link: string | null,
): ProviderAvailability[] {
  if (!ids) return [];
  return sortProviderIds(ids).map((providerId) => ({
    providerId,
    type,
    tmdbLink: link,
  }));
}

function entryAvailability(entry: MockEntry, region: string): Availability {
  return {
    region,
    link: null,
    groups: {
      flatrate: bucket(entry.flatrate, 'flatrate', null),
      free: bucket(entry.free, 'free', null),
      rent: bucket(entry.rent, 'rent', null),
      buy: bucket(entry.buy, 'buy', null),
      ads: bucket(entry.ads, 'ads', null),
    },
  };
}

function entryGenres(entry: MockEntry): Genre[] {
  const names = new Map(GENRES.map((g) => [g.id, g.name]));
  return entry.genreIds
    .map((id) => {
      const name = names.get(id);
      return name ? { id, name } : null;
    })
    .filter((g): g is Genre => g !== null);
}

export function toMediaDetail(entry: MockEntry, region: string): MediaDetail {
  const item = toMediaItem(entry);
  const related = ALL_ENTRIES.filter(
    (candidate) =>
      candidate.id !== entry.id &&
      candidate.mediaType === entry.mediaType &&
      candidate.genreIds.some((g) => entry.genreIds.includes(g)),
  )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 12)
    .map(toMediaItem);

  return {
    ...item,
    tagline: entry.tagline ?? null,
    runtime: entry.runtime ?? null,
    numberOfSeasons: entry.numberOfSeasons ?? null,
    numberOfEpisodes: entry.numberOfEpisodes ?? null,
    genres: entryGenres(entry),
    cast: (entry.cast ?? []) as CastMember[],
    similar: related,
    availability: entryAvailability(entry, region),
  };
}

function sorted(entries: MockEntry[], key: 'popularity' | 'voteAverage' | 'releaseDate'): MediaItem[] {
  const copy = [...entries];
  copy.sort((a, b) => {
    if (key === 'releaseDate') {
      return b.releaseDate.localeCompare(a.releaseDate);
    }
    return b[key] - a[key];
  });
  return copy.map(toMediaItem);
}

export function pickMockTrending(): MediaItem[] {
  return sorted(ALL_ENTRIES, 'popularity').slice(0, 12);
}

export function pickMockPopularMovies(): MediaItem[] {
  return sorted(MOCK_MOVIES, 'popularity').slice(0, 12);
}

export function pickMockPopularTV(): MediaItem[] {
  return sorted(MOCK_TV, 'popularity').slice(0, 12);
}

export function pickMockTopRated(): MediaItem[] {
  return sorted(ALL_ENTRIES, 'voteAverage').slice(0, 12);
}

export function pickMockByProvider(
  providerId: ProviderId,
  mediaType: MediaType | 'all',
): MediaItem[] {
  return ALL_ENTRIES.filter((entry) => {
    if (mediaType !== 'all' && entry.mediaType !== mediaType) return false;
    return entryProviderIds(entry).includes(providerId);
  })
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 12)
    .map(toMediaItem);
}

export function pickMockSearch(query: string): MediaItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_ENTRIES.filter((entry) => {
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.overview.toLowerCase().includes(q)
    );
  })
    .sort((a, b) => b.popularity - a.popularity)
    .map(toMediaItem);
}

export function pickMockDetail(
  mediaType: MediaType,
  id: number,
  region: string,
): MediaDetail | null {
  const entry = ALL_ENTRIES.find(
    (candidate) => candidate.mediaType === mediaType && candidate.id === id,
  );
  return entry ? toMediaDetail(entry, region) : null;
}
