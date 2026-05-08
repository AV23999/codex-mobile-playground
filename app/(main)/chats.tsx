import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Share, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import NovaLogo from '../../components/NovaLogo';
import chatService from '../../src/services/chatService';
import { createInvite } from '../../src/services/inviteService';

export default function Chats() {
  const { themeMode, user } = useAppContext();
  const c = NovaColors[themeMode];
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    chatService.getChats().then(setChats);
  }, []);

  async function handleInvite() {
    const username = user?.username || 'user';
    const invite = createInvite(username, 48);
    try {
      await Share.share({
        message: `Join me on Nova Chat! Use my invite code: ${invite.code}\n\nOr tap the link: ${invite.link}\n\nExpires in 48 hours. \uD83D\uDD12 End-to-end encrypted.`,
        title: 'Invite to Nova Chat',
      });
    } catch (e) {
      Alert.alert('Invite', `Your invite code: ${invite.code}\nExpires in 48 hours.`);
    }
  }

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <NovaLogo size={32} />
          <Text style={[s.title, { color: c.text }]}>Nova Chat</Text>
        </View>
        <View style={s.headerRight}>
          <View style={[s.e2eBadge, { backgroundColor: c.success + '22', borderColor: c.success }]}>
            <Ionicons name="lock-closed" size={10} color={c.success} />
            <Text style={[s.e2eText, { color: c.success }]}>E2E</Text>
          </View>
          <Pressable onPress={handleInvite} style={[s.inviteBtn, { backgroundColor: c.accent }]}>
            <Ionicons name="person-add" size={14} color="#fff" />
            <Text style={s.inviteBtnText}>Invite</Text>
          </Pressable>
        </View>
      </View>

      {/* Security banner */}
      <View style={[s.secBanner, { backgroundColor: c.accent + '15', borderColor: c.accent + '40' }]}>
        <Ionicons name="shield-checkmark" size={14} color={c.accent} />
        <Text style={[s.secText, { color: c.accent }]}>Military-grade AES-256-GCM encryption \u00b7 Perfect Forward Secrecy</Text>
      </View>

      {/* Chat list */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/chats/${item.id}`)}
            style={[s.row, { backgroundColor: c.surface, borderColor: c.border }]}
          >
            <View style={[s.avatar, { backgroundColor: c.accent + '33' }]}>
              <Text style={[s.avatarText, { color: c.accent }]}>{item.name[0]}</Text>
            </View>
            <View style={s.rowMid}>
              <Text style={[s.name, { color: c.text }]}>{item.name}</Text>
              <Text style={[s.lastMsg, { color: c.mutedText }]} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <View style={s.rowRight}>
              <View style={s.statusRow}>
                <View style={[s.dot, { backgroundColor: item.online ? c.success : c.mutedText }]} />
                <Text style={[s.statusText, { color: c.mutedText }]}>{item.online ? 'Online' : 'Offline'}</Text>
              </View>
              <Ionicons name="lock-closed" size={10} color={c.accent} style={{ marginTop: 4 }} />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 24, fontWeight: '700' },
  e2eBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 99, borderWidth: 1 },
  e2eText: { fontSize: 10, fontWeight: '700' },
  inviteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99 },
  inviteBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  secBanner: { marginHorizontal: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 8, borderWidth: 1 },
  secText: { fontSize: 11, fontWeight: '500', flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1, borderRadius: 14, marginBottom: 10, marginHorizontal: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: '700' },
  rowMid: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  lastMsg: { fontSize: 13, marginTop: 2 },
  rowRight: { alignItems: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 99 },
  statusText: { fontSize: 12 },
});
