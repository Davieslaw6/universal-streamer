import type { ReactNode } from 'react';

export function Badge({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border border-border bg-bg-elevated px-2 py-0.5 text-xs font-medium text-text-secondary ${className}`}
    >
      {children}
    </span>
  );
}
