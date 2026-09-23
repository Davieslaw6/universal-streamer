import { TMDB_IMAGE_BASE } from './constants';

export type ImageSize =
  | 'w200'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'w1280'
  | 'original';

export function imageUrl(
  path: string | null | undefined,
  size: ImageSize,
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function releaseYear(date: string | null | undefined): string {
  if (!date) return '—';
  const year = date.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : '—';
}

export function formatRuntime(minutes: number | null): string | null {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatSeasons(
  seasons: number | null,
  episodes: number | null,
): string | null {
  if (!seasons || seasons <= 0) return null;
  const s = `${seasons} season${seasons === 1 ? '' : 's'}`;
  if (!episodes || episodes <= 0) return s;
  return `${s} · ${episodes} episodes`;
}

export function formatVote(vote: number | null | undefined): string {
  if (typeof vote !== 'number' || Number.isNaN(vote) || vote <= 0) return 'NR';
  return vote.toFixed(1);
}

export function initials(title: string): string {
  const words = title
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Deterministic hue from an id, so mock placeholders are stable per title. */
export function placeholderHue(id: number): number {
  return (id * 47) % 360;
}
