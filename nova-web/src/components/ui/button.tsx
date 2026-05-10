import * as React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

const styles = {
  base: 'inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition duration-200 active:scale-[0.98] active:brightness-95 disabled:pointer-events-none disabled:opacity-60',
  variant: {
    primary: 'bg-gradient-to-br from-[#00f5ff] to-[#0080ff] text-[#050608] hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,245,255,0.35)]',
    secondary: 'border border-border bg-transparent text-[color:var(--nova-text-primary)] hover:border-[color:var(--nova-border-glow)] hover:text-[color:var(--nova-cyan)]',
    ghost: 'bg-transparent text-[color:var(--nova-text-secondary)] hover:text-[color:var(--nova-text-primary)]',
    danger: 'border border-[rgba(255,45,120,0.3)] bg-transparent text-[color:var(--nova-magenta)] hover:bg-[rgba(255,45,120,0.08)]',
  },
  size: { sm: 'text-sm', md: 'text-sm', lg: 'text-base px-5 py-3' },
};

export function Button({ variant = 'primary', size = 'md', loading, iconLeft, iconRight, children, className, disabled, ...props }: ButtonProps) {
  return (
    <button className={`${styles.base} ${styles.variant[variant]} ${styles.size[size]} ${className ?? ''}`} disabled={disabled || loading} {...props}>
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" /> : iconLeft}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
}
