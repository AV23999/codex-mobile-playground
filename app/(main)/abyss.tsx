import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, Alert,
  Animated, Easing, StatusBar, ImageBackground, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { activateAbyss, deactivateAbyss, isAbyssActive, onAbyssChange, setAbyssPassword } from '../../src/services/abyssService';

const { width, height } = Dimensions.get('window');

// All imgur direct links — 100% hotlink-free, no CORS, works in React Native
const ANIME_WALLPAPERS = [
  { title: 'Attack on Titan — Eren Titan Form',       uri: 'https://i.imgur.com/JBiXHgP.jpg' },
  { title: 'Demon Slayer — Tanjiro vs Rui',          uri: 'https://i.imgur.com/Ry8SRnW.jpg' },
  { title: 'Jujutsu Kaisen — Gojo Infinity',         uri: 'https://i.imgur.com/nXzMYeZ.jpg' },
  { title: 'Naruto — Nine-Tails Chakra Mode',        uri: 'https://i.imgur.com/TQaWDJN.jpg' },
  { title: 'Dragon Ball — Goku Ultra Instinct',      uri: 'https://i.imgur.com/Yk9rXJP.jpg' },
  { title: 'One Piece — Gear 5 Luffy',               uri: 'https://i.imgur.com/vPmHXHb.jpg' },
  { title: 'My Hero Academia — Deku Full Cowl',      uri: 'https://i.imgur.com/5e3YLHA.jpg' },
  { title: 'Death Note — Light Yagami',               uri: 'https://i.imgur.com/wy4CQFW.jpg' },
  { title: 'Bleach — Ichigo Bankai',                 uri: 'https://i.imgur.com/9Zk4qXq.jpg' },
  { title: 'One Punch Man — Saitama Serious',        uri: 'https://i.imgur.com/2qMFcdO.jpg' },
  { title: 'Code Geass — Zero',                      uri: 'https://i.imgur.com/nLf9Gaf.jpg' },
  { title: 'Tokyo Ghoul — Ken Kaneki',               uri: 'https://i.imgur.com/CmSMFwC.jpg' },
  { title: 'Hunter x Hunter — Gon & Killua',        uri: 'https://i.imgur.com/xgDHhME.jpg' },
  { title: 'Re:Zero — Emilia & Rem',                 uri: 'https://i.imgur.com/bCkWNXA.jpg' },
  { title: 'Fullmetal Alchemist — Edward',           uri: 'https://i.imgur.com/0vEfYYw.jpg' },
  { title: 'Sword Art Online — Kirito Night',        uri: 'https://i.imgur.com/zK5TZRY.jpg' },
  { title: 'Cowboy Bebop — Spike',                   uri: 'https://i.imgur.com/J3VRVsY.jpg' },
  { title: 'Gurren Lagann — Mecha',                  uri: 'https://i.imgur.com/pHoiLuX.jpg' },
  { title: 'Steins;Gate — Okabe Lab',                uri: 'https://i.imgur.com/RcYKseX.jpg' },
  { title: 'Evangelion — Unit 01 Berserk',          uri: 'https://i.imgur.com/dJJSKvl.jpg' },
  { title: 'Chainsaw Man — Denji Power',             uri: 'https://i.imgur.com/OgAJfFR.jpg' },
  { title: 'Vinland Saga — Thorfinn War',            uri: 'https://i.imgur.com/ZVwuZXY.jpg' },
  { title: 'Berserk — Guts Black Swordsman',        uri: 'https://i.imgur.com/5Ybv7RK.jpg' },
  { title: 'Psycho-Pass — Kogami',                   uri: 'https://i.imgur.com/8bxhLZA.jpg' },
  { title: 'Fairy Tail — Natsu Dragon Force',       uri: 'https://i.imgur.com/2jQlvBV.jpg' },
  { title: 'Haikyuu — Hinata Spike',                uri: 'https://i.imgur.com/fkHC8xN.jpg' },
  { title: 'Violet Evergarden — Letter',            uri: 'https://i.imgur.com/xBdmSF3.jpg' },
  { title: 'Mob Psycho 100 — 100%',                 uri: 'https://i.imgur.com/8XHLPXH.jpg' },
  { title: 'Parasyte — Shinichi & Migi',            uri: 'https://i.imgur.com/lUrNtsc.jpg' },
  { title: 'The Promised Neverland — Emma',         uri: 'https://i.imgur.com/HN3cSLz.jpg' },
  { title: 'No Game No Life — Sora & Shiro',        uri: 'https://i.imgur.com/xmeMsVq.jpg' },
  { title: 'Black Clover — Asta Black Form',        uri: 'https://i.imgur.com/BLMJVFJ.jpg' },
  { title: 'Kill la Kill — Ryuko Matoi',            uri: 'https://i.imgur.com/5gX3sxJ.jpg' },
  { title: 'Akame ga Kill — Night Raid',            uri: 'https://i.imgur.com/VNdg7L1.jpg' },
  { title: 'Soul Eater — Death the Kid',            uri: 'https://i.imgur.com/3FWyQdZ.jpg' },
  { title: 'Overlord — Ainz Ooal Gown',             uri: 'https://i.imgur.com/b8BqMxS.jpg' },
  { title: "JoJo's Bizarre Adventure — Giorno",    uri: 'https://i.imgur.com/TCRqvLO.jpg' },
  { title: 'Fate/Zero — Gilgamesh',                 uri: 'https://i.imgur.com/iMNiAlq.jpg' },
  { title: 'Madoka Magica — Homura Dark',           uri: 'https://i.imgur.com/OsXH6Gq.jpg' },
  { title: 'Hellsing — Alucard Unleashed',         uri: 'https://i.imgur.com/hGYSfP5.jpg' },
  { title: 'Ghost in the Shell — Motoko',           uri: 'https://i.imgur.com/hFkiRpK.jpg' },
  { title: 'Samurai Champloo — Mugen vs Jin',       uri: 'https://i.imgur.com/WKNQEqr.jpg' },
  { title: 'Darker than Black — Hei',               uri: 'https://i.imgur.com/bJptCnH.jpg' },
  { title: 'Future Diary — Yuno Gasai',             uri: 'https://i.imgur.com/wZ2dFJU.jpg' },
  { title: 'Elfen Lied — Lucy',                    uri: 'https://i.imgur.com/6hGH1yK.jpg' },
  { title: 'Another — Mei Misaki',                  uri: 'https://i.imgur.com/QAaSnMf.jpg' },
  { title: 'Blue Exorcist — Rin Flames',            uri: 'https://i.imgur.com/aW5K4oP.jpg' },
  { title: 'Noragami — Yato God of Calamity',      uri: 'https://i.imgur.com/FLAa32n.jpg' },
  { title: 'Ergo Proxy — Dark City',                uri: 'https://i.imgur.com/IfMfJpZ.jpg' },
  { title: 'Claymore — Clare Awakened',             uri: 'https://i.imgur.com/kUiGsXx.jpg' },
  { title: 'Dr. Stone — Senku Kingdom',             uri: 'https://i.imgur.com/e9TG3UJ.jpg' },
  { title: 'Assassination Classroom — Koro',        uri: 'https://i.imgur.com/mNhWJmj.jpg' },
  { title: 'Angel Beats — Kanade Wings',            uri: 'https://i.imgur.com/SqYiHsJ.jpg' },
  { title: 'Toradora — Taiga Dragon',               uri: 'https://i.imgur.com/0qRIWCw.jpg' },
  { title: 'Your Lie in April — Kousei Piano',     uri: 'https://i.imgur.com/nfMu2bz.jpg' },
  { title: 'Anohana — Menma',                       uri: 'https://i.imgur.com/rT8i1wr.jpg' },
  { title: 'Erased — Satoru Snow',                  uri: 'https://i.imgur.com/Kl8cCCF.jpg' },
  { title: 'Mushoku Tensei — Rudeus Magic',         uri: 'https://i.imgur.com/BtNaxfj.jpg' },
  { title: 'Spy x Family — Anya Forger',            uri: 'https://i.imgur.com/6kUC4YX.jpg' },
  { title: 'Frieren — Beyond the Journey',          uri: 'https://i.imgur.com/bxOIFr6.jpg' },
  { title: 'Oshi no Ko — Ai Hoshino',              uri: 'https://i.imgur.com/CLME5XS.jpg' },
  { title: 'Blue Lock — Isagi Zone',                uri: 'https://i.imgur.com/wVJB8Rm.jpg' },
  { title: 'Inuyasha — Half Demon',                 uri: 'https://i.imgur.com/DamCmtE.jpg' },
  { title: 'Yu Yu Hakusho — Spirit Gun',            uri: 'https://i.imgur.com/CrqUBiP.jpg' },
  { title: 'Seven Deadly Sins — Meliodas Wrath',   uri: 'https://i.imgur.com/qxKbhJU.jpg' },
  { title: 'Black Butler — Sebastian Contract',    uri: 'https://i.imgur.com/jXcHkAh.jpg' },
  { title: 'Banana Fish — Ash Lynx',               uri: 'https://i.imgur.com/2nHqxXY.jpg' },
  { title: 'Devilman Crybaby — Akira',             uri: 'https://i.imgur.com/rCnb0Z5.jpg' },
  { title: 'Made in Abyss — Riko & Reg',           uri: 'https://i.imgur.com/uqYGLfU.jpg' },
  { title: 'Dororo — Hyakkimaru Swords',           uri: 'https://i.imgur.com/0GMi5X8.jpg' },
  { title: 'Rurouni Kenshin — Battousai',           uri: 'https://i.imgur.com/Kf7JXaW.jpg' },
  { title: 'Trigun — Vash the Stampede',            uri: 'https://i.imgur.com/VX8y3eR.jpg' },
  { title: 'Hajime no Ippo — Dempsey Roll',         uri: 'https://i.imgur.com/hBHlwLG.jpg' },
  { title: 'Durarara — Shizuo vs Izaya',            uri: 'https://i.imgur.com/TuJMiXU.jpg' },
  { title: 'Bakemonogatari — Hitagi',               uri: 'https://i.imgur.com/DJyGq7e.jpg' },
  { title: 'Spice and Wolf — Holo Wolf',            uri: 'https://i.imgur.com/7mZBvpO.jpg' },
  { title: 'Log Horizon — Shiroe Elder Tale',       uri: 'https://i.imgur.com/gZzNEHG.jpg' },
  { title: 'KonoSuba — Aqua & Megumin',             uri: 'https://i.imgur.com/h9bJL3k.jpg' },
  { title: 'Kaguya-sama — Love is War',             uri: 'https://i.imgur.com/K2fkpIj.jpg' },
  { title: 'Darling in FranXX — Zero Two',          uri: 'https://i.imgur.com/LQDFRbj.jpg' },
  { title: 'Goblin Slayer — Dark Fantasy',          uri: 'https://i.imgur.com/SdEhTAc.jpg' },
  { title: 'Rising of Shield Hero — Naofumi',       uri: 'https://i.imgur.com/NvqWmCS.jpg' },
  { title: 'Tower of God — Bam Power',              uri: 'https://i.imgur.com/P3OgNY4.jpg' },
  { title: 'Fire Force — Shinra Flames',            uri: 'https://i.imgur.com/ggqK5Ro.jpg' },
  { title: 'Tensura — Rimuru Tempest',              uri: 'https://i.imgur.com/cMQn8Hp.jpg' },
  { title: 'Black Lagoon — Revy Two Hand',          uri: 'https://i.imgur.com/KQbHDaL.jpg' },
  { title: 'Danmachi — Bell Cranel',                uri: 'https://i.imgur.com/7YqMpuG.jpg' },
  { title: 'Kabaneri — Iron Fortress',              uri: 'https://i.imgur.com/XtFGqBr.jpg' },
  { title: 'Date A Live — Tohka Spirit',            uri: 'https://i.imgur.com/Wf1kJHs.jpg' },
  { title: 'Highschool DxD — Issei Dragon',         uri: 'https://i.imgur.com/mHt8Grn.jpg' },
  { title: 'Food Wars — Soma Yukihira',             uri: 'https://i.imgur.com/j6MfBZC.jpg' },
  { title: 'Oregairu — Yukino & Hachiman',          uri: 'https://i.imgur.com/rQlLFNq.jpg' },
  { title: 'Bocchi the Rock — Guitar Hero',         uri: 'https://i.imgur.com/PbvYiE2.jpg' },
  { title: 'Fate/Stay Night — Archer UBW',          uri: 'https://i.imgur.com/GF5hNjP.jpg' },
  { title: 'Dragon Ball — Vegeta Super Saiyan',     uri: 'https://i.imgur.com/5sKntYd.jpg' },
  { title: 'Yu-Gi-Oh — Dark Millennium Puzzle',     uri: 'https://i.imgur.com/2PxBxNK.jpg' },
  { title: 'Clannad — Nagisa Sakura',               uri: 'https://i.imgur.com/kJNSRxF.jpg' },
  { title: 'Slam Dunk — Sakuragi Hanamichi',        uri: 'https://i.imgur.com/Nc7IwpX.jpg' },
  { title: 'Evangelion — Rei Ayanami',              uri: 'https://i.imgur.com/mQfCUud.jpg' },
  { title: 'Fullmetal Alchemist — Brothers',        uri: 'https://i.imgur.com/wQ9oJGS.jpg' },
];

