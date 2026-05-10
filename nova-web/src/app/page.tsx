import { Avatar, Badge, Button, Card, CardBody, CardFooter, CardHeader, Input, Tooltip } from '@/components/ui';

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold">N.O.V.A UI Showcase</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Buttons + Tooltip */}
        <Card className="bg-background" hoverable>
          <CardHeader><h3 className="text-lg font-semibold">Buttons + Tooltip</h3></CardHeader>
          <CardBody className="flex flex-wrap items-center gap-3">
            <Button variant="primary" iconLeft={<span>✦</span>}>Launch</Button>
            <Button variant="secondary" iconRight={<span>→</span>}>Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Tooltip content="Danger action" position="top">
              <Button variant="danger" loading>Deleting</Button>
            </Tooltip>
          </CardBody>
          <CardFooter>
            <Button variant="ghost" size="sm">Small ghost</Button>
            <Button variant="primary" size="lg">Large primary</Button>
          </CardFooter>
        </Card>

        {/* Badges */}
        <Card className="bg-background" hoverable>
          <CardHeader><h3 className="text-lg font-semibold">Badges</h3></CardHeader>
          <CardBody className="flex flex-wrap items-center gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Nova</Badge>
            <Badge variant="success">Online</Badge>
            <Badge variant="warning">Away</Badge>
            <Badge variant="danger">Offline</Badge>
          </CardBody>
        </Card>

        {/* Input */}
        <Card className="bg-background" hoverable>
          <CardHeader><h3 className="text-lg font-semibold">Input</h3></CardHeader>
          <CardBody className="space-y-4">
            <Input label="Username" placeholder="nova_user" helperText="Your N.O.V.A display name" />
            <Input label="API Key" placeholder="Enter key..." error="Invalid key format" />
          </CardBody>
        </Card>

        {/* Avatars */}
        <Card className="bg-background" hoverable>
          <CardHeader><h3 className="text-lg font-semibold">Avatars</h3></CardHeader>
          <CardBody className="flex flex-wrap items-center gap-4">
            <Avatar name="Nova Agent" size="sm" status="online" />
            <Avatar name="Abyss Core" size="md" status="away" />
            <Avatar name="System Root" size="lg" status="offline" />
            <Avatar src="https://i.pravatar.cc/150?img=12" name="Jarvis" size="md" status="online" />
          </CardBody>
        </Card>
      </div>

      {/* Tooltip demo row */}
      <Card className="bg-background">
        <CardHeader><h3 className="text-lg font-semibold">Tooltip Positions</h3></CardHeader>
        <CardBody className="flex flex-wrap items-center justify-center gap-8 py-8">
          <Tooltip content="Top tooltip" position="top"><Badge>Hover top</Badge></Tooltip>
          <Tooltip content="Bottom tooltip" position="bottom"><Badge>Hover bottom</Badge></Tooltip>
          <Tooltip content="Left tooltip" position="left"><Badge>Hover left</Badge></Tooltip>
          <Tooltip content="Right tooltip" position="right"><Badge>Hover right</Badge></Tooltip>
        </CardBody>
      </Card>
    </section>
  );
}
