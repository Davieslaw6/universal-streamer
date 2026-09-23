'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Play, X } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';

interface WatchOverlayProps {
  title: string;
  providerName: string;
  href: string;
}

export function WatchOverlay({ title, providerName, href }: WatchOverlayProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-touch items-center gap-2 rounded border border-border bg-bg px-3 text-sm text-text-primary hover:bg-bg-hover"
      >
        <Play aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
        Watch on {providerName}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Watch ${title} on ${providerName}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="flex h-[min(88vh,900px)] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {title}
                </p>
                <p className="text-xs text-text-secondary">
                  {providerName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses({ variant: 'secondary', size: 'sm' })}
                >
                  Open on service
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-touch min-w-touch items-center justify-center rounded border border-border text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                  aria-label="Close player"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 bg-black">
              <iframe
                src={href}
                title={`Watch ${title} on ${providerName}`}
                className="h-full w-full border-0"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            <div className="border-t border-border px-4 py-2 text-xs text-text-secondary">
              If the service blocks embedded playback, use “Open exact page” above.
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
