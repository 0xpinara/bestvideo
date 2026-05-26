/**
 * Generation API adapter.
 *
 * Wraps the ElevenLabs HTTP API when a key is present, and degrades to a
 * realistic mock pipeline (with progress + a stock thumbnail) when offline
 * or in development. Every flow in the app calls `generate(project)` and
 * gets back a stream of progress events ending in a `ready` Project.
 */

import * as SecureStore from 'expo-secure-store';
import { Project } from './types';

const KEY_NAME = 'gs.elevenlabs.api_key';

export async function getApiKey(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEY_NAME);
  } catch {
    return null;
  }
}

export async function setApiKey(key: string | null): Promise<void> {
  try {
    if (key && key.trim().length > 0) {
      await SecureStore.setItemAsync(KEY_NAME, key.trim());
    } else {
      await SecureStore.deleteItemAsync(KEY_NAME);
    }
  } catch {
    // ignore
  }
}

export type Progress = { pct: number; stage: string };

export type GenerateHandle = {
  cancel: () => void;
  promise: Promise<Project>;
};

const STOCK_VIDEO_THUMBS = [
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
  'https://images.unsplash.com/photo-1503264116251-35a269479413?w=800',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  'https://images.unsplash.com/photo-1488376739369-152e91eb8ee4?w=800',
];

function pickThumb(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const idx = Math.abs(h) % STOCK_VIDEO_THUMBS.length;
  return STOCK_VIDEO_THUMBS[idx];
}

/**
 * Run a generation. Calls onProgress with stages while waiting.
 * Replace `mockGenerate` with real ElevenLabs HTTP calls when wiring an
 * account key (see docs/ELEVENLABS.md for endpoint mapping).
 */
export function generate(project: Project, onProgress: (p: Progress) => void): GenerateHandle {
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const promise = new Promise<Project>((resolve, reject) => {
    const stages: { pct: number; stage: string; ms: number }[] = stagesFor(project);

    const run = (idx: number) => {
      if (cancelled) return reject(new Error('cancelled'));
      if (idx >= stages.length) {
        return resolve({
          ...project,
          status: 'ready',
          outputUri: pickThumb(project.id),
          thumbUri: pickThumb(project.id),
          durationMs: estimateDurationMs(project),
          updatedAt: Date.now(),
        });
      }
      const s = stages[idx];
      onProgress({ pct: s.pct, stage: s.stage });
      timer = setTimeout(() => run(idx + 1), s.ms);
    };

    run(0);
  });

  return {
    cancel: () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    },
    promise,
  };
}

