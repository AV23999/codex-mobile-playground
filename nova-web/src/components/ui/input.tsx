import * as React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

export function Input({ label, helperText, error, iconLeft, iconRight, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? undefined;
  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-medium uppercase tracking-widest text-[var(--color-muted)]"
        >
          {label}
        </label>
      ) : null}
      <div
        className={`flex min-h-[44px] items-center gap-2 rounded-lg border px-3 backdrop-blur-sm transition-all duration-200 ${
          error
            ? 'border-[#ff2d78] shadow-[0_0_0_2px_rgba(255,45,120,0.15)]'
            : 'border-[var(--color-border)] focus-within:border-[rgba(0,212,255,0.5)] focus-within:shadow-[0_0_0_3px_rgba(0,212,255,0.12)]'
        } bg-white/[0.03]`}
      >
        {iconLeft}
        <input
          id={inputId}
          className={`w-full bg-transparent py-2 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]/50 ${className ?? ''}`}
          {...props}
        />
        {iconRight}
      </div>
      {error ? (
        <p className="text-xs text-[#ff2d78]">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[var(--color-muted)]">{helperText}</p>
      ) : null}
    </div>
  );
}
