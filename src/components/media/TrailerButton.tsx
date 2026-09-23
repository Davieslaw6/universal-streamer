import { PlayCircle } from 'lucide-react';
import { buildTrailerSearchUrl } from '@/lib/providers/deep-links';
import { buttonClasses } from '@/components/ui/Button';
import type { MediaItem } from '@/types/media';
import { releaseYear } from '@/lib/format';

/**
 * Trailer links are plain YouTube search deep links. No YouTube Data API,
 * no OAuth, no embedded player.
 */
export function TrailerButton({ item }: { item: MediaItem }) {
  const href = buildTrailerSearchUrl(item.title, releaseYear(item.releaseDate));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses('secondary', 'md')}
    >
      <PlayCircle aria-hidden="true" className="h-4 w-4" />
      Watch trailer
      <span className="sr-only"> (opens YouTube search in a new tab)</span>
    </a>
  );
}
