'use client';

import { useServices } from '@/context/ServiceContext';
import { PROVIDER_LIST } from '@/lib/providers/catalog';
import { Button } from '@/components/ui/Button';

export function ServiceToggles() {
  const { enabled, toggle, enableAll, disableAll, reset } = useServices();

  return (
    <section aria-labelledby="services-heading" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="services-heading" className="text-base font-semibold text-text-primary">
          Your streaming services
        </h2>
        <div className="flex gap-2">
          <Button size="sm" onClick={enableAll}>
            Enable all
          </Button>
          <Button size="sm" onClick={disableAll}>
            Disable all
          </Button>
          <Button size="sm" variant="ghost" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      <p className="text-sm text-text-secondary">
        These toggles drive the home rows and the search filters. This is a
        curated list of nine services — not every provider TMDB knows about.
      </p>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {PROVIDER_LIST.map((provider) => {
          const active = enabled.includes(provider.id);
          const inputId = `service-${provider.id}`;
          return (
            <li key={provider.id}>
              <label
                htmlFor={inputId}
                className={`flex min-h-touch cursor-pointer items-center gap-3 rounded border px-3 py-2 ${
                  active
                    ? 'border-accent bg-bg-hover'
                    : 'border-border bg-bg-elevated hover:bg-bg-hover'
                }`}
              >
                <input
                  id={inputId}
                  type="checkbox"
                  checked={active}
                  onChange={() => toggle(provider.id)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                <img
                  src={provider.fallbackBadge}
                  alt=""
                  aria-hidden="true"
                  width={22}
                  height={22}
                  className="rounded-sm"
                />
                <span className="text-sm text-text-primary">{provider.name}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
