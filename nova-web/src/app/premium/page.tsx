import { Badge, Button, Card, CardBody, CardHeader } from '@/components/ui';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    features: ['Basic chat access', 'Limited memories', 'Community support'],
  },
  {
    name: 'Pro',
    price: '$19',
    features: ['Priority model routing', 'Expanded memory panel', 'Advanced settings'],
  },
  {
    name: 'Abyss Unlocked',
    price: '$49',
    features: ['Deep memory indexing', 'Extended context limits', 'Premium persona controls'],
  },
];

export default function PremiumPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Premium Tiers</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{tier.name}</h3>
                {tier.name === 'Pro' ? (
                  <Badge variant="primary">Popular</Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <p className="text-2xl font-semibold">
                {tier.price}
                <span className="text-sm font-normal text-foreground/60">/mo</span>
              </p>
              <ul className="space-y-1 text-sm text-foreground/80">
                {tier.features.map((feature) => (
                  <li key={feature}>\u2022 {feature}</li>
                ))}
              </ul>
            </CardBody>
            <div className="px-4 pb-4">
              <Button variant={tier.name === 'Free' ? 'secondary' : 'primary'}>
                {tier.name === 'Free' ? 'Current Plan' : 'Upgrade'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
