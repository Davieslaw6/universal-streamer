import type { ProviderId } from '@/types/provider';

/**
 * Best-effort fallback deep links. These are plain public search URLs — no
 * scraping, no undocumented endpoints, no API keys. Any of them may drift if a
 * service changes its URL scheme; when TMDB supplies a region link we prefer it.
 */
const FALLBACK_BUILDERS: Record<ProviderId, (q: string) => string> = {
  netflix: (q) => `https://www.netflix.com/search?q=${q}`,
  'prime-video': (q) => `https://www.amazon.com/s?k=${q}&i=instant-video`,
  'disney-plus': (q) => `https://www.disneyplus.com/search?q=${q}`,
  max: (q) => `https://play.max.com/search?q=${q}`,
  hulu: (q) => `https://www.hulu.com/search?q=${q}`,
  'apple-tv-plus': (q) => `https://tv.apple.com/search?term=${q}`,
  'paramount-plus': (q) => `https://www.paramountplus.com/search/${q}`,
  peacock: (q) => `https://www.peacocktv.com/search?q=${q}`,
  youtube: (q) => `https://www.youtube.com/results?search_query=${q}+trailer`,
};

export function buildQuery(title: string, year?: string | number | null): string {
  const trimmed = title.trim();
  const y = typeof year === 'number' ? String(year) : (year ?? '').trim();
  return encodeURIComponent(y ? `${trimmed} ${y}` : trimmed);
}

/**
 * Builds an official-service deep link. When TMDB provided a region-specific
 * watch link it wins; otherwise we construct a search URL from the table above.
 */
export function buildWatchUrl(
  providerId: ProviderId,
  title: string,
  year?: string | number | null,
  tmdbLink?: string | null,
): string {
  if (tmdbLink && /^https?:\/\//i.test(tmdbLink)) return tmdbLink;
  return FALLBACK_BUILDERS[providerId](buildQuery(title, year));
}

export function buildTrailerSearchUrl(
  title: string,
  year?: string | number | null,
): string {
  return FALLBACK_BUILDERS.youtube(buildQuery(title, year));
}
