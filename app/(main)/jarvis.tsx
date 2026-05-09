import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Animated, Easing, Dimensions,
  ActivityIndicator, Alert, Keyboard, StatusBar, Linking, Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useAppContext } from '../../src/context/AppContext';
import { sendToNova, NOVA_API_KEY_PLACEHOLDER, NovaPersonality } from '../../src/services/jarvisService';
import { saveMemory, loadAllMemories, clearAllMemories, extractMemoryFromMessage, MemoryEntry } from '../../src/services/memoryService';

const { width } = Dimensions.get('window');
const ACCENT  = '#7DF9FF';
const ACCENT2 = '#B980FF';
const BG      = '#060b14';
const SURFACE = 'rgba(125,249,255,0.06)';
const BORDER  = 'rgba(125,249,255,0.15)';

let Voice: any = null;
try { Voice = require('@react-native-voice/voice').default; } catch { Voice = null; }

const QUICK_PROMPTS = [
  { label: '🌍 World Events',      text: 'What are the most important things happening in the world right now?' },
  { label: '🚀 Space Facts',       text: 'Tell me something genuinely mind-blowing about space or the universe.' },
  { label: '🧠 Explain Anything',  text: 'Explain quantum entanglement like I am smart but not a physicist.' },
  { label: '⚡ Your Capabilities', text: 'Show me the full range of what you can do for me.' },
  { label: '💡 Idea Factory',      text: 'Give me 5 genuinely unique and viable business ideas for right now.' },
  { label: '🔬 Science Breakthroughs', text: 'What recent scientific discovery could change humanity forever?' },
  { label: '🎭 Debate Both Sides', text: 'Pick a controversial topic and brilliantly argue both sides.' },
  { label: '🛡️ Life Wisdom',      text: 'Give me the single most important life principle you would recommend.' },
  { label: '🐈 Surprise Me',       text: 'Tell me something fascinating that most people do not know.' },
  { label: '💻 Code Help',         text: 'I need help with code. What languages and frameworks do you know?' },
];

const PERSONALITY_CONFIG: Record<NovaPersonality, { label: string; icon: string; color: string }> = {
  default:  { label: 'N.O.V.A',    icon: '🤖', color: ACCENT },
  tactical: { label: 'Tactical',   icon: '⚡', color: '#FF6B35' },
  casual:   { label: 'Casual',     icon: '😎', color: '#6BCB77' },
  creative: { label: 'Creative',   icon: '✨', color: ACCENT2 },
};

const OFFLINE_RESPONSES = [
  "I'm currently offline but I'm still here. Check your internet connection and I'll be back at full power.",
  "Connection lost — but N.O.V.A doesn't abandon you. Reconnect and we continue from exactly where we left off.",
  "No signal detected. I exist locally on your device and I remember everything. Just reconnect when ready.",
  "Offline mode activated. I can still hear you — I just can't respond with my full intelligence until we reconnect.",
];

type Role = 'user' | 'assistant';
type Msg  = { id: string; role: Role; content: string; timestamp: number; isStreaming?: boolean };

