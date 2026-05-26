import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Chip, IconBadge, Input, Screen, Text } from '../components';
import { featureAccents, radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import { MUSIC_SONG_MODELS, MUSIC_STYLE_TAGS } from '../services/catalog';
import type { MusicSongSettings } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

import { FormSection } from './_shared/Section';
import { ToggleRow } from './_shared/ToggleRow';
import { Slider } from './_shared/Slider';
import { GenerateBar } from './_shared/GenerateBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const MusicSongScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const { createDraft } = useProjects();

  const [s, setS] = useState<MusicSongSettings>({
    prompt: '',
    styleTags: ['pop', 'upbeat', 'female vocals'],
    instrumental: false,
    lyrics: '',
    customLyrics: false,
    durationSec: 90,
    model: 'eleven-music-v1',
  });

  const toggleTag = (t: string) =>
    setS((p) => ({
      ...p,
      styleTags: p.styleTags.includes(t) ? p.styleTags.filter((x) => x !== t) : [...p.styleTags, t],
    }));

  const handle = () => {
    const p = createDraft('music_song', { kind: 'music_song', settings: s }, s.prompt.slice(0, 60) || 'AI song');
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 160 }}>
      <AppHeader subtitle="Music" title="AI music generator" showBack />
      <Text color="textMuted" style={{ marginBottom: spacing.md }}>
        Full songs — vocals, instruments, structure — from a single prompt. Eleven Music, Suno or Udio.
      </Text>

      <FormSection title="Model">
        <View style={{ gap: spacing.sm }}>
          {MUSIC_SONG_MODELS.map((m) => {
            const selected = m.id === s.model;
            return (
              <View key={m.id}>
                <View
                  style={[
                    styles.modelRow,
                    {
                      borderColor: selected ? theme.accent : theme.border,
                      backgroundColor: selected ? theme.accentTint : theme.surface,
                    },
                  ]}
                  onTouchEnd={() => setS({ ...s, model: m.id as MusicSongSettings['model'] })}
                >
                  <IconBadge icon="musical-notes" from={featureAccents.videoMusic.from} to={featureAccents.videoMusic.to} size={36} />
                  <View style={{ flex: 1, paddingHorizontal: spacing.md }}>
                    <Text weight="700">{m.name}</Text>
                    <Text variant="bodySm" color="textMuted">
                      {m.blurb}
                    </Text>
                  </View>
                  <Text variant="bodySm" weight="700" color="accent">
                    {m.credits} cr
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </FormSection>

      <FormSection title="Describe the song" hint="Genre, mood, tempo, references — anything.">
        <Input
          placeholder='e.g. dreamy lo-fi with female vocals about late-night trains'
          value={s.prompt}
          onChangeText={(t) => setS({ ...s, prompt: t })}
          multiline
        />
      </FormSection>

      <FormSection title="Style tags" hint={`${s.styleTags.length} selected`}>
        <ScrollView style={styles.tagScroll} contentContainerStyle={styles.tagWrap}>
          {MUSIC_STYLE_TAGS.map((t) => (
            <Chip key={t} label={t} selected={s.styleTags.includes(t)} onPress={() => toggleTag(t)} size="sm" tint={featureAccents.videoMusic.to} />
          ))}
        </ScrollView>
      </FormSection>

      <FormSection title="Duration" hint={`${s.durationSec}s`}>
        <Slider value={s.durationSec / 240} onChange={(v) => setS({ ...s, durationSec: Math.max(15, Math.round(v * 240 / 5) * 5) })} />
      </FormSection>

      <ToggleRow title="Instrumental only" subtitle="No vocals, just the track." value={s.instrumental} onChange={(v) => setS({ ...s, instrumental: v })} />
      <ToggleRow title="Custom lyrics" subtitle="Write the words yourself." value={s.customLyrics} onChange={(v) => setS({ ...s, customLyrics: v, lyrics: v ? s.lyrics : '' })} />

      {s.customLyrics && !s.instrumental ? (
        <FormSection title="Lyrics" hint="Use [Verse], [Chorus], [Bridge] tags to structure.">
          <Input placeholder={`[Verse]\nWhispered lanterns drift...\n\n[Chorus]\nHold the light, hold the light`} value={s.lyrics} onChangeText={(t) => setS({ ...s, lyrics: t })} multiline style={{ minHeight: 180 }} />
        </FormSection>
      ) : null}

      <GenerateBar
        label="Generate song"
        hint={`${s.instrumental ? 'Instrumental' : 'With vocals'} · ${s.durationSec}s`}
        onPress={handle}
        disabled={!s.prompt.trim()}
        tint={featureAccents.videoMusic.to}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  tagScroll: { maxHeight: 200 },
  tagWrap: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
});

export const __ic = Ionicons;
