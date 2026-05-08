import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import authService from '../../src/services/authService';
import { NovaColors } from '../../constants/theme';
import { isBiometricAvailable, getBiometricType } from '../../src/security/biometric';
import { createInvite } from '../../src/services/inviteService';
import { getAuditLog } from '../../src/security/securityAudit';
import { Share, Clipboard } from 'react-native';

export default function Settings() {
  const { user, setUser, themeMode, toggleTheme } = useAppContext();
  const c = NovaColors[themeMode];
  const [biometricLabel, setBiometricLabel] = useState('Biometric Lock');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [auditCount, setAuditCount] = useState(0);

  useEffect(() => {
    getBiometricType().then(t => setBiometricLabel(t + ' Lock'));
    setAuditCount(getAuditLog().length);
  }, []);

  const out = async () => {
    await authService.logout();
    setUser(null);
    router.replace('/auth/login');
  };

  const handleInvite = async () => {
    const code = createInvite(user?.username || 'user', 48);
    try {
      await Share.share({
        message: `Join Nova Chat! Code: ${code.code} | Link: ${code.link} | Expires 48h`,
      });
    } catch {
      Alert.alert('Your Invite Code', code.code, [
        { text: 'Copy', onPress: () => Clipboard?.setString?.(code.code) },
        { text: 'OK' },
      ]);
    }
  };

  return (
    <ScrollView style={[s.c, { backgroundColor: c.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={[s.title, { color: c.text }]}>Settings</Text>

      {/* Profile */}
      <View style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={[s.sectionLabel, { color: c.mutedText }]}>PROFILE</Text>
        <View style={[s.avatar, { backgroundColor: c.accent + '33' }]}>
          <Text style={[s.avatarText, { color: c.accent }]}>{(user?.username || 'G')[0].toUpperCase()}</Text>
        </View>
        <Text style={[s.big, { color: c.text }]}>{user?.username || 'Guest'}</Text>
        <Text style={[s.sub, { color: c.mutedText }]}>{user?.email || 'Not signed in'}</Text>
      </View>

      {/* Security */}
      <View style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={[s.sectionLabel, { color: c.mutedText }]}>SECURITY</Text>

        <View style={s.row}>
          <Ionicons name="shield-checkmark" size={20} color={c.accent} />
          <View style={s.rowText}>
            <Text style={[s.rowLabel, { color: c.text }]}>End-to-End Encryption</Text>
            <Text style={[s.rowSub, { color: c.mutedText }]}>AES-256-GCM + ECDH P-384</Text>
          </View>
          <View style={[s.badge, { backgroundColor: '#22c55e22' }]}>
            <Text style={{ color: '#22c55e', fontSize: 11, fontWeight: '700' }}>ON</Text>
          </View>
        </View>

        <View style={s.row}>
          <Ionicons name="finger-print" size={20} color={c.accent} />
          <View style={s.rowText}>
            <Text style={[s.rowLabel, { color: c.text }]}>{biometricLabel}</Text>
            <Text style={[s.rowSub, { color: c.mutedText }]}>Require biometric to open app</Text>
          </View>
          <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} />
        </View>

        <View style={s.row}>
          <Ionicons name="key" size={20} color={c.accent} />
          <View style={s.rowText}>
            <Text style={[s.rowLabel, { color: c.text }]}>Perfect Forward Secrecy</Text>
            <Text style={[s.rowSub, { color: c.mutedText }]}>New keys per session</Text>
          </View>
          <View style={[s.badge, { backgroundColor: '#22c55e22' }]}>
            <Text style={{ color: '#22c55e', fontSize: 11, fontWeight: '700' }}>ON</Text>
          </View>
        </View>

        <Pressable style={s.row} onPress={() => Alert.alert('Audit Log', `${auditCount} security events logged.`)}>
          <Ionicons name="document-text" size={20} color={c.accent} />
          <View style={s.rowText}>
            <Text style={[s.rowLabel, { color: c.text }]}>Security Audit Log</Text>
            <Text style={[s.rowSub, { color: c.mutedText }]}>{auditCount} events recorded</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={c.mutedText} />
        </Pressable>
      </View>

      {/* Payments */}
      <View style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={[s.sectionLabel, { color: c.mutedText }]}>NOVA PAY</Text>

        <View style={s.row}>
          <Ionicons name="card" size={20} color={c.accent} />
          <View style={s.rowText}>
            <Text style={[s.rowLabel, { color: c.text }]}>Payment Security</Text>
            <Text style={[s.rowSub, { color: c.mutedText }]}>PCI-DSS compliant · HMAC-signed</Text>
          </View>
          <View style={[s.badge, { backgroundColor: '#22c55e22' }]}>
            <Text style={{ color: '#22c55e', fontSize: 11, fontWeight: '700' }}>ON</Text>
          </View>
        </View>

        <View style={s.row}>
          <Ionicons name="lock-closed" size={20} color={c.accent} />
          <View style={s.rowText}>
            <Text style={[s.rowLabel, { color: c.text }]}>Biometric Payment Auth</Text>
            <Text style={[s.rowSub, { color: c.mutedText }]}>Required for every transaction</Text>
          </View>
          <View style={[s.badge, { backgroundColor: '#22c55e22' }]}>
            <Text style={{ color: '#22c55e', fontSize: 11, fontWeight: '700' }}>ON</Text>
          </View>
        </View>

        <View style={s.row}>
          <Ionicons name="shield" size={20} color={c.accent} />
          <View style={s.rowText}>
            <Text style={[s.rowLabel, { color: c.text }]}>Rate Limiting</Text>
            <Text style={[s.rowSub, { color: c.mutedText }]}>5 attempts / 60s before lockout</Text>
          </View>
          <View style={[s.badge, { backgroundColor: '#22c55e22' }]}>
            <Text style={{ color: '#22c55e', fontSize: 11, fontWeight: '700' }}>ON</Text>
          </View>
        </View>
      </View>

      {/* Invite */}
      <View style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={[s.sectionLabel, { color: c.mutedText }]}>INVITE PEOPLE</Text>
        <Pressable onPress={handleInvite} style={[s.inviteBtn, { backgroundColor: c.accent }]}>
          <Ionicons name="person-add" size={18} color="#fff" />
          <Text style={s.inviteBtnText}>Generate Invite Link</Text>
        </Pressable>
        <Text style={[s.rowSub, { color: c.mutedText, textAlign: 'center', marginTop: 8 }]}>Single-use · 48h expiry · Cryptographically signed</Text>
      </View>

      {/* Appearance */}
      <View style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={[s.sectionLabel, { color: c.mutedText }]}>APPEARANCE</Text>
        <View style={s.row}>
          <Ionicons name={themeMode === 'light' ? 'sunny' : 'moon'} size={20} color={c.accent} />
          <View style={s.rowText}>
            <Text style={[s.rowLabel, { color: c.text }]}>Light Mode</Text>
          </View>
          <Switch value={themeMode === 'light'} onValueChange={toggleTheme} />
        </View>
      </View>

      {/* Logout */}
      <Pressable onPress={out} style={[s.logout, { backgroundColor: c.danger }]}>
        <Ionicons name="log-out" size={18} color="#fff" />
        <Text style={s.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', paddingHorizontal: 20, marginBottom: 16 },
  card: { marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 14, borderWidth: 1, gap: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  avatarText: { fontSize: 24, fontWeight: '700' },
  big: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  sub: { fontSize: 14, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '500' },
  rowSub: { fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  inviteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12 },
  inviteBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  logout: { marginHorizontal: 16, marginTop: 4, padding: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  logoutText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
