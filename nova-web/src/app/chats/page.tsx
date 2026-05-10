'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui';

const items = ['Maya', 'Design Ops', 'Alex', 'Product Team', 'QA Bot'];

export default function ChatsPage() {
  const [active, setActive] = useState(items[0]);
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card><CardHeader><h2 className="text-display">Conversations</h2></CardHeader><CardBody className="space-y-2">{items.map((item) => <button key={item} className={`w-full rounded-md border px-3 py-2 text-left ${active===item?'border-[color:var(--nova-border-glow)] bg-[rgba(0,245,255,0.06)]':'border-border hover:bg-white/5'}`} onClick={()=>setActive(item)}>{item}</button>)}</CardBody></Card>
      <Card><CardHeader><h2 className="text-display">{active}</h2></CardHeader><CardBody className="space-y-3"><div className="ml-auto max-w-xs rounded-tl-xl rounded-b-xl border border-[rgba(0,245,255,0.15)] bg-[rgba(0,245,255,0.08)] p-3 text-[color:var(--nova-cyan)]">Status update?</div><div className="max-w-xs rounded-tr-xl rounded-b-xl border border-border bg-[color:var(--nova-elevated)] p-3">All systems green.</div></CardBody></Card>
    </section>
  );
}
