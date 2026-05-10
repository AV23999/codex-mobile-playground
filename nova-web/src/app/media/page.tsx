'use client';

import { useRef, useState } from 'react';
import NextImage from 'next/image';
import { Badge, Button, Card, CardBody, CardHeader } from '@/components/ui';

type MediaItem = { id: string; name: string; type: 'image' | 'audio' | 'doc'; size: string; added: string; url?: string };

const SEED_MEDIA: MediaItem[] = [
  { id: 'md1', name: 'Mission Brief Alpha.pdf', type: 'doc', size: '142 KB', added: 'Today' },
  { id: 'md2', name: 'Sector 7 Scan.png', type: 'image', size: '2.1 MB', added: 'Today' },
  { id: 'md3', name: 'Abyss Sync Log.txt', type: 'doc', size: '18 KB', added: 'Yesterday' },
  { id: 'md4', name: 'Neural Ambient.mp3', type: 'audio', size: '4.8 MB', added: 'Yesterday' },
];

const TYPE_ICON: Record<string, string> = { image: '🖼', audio: '🎵', doc: '📄' };
const TYPE_VARIANT: Record<string, 'primary' | 'warning' | 'default'> = { image: 'primary', audio: 'warning', doc: 'default' };

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>(SEED_MEDIA);
  const [filter, setFilter] = useState<'all' | 'image' | 'audio' | 'doc'>('all');
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newItems: MediaItem[] = files.map(f => ({
      id: `md-${Date.now()}-${f.name}`,
      name: f.name,
      type: f.type.startsWith('image') ? 'image' : f.type.startsWith('audio') ? 'audio' : 'doc',
      size: `${(f.size / 1024).toFixed(0)} KB`,
      added: 'Just now',
      url: URL.createObjectURL(f),
    }));
    setItems(prev => [...newItems, ...prev]);
    e.target.value = '';
  };

  const remove = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (preview?.id === id) setPreview(null);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {(['all', 'image', 'audio', 'doc'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-md border px-4 py-1.5 text-xs capitalize transition ${
              filter === f
                ? 'border-[color:var(--nova-cyan)] bg-[rgba(0,245,255,0.1)] text-[color:var(--nova-cyan)]'
                : 'border-border text-[color:var(--nova-text-secondary)] hover:border-[color:var(--nova-border-glow)]'
            }`}>{f}</button>
        ))}
        <Button variant="secondary" className="ml-auto" onClick={() => inputRef.current?.click()}>+ Upload</Button>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleUpload} accept="image/*,audio/*,.pdf,.txt,.doc,.docx" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => (
          <Card key={item.id} hoverable className="cursor-pointer" onClick={() => setPreview(item)}>
            <CardBody className="flex items-center gap-3">
              <span className="text-2xl">{TYPE_ICON[item.type]}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-xs text-[color:var(--nova-text-faint)]">{item.size} · {item.added}</p>
              </div>
              <Badge variant={TYPE_VARIANT[item.type]}>{item.type}</Badge>
            </CardBody>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-12 text-center text-sm text-[color:var(--nova-text-faint)]">
            No {filter === 'all' ? 'media' : filter} files yet.
          </div>
        )}
      </div>

      {/* Preview panel */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setPreview(null)}>
          <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-semibold">{preview.name}</p>
                <button onClick={() => setPreview(null)} className="text-[color:var(--nova-text-faint)] hover:text-white">✕</button>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {preview.type === 'image' && preview.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.url} alt={preview.name} className="w-full rounded-md object-contain" />
              ) : (
                <div className="flex h-32 items-center justify-center text-5xl">{TYPE_ICON[preview.type]}</div>
              )}
              {preview.type === 'audio' && preview.url && (
                <audio controls src={preview.url} className="w-full" />
              )}
              <p className="text-xs text-[color:var(--nova-text-faint)]">{preview.size} · Added {preview.added}</p>
              <div className="flex gap-2">
                <Button variant="danger" onClick={() => remove(preview.id)}>Delete</Button>
                <Button variant="ghost" onClick={() => setPreview(null)}>Close</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </section>
  );
}
