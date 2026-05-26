import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Input, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { BackgroundRemoveSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { Slider } from './_shared/Slider';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const OPTS: { id: BackgroundRemoveSettings['output']; label: string }[] = [
  { id: 'transparent', label: 'Transparent' },
  { id: 'green', label: 'Green screen' },
  { id: 'replace', label: 'Replace with AI' },
];

export const BackgroundRemoveScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<BackgroundRemoveSettings>({
    output: 'transparent',
    replacementPrompt: '',
    edgeFeather: 0.4,
  });

  const handle = () => {
    const p = createDraft('background_remove', { kind: 'background_remove', settings: s }, 'Background key');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Video" title="Background remover" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Cut your subject out of any clip, frame-perfect — no green screen needed.
      </Text>

      <FormSection title="Source video">
        <MediaPicker kind="video" uri={s.videoUri} onPick={(u) => setS({ ...s, videoUri: u })} label="Tap to upload video" />
      </FormSection>

      <FormSection title="Output">
        <View style={styles.row}>
          {OPTS.map((o) => (
            <Chip key={o.id} label={o.label} selected={s.output === o.id} onPress={() => setS({ ...s, output: o.id })} tint={featureAccents.captions.to} />
          ))}
        </View>
      </FormSection>

      {s.output === 'replace' ? (
        <FormSection title="Replacement background">
          <Input placeholder='e.g. soft ghibli meadow at golden hour' value={s.replacementPrompt} onChangeText={(t) => setS({ ...s, replacementPrompt: t })} multiline />
        </FormSection>
      ) : null}

      <FormSection title="Edge feather" hint="Higher = softer edge.">
        <Slider value={s.edgeFeather} onChange={(v) => setS({ ...s, edgeFeather: v })} />
      </FormSection>

      <GenerateBar label="Cut out" hint={s.output === 'replace' ? 'AI background' : s.output} onPress={handle} disabled={!s.videoUri || (s.output === 'replace' && !s.replacementPrompt.trim())} tint={featureAccents.captions.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' } });
