'use client';

import { PROVIDER_LIST } from '@/lib/providers/catalog';
import { GENRES } from '@/lib/constants';
import type { ProviderId } from '@/types/provider';
import type { MediaTypeFilter, SortKey } from '@/lib/filters';

export interface FilterPanelValue {
  type: MediaTypeFilter;
  services: ProviderId[];
  genreId: number | null;
  sort: SortKey;
}

export function FilterPanel({
  value,
  onChange,
  serviceOptions,
}: {
  value: FilterPanelValue;
  onChange: (next: FilterPanelValue) => void;
  serviceOptions: ProviderId[];
}) {
  const visibleProviders = PROVIDER_LIST.filter((provider) =>
    serviceOptions.includes(provider.id),
  );

  return (
    <div className="flex flex-col gap-4 rounded border border-border bg-bg-elevated p-4">
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Media type
        </legend>
        <div className="mt-2 flex gap-2">
          {(['all', 'movie', 'tv'] as MediaTypeFilter[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={value.type === option}
              onClick={() => onChange({ ...value, type: option })}
              className={`min-h-touch rounded border px-3 text-sm ${
                value.type === option
                  ? 'border-accent bg-bg-hover text-text-primary'
                  : 'border-border bg-bg text-text-secondary hover:bg-bg-hover'
              }`}
            >
              {option === 'all' ? 'All' : option === 'movie' ? 'Movies' : 'TV'}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Services
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {visibleProviders.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No services enabled. Turn some on in Settings.
            </p>
          ) : (
            visibleProviders.map((provider) => {
              const active = value.services.includes(provider.id);
              return (
                <button
                  key={provider.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    onChange({
                      ...value,
                      services: active
                        ? value.services.filter((id) => id !== provider.id)
                        : [...value.services, provider.id],
                    })
                  }
                  className={`inline-flex min-h-touch items-center gap-2 rounded border px-3 text-sm ${
                    active
                      ? 'border-accent bg-bg-hover text-text-primary'
                      : 'border-border bg-bg text-text-secondary hover:bg-bg-hover'
                  }`}
                >
                  <img
                    src={provider.fallbackBadge}
                    alt=""
                    aria-hidden="true"
                    width={16}
                    height={16}
                    className="rounded-sm"
                  />
                  {provider.name}
                </button>
              );
            })
          )}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="genre-filter"
            className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
          >
            Genre
          </label>
          <select
            id="genre-filter"
            value={value.genreId === null ? '' : String(value.genreId)}
            onChange={(event) =>
              onChange({
                ...value,
                genreId: event.target.value ? Number(event.target.value) : null,
              })
            }
            className="mt-2 min-h-touch w-full rounded border border-border bg-bg px-3 text-sm text-text-primary"
          >
            <option value="">Any genre</option>
            {GENRES.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="sort-filter"
            className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
          >
            Sort by
          </label>
          <select
            id="sort-filter"
            value={value.sort}
            onChange={(event) =>
              onChange({ ...value, sort: event.target.value as SortKey })
            }
            className="mt-2 min-h-touch w-full rounded border border-border bg-bg px-3 text-sm text-text-primary"
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="release">Release date</option>
          </select>
        </div>
      </div>
    </div>
  );
}
