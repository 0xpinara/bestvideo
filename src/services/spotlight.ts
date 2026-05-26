/**
 * In-app SEO via iOS Spotlight + Android App Indexing.
 *
 * Every project + every tool registers a searchable item so users can find
 * your app from the system search bar — Apple and Google count this as a
 * very strong relevance signal that boosts your store ranking for those
 * keywords. It also creates a powerful re-engagement loop.
 *
 * Wire this up with the optional native modules:
 *   - iOS:     react-native-spotlight-search
 *   - Android: react-native-app-indexing
 *
 * Out of the box we expose the same `indexProject` API so the rest of the
 * app can fire-and-forget; native bridges can be added later without
 * touching the call sites.
 */

import type { Project } from './types';

type SearchableItem = {
  uniqueIdentifier: string;
  domain: string;
  title: string;
  contentDescription: string;
  thumbnailUri?: string;
  keywords: string[];
  url: string;
};

const Spotlight: { addItems?: (items: SearchableItem[]) => Promise<void>; deleteItem?: (id: string) => Promise<void> } = (() => {
  try {
    // Lazy-require so the JS bundle works even if the native module isn't installed.
    // Install with `npx expo install react-native-spotlight-search` to enable.
    return require('react-native-spotlight-search');
  } catch {
    return {};
  }
})();

