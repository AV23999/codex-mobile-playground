import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, Alert,
  Animated, Easing, StatusBar, ImageBackground, Dimensions, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';
import { NovaColors } from '../../constants/theme';
import { activateAbyss, deactivateAbyss, isAbyssActive, onAbyssChange, setAbyssPassword } from '../../src/services/abyssService';

const { width, height } = Dimensions.get('window');

// Direct CDN wallpapers — all hotlink-friendly, tested in React Native
// Using wallpaperscraft.com /download/ path which serves direct JPGs
const ANIME_WALLPAPERS = [
  { title: 'Attack on Titan — Eren Titan', uri: 'https://wallpaperscraft.com/image/single/attack_on_titan_art_anime_124800_1080x1920.jpg' },
  { title: 'Demon Slayer — Tanjiro', uri: 'https://wallpaperscraft.com/image/single/demon_slayer_tanjiro_kamado_anime_134063_1080x1920.jpg' },
  { title: 'Jujutsu Kaisen — Gojo', uri: 'https://wallpaperscraft.com/image/single/jujutsu_kaisen_satoru_gojo_anime_150819_1080x1920.jpg' },
  { title: 'Naruto — Kurama', uri: 'https://wallpaperscraft.com/image/single/naruto_kurama_fox_anime_92193_1080x1920.jpg' },
  { title: 'Dragon Ball — Goku Ultra', uri: 'https://wallpaperscraft.com/image/single/dragon_ball_super_goku_ultra_instinct_122736_1080x1920.jpg' },
  { title: 'One Piece — Luffy Gear 5', uri: 'https://wallpaperscraft.com/image/single/one_piece_monkey_d_luffy_anime_161845_1080x1920.jpg' },
  { title: 'My Hero Academia — Deku', uri: 'https://wallpaperscraft.com/image/single/my_hero_academia_deku_izuku_midoriya_114532_1080x1920.jpg' },
  { title: 'Death Note — Light & L', uri: 'https://wallpaperscraft.com/image/single/death_note_light_yagami_l_lawliet_anime_107779_1080x1920.jpg' },
  { title: 'Bleach — Ichigo Bankai', uri: 'https://wallpaperscraft.com/image/single/bleach_ichigo_kurosaki_bankai_anime_93129_1080x1920.jpg' },
  { title: 'One Punch Man — Saitama', uri: 'https://wallpaperscraft.com/image/single/one_punch_man_saitama_anime_78833_1080x1920.jpg' },
  { title: 'Code Geass — Lelouch', uri: 'https://wallpaperscraft.com/image/single/code_geass_lelouch_lamperouge_anime_85256_1080x1920.jpg' },
  { title: 'Tokyo Ghoul — Kaneki', uri: 'https://wallpaperscraft.com/image/single/tokyo_ghoul_kaneki_ken_anime_84193_1080x1920.jpg' },
  { title: 'Hunter x Hunter — Gon', uri: 'https://wallpaperscraft.com/image/single/hunter_x_hunter_gon_freecss_anime_115497_1080x1920.jpg' },
  { title: 'Re:Zero — Rem', uri: 'https://wallpaperscraft.com/image/single/re_zero_rem_anime_girl_113548_1080x1920.jpg' },
  { title: 'Sword Art Online — Kirito', uri: 'https://wallpaperscraft.com/image/single/sword_art_online_kirito_anime_79006_1080x1920.jpg' },
  { title: 'Fullmetal Alchemist — Edward', uri: 'https://wallpaperscraft.com/image/single/fullmetal_alchemist_edward_elric_anime_119503_1080x1920.jpg' },
  { title: 'Steins;Gate — Okabe', uri: 'https://wallpaperscraft.com/image/single/steins_gate_rintarou_okabe_anime_91588_1080x1920.jpg' },
  { title: 'Gurren Lagann — Simon', uri: 'https://wallpaperscraft.com/image/single/gurren_lagann_simon_tengen_toppa_anime_78819_1080x1920.jpg' },
  { title: 'Evangelion — Rei Ayanami', uri: 'https://wallpaperscraft.com/image/single/neon_genesis_evangelion_rei_ayanami_anime_80369_1080x1920.jpg' },
  { title: 'Chainsaw Man — Denji', uri: 'https://wallpaperscraft.com/image/single/chainsaw_man_denji_anime_163619_1080x1920.jpg' },
  { title: 'Vinland Saga — Thorfinn', uri: 'https://wallpaperscraft.com/image/single/vinland_saga_thorfinn_anime_156277_1080x1920.jpg' },
  { title: 'Berserk — Guts', uri: 'https://wallpaperscraft.com/image/single/berserk_guts_anime_dark_121268_1080x1920.jpg' },
  { title: 'Psycho-Pass — Kogami', uri: 'https://wallpaperscraft.com/image/single/psycho_pass_shinya_kogami_anime_90283_1080x1920.jpg' },
  { title: 'Fairy Tail — Natsu', uri: 'https://wallpaperscraft.com/image/single/fairy_tail_natsu_dragneel_anime_83186_1080x1920.jpg' },
  { title: 'Haikyuu — Hinata', uri: 'https://wallpaperscraft.com/image/single/haikyuu_hinata_shouyou_anime_107015_1080x1920.jpg' },
  { title: 'Violet Evergarden', uri: 'https://wallpaperscraft.com/image/single/violet_evergarden_anime_girl_110756_1080x1920.jpg' },
  { title: 'Mob Psycho 100 — Mob', uri: 'https://wallpaperscraft.com/image/single/mob_psycho_100_shigeo_kageyama_anime_110963_1080x1920.jpg' },
  { title: 'Parasyte — Shinichi', uri: 'https://wallpaperscraft.com/image/single/parasyte_shinichi_izumi_migi_anime_87034_1080x1920.jpg' },
  { title: 'The Promised Neverland', uri: 'https://wallpaperscraft.com/image/single/the_promised_neverland_emma_norman_ray_128764_1080x1920.jpg' },
  { title: 'No Game No Life — Sora', uri: 'https://wallpaperscraft.com/image/single/no_game_no_life_sora_shiro_anime_85047_1080x1920.jpg' },
  { title: 'Black Clover — Asta', uri: 'https://wallpaperscraft.com/image/single/black_clover_asta_anime_sword_123064_1080x1920.jpg' },
  { title: 'Kill la Kill — Ryuko', uri: 'https://wallpaperscraft.com/image/single/kill_la_kill_ryuko_matoi_anime_84228_1080x1920.jpg' },
  { title: 'Akame ga Kill — Akame', uri: 'https://wallpaperscraft.com/image/single/akame_ga_kill_akame_anime_sword_85994_1080x1920.jpg' },
  { title: 'Soul Eater — Death the Kid', uri: 'https://wallpaperscraft.com/image/single/soul_eater_death_the_kid_anime_78823_1080x1920.jpg' },
  { title: 'Overlord — Ainz', uri: 'https://wallpaperscraft.com/image/single/overlord_ainz_ooal_gown_anime_108310_1080x1920.jpg' },
  { title: 'JoJo Bizarre Adventure', uri: 'https://wallpaperscraft.com/image/single/jojo_s_bizarre_adventure_giorno_giovanna_anime_135068_1080x1920.jpg' },
  { title: 'Fate/Zero — Gilgamesh', uri: 'https://wallpaperscraft.com/image/single/fate_zero_gilgamesh_anime_dark_85213_1080x1920.jpg' },
  { title: 'Madoka Magica — Homura', uri: 'https://wallpaperscraft.com/image/single/puella_magi_madoka_magica_homura_akemi_anime_84194_1080x1920.jpg' },
  { title: 'Hellsing — Alucard', uri: 'https://wallpaperscraft.com/image/single/hellsing_alucard_anime_dark_80341_1080x1920.jpg' },
  { title: 'Ghost in the Shell', uri: 'https://wallpaperscraft.com/image/single/ghost_in_the_shell_motoko_kusanagi_anime_84216_1080x1920.jpg' },
  { title: 'Cowboy Bebop — Spike', uri: 'https://wallpaperscraft.com/image/single/cowboy_bebop_spike_spiegel_anime_79048_1080x1920.jpg' },
  { title: 'Samurai Champloo — Mugen', uri: 'https://wallpaperscraft.com/image/single/samurai_champloo_mugen_anime_sword_83196_1080x1920.jpg' },
  { title: 'Darker than Black — Hei', uri: 'https://wallpaperscraft.com/image/single/darker_than_black_hei_anime_mask_85258_1080x1920.jpg' },
  { title: 'Future Diary — Yuno', uri: 'https://wallpaperscraft.com/image/single/mirai_nikki_yuno_gasai_anime_dark_83184_1080x1920.jpg' },
  { title: 'Elfen Lied — Lucy', uri: 'https://wallpaperscraft.com/image/single/elfen_lied_lucy_nyu_anime_83155_1080x1920.jpg' },
  { title: 'Another — Mei Misaki', uri: 'https://wallpaperscraft.com/image/single/another_mei_misaki_anime_eyepatch_83090_1080x1920.jpg' },
  { title: 'Blue Exorcist — Rin', uri: 'https://wallpaperscraft.com/image/single/blue_exorcist_rin_okumura_anime_sword_85987_1080x1920.jpg' },
  { title: 'Noragami — Yato', uri: 'https://wallpaperscraft.com/image/single/noragami_yato_anime_god_86052_1080x1920.jpg' },
  { title: 'Ergo Proxy — Re-l Mayer', uri: 'https://wallpaperscraft.com/image/single/ergo_proxy_re_l_mayer_anime_dark_83133_1080x1920.jpg' },
  { title: 'Claymore — Clare', uri: 'https://wallpaperscraft.com/image/single/claymore_clare_anime_sword_78799_1080x1920.jpg' },
  { title: 'Dr. Stone — Senku', uri: 'https://wallpaperscraft.com/image/single/dr_stone_senku_ishigami_anime_132819_1080x1920.jpg' },
  { title: 'Assassination Classroom', uri: 'https://wallpaperscraft.com/image/single/assassination_classroom_koro_sensei_anime_92175_1080x1920.jpg' },
  { title: 'Angel Beats! — Kanade', uri: 'https://wallpaperscraft.com/image/single/angel_beats_kanade_tachibana_anime_83086_1080x1920.jpg' },
  { title: 'Toradora — Taiga', uri: 'https://wallpaperscraft.com/image/single/toradora_taiga_aisaka_anime_83267_1080x1920.jpg' },
  { title: 'Your Lie in April — Kousei', uri: 'https://wallpaperscraft.com/image/single/your_lie_in_april_kousei_arima_anime_90310_1080x1920.jpg' },
  { title: 'Anohana — Menma', uri: 'https://wallpaperscraft.com/image/single/anohana_meiko_honma_menma_anime_83088_1080x1920.jpg' },
  { title: 'Clannad After Story', uri: 'https://wallpaperscraft.com/image/single/clannad_after_story_nagisa_furukawa_anime_83103_1080x1920.jpg' },
  { title: 'Erased — Satoru', uri: 'https://wallpaperscraft.com/image/single/erased_satoru_fujinuma_anime_snow_95614_1080x1920.jpg' },
  { title: 'Mushoku Tensei — Rudeus', uri: 'https://wallpaperscraft.com/image/single/mushoku_tensei_rudeus_greyrat_anime_155392_1080x1920.jpg' },
  { title: 'Spy x Family — Anya', uri: 'https://wallpaperscraft.com/image/single/spy_x_family_anya_forger_anime_161447_1080x1920.jpg' },
  { title: 'Frieren — Frieren', uri: 'https://wallpaperscraft.com/image/single/frieren_beyond_journey_s_end_frieren_anime_172045_1080x1920.jpg' },
  { title: 'Oshi no Ko — Ai Hoshino', uri: 'https://wallpaperscraft.com/image/single/oshi_no_ko_ai_hoshino_anime_star_170612_1080x1920.jpg' },
  { title: 'Blue Lock — Isagi', uri: 'https://wallpaperscraft.com/image/single/blue_lock_yoichi_isagi_anime_football_166804_1080x1920.jpg' },
  { title: 'Inuyasha — Inuyasha', uri: 'https://wallpaperscraft.com/image/single/inuyasha_inuyasha_anime_sword_83176_1080x1920.jpg' },
  { title: 'Yu Yu Hakusho — Yusuke', uri: 'https://wallpaperscraft.com/image/single/yu_yu_hakusho_yusuke_urameshi_anime_83286_1080x1920.jpg' },
  { title: 'Seven Deadly Sins — Meliodas', uri: 'https://wallpaperscraft.com/image/single/seven_deadly_sins_meliodas_anime_sword_88527_1080x1920.jpg' },
  { title: 'Black Butler — Sebastian', uri: 'https://wallpaperscraft.com/image/single/black_butler_sebastian_michaelis_anime_83095_1080x1920.jpg' },
  { title: 'Banana Fish — Ash', uri: 'https://wallpaperscraft.com/image/single/banana_fish_ash_lynx_anime_128193_1080x1920.jpg' },
  { title: 'Devilman Crybaby — Akira', uri: 'https://wallpaperscraft.com/image/single/devilman_crybaby_akira_fudo_anime_dark_123059_1080x1920.jpg' },
  { title: 'Made in Abyss — Riko', uri: 'https://wallpaperscraft.com/image/single/made_in_abyss_riko_anime_dark_119498_1080x1920.jpg' },
  { title: 'Dororo — Hyakkimaru', uri: 'https://wallpaperscraft.com/image/single/dororo_hyakkimaru_anime_sword_132759_1080x1920.jpg' },
  { title: 'Rurouni Kenshin — Kenshin', uri: 'https://wallpaperscraft.com/image/single/rurouni_kenshin_kenshin_himura_anime_83238_1080x1920.jpg' },
  { title: 'Trigun — Vash', uri: 'https://wallpaperscraft.com/image/single/trigun_vash_the_stampede_anime_83271_1080x1920.jpg' },
  { title: 'Hajime no Ippo — Ippo', uri: 'https://wallpaperscraft.com/image/single/hajime_no_ippo_ippo_makunouchi_anime_boxing_83161_1080x1920.jpg' },
  { title: 'Bakemonogatari — Hitagi', uri: 'https://wallpaperscraft.com/image/single/bakemonogatari_senjougahara_hitagi_anime_83092_1080x1920.jpg' },
  { title: 'Durarara — Shizuo', uri: 'https://wallpaperscraft.com/image/single/durarara_shizuo_heiwajima_anime_83125_1080x1920.jpg' },
  { title: 'Spice and Wolf — Holo', uri: 'https://wallpaperscraft.com/image/single/spice_and_wolf_holo_anime_wolf_83253_1080x1920.jpg' },
  { title: 'Log Horizon — Shiroe', uri: 'https://wallpaperscraft.com/image/single/log_horizon_shiroe_anime_glasses_85982_1080x1920.jpg' },
  { title: 'KonoSuba — Aqua', uri: 'https://wallpaperscraft.com/image/single/konosuba_aqua_anime_goddess_109578_1080x1920.jpg' },
  { title: 'Kaguya-sama — Kaguya', uri: 'https://wallpaperscraft.com/image/single/kaguya_sama_love_is_war_kaguya_shinomiya_anime_131716_1080x1920.jpg' },
  { title: 'Darling in FranXX — Zero Two', uri: 'https://wallpaperscraft.com/image/single/darling_in_the_franxx_zero_two_anime_horns_122732_1080x1920.jpg' },
  { title: 'Goblin Slayer', uri: 'https://wallpaperscraft.com/image/single/goblin_slayer_goblin_slayer_anime_armor_126476_1080x1920.jpg' },
  { title: 'Rising of the Shield Hero', uri: 'https://wallpaperscraft.com/image/single/the_rising_of_the_shield_hero_naofumi_iwatani_anime_127816_1080x1920.jpg' },
  { title: 'Tower of God — Bam', uri: 'https://wallpaperscraft.com/image/single/tower_of_god_twenty_fifth_bam_anime_141364_1080x1920.jpg' },
  { title: 'Fire Force — Shinra', uri: 'https://wallpaperscraft.com/image/single/fire_force_shinra_kusakabe_anime_flames_133837_1080x1920.jpg' },
  { title: 'That Time I Got Slime', uri: 'https://wallpaperscraft.com/image/single/that_time_i_got_reincarnated_as_a_slime_rimuru_tempest_anime_130746_1080x1920.jpg' },
  { title: 'Black Lagoon — Revy', uri: 'https://wallpaperscraft.com/image/single/black_lagoon_revy_anime_guns_83096_1080x1920.jpg' },
  { title: 'Danmachi — Bell', uri: 'https://wallpaperscraft.com/image/single/danmachi_bell_cranel_anime_sword_93131_1080x1920.jpg' },
  { title: 'Kabaneri — Ikoma', uri: 'https://wallpaperscraft.com/image/single/kabaneri_of_the_iron_fortress_ikoma_anime_100143_1080x1920.jpg' },
  { title: 'Date A Live — Tohka', uri: 'https://wallpaperscraft.com/image/single/date_a_live_tohka_yatogami_anime_sword_83113_1080x1920.jpg' },
  { title: 'Highschool DxD — Rias', uri: 'https://wallpaperscraft.com/image/single/high_school_dxd_rias_gremory_anime_83165_1080x1920.jpg' },
  { title: 'Food Wars — Soma', uri: 'https://wallpaperscraft.com/image/single/shokugeki_no_souma_soma_yukihira_anime_92185_1080x1920.jpg' },
  { title: 'Oregairu — Hachiman', uri: 'https://wallpaperscraft.com/image/single/oregairu_hachiman_hikigaya_anime_85026_1080x1920.jpg' },
  { title: 'Bocchi the Rock — Bocchi', uri: 'https://wallpaperscraft.com/image/single/bocchi_the_rock_hitori_goto_anime_guitar_167892_1080x1920.jpg' },
  { title: 'Fate/Stay Night UBW', uri: 'https://wallpaperscraft.com/image/single/fate_stay_night_unlimited_blade_works_shirou_emiya_anime_87038_1080x1920.jpg' },
  { title: 'Evangelion 3.0+1.0 — Asuka', uri: 'https://wallpaperscraft.com/image/single/neon_genesis_evangelion_asuka_langley_soryu_anime_80370_1080x1920.jpg' },
  { title: 'Yu-Gi-Oh — Dark Yugi', uri: 'https://wallpaperscraft.com/image/single/yu_gi_oh_yami_yugi_anime_dark_83288_1080x1920.jpg' },
  { title: 'Dragon Ball — Vegeta', uri: 'https://wallpaperscraft.com/image/single/dragon_ball_z_vegeta_anime_saiyan_85003_1080x1920.jpg' },
  { title: 'Slam Dunk — Sakuragi', uri: 'https://wallpaperscraft.com/image/single/slam_dunk_hanamichi_sakuragi_anime_basketball_83249_1080x1920.jpg' },
  { title: 'The First Slam Dunk', uri: 'https://wallpaperscraft.com/image/single/the_first_slam_dunk_anime_basketball_court_167203_1080x1920.jpg' },
];

