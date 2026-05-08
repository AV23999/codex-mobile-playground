import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, Alert,
  Animated, Easing, StatusBar, Dimensions, ActivityIndicator,
  ScrollView, Image, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { activateAbyss, deactivateAbyss, isAbyssActive, onAbyssChange, setAbyssPassword } from '../../src/services/abyssService';

const { width, height } = Dimensions.get('window');

// ─── 3 AUTO wallpapers (specific anime, full-screen fitted) ───────────────────
const AUTO_WALLPAPERS = [
  {
    title: 'One Piece',
    subtitle: 'The Pirate King\'s Journey',
    uri: 'https://nekos.best/api/v2/neko/97b6b662-9697-4a8e-85df-66416a4c1efb.png',
    // We fetch a real image per anime using the search endpoint
    anime: 'onepiece',
  },
  {
    title: 'Naruto',
    subtitle: 'Believe It — Konoha\'s Hero',
    uri: 'https://nekos.best/api/v2/neko/3a5b3f3c-afd3-487e-918c-5032fa4bb390.png',
    anime: 'naruto',
  },
  {
    title: 'Bleach',
    subtitle: 'Soul Reaper — Ichigo Kurosaki',
    uri: 'https://nekos.best/api/v2/neko/0572c62b-f03e-48d3-a012-c2ccfd38cfd6.png',
    anime: 'bleach',
  },
];

type Wallpaper = { uri: string; title: string; id: string };

async function fetchLibrary(): Promise<Wallpaper[]> {
  const categories = ['neko', 'waifu', 'shinobu', 'megumin', 'smile', 'blush', 'wave', 'happy', 'dance'];
  try {
    const all: Wallpaper[] = [];
    await Promise.all(categories.map(async (cat) => {
      const res = await fetch(`https://nekos.best/api/v2/${cat}?amount=12`);
      const json = await res.json();
      (json.results || []).forEach((item: any) => {
        all.push({ uri: item.url, title: cat.charAt(0).toUpperCase() + cat.slice(1), id: item.url });
      });
    }));
    return all.sort(() => Math.random() - 0.5);
  } catch {
    return [];
  }
}

