'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Input } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return setError('Please enter both email and password.');
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) return setError(payload.error ?? 'Unable to sign in.');
      document.cookie = `nova-token=${payload.token}; path=/`;
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!displayName || !email || !password || !confirmPassword)
      return setError('Please fill in all fields.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    setSuccess('Account created. Sign in to continue.');
    setTimeout(() => {
      setTab('signin');
      setSuccess('');
      setPassword('');
      setConfirmPassword('');
    }, 1800);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Background aura */}
      <div
        className="scanline-overlay pointer-events-none fixed inset-0 z-0"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 50% 45%, rgba(0,212,255,0.05) 0%, rgba(124,58,237,0.04) 50%, transparent 100%)',
        }}
        aria-hidden
      />

      {/* Card */}
      <Card className="relative z-10 w-full max-w-[420px]" style={{
        background: 'var(--color-panel)',
        border: '1px solid var(--color-border)',
        borderTop: '1px solid rgba(0,212,255,0.25)',
        boxShadow: '0 0 80px rgba(0,212,255,0.05), 0 40px 80px rgba(0,0,0,0.6)',
        borderRadius: '16px',
      }}>
        <CardBody className="p-10 space-y-6">
          {/* Logo */}
          <div className="space-y-1 text-center">
            <p
              className="text-3xl font-bold tracking-[0.3em]"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.3))',
              }}
            >
              N.O.V.A
            </p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--color-muted)', opacity: 0.6 }}>
              Neural Operative Virtual Assistant
            </p>
            <div className="mt-2" style={{ borderTop: '1px solid var(--color-border)' }} />
          </div>

          {/* Tabs */}
          <div
            className="grid grid-cols-2"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            {(['signin', 'register'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className="py-2 text-sm font-medium transition-all duration-150"
                style={{
                  borderBottom: tab === t ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  color: tab === t ? 'var(--color-text)' : 'var(--color-muted)',
                  background: 'transparent',
                  minHeight: '40px',
                }}
                onClick={() => { setTab(t); setError(''); setSuccess(''); }}
              >
                {t === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Success message */}
          {success && (
            <p className="rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(0,212,255,0.08)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,212,255,0.2)' }}>
              {success}
            </p>
          )}

          {/* Sign In Form */}
          {tab === 'signin' && (
            <form className="space-y-4" onSubmit={handleSignIn}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@nova.ai"
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {error && <p className="text-xs" style={{ color: '#ff2d78' }}>{error}</p>}
              <Button className="w-full" type="submit" loading={loading}>
                INITIALIZE SESSION
              </Button>
              <p className="text-center text-[11px]" style={{ color: 'var(--color-muted)', opacity: 0.5 }}>
                Demo: operator@nova.ai / nova2025
              </p>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form className="space-y-4" onSubmit={handleRegister}>
              <Input
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                error={error.includes('match') ? error : undefined}
              />
              {error && !error.includes('match') && <p className="text-xs" style={{ color: '#ff2d78' }}>{error}</p>}
              <Button className="w-full" type="submit">
                CREATE OPERATIVE ACCOUNT
              </Button>
            </form>
          )}

          {/* Footer */}
          <p className="text-center text-[10px] tracking-widest" style={{ color: 'var(--color-muted)', opacity: 0.35, fontFamily: 'monospace' }}>
            N.O.V.A OS v2.0 · Secure Channel · End-to-end encrypted
          </p>
        </CardBody>
      </Card>
    </section>
  );
}
