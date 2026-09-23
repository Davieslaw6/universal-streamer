import type { MediaItem, MediaType } from '@/types/media';
import type { ProviderId } from '@/types/provider';

export type MediaTypeFilter = 'all' | MediaType;
export type SortKey = 'popularity' | 'rating' | 'release';

export interface FilterState {
  type: MediaTypeFilter;
  /** Empty array means "any service". */
  services: ProviderId[];
  genreId: number | null;
  sort: SortKey;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  type: 'all',
  services: [],
  genreId: null,
  sort: 'popularity',
};

export function applyFilters(
  items: readonly MediaItem[],
  filters: FilterState,
): MediaItem[] {
  const filtered = items.filter((item) => {
    if (filters.type !== 'all' && item.mediaType !== filters.type) return false;

    if (filters.services.length > 0) {
      const hasAny = item.providerIds.some((id) =>
        filters.services.includes(id),
      );
      if (!hasAny) return false;
    }

    if (filters.genreId !== null && !item.genreIds.includes(filters.genreId)) {
      return false;
    }

    return true;
  });

  const sorted = [...filtered];

  switch (filters.sort) {
    case 'rating':
      sorted.sort(
        (a, b) => b.voteAverage - a.voteAverage || b.voteCount - a.voteCount,
      );
      break;
    case 'release':
      sorted.sort((a, b) => {
        const da = a.releaseDate ?? '';
        const db = b.releaseDate ?? '';
        if (da === db) return b.popularity - a.popularity;
        return db.localeCompare(da);
      });
      break;
    case 'popularity':
    default:
      sorted.sort((a, b) => b.popularity - a.popularity);
      break;
  }

  return sorted;
}

export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.type !== 'all' ||
    filters.services.length > 0 ||
    filters.genreId !== null ||
    filters.sort !== 'popularity'
  );
}
