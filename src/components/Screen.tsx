import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { GhibliBackdrop } from './GhibliBackdrop';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  withBackdrop?: boolean;
  pad?: boolean;
  contentContainerStyle?: ViewStyle;
  scrollProps?: Omit<ScrollViewProps, 'children' | 'contentContainerStyle'>;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export const Screen: React.FC<Props> = ({
  children,
  scroll = true,
  withBackdrop = true,
  pad = true,
  contentContainerStyle,
  scrollProps,
  edges = ['top', 'left', 'right'],
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const inner = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        pad && styles.padded,
        { paddingBottom: insets.bottom + 120 },
        contentContainerStyle,
      ]}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, pad && styles.padded]}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.fill, { backgroundColor: theme.bg }]}>
      {withBackdrop ? <GhibliBackdrop /> : null}
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {inner}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  padded: { paddingHorizontal: 18, paddingTop: 8 },
});
