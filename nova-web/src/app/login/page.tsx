'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';

type Tab = 'signin' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const payload = await response.json();
    if (!response.ok) return setError(payload.error ?? 'Unable to sign in');
    document.cookie = `nova-session=${payload.token}; path=/`;
    router.push('/');
  };

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setRegistered(true);
    setTimeout(() => {
      setRegistered(false);
      setTab('signin');
      setName('');
      setPassword('');
    }, 2000);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 bg-[color:var(--nova-void)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_900px_700px_at_50%_40%,rgba(0,245,255,0.05)_0%,rgba(155,92,246,0.04)_45%,transparent_100%)]" />
      <div className="scanline-overlay pointer-events-none absolute inset-0 opacity-[0.18]" />

      <div className="relative w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <p className="text-display text-[30px] tracking-[0.25em] text-white [text-shadow:0_0_20px_rgba(0,245,255,0.3)]">N.O.V.A</p>
          <p className="text-mono-ui mt-1 text-[9px] uppercase tracking-[0.18em] text-[color:var(--nova-text-faint)]">Neural Operative Virtual Assistant</p>
        </div>

        <div className="rounded-[14px] border border-[color:var(--nova-border)] bg-[color:var(--nova-panel)] shadow-[0_0_80px_rgba(0,0,0,0.6),0_0_40px_rgba(0,245,255,0.04)] [border-top:1px_solid_rgba(0,245,255,0.18)]">
          <div className="flex border-b border-[color:var(--nova-border)]">
            {(['signin', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setError(''); setRegistered(false); }}
                className={`flex-1 py-3 text-mono-ui text-[11px] uppercase tracking-[0.1em] transition-colors ${
                  tab === t
                    ? 'text-[color:var(--nova-cyan)] border-b-2 border-[color:var(--nova-cyan)] -mb-px'
                    : 'text-[color:var(--nova-text-faint)] hover:text-[color:var(--nova-text-secondary)]'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-5">
            {tab === 'signin' ? (
              <form className="space-y-4" onSubmit={handleSignIn}>
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@nova.ai" />
                <Input
                  label="Password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  iconRight={
                    <button type="button" onClick={() => setShowPw((v) => !v)} className="text-mono-ui text-[10px] text-[color:var(--nova-text-faint)] hover:text-[color:var(--nova-text-secondary)] min-h-0">
                      {showPw ? 'HIDE' : 'SHOW'}
                    </button>
                  }
                />
                <Button className="w-full" type="submit">INITIALIZE SESSION</Button>
                {error ? <p className="text-xs text-[color:var(--nova-magenta)]">{error}</p> : null}
              </form>
            ) : registered ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <span className="pulse-dot inline-block h-3 w-3 rounded-full bg-[color:var(--nova-cyan)]" />
                <p className="text-sm text-[color:var(--nova-text-primary)]">Operative account created.</p>
                <p className="text-xs text-[color:var(--nova-text-secondary)]">Returning to Sign In…</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleRegister}>
                <Input label="Display Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Akash" />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@nova.ai" />
                <Input
                  label="Password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  iconRight={
                    <button type="button" onClick={() => setShowPw((v) => !v)} className="text-mono-ui text-[10px] text-[color:var(--nova-text-faint)] hover:text-[color:var(--nova-text-secondary)] min-h-0">
                      {showPw ? 'HIDE' : 'SHOW'}
                    </button>
                  }
                />
                <Button className="w-full" type="submit">CREATE OPERATIVE ACCOUNT</Button>
                {error ? <p className="text-xs text-[color:var(--nova-magenta)]">{error}</p> : null}
              </form>
            )}
          </div>

          <div className="border-t border-[color:var(--nova-border)] px-8 py-4">
            <p className="text-mono-ui text-center text-[9px] uppercase tracking-[0.14em] text-[color:var(--nova-text-faint)]">
              N.O.V.A OS v2.0 &middot; Secure Channel &middot; End-to-end encrypted
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