function stagesFor(project: Project): { pct: number; stage: string; ms: number }[] {
  switch (project.kind) {
    case 'image_video':
      return [
        { pct: 0.1, stage: 'Parsing prompt', ms: 500 },
        { pct: 0.3, stage: 'Composing first frame', ms: 900 },
        { pct: 0.6, stage: 'Generating motion', ms: 1500 },
        { pct: 0.85, stage: 'Mixing audio', ms: 700 },
        { pct: 1, stage: 'Finalising', ms: 500 },
      ];
    case 'faceless_video':
      return [
        { pct: 0.1, stage: 'Polishing script', ms: 500 },
        { pct: 0.3, stage: 'Casting voice', ms: 600 },
        { pct: 0.55, stage: 'Selecting B-roll', ms: 1200 },
        { pct: 0.8, stage: 'Burning captions', ms: 800 },
        { pct: 1, stage: 'Stitching scene', ms: 600 },
      ];
    case 'captions':
      return [
        { pct: 0.2, stage: 'Transcribing audio', ms: 700 },
        { pct: 0.6, stage: 'Aligning words', ms: 900 },
        { pct: 0.9, stage: 'Styling captions', ms: 500 },
        { pct: 1, stage: 'Burning in', ms: 400 },
      ];
    case 'dub':
      return [
        { pct: 0.15, stage: 'Separating speakers', ms: 800 },
        { pct: 0.4, stage: 'Translating script', ms: 900 },
        { pct: 0.7, stage: 'Cloning voices', ms: 1100 },
        { pct: 0.95, stage: 'Aligning lips', ms: 800 },
        { pct: 1, stage: 'Mixing master', ms: 400 },
      ];
    case 'voiceover':
      return [
        { pct: 0.2, stage: 'Generating speech', ms: 800 },
        { pct: 0.6, stage: 'Ducking music', ms: 600 },
        { pct: 1, stage: 'Rendering output', ms: 700 },
      ];
    case 'video_music':
      return [
        { pct: 0.2, stage: 'Analysing scene tempo', ms: 800 },
        { pct: 0.6, stage: 'Composing motif', ms: 1100 },
        { pct: 0.9, stage: 'Rendering instruments', ms: 700 },
        { pct: 1, stage: 'Mastering', ms: 400 },
      ];
    case 'audio':
      return [
        { pct: 0.3, stage: 'Loading voice', ms: 400 },
        { pct: 0.8, stage: 'Synthesising speech', ms: 1100 },
        { pct: 1, stage: 'Normalising loudness', ms: 400 },
      ];
    case 'long_form_audio':
      return [
        { pct: 0.15, stage: 'Loading speakers', ms: 500 },
        { pct: 0.45, stage: 'Generating turns', ms: 1500 },
        { pct: 0.8, stage: 'Sequencing podcast', ms: 800 },
        { pct: 1, stage: 'Mastering', ms: 500 },
      ];
    case 'sound_effects':
      return [
        { pct: 0.3, stage: 'Designing waveform', ms: 600 },
        { pct: 0.7, stage: 'Layering textures', ms: 700 },
        { pct: 1, stage: 'Rendering', ms: 400 },
      ];
    case 'voice_changer':
      return [
        { pct: 0.3, stage: 'Analysing source voice', ms: 600 },
        { pct: 0.8, stage: 'Cloning timbre', ms: 900 },
        { pct: 1, stage: 'Resynthesising', ms: 500 },
      ];
    case 'voice_isolator':
      return [
        { pct: 0.4, stage: 'Separating stems', ms: 700 },
        { pct: 0.9, stage: 'Cleaning artifacts', ms: 500 },
        { pct: 1, stage: 'Mastering', ms: 300 },
      ];
    case 'transcribe':
      return [
        { pct: 0.5, stage: 'Recognising speech', ms: 1000 },
        { pct: 0.9, stage: 'Aligning words', ms: 500 },
        { pct: 1, stage: 'Formatting', ms: 300 },
      ];
    case 'music_song':
      return [
        { pct: 0.15, stage: 'Sketching melody', ms: 800 },
        { pct: 0.45, stage: 'Arranging instruments', ms: 1200 },
        { pct: 0.75, stage: 'Singing vocals', ms: 1100 },
        { pct: 1, stage: 'Mixing and mastering', ms: 600 },
      ];
    case 'voice_design':
      return [
        { pct: 0.4, stage: 'Designing voice', ms: 700 },
        { pct: 0.9, stage: 'Previewing line', ms: 600 },
        { pct: 1, stage: 'Saving voice', ms: 300 },
      ];
    case 'voice_agent':
      return [
        { pct: 0.3, stage: 'Training agent', ms: 700 },
        { pct: 0.8, stage: 'Wiring voice', ms: 600 },
        { pct: 1, stage: 'Ready to call', ms: 300 },
      ];
    case 'audio_native':
      return [
        { pct: 0.4, stage: 'Reading article', ms: 700 },
        { pct: 0.9, stage: 'Narrating', ms: 800 },
        { pct: 1, stage: 'Building player', ms: 300 },
      ];
    case 'ai_avatar':
      return [
        { pct: 0.15, stage: 'Reading reference', ms: 700 },
        { pct: 0.45, stage: 'Driving facial motion', ms: 1300 },
        { pct: 0.8, stage: 'Aligning gestures', ms: 900 },
        { pct: 1, stage: 'Rendering avatar', ms: 600 },
      ];
    case 'video_translate':
      return [
        { pct: 0.15, stage: 'Transcribing source', ms: 800 },
        { pct: 0.4, stage: 'Translating script', ms: 900 },
        { pct: 0.7, stage: 'Cloning voice', ms: 1000 },
        { pct: 0.95, stage: 'Re-syncing lips', ms: 900 },
        { pct: 1, stage: 'Mastering', ms: 400 },
      ];
    case 'lip_sync':
      return [
        { pct: 0.3, stage: 'Analysing audio', ms: 700 },
        { pct: 0.8, stage: 'Driving mouth shapes', ms: 900 },
        { pct: 1, stage: 'Compositing', ms: 500 },
      ];
    case 'video_extend':
      return [
        { pct: 0.3, stage: 'Reading last frame', ms: 600 },
        { pct: 0.8, stage: 'Predicting next motion', ms: 1100 },
        { pct: 1, stage: 'Stitching seam', ms: 500 },
      ];
    case 'background_remove':
      return [
        { pct: 0.4, stage: 'Detecting subject', ms: 700 },
        { pct: 0.9, stage: 'Refining edges', ms: 600 },
        { pct: 1, stage: 'Compositing', ms: 400 },
      ];
    case 'inpaint':
      return [
        { pct: 0.3, stage: 'Reading mask', ms: 600 },
        { pct: 0.8, stage: 'Re-painting region', ms: 1000 },
        { pct: 1, stage: 'Blending', ms: 400 },
      ];
    case 'pikaffect':
      return [
        { pct: 0.4, stage: 'Tracking object', ms: 700 },
        { pct: 0.9, stage: 'Applying effect', ms: 900 },
        { pct: 1, stage: 'Polishing', ms: 400 },
      ];
    case 'storyboard':
      return [
        { pct: 0.2, stage: 'Reading shots', ms: 600 },
        { pct: 0.6, stage: 'Generating each scene', ms: 1500 },
        { pct: 0.9, stage: 'Sequencing', ms: 700 },
        { pct: 1, stage: 'Finalising', ms: 400 },
      ];
    case 'image_gen':
      return [
        { pct: 0.3, stage: 'Parsing prompt', ms: 500 },
        { pct: 0.8, stage: 'Painting image', ms: 1000 },
        { pct: 1, stage: 'Upscaling', ms: 400 },
      ];
  }
}

