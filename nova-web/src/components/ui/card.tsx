import * as React from 'react';

export function Card({ hoverable = false, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { hoverable?: boolean }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.28)] ${
        hoverable
          ? 'transition duration-300 hover:-translate-y-1 hover:border-[rgba(0,212,255,0.3)] hover:shadow-[0_12px_34px_rgba(0,212,255,0.12)]'
          : ''
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
