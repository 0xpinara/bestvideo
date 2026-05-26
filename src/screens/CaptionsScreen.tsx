import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Screen, Text } from '../components';
import { featureAccents, palette, radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import type { CaptionsSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { LanguageField } from './_shared/LanguageField';
import { ToggleRow } from './_shared/ToggleRow';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STYLES: { id: CaptionsSettings['style']; label: string }[] = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'bold', label: 'Bold' },
  { id: 'subtle', label: 'Subtle' },
  { id: 'kinetic', label: 'Kinetic' },
  { id: 'karaoke', label: 'Karaoke' },
];

const HIGHLIGHTS = [
  { id: 'mint', color: palette.meadow },
  { id: 'peach', color: palette.peach },
  { id: 'lavender', color: palette.lavender },
  { id: 'amber', color: palette.amber },
  { id: 'rose', color: palette.rose },
];

const SIZES: { id: CaptionsSettings['fontSize']; label: string }[] = [
  { id: 'sm', label: 'S' },
  { id: 'md', label: 'M' },
  { id: 'lg', label: 'L' },
];

const POSITIONS: { id: CaptionsSettings['position']; label: string }[] = [
  { id: 'top', label: 'Top' },
  { id: 'middle', label: 'Middle' },
  { id: 'bottom', label: 'Bottom' },
];

export const CaptionsScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const { createDraft } = useProjects();

  const [s, setS] = useState<CaptionsSettings>({
    language: 'en',
    style: 'kinetic',
    fontSize: 'md',
    position: 'bottom',
    highlight: palette.peach,
    emojis: true,
  });

  const handle = () => {
    const p = createDraft('captions', { kind: 'captions', settings: s }, 'Add captions');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Studio" title="Add captions" showBack />

      <FormSection title="Video">
        <MediaPicker kind="video" uri={s.videoUri} onPick={(u) => setS({ ...s, videoUri: u })} label="Tap to upload video" />
      </FormSection>

      <FormSection title="Language">
        <LanguageField code={s.language} onChange={(c) => setS({ ...s, language: c })} title="Caption language" />
      </FormSection>

      <FormSection title="Style">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {STYLES.map((st) => (
            <Chip key={st.id} label={st.label} selected={s.style === st.id} onPress={() => setS({ ...s, style: st.id })} tint={featureAccents.captions.to} />
          ))}
        </ScrollView>
      </FormSection>

      <View style={styles.preview}>
        <View style={[styles.previewArt, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
          <View style={[styles.cap, s.position === 'top' ? { top: 24 } : s.position === 'middle' ? { top: '45%' } : { bottom: 24 }, { backgroundColor: s.highlight + 'CC' }]}>
            <Text variant="h3" color="#1A1209" weight="800">
              Tomorrow we ship.
            </Text>
          </View>
        </View>
      </View>

      <FormSection title="Highlight color">
        <View style={styles.chipRow}>
          {HIGHLIGHTS.map((h) => (
            <Chip
              key={h.id}
              label={h.id}
              selected={s.highlight === h.color}
              tint={h.color}
              onPress={() => setS({ ...s, highlight: h.color })}
            />
          ))}
        </View>
      </FormSection>

      <FormSection title="Size">
        <View style={styles.chipRow}>
          {SIZES.map((sz) => (
            <Chip key={sz.id} label={sz.label} selected={s.fontSize === sz.id} onPress={() => setS({ ...s, fontSize: sz.id })} />
          ))}
        </View>
      </FormSection>

      <FormSection title="Position">
        <View style={styles.chipRow}>
          {POSITIONS.map((p) => (
            <Chip key={p.id} label={p.label} selected={s.position === p.id} onPress={() => setS({ ...s, position: p.id })} />
          ))}
        </View>
      </FormSection>

      <ToggleRow title="Suggest emojis" subtitle="Sprinkle subtle emoji per phrase." value={s.emojis} onChange={(v) => setS({ ...s, emojis: v })} />

      <GenerateBar label="Generate captions" hint="≈ 30s for a 1m clip" onPress={handle} disabled={!s.videoUri} tint={featureAccents.captions.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  preview: { marginBottom: spacing.lg },
  previewArt: {
    height: 200,
    borderRadius: radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  cap: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
