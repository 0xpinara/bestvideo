import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { VideoTranslateSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { LanguageField } from './_shared/LanguageField';
import { ToggleRow } from './_shared/ToggleRow';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const VideoTranslateScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<VideoTranslateSettings>({
    source: 'en',
    target: 'es',
    lipSync: true,
    preserveVoice: true,
    enhanceSpeech: true,
  });

  const handle = () => {
    const p = createDraft('video_translate', { kind: 'video_translate', settings: s }, `Translate ${s.source.toUpperCase()} → ${s.target.toUpperCase()}`);
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Video" title="Translate video" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Re-record any video in a new language while keeping the speaker's face, lips and voice.
      </Text>

      <FormSection title="Source video">
        <MediaPicker kind="video" uri={s.videoUri} onPick={(u) => setS({ ...s, videoUri: u })} label="Upload the video" />
      </FormSection>

      <FormSection title="From">
        <LanguageField code={s.source} onChange={(c) => setS({ ...s, source: c })} title="Spoken in" />
      </FormSection>

      <FormSection title="To">
        <LanguageField code={s.target} onChange={(c) => setS({ ...s, target: c })} title="Translate into" />
      </FormSection>

      <ToggleRow title="Lip-sync the new audio" subtitle="Re-render mouth motion for the target language." value={s.lipSync} onChange={(v) => setS({ ...s, lipSync: v })} />
      <ToggleRow title="Preserve original voice" subtitle="Clone the speaker so it still sounds like them." value={s.preserveVoice} onChange={(v) => setS({ ...s, preserveVoice: v })} />
      <ToggleRow title="Enhance speech clarity" subtitle="Soft de-noise + de-reverb on the result." value={s.enhanceSpeech} onChange={(v) => setS({ ...s, enhanceSpeech: v })} />

      <GenerateBar label="Translate video" hint={`${s.source.toUpperCase()} → ${s.target.toUpperCase()}`} onPress={handle} disabled={!s.videoUri || s.source === s.target} tint={featureAccents.dub.to} />
    </Screen>
  );
};
