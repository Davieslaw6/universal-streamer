/**
 * Minimal TMDB response shapes. Only the fields we actually read are declared;
 * everything is optional so a schema drift degrades gracefully instead of
 * throwing. This file is type-only and safe to import from anywhere.
 */

export interface TmdbListItem {
  id: number;
  media_type?: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
}

export interface TmdbPaged<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
  order?: number;
}

export interface TmdbCredits {
  cast?: TmdbCastMember[];
}

export interface TmdbProviderEntry {
  provider_id: number;
  provider_name: string;
  display_priority?: number;
}

export interface TmdbRegionWatch {
  link?: string;
  flatrate?: TmdbProviderEntry[];
  free?: TmdbProviderEntry[];
  rent?: TmdbProviderEntry[];
  buy?: TmdbProviderEntry[];
  ads?: TmdbProviderEntry[];
}

export interface TmdbWatchProviders {
  results?: Record<string, TmdbRegionWatch>;
}

export interface TmdbMovieDetail {
  id: number;
  title?: string;
  overview?: string;
  tagline?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  runtime?: number | null;
  genres?: TmdbGenre[];
  credits?: TmdbCredits;
  similar?: TmdbPaged<TmdbListItem>;
  /** Literal key returned by append_to_response=watch/providers. */
  'watch/providers'?: TmdbWatchProviders;
}

export interface TmdbTVDetail {
  id: number;
  name?: string;
  overview?: string;
  tagline?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
  genres?: TmdbGenre[];
  credits?: TmdbCredits;
  similar?: TmdbPaged<TmdbListItem>;
  'watch/providers'?: TmdbWatchProviders;
}
