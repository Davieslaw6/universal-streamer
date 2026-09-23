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
import { THEME_STORAGE_KEY } from '@/lib/constants';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [resolved, setResolved] = useState<ResolvedTheme>('dark');

  // Hydrate the stored preference after mount (SSR renders the default).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (!raw) return;
      let parsed: unknown = raw;
      try {
        parsed = JSON.parse(raw) as unknown;
      } catch {
        /* legacy plain-string value */
      }
      if (parsed === 'light' || parsed === 'dark' || parsed === 'system') {
        setModeState(parsed);
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    const next: ResolvedTheme = mode === 'system' ? systemTheme() : mode;
    setResolved(next);
    document.documentElement.setAttribute('data-theme', next);

    if (mode !== 'system' || typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      const updated: ResolvedTheme = mql.matches ? 'light' : 'dark';
      setResolved(updated);
      document.documentElement.setAttribute('data-theme', updated);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolved, setMode, toggle }),
    [mode, resolved, setMode, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
