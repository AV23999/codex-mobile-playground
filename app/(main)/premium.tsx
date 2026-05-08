import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { getPremiumTiers, purchaseTier, getPurchasedTier } from '../../src/services/premiumService';

export default function Premium() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [loading, setLoading] = useState<string | null>(null);
  const [owned, setOwned] = useState<string | null>(getPurchasedTier());
  const tiers = getPremiumTiers();

  const handlePurchase = async (tierId: string, price: number, name: string) => {
    Alert.alert(
      'Confirm Purchase',
      `One-time payment of $${price}\nYours forever — no subscription.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Pay $${price}`,
          onPress: async () => {
            setLoading(tierId);
            const result = await purchaseTier(tierId);
            setLoading(null);
            if (result.success) {
              setOwned(tierId);
              Alert.alert('🎉 Welcome to ' + name + '!', 'All features unlocked forever.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[s.root, { backgroundColor: c.background }]} contentContainerStyle={{ paddingBottom: 80 }}>
      {/* Hero */}
      <View style={[s.hero, { backgroundColor: c.surface }]}>
        <Text style={s.heroStar}>✦</Text>
        <Text style={[s.heroTitle, { color: c.text }]}>Nova Premium</Text>
        <Text style={[s.heroSub, { color: c.mutedText }]}>{'Pay once. Own it forever.\nNo subscriptions. No renewals.'}</Text>
        <View style={[s.heroPill, { borderColor: c.accent + '50', backgroundColor: c.accent + '12' }]}>
          <Ionicons name="shield-checkmark" size={12} color={c.accent} />
          <Text style={[s.heroPillText, { color: c.accent }]}>Military-grade security in every plan</Text>
        </View>
      </View>

      {tiers.map((tier: any) => {
        const isOwned = owned === tier.id;
        const isElite = tier.id === 'nova_elite';
        return (
          <View key={tier.id} style={[
            s.card,
            { backgroundColor: c.surface, borderColor: isElite ? tier.color + '80' : c.border },
            isElite && { borderWidth: 2 },
          ]}>
            {isElite && (
              <View style={[s.topBadge, { backgroundColor: tier.color }]}>
                <Text style={s.topBadgeText}>MOST POPULAR</Text>
              </View>
            )}
            <View style={s.cardTop}>
              <View style={[s.iconBox, { backgroundColor: tier.color + '20' }]}>
                <Text style={{ fontSize: 26 }}>{tier.badge}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.tierName, { color: c.text }]}>{tier.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                  <Text style={[s.price, { color: tier.color }]}>${tier.price}</Text>
                  <Text style={[{ color: c.mutedText, fontSize: 13 }]}> one-time</Text>
                </View>
              </View>
              {isOwned && (
                <View style={[s.ownedPill, { backgroundColor: '#22c55e20', borderColor: '#22c55e' }]}>
                  <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                  <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: '700' }}>Owned</Text>
                </View>
              )}
            </View>

            <View style={s.features}>
              {tier.features.map((f: string, i: number) => (
                <View key={i} style={s.featureRow}>
                  <View style={[s.dot, { backgroundColor: tier.color }]} />
                  <Text style={[s.featureText, { color: c.text }]}>{f}</Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={() => isOwned ? null : handlePurchase(tier.id, tier.price, tier.name)}
              disabled={!!loading || isOwned}
              style={[s.cta, { backgroundColor: isOwned ? '#22c55e' : tier.color }]}
            >
              {loading === tier.id ? (
                <ActivityIndicator color="#fff" />
              ) : isOwned ? (
                <><Ionicons name="checkmark-circle" size={18} color="#fff" /><Text style={s.ctaText}>Activated</Text></>
              ) : (
                <><Ionicons name="card" size={18} color="#fff" /><Text style={s.ctaText}>Get {tier.name} — ${tier.price}</Text></>
              )}
            </Pressable>
          </View>
        );
      })}

      <View style={s.trust}>
        {['🔒 Secure Payment', '♾️ Lifetime Access', '↩️ 30-day Refund'].map(t => (
          <View key={t} style={[s.trustPill, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[{ color: c.mutedText, fontSize: 12 }]}>{t}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  hero: { alignItems: 'center', paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20, gap: 8, marginBottom: 8 },
  heroStar: { fontSize: 36, color: '#a855f7' },
  heroTitle: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  heroSub: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  heroPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1, marginTop: 4 },
  heroPillText: { fontSize: 12, fontWeight: '600' },
  card: { marginHorizontal: 16, marginBottom: 16, padding: 20, borderRadius: 20, borderWidth: 1.5, gap: 16 },
  topBadge: { position: 'absolute', top: -11, alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 3, borderRadius: 99 },
  topBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tierName: { fontSize: 20, fontWeight: '700' },
  price: { fontSize: 28, fontWeight: '800' },
  ownedPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99, borderWidth: 1 },
  features: { gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  featureText: { fontSize: 14, flex: 1 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14 },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  trust: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, justifyContent: 'center', marginTop: 4 },
  trustPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1 },
});
