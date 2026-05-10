'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Button, Input } from '@/components/ui';

type Role = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: Role;
  text: string;
  timestamp: string;
};

const seedMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    text: 'Welcome back. I have your workspace context loaded and ready for today\'s tasks.',
    timestamp: '09:41',
  },
  {
    id: 'm2',
    role: 'user',
    text: 'Great. Summarize my top priorities for the N.O.V.A web migration.',
    timestamp: '09:42',
  },
  {
    id: 'm3',
    role: 'assistant',
    text: 'Top priorities: finalize Jarvis desktop UX, wire memory panel behaviors, and complete auth guards before premium and watch flows.',
    timestamp: '09:42',
  },
];

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function JarvisPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const canSend = useMemo(() => value.trim().length > 0 && !isLoading, [value, isLoading]);

  const sendMessage = async () => {
    const content = value.trim();
    if (!content) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: content,
      timestamp: nowTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: nowTime(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: 'I seem to be having trouble connecting right now. Please check your API key or try again.',
        timestamp: nowTime(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex h-full min-h-full flex-col gap-4">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto rounded-lg border border-border bg-background p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-3xl items-end gap-2 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar
                    name={isUser ? 'You' : 'Jarvis'}
                    status={isUser ? 'away' : 'online'}
                    size="sm"
                  />
                  <article
                    className={`rounded-lg px-4 py-3 ${
                      isUser
                        ? 'bg-accent-nova text-background'
                        : 'border border-border bg-surface text-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <time
                      className={`mt-2 block text-xs ${
                        isUser ? 'text-background/70' : 'text-foreground/60'
                      }`}
                    >
                      {message.timestamp}
                    </time>
                  </article>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-3xl items-end gap-2 flex-row">
                <Avatar name="Jarvis" status="online" size="sm" />
                <article className="rounded-lg px-4 py-3 border border-border bg-surface text-foreground">
                  <p className="text-sm leading-relaxed text-foreground/50 italic">Jarvis is thinking...</p>
                </article>
              </div>
            </div>
          )}

          <div ref={listEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="rounded-lg border border-border bg-surface p-3">
        <Input
          placeholder="Ask Jarvis anything..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              sendMessage();
            }
          }}
          iconRight={
            <Button
              variant="primary"
              size="sm"
              onClick={sendMessage}
              disabled={!canSend}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          }
        />
      </div>
    </section>
  );
}
