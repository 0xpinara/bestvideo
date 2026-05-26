import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { spacing } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { Button, Text } from '../../components';

export const GenerateBar: React.FC<{
  label?: string;
  hint?: string;
  disabled?: boolean;
  onPress: () => void;
  loading?: boolean;
  tint?: string;
}> = ({ label = 'Generate', hint, disabled, onPress, loading, tint }) => {
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + 14 }]} pointerEvents="box-none">
      {Platform.OS === 'ios' ? (
        <BlurView intensity={mode === 'dark' ? 40 : 28} tint={mode === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bgElevated }]} />
      )}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <View style={styles.row}>
        {hint ? (
          <View style={{ flex: 1, paddingRight: spacing.md }}>
            <Text variant="caption" color="textMuted">
              {hint}
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <Button
          label={label}
          onPress={onPress}
          loading={loading}
          disabled={disabled}
          size="lg"
          tint={tint}
          leftIcon={<Ionicons name="sparkles" size={18} color="#fff" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  divider: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center' },
});
