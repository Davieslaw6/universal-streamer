'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/watchlist', label: 'Watchlist' },
  { href: '/settings', label: 'Settings' },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) {
  const pathname = usePathname();

  return (
    <ul
      className={
        orientation === 'horizontal'
          ? 'flex items-center gap-1'
          : 'flex flex-col gap-1'
      }
    >
      {LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <li key={link.href} className="relative">
            <Link
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-touch items-center rounded px-3 text-sm font-medium transition-colors ${
                active
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              }`}
            >
              {link.label}
            </Link>
            {active ? (
              <span
                aria-hidden="true"
                className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent"
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
