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
    text: 'Welcome back. I have your workspace context loaded and ready for today\u2019s tasks.',
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
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const canSend = useMemo(() => value.trim().length > 0, [value]);

  const streamAssistantReply = async (content: string, snapshot: ChatMessage[]) => {
    const placeholderId = `assistant-${Date.now()}`;
    const history = snapshot
      .slice(-10)
      .map((item) => ({ role: item.role, content: item.text }));

    setMessages((prev) => [
      ...prev,
      { id: placeholderId, role: 'assistant', text: 'thinking\u2026', timestamp: nowTime() },
    ]);

    try {
      const response = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to stream response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantText = '';

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;

        buffer += decoder.decode(chunk, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const event of events) {
          const line = event
            .split('\n')
            .find((entry) => entry.startsWith('data:'))
            ?.replace(/^data:\s?/, '');

          if (!line || line === '[DONE]') continue;

          let delta = line;
          if (line.startsWith('{')) {
            try {
              const json = JSON.parse(line) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              delta = json.choices?.[0]?.delta?.content ?? '';
            } catch {
              delta = line;
            }
          }

          assistantText += delta;

          setMessages((prev) =>
            prev.map((message) =>
              message.id === placeholderId
                ? { ...message, text: assistantText || 'thinking\u2026' }
                : message,
            ),
          );
        }
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === placeholderId
            ? {
                ...message,
                text:
                  assistantText.trim() ||
                  'Jarvis is unavailable. Please try again.',
              }
            : message,
        ),
      );
    } catch {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === placeholderId
            ? { ...message, text: 'Jarvis is unavailable. Please try again.' }
            : message,
        ),
      );
    }
  };

  const sendMessage = async () => {
    const content = value.trim();
    if (!content) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: content,
      timestamp: nowTime(),
    };

    const snapshot = [...messages, userMessage];
    setMessages(snapshot);
    setValue('');

    await streamAssistantReply(content, snapshot);
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
          <div ref={listEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="rounded-lg border border-border bg-surface p-3">
        <Input
          placeholder="Ask Jarvis anything\u2026"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void sendMessage();
            }
          }}
          iconRight={
            <Button
              variant="primary"
              size="sm"
              onClick={() => void sendMessage()}
              disabled={!canSend}
            >
              Send
            </Button>
          }
        />
      </div>
    </section>
  );
}
