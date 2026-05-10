'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Avatar, Badge, Button, Card, CardBody, CardHeader, Input } from '@/components/ui';

type Msg = { id: string; from: 'me' | 'them'; text: string; ts: string };
type Contact = { id: string; name: string; role: string; status: 'online' | 'away' | 'offline'; unread: number };

const CONTACTS: Contact[] = [
  { id: 'c1', name: 'Maya', role: 'AI Liaison', status: 'online', unread: 2 },
  { id: 'c2', name: 'Design Ops', role: 'Team Channel', status: 'online', unread: 0 },
  { id: 'c3', name: 'Alex', role: 'Security Lead', status: 'away', unread: 1 },
  { id: 'c4', name: 'Product Team', role: 'Team Channel', status: 'online', unread: 0 },
  { id: 'c5', name: 'QA Bot', role: 'Automated', status: 'online', unread: 0 },
];

const AUTO_REPLIES: Record<string, string[]> = {
  c1: ['Understood, operator.', 'Noted. I will follow up shortly.', 'Confirmed. Neural sync active.'],
  c2: ['Design sprint starts Monday.', 'Figma file updated — check latest frames.', 'Prototype ready for review.'],
  c3: ['All clear on sector 7.', 'Perimeter secure. No anomalies.', 'Threat level: nominal.'],
  c4: ['Roadmap Q3 is locked.', 'Next sprint planning is Thursday.', 'Feature flags deployed to staging.'],
  c5: ['All tests passing. ✓', 'Coverage at 94%. No regressions.', 'Build green. Ready to ship.'],
};

const SEED: Record<string, Msg[]> = {
  c1: [
    { id: 'c1m1', from: 'them', text: 'Operator, I have a priority update.', ts: '10:11' },
    { id: 'c1m2', from: 'them', text: 'Abyss sync completed — 3 new entries indexed.', ts: '10:12' },
  ],
  c2: [{ id: 'c2m1', from: 'them', text: 'New component library pushed to main.', ts: '09:55' }],
  c3: [{ id: 'c3m1', from: 'them', text: 'Security patch applied. Recommend restart.', ts: '08:30' }],
  c4: [{ id: 'c4m1', from: 'them', text: 'Sprint review at 3pm today.', ts: '09:00' }],
  c5: [{ id: 'c5m1', from: 'them', text: 'Regression suite: PASS (312/312)', ts: '07:45' }],
};

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function ChatsPage() {
  const [activeId, setActiveId] = useState('c1');
  const [threads, setThreads] = useState<Record<string, Msg[]>>(SEED);
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [value, setValue] = useState('');
  const [replying, setReplying] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = contacts.find(c => c.id === activeId)!;
  const msgs = threads[activeId] ?? [];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, activeId]);

  const openChat = (id: string) => {
    setActiveId(id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const sendMsg = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = value.trim();
    if (!text || replying) return;
    const mine: Msg = { id: `m-${Date.now()}`, from: 'me', text, ts: nowTime() };
    setThreads(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), mine] }));
    setValue('');
    setReplying(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    const pool = AUTO_REPLIES[activeId] ?? ['Got it.'];
    const reply: Msg = { id: `r-${Date.now()}`, from: 'them', text: pool[Math.floor(Math.random() * pool.length)], ts: nowTime() };
    setThreads(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), reply] }));
    setReplying(false);
  };

  const statusColour = (s: Contact['status']) =>
    s === 'online' ? 'bg-green-400' : s === 'away' ? 'bg-yellow-400' : 'bg-zinc-500';

  return (
    <section className="grid h-[calc(100vh-8rem)] gap-4 lg:grid-cols-[280px_1fr]">
      {/* Contact list */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader><h2 className="text-sm font-semibold">Conversations</h2></CardHeader>
        <CardBody className="flex-1 space-y-1 overflow-y-auto p-2">
          {contacts.map(c => (
            <button
              key={c.id}
              onClick={() => openChat(c.id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition ${
                activeId === c.id
                  ? 'bg-[rgba(0,245,255,0.08)] text-[color:var(--nova-text-primary)]'
                  : 'text-[color:var(--nova-text-secondary)] hover:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              <div className="relative shrink-0">
                <Avatar name={c.name} size="sm" />
                <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[color:var(--nova-deep)] ${statusColour(c.status)}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="truncate text-[10px] text-[color:var(--nova-text-faint)]">{c.role}</p>
              </div>
              {c.unread > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--nova-cyan)] text-[9px] font-bold text-[#060a12]">{c.unread}</span>
              )}
            </button>
          ))}
        </CardBody>
      </Card>

      {/* Thread */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="shrink-0">
          <div className="flex items-center gap-3">
            <Avatar name={active.name} size="sm" />
            <div>
              <p className="text-sm font-semibold">{active.name}</p>
              <p className="text-[10px] text-[color:var(--nova-text-faint)]">{active.status}</p>
            </div>
            <Badge variant={active.status === 'online' ? 'success' : 'default'} className="ml-auto">{active.role}</Badge>
          </div>
        </CardHeader>
        <CardBody className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {msgs.map(m => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs rounded-xl px-4 py-2.5 text-sm ${
                m.from === 'me'
                  ? 'rounded-tr-sm border border-[rgba(0,245,255,0.15)] bg-[rgba(0,245,255,0.08)] text-[color:var(--nova-cyan)]'
                  : 'rounded-tl-sm border border-border bg-[color:var(--nova-elevated)] text-[color:var(--nova-text-primary)]'
              }`}>
                <p>{m.text}</p>
                <p className="mt-1 text-[9px] text-[color:var(--nova-text-faint)]">{m.ts}</p>
              </div>
            </div>
          ))}
          {replying && (
            <div className="flex justify-start">
              <div className="rounded-xl border border-border bg-[color:var(--nova-elevated)] px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--nova-text-faint)]" style={{animationDelay:'0ms'}} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--nova-text-faint)]" style={{animationDelay:'150ms'}} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--nova-text-faint)]" style={{animationDelay:'300ms'}} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </CardBody>
        <div className="shrink-0 border-t border-border p-3">
          <form onSubmit={sendMsg} className="flex gap-2">
            <div className="flex-1"><Input placeholder={`Message ${active.name}…`} value={value} onChange={e => setValue(e.target.value)} /></div>
            <Button type="submit" variant="primary" disabled={!value.trim() || replying}>Send</Button>
          </form>
        </div>
      </Card>
    </section>
  );
}
