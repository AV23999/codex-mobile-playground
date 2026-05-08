import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Animated, Easing, StatusBar, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { activateAbyss, deactivateAbyss, isAbyssActive, onAbyssChange, setAbyssPassword } from '../../src/services/abyssService';

const { width, height } = Dimensions.get('window');

// 100 wallpapers from top 100 ranked anime (MyAnimeList / ANN popularity)
const ANIME_WALLPAPERS = [
  // 1 - Fullmetal Alchemist Brotherhood
  { title: 'Fullmetal Alchemist: Brotherhood', uri: 'https://images.alphacoders.com/674/674895.jpg' },
  // 2 - Death Note
  { title: 'Death Note', uri: 'https://images.alphacoders.com/606/606658.jpg' },
  // 3 - Attack on Titan
  { title: 'Attack on Titan', uri: 'https://images.alphacoders.com/129/1296876.jpg' },
  // 4 - Demon Slayer
  { title: 'Demon Slayer', uri: 'https://images.alphacoders.com/118/1189221.jpg' },
  // 5 - Jujutsu Kaisen
  { title: 'Jujutsu Kaisen', uri: 'https://images.alphacoders.com/118/1188267.jpg' },
  // 6 - One Piece
  { title: 'One Piece', uri: 'https://images.alphacoders.com/132/1326571.jpg' },
  // 7 - Naruto
  { title: 'Naruto', uri: 'https://images.alphacoders.com/827/827274.jpg' },
  // 8 - Dragon Ball Z
  { title: 'Dragon Ball Z', uri: 'https://images.alphacoders.com/100/1001565.jpg' },
  // 9 - My Hero Academia
  { title: 'My Hero Academia', uri: 'https://images.alphacoders.com/899/899770.jpg' },
  // 10 - Bleach
  { title: 'Bleach', uri: 'https://images.alphacoders.com/130/1300070.jpg' },
  // 11 - Sword Art Online
  { title: 'Sword Art Online', uri: 'https://images.alphacoders.com/562/562845.jpg' },
  // 12 - Code Geass
  { title: 'Code Geass', uri: 'https://images.alphacoders.com/100/1009426.jpg' },
  // 13 - Hunter x Hunter
  { title: 'Hunter x Hunter', uri: 'https://images.alphacoders.com/671/671294.jpg' },
  // 14 - Steins;Gate
  { title: 'Steins;Gate', uri: 'https://images.alphacoders.com/484/484494.jpg' },
  // 15 - Neon Genesis Evangelion
  { title: 'Neon Genesis Evangelion', uri: 'https://images.alphacoders.com/120/1206895.jpg' },
  // 16 - Cowboy Bebop
  { title: 'Cowboy Bebop', uri: 'https://images.alphacoders.com/851/851531.jpg' },
  // 17 - One Punch Man
  { title: 'One Punch Man', uri: 'https://images.alphacoders.com/699/699820.jpg' },
  // 18 - Tokyo Ghoul
  { title: 'Tokyo Ghoul', uri: 'https://images.alphacoders.com/623/623242.jpg' },
  // 19 - Re:Zero
  { title: 'Re:Zero', uri: 'https://images.alphacoders.com/879/879876.jpg' },
  // 20 - Gurren Lagann
  { title: 'Gurren Lagann', uri: 'https://images.alphacoders.com/504/504536.jpg' },
  // 21 - Fairy Tail
  { title: 'Fairy Tail', uri: 'https://images.alphacoders.com/629/629200.jpg' },
  // 22 - Violet Evergarden
  { title: 'Violet Evergarden', uri: 'https://images.alphacoders.com/955/955388.jpg' },
  // 23 - Mob Psycho 100
  { title: 'Mob Psycho 100', uri: 'https://images.alphacoders.com/900/900060.jpg' },
  // 24 - Psycho-Pass
  { title: 'Psycho-Pass', uri: 'https://images.alphacoders.com/488/488730.jpg' },
  // 25 - Fullmetal Alchemist (2003)
  { title: 'Fullmetal Alchemist', uri: 'https://images.alphacoders.com/748/748506.jpg' },
  // 26 - Haikyuu
  { title: 'Haikyuu!!', uri: 'https://images.alphacoders.com/663/663993.jpg' },
  // 27 - Toradora
  { title: 'Toradora!', uri: 'https://images.alphacoders.com/583/583476.jpg' },
  // 28 - Your Lie in April
  { title: 'Your Lie in April', uri: 'https://images.alphacoders.com/681/681576.jpg' },
  // 29 - Sword Art Online: Alicization
  { title: 'SAO: Alicization', uri: 'https://images.alphacoders.com/103/1035127.jpg' },
  // 30 - Parasyte
  { title: 'Parasyte', uri: 'https://images.alphacoders.com/651/651523.jpg' },
  // 31 - Assassination Classroom
  { title: 'Assassination Classroom', uri: 'https://images.alphacoders.com/694/694104.jpg' },
  // 32 - Erased
  { title: 'Erased (Boku dake)', uri: 'https://images.alphacoders.com/732/732876.jpg' },
  // 33 - Black Clover
  { title: 'Black Clover', uri: 'https://images.alphacoders.com/982/982374.jpg' },
  // 34 - Promised Neverland
  { title: 'The Promised Neverland', uri: 'https://images.alphacoders.com/101/1017926.jpg' },
  // 35 - Overlord
  { title: 'Overlord', uri: 'https://images.alphacoders.com/697/697558.jpg' },
  // 36 - No Game No Life
  { title: 'No Game No Life', uri: 'https://images.alphacoders.com/620/620690.jpg' },
  // 37 - Angel Beats
  { title: 'Angel Beats!', uri: 'https://images.alphacoders.com/233/233766.jpg' },
  // 38 - Akame ga Kill
  { title: 'Akame ga Kill!', uri: 'https://images.alphacoders.com/638/638022.jpg' },
  // 39 - Kill la Kill
  { title: 'Kill la Kill', uri: 'https://images.alphacoders.com/563/563491.jpg' },
  // 40 - Soul Eater
  { title: 'Soul Eater', uri: 'https://images.alphacoders.com/382/382905.jpg' },
  // 41 - Blue Exorcist
  { title: 'Blue Exorcist', uri: 'https://images.alphacoders.com/257/257272.jpg' },
  // 42 - Noragami
  { title: 'Noragami', uri: 'https://images.alphacoders.com/603/603938.jpg' },
  // 43 - Mirai Nikki (Future Diary)
  { title: 'Future Diary', uri: 'https://images.alphacoders.com/407/407543.jpg' },
  // 44 - Another
  { title: 'Another', uri: 'https://images.alphacoders.com/355/355506.jpg' },
  // 45 - Berserk
  { title: 'Berserk', uri: 'https://images.alphacoders.com/858/858534.jpg' },
  // 46 - Claymore
  { title: 'Claymore', uri: 'https://images.alphacoders.com/117/117413.jpg' },
  // 47 - Elfen Lied
  { title: 'Elfen Lied', uri: 'https://images.alphacoders.com/490/490474.jpg' },
  // 48 - Hellsing Ultimate
  { title: 'Hellsing Ultimate', uri: 'https://images.alphacoders.com/100/1005698.jpg' },
  // 49 - Darker than Black
  { title: 'Darker than Black', uri: 'https://images.alphacoders.com/107/107491.jpg' },
  // 50 - Trigun
  { title: 'Trigun', uri: 'https://images.alphacoders.com/100/1008044.jpg' },
  // 51 - JoJo's Bizarre Adventure
  { title: "JoJo's Bizarre Adventure", uri: 'https://images.alphacoders.com/987/987622.jpg' },
  // 52 - Dr. Stone
  { title: 'Dr. Stone', uri: 'https://images.alphacoders.com/108/1082034.jpg' },
  // 53 - Vinland Saga
  { title: 'Vinland Saga', uri: 'https://images.alphacoders.com/114/1145048.jpg' },
  // 54 - Chainsaw Man
  { title: 'Chainsaw Man', uri: 'https://images.alphacoders.com/130/1300488.jpg' },
  // 55 - Spy x Family
  { title: 'Spy x Family', uri: 'https://images.alphacoders.com/128/1284746.jpg' },
  // 56 - Mushoku Tensei
  { title: 'Mushoku Tensei', uri: 'https://images.alphacoders.com/118/1184892.jpg' },
  // 57 - That Time I Got Reincarnated as a Slime
  { title: 'Tensura (Slime)', uri: 'https://images.alphacoders.com/101/1013344.jpg' },
  // 58 - Sword Art Online Progressive
  { title: 'Black Lagoon', uri: 'https://images.alphacoders.com/100/1008540.jpg' },
  // 59 - Fate/Zero
  { title: 'Fate/Zero', uri: 'https://images.alphacoders.com/380/380900.jpg' },
  // 60 - Fate/Stay Night: UBW
  { title: 'Fate/Stay Night UBW', uri: 'https://images.alphacoders.com/673/673984.jpg' },
  // 61 - Made in Abyss
  { title: 'Made in Abyss', uri: 'https://images.alphacoders.com/902/902014.jpg' },
  // 62 - Dororo
  { title: 'Dororo', uri: 'https://images.alphacoders.com/107/1079432.jpg' },
  // 63 - Samurai Champloo
  { title: 'Samurai Champloo', uri: 'https://images.alphacoders.com/629/629574.jpg' },
  // 64 - Ghost in the Shell
  { title: 'Ghost in the Shell', uri: 'https://images.alphacoders.com/733/733208.jpg' },
  // 65 - Ergo Proxy
  { title: 'Ergo Proxy', uri: 'https://images.alphacoders.com/160/160082.jpg' },
  // 66 - Evangelion 3.0+1.0
  { title: 'Evangelion 3.0+1.0', uri: 'https://images.alphacoders.com/121/1214280.jpg' },
  // 67 - Banana Fish
  { title: 'Banana Fish', uri: 'https://images.alphacoders.com/990/990548.jpg' },
  // 68 - Dororo 2019
  { title: 'Devilman Crybaby', uri: 'https://images.alphacoders.com/955/955690.jpg' },
  // 69 - Rurouni Kenshin
  { title: 'Rurouni Kenshin', uri: 'https://images.alphacoders.com/629/629940.jpg' },
  // 70 - Inuyasha
  { title: 'Inuyasha', uri: 'https://images.alphacoders.com/126/1267070.jpg' },
  // 71 - Yu Yu Hakusho
  { title: 'Yu Yu Hakusho', uri: 'https://images.alphacoders.com/875/875918.jpg' },
  // 72 - Hajime no Ippo
  { title: 'Hajime no Ippo', uri: 'https://images.alphacoders.com/659/659096.jpg' },
  // 73 - Anohana
  { title: 'Anohana', uri: 'https://images.alphacoders.com/371/371920.jpg' },
  // 74 - Clannad After Story
  { title: 'Clannad After Story', uri: 'https://images.alphacoders.com/456/456898.jpg' },
  // 75 - Spice and Wolf
  { title: 'Spice and Wolf', uri: 'https://images.alphacoders.com/105/105416.jpg' },
  // 76 - Madoka Magica
  { title: 'Puella Magi Madoka Magica', uri: 'https://images.alphacoders.com/408/408542.jpg' },
  // 77 - Log Horizon
  { title: 'Log Horizon', uri: 'https://images.alphacoders.com/562/562978.jpg' },
  // 78 - Konosuba
  { title: 'KonoSuba', uri: 'https://images.alphacoders.com/741/741272.jpg' },
  // 79 - Seven Deadly Sins
  { title: 'Seven Deadly Sins', uri: 'https://images.alphacoders.com/680/680488.jpg' },
  // 80 - Sword Art Online II
  { title: 'Danmachi', uri: 'https://images.alphacoders.com/687/687064.jpg' },
  // 81 - Black Butler
  { title: 'Black Butler', uri: 'https://images.alphacoders.com/469/469636.jpg' },
  // 82 - Highschool DxD
  { title: 'Highschool DxD', uri: 'https://images.alphacoders.com/532/532988.jpg' },
  // 83 - Durarara
  { title: 'Durarara!!', uri: 'https://images.alphacoders.com/371/371922.jpg' },
  // 84 - Bakemonogatari
  { title: 'Bakemonogatari', uri: 'https://images.alphacoders.com/489/489394.jpg' },
  // 85 - Oregairu
  { title: 'Oregairu (SNAFU)', uri: 'https://images.alphacoders.com/576/576200.jpg' },
  // 86 - Oreimo
  { title: 'Sword Art Online: Progressive', uri: 'https://images.alphacoders.com/124/1241360.jpg' },
  // 87 - Date A Live
  { title: 'Date A Live', uri: 'https://images.alphacoders.com/532/532192.jpg' },
  // 88 - Food Wars
  { title: 'Food Wars!', uri: 'https://images.alphacoders.com/700/700124.jpg' },
  // 89 - Kaguya-sama
  { title: 'Kaguya-sama: Love is War', uri: 'https://images.alphacoders.com/103/1035502.jpg' },
  // 90 - Darling in the FranXX
  { title: 'Darling in the FranXX', uri: 'https://images.alphacoders.com/975/975062.jpg' },
  // 91 - Overlord III
  { title: 'Goblin Slayer', uri: 'https://images.alphacoders.com/100/1004318.jpg' },
  // 92 - Rising of the Shield Hero
  { title: 'Rising of the Shield Hero', uri: 'https://images.alphacoders.com/103/1034030.jpg' },
  // 93 - Kabaneri of the Iron Fortress
  { title: 'Kabaneri of the Iron Fortress', uri: 'https://images.alphacoders.com/745/745298.jpg' },
  // 94 - Nanatsu no Taizai
  { title: 'Fire Force (Enen no Shouboutai)', uri: 'https://images.alphacoders.com/108/1088736.jpg' },
  // 95 - Tower of God
  { title: 'Tower of God', uri: 'https://images.alphacoders.com/113/1131068.jpg' },
  // 96 - Frieren
  { title: 'Frieren: Beyond Journey\'s End', uri: 'https://images.alphacoders.com/135/1357404.jpg' },
  // 97 - Oshi no Ko
  { title: 'Oshi no Ko', uri: 'https://images.alphacoders.com/134/1340756.jpg' },
  // 98 - Blue Lock
  { title: 'Blue Lock', uri: 'https://images.alphacoders.com/131/1312486.jpg' },
  // 99 - Bocchi the Rock
  { title: 'Bocchi the Rock!', uri: 'https://images.alphacoders.com/131/1314278.jpg' },
  // 100 - Slam Dunk
  { title: 'The First Slam Dunk', uri: 'https://images.alphacoders.com/132/1322060.jpg' },
];