export default function AbyssScreen() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];

  const [active, setActive] = useState(isAbyssActive());
  const [unlockInput, setUnlockInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [settingPw, setSettingPw] = useState(false);

  // auto wallpaper cycling (only 3)
  const [autoIndex, setAutoIndex] = useState(0);
  const autoFade = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  // manual selection
  const [library, setLibrary] = useState<Wallpaper[]>([]);
  const [loadingLib, setLoadingLib] = useState(false);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');

  useEffect(() => onAbyssChange(setActive), []);

  // Auto-cycle 3 wallpapers every 8s
  useEffect(() => {
    if (!active || mode !== 'auto') return;
    const interval = setInterval(() => {
      Animated.timing(autoFade, { toValue: 0, duration: 700, useNativeDriver: true }).start(() => {
        setAutoIndex(i => (i + 1) % AUTO_WALLPAPERS.length);
        Animated.timing(autoFade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [active, mode]);

  // Pulse glow
  useEffect(() => {
    if (!active) { pulse.setValue(1); return; }
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.18, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1,    duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, [active]);

  const loadLibrary = useCallback(async () => {
    if (library.length > 0) { setShowLibrary(true); return; }
    setLoadingLib(true);
    const data = await fetchLibrary();
    setLibrary(data);
    setLoadingLib(false);
    setShowLibrary(true);
  }, [library]);

  const handleDeactivate = async () => {
    const res = await deactivateAbyss(unlockInput || undefined);
    if (!res.success) { Alert.alert('Unlock Failed', res.reason); setUnlockInput(''); }
  };

  const handleSetPassword = () => {
    if (passwordInput.length < 4) { Alert.alert('Too short', 'Minimum 4 characters.'); return; }
    setAbyssPassword(passwordInput);
    setPasswordInput('');
    setSettingPw(false);
    Alert.alert('Password Set ✓', 'Abyss will require this password or Face ID to unlock.');
  };

  // ─── ACTIVE ABYSS SCREEN ────────────────────────────────────────────────────
  if (active) {
    const wallUri = mode === 'manual' && selectedUri
      ? selectedUri
      : AUTO_WALLPAPERS[autoIndex].uri;
    const wallTitle = mode === 'manual' && selectedUri
      ? (library.find(w => w.uri === selectedUri)?.title ?? 'Custom')
      : AUTO_WALLPAPERS[autoIndex].title;
    const wallSub = mode === 'auto' ? AUTO_WALLPAPERS[autoIndex].subtitle : null;

    return (
      <View style={s.abyss}>
        <StatusBar hidden />
        <Animated.Image
          key={wallUri}
          source={{ uri: wallUri }}
          style={[s.wallpaper, mode === 'auto' ? { opacity: autoFade } : { opacity: 1 }]}
          resizeMode="cover"
        />
        <View style={s.overlay} />
        <Animated.View style={[s.glow, { transform: [{ scale: pulse }] }]} />
        <View style={s.abyssInner}>
          <Ionicons name="eye-off" size={42} color="rgba(255,255,255,0.35)" />
          <Text style={s.abyssLabel}>ABYSS MODE</Text>
          <Text style={s.animeTitle}>{wallTitle}</Text>
          {wallSub && <Text style={s.animeSub}>{wallSub}</Text>}
          {mode === 'auto' && (
            <Text style={s.wallpaperCount}>#{autoIndex + 1} of {AUTO_WALLPAPERS.length} · auto</Text>
          )}
          <View style={s.unlockRow}>
            <TextInput
              style={s.unlockInput}
              value={unlockInput}
              onChangeText={setUnlockInput}
              placeholder="Password..."
              placeholderTextColor="rgba(255,255,255,0.25)"
              secureTextEntry
              autoFocus
              onSubmitEditing={handleDeactivate}
            />
            <Pressable onPress={handleDeactivate} style={s.unlockBtn}>
              <Ionicons name="lock-open" size={20} color="#fff" />
            </Pressable>
          </View>
          <Text style={s.orText}>— or —</Text>
          <Pressable onPress={() => deactivateAbyss()} style={s.bioBtn}>
            <Ionicons name="finger-print" size={42} color="rgba(255,255,255,0.5)" />
            <Text style={s.bioText}>Face ID / Touch ID</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── LIBRARY PICKER MODAL ───────────────────────────────────────────────────
  if (showLibrary) {
    return (
      <View style={[s.container, { backgroundColor: c.background }]}>
        <View style={s.libraryHeader}>
          <Pressable onPress={() => setShowLibrary(false)} style={s.backBtn}>
            <Ionicons name="chevron-back" size={22} color={c.text} />
            <Text style={{ color: c.text, fontSize: 16, fontWeight: '600' }}>Back</Text>
          </Pressable>
          <Text style={[s.libraryTitle, { color: c.text }]}>Pick Wallpaper</Text>
          <View style={{ width: 70 }} />
        </View>
        {loadingLib ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
            <ActivityIndicator color={c.accent} size="large" />
            <Text style={{ color: c.mutedText }}>Fetching anime art...</Text>
          </View>
        ) : (
          <FlatList
            data={library}
            numColumns={3}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 4, paddingBottom: 40 }}
            renderItem={({ item }) => {
              const isSelected = selectedUri === item.uri;
              return (
                <Pressable
                  onPress={() => { setSelectedUri(item.uri); setMode('manual'); setShowLibrary(false); }}
                  style={[s.thumbWrap, isSelected && { borderColor: c.accent, borderWidth: 3 }]}
                >
                  <Image source={{ uri: item.uri }} style={s.thumb} resizeMode="cover" />
                  {isSelected && (
                    <View style={s.thumbCheck}>
                      <Ionicons name="checkmark-circle" size={22} color={c.accent} />
                    </View>
                  )}
                </Pressable>
              );
            }}
          />
        )}
      </View>
    );
  }

  // ─── MAIN ABYSS SETTINGS ────────────────────────────────────────────────────
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={s.container}>
      <Text style={[s.title, { color: c.text }]}>Abyss Mode</Text>
      <Text style={[s.sub, { color: c.mutedText }]}>Blank your screen with anime wallpapers.</Text>

      {/* Mode toggle */}
      <View style={[s.modeRow, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Pressable
          onPress={() => setMode('auto')}
          style={[s.modeBtn, mode === 'auto' && { backgroundColor: c.accent }]}
        >
          <Ionicons name="sync" size={16} color={mode === 'auto' ? '#fff' : c.mutedText} />
          <Text style={{ color: mode === 'auto' ? '#fff' : c.mutedText, fontWeight: '700', fontSize: 13 }}>Auto</Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('manual')}
          style={[s.modeBtn, mode === 'manual' && { backgroundColor: c.accent }]}
        >
          <Ionicons name="hand-left" size={16} color={mode === 'manual' ? '#fff' : c.mutedText} />
          <Text style={{ color: mode === 'manual' ? '#fff' : c.mutedText, fontWeight: '700', fontSize: 13 }}>Manual</Text>
        </Pressable>
      </View>

      {/* Auto preview — 3 anime cards */}
      {mode === 'auto' && (
        <View style={{ gap: 10 }}>
          <Text style={[s.sectionLabel, { color: c.mutedText }]}>CYCLES BETWEEN THESE 3 · EVERY 8S</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
            {AUTO_WALLPAPERS.map((w, i) => (
              <View key={w.anime} style={s.animeCard}>
                <Image source={{ uri: w.uri }} style={s.animeCardImg} resizeMode="cover" />
                <View style={s.animeCardOverlay}>
                  <Text style={s.animeCardTitle}>{w.title}</Text>
                  <Text style={s.animeCardSub}>{w.subtitle}</Text>
                </View>
                <View style={s.animeCardBadge}><Text style={s.animeCardBadgeText}>#{i + 1}</Text></View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Manual preview — selected or pick prompt */}
      {mode === 'manual' && (
        <View style={{ gap: 10 }}>
          <Text style={[s.sectionLabel, { color: c.mutedText }]}>SELECTED WALLPAPER</Text>
          <Pressable onPress={loadLibrary} style={[s.manualPreview, { backgroundColor: c.surface, borderColor: c.border }]}>
            {selectedUri ? (
              <>
                <Image source={{ uri: selectedUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 16, justifyContent: 'flex-end', padding: 14 }]}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                    {library.find(w => w.uri === selectedUri)?.title ?? 'Anime'}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>Tap to change</Text>
                </View>
              </>
            ) : (
              <View style={{ alignItems: 'center', gap: 8 }}>
                <Ionicons name="images-outline" size={36} color={c.mutedText} />
                <Text style={{ color: c.mutedText, fontSize: 14, fontWeight: '600' }}>Tap to browse wallpapers</Text>
                <Text style={{ color: c.mutedText, fontSize: 11 }}>{library.length > 0 ? `${library.length} images loaded` : 'Fetches from nekos.best'}</Text>
              </View>
            )}
          </Pressable>
        </View>
      )}

      {/* Password */}
      <View style={[s.pwCard, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Pressable onPress={() => setSettingPw(!settingPw)} style={s.pwRow}>
          <Ionicons name="key" size={18} color={c.accent} />
          <Text style={{ flex: 1, color: c.text, fontSize: 15, fontWeight: '500' }}>Set Abyss Password</Text>
          <Ionicons name={settingPw ? 'chevron-up' : 'chevron-down'} size={16} color={c.mutedText} />
        </Pressable>
        {settingPw && (
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <TextInput
              style={[s.pwInput, { color: c.text, borderColor: c.border }]}
              value={passwordInput} onChangeText={setPasswordInput}
              placeholder="New password..." placeholderTextColor={c.mutedText}
              secureTextEntry
            />
            <Pressable onPress={handleSetPassword} style={[s.pwSetBtn, { backgroundColor: c.accent }]}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Set</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Pressable
        onPress={() => {
          if (mode === 'manual' && !selectedUri) {
            Alert.alert('No wallpaper selected', 'Browse and pick a wallpaper first.');
            return;
          }
          activateAbyss();
        }}
        style={s.activateBtn}
      >
        <Ionicons name="eye-off" size={22} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>Activate Abyss Mode</Text>
      </Pressable>
    </ScrollView>
  );
}

const THUMB = (width - 8) / 3;

const s = StyleSheet.create({
  container:        { paddingTop: 60, paddingHorizontal: 16, gap: 16, paddingBottom: 40 },
  title:            { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  sub:              { fontSize: 14, lineHeight: 20, marginTop: -8 },
  sectionLabel:     { fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  modeRow:          { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 4, gap: 4 },
  modeBtn:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  animeCard:        { width: 160, height: 220, borderRadius: 16, overflow: 'hidden' },
  animeCardImg:     { width: '100%', height: '100%' },
  animeCardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', padding: 12 },
  animeCardTitle:   { color: '#fff', fontSize: 15, fontWeight: '800' },
  animeCardSub:     { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 },
  animeCardBadge:   { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  animeCardBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  manualPreview:    { height: 200, borderRadius: 16, borderWidth: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  pwCard:           { borderRadius: 14, borderWidth: 1, padding: 14 },
  pwRow:            { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pwInput:          { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15 },
  pwSetBtn:         { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  activateBtn:      { backgroundColor: '#05070f', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  // active abyss
  abyss:            { flex: 1, backgroundColor: '#000' },
  wallpaper:        { position: 'absolute', width, height },
  overlay:          { position: 'absolute', width, height, backgroundColor: 'rgba(0,0,0,0.38)' },
  glow:             { position: 'absolute', top: height * 0.28, left: width / 2 - 130, width: 260, height: 260, borderRadius: 130, backgroundColor: '#7c3aed', opacity: 0.12 },
  abyssInner:       { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 36 },
  abyssLabel:       { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: '800', letterSpacing: 6, marginTop: 8 },
  animeTitle:       { color: 'rgba(255,255,255,0.85)', fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  animeSub:         { color: 'rgba(255,255,255,0.45)', fontSize: 13, textAlign: 'center', marginTop: -4 },
  wallpaperCount:   { color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: 1 },
  unlockRow:        { flexDirection: 'row', gap: 10, width: '100%', marginTop: 16 },
  unlockInput:      { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  unlockBtn:        { backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  orText:           { color: 'rgba(255,255,255,0.2)', fontSize: 12, marginVertical: 2 },
  bioBtn:           { alignItems: 'center', gap: 8, padding: 12 },
  bioText:          { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  // library
  libraryHeader:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12 },
  libraryTitle:     { fontSize: 17, fontWeight: '700' },
  backBtn:          { flexDirection: 'row', alignItems: 'center', gap: 4, width: 70 },
  thumbWrap:        { width: THUMB, height: THUMB * 1.4, margin: 2, borderRadius: 10, overflow: 'hidden', borderWidth: 0, borderColor: 'transparent' },
  thumb:            { width: '100%', height: '100%' },
  thumbCheck:       { position: 'absolute', top: 4, right: 4 },
});
