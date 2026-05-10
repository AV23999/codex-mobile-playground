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
  const [success, setSuccess] = useState(false);

  const switchTab = (t: Tab) => { setTab(t); setError(''); setSuccess(false); };

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
      // Auto-login succeeded (cookie set by register route) — go straight to app
      router.push('/');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = 'w-full rounded-[8px] border border-[rgba(0,245,255,0.15)] bg-[rgba(0,245,255,0.04)] px-4 py-3 text-sm text-[#e0f7ff] placeholder-[rgba(0,245,255,0.3)] outline-none transition-all focus:border-[rgba(0,245,255,0.5)] focus:ring-1 focus:ring-[rgba(0,245,255,0.15)]';
  const lbl = 'mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-[rgba(0,245,255,0.5)]';

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      style={{ background: 'linear-gradient(135deg,#060a12 0%,#0a0f1e 40%,#070d1a 70%,#04080f 100%)' }}>
      {/* Nebula */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 700px 500px at 50% 45%,rgba(0,245,255,0.065) 0%,rgba(120,80,220,0.04) 50%,transparent 70%)' }} />
      {/* Stars */}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(1px 1px at 15% 25%,rgba(255,255,255,0.4) 0%,transparent 100%),radial-gradient(1px 1px at 72% 18%,rgba(255,255,255,0.3) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 38% 72%,rgba(0,245,255,0.5) 0%,transparent 100%),radial-gradient(1px 1px at 88% 55%,rgba(255,255,255,0.2) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 92% 8%,rgba(155,92,246,0.5) 0%,transparent 100%)' }} />

      <div className="relative w-full max-w-[400px]">
        {/* Wordmark */}
        <div className="mb-8 text-center">
          <h1 className="font-sans text-[32px] font-semibold tracking-[0.3em] text-white" style={{ fontFamily: 'Rajdhani,sans-serif', textShadow: '0 0 30px rgba(0,245,255,0.45),0 0 60px rgba(0,245,255,0.15)' }}>N.O.V.A</h1>
          <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[rgba(0,245,255,0.4)]" style={{ fontFamily: 'JetBrains Mono,monospace' }}>Neural Operative Virtual Assistant</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-[14px]" style={{ background: 'rgba(8,13,26,0.9)', border: '1px solid rgba(0,245,255,0.1)', borderTop: '1px solid rgba(0,245,255,0.22)', backdropFilter: 'blur(24px)', boxShadow: '0 0 80px rgba(0,0,0,0.7),0 0 40px rgba(0,245,255,0.05)' }}>

          {/* Tabs */}
          <div className="flex border-b border-[rgba(0,245,255,0.1)]">
            {(['signin','register'] as Tab[]).map(t => (
              <button key={t} type="button" onClick={() => switchTab(t)}
                className={`flex-1 py-3 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                  tab===t ? 'border-b-2 border-[#00f5ff] -mb-px text-[#00f5ff]' : 'text-[rgba(0,245,255,0.35)] hover:text-[rgba(0,245,255,0.65)]'
                }`} style={{ fontFamily: 'JetBrains Mono,monospace' }}>
                {t==='signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <div className="p-7">
            {tab === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div><label className={lbl}>Email</label><input className={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="operator@nova.ai" required autoComplete="email" /></div>
                <div>
                  <label className={lbl}>Password</label>
                  <div className="relative">
                    <input className={inp} type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
                    <button type="button" onClick={()=>setShowPw(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[rgba(0,245,255,0.4)] hover:text-[rgba(0,245,255,0.7)]" style={{ fontFamily: 'JetBrains Mono,monospace' }}>{showPw?'HIDE':'SHOW'}</button>
                  </div>
                </div>
                {error && <p className="rounded-md bg-[rgba(255,60,120,0.08)] px-3 py-2 text-[12px] text-[#ff4d8d]">{error}</p>}
                <button type="submit" disabled={loading} className="mt-1 w-full rounded-[8px] py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#060a12] disabled:opacity-50" style={{ fontFamily:'JetBrains Mono,monospace', background:'linear-gradient(90deg,#00f5ff,#00c8ff)', boxShadow:'0 0 20px rgba(0,245,255,0.3)' }}>
                  {loading ? 'Authenticating…' : 'Initialize Session'}
                </button>
                <p className="text-center text-[10px] text-[rgba(0,245,255,0.35)]" style={{ fontFamily:'JetBrains Mono,monospace' }}>
                  Demo: <span className="text-[rgba(0,245,255,0.6)]">operator@nova.ai</span> / <span className="text-[rgba(0,245,255,0.6)]">nova2025</span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div><label className={lbl}>Display Name</label><input className={inp} value={name} onChange={e=>setName(e.target.value)} placeholder="Akash" required autoComplete="name" /></div>
                <div><label className={lbl}>Email</label><input className={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="operator@nova.ai" required autoComplete="email" /></div>
                <div>
                  <label className={lbl}>Password</label>
                  <div className="relative">
                    <input className={inp} type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 6 characters" required autoComplete="new-password" />
                    <button type="button" onClick={()=>setShowPw(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[rgba(0,245,255,0.4)] hover:text-[rgba(0,245,255,0.7)]" style={{ fontFamily: 'JetBrains Mono,monospace' }}>{showPw?'HIDE':'SHOW'}</button>
                  </div>
                </div>
                {error && <p className="rounded-md bg-[rgba(255,60,120,0.08)] px-3 py-2 text-[12px] text-[#ff4d8d]">{error}</p>}
                <button type="submit" disabled={loading} className="mt-1 w-full rounded-[8px] py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#060a12] disabled:opacity-50" style={{ fontFamily:'JetBrains Mono,monospace', background:'linear-gradient(90deg,#00f5ff,#00c8ff)', boxShadow:'0 0 20px rgba(0,245,255,0.3)' }}>
                  {loading ? 'Creating…' : 'Create Operative Account'}
                </button>
              </form>
            )}
          </div>

          <div className="border-t border-[rgba(0,245,255,0.08)] px-7 py-3">
            <p className="text-center text-[9px] uppercase tracking-[0.12em] text-[rgba(0,245,255,0.22)]" style={{ fontFamily:'JetBrains Mono,monospace' }}>N.O.V.A OS v2.0 · Secure Channel · End-to-end encrypted</p>
          </div>
        </div>
      </div>
    </section>
  );
}
