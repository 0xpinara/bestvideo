import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Input, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import { ASPECT_OPTIONS, AVATAR_BACKGROUNDS } from '../services/catalog';
import type { AspectRatio, AvatarSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { MediaPicker } from './_shared/MediaPicker';
import { VoiceField } from './_shared/VoiceField';
import { LanguageField } from './_shared/LanguageField';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MOTION: { id: AvatarSettings['motion']; label: string }[] = [
  { id: 'still', label: 'Still' },
  { id: 'subtle', label: 'Subtle' },
  { id: 'expressive', label: 'Expressive' },
];

export const AIAvatarScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<AvatarSettings>({
    script: '',
    voiceId: 'v_rachel',
    background: 'studio',
    motion: 'subtle',
    aspect: '9:16',
    language: 'en',
  });

  const handle = () => {
    const p = createDraft('ai_avatar', { kind: 'ai_avatar', settings: s }, s.script.slice(0, 60) || 'AI avatar');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 160 }}>
      <AppHeader subtitle="Video" title="AI avatar" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Upload a photo or 15-second clip — your avatar will speak any script, in any language.
      </Text>

      <FormSection title="Reference">
        <MediaPicker kind="image" uri={s.photoUri} onPick={(u) => setS({ ...s, photoUri: u })} label="Upload a clear face photo or short clip" />
      </FormSection>

      <FormSection title="Script">
        <Input value={s.script} onChangeText={(t) => setS({ ...s, script: t })} placeholder="What should the avatar say?" multiline style={{ minHeight: 120 }} />
      </FormSection>

      <FormSection title="Voice">
        <VoiceField voiceId={s.voiceId} onChange={(id) => setS({ ...s, voiceId: id })} title="Speaking voice" />
      </FormSection>

      <FormSection title="Language">
        <LanguageField code={s.language} onChange={(c) => setS({ ...s, language: c })} />
      </FormSection>

      <FormSection title="Background">
        <View style={styles.row}>
          {AVATAR_BACKGROUNDS.map((b) => (
            <Chip key={b.id} label={b.label} selected={s.background === b.id} onPress={() => setS({ ...s, background: b.id })} tint={b.tint} />
          ))}
        </View>
      </FormSection>

      <FormSection title="Motion">
        <View style={styles.row}>
          {MOTION.map((m) => (
            <Chip key={m.id} label={m.label} selected={s.motion === m.id} onPress={() => setS({ ...s, motion: m.id })} tint={featureAccents.facelessVideo.to} />
          ))}
        </View>
      </FormSection>

      <FormSection title="Aspect">
        <View style={styles.row}>
          {ASPECT_OPTIONS.map((a) => (
            <Chip key={a} label={a} selected={s.aspect === a} onPress={() => setS({ ...s, aspect: a as AspectRatio })} />
          ))}
        </View>
      </FormSection>

      <GenerateBar label="Render avatar" hint="Up to 60 minutes on Pro" onPress={handle} disabled={!s.photoUri || !s.script.trim()} tint={featureAccents.facelessVideo.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' } });