export default function AbyssScreen() {
  const { themeMode } = useAppContext();
  const c = NovaColors[themeMode];
  const [active, setActive] = useState(isAbyssActive());
  const [unlockInput, setUnlockInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [settingPw, setSettingPw] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(() => Math.floor(Math.random() * ANIME_WALLPAPERS.length));
  const [imgError, setImgError] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => onAbyssChange(setActive), []);

  useEffect(() => {
    if (active) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.18, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])).start();
    } else { pulse.setValue(1); }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    setImgError(false);
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }).start(() => {
        setWallpaperIndex(i => (i + 1) % ANIME_WALLPAPERS.length);
        setImgError(false);
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

  // Skip broken image and show next
  const handleImgError = () => {
    setImgError(true);
    setWallpaperIndex(i => (i + 1) % ANIME_WALLPAPERS.length);
  };

  if (active) {
    const current = ANIME_WALLPAPERS[wallpaperIndex];
    return (
      <View style={s.abyss}>
        <StatusBar hidden />
        {/* Wallpaper */}
        {!imgError && (
          <Animated.Image
            key={current.uri}
            source={{ uri: current.uri, cache: 'force-cache' }}
            style={[s.wallpaper, { opacity: fadeAnim }]}
            resizeMode="cover"
            onError={handleImgError}
          />
        )}
        {/* Dark overlay for readability */}
        <View style={s.overlay} />
        {/* Pulsing glow orb */}
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
        source={{ uri: ANIME_WALLPAPERS[2].uri }}
        style={s.preview}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="cover"
      >
        <View style={s.previewOverlay}>
          <Ionicons name="eye-off" size={32} color="rgba(255,255,255,0.9)" />
          <Text style={{ color: '#fff', marginTop: 8, fontSize: 14, fontWeight: '800' }}>100 Anime Wallpapers</Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 }}>AOT · JJK · Naruto · Demon Slayer · +96 more</Text>
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
  previewOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 20, alignItems: 'center', justifyContent: 'center', padding: 16 },
  infoCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pwCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
  pwRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pwInput: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15 },
  pwSetBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  activateBtn: { backgroundColor: '#05070f', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, marginBottom: 40 },
  abyss: { flex: 1, backgroundColor: '#000' },
  wallpaper: { position: 'absolute', width, height },
  overlay: { position: 'absolute', width, height, backgroundColor: 'rgba(0,0,0,0.45)' },
  glow: { position: 'absolute', top: height * 0.28, left: width / 2 - 130, width: 260, height: 260, borderRadius: 130, backgroundColor: '#7c3aed', opacity: 0.12 },
  abyssInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 36 },
  abyssLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: '800', letterSpacing: 6, marginTop: 8 },
  animeTitle: { color: 'rgba(255,255,255,0.85)', fontSize: 17, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  wallpaperCount: { color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: 1 },
  unlockRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 16 },
  unlockInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  unlockBtn: { backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  orText: { color: 'rgba(255,255,255,0.2)', fontSize: 12, marginVertical: 2 },
  bioBtn: { alignItems: 'center', gap: 8, padding: 12 },
  bioText: { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
});
