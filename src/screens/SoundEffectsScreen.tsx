import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Input, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import { SFX_PRESETS } from '../services/catalog';
import type { SoundEffectsSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { ToggleRow } from './_shared/ToggleRow';
import { Slider } from './_shared/Slider';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const SoundEffectsScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<SoundEffectsSettings>({
    prompt: '',
    durationSec: 4,
    promptInfluence: 0.5,
    loop: false,
  });

  const handle = () => {
    const p = createDraft('sound_effects', { kind: 'sound_effects', settings: s }, s.prompt.slice(0, 60) || 'Sound effect');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Audio" title="Sound effects" showBack />

      <FormSection title="Describe the sound" hint="The more sensory the prompt, the better.">
        <Input
          placeholder="e.g. rain on a tin roof, soft thunder rumble"
          value={s.prompt}
          onChangeText={(t) => setS({ ...s, prompt: t })}
          multiline
        />
      </FormSection>

      <FormSection title="Quick ideas">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {SFX_PRESETS.map((p) => (
            <Chip key={p} label={p.split(',')[0]} onPress={() => setS({ ...s, prompt: p })} size="sm" />
          ))}
        </ScrollView>
      </FormSection>

      <FormSection title="Duration" hint={`${s.durationSec.toFixed(1)} seconds`}>
        <Slider value={s.durationSec / 22} onChange={(v) => setS({ ...s, durationSec: Math.max(0.5, Math.round(v * 22 * 2) / 2) })} />
      </FormSection>

      <FormSection title="Prompt adherence" hint="Higher means stricter match to your words.">
        <Slider value={s.promptInfluence} onChange={(v) => setS({ ...s, promptInfluence: v })} />
      </FormSection>

      <ToggleRow title="Loop seamlessly" subtitle="Output loops cleanly for ambience beds." value={s.loop} onChange={(v) => setS({ ...s, loop: v })} />

      <Text variant="caption" color="textMuted" style={{ marginTop: spacing.lg }}>
        ≈ 1 credit per generation
      </Text>

      <GenerateBar
        label="Generate effect"
        hint={`${s.durationSec.toFixed(1)}s · ${s.loop ? 'loop' : 'one-shot'}`}
        onPress={handle}
        disabled={!s.prompt.trim()}
        tint={featureAccents.audio.to}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', gap: spacing.xs },
});

// keep import alive
export const __i = Ionicons;
