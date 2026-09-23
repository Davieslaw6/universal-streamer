'use client';

import { useSettings } from '@/context/SettingsContext';

const COMMON_REGIONS: { code: string; label: string }[] = [
  { code: 'US', label: 'United States' },
  { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'IE', label: 'Ireland' },
  { code: 'AU', label: 'Australia' },
  { code: 'NZ', label: 'New Zealand' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'ES', label: 'Spain' },
  { code: 'IT', label: 'Italy' },
  { code: 'NL', label: 'Netherlands' },
  { code: 'SE', label: 'Sweden' },
  { code: 'NO', label: 'Norway' },
  { code: 'DK', label: 'Denmark' },
  { code: 'BR', label: 'Brazil' },
  { code: 'MX', label: 'Mexico' },
  { code: 'AR', label: 'Argentina' },
  { code: 'JP', label: 'Japan' },
  { code: 'KR', label: 'South Korea' },
  { code: 'IN', label: 'India' },
];

export function RegionSelect() {
  const { region, setRegion } = useSettings();

  return (
    <section aria-labelledby="region-heading" className="flex flex-col gap-2">
      <h2 id="region-heading" className="text-base font-semibold text-text-primary">
        Region
      </h2>
      <p className="text-sm text-text-secondary">
        Availability and deep links are region-aware. This is stored locally on
        your device and never sent anywhere except as a TMDB query parameter on
        the server.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="region-select" className="text-sm text-text-secondary">
          Country
        </label>
        <select
          id="region-select"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          className="min-h-touch rounded border border-border bg-bg-elevated px-3 text-sm text-text-primary"
        >
          {COMMON_REGIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label} ({option.code})
            </option>
          ))}
          {COMMON_REGIONS.every((option) => option.code !== region) ? (
            <option value={region}>{region}</option>
          ) : null}
        </select>
        <span className="text-sm text-text-secondary">
          Current: <strong className="text-text-primary">{region}</strong>
        </span>
      </div>
    </section>
  );
}
