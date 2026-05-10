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
    <div className="space-y-1">
      {label ? <label htmlFor={inputId} className="text-mono-ui text-[11px] uppercase tracking-[0.1em] text-[color:var(--nova-text-faint)]">{label}</label> : null}
      <div className={`flex min-h-touch items-center gap-2 rounded-md border px-3 ${error ? 'border-[color:var(--nova-magenta)]' : 'border-border'} bg-white/[0.03]`}>
        {iconLeft}
        <input id={inputId} className={`w-full bg-transparent py-2 text-sm text-[color:var(--nova-text-primary)] outline-none placeholder:text-[color:var(--nova-text-faint)] focus-visible:ring-0 ${className ?? ''}`} {...props} />
        {iconRight}
      </div>
      {error ? <p className="text-xs text-[color:var(--nova-magenta)]">{error}</p> : helperText ? <p className="text-xs text-[color:var(--nova-text-secondary)]">{helperText}</p> : null}
    </div>
  );
}
