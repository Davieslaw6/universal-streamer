'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';
import { useToast } from '@/components/ui/ToastProvider';
import { buttonClasses } from '@/components/ui/Button';
import type { MediaDetail } from '@/types/media';

export function WatchlistButton({ detail }: { detail: MediaDetail }) {
  const { has, toggle } = useWatchlist();
  const { toast } = useToast();

  const saved = has(detail.mediaType, detail.id);

  const onClick = () => {
    const added = toggle({
      id: detail.id,
      mediaType: detail.mediaType,
      title: detail.title,
      posterPath: detail.posterPath,
      releaseDate: detail.releaseDate,
      voteAverage: detail.voteAverage,
      providerIds: detail.providerIds,
    });
    toast(
      added ? `Added “${detail.title}” to your watchlist.` : `Removed “${detail.title}” from your watchlist.`,
      added ? 'success' : 'info',
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      className={buttonClasses(saved ? 'secondary' : 'primary', 'md')}
    >
      {saved ? (
        <BookmarkCheck aria-hidden="true" className="h-4 w-4" />
      ) : (
        <Bookmark aria-hidden="true" className="h-4 w-4" />
      )}
      {saved ? 'In watchlist' : 'Add to watchlist'}
    </button>
  );
}
