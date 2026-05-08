import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '../../src/context/AppContext';
import authService from '../../src/services/authService';
import { NovaColors } from '../../constants/theme';

export default function Settings() {
  const { user, setUser, themeMode, toggleTheme } = useAppContext();
  const c = NovaColors[themeMode];
  const out = async () => { await authService.logout(); setUser(null); router.replace('/auth/login'); };

  return (
    <View style={[s.c, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Settings</Text>
      <View style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={{ color: c.mutedText }}>Profile</Text>
        <Text style={[s.big, { color: c.text }]}>{user?.username || 'Guest'}</Text>
        <Text style={{ color: c.mutedText }}>{user?.email || 'Not signed in'}</Text>
      </View>
      <View style={[s.row, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={{ color: c.text }}>Light mode</Text>
        <Switch value={themeMode === 'light'} onValueChange={toggleTheme} />
      </View>
      <Pressable onPress={out} style={[s.btn, { backgroundColor: c.danger }]}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Logout</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, padding: 20, paddingTop: 60, gap: 14 },
  title: { fontSize: 28, fontWeight: '700' },
  card: { padding: 16, borderRadius: 14, borderWidth: 1, gap: 6 },
  big: { fontSize: 18, fontWeight: '600' },
  row: { padding: 16, borderRadius: 14, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btn: { padding: 14, borderRadius: 12, alignItems: 'center' },
});
