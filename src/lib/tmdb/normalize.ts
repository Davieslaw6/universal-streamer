import type {
  CastMember,
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
import { TMDB_ID_TO_PROVIDER } from '@/lib/providers/catalog';
import { EMPTY_AVAILABILITY } from '@/types/provider';
import { genreName } from '@/lib/constants';
import type {
  TmdbListItem,
  TmdbMovieDetail,
  TmdbRegionWatch,
  TmdbTVDetail,
  TmdbWatchProviders,
} from './types';

const PROVIDER_ORDER: ProviderId[] = [
  'netflix',
  'prime-video',
  'disney-plus',
  'max',
  'hulu',
  'apple-tv-plus',
  'paramount-plus',
  'peacock',
  'youtube',
];

function sortProviderIds(ids: Iterable<ProviderId>): ProviderId[] {
  const set = new Set(ids);
  return PROVIDER_ORDER.filter((id) => set.has(id));
}

function resolveMediaType(
  raw: TmdbListItem,
  fallback: MediaType,
): MediaType {
  if (raw.media_type === 'movie' || raw.media_type === 'tv') return raw.media_type;
  return fallback;
}

export function normalizeListItem(
  raw: TmdbListItem,
  fallbackType: MediaType,
  providerIds: ProviderId[] = [],
): MediaItem {
  return {
    id: raw.id,
    mediaType: resolveMediaType(raw, fallbackType),
    title: raw.title ?? raw.name ?? 'Untitled',
    overview: raw.overview ?? '',
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    releaseDate: raw.release_date ?? raw.first_air_date ?? null,
    voteAverage: raw.vote_average ?? 0,
    voteCount: raw.vote_count ?? 0,
    popularity: raw.popularity ?? 0,
    genreIds: raw.genre_ids ?? [],
    providerIds: sortProviderIds(providerIds),
  };
}

export function normalizeList(
  raws: readonly TmdbListItem[],
  fallbackType: MediaType,
  providersById: ReadonlyMap<number, ProviderId[]> = new Map(),
): MediaItem[] {
  return raws.map((raw) =>
    normalizeListItem(raw, fallbackType, providersById.get(raw.id) ?? []),
  );
}

/** Pulls the requested region's watch buckets out of a TMDB providers payload. */
export function extractAvailability(
  payload: TmdbWatchProviders | undefined,
  region: string,
): Availability {
  const regionData: TmdbRegionWatch | undefined = payload?.results?.[region];
  if (!regionData) return { ...EMPTY_AVAILABILITY, region };

  const groups: Availability['groups'] = {
    flatrate: [],
    free: [],
    rent: [],
    buy: [],
    ads: [],
  };

  const buckets: AvailabilityType[] = ['flatrate', 'free', 'rent', 'buy', 'ads'];

  for (const bucket of buckets) {
    const entries = regionData[bucket];
    if (!entries) continue;
    for (const entry of entries) {
      const providerId = TMDB_ID_TO_PROVIDER.get(entry.provider_id);
      if (!providerId) continue; // not in our curated nine
      const item: ProviderAvailability = {
        providerId,
        type: bucket,
        tmdbLink: regionData.link ?? null,
      };
      if (!groups[bucket].some((g) => g.providerId === providerId)) {
        groups[bucket].push(item);
      }
    }
  }

  return {
    region,
    link: regionData.link ?? null,
    groups,
  };
}

/** Flattens availability into a de-duplicated provider list for card badges. */
export function availabilityToProviderIds(
  availability: Availability,
): ProviderId[] {
  const ids: ProviderId[] = [];
  for (const bucket of ['flatrate', 'free', 'ads', 'rent', 'buy'] as const) {
    for (const entry of availability.groups[bucket]) ids.push(entry.providerId);
  }
  return sortProviderIds(ids);
}

function normalizeCast(
  cast: readonly { id: number; name: string; character?: string; profile_path?: string | null }[] | undefined,
): CastMember[] {
  if (!cast) return [];
  return cast.slice(0, 10).map((member) => ({
    id: member.id,
    name: member.name,
    character: member.character ?? '',
    profilePath: member.profile_path ?? null,
  }));
}

function normalizeGenres(
  genres: readonly { id: number; name: string }[] | undefined,
  genreIds: number[],
): { id: number; name: string }[] {
  if (genres && genres.length > 0) {
    return genres.map((g) => ({ id: g.id, name: g.name }));
  }
  return genreIds
    .map((id) => {
      const name = genreName(id);
      return name ? { id, name } : null;
    })
    .filter((g): g is { id: number; name: string } => g !== null);
}

export function normalizeMovieDetail(
  raw: TmdbMovieDetail,
  region: string,
): MediaDetail {
  const availability = extractAvailability(raw['watch/providers'], region);
  const genreIds = (raw.genres ?? []).map((g) => g.id);

  return {
    id: raw.id,
    mediaType: 'movie',
    title: raw.title ?? 'Untitled',
    overview: raw.overview ?? '',
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    releaseDate: raw.release_date ?? null,
    voteAverage: raw.vote_average ?? 0,
    voteCount: raw.vote_count ?? 0,
    popularity: raw.popularity ?? 0,
    genreIds,
    providerIds: availabilityToProviderIds(availability),
    tagline: raw.tagline ?? null,
    runtime: raw.runtime ?? null,
    numberOfSeasons: null,
    numberOfEpisodes: null,
    genres: normalizeGenres(raw.genres, genreIds),
    cast: normalizeCast(raw.credits?.cast),
    similar: normalizeList(raw.similar?.results ?? [], 'movie'),
    availability,
  };
}

export function normalizeTVDetail(
  raw: TmdbTVDetail,
  region: string,
): MediaDetail {
  const availability = extractAvailability(raw['watch/providers'], region);
  const genreIds = (raw.genres ?? []).map((g) => g.id);

  return {
    id: raw.id,
    mediaType: 'tv',
    title: raw.name ?? 'Untitled',
    overview: raw.overview ?? '',
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    releaseDate: raw.first_air_date ?? null,
    voteAverage: raw.vote_average ?? 0,
    voteCount: raw.vote_count ?? 0,
    popularity: raw.popularity ?? 0,
    genreIds,
    providerIds: availabilityToProviderIds(availability),
    tagline: raw.tagline ?? null,
    runtime: null,
    numberOfSeasons: raw.number_of_seasons ?? null,
    numberOfEpisodes: raw.number_of_episodes ?? null,
    genres: normalizeGenres(raw.genres, genreIds),
    cast: normalizeCast(raw.credits?.cast),
    similar: normalizeList(raw.similar?.results ?? [], 'tv'),
    availability,
  };
}
