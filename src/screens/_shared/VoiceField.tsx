import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { radii, spacing } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { Avatar, Text } from '../../components';
import { VOICES } from '../../services/catalog';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const VoiceField: React.FC<{
  voiceId: string;
  onChange: (id: string) => void;
  title?: string;
}> = ({ voiceId, onChange, title }) => {
  const { theme } = useTheme();
  const nav = useNavigation<Nav>();
  const voice = VOICES.find((v) => v.id === voiceId) ?? VOICES[0];

  return (
    <Pressable
      onPress={() => nav.navigate('VoicePicker', { selectedId: voiceId, onPick: onChange, title })}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Avatar initials={voice.name.slice(0, 2)} />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text weight="600">{voice.name}</Text>
        <Text variant="caption" color="textMuted">
          {voice.accent} · {voice.tags.join(' · ')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textFaint} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
});
