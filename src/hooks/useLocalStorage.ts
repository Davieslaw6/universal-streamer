'use client';

import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';

/**
 * SSR-safe localStorage-backed state. The first client render always uses
 * `initialValue` (matching the server), then the effect hydrates from storage —
 * this avoids any server/client hydration mismatch.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(storage.get<T>(key, initialValue));
    setHydrated(true);
    // Intentionally runs once per key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        storage.set(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated];
}
