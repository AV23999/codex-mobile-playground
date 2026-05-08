import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import chatService from '../../src/services/chatService';
import NovaLogo from '../../components/NovaLogo';

export default function Chats() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [chats, setChats] = useState<any[]>([]);
  useEffect(() => { chatService.getChats().then(setChats); }, []);

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <NovaLogo size={32} />
        <Text style={[s.title, { color: c.text }]}>Nova Chat</Text>
      </View>
      <FlatList
        data={chats}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/chats/${item.id}`)} style={[s.row, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View>
              <Text style={[s.name, { color: c.text }]}>{item.name}</Text>
              <Text style={{ color: c.mutedText }}>{item.lastMessage}</Text>
            </View>
            <View style={s.status}>
              <View style={[s.dot, { backgroundColor: item.online ? c.success : c.mutedText }]} />
              <Text style={{ color: c.mutedText, fontSize: 12 }}>{item.online ? 'Online' : 'Offline'}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700' },
  row: { padding: 14, borderWidth: 1, borderRadius: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600' },
  status: { alignItems: 'center', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 99 },
});
