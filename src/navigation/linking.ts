import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';
import { APP_URL, MARKETING_URL } from '../config/urls';
import type { RootStackParamList } from './types';

/**
 * Universal Links + App Links deep-link configuration.
 *
 * Tool URLs live on the app subdomain (e.g. app.makefacelessvideos.com/ai-video-maker).
 * Marketing pages and articles stay on the main domain for SEO.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    Linking.createURL('/'),
    APP_URL.replace(/\/$/, ''),
    MARKETING_URL.replace(/\/$/, ''),
    'https://www.makefacelessvideos.com',
    'mfv://',
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
