import { generateInviteCode } from '../security/crypto';
import { logSecurityEvent } from '../security/securityAudit';

// In production: store invites in your backend with expiry + single-use enforcement
const invites = {};

export function createInvite(createdBy, expiresInHours = 48) {
  const code = generateInviteCode();
  const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;
  invites[code] = { createdBy, expiresAt, used: false, usedBy: null };
  logSecurityEvent(createdBy, 'INVITE_GENERATED', { code, expiresAt });
  return { code, expiresAt, link: `novachat://invite/${code}` };
}

export function redeemInvite(code, redeemedBy) {
  const invite = invites[code];
  if (!invite) return { success: false, reason: 'Invalid invite code' };
  if (invite.used) return { success: false, reason: 'Invite already used' };
  if (Date.now() > invite.expiresAt) return { success: false, reason: 'Invite expired' };
  invite.used = true;
  invite.usedBy = redeemedBy;
  logSecurityEvent(redeemedBy, 'INVITE_REDEEMED', { code, createdBy: invite.createdBy });
  return { success: true };
}

export function getInviteStatus(code) {
  return invites[code] || null;
}
