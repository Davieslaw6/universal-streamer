import Link from 'next/link';
// OLD: ExternalLink was used by the previous watch-link UI. Kept commented for easy rollback.
// import { ExternalLink } from 'lucide-react';
import { imageUrl, formatRuntime, formatSeasons, formatVote, releaseYear } from '@/lib/format';
import { PROVIDERS } from '@/lib/providers/catalog';
import { buildWatchUrl } from '@/lib/providers/deep-links';
import type { AvailabilityType, ProviderId } from '@/types/provider';
import type { MediaDetail } from '@/types/media';
import { Badge } from '@/components/ui/Badge';
import { buttonClasses } from '@/components/ui/Button';
import { MediaRow } from './MediaRow';
import { Poster } from './Poster';
import { TrailerButton } from './TrailerButton';
import { WatchlistButton } from './WatchlistButton';
import { WatchOverlay } from './WatchOverlay';

const GROUP_ORDER: { key: AvailabilityType; label: string }[] = [
  { key: 'flatrate', label: 'Stream' },
  { key: 'free', label: 'Free' },
  { key: 'ads', label: 'Free with ads' },
  { key: 'rent', label: 'Rent' },
  { key: 'buy', label: 'Buy' },
];

function AvailabilityPanel({ detail }: { detail: MediaDetail }) {
  const groups = GROUP_ORDER.map((group) => ({
    ...group,
    items: detail.availability.groups[group.key],
  })).filter((group) => group.items.length > 0);

  return (
    <section
      aria-labelledby="availability-heading"
      className="rounded border border-border bg-bg-elevated p-4"
    >
      <h2 id="availability-heading" className="text-base font-semibold text-text-primary">
        Where to watch
      </h2>
      <p className="mt-1 text-xs text-text-secondary">
        Region: {detail.availability.region}. Links open the official service in
        a new tab.
      </p>

      {groups.length === 0 ? (
        <p className="mt-3 text-sm text-text-secondary">
          No availability data for this region yet.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {groups.map((group) => (
            <div key={group.key}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {group.label}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {group.items.map((entry) => {
                  const provider = PROVIDERS[entry.providerId];
                  const href = buildWatchUrl(
                    entry.providerId,
                    detail.title,
                    releaseYear(detail.releaseDate),
                    entry.tmdbLink ?? detail.availability.link,
                  );
                  return (
                    <li key={`${group.key}-${entry.providerId}`}>
                      {/*
                        OLD WATCH LINK — kept commented so it can be restored easily.
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-touch items-center gap-2 rounded border border-border bg-bg px-3 text-sm text-text-primary hover:bg-bg-hover"
                        >
                          <img
                            src={provider.fallbackBadge}
                            alt=""
                            aria-hidden="true"
                            width={20}
                            height={20}
                            className="rounded-sm"
                          />
                          {provider.name}
                          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                          <span className="sr-only">
                            (opens {provider.name} in a new tab)
                          </span>
                        </a>
                      */}
                      <WatchOverlay
                        title={detail.title}
                        providerName={provider.name}
                        href={href}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function DetailView({ detail }: { detail: MediaDetail }) {
  const backdrop = imageUrl(detail.backdropPath, 'w1280');
  const runtimeOrSeasons =
    detail.mediaType === 'movie'
      ? formatRuntime(detail.runtime)
      : formatSeasons(detail.numberOfSeasons, detail.numberOfEpisodes);

  return (
    <article className="flex flex-col gap-8">
      <div className="relative -mx-4 -mt-4 overflow-hidden border-b border-border">
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
            <div aria-hidden="true" className="absolute inset-0 bg-bg-hover" />
          )}
          <div className="detail-scrim absolute inset-0" aria-hidden="true" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div className="mx-auto w-[160px] md:mx-0 md:w-full">
          <Poster posterPath={detail.posterPath} title={detail.title} size="w500" />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {detail.title}
          </h1>
          {detail.tagline ? (
            <p className="text-sm italic text-text-secondary">{detail.tagline}</p>
          ) : null}

          <ul className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <li>{releaseYear(detail.releaseDate)}</li>
            {runtimeOrSeasons ? <li aria-hidden="true">·</li> : null}
            {runtimeOrSeasons ? <li>{runtimeOrSeasons}</li> : null}
            <li aria-hidden="true">·</li>
            <li>{formatVote(detail.voteAverage)} / 10</li>
            {detail.voteCount > 0 ? (
              <>
                <li aria-hidden="true">·</li>
                <li>{detail.voteCount.toLocaleString()} votes</li>
              </>
            ) : null}
          </ul>

          <ul className="flex flex-wrap gap-2">
            {detail.genres.map((genre) => (
              <li key={genre.id}>
                <Badge>{genre.name}</Badge>
              </li>
            ))}
          </ul>

          <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
            {detail.overview || 'No overview available.'}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <WatchlistButton detail={detail} />
            <TrailerButton item={detail} />
          </div>
        </div>
      </div>

      <AvailabilityPanel detail={detail} />

      {detail.cast.length > 0 ? (
        <section aria-labelledby="cast-heading">
          <h2 id="cast-heading" className="mb-3 text-lg font-semibold text-text-primary">
            Top billed cast
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {detail.cast.map((member) => (
              <li
                key={member.id}
                className="rounded border border-border bg-bg-elevated p-3"
              >
                <p className="text-sm font-medium text-text-primary">{member.name}</p>
                {member.character ? (
                  <p className="mt-0.5 text-xs text-text-secondary">{member.character}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {detail.similar.length > 0 ? (
        <MediaRow title="More like this" items={detail.similar} />
      ) : null}

      <p className="text-sm text-text-secondary">
        <Link
          href="/"
          className="underline decoration-border underline-offset-2 hover:text-text-primary"
        >
          Back to Home
        </Link>
      </p>
    </article>
  );
}

export type { ProviderId };
