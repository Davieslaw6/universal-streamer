/**
 * Typed, SSR-safe localStorage wrapper. Every accessor is a no-op on the
 * server so no component can accidentally touch localStorage during SSR.
 */

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private mode — non-fatal */
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* non-fatal */
    }
  },

  clearPrefix(prefix: string): void {
    if (typeof window === 'undefined') return;
    try {
      const doomed: string[] = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(prefix)) doomed.push(key);
      }
      for (const key of doomed) window.localStorage.removeItem(key);
    } catch {
      /* non-fatal */
    }
  },
};
