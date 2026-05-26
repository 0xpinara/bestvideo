import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  tint?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
};

export const Chip: React.FC<Props> = ({
  label,
  selected,
  onPress,
  leftIcon,
  rightIcon,
  tint,
  size = 'md',
  style,
}) => {
  const { theme } = useTheme();
  const pad =
    size === 'sm'
      ? { paddingVertical: 5, paddingHorizontal: 10 }
      : { paddingVertical: 8, paddingHorizontal: 14 };

  const bg = selected ? (tint ?? theme.accent) : theme.surface;
  const border = selected ? (tint ?? theme.accent) : theme.border;
  const fg = selected ? '#fff' : theme.text;

  const handlePress = () => {
    if (onPress) {
      Haptics.selectionAsync().catch(() => {});
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.chip,
        pad,
        { backgroundColor: bg, borderColor: border, opacity: pressed ? 0.8 : 1 },
        style,
      ]}
    >
      {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
      <Text variant={size === 'sm' ? 'bodySm' : 'body'} weight="500" color={fg}>
        {label}
      </Text>
      {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  icon: { marginHorizontal: 1 },
});
