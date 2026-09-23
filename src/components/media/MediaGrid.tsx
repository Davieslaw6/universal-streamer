import type { MediaItem } from '@/types/media';
import { MediaCard } from './MediaCard';

export function MediaGrid({
  items,
  ariaLabel,
}: {
  items: MediaItem[];
  ariaLabel: string;
}) {
  return (
    <ul
      aria-label={ariaLabel}
      className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      {items.map((item) => (
        <li key={`${item.mediaType}-${item.id}`}>
          <MediaCard item={item} fill />
        </li>
      ))}
    </ul>
  );
}
