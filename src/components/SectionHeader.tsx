import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { spacing } from '../theme';
import { Text } from './Text';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
};

export const SectionHeader: React.FC<Props> = ({ eyebrow, title, subtitle, right, style }) => (
  <View style={[styles.wrap, style]}>
    <View style={styles.text}>
      {eyebrow ? (
        <Text variant="label" color="accent" style={styles.eyebrow}>
          {eyebrow}
        </Text>
      ) : null}
      <Text variant="h2">{title}</Text>
      {subtitle ? (
        <Text variant="body" color="textMuted" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
    {right ? <View>{right}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  text: { flex: 1, paddingRight: spacing.md },
  eyebrow: { marginBottom: 4 },
  subtitle: { marginTop: 4 },
});
