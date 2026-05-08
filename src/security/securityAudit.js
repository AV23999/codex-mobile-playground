// Security audit log — all sensitive actions are logged with timestamp + actor
// In production: ship to a tamper-evident SIEM (e.g., Datadog, Splunk)

const auditLog = [];

export function logSecurityEvent(actor, action, metadata = {}) {
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    timestamp: new Date().toISOString(),
    actor,
    action,
    metadata,
    severity: getSeverity(action),
  };
  auditLog.push(entry);
  if (__DEV__) {
    console.log('[SECURITY AUDIT]', entry);
  }
  return entry;
}

function getSeverity(action) {
  const critical = ['PAYMENT_INITIATED', 'PAYMENT_AUTHORIZED', 'PAYMENT_FAILED', 'AUTH_FAILED', 'BIOMETRIC_FAILED', 'INVITE_GENERATED', 'KEY_EXCHANGE'];
  const high = ['LOGIN', 'LOGOUT', 'REGISTER', 'PASSWORD_CHANGE', 'BIOMETRIC_SUCCESS'];
  if (critical.includes(action)) return 'CRITICAL';
  if (high.includes(action)) return 'HIGH';
  return 'INFO';
}

export function getAuditLog() {
  return [...auditLog];
}

export function clearAuditLog() {
  auditLog.length = 0;
}

// Rate limiter — prevent brute force (e.g., login, payment)
const rateLimits = {};
export function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  if (!rateLimits[key]) rateLimits[key] = { count: 0, resetAt: now + windowMs };
  if (now > rateLimits[key].resetAt) {
    rateLimits[key] = { count: 0, resetAt: now + windowMs };
  }
  rateLimits[key].count++;
  if (rateLimits[key].count > maxAttempts) {
    logSecurityEvent('SYSTEM', 'RATE_LIMIT_EXCEEDED', { key });
    return false;
  }
  return true;
}
