'use client';

import { useState } from 'react';
import { Badge, Button, Card, CardBody, CardHeader } from '@/components/ui';

type WatchItem = { id: string; title: string; channel: string; duration: string; genre: string; watched: boolean; added: string };

const SEED: WatchItem[] = [
  { id: 'w1', title: 'NOVA Architecture Deep Dive', channel: 'Codex Labs', duration: '38:12', genre: 'Tech', watched: false, added: 'Today' },
  { id: 'w2', title: 'Abyss Memory Protocols', channel: 'Neural Network', duration: '24:07', genre: 'Tech', watched: true, added: 'Yesterday' },
  { id: 'w3', title: 'Tactical AI: Mission Planning', channel: 'Operative HQ', duration: '51:44', genre: 'Mission', watched: false, added: 'Yesterday' },
  { id: 'w4', title: 'Jarvis Integration Guide', channel: 'Codex Labs', duration: '18:55', genre: 'Guide', watched: false, added: '2 days ago' },
  { id: 'w5', title: 'Dark UI Design Principles', channel: 'Design Ops', duration: '42:30', genre: 'Design', watched: true, added: '3 days ago' },
];

const GENRES = ['All', 'Tech', 'Mission', 'Guide', 'Design'];

export default function WatchPage() {
  const [items, setItems] = useState<WatchItem[]>(SEED);
  const [filter, setFilter] = useState('All');
  const [playing, setPlaying] = useState<WatchItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState('');

  const filtered = filter === 'All' ? items : items.filter(i => i.genre === filter);
  const unwatched = items.filter(i => !i.watched).length;

  const markWatched = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, watched: true } : i));
  const remove = (id: string) => { setItems(prev => prev.filter(i => i.id !== id)); if (playing?.id === id) setPlaying(null); };

  const addItem = () => {
    if (!newTitle.trim()) return;
    setItems(prev => [{ id: `w-${Date.now()}`, title: newTitle, channel: newChannel || 'Unknown', duration: '--:--', genre: 'Tech', watched: false, added: 'Just now' }, ...prev]);
    setNewTitle(''); setNewChannel(''); setAdding(false);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {GENRES.map(g => (
          <button key={g} onClick={() => setFilter(g)}
            className={`rounded-md border px-4 py-1.5 text-xs transition ${
              filter === g
                ? 'border-[color:var(--nova-cyan)] bg-[rgba(0,245,255,0.1)] text-[color:var(--nova-cyan)]'
                : 'border-border text-[color:var(--nova-text-secondary)] hover:border-[color:var(--nova-border-glow)]'
            }`}>{g}</button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          {unwatched > 0 && <Badge variant="warning">{unwatched} unwatched</Badge>}
          <Button variant="secondary" onClick={() => setAdding(v => !v)}>+ Add</Button>
        </div>
      </div>

      {adding && (
        <Card>
          <CardBody className="flex flex-wrap items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-[color:var(--nova-text-faint)]">Title</label>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                placeholder="Video title"
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--nova-border-glow)]" />
            </div>
            <div className="w-40">
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-[color:var(--nova-text-faint)]">Channel</label>
              <input value={newChannel} onChange={e => setNewChannel(e.target.value)}
                placeholder="Channel name"
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--nova-border-glow)]" />
            </div>
            <Button variant="primary" onClick={addItem}>Add to queue</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </CardBody>
        </Card>
      )}

      <div className="space-y-2">
        {filtered.map(item => (
          <Card key={item.id} className={item.watched ? 'opacity-50' : ''}>
            <CardBody className="flex items-center gap-4">
              <button
                onClick={() => { setPlaying(item); markWatched(item.id); }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--nova-border-glow)] bg-[rgba(0,245,255,0.06)] text-[color:var(--nova-cyan)] hover:bg-[rgba(0,245,255,0.12)] transition"
              >▶</button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="text-xs text-[color:var(--nova-text-faint)]">{item.channel} · {item.duration} · {item.added}</p>
              </div>
              <Badge variant={item.watched ? 'success' : 'default'}>{item.watched ? 'Watched' : item.genre}</Badge>
              <button onClick={() => remove(item.id)} className="text-xs text-[color:var(--nova-text-faint)] hover:text-red-400">✕</button>
            </CardBody>
          </Card>
        ))}
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-[color:var(--nova-text-faint)]">Queue is empty.</p>}
      </div>

      {/* Now playing */}
      {playing && (
        <div className="fixed bottom-6 right-6 z-50 w-80">
          <Card className="border-[color:var(--nova-border-glow)] shadow-[0_0_30px_rgba(0,245,255,0.12)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[color:var(--nova-cyan)]">▶ Now Playing</p>
                <button onClick={() => setPlaying(null)} className="text-[color:var(--nova-text-faint)] hover:text-white">✕</button>
              </div>
            </CardHeader>
            <CardBody className="space-y-1">
              <p className="text-sm font-medium">{playing.title}</p>
              <p className="text-xs text-[color:var(--nova-text-faint)]">{playing.channel} · {playing.duration}</p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[color:var(--nova-border)]">
                <div className="h-full w-1/3 rounded-full bg-[color:var(--nova-cyan)] transition-all" />
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </section>
  );
}
