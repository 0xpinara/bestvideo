import React, { useRef } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { radii, spacing } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components';

type Props = {
  value: number; // 0..1
  onChange: (v: number) => void;
  min?: number;
  max?: number;
};

/**
 * Lightweight slider so we don't pull in an extra native lib.
 * Drag the soft amber pebble across the cream track.
 */
export const Slider: React.FC<Props> = ({ value, onChange, min = 0, max = 1 }) => {
  const { theme } = useTheme();
  const widthRef = useRef(0);
  const onLayout = (e: LayoutChangeEvent) => {
    widthRef.current = e.nativeEvent.layout.width;
  };

  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));

  const setFromX = (x: number) => {
    const w = widthRef.current || 1;
    const p = Math.min(1, Math.max(0, x / w));
    onChange(min + p * (max - min));
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        Haptics.selectionAsync().catch(() => {});
        setFromX(e.nativeEvent.locationX);
      },
      onPanResponderMove: (e: GestureResponderEvent) => setFromX(e.nativeEvent.locationX),
    }),
  ).current;

  return (
    <View>
      <View
        {...responder.panHandlers}
        onLayout={onLayout}
        style={[styles.track, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}
      >
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: theme.accent }]} />
        <View style={[styles.thumb, { left: `${pct * 100}%`, borderColor: theme.accent, backgroundColor: '#fff' }]} />
      </View>
      <Text variant="caption" color="textMuted" style={{ marginTop: 6, marginLeft: 2 }}>
        {value.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
    overflow: 'visible',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: radii.pill,
  },
  thumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    marginLeft: -11,
    borderRadius: 11,
    borderWidth: 2,
    top: -5,
  },
});
