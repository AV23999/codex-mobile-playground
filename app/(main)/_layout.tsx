import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';

export default function MainTabs() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 4,
        },
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.mutedText,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tabs.Screen name="chats" options={{ title: 'Chats', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble" color={color} size={size - 2} /> }} />
      <Tabs.Screen name="watch" options={{ title: 'Watch', tabBarIcon: ({ color, size }) => <Ionicons name="tv" color={color} size={size - 2} /> }} />
      <Tabs.Screen name="media" options={{ title: 'Media', tabBarIcon: ({ color, size }) => <Ionicons name="musical-notes" color={color} size={size - 2} /> }} />
      <Tabs.Screen name="abyss" options={{ title: 'Abyss', tabBarIcon: ({ color, size }) => <Ionicons name="eye-off" color={color} size={size - 2} /> }} />
      <Tabs.Screen
        name="jarvis"
        options={{
          title: 'N.O.V.A',
          tabBarIcon: ({ color, size }) => <Ionicons name="hardware-chip" color={color} size={size - 2} />,
          tabBarActiveTintColor: '#7DF9FF',
        }}
      />
      <Tabs.Screen name="premium" options={{ title: 'Premium', tabBarIcon: ({ color, size }) => <Ionicons name="star" color={color} size={size - 2} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Ionicons name="settings-sharp" color={color} size={size - 2} /> }} />
    </Tabs>
  );
}
