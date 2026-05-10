import { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Stack } from 'expo-router';

type Role = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: Role;
  text: string;
  timestamp: string;
};

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';

const SYSTEM_PROMPT = `You are Jarvis, a highly intelligent and composed AI assistant embedded inside N.O.V.A — a next-generation productivity and creative platform. You speak with calm authority, precision, and a touch of dry wit. Keep your responses concise, insightful, and actionable. Never be verbose.`;

const seedMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    text: "Welcome back. I have your workspace context loaded and ready for today's tasks.",
    timestamp: '09:41',
  },
];

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function JarvisScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const canSend = useMemo(() => value.trim().length > 0 && !isLoading, [value, isLoading]);

  const sendMessage = async () => {
    const content = value.trim();
    if (!content) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: content,
      timestamp: nowTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setValue('');
    setIsLoading(true);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role, content: m.text })),
            { role: 'user', content },
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? 'No response received.';

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: reply,
        timestamp: nowTime(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: 'Connection error. Please check your API key or network.',
          timestamp: nowTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: 'Jarvis', headerBackTitle: 'Back' }} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isUser = item.role === 'user';
            return (
              <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
                <View style={[styles.avatar, isUser ? styles.avatarUser : styles.avatarJarvis]}>
                  <Text style={styles.avatarText}>{isUser ? 'Y' : 'J'}</Text>
                </View>
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleJarvis]}>
                  <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextJarvis]}>
                    {item.text}
                  </Text>
                  <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampJarvis]}>
                    {item.timestamp}
                  </Text>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.rowAssistant}>
                <View style={[styles.avatar, styles.avatarJarvis]}>
                  <Text style={styles.avatarText}>J</Text>
                </View>
                <View style={[styles.bubble, styles.bubbleJarvis, styles.typingBubble]}>
                  <ActivityIndicator size="small" color="#4f98a3" />
                  <Text style={styles.typingText}>Jarvis is thinking...</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Ask Jarvis anything..."
            placeholderTextColor="#797876"
            value={value}
            onChangeText={setValue}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!canSend}
          >
            <Text style={styles.sendBtnText}>{isLoading ? '...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#171614' },
  flex: { flex: 1 },
  list: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  rowUser: { justifyContent: 'flex-end', flexDirection: 'row-reverse' },
  rowAssistant: { justifyContent: 'flex-start' },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarUser: { backgroundColor: '#4f98a3' },
  avatarJarvis: { backgroundColor: '#393836' },
  avatarText: { color: '#cdccca', fontSize: 13, fontWeight: '600' },
  bubble: { maxWidth: '75%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleUser: { backgroundColor: '#4f98a3', borderBottomRightRadius: 4 },
  bubbleJarvis: { backgroundColor: '#1c1b19', borderWidth: 1, borderColor: '#393836', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextUser: { color: '#171614' },
  bubbleTextJarvis: { color: '#cdccca' },
  timestamp: { fontSize: 11, marginTop: 4 },
  timestampUser: { color: 'rgba(23,22,20,0.6)', textAlign: 'right' },
  timestampJarvis: { color: 'rgba(205,204,202,0.5)' },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingText: { color: '#797876', fontSize: 13, fontStyle: 'italic' },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    padding: 12, borderTopWidth: 1, borderTopColor: '#393836',
    backgroundColor: '#1c1b19',
  },
  input: {
    flex: 1, minHeight: 44, maxHeight: 120,
    backgroundColor: '#171614', borderWidth: 1, borderColor: '#393836',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    color: '#cdccca', fontSize: 15,
  },
  sendBtn: {
    height: 44, paddingHorizontal: 18,
    backgroundColor: '#4f98a3', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#393836' },
  sendBtnText: { color: '#171614', fontWeight: '700', fontSize: 14 },
});
