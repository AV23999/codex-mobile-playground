import { Badge, Card, CardBody, CardHeader } from '@/components/ui';

const mediaItems = [
  { id: 'm1', title: 'Sprint Demo Recording', type: 'Video' },
  { id: 'm2', title: 'UI Inspiration Board', type: 'Image' },
  { id: 'm3', title: 'Architecture Review', type: 'Document' },
  { id: 'm4', title: 'Launch Trailer Draft', type: 'Video' },
  { id: 'm5', title: 'Brand Asset Pack', type: 'Archive' },
  { id: 'm6', title: 'Voice Prompt Samples', type: 'Audio' },
];

export default function MediaPage() {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Media Library</h2>
        </CardHeader>
        <CardBody className="grid gap-3 lg:grid-cols-3">
          {mediaItems.map((item) => (
            <article
              key={item.id}
              className="space-y-2 rounded-md border border-border bg-background p-3"
            >
              <div className="flex min-h-touch items-center justify-between">
                <h3 className="text-sm font-medium">{item.title}</h3>
                <Badge>{item.type}</Badge>
              </div>
              <p className="text-xs text-foreground/50">Placeholder media preview and metadata.</p>
            </article>
          ))}
        </CardBody>
      </Card>
    </section>
  );
}
