import type { Metadata } from 'next';
import { WatchlistView } from '@/components/media/WatchlistView';

export const metadata: Metadata = {
  title: 'Watchlist',
};

export default function WatchlistPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">Watchlist</h1>
      <WatchlistView />
    </div>
  );
}
