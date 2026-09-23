'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useWatchlist } from '@/context/WatchlistContext';
import { useServices } from '@/context/ServiceContext';
import { DEFAULT_FILTER_STATE, applyFilters, type FilterState } from '@/lib/filters';
import { PROVIDER_LIST } from '@/lib/providers/catalog';
import type { MediaItem } from '@/types/media';
import { Button, buttonClasses } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { MediaGrid } from './MediaGrid';
import { FilterPanel } from '@/components/search/FilterPanel';

export function WatchlistView() {
  const { entries, hydrated, clear } = useWatchlist();
  const { enabled } = useServices();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const items = useMemo<MediaItem[]>(
    () =>
      entries.map((entry) => ({
        id: entry.id,
        mediaType: entry.mediaType,
        title: entry.title,
        overview: '',
        posterPath: entry.posterPath,
        backdropPath: null,
        releaseDate: entry.releaseDate,
        voteAverage: entry.voteAverage,
        voteCount: 0,
        popularity: entry.addedAt,
        genreIds: [],
        providerIds: entry.providerIds,
      })),
    [entries],
  );

  const filtered = useMemo(() => applyFilters(items, filters), [items, filters]);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="aspect-[2/3] w-full rounded" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        title="Your watchlist is empty"
        description="Add titles from any detail page and they'll show up here, along with which of your services they're on."
        actionHref="/"
        actionLabel="Browse titles"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p aria-live="polite" className="text-sm text-text-secondary">
        {filtered.length} of {entries.length} saved title
        {entries.length === 1 ? '' : 's'}
      </p>

      <FilterPanel
        value={filters}
        onChange={setFilters}
        serviceOptions={
          enabled.length > 0 ? enabled : PROVIDER_LIST.map((p) => p.id)
        }
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No saved titles match your filters"
          description="Clear the filters above to see your whole watchlist."
        />
      ) : (
        <MediaGrid items={filtered} ariaLabel="Watchlist titles" />
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Clear watchlist
        </Button>
        <Link href="/" className={buttonClasses('secondary')}>
          Keep browsing
        </Link>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Clear your watchlist?"
        description="Every saved title will be removed from this browser. This cannot be undone."
        confirmLabel="Clear watchlist"
        onConfirm={() => {
          clear();
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
