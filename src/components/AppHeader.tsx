import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';

type Props = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  style?: ViewStyle;
};

export const AppHeader: React.FC<Props> = ({ title, subtitle, showBack, right, style }) => {
  const { theme } = useTheme();
  const nav = useNavigation();

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            onPress={() => nav.goBack()}
            hitSlop={12}
            style={({ pressed }) => [styles.back, { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </Pressable>
        ) : null}
        <View style={styles.titles}>
          {subtitle ? (
            <Text variant="label" color="textMuted">
              {subtitle}
            </Text>
          ) : null}
          {title ? <Text variant="h1">{title}</Text> : null}
        </View>
        {right ? <View>{right}</View> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingTop: spacing.sm, paddingBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  back: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  titles: { flex: 1 },
});
