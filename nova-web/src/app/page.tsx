import { Badge, Card, CardBody } from '@/components/ui';
import { getMemories } from '@/lib/abyss-store';

export default function HomePage() {
  const memories = getMemories().length;
  const stats = [
    ['Memories', memories.toString(), '◈', 'warning'],
    ['Jarvis Sessions', '12', '◉', 'primary'],
    ['Chats', '5', '☰', 'default'],
    ['Uptime', '99.8%', '⚡', 'success'],
  ] as const;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, icon, variant]) => (
          <Card key={label} hoverable>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between"><span>{icon}</span><Badge variant={variant}>{label}</Badge></div>
              <p className="text-3xl font-semibold">{value}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
