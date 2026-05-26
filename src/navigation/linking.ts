import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

/**
 * Universal Links + App Links deep-link configuration.
 *
 * URLs like https://lumenstudio.app/ai-video-maker open the in-app creator
 * the same way the marketing page advertises. This is what Apple and
 * Google reward in app search — verified deep links boost both store and
 * web rankings for the destination keywords.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    Linking.createURL('/'),
    'https://lumenstudio.app',
    'https://www.lumenstudio.app',
    'lumen://',
  ],
  config: {
    screens: {
      Tabs: {
        screens: {
          StudioTab: '',
          ImageVideoTab: 'explore',
          ToolsTab: 'tools',
          ProjectsTab: 'projects',
          ProfileTab: 'you',
        },
      },
      ImageVideo: 'ai-video-maker',
      FacelessVideo: 'faceless-video-maker',
      Captions: 'auto-captions',
      Dub: 'ai-dubbing',
      Voiceover: 'ai-voiceover',
      VideoMusic: 'video-to-music',
      Audio: 'ai-voice-generator',
      LongFormAudio: 'podcast-generator',
      SoundEffects: 'sound-effects-generator',
      VoiceChanger: 'voice-changer',
      VoiceIsolator: 'voice-isolator',
      Transcribe: 'speech-to-text',
      MusicSong: 'ai-music-generator',
      VoiceDesign: 'voice-design',
      VoiceAgent: 'voice-agent',
      AudioNative: 'audio-native',
      VoiceLibrary: 'voice-library',
      AIAvatar: 'ai-avatar',
      VideoTranslate: 'translate-video',
      LipSync: 'lip-sync',
      VideoExtend: 'extend-video',
      BackgroundRemove: 'background-remover',
      Inpaint: 'inpaint-video',
      Pikaffect: 'video-effects',
      Storyboard: 'storyboard',
      ImageGen: 'ai-image-generator',
      ProjectDetail: 'project/:projectId',
      Generation: 'generating/:projectId',
      Settings: 'settings',
      VoicePicker: 'voices',
      LanguagePicker: 'languages',
    },
  },
};
