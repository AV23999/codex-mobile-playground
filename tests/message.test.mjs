import test from 'node:test';
import assert from 'node:assert/strict';
import chatService from '../src/services/chatService.js';

test('message send increments counter', async () => {
  const calls = [];
  const api = { post: async (path, body) => { calls.push({ path, body }); return { sent: true }; } };

  const svc = new chatService.constructor();
  const msg = await chatService.sendMessage('c1', 'hello');
  assert.equal(msg.sent, true);

  await chatService.sendMessage('c1', 'again');
  const msgs = await chatService.getMessages('c1');
  assert.ok(msgs.length >= 2);
});
