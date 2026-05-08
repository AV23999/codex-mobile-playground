import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Animated, Easing, StatusBar, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { activateAbyss, deactivateAbyss, isAbyssActive, onAbyssChange, setAbyssPassword } from '../../src/services/abyssService';

const { width, height } = Dimensions.get('window');

const ANIME_WALLPAPERS = [
  'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/ca5a8d02ac33f3d8f2afca16e4445ed81352cb1e.jpg', // Yasuke samurai blood moon
  'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/32a87c72e8cc5609b1c3f65c1f86128d98767583.jpg', // glowing silhouette dark energy
  'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/8fbf1967ec8ff94af10812d9b89489e120c5098b.jpg', // white hair villain fire
  'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/5face4230e900a76f1c1cb2d7389f9c383ba2762.jpg', // dark aura titan
  'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/ec0a8e395c0d51c5a9f06974542644281070a422.jpg', // warrior girl dark forest
  'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/cf815ee5f3836bf29c1e04416442a6e10f8e7d0e.jpg', // purple samurai moon
];

export default function AbyssScreen() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [active, setActive] = useState(isAbyssActive());
  const [unlockInput, setUnlockInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [settingPw, setSettingPw] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => onAbyssChange(setActive), []);

  // Pulse glow animation
  useEffect(() => {
    if (active) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])).start();
    } else {
      pulse.setValue(1);
    }
  }, [active]);

  // Wallpaper cycling with crossfade every 8 seconds
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: true }).start(() => {
        setWallpaperIndex(i => (i + 1) % ANIME_WALLPAPERS.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [active]);

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
    return (
      <View style={s.abyss}>
        <StatusBar hidden />

        {/* Anime wallpaper with crossfade */}
        <Animated.Image
          source={{ uri: ANIME_WALLPAPERS[wallpaperIndex] }}
          style={[s.wallpaper, { opacity: fadeAnim }]}
          resizeMode="cover"
        />

        {/* Dark overlay so unlock UI is readable */}
        <View style={s.overlay} />

        {/* Pulse glow orb */}
        <Animated.View style={[s.glow, { transform: [{ scale: pulse }] }]} />

        {/* Unlock UI */}
        <View style={s.abyssInner}>
          <Ionicons name="eye-off" size={42} color="rgba(255,255,255,0.25)" />
          <Text style={s.abyssLabel}>ABYSS MODE</Text>
          <Text style={s.abyssHint}>Swipe or unlock to continue</Text>

          <View style={s.unlockRow}>
            <TextInput
              style={s.unlockInput}
              value={unlockInput}
              onChangeText={setUnlockInput}
              placeholder="Password..."
              placeholderTextColor="rgba(255,255,255,0.25)"
              secureTextEntry
              autoFocus
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

          {/* Wallpaper dots indicator */}
          <View style={s.dotsRow}>
            {ANIME_WALLPAPERS.map((_, i) => (
              <View key={i} style={[s.dot, { opacity: i === wallpaperIndex ? 1 : 0.25 }]} />
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Abyss Mode</Text>
      <Text style={[s.sub, { color: c.mutedText }]}>{"Blank your screen instantly.\nUnlock with Face ID or password."}</Text>

      {/* Preview of wallpaper */}
      <ImageBackground
        source={{ uri: ANIME_WALLPAPERS[0] }}
        style={s.preview}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="cover"
      >
        <View style={s.previewOverlay}>
          <Ionicons name="eye-off" size={36} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8, fontSize: 13, fontWeight: '600' }}>Anime Wallpaper Mode</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>{ANIME_WALLPAPERS.length} wallpapers · Auto-cycles every 8s</Text>
        </View>
      </ImageBackground>

      <View style={[s.infoCard, { backgroundColor: c.surface, borderColor: c.border }]}>
        {[
          ['eye-off',           'Shows powerful anime wallpapers'],
          ['finger-print',      'Unlock with Face ID / Touch ID'],
          ['key',               'Fallback password unlock'],
          ['images',            'Cycles through 6 anime wallpapers'],
          ['shield-checkmark',  'Logged to security audit trail'],
        ].map(([icon, label]) => (
          <View key={label} style={s.infoRow}>
            <Ionicons name={icon as any} size={18} color={c.accent} />
            <Text style={[{ color: c.text, fontSize: 14 }]}>{label}</Text>
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

      <Pressable onPress={() => activateAbyss()} style={s.activateBtn}>
        <Ionicons name="eye-off" size={22} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>Activate Abyss Mode</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  sub: { fontSize: 14, lineHeight: 20, marginTop: -8 },
  preview: { height: 160, borderRadius: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  previewOverlay: { flex: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  infoCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pwCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
  pwRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pwInput: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15 },
  pwSetBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  activateBtn: { backgroundColor: '#05070f', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, marginBottom: 40 },
  // Abyss overlay styles
  abyss: { flex: 1, backgroundColor: '#000' },
  wallpaper: { position: 'absolute', width, height },
  overlay: { position: 'absolute', width, height, backgroundColor: 'rgba(0,0,0,0.55)' },
  glow: { position: 'absolute', top: height * 0.35, left: width * 0.5 - 120, width: 240, height: 240, borderRadius: 120, backgroundColor: '#7c3aed', opacity: 0.12 },
  abyssInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 36 },
  abyssLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '800', letterSpacing: 6, marginTop: 8 },
  abyssHint: { color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: 1 },
  unlockRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 20 },
  unlockInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  unlockBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  orText: { color: 'rgba(255,255,255,0.2)', fontSize: 12, marginVertical: 2 },
  bioBtn: { alignItems: 'center', gap: 8, padding: 12 },
  bioText: { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  dotsRow: { flexDirection: 'row', gap: 6, marginTop: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
});
