import { Badge, Button, Card, CardBody, CardHeader } from '@/components/ui';

const queue = [
  { id: 'w1', title: 'Roadmap Sync Replay', duration: '24:18', status: 'Up Next' },
  { id: 'w2', title: 'N.O.V.A Feature Walkthrough', duration: '12:40', status: 'Queued' },
  { id: 'w3', title: 'Design Crit Session', duration: '31:05', status: 'Queued' },
];

export default function WatchPage() {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Watch Queue</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {queue.map((item) => (
            <div
              key={item.id}
              className="flex min-h-touch items-center justify-between rounded-md border border-border bg-background px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-foreground/50">Duration: {item.duration}</p>
              </div>
              <Badge variant={item.status === 'Up Next' ? 'primary' : 'default'}>
                {item.status}
              </Badge>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Button variant="primary">Start Session</Button>
            <Button variant="secondary">Share Room</Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
