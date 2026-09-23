import Link from 'next/link';
import { Search } from 'lucide-react';
import { NavLinks } from './NavLinks';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-4 py-2">
        <Link
          href="/"
          className="flex min-h-touch items-center gap-2 rounded px-1 text-base font-semibold tracking-tight text-text-primary"
        >
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-full bg-accent"
          />
          Universal Streamer
        </Link>

        <nav aria-label="Main" className="ml-2 hidden md:block">
          <NavLinks />
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Search titles"
            className="flex min-h-touch min-w-touch items-center justify-center rounded text-text-secondary hover:bg-bg-hover hover:text-text-primary"
          >
            <Search aria-hidden="true" className="h-5 w-5" />
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <nav aria-label="Main (mobile)" className="border-t border-border md:hidden">
        <div className="mx-auto w-full max-w-[1400px] overflow-x-auto px-2 no-scrollbar">
          <NavLinks />
        </div>
      </nav>
    </header>
  );
}
