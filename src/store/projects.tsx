import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { AnySettings, Project, ProjectKind, ProjectStatus } from '../services/types';

const STORAGE_KEY = 'ghibli-studio.projects.v1';

type Ctx = {
  projects: Project[];
  loading: boolean;
  createDraft: (kind: ProjectKind, settings: AnySettings, title?: string) => Project;
  upsert: (p: Project) => void;
  remove: (id: string) => void;
  patch: (id: string, partial: Partial<Project>) => void;
  setStatus: (id: string, status: ProjectStatus, outputUri?: string) => void;
  clear: () => void;
};

const ProjectsContext = createContext<Ctx | null>(null);

const SAMPLES: Project[] = [
  {
    id: 'sample_1',
    kind: 'image_video',
    title: 'Floating Castle Above Clouds',
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    updatedAt: Date.now() - 1000 * 60 * 60 * 26,
    status: 'ready',
    thumbUri: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
    durationMs: 6000,
    settings: {
      kind: 'image_video',
      settings: {
        modality: 'video',
        prompt: 'A floating castle drifting above a sea of golden clouds, painterly ghibli style',
        model: 'veo-3.1-lite',
        aspect: '16:9',
        duration: 6,
        resolution: '720p',
        audio: 'ambient',
        audioOn: true,
        seed: null,
        count: 1,
      },
    },
  },
  {
    id: 'sample_2',
    kind: 'faceless_video',
    title: 'On-device AI is rewriting latency',
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    updatedAt: Date.now() - 1000 * 60 * 60 * 8,
    status: 'ready',
    thumbUri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    durationMs: 42000,
    settings: {
      kind: 'faceless_video',
      settings: {
        prompt: 'How on-device AI is changing latency budgets',
        script:
          'Today we are unpacking how on-device AI is changing latency budgets. When inference moves local, product teams rethink what feels instant.',
        voiceId: 'v_rachel',
        brollStyle: 'cinematic',
        captionStyle: 'kinetic',
        language: 'en',
        aspect: '9:16',
        music: true,
      },
    },
  },
  {
    id: 'sample_3',
    kind: 'audio',
    title: 'Bedtime Story – Sky Whales',
    createdAt: Date.now() - 1000 * 60 * 60 * 60,
    updatedAt: Date.now() - 1000 * 60 * 60 * 60,
    status: 'ready',
    durationMs: 95000,
    settings: {
      kind: 'audio',
      settings: {
        voiceId: 'v_dorothy',
        text: 'High above the village, where lanterns of the sky drifted in slow circles, a whale of clouds opened a single, silver eye…',
        stability: 0.6,
        similarity: 0.75,
        styleExaggeration: 0.2,
        speakerBoost: true,
      },
    },
  },
];

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setProjects(JSON.parse(raw));
        } else {
          setProjects(SAMPLES);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLES));
        }
      } catch {
        setProjects(SAMPLES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next: Project[]) => {
    setProjects(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const createDraft = useCallback<Ctx['createDraft']>(
    (kind, settings, title) => {
      const id = String(uuid.v4());
      const p: Project = {
        id,
        kind,
        title: title ?? defaultTitle(kind),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'draft',
        settings,
      };
      persist([p, ...projects]);
      return p;
    },
    [persist, projects],
  );

  const upsert = useCallback<Ctx['upsert']>(
    (p) => {
      const idx = projects.findIndex((x) => x.id === p.id);
      const next = idx >= 0 ? projects.map((x) => (x.id === p.id ? p : x)) : [p, ...projects];
      persist(next);
    },
    [persist, projects],
  );

  const remove = useCallback<Ctx['remove']>(
    (id) => persist(projects.filter((p) => p.id !== id)),
    [persist, projects],
  );

  const patch = useCallback<Ctx['patch']>(
    (id, partial) => {
      const next = projects.map((p) => (p.id === id ? { ...p, ...partial, updatedAt: Date.now() } : p));
      persist(next);
    },
    [persist, projects],
  );

  const setStatus = useCallback<Ctx['setStatus']>(
    (id, status, outputUri) => {
      const next = projects.map((p) =>
        p.id === id ? { ...p, status, outputUri: outputUri ?? p.outputUri, updatedAt: Date.now() } : p,
      );
      persist(next);
    },
    [persist, projects],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const value = useMemo<Ctx>(
    () => ({ projects, loading, createDraft, upsert, remove, patch, setStatus, clear }),
    [projects, loading, createDraft, upsert, remove, patch, setStatus, clear],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
};

export function useProjects(): Ctx {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be inside ProjectsProvider');
  return ctx;
}

function defaultTitle(kind: ProjectKind): string {
  switch (kind) {
    case 'image_video': return 'Untitled scene';
    case 'faceless_video': return 'Untitled faceless video';
    case 'captions': return 'Untitled captions';
    case 'dub': return 'Untitled dub';
    case 'voiceover': return 'Untitled voiceover';
    case 'video_music': return 'Untitled score';
    case 'audio': return 'Untitled voice';
    case 'long_form_audio': return 'Untitled long form';
    case 'sound_effects': return 'Untitled SFX';
    case 'voice_changer': return 'Untitled voice swap';
    case 'voice_isolator': return 'Untitled isolation';
    case 'transcribe': return 'Untitled transcript';
    case 'music_song': return 'Untitled song';
    case 'voice_design': return 'Untitled voice';
    case 'voice_agent': return 'Untitled agent';
    case 'audio_native': return 'Untitled article';
    case 'ai_avatar': return 'Untitled avatar';
    case 'video_translate': return 'Untitled translation';
    case 'lip_sync': return 'Untitled lip sync';
    case 'video_extend': return 'Untitled extension';
    case 'background_remove': return 'Untitled key';
    case 'inpaint': return 'Untitled inpaint';
    case 'pikaffect': return 'Untitled effect';
    case 'storyboard': return 'Untitled storyboard';
    case 'image_gen': return 'Untitled image';
  }
}
