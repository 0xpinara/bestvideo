import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { linking } from './linking';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { useTheme } from '../theme/ThemeContext';
import { palette } from '../theme';
import type { RootStackParamList, TabsParamList } from './types';

import { StudioScreen } from '../screens/StudioScreen';
import { ImageVideoScreen } from '../screens/ImageVideoScreen';
import { ToolsScreen } from '../screens/ToolsScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { FacelessVideoScreen } from '../screens/FacelessVideoScreen';
import { CaptionsScreen } from '../screens/CaptionsScreen';
import { DubScreen } from '../screens/DubScreen';
import { VoiceoverScreen } from '../screens/VoiceoverScreen';
import { VideoMusicScreen } from '../screens/VideoMusicScreen';
import { AudioScreen } from '../screens/AudioScreen';
import { LongFormAudioScreen } from '../screens/LongFormAudioScreen';
import { GenerationScreen } from '../screens/GenerationScreen';
import { ProjectDetailScreen } from '../screens/ProjectDetailScreen';
import { VoicePickerScreen } from '../screens/VoicePickerScreen';
import { LanguagePickerScreen } from '../screens/LanguagePickerScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
// New screens
import { SoundEffectsScreen } from '../screens/SoundEffectsScreen';
import { VoiceChangerScreen } from '../screens/VoiceChangerScreen';
import { VoiceIsolatorScreen } from '../screens/VoiceIsolatorScreen';
import { TranscribeScreen } from '../screens/TranscribeScreen';
import { MusicSongScreen } from '../screens/MusicSongScreen';
import { VoiceDesignScreen } from '../screens/VoiceDesignScreen';
import { VoiceAgentScreen } from '../screens/VoiceAgentScreen';
import { AudioNativeScreen } from '../screens/AudioNativeScreen';
import { VoiceLibraryScreen } from '../screens/VoiceLibraryScreen';
import { AIAvatarScreen } from '../screens/AIAvatarScreen';
import { VideoTranslateScreen } from '../screens/VideoTranslateScreen';
import { LipSyncScreen } from '../screens/LipSyncScreen';
import { VideoExtendScreen } from '../screens/VideoExtendScreen';
import { BackgroundRemoveScreen } from '../screens/BackgroundRemoveScreen';
import { InpaintScreen } from '../screens/InpaintScreen';
import { PikaffectScreen } from '../screens/PikaffectScreen';
import { StoryboardScreen } from '../screens/StoryboardScreen';
import { ImageGenScreen } from '../screens/ImageGenScreen';

const Tabs = createBottomTabNavigator<TabsParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabBarBackground() {
  const { theme, mode } = useTheme();
  return (
    <View style={StyleSheet.absoluteFill}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={mode === 'dark' ? 35 : 28} tint={mode === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      ) : null}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: Platform.OS === 'ios' ? 'rgba(255,251,244,0.72)' : theme.bgElevated,
            borderTopColor: theme.border,
            borderTopWidth: StyleSheet.hairlineWidth,
          },
        ]}
      />
    </View>
  );
}

function TabsNavigator() {
  const { theme } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          position: 'absolute',
          height: Platform.OS === 'ios' ? 84 : 68,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          paddingTop: 6,
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarIcon: ({ color, focused }) => {
          const map: Record<keyof TabsParamList, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
            StudioTab: ['sparkles-outline', 'sparkles'],
            ImageVideoTab: ['images-outline', 'images'],
            ToolsTab: ['apps-outline', 'apps'],
            ProjectsTab: ['folder-open-outline', 'folder-open'],
            ProfileTab: ['person-circle-outline', 'person-circle'],
          };
          const [out, fil] = map[route.name as keyof TabsParamList];
          return <Ionicons name={focused ? fil : out} size={24} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="StudioTab" component={StudioScreen} options={{ title: 'Studio' }} />
      <Tabs.Screen name="ImageVideoTab" component={ImageVideoScreen} options={{ title: 'Explore' }} />
      <Tabs.Screen name="ToolsTab" component={ToolsScreen} options={{ title: 'Tools' }} />
      <Tabs.Screen name="ProjectsTab" component={ProjectsScreen} options={{ title: 'Projects' }} />
      <Tabs.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'You' }} />
    </Tabs.Navigator>
  );
}

export const RootNavigator: React.FC = () => {
  const { theme, mode } = useTheme();
  const navTheme = {
    ...DefaultTheme,
    dark: mode === 'dark',
    colors: {
      ...DefaultTheme.colors,
      background: theme.bg,
      card: theme.bgElevated,
      text: theme.text,
      primary: theme.accent,
      border: theme.border,
      notification: palette.terracotta,
    },
  };

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
        <Stack.Screen name="Tabs" component={TabsNavigator} />
        <Stack.Screen name="ImageVideo" component={ImageVideoScreen} />
        <Stack.Screen name="FacelessVideo" component={FacelessVideoScreen} />
        <Stack.Screen name="Captions" component={CaptionsScreen} />
        <Stack.Screen name="Dub" component={DubScreen} />
        <Stack.Screen name="Voiceover" component={VoiceoverScreen} />
        <Stack.Screen name="VideoMusic" component={VideoMusicScreen} />
        <Stack.Screen name="Audio" component={AudioScreen} />
        <Stack.Screen name="LongFormAudio" component={LongFormAudioScreen} />
        <Stack.Screen name="SoundEffects" component={SoundEffectsScreen} />
        <Stack.Screen name="VoiceChanger" component={VoiceChangerScreen} />
        <Stack.Screen name="VoiceIsolator" component={VoiceIsolatorScreen} />
        <Stack.Screen name="Transcribe" component={TranscribeScreen} />
        <Stack.Screen name="MusicSong" component={MusicSongScreen} />
        <Stack.Screen name="VoiceDesign" component={VoiceDesignScreen} />
        <Stack.Screen name="VoiceAgent" component={VoiceAgentScreen} />
        <Stack.Screen name="AudioNative" component={AudioNativeScreen} />
        <Stack.Screen name="VoiceLibrary" component={VoiceLibraryScreen} />
        <Stack.Screen name="AIAvatar" component={AIAvatarScreen} />
        <Stack.Screen name="VideoTranslate" component={VideoTranslateScreen} />
        <Stack.Screen name="LipSync" component={LipSyncScreen} />
        <Stack.Screen name="VideoExtend" component={VideoExtendScreen} />
        <Stack.Screen name="BackgroundRemove" component={BackgroundRemoveScreen} />
        <Stack.Screen name="Inpaint" component={InpaintScreen} />
        <Stack.Screen name="Pikaffect" component={PikaffectScreen} />
        <Stack.Screen name="Storyboard" component={StoryboardScreen} />
        <Stack.Screen name="ImageGen" component={ImageGenScreen} />
        <Stack.Screen name="Generation" component={GenerationScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
        <Stack.Screen name="VoicePicker" component={VoicePickerScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="LanguagePicker" component={LanguagePickerScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
