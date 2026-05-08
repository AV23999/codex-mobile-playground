import { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import chatService from '../../src/services/chatService';

export default function ChatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => { chatService.getMessages(id).then(setMessages); }, [id]);

  const send = async () => {
    if (!text.trim()) return;
    const msg = await chatService.sendMessage(id, text);
    setMessages(prev => [...prev, msg]);
    setText('');
  };

  return (
    <View style={[s.c, { backgroundColor: c.background }]}>
      <FlatList
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => (
          <View style={[s.bubble, { backgroundColor: item.sent ? c.sent : c.received, alignSelf: item.sent ? 'flex-end' : 'flex-start' }]}>
            <Text style={{ color: '#fff' }}>🔒 {item.text}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 }}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
      />
      <View style={[s.inputRow, { backgroundColor: c.surface, borderTopColor: c.border }]}>
        <TextInput
          style={[s.input, { color: c.text }]}
          placeholder="Message..."
          placeholderTextColor={c.mutedText}
          value={text}
          onChangeText={setText}
        />
        <Pressable style={[s.send, { backgroundColor: c.accent }]} onPress={send}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1 },
  bubble: { padding: 12, borderRadius: 16, maxWidth: '75%' },
  inputRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, gap: 10, alignItems: 'center' },
  input: { flex: 1, fontSize: 16 },
  send: { padding: 10, borderRadius: 10 },
});
