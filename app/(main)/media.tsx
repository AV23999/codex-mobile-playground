import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { hasFeature } from '../../src/services/premiumService';

const SPOTIFY_TRACKS = [
  { id: 'sp_1', title: 'Blinding Lights', artist: 'The Weeknd', cover: 'https://picsum.photos/seed/weeknd1/60/60', duration: '3:22' },
  { id: 'sp_2', title: 'As It Was', artist: 'Harry Styles', cover: 'https://picsum.photos/seed/harry1/60/60', duration: '2:37' },
  { id: 'sp_3', title: 'Flowers', artist: 'Miley Cyrus', cover: 'https://picsum.photos/seed/miley1/60/60', duration: '3:21' },
  { id: 'sp_4', title: 'Anti-Hero', artist: 'Taylor Swift', cover: 'https://picsum.photos/seed/tswift1/60/60', duration: '3:20' },
];

const YOUTUBE_VIDEOS = [
  { id: 'yt_1', title: 'Lo-Fi Beats to Study/Relax', channel: 'ChilledCow', thumb: 'https://picsum.photos/seed/lofi1/400/220', views: '102M', url: 'https://youtube.com' },
  { id: 'yt_2', title: 'React Native Full Course 2026', channel: 'Traversy Media', thumb: 'https://picsum.photos/seed/rnative1/400/220', views: '1.2M', url: 'https://youtube.com' },
  { id: 'yt_3', title: 'Midnight Rain — Live Performance', channel: 'Taylor Swift', thumb: 'https://picsum.photos/seed/swiftlive1/400/220', views: '45M', url: 'https://youtube.com' },
];

export default function Media() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [tab, setTab] = useState<'spotify' | 'youtube'>('spotify');
  const [playing, setPlaying] = useState<string | null>(null);
  const spotifyLocked = !hasFeature('Spotify');
  const youtubeLocked = !hasFeature('YouTube');

  const onSpotify = (track: any) => {
    if (spotifyLocked) { Alert.alert('Nova Plus Required', 'Connect Spotify with Nova Plus — $9.99 one-time.'); return; }
    setPlaying(track.id);
    Linking.openURL('spotify://');
  };

  const onYoutube = (video: any) => {
    if (youtubeLocked) { Alert.alert('Nova Plus Required', 'Connect YouTube with Nova Plus — $9.99 one-time.'); return; }
    Linking.openURL(video.url);
  };

  return (
    <ScrollView style={[s.root, { backgroundColor: c.background }]} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={[s.title, { color: c.text }]}>Media Hub 🎵</Text>

      <View style={[s.tabs, { backgroundColor: c.surface, borderColor: c.border }]}>
        {(['spotify', 'youtube'] as const).map(t => (
          <Pressable key={`tab_${t}`} onPress={() => setTab(t)} style={[s.tab, tab === t && { backgroundColor: c.accent }]}>
            <Ionicons name={t === 'spotify' ? 'musical-notes' : 'logo-youtube'} size={16} color={tab === t ? '#fff' : c.mutedText} />
            <Text style={[s.tabText, { color: tab === t ? '#fff' : c.mutedText }]}>{t === 'spotify' ? 'Spotify' : 'YouTube'}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'spotify' && (
        <View style={s.section}>
          <View style={[s.banner, { backgroundColor: '#1DB95418', borderColor: '#1DB95435' }]}>
            <View style={[s.bannerIcon, { backgroundColor: '#1DB954' }]}>
              <Ionicons name="musical-notes" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[{ fontSize: 15, fontWeight: '700' }, { color: c.text }]}>Spotify</Text>
              <Text style={[{ fontSize: 12, marginTop: 2 }, { color: c.mutedText }]}>Share what you're listening to in chat</Text>
            </View>
            {spotifyLocked && (
              <View style={[s.lockPill, { backgroundColor: c.accent + '20', borderColor: c.accent }]}>
                <Text style={{ color: c.accent, fontSize: 10, fontWeight: '800' }}>PLUS</Text>
              </View>
            )}
          </View>
          {SPOTIFY_TRACKS.map(track => (
            <Pressable key={track.id} onPress={() => onSpotify(track)} style={[s.trackRow, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Image source={{ uri: track.cover }} style={s.cover} />
              <View style={{ flex: 1 }}>
                <Text style={[{ fontSize: 14, fontWeight: '600' }, { color: c.text }]}>{track.title}</Text>
                <Text style={[{ fontSize: 12, marginTop: 2 }, { color: c.mutedText }]}>{track.artist}</Text>
              </View>
              <Text style={[{ fontSize: 12 }, { color: c.mutedText }]}>{track.duration}</Text>
              {playing === track.id
                ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#1DB954' }} />
                : <Ionicons name={spotifyLocked ? 'lock-closed' : 'play-circle'} size={24} color={spotifyLocked ? c.mutedText : '#1DB954'} />}
            </Pressable>
          ))}
        </View>
      )}

      {tab === 'youtube' && (
        <View style={s.section}>
          <View style={[s.banner, { backgroundColor: '#FF000018', borderColor: '#FF000035' }]}>
            <View style={[s.bannerIcon, { backgroundColor: '#FF0000' }]}>
              <Ionicons name="logo-youtube" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[{ fontSize: 15, fontWeight: '700' }, { color: c.text }]}>YouTube</Text>
              <Text style={[{ fontSize: 12, marginTop: 2 }, { color: c.mutedText }]}>Share & watch videos directly in chat</Text>
            </View>
            {youtubeLocked && (
              <View style={[s.lockPill, { backgroundColor: c.accent + '20', borderColor: c.accent }]}>
                <Text style={{ color: c.accent, fontSize: 10, fontWeight: '800' }}>PLUS</Text>
              </View>
            )}
          </View>
          {YOUTUBE_VIDEOS.map(video => (
            <Pressable key={video.id} onPress={() => onYoutube(video)} style={[s.videoCard, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Image source={{ uri: video.thumb }} style={s.videoThumb} resizeMode="cover" />
              {youtubeLocked && (
                <View style={s.vidLock}>
                  <Ionicons name="lock-closed" size={16} color="#fff" />
                </View>
              )}
              <View style={{ padding: 12, gap: 4 }}>
                <Text style={[{ fontSize: 14, fontWeight: '600', lineHeight: 20 }, { color: c.text }]} numberOfLines={2}>{video.title}</Text>
                <Text style={[{ fontSize: 12 }, { color: c.mutedText }]}>{video.channel} · {video.views} views</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  title: { fontSize: 26, fontWeight: '800', paddingHorizontal: 20, paddingTop: 60, marginBottom: 16, letterSpacing: -0.5 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, borderRadius: 14, padding: 4, borderWidth: 1 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  tabText: { fontSize: 14, fontWeight: '600' },
  section: { paddingHorizontal: 16, gap: 10 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 4 },
  bannerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  lockPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99, borderWidth: 1 },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  cover: { width: 48, height: 48, borderRadius: 8 },
  videoCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  videoThumb: { width: '100%', height: 180 },
  vidLock: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.65)', padding: 6, borderRadius: 99 },
});
