import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Avatar, Chip, Screen, Text } from '../components';
import { palette, radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { VOICES } from '../services/catalog';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTERS = ['All', 'Trending', 'Cloned', 'Designed', 'Community'] as const;
const TAGS = ['narration', 'cinematic', 'casual', 'storybook', 'documentary', 'energetic', 'soft', 'deep', 'warm', 'anime'];

// Extended voice library mirroring ElevenLabs' community surface.
type LibSource = 'designed' | 'community' | 'cloned';
const LIBRARY: { id: string; name: string; accent: string; gender: 'female' | 'male' | 'neutral'; tags: string[]; source: LibSource; uses: number; flag?: string }[] = [
  ...VOICES.map((v) => ({ ...v, source: 'designed' as LibSource, uses: Math.floor(Math.random() * 9_000_000) })),
  { id: 'cv_storyteller', name: 'Storyteller', accent: 'British', gender: 'female' as const, tags: ['warm', 'audiobook'], source: 'community' as const, uses: 8_200_000, flag: 'GB' },
  { id: 'cv_announcer', name: 'Announcer', accent: 'American', gender: 'male' as const, tags: ['deep', 'cinematic'], source: 'community' as const, uses: 7_400_000, flag: 'US' },
  { id: 'cv_yoga', name: 'Yoga', accent: 'Australian', gender: 'female' as const, tags: ['soft', 'meditation'], source: 'community' as const, uses: 3_100_000, flag: 'AU' },
  { id: 'cv_jazz', name: 'Late Jazz', accent: 'American', gender: 'male' as const, tags: ['smooth', 'host'], source: 'community' as const, uses: 2_400_000, flag: 'US' },
  { id: 'cv_villain', name: 'Villain', accent: 'British', gender: 'male' as const, tags: ['dark', 'cinematic'], source: 'community' as const, uses: 1_900_000, flag: 'GB' },
];

export const VoiceLibraryScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme } = useTheme();
  const [q, setQ] = useState('');
  const [f, setF] = useState<(typeof FILTERS)[number]>('All');
  const [tag, setTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return LIBRARY.filter((v) => {
      if (f === 'Trending' && v.uses < 1_000_000) return false;
      if (f === 'Community' && v.source !== 'community') return false;
      if (f === 'Designed' && v.source !== 'designed') return false;
      if (f === 'Cloned' && v.source !== 'cloned') return false;
      if (tag && !v.tags.includes(tag)) return false;
      if (q.trim()) {
        const n = q.toLowerCase();
        if (![v.name, v.accent, ...v.tags].some((x) => x.toLowerCase().includes(n))) return false;
      }
      return true;
    });
  }, [q, f, tag]);

  return (
    <Screen contentContainerStyle={{ paddingBottom: 80 }}>
      <AppHeader subtitle="Voices" title="Voice library" showBack />

      <View style={[styles.search, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={18} color={theme.textMuted} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search 1000s of voices"
          placeholderTextColor={theme.textFaint}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((flt) => (
          <Chip key={flt} label={flt} selected={f === flt} onPress={() => setF(flt)} />
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {TAGS.map((t) => (
          <Chip key={t} label={`#${t}`} selected={tag === t} onPress={() => setTag(tag === t ? null : t)} size="sm" />
        ))}
      </ScrollView>

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        {filtered.map((v) => (
          <Pressable key={v.id} style={({ pressed }) => [styles.row, { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.9 : 1 }]}>
            <Avatar initials={v.name.slice(0, 2)} from={tintForUses(v.uses)} to={palette.terracotta} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text weight="700">{v.name}</Text>
                {v.source === 'community' ? (
                  <Text variant="caption" color="textMuted">· community</Text>
                ) : null}
              </View>
              <Text variant="caption" color="textMuted">
                {v.accent} · {v.gender} · {formatUses(v.uses)} uses
              </Text>
              <View style={styles.tagWrap}>
                {v.tags.slice(0, 3).map((t) => (
                  <Text key={t} variant="caption" color="textFaint" style={{ marginRight: 8 }}>
                    #{t}
                  </Text>
                ))}
              </View>
            </View>
            <Ionicons name="play-circle" size={32} color={theme.accent} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
};

function formatUses(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return String(n);
}

function tintForUses(n: number): string {
  if (n >= 5_000_000) return palette.terracotta;
  if (n >= 1_000_000) return palette.peachDeep;
  if (n >= 100_000) return palette.amber;
  return palette.lavenderDeep;
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: radii.lg, borderWidth: 1, marginBottom: spacing.md,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filters: { flexDirection: 'row', gap: spacing.xs, paddingVertical: spacing.xs, paddingRight: spacing.lg },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, borderRadius: radii.lg, borderWidth: 1,
  },
  tagWrap: { flexDirection: 'row', marginTop: 4 },
});
