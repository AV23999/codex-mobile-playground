import { NextResponse } from 'next/server';

// Hardcoded credentials — swap for DB lookup when ready
const USERS = [
  { id: 'u1', name: 'Akash', email: 'operator@nova.ai', password: 'nova2025' },
];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email ?? '').toLowerCase().trim();
    const password = String(body?.password ?? '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = USERS.find((u) => u.email === email && u.password === password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

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
