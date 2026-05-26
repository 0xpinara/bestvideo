import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Avatar, Chip, Screen, Text } from '../components';
import { radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { VOICES } from '../services/catalog';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'VoicePicker'>;

const FILTERS = ['All', 'Female', 'Male', 'Neutral'] as const;

export const VoicePickerScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { theme } = useTheme();
  const [q, setQ] = useState('');
  const [f, setF] = useState<(typeof FILTERS)[number]>('All');

  const filtered = useMemo(() => {
    return VOICES.filter((v) => {
      if (f !== 'All' && v.gender !== f.toLowerCase()) return false;
      if (q.trim()) {
        const needle = q.toLowerCase();
        if (
          !v.name.toLowerCase().includes(needle) &&
          !v.accent.toLowerCase().includes(needle) &&
          !v.tags.some((t) => t.toLowerCase().includes(needle))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [q, f]);

  return (
    <Screen contentContainerStyle={{ paddingBottom: 60 }}>
      <AppHeader title={params.title ?? 'Pick a voice'} showBack />

      <View style={[styles.search, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={18} color={theme.textMuted} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search by name, accent or vibe"
          placeholderTextColor={theme.textFaint}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      <View style={styles.filters}>
        {FILTERS.map((flt) => (
          <Chip key={flt} label={flt} selected={f === flt} onPress={() => setF(flt)} />
        ))}
      </View>

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        {filtered.map((v) => {
          const selected = v.id === params.selectedId;
          return (
            <Pressable
              key={v.id}
              onPress={() => {
                params.onPick(v.id);
                nav.goBack();
              }}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: selected ? theme.accentTint : theme.surface,
                  borderColor: selected ? theme.accent : theme.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Avatar initials={v.name.slice(0, 2)} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text weight="700">{v.name}</Text>
                <Text variant="caption" color="textMuted">
                  {v.accent} · {v.gender} · {v.tags.join(' · ')}
                </Text>
              </View>
              <Ionicons name={selected ? 'checkmark-circle' : 'play-circle-outline'} size={26} color={selected ? theme.accent : theme.textMuted} />
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filters: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
});
