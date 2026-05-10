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
  base: 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-cyan)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  variant: {
    primary:
      'bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] text-[#050608] shadow-[0_0_24px_rgba(0,212,255,0.3)] hover:brightness-110 hover:shadow-[0_0_32px_rgba(0,212,255,0.45)]',
    secondary:
      'border border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:border-[rgba(0,212,255,0.4)] hover:text-[var(--accent-cyan)]',
    ghost:
      'bg-transparent text-[var(--color-muted)] hover:bg-white/5 hover:text-[var(--color-text)]',
    danger:
      'border border-[rgba(255,45,120,0.3)] bg-transparent text-[#ff2d78] hover:bg-[rgba(255,45,120,0.08)] hover:border-[rgba(255,45,120,0.6)]',
  },
  size: { sm: 'text-xs px-3', md: 'text-sm', lg: 'text-base px-5 py-3' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  iconLeft,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.base} ${styles.variant[variant]} ${styles.size[size]} ${className ?? ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        iconLeft
      )}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
}
