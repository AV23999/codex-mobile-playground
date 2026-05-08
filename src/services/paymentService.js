import { generatePaymentToken, verifyPaymentToken, signMessage } from '../security/crypto';
import { logSecurityEvent } from '../security/securityAudit';
import { authenticatePayment } from '../security/biometric';

// Payment methods supported
export const PAYMENT_METHODS = [
  {
    id: 'nova_pay',
    name: 'Nova Pay',
    icon: 'wallet',
    description: 'Instant · Free · E2E encrypted',
    color: '#6C63FF',
    badge: 'INSTANT',
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: 'phone-portrait',
    description: 'India · NPCI · Zero fees',
    color: '#00A86B',
    badge: '₹ INDIA',
  },
  {
    id: 'crypto',
    name: 'Crypto',
    icon: 'logo-bitcoin',
    description: 'BTC · ETH · USDT · On-chain',
    color: '#F7931A',
    badge: 'ON-CHAIN',
  },
];

export async function initiatePayment(sender, recipient, amount, currency = 'USD', method = 'nova_pay') {
  logSecurityEvent(sender, 'PAYMENT_INITIATED', { recipient, amount, currency, method });

  const authorized = await authenticatePayment(amount, currency);
  if (!authorized) {
    logSecurityEvent(sender, 'PAYMENT_AUTH_FAILED', { recipient, amount });
    return { success: false, reason: 'Biometric authorization failed' };
  }

  const token = generatePaymentToken();
  const hmacKey = `${sender}:${recipient}:${amount}:${Date.now()}`;
  const signature = await signMessage(token, hmacKey);

  logSecurityEvent(sender, 'PAYMENT_AUTHORIZED', { recipient, amount, currency, method, token: token.slice(0, 8) + '...' });

  const methodMeta = {
    nova_pay: { label: 'Nova Pay', symbol: '$', network: 'Nova Network' },
    upi:      { label: 'UPI',      symbol: '₹', network: 'NPCI / UPI Rail' },
    crypto:   { label: 'Crypto',   symbol: '₿', network: 'On-Chain' },
  }[method] || { label: method, symbol: '$', network: 'Unknown' };

  return {
    success: true,
    token,
    signature,
    method,
    methodMeta,
    transaction: {
      id: token.slice(0, 16),
      sender,
      recipient,
      amount,
      currency,
      method,
      timestamp: new Date().toISOString(),
      status: 'PENDING_SETTLEMENT',
    },
  };
}

export async function verifyTransaction(token, sender, recipient, amount) {
  const hmacKey = `${sender}:${recipient}:${amount}`;
  const sig = await verifyPaymentToken(token, hmacKey);
  return !!sig;
}
