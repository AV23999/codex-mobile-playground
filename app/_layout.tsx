import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../src/context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="chats" />
      </Stack>
      <StatusBar style="auto" />
    </AppProvider>
  );
}
