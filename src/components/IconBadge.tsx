import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { radii, shadow } from '../theme';

type Props = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  size?: number;
  iconSize?: number;
  from: string;
  to: string;
  style?: ViewStyle;
  rounded?: boolean;
};

export const IconBadge: React.FC<Props> = ({ icon, size = 44, iconSize, from, to, style, rounded }) => {
  return (
    <LinearGradient
      colors={[from, to]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: rounded ? size / 2 : radii.lg,
        },
        shadow.soft,
        style,
      ]}
    >
      <Ionicons name={icon} size={iconSize ?? Math.round(size * 0.5)} color="#fff" />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
