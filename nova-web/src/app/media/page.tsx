import { Button, Card, CardBody } from '@/components/ui';

export default function MediaPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <Card>
        <CardBody className="flex flex-col items-center space-y-3 px-10 py-12 text-center">
          <p className="text-5xl text-foreground/20">\u25a3</p>
          <h2 className="text-xl font-semibold">No media yet</h2>
          <p className="max-w-xs text-sm text-foreground/60">
            Upload images, audio, or documents to build your media library.
          </p>
          <Button variant="primary" disabled>
            Upload file
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}
