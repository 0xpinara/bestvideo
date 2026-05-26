import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Card, IconBadge, Screen, SectionHeader, Text } from '../components';
import { featureAccents, radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import { formatRelative } from '../utils/format';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const AudioHubScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const { projects } = useProjects();
  const recent = projects.filter((p) => p.kind === 'audio' || p.kind === 'long_form_audio').slice(0, 4);

  return (
    <Screen>
      <AppHeader subtitle="Audio" title="Make a voice" />

      <View style={{ gap: spacing.md }}>
        <Card onPress={() => nav.navigate('Audio')}>
          <View style={styles.row}>
            <IconBadge icon="mic-outline" from={featureAccents.audio.from} to={featureAccents.audio.to} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text variant="h3">Generate audio</Text>
              <Text variant="bodySm" color="textMuted" style={{ marginTop: 2 }}>
                Single-voice text to speech with full controls
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.textFaint} />
          </View>
        </Card>

        <Card onPress={() => nav.navigate('LongFormAudio')}>
          <View style={styles.row}>
            <IconBadge icon="people-outline" from={featureAccents.dub.from} to={featureAccents.dub.to} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text variant="h3">Generate long form audio</Text>
              <Text variant="bodySm" color="textMuted" style={{ marginTop: 2 }}>
                Multi-speaker podcasts and conversations
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.textFaint} />
          </View>
        </Card>
      </View>

      <SectionHeader eyebrow="History" title="Recent audio" />
      {recent.length === 0 ? (
        <Card>
          <Text color="textMuted">No audio yet. Pick one above to start.</Text>
        </Card>
      ) : (
        <View style={{ gap: spacing.md }}>
          {recent.map((p) => (
            <Card key={p.id} onPress={() => nav.navigate('ProjectDetail', { projectId: p.id })}>
              <View style={styles.row}>
                <View style={[styles.thumb, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                  <Ionicons name={p.kind === 'audio' ? 'mic' : 'people'} size={20} color={theme.accent} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text weight="600" numberOfLines={1}>
                    {p.title}
                  </Text>
                  <Text variant="caption" color="textMuted">
                    {p.kind === 'audio' ? 'Voice clip' : 'Long form'} · {formatRelative(p.updatedAt)}
                  </Text>
                </View>
                <Ionicons name="play-circle" size={28} color={theme.accent} />
              </View>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
