'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[route error]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 rounded border border-border bg-bg-elevated px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-text-primary">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-text-secondary">
        This page failed to load. This is usually temporary — try again, or head
        back to the home page.
      </p>
      <div className="flex gap-2">
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <a
          href="/"
          className="inline-flex min-h-touch items-center rounded border border-border bg-bg-elevated px-4 text-sm text-text-primary hover:bg-bg-hover"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
