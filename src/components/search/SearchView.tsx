'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useServices } from '@/context/ServiceContext';
import {
  DEFAULT_FILTER_STATE,
  applyFilters,
  hasActiveFilters,
  type FilterState,
} from '@/lib/filters';
import type { MediaItem } from '@/types/media';
import { MediaGrid } from '@/components/media/MediaGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterChips } from './FilterChips';
import { FilterPanel } from './FilterPanel';

export function SearchView({
  query,
  results,
}: {
  query: string;
  results: MediaItem[];
}) {
  const { enabled } = useServices();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  const filtered = useMemo(
    () => applyFilters(results, filters),
    [results, filters],
  );

  const servicesForFilter = enabled.length > 0 ? enabled : [];

  if (!query.trim()) {
    return (
      <EmptyState
        title="Search Universal Streamer"
        description="Find a movie or TV show and see exactly which of your services it's on."
        actionHref="/"
        actionLabel="Back to Home"
      />
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <p aria-live="polite" className="text-sm text-text-secondary">
          No results for “{query}”.
        </p>
        <EmptyState
          title="Nothing matched"
          description="Try a different spelling, a shorter query, or a different title."
          actionHref="/"
          actionLabel="Back to Home"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p aria-live="polite" className="text-sm text-text-secondary">
        {filtered.length} of {results.length} result
        {results.length === 1 ? '' : 's'} for “{query}”
      </p>

      <FilterPanel
        value={filters}
        onChange={setFilters}
        serviceOptions={servicesForFilter}
      />

      <FilterChips
        filters={filters}
        onReset={() => setFilters(DEFAULT_FILTER_STATE)}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No results match your filters"
          description="Loosen the filters above to see more of what we found."
        />
      ) : (
        <MediaGrid items={filtered} ariaLabel={`Search results for ${query}`} />
      )}

      {hasActiveFilters(filters) ? (
        <p className="text-xs text-text-secondary">
          Tip:{' '}
          <Link href="/settings" className="underline underline-offset-2">
            enable more services
          </Link>{' '}
          to widen your results.
        </p>
      ) : null}
    </div>
  );
}
