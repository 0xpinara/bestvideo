import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Input, Screen, Text } from '../components';
import { featureAccents, palette, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { AudioNativeSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { VoiceField } from './_shared/VoiceField';
import { ToggleRow } from './_shared/ToggleRow';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SWATCHES = [palette.terracotta, palette.meadowDeep, palette.skyDeep, palette.lavenderDeep, palette.amber, palette.peachDeep];

export const AudioNativeScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<AudioNativeSettings>({
    articleUrl: '',
    voiceId: 'v_rachel',
    embedColor: palette.terracotta,
    autoPlay: false,
  });

  const handle = () => {
    const p = createDraft('audio_native', { kind: 'audio_native', settings: s }, s.articleUrl || 'Article');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Audio" title="Audio Native" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Paste any article URL — we generate a beautiful embeddable audio player that narrates it.
      </Text>

      <FormSection title="Article URL">
        <Input value={s.articleUrl} onChangeText={(t) => setS({ ...s, articleUrl: t })} placeholder="https://yourblog.com/post" autoCapitalize="none" autoCorrect={false} keyboardType="url" />
      </FormSection>

      <FormSection title="Narrator">
        <VoiceField voiceId={s.voiceId} onChange={(id) => setS({ ...s, voiceId: id })} title="Reader" />
      </FormSection>

      <FormSection title="Player accent colour">
        <View style={styles.row}>
          {SWATCHES.map((c) => (
            <View
              key={c}
              onTouchEnd={() => setS({ ...s, embedColor: c })}
              style={[styles.swatch, { backgroundColor: c, borderColor: s.embedColor === c ? '#000' : 'transparent' }]}
            />
          ))}
        </View>
      </FormSection>

      <ToggleRow title="Auto-play on page load" subtitle="Most browsers require user interaction first." value={s.autoPlay} onChange={(v) => setS({ ...s, autoPlay: v })} />

      <GenerateBar label="Generate embed" hint="≈ 1 credit / 1000 chars" onPress={handle} disabled={!s.articleUrl.trim()} tint={featureAccents.audio.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 3 },
});
