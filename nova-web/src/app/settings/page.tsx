import { Badge, Button, Card, CardBody, CardHeader, Input } from '@/components/ui';

export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Profile</h2>
        </CardHeader>
        <CardBody className="grid gap-4 lg:grid-cols-2">
          <Input label="Display name" defaultValue="Akash" readOnly />
          <Input label="Email" defaultValue="operator@nova.ai" readOnly />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Preferences</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="flex min-h-touch items-center justify-between rounded-md border border-border px-3 py-2">
            <span className="text-sm">Theme</span>
            <Badge variant="warning">Dark</Badge>
          </div>
          <div className="flex min-h-touch items-center justify-between rounded-md border border-border px-3 py-2">
            <span className="text-sm">Notifications</span>
            <Button variant="ghost">On</Button>
          </div>
          <div className="flex min-h-touch items-center justify-between rounded-md border border-border px-3 py-2">
            <span className="text-sm">Compact mode</span>
            <Button variant="ghost">Off</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Danger Zone</h2>
        </CardHeader>
        <CardBody className="space-y-2">
          <Button variant="secondary" className="text-red-500">
            Clear all memories
          </Button>
          <p className="text-sm text-foreground/60">
            This will permanently delete all Abyss entries.
          </p>
        </CardBody>
      </Card>
    </section>
  );
}
