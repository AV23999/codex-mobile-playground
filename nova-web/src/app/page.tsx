import { Card, CardBody } from '@/components/ui';
import { getMemories } from '@/lib/abyss-store';

const activities = [
  "09:10 \u2014 Memory 'Migration Blueprint' added",
  '08:55 \u2014 Jarvis session started',
  '08:32 \u2014 User preference snapshot saved',
  'Yesterday \u2014 Risk register updated',
  'Mon \u2014 Competitive notes added',
];

export default function HomePage() {
  const memoryCount = getMemories().length;

  const stats = [
    { label: 'Memories', value: memoryCount.toString(), icon: '\u25c8' },
    { label: 'Jarvis Sessions', value: '12', icon: '\u25c9' },
    { label: 'Chats', value: '5', icon: '\u2630' },
    { label: 'Uptime', value: '99.8%', icon: '\u26a1' },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardBody className="space-y-2">
              <p className="text-2xl text-foreground/30">{stat.icon}</p>
              <p className="text-3xl font-semibold">{stat.value}</p>
              <p className="text-sm text-foreground/60">{stat.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody className="space-y-3">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          {activities.map((item) => (
            <p
              key={item}
              className="border-l-2 border-accent-abyssPurple pl-3 text-sm text-foreground/70"
            >
              {item}
            </p>
          ))}
        </CardBody>
      </Card>
    </section>
  );
}
