'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, CardBody, CardHeader, Input } from '@/components/ui';

type Memory = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  timestamp: string;
};

export default function AbyssPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');

  const loadMemories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/abyss');
      const data = (await response.json()) as Memory[];
      const list = Array.isArray(data) ? data : [];
      setMemories(list);
      setSelectedId((prev) => prev || list[0]?.id || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMemories();
  }, []);

  const selectedMemory = useMemo(
    () => memories.find((m) => m.id === selectedId) ?? memories[0],
    [selectedId, memories],
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;
    await fetch('/api/abyss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, excerpt, category: 'General', content: excerpt }),
    });
    setTitle('');
    setExcerpt('');
    await loadMemories();
  };

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Abyss Memory Entries</h2>
        </CardHeader>
        <CardBody className="space-y-2">
          {loading ? (
            <p className="text-sm text-foreground/60">Loading memories…</p>
          ) : null}

          {!loading &&
            memories.map((memory) => (
              <button
                key={memory.id}
                className={`w-full rounded-md border px-3 py-3 text-left transition ${
                  selectedId === memory.id
                    ? 'border-accent-abyssPurple bg-background'
                    : 'border-border bg-surface hover:bg-background'
                }`}
                onClick={() => setSelectedId(memory.id)}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-medium">{memory.title}</p>
                  <Badge variant="warning">{memory.category}</Badge>
                </div>
                <p className="text-sm text-foreground/60">{memory.excerpt}</p>
                <p className="mt-2 text-xs text-foreground/40">{memory.timestamp}</p>
              </button>
            ))}

          <form
            className="space-y-2 rounded-md border border-border bg-background p-3"
            onSubmit={onSubmit}
          >
            <Input
              label="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="New memory title"
            />
            <Input
              label="Excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Short summary"
            />
            <Button variant="primary" type="submit">
              Save to Abyss
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Memory Detail</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {selectedMemory ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{selectedMemory.title}</h3>
                <Badge variant="warning">{selectedMemory.category}</Badge>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {selectedMemory.content}
              </p>
              <p className="text-xs text-foreground/40">
                Last updated: {selectedMemory.timestamp}
              </p>
              <Button variant="secondary">Pin to context</Button>
            </>
          ) : (
            <p className="text-sm text-foreground/60">No memory selected.</p>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
