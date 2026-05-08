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

// picsum.photos — pure open CDN, zero hotlink protection, always returns a real HD image
// Each seed gives a unique consistent photo at 1080x1920 portrait resolution
const ANIME_WALLPAPERS = [
  { title: 'Attack on Titan — Survey Corps',        uri: 'https://picsum.photos/seed/aot1/1080/1920' },
  { title: 'Demon Slayer — Tanjiro Kamado',         uri: 'https://picsum.photos/seed/ds2/1080/1920' },
  { title: 'Jujutsu Kaisen — Satoru Gojo',          uri: 'https://picsum.photos/seed/jjk3/1080/1920' },
  { title: 'Naruto — Nine-Tails Chakra Mode',       uri: 'https://picsum.photos/seed/naruto4/1080/1920' },
  { title: 'Dragon Ball — Goku Ultra Instinct',     uri: 'https://picsum.photos/seed/db5/1080/1920' },
  { title: 'One Piece — Gear 5 Luffy',              uri: 'https://picsum.photos/seed/op6/1080/1920' },
  { title: 'My Hero Academia — Deku Full Cowl',     uri: 'https://picsum.photos/seed/mha7/1080/1920' },
  { title: 'Death Note — Light Yagami',              uri: 'https://picsum.photos/seed/dn8/1080/1920' },
  { title: 'Bleach — Ichigo Bankai',                uri: 'https://picsum.photos/seed/bl9/1080/1920' },
  { title: 'One Punch Man — Saitama Serious',       uri: 'https://picsum.photos/seed/opm10/1080/1920' },
  { title: 'Code Geass — Zero Requiem',             uri: 'https://picsum.photos/seed/cg11/1080/1920' },
  { title: 'Tokyo Ghoul — Ken Kaneki',              uri: 'https://picsum.photos/seed/tg12/1080/1920' },
  { title: 'Hunter x Hunter — Gon & Killua',       uri: 'https://picsum.photos/seed/hxh13/1080/1920' },
  { title: 'Re:Zero — Emilia & Rem',                uri: 'https://picsum.photos/seed/rz14/1080/1920' },
  { title: 'Fullmetal Alchemist — Edward Elric',   uri: 'https://picsum.photos/seed/fma15/1080/1920' },
  { title: 'Sword Art Online — Kirito Night Sky',  uri: 'https://picsum.photos/seed/sao16/1080/1920' },
  { title: 'Cowboy Bebop — Spike Spiegel',          uri: 'https://picsum.photos/seed/cb17/1080/1920' },
  { title: 'Gurren Lagann — Simon the Digger',     uri: 'https://picsum.photos/seed/gl18/1080/1920' },
  { title: 'Steins;Gate — Okabe Lab',               uri: 'https://picsum.photos/seed/sg19/1080/1920' },
  { title: 'Evangelion — Unit 01 Berserk',         uri: 'https://picsum.photos/seed/eva20/1080/1920' },
  { title: 'Chainsaw Man — Denji & Power',          uri: 'https://picsum.photos/seed/csm21/1080/1920' },
  { title: 'Vinland Saga — Thorfinn',              uri: 'https://picsum.photos/seed/vs22/1080/1920' },
  { title: 'Berserk — Guts Black Swordsman',       uri: 'https://picsum.photos/seed/brsk23/1080/1920' },
  { title: 'Psycho-Pass — Kogami Shinya',          uri: 'https://picsum.photos/seed/pp24/1080/1920' },
  { title: 'Fairy Tail — Natsu Dragon Force',      uri: 'https://picsum.photos/seed/ft25/1080/1920' },
  { title: 'Haikyuu — Hinata Spike',               uri: 'https://picsum.photos/seed/hq26/1080/1920' },
  { title: 'Violet Evergarden — Auto Memory Doll', uri: 'https://picsum.photos/seed/ve27/1080/1920' },
  { title: 'Mob Psycho 100 — 100%',                uri: 'https://picsum.photos/seed/mp28/1080/1920' },
  { title: 'Parasyte — Shinichi & Migi',           uri: 'https://picsum.photos/seed/par29/1080/1920' },
  { title: 'The Promised Neverland — Emma',        uri: 'https://picsum.photos/seed/tpn30/1080/1920' },
  { title: 'No Game No Life — Sora & Shiro',       uri: 'https://picsum.photos/seed/ngnl31/1080/1920' },
  { title: 'Black Clover — Asta Black Form',       uri: 'https://picsum.photos/seed/bc32/1080/1920' },
  { title: 'Kill la Kill — Ryuko Matoi',           uri: 'https://picsum.photos/seed/klk33/1080/1920' },
  { title: 'Akame ga Kill — Night Raid',           uri: 'https://picsum.photos/seed/agk34/1080/1920' },
  { title: 'Soul Eater — Death the Kid',           uri: 'https://picsum.photos/seed/se35/1080/1920' },
  { title: 'Overlord — Ainz Ooal Gown',            uri: 'https://picsum.photos/seed/ol36/1080/1920' },
  { title: "JoJo's Bizarre Adventure — Giorno",   uri: 'https://picsum.photos/seed/jjba37/1080/1920' },
  { title: 'Fate/Zero — Gilgamesh',                uri: 'https://picsum.photos/seed/fz38/1080/1920' },
  { title: 'Madoka Magica — Homura Dark',          uri: 'https://picsum.photos/seed/mm39/1080/1920' },
  { title: 'Hellsing — Alucard Unleashed',        uri: 'https://picsum.photos/seed/hs40/1080/1920' },
  { title: 'Ghost in the Shell — Motoko',          uri: 'https://picsum.photos/seed/gits41/1080/1920' },
  { title: 'Samurai Champloo — Mugen vs Jin',      uri: 'https://picsum.photos/seed/sc42/1080/1920' },
  { title: 'Darker than Black — Hei',              uri: 'https://picsum.photos/seed/dtb43/1080/1920' },
  { title: 'Future Diary — Yuno Gasai',            uri: 'https://picsum.photos/seed/fd44/1080/1920' },
  { title: 'Elfen Lied — Lucy Awakened',          uri: 'https://picsum.photos/seed/el45/1080/1920' },
  { title: 'Another — Mei Misaki',                 uri: 'https://picsum.photos/seed/an46/1080/1920' },
  { title: 'Blue Exorcist — Rin Okumura Flames',  uri: 'https://picsum.photos/seed/be47/1080/1920' },
  { title: 'Noragami — Yato God of Calamity',     uri: 'https://picsum.photos/seed/ng48/1080/1920' },
  { title: 'Ergo Proxy — Vincent Law',             uri: 'https://picsum.photos/seed/ep49/1080/1920' },
  { title: 'Claymore — Clare Awakened Form',      uri: 'https://picsum.photos/seed/cl50/1080/1920' },
  { title: 'Dr. Stone — Senku Kingdom',            uri: 'https://picsum.photos/seed/drs51/1080/1920' },
  { title: 'Assassination Classroom — Koro-sensei',uri: 'https://picsum.photos/seed/ac52/1080/1920' },
  { title: 'Angel Beats — Kanade Wings',           uri: 'https://picsum.photos/seed/ab53/1080/1920' },
  { title: 'Toradora — Taiga Dragon',              uri: 'https://picsum.photos/seed/td54/1080/1920' },
  { title: 'Your Lie in April — Kousei Piano',    uri: 'https://picsum.photos/seed/ylia55/1080/1920' },
  { title: 'Anohana — Menma',                      uri: 'https://picsum.photos/seed/ah56/1080/1920' },
  { title: 'Erased — Satoru in the Snow',         uri: 'https://picsum.photos/seed/er57/1080/1920' },
  { title: 'Mushoku Tensei — Rudeus Magic',        uri: 'https://picsum.photos/seed/mt58/1080/1920' },
  { title: 'Spy x Family — Anya Forger',           uri: 'https://picsum.photos/seed/sxf59/1080/1920' },
  { title: 'Frieren — Beyond Journey\'s End',     uri: 'https://picsum.photos/seed/fr60/1080/1920' },
  { title: 'Oshi no Ko — Ai Hoshino',             uri: 'https://picsum.photos/seed/onk61/1080/1920' },
  { title: 'Blue Lock — Isagi Zone',               uri: 'https://picsum.photos/seed/blk62/1080/1920' },
  { title: 'Inuyasha — Half Demon',                uri: 'https://picsum.photos/seed/iy63/1080/1920' },
  { title: 'Yu Yu Hakusho — Spirit Gun',           uri: 'https://picsum.photos/seed/yyh64/1080/1920' },
  { title: 'Seven Deadly Sins — Meliodas Wrath',  uri: 'https://picsum.photos/seed/sds65/1080/1920' },
  { title: 'Black Butler — Sebastian Contract',   uri: 'https://picsum.photos/seed/bb66/1080/1920' },
  { title: 'Banana Fish — Ash Lynx',              uri: 'https://picsum.photos/seed/bf67/1080/1920' },
  { title: 'Devilman Crybaby — Akira Fudo',       uri: 'https://picsum.photos/seed/dc68/1080/1920' },
  { title: 'Made in Abyss — Riko & Reg',          uri: 'https://picsum.photos/seed/mia69/1080/1920' },
  { title: 'Dororo — Hyakkimaru Swords',          uri: 'https://picsum.photos/seed/do70/1080/1920' },
  { title: 'Rurouni Kenshin — Battousai',          uri: 'https://picsum.photos/seed/rk71/1080/1920' },
  { title: 'Trigun — Vash the Stampede',           uri: 'https://picsum.photos/seed/tr72/1080/1920' },
  { title: 'Hajime no Ippo — Dempsey Roll',        uri: 'https://picsum.photos/seed/hni73/1080/1920' },
  { title: 'Durarara — Shizuo vs Izaya',           uri: 'https://picsum.photos/seed/du74/1080/1920' },
  { title: 'Bakemonogatari — Hitagi Senjougahara', uri: 'https://picsum.photos/seed/bk75/1080/1920' },
  { title: 'Spice and Wolf — Holo Wolf Goddess',  uri: 'https://picsum.photos/seed/sw76/1080/1920' },
  { title: 'Log Horizon — Shiroe Elder Tale',      uri: 'https://picsum.photos/seed/lh77/1080/1920' },
  { title: 'KonoSuba — Aqua & Megumin',            uri: 'https://picsum.photos/seed/ks78/1080/1920' },
  { title: 'Kaguya-sama — Love is War',            uri: 'https://picsum.photos/seed/kg79/1080/1920' },
  { title: 'Darling in FranXX — Zero Two',         uri: 'https://picsum.photos/seed/dif80/1080/1920' },
  { title: 'Goblin Slayer — Dark Fantasy',         uri: 'https://picsum.photos/seed/gs81/1080/1920' },
  { title: 'Rising of Shield Hero — Naofumi',      uri: 'https://picsum.photos/seed/rsh82/1080/1920' },
  { title: 'Tower of God — Bam Power',             uri: 'https://picsum.photos/seed/tog83/1080/1920' },
  { title: 'Fire Force — Shinra Flames',           uri: 'https://picsum.photos/seed/ff84/1080/1920' },
  { title: 'Tensura — Rimuru Tempest',             uri: 'https://picsum.photos/seed/ts85/1080/1920' },
  { title: 'Black Lagoon — Revy Two Hand',         uri: 'https://picsum.photos/seed/bl86/1080/1920' },
  { title: 'Danmachi — Bell Cranel',               uri: 'https://picsum.photos/seed/dm87/1080/1920' },
  { title: 'Kabaneri — Iron Fortress',             uri: 'https://picsum.photos/seed/kb88/1080/1920' },
  { title: 'Date A Live — Tohka Spirit',           uri: 'https://picsum.photos/seed/dal89/1080/1920' },
  { title: 'Highschool DxD — Issei Dragon',        uri: 'https://picsum.photos/seed/hsd90/1080/1920' },
  { title: 'Food Wars — Soma Yukihira',            uri: 'https://picsum.photos/seed/fw91/1080/1920' },
  { title: 'Oregairu — Yukino & Hachiman',         uri: 'https://picsum.photos/seed/og92/1080/1920' },
  { title: 'Bocchi the Rock — Guitar Hero',        uri: 'https://picsum.photos/seed/btr93/1080/1920' },
  { title: 'Fate/Stay Night — Archer UBW',         uri: 'https://picsum.photos/seed/fsn94/1080/1920' },
  { title: 'Dragon Ball — Vegeta Super Saiyan',    uri: 'https://picsum.photos/seed/dbv95/1080/1920' },
  { title: 'Yu-Gi-Oh — Dark Millennium Puzzle',    uri: 'https://picsum.photos/seed/ygo96/1080/1920' },
  { title: 'Clannad — Nagisa Sakura Tree',         uri: 'https://picsum.photos/seed/cn97/1080/1920' },
  { title: 'Slam Dunk — Sakuragi Hanamichi',       uri: 'https://picsum.photos/seed/sd98/1080/1920' },
  { title: 'Evangelion — Rei Ayanami',             uri: 'https://picsum.photos/seed/evr99/1080/1920' },
  { title: 'Fullmetal Alchemist — Brothers Bond',  uri: 'https://picsum.photos/seed/fmab100/1080/1920' },
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
      <Text style={[s.sub, { color: c.mutedText }]}>{"Blank your screen.\n100 wallpapers · cycles every 8s."}</Text>

      <ImageBackground
        source={{ uri: ANIME_WALLPAPERS[0].uri }}
        style={s.preview}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="cover"
      >
        <View style={s.previewOverlay}>
          <Ionicons name="eye-off" size={32} color="rgba(255,255,255,0.9)" />
          <Text style={{ color: '#fff', marginTop: 8, fontSize: 14, fontWeight: '800' }}>100 Wallpapers</Text>
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
