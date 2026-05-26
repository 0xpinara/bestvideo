/**
 * Ghibli Studio design system.
 *
 * Inspired by Claude's warm, paper-like palette (cream, terracotta, ink)
 * crossed with Studio Ghibli's soft pastels (sky blue, meadow green,
 * sunset peach, dreamy lavender). Everything is rounded, soft-shadowed,
 * and a little hand-drawn.
 */

import { Platform, TextStyle, ViewStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

export const palette = {
  // Claude paper tones
  cream: '#FAF4EC',
  creamDeep: '#F2E8D8',
  paper: '#FFFBF4',
  ink: '#2A1F17',
  inkSoft: '#5B4A3A',
  inkMuted: '#8C7A66',
  inkFaint: '#BFAE96',
  hairline: '#EADFCB',

  // Claude accent
  terracotta: '#C96442',
  terracottaSoft: '#E89478',
  terracottaTint: '#FBE5DA',
  amber: '#E0A458',
  amberTint: '#FAEAD2',

  // Ghibli pastels
  sky: '#A8D5E5',
  skyDeep: '#6DB7CE',
  skyTint: '#E4F2F7',
  meadow: '#B6D7A8',
  meadowDeep: '#7FB069',
  meadowTint: '#E6F0DC',
  peach: '#F6C6A7',
  peachDeep: '#F19F73',
  peachTint: '#FCEADD',
  lavender: '#C7B8E0',
  lavenderDeep: '#9B85C6',
  lavenderTint: '#EEE7F7',
  rose: '#F4B6C2',
  roseTint: '#FBE2E8',

  // Functional
  white: '#FFFFFF',
  black: '#1A120B',
  successTint: '#E6F2DC',
  successDeep: '#5E8C4A',
  warningTint: '#FBEAD0',
  warningDeep: '#B47128',
  errorTint: '#F7DBD3',
  errorDeep: '#B44A2C',

  // Dark mode (rare night-time Ghibli)
  night: '#1B1612',
  nightSurface: '#241D17',
  nightInk: '#F4ECDE',
} as const;

// ---------------------------------------------------------------------------
// Semantic light theme
// ---------------------------------------------------------------------------

export type Theme = {
  mode: 'light' | 'dark';
  bg: string;
  bgElevated: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  border: string;
  borderStrong: string;
  text: string;
  textSoft: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentSoft: string;
  accentTint: string;
  // Ghibli accent palette referenced by feature
  sky: string;
  meadow: string;
  peach: string;
  lavender: string;
  rose: string;
  amber: string;
};

export const lightTheme: Theme = {
  mode: 'light',
  bg: palette.cream,
  bgElevated: palette.paper,
  surface: palette.paper,
  surfaceAlt: palette.creamDeep,
  card: palette.paper,
  border: palette.hairline,
  borderStrong: '#D9CAB1',
  text: palette.ink,
  textSoft: palette.inkSoft,
  textMuted: palette.inkMuted,
  textFaint: palette.inkFaint,
  accent: palette.terracotta,
  accentSoft: palette.terracottaSoft,
  accentTint: palette.terracottaTint,
  sky: palette.sky,
  meadow: palette.meadow,
  peach: palette.peach,
  lavender: palette.lavender,
  rose: palette.rose,
  amber: palette.amber,
};

export const darkTheme: Theme = {
  ...lightTheme,
  mode: 'dark',
  bg: palette.night,
  bgElevated: palette.nightSurface,
  surface: palette.nightSurface,
  surfaceAlt: '#2E251D',
  card: '#2E251D',
  border: '#3A2E23',
  borderStrong: '#4A3B2C',
  text: palette.nightInk,
  textSoft: '#D5C8B0',
  textMuted: '#A99980',
  textFaint: '#6F614E',
  accentTint: '#3A271F',
};

// ---------------------------------------------------------------------------
// Spacing, radii, type
// ---------------------------------------------------------------------------

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 56,
} as const;

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  pill: 999,
} as const;

const fontFamily = Platform.select({
  ios: {
    serif: 'Georgia',
    sans: 'System',
    mono: 'Menlo',
  },
  android: {
    serif: 'serif',
    sans: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    serif: 'Georgia',
    sans: 'System',
    mono: 'Menlo',
  },
})!;

export const typography = {
  display: {
    fontFamily: fontFamily.serif,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
    fontWeight: '600',
  } as TextStyle,
  h1: {
    fontFamily: fontFamily.serif,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
    fontWeight: '600',
  } as TextStyle,
  h2: {
    fontFamily: fontFamily.serif,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
  } as TextStyle,
  h3: {
    fontFamily: fontFamily.sans,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,
  bodyLg: {
    fontFamily: fontFamily.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,
  body: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  } as TextStyle,
  bodySm: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  } as TextStyle,
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.4,
    fontWeight: '500',
  } as TextStyle,
  label: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    fontWeight: '600',
    textTransform: 'uppercase',
  } as TextStyle,
};

// ---------------------------------------------------------------------------
// Shadows — soft and warm, never blue/grey
// ---------------------------------------------------------------------------

export const shadow = {
  soft: {
    shadowColor: '#7A5A2E',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  } as ViewStyle,
  card: {
    shadowColor: '#7A5A2E',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  } as ViewStyle,
  raised: {
    shadowColor: '#5C3F1A',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  } as ViewStyle,
};

// ---------------------------------------------------------------------------
// Feature accents — used for the studio cards
// ---------------------------------------------------------------------------

export const featureAccents = {
  imageVideo: { from: palette.sky, to: palette.skyDeep, tint: palette.skyTint },
  facelessVideo: { from: palette.peach, to: palette.peachDeep, tint: palette.peachTint },
  captions: { from: palette.meadow, to: palette.meadowDeep, tint: palette.meadowTint },
  dub: { from: palette.lavender, to: palette.lavenderDeep, tint: palette.lavenderTint },
  voiceover: { from: palette.rose, to: '#E48BA0', tint: palette.roseTint },
  videoMusic: { from: palette.amber, to: '#C58A3C', tint: palette.amberTint },
  audio: { from: palette.terracottaSoft, to: palette.terracotta, tint: palette.terracottaTint },
} as const;

export type FeatureAccentKey = keyof typeof featureAccents;
