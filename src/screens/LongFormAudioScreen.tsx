import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import uuid from 'react-native-uuid';

import { AppHeader, Avatar, Button, Input, Screen, Text } from '../components';
import { featureAccents, palette, radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import { VOICES } from '../services/catalog';
import type { LongFormAudioSettings, ScriptTurn } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { VoiceField } from './_shared/VoiceField';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SAMPLE: ScriptTurn[] = [
  {
    id: String(uuid.v4()),
    speaker: 'Alex',
    voiceId: 'v_adam',
    text: 'Today we are unpacking how on-device AI is changing latency budgets.',
  },
  {
    id: String(uuid.v4()),
    speaker: 'Riley',
    voiceId: 'v_elli',
    text: 'It is wild. When inference moves local, product teams rethink what feels instant.',
  },
  {
    id: String(uuid.v4()),
    speaker: 'Alex',
    voiceId: 'v_adam',
    text: 'We are seeing hybrid stacks where the model starts on device and hands off to cloud.',
  },
  {
    id: String(uuid.v4()),
    speaker: 'Riley',
    voiceId: 'v_elli',
    text: 'And that shift drives new privacy stories. The default becomes local, not remote.',
  },
  {
    id: String(uuid.v4()),
    speaker: 'Alex',
    voiceId: 'v_adam',
    text: 'Tooling is catching up too. Distillation pipelines are now a product feature.',
  },
  {
    id: String(uuid.v4()),
    speaker: 'Riley',
    voiceId: 'v_elli',
    text: 'The big question is how to measure quality when the model is evolving weekly.',
  },
];

export const LongFormAudioScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const { createDraft } = useProjects();

  const [s, setS] = useState<LongFormAudioSettings>({
    title: 'On-device AI is rewriting latency',
    turns: SAMPLE,
  });

  const speakers = useMemo(() => {
    const map = new Map<string, { name: string; voiceId: string; tint: string }>();
    const tints = [palette.terracotta, palette.lavenderDeep, palette.meadowDeep, palette.skyDeep, palette.peachDeep];
    s.turns.forEach((t, i) => {
      if (!map.has(t.speaker)) {
        map.set(t.speaker, { name: t.speaker, voiceId: t.voiceId, tint: tints[map.size % tints.length] });
      }
    });
    return Array.from(map.values());
  }, [s.turns]);

  const update = (id: string, patch: Partial<ScriptTurn>) => {
    setS({ ...s, turns: s.turns.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
  };
  const remove = (id: string) => setS({ ...s, turns: s.turns.filter((t) => t.id !== id) });
  const add = () => {
    const last = s.turns[s.turns.length - 1];
    const speaker = last?.speaker === 'Alex' ? 'Riley' : 'Alex';
    setS({
      ...s,
      turns: [
        ...s.turns,
        { id: String(uuid.v4()), speaker, voiceId: speaker === 'Alex' ? 'v_adam' : 'v_elli', text: '' },
      ],
    });
  };

  const handle = () => {
    const p = createDraft('long_form_audio', { kind: 'long_form_audio', settings: s }, s.title);
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 160 }}>
      <AppHeader subtitle="Audio" title="Long form audio" showBack />

      <FormSection title="Title">
        <Input value={s.title} onChangeText={(t) => setS({ ...s, title: t })} placeholder="Episode title" />
      </FormSection>

      <FormSection title="Speakers" hint="Assign a voice to each named speaker.">
        <View style={{ gap: spacing.sm }}>
          {speakers.map((sp) => (
            <View key={sp.name} style={[styles.speakerRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Avatar initials={sp.name} from={sp.tint} to={sp.tint} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text weight="700">{sp.name}</Text>
                <Text variant="caption" color="textMuted">
                  {VOICES.find((v) => v.id === sp.voiceId)?.name} · {VOICES.find((v) => v.id === sp.voiceId)?.accent}
                </Text>
              </View>
              <Pressable
                onPress={() =>
                  nav.navigate('VoicePicker', {
                    selectedId: sp.voiceId,
                    onPick: (id) =>
                      setS((prev) => ({
                        ...prev,
                        turns: prev.turns.map((t) => (t.speaker === sp.name ? { ...t, voiceId: id } : t)),
                      })),
                    title: `Voice for ${sp.name}`,
                  })
                }
              >
                <Text variant="bodySm" color="accent" weight="700">
                  Change
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </FormSection>

      <FormSection title="Script">
        <View style={{ gap: spacing.md }}>
          {s.turns.map((t, i) => {
            const sp = speakers.find((x) => x.name === t.speaker);
            return (
              <View key={t.id} style={[styles.turn, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.turnHead}>
                  <Avatar initials={t.speaker} size={28} from={sp?.tint} to={sp?.tint} />
                  <Input
                    variant="plain"
                    value={t.speaker}
                    onChangeText={(v) => update(t.id, { speaker: v.trim() || `Speaker ${i + 1}` })}
                    style={{ fontWeight: '700' }}
                    containerStyle={{ flex: 1, marginBottom: 0, marginLeft: spacing.sm }}
                  />
                  <Pressable onPress={() => remove(t.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={18} color={theme.textMuted} />
                  </Pressable>
                </View>
                <Input
                  variant="plain"
                  value={t.text}
                  onChangeText={(v) => update(t.id, { text: v })}
                  placeholder="What does this speaker say?"
                  multiline
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
            );
          })}
        </View>
        <Button label="Add turn" variant="soft" leftIcon={<Ionicons name="add" size={18} color="#fff" />} onPress={add} tint={featureAccents.dub.to} style={{ marginTop: spacing.md }} />
      </FormSection>

      <GenerateBar label="Generate podcast" hint={`${s.turns.length} turns · ${speakers.length} voices`} onPress={handle} disabled={!s.turns.some((t) => t.text.trim())} tint={featureAccents.dub.to} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  turn: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  turnHead: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
});
