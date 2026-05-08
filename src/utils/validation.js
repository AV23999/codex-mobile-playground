export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

export function validateUsername(username) {
  return typeof username === 'string' && username.trim().length >= 3;
}
