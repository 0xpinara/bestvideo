import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Input, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import { ASPECT_OPTIONS } from '../services/catalog';
import type { AspectRatio, FacelessVideoSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { VoiceField } from './_shared/VoiceField';
import { LanguageField } from './_shared/LanguageField';
import { ToggleRow } from './_shared/ToggleRow';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const BROLL: { id: FacelessVideoSettings['brollStyle']; label: string }[] = [
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'animated', label: 'Animated' },
  { id: 'documentary', label: 'Documentary' },
  { id: 'ghibli', label: 'Ghibli' },
];

const CAPS: { id: FacelessVideoSettings['captionStyle']; label: string }[] = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'bold', label: 'Bold' },
  { id: 'subtle', label: 'Subtle' },
  { id: 'kinetic', label: 'Kinetic' },
];

export const FacelessVideoScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<FacelessVideoSettings>({
    prompt: '',
    script: '',
    voiceId: 'v_rachel',
    brollStyle: 'cinematic',
    captionStyle: 'kinetic',
    language: 'en',
    aspect: '9:16',
    music: true,
  });

  const handle = () => {
    const p = createDraft(
      'faceless_video',
      { kind: 'faceless_video', settings: s },
      (s.prompt || s.script).slice(0, 60) || 'Faceless video',
    );
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader subtitle="Studio" title="Create faceless video" showBack />

      <FormSection title="Idea" hint="Describe the topic. We'll polish it into a script.">
        <Input
          placeholder="e.g. 3 surprising habits of focused engineers"
          value={s.prompt}
          onChangeText={(t) => setS({ ...s, prompt: t })}
        />
      </FormSection>

      <FormSection title="Script" hint="Optional — leave blank to auto-write from idea.">
        <Input
          placeholder="Write or paste a script..."
          value={s.script}
          onChangeText={(t) => setS({ ...s, script: t })}
          multiline
        />
      </FormSection>

      <FormSection title="Voice">
        <VoiceField voiceId={s.voiceId} onChange={(id) => setS({ ...s, voiceId: id })} title="Narrator" />
      </FormSection>

      <FormSection title="Language">
        <LanguageField code={s.language} onChange={(c) => setS({ ...s, language: c })} title="Output language" />
      </FormSection>

      <FormSection title="B-roll style">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {BROLL.map((b) => (
            <Chip
              key={b.id}
              label={b.label}
              selected={s.brollStyle === b.id}
              onPress={() => setS({ ...s, brollStyle: b.id })}
              tint={featureAccents.facelessVideo.to}
            />
          ))}
        </ScrollView>
      </FormSection>

      <FormSection title="Caption style">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {CAPS.map((c) => (
            <Chip
              key={c.id}
              label={c.label}
              selected={s.captionStyle === c.id}
              onPress={() => setS({ ...s, captionStyle: c.id })}
              tint={featureAccents.captions.to}
            />
          ))}
        </ScrollView>
      </FormSection>

      <FormSection title="Aspect">
        <View style={styles.chipRow}>
          {ASPECT_OPTIONS.map((a) => (
            <Chip key={a} label={a} selected={s.aspect === a} onPress={() => setS({ ...s, aspect: a as AspectRatio })} />
          ))}
        </View>
      </FormSection>

      <ToggleRow
        title="Auto background music"
        subtitle="Sit a sympathetic score under your narration."
        value={s.music}
        onChange={(v) => setS({ ...s, music: v })}
      />

      <Text variant="caption" color="textMuted" style={{ marginTop: spacing.lg }}>
        Estimated cost · 14 credits
      </Text>

      <GenerateBar
        label="Generate video"
        hint={`Voice · B-roll · ${s.aspect}`}
        onPress={handle}
        disabled={!s.prompt.trim() && !s.script.trim()}
        tint={featureAccents.facelessVideo.to}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
});
