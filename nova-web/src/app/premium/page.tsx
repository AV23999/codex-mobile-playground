import { Badge, Button, Card, CardBody, CardHeader } from '@/components/ui';

export default function PremiumPage() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><div className="flex items-center justify-between"><h2 className="text-display text-xl">Free</h2><Badge>Current plan</Badge></div></CardHeader>
        <CardBody className="space-y-3 text-[color:var(--nova-text-secondary)]"><p>Jarvis (demo mode)</p><p>Abyss — 50 memories</p><p>Basic chat history</p><Button variant="secondary" disabled>Your current plan</Button></CardBody>
      </Card>
      <Card className="border-[rgba(245,166,35,0.3)] shadow-[0_0_40px_rgba(245,166,35,0.06)]">
        <CardHeader className="border-t border-[rgba(245,166,35,0.5)]"><div className="flex items-center justify-between"><h2 className="text-display text-xl">N.O.V.A Pro</h2><Badge variant="warning">UPGRADE</Badge></div></CardHeader>
        <CardBody className="space-y-3 text-[color:var(--nova-text-secondary)]"><p>Jarvis (GPT-4o powered)</p><p>Unlimited memories</p><p>Full chat history</p><p>Media library</p><p>Priority support</p><Button className="bg-[linear-gradient(135deg,#f5a623,#e8890c)] text-[#050608]" disabled>Upgrade to Pro</Button></CardBody>
      </Card>
    </section>
  );
}
