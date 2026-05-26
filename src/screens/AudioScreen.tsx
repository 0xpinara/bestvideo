import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Input, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { AudioSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { VoiceField } from './_shared/VoiceField';
import { ToggleRow } from './_shared/ToggleRow';
import { GenerateBar } from './_shared/GenerateBar';
import { Slider } from './_shared/Slider';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const AudioScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<AudioSettings>({
    voiceId: 'v_rachel',
    text: '',
    stability: 0.5,
    similarity: 0.75,
    styleExaggeration: 0.1,
    speakerBoost: true,
  });

  const handle = () => {
    const p = createDraft('audio', { kind: 'audio', settings: s }, s.text.slice(0, 60) || 'Voice clip');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 160 }}>
      <AppHeader subtitle="Audio" title="Generate audio" showBack />

      <FormSection title="Voice">
        <VoiceField voiceId={s.voiceId} onChange={(id) => setS({ ...s, voiceId: id })} title="Pick a voice" />
      </FormSection>

      <FormSection title="Text" hint={`${s.text.length} / 5000 characters`}>
        <Input
          placeholder="Type or paste the words you want spoken..."
          value={s.text}
          onChangeText={(t) => setS({ ...s, text: t })}
          multiline
          maxLength={5000}
        />
      </FormSection>

      <FormSection title="Stability" hint="Lower = more expressive, higher = more consistent.">
        <Slider value={s.stability} onChange={(v) => setS({ ...s, stability: v })} />
      </FormSection>

      <FormSection title="Similarity" hint="How closely to imitate the original voice.">
        <Slider value={s.similarity} onChange={(v) => setS({ ...s, similarity: v })} />
      </FormSection>

      <FormSection title="Style exaggeration" hint="0 stays neutral, higher pushes the voice's character.">
        <Slider value={s.styleExaggeration} onChange={(v) => setS({ ...s, styleExaggeration: v })} />
      </FormSection>

      <ToggleRow title="Speaker boost" subtitle="Improves resemblance, costs a touch more." value={s.speakerBoost} onChange={(v) => setS({ ...s, speakerBoost: v })} />

      <GenerateBar label="Generate audio" hint="≈ 1 credit / 1000 chars" onPress={handle} disabled={!s.text.trim()} tint={featureAccents.audio.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
