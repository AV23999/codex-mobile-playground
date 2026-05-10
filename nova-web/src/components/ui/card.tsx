import * as React from 'react';

export function Card({
  hoverable = false,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hoverable?: boolean }) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface ${
        hoverable ? 'transition hover:-translate-y-1 hover:shadow-lg' : ''
      } ${className ?? ''}`}
      {...props}
    />
  );
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
