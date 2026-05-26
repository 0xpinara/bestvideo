import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import { AppHeader, Button, Card, Input, Screen, Text } from '../components';
import { spacing } from '../theme';
import { getApiKey, setApiKey } from '../services/api';

export const SettingsScreen: React.FC = () => {
  const [key, setKey] = useState('');
  const [stored, setStored] = useState<string | null>(null);

  useEffect(() => {
    getApiKey().then((k) => {
      setStored(k);
      if (k) setKey(maskKey(k));
    });
  }, []);

  const handleSave = async () => {
    await setApiKey(key.trim());
    setStored(key.trim() || null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert('Saved', 'Your API key is stored securely on this device.');
  };

  const handlePaste = async () => {
    const t = await Clipboard.getStringAsync();
    if (t.trim()) setKey(t.trim());
  };

  return (
    <Screen contentContainerStyle={{ paddingBottom: 80 }}>
      <AppHeader subtitle="Settings" title="ElevenLabs key" showBack />

      <Card>
        <Text>
          Drop in your own ElevenLabs API key to swap the in-app mock for real generation. The key
          never leaves this device — we store it in your phone's secure enclave.
        </Text>
      </Card>

      <View style={{ height: spacing.lg }} />

      <Input
        label="API key"
        value={key}
        onChangeText={setKey}
        placeholder="sk_..."
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={!!stored}
      />

      <View style={styles.row}>
        <Button label="Paste from clipboard" variant="secondary" onPress={handlePaste} style={{ flex: 1 }} />
        <View style={{ width: spacing.sm }} />
        <Button label={stored ? 'Update key' : 'Save key'} onPress={handleSave} style={{ flex: 1 }} disabled={!key.trim() || key === maskKey(stored ?? '')} />
      </View>

      {stored ? (
        <Button
          label="Forget key"
          variant="ghost"
          tint="#B44A2C"
          onPress={async () => {
            await setApiKey(null);
            setStored(null);
            setKey('');
          }}
          style={{ marginTop: spacing.lg, alignSelf: 'flex-start' }}
        />
      ) : null}
    </Screen>
  );
};

function maskKey(k: string): string {
  if (!k) return '';
  if (k.length <= 8) return '••••';
  return `${k.slice(0, 4)}${'•'.repeat(20)}${k.slice(-4)}`;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
