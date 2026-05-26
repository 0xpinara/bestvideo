import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { radii, spacing, typography } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';

type Props = TextInputProps & {
  label?: string;
  helper?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  variant?: 'default' | 'plain';
};

export const Input: React.FC<Props> = ({
  label,
  helper,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  multiline,
  style,
  onFocus,
  onBlur,
  variant = 'default',
  ...rest
}) => {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? (
        <Text variant="bodySm" color="textSoft" weight="600" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.field,
          variant === 'plain'
            ? { backgroundColor: 'transparent', borderColor: 'transparent' }
            : {
                backgroundColor: theme.surface,
                borderColor: error ? theme.accent : focused ? theme.accent : theme.border,
              },
          multiline && { minHeight: 110, alignItems: 'flex-start', paddingVertical: 12 },
        ]}
      >
        {leftIcon ? <View style={styles.side}>{leftIcon}</View> : null}
        <TextInput
          {...rest}
          multiline={multiline}
          placeholderTextColor={theme.textFaint}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            typography.body,
            { color: theme.text, textAlignVertical: multiline ? 'top' : 'center' },
            style as any,
          ]}
        />
        {rightIcon ? <View style={styles.side}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text variant="caption" color={theme.accent} style={styles.helper}>
          {error}
        </Text>
      ) : helper ? (
        <Text variant="caption" color="textMuted" style={styles.helper}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { marginBottom: 6, marginLeft: 2 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  side: { paddingHorizontal: 4 },
  input: { flex: 1, paddingVertical: 8 },
  helper: { marginTop: 6, marginLeft: 2 },
});
