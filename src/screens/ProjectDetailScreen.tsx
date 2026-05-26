import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Button, Card, Chip, Screen, SectionHeader, Text } from '../components';
import { palette, radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import { formatDuration, formatRelative } from '../utils/format';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'ProjectDetail'>;

export const ProjectDetailScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const { params } = useRoute<Rt>();
  const { projects, remove } = useProjects();
  const project = projects.find((p) => p.id === params.projectId);

  if (!project) {
    return (
      <Screen>
        <AppHeader title="Project" showBack />
        <Text>Not found</Text>
      </Screen>
    );
  }

  const handleDelete = () =>
    Alert.alert('Delete project?', 'You can\'t undo this.', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          remove(project.id);
          nav.goBack();
        },
      },
    ]);

  return (
    <Screen contentContainerStyle={{ paddingBottom: 120 }}>
      <AppHeader subtitle="Project" title={project.title} showBack right={<Chip label={project.status} tint={statusColor(project.status)} selected size="sm" />} />

      <Card padded={false} style={{ overflow: 'hidden' }}>
        {project.thumbUri ? (
          <Image source={{ uri: project.thumbUri }} style={{ width: '100%', height: 220 }} contentFit="cover" />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: theme.surfaceAlt }]}>
            <Ionicons name="sparkles-outline" size={36} color={theme.accent} />
          </View>
        )}
      </Card>

      <View style={[styles.metaRow, { marginTop: spacing.md }]}>
        <Text variant="bodySm" color="textMuted">
          {labelForKind(project.kind)} · {formatDuration(project.durationMs)} · {formatRelative(project.updatedAt)}
        </Text>
      </View>

      <View style={styles.actionRow}>
        <Button label="Play" leftIcon={<Ionicons name="play" size={18} color="#fff" />} style={{ flex: 1 }} onPress={() => {}} />
        <Button label="Share" variant="secondary" leftIcon={<Ionicons name="share-outline" size={18} color={theme.text} />} style={{ flex: 1 }} onPress={() => {}} />
      </View>

      <SectionHeader eyebrow="Settings" title="What we made" subtitle="The recipe used for this output." />
      <Card>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={{ fontFamily: 'Menlo' }} variant="bodySm" color="textSoft">
            {JSON.stringify(project.settings, null, 2)}
          </Text>
        </ScrollView>
      </Card>

      <Button label="Delete project" variant="ghost" tint="#B44A2C" onPress={handleDelete} style={{ marginTop: spacing.xl, alignSelf: 'flex-start' }} />
    </Screen>
  );
};

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

function statusColor(s: string): string {
  switch (s) {
    case 'ready':
      return palette.meadowDeep;
    case 'generating':
      return palette.amber;
    case 'queued':
      return palette.lavenderDeep;
    case 'failed':
      return palette.errorDeep;
    default:
      return palette.inkMuted;
  }
}

const styles = StyleSheet.create({
  placeholder: { height: 220, alignItems: 'center', justifyContent: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  actionRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
});
