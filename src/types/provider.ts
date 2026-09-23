export type ProviderId =
  | 'netflix'
  | 'prime-video'
  | 'disney-plus'
  | 'max'
  | 'hulu'
  | 'apple-tv-plus'
  | 'paramount-plus'
  | 'peacock'
  | 'youtube';

export interface Provider {
  id: ProviderId;
  name: string;
  /** TMDB watch-provider id, used for discover + provider matching. */
  tmdbId: number;
  /** Brand colour, used only as a chip background for the generic badge. */
  color: string;
  /** Path to a generic, non-trademarked local badge. */
  fallbackBadge: string;
  homepage: string;
}

export type AvailabilityType = 'flatrate' | 'free' | 'rent' | 'buy' | 'ads';

export interface ProviderAvailability {
  providerId: ProviderId;
  type: AvailabilityType;
  /** TMDB-provided region deep link, when TMDB supplied one. */
  tmdbLink: string | null;
}

export interface AvailabilityGroups {
  flatrate: ProviderAvailability[];
  free: ProviderAvailability[];
  rent: ProviderAvailability[];
  buy: ProviderAvailability[];
  ads: ProviderAvailability[];
}

export interface Availability {
  region: string;
  /** TMDB watch page for the region (results[REGION].link), if supplied. */
  link: string | null;
  groups: AvailabilityGroups;
}

export const EMPTY_AVAILABILITY: Availability = {
  region: 'US',
  link: null,
  groups: { flatrate: [], free: [], rent: [], buy: [], ads: [] },
};
