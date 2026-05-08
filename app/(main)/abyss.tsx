import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Animated, Easing, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { activateAbyss, deactivateAbyss, isAbyssActive, onAbyssChange, setAbyssPassword } from '../../src/services/abyssService';

export default function AbyssScreen() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [active, setActive] = useState(isAbyssActive());
  const [unlockInput, setUnlockInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [settingPw, setSettingPw] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => onAbyssChange(setActive), []);

  useEffect(() => {
    if (active) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 2000, easing: Easing.inOut(Easing.sine), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sine), useNativeDriver: true }),
      ])).start();
    } else { pulse.setValue(1); }
  }, [active]);

  const handleDeactivate = async () => {
    const res = await deactivateAbyss(unlockInput || undefined);
    if (!res.success) { Alert.alert('Unlock Failed', res.reason); setUnlockInput(''); }
  };

  const handleSetPassword = () => {
    if (passwordInput.length < 4) { Alert.alert('Too short', 'Minimum 4 characters.'); return; }
    setAbyssPassword(passwordInput);
    setPasswordInput('');
    setSettingPw(false);
    Alert.alert('Password Set ✓', 'Abyss will require this password or Face ID to unlock.');
  };

  if (active) {
    return (
      <View style={s.abyss}>
        <StatusBar hidden />
        <Animated.View style={[s.glow, { transform: [{ scale: pulse }] }]} />
        <View style={s.abyssInner}>
          <Ionicons name="eye-off" size={42} color="rgba(255,255,255,0.1)" />
          <Text style={s.abyssLabel}>ABYSS MODE</Text>
          <View style={s.unlockRow}>
            <TextInput
              style={s.unlockInput}
              value={unlockInput}
              onChangeText={setUnlockInput}
              placeholder="Password..."
              placeholderTextColor="rgba(255,255,255,0.18)"
              secureTextEntry
              autoFocus
            />
            <Pressable onPress={handleDeactivate} style={s.unlockBtn}>
              <Ionicons name="lock-open" size={20} color="#fff" />
            </Pressable>
          </View>
          <Text style={s.orText}>— or —</Text>
          <Pressable onPress={() => deactivateAbyss()} style={s.bioBtn}>
            <Ionicons name="finger-print" size={36} color="rgba(255,255,255,0.3)" />
            <Text style={s.bioText}>Face ID / Touch ID</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Abyss Mode</Text>
      <Text style={[s.sub, { color: c.mutedText }]}>{'Blank your screen instantly.\nUnlock with Face ID or password.'}</Text>

      <View style={[s.preview, { backgroundColor: '#05070f', borderColor: c.border }]}>
        <Ionicons name="eye-off" size={40} color="rgba(255,255,255,0.15)" />
        <Text style={{ color: 'rgba(255,255,255,0.15)', marginTop: 8, fontSize: 13 }}>Complete blackout</Text>
      </View>

      <View style={[s.infoCard, { backgroundColor: c.surface, borderColor: c.border }]}>
        {[
          ['eye-off', 'Hides all content instantly'],
          ['finger-print', 'Unlock with Face ID / Touch ID'],
          ['key', 'Fallback password unlock'],
          ['notifications-off', 'Suppresses notification previews'],
          ['shield-checkmark', 'Logged to security audit trail'],
        ].map(([icon, label]) => (
          <View key={label} style={s.infoRow}>
            <Ionicons name={icon as any} size={18} color={c.accent} />
            <Text style={[{ color: c.text, fontSize: 14 }]}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={[s.pwCard, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Pressable onPress={() => setSettingPw(!settingPw)} style={s.pwRow}>
          <Ionicons name="key" size={18} color={c.accent} />
          <Text style={[{ flex: 1, color: c.text, fontSize: 15, fontWeight: '500' }]}>Set Abyss Password</Text>
          <Ionicons name={settingPw ? 'chevron-up' : 'chevron-down'} size={16} color={c.mutedText} />
        </Pressable>
        {settingPw && (
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <TextInput
              style={[s.pwInput, { color: c.text, borderColor: c.border }]}
              value={passwordInput} onChangeText={setPasswordInput}
              placeholder="New password..." placeholderTextColor={c.mutedText}
              secureTextEntry
            />
            <Pressable onPress={handleSetPassword} style={[s.pwSetBtn, { backgroundColor: c.accent }]}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Set</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Pressable onPress={() => activateAbyss()} style={s.activateBtn}>
        <View style={StyleSheet.absoluteFillObject} />
        <Ionicons name="eye-off" size={22} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>Activate Abyss Mode</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  sub: { fontSize: 14, lineHeight: 20, marginTop: -8 },
  preview: { height: 140, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  infoCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pwCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
  pwRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pwInput: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15 },
  pwSetBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  activateBtn: { backgroundColor: '#05070f', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, marginBottom: 40 },
  // Abyss overlay
  abyss: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: '#4f8ef7', opacity: 0.04 },
  abyssInner: { alignItems: 'center', gap: 14, paddingHorizontal: 36 },
  abyssLabel: { color: 'rgba(255,255,255,0.12)', fontSize: 13, fontWeight: '700', letterSpacing: 5, marginTop: 8 },
  unlockRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 20 },
  unlockInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  unlockBtn: { backgroundColor: 'rgba(255,255,255,0.07)', padding: 14, borderRadius: 12 },
  orText: { color: 'rgba(255,255,255,0.1)', fontSize: 12, marginVertical: 4 },
  bioBtn: { alignItems: 'center', gap: 6, padding: 12 },
  bioText: { color: 'rgba(255,255,255,0.2)', fontSize: 12 },
});
