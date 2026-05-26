import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { radii, spacing } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components';

export const ToggleRow: React.FC<{
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}> = ({ title, subtitle, value, onChange }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <Text weight="600">{title}</Text>
        {subtitle ? (
          <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.borderStrong, true: theme.accent }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
});
