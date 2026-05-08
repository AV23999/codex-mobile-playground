import { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import chatService from '../../src/services/chatService';
import { initiatePayment } from '../../src/services/paymentService';

export default function ChatDetail() {
  const { id } = useLocalSearchParams();
  const { themeMode, user } = useAppContext();
  const c = NovaColors[themeMode];
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [showPay, setShowPay] = useState(false);
  const flatRef = useRef<any>(null);

  const chatName = id === '1' ? 'Alice' : id === '2' ? 'Bob' : 'Carol';

  useEffect(() => {
    chatService.getMessages(id as string).then(setMessages);
  }, []);

  const send = async () => {
    if (!text.trim()) return;
    const msg = await chatService.sendMessage(id as string, text, user?.username || 'me');
    setMessages(prev => [...prev, msg]);
    setText('');
    setTimeout(() => flatRef.current?.scrollToEnd(), 100);
  };

  const handlePay = async () => {
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Enter a valid payment amount.');
      return;
    }
    setShowPay(false);
    const result = await initiatePayment(user?.username || 'me', chatName, amount, 'USD');
    if (result.success) {
      const msg = {
        id: Date.now().toString(),
        text: `💸 Sent $${amount.toFixed(2)} via Nova Pay\nTx: ${result.transaction.id}\n🔒 HMAC-signed · Biometric authorized`,
        sender: user?.username || 'me',
        timestamp: new Date().toISOString(),
        isPayment: true,
      };
      setMessages(prev => [...prev, msg]);
      Alert.alert('Payment Sent! ✅', `$${amount.toFixed(2)} sent to ${chatName}\nTransaction ID: ${result.transaction.id}`);
    } else {
      Alert.alert('Payment Failed', result.reason);
    }
    setPayAmount('');
  };

  return (
    <KeyboardAvoidingView style={[s.container, { backgroundColor: c.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <Pressable onPress={() => router.back()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color={c.text} />
        </Pressable>
        <View style={[s.headerAvatar, { backgroundColor: c.accent + '33' }]}>
          <Text style={[s.headerAvatarText, { color: c.accent }]}>{chatName[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.headerName, { color: c.text }]}>{chatName}</Text>
          <View style={s.e2eRow}>
            <Ionicons name="lock-closed" size={10} color={c.success} />
            <Text style={[s.e2eLabel, { color: c.success }]}>End-to-end encrypted</Text>
          </View>
        </View>
        <Pressable onPress={() => setShowPay(!showPay)} style={[s.payBtn, { backgroundColor: c.accent }]}>
          <Ionicons name="card" size={14} color="#fff" />
          <Text style={s.payBtnText}>Pay</Text>
        </Pressable>
      </View>

      {/* Pay panel */}
      {showPay && (
        <View style={[s.payPanel, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text style={[s.payTitle, { color: c.text }]}>💳 Nova Pay — Send Money</Text>
          <Text style={[s.paySub, { color: c.mutedText }]}>Biometric required · PCI-DSS compliant · HMAC-signed</Text>
          <View style={s.payRow}>
            <Text style={[s.paySymbol, { color: c.text }]}>$</Text>
            <TextInput
              style={[s.payInput, { color: c.text, borderColor: c.border, backgroundColor: c.background }]}
              value={payAmount}
              onChangeText={setPayAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={c.mutedText}
            />
            <Pressable onPress={handlePay} style={[s.paySend, { backgroundColor: c.accent }]}>
              <Ionicons name="send" size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        onContentSizeChange={() => flatRef.current?.scrollToEnd()}
        renderItem={({ item }) => {
          const isMe = item.sender === (user?.username || 'me');
          return (
            <View style={[s.msgWrap, isMe ? s.msgRight : s.msgLeft]}>
              <View style={[
                s.bubble,
                isMe
                  ? { backgroundColor: c.accent }
                  : { backgroundColor: c.surface, borderColor: c.border, borderWidth: 1 },
                item.isPayment && { backgroundColor: c.success + '22', borderColor: c.success, borderWidth: 1 },
              ]}>
                <Text style={[
                  s.msgText,
                  { color: isMe ? '#fff' : c.text },
                  item.isPayment && { color: c.success },
                ]}>{item.text}</Text>
                <View style={s.msgMeta}>
                  <Text style={[s.msgTime, { color: isMe ? 'rgba(255,255,255,0.6)' : c.mutedText }]}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Ionicons name="lock-closed" size={9} color={isMe ? 'rgba(255,255,255,0.5)' : c.accent} />
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={[s.inputRow, { backgroundColor: c.surface, borderTopColor: c.border }]}>
        <TextInput
          style={[s.input, { color: c.text, backgroundColor: c.background, borderColor: c.border }]}
          value={text}
          onChangeText={setText}
          placeholder="Message..."
          placeholderTextColor={c.mutedText}
          multiline
        />
        <Pressable onPress={send} style={[s.sendBtn, { backgroundColor: c.accent }]}>
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingBottom: 12, paddingHorizontal: 16, gap: 10, borderBottomWidth: 1 },
  back: { padding: 4 },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  headerAvatarText: { fontWeight: '700', fontSize: 16 },
  headerName: { fontSize: 16, fontWeight: '600' },
  e2eRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 1 },
  e2eLabel: { fontSize: 11 },
  payBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99 },
  payBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  payPanel: { margin: 16, padding: 14, borderRadius: 14, borderWidth: 1, gap: 8 },
  payTitle: { fontSize: 15, fontWeight: '700' },
  paySub: { fontSize: 11 },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paySymbol: { fontSize: 20, fontWeight: '600' },
  payInput: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 18 },
  paySend: { padding: 12, borderRadius: 10 },
  msgWrap: { flexDirection: 'row' },
  msgRight: { justifyContent: 'flex-end' },
  msgLeft: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '78%', padding: 12, borderRadius: 16 },
  msgText: { fontSize: 15, lineHeight: 20 },
  msgMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: 'flex-end' },
  msgTime: { fontSize: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: 1 },
  input: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