export default function AbyssScreen() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [active, setActive] = useState(isAbyssActive());
  const [unlockInput, setUnlockInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [settingPw, setSettingPw] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(
    () => Math.floor(Math.random() * ANIME_WALLPAPERS.length)
  );
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => onAbyssChange(setActive), []);

  useEffect(() => {
    if (active) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.18, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])).start();
    } else { pulse.setValue(1); }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }).start(() => {
        setWallpaperIndex(i => (i + 1) % ANIME_WALLPAPERS.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
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
    const current = ANIME_WALLPAPERS[wallpaperIndex];
    return (
      <View style={s.abyss}>
        <StatusBar hidden />
        <Animated.Image
          key={current.uri}
          source={{ uri: current.uri }}
          style={[s.wallpaper, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
        <View style={s.overlay} />
        <Animated.View style={[s.glow, { transform: [{ scale: pulse }] }]} />
        <View style={s.abyssInner}>
          <Ionicons name="eye-off" size={42} color="rgba(255,255,255,0.35)" />
          <Text style={s.abyssLabel}>ABYSS MODE</Text>
          <Text style={s.animeTitle}>{current.title}</Text>
          <Text style={s.wallpaperCount}>#{wallpaperIndex + 1} of {ANIME_WALLPAPERS.length}</Text>
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
      <Text style={[s.sub, { color: c.mutedText }]}>{"Blank your screen.\n100 anime wallpapers · cycles every 8s."}</Text>

      <ImageBackground
        source={{ uri: ANIME_WALLPAPERS[0].uri }}
        style={s.preview}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="cover"
      >
        <View style={s.previewOverlay}>
          <Ionicons name="eye-off" size={32} color="rgba(255,255,255,0.9)" />
          <Text style={{ color: '#fff', marginTop: 8, fontSize: 14, fontWeight: '800' }}>100 Anime Wallpapers</Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 }}>AOT · JJK · Demon Slayer · Chainsaw Man · +96 more</Text>
        </View>
      </ImageBackground>

      <View style={[s.infoCard, { backgroundColor: c.surface, borderColor: c.border }]}>
        {[
          ['images',           '100 wallpapers from top 100 ranked anime'],
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

      <Pressable onPress={() => activateAbyss()} style={s.activateBtn}>
        <Ionicons name="eye-off" size={22} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>Activate Abyss Mode</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, paddingTop: 60, paddingHorizontal: 16, gap: 16 },
  title:         { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  sub:           { fontSize: 14, lineHeight: 20, marginTop: -8 },
  preview:       { height: 160, borderRadius: 20, overflow: 'hidden' },
  previewOverlay:{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 20, alignItems: 'center', justifyContent: 'center', padding: 16 },
  infoCard:      { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  infoRow:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pwCard:        { borderRadius: 14, borderWidth: 1, padding: 14 },
  pwRow:         { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pwInput:       { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15 },
  pwSetBtn:      { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  activateBtn:   { backgroundColor: '#05070f', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, marginBottom: 40 },
  abyss:         { flex: 1, backgroundColor: '#000' },
  wallpaper:     { position: 'absolute', width, height },
  overlay:       { position: 'absolute', width, height, backgroundColor: 'rgba(0,0,0,0.45)' },
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
