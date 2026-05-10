'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'signin' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const switchTab = (t: Tab) => { setTab(t); setError(''); setRegistered(false); };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Sign in failed.'); return; }
      router.push('/');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Registration failed.'); return; }
      setRegistered(true);
      setTimeout(() => { setRegistered(false); switchTab('signin'); setName(''); setPassword(''); }, 2000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-[8px] border border-[rgba(0,245,255,0.15)] bg-[rgba(0,245,255,0.04)] px-4 py-3 text-sm text-[#e0f7ff] placeholder-[rgba(0,245,255,0.25)] outline-none transition-all focus:border-[rgba(0,245,255,0.5)] focus:bg-[rgba(0,245,255,0.07)] focus:ring-1 focus:ring-[rgba(0,245,255,0.2)]';
  const labelClass = 'mb-1 block text-[10px] uppercase tracking-[0.12em] text-[rgba(0,245,255,0.55)]';

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      style={{
        background: 'linear-gradient(135deg, #060a12 0%, #0a0f1e 40%, #070d1a 70%, #04080f 100%)',
      }}
    >
      {/* Nebula glow */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 700px 500px at 50% 45%, rgba(0,245,255,0.06) 0%, rgba(120,80,220,0.04) 50%, transparent 70%)' }} />
      {/* Stars */}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: ['radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.4) 0%, transparent 100%)', 'radial-gradient(1px 1px at 72% 18%, rgba(255,255,255,0.3) 0%, transparent 100%)', 'radial-gradient(1.5px 1.5px at 38% 72%, rgba(0,245,255,0.5) 0%, transparent 100%)', 'radial-gradient(1px 1px at 88% 55%, rgba(255,255,255,0.2) 0%, transparent 100%)', 'radial-gradient(1.5px 1.5px at 92% 8%, rgba(155,92,246,0.5) 0%, transparent 100%)', 'radial-gradient(1px 1px at 28% 45%, rgba(255,255,255,0.2) 0%, transparent 100%)'].join(', ') }} />

      <div className="relative w-full max-w-[400px]">
        {/* Wordmark */}
        <div className="mb-8 text-center">
          <h1 className="font-['Rajdhani',sans-serif] text-[32px] font-semibold tracking-[0.3em] text-white" style={{ textShadow: '0 0 30px rgba(0,245,255,0.45), 0 0 60px rgba(0,245,255,0.15)' }}>N.O.V.A</h1>
          <p className="mt-1 font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[0.18em] text-[rgba(0,245,255,0.4)]">Neural Operative Virtual Assistant</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-[14px]" style={{ background: 'rgba(8,13,26,0.88)', border: '1px solid rgba(0,245,255,0.12)', borderTop: '1px solid rgba(0,245,255,0.22)', backdropFilter: 'blur(24px)', boxShadow: '0 0 80px rgba(0,0,0,0.7), 0 0 40px rgba(0,245,255,0.05)' }}>

          {/* Tabs */}
          <div className="flex border-b border-[rgba(0,245,255,0.1)]">
            {(['signin', 'register'] as Tab[]).map((t) => (
              <button key={t} type="button" onClick={() => switchTab(t)}
                className={`flex-1 py-3 font-['JetBrains_Mono',monospace] text-[11px] uppercase tracking-[0.1em] transition-colors ${
                  tab === t ? 'text-[#00f5ff] border-b-2 border-[#00f5ff] -mb-px' : 'text-[rgba(0,245,255,0.35)] hover:text-[rgba(0,245,255,0.6)]'
                }`}>
                {t === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <div className="p-8">
            {tab === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="operator@nova.ai" required autoComplete="email" />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input className={inputClass} type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 font-['JetBrains_Mono',monospace] text-[10px] text-[rgba(0,245,255,0.4)] hover:text-[rgba(0,245,255,0.7)]">{showPw ? 'HIDE' : 'SHOW'}</button>
                  </div>
                </div>
                {error && <p className="text-[11px] text-[#ff4d8d]">{error}</p>}
                <button type="submit" disabled={loading}
                  className="mt-2 w-full rounded-[8px] py-3 font-['JetBrains_Mono',monospace] text-[12px] font-semibold uppercase tracking-[0.12em] text-[#060a12] transition-opacity disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg, #00f5ff, #00c8ff)', boxShadow: '0 0 20px rgba(0,245,255,0.3)' }}>
                  {loading ? 'Authenticating…' : 'Initialize Session'}
                </button>
                <p className="text-center font-['JetBrains_Mono',monospace] text-[10px] text-[rgba(0,245,255,0.35)]">
                  Demo: <span className="text-[rgba(0,245,255,0.6)]">operator@nova.ai</span> / <span className="text-[rgba(0,245,255,0.6)]">nova2025</span>
                </p>
              </form>
            ) : registered ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="h-3 w-3 rounded-full bg-[#00f5ff]" style={{ boxShadow: '0 0 12px #00f5ff' }} />
                <p className="text-sm text-[#e0f7ff]">Operative account created.</p>
                <p className="font-['JetBrains_Mono',monospace] text-[11px] text-[rgba(0,245,255,0.4)]">Redirecting to Sign In…</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className={labelClass}>Display Name</label>
                  <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Akash" required autoComplete="name" />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="operator@nova.ai" required autoComplete="email" />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input className={inputClass} type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 font-['JetBrains_Mono',monospace] text-[10px] text-[rgba(0,245,255,0.4)] hover:text-[rgba(0,245,255,0.7)]">{showPw ? 'HIDE' : 'SHOW'}</button>
                  </div>
                </div>
                {error && <p className="text-[11px] text-[#ff4d8d]">{error}</p>}
                <button type="submit" disabled={loading}
                  className="mt-2 w-full rounded-[8px] py-3 font-['JetBrains_Mono',monospace] text-[12px] font-semibold uppercase tracking-[0.12em] text-[#060a12] transition-opacity disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg, #00f5ff, #00c8ff)', boxShadow: '0 0 20px rgba(0,245,255,0.3)' }}>
                  {loading ? 'Creating…' : 'Create Operative Account'}
                </button>
              </form>
            )}
          </div>

          <div className="border-t border-[rgba(0,245,255,0.08)] px-8 py-3">
            <p className="text-center font-['JetBrains_Mono',monospace] text-[9px] uppercase tracking-[0.12em] text-[rgba(0,245,255,0.25)]">N.O.V.A OS v2.0 · Secure Channel · End-to-end encrypted</p>
          </div>
        </div>
      </div>
    </section>
  );
}
