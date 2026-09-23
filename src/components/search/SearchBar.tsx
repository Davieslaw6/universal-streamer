'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const DEBOUNCE_MS = 300;

export function SearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialQuery);
  const debounced = useDebounce(value, DEBOUNCE_MS);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const params = new URLSearchParams();
    const trimmed = debounced.trim();
    if (trimmed) params.set('q', trimmed);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [debounced, pathname, router]);

  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className="relative"
    >
      <label htmlFor="search-input" className="sr-only">
        Search movies and TV shows
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
      />
      <input
        id="search-input"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search movies and TV shows"
        autoComplete="off"
        className="min-h-touch w-full rounded border border-border bg-bg-elevated pl-9 pr-10 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent"
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="Clear search"
          className="absolute right-1 top-1/2 flex min-h-touch min-w-touch -translate-y-1/2 items-center justify-center rounded text-text-secondary hover:bg-bg-hover hover:text-text-primary"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
    </form>
  );
}
