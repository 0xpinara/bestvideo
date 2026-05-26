/**
 * Domain types that mirror the ElevenLabs Studio / Image+Video surface area.
 */

export type ProjectKind =
  | 'image_video'
  | 'faceless_video'
  | 'captions'
  | 'dub'
  | 'voiceover'
  | 'video_music'
  | 'audio'
  | 'long_form_audio'
  // ElevenLabs surface
  | 'sound_effects'
  | 'voice_changer'
  | 'voice_isolator'
  | 'transcribe'
  | 'music_song'
  | 'voice_design'
  | 'voice_agent'
  | 'audio_native'
  // Video generation (HeyGen / Runway / Pika / Luma)
  | 'ai_avatar'
  | 'video_translate'
  | 'lip_sync'
  | 'video_extend'
  | 'background_remove'
  | 'inpaint'
  | 'pikaffect'
  | 'storyboard'
  | 'image_gen';

export type ProjectStatus = 'draft' | 'queued' | 'generating' | 'ready' | 'failed';

export type Modality = 'image' | 'video' | 'audio';

export type VideoModel =
  | 'veo-3.1-lite'
  | 'veo-3.1-pro'
  | 'sora-1'
  | 'runway-gen3'
  | 'kling-1.6';

export type ImageModel = 'flux-1.1-pro' | 'imagen-3' | 'sd-3.5';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | '21:9';
export type Resolution = '480p' | '720p' | '1080p' | '4K';
export type DurationSec = 4 | 6 | 8 | 10 | 12;
export type AudioMode = 'off' | 'ambient' | 'music' | 'dialog';

export type Voice = {
  id: string;
  name: string;
  accent: string;
  gender: 'female' | 'male' | 'neutral';
  tags: string[];
  preview?: string;
  flag?: string;
};

export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type ScriptTurn = {
  id: string;
  speaker: string;
  voiceId: string;
  text: string;
};

export type ImageVideoSettings = {
  modality: Modality;
  prompt: string;
  model: VideoModel | ImageModel;
  aspect: AspectRatio;
  duration: DurationSec;
  resolution: Resolution;
  audio: AudioMode;
  audioOn: boolean;
  seed: number | null;
  count: number;
  startFrameUri?: string;
  endFrameUri?: string;
};

export type FacelessVideoSettings = {
  prompt: string;
  script: string;
  voiceId: string;
  brollStyle: 'cinematic' | 'animated' | 'documentary' | 'ghibli';
  captionStyle: 'minimal' | 'bold' | 'subtle' | 'kinetic';
  language: string;
  aspect: AspectRatio;
  music: boolean;
};

export type CaptionsSettings = {
  videoUri?: string;
  language: string;
  style: 'minimal' | 'bold' | 'subtle' | 'kinetic' | 'karaoke';
  fontSize: 'sm' | 'md' | 'lg';
  position: 'top' | 'middle' | 'bottom';
  highlight: string;
  emojis: boolean;
};

export type DubSettings = {
  videoUri?: string;
  source: string;
  target: string;
  voiceCloning: boolean;
  preserveBackground: boolean;
  lipSync: boolean;
  numSpeakers: number;
};

export type VoiceoverSegment = {
  id: string;
  startSec: number;
  endSec: number;
  text: string;
  voiceId: string;
};

export type VoiceoverSettings = {
  videoUri?: string;
  segments: VoiceoverSegment[];
  removeOriginalAudio: boolean;
  duckMusic: boolean;
};

export type VideoMusicSettings = {
  videoUri?: string;
  genre: string;
  mood: string;
  intensity: 'low' | 'medium' | 'high';
  instrumentation: string[];
};

export type AudioSettings = {
  voiceId: string;
  text: string;
  stability: number;
  similarity: number;
  styleExaggeration: number;
  speakerBoost: boolean;
};

export type LongFormAudioSettings = {
  title: string;
  turns: ScriptTurn[];
};

export type SoundEffectsSettings = {
  prompt: string;
  durationSec: number;
  promptInfluence: number;
  loop: boolean;
};

export type VoiceChangerSettings = {
  inputUri?: string;
  targetVoiceId: string;
  preserveStyle: number;
  removeBackgroundNoise: boolean;
};

export type VoiceIsolatorSettings = {
  inputUri?: string;
  mode: 'vocals' | 'instrumental' | 'cleanup';
  aggressiveness: number;
};

export type TranscribeSettings = {
  inputUri?: string;
  language: string;
  diarize: boolean;
  punctuation: boolean;
  timestamps: 'word' | 'sentence' | 'none';
  format: 'txt' | 'srt' | 'vtt' | 'json';
};

export type MusicSongSettings = {
  prompt: string;
  styleTags: string[];
  instrumental: boolean;
  lyrics: string;
  customLyrics: boolean;
  durationSec: number;
  model: 'eleven-music-v1' | 'suno-v5.5' | 'udio-v1.5';
};

