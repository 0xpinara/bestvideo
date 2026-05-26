import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppHeader,
  Chip,
  IconBadge,
  Screen,
  SegmentedControl,
  Sheet,
  Sparkle,
  Text,
} from '../components';
import { featureAccents, radii, shadow, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import {
  ASPECT_OPTIONS,
  COUNT_OPTIONS,
  DURATION_OPTIONS,
  IMAGE_MODELS,
  PROMPT_SUGGESTIONS,
  RESOLUTION_OPTIONS,
  VIDEO_MODELS,
} from '../services/catalog';
import { useProjects } from '../store/projects';
import type { AspectRatio, DurationSec, ImageVideoSettings, Modality, Resolution } from '../services/types';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const GALLERY: { uri: string; aspect: number; modality: 'image' | 'video' }[] = [
  { uri: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800', aspect: 0.66, modality: 'video' },
  { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800', aspect: 1.4, modality: 'image' },
  { uri: 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=800', aspect: 0.75, modality: 'video' },
  { uri: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800', aspect: 1.5, modality: 'image' },
  { uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', aspect: 1.0, modality: 'video' },
  { uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', aspect: 1.2, modality: 'video' },
  { uri: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800', aspect: 0.75, modality: 'image' },
  { uri: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800', aspect: 1.4, modality: 'video' },
  { uri: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800', aspect: 1.1, modality: 'image' },
  { uri: 'https://images.unsplash.com/photo-1444065381814-865dc9da92c0?w=800', aspect: 0.85, modality: 'video' },
  { uri: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=800', aspect: 1.3, modality: 'image' },
  { uri: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800', aspect: 0.7, modality: 'video' },
];

function masonryColumns<T>(items: T[], cols: number): T[][] {
  const out: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((it, i) => out[i % cols].push(it));
  return out;
}

export const ImageVideoScreen: React.FC = () => {
  const { theme } = useTheme();
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { createDraft } = useProjects();

  const [tab, setTab] = useState<'explore' | 'history'>('explore');
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [query, setQuery] = useState('');

  const [settings, setSettings] = useState<ImageVideoSettings>({
    modality: 'video',
    prompt: '',
    model: 'veo-3.1-lite',
    aspect: '16:9',
    duration: 4,
    resolution: '720p',
    audio: 'ambient',
    audioOn: false,
    seed: null,
    count: 1,
  });

  const [showOpts, setShowOpts] = useState<
    null | 'model' | 'aspect' | 'duration' | 'resolution' | 'count' | 'audio'
  >(null);

  const filtered = useMemo(
    () =>
      GALLERY.filter((g) => (filter === 'all' ? true : g.modality === filter)).filter((g) =>
        query.trim().length === 0 ? true : g.uri.includes(query.trim().toLowerCase()),
      ),
    [filter, query],
  );

  const cols = masonryColumns(filtered, 2);
  const credits = 45;

  const pickFrame = async (slot: 'start' | 'end') => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
    if (!r.canceled && r.assets[0]) {
      setSettings((s) => ({
        ...s,
        startFrameUri: slot === 'start' ? r.assets[0].uri : s.startFrameUri,
        endFrameUri: slot === 'end' ? r.assets[0].uri : s.endFrameUri,
      }));
    }
  };

  const handleGenerate = () => {
    if (!settings.prompt.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      return;
    }
    const p = createDraft(
      'image_video',
      { kind: 'image_video', settings },
      settings.prompt.slice(0, 60),
    );
    nav.navigate('Generation', { projectId: p.id });
  };

  return (
    <Screen
      scroll={false}
      pad={false}
      contentContainerStyle={undefined}
    >
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
        <AppHeader subtitle="Studio" title="Image & Video" right={
          <View style={styles.betaTag}>
            <Text variant="caption" color="textSoft" weight="700">BETA</Text>
          </View>
        } />

        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[
            { value: 'explore', label: 'Explore' },
            { value: 'history', label: 'History' },
          ]}
          style={{ marginBottom: spacing.md }}
        />

        <View style={[styles.search, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={18} color={theme.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search images and videos"
            placeholderTextColor={theme.textFaint}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>

        <View style={styles.filterRow}>
          <Chip
            label="+ Image"
            tint={featureAccents.imageVideo.to}
            selected={filter === 'image'}
            onPress={() => setFilter((f) => (f === 'image' ? 'all' : 'image'))}
          />
          <Chip
            label="× Video"
            tint={featureAccents.imageVideo.to}
            selected={filter === 'video' || filter === 'all'}
            onPress={() => setFilter((f) => (f === 'video' ? 'all' : 'video'))}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 320 + insets.bottom }}
      >
        <View style={styles.masonry}>
          {cols.map((col, ci) => (
            <View key={ci} style={styles.masonryCol}>
              {col.map((item, i) => (
                <View key={`${ci}-${i}`} style={[styles.tile, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                  <Image source={{ uri: item.uri }} style={{ width: '100%', aspectRatio: item.aspect }} contentFit="cover" transition={200} />
                  <View style={styles.tileBadge}>
                    <Ionicons
                      name={item.modality === 'video' ? 'play' : 'image-outline'}
                      size={11}
                      color="#fff"
                    />
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating composer */}
      <View
        style={[
          styles.composerWrap,
          {
            paddingBottom: insets.bottom + 90,
          },
        ]}
        pointerEvents="box-none"
      >
        <View
          style={[
            styles.composer,
            shadow.raised,
            { backgroundColor: theme.bgElevated, borderColor: theme.border },
          ]}
        >
          {/* Suggestion chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xs }}>
            {PROMPT_SUGGESTIONS.map((s) => (
              <Chip
                key={s.label}
                label={s.label}
                size="sm"
                onPress={() => setSettings((st) => ({ ...st, prompt: s.label }))}
                leftIcon={<Ionicons name={s.icon as any} size={12} color={theme.text} />}
              />
            ))}
          </ScrollView>

          {/* Modality toggle */}
          <View style={styles.composerToggleRow}>
            <SegmentedControl
              value={settings.modality}
              onChange={(v: Modality) => {
                const nextModel = v === 'image' ? 'flux-1.1-pro' : 'veo-3.1-lite';
                setSettings((s) => ({ ...s, modality: v, model: nextModel as any }));
              }}
              options={[
                { value: 'image', label: 'Image' },
                { value: 'video', label: 'Video' },
              ]}
            />
            <Pressable onPress={() => setSettings({ ...settings, prompt: '' })} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={theme.textFaint} />
            </Pressable>
          </View>

          {/* Frame slots */}
          {settings.modality === 'video' ? (
            <View style={styles.frameRow}>
              <FrameSlot label="Start frame" uri={settings.startFrameUri} onPress={() => pickFrame('start')} />
              <FrameSlot label="End frame" uri={settings.endFrameUri} onPress={() => pickFrame('end')} />
            </View>
          ) : null}

          {/* Prompt */}
          <TextInput
            value={settings.prompt}
            onChangeText={(t) => setSettings({ ...settings, prompt: t })}
            placeholder="Describe your video or reference by using @..."
            placeholderTextColor={theme.textFaint}
            multiline
            style={[styles.prompt, { color: theme.text }]}
          />

          {/* Options row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xs, alignItems: 'center' }}>
            <ComposerPill
              icon="cube-outline"
              label={currentModelName(settings)}
              onPress={() => setShowOpts('model')}
            />
            <ComposerPill icon="scan-outline" label={settings.aspect} onPress={() => setShowOpts('aspect')} />
            <ComposerPill icon="film-outline" label={settings.resolution} onPress={() => setShowOpts('resolution')} />
            {settings.modality === 'video' ? (
              <ComposerPill icon="time-outline" label={`${settings.duration}s`} onPress={() => setShowOpts('duration')} />
            ) : null}
            <ComposerPill
              icon={settings.audioOn ? 'volume-medium-outline' : 'volume-mute-outline'}
              label={settings.audioOn ? 'Audio on' : 'Off'}
              onPress={() => setSettings((s) => ({ ...s, audioOn: !s.audioOn }))}
            />
            <ComposerPill icon="flash-off-outline" label="" onPress={() => {}} />
            <ComposerPill icon="dice-outline" label={settings.seed == null ? '—' : String(settings.seed)} onPress={() => setSettings((s) => ({ ...s, seed: Math.floor(Math.random() * 1_000_000) }))} />
            <ComposerPill icon="copy-outline" label={`x${settings.count}`} onPress={() => setShowOpts('count')} />
            <ComposerPill icon="sparkles-outline" label="On" onPress={() => {}} />
            <ComposerPill icon="server-outline" label={`${credits} left`} onPress={() => nav.navigate('Settings')} />
            <Pressable
              onPress={handleGenerate}
              style={({ pressed }) => [
                styles.go,
                { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Ionicons name="arrow-up" size={20} color="#fff" />
            </Pressable>
          </ScrollView>
        </View>
      </View>

      <OptionSheet
        visible={!!showOpts}
        kind={showOpts}
        modality={settings.modality}
        settings={settings}
        onChange={(patch) => setSettings({ ...settings, ...patch })}
        onClose={() => setShowOpts(null)}
      />
    </Screen>
  );
};

const FrameSlot: React.FC<{ label: string; uri?: string; onPress: () => void }> = ({ label, uri, onPress }) => {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.frame,
        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      ) : (
        <View style={styles.frameEmpty}>
          <Ionicons name="image-outline" size={18} color={theme.textMuted} />
          <Text variant="caption" color="textMuted" style={{ marginTop: 4 }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const ComposerPill: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }> = ({
  icon,
  label,
  onPress,
}) => {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Ionicons name={icon} size={13} color={theme.text} />
      {label ? (
        <Text variant="bodySm" weight="600" style={{ marginLeft: 5 }}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
};

function currentModelName(s: ImageVideoSettings): string {
  if (s.modality === 'video') {
    return VIDEO_MODELS.find((m) => m.id === s.model)?.name ?? 'Model';
  }
  return IMAGE_MODELS.find((m) => m.id === s.model)?.name ?? 'Model';
}

const OptionSheet: React.FC<{
  visible: boolean;
  kind: null | 'model' | 'aspect' | 'duration' | 'resolution' | 'count' | 'audio';
  modality: Modality;
  settings: ImageVideoSettings;
  onChange: (p: Partial<ImageVideoSettings>) => void;
  onClose: () => void;
}> = ({ visible, kind, modality, settings, onChange, onClose }) => {
  const { theme } = useTheme();

  if (!visible || !kind) {
    return (
      <Sheet visible={false} onClose={onClose}>
        <View />
      </Sheet>
    );
  }

  let title = '';
  let body: React.ReactNode = null;

  if (kind === 'model') {
    title = 'Choose a model';
    const list = modality === 'video' ? VIDEO_MODELS : IMAGE_MODELS;
    body = (
      <ScrollView>
        {list.map((m) => {
          const selected = m.id === settings.model;
          return (
            <Pressable
              key={m.id}
              onPress={() => {
                onChange({ model: m.id as any });
                onClose();
              }}
              style={({ pressed }) => [
                styles.modelRow,
                {
                  borderColor: selected ? theme.accent : theme.border,
                  backgroundColor: selected ? theme.accentTint : theme.surface,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <IconBadge icon="sparkles" from={featureAccents.imageVideo.from} to={featureAccents.imageVideo.to} size={36} />
              <View style={{ flex: 1, paddingHorizontal: spacing.md }}>
                <Text weight="700">{m.name}</Text>
                <Text variant="bodySm" color="textMuted">
                  {m.blurb}
                </Text>
              </View>
              <Text variant="bodySm" weight="700" color="accent">
                {m.credits} cr
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  } else if (kind === 'aspect') {
    title = 'Aspect ratio';
    body = (
      <View style={styles.gridRow}>
        {ASPECT_OPTIONS.map((a) => (
          <Chip
            key={a}
            label={a}
            selected={settings.aspect === a}
            onPress={() => {
              onChange({ aspect: a as AspectRatio });
              onClose();
            }}
            tint={theme.accent}
          />
        ))}
      </View>
    );
  } else if (kind === 'duration') {
    title = 'Duration';
    body = (
      <View style={styles.gridRow}>
        {DURATION_OPTIONS.map((d) => (
          <Chip
            key={d}
            label={`${d}s`}
            selected={settings.duration === d}
            onPress={() => {
              onChange({ duration: d as DurationSec });
              onClose();
            }}
            tint={theme.accent}
          />
        ))}
      </View>
    );
  } else if (kind === 'resolution') {
    title = 'Resolution';
    body = (
      <View style={styles.gridRow}>
        {RESOLUTION_OPTIONS.map((r) => (
          <Chip
            key={r}
            label={r}
            selected={settings.resolution === r}
            onPress={() => {
              onChange({ resolution: r as Resolution });
              onClose();
            }}
            tint={theme.accent}
          />
        ))}
      </View>
    );
  } else if (kind === 'count') {
    title = 'Variations';
    body = (
      <View style={styles.gridRow}>
        {COUNT_OPTIONS.map((c) => (
          <Chip
            key={c}
            label={`x${c}`}
            selected={settings.count === c}
            onPress={() => {
              onChange({ count: c });
              onClose();
            }}
            tint={theme.accent}
          />
        ))}
      </View>
    );
  }

  return (
    <Sheet visible={visible} onClose={onClose} title={title} height={420}>
      {body}
    </Sheet>
  );
};

const styles = StyleSheet.create({
  betaTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(192,100,66,0.12)',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filterRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  masonry: { flexDirection: 'row', gap: spacing.sm },
  masonryCol: { flex: 1, gap: spacing.sm },
  tile: { borderRadius: radii.lg, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  tileBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
  },
  composer: {
    borderRadius: radii.xxl,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  composerToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  frameRow: { flexDirection: 'row', gap: spacing.sm },
  frame: {
    flex: 1,
    height: 64,
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  frameEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  prompt: { minHeight: 38, fontSize: 15, paddingVertical: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  go: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});

// keep unused symbol from being tree-shaken in dev
export const __Sparkle = Sparkle;