export default function NovaAgentScreen() {
  useAppContext();

  const [messages,       setMessages]       = useState<Msg[]>([]);
  const [input,          setInput]          = useState('');
  const [thinking,       setThinking]       = useState(false);
  const [apiKey,         setApiKey]         = useState('');
  const [keyInput,       setKeyInput]       = useState('');
  const [showKeyModal,   setShowKeyModal]   = useState(false);
  const [keyLoaded,      setKeyLoaded]      = useState(false);
  const [listening,      setListening]      = useState(false);
  const [voiceText,      setVoiceText]      = useState('');
  const [isSpeaking,     setIsSpeaking]     = useState(false);
  const [ttsEnabled,     setTtsEnabled]     = useState(true);
  const [personality,    setPersonality]    = useState<NovaPersonality>('default');
  const [showPersonality, setShowPersonality] = useState(false);
  const [streamingText,  setStreamingText]  = useState('');
  const [isStreaming,    setIsStreaming]     = useState(false);
  const [memories,       setMemories]       = useState<MemoryEntry[]>([]);
  const [showMemory,     setShowMemory]     = useState(false);
  const [isOnline,       setIsOnline]       = useState(true);

  const scrollRef   = useRef<ScrollView>(null);
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const ringAnim    = useRef(new Animated.Value(0)).current;
  const glowAnim    = useRef(new Animated.Value(0.4)).current;
  const waveAnims   = useRef([...Array(7)].map(() => new Animated.Value(0.3))).current;
  const voicePulse  = useRef(new Animated.Value(1)).current;
  const inputRef    = useRef<TextInput>(null);
  const streamBuffer = useRef('');

  // Load persisted state
  useEffect(() => {
    AsyncStorage.getItem('nova_api_key').then(k => { if (k) setApiKey(k); setKeyLoaded(true); });
    AsyncStorage.getItem('nova_tts').then(v => { if (v !== null) setTtsEnabled(v === '1'); });
    AsyncStorage.getItem('nova_personality').then(v => { if (v) setPersonality(v as NovaPersonality); });
    loadAllMemories().then(setMemories);
  }, []);

  // Orb animations
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.14, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1,    duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.timing(ringAnim, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1,   duration: 2600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0.3, duration: 2600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ])).start();
  }, []);

  // Waveform
  useEffect(() => {
    if (listening || isSpeaking || isStreaming) {
      const anims = waveAnims.map((a, i) =>
        Animated.loop(Animated.sequence([
          Animated.delay(i * 80),
          Animated.timing(a, { toValue: 1,   duration: 280 + i * 40, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(a, { toValue: 0.2, duration: 280 + i * 40, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]))
      );
      anims.forEach(a => a.start());
      return () => anims.forEach(a => a.stop());
    } else {
      waveAnims.forEach(a => a.setValue(0.3));
    }
  }, [listening, isSpeaking, isStreaming]);

  // Voice pulse
  useEffect(() => {
    if (listening) {
      Animated.loop(Animated.sequence([
        Animated.timing(voicePulse, { toValue: 1.25, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(voicePulse, { toValue: 1,    duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])).start();
    } else {
      voicePulse.setValue(1);
    }
  }, [listening]);

  // Voice recognition setup
  useEffect(() => {
    if (!Voice) return;
    Voice.onSpeechResults        = (e: any) => { const t = e.value?.[0]; if (t) { setVoiceText(t); setInput(t); } };
    Voice.onSpeechPartialResults = (e: any) => { const t = e.value?.[0]; if (t) setVoiceText(t); };
    Voice.onSpeechEnd            = () => setListening(false);
    Voice.onSpeechError          = () => { setListening(false); setVoiceText(''); };
    return () => { Voice?.destroy().catch(() => {}); };
  }, []);

  const spin        = ringAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg',  '360deg'] });
  const spinReverse = ringAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] });

  const accentColor = PERSONALITY_CONFIG[personality].color;

  // TTS
  const speakReply = useCallback((text: string) => {
    if (!ttsEnabled) return;
    Speech.stop();
    setIsSpeaking(true);
    const clean = text.replace(/[*#_`~>]/g, '').replace(/\n+/g, '. ');
    Speech.speak(clean, {
      language: 'en-US',
      pitch: personality === 'tactical' ? 0.85 : personality === 'casual' ? 1.0 : 0.92,
      rate:  personality === 'tactical' ? 1.1  : personality === 'casual' ? 0.88 : 0.92,
      onDone:  () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [ttsEnabled, personality]);

  const stopSpeaking = () => { Speech.stop(); setIsSpeaking(false); };

  // Send message with streaming
  const send = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || thinking || isStreaming) return;
    Keyboard.dismiss();
    setInput('');
    setVoiceText('');
    stopSpeaking();

    // Haptic feedback on send
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}

    // Auto-save memory from message
    const memHint = extractMemoryFromMessage(text);
    if (memHint?.shouldSave) {
      await saveMemory(memHint.content, memHint.category);
      loadAllMemories().then(setMemories);
    }

    const userMsg: Msg = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: Date.now() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setThinking(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);

    try {
      streamBuffer.current = '';
      setStreamingText('');
      setIsStreaming(false);

      const reply = await sendToNova(
        updated.map(m => ({ role: m.role, content: m.content })),
        apiKey,
        personality,
        (chunk: string) => {
          // First chunk — switch from thinking to streaming
          if (thinking || !isStreaming) {
            setThinking(false);
            setIsStreaming(true);
          }
          streamBuffer.current += chunk;
          setStreamingText(streamBuffer.current);
          scrollRef.current?.scrollToEnd({ animated: false });
        }
      );

      setIsStreaming(false);
      setStreamingText('');
      setThinking(false);
      setIsOnline(true);

      const aMsg: Msg = { id: `a-${Date.now()}`, role: 'assistant', content: reply, timestamp: Date.now() };
      setMessages(prev => [...prev, aMsg]);
      speakReply(reply);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);

      // Haptic on receive
      try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}

    } catch (e: any) {
      setThinking(false);
      setIsStreaming(false);
      setStreamingText('');
      streamBuffer.current = '';

      if (e.message === 'NO_KEY' || e.message === 'INVALID_KEY') {
        setShowKeyModal(true);
      } else if (e.message === 'RATE_LIMIT') {
        Alert.alert('N.O.V.A', 'Rate limit reached. Please wait a moment.');
      } else {
        // Offline fallback — show graceful message
        setIsOnline(false);
        const fallback = OFFLINE_RESPONSES[Math.floor(Math.random() * OFFLINE_RESPONSES.length)];
        const offMsg: Msg = { id: `off-${Date.now()}`, role: 'assistant', content: fallback, timestamp: Date.now() };
        setMessages(prev => [...prev, offMsg]);
        try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch {}
      }
    }
  }, [input, messages, thinking, isStreaming, apiKey, personality, speakReply]);

  // Voice input
  const toggleVoice = async () => {
    if (listening) {
      await Voice?.stop();
      setListening(false);
      if (voiceText.trim()) setTimeout(() => send(voiceText.trim()), 200);
      return;
    }
    if (!Voice) {
      Alert.alert('Voice Unavailable', 'Run: npx expo install @react-native-voice/voice\nThen rebuild the app.');
      return;
    }
    try {
      setVoiceText('');
      setInput('');
      Vibration.vibrate(40);
      try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
      await Voice.start('en-US');
      setListening(true);
    } catch { setListening(false); }
  };

  const saveKey = async () => {
    const k = keyInput.trim();
    if (k.length < 10) { Alert.alert('Invalid Key', 'Please paste your Gemini API key.'); return; }
    await AsyncStorage.setItem('nova_api_key', k);
    setApiKey(k); setKeyInput(''); setShowKeyModal(false);
  };

  const toggleTts = async () => {
    const next = !ttsEnabled;
    setTtsEnabled(next);
    if (!next) stopSpeaking();
    await AsyncStorage.setItem('nova_tts', next ? '1' : '0');
  };

  const setAndSavePersonality = async (p: NovaPersonality) => {
    setPersonality(p);
    setShowPersonality(false);
    await AsyncStorage.setItem('nova_personality', p);
    try { await Haptics.selectionAsync(); } catch {}
  };

  const clearChat = () =>
    Alert.alert('Clear conversation?', 'All messages will be erased.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => {
        setMessages([]); setStreamingText(''); setIsStreaming(false); stopSpeaking();
      }},
    ]);

  const clearMemoryConfirm = () =>
    Alert.alert('Clear Memory?', "N.O.V.A will forget everything she knows about you.", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        await clearAllMemories();
        setMemories([]);
      }},
    ]);

  const needsKey = keyLoaded && (!apiKey || apiKey === NOVA_API_KEY_PLACEHOLDER);

  // ── ORB
  const Orb = ({ size = 110 }: { size?: number }) => (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ position:'absolute', width:size, height:size, borderRadius:size/2, borderWidth:1.5, borderColor:accentColor, borderStyle:'dashed', transform:[{rotate:spin}], opacity:glowAnim }} />
      <Animated.View style={{ position:'absolute', width:size*0.72, height:size*0.72, borderRadius:size*0.36, borderWidth:1, borderColor:ACCENT2, transform:[{rotate:spinReverse}], opacity:glowAnim }} />
      <Animated.View style={{ width:size*0.52, height:size*0.52, borderRadius:size*0.26, backgroundColor:'rgba(125,249,255,0.1)', borderWidth:2, borderColor:accentColor, alignItems:'center', justifyContent:'center', transform:[{scale:pulseAnim}], shadowColor:accentColor, shadowOpacity:0.9, shadowRadius:20, shadowOffset:{width:0,height:0} }}>
        <View style={{ width:size*0.22, height:size*0.22, borderRadius:size*0.11, backgroundColor:accentColor, shadowColor:accentColor, shadowOpacity:1, shadowRadius:12, shadowOffset:{width:0,height:0} }} />
      </Animated.View>
    </View>
  );

  // ── WAVEFORM
  const Waveform = () => (
    <View style={{ flexDirection:'row', alignItems:'center', gap:4, height:32 }}>
      {waveAnims.map((a, i) => (
        <Animated.View key={i} style={[s.wavebar, {
          transform: [{ scaleY: a }],
          backgroundColor: i % 2 === 0 ? accentColor : ACCENT2,
          opacity: listening ? 1 : (isSpeaking || isStreaming) ? 0.7 : 0.3,
        }]} />
      ))}
    </View>
  );

  // ── MEMORY PANEL
  const MemoryPanel = () => (
    <View style={[s.card, { margin:14, gap:10 }]}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={s.cardTitle}>🧠 N.O.V.A's Memory ({memories.length})</Text>
        <View style={{ flexDirection:'row', gap:12 }}>
          <Pressable onPress={clearMemoryConfirm}><Text style={{ color:'rgba(255,80,80,0.7)', fontSize:12 }}>Clear All</Text></Pressable>
          <Pressable onPress={() => setShowMemory(false)}><Ionicons name="close" size={18} color={accentColor} /></Pressable>
        </View>
      </View>
      {memories.length === 0 ? (
        <Text style={{ color:'rgba(125,249,255,0.4)', fontSize:13, textAlign:'center', paddingVertical:10 }}>
          No memories yet. N.O.V.A will remember what you tell her.{`\n`}Try: "Remember I'm working on X"
        </Text>
      ) : (
        <ScrollView style={{ maxHeight:200 }}>
          {memories.map(m => (
            <View key={m.id} style={{ paddingVertical:6, borderBottomWidth:1, borderBottomColor:'rgba(125,249,255,0.08)' }}>
              <Text style={{ color:'rgba(125,249,255,0.35)', fontSize:10, marginBottom:2 }}>{m.category.toUpperCase()} · {new Date(m.timestamp).toLocaleDateString()}</Text>
              <Text style={{ color:'rgba(200,245,255,0.8)', fontSize:13 }}>{m.content}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  // ── PERSONALITY PICKER
  const PersonalityPicker = () => (
    <View style={[s.card, { margin:14, gap:8 }]}>
      <Text style={[s.cardTitle, { marginBottom:4 }]}>🎭 Personality Mode</Text>
      {(Object.keys(PERSONALITY_CONFIG) as NovaPersonality[]).map(p => (
        <Pressable key={p} onPress={() => setAndSavePersonality(p)}
          style={[s.personalityBtn, personality === p && { borderColor: PERSONALITY_CONFIG[p].color, backgroundColor: `${PERSONALITY_CONFIG[p].color}15` }]}>
          <Text style={{ fontSize:18 }}>{PERSONALITY_CONFIG[p].icon}</Text>
          <View style={{ flex:1 }}>
            <Text style={{ color: PERSONALITY_CONFIG[p].color, fontWeight:'700', fontSize:14 }}>{PERSONALITY_CONFIG[p].label}</Text>
          </View>
          {personality === p && <Ionicons name="checkmark-circle" size={18} color={PERSONALITY_CONFIG[p].color} />}
        </Pressable>
      ))}
      <Pressable onPress={() => setShowPersonality(false)} style={{ alignItems:'center', paddingTop:4 }}>
        <Text style={{ color:'rgba(125,249,255,0.4)', fontSize:13 }}>Close</Text>
      </Pressable>
    </View>
  );

  // ── KEY SETUP
  if (needsKey || showKeyModal) return (
    <View style={[s.fill,{backgroundColor:BG,alignItems:'center',justifyContent:'center',padding:24,gap:18}]}>
      <StatusBar barStyle="light-content" />
      <Orb size={120} />
      <Text style={s.novaTitle}>N.O.V.A</Text>
      <Text style={s.novaSub}>Neural Omniscient Virtual Agent</Text>
      <View style={[s.card,{width:'100%',gap:14}]}>
        <Text style={[s.cardTitle,{textAlign:'center'}]}>🔑 Activate N.O.V.A</Text>
        <Text style={[s.cardSub,{textAlign:'center'}]}>
          N.O.V.A runs on Google Gemini Flash{`\n`}Free · 24/7 · No credit card needed.{`\n`}Get your key in 30 seconds:
        </Text>
        <Pressable onPress={()=>Linking.openURL('https://aistudio.google.com/app/apikey')} style={s.linkBtn}>
          <Ionicons name="open-outline" size={14} color={ACCENT} />
          <Text style={{color:ACCENT,fontSize:13,fontWeight:'700'}}>aistudio.google.com/app/apikey</Text>
        </Pressable>
        <TextInput style={s.keyInput} value={keyInput} onChangeText={setKeyInput}
          placeholder="Paste your Gemini API key here..."
          placeholderTextColor="rgba(125,249,255,0.3)" autoCapitalize="none" autoCorrect={false}
        />
        <Pressable onPress={saveKey} style={s.activateBtn}>
          <Text style={s.activateBtnText}>Activate N.O.V.A ⚡</Text>
        </Pressable>
        {showKeyModal && (
          <Pressable onPress={()=>setShowKeyModal(false)}>
            <Text style={{color:'rgba(125,249,255,0.4)',textAlign:'center',fontSize:13}}>Cancel</Text>
          </Pressable>
        )}
      </View>
      <Text style={{color:'rgba(125,249,255,0.25)',fontSize:11,textAlign:'center'}}>Key saved locally on-device only.</Text>
    </View>
  );

  // ── MAIN
  return (
    <KeyboardAvoidingView style={[s.fill,{backgroundColor:BG}]} behavior={Platform.OS==='ios'?'padding':'height'} keyboardVerticalOffset={0}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
          <Orb size={36} />
          <View>
            <Text style={[s.headerTitle, { color: accentColor }]}>N.O.V.A</Text>
            <Text style={s.headerStatus}>
              {!isOnline ? '🔴 Offline' : listening ? '🎤 Listening...' : thinking ? '● Processing...' : isStreaming ? '● Streaming...' : isSpeaking ? '🔊 Speaking...' : `● ${PERSONALITY_CONFIG[personality].label} Mode`}
            </Text>
          </View>
        </View>
        <View style={{flexDirection:'row',gap:14,alignItems:'center'}}>
          <Pressable onPress={() => { setShowMemory(!showMemory); setShowPersonality(false); }}>
            <Ionicons name="brain-outline" size={20} color={memories.length > 0 ? accentColor : 'rgba(125,249,255,0.3)'} />
          </Pressable>
          <Pressable onPress={() => { setShowPersonality(!showPersonality); setShowMemory(false); }}>
            <Text style={{ fontSize:16 }}>{PERSONALITY_CONFIG[personality].icon}</Text>
          </Pressable>
          <Pressable onPress={toggleTts}>
            <Ionicons name={ttsEnabled ? 'volume-high-outline' : 'volume-mute-outline'} size={20} color={ttsEnabled ? accentColor : 'rgba(125,249,255,0.3)'} />
          </Pressable>
          <Pressable onPress={()=>setShowKeyModal(true)}>
            <Ionicons name="key-outline" size={20} color="rgba(125,249,255,0.5)" />
          </Pressable>
          <Pressable onPress={clearChat}>
            <Ionicons name="trash-outline" size={20} color="rgba(125,249,255,0.5)" />
          </Pressable>
        </View>
      </View>

      {/* Panels */}
      {showMemory && <MemoryPanel />}
      {showPersonality && <PersonalityPicker />}

      {/* Offline banner */}
      {!isOnline && (
        <View style={s.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={14} color="#FF6B6B" />
          <Text style={{ color:'#FF6B6B', fontSize:12, marginLeft:6 }}>Offline — tap to retry</Text>
          <Pressable onPress={() => setIsOnline(true)} style={{ marginLeft:'auto' }}>
            <Text style={{ color:'#FF6B6B', fontSize:12, fontWeight:'700' }}>Retry</Text>
          </Pressable>
        </View>
      )}

      {/* Messages */}
      <ScrollView ref={scrollRef} style={{flex:1}} contentContainerStyle={{padding:14,paddingBottom:6,gap:10}}
        onContentSizeChange={()=>scrollRef.current?.scrollToEnd({animated:true})} keyboardShouldPersistTaps="handled">

        {messages.length===0 && !isStreaming && (
          <View style={{alignItems:'center',paddingTop:20,gap:10}}>
            <Orb size={140} />
            <Text style={[s.novaTitle,{fontSize:22,marginTop:4}]}>Good evening.</Text>
            <Text style={{color:'rgba(125,249,255,0.5)',fontSize:13,textAlign:'center',lineHeight:21,maxWidth:290}}>
              I'm N.O.V.A — your Neural Omniscient Virtual Agent.{`\n`}
              {memories.length > 0 ? `I remember ${memories.length} thing${memories.length > 1 ? 's' : ''} about you.` : 'Ask me anything. I remember everything you tell me.'}
              {`\n`}Tap the mic to speak. I'm always online.
            </Text>
            {memories.length > 0 && (
              <Pressable onPress={() => setShowMemory(true)} style={[s.chip, { borderColor: ACCENT2 }]}>
                <Text style={[s.chipText, { color: ACCENT2 }]}>🧠 {memories.length} memories stored</Text>
              </Pressable>
            )}
            <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:6,marginTop:4}}>
              {['🧠 World Knowledge','🎤 Voice Commands','🔊 Speaks Replies','💬 Deep Conversations','🌐 Always Online','💻 Code & Debug','📐 Math & Science','✍️ Write & Analyze'].map(c=>(
                <View key={c} style={[s.cap]}><Text style={s.capText}>{c}</Text></View>
              ))}
            </View>
            <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:7,marginTop:8}}>
              {QUICK_PROMPTS.map(q=>(
                <Pressable key={q.label} onPress={()=>send(q.text)} style={s.chip}>
                  <Text style={s.chipText}>{q.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {messages.map(msg=>(
          <View key={msg.id} style={[s.msgRow, msg.role==='user'?s.rowUser:s.rowAssist]}>
            {msg.role==='assistant' && <View style={s.dot}><View style={s.dotInner}/></View>}
            <View style={[s.bubble, msg.role==='user'?s.bubbleUser:s.bubbleAssist, {maxWidth:width*0.8}]}>
              <Text style={[s.msgText, msg.role==='user'?s.msgUser:s.msgAssist]}>{msg.content}</Text>
              <Text style={s.time}>{new Date(msg.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</Text>
            </View>
          </View>
        ))}

        {/* Streaming live text */}
        {isStreaming && streamingText.length > 0 && (
          <View style={[s.msgRow,s.rowAssist]}>
            <View style={s.dot}><View style={[s.dotInner,{backgroundColor:'#FFD700'}]}/></View>
            <View style={[s.bubble,s.bubbleAssist,{maxWidth:width*0.8}]}>
              <Text style={[s.msgText,s.msgAssist]}>{streamingText}<Text style={{color:accentColor}}>▌</Text></Text>
              <View style={{ marginTop:6 }}><Waveform /></View>
            </View>
          </View>
        )}

        {thinking && !isStreaming && (
          <View style={[s.msgRow,s.rowAssist]}>
            <View style={s.dot}><View style={[s.dotInner,{backgroundColor:'#FFD700'}]}/></View>
            <View style={[s.bubble,s.bubbleAssist,{flexDirection:'row',alignItems:'center',gap:10}]}>
              <ActivityIndicator size="small" color={accentColor} />
              <Text style={[s.msgText,s.msgAssist,{opacity:0.5}]}>N.O.V.A is thinking…</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Voice listening overlay */}
      {listening && (
        <View style={s.voiceOverlay}>
          <Waveform />
          <Text style={s.voiceLive}>{voiceText || 'Listening…'}</Text>
          <Text style={{color:'rgba(125,249,255,0.4)',fontSize:12}}>Tap mic to send</Text>
        </View>
      )}

      {/* Speaking indicator */}
      {isSpeaking && !listening && (
        <View style={s.speakBar}>
          <Waveform />
          <Text style={{color:accentColor,fontSize:12,fontWeight:'600',marginLeft:8}}>N.O.V.A is speaking</Text>
          <Pressable onPress={stopSpeaking} style={{marginLeft:'auto'}}>
            <Ionicons name="stop-circle-outline" size={22} color={accentColor} />
          </Pressable>
        </View>
      )}

      {/* Quick chips */}
      {messages.length>0 && !thinking && !isStreaming && !listening && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{maxHeight:44,marginBottom:2}} contentContainerStyle={{paddingHorizontal:12,gap:8,alignItems:'center'}}>
          {QUICK_PROMPTS.slice(0,6).map(q=>(
            <Pressable key={q.label} onPress={()=>send(q.text)} style={[s.chip,{paddingVertical:6}]}>
              <Text style={[s.chipText,{fontSize:11}]}>{q.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Input bar */}
      <View style={s.inputBar}>
        <Animated.View style={{transform:[{scale:voicePulse}]}}>
          <Pressable onPress={toggleVoice} style={[s.voiceBtn, { borderColor: accentColor }, listening && { backgroundColor: accentColor }]}>
            <Ionicons name={listening ? 'stop' : 'mic'} size={20} color={listening ? BG : accentColor} />
          </Pressable>
        </Animated.View>
        <TextInput ref={inputRef} style={s.input} value={input} onChangeText={setInput}
          placeholder={listening ? 'Listening…' : 'Ask N.O.V.A anything...'}
          placeholderTextColor="rgba(125,249,255,0.28)" multiline maxLength={3000}
          returnKeyType="send" onSubmitEditing={()=>send()} blurOnSubmit={false}
        />
        <Pressable onPress={()=>send()} style={[s.sendBtn,{backgroundColor:accentColor},(!input.trim()||thinking||isStreaming)&&{opacity:0.3}]} disabled={!input.trim()||thinking||isStreaming}>
          <Ionicons name="send" size={17} color={BG} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  fill:           { flex:1 },
  card:           { backgroundColor:SURFACE, borderWidth:1, borderColor:BORDER, borderRadius:20, padding:20 },
  cardTitle:      { color:ACCENT, fontSize:17, fontWeight:'800' },
  cardSub:        { color:'rgba(125,249,255,0.5)', fontSize:13, lineHeight:21 },
  linkBtn:        { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(125,249,255,0.08)', borderWidth:1, borderColor:BORDER, borderRadius:10, paddingHorizontal:12, paddingVertical:9, justifyContent:'center' },
  keyInput:       { backgroundColor:'rgba(125,249,255,0.07)', borderWidth:1, borderColor:BORDER, borderRadius:12, paddingHorizontal:14, paddingVertical:12, color:ACCENT, fontSize:13, fontFamily:'monospace' },
  activateBtn:    { backgroundColor:ACCENT, borderRadius:14, paddingVertical:14, alignItems:'center' },
  activateBtnText:{ color:BG, fontWeight:'900', fontSize:15, letterSpacing:1 },
  novaTitle:      { color:ACCENT, fontSize:30, fontWeight:'900', letterSpacing:10 },
  novaSub:        { color:'rgba(125,249,255,0.4)', fontSize:11, letterSpacing:2.5, marginTop:-12 },
  header:         { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingTop:58, paddingBottom:10, borderBottomWidth:1, borderBottomColor:'rgba(125,249,255,0.1)', backgroundColor:BG },
  headerTitle:    { color:ACCENT, fontSize:15, fontWeight:'900', letterSpacing:5 },
  headerStatus:   { color:'rgba(125,249,255,0.45)', fontSize:10, letterSpacing:1 },
  cap:            { backgroundColor:'rgba(185,128,255,0.08)', borderWidth:1, borderColor:'rgba(185,128,255,0.2)', borderRadius:20, paddingHorizontal:10, paddingVertical:4 },
  capText:        { color:ACCENT2, fontSize:11, fontWeight:'600' },
  chip:           { backgroundColor:'rgba(125,249,255,0.07)', borderWidth:1, borderColor:BORDER, borderRadius:20, paddingHorizontal:13, paddingVertical:7 },
  chipText:       { color:ACCENT, fontSize:12, fontWeight:'600' },
  msgRow:         { flexDirection:'row', gap:8 },
  rowUser:        { justifyContent:'flex-end', alignSelf:'flex-end' },
  rowAssist:      { justifyContent:'flex-start', alignSelf:'flex-start' },
  dot:            { width:22, alignItems:'center', paddingTop:6 },
  dotInner:       { width:10, height:10, borderRadius:5, backgroundColor:ACCENT, shadowColor:ACCENT, shadowOpacity:0.9, shadowRadius:8, shadowOffset:{width:0,height:0} },
  bubble:         { borderRadius:18, padding:12, paddingBottom:8 },
  bubbleUser:     { backgroundColor:ACCENT, borderBottomRightRadius:4 },
  bubbleAssist:   { backgroundColor:SURFACE, borderWidth:1, borderColor:BORDER, borderBottomLeftRadius:4 },
  msgText:        { fontSize:14, lineHeight:22 },
  msgUser:        { color:BG, fontWeight:'500' },
  msgAssist:      { color:'rgba(200,245,255,0.92)' },
  time:           { fontSize:10, opacity:0.35, marginTop:4, color:ACCENT },
  voiceBtn:       { width:42, height:42, borderRadius:21, backgroundColor:'rgba(125,249,255,0.1)', borderWidth:1.5, borderColor:ACCENT, alignItems:'center', justifyContent:'center' },
  voiceOverlay:   { backgroundColor:'rgba(6,11,20,0.97)', borderTopWidth:1, borderTopColor:BORDER, paddingVertical:14, paddingHorizontal:20, alignItems:'center', gap:6 },
  voiceLive:      { color:ACCENT, fontSize:15, fontWeight:'600', textAlign:'center', minHeight:22 },
  speakBar:       { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:10, borderTopWidth:1, borderTopColor:BORDER, backgroundColor:'rgba(6,11,20,0.97)' },
  wavebar:        { width:4, height:24, borderRadius:3 },
  inputBar:       { flexDirection:'row', alignItems:'flex-end', gap:10, paddingHorizontal:14, paddingVertical:12, borderTopWidth:1, borderTopColor:'rgba(125,249,255,0.1)', backgroundColor:BG },
  input:          { flex:1, backgroundColor:'rgba(125,249,255,0.06)', borderWidth:1, borderColor:'rgba(125,249,255,0.16)', borderRadius:16, paddingHorizontal:14, paddingVertical:10, color:'rgba(200,245,255,0.92)', fontSize:14, maxHeight:120, minHeight:42 },
  sendBtn:        { width:42, height:42, borderRadius:21, backgroundColor:ACCENT, alignItems:'center', justifyContent:'center', shadowColor:ACCENT, shadowOpacity:0.6, shadowRadius:12, shadowOffset:{width:0,height:0} },
  personalityBtn: { flexDirection:'row', alignItems:'center', gap:12, padding:12, borderRadius:12, borderWidth:1, borderColor:BORDER },
  offlineBanner:  { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:8, backgroundColor:'rgba(255,107,107,0.1)', borderBottomWidth:1, borderBottomColor:'rgba(255,107,107,0.2)' },
});
