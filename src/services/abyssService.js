// Abyss Mode — full screen blackout security
let abyssActive = false;
let abyssListeners = [];
let abyssPassword = null;

export function isAbyssActive() { return abyssActive; }

export function setAbyssPassword(password) { abyssPassword = password; }

export function onAbyssChange(listener) {
  abyssListeners.push(listener);
  return () => { abyssListeners = abyssListeners.filter(l => l !== listener); };
}

function notify() { abyssListeners.forEach(l => l(abyssActive)); }

export async function activateAbyss() {
  abyssActive = true;
  notify();
}

export async function deactivateAbyss(inputPassword = null) {
  if (!abyssPassword || inputPassword === abyssPassword) {
    abyssActive = false;
    notify();
    return { success: true };
  }
  return { success: false, reason: 'Incorrect password' };
}
