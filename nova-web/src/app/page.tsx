import Link from 'next/link';
import { Badge, Button, Card, CardBody } from '@/components/ui';

const activities = [
  { id: 'a1', icon: '\u25c9', label: 'Jarvis summarized migration priorities for today.', time: '10:14' },
  { id: 'a2', icon: '\u25c8', label: 'Abyss stored a new architecture memory entry.', time: '09:52' },
  { id: 'a3', icon: '\u2630', label: 'Product Team chat received 3 new updates.', time: '09:10' },
  { id: 'a4', icon: '\u2605', label: 'Premium tier comparison draft reviewed.', time: 'Yesterday' },
  { id: 'a5', icon: '\u2699', label: 'Theme preference toggled to dark-first.', time: 'Yesterday' },
];

export default function HomePage() {
  return (
    <section className="space-y-6">
      {/* Status row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardBody className="space-y-2">
            <p className="text-sm text-foreground/60">Jarvis</p>
            <p className="text-2xl font-semibold">Active</p>
            <Badge variant="success">Online</Badge>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-2">
            <p className="text-sm text-foreground/60">Abyss Entries</p>
            <p className="text-2xl font-semibold">4 stored</p>
            <Badge>Stable</Badge>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-2">
            <p className="text-sm text-foreground/60">Unread Messages</p>
            <p className="text-2xl font-semibold">7</p>
            <Badge variant="primary">Attention</Badge>
          </CardBody>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardBody className="flex flex-wrap gap-3">
          <Link href="/jarvis">
            <Button variant="ghost">Ask Jarvis</Button>
          </Link>
          <Link href="/abyss">
            <Button variant="ghost">Open Abyss</Button>
          </Link>
          <Link href="/chats">
            <Button variant="ghost">View Chats</Button>
          </Link>
        </CardBody>
      </Card>

      {/* Recent activity */}
      <Card>
        <CardBody className="space-y-2">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex min-h-touch items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span aria-hidden>{activity.icon}</span>
                <span className="text-sm">{activity.label}</span>
              </div>
              <span className="shrink-0 text-xs text-foreground/50">{activity.time}</span>
            </div>
          ))}
        </CardBody>
      </Card>
    </section>
  );
}
