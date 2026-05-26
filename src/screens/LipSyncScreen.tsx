import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { LipSyncSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { ToggleRow } from './_shared/ToggleRow';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const LipSyncScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<LipSyncSettings>({
    mode: 'precision',
    enhanceSpeech: false,
    enableCaption: false,
  });

  const handle = () => {
    const p = createDraft('lip_sync', { kind: 'lip_sync', settings: s }, 'Lip sync');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Video" title="Lip sync" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Drop new audio onto a face and we re-drive the mouth shapes to match perfectly.
      </Text>

      <FormSection title="Source video">
        <MediaPicker kind="video" uri={s.videoUri} onPick={(u) => setS({ ...s, videoUri: u })} label="Tap to upload video" />
      </FormSection>

      <FormSection title="Replacement audio">
        <MediaPicker kind="audio" uri={s.audioUri} onPick={(u) => setS({ ...s, audioUri: u })} label="Tap to upload audio" />
      </FormSection>

      <FormSection title="Mode">
        <View style={styles.row}>
          <Chip label="Precision" selected={s.mode === 'precision'} onPress={() => setS({ ...s, mode: 'precision' })} tint={featureAccents.facelessVideo.to} />
          <Chip label="Speed" selected={s.mode === 'speed'} onPress={() => setS({ ...s, mode: 'speed' })} tint={featureAccents.facelessVideo.to} />
        </View>
      </FormSection>

      <ToggleRow title="Enhance speech" subtitle="Cleans up the replacement audio." value={s.enhanceSpeech} onChange={(v) => setS({ ...s, enhanceSpeech: v })} />
      <ToggleRow title="Burn in captions" subtitle="Automatic captions for the new audio." value={s.enableCaption} onChange={(v) => setS({ ...s, enableCaption: v })} />

      <GenerateBar label="Sync lips" hint={s.mode === 'precision' ? 'Higher quality, slower' : 'Fast draft mode'} onPress={handle} disabled={!s.videoUri || !s.audioUri} tint={featureAccents.facelessVideo.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: spacing.xs } });
