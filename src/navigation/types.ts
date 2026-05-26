import { NavigatorScreenParams } from '@react-navigation/native';

export type TabsParamList = {
  StudioTab: undefined;
  ImageVideoTab: undefined;
  ToolsTab: undefined;
  ProjectsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  ImageVideo: undefined;
  FacelessVideo: undefined;
  Captions: undefined;
  Dub: undefined;
  Voiceover: undefined;
  VideoMusic: undefined;
  Audio: undefined;
  LongFormAudio: undefined;
  // New ElevenLabs feature surface
  SoundEffects: undefined;
  VoiceChanger: undefined;
  VoiceIsolator: undefined;
  Transcribe: undefined;
  MusicSong: undefined;
  VoiceDesign: undefined;
  VoiceAgent: undefined;
  AudioNative: undefined;
  VoiceLibrary: undefined;
  // New video/image features
  AIAvatar: undefined;
  VideoTranslate: undefined;
  LipSync: undefined;
  VideoExtend: undefined;
  BackgroundRemove: undefined;
  Inpaint: undefined;
  Pikaffect: undefined;
  Storyboard: undefined;
  ImageGen: undefined;
  // Existing
  Generation: { projectId: string };
  ProjectDetail: { projectId: string };
  VoicePicker: { selectedId?: string; onPick: (id: string) => void; title?: string };
  LanguagePicker: { selectedCode?: string; onPick: (code: string) => void; title?: string };
  Settings: undefined;
};