const FEATURE_INDEXABLES: SearchableItem[] = [
  {
    uniqueIdentifier: 'feature.ai-video-maker',
    domain: 'features',
    title: 'AI Video Maker',
    contentDescription: 'Turn a sentence into a finished cinematic video',
    keywords: ['ai video', 'text to video', 'video generator', 'video maker', 'ai', 'sora', 'veo'],
    url: 'https://lumenstudio.app/ai-video-maker',
  },
  {
    uniqueIdentifier: 'feature.faceless-video-maker',
    domain: 'features',
    title: 'Faceless Video Maker',
    contentDescription: 'Generate narrated faceless videos with B-roll and captions',
    keywords: ['faceless video', 'youtube shorts', 'tiktok', 'reels', 'narration'],
    url: 'https://lumenstudio.app/faceless-video-maker',
  },
  {
    uniqueIdentifier: 'feature.auto-captions',
    domain: 'features',
    title: 'Auto Captions',
    contentDescription: 'Auto-transcribe and stylise captions in 30+ languages',
    keywords: ['captions', 'subtitles', 'transcribe', 'kinetic', 'karaoke'],
    url: 'https://lumenstudio.app/auto-captions',
  },
  {
    uniqueIdentifier: 'feature.ai-dubbing',
    domain: 'features',
    title: 'AI Dubbing',
    contentDescription: 'Translate video into 30+ languages while preserving voice',
    keywords: ['dub', 'dubbing', 'translate video', 'voice cloning', 'lip sync'],
    url: 'https://lumenstudio.app/ai-dubbing',
  },
  {
    uniqueIdentifier: 'feature.ai-voiceover',
    domain: 'features',
    title: 'AI Voiceover',
    contentDescription: 'Drop precise multi-segment narration onto any video',
    keywords: ['voiceover', 'narration', 'voice over', 'voice acting'],
    url: 'https://lumenstudio.app/ai-voiceover',
  },
  {
    uniqueIdentifier: 'feature.video-to-music',
    domain: 'features',
    title: 'Video to Music',
    contentDescription: 'Auto-score your video by mood, genre and intensity',
    keywords: ['music', 'score', 'soundtrack', 'instrumental'],
    url: 'https://lumenstudio.app/video-to-music',
  },
  {
    uniqueIdentifier: 'feature.ai-voice-generator',
    domain: 'features',
    title: 'AI Voice Generator',
    contentDescription: 'Studio-grade text to speech with 12+ voices',
    keywords: ['text to speech', 'tts', 'voice generator', 'ai voice'],
    url: 'https://lumenstudio.app/ai-voice-generator',
  },
  {
    uniqueIdentifier: 'feature.podcast-generator',
    domain: 'features',
    title: 'Podcast Generator',
    contentDescription: 'Multi-speaker long-form audio for podcasts and dialogues',
    keywords: ['podcast', 'audiobook', 'dialogue', 'multi speaker'],
    url: 'https://lumenstudio.app/podcast-generator',
  },
  {
    uniqueIdentifier: 'feature.sound-effects',
    domain: 'features',
    title: 'Sound Effects Generator',
    contentDescription: 'Cinematic sound effects from text descriptions',
    keywords: ['sfx', 'sound effects', 'foley', 'ambience'],
    url: 'https://lumenstudio.app/sound-effects-generator',
  },
  {
    uniqueIdentifier: 'feature.voice-changer',
    domain: 'features',
    title: 'Voice Changer',
    contentDescription: 'Speech-to-speech voice replacement',
    keywords: ['voice changer', 'speech to speech', 'voice swap'],
    url: 'https://lumenstudio.app/voice-changer',
  },
  {
    uniqueIdentifier: 'feature.voice-isolator',
    domain: 'features',
    title: 'Voice Isolator',
    contentDescription: 'Separate vocals from background noise',
    keywords: ['voice isolator', 'noise removal', 'stem separation'],
    url: 'https://lumenstudio.app/voice-isolator',
  },
  {
    uniqueIdentifier: 'feature.transcribe',
    domain: 'features',
    title: 'Transcribe (Speech to Text)',
    contentDescription: 'Studio-grade speech recognition in 90+ languages',
    keywords: ['transcribe', 'speech to text', 'subtitles', 'srt'],
    url: 'https://lumenstudio.app/speech-to-text',
  },
  {
    uniqueIdentifier: 'feature.music-generator',
    domain: 'features',
    title: 'AI Music Generator',
    contentDescription: 'Full songs with vocals from a text prompt',
    keywords: ['ai music', 'song generator', 'suno', 'udio', 'text to song'],
    url: 'https://lumenstudio.app/ai-music-generator',
  },
  {
    uniqueIdentifier: 'feature.voice-design',
    domain: 'features',
    title: 'Voice Design',
    contentDescription: 'Invent new AI voices from a text description',
    keywords: ['voice design', 'text to voice', 'voice generator'],
    url: 'https://lumenstudio.app/voice-design',
  },
  {
    uniqueIdentifier: 'feature.voice-agent',
    domain: 'features',
    title: 'Voice Agents',
    contentDescription: 'Conversational AI you can call or embed',
    keywords: ['voice agent', 'chatbot', 'conversational ai'],
    url: 'https://lumenstudio.app/voice-agent',
  },
  {
    uniqueIdentifier: 'feature.audio-native',
    domain: 'features',
    title: 'Audio Native',
    contentDescription: 'Embeddable audio player that narrates any article',
    keywords: ['audio native', 'article to audio', 'narration', 'embed'],
    url: 'https://lumenstudio.app/audio-native',
  },
  {
    uniqueIdentifier: 'feature.voice-library',
    domain: 'features',
    title: 'Voice Library',
    contentDescription: 'Browse 1000s of community and designed voices',
    keywords: ['voice library', 'community voices', 'voices'],
    url: 'https://lumenstudio.app/voice-library',
  },
  {
    uniqueIdentifier: 'feature.ai-avatar',
    domain: 'features',
    title: 'AI Avatar',
    contentDescription: 'Photo-real talking-head video from a photo and script',
    keywords: ['ai avatar', 'talking head', 'heygen', 'synthesia'],
    url: 'https://lumenstudio.app/ai-avatar',
  },
  {
    uniqueIdentifier: 'feature.video-translate',
    domain: 'features',
    title: 'Translate Video',
    contentDescription: 'Translate any video with lip-sync and cloned voice',
    keywords: ['translate video', 'video dubbing', 'lip sync', 'localisation'],
    url: 'https://lumenstudio.app/translate-video',
  },
  {
    uniqueIdentifier: 'feature.lip-sync',
    domain: 'features',
    title: 'Lip Sync',
    contentDescription: 'Drive a face video with replacement audio',
    keywords: ['lip sync', 'lipsync', 'face sync'],
    url: 'https://lumenstudio.app/lip-sync',
  },
  {
    uniqueIdentifier: 'feature.video-extend',
    domain: 'features',
    title: 'Extend Video',
    contentDescription: 'Continue any clip naturally for several seconds',
    keywords: ['extend video', 'video continuation', 'loop video'],
    url: 'https://lumenstudio.app/extend-video',
  },
  {
    uniqueIdentifier: 'feature.background-remove',
    domain: 'features',
    title: 'Background Remover',
    contentDescription: 'Cut your subject out of any video, transparent or greenscreen',
    keywords: ['background remover', 'green screen', 'rotoscope'],
    url: 'https://lumenstudio.app/background-remover',
  },
  {
    uniqueIdentifier: 'feature.inpaint',
    domain: 'features',
    title: 'Inpaint Video',
    contentDescription: 'Remove or replace anything in a video',
    keywords: ['inpaint', 'remove object', 'video edit'],
    url: 'https://lumenstudio.app/inpaint-video',
  },
  {
    uniqueIdentifier: 'feature.pikaffect',
    domain: 'features',
    title: 'Video Effects',
    contentDescription: 'One-tap viral effects: melt, crush, explode, glow',
    keywords: ['video effects', 'pikaffects', 'viral effects'],
    url: 'https://lumenstudio.app/video-effects',
  },
  {
    uniqueIdentifier: 'feature.storyboard',
    domain: 'features',
    title: 'Storyboard',
    contentDescription: 'Multi-shot consistent scenes for film and ads',
    keywords: ['storyboard', 'multi shot', 'scene planner'],
    url: 'https://lumenstudio.app/storyboard',
  },
  {
    uniqueIdentifier: 'feature.image-gen',
    domain: 'features',
    title: 'AI Image Generator',
    contentDescription: 'Flux, Imagen 3, Stable Diffusion, Midjourney v7 in one app',
    keywords: ['ai image', 'midjourney', 'flux', 'imagen', 'stable diffusion'],
    url: 'https://lumenstudio.app/ai-image-generator',
  },
];

