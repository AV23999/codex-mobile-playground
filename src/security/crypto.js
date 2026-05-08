// Simple reversible XOR-based encrypt/decrypt compatible with React Native
const KEY_DEFAULT = 'nova_secret_key';

export function encryptMessage(text, key = KEY_DEFAULT) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return Buffer.from(result, 'binary').toString('base64');
}

export function decryptMessage(cipher, key = KEY_DEFAULT) {
  const decoded = Buffer.from(cipher, 'base64').toString('binary');
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(
      decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
}
