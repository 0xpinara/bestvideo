import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, IconBadge, Screen, Text } from '../components';
import { featureAccents, radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import { PIKAFFECTS } from '../services/catalog';
import type { PikaffectSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { Slider } from './_shared/Slider';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const PikaffectScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const { createDraft } = useProjects();

  const [s, setS] = useState<PikaffectSettings>({
    effect: 'melt',
    intensity: 0.6,
  });

  const handle = () => {
    const p = createDraft('pikaffect', { kind: 'pikaffect', settings: s }, `${s.effect} effect`);
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Video" title="Effects" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        One-tap viral effects — crush it, melt it, levitate it, paint it.
      </Text>

      <FormSection title="Source video">
        <MediaPicker kind="video" uri={s.videoUri} onPick={(u) => setS({ ...s, videoUri: u })} label="Tap to upload" />
      </FormSection>

      <FormSection title="Effect">
        <View style={styles.grid}>
          {PIKAFFECTS.map((e) => {
            const selected = e.id === s.effect;
            return (
              <View
                key={e.id}
                onTouchEnd={() => setS({ ...s, effect: e.id as PikaffectSettings['effect'] })}
                style={[
                  styles.tile,
                  {
                    backgroundColor: selected ? theme.accentTint : theme.surface,
                    borderColor: selected ? theme.accent : theme.border,
                  },
                ]}
              >
                <IconBadge icon={e.icon as React.ComponentProps<typeof Ionicons>['name']} from={featureAccents.facelessVideo.from} to={featureAccents.facelessVideo.to} size={36} rounded />
                <Text variant="bodySm" weight="700" style={{ marginTop: 6 }}>
                  {e.label}
                </Text>
              </View>
            );
          })}
        </View>
      </FormSection>

      <FormSection title="Intensity" hint={`${Math.round(s.intensity * 100)}%`}>
        <Slider value={s.intensity} onChange={(v) => setS({ ...s, intensity: v })} />
      </FormSection>

      <GenerateBar label="Apply effect" hint={s.effect} onPress={handle} disabled={!s.videoUri} tint={featureAccents.facelessVideo.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    width: '30%',
    flexGrow: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
});
