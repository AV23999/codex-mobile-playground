'use client';

import { useMemo, useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui';

type ThreadMessage = { role: 'user' | 'assistant'; text: string; time: string };
type Conversation = {
  id: string;
  title: string;
  preview: string;
  time: string;
  messages: ThreadMessage[];
};

const conversations: Conversation[] = [
  {
    id: 'c1',
    title: 'Maya Chen',
    preview: 'Can you review the onboarding copy?',
    time: '10:12',
    messages: [
      { role: 'assistant', text: 'Draft loaded. Want a concise or friendly tone?', time: '10:10' },
      { role: 'user', text: 'Friendly, but keep it clear.', time: '10:11' },
      { role: 'assistant', text: 'Done. I rewrote the opening line for clarity.', time: '10:12' },
    ],
  },
  {
    id: 'c2',
    title: 'Design Ops',
    preview: 'Uploaded updated icon set for sidebar.',
    time: '09:48',
    messages: [
      { role: 'assistant', text: 'New icon pack detected and cataloged.', time: '09:45' },
      { role: 'user', text: 'Can you flag any duplicates?', time: '09:46' },
      { role: 'assistant', text: 'Two duplicate glyphs found in settings set.', time: '09:48' },
    ],
  },
  {
    id: 'c3',
    title: 'Alex Rivera',
    preview: 'Jarvis panel animation feels smoother now.',
    time: 'Yesterday',
    messages: [
      { role: 'assistant', text: 'Animation timing updated to 180ms.', time: 'Yesterday' },
      { role: 'user', text: 'Looks better on desktop.', time: 'Yesterday' },
      { role: 'assistant', text: 'Great. I will keep this timing as default.', time: 'Yesterday' },
    ],
  },
  {
    id: 'c4',
    title: 'Product Team',
    preview: 'Reminder: premium flow walkthrough at 3 PM.',
    time: 'Yesterday',
    messages: [
      { role: 'assistant', text: 'Calendar reminder is set for 3 PM.', time: 'Yesterday' },
      { role: 'user', text: 'Please include feature comparison notes.', time: 'Yesterday' },
      { role: 'assistant', text: 'Added comparison notes to the agenda.', time: 'Yesterday' },
    ],
  },
  {
    id: 'c5',
    title: 'QA Bot',
    preview: '7 regressions resolved in layout shell suite.',
    time: 'Mon',
    messages: [
      { role: 'assistant', text: 'Regression suite completed with 0 blockers.', time: 'Mon' },
      { role: 'user', text: 'Any failures in mobile drawer tests?', time: 'Mon' },
      { role: 'assistant', text: 'No failures detected in drawer interactions.', time: 'Mon' },
    ],
  },
];

export default function ChatsPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const selected = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? conversations[0],
    [selectedId],
  );

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Conversations</h2>
        </CardHeader>
        <CardBody className="space-y-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`w-full rounded-md border px-3 py-3 text-left transition ${
                selectedId === conversation.id
                  ? 'border-accent-abyssPurple bg-background'
                  : 'border-border bg-surface hover:bg-background'
              }`}
              onClick={() => setSelectedId(conversation.id)}
            >
              <p className="text-sm font-medium">{conversation.title}</p>
              <p className="text-sm text-foreground/60">{conversation.preview}</p>
              <p className="text-xs text-foreground/40">{conversation.time}</p>
            </button>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">{selected.title}</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {selected.messages.map((message, index) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={`${selected.id}-${index}`}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <article
                  className={`max-w-xs space-y-1 px-3 py-2 ${
                    isUser
                      ? 'rounded-tl-xl rounded-b-xl bg-accent-abyssRed/10'
                      : 'rounded-tr-xl rounded-b-xl border border-border bg-surface'
                  }`}
                >
                  <p className="text-xs text-foreground/50">{isUser ? 'You' : 'Assistant'}</p>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-foreground/40">{message.time}</p>
                </article>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </section>
  );
}
