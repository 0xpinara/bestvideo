import { Language, Voice } from './types';

export const VOICES: Voice[] = [
  { id: 'v_rachel', name: 'Rachel', accent: 'American', gender: 'female', tags: ['narration', 'warm'], flag: 'US' },
  { id: 'v_adam', name: 'Adam', accent: 'American', gender: 'male', tags: ['deep', 'cinematic'], flag: 'US' },
  { id: 'v_elli', name: 'Elli', accent: 'American', gender: 'female', tags: ['young', 'energetic'], flag: 'US' },
  { id: 'v_charlie', name: 'Charlie', accent: 'British', gender: 'male', tags: ['casual', 'friendly'], flag: 'GB' },
  { id: 'v_dorothy', name: 'Dorothy', accent: 'British', gender: 'female', tags: ['storybook', 'gentle'], flag: 'GB' },
  { id: 'v_emil', name: 'Emil', accent: 'Swedish', gender: 'male', tags: ['calm', 'documentary'], flag: 'SE' },
  { id: 'v_mei', name: 'Mei', accent: 'Mandarin', gender: 'female', tags: ['bright', 'expressive'], flag: 'CN' },
  { id: 'v_haruto', name: 'Haruto', accent: 'Japanese', gender: 'male', tags: ['anime', 'thoughtful'], flag: 'JP' },
  { id: 'v_lucia', name: 'Lucía', accent: 'Spanish', gender: 'female', tags: ['warm', 'natural'], flag: 'ES' },
  { id: 'v_mateo', name: 'Mateo', accent: 'Spanish', gender: 'male', tags: ['confident', 'crisp'], flag: 'MX' },
  { id: 'v_amelie', name: 'Amélie', accent: 'French', gender: 'female', tags: ['poetic', 'soft'], flag: 'FR' },
  { id: 'v_lukas', name: 'Lukas', accent: 'German', gender: 'male', tags: ['neutral', 'broadcast'], flag: 'DE' },
];

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: 'US' },
  { code: 'es', name: 'Spanish', flag: 'ES' },
  { code: 'fr', name: 'French', flag: 'FR' },
  { code: 'de', name: 'German', flag: 'DE' },
  { code: 'it', name: 'Italian', flag: 'IT' },
  { code: 'pt', name: 'Portuguese', flag: 'PT' },
  { code: 'nl', name: 'Dutch', flag: 'NL' },
  { code: 'pl', name: 'Polish', flag: 'PL' },
  { code: 'ru', name: 'Russian', flag: 'RU' },
  { code: 'ja', name: 'Japanese', flag: 'JP' },
  { code: 'zh', name: 'Chinese', flag: 'CN' },
  { code: 'ko', name: 'Korean', flag: 'KR' },
  { code: 'hi', name: 'Hindi', flag: 'IN' },
  { code: 'ar', name: 'Arabic', flag: 'SA' },
  { code: 'tr', name: 'Turkish', flag: 'TR' },
  { code: 'sv', name: 'Swedish', flag: 'SE' },
  { code: 'da', name: 'Danish', flag: 'DK' },
  { code: 'no', name: 'Norwegian', flag: 'NO' },
  { code: 'fi', name: 'Finnish', flag: 'FI' },
  { code: 'cs', name: 'Czech', flag: 'CZ' },
  { code: 'el', name: 'Greek', flag: 'GR' },
  { code: 'he', name: 'Hebrew', flag: 'IL' },
  { code: 'id', name: 'Indonesian', flag: 'ID' },
  { code: 'th', name: 'Thai', flag: 'TH' },
  { code: 'uk', name: 'Ukrainian', flag: 'UA' },
  { code: 'vi', name: 'Vietnamese', flag: 'VN' },
  { code: 'ro', name: 'Romanian', flag: 'RO' },
  { code: 'hu', name: 'Hungarian', flag: 'HU' },
  { code: 'ms', name: 'Malay', flag: 'MY' },
  { code: 'fil', name: 'Filipino', flag: 'PH' },
];

export const VIDEO_MODELS = [
  { id: 'veo-3.1-lite', name: 'Veo 3.1 Lite', credits: 4, blurb: 'Fast & cheap, great for drafts' },
  { id: 'veo-3.1-pro', name: 'Veo 3.1 Pro', credits: 22, blurb: 'Cinematic 1080p with sync audio' },
  { id: 'sora-1', name: 'Sora 1', credits: 18, blurb: 'Long, coherent shots' },
  { id: 'runway-gen3', name: 'Runway Gen 3', credits: 12, blurb: 'Stylized motion control' },
  { id: 'kling-1.6', name: 'Kling 1.6', credits: 10, blurb: 'Smooth physics & faces' },
] as const;

export const IMAGE_MODELS = [
  { id: 'flux-1.1-pro', name: 'Flux 1.1 Pro', credits: 2, blurb: 'Photo-real & adherence' },
  { id: 'imagen-3', name: 'Imagen 3', credits: 2, blurb: 'Crisp typography & faces' },
  { id: 'sd-3.5', name: 'Stable Diffusion 3.5', credits: 1, blurb: 'Open & flexible' },
] as const;

export const ASPECT_OPTIONS = ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9'] as const;
export const RESOLUTION_OPTIONS = ['480p', '720p', '1080p', '4K'] as const;
export const DURATION_OPTIONS = [4, 6, 8, 10, 12] as const;
export const COUNT_OPTIONS = [1, 2, 3, 4] as const;

