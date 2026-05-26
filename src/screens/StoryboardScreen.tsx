import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import uuid from 'react-native-uuid';

import { AppHeader, Button, Chip, Input, Screen, Text } from '../components';
import { featureAccents, radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import { ASPECT_OPTIONS } from '../services/catalog';
import type { AspectRatio, StoryboardSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const newShot = () => ({
  id: String(uuid.v4()),
  prompt: '',
  durationSec: 4,
  aspect: '16:9' as AspectRatio,
});

export const StoryboardScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const { createDraft } = useProjects();

  const [s, setS] = useState<StoryboardSettings>({
    title: 'Untitled storyboard',
    shots: [newShot(), newShot(), newShot()],
  });

  const update = (id: string, patch: Partial<StoryboardSettings['shots'][number]>) =>
    setS({ ...s, shots: s.shots.map((x) => (x.id === id ? { ...x, ...patch } : x)) });

  const remove = (id: string) => setS({ ...s, shots: s.shots.filter((x) => x.id !== id) });
  const add = () => setS({ ...s, shots: [...s.shots, newShot()] });

  const handle = () => {
    const p = createDraft('storyboard', { kind: 'storyboard', settings: s }, s.title);
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 160 }}>
      <AppHeader subtitle="Video" title="Storyboard" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Plan a multi-shot scene and generate every cut with consistent characters and look.
      </Text>

      <FormSection title="Title">
        <Input value={s.title} onChangeText={(t) => setS({ ...s, title: t })} />
      </FormSection>

      <FormSection title="Character / style reference" hint="Optional photo used as a north star across all shots.">
        <MediaPicker kind="image" uri={s.consistencyReferenceUri} onPick={(u) => setS({ ...s, consistencyReferenceUri: u })} label="Tap to add reference" />
      </FormSection>

      <FormSection title="Shots">
        <View style={{ gap: spacing.md }}>
          {s.shots.map((sh, i) => (
            <View key={sh.id} style={[styles.shot, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.shotHead}>
                <Text variant="label" color="accent">
                  Shot {i + 1}
                </Text>
                <Pressable onPress={() => remove(sh.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={theme.textMuted} />
                </Pressable>
              </View>
              <Input value={sh.prompt} onChangeText={(t) => update(sh.id, { prompt: t })} placeholder="What happens in this shot?" multiline />
              <View style={styles.shotRow}>
                <View style={styles.shotChips}>
                  {[3, 4, 6, 8].map((d) => (
                    <Chip key={d} label={`${d}s`} selected={sh.durationSec === d} onPress={() => update(sh.id, { durationSec: d })} size="sm" />
                  ))}
                </View>
                <View style={styles.shotChips}>
                  {ASPECT_OPTIONS.slice(0, 3).map((a) => (
                    <Chip key={a} label={a} selected={sh.aspect === a} onPress={() => update(sh.id, { aspect: a as AspectRatio })} size="sm" />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        <Button label="Add shot" variant="soft" leftIcon={<Ionicons name="add" size={18} color="#fff" />} onPress={add} tint={featureAccents.imageVideo.to} style={{ marginTop: spacing.md }} />
      </FormSection>

      <GenerateBar label="Generate storyboard" hint={`${s.shots.length} shots · ${s.shots.reduce((sum, x) => sum + x.durationSec, 0)}s`} onPress={handle} disabled={!s.shots.some((x) => x.prompt.trim())} tint={featureAccents.imageVideo.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  shot: { padding: spacing.md, borderRadius: radii.lg, borderWidth: 1 },
  shotHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  shotRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm, flexWrap: 'wrap' },
  shotChips: { flexDirection: 'row', gap: spacing.xs },
});
