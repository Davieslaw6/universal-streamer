'use client';

import { X } from 'lucide-react';
import { PROVIDERS } from '@/lib/providers/catalog';
import type { FilterState } from '@/lib/filters';

export function FilterChips({
  filters,
  onReset,
}: {
  filters: FilterState;
  onReset: () => void;
}) {
  const chips: string[] = [];

  if (filters.type !== 'all') {
    chips.push(filters.type === 'movie' ? 'Movies' : 'TV');
  }
  for (const id of filters.services) chips.push(PROVIDERS[id].name);
  if (filters.genreId !== null) chips.push(`Genre #${filters.genreId}`);
  if (filters.sort !== 'popularity') {
    chips.push(
      filters.sort === 'rating' ? 'Sorted by rating' : 'Sorted by release date',
    );
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-text-secondary">
        Filters
      </span>
      {chips.map((chip, index) => (
        <span
          key={`${chip}-${index}`}
          className="inline-flex items-center rounded-sm border border-border bg-bg-elevated px-2 py-1 text-xs text-text-secondary"
        >
          {chip}
        </span>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex min-h-touch items-center gap-1 rounded px-2 text-xs text-text-secondary hover:bg-bg-hover hover:text-text-primary"
      >
        <X aria-hidden="true" className="h-3.5 w-3.5" />
        Clear filters
      </button>
    </div>
  );
}
