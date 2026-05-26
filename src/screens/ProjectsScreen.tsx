import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Card, Chip, Screen, Text } from '../components';
import { palette, radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import { formatDuration, formatRelative } from '../utils/format';
import type { ProjectKind } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTERS: { id: ProjectKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'image_video', label: 'Image & Video' },
  { id: 'faceless_video', label: 'Faceless' },
  { id: 'captions', label: 'Captions' },
  { id: 'dub', label: 'Dub' },
  { id: 'voiceover', label: 'Voiceover' },
  { id: 'video_music', label: 'Score' },
  { id: 'audio', label: 'Audio' },
  { id: 'long_form_audio', label: 'Long form' },
];

export const ProjectsScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const { projects } = useProjects();
  const [filter, setFilter] = useState<ProjectKind | 'all'>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.kind === filter)),
    [projects, filter],
  );

  return (
    <Screen>
      <AppHeader subtitle="Projects" title="Your library" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={filter === f.id}
            onPress={() => setFilter(f.id)}
          />
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <Card>
          <Text color="textMuted">Nothing yet here. Generate something and it'll land in this folder.</Text>
        </Card>
      ) : (
        <View style={{ gap: spacing.md }}>
          {filtered.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => nav.navigate('ProjectDetail', { projectId: p.id })}
              style={({ pressed }) => [styles.tile, { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.96 : 1 }]}
            >
              <View style={[styles.thumbWrap, { backgroundColor: theme.surfaceAlt }]}>
                {p.thumbUri ? (
                  <Image source={{ uri: p.thumbUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                ) : (
                  <Ionicons name={iconForKind(p.kind)} size={26} color={theme.accent} />
                )}
                {p.status === 'generating' ? (
                  <View style={styles.statusDot}>
                    <View style={[styles.statusInner, { backgroundColor: palette.amber }]} />
                  </View>
                ) : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body" weight="700" numberOfLines={1}>
                  {p.title}
                </Text>
                <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
                  {labelForKind(p.kind)} · {p.status} · {formatRelative(p.updatedAt)}
                </Text>
                <Text variant="caption" color="textFaint" style={{ marginTop: 2 }}>
                  {formatDuration(p.durationMs)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textFaint} />
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
};

function iconForKind(k: string): keyof typeof Ionicons.glyphMap {
  const m: Record<string, keyof typeof Ionicons.glyphMap> = {
    image_video: 'sparkles-outline',
    faceless_video: 'film-outline',
    captions: 'text-outline',
    dub: 'language-outline',
    voiceover: 'mic-circle-outline',
    video_music: 'musical-notes-outline',
    audio: 'mic-outline',
    long_form_audio: 'people-outline',
  };
  return m[k] ?? 'document-outline';
}

function labelForKind(k: string): string {
  const m: Record<string, string> = {
    image_video: 'Image & Video',
    faceless_video: 'Faceless',
    captions: 'Captions',
    dub: 'Dub',
    voiceover: 'Voiceover',
    video_music: 'Score',
    audio: 'Audio',
    long_form_audio: 'Long form',
  };
  return m[k] ?? 'Project';
}

const styles = StyleSheet.create({
  filters: { gap: spacing.xs, paddingVertical: spacing.sm, paddingRight: spacing.lg },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.md,
  },
  thumbWrap: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInner: { width: 8, height: 8, borderRadius: 4 },
});
