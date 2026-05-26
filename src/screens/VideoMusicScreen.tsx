import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import { INSTRUMENTS, MUSIC_GENRES, MUSIC_MOODS } from '../services/catalog';
import type { VideoMusicSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const VideoMusicScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<VideoMusicSettings>({
    genre: 'Cinematic',
    mood: 'Uplifting',
    intensity: 'medium',
    instrumentation: ['Piano', 'Strings'],
  });

  const toggleInstrument = (i: string) => {
    setS((p) => ({
      ...p,
      instrumentation: p.instrumentation.includes(i) ? p.instrumentation.filter((x) => x !== i) : [...p.instrumentation, i],
    }));
  };

  const handle = () => {
    const p = createDraft('video_music', { kind: 'video_music', settings: s }, `${s.mood} ${s.genre}`);
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Studio" title="Video to music" showBack />

      <FormSection title="Video">
        <MediaPicker kind="video" uri={s.videoUri} onPick={(u) => setS({ ...s, videoUri: u })} label="Upload a clip to score" />
      </FormSection>

      <FormSection title="Genre">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {MUSIC_GENRES.map((g) => (
            <Chip key={g} label={g} selected={s.genre === g} onPress={() => setS({ ...s, genre: g })} tint={featureAccents.videoMusic.to} />
          ))}
        </ScrollView>
      </FormSection>

      <FormSection title="Mood">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {MUSIC_MOODS.map((m) => (
            <Chip key={m} label={m} selected={s.mood === m} onPress={() => setS({ ...s, mood: m })} tint={featureAccents.videoMusic.to} />
          ))}
        </ScrollView>
      </FormSection>

      <FormSection title="Intensity">
        <View style={styles.chipRow}>
          {(['low', 'medium', 'high'] as const).map((i) => (
            <Chip key={i} label={i} selected={s.intensity === i} onPress={() => setS({ ...s, intensity: i })} tint={featureAccents.videoMusic.to} />
          ))}
        </View>
      </FormSection>

      <FormSection title="Instrumentation" hint="Pick the colours of your score.">
        <View style={styles.chipWrap}>
          {INSTRUMENTS.map((i) => (
            <Chip key={i} label={i} selected={s.instrumentation.includes(i)} onPress={() => toggleInstrument(i)} tint={featureAccents.videoMusic.to} />
          ))}
        </View>
      </FormSection>

      <Text variant="caption" color="textMuted" style={{ marginTop: spacing.lg }}>
        We follow the rhythm of the cuts and let the melody breathe with the scene.
      </Text>

      <GenerateBar label="Compose score" hint={`${s.mood} · ${s.genre}`} onPress={handle} disabled={!s.videoUri} tint={featureAccents.videoMusic.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', gap: spacing.xs },
  chipWrap: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
});
