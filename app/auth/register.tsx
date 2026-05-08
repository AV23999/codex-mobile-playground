import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '../../src/context/AppContext';
import authService from '../../src/services/authService';
import { validateEmail, validatePassword, validateUsername } from '../../src/utils/validation';
import { NovaColors } from '../../constants/theme';

export default function Register() {
  const { setUser, themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = async () => {
    if (!validateUsername(username)) return Alert.alert('Error', 'Username must be at least 3 characters');
    if (!validateEmail(email)) return Alert.alert('Error', 'Invalid email address');
    if (!validatePassword(password)) return Alert.alert('Error', 'Password must be at least 8 characters');
    if (password !== confirm) return Alert.alert('Error', 'Passwords do not match');
    try {
      const user = await authService.register({ username, email, password });
      setUser(user);
      router.replace('/(main)/chats');
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message);
    }
  };

  return (
    <View style={[s.c, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Create Account</Text>
      <TextInput style={[s.input, { backgroundColor: c.surface, color: c.text, borderColor: c.border }]} placeholder="Username" placeholderTextColor={c.mutedText} value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={[s.input, { backgroundColor: c.surface, color: c.text, borderColor: c.border }]} placeholder="Email" placeholderTextColor={c.mutedText} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={[s.input, { backgroundColor: c.surface, color: c.text, borderColor: c.border }]} placeholder="Password" placeholderTextColor={c.mutedText} value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={[s.input, { backgroundColor: c.surface, color: c.text, borderColor: c.border }]} placeholder="Confirm Password" placeholderTextColor={c.mutedText} value={confirm} onChangeText={setConfirm} secureTextEntry />
      <Pressable style={[s.btn, { backgroundColor: c.accent }]} onPress={handleRegister}>
        <Text style={s.btnTxt}>Register</Text>
      </Pressable>
      <Pressable onPress={() => router.back()}>
        <Text style={[s.link, { color: c.accent }]}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, padding: 28, justifyContent: 'center', gap: 12 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 10 },
  input: { padding: 14, borderRadius: 12, borderWidth: 1, fontSize: 16 },
  btn: { padding: 16, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 8 },
});
