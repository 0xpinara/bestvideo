import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Screen, Sparkle, Text } from '../components';
import { palette, radii, shadow, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useProjects } from '../store/projects';
import { generate } from '../services/api';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'Generation'>;

export const GenerationScreen: React.FC = () => {
  const { theme, mode } = useTheme();
  const nav = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { projects, upsert, patch } = useProjects();
  const project = projects.find((p) => p.id === route.params.projectId);

  const [pct, setPct] = useState(0);
  const [stage, setStage] = useState('Warming up the studio');
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const handleRef = useRef<ReturnType<typeof generate> | null>(null);

  const orb = useRef(new Animated.Value(0)).current;
  const ringWidth = 220;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(orb, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(orb, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
  }, [orb]);

  useEffect(() => {
    if (!project) return;
    patch(project.id, { status: 'generating' });
    const handle = generate(project, ({ pct, stage }) => {
      setPct(pct);
      setStage(stage);
    });
    handleRef.current = handle;
    handle.promise
      .then((finished) => {
        upsert(finished);
        setDone(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      })
      .catch(() => {
        setFailed(true);
        patch(project.id, { status: 'failed' });
      });
    return () => handle.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  if (!project) {
    return (
      <Screen>
        <Text>Project not found.</Text>
      </Screen>
    );
  }

  const scale = orb.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.08] });

  return (
    <Screen scroll={false}>
      <View style={styles.top}>
        <Text variant="label" color="textMuted">
          GENERATING
        </Text>
        <Text variant="h1" style={{ marginTop: 4 }}>
          {project.title}
        </Text>
      </View>

      <View style={styles.center}>
        <View style={styles.ringWrap}>
          {/* Background ring */}
          <View style={[styles.ring, { width: ringWidth, height: ringWidth, borderRadius: ringWidth / 2, borderColor: theme.border }]} />
          {/* Filled ring via masked gradient slice */}
          <View style={[styles.ringFillWrap, { width: ringWidth, height: ringWidth }]}>
            <RingProgress pct={done ? 1 : pct} size={ringWidth} stroke={10} colors={[palette.peach, palette.terracotta]} />
          </View>

          <Animated.View style={[styles.orb, shadow.raised, { transform: [{ scale }] }]}>
            <LinearGradient
              colors={done ? [palette.meadow, palette.meadowDeep] : [palette.peach, palette.terracotta]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.orbGradient}
            >
              <Sparkle size={32} color="#fff" />
            </LinearGradient>
          </Animated.View>
        </View>

        <Text variant="h2" align="center" style={{ marginTop: spacing.xxl }}>
          {failed ? 'Something flickered' : done ? 'All done' : stage}
        </Text>
        <Text variant="body" color="textMuted" align="center" style={{ marginTop: 6 }}>
          {failed
            ? "We couldn't finish this one. You can try again or tweak the inputs."
            : done
              ? 'Preview, share or keep editing — it lives in your library now.'
              : `${Math.round(pct * 100)}% complete`}
        </Text>
      </View>

      <View style={styles.bottom}>
        {failed ? (
          <View style={styles.row}>
            <Button label="Close" variant="secondary" onPress={() => nav.goBack()} style={{ flex: 1 }} />
            <View style={{ width: spacing.sm }} />
            <Button label="Retry" onPress={() => { setFailed(false); setPct(0); setStage('Restarting'); patch(project.id, { status: 'queued' }); }} style={{ flex: 1 }} />
          </View>
        ) : done ? (
          <View style={styles.row}>
            <Button label="Done" variant="secondary" onPress={() => nav.popToTop()} style={{ flex: 1 }} />
            <View style={{ width: spacing.sm }} />
            <Button
              label="Open"
              leftIcon={<Ionicons name="open-outline" size={18} color="#fff" />}
              onPress={() => {
                nav.replace('ProjectDetail', { projectId: project.id });
              }}
              style={{ flex: 1 }}
            />
          </View>
        ) : (
          <Button label="Cancel" variant="secondary" fullWidth onPress={() => { handleRef.current?.cancel(); nav.goBack(); }} />
        )}
      </View>
    </Screen>
  );
};

/**
 * SVG-free ring progress: draws a series of segments around a circle, each
 * a small sliver of a tinted view. Looks soft and hand-drawn.
 */
const RingProgress: React.FC<{ pct: number; size: number; stroke: number; colors: [string, string] }> = ({
  pct,
  size,
  stroke,
  colors,
}) => {
  const steps = 60;
  const visible = Math.round(pct * steps);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: steps }).map((_, i) => {
        const angle = (i / steps) * 360 - 90;
        const on = i < visible;
        const dotSize = stroke;
        const r = size / 2 - dotSize / 2;
        const x = Math.cos((angle * Math.PI) / 180) * r;
        const y = Math.sin((angle * Math.PI) / 180) * r;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: on ? colors[i % 2 === 0 ? 0 : 1] : 'transparent',
              transform: [{ translateX: x }, { translateY: y }],
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  top: { marginTop: spacing.xxl, marginBottom: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  ring: { borderWidth: 1, position: 'absolute' },
  ringFillWrap: { alignItems: 'center', justifyContent: 'center', position: 'absolute' },
  orb: { width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  orbGradient: { flex: 1, width: 130, height: 130, alignItems: 'center', justifyContent: 'center', borderRadius: 65 },
  bottom: { paddingBottom: spacing.xl, gap: spacing.md },
  row: { flexDirection: 'row' },
});
