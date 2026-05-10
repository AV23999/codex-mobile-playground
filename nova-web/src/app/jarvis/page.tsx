'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Button, Input } from '@/components/ui';

type Role = 'user' | 'assistant';
type ChatMessage = { id: string; role: Role; text: string; timestamp: string };

const seedMessages: ChatMessage[] = [
  { id: 'm1', role: 'assistant', text: 'NOVA online. Context linked.', timestamp: '09:41' },
  { id: 'm2', role: 'user', text: 'Summarize priorities.', timestamp: '09:42' },
];

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function JarvisPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [value, setValue] = useState('');
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { listEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const canSend = useMemo(() => value.trim().length > 0, [value]);

  const sendMessage = () => {
    const text = value.trim(); if (!text) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text, timestamp: nowTime() }, { id: `a-${Date.now()}`, role: 'assistant', text: 'NOVA thinking…', timestamp: nowTime() }]);
    setValue('');
  };

  return (
    <section className="flex h-full min-h-[70vh] flex-col gap-4">
      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-border bg-[color:var(--nova-elevated)] p-4">
        {messages.map((message) => {
          const user = message.role === 'user';
          return (
            <div key={message.id} className={`flex ${user ? 'justify-end' : 'justify-start'}`}>
              <article className={`max-w-2xl rounded-lg border px-4 py-3 ${user ? 'border-[rgba(0,245,255,0.15)] bg-[rgba(0,245,255,0.08)] text-[color:var(--nova-cyan)]' : 'border-border bg-[color:var(--nova-elevated)] text-[color:var(--nova-text-primary)] shadow-[-6px_0_14px_rgba(155,92,246,0.08)]'}`}>
                <div className="mb-1 flex items-center gap-2"><Avatar name={user ? 'You' : 'Jarvis'} size="sm" /><span className="text-mono-ui text-xs text-[color:var(--nova-text-faint)]">{message.timestamp}</span></div>
                <p>{message.text}</p>
              </article>
            </div>
          );
        })}
        <div ref={listEndRef} />
      </div>
      <Input placeholder="Transmit instruction…" value={value} onChange={(e) => setValue(e.target.value)} iconRight={<Button onClick={sendMessage} disabled={!canSend}>Send</Button>} />
    </section>
  );
}
