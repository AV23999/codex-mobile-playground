import * as React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

const variants: Record<BadgeVariant, string> = {
  default: 'border border-border bg-white/5 text-[color:var(--nova-text-secondary)]',
  primary: 'border border-[rgba(0,245,255,0.2)] bg-[rgba(0,245,255,0.1)] text-[color:var(--nova-cyan)]',
  success: 'border border-[rgba(0,245,255,0.2)] bg-[rgba(0,245,255,0.1)] text-[color:var(--nova-cyan)]',
  warning: 'border border-[rgba(245,166,35,0.2)] bg-[rgba(245,166,35,0.1)] text-[color:var(--nova-gold)]',
  danger: 'border border-[rgba(255,45,120,0.2)] bg-[rgba(255,45,120,0.1)] text-[color:var(--nova-magenta)]',
};

export function Badge({ variant = 'default', className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return <span className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-mono ${variants[variant]} ${className ?? ''}`} {...props} />;
}
