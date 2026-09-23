'use client';

import type { ReactNode } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemeMode } from '@/context/ThemeContext';

const LABEL: Record<ThemeMode, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
};

const ICONS: Record<ThemeMode, ReactNode> = {
  system: <Monitor aria-hidden="true" className="h-4 w-4" />,
  light: <Sun aria-hidden="true" className="h-4 w-4" />,
  dark: <Moon aria-hidden="true" className="h-4 w-4" />,
};

export function ThemeToggle({ variant = 'icon' }: { variant?: 'icon' | 'full' }) {
  const { mode, resolved, setMode, toggle } = useTheme();

  if (variant === 'full') {
    return (
      <div role="radiogroup" aria-label="Colour theme" className="flex flex-wrap gap-2">
        {(['system', 'light', 'dark'] as ThemeMode[]).map((option) => {
          const active = mode === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setMode(option)}
              className={`inline-flex min-h-touch items-center gap-2 rounded border px-3 text-sm ${
                active
                  ? 'border-accent bg-bg-hover text-text-primary'
                  : 'border-border bg-bg-elevated text-text-secondary hover:bg-bg-hover'
              }`}
            >
              {ICONS[option]}
              {LABEL[option]}
            </button>
          );
        })}
      </div>
    );
  }

  const Icon = mode === 'system' ? Monitor : resolved === 'dark' ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch theme. Current: ${LABEL[mode]}`}
      title={`Switch theme (currently ${LABEL[mode]})`}
      className="flex min-h-touch min-w-touch items-center justify-center rounded text-text-secondary hover:bg-bg-hover hover:text-text-primary"
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}
