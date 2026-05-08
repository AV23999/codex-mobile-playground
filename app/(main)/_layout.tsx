import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';

export default function MainTabs() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border }, tabBarActiveTintColor: c.accent, tabBarInactiveTintColor: c.mutedText }}>
      <Tabs.Screen name="chats" options={{ title: 'Chats', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble" color={color} size={size} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} /> }} />
    </Tabs>
  );
}
