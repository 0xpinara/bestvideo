import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { radii, spacing } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components';

type Kind = 'image' | 'video' | 'audio';

type Props = {
  kind: Kind;
  uri?: string;
  onPick: (uri: string) => void;
  label: string;
};

export const MediaPicker: React.FC<Props> = ({ kind, uri, onPick, label }) => {
  const { theme } = useTheme();

  const handlePress = async () => {
    if (kind === 'audio') {
      const r = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (!r.canceled && r.assets[0]) onPick(r.assets[0].uri);
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const mediaTypes =
      kind === 'video'
        ? ImagePicker.MediaTypeOptions.Videos
        : ImagePicker.MediaTypeOptions.Images;
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes, quality: 0.9 });
    if (!r.canceled && r.assets[0]) onPick(r.assets[0].uri);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.wrap,
        {
          borderColor: uri ? theme.accent : theme.border,
          backgroundColor: theme.surface,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {uri && kind === 'image' ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : null}
      <View style={[styles.inner, uri && kind === 'image' && styles.overlay]}>
        <Ionicons
          name={uri ? 'checkmark-circle' : kind === 'video' ? 'videocam-outline' : kind === 'audio' ? 'musical-notes-outline' : 'image-outline'}
          size={28}
          color={uri ? theme.accent : theme.textMuted}
        />
        <Text variant="bodySm" color={uri ? 'accent' : 'textMuted'} weight="600" style={{ marginTop: 6 }}>
          {uri ? 'Selected — tap to replace' : label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    minHeight: 140,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  overlay: { backgroundColor: 'rgba(0,0,0,0.35)' },
});