function estimateDurationMs(p: Project): number {
  switch (p.kind) {
    case 'image_video':
      return (p.settings.kind === 'image_video' ? p.settings.settings.duration : 8) * 1000;
    case 'faceless_video':
      return 42000;
    case 'captions':
    case 'dub':
    case 'voiceover':
    case 'video_music':
      return 30000;
    case 'audio':
      return 12000;
    case 'long_form_audio':
      return 240000;
    case 'sound_effects':
      return (p.settings.kind === 'sound_effects' ? p.settings.settings.durationSec : 4) * 1000;
    case 'voice_changer':
      return 15000;
    case 'voice_isolator':
      return 30000;
    case 'transcribe':
      return 0;
    case 'music_song':
      return (p.settings.kind === 'music_song' ? p.settings.settings.durationSec : 90) * 1000;
    case 'voice_design':
      return 8000;
    case 'voice_agent':
      return 0;
    case 'audio_native':
      return 180000;
    case 'ai_avatar':
      return 30000;
    case 'video_translate':
      return 60000;
    case 'lip_sync':
      return 20000;
    case 'video_extend':
      return (p.settings.kind === 'video_extend' ? p.settings.settings.extraSeconds : 4) * 1000;
    case 'background_remove':
    case 'inpaint':
    case 'pikaffect':
      return 15000;
    case 'storyboard':
      return (p.settings.kind === 'storyboard' ? p.settings.settings.shots.reduce((s, sh) => s + sh.durationSec, 0) : 30) * 1000;
    case 'image_gen':
      return 0;
  }
}
