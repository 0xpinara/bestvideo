import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/**
 * Tiny four-pointed sparkle that gently pulses.
 * Used to add Ghibli magic on hero CTAs and generation success.
 */
export const Sparkle: React.FC<{ size?: number; color?: string; delay?: number }> = ({
  size = 14,
  color = '#E0A458',
  delay = 0,
}) => {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, delay]);

  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.15] });
  const opacity = v.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }], opacity }]}> 
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 0 L13.8 9.2 L24 12 L13.8 14.8 L12 24 L10.2 14.8 L0 12 L10.2 9.2 Z"
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({ wrap: { alignItems: 'center', justifyContent: 'center' } });
