# Ghibli Studio

> A cross-platform mobile app that brings the full ElevenLabs video + audio
> generation surface to your phone — wrapped in a soft, Claude-warm,
> Ghibli-dreamy interface.

![iOS · Android · Expo](https://img.shields.io/badge/Expo-SDK%2056-000?style=flat-square)
![React Native 0.85](https://img.shields.io/badge/React%20Native-0.85-61dafb?style=flat-square)
![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square)

---

## What's inside

Every feature from the ElevenLabs Studio + Image & Video surface, rebuilt
natively for iOS and Android:

| Studio feature | What it does | Where it lives |
| --- | --- | --- |
| **Create video (Image & Video)** | Prompt-to-video / image with model picker, aspect ratio, duration, resolution, audio toggle, seed, variation count, start & end frames. Mirrors the ElevenLabs Veo composer exactly. | `src/screens/ImageVideoScreen.tsx` |
| **Create faceless video** | Idea → script → narrated video with B-roll style (cinematic / animated / documentary / ghibli) and kinetic captions. | `FacelessVideoScreen.tsx` |
| **Add captions** | Upload video → auto-transcribe → style (minimal / bold / subtle / kinetic / karaoke), highlight colour, size, position, emoji suggestions. Live preview. | `CaptionsScreen.tsx` |
| **Create dub** | 30+ languages, voice cloning, lip-sync, background preservation, multi-speaker. | `DubScreen.tsx` |
| **Add voiceover** | Multi-segment narration timeline with per-segment voice + start/end times, music ducking. | `VoiceoverScreen.tsx` |
| **Video to music** | Auto-score with genre, mood, intensity, instrumentation. | `VideoMusicScreen.tsx` |
| **Generate audio** | Single-voice TTS with stability / similarity / style / speaker boost sliders. | `AudioScreen.tsx` |
| **Generate long-form audio** | Multi-speaker podcast turns with per-speaker voice assignment — the exact layout from the screenshot. | `LongFormAudioScreen.tsx` |
| **Recent projects** | Filtered, persistent library of every generation. | `ProjectsScreen.tsx` |
| **Live generation** | Animated orb + ring progress, staged status copy, success haptic, retry on failure. | `GenerationScreen.tsx` |

Plus a polished **Studio home**, **Audio hub**, **Profile/Settings** with
secure ElevenLabs API key storage, animated Ghibli sky backdrop, and full
dark mode that turns into a Ghibli night sky.

---

## Design language

Two influences, one app:

- **Claude** — warm paper (`#FAF4EC`), serif display headings, terracotta
  accent, soft brown shadows. Calm, premium, never cold.
- **Ghibli** — pastel meadow / sky / peach / lavender feature colours,
  drifting hand-drawn SVG clouds, glowing sun, twinkling four-pointed
  sparkles. Cute without being childish.

All tokens live in `src/theme/index.ts`. Switch them once and every screen
follows.

---

## Quick start

### Prerequisites

- **Node** 18.18+ (we developed on 22.16)
- **npm** 10+
- For iOS: **Xcode 15+**, or just use **Expo Go**
- For Android: **Android Studio** + emulator, or **Expo Go**
- A modern phone running iOS 15+ or Android 9+

### Install and run

```bash
git clone <this-repo>
cd ghibli-studio
npm install

# Start the dev server (QR code → scan with Expo Go)
npm start

# Or jump straight onto a simulator
npm run ios
npm run android
```

### Testing on a real phone (fastest path)

1. Install **Expo Go** from the App Store / Play Store.
2. Run `npm start`.
3. Scan the QR code with your phone's camera (iOS) or the Expo Go app
   (Android).
4. The app loads over your Wi-Fi network in seconds. Hot reload works for
   every screen.

This is how you'll iterate day-to-day. Native builds are only needed when
you change app permissions or want to ship to the stores.

### Building a stand-alone binary

Use [EAS Build](https://docs.expo.dev/build/introduction/) when you're
ready to ship:

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

---

## Hooking up real generation

Out of the box, generations run against a **realistic local mock** — every
flow plays out the correct stages (e.g. "Parsing prompt → Composing first
frame → Generating motion → Mixing audio → Finalising") and lands a stock
preview thumbnail in your library. This lets you experience the entire UI
on a plane, in a meeting, or before paying for credits.

To run against the real ElevenLabs platform:

1. Open the app → **You → ElevenLabs API key**.
2. Paste your key. It's stored in the device's secure enclave via
   `expo-secure-store` and never leaves your phone.
3. Replace `mockGenerate` in `src/services/api.ts` with real HTTP calls
   against:

   | Feature | ElevenLabs endpoint |
   | --- | --- |
   | Image & Video | `POST /v1/video/generate` (Veo / Sora / Runway / Kling) |
   | Audio (TTS) | `POST /v1/text-to-speech/{voice_id}` |
   | Dub | `POST /v1/dubbing` |
   | Long-form audio | `POST /v1/projects` |
   | Captions | `POST /v1/captioning` |

The `Project` model already carries every setting an ElevenLabs call needs.

---

## Project structure

```
src/
  theme/          design tokens, ThemeProvider, dark mode
  components/     reusable primitives (Button, Card, Chip, Input, Sheet,
                  GhibliBackdrop, Sparkle, …)
  navigation/     bottom-tab + native-stack root navigator
  services/       types, voice/language catalog, generation API adapter
  store/          AsyncStorage-backed projects context
  screens/        every feature screen + shared flow helpers
  utils/          small formatters
```

Every screen is wrapped in `<Screen>`, which puts a Ghibli sky behind
content, handles safe-area + keyboard, and keeps a 120px bottom inset so
floating CTAs never overlap.

---

## Accessibility & cross-device support

- Layouts use `react-native-safe-area-context` so notched and Dynamic
  Island phones look right.
- All tap targets ≥ 36×36 with `hitSlop` where needed.
- Haptics on every primary action (`expo-haptics`).
- Dark mode auto-follows the system; manual toggle in **You**.
- Works on iPhone SE through iPhone 16 Pro Max; Android 9+ from compact
  Pixels to foldables (Galaxy Z Flip / Fold).

---

## License

MIT — see `LICENSE`.
