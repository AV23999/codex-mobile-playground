import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, Alert,
  Animated, Easing, StatusBar, ImageBackground, Dimensions, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { activateAbyss, deactivateAbyss, isAbyssActive, onAbyssChange, setAbyssPassword } from '../../src/services/abyssService';

const { width, height } = Dimensions.get('window');

type Wallpaper = { uri: string; title: string };

async function fetchAnimeWallpapers(): Promise<Wallpaper[]> {
  // nekos.best — free open anime art API, no auth, no hotlink block, built for mobile
  const categories = ['neko', 'waifu', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry',
    'hug', 'kiss', 'pat', 'smile', 'smug', 'highfive', 'happy', 'dance', 'blush', 'wave'];
  const labels = [
    'Anime — Neko Girl',        'Anime — Waifu Art',         'Anime — Shinobu Kocho',
    'Anime — Megumin',          'Anime — Tsundere Moment',   'Anime — Warm Embrace',
    'Anime — Emotional Scene',  'Anime — Wholesome Hug',     'Anime — Sweet Kiss',
    'Anime — Gentle Pat',       'Anime — Bright Smile',      'Anime — Smug Face',
    'Anime — High Five',        'Anime — Happy Moment',      'Anime — Dance Scene',
    'Anime — Blushing',         'Anime — Waving Goodbye',
  ];

  try {
    const results: Wallpaper[] = [];
    // Fetch 6 images per category to get ~100 total
    await Promise.all(
      categories.map(async (cat, i) => {
        const amount = i < 15 ? 6 : 5;
        const res = await fetch(`https://nekos.best/api/v2/${cat}?amount=${amount}`);
        const json = await res.json();
        if (json.results) {
          json.results.forEach((item: any, j: number) => {
            results.push({
              uri: item.url,
              title: `${labels[i]} #${j + 1}`,
            });
          });
        }
      })
    );
    // Shuffle so it’s not grouped by category
    return results.sort(() => Math.random() - 0.5).slice(0, 100);
  } catch (e) {
    // Fallback to a single category if something fails
    const res = await fetch('https://nekos.best/api/v2/neko?amount=100');
    const json = await res.json();
    return (json.results || []).map((item: any, i: number) => ({
      uri: item.url,
      title: `Anime Wallpaper #${i + 1}`,
    }));
  }
}

