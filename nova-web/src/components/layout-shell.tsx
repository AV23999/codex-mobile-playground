'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

type ContextData = {
  title: string;
  items: string[];
};

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: '\u2302' },
  { href: '/jarvis', label: 'Jarvis', icon: '\u25c9' },
  { href: '/abyss', label: 'Abyss', icon: '\u25c8' },
  { href: '/chats', label: 'Chats', icon: '\u2630' },
  { href: '/media', label: 'Media', icon: '\u25a3' },
  { href: '/watch', label: 'Watch', icon: '\u25b6' },
  { href: '/premium', label: 'Premium', icon: '\u2605' },
  { href: '/settings', label: 'Settings', icon: '\u2699' },
];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/login';
    }
  };

  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [contextData, setContextData] = useState<ContextData>({
    title: 'Loading\u2026',
    items: [],
  });
  const [contextLoading, setContextLoading] = useState(false);

  const pageTitle = useMemo(() => {
    const active = NAV_ITEMS.find((item) => item.href === pathname);
    return active?.label ?? 'N.O.V.A';
  }, [pathname]);

  useEffect(() => {
    const fetchContext = async () => {
      setContextLoading(true);
      try {
        const response = await fetch(
          `/api/context?route=${encodeURIComponent(pathname)}`,
        );
        const payload = (await response.json()) as ContextData;
        setContextData({
          title: payload.title ?? 'Context',
          items: Array.isArray(payload.items) ? payload.items : [],
        });
      } catch {
        setContextData({
          title: 'Context',
          items: ['No context available for this section.'],
        });
      } finally {
        setContextLoading(false);
      }
    };
    void fetchContext();
  }, [pathname]);

  const ContextPanel = (
    <>
      <h2 className="mb-3 text-lg font-semibold">{contextData.title}</h2>
      {contextLoading ? (
        <p className="mb-2 text-sm text-foreground/50">Fetching context\u2026</p>
      ) : null}
      <ul className="space-y-2 text-sm text-foreground/80">
        {contextData.items.map((item) => (
          <li
            key={item}
            className="rounded-md border border-border bg-background px-2 py-2"
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );

  const SignOutButton = (
    <button
      className="mt-auto flex min-h-touch w-full items-center gap-3 rounded-md px-3 py-2 text-foreground/60 transition hover:bg-background hover:text-foreground"
      onClick={() => void handleSignOut()}
      aria-label="Sign out"
    >
      <span aria-hidden>\u238b</span>
      {!sidebarCollapsed && <span>Sign out</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop layout */}
      <div
        className={`hidden min-h-screen transition-all md:grid ${
          rightPanelOpen
            ? 'md:grid-cols-[240px_1fr_320px]'
            : 'md:grid-cols-[240px_1fr]'
        }`}
      >
        {/* Left sidebar */}
        <aside
          className={`flex flex-col border-r border-border bg-surface p-4 ${
            sidebarCollapsed ? 'w-16' : 'w-60'
          } transition-all`}
        >
          <button
            className="mb-4 flex min-w-touch items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-background"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="text-accent-abyssPurple">\u25cd</span>
            {!sidebarCollapsed && <span className="font-semibold">N.O.V.A</span>}
          </button>
          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-touch items-center gap-3 rounded-md px-3 py-2 transition ${
                    active
                      ? 'bg-background text-accent-abyssRed'
                      : 'text-foreground hover:bg-background'
                  }`}
                >
                  <span aria-hidden>{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
          {SignOutButton}
        </aside>

        {/* Main canvas */}
        <section className="flex min-h-screen flex-col">
          <header className="flex min-h-touch items-center justify-between border-b border-border bg-surface px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                className="flex min-w-touch items-center justify-center rounded-md border border-border px-3 py-2 md:hidden"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open navigation"
              >
                \u2630
              </button>
              <h1 className="text-xl font-semibold">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="min-h-touch min-w-touch rounded-md border border-border px-3 py-2 hover:bg-background"
                onClick={() => document.documentElement.classList.toggle('light')}
                aria-label="Toggle theme"
              >
                Theme
              </button>
              <button
                className="min-h-touch min-w-touch rounded-md border border-border px-3 py-2 hover:bg-background"
                onClick={() => setRightPanelOpen((prev) => !prev)}
                aria-label="Toggle context panel"
              >
                Panel
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </section>

        {/* Right context panel */}
        <aside
          className={`border-l border-border bg-surface p-4 transition-all duration-300 ${
            rightPanelOpen
              ? 'translate-x-0 opacity-100'
              : 'pointer-events-none -translate-x-4 opacity-0'
          }`}
        >
          {ContextPanel}
        </aside>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <header className="flex min-h-touch items-center justify-between border-b border-border bg-surface px-4 py-3">
          <button
            className="min-h-touch min-w-touch rounded-md border border-border px-3 py-2"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation"
          >
            \u2630
          </button>
          <h1 className="text-lg font-semibold">{pageTitle}</h1>
          <button
            className="min-h-touch min-w-touch rounded-md border border-border px-3 py-2"
            onClick={() => setRightPanelOpen((prev) => !prev)}
            aria-label="Toggle context panel"
          >
            Panel
          </button>
        </header>
        <main className="min-h-[calc(100vh-56px)] overflow-y-auto p-4">{children}</main>

        {/* Mobile drawer overlay */}
        <div
          className={`fixed inset-0 z-30 bg-black/60 transition ${
            mobileSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setMobileSidebarOpen(false)}
        />
        <aside
          className={`fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-border bg-surface p-4 transition-transform ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-semibold">N.O.V.A</span>
            <button
              className="min-h-touch min-w-touch rounded-md border border-border px-3 py-2"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close navigation"
            >
              \u2715
            </button>
          </div>
          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-touch items-center gap-3 rounded-md px-3 py-2 hover:bg-background"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <span aria-hidden>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <button
            className="mt-auto flex min-h-touch w-full items-center gap-3 rounded-md px-3 py-2 text-foreground/60 transition hover:bg-background hover:text-foreground"
            onClick={() => void handleSignOut()}
            aria-label="Sign out"
          >
            <span aria-hidden>\u238b</span>
            <span>Sign out</span>
          </button>
        </aside>

        {/* Mobile bottom sheet panel */}
        <aside
          className={`fixed bottom-0 left-0 right-0 z-40 rounded-t-xl border border-border bg-surface p-4 transition-all duration-300 ${
            rightPanelOpen
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-full opacity-0'
          }`}
        >
          <div className="mb-2 h-1 w-12 rounded-full bg-border" />
          {ContextPanel}
        </aside>
      </div>
    </div>
  );
}
