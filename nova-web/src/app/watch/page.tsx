import { Button, Card, CardBody } from '@/components/ui';

export default function WatchPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <Card>
        <CardBody className="flex flex-col items-center space-y-3 px-10 py-12 text-center">
          <p className="text-5xl text-foreground/20">\u25b6</p>
          <h2 className="text-xl font-semibold">Nothing queued</h2>
          <p className="max-w-xs text-sm text-foreground/60">
            Add videos or streams to your watch list.
          </p>
          <Button variant="primary" disabled>
            Browse content
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}
