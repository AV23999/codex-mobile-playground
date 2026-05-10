'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Avatar } from '@/components/ui';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: '⌂' },
  { href: '/jarvis', label: 'Jarvis', icon: '◉' },
  { href: '/abyss', label: 'Abyss', icon: '◈' },
  { href: '/chats', label: 'Chats', icon: '☰' },
  { href: '/media', label: 'Media', icon: '▣' },
  { href: '/watch', label: 'Watch', icon: '▶' },
  { href: '/premium', label: 'Premium', icon: '★' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
];

type ContextData = { title: string; items: string[] };

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [contextData, setContextData] = useState<ContextData>({ title: 'CONTEXT', items: [] });
  const [contextLoading, setContextLoading] = useState(false);

  const pageTitle = useMemo(() => NAV_ITEMS.find((item) => item.href === pathname)?.label ?? 'N.O.V.A', [pathname]);

  useEffect(() => {
    const fetchContext = async () => {
      setContextLoading(true);
      try {
        const response = await fetch(`/api/context?route=${encodeURIComponent(pathname)}`);
        const payload = (await response.json()) as ContextData;
        setContextData({ title: payload.title ?? 'CONTEXT', items: Array.isArray(payload.items) ? payload.items : [] });
      } finally {
        setContextLoading(false);
      }
    };
    void fetchContext();
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[color:var(--nova-void)] text-[color:var(--nova-text-primary)] md:grid md:grid-cols-[260px_1fr_340px]">
      <aside className="hidden border-r border-border bg-[color:var(--nova-deep)] p-4 md:flex md:flex-col">
        <div className="mb-6">
          <p className="text-display text-lg tracking-[0.3em]">N.O.V.A</p>
          <p className="text-mono-ui text-[9px] uppercase tracking-[0.2em] text-[color:var(--nova-text-faint)]">OPERATIVE SYSTEM</p>
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex min-h-touch items-center gap-3 border-l-2 px-3 py-2 ${active ? 'border-[color:var(--nova-cyan)] bg-[rgba(0,245,255,0.08)] text-[color:var(--nova-text-primary)] shadow-[0_0_20px_rgba(0,245,255,0.06)]' : 'border-transparent text-[color:var(--nova-text-secondary)] hover:bg-[rgba(0,245,255,0.04)] hover:text-[color:var(--nova-text-primary)]'}`}>
                <span className={`${active ? 'text-[color:var(--nova-cyan)]' : ''}`}>{item.icon}</span>
                <span className="transition-colors duration-150">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-border pt-4">
          <div className="mb-3 flex items-center gap-3"><Avatar name="Nova Operator" size="sm" /><div><p className="text-sm">Nova Operator</p><p className="text-xs text-[color:var(--nova-text-faint)]">Operator</p></div></div>
          <button className="min-h-touch min-w-touch text-[color:var(--nova-text-secondary)] hover:text-[color:var(--nova-text-primary)]">Sign out</button>
        </div>
      </aside>

      <section className="min-h-screen">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-[rgba(9,11,15,0.85)] px-6 backdrop-blur-[20px]">
          <p className="text-sm"><span className="text-mono-ui text-[color:var(--nova-text-faint)]">N.O.V.A</span><span className="text-[color:var(--nova-text-faint)]"> / </span><span className="text-display">{pageTitle}</span></p>
          <div className="flex gap-2">
            <button className="min-h-touch min-w-touch rounded-md border border-border px-3 hover:border-[color:var(--nova-border-glow)]">◐</button>
            <button className="min-h-touch min-w-touch rounded-md border border-border px-3 hover:border-[color:var(--nova-border-glow)]" onClick={() => setRightPanelOpen((p) => !p)}>◎</button>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </section>

      <aside className={`hidden border-l border-border bg-[color:var(--nova-deep)] p-4 md:block ${rightPanelOpen ? 'opacity-100' : 'opacity-30'}`}>
        <p className="text-mono-ui mb-3 text-[10px] uppercase tracking-[0.2em] text-[color:var(--nova-text-faint)]">Context</p>
        {contextLoading && contextData.items.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-[color:var(--nova-text-secondary)]"><span className="pulse-dot inline-block h-2 w-2 rounded-full bg-[color:var(--nova-cyan)]" />Awaiting context signal...</div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-[color:var(--nova-text-primary)]">{contextData.title}</p>
            {contextData.items.map((item) => <p key={item} className="border-t border-border pt-2 text-mono-ui text-xs text-[color:var(--nova-text-secondary)]">{item}</p>)}
          </div>
        )}
      </aside>
    </div>
  );
}
