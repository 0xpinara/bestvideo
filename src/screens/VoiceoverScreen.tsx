import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import uuid from 'react-native-uuid';

import { AppHeader, Button, Input, Screen, Text } from '../components';
import { featureAccents, radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import type { VoiceoverSegment, VoiceoverSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { VoiceField } from './_shared/VoiceField';
import { ToggleRow } from './_shared/ToggleRow';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const newSegment = (start = 0): VoiceoverSegment => ({
  id: String(uuid.v4()),
  startSec: start,
  endSec: start + 5,
  text: '',
  voiceId: 'v_rachel',
});

export const VoiceoverScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const { createDraft } = useProjects();

  const [s, setS] = useState<VoiceoverSettings>({
    segments: [newSegment(0)],
    removeOriginalAudio: false,
    duckMusic: true,
  });

  const update = (id: string, patch: Partial<VoiceoverSegment>) => {
    setS({ ...s, segments: s.segments.map((seg) => (seg.id === id ? { ...seg, ...patch } : seg)) });
  };

  const remove = (id: string) => {
    setS({ ...s, segments: s.segments.filter((seg) => seg.id !== id) });
  };

  const add = () => {
    const last = s.segments[s.segments.length - 1];
    setS({ ...s, segments: [...s.segments, newSegment(last ? last.endSec : 0)] });
  };

  const handle = () => {
    const p = createDraft('voiceover', { kind: 'voiceover', settings: s }, 'Voiceover');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Studio" title="Add voiceover" showBack />

      <FormSection title="Video">
        <MediaPicker kind="video" uri={s.videoUri} onPick={(u) => setS({ ...s, videoUri: u })} label="Tap to upload video" />
      </FormSection>

      <FormSection title="Segments" hint="Each segment becomes a precisely timed narration.">
        {s.segments.map((seg, idx) => (
          <View key={seg.id} style={[styles.seg, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <View style={styles.segHeader}>
              <Text variant="label" color="accent">
                Segment {idx + 1}
              </Text>
              <Pressable onPress={() => remove(seg.id)} hitSlop={8}>
                <Ionicons name="trash-outline" size={18} color={theme.textMuted} />
              </Pressable>
            </View>

            <View style={styles.timeRow}>
              <Input
                label="Start (s)"
                value={String(seg.startSec)}
                keyboardType="numeric"
                onChangeText={(t) => update(seg.id, { startSec: Number(t) || 0 })}
                containerStyle={{ flex: 1 }}
              />
              <View style={{ width: spacing.sm }} />
              <Input
                label="End (s)"
                value={String(seg.endSec)}
                keyboardType="numeric"
                onChangeText={(t) => update(seg.id, { endSec: Number(t) || 0 })}
                containerStyle={{ flex: 1 }}
              />
            </View>

            <Input
              placeholder="What should the narrator say?"
              value={seg.text}
              onChangeText={(t) => update(seg.id, { text: t })}
              multiline
            />

            <VoiceField voiceId={seg.voiceId} onChange={(id) => update(seg.id, { voiceId: id })} title="Segment voice" />
          </View>
        ))}

        <Button label="Add segment" variant="soft" leftIcon={<Ionicons name="add" size={18} color="#fff" />} onPress={add} tint={featureAccents.voiceover.to} style={{ marginTop: spacing.md }} />
      </FormSection>

      <ToggleRow title="Remove original audio" subtitle="Replace dialogue and sound entirely." value={s.removeOriginalAudio} onChange={(v) => setS({ ...s, removeOriginalAudio: v })} />
      <ToggleRow title="Duck background music" subtitle="Lower music while narrator speaks." value={s.duckMusic} onChange={(v) => setS({ ...s, duckMusic: v })} />

      <GenerateBar
        label="Generate voiceover"
        hint={`${s.segments.length} segment${s.segments.length > 1 ? 's' : ''}`}
        onPress={handle}
        disabled={!s.videoUri || !s.segments.some((sg) => sg.text.trim())}
        tint={featureAccents.voiceover.to}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  seg: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  segHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  timeRow: { flexDirection: 'row' },
});
