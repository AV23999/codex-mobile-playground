import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, Alert,
  Animated, Easing, StatusBar, Dimensions, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { activateAbyss, deactivateAbyss, isAbyssActive, onAbyssChange, setAbyssPassword } from '../../src/services/abyssService';

const { width, height } = Dimensions.get('window');

const AUTO_WALLPAPERS = [
  { title: 'One Piece', subtitle: "The Straw Hat's Grand Voyage", source: require('../../assets/images/wp-onepiece.jpg') },
  { title: 'Naruto — Madara', subtitle: 'The Uchiha who stood above all', source: require('../../assets/images/wp-naruto.jpg') },
  { title: 'Bleach — Aizen', subtitle: 'The God who never needed allies', source: require('../../assets/images/wp-bleach.jpg') },
];

// Wallhaven — free, no API key needed for SFW wallpapers, returns real matching results
async function searchWallhaven(query: string): Promise<string[]> {
  const url =
    `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(query)}&categories=110&purity=100&sorting=relevance&order=desc&per_page=24`;
  const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!resp.ok) throw new Error('wallhaven failed');
  const data = await resp.json();
  // Wallhaven returns full-res + thumb URLs; use path (full image) for quality
  return (data.data as any[]).map((w: any) => w.path);
}

export default function AbyssScreen() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];

  const [active, setActive] = useState(isAbyssActive());
  const [unlockInput, setUnlockInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [settingPw, setSettingPw] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ uri: string; thumb: string }[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [autoIndex, setAutoIndex] = useState(0);
  const autoFade = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => onAbyssChange(setActive), []);

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

  useEffect(() => {
    if (!active) { pulse.setValue(1); return; }
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.18, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, [active]);

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Allow photo access to pick a wallpaper.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1, allowsEditing: false });
    if (!result.canceled && result.assets[0]) { setSelectedUri(result.assets[0].uri); setMode('manual'); }
  };

  const openSearch = () => { setSearchResults([]); setSearchError(''); setShowSearch(true); };

  const doSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true);
    setSearchError('');
    try {
      const url =
        `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(q)}&categories=110&purity=100&sorting=relevance&order=desc&per_page=24`;
      const resp = await fetch(url, { headers: { Accept: 'application/json' } });
      if (resp.ok) {
        const data = await resp.json();
        if (data.data && data.data.length > 0) {
          setSearchResults(data.data.map((w: any) => ({ uri: w.path, thumb: w.thumbs?.small || w.path })));
          setSearching(false);
          return;
        }
        setSearchError('No results found. Try a different keyword.');
      } else {
        setSearchError('Search unavailable right now. Try again.');
      }
    } catch (e) {
      setSearchError('Network error — check your connection.');
    }
    setSearchResults([]);
    setSearching(false);
  };

  const handleDeactivate = async () => {
    const res = await deactivateAbyss(unlockInput || undefined);
    if (!res.success) { Alert.alert('Unlock Failed', res.reason); setUnlockInput(''); }
  };

  const handleSetPassword = () => {
    if (passwordInput.length < 4) { Alert.alert('Too short', 'Minimum 4 characters.'); return; }
    setAbyssPassword(passwordInput);
    setPasswordInput('');
    setSettingPw(false);
    Alert.alert('Password Set ✓', 'Abyss password saved.');
  };

  // ── ACTIVE ABYSS SCREEN
  if (active) {
    const current = AUTO_WALLPAPERS[autoIndex];
    const wallSource = mode === 'manual' && selectedUri ? { uri: selectedUri } : current.source;
    const wallTitle = mode === 'manual' ? 'Custom Wallpaper' : current.title;
    const wallSub = mode === 'auto' ? current.subtitle : null;
    return (
      <View style={s.abyss}>
        <StatusBar hidden />
        <Animated.Image key={autoIndex} source={wallSource} style={[s.wallpaper, { opacity: mode === 'auto' ? autoFade : 1 }]} resizeMode="cover" />
        <View style={s.overlay} />
        <Animated.View style={[s.glow, { transform: [{ scale: pulse }] }]} />
        <View style={s.abyssInner}>
          <Ionicons name="eye-off" size={42} color="rgba(255,255,255,0.35)" />
          <Text style={s.abyssLabel}>ABYSS MODE</Text>
          <Text style={s.animeTitle}>{wallTitle}</Text>
          {wallSub && <Text style={s.animeSub}>{wallSub}</Text>}
          {mode === 'auto' && <Text style={s.wallpaperCount}>#{autoIndex + 1} of {AUTO_WALLPAPERS.length} · auto</Text>}
          <View style={s.unlockRow}>
            <TextInput style={s.unlockInput} value={unlockInput} onChangeText={setUnlockInput} placeholder="Password..." placeholderTextColor="rgba(255,255,255,0.25)" secureTextEntry autoFocus onSubmitEditing={handleDeactivate} />
            <Pressable onPress={handleDeactivate} style={s.unlockBtn}><Ionicons name="lock-open" size={20} color="#fff" /></Pressable>
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

  // ── SEARCH SCREEN
  if (showSearch) {
    return (
      <View style={{ flex: 1, backgroundColor: c.background }}>
        <View style={[s.libraryHeader, { flexDirection: 'column', gap: 10, paddingBottom: 10 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Pressable onPress={() => setShowSearch(false)} style={s.backBtn}>
              <Ionicons name="chevron-back" size={22} color={c.text} />
              <Text style={{ color: c.text, fontSize: 16, fontWeight: '600' }}>Back</Text>
            </Pressable>
            <Text style={[s.libraryTitle, { color: c.text }]}>Search Wallpapers</Text>
            <View style={{ width: 70 }} />
          </View>

          {/* Search bar */}
          <View style={[s.searchRowFull, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Ionicons name="search" size={16} color={c.mutedText} />
            <TextInput
              style={[s.searchInput, { color: c.text, flex: 1 }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="dragon ball, space, mountains..."
              placeholderTextColor={c.mutedText}
              returnKeyType="search"
              autoFocus
              onSubmitEditing={doSearch}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => { setSearchQuery(''); setSearchResults([]); setSearchError(''); }}>
                <Ionicons name="close-circle" size={18} color={c.mutedText} />
              </Pressable>
            )}
            <Pressable onPress={doSearch} style={[s.searchGoBtn, { backgroundColor: c.accent, opacity: searching ? 0.6 : 1 }]} disabled={searching}>
              {searching
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Go</Text>}
            </Pressable>
          </View>

          {/* Source note + error */}
          <Text style={{ color: c.mutedText, fontSize: 10, paddingHorizontal: 2, letterSpacing: 0.3 }}>
            Powered by Wallhaven · SFW only
          </Text>
          {searchError ? <Text style={{ color: '#e05252', fontSize: 12, paddingHorizontal: 2 }}>{searchError}</Text> : null}
        </View>

        {/* Results */}
        {searching ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
            <ActivityIndicator size="large" color={c.accent} />
            <Text style={{ color: c.mutedText, fontSize: 14 }}>Searching for "{searchQuery}"…</Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
            <Ionicons name="images-outline" size={52} color={c.mutedText} />
            <Text style={{ color: c.mutedText, fontSize: 15 }}>Type a keyword and tap Go</Text>
            <Text style={{ color: c.mutedText, fontSize: 12, opacity: 0.6 }}>Try: anime, galaxy, forest, city night</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', padding: 3, paddingBottom: 50 }}>
            <Text style={{ width: '100%', color: c.mutedText, fontSize: 11, paddingHorizontal: 4, paddingBottom: 6 }}>
              {searchResults.length} results for "{searchQuery}"
            </Text>
            {searchResults.map((item, i) => (
              <Pressable
                key={`${item.uri}-${i}`}
                onPress={() => { setSelectedUri(item.uri); setMode('manual'); setShowSearch(false); }}
                style={[s.thumbWrap, selectedUri === item.uri && { borderColor: c.accent, borderWidth: 3 }]}
              >
                <Image source={{ uri: item.thumb }} style={s.thumb} resizeMode="cover" />
                {selectedUri === item.uri && (
                  <View style={s.thumbCheck}><Ionicons name="checkmark-circle" size={22} color={c.accent} /></View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    );
  }

  // ── MAIN SETTINGS
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={s.container}>
      <Text style={[s.title, { color: c.text }]}>Abyss Mode</Text>
      <Text style={[s.sub, { color: c.mutedText }]}>Blank your screen with a wallpaper.</Text>

      <View style={[s.modeRow, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Pressable onPress={() => setMode('auto')} style={[s.modeBtn, mode === 'auto' && { backgroundColor: c.accent }]}>
          <Ionicons name="sync" size={16} color={mode === 'auto' ? '#fff' : c.mutedText} />
          <Text style={{ color: mode === 'auto' ? '#fff' : c.mutedText, fontWeight: '700', fontSize: 13 }}>Auto</Text>
        </Pressable>
        <Pressable onPress={() => setMode('manual')} style={[s.modeBtn, mode === 'manual' && { backgroundColor: c.accent }]}>
          <Ionicons name="hand-left" size={16} color={mode === 'manual' ? '#fff' : c.mutedText} />
          <Text style={{ color: mode === 'manual' ? '#fff' : c.mutedText, fontWeight: '700', fontSize: 13 }}>Manual</Text>
        </Pressable>
      </View>

      {mode === 'auto' && (
        <View style={{ gap: 10 }}>
          <Text style={[s.sectionLabel, { color: c.mutedText }]}>CYCLES BETWEEN THESE 3 · EVERY 8S</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
            {AUTO_WALLPAPERS.map((w, i) => (
              <View key={w.title} style={s.animeCard}>
                <Image source={w.source} style={s.animeCardImg} resizeMode="cover" />
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

      {mode === 'manual' && (
        <View style={{ gap: 12 }}>
          {selectedUri && (
            <View style={{ gap: 8 }}>
              <Text style={[s.sectionLabel, { color: c.mutedText }]}>SELECTED WALLPAPER</Text>
              <View style={[s.manualPreview, { borderColor: c.border }]}>
                <Image source={{ uri: selectedUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, justifyContent: 'flex-end', padding: 14 }]}>
                  <Text style={{ color: '#fff', fontSize: 12, opacity: 0.7 }}>Tap buttons below to change</Text>
                </View>
              </View>
            </View>
          )}
          <Text style={[s.sectionLabel, { color: c.mutedText }]}>PICK WALLPAPER FROM</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable onPress={pickFromGallery} style={[s.pickBtn, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Ionicons name="images" size={28} color={c.accent} />
              <Text style={{ color: c.text, fontWeight: '700', fontSize: 14, marginTop: 6 }}>Camera Roll</Text>
              <Text style={{ color: c.mutedText, fontSize: 11, textAlign: 'center', marginTop: 2 }}>{'Any photo\nfrom your phone'}</Text>
            </Pressable>
            <Pressable onPress={openSearch} style={[s.pickBtn, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Ionicons name="search" size={28} color={c.accent} />
              <Text style={{ color: c.text, fontWeight: '700', fontSize: 14, marginTop: 6 }}>Search Online</Text>
              <Text style={{ color: c.mutedText, fontSize: 11, textAlign: 'center', marginTop: 2 }}>{'Find by keyword\non Wallhaven'}</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={[s.pwCard, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Pressable onPress={() => setSettingPw(!settingPw)} style={s.pwRow}>
          <Ionicons name="key" size={18} color={c.accent} />
          <Text style={{ flex: 1, color: c.text, fontSize: 15, fontWeight: '500' }}>Set Abyss Password</Text>
          <Ionicons name={settingPw ? 'chevron-up' : 'chevron-down'} size={16} color={c.mutedText} />
        </Pressable>
        {settingPw && (
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <TextInput style={[s.pwInput, { color: c.text, borderColor: c.border }]} value={passwordInput} onChangeText={setPasswordInput} placeholder="New password..." placeholderTextColor={c.mutedText} secureTextEntry />
            <Pressable onPress={handleSetPassword} style={[s.pwSetBtn, { backgroundColor: c.accent }]}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Set</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Pressable
        onPress={() => {
          if (mode === 'manual' && !selectedUri) { Alert.alert('No wallpaper selected', 'Pick a wallpaper from Camera Roll or Search first.'); return; }
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
  container:          { paddingTop: 60, paddingHorizontal: 16, gap: 16, paddingBottom: 40 },
  title:              { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  sub:                { fontSize: 14, lineHeight: 20, marginTop: -8 },
  sectionLabel:       { fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  modeRow:            { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 4, gap: 4 },
  modeBtn:            { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  pickBtn:            { flex: 1, borderWidth: 1, borderRadius: 16, padding: 16, alignItems: 'center' },
  searchRowFull:      { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, gap: 8 },
  searchInput:        { fontSize: 14, paddingVertical: 6 },
  searchGoBtn:        { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  manualPreview:      { height: 200, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  animeCard:          { width: 160, height: 220, borderRadius: 16, overflow: 'hidden' },
  animeCardImg:       { width: '100%', height: '100%' },
  animeCardOverlay:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', padding: 12 },
  animeCardTitle:     { color: '#fff', fontSize: 15, fontWeight: '800' },
  animeCardSub:       { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 },
  animeCardBadge:     { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  animeCardBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  pwCard:             { borderRadius: 14, borderWidth: 1, padding: 14 },
  pwRow:              { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pwInput:            { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15 },
  pwSetBtn:           { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  activateBtn:        { backgroundColor: '#05070f', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  abyss:              { flex: 1, backgroundColor: '#000' },
  wallpaper:          { position: 'absolute', width, height },
  overlay:            { position: 'absolute', width, height, backgroundColor: 'rgba(0,0,0,0.38)' },
  glow:               { position: 'absolute', top: height * 0.28, left: width / 2 - 130, width: 260, height: 260, borderRadius: 130, backgroundColor: '#7c3aed', opacity: 0.12 },
  abyssInner:         { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 36 },
  abyssLabel:         { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: '800', letterSpacing: 6, marginTop: 8 },
  animeTitle:         { color: 'rgba(255,255,255,0.85)', fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  animeSub:           { color: 'rgba(255,255,255,0.45)', fontSize: 13, textAlign: 'center', marginTop: -4 },
  wallpaperCount:     { color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: 1 },
  unlockRow:          { flexDirection: 'row', gap: 10, width: '100%', marginTop: 16 },
  unlockInput:        { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  unlockBtn:          { backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  orText:             { color: 'rgba(255,255,255,0.2)', fontSize: 12, marginVertical: 2 },
  bioBtn:             { alignItems: 'center', gap: 8, padding: 12 },
  bioText:            { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  libraryHeader:      { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12 },
  libraryTitle:       { fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  backBtn:            { flexDirection: 'row', alignItems: 'center', gap: 4, width: 70 },
  thumbWrap:          { width: THUMB, height: THUMB * 1.4, margin: 2, borderRadius: 10, overflow: 'hidden', borderWidth: 0, borderColor: 'transparent' },
  thumb:              { width: '100%', height: '100%' },
  thumbCheck:         { position: 'absolute', top: 4, right: 4 },
});
