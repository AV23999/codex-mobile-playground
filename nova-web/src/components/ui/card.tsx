import * as React from 'react';

export function Card({ hoverable = false, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { hoverable?: boolean }) {
  return <div className={`rounded-lg border border-border bg-[color:var(--nova-panel)] ${hoverable ? 'transition duration-200 hover:border-[color:var(--nova-border-glow)] hover:shadow-[0_0_24px_rgba(0,245,255,0.06)]' : ''} ${className ?? ''}`} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`border-b border-border p-4 ${className ?? ''}`} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-4 ${className ?? ''}`} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`border-t border-border p-4 ${className ?? ''}`} {...props} />;
}
