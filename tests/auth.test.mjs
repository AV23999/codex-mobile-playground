import test from 'node:test';
import assert from 'node:assert/strict';
import authService from '../src/services/authService.js';

test('register and login', async () => {
  const user = await authService.register({ username: 'akash', email: 'akash@test.com', password: 'password123' });
  assert.equal(user.username, 'akash');

  const loggedIn = await authService.login({ emailOrUsername: 'akash@test.com', password: 'password123' });
  assert.equal(loggedIn.email, 'akash@test.com');

  await authService.logout();
  assert.equal(authService.getCurrentUser(), null);
});
