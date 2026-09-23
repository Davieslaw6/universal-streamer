import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside';
}) {
  return (
    <Tag
      className={`rounded border border-border bg-bg-elevated p-4 ${className}`}
    >
      {children}
    </Tag>
  );
}
