import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { radii, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number;
};

const { height: SCREEN_H } = Dimensions.get('window');

export const Sheet: React.FC<Props> = ({ visible, onClose, title, children, height }) => {
  const { theme, mode } = useTheme();
  const y = useRef(new Animated.Value(SCREEN_H)).current;
  const target = height ?? Math.min(SCREEN_H * 0.78, 640);

  useEffect(() => {
    if (visible) {
      Animated.spring(y, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
    } else {
      Animated.timing(y, { toValue: target, duration: 220, useNativeDriver: true }).start();
    }
  }, [visible, y, target]);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="fade">
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <BlurView intensity={mode === 'dark' ? 30 : 18} tint={mode === 'dark' ? 'dark' : 'default'} style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20,12,4,0.18)' }]} />
      </Pressable>
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: y }],
            height: target,
            backgroundColor: theme.bgElevated,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: theme.borderStrong }]} />
        {title ? (
          <Text variant="h3" style={styles.title}>
            {title}
          </Text>
        ) : null}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  title: { marginBottom: spacing.md, marginLeft: 2 },
  content: { flex: 1 },
});
