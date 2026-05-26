import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { DubSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { LanguageField } from './_shared/LanguageField';
import { ToggleRow } from './_shared/ToggleRow';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const DubScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<DubSettings>({
    source: 'en',
    target: 'es',
    voiceCloning: true,
    preserveBackground: true,
    lipSync: true,
    numSpeakers: 1,
  });

  const handle = () => {
    const p = createDraft('dub', { kind: 'dub', settings: s }, `Dub to ${s.target.toUpperCase()}`);
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Studio" title="Create dub" showBack />

      <FormSection title="Source video">
        <MediaPicker kind="video" uri={s.videoUri} onPick={(u) => setS({ ...s, videoUri: u })} label="Tap to upload video" />
      </FormSection>

      <FormSection title="Source language">
        <LanguageField code={s.source} onChange={(c) => setS({ ...s, source: c })} title="Spoken in" />
      </FormSection>

      <FormSection title="Target language">
        <LanguageField code={s.target} onChange={(c) => setS({ ...s, target: c })} title="Dub into" />
      </FormSection>

      <FormSection title="Speakers" hint="How many people speak in the video.">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Chip key={n} label={`${n} speaker${n > 1 ? 's' : ''}`} selected={s.numSpeakers === n} onPress={() => setS({ ...s, numSpeakers: n })} tint={featureAccents.dub.to} />
          ))}
        </ScrollView>
      </FormSection>

      <ToggleRow
        title="Voice cloning"
        subtitle="Preserve the original speakers' voice."
        value={s.voiceCloning}
        onChange={(v) => setS({ ...s, voiceCloning: v })}
      />
      <ToggleRow
        title="Preserve background"
        subtitle="Keep music and ambience around the dialogue."
        value={s.preserveBackground}
        onChange={(v) => setS({ ...s, preserveBackground: v })}
      />
      <ToggleRow
        title="Lip sync"
        subtitle="Match mouth movement to the new language."
        value={s.lipSync}
        onChange={(v) => setS({ ...s, lipSync: v })}
      />

      <Text variant="caption" color="textMuted" style={{ marginTop: spacing.lg }}>
        Estimated cost · 18 credits / minute
      </Text>

      <GenerateBar label="Generate dub" hint={`${s.source.toUpperCase()} → ${s.target.toUpperCase()}`} onPress={handle} disabled={!s.videoUri || s.source === s.target} tint={featureAccents.dub.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', gap: spacing.xs },
});
