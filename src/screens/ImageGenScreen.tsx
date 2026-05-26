import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, IconBadge, Input, Screen, Text } from '../components';
import { featureAccents, radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import { ASPECT_OPTIONS, COUNT_OPTIONS, IMAGE_GEN_MODELS } from '../services/catalog';
import type { AspectRatio, ImageGenSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const ImageGenScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const { createDraft } = useProjects();

  const [s, setS] = useState<ImageGenSettings>({
    prompt: '',
    model: 'flux-1.1-pro',
    aspect: '1:1',
    count: 4,
    seed: null,
  });

  const handle = () => {
    const p = createDraft('image_gen', { kind: 'image_gen', settings: s }, s.prompt.slice(0, 60) || 'Image');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 160 }}>
      <AppHeader subtitle="Image" title="AI image generator" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Flux, Imagen 3, SD 3.5, and Midjourney v7 — all in one composer.
      </Text>

      <FormSection title="Prompt">
        <Input value={s.prompt} onChangeText={(t) => setS({ ...s, prompt: t })} placeholder="A small lantern boat drifting at dusk, painterly" multiline />
      </FormSection>

      <FormSection title="Model">
        <View style={{ gap: spacing.sm }}>
          {IMAGE_GEN_MODELS.map((m) => {
            const selected = m.id === s.model;
            return (
              <View
                key={m.id}
                onTouchEnd={() => setS({ ...s, model: m.id as ImageGenSettings['model'] })}
                style={[
                  styles.modelRow,
                  {
                    borderColor: selected ? theme.accent : theme.border,
                    backgroundColor: selected ? theme.accentTint : theme.surface,
                  },
                ]}
              >
                <IconBadge icon="image" from={featureAccents.imageVideo.from} to={featureAccents.imageVideo.to} size={36} />
                <View style={{ flex: 1, paddingHorizontal: spacing.md }}>
                  <Text weight="700">{m.name}</Text>
                  <Text variant="bodySm" color="textMuted">{m.blurb}</Text>
                </View>
                <Text variant="bodySm" weight="700" color="accent">
                  {m.credits} cr
                </Text>
              </View>
            );
          })}
        </View>
      </FormSection>

      <FormSection title="Aspect">
        <View style={styles.row}>
          {ASPECT_OPTIONS.map((a) => (
            <Chip key={a} label={a} selected={s.aspect === a} onPress={() => setS({ ...s, aspect: a as AspectRatio })} />
          ))}
        </View>
      </FormSection>

      <FormSection title="Variations">
        <View style={styles.row}>
          {COUNT_OPTIONS.map((c) => (
            <Chip key={c} label={`x${c}`} selected={s.count === c} onPress={() => setS({ ...s, count: c })} />
          ))}
        </View>
      </FormSection>

      <FormSection title="Style reference (optional)">
        <MediaPicker kind="image" uri={s.styleReferenceUri} onPick={(u) => setS({ ...s, styleReferenceUri: u })} label="Tap to add style image" />
      </FormSection>

      <FormSection title="Character reference (optional)">
        <MediaPicker kind="image" uri={s.characterReferenceUri} onPick={(u) => setS({ ...s, characterReferenceUri: u })} label="Tap to add character image" />
      </FormSection>

      <GenerateBar label="Generate images" hint={`${s.count} · ${s.aspect}`} onPress={handle} disabled={!s.prompt.trim()} tint={featureAccents.imageVideo.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  modelRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: radii.lg, borderWidth: 1 },
});
