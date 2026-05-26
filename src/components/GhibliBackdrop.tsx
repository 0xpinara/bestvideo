import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

/**
 * Cute, dreamy Ghibli sky drawn behind every screen.
 * Layered soft clouds drift slowly, a warm sun glows.
 * Renders behind content with low opacity so it never fights the UI.
 */
export const GhibliBackdrop: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const { theme, mode } = useTheme();
  const drift1 = useRef(new Animated.Value(0)).current;
  const drift2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val: Animated.Value, dur: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ).start();
    loop(drift1, 16000);
    loop(drift2, 22000);
  }, [drift1, drift2]);

  const cloud1X = drift1.interpolate({ inputRange: [0, 1], outputRange: [-12, 12] });
  const cloud2X = drift2.interpolate({ inputRange: [0, 1], outputRange: [10, -14] });

  const sunColor = mode === 'dark' ? '#3B2E22' : '#FBE2CB';
  const sunRim = mode === 'dark' ? '#221A12' : '#F2C99C';
  const cloudFill = mode === 'dark' ? 'rgba(244,236,222,0.06)' : 'rgba(255,255,255,0.85)';
  const cloudShadow = mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(180,140,90,0.10)';

  return (
    <View pointerEvents="none" style={[styles.wrap, { opacity: intensity }]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={mode === 'dark' ? '#1F1812' : '#FAF1E0'} />
            <Stop offset="0.6" stopColor={theme.bg} />
            <Stop offset="1" stopColor={theme.bg} />
          </LinearGradient>
          <RadialGradient id="sun" cx="0.78" cy="0.18" r="0.5">
            <Stop offset="0" stopColor={sunColor} stopOpacity="1" />
            <Stop offset="0.6" stopColor={sunRim} stopOpacity="0.4" />
            <Stop offset="1" stopColor={sunRim} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Path d="M0 0 H400 V800 H0 Z" fill="url(#sky)" />
        <Circle cx="312" cy="120" r="180" fill="url(#sun)" />
      </Svg>

      <Animated.View style={[styles.cloud, { top: 70, left: -30, transform: [{ translateX: cloud1X }] }]}>
        <Cloud width={220} height={70} fill={cloudFill} shadow={cloudShadow} />
      </Animated.View>
      <Animated.View style={[styles.cloud, { top: 160, right: -20, transform: [{ translateX: cloud2X }] }]}>
        <Cloud width={180} height={60} fill={cloudFill} shadow={cloudShadow} />
      </Animated.View>
      <Animated.View style={[styles.cloud, { top: 260, left: 40, transform: [{ translateX: cloud2X }] }]}>
        <Cloud width={140} height={48} fill={cloudFill} shadow={cloudShadow} />
      </Animated.View>

      <View style={[styles.cloud, { bottom: 60, left: -40 }]}>
        <Cloud width={260} height={80} fill={cloudFill} shadow={cloudShadow} />
      </View>
    </View>
  );
};

const Cloud: React.FC<{ width: number; height: number; fill: string; shadow: string }> = ({
  width,
  height,
  fill,
  shadow,
}) => (
  <Svg width={width} height={height} viewBox="0 0 200 70">
    <Path
      d="M30 50 C15 50 8 38 18 30 C12 18 26 8 38 16 C44 6 64 6 70 18 C82 10 100 16 100 28 C112 22 132 28 130 42 C144 42 150 56 138 62 C120 70 50 70 30 62 C18 60 18 52 30 50 Z"
      fill={shadow}
      transform="translate(4 6)"
    />
    <Path
      d="M30 50 C15 50 8 38 18 30 C12 18 26 8 38 16 C44 6 64 6 70 18 C82 10 100 16 100 28 C112 22 132 28 130 42 C144 42 150 56 138 62 C120 70 50 70 30 62 C18 60 18 52 30 50 Z"
      fill={fill}
    />
  </Svg>
);

const styles = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFill as object },
  cloud: { position: 'absolute' },
});
