import Link from 'next/link';
import type { ReactNode } from 'react';
import { buttonClasses } from './Button';

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  icon,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded border border-dashed border-border bg-bg-elevated px-6 py-16 text-center">
      {icon ? <div className="text-text-secondary">{icon}</div> : null}
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="max-w-md text-sm text-text-secondary">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className={buttonClasses('primary', 'md', 'mt-2')}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
