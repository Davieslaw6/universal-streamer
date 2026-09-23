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
import { SERVICES_STORAGE_KEY } from '@/lib/constants';
import {
  DEFAULT_ENABLED_PROVIDERS,
  PROVIDER_IDS,
  sanitizeProviderIds,
} from '@/lib/providers/catalog';
import { storage } from '@/lib/storage';
import type { ProviderId } from '@/types/provider';

interface ServiceContextValue {
  enabled: ProviderId[];
  hydrated: boolean;
  isEnabled: (id: ProviderId) => boolean;
  toggle: (id: ProviderId) => void;
  enableAll: () => void;
  disableAll: () => void;
  reset: () => void;
}

const ServiceContext = createContext<ServiceContextValue | null>(null);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState<ProviderId[]>(DEFAULT_ENABLED_PROVIDERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = storage.get<unknown>(SERVICES_STORAGE_KEY, null);
    const next =
      stored === null ? DEFAULT_ENABLED_PROVIDERS : sanitizeProviderIds(stored);
    setEnabled(next);
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ProviderId[]) => {
    const ordered = PROVIDER_IDS.filter((id) => next.includes(id));
    setEnabled(ordered);
    storage.set(SERVICES_STORAGE_KEY, ordered);
  }, []);

  const toggle = useCallback(
    (id: ProviderId) => {
      persist(
        enabled.includes(id)
          ? enabled.filter((existing) => existing !== id)
          : [...enabled, id],
      );
    },
    [enabled, persist],
  );

  const enableAll = useCallback(() => persist([...PROVIDER_IDS]), [persist]);
  const disableAll = useCallback(() => persist([]), [persist]);
  const reset = useCallback(
    () => persist([...DEFAULT_ENABLED_PROVIDERS]),
    [persist],
  );

  const value = useMemo<ServiceContextValue>(
    () => ({
      enabled,
      hydrated,
      isEnabled: (id) => enabled.includes(id),
      toggle,
      enableAll,
      disableAll,
      reset,
    }),
    [enabled, hydrated, toggle, enableAll, disableAll, reset],
  );

  return (
    <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
  );
}

export function useServices(): ServiceContextValue {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServices must be used inside <ServiceProvider>');
  return ctx;
}