export type VoiceDesignSettings = {
  prompt: string;
  gender: 'female' | 'male' | 'neutral';
  age: 'child' | 'young' | 'middle' | 'senior';
  accent: string;
  pace: number;
  pitch: number;
  textPreview: string;
};

export type VoiceAgentSettings = {
  name: string;
  systemPrompt: string;
  voiceId: string;
  greeting: string;
  knowledgeBase: string;
  temperature: number;
  ttsModel: 'eleven_v3' | 'eleven_multilingual_v2';
};

export type AudioNativeSettings = {
  articleUrl: string;
  voiceId: string;
  embedColor: string;
  autoPlay: boolean;
};

export type AvatarSettings = {
  photoUri?: string;
  script: string;
  voiceId: string;
  background: 'studio' | 'office' | 'cafe' | 'garden' | 'transparent';
  motion: 'still' | 'subtle' | 'expressive';
  aspect: AspectRatio;
  language: string;
};

export type VideoTranslateSettings = {
  videoUri?: string;
  source: string;
  target: string;
  lipSync: boolean;
  preserveVoice: boolean;
  enhanceSpeech: boolean;
};

export type LipSyncSettings = {
  videoUri?: string;
  audioUri?: string;
  mode: 'precision' | 'speed';
  enhanceSpeech: boolean;
  enableCaption: boolean;
};

export type VideoExtendSettings = {
  videoUri?: string;
  prompt: string;
  extraSeconds: number;
  loop: boolean;
};

export type BackgroundRemoveSettings = {
  videoUri?: string;
  output: 'green' | 'transparent' | 'replace';
  replacementPrompt: string;
  edgeFeather: number;
};

export type InpaintSettings = {
  videoUri?: string;
  mode: 'remove' | 'replace' | 'restyle';
  prompt: string;
  brushSize: number;
};

export type PikaffectSettings = {
  videoUri?: string;
  effect:
    | 'melt'
    | 'crush'
    | 'explode'
    | 'inflate'
    | 'levitate'
    | 'paint'
    | 'cake-ify'
    | 'crystallize'
    | 'glow';
  intensity: number;
};

export type StoryboardSettings = {
  title: string;
  shots: { id: string; prompt: string; durationSec: number; aspect: AspectRatio }[];
  consistencyReferenceUri?: string;
};

export type ImageGenSettings = {
  prompt: string;
  model: 'flux-1.1-pro' | 'imagen-3' | 'sd-3.5' | 'midjourney-7';
  aspect: AspectRatio;
  count: number;
  styleReferenceUri?: string;
  characterReferenceUri?: string;
  seed: number | null;
};

export type AnySettings =
  | { kind: 'image_video'; settings: ImageVideoSettings }
  | { kind: 'faceless_video'; settings: FacelessVideoSettings }
  | { kind: 'captions'; settings: CaptionsSettings }
  | { kind: 'dub'; settings: DubSettings }
  | { kind: 'voiceover'; settings: VoiceoverSettings }
  | { kind: 'video_music'; settings: VideoMusicSettings }
  | { kind: 'audio'; settings: AudioSettings }
  | { kind: 'long_form_audio'; settings: LongFormAudioSettings }
  | { kind: 'sound_effects'; settings: SoundEffectsSettings }
  | { kind: 'voice_changer'; settings: VoiceChangerSettings }
  | { kind: 'voice_isolator'; settings: VoiceIsolatorSettings }
  | { kind: 'transcribe'; settings: TranscribeSettings }
  | { kind: 'music_song'; settings: MusicSongSettings }
  | { kind: 'voice_design'; settings: VoiceDesignSettings }
  | { kind: 'voice_agent'; settings: VoiceAgentSettings }
  | { kind: 'audio_native'; settings: AudioNativeSettings }
  | { kind: 'ai_avatar'; settings: AvatarSettings }
  | { kind: 'video_translate'; settings: VideoTranslateSettings }
  | { kind: 'lip_sync'; settings: LipSyncSettings }
  | { kind: 'video_extend'; settings: VideoExtendSettings }
  | { kind: 'background_remove'; settings: BackgroundRemoveSettings }
  | { kind: 'inpaint'; settings: InpaintSettings }
  | { kind: 'pikaffect'; settings: PikaffectSettings }
  | { kind: 'storyboard'; settings: StoryboardSettings }
  | { kind: 'image_gen'; settings: ImageGenSettings };

export type Project = {
  id: string;
  kind: ProjectKind;
  title: string;
  createdAt: number;
  updatedAt: number;
  status: ProjectStatus;
  thumbUri?: string;
  outputUri?: string;
  durationMs?: number;
  settings: AnySettings;
};
