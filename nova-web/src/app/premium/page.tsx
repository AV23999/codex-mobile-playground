import { Badge, Button, Card, CardBody, CardHeader } from '@/components/ui';

const freeFeatures = ['Jarvis (demo mode)', 'Abyss \u2014 50 memories', 'Basic chat history'];
const proFeatures = [
  'Jarvis (GPT-4o powered)',
  'Unlimited memories',
  'Full chat history',
  'Media library',
  'Priority support',
];

export default function PremiumPage() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Free</h2>
            <Badge>Current plan</Badge>
          </div>
        </CardHeader>
        <CardBody className="space-y-3">
          <ul className="space-y-1 text-sm text-foreground/70">
            {freeFeatures.map((f) => (
              <li key={f}>\u2022 {f}</li>
            ))}
          </ul>
          <Button variant="secondary" disabled>
            Your current plan
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">N.O.V.A Pro</h2>
            <Badge variant="warning">Upgrade</Badge>
          </div>
        </CardHeader>
        <CardBody className="space-y-3">
          <ul className="space-y-1 text-sm text-foreground/70">
            {proFeatures.map((f) => (
              <li key={f}>\u2022 {f}</li>
            ))}
          </ul>
          <Button variant="primary" disabled>
            Upgrade to Pro
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}
