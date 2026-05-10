import * as React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

const variants: Record<BadgeVariant, string> = {
  default: 'border border-border bg-surface text-foreground',
  primary: 'bg-accent-nova text-background',
  success: 'border border-accent-nova bg-surface text-accent-nova',
  warning: 'border border-accent-abyssPurple bg-surface text-accent-abyssPurple',
  danger: 'border border-accent-abyssRed bg-surface text-accent-abyssRed',
};

export function Badge({
  variant = 'default',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-medium ${variants[variant]} ${className ?? ''}`}
      {...props}
    />
  );
}
