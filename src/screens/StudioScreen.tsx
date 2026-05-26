import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  AppHeader,
  Avatar,
  Card,
  Chip,
  IconBadge,
  Screen,
  SectionHeader,
  Sparkle,
  Text,
} from '../components';
import { featureAccents, radii, shadow, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import { formatRelative } from '../utils/format';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TILES = [
  {
    id: 'image_video',
    title: 'AI video',
    subtitle: 'Text or image to cinematic scene.',
    icon: 'sparkles-outline' as const,
    accent: featureAccents.imageVideo,
    route: 'ImageVideo' as const,
  },
  {
    id: 'faceless_video',
    title: 'Faceless video',
    subtitle: 'Script → narrated short with B-roll.',
    icon: 'film-outline' as const,
    accent: featureAccents.facelessVideo,
    route: 'FacelessVideo' as const,
  },
  {
    id: 'ai_avatar',
    title: 'AI avatar',
    subtitle: 'Photo + script → talking-head video.',
    icon: 'person-outline' as const,
    accent: featureAccents.voiceover,
    route: 'AIAvatar' as const,
  },
  {
    id: 'storyboard',
    title: 'Storyboard',
    subtitle: 'Multi-shot scenes with consistent look.',
    icon: 'grid-outline' as const,
    accent: featureAccents.imageVideo,
    route: 'Storyboard' as const,
  },
  {
    id: 'captions',
    title: 'Add captions',
    subtitle: 'Auto captions, kinetic, 30+ languages.',
    icon: 'text-outline' as const,
    accent: featureAccents.captions,
    route: 'Captions' as const,
  },
  {
    id: 'dub',
    title: 'Dub video',
    subtitle: 'Translate while preserving voice.',
    icon: 'language-outline' as const,
    accent: featureAccents.dub,
    route: 'Dub' as const,
  },
];

export const StudioScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const { projects } = useProjects();
  const recent = projects.slice(0, 6);

  return (
    <Screen>
      <AppHeader
        subtitle="Studio"
        title="Make something today"
        right={
          <Pressable onPress={() => nav.navigate('ProfileTab' as any)}>
            <Avatar initials="GS" />
          </Pressable>
        }
      />

      <Card
        padded={false}
        style={{ backgroundColor: 'transparent', borderColor: 'transparent', overflow: 'visible' }}
      >
        <LinearGradient
          colors={['#FBE5DA', '#F6C6A7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, shadow.card]}
        >
          <View style={styles.heroLeft}>
            <View style={styles.beta}>
              <Sparkle size={12} color="#C96442" />
              <Text variant="caption" color="#9A4B2E">
                NEW BLANK PROJECT
              </Text>
            </View>
            <Text variant="h1" color="#3D1F11" style={{ marginTop: 6 }}>
              Create a video,{'\n'}gently and freely.
            </Text>
            <Text variant="body" color="#7B3D24" style={{ marginTop: 8 }}>
              Pick a tool below or open the canvas to start with a blank scene.
            </Text>
            <Pressable
              onPress={() => nav.navigate('ImageVideo')}
              style={({ pressed }) => [styles.heroCta, { opacity: pressed ? 0.9 : 1 }]}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text variant="body" color="inverse" weight="700">
                Create video
              </Text>
            </Pressable>
          </View>
          <View style={styles.heroArt} pointerEvents="none">
            <View style={styles.heroDot1} />
            <View style={styles.heroDot2} />
            <View style={styles.heroDot3} />
            <Sparkle size={22} delay={100} />
          </View>
        </LinearGradient>
      </Card>

      <SectionHeader eyebrow="Studio" title="Make a video" subtitle="Pick a starting point — every tool is one tap away." />
      <View style={styles.grid}>
        {TILES.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => nav.navigate(t.route)}
            style={({ pressed }) => [styles.tile, shadow.card, { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.96 : 1 }]}
          >
            <IconBadge icon={t.icon} from={t.accent.from} to={t.accent.to} size={42} />
            <Text variant="h3" style={{ marginTop: spacing.md }}>
              {t.title}
            </Text>
            <Text variant="bodySm" color="textMuted" style={{ marginTop: 4 }}>
              {t.subtitle}
            </Text>
            <View style={styles.tileFoot}>
              <Chip label="Try now" size="sm" tint={t.accent.to} selected />
            </View>
          </Pressable>
        ))}
      </View>

      <SectionHeader
        eyebrow="Audio"
        title="Generate voice and dialogue"
        subtitle="Single voice or full multi-speaker podcast."
        right={
          <Pressable onPress={() => nav.navigate('ToolsTab' as any)}>
            <Text variant="bodySm" color="accent" weight="600">
              All tools
            </Text>
          </Pressable>
        }
      />
      <View style={styles.audioRow}>
        <Card onPress={() => nav.navigate('Audio')} style={{ flex: 1 }}>
          <IconBadge icon="mic-outline" from={featureAccents.audio.from} to={featureAccents.audio.to} size={36} />
          <Text variant="h3" style={{ marginTop: spacing.md }}>
            Generate audio
          </Text>
          <Text variant="bodySm" color="textMuted" style={{ marginTop: 4 }}>
            Single-voice text to speech
          </Text>
        </Card>
        <Card onPress={() => nav.navigate('LongFormAudio')} style={{ flex: 1 }}>
          <IconBadge icon="people-outline" from={featureAccents.dub.from} to={featureAccents.dub.to} size={36} />
          <Text variant="h3" style={{ marginTop: spacing.md }}>
            Long form audio
          </Text>
          <Text variant="bodySm" color="textMuted" style={{ marginTop: 4 }}>
            Multi-speaker podcasts and dialogues
          </Text>
        </Card>
      </View>

      <SectionHeader
        eyebrow="History"
        title="Recent projects"
        right={
          <Pressable onPress={() => nav.navigate('ProjectsTab' as any)}>
            <Text variant="bodySm" color="accent" weight="600">
              View all
            </Text>
          </Pressable>
        }
      />
      {recent.length === 0 ? (
        <Card>
          <Text color="textMuted">Your generations will appear here.</Text>
        </Card>
      ) : (
        <View style={{ gap: spacing.md }}>
          {recent.map((p) => (
            <Card
              key={p.id}
              onPress={() => nav.navigate('ProjectDetail', { projectId: p.id })}
              style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
            >
              <View
                style={[
                  styles.thumb,
                  { backgroundColor: theme.surfaceAlt, borderColor: theme.border },
                ]}
              >
                <Ionicons
                  name={iconForKind(p.kind)}
                  size={20}
                  color={theme.accent}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body" weight="600" numberOfLines={1}>
                  {p.title}
                </Text>
                <Text variant="caption" color="textMuted">
                  {kindLabel(p.kind)} · {formatRelative(p.updatedAt)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textFaint} />
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
};

function iconForKind(k: string): keyof typeof Ionicons.glyphMap {
  switch (k) {
    case 'image_video':
      return 'sparkles-outline';
    case 'faceless_video':
      return 'film-outline';
    case 'captions':
      return 'text-outline';
    case 'dub':
      return 'language-outline';
    case 'voiceover':
      return 'mic-circle-outline';
    case 'video_music':
      return 'musical-notes-outline';
    case 'audio':
      return 'mic-outline';
    case 'long_form_audio':
      return 'people-outline';
    default:
      return 'document-outline';
  }
}

function kindLabel(k: string): string {
  switch (k) {
    case 'image_video':
      return 'Image & Video';
    case 'faceless_video':
      return 'Faceless video';
    case 'captions':
      return 'Captions';
    case 'dub':
      return 'Dub';
    case 'voiceover':
      return 'Voiceover';
    case 'video_music':
      return 'Video to music';
    case 'audio':
      return 'Audio';
    case 'long_form_audio':
      return 'Long form audio';
    default:
      return 'Project';
  }
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radii.xxl,
    padding: spacing.xl,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  heroLeft: { flex: 1, paddingRight: spacing.md },
  heroArt: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  heroDot1: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  heroDot2: {
    position: 'absolute',
    bottom: -20,
    left: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  heroDot3: {
    position: 'absolute',
    top: 10,
    left: -20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  beta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#C96442',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    marginTop: spacing.lg,
    alignSelf: 'flex-start',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    width: '48%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: spacing.lg,
    minHeight: 160,
  },
  tileFoot: { flexDirection: 'row', marginTop: spacing.md },
  audioRow: { flexDirection: 'row', gap: spacing.md },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
