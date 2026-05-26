import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { VoiceIsolatorSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { Slider } from './_shared/Slider';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MODES: { id: VoiceIsolatorSettings['mode']; label: string }[] = [
  { id: 'vocals', label: 'Keep vocals' },
  { id: 'instrumental', label: 'Keep instrumental' },
  { id: 'cleanup', label: 'Clean speech' },
];

export const VoiceIsolatorScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<VoiceIsolatorSettings>({
    mode: 'cleanup',
    aggressiveness: 0.6,
  });

  const handle = () => {
    const p = createDraft('voice_isolator', { kind: 'voice_isolator', settings: s }, 'Voice isolator');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Audio" title="Voice isolator" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Surgically separate vocals from background, or strip noise from a recording.
      </Text>

      <FormSection title="Audio">
        <MediaPicker kind="audio" uri={s.inputUri} onPick={(u) => setS({ ...s, inputUri: u })} label="Upload audio or video" />
      </FormSection>

      <FormSection title="Mode">
        <View style={styles.row}>
          {MODES.map((m) => (
            <Chip key={m.id} label={m.label} selected={s.mode === m.id} onPress={() => setS({ ...s, mode: m.id })} tint={featureAccents.audio.to} />
          ))}
        </View>
      </FormSection>

      <FormSection title="Aggressiveness" hint="Higher removes more — but may colour the result.">
        <Slider value={s.aggressiveness} onChange={(v) => setS({ ...s, aggressiveness: v })} />
      </FormSection>

      <GenerateBar label="Isolate" hint="Up to 8 minutes per generation" onPress={handle} disabled={!s.inputUri} tint={featureAccents.audio.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' } });
