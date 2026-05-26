import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { radii } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: ReadonlyArray<Option<T>>;
  value: T;
  onChange: (v: T) => void;
  style?: ViewStyle;
};

export function SegmentedControl<T extends string>({ options, value, onChange, style }: Props<T>) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.surfaceAlt, borderColor: theme.border },
        style,
      ]}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => {
              if (!active) Haptics.selectionAsync().catch(() => {});
              onChange(o.value);
            }}
            style={[styles.option, active && { backgroundColor: theme.bgElevated }]}
          >
            <Text variant="bodySm" weight={active ? '600' : '500'} color={active ? 'text' : 'textMuted'}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  option: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: radii.pill },
});