/**
 * Register every feature page as searchable. Call once at app launch.
 */
export async function indexFeatures(): Promise<void> {
  if (!Spotlight.addItems) return;
  try {
    await Spotlight.addItems(FEATURE_INDEXABLES);
  } catch {
    // Spotlight indexing is best-effort.
  }
}

/**
 * Register a finished project as searchable so users can re-open it from
 * iOS Spotlight or the Android app search bar.
 */
export async function indexProject(p: Project): Promise<void> {
  if (!Spotlight.addItems) return;
  try {
    await Spotlight.addItems([
      {
        uniqueIdentifier: `project.${p.id}`,
        domain: 'projects',
        title: p.title,
        contentDescription: `${kindLabel(p.kind)} · Lumen Studio`,
        thumbnailUri: p.thumbUri,
        keywords: [kindLabel(p.kind), 'lumen', 'project', ...p.title.toLowerCase().split(/\s+/)],
        url: `https://lumenstudio.app/project/${p.id}`,
      },
    ]);
  } catch {}
}

export async function removeProjectIndex(id: string): Promise<void> {
  if (!Spotlight.deleteItem) return;
  try {
    await Spotlight.deleteItem(`project.${id}`);
  } catch {}
}

function kindLabel(k: Project['kind']): string {
  switch (k) {
    case 'image_video': return 'AI Video';
    case 'faceless_video': return 'Faceless Video';
    case 'captions': return 'Captions';
    case 'dub': return 'Dub';
    case 'voiceover': return 'Voiceover';
    case 'video_music': return 'Score';
    case 'audio': return 'AI Voice';
    case 'long_form_audio': return 'Podcast';
    case 'sound_effects': return 'Sound Effects';
    case 'voice_changer': return 'Voice Changer';
    case 'voice_isolator': return 'Voice Isolator';
    case 'transcribe': return 'Transcript';
    case 'music_song': return 'AI Song';
    case 'voice_design': return 'Designed Voice';
    case 'voice_agent': return 'Voice Agent';
    case 'audio_native': return 'Audio Native';
    case 'ai_avatar': return 'AI Avatar';
    case 'video_translate': return 'Translated Video';
    case 'lip_sync': return 'Lip Sync';
    case 'video_extend': return 'Extended Video';
    case 'background_remove': return 'Background Removed';
    case 'inpaint': return 'Inpainted';
    case 'pikaffect': return 'Effect';
    case 'storyboard': return 'Storyboard';
    case 'image_gen': return 'AI Image';
  }
}
