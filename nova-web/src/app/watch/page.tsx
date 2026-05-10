import { Button, Card, CardBody } from '@/components/ui';

export default function WatchPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-sm w-full">
        <CardBody className="space-y-4 p-10 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl"
            style={{
              background: 'rgba(124,58,237,0.05)',
              border: '1px solid rgba(124,58,237,0.15)',
              color: 'var(--accent-purple)',
              opacity: 0.5,
            }}
          >
            ▶
          </div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Nothing queued</h2>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Add videos or streams to your watch list.
          </p>
          <Button variant="secondary">Browse content</Button>
        </CardBody>
      </Card>
    </section>
  );
}
