import { Card, CardBody } from '@/components/ui';
import { getMemories } from '@/lib/abyss-store';

const activities = [
  { time: '09:10', text: "Memory 'Migration Blueprint' added", dot: 'var(--accent-cyan)' },
  { time: '08:55', text: 'Jarvis session started', dot: 'var(--accent-purple)' },
  { time: '08:32', text: 'User preference snapshot saved', dot: 'var(--accent-cyan)' },
  { time: 'Yesterday', text: 'Risk register updated', dot: 'var(--accent-magenta)' },
  { time: 'Mon', text: 'Competitive notes added', dot: 'var(--accent-gold)' },
];

export default function HomePage() {
  const memoryCount = getMemories().length;

  const stats = [
    { label: 'Memories', value: memoryCount.toString(), icon: '◈', accent: 'var(--accent-purple)' },
    { label: 'Jarvis Sessions', value: '12', icon: '◉', accent: 'var(--accent-cyan)' },
    { label: 'Chats', value: '5', icon: '☰', accent: 'var(--accent-cyan)' },
    { label: 'Uptime', value: '99.8%', icon: '⚡', accent: 'var(--accent-gold)' },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} hoverable>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg" style={{ color: stat.accent, filter: `drop-shadow(0 0 6px ${stat.accent})` }}>
                  {stat.icon}
                </span>
                <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--color-muted)', opacity: 0.5 }}>
                  {stat.label}
                </span>
              </div>
              <p
                className="text-3xl font-bold"
                style={{ color: stat.accent, fontFamily: 'monospace', filter: `drop-shadow(0 0 8px ${stat.accent}40)` }}
              >
                {stat.value}
              </p>
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${stat.accent}30, transparent)` }} />
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody className="space-y-1 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-muted)', opacity: 0.7 }}>
            Recent Activity
          </h2>
          {activities.map((item) => (
            <div
              key={item.text}
              className="flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.02]"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: item.dot, boxShadow: `0 0 6px ${item.dot}` }}
              />
              <span className="text-[11px] shrink-0" style={{ color: 'var(--color-muted)', opacity: 0.5, fontFamily: 'monospace' }}>
                {item.time}
              </span>
              <span className="text-sm" style={{ color: 'var(--color-muted)' }}>{item.text}</span>
            </div>
          ))}
        </CardBody>
      </Card>
    </section>
  );
}
