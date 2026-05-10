import * as React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

export function Input({
  label,
  helperText,
  error,
  iconLeft,
  iconRight,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? undefined;
  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
      ) : null}
      <div
        className={`flex min-h-touch items-center gap-2 rounded-md border bg-surface px-3 ${
          error ? 'border-accent-abyssRed' : 'border-border'
        } focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-nova`}
      >
        {iconLeft}
        <input
          id={inputId}
          className={`w-full bg-transparent py-2 text-sm outline-none ${className ?? ''}`}
          {...props}
        />
        {iconRight}
      </div>
      {error ? (
        <p className="text-xs text-accent-abyssRed">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
