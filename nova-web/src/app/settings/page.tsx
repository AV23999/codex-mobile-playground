'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button, Card, CardBody, CardHeader, Input } from '@/components/ui';

type Theme = 'Dark' | 'Light';
type Notifs = 'On' | 'Off';
type Compact = 'Off' | 'On';
type Persona = 'Default' | 'Tactical' | 'Stealth' | 'Archive';

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState('Akash');
  const [email] = useState('operator@nova.ai');
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState<Theme>('Dark');
  const [notifs, setNotifs] = useState<Notifs>('On');
  const [compact, setCompact] = useState<Compact>('Off');
  const [persona, setPersona] = useState<Persona>('Default');
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSaved(false);
    await new Promise(r => setTimeout(r, 400));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const clearMemories = async () => {
    if (!confirm('Delete ALL Abyss memories? This cannot be undone.')) return;
    setClearing(true);
    try {
      const res = await fetch('/api/abyss');
      const memories = await res.json() as Array<{ id: string }>;
      await Promise.all(
        memories.map(m =>
          fetch('/api/abyss', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: m.id }),
          })
        )
      );
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    } finally {
      setClearing(false);
    }
  };

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const PERSONAS: Persona[] = ['Default', 'Tactical', 'Stealth', 'Archive'];

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      {/* Profile */}
      <Card>
        <CardHeader><h2 className="text-sm font-semibold">Operator Profile</h2></CardHeader>
        <CardBody>
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            <Input label="Display name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Email" value={email} readOnly />
            <div className="sm:col-span-2 flex items-center gap-3">
              <Button type="submit" variant="primary">Save profile</Button>
              {saved && <span className="text-xs text-green-400">✓ Saved</span>}
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader><h2 className="text-sm font-semibold">Preferences</h2></CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <div className="flex gap-1">
              {(['Dark', 'Light'] as Theme[]).map(t => (
                <button key={t} onClick={() => setTheme(t)}
                  className={`rounded border px-3 py-1 text-xs transition ${
                    theme === t ? 'border-[color:var(--nova-cyan)] bg-[rgba(0,245,255,0.1)] text-[color:var(--nova-cyan)]' : 'border-border text-[color:var(--nova-text-secondary)] hover:border-[color:var(--nova-border-glow)]'
                  }`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Notifications</span>
            <button onClick={() => setNotifs(n => n === 'On' ? 'Off' : 'On')}
              className={`rounded-full border px-4 py-1 text-xs font-medium transition ${
                notifs === 'On' ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-border text-[color:var(--nova-text-faint)]'
              }`}>{notifs}</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Compact mode</span>
            <button onClick={() => setCompact(c => c === 'Off' ? 'On' : 'Off')}
              className={`rounded-full border px-4 py-1 text-xs font-medium transition ${
                compact === 'On' ? 'border-[color:var(--nova-cyan)]/40 bg-[rgba(0,245,255,0.08)] text-[color:var(--nova-cyan)]' : 'border-border text-[color:var(--nova-text-faint)]'
              }`}>{compact}</button>
          </div>
        </CardBody>
      </Card>

      {/* Persona */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold">NOVA Persona</h2>
          <p className="text-xs text-[color:var(--nova-text-faint)]">Controls Jarvis response style</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PERSONAS.map(p => (
              <button key={p} onClick={() => setPersona(p)}
                className={`rounded-lg border px-3 py-3 text-center text-sm transition ${
                  persona === p
                    ? 'border-[color:var(--nova-cyan)] bg-[rgba(0,245,255,0.08)] text-[color:var(--nova-cyan)]'
                    : 'border-border text-[color:var(--nova-text-secondary)] hover:border-[color:var(--nova-border-glow)]'
                }`}>
                {p}
                {persona === p && <span className="ml-1.5 text-[10px]">✓</span>}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-[color:var(--nova-text-faint)]">Active:</span>
            <Badge variant="primary">{persona}</Badge>
          </div>
        </CardBody>
      </Card>

      {/* Danger zone */}
      <Card className="border-[rgba(220,50,100,0.2)]">
        <CardHeader><h2 className="text-sm font-semibold">Danger Zone</h2></CardHeader>
        <CardBody className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium">Clear all memories</p>
            <p className="text-xs text-[color:var(--nova-text-faint)]">Permanently deletes all Abyss entries.</p>
            {cleared && <p className="mt-1 text-xs text-green-400">✓ All memories cleared</p>}
          </div>
          <Button variant="danger" disabled={clearing} onClick={clearMemories}>
            {clearing ? 'Clearing…' : 'Clear Abyss'}
          </Button>
          <Button variant="ghost" onClick={signOut}>Sign out</Button>
        </CardBody>
      </Card>
    </section>
  );
}
