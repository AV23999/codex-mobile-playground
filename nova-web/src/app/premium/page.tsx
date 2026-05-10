'use client';

import { useState } from 'react';
import { Badge, Button, Card, CardBody, CardHeader } from '@/components/ui';

const FREE_FEATURES = ['Jarvis (demo mode)', 'Abyss — 50 memories', 'Basic chat history', '5 media files', 'Standard response speed'];
const PRO_FEATURES = ['Jarvis (GPT-4o powered)', 'Unlimited memories', 'Full chat history', 'Unlimited media', 'Priority response speed', 'All NOVA personas', 'Abyss pinning & export', 'Early feature access'];

export default function PremiumPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [confirming, setConfirming] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  const price = billing === 'monthly' ? '$12' : '$99';
  const saving = billing === 'annual' ? 'Save $45/yr' : null;

  const handleUpgrade = async () => {
    setConfirming(true);
    await new Promise(r => setTimeout(r, 1200));
    setConfirming(false);
    setUpgraded(true);
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        {(['monthly', 'annual'] as const).map(b => (
          <button key={b} onClick={() => setBilling(b)}
            className={`rounded-full border px-5 py-2 text-sm font-medium capitalize transition ${
              billing === b
                ? 'border-[color:var(--nova-cyan)] bg-[rgba(0,245,255,0.1)] text-[color:var(--nova-cyan)]'
                : 'border-border text-[color:var(--nova-text-secondary)] hover:border-[color:var(--nova-border-glow)]'
            }`}>{b}</button>
        ))}
        {saving && <Badge variant="success">{saving}</Badge>}
      </div>

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Free */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Free</h2>
              <Badge>Current plan</Badge>
            </div>
            <p className="text-2xl font-bold mt-1">$0 <span className="text-sm font-normal text-[color:var(--nova-text-faint)]">/mo</span></p>
          </CardHeader>
          <CardBody className="space-y-2">
            {FREE_FEATURES.map(f => (
              <p key={f} className="flex items-center gap-2 text-sm text-[color:var(--nova-text-secondary)]">
                <span className="text-[color:var(--nova-text-faint)]">◦</span>{f}
              </p>
            ))}
            <Button variant="secondary" disabled className="mt-4 w-full">Your current plan</Button>
          </CardBody>
        </Card>

        {/* Pro */}
        <Card className="border-[rgba(245,166,35,0.3)] shadow-[0_0_40px_rgba(245,166,35,0.07)]">
          <CardHeader className="border-b border-[rgba(245,166,35,0.15)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">N.O.V.A Pro</h2>
              <Badge variant="warning">UPGRADE</Badge>
            </div>
            <p className="mt-1 text-2xl font-bold">{price} <span className="text-sm font-normal text-[color:var(--nova-text-faint)]">{billing === 'monthly' ? '/mo' : '/yr'}</span></p>
          </CardHeader>
          <CardBody className="space-y-2">
            {PRO_FEATURES.map(f => (
              <p key={f} className="flex items-center gap-2 text-sm text-[color:var(--nova-text-secondary)]">
                <span className="text-[color:var(--nova-cyan)]">✓</span>{f}
              </p>
            ))}
            {upgraded ? (
              <div className="mt-4 rounded-md bg-[rgba(0,245,255,0.08)] border border-[rgba(0,245,255,0.2)] p-3 text-center">
                <p className="text-sm font-semibold text-[color:var(--nova-cyan)]">✓ NOVA Pro Activated</p>
                <p className="text-xs text-[color:var(--nova-text-faint)] mt-1">(Demo — no charge)</p>
              </div>
            ) : (
              <Button
                onClick={handleUpgrade}
                disabled={confirming}
                className="mt-4 w-full"
                style={{ background: 'linear-gradient(135deg,#f5a623,#e8890c)', color: '#050608' }}
              >{confirming ? 'Processing…' : `Upgrade to Pro · ${price}`}</Button>
            )}
          </CardBody>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader><h2 className="text-sm font-semibold">FAQ</h2></CardHeader>
        <CardBody className="space-y-4 text-sm text-[color:var(--nova-text-secondary)]">
          <div><p className="font-medium text-[color:var(--nova-text-primary)]">Is this a real charge?</p><p className="mt-0.5">No — this is a demo. No payment is processed.</p></div>
          <div><p className="font-medium text-[color:var(--nova-text-primary)]">Can I cancel anytime?</p><p className="mt-0.5">Yes. Cancel from Settings before your renewal date.</p></div>
          <div><p className="font-medium text-[color:var(--nova-text-primary)]">When does GPT-4o access activate?</p><p className="mt-0.5">Immediately after upgrade. Jarvis will switch to live mode.</p></div>
        </CardBody>
      </Card>
    </section>
  );
}
