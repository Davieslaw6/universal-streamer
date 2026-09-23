'use client';

import Link from 'next/link';
import { Tv } from 'lucide-react';
import { useServices } from '@/context/ServiceContext';
import { PROVIDERS } from '@/lib/providers/catalog';
import { buttonClasses } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { RowSkeleton } from '@/components/ui/Skeleton';
import type { MediaItem } from '@/types/media';
import type { ProviderId } from '@/types/provider';
import { MediaRow } from './MediaRow';

export interface ProviderRow {
  providerId: ProviderId;
  items: MediaItem[];
}

export function HomeContent({
  trending,
  popularMovies,
  popularTV,
  topRated,
  providerRows,
}: {
  trending: MediaItem[];
  popularMovies: MediaItem[];
  popularTV: MediaItem[];
  topRated: MediaItem[];
  providerRows: ProviderRow[];
}) {
  const { enabled, hydrated } = useServices();

  if (!hydrated) {
    return (
      <>
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </>
    );
  }

  if (enabled.length === 0) {
    return (
      <EmptyState
        icon={<Tv aria-hidden="true" className="h-8 w-8" />}
        title="No services enabled"
        description="Pick the streaming services you actually subscribe to and we'll show you what's available on them — and nothing else."
        actionHref="/settings"
        actionLabel="Choose your services"
      />
    );
  }

  const enabledRows = providerRows.filter((row) => enabled.includes(row.providerId));

  return (
    <>
      <MediaRow title="Trending This Week" items={trending} />
      <MediaRow title="Popular Movies" items={popularMovies} />
      <MediaRow title="Popular TV" items={popularTV} />
      <MediaRow title="Top Rated" items={topRated} />

      {enabledRows.map((row) => (
        <MediaRow
          key={row.providerId}
          title={`On ${PROVIDERS[row.providerId].name}`}
          items={row.items}
          emptyMessage={`Nothing from your region is currently listed on ${PROVIDERS[row.providerId].name}.`}
        />
      ))}

      <p className="mt-2 text-sm text-text-secondary">
        Not seeing your services?{' '}
        <Link
          href="/settings"
          className="underline decoration-border underline-offset-2 hover:text-text-primary"
        >
          Adjust them in Settings
        </Link>
        .
      </p>
    </>
  );
}

export function HomeContentLink() {
  return (
    <Link href="/settings" className={buttonClasses('primary')}>
      Open Settings
    </Link>
  );
}
