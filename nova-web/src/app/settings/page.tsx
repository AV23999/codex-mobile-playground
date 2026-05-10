'use client';

import { useState } from 'react';
import { Avatar, Badge, Button, Card, CardBody, CardHeader, Input } from '@/components/ui';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    product: true,
    reminders: false,
    security: true,
  });

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Profile</h2></CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar name="Nova Operator" size="lg" status="online" />
            <Badge variant="success">Active</Badge>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Input label="Name" value="Nova Operator" readOnly />
            <Input label="Email" value="operator@nova.ai" readOnly />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Appearance</h2></CardHeader>
        <CardBody className="flex items-center gap-3">
          <Button
            variant={darkMode ? 'primary' : 'secondary'}
            onClick={() => setDarkMode(true)}
          >
            Dark
          </Button>
          <Button
            variant={!darkMode ? 'primary' : 'secondary'}
            onClick={() => setDarkMode(false)}
          >
            Light
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Notifications</h2></CardHeader>
        <CardBody className="space-y-2">
          {([
            { key: 'product', label: 'Product updates' },
            { key: 'reminders', label: 'Task reminders' },
            { key: 'security', label: 'Security alerts' },
          ] as const).map(({ key, label }) => (
            <div
              key={key}
              className="flex min-h-touch items-center justify-between rounded-md border border-border px-3 py-2"
            >
              <span className="text-sm">{label}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
                }
              >
                {notifications[key] ? 'On' : 'Off'}
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Danger Zone</h2></CardHeader>
        <CardBody>
          <Button variant="danger">Delete Account</Button>
        </CardBody>
      </Card>
    </section>
  );
}
