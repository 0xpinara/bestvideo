import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { TranscribeSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { LanguageField } from './_shared/LanguageField';
import { ToggleRow } from './_shared/ToggleRow';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FORMATS: { id: TranscribeSettings['format']; label: string }[] = [
  { id: 'txt', label: 'Plain text' },
  { id: 'srt', label: 'SubRip (.srt)' },
  { id: 'vtt', label: 'WebVTT (.vtt)' },
  { id: 'json', label: 'JSON' },
];

const TIMESTAMPS: { id: TranscribeSettings['timestamps']; label: string }[] = [
  { id: 'none', label: 'No timestamps' },
  { id: 'sentence', label: 'Per sentence' },
  { id: 'word', label: 'Per word' },
];

export const TranscribeScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<TranscribeSettings>({
    language: 'en',
    diarize: true,
    punctuation: true,
    timestamps: 'sentence',
    format: 'srt',
  });

  const handle = () => {
    const p = createDraft('transcribe', { kind: 'transcribe', settings: s }, 'Transcript');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Audio" title="Transcribe (Scribe)" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        90+ languages · word-level timestamps · speaker diarisation.
      </Text>

      <FormSection title="Audio or video">
        <MediaPicker kind="audio" uri={s.inputUri} onPick={(u) => setS({ ...s, inputUri: u })} label="Upload to transcribe" />
      </FormSection>

      <FormSection title="Language">
        <LanguageField code={s.language} onChange={(c) => setS({ ...s, language: c })} title="Source language" />
      </FormSection>

      <FormSection title="Timestamps">
        <View style={styles.row}>
          {TIMESTAMPS.map((t) => (
            <Chip key={t.id} label={t.label} selected={s.timestamps === t.id} onPress={() => setS({ ...s, timestamps: t.id })} />
          ))}
        </View>
      </FormSection>

      <FormSection title="Output format">
        <View style={styles.row}>
          {FORMATS.map((f) => (
            <Chip key={f.id} label={f.label} selected={s.format === f.id} onPress={() => setS({ ...s, format: f.id })} />
          ))}
        </View>
      </FormSection>

      <ToggleRow title="Speaker diarisation" subtitle="Label different speakers in the transcript." value={s.diarize} onChange={(v) => setS({ ...s, diarize: v })} />
      <ToggleRow title="Add punctuation" subtitle="Auto-insert commas, periods, and casing." value={s.punctuation} onChange={(v) => setS({ ...s, punctuation: v })} />

      <GenerateBar label="Transcribe" hint="≈ 1 credit / minute" onPress={handle} disabled={!s.inputUri} tint={featureAccents.audio.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' } });
