'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, CardBody, CardHeader, Input } from '@/components/ui';

type Memory = { id: string; title: string; category: string; excerpt: string; content: string; timestamp: string };

const CATEGORIES = ['General', 'Mission', 'Intel', 'Personal', 'System'];

export default function AbyssPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('General');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/abyss');
      const data = (await res.json()) as Memory[];
      const list = Array.isArray(data) ? data : [];
      setMemories(list);
      setSelectedId(prev => prev || list[0]?.id || '');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const selected = useMemo(() => memories.find(m => m.id === selectedId), [memories, selectedId]);

  const filtered = useMemo(() =>
    memories.filter(m =>
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.excerpt.toLowerCase().includes(search.toLowerCase())
    ), [memories, search]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;
    setSaving(true);
    try {
      await fetch('/api/abyss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, category, content: excerpt }),
      });
      setTitle(''); setExcerpt(''); setCategory('General');
      await load();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    setDeleting(true);
    try {
      await fetch('/api/abyss', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (selectedId === id) setSelectedId('');
      await load();
    } finally {
      setDeleting(false);
    }
  };

  const variantFor = (cat: string) => {
    const map: Record<string, 'warning' | 'primary' | 'success' | 'danger' | 'default'> = {
      Mission: 'primary', Intel: 'warning', Personal: 'success', System: 'danger',
    };
    return map[cat] ?? 'default';
  };

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {/* Left — list + create */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold">Memory Bank</h2>
            <p className="text-xs text-[color:var(--nova-text-faint)]">{memories.length} entries stored</p>
          </CardHeader>
          <CardBody className="space-y-2">
            <Input placeholder="Search memories…" value={search} onChange={e => setSearch(e.target.value)} />
            {loading ? (
              <p className="py-4 text-center text-sm text-[color:var(--nova-text-faint)]">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-[color:var(--nova-text-faint)]">No entries found.</p>
            ) : (
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {filtered.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedId(m.id)}
                    className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                      selectedId === m.id
                        ? 'border-[color:var(--nova-border-glow)] bg-[rgba(0,245,255,0.06)]'
                        : 'border-border hover:bg-[rgba(255,255,255,0.03)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium">{m.title}</span>
                      <Badge variant={variantFor(m.category)}>{m.category}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[color:var(--nova-text-faint)]">{m.excerpt}</p>
                  </button>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Create form */}
        <Card>
          <CardHeader><h2 className="text-sm font-semibold">New Entry</h2></CardHeader>
          <CardBody>
            <form onSubmit={onSave} className="space-y-3">
              <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Memory title" />
              <Input label="Excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short summary" />
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-[color:var(--nova-text-faint)]">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`rounded-md border px-3 py-1 text-xs transition ${
                        category === cat
                          ? 'border-[color:var(--nova-cyan)] bg-[rgba(0,245,255,0.1)] text-[color:var(--nova-cyan)]'
                          : 'border-border text-[color:var(--nova-text-secondary)] hover:border-[color:var(--nova-border-glow)]'
                      }`}
                    >{cat}</button>
                  ))}
                </div>
              </div>
              <Button variant="primary" type="submit" disabled={saving || !title.trim() || !excerpt.trim()}>
                {saving ? 'Saving…' : 'Save to Abyss'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      {/* Right — detail */}
      <Card className="flex flex-col">
        <CardHeader><h2 className="text-sm font-semibold">Memory Detail</h2></CardHeader>
        <CardBody className="flex flex-1 flex-col space-y-4">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{selected.title}</h3>
                  <p className="mt-0.5 text-xs text-[color:var(--nova-text-faint)]">{selected.timestamp}</p>
                </div>
                <Badge variant={variantFor(selected.category)}>{selected.category}</Badge>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-[color:var(--nova-text-secondary)]">{selected.content}</p>
              <div className="flex gap-2 border-t border-border pt-4">
                <Button variant="secondary" className="flex-1">Pin to context</Button>
                <Button
                  variant="danger"
                  disabled={deleting}
                  onClick={() => onDelete(selected.id)}
                >{deleting ? 'Deleting…' : 'Delete'}</Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-[color:var(--nova-text-faint)]">Select a memory to view details.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
