import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Screen, Text } from '../components';
import { radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { LANGUAGES } from '../services/catalog';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'LanguagePicker'>;

export const LanguagePickerScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { theme } = useTheme();
  const [q, setQ] = useState('');

  const filtered = useMemo(
    () =>
      LANGUAGES.filter((l) => {
        if (!q.trim()) return true;
        const n = q.toLowerCase();
        return l.name.toLowerCase().includes(n) || l.code.toLowerCase().includes(n);
      }),
    [q],
  );

  return (
    <Screen contentContainerStyle={{ paddingBottom: 60 }}>
      <AppHeader title={params.title ?? 'Pick a language'} showBack />

      <View style={[styles.search, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={18} color={theme.textMuted} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search 30+ languages"
          placeholderTextColor={theme.textFaint}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
        {filtered.map((l) => {
          const selected = l.code === params.selectedCode;
          return (
            <Pressable
              key={l.code}
              onPress={() => {
                params.onPick(l.code);
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
              <View style={[styles.flag, { backgroundColor: theme.surfaceAlt }]}>
                <Text variant="bodySm" weight="700">
                  {l.flag}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text weight="600">{l.name}</Text>
                <Text variant="caption" color="textMuted">
                  {l.code.toUpperCase()}
                </Text>
              </View>
              {selected ? <Ionicons name="checkmark" size={22} color={theme.accent} /> : null}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  flag: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