export default function AbyssScreen() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [active, setActive] = useState(isAbyssActive());
  const [unlockInput, setUnlockInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [settingPw, setSettingPw] = useState(false);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => onAbyssChange(setActive), []);

  useEffect(() => {
    fetchAnimeWallpapers().then(data => {
      setWallpapers(data);
      setWallpaperIndex(Math.floor(Math.random() * data.length));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (active) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.18, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])).start();
    } else { pulse.setValue(1); }
  }, [active]);

  useEffect(() => {
    if (!active || wallpapers.length === 0) return;
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }).start(() => {
        setWallpaperIndex(i => (i + 1) % wallpapers.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [active, wallpapers]);

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

  if (active) {
    const current = wallpapers[wallpaperIndex];
    return (
      <View style={s.abyss}>
        <StatusBar hidden />
        {current && (
          <Animated.Image
            key={current.uri}
            source={{ uri: current.uri }}
            style={[s.wallpaper, { opacity: fadeAnim }]}
            resizeMode="cover"
          />
        )}
        <View style={s.overlay} />
        <Animated.View style={[s.glow, { transform: [{ scale: pulse }] }]} />
        <View style={s.abyssInner}>
          <Ionicons name="eye-off" size={42} color="rgba(255,255,255,0.35)" />
          <Text style={s.abyssLabel}>ABYSS MODE</Text>
          {current && <Text style={s.animeTitle}>{current.title}</Text>}
          <Text style={s.wallpaperCount}>
            {loading ? 'Loading...' : `#${wallpaperIndex + 1} of ${wallpapers.length}`}
          </Text>
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

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Abyss Mode</Text>
      <Text style={[s.sub, { color: c.mutedText }]}>{"Blank your screen.\nReal anime art · cycles every 8s."}</Text>

      <View style={[s.preview, { backgroundColor: c.surface, justifyContent: 'center', alignItems: 'center' }]}>
        {loading ? (
          <>
            <ActivityIndicator color={c.accent} size="large" />
            <Text style={{ color: c.mutedText, marginTop: 10, fontSize: 13 }}>Fetching anime wallpapers...</Text>
          </>
        ) : (
          <ImageBackground
            source={{ uri: wallpapers[0]?.uri }}
            style={StyleSheet.absoluteFill}
            imageStyle={{ borderRadius: 20 }}
            resizeMode="cover"
          >
            <View style={s.previewOverlay}>
              <Ionicons name="eye-off" size={32} color="rgba(255,255,255,0.9)" />
              <Text style={{ color: '#fff', marginTop: 8, fontSize: 14, fontWeight: '800' }}>{wallpapers.length} Anime Wallpapers</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 }}>Live from nekos.best · fresh every session</Text>
            </View>
          </ImageBackground>
        )}
      </View>

      <View style={[s.infoCard, { backgroundColor: c.surface, borderColor: c.border }]}>
        {[
          ['images',           `${loading ? '...' : wallpapers.length} real anime art wallpapers`],
          ['eye-off',          'Auto-cycles every 8s with crossfade'],
          ['finger-print',     'Unlock with Face ID / Touch ID'],
          ['key',              'Fallback password unlock'],
          ['shield-checkmark', 'Logged to security audit trail'],
        ].map(([icon, label]) => (
          <View key={label} style={s.infoRow}>
            <Ionicons name={icon as any} size={18} color={c.accent} />
            <Text style={{ color: c.text, fontSize: 14 }}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={[s.pwCard, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Pressable onPress={() => setSettingPw(!settingPw)} style={s.pwRow}>
          <Ionicons name="key" size={18} color={c.accent} />
          <Text style={[{ flex: 1, color: c.text, fontSize: 15, fontWeight: '500' }]}>Set Abyss Password</Text>
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
        onPress={() => !loading && activateAbyss()}
        style={[s.activateBtn, loading && { opacity: 0.5 }]}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Ionicons name="eye-off" size={22} color="#fff" />}
        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>
          {loading ? 'Loading wallpapers...' : 'Activate Abyss Mode'}
        </Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, paddingTop: 60, paddingHorizontal: 16, gap: 16 },
  title:         { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  sub:           { fontSize: 14, lineHeight: 20, marginTop: -8 },
  preview:       { height: 160, borderRadius: 20, overflow: 'hidden' },
  previewOverlay:{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, alignItems: 'center', justifyContent: 'center', padding: 16 },
  infoCard:      { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  infoRow:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pwCard:        { borderRadius: 14, borderWidth: 1, padding: 14 },
  pwRow:         { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pwInput:       { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15 },
  pwSetBtn:      { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  activateBtn:   { backgroundColor: '#05070f', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, marginBottom: 40 },
  abyss:         { flex: 1, backgroundColor: '#000' },
  wallpaper:     { position: 'absolute', width, height },
  overlay:       { position: 'absolute', width, height, backgroundColor: 'rgba(0,0,0,0.35)' },
  glow:          { position: 'absolute', top: height * 0.28, left: width / 2 - 130, width: 260, height: 260, borderRadius: 130, backgroundColor: '#7c3aed', opacity: 0.12 },
  abyssInner:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 36 },
  abyssLabel:    { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: '800', letterSpacing: 6, marginTop: 8 },
  animeTitle:    { color: 'rgba(255,255,255,0.85)', fontSize: 17, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  wallpaperCount:{ color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: 1 },
  unlockRow:     { flexDirection: 'row', gap: 10, width: '100%', marginTop: 16 },
  unlockInput:   { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  unlockBtn:     { backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  orText:        { color: 'rgba(255,255,255,0.2)', fontSize: 12, marginVertical: 2 },
  bioBtn:        { alignItems: 'center', gap: 8, padding: 12 },
  bioText:       { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
});
