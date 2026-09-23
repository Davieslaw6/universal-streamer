import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 rounded border border-border bg-bg-elevated px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        404
      </p>
      <h1 className="text-xl font-semibold text-text-primary">
        We couldn&apos;t find that title
      </h1>
      <p className="max-w-md text-sm text-text-secondary">
        The movie or show you&apos;re looking for isn&apos;t in our catalogue.
        Try searching for it instead.
      </p>
      <div className="flex gap-2">
        <Link href="/search" className={buttonClasses('primary')}>
          Search titles
        </Link>
        <Link href="/" className={buttonClasses('secondary')}>
          Go home
        </Link>
      </div>
    </div>
  );
}
