import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { getFeaturedContent, createWatchRoom, joinWatchRoom, togglePlayback, getActiveRoom, leaveRoom } from '../../src/services/syncWatchService';
import { hasFeature } from '../../src/services/premiumService';

export default function Watch() {
  const { themeMode, user } = useAppContext();
  const c = NovaColors[themeMode];
  const [room, setRoom] = useState<any>(getActiveRoom());
  const [joinCode, setJoinCode] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<any>(null);
  const username = user?.username || 'You';
  const locked = !hasFeature('Sync Watch');

  useEffect(() => {
    if (room?.isPlaying) {
      timer.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else clearInterval(timer.current);
    return () => clearInterval(timer.current);
  }, [room?.isPlaying]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}` : `${m}:${String(sec).padStart(2,'0')}`;
  };

  const start = (item: any) => {
    if (locked) { Alert.alert('Nova Elite Required', 'Sync Watch needs Nova Elite — $19.99 one-time.'); return; }
    setRoom({ ...createWatchRoom(item, username) });
    setElapsed(0);
  };

  const handleJoin = () => {
    const r = joinWatchRoom(joinCode.trim().toUpperCase(), username);
    if (r) { setRoom({ ...r }); setJoinCode(''); }
    else Alert.alert('Room not found', 'Check the code and try again.');
  };

  const handleToggle = () => { const r = togglePlayback(); if (r) setRoom({ ...r }); };

  const handleLeave = () => { leaveRoom(username); setRoom(null); setElapsed(0); clearInterval(timer.current); };

  return (
    <ScrollView style={[s.root, { backgroundColor: c.background }]} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={[s.title, { color: c.text }]}>Sync Watch 🎬</Text>
      <Text style={[s.sub, { color: c.mutedText }]}>Watch together in perfect sync</Text>

      {room ? (
        <View style={[s.roomCard, { backgroundColor: c.accent + '15', borderColor: c.accent + '40' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' }} />
            <Text style={[{ fontSize: 16, fontWeight: '700', flex: 1 }, { color: c.text }]}>{room.content.title}</Text>
          </View>
          <Text style={[{ fontSize: 13 }, { color: c.mutedText }]}>Room: <Text style={{ color: c.accent, fontWeight: '700' }}>{room.id}</Text> · Share this code</Text>
          <Text style={[{ fontSize: 13 }, { color: c.mutedText }]}>👥 {room.participants.join(', ')}</Text>
          <View style={[s.seekBar, { backgroundColor: c.border }]}>
            <View style={[s.seekFill, { backgroundColor: c.accent, width: `${Math.min((elapsed / room.content.duration) * 100, 100)}%` as any }]} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <Text style={[{ fontSize: 13, fontVariant: ['tabular-nums'] }, { color: c.mutedText }]}>{fmt(elapsed)}</Text>
            <Pressable onPress={handleToggle} style={[s.playBtn, { backgroundColor: c.accent }]}>
              <Ionicons name={room.isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
            </Pressable>
            <Text style={[{ fontSize: 13, fontVariant: ['tabular-nums'] }, { color: c.mutedText }]}>{fmt(room.content.duration)}</Text>
          </View>
          <Pressable onPress={handleLeave} style={[s.leaveBtn, { borderColor: c.border }]}>
            <Text style={{ color: c.mutedText, fontSize: 13 }}>Leave room</Text>
          </Pressable>
        </View>
      ) : (
        <View style={[s.joinRow, { backgroundColor: c.surface, borderColor: c.border }]}>
          <TextInput style={[s.joinInput, { color: c.text, borderColor: c.border }]} placeholder="Enter room code..." placeholderTextColor={c.mutedText} value={joinCode} onChangeText={setJoinCode} autoCapitalize="characters" />
          <Pressable onPress={handleJoin} style={[s.joinBtn, { backgroundColor: c.accent }]}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Join</Text>
          </Pressable>
        </View>
      )}

      <Text style={[s.sectionTitle, { color: c.text }]}>Featured</Text>
      {getFeaturedContent().map((item: any) => (
        <Pressable key={item.id} onPress={() => start(item)} style={[s.contentCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Image source={{ uri: item.thumbnail }} style={s.thumb} resizeMode="cover" />
          {locked && (
            <View style={s.lockOverlay}>
              <Ionicons name="lock-closed" size={16} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Elite</Text>
            </View>
          )}
          <View style={{ padding: 12, gap: 6 }}>
            <Text style={[{ fontSize: 15, fontWeight: '600' }, { color: c.text }]}>{item.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[s.platformBadge, { backgroundColor: c.accent + '22' }]}>
                <Text style={[{ fontSize: 11, fontWeight: '600' }, { color: c.accent }]}>{item.platform}</Text>
              </View>
              <Text style={[{ fontSize: 12 }, { color: c.mutedText }]}>{fmt(item.duration)}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  title: { fontSize: 26, fontWeight: '800', paddingHorizontal: 20, paddingTop: 60, letterSpacing: -0.5 },
  sub: { fontSize: 14, paddingHorizontal: 20, marginBottom: 16, marginTop: 4 },
  roomCard: { marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 16, borderWidth: 1.5, gap: 10 },
  seekBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  seekFill: { height: 4, borderRadius: 2 },
  playBtn: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  leaveBtn: { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 99, borderWidth: 1 },
  joinRow: { marginHorizontal: 16, marginBottom: 16, flexDirection: 'row', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1 },
  joinInput: { flex: 1, fontSize: 15, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  joinBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginBottom: 12 },
  contentCard: { marginHorizontal: 16, marginBottom: 12, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  thumb: { width: '100%', height: 180 },
  lockOverlay: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.65)', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  platformBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
});
