'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Input } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const payload = await response.json();
    if (!response.ok) return setError(payload.error ?? 'Unable to sign in');
    document.cookie = `nova-token=${payload.token}; path=/`;
    router.push('/');
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_50%_50%,rgba(0,245,255,0.04)_0%,rgba(155,92,246,0.03)_50%,transparent_100%)]" />
      <div className="scanline-overlay absolute inset-0 opacity-20" />
      <Card className="relative w-full max-w-[420px] rounded-[16px] border-border bg-[color:var(--nova-panel)] shadow-[0_0_80px_rgba(0,245,255,0.05),0_40px_80px_rgba(0,0,0,0.6)]">
        <CardBody className="space-y-5 p-10">
          <div className="space-y-2 text-center">
            <p className="text-display text-[28px] tracking-[0.2em] text-white [text-shadow:0_0_18px_rgba(0,245,255,0.25)]">N.O.V.A</p>
            <p className="text-mono-ui text-[10px] uppercase tracking-[0.14em] text-[color:var(--nova-text-faint)]">Neural Operative Virtual Assistant</p>
            <div className="h-px bg-border" />
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@nova.ai" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <Button className="w-full" type="submit">INITIALIZE SESSION</Button>
            {error ? <p className="text-sm text-[color:var(--nova-magenta)]">{error}</p> : null}
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
