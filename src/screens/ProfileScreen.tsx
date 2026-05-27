import React from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader, Avatar, Button, Card, Screen, SectionHeader, Text } from '../components';
import { MARKETING_URL } from '../config/urls';
import { palette, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { theme, mode, toggle } = useTheme();

  return (
    <Screen>
      <AppHeader subtitle="Account" title="You" />

      <Card>
        <View style={styles.row}>
          <Avatar initials="GS" size={56} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text variant="h3">Make Faceless Videos</Text>
            <Text variant="bodySm" color="textMuted">
              Free plan · 45 credits remaining
            </Text>
          </View>
        </View>
        <Button label="Upgrade to Pro" style={{ marginTop: spacing.md }} />
      </Card>

      <SectionHeader eyebrow="Preferences" title="Settings" />
      <View style={{ gap: spacing.sm }}>
        <Row
          icon="key-outline"
          title="ElevenLabs API key"
          subtitle="Use your own key for live generation"
          onPress={() => nav.navigate('Settings')}
        />
        <Row
          icon={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
          title={mode === 'dark' ? 'Light mode' : 'Night mode'}
          subtitle="Switch between sunny and starry skies"
          onPress={toggle}
        />
        <Row icon="cloud-download-outline" title="Downloads" subtitle="Files saved to your device" onPress={() => {}} />
        <Row icon="shield-checkmark-outline" title="Privacy" subtitle="What we store and what we don't" onPress={() => {}} />
        {Platform.OS === 'web' ? (
          <Row
            icon="globe-outline"
            title="Website"
            subtitle="Tutorials, pricing, and articles"
            onPress={() => Linking.openURL(MARKETING_URL)}
          />
        ) : null}
        <Row icon="document-text-outline" title="Terms & licenses" subtitle="The small print" onPress={() => {}} />
      </View>

      <Text variant="caption" color="textFaint" align="center" style={{ marginTop: spacing.huge }}>
        Made with care · v1.0.0
      </Text>
    </Screen>
  );
};

const Row: React.FC<{ icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void }> = ({ icon, title, subtitle, onPress }) => {
  const { theme } = useTheme();
  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: theme.surfaceAlt }]}>
          <Ionicons name={icon} size={22} color={theme.accent} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text weight="600">{title}</Text>
          <Text variant="caption" color="textMuted">
            {subtitle}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textFaint} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const __p = palette;
