import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './Text';

type Props = {
  initials: string;
  size?: number;
  from?: string;
  to?: string;
};

export const Avatar: React.FC<Props> = ({ initials, size = 36, from = '#F6C6A7', to = '#C96442' }) => (
  <LinearGradient
    colors={[from, to]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}
  >
    <Text variant="bodySm" color="inverse" weight="700">
      {initials.toUpperCase().slice(0, 2)}
    </Text>
  </LinearGradient>
);

const styles = StyleSheet.create({ wrap: { alignItems: 'center', justifyContent: 'center' } });
