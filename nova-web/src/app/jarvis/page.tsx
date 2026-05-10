'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Avatar, Button, Input } from '@/components/ui';

type Role = 'user' | 'assistant';
type Msg = { id: string; role: Role; text: string; ts: string };

const NOVA_REPLIES = [
  'Understood. Processing request…',
  'Memory indexed. Context updated.',
  'Signal received. Executing protocol.',
  'Acknowledged. Cross-referencing Abyss entries.',
  'Directive logged. Standing by for further instruction.',
  'Pattern recognised. Formulating response.',
  'Query resolved. Neural link stable.',
  'Scanning active threads… no anomalies detected.',
  'Confirmed. Operative briefing updated.',
  'Transmission clear. NOVA online and responsive.',
];

const seed: Msg[] = [
  { id: 'm1', role: 'assistant', text: 'NOVA online. Neural link established. How can I assist?', ts: '09:41' },
];

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
let replyIdx = 0;
const nextReply = () => { const r = NOVA_REPLIES[replyIdx % NOVA_REPLIES.length]; replyIdx++; return r; };

export default function JarvisPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [value, setValue] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, thinking]);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = value.trim();
    if (!text || thinking) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: 'user', text, ts: nowTime() };
    setMessages(prev => [...prev, userMsg]);
    setValue('');
    setThinking(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const reply: Msg = { id: `a-${Date.now()}`, role: 'assistant', text: nextReply(), ts: nowTime() };
    setMessages(prev => [...prev, reply]);
    setThinking(false);
  };

  return (
    <section className="flex h-full min-h-[70vh] flex-col gap-4">
      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-border bg-[color:var(--nova-elevated)] p-4">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <article className={`max-w-2xl rounded-lg border px-4 py-3 ${
                isUser
                  ? 'border-[rgba(0,245,255,0.15)] bg-[rgba(0,245,255,0.08)] text-[color:var(--nova-cyan)]'
                  : 'border-border bg-[color:var(--nova-elevated)] text-[color:var(--nova-text-primary)] shadow-[-6px_0_14px_rgba(155,92,246,0.08)]'
              }`}>
                <div className="mb-1 flex items-center gap-2">
                  <Avatar name={isUser ? 'You' : 'Nova'} size="sm" />
                  <span className="text-xs text-[color:var(--nova-text-faint)]">{msg.ts}</span>
                </div>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </article>
            </div>
          );
        })}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-lg border border-border bg-[color:var(--nova-elevated)] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--nova-cyan)]" style={{animationDelay:'0ms'}} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--nova-cyan)]" style={{animationDelay:'150ms'}} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--nova-cyan)]" style={{animationDelay:'300ms'}} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Transmit instruction…"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" disabled={!value.trim() || thinking}>Send</Button>
      </form>
    </section>
  );
}
