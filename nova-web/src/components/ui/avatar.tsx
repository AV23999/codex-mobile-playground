'use client';

import * as React from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';
type AvatarStatus = 'online' | 'away' | 'offline';

const sizeMap: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
};

const statusMap: Record<AvatarStatus, string> = {
  online: 'bg-accent-nova',
  away: 'bg-accent-abyssPurple',
  offline: 'bg-border',
};

const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? '';
  return `${first}${second}`.toUpperCase() || 'NV';
};

export function Avatar({
  src,
  name,
  size = 'md',
  status,
}: {
  src?: string;
  name: string;
  size?: AvatarSize;
  status?: AvatarStatus;
}) {
  const [hasError, setHasError] = React.useState(false);
  const initials = getInitials(name);

  return (
    <div className="relative inline-flex">
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size]} rounded-full border border-border object-cover`}
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          className={`${sizeMap[size]} inline-flex items-center justify-center rounded-full border border-border bg-surface font-semibold`}
        >
          {initials}
        </div>
      )}
      {status ? (
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-surface ${statusMap[status]}`}
        />
      ) : null}
    </div>
  );
}
