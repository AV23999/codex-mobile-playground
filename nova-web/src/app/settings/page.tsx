import { Badge, Button, Card, CardBody, CardHeader, Input } from '@/components/ui';

export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <Card><CardHeader><h2 className="text-display">Profile</h2></CardHeader><CardBody className="grid gap-4 lg:grid-cols-2"><Input label="Display name" value="Akash" readOnly /><Input label="Email" value="operator@nova.ai" readOnly /></CardBody></Card>
      <Card><CardHeader><h2 className="text-display">Preferences</h2></CardHeader><CardBody className="space-y-3"><div className="flex justify-between"><span>Theme</span><Badge variant="warning">Dark</Badge></div><div className="flex justify-between"><span>Notifications</span><Button variant="ghost">On</Button></div><div className="flex justify-between"><span>Compact mode</span><Button variant="ghost">Off</Button></div></CardBody></Card>
      <Card><CardHeader><h2 className="text-display">Danger Zone</h2></CardHeader><CardBody><Button variant="danger">Clear all memories</Button><p className="mt-2 text-sm text-[color:var(--nova-text-secondary)]">This will permanently delete all Abyss entries.</p></CardBody></Card>
    </section>
  );
}
