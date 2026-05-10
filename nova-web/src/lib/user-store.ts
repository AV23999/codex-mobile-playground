// In-memory user store (persists for the lifetime of the server process)
// Replace with a real DB (Prisma, Supabase, etc.) when ready

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// Seed one default operator so the app works immediately
const users = new Map<string, StoredUser>([
  [
    'operator@nova.ai',
    {
      id: 'u_operator',
      name: 'Akash',
      email: 'operator@nova.ai',
      // plain comparison — swap for bcrypt in production
      passwordHash: 'nova2025',
    },
  ],
]);

export function findUser(email: string): StoredUser | undefined {
  return users.get(email.toLowerCase().trim());
}

export function createUser(name: string, email: string, password: string): StoredUser {
  const user: StoredUser = {
    id: `u_${Date.now()}`,
    name,
    email: email.toLowerCase().trim(),
    passwordHash: password,
  };
  users.set(user.email, user);
  return user;
}

export function verifyUser(email: string, password: string): StoredUser | null {
  const user = findUser(email);
  if (!user) return null;
  if (user.passwordHash !== password) return null;
  return user;
}
