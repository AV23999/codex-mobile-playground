import { Button, Card, CardBody } from '@/components/ui';

export default function MediaPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-sm w-full">
        <CardBody className="space-y-4 p-10 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl"
            style={{
              background: 'rgba(0,212,255,0.05)',
              border: '1px solid rgba(0,212,255,0.15)',
              color: 'var(--accent-cyan)',
              opacity: 0.5,
            }}
          >
            ▣
          </div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>No media yet</h2>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Upload images, audio, or documents to build your media library.
          </p>
          <Button variant="secondary">Upload file</Button>
        </CardBody>
      </Card>
    </section>
  );
}
