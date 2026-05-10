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

type CVAConfig = {
  variants: {
    variant: Record<ButtonVariant, string>;
    size: Record<ButtonSize, string>;
  };
  defaultVariants: {
    variant: ButtonVariant;
    size: ButtonSize;
  };
};

const cva = (base: string, config: CVAConfig) => {
  return ({ variant, size }: { variant?: ButtonVariant; size?: ButtonSize }) => {
    const finalVariant = variant ?? config.defaultVariants.variant;
    const finalSize = size ?? config.defaultVariants.size;
    return `${base} ${config.variants.variant[finalVariant]} ${config.variants.size[finalSize]}`;
  };
};

const buttonVariants = cva(
  'inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-nova disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-accent-nova text-background hover:opacity-90',
        secondary: 'border border-border bg-surface text-foreground hover:bg-background',
        ghost: 'bg-transparent text-foreground hover:bg-surface',
        danger: 'bg-accent-abyssRed text-foreground hover:opacity-90',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export function Button({ variant, size, loading, iconLeft, iconRight, children, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`${buttonVariants({ variant, size })} ${className ?? ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading
        ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" aria-hidden />
        : iconLeft}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
}
