import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '../../src/context/AppContext';
import authService from '../../src/services/authService';
import { NovaColors } from '../../constants/theme';

export default function Login() {
  const { setUser, themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!emailOrUsername || !password) return Alert.alert('Error', 'All fields required');
    try {
      const user = await authService.login({ emailOrUsername, password });
      setUser(user);
      router.replace('/(main)/chats');
    } catch (e: any) {
      Alert.alert('Login Failed', e.message);
    }
  };

  return (
    <View style={[s.c, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Welcome Back</Text>
      <TextInput style={[s.input, { backgroundColor: c.surface, color: c.text, borderColor: c.border }]} placeholder="Email or Username" placeholderTextColor={c.mutedText} value={emailOrUsername} onChangeText={setEmailOrUsername} autoCapitalize="none" />
      <TextInput style={[s.input, { backgroundColor: c.surface, color: c.text, borderColor: c.border }]} placeholder="Password" placeholderTextColor={c.mutedText} value={password} onChangeText={setPassword} secureTextEntry />
      <Pressable style={[s.btn, { backgroundColor: c.accent }]} onPress={handleLogin}>
        <Text style={s.btnTxt}>Login</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/auth/register')}>
        <Text style={[s.link, { color: c.accent }]}>Don't have an account? Register</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, padding: 28, justifyContent: 'center', gap: 14 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 10 },
  input: { padding: 14, borderRadius: 12, borderWidth: 1, fontSize: 16 },
  btn: { padding: 16, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 8 },
});
