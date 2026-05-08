import test from 'node:test';
import assert from 'node:assert/strict';
import { encryptMessage, decryptMessage } from '../src/security/crypto.js';

const key = 'testkey';

test('encrypt/decrypt roundtrip', () => {
  const plainText = 'hi';
  const encrypted = encryptMessage(plainText, key);
  const decrypted = decryptMessage(encrypted, key);
  assert.equal(decrypted, plainText);
});
