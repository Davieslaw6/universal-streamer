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
import {
  DEFAULT_REGION,
  REGION_COOKIE,
  REGION_STORAGE_KEY,
} from '@/lib/constants';
import { storage } from '@/lib/storage';

interface SettingsContextValue {
  region: string;
  hydrated: boolean;
  setRegion: (region: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function writeRegionCookie(region: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${REGION_COOKIE}=${encodeURIComponent(
    region,
  )}; path=/; max-age=31536000; samesite=lax`;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<string>(DEFAULT_REGION);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = storage.get<string>(REGION_STORAGE_KEY, DEFAULT_REGION);
    const next = /^[A-Z]{2}$/.test(stored) ? stored : DEFAULT_REGION;
    setRegionState(next);
    // Keep the server-visible cookie in sync with the stored preference so
    // provider carousels on the home page reflect the chosen region.
    writeRegionCookie(next);
    setHydrated(true);
  }, []);

  const setRegion = useCallback((next: string) => {
    const normalized = next.trim().toUpperCase().slice(0, 2);
    if (!/^[A-Z]{2}$/.test(normalized)) return;
    setRegionState(normalized);
    storage.set(REGION_STORAGE_KEY, normalized);
    writeRegionCookie(normalized);
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ region, hydrated, setRegion }),
    [region, hydrated, setRegion],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