export default function AbyssScreen() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [active, setActive] = useState(isAbyssActive());
  const [unlockInput, setUnlockInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [settingPw, setSettingPw] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(() => Math.floor(Math.random() * ANIME_WALLPAPERS.length));
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => onAbyssChange(setActive), []);

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

  // Cycle wallpapers every 8s with crossfade
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 700, useNativeDriver: true }).start(() => {
        setWallpaperIndex(i => (i + 1) % ANIME_WALLPAPERS.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
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
          source={{ uri: current.uri }}
          style={[s.wallpaper, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
        <View style={s.overlay} />
        <Animated.View style={[s.glow, { transform: [{ scale: pulse }] }]} />
        <View style={s.abyssInner}>
          <Ionicons name="eye-off" size={42} color="rgba(255,255,255,0.3)" />
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
          <Ionicons name="eye-off" size={32} color="rgba(255,255,255,0.8)" />
          <Text style={{ color: '#fff', marginTop: 8, fontSize: 14, fontWeight: '700' }}>100 Anime Wallpapers</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }}>FMA · Death Note · AOT · Demon Slayer · +96 more</Text>
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
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  sub: { fontSize: 14, lineHeight: 20, marginTop: -8 },
  preview: { height: 160, borderRadius: 20, overflow: 'hidden' },
  previewOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, alignItems: 'center', justifyContent: 'center', padding: 16 },
  infoCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pwCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
  pwRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pwInput: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15 },
  pwSetBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  activateBtn: { backgroundColor: '#05070f', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, marginBottom: 40 },
  abyss: { flex: 1, backgroundColor: '#000' },
  wallpaper: { position: 'absolute', width, height },
  overlay: { position: 'absolute', width, height, backgroundColor: 'rgba(0,0,0,0.52)' },
  glow: { position: 'absolute', top: height * 0.3, left: width / 2 - 120, width: 240, height: 240, borderRadius: 120, backgroundColor: '#7c3aed', opacity: 0.1 },
  abyssInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 36 },
  abyssLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: '800', letterSpacing: 6, marginTop: 8 },
  animeTitle: { color: 'rgba(255,255,255,0.75)', fontSize: 16, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  wallpaperCount: { color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: 1 },
  unlockRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 16 },
  unlockInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  unlockBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  orText: { color: 'rgba(255,255,255,0.2)', fontSize: 12, marginVertical: 2 },
  bioBtn: { alignItems: 'center', gap: 8, padding: 12 },
  bioText: { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
});
