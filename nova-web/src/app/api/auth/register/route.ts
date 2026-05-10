import { NextResponse } from 'next/server';
import { findUser, createUser } from '@/lib/user-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }
    if (findUser(email)) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const user = createUser(name, email, password);
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, name: user.name })).toString('base64');

    const response = NextResponse.json({ ok: true, user: { name: user.name, email: user.email } });
    response.cookies.set('nova-session', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
