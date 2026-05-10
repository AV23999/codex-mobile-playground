'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Input } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? 'Unable to sign in.');
        return;
      }

      document.cookie = `nova-token=${payload.token}; path=/`;
      router.push('/');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4 py-6 text-foreground">
      <Card className="w-full max-w-lg">
        <CardBody className="space-y-5 p-6">
          <div className="space-y-1 text-center">
            <p className="text-2xl font-semibold">N.O.V.A</p>
            <p className="text-sm text-foreground/60">Neural Operative Virtual Assistant</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email"
              placeholder="operator@nova.ai"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              label="Password"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" variant="primary" disabled={loading} className="w-full">
              {loading ? 'Signing in\u2026' : 'Sign in'}
            </Button>
            {error ? (
              <p className="text-sm text-accent-abyssRed">{error}</p>
            ) : null}
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
