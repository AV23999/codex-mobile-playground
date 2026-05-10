import * as React from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

const positions: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
};

export function Tooltip({
  content,
  position = 'top',
  children,
}: {
  content: React.ReactNode;
  position?: TooltipPosition;
  children: React.ReactNode;
}) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        className={`pointer-events-none absolute z-20 rounded-md border border-border bg-surface px-2 py-1 text-xs opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 ${positions[position]}`}
      >
        {content}
      </span>
    </span>
  );
}
