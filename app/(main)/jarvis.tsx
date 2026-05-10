import { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type Role = 'user' | 'assistant';
type ChatMessage = { id: string; role: Role; text: string; timestamp: string };

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';

const SYSTEM_PROMPT = `You are Jarvis, a highly intelligent and composed AI assistant embedded inside N.O.V.A — a next-generation productivity and creative platform. You speak with calm authority, precision, and a touch of dry wit. Keep your responses concise, insightful, and actionable. Never be verbose.`;

const seedMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    text: "SYSTEM ONLINE. Welcome back, Akash. Neural pathways calibrated. I have your workspace context loaded and ready.",
    timestamp: '09:41',
  },
];

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function PulsingRing() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.35, duration: 1200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 1200, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 1200, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.pulseRing, { transform: [{ scale }], opacity }]} />;
}

function JarvisAvatar() {
  return (
    <View style={styles.jarvisAvatarWrap}>
      <PulsingRing />
      <LinearGradient colors={['#0d2f35', '#0a4a52', '#0d2f35']} style={styles.jarvisAvatar}>
        <Text style={styles.jarvisAvatarText}>J</Text>
      </LinearGradient>
    </View>
  );
}

function TypingDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.2)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: 300, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.dot, { opacity }]} />;
}

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

    if (!OPENAI_API_KEY) {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'assistant', text: '⚠ OPENAI_API_KEY not found. Add EXPO_PUBLIC_OPENAI_API_KEY to your .env and restart with --clear.', timestamp: nowTime() },
      ]);
      setIsLoading(false);
      return;
    }

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

      if (!res.ok) {
        throw new Error(data?.error?.message ?? `HTTP ${res.status}`);
      }

      const reply = data.choices?.[0]?.message?.content ?? 'No response received.';
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: 'assistant', text: reply, timestamp: nowTime() },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, role: 'assistant', text: `⚠ ${err?.message ?? 'Connection error. Check your API key.'}`, timestamp: nowTime() },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient colors={['#050d10', '#0a1a20']} style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerDot} />
          <View style={styles.headerDot} />
          <View style={styles.headerDot} />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>N.O.V.A NEURAL LINK</Text>
          <Text style={styles.headerTitle}>J.A.R.V.I.S</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerStatus}>● ONLINE</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
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
                {!isUser && <JarvisAvatar />}
                <View style={isUser ? styles.userMsgWrap : styles.assistantMsgWrap}>
                  {!isUser && <Text style={styles.senderLabel}>JARVIS · {item.timestamp}</Text>}
                  {isUser ? (
                    <LinearGradient
                      colors={['#0e6e7a', '#0a9aad']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.bubbleUser}
                    >
                      <Text style={styles.bubbleTextUser}>{item.text}</Text>
                      <Text style={styles.timestampUser}>{item.timestamp}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.bubbleJarvis}>
                      <View style={styles.bubbleJarvisBorder} />
                      <Text style={styles.bubbleTextJarvis}>{item.text}</Text>
                    </View>
                  )}
                </View>
                {isUser && (
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>AK</Text>
                  </View>
                )}
              </View>
            );
          }}
          ListFooterComponent={
            isLoading ? (
              <View style={[styles.row, styles.rowAssistant]}>
                <JarvisAvatar />
                <View style={styles.assistantMsgWrap}>
                  <Text style={styles.senderLabel}>JARVIS · processing</Text>
                  <View style={styles.typingBubble}>
                    <View style={styles.bubbleJarvisBorder} />
                    <View style={styles.typingDots}>
                      <TypingDot delay={0} />
                      <TypingDot delay={200} />
                      <TypingDot delay={400} />
                    </View>
                    <Text style={styles.typingLabel}>Analyzing query...</Text>
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        <LinearGradient colors={['#050d10', '#0a1a20']} style={styles.inputBar}>
          <View style={styles.inputWrap}>
            <Text style={styles.inputPrefix}>&gt;_</Text>
            <TextInput
              style={styles.input}
              placeholder="Query Jarvis..."
              placeholderTextColor="#1e4a52"
              value={value}
              onChangeText={setValue}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              multiline
              selectionColor="#0a9aad"
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!canSend}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={canSend ? ['#0a9aad', '#0e6e7a'] : ['#0d1f24', '#0d1f24']}
              style={styles.sendBtnGradient}
            >
              <Text style={[styles.sendBtnText, !canSend && styles.sendBtnTextDisabled]}>
                {isLoading ? '...' : '▶'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const C = {
  bg: '#040b0e', surface: '#071318', border: '#0d3a44', borderGlow: '#0a9aad',
  cyan: '#0a9aad', cyanDim: '#0e6e7a', cyanFaint: '#062830',
  text: '#a8e6ef', textMuted: '#3a8a96', textFaint: '#1e4a52', userText: '#e0f7fa',
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerLeft: { flexDirection: 'row', gap: 5 },
  headerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.cyanDim },
  headerCenter: { alignItems: 'center' },
  headerLabel: { fontSize: 9, letterSpacing: 3, color: C.textMuted, fontWeight: '600' },
  headerTitle: { fontSize: 18, letterSpacing: 6, color: C.cyan, fontWeight: '700' },
  headerRight: {},
  headerStatus: { fontSize: 10, color: '#00ff88', letterSpacing: 1 },
  list: { padding: 16, paddingBottom: 8, gap: 16 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  rowUser: { justifyContent: 'flex-end' },
  rowAssistant: { justifyContent: 'flex-start' },
  jarvisAvatarWrap: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  pulseRing: { position: 'absolute', width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: C.cyan },
  jarvisAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.borderGlow },
  jarvisAvatarText: { color: C.cyan, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  userAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.cyanFaint, borderWidth: 1, borderColor: C.cyanDim, alignItems: 'center', justifyContent: 'center' },
  userAvatarText: { color: C.cyan, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  userMsgWrap: { alignItems: 'flex-end', maxWidth: '72%' },
  assistantMsgWrap: { flex: 1, maxWidth: '80%' },
  senderLabel: { fontSize: 9, color: C.textMuted, letterSpacing: 2, marginBottom: 5, marginLeft: 2 },
  bubbleUser: { borderRadius: 16, borderTopRightRadius: 4, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleTextUser: { color: C.userText, fontSize: 14, lineHeight: 21 },
  timestampUser: { color: 'rgba(224,247,250,0.5)', fontSize: 10, marginTop: 4, textAlign: 'right' },
  bubbleJarvis: { backgroundColor: C.surface, borderRadius: 16, borderTopLeftRadius: 4, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 10, overflow: 'hidden' },
  bubbleJarvisBorder: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: C.cyan, borderTopLeftRadius: 4, borderBottomLeftRadius: 16 },
  bubbleTextJarvis: { color: C.text, fontSize: 14, lineHeight: 22 },
  typingBubble: { backgroundColor: C.surface, borderRadius: 16, borderTopLeftRadius: 4, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 12, overflow: 'hidden' },
  typingDots: { flexDirection: 'row', gap: 5, marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.cyan },
  typingLabel: { color: C.textMuted, fontSize: 11, letterSpacing: 1 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  inputPrefix: { color: C.cyan, fontSize: 14, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  input: { flex: 1, color: C.text, fontSize: 14, maxHeight: 100, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  sendBtn: { borderRadius: 12, overflow: 'hidden' },
  sendBtnDisabled: {},
  sendBtnGradient: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: '#050d10', fontSize: 16, fontWeight: '800' },
  sendBtnTextDisabled: { color: C.textFaint },
});
