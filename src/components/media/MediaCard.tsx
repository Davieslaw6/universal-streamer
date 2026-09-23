import Link from 'next/link';
import { releaseYear } from '@/lib/format';
import type { MediaItem } from '@/types/media';
import { Poster } from './Poster';
import { ProviderBadges } from './ProviderBadges';

export function MediaCard({
  item,
  width,
  fill = false,
}: {
  item: MediaItem;
  /** Fixed pixel width for carousel rows. Ignored when `fill` is true. */
  width?: number;
  fill?: boolean;
}) {
  const href =
    item.mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <article
      className={fill ? 'w-full' : 'shrink-0 snap-start'}
      style={fill ? undefined : { width: `${width ?? 150}px` }}
    >
      <Link
        href={href}
        className="group block rounded focus-visible:outline-none"
        aria-label={`${item.title} (${releaseYear(item.releaseDate)})`}
      >
        <div className="overflow-hidden rounded transition-transform duration-200 group-hover:-translate-y-1">
          <Poster posterPath={item.posterPath} title={item.title} />
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-text-primary">
          {item.title}
        </h3>
        <p className="mt-0.5 text-xs text-text-secondary">
          {releaseYear(item.releaseDate)}
          {item.voteAverage > 0 ? ` · ${item.voteAverage.toFixed(1)}★` : ''}
        </p>
        <div className="mt-1.5">
          <ProviderBadges providerIds={item.providerIds} size={18} max={4} />
        </div>
      </Link>
    </article>
  );
}
