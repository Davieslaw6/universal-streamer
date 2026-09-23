import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import {
  getByProvider,
  getPopularMovies,
  getPopularTV,
  getTopRated,
  getTrending,
} from '@/lib/data-source';
import { DEFAULT_REGION, REGION_COOKIE } from '@/lib/constants';
import { PROVIDER_IDS } from '@/lib/providers/catalog';
import { HeroBanner } from '@/components/media/HeroBanner';
import {
  HomeContent,
  type ProviderRow,
} from '@/components/media/HomeContent';
import { EmptyState } from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'Home',
};

// The home page reads the region cookie and picks a random hero per request.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const region =
    cookies().get(REGION_COOKIE)?.value?.slice(0, 2).toUpperCase() ??
    DEFAULT_REGION;

  const [trending, popularMovies, popularTV, topRated, providerRowLists] =
    await Promise.all([
      getTrending(region),
      getPopularMovies(region),
      getPopularTV(region),
      getTopRated(region),
      Promise.all(
        PROVIDER_IDS.map(async (providerId) => ({
          providerId,
          items: await getByProvider(providerId, region),
        })),
      ),
    ]);

  const providerRows: ProviderRow[] = providerRowLists;

  const heroPool = trending.length > 0 ? trending : popularMovies;
  // Random selection happens ONCE, here on the server, and is passed down as a
  // prop. The client never re-randomizes, so there is no hydration mismatch.
  const heroItem =
    heroPool.length > 0
      ? heroPool[Math.floor(Math.random() * heroPool.length)]
      : undefined;

  return (
    <>
      {heroItem ? (
        <HeroBanner item={heroItem} />
      ) : (
        <div className="mb-10">
          <EmptyState
            title="No titles available"
            description="We couldn't load any titles right now. Check your connection or try again shortly."
          />
        </div>
      )}

      <HomeContent
        trending={trending}
        popularMovies={popularMovies}
        popularTV={popularTV}
        topRated={topRated}
        providerRows={providerRows}
      />
    </>
  );
}
