'use client';

import { useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MediaItem } from '@/types/media';
import { MediaCard } from './MediaCard';

export function MediaRow({
  title,
  items,
  cardWidth = 150,
  emptyMessage,
}: {
  title: string;
  items: MediaItem[];
  cardWidth?: number;
  emptyMessage?: string;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.max(node.clientWidth * 0.8, cardWidth * 2);
    node.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }, [cardWidth]);

  if (items.length === 0) {
    if (!emptyMessage) return null;
    return (
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-text-primary">{title}</h2>
        <p className="rounded border border-dashed border-border bg-bg-elevated px-4 py-6 text-sm text-text-secondary">
          {emptyMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="group/row mb-10">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <div className="hidden gap-1 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={`Scroll ${title} left`}
            className="flex min-h-touch min-w-touch items-center justify-center rounded text-text-secondary hover:bg-bg-hover hover:text-text-primary"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={`Scroll ${title} right`}
            className="flex min-h-touch min-w-touch items-center justify-center rounded text-text-secondary hover:bg-bg-hover hover:text-text-primary"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ul
        ref={scrollerRef}
        tabIndex={0}
        aria-label={title}
        className="edge-fade flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 no-scrollbar"
      >
        {items.map((item) => (
          <li key={`${item.mediaType}-${item.id}`} className="snap-start">
            <MediaCard item={item} width={cardWidth} />
          </li>
        ))}
      </ul>
    </section>
  );
}
