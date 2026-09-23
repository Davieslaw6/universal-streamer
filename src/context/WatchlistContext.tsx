'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { WATCHLIST_STORAGE_KEY } from '@/lib/constants';
import { storage } from '@/lib/storage';
import type { MediaType } from '@/types/media';
import type { ProviderId } from '@/types/provider';

export interface WatchlistEntry {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  providerIds: ProviderId[];
  addedAt: number;
}

interface WatchlistContextValue {
  entries: WatchlistEntry[];
  hydrated: boolean;
  has: (mediaType: MediaType, id: number) => boolean;
  add: (entry: Omit<WatchlistEntry, 'addedAt'>) => void;
  remove: (mediaType: MediaType, id: number) => void;
  toggle: (entry: Omit<WatchlistEntry, 'addedAt'>) => boolean;
  clear: () => void;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

function entryKey(mediaType: MediaType, id: number): string {
  return `${mediaType}:${id}`;
}

function isWatchlistEntry(value: unknown): value is WatchlistEntry {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'number' &&
    (candidate.mediaType === 'movie' || candidate.mediaType === 'tv') &&
    typeof candidate.title === 'string'
  );
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WatchlistEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = storage.get<unknown>(WATCHLIST_STORAGE_KEY, []);
    const safe = Array.isArray(stored) ? stored.filter(isWatchlistEntry) : [];
    safe.sort((a, b) => b.addedAt - a.addedAt);
    setEntries(safe);
    setHydrated(true);
  }, []);

  const persist = useCallback((next: WatchlistEntry[]) => {
    setEntries(next);
    storage.set(WATCHLIST_STORAGE_KEY, next);
  }, []);

  const has = useCallback(
    (mediaType: MediaType, id: number) =>
      entries.some(
        (entry) => entry.mediaType === mediaType && entry.id === id,
      ),
    [entries],
  );

  const add = useCallback(
    (entry: Omit<WatchlistEntry, 'addedAt'>) => {
      if (entries.some((e) => entryKey(e.mediaType, e.id) === entryKey(entry.mediaType, entry.id))) {
        return;
      }
      persist([{ ...entry, addedAt: Date.now() }, ...entries]);
    },
    [entries, persist],
  );

  const remove = useCallback(
    (mediaType: MediaType, id: number) => {
      persist(
        entries.filter(
          (entry) => !(entry.mediaType === mediaType && entry.id === id),
        ),
      );
    },
    [entries, persist],
  );

  const toggle = useCallback(
    (entry: Omit<WatchlistEntry, 'addedAt'>): boolean => {
      const exists = entries.some(
        (e) => e.mediaType === entry.mediaType && e.id === entry.id,
      );
      if (exists) {
        remove(entry.mediaType, entry.id);
        return false;
      }
      add(entry);
      return true;
    },
    [entries, add, remove],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const value = useMemo<WatchlistContextValue>(
    () => ({ entries, hydrated, has, add, remove, toggle, clear }),
    [entries, hydrated, has, add, remove, toggle, clear],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error('useWatchlist must be used inside <WatchlistProvider>');
  }
  return ctx;
}
