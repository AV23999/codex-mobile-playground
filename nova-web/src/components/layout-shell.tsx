'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [contextData, setContextData] = useState<ContextData>({ title: 'Context', items: [] });
  const [contextLoading, setContextLoading] = useState(false);

  const pageTitle = useMemo(
    () => NAV_ITEMS.find((item) => item.href === pathname)?.label ?? 'N.O.V.A',
    [pathname],
  );

  useEffect(() => {
    const fetchContext = async () => {
      setContextLoading(true);
      try {
        const response = await fetch(`/api/context?route=${encodeURIComponent(pathname)}`);
        const payload = (await response.json()) as ContextData;
        setContextData({
          title: payload.title ?? 'Context',
          items: Array.isArray(payload.items) ? payload.items : [],
        });
      } finally {
        setContextLoading(false);
      }
    };
    void fetchContext();
  }, [pathname]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}>
      {/* Desktop layout */}
      <div
        className={`hidden md:grid min-h-screen transition-all duration-300 ${
          rightPanelOpen ? 'md:grid-cols-[auto_1fr_300px]' : 'md:grid-cols-[auto_1fr]'
        }`}
      >
        {/* Sidebar */}
        <aside
          className={`flex flex-col border-r transition-all duration-300 ${
            sidebarCollapsed ? 'w-[64px]' : 'w-[240px]'
          }`}
          style={{
            background: 'rgba(9,11,15,0.95)',
            borderColor: 'var(--color-border)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo */}
          <button
            className="flex items-center gap-3 px-4 py-5 transition-all duration-200 hover:opacity-80"
            onClick={() => setSidebarCollapsed((p) => !p)}
            aria-label="Toggle sidebar"
          >
            <span
              className="text-xl"
              style={{ color: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 8px var(--accent-cyan))' }}
            >
              ◍
            </span>
            {!sidebarCollapsed && (
              <div className="text-left">
                <div
                  className="text-sm font-bold tracking-[0.3em]"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  N.O.V.A
                </div>
                <div className="text-[9px] tracking-widest uppercase" style={{ color: 'var(--color-muted)', opacity: 0.5 }}>
                  Operative System
                </div>
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="mx-4 mb-3" style={{ borderTop: '1px solid var(--color-border)' }} />

          {/* Nav */}
          <nav className="flex-1 space-y-1 px-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150"
                  style={{
                    background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                    borderLeft: active ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                    color: active ? 'var(--accent-cyan)' : 'var(--color-muted)',
                    boxShadow: active ? '0 0 20px rgba(0,212,255,0.06)' : 'none',
                  }}
                >
                  <span style={{ filter: active ? 'drop-shadow(0 0 6px var(--accent-cyan))' : 'none' }}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom: user + sign out */}
          <div className="p-3" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                  color: '#050608',
                }}
              >
                AK
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate text-xs font-medium" style={{ color: 'var(--color-text)' }}>Akash</div>
                    <div className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--color-muted)', opacity: 0.5 }}>Operator</div>
                  </div>
                  <a
                    href="/api/auth/logout"
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
                    title="Sign out"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    ⇥
                  </a>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Main canvas */}
        <section className="flex min-h-screen flex-col overflow-hidden">
          {/* Topbar */}
          <header
            className="sticky top-0 z-10 flex min-h-[56px] items-center justify-between px-6"
            style={{
              background: 'rgba(9,11,15,0.85)',
              backdropFilter: 'blur(20px) saturate(180%)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: 'var(--color-muted)', fontFamily: 'monospace', fontSize: '11px' }}>N.O.V.A</span>
              <span style={{ color: 'var(--color-border)' }}>/ </span>
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{pageTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-all hover:bg-white/5"
                style={{ color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
                title="Toggle panel"
                onClick={() => setRightPanelOpen((p) => !p)}
              >
                ⊞
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </section>

        {/* Right panel */}
        {rightPanelOpen && (
          <aside
            className="flex flex-col"
            style={{
              background: 'rgba(9,11,15,0.95)',
              borderLeft: '1px solid var(--color-border)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="p-4">
              <div
                className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-muted)', opacity: 0.6 }}
              >
                Context
              </div>
              {contextLoading ? (
                <div className="flex items-center gap-2" style={{ color: 'var(--color-muted)' }}>
                  <span className="pulse-dot h-2 w-2 rounded-full" style={{ background: 'var(--accent-cyan)' }} />
                  <span className="text-xs">Awaiting context signal...</span>
                </div>
              ) : contextData.items.length === 0 ? (
                <div className="flex items-center gap-2" style={{ color: 'var(--color-muted)' }}>
                  <span className="pulse-dot h-2 w-2 rounded-full" style={{ background: 'var(--accent-cyan)', display: 'inline-block' }} />
                  <span className="text-xs">No context available for this section.</span>
                </div>
              ) : (
                <>
                  <div className="mb-3 text-sm font-semibold" style={{ color: 'var(--accent-cyan)' }}>
                    {contextData.title}
                  </div>
                  <ul className="space-y-2">
                    {contextData.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg px-3 py-2 text-xs"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden p-4">{children}</div>
    </div>
  );
}
