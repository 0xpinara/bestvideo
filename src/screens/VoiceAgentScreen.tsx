import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, Input, Screen, Text } from '../components';
import { featureAccents, spacing } from '../theme';
import { useProjects } from '../store/projects';
import type { VoiceAgentSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { VoiceField } from './_shared/VoiceField';
import { Slider } from './_shared/Slider';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PRESETS: { name: string; prompt: string; greeting: string }[] = [
  {
    name: 'Receptionist',
    prompt: 'You are a friendly receptionist for an indie design studio. Greet callers, capture their name and topic, and offer to schedule a callback.',
    greeting: 'Hi, thanks for calling Lumen Studio. How can I help you today?',
  },
  {
    name: 'Cooking buddy',
    prompt: 'You are a warm cooking companion. Walk the user through a recipe step by step, with timers and substitution suggestions.',
    greeting: 'Hey there, ready to cook? What are we making today?',
  },
  {
    name: 'Bedtime storyteller',
    prompt: 'You are a calm storyteller who improvises short bedtime stories with a Ghibli-soft tone. Use a slow, gentle voice.',
    greeting: 'Cosy in? Tell me a place, a creature, and a feeling — I will weave you a story.',
  },
];

export const VoiceAgentScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { createDraft } = useProjects();

  const [s, setS] = useState<VoiceAgentSettings>({
    name: 'My agent',
    systemPrompt: '',
    voiceId: 'v_rachel',
    greeting: '',
    knowledgeBase: '',
    temperature: 0.6,
    ttsModel: 'eleven_v3',
  });

  const handle = () => {
    const p = createDraft('voice_agent', { kind: 'voice_agent', settings: s }, s.name);
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 160 }}>
      <AppHeader subtitle="Agents" title="Voice agent" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Build a conversational AI you can call or embed. Speech in, speech out — answering in your voice.
      </Text>

      <FormSection title="Quick start">
        <View style={styles.row}>
          {PRESETS.map((p) => (
            <Chip key={p.name} label={p.name} onPress={() => setS({ ...s, name: p.name, systemPrompt: p.prompt, greeting: p.greeting })} tint={featureAccents.dub.to} />
          ))}
        </View>
      </FormSection>

      <FormSection title="Name">
        <Input value={s.name} onChangeText={(t) => setS({ ...s, name: t })} />
      </FormSection>

      <FormSection title="System prompt" hint="The agent's personality, mission, and rules.">
        <Input value={s.systemPrompt} onChangeText={(t) => setS({ ...s, systemPrompt: t })} placeholder="You are a calm, helpful assistant…" multiline style={{ minHeight: 140 }} />
      </FormSection>

      <FormSection title="Greeting">
        <Input value={s.greeting} onChangeText={(t) => setS({ ...s, greeting: t })} placeholder="The first line the agent says" />
      </FormSection>

      <FormSection title="Voice">
        <VoiceField voiceId={s.voiceId} onChange={(id) => setS({ ...s, voiceId: id })} title="Agent voice" />
      </FormSection>

      <FormSection title="Knowledge base" hint="Paste a doc the agent can reference (optional).">
        <Input value={s.knowledgeBase} onChangeText={(t) => setS({ ...s, knowledgeBase: t })} placeholder="Product docs, FAQs, your bio…" multiline style={{ minHeight: 120 }} />
      </FormSection>

      <FormSection title="Temperature" hint="Lower = focused, higher = inventive.">
        <Slider value={s.temperature} onChange={(v) => setS({ ...s, temperature: v })} />
      </FormSection>

      <GenerateBar label="Train agent" hint="Then connect a number or embed widget" onPress={handle} disabled={!s.systemPrompt.trim()} tint={featureAccents.dub.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' } });
