import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Animated, Easing, Dimensions,
  ActivityIndicator, Alert, Keyboard, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { sendToJarvis, JarvisMessage, JARVIS_API_KEY } from '../../src/services/jarvisService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const QUICK_PROMPTS = [
  { label: '🌍 World News', text: 'What are the most important things happening in the world right now that I should know about?' },
  { label: '🚀 Space', text: 'Tell me something mind-blowing about space or the universe.' },
  { label: '🧠 Explain Anything', text: 'Explain quantum entanglement like I\'m smart but not a physicist.' },
  { label: '⚡ Capabilities', text: 'What can you do? Show me everything you\'re capable of.' },
  { label: '💡 Idea Factory', text: 'Give me 5 genuinely unique business ideas for 2025.' },
  { label: '🔬 Science', text: 'What\'s the most recent scientific breakthrough that could change humanity?' },
  { label: '🎭 Debate Me', text: 'Pick a controversial topic and debate both sides brilliantly.' },
  { label: '🛡️ Life Advice', text: 'Give me the most important life principle you would recommend.' },
];

type Msg = JarvisMessage & { id: string; timestamp: number };

export default function JarvisScreen() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [apiKey, setApiKey] = useState(JARVIS_API_KEY);
  const [keyInput, setKeyInput] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const inputRef = useRef<TextInput>(null);

  // Load saved API key
  useEffect(() => {
    AsyncStorage.getItem('jarvis_api_key').then(k => { if (k) setApiKey(k); });
  }, []);

  // Arc reactor pulse animation
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.12, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.timing(ringAnim, { toValue: 1, duration: 3200, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 0.9, duration: 2400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0.4, duration: 2400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ])).start();
  }, []);

  const spin = ringAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const typewriterEffect = (text: string, onDone: () => void) => {
    setIsTyping(true);
    setTypingText('');
    let i = 0;
    const speed = Math.max(8, Math.min(22, Math.floor(2000 / text.length)));
    const interval = setInterval(() => {
      i++;
      setTypingText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        onDone();
      }
    }, speed);
  };

  const send = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || thinking) return;
    Keyboard.dismiss();
    setInput('');

    const userMsg: Msg = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setThinking(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const reply = await sendToJarvis(
        updatedMsgs.map(m => ({ role: m.role, content: m.content })),
        apiKey
      );
      const assistantMsg: Msg = { id: (Date.now() + 1).toString(), role: 'assistant', content: reply, timestamp: Date.now() };
      setThinking(false);
      typewriterEffect(reply, () => {
        setMessages(prev => [...prev, assistantMsg]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      });
    } catch (e: any) {
      setThinking(false);
      if (e.message === 'NO_KEY' || e.message === 'INVALID_KEY') {
        setShowKeyModal(true);
      } else if (e.message === 'RATE_LIMIT') {
        Alert.alert('JARVIS Overloaded', 'Too many requests. Please wait a moment.');
      } else {
        Alert.alert('Connection Error', e.message || 'Failed to reach JARVIS. Check your connection.');
      }
    }
  }, [input, messages, thinking, apiKey]);

  const saveKey = async () => {
    const k = keyInput.trim();
    if (!k.startsWith('sk-')) { Alert.alert('Invalid Key', 'OpenAI keys start with sk-'); return; }
    await AsyncStorage.setItem('jarvis_api_key', k);
    setApiKey(k);
    setKeyInput('');
    setShowKeyModal(false);
  };

  const clearChat = () => {
    Alert.alert('Clear conversation?', 'This will erase all messages.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => { setMessages([]); setTypingText(''); setIsTyping(false); } },
    ]);
  };

  const needsKey = apiKey === 'YOUR_OPENAI_API_KEY_HERE' || !apiKey;

  // ── API KEY SETUP MODAL
  if (showKeyModal || needsKey) {
    return (
      <View style={[s.keyScreen, { backgroundColor: '#020c18' }]}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={[s.reactorWrap, { transform: [{ scale: pulseAnim }] }]}>
          <Animated.View style={[s.reactorRing, { transform: [{ rotate: spin }], opacity: glowAnim }]} />
          <View style={s.reactorCore}>
            <View style={s.reactorInner} />
          </View>
        </Animated.View>
        <Text style={s.jarvisTitle}>J.A.R.V.I.S</Text>
        <Text style={s.jarvisSub}>Just A Rather Very Intelligent System</Text>
        <View style={s.keyCard}>
          <Text style={s.keyCardTitle}>OpenAI API Key Required</Text>
          <Text style={s.keyCardSub}>
            JARVIS runs on GPT-4o — the most powerful AI available.{`\n`}
            Get your free API key at platform.openai.com
          </Text>
          <TextInput
            style={s.keyInput}
            value={keyInput}
            onChangeText={setKeyInput}
            placeholder="sk-..."
            placeholderTextColor="rgba(100,200,255,0.3)"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable onPress={saveKey} style={s.keyBtn}>
            <Text style={s.keyBtnText}>Activate JARVIS</Text>
          </Pressable>
          {showKeyModal && (
            <Pressable onPress={() => setShowKeyModal(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: 'rgba(100,200,255,0.5)', textAlign: 'center', fontSize: 13 }}>Cancel</Text>
            </Pressable>
          )}
        </View>
        <Text style={s.keyNote}>Your key is stored locally on-device only.</Text>
      </View>
    );
  }

  // ── MAIN JARVIS CHAT
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#020c18' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Animated.View style={[s.reactorMini, { transform: [{ scale: pulseAnim }] }]}>
            <View style={s.reactorMiniCore} />
          </Animated.View>
          <View>
            <Text style={s.headerTitle}>J.A.R.V.I.S</Text>
            <Text style={s.headerStatus}>{thinking || isTyping ? '● Processing...' : '● Online — GPT-4o'}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable onPress={() => setShowKeyModal(true)}>
            <Ionicons name="key-outline" size={20} color="rgba(100,200,255,0.6)" />
          </Pressable>
          <Pressable onPress={clearChat}>
            <Ionicons name="trash-outline" size={20} color="rgba(100,200,255,0.6)" />
          </Pressable>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 8, gap: 12 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome state */}
        {messages.length === 0 && !isTyping && (
          <View style={s.welcomeWrap}>
            <Animated.View style={[s.reactorLarge, { transform: [{ scale: pulseAnim }] }]}>
              <Animated.View style={[s.reactorRingLarge, { transform: [{ rotate: spin }], opacity: glowAnim }]} />
              <View style={s.reactorCoreLarge}>
                <View style={s.reactorInnerLarge} />
              </View>
            </Animated.View>
            <Text style={s.welcomeTitle}>Good evening, sir.</Text>
            <Text style={s.welcomeSub}>I'm JARVIS. Ask me anything — science, world events,{`\n`}philosophy, code, analysis, or just talk.</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16, marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
              {QUICK_PROMPTS.map(q => (
                <Pressable key={q.label} onPress={() => send(q.text)} style={s.chip}>
                  <Text style={s.chipText}>{q.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Message bubbles */}
        {messages.map(msg => (
          <View key={msg.id} style={[s.msgRow, msg.role === 'user' ? s.msgRowUser : s.msgRowAssistant]}>
            {msg.role === 'assistant' && (
              <View style={s.avatarWrap}>
                <View style={s.avatarDot} />
              </View>
            )}
            <View style={[
              s.bubble,
              msg.role === 'user' ? s.bubbleUser : s.bubbleAssistant,
            ]}>
              <Text style={[s.bubbleText, msg.role === 'user' ? s.bubbleTextUser : s.bubbleTextAssistant]}>
                {msg.content}
              </Text>
              <Text style={s.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}

        {/* Typewriter effect for incoming response */}
        {isTyping && typingText.length > 0 && (
          <View style={[s.msgRow, s.msgRowAssistant]}>
            <View style={s.avatarWrap}><View style={s.avatarDot} /></View>
            <View style={[s.bubble, s.bubbleAssistant]}>
              <Text style={[s.bubbleText, s.bubbleTextAssistant]}>{typingText}<Text style={s.cursor}>▌</Text></Text>
            </View>
          </View>
        )}

        {/* Thinking indicator */}
        {thinking && (
          <View style={[s.msgRow, s.msgRowAssistant]}>
            <View style={s.avatarWrap}><View style={[s.avatarDot, { backgroundColor: '#ffd700' }]} /></View>
            <View style={[s.bubble, s.bubbleAssistant, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
              <ActivityIndicator size="small" color="#64c8ff" />
              <Text style={[s.bubbleText, s.bubbleTextAssistant, { opacity: 0.6 }]}>JARVIS is thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick prompts when chat is active */}
      {messages.length > 0 && !thinking && !isTyping && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 44, marginBottom: 4 }} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, alignItems: 'center' }}>
          {QUICK_PROMPTS.slice(0, 5).map(q => (
            <Pressable key={q.label} onPress={() => send(q.text)} style={[s.chip, { paddingVertical: 6 }]}>
              <Text style={[s.chipText, { fontSize: 11 }]}>{q.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Input bar */}
      <View style={s.inputBar}>
        <TextInput
          ref={inputRef}
          style={s.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask JARVIS anything..."
          placeholderTextColor="rgba(100,200,255,0.3)"
          multiline
          maxLength={2000}
          returnKeyType="send"
          onSubmitEditing={() => send()}
          blurOnSubmit={false}
        />
        <Pressable
          onPress={() => send()}
          style={[s.sendBtn, (!input.trim() || thinking) && { opacity: 0.35 }]}
          disabled={!input.trim() || thinking}
        >
          <Ionicons name="send" size={18} color="#020c18" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  // Key setup screen
  keyScreen:      { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  jarvisTitle:    { color: '#64c8ff', fontSize: 28, fontWeight: '900', letterSpacing: 8, marginTop: 8 },
  jarvisSub:      { color: 'rgba(100,200,255,0.45)', fontSize: 12, letterSpacing: 2, textAlign: 'center', marginTop: -8 },
  keyCard:        { backgroundColor: 'rgba(100,200,255,0.06)', borderWidth: 1, borderColor: 'rgba(100,200,255,0.15)', borderRadius: 20, padding: 20, width: '100%', gap: 12, marginTop: 8 },
  keyCardTitle:   { color: '#64c8ff', fontSize: 17, fontWeight: '700', textAlign: 'center' },
  keyCardSub:     { color: 'rgba(100,200,255,0.55)', fontSize: 13, lineHeight: 20, textAlign: 'center' },
  keyInput:       { backgroundColor: 'rgba(100,200,255,0.08)', borderWidth: 1, borderColor: 'rgba(100,200,255,0.2)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#64c8ff', fontSize: 14, fontFamily: 'monospace' },
  keyBtn:         { backgroundColor: '#64c8ff', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  keyBtnText:     { color: '#020c18', fontWeight: '800', fontSize: 15, letterSpacing: 1 },
  keyNote:        { color: 'rgba(100,200,255,0.3)', fontSize: 11, textAlign: 'center', marginTop: -4 },

  // Arc reactor
  reactorWrap:    { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  reactorRing:    { position: 'absolute', width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: '#64c8ff', borderStyle: 'dashed' },
  reactorCore:    { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(100,200,255,0.12)', borderWidth: 2, borderColor: '#64c8ff', alignItems: 'center', justifyContent: 'center' },
  reactorInner:   { width: 28, height: 28, borderRadius: 14, backgroundColor: '#64c8ff', shadowColor: '#64c8ff', shadowOpacity: 1, shadowRadius: 16, shadowOffset: { width: 0, height: 0 } },

  // Mini reactor (header)
  reactorMini:    { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  reactorMiniCore:{ width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(100,200,255,0.15)', borderWidth: 1.5, borderColor: '#64c8ff', alignItems: 'center', justifyContent: 'center' },

  // Large reactor (welcome)
  reactorLarge:   { width: 130, height: 130, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  reactorRingLarge: { position: 'absolute', width: 126, height: 126, borderRadius: 63, borderWidth: 1.5, borderColor: '#64c8ff', borderStyle: 'dashed' },
  reactorCoreLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(100,200,255,0.1)', borderWidth: 2, borderColor: '#64c8ff', alignItems: 'center', justifyContent: 'center' },
  reactorInnerLarge:{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#64c8ff', shadowColor: '#64c8ff', shadowOpacity: 1, shadowRadius: 24, shadowOffset: { width: 0, height: 0 } },

  // Header
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(100,200,255,0.1)', backgroundColor: '#020c18' },
  headerLeft:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle:    { color: '#64c8ff', fontSize: 16, fontWeight: '900', letterSpacing: 4 },
  headerStatus:   { color: 'rgba(100,200,255,0.5)', fontSize: 10, letterSpacing: 1, marginTop: 1 },

  // Welcome
  welcomeWrap:    { alignItems: 'center', paddingTop: 20, gap: 6 },
  welcomeTitle:   { color: '#64c8ff', fontSize: 22, fontWeight: '800', letterSpacing: 1 },
  welcomeSub:     { color: 'rgba(100,200,255,0.5)', fontSize: 13, textAlign: 'center', lineHeight: 20 },

  // Chips
  chip:           { backgroundColor: 'rgba(100,200,255,0.08)', borderWidth: 1, borderColor: 'rgba(100,200,255,0.2)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipText:       { color: '#64c8ff', fontSize: 12, fontWeight: '600' },

  // Messages
  msgRow:         { flexDirection: 'row', gap: 8, maxWidth: width - 32 },
  msgRowUser:     { justifyContent: 'flex-end', alignSelf: 'flex-end' },
  msgRowAssistant:{ justifyContent: 'flex-start', alignSelf: 'flex-start' },
  avatarWrap:     { width: 24, alignItems: 'center', paddingTop: 4 },
  avatarDot:      { width: 10, height: 10, borderRadius: 5, backgroundColor: '#64c8ff', shadowColor: '#64c8ff', shadowOpacity: 0.8, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
  bubble:         { maxWidth: width * 0.78, borderRadius: 18, padding: 12, paddingBottom: 8 },
  bubbleUser:     { backgroundColor: '#64c8ff', borderBottomRightRadius: 4 },
  bubbleAssistant:{ backgroundColor: 'rgba(100,200,255,0.08)', borderWidth: 1, borderColor: 'rgba(100,200,255,0.15)', borderBottomLeftRadius: 4 },
  bubbleText:     { fontSize: 14, lineHeight: 22 },
  bubbleTextUser: { color: '#020c18', fontWeight: '500' },
  bubbleTextAssistant: { color: 'rgba(200,235,255,0.92)' },
  timestamp:      { fontSize: 10, opacity: 0.4, marginTop: 4, color: 'inherit' },
  cursor:         { color: '#64c8ff', opacity: 0.8 },

  // Input
  inputBar:       { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(100,200,255,0.1)', backgroundColor: '#020c18' },
  input:          { flex: 1, backgroundColor: 'rgba(100,200,255,0.07)', borderWidth: 1, borderColor: 'rgba(100,200,255,0.18)', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, color: 'rgba(200,235,255,0.92)', fontSize: 14, maxHeight: 120, minHeight: 42 },
  sendBtn:        { width: 42, height: 42, borderRadius: 21, backgroundColor: '#64c8ff', alignItems: 'center', justifyContent: 'center', shadowColor: '#64c8ff', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { width: 0, height: 0 } },
});
