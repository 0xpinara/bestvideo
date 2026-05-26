import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Input, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { InpaintSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { Slider } from './_shared/Slider';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MODES: { id: InpaintSettings['mode']; label: string }[] = [
  { id: 'remove', label: 'Remove object' },
  { id: 'replace', label: 'Replace object' },
  { id: 'restyle', label: 'Restyle region' },
];

export const InpaintScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<InpaintSettings>({
    mode: 'remove',
    prompt: '',
    brushSize: 0.3,
  });

  const handle = () => {
    const p = createDraft('inpaint', { kind: 'inpaint', settings: s }, `Inpaint · ${s.mode}`);
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Video" title="Inpaint" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Paint over anything in your video — we'll remove it, swap it, or restyle it.
      </Text>

      <FormSection title="Source video">
        <MediaPicker kind="video" uri={s.videoUri} onPick={(u) => setS({ ...s, videoUri: u })} label="Tap to upload video" />
      </FormSection>

      <FormSection title="Mode">
        <View style={styles.row}>
          {MODES.map((m) => (
            <Chip key={m.id} label={m.label} selected={s.mode === m.id} onPress={() => setS({ ...s, mode: m.id })} tint={featureAccents.imageVideo.to} />
          ))}
        </View>
      </FormSection>

      {s.mode !== 'remove' ? (
        <FormSection title={s.mode === 'replace' ? 'Replace with' : 'New style for the region'}>
          <Input placeholder={s.mode === 'replace' ? 'e.g. a vintage red bicycle' : 'e.g. ghibli watercolour'} value={s.prompt} onChangeText={(t) => setS({ ...s, prompt: t })} multiline />
        </FormSection>
      ) : null}

      <FormSection title="Brush size" hint={`${Math.round(s.brushSize * 100)}%`}>
        <Slider value={s.brushSize} onChange={(v) => setS({ ...s, brushSize: v })} />
      </FormSection>

      <Text variant="caption" color="textMuted">
        Tip: the mask brush opens after upload — you can refine it frame by frame.
      </Text>

      <GenerateBar label="Inpaint" hint={s.mode} onPress={handle} disabled={!s.videoUri || (s.mode !== 'remove' && !s.prompt.trim())} tint={featureAccents.imageVideo.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' } });
