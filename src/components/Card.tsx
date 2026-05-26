import React from 'react';
import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from 'react-native';
import { radii, shadow, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: PressableProps['onPress'];
  padded?: boolean;
  raised?: boolean;
  tint?: string;
};

export const Card: React.FC<Props> = ({ children, style, onPress, padded = true, raised = false, tint }) => {
  const { theme } = useTheme();
  const base: ViewStyle = {
    backgroundColor: tint ?? theme.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
    padding: padded ? spacing.lg : 0,
  };

  const elev = raised ? shadow.raised : shadow.card;

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }, elev, base, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[elev, base, style]}>{children}</View>;
};

export const styles = StyleSheet.create({});
