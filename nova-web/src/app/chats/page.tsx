import { Avatar, Badge, Card, CardBody, CardHeader } from '@/components/ui';

type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
};

const conversations: Conversation[] = [
  { id: 'c1', name: 'Maya Chen', preview: 'Can you review the new onboarding copy before launch?', time: '10:12', unread: 2 },
  { id: 'c2', name: 'Design Ops', preview: 'Uploaded updated icon set for N.O.V.A sidebar.', time: '09:48', unread: 0 },
  { id: 'c3', name: 'Alex Rivera', preview: 'Jarvis panel animation feels much smoother now.', time: 'Yesterday', unread: 1 },
  { id: 'c4', name: 'Product Team', preview: 'Reminder: premium flow walkthrough at 3 PM.', time: 'Yesterday', unread: 0 },
  { id: 'c5', name: 'QA Bot', preview: '7 regressions resolved in web layout shell suite.', time: 'Mon', unread: 4 },
];

export default function ChatsPage() {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Conversations</h2>
        </CardHeader>
        <CardBody className="space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex min-h-touch items-center gap-3 rounded-md border border-border bg-background px-3 py-3"
            >
              <Avatar
                name={conversation.name}
                size="md"
                status={conversation.unread > 0 ? 'online' : 'offline'}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{conversation.name}</p>
                <p className="truncate text-sm text-foreground/60">{conversation.preview}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground/50">{conversation.time}</span>
                {conversation.unread > 0 ? (
                  <Badge variant="primary">{conversation.unread}</Badge>
                ) : null}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </section>
  );
}
