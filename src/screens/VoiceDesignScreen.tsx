import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Input, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import { VOICE_DESIGN_ACCENTS } from '../services/catalog';
import type { VoiceDesignSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { Slider } from './_shared/Slider';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const VoiceDesignScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<VoiceDesignSettings>({
    prompt: '',
    gender: 'female',
    age: 'young',
    accent: 'American',
    pace: 0.5,
    pitch: 0.5,
    textPreview: 'Hello, I am your new voice. Tell me a story and I will read it back to you with feeling.',
  });

  const handle = () => {
    const p = createDraft('voice_design', { kind: 'voice_design', settings: s }, s.prompt.slice(0, 60) || 'New voice');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 160 }}>
      <AppHeader subtitle="Voices" title="Voice design" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Invent a brand-new voice from a description. Use it across every audio tool.
      </Text>

      <FormSection title="Describe the voice">
        <Input placeholder='e.g. warm middle-aged narrator with a touch of gravel' value={s.prompt} onChangeText={(t) => setS({ ...s, prompt: t })} multiline />
      </FormSection>

      <FormSection title="Gender">
        <View style={styles.row}>
          {(['female', 'male', 'neutral'] as const).map((g) => (
            <Chip key={g} label={g} selected={s.gender === g} onPress={() => setS({ ...s, gender: g })} />
          ))}
        </View>
      </FormSection>

      <FormSection title="Age">
        <View style={styles.row}>
          {(['child', 'young', 'middle', 'senior'] as const).map((a) => (
            <Chip key={a} label={a} selected={s.age === a} onPress={() => setS({ ...s, age: a })} />
          ))}
        </View>
      </FormSection>

      <FormSection title="Accent">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {VOICE_DESIGN_ACCENTS.map((a) => (
            <Chip key={a} label={a} selected={s.accent === a} onPress={() => setS({ ...s, accent: a })} />
          ))}
        </ScrollView>
      </FormSection>

      <FormSection title="Pace">
        <Slider value={s.pace} onChange={(v) => setS({ ...s, pace: v })} />
      </FormSection>

      <FormSection title="Pitch">
        <Slider value={s.pitch} onChange={(v) => setS({ ...s, pitch: v })} />
      </FormSection>

      <FormSection title="Preview line">
        <Input value={s.textPreview} onChangeText={(t) => setS({ ...s, textPreview: t })} multiline />
      </FormSection>

      <GenerateBar label="Design voice" hint={`${s.gender} · ${s.accent}`} onPress={handle} disabled={!s.prompt.trim()} tint={featureAccents.audio.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' } });