export const PROMPT_SUGGESTIONS: { label: string; icon: string }[] = [
  { label: 'Surreal Landscape', icon: 'leaf-outline' },
  { label: 'Steampunk City', icon: 'cog-outline' },
  { label: 'Enchanted Forest', icon: 'sparkles-outline' },
  { label: 'Tokyo Neon Night', icon: 'planet-outline' },
  { label: 'Cosy Café Window', icon: 'cafe-outline' },
  { label: 'Ghibli Sky Castle', icon: 'cloud-outline' },
];

export const MUSIC_GENRES = [
  'Cinematic',
  'Lo-fi',
  'Electronic',
  'Acoustic',
  'Orchestral',
  'Jazz',
  'Ambient',
  'Folk',
  'Hip Hop',
  'Indie Rock',
];

export const MUSIC_MOODS = [
  'Uplifting',
  'Calm',
  'Dramatic',
  'Mysterious',
  'Playful',
  'Melancholic',
  'Triumphant',
  'Romantic',
  'Tense',
  'Dreamy',
];

export const INSTRUMENTS = [
  'Piano',
  'Strings',
  'Synth Pad',
  'Acoustic Guitar',
  'Bass',
  'Drums',
  'Woodwinds',
  'Brass',
  'Choir',
  'Bells',
];

// Sound effects prompt suggestions (text-to-SFX)
export const SFX_PRESETS = [
  'Rain on a tin roof, soft thunder rumble',
  'Sword unsheathing, metallic ring',
  'Forest at dawn, birds and breeze',
  'Sci-fi spaceship engine hum',
  'Glass shattering on tile floor',
  'Crowd cheering in a stadium',
  'Vinyl crackle and warm static',
  'Coffee shop ambience with espresso machine',
];

// AI music genre/style tags (Suno-compatible)
export const MUSIC_STYLE_TAGS = [
  'pop', 'rock', 'hip hop', 'lo-fi', 'electronic', 'house', 'techno', 'jazz',
  'classical', 'cinematic', 'orchestral', 'indie', 'folk', 'country', 'metal',
  'reggae', 'r&b', 'soul', 'funk', 'disco', 'ambient', 'chillout', 'edm',
  'trap', 'drill', 'k-pop', 'j-pop', 'latin', 'reggaeton', 'salsa',
  'female vocals', 'male vocals', 'duet', 'choir', 'a cappella',
  'upbeat', 'melancholic', 'energetic', 'calm', 'romantic',
];

// AI avatar backgrounds
export const AVATAR_BACKGROUNDS = [
  { id: 'studio', label: 'Studio', tint: '#F2E8D8' },
  { id: 'office', label: 'Office', tint: '#E4F2F7' },
  { id: 'cafe', label: 'Cafe', tint: '#FCEADD' },
  { id: 'garden', label: 'Garden', tint: '#E6F0DC' },
  { id: 'transparent', label: 'Transparent', tint: '#EEE7F7' },
] as const;

// Pikaffects (Pika Labs style one-tap effects)
export const PIKAFFECTS = [
  { id: 'melt', label: 'Melt', icon: 'water-outline' },
  { id: 'crush', label: 'Crush', icon: 'hand-left-outline' },
  { id: 'explode', label: 'Explode', icon: 'flash-outline' },
  { id: 'inflate', label: 'Inflate', icon: 'balloon-outline' },
  { id: 'levitate', label: 'Levitate', icon: 'arrow-up-outline' },
  { id: 'paint', label: 'Paint', icon: 'color-palette-outline' },
  { id: 'cake-ify', label: 'Cake-ify', icon: 'cafe-outline' },
  { id: 'crystallize', label: 'Crystallize', icon: 'diamond-outline' },
  { id: 'glow', label: 'Glow', icon: 'sunny-outline' },
] as const;

// Voice design accents
export const VOICE_DESIGN_ACCENTS = [
  'American', 'British', 'Australian', 'Irish', 'Scottish', 'South African',
  'Canadian', 'Indian', 'Nigerian', 'Jamaican', 'French', 'German',
  'Italian', 'Spanish', 'Mexican', 'Brazilian', 'Russian', 'Japanese',
  'Korean', 'Chinese', 'Arabic', 'Turkish', 'Swedish', 'Dutch',
];

// Image gen model catalog (separate from video models)
export const IMAGE_GEN_MODELS = [
  { id: 'flux-1.1-pro', name: 'Flux 1.1 Pro', credits: 2, blurb: 'Photo-real, sharp typography' },
  { id: 'imagen-3', name: 'Imagen 3', credits: 2, blurb: 'Best faces & text rendering' },
  { id: 'sd-3.5', name: 'Stable Diffusion 3.5', credits: 1, blurb: 'Open & flexible' },
  { id: 'midjourney-7', name: 'Midjourney v7', credits: 4, blurb: 'Art direction, painterly look' },
] as const;

// Music generation models
export const MUSIC_SONG_MODELS = [
  { id: 'eleven-music-v1', name: 'Eleven Music v1', credits: 8, blurb: 'Studio-grade, licensed training data' },
  { id: 'suno-v5.5', name: 'Suno v5.5', credits: 6, blurb: 'Fast, catchy, great vocals' },
  { id: 'udio-v1.5', name: 'Udio v1.5', credits: 7, blurb: 'Cleaner mixes, longer pieces' },
] as const;
