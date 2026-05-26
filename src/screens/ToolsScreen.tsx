import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, IconBadge, Screen, SectionHeader, Text } from '../components';
import { featureAccents, radii, shadow, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Tool = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: keyof RootStackParamList;
  accent: { from: string; to: string };
  badge?: string;
};

const SECTIONS: { title: string; eyebrow: string; tools: Tool[] }[] = [
  {
    eyebrow: 'Video',
    title: 'Generate & edit video',
    tools: [
      { id: 'iv', title: 'AI video', subtitle: 'Text or image to cinematic video', icon: 'sparkles-outline', route: 'ImageVideo', accent: featureAccents.imageVideo },
      { id: 'fv', title: 'Faceless video', subtitle: 'Script → narrated short', icon: 'film-outline', route: 'FacelessVideo', accent: featureAccents.facelessVideo },
      { id: 'av', title: 'AI avatar', subtitle: 'HeyGen-class talking head', icon: 'person-outline', route: 'AIAvatar', accent: featureAccents.voiceover, badge: 'New' },
      { id: 'sb', title: 'Storyboard', subtitle: 'Multi-shot consistent scenes', icon: 'grid-outline', route: 'Storyboard', accent: featureAccents.imageVideo, badge: 'New' },
      { id: 've', title: 'Extend video', subtitle: 'Continue any clip naturally', icon: 'play-forward-outline', route: 'VideoExtend', accent: featureAccents.imageVideo, badge: 'New' },
      { id: 'fx', title: 'Effects', subtitle: 'Melt, crush, explode, glow', icon: 'flash-outline', route: 'Pikaffect', accent: featureAccents.facelessVideo, badge: 'New' },
    ],
  },
  {
    eyebrow: 'Edit',
    title: 'Edit existing video',
    tools: [
      { id: 'cap', title: 'Captions', subtitle: 'Auto, 30+ languages, kinetic', icon: 'text-outline', route: 'Captions', accent: featureAccents.captions },
      { id: 'dub', title: 'Dub', subtitle: 'Voice-cloned translation', icon: 'language-outline', route: 'Dub', accent: featureAccents.dub },
      { id: 'vt', title: 'Translate video', subtitle: 'Lip-sync new language', icon: 'globe-outline', route: 'VideoTranslate', accent: featureAccents.dub, badge: 'New' },
      { id: 'ls', title: 'Lip sync', subtitle: 'Match audio to face', icon: 'mic-outline', route: 'LipSync', accent: featureAccents.facelessVideo, badge: 'New' },
      { id: 'vo', title: 'Voiceover', subtitle: 'Timed multi-segment narration', icon: 'mic-circle-outline', route: 'Voiceover', accent: featureAccents.voiceover },
      { id: 'br', title: 'Background remover', subtitle: 'Green screen / transparent', icon: 'cut-outline', route: 'BackgroundRemove', accent: featureAccents.captions, badge: 'New' },
      { id: 'ip', title: 'Inpaint', subtitle: 'Remove or replace anything', icon: 'brush-outline', route: 'Inpaint', accent: featureAccents.imageVideo, badge: 'New' },
      { id: 'vm', title: 'Video to music', subtitle: 'Auto-score to your cuts', icon: 'musical-notes-outline', route: 'VideoMusic', accent: featureAccents.videoMusic },
    ],
  },
  {
    eyebrow: 'Image',
    title: 'Generate images',
    tools: [
      { id: 'ig', title: 'Image generator', subtitle: 'Flux · Imagen · Midjourney', icon: 'image-outline', route: 'ImageGen', accent: featureAccents.imageVideo, badge: 'New' },
    ],
  },
  {
    eyebrow: 'Audio',
    title: 'Voice, music & sound',
    tools: [
      { id: 'au', title: 'Generate audio', subtitle: 'Studio-grade TTS', icon: 'mic-outline', route: 'Audio', accent: featureAccents.audio },
      { id: 'lf', title: 'Long form audio', subtitle: 'Multi-speaker podcasts', icon: 'people-outline', route: 'LongFormAudio', accent: featureAccents.dub },
      { id: 'mu', title: 'AI music', subtitle: 'Full songs from a prompt', icon: 'disc-outline', route: 'MusicSong', accent: featureAccents.videoMusic, badge: 'New' },
      { id: 'sfx', title: 'Sound effects', subtitle: 'Cinematic SFX from text', icon: 'pulse-outline', route: 'SoundEffects', accent: featureAccents.audio, badge: 'New' },
      { id: 'vc', title: 'Voice changer', subtitle: 'Speech to speech', icon: 'swap-horizontal-outline', route: 'VoiceChanger', accent: featureAccents.voiceover, badge: 'New' },
      { id: 'vi', title: 'Voice isolator', subtitle: 'Remove background noise', icon: 'filter-outline', route: 'VoiceIsolator', accent: featureAccents.audio, badge: 'New' },
      { id: 'tx', title: 'Transcribe', subtitle: 'Speech to text · 90+ langs', icon: 'document-text-outline', route: 'Transcribe', accent: featureAccents.captions, badge: 'New' },
      { id: 'an', title: 'Audio Native', subtitle: 'Embeddable article player', icon: 'play-circle-outline', route: 'AudioNative', accent: featureAccents.audio, badge: 'New' },
    ],
  },
  {
    eyebrow: 'Voices',
    title: 'Design & manage voices',
    tools: [
      { id: 'vd', title: 'Voice design', subtitle: 'Invent voices from text', icon: 'color-wand-outline', route: 'VoiceDesign', accent: featureAccents.audio, badge: 'New' },
      { id: 'vl', title: 'Voice library', subtitle: '1000s of community voices', icon: 'library-outline', route: 'VoiceLibrary', accent: featureAccents.audio, badge: 'New' },
      { id: 'va', title: 'Voice agents', subtitle: 'Conversational AI', icon: 'chatbubbles-outline', route: 'VoiceAgent', accent: featureAccents.dub, badge: 'New' },
    ],
  },
];

export const ToolsScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();

  return (
    <Screen>
      <AppHeader subtitle="Tools" title="Every tool, one tap." />

      {SECTIONS.map((sec) => (
        <View key={sec.eyebrow}>
          <SectionHeader eyebrow={sec.eyebrow} title={sec.title} />
          <View style={styles.grid}>
            {sec.tools.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => nav.navigate(t.route as any)}
                style={({ pressed }) => [styles.tile, shadow.soft, { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.96 : 1 }]}
              >
                <IconBadge icon={t.icon} from={t.accent.from} to={t.accent.to} size={38} />
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <View style={styles.titleRow}>
                    <Text weight="700" numberOfLines={1}>{t.title}</Text>
                    {t.badge ? (
                      <View style={[styles.badge, { backgroundColor: theme.accentTint }]}>
                        <Text variant="caption" color="accent" weight="700">{t.badge}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text variant="bodySm" color="textMuted" numberOfLines={1}>
                    {t.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textFaint} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  grid: { gap: spacing.sm },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
});

export const __i = ScrollView;
