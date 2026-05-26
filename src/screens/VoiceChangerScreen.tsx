import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { VoiceChangerSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { VoiceField } from './_shared/VoiceField';
import { ToggleRow } from './_shared/ToggleRow';
import { Slider } from './_shared/Slider';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const VoiceChangerScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<VoiceChangerSettings>({
    targetVoiceId: 'v_rachel',
    preserveStyle: 0.6,
    removeBackgroundNoise: true,
  });

  const handle = () => {
    const p = createDraft('voice_changer', { kind: 'voice_changer', settings: s }, 'Voice swap');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Audio" title="Voice changer" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Replace any voice with another while keeping the original delivery, rhythm and emotion.
      </Text>

      <FormSection title="Source audio">
        <MediaPicker kind="audio" uri={s.inputUri} onPick={(u) => setS({ ...s, inputUri: u })} label="Tap to upload speech audio" />
      </FormSection>

      <FormSection title="Target voice">
        <VoiceField voiceId={s.targetVoiceId} onChange={(id) => setS({ ...s, targetVoiceId: id })} title="Become this voice" />
      </FormSection>

      <FormSection title="Preserve original style" hint="0 = pure target voice · 1 = strong source inflection">
        <Slider value={s.preserveStyle} onChange={(v) => setS({ ...s, preserveStyle: v })} />
      </FormSection>

      <ToggleRow title="Remove background noise" subtitle="Cleans up the source before swapping." value={s.removeBackgroundNoise} onChange={(v) => setS({ ...s, removeBackgroundNoise: v })} />

      <GenerateBar label="Change voice" hint="≈ 1 credit / 1000 chars" onPress={handle} disabled={!s.inputUri} tint={featureAccents.voiceover.to} />
    </Screen>
  );
};
