import * as React from 'react';

type AvatarProps = {
  name: string;
  size?: 'sm' | 'md';
  className?: string;
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0]?.toUpperCase() ?? '?';
  return ((words[0][0] ?? '') + (words[words.length - 1][0] ?? '')).toUpperCase();
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const dim = size === 'sm' ? 28 : 36;
  const fontSize = size === 'sm' ? '11px' : '14px';
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim,
        height: dim,
        minWidth: dim,
        borderRadius: '50%',
        background: 'rgba(0,245,255,0.1)',
        border: '1px solid rgba(0,245,255,0.2)',
        color: 'var(--nova-cyan)',
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize,
        fontWeight: 500,
        letterSpacing: '0.04em',
        userSelect: 'none',
      }}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  );
}
