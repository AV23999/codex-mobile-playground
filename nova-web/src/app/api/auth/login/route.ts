import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body?.email === 'string' ? body.email : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (email === 'operator@nova.ai' && password === 'nova2025') {
    return NextResponse.json({
      token: 'nova-session-token',
      user: {
        name: 'Nova Operator',
        email: 'operator@nova.ai',
      },
    });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
