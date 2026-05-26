import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { palette, radii, shadow, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft';
type Size = 'sm' | 'md' | 'lg';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  haptic?: boolean;
  tint?: string;
};

export const Button: React.FC<Props> = ({
  label,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading,
  fullWidth,
  style,
  haptic = true,
  tint,
  onPress,
  disabled,
  ...rest
}) => {
  const { theme } = useTheme();

  const sizeStyles: ViewStyle =
    size === 'sm'
      ? { paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.md, minHeight: 36 }
      : size === 'lg'
        ? { paddingVertical: 16, paddingHorizontal: 22, borderRadius: radii.xl, minHeight: 56 }
        : { paddingVertical: 12, paddingHorizontal: 18, borderRadius: radii.lg, minHeight: 46 };

  const labelVariant = size === 'sm' ? 'bodySm' : size === 'lg' ? 'bodyLg' : 'body';

  const handlePress: PressableProps['onPress'] = (e) => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(e);
  };

  if (variant === 'primary') {
    const from = tint ?? theme.accentSoft;
    const to = tint ? darken(tint) : theme.accent;
    return (
      <Pressable
        {...rest}
        disabled={disabled || loading}
        onPress={handlePress}
        style={({ pressed }) => [
          fullWidth && { alignSelf: 'stretch' },
          shadow.soft,
          { opacity: disabled ? 0.5 : pressed ? 0.92 : 1 },
          style,
        ]}
      >
        <LinearGradient
          colors={[from, to]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.row, sizeStyles]}
        >
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text variant={labelVariant} color="inverse" weight="600">
              {label}
            </Text>
          )}
          {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === 'soft') {
    const bg = tint ? hexAlpha(tint, 0.18) : theme.accentTint;
    const fg = tint ?? theme.accent;
    return (
      <Pressable
        {...rest}
        disabled={disabled || loading}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.row,
          sizeStyles,
          { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
          fullWidth && { alignSelf: 'stretch' },
          style,
        ]}
      >
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <Text variant={labelVariant} color={fg} weight="600">
            {label}
          </Text>
        )}
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        {...rest}
        disabled={disabled || loading}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.row,
          sizeStyles,
          {
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
          },
          fullWidth && { alignSelf: 'stretch' },
          style,
        ]}
      >
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        {loading ? (
          <ActivityIndicator color={theme.text} />
        ) : (
          <Text variant={labelVariant} color="text" weight="600">
            {label}
          </Text>
        )}
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
      </Pressable>
    );
  }

  // ghost
  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        sizeStyles,
        { opacity: disabled ? 0.5 : pressed ? 0.7 : 1 },
        fullWidth && { alignSelf: 'stretch' },
        style,
      ]}
    >
      {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
      <Text variant={labelVariant} color={tint ?? 'text'} weight="600">
        {label}
      </Text>
      {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
    </Pressable>
  );
};

function hexAlpha(hex: string, a: number): string {
  const m = hex.replace('#', '');
  const bigint = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${a})`;
}

function darken(hex: string): string {
  const m = hex.replace('#', '');
  const bigint = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  const r = Math.max(0, ((bigint >> 16) & 255) - 30);
  const g = Math.max(0, ((bigint >> 8) & 255) - 30);
  const b = Math.max(0, (bigint & 255) - 30);
  return `rgb(${r},${g},${b})`;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  icon: { marginHorizontal: 2 },
});

export const __palette = palette;
