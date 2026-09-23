import type { Genre } from '@/types/media';

export const DEFAULT_REGION = 'US';

/** Max items rendered per carousel. Also caps live-mode provider hydration fan-out. */
export const LIST_LIMIT = 12;

export const THEME_STORAGE_KEY = 'us:theme';
export const SERVICES_STORAGE_KEY = 'us:services';
export const WATCHLIST_STORAGE_KEY = 'us:watchlist';
export const REGION_STORAGE_KEY = 'us:region';
export const REGION_COOKIE = 'us:region';

export const STORAGE_PREFIX = 'us:';

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

/**
 * TMDB genre ids are stable across movie/tv. A static list avoids an extra
 * network round trip on every search page render.
 */
export const GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
  { id: 10759, name: 'Action & Adventure' },
  { id: 10762, name: 'Kids' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
];

const GENRE_NAME_BY_ID = new Map(GENRES.map((g) => [g.id, g.name]));

export function genreName(id: number): string | null {
  return GENRE_NAME_BY_ID.get(id) ?? null;
}
