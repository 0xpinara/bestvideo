import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../theme';
import { Text } from '../../components';

export const FormSection: React.FC<{
  title: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ title, hint, children }) => (
  <View style={styles.wrap}>
    <Text variant="label" color="textSoft" style={{ marginBottom: 6, marginLeft: 2 }}>
      {title}
    </Text>
    {children}
    {hint ? (
      <Text variant="caption" color="textMuted" style={{ marginTop: 6, marginLeft: 2 }}>
        {hint}
      </Text>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
});
