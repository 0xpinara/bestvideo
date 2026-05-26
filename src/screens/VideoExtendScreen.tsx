import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Input, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { VideoExtendSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { ToggleRow } from './_shared/ToggleRow';
import { Slider } from './_shared/Slider';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const VideoExtendScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<VideoExtendSettings>({
    prompt: '',
    extraSeconds: 4,
    loop: false,
  });

  const handle = () => {
    const p = createDraft('video_extend', { kind: 'video_extend', settings: s }, 'Extend video');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Video" title="Extend video" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Continue any clip naturally — we predict the next seconds of motion.
      </Text>

      <FormSection title="Source video">
        <MediaPicker kind="video" uri={s.videoUri} onPick={(u) => setS({ ...s, videoUri: u })} label="Tap to upload video" />
      </FormSection>

      <FormSection title="What should happen next?" hint="Leave blank to continue the existing motion.">
        <Input placeholder="e.g. the bird turns and flies over the lake" value={s.prompt} onChangeText={(t) => setS({ ...s, prompt: t })} multiline />
      </FormSection>

      <FormSection title="Extra seconds" hint={`+${s.extraSeconds}s`}>
        <Slider value={s.extraSeconds / 12} onChange={(v) => setS({ ...s, extraSeconds: Math.max(2, Math.round(v * 12)) })} />
      </FormSection>

      <ToggleRow title="Loop back to start" subtitle="End the extension where the source began for seamless looping." value={s.loop} onChange={(v) => setS({ ...s, loop: v })} />

      <GenerateBar label="Extend" hint={`+${s.extraSeconds}s${s.loop ? ' · loop' : ''}`} onPress={handle} disabled={!s.videoUri} tint={featureAccents.imageVideo.to} />
    </Screen>
  );
};
