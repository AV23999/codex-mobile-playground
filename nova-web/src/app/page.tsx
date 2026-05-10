'use client';

import { useEffect, useState } from 'react';
import { Badge, Card, CardBody, CardHeader } from '@/components/ui';
import Link from 'next/link';

type Memory = { id: string; title: string; category: string; timestamp: string };

const QUICK_LINKS = [
  { href: '/jarvis', label: 'Open Jarvis', icon: '◉', desc: 'AI chat interface' },
  { href: '/abyss', label: 'Abyss', icon: '◈', desc: 'Memory bank' },
  { href: '/chats', label: 'Chats', icon: '☰', desc: 'Conversations' },
  { href: '/watch', label: 'Watch Queue', icon: '▶', desc: 'Video library' },
];

export default function HomePage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loadingMem, setLoadingMem] = useState(true);

  useEffect(() => {
    fetch('/api/abyss')
      .then(r => r.json())
      .then((data: Memory[]) => setMemories(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingMem(false));
  }, []);

  const stats = [
    { label: 'Memories', value: loadingMem ? '…' : memories.length.toString(), icon: '◈', variant: 'warning' as const },
    { label: 'Jarvis Sessions', value: '12', icon: '◉', variant: 'primary' as const },
    { label: 'Chats', value: '5', icon: '☰', variant: 'default' as const },
    { label: 'Uptime', value: '99.8%', icon: '⚡', variant: 'success' as const },
  ];

  return (
    <section className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon, variant }) => (
          <Card key={label} hoverable>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg text-[color:var(--nova-text-faint)]">{icon}</span>
                <Badge variant={variant}>{label}</Badge>
              </div>
              <p className="text-3xl font-semibold tabular-nums">{value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick access */}
      <Card>
        <CardHeader><h2 className="text-sm font-semibold">Quick Access</h2></CardHeader>
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map(({ href, label, icon, desc }) => (
            <Link key={href} href={href}
              className="flex flex-col gap-1 rounded-lg border border-border p-4 transition hover:border-[color:var(--nova-border-glow)] hover:bg-[rgba(0,245,255,0.04)]">
              <span className="text-xl text-[color:var(--nova-cyan)]">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs text-[color:var(--nova-text-faint)]">{desc}</span>
            </Link>
          ))}
        </CardBody>
      </Card>

      {/* Recent memories */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold">Recent Abyss Entries</h2>
          <Link href="/abyss" className="text-xs text-[color:var(--nova-cyan)] hover:underline">View all →</Link>
        </CardHeader>
        <CardBody>
          {loadingMem ? (
            <p className="text-sm text-[color:var(--nova-text-faint)]">Loading…</p>
          ) : memories.length === 0 ? (
            <p className="text-sm text-[color:var(--nova-text-faint)]">No memories yet. <Link href="/abyss" className="text-[color:var(--nova-cyan)] hover:underline">Add one →</Link></p>
          ) : (
            <div className="space-y-2">
              {memories.slice(0, 5).map(m => (
                <Link key={m.id} href="/abyss"
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm transition hover:bg-[rgba(255,255,255,0.03)]">
                  <span className="truncate">{m.title}</span>
                  <span className="ml-4 shrink-0 text-xs text-[color:var(--nova-text-faint)]">{m.timestamp}</span>
                </Link>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
