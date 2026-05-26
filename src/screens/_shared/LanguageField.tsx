import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { radii, spacing } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components';
import { LANGUAGES } from '../../services/catalog';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const LanguageField: React.FC<{
  code: string;
  onChange: (c: string) => void;
  title?: string;
}> = ({ code, onChange, title }) => {
  const { theme } = useTheme();
  const nav = useNavigation<Nav>();
  const lang = LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];

  return (
    <Pressable
      onPress={() => nav.navigate('LanguagePicker', { selectedCode: code, onPick: onChange, title })}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.flag, { backgroundColor: theme.surfaceAlt }]}>
        <Text variant="bodySm" weight="700">
          {lang.flag}
        </Text>
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text weight="600">{lang.name}</Text>
        <Text variant="caption" color="textMuted">
          {lang.code.toUpperCase()}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textFaint} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  flag: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
