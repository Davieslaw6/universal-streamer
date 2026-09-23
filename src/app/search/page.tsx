import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { searchMedia } from '@/lib/data-source';
import { DEFAULT_REGION, REGION_COOKIE } from '@/lib/constants';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchView } from '@/components/search/SearchView';

export const metadata: Metadata = {
  title: 'Search',
};

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const region =
    cookies().get(REGION_COOKIE)?.value?.slice(0, 2).toUpperCase() ??
    DEFAULT_REGION;

  const results = query.trim() ? await searchMedia(query, region) : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">Search</h1>
      <SearchBar initialQuery={query} />
      <SearchView query={query} results={results} />
    </div>
  );
}
