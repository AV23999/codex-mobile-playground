import { Button, Card, CardBody } from '@/components/ui';

export default function MediaPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-xl"><CardBody className="space-y-3 text-center"><div className="mx-auto h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.12),transparent_70%)]" /><p className="-mt-16 text-4xl text-[color:var(--nova-text-faint)]">▣</p><h2 className="text-display text-xl">No media yet</h2><p className="mx-auto max-w-[40ch] text-sm text-[color:var(--nova-text-secondary)]">Upload images, audio, or documents to build your media library.</p><Button variant="secondary">Upload file</Button></CardBody></Card>
    </section>
  );
}
