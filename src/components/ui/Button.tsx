import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-accent text-bg hover:bg-accent-hover border border-transparent font-semibold',
  secondary:
    'bg-bg-elevated text-text-primary hover:bg-bg-hover border border-border',
  ghost:
    'bg-transparent text-text-primary hover:bg-bg-hover border border-transparent',
  danger:
    'bg-transparent text-text-primary hover:bg-bg-hover border border-border',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'min-h-touch px-3 text-sm',
  md: 'min-h-touch px-4 text-sm',
  lg: 'min-h-touch px-6 text-base',
};

export function buttonClasses(
  variant: Variant = 'secondary',
  size: Size = 'md',
  extra = '',
): string {
  return [
    'inline-flex items-center justify-center gap-2 rounded font-medium',
    'transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
