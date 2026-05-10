'use client';

import { useMemo, useState } from 'react';
import { Badge, Button, Card, CardBody, CardHeader } from '@/components/ui';

type Memory = {
  id: string;
  title: string;
  category: 'Research' | 'Personal' | 'Project' | 'System';
  excerpt: string;
  content: string;
  timestamp: string;
};

const memories: Memory[] = [
  {
    id: 'a1',
    title: 'Migration Blueprint',
    category: 'Project',
    excerpt: 'Pinned architecture notes for moving Expo flows to Next.js.',
    content: 'Pinned architecture notes for moving Expo flows to Next.js, including layout shell behavior, component library alignment, and service adaptation strategy.',
    timestamp: 'Today 08:10',
  },
  {
    id: 'a2',
    title: 'User Preference Snapshot',
    category: 'Personal',
    excerpt: 'Dark-first preference with compact chat spacing and voice replies.',
    content: 'Dark-first preference with compact chat spacing, voice replies enabled, and memory cards surfaced in the right context panel for rapid recall.',
    timestamp: 'Yesterday 18:32',
  },
  {
    id: 'a3',
    title: 'Risk Register',
    category: 'System',
    excerpt: 'Pending API key handling and route guard hardening checklist.',
    content: 'Pending API key handling and route guard hardening checklist, including in-memory token strategy and middleware routing validation.',
    timestamp: 'Yesterday 14:09',
  },
  {
    id: 'a4',
    title: 'Competitive Notes',
    category: 'Research',
    excerpt: 'Benchmarking assistant UX patterns for desktop productivity agents.',
    content: 'Benchmarking assistant UX patterns for desktop productivity agents with focus on message ergonomics, quick actions, and context persistence.',
    timestamp: 'Mon 11:04',
  },
];

export default function AbyssPage() {
  const [selectedId, setSelectedId] = useState<string>(memories[0].id);

  const selectedMemory = useMemo(
    () => memories.find((memory) => memory.id === selectedId) ?? memories[0],
    [selectedId],
  );

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Abyss Memory Entries</h2></CardHeader>
        <CardBody className="space-y-2">
          {memories.map((memory) => (
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
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Memory Detail</h2></CardHeader>
        <CardBody className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">{selectedMemory.title}</h3>
            <Badge variant="warning">{selectedMemory.category}</Badge>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">{selectedMemory.content}</p>
          <p className="text-xs text-foreground/40">Last updated: {selectedMemory.timestamp}</p>
          <Button variant="secondary">Pin to context</Button>
        </CardBody>
      </Card>
    </section>
  );
}
