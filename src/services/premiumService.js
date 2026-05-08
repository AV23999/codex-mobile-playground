// Nova Premium — one-time payment service
const PREMIUM_TIERS = {
  nova_plus: {
    id: 'nova_plus',
    name: 'Nova Plus',
    price: 9.99,
    color: '#4f8ef7',
    badge: '⚡',
    features: [
      'Abyss Mode (screen blackout)',
      'YouTube & Spotify Connect',
      'Custom chat themes',
      'Message scheduling',
      'Priority encryption (AES-256)',
      'Read receipts + typing indicators',
      'Unlimited message history',
      'Ad-free forever',
    ],
  },
  nova_elite: {
    id: 'nova_elite',
    name: 'Nova Elite',
    price: 19.99,
    color: '#a855f7',
    badge: '👑',
    features: [
      'Everything in Nova Plus',
      'Sync Watch (TV shows & movies)',
      'Share Broadcasting',
      'Biometric vault for files',
      'Multi-device encrypted backup',
      'Ghost Mode (invisible online)',
      'Burn-after-read messages',
      'AI chat assistant',
      'Priority support 24/7',
    ],
  },
};

let purchasedTier = null;

export function getPremiumTiers() {
  return Object.values(PREMIUM_TIERS);
}

export function getPurchasedTier() {
  return purchasedTier;
}

export function isPremium() {
  return purchasedTier !== null;
}

export function hasFeature(feature) {
  if (!purchasedTier) return false;
  return PREMIUM_TIERS[purchasedTier]?.features?.some(f =>
    f.toLowerCase().includes(feature.toLowerCase())
  );
}

export async function purchaseTier(tierId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      purchasedTier = tierId;
      resolve({ success: true, tier: PREMIUM_TIERS[tierId] });
    }, 1500);
  });
}
