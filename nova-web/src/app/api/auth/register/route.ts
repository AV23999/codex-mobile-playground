import { NextResponse } from 'next/server';

// In-memory store — resets on cold start. Replace with DB for persistence.
const registeredUsers: Array<{ id: string; name: string; email: string; password: string }> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').toLowerCase().trim();
    const password = String(body?.password ?? '');

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const existing =
      email === 'operator@nova.ai' ||
      registeredUsers.some((u) => u.email === email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const user = { id: `u_${Date.now()}`, name, email, password };
    registeredUsers.push(user);

    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');

    const res = NextResponse.json({ ok: true, user: { name: user.name, email: user.email } });
    res.cookies.set('nova-session', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
