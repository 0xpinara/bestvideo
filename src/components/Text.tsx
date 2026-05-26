import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { typography } from '../theme';
import { useTheme } from '../theme/ThemeContext';

type Variant = keyof typeof typography;

type Props = RNTextProps & {
  variant?: Variant;
  color?: 'text' | 'textSoft' | 'textMuted' | 'textFaint' | 'accent' | 'inverse' | (string & {});
  align?: TextStyle['textAlign'];
  weight?: TextStyle['fontWeight'];
};

export const Text: React.FC<Props> = ({
  variant = 'body',
  color = 'text',
  align,
  weight,
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  const resolved =
    color === 'inverse'
      ? theme.mode === 'dark'
        ? theme.text
        : '#FFFFFF'
      : color in theme
        ? (theme as Record<string, string>)[color]
        : color;

  return (
    <RNText
      {...rest}
      style={[
        typography[variant],
        { color: resolved as string, textAlign: align, fontWeight: weight ?? typography[variant].fontWeight },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};
