import type { Availability, ProviderId } from './provider';

export type MediaType = 'movie' | 'tv';

export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  /** ISO date string (YYYY-MM-DD) or null. */
  releaseDate: string | null;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genreIds: number[];
  /** Providers carrying this title in the requested region. */
  providerIds: ProviderId[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MediaDetail extends MediaItem {
  tagline: string | null;
  /** Minutes, movies only. */
  runtime: number | null;
  /** TV only. */
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  genres: Genre[];
  cast: CastMember[];
  similar: MediaItem[];
  availability: Availability;
}
