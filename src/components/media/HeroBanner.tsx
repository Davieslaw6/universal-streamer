'use client';

import Link from 'next/link';
import { ExternalLink, Info } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { imageUrl, releaseYear } from '@/lib/format';
import { PROVIDERS } from '@/lib/providers/catalog';
import { buildWatchUrl } from '@/lib/providers/deep-links';
import { buttonClasses } from '@/components/ui/Button';
import type { MediaItem } from '@/types/media';

/**
 * The featured item is chosen ONCE in the server component and passed down as a
 * prop. This component never randomizes, so there is no hydration mismatch.
 */
export function HeroBanner({ item }: { item: MediaItem }) {
  const { region } = useSettings();

  const backdrop = imageUrl(item.backdropPath, 'w1280');
  const detailHref =
    item.mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

  const primaryProviderId = item.providerIds[0] ?? null;
  const primaryProvider = primaryProviderId ? PROVIDERS[primaryProviderId] : null;
  const watchUrl =
    primaryProviderId !== null
      ? buildWatchUrl(primaryProviderId, item.title, releaseYear(item.releaseDate))
      : null;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative mb-10 overflow-hidden rounded border border-border bg-bg-elevated"
    >
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        {backdrop ? (
          <img
            src={backdrop}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-bg-hover"
          />
        )}
        <div className="hero-scrim absolute inset-0" aria-hidden="true" />

        <div className="absolute inset-0 flex flex-col justify-end gap-3 p-4 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Featured {item.mediaType === 'movie' ? 'film' : 'series'}
          </p>
          <h1
            id="hero-title"
            className="max-w-2xl text-2xl font-bold leading-tight text-text-primary sm:text-4xl"
          >
            {item.title}
          </h1>
          <p className="text-sm text-text-secondary">
            {releaseYear(item.releaseDate)}
            {item.voteAverage > 0 ? ` · ${item.voteAverage.toFixed(1)}★` : ''}
            {region ? ` · ${region}` : ''}
          </p>
          <p className="line-clamp-2 max-w-2xl text-sm text-text-secondary">
            {item.overview || 'No overview available.'}
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Link href={detailHref} className={buttonClasses('secondary', 'lg')}>
              <Info aria-hidden="true" className="h-4 w-4" />
              More Info
            </Link>
            {watchUrl && primaryProvider ? (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses('primary', 'lg')}
              >
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
                Watch on {primaryProvider.name}
                <span className="sr-only">
                  {' '}
                  (opens {primaryProvider.name} in a new tab)
                </span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
