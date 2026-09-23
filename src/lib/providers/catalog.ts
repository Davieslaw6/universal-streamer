import type { Provider, ProviderId } from '@/types/provider';

/**
 * A deliberately fixed, curated list. TMDB's watch/providers endpoint returns
 * dozens of region-specific providers; we intentionally surface only these nine
 * so the Settings toggles, home rows and search filters stay coherent.
 * Do not expand or contract this list without a product decision.
 */
export const PROVIDERS: Record<ProviderId, Provider> = {
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    tmdbId: 8,
    color: '#E50914',
    fallbackBadge: '/provider-fallbacks/netflix.svg',
    homepage: 'https://www.netflix.com',
  },
  'prime-video': {
    id: 'prime-video',
    name: 'Prime Video',
    tmdbId: 9,
    color: '#00A8E1',
    fallbackBadge: '/provider-fallbacks/prime-video.svg',
    homepage: 'https://www.amazon.com/primevideo',
  },
  'disney-plus': {
    id: 'disney-plus',
    name: 'Disney+',
    tmdbId: 337,
    color: '#113CCF',
    fallbackBadge: '/provider-fallbacks/disney-plus.svg',
    homepage: 'https://www.disneyplus.com',
  },
  max: {
    id: 'max',
    name: 'Max',
    tmdbId: 1899,
    color: '#002BE7',
    fallbackBadge: '/provider-fallbacks/max.svg',
    homepage: 'https://www.max.com',
  },
  hulu: {
    id: 'hulu',
    name: 'Hulu',
    tmdbId: 15,
    color: '#1CE783',
    fallbackBadge: '/provider-fallbacks/hulu.svg',
    homepage: 'https://www.hulu.com',
  },
  'apple-tv-plus': {
    id: 'apple-tv-plus',
    name: 'Apple TV+',
    tmdbId: 350,
    color: '#1C1C1E',
    fallbackBadge: '/provider-fallbacks/apple-tv-plus.svg',
    homepage: 'https://tv.apple.com',
  },
  'paramount-plus': {
    id: 'paramount-plus',
    name: 'Paramount+',
    tmdbId: 531,
    color: '#0064FF',
    fallbackBadge: '/provider-fallbacks/paramount-plus.svg',
    homepage: 'https://www.paramountplus.com',
  },
  peacock: {
    id: 'peacock',
    name: 'Peacock',
    tmdbId: 386,
    color: '#1C1C1E',
    fallbackBadge: '/provider-fallbacks/peacock.svg',
    homepage: 'https://www.peacocktv.com',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    tmdbId: 192,
    color: '#FF0000',
    fallbackBadge: '/provider-fallbacks/youtube.svg',
    homepage: 'https://www.youtube.com',
  },
};

export const PROVIDER_LIST: Provider[] = Object.values(PROVIDERS);

export const PROVIDER_IDS: ProviderId[] = PROVIDER_LIST.map((p) => p.id);

export const DEFAULT_ENABLED_PROVIDERS: ProviderId[] = [...PROVIDER_IDS];

export const TMDB_ID_TO_PROVIDER: ReadonlyMap<number, ProviderId> = new Map(
  PROVIDER_LIST.map((p) => [p.tmdbId, p.id]),
);

const VALID_IDS = new Set<string>(PROVIDER_IDS);

export function isProviderId(value: unknown): value is ProviderId {
  return typeof value === 'string' && VALID_IDS.has(value);
}

export function sanitizeProviderIds(values: unknown): ProviderId[] {
  if (!Array.isArray(values)) return [];
  const seen = new Set<ProviderId>();
  for (const value of values) {
    if (isProviderId(value)) seen.add(value);
  }
  return PROVIDER_IDS.filter((id) => seen.has(id));
}
