import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '../src/context/AppContext';
import { NovaColors } from '../constants/theme';
import NovaLogo from '../components/NovaLogo';

export default function Welcome() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.center}>
        <NovaLogo size={80} />
        <Text style={[s.title, { color: c.text }]}>Nova Chat</Text>
        <Text style={[s.sub, { color: c.mutedText }]}>Private. Encrypted. Yours.</Text>
      </View>
      <Pressable
        style={[s.btn, { backgroundColor: c.accent }]}
        onPress={() => router.push('/auth/login')}
      >
        <Text style={s.btnText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: 32, paddingBottom: 60 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontSize: 36, fontWeight: '800', letterSpacing: 1 },
  sub: { fontSize: 16 },
  btn: { padding: 18, borderRadius: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
