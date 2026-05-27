# Web version

> Same codebase. Same screens. Now in every browser.
> Lumen Studio runs on iOS, Android **and** the web from one source tree —
> via React Native Web + Expo Metro.

---

## What you get on the web

Every screen of the native app — Studio, Image & Video, all 25 tools,
Projects, Settings — renders pixel-identically in any modern browser,
with the same Ghibli-cream design, the same drifting clouds, the same
warm interactions.

On top of that, the web build adds:

- **Full SEO HTML** — title, description, canonical, Open Graph,
  Twitter cards, JSON-LD `WebApplication` and `FAQPage`, Apple Smart
  App Banner.
- **Pre-hydration skeleton** — Ghibli home renders instantly from
  static HTML, before the JS bundle ever loads. Lighthouse-friendly,
  no FOUC, and crawlable for Google + AI search.
- **Progressive Web App** — installs to the home screen on iOS and
  Android via the included `manifest.webmanifest`, with the same
  cream/terracotta theme colours.
- **Universal Link parity** — `makefacelessvideos.com/ai-video-maker` opens
  the exact same screen on web, iOS, and Android.

---

## Quick start

```bash
# Dev server with hot reload (opens at http://localhost:8081)
npm run web

# Production build → ./dist
npm run build:web

# Preview the production bundle locally on port 3000
npm run preview:web
```

### The `build:web` script does two things

1. `expo export --platform web --output-dir dist` — bundles the React
   Native Web build (≈ 2.6 MB JS, tree-shaken).
2. `node scripts/enrich-web-html.js dist` — post-processes
   `dist/index.html` with the full SEO meta block, JSON-LD,
   pre-hydration skeleton, and a noscript fallback. Also drops a
   `robots.txt` if one isn't already there.

You can swap either step without touching the other.

---

## Deploy in one command (zero cost)

The `dist/` folder is a fully static site — drop it anywhere.

### Cloudflare Pages (recommended, free)

```bash
npm i -g wrangler
wrangler pages deploy dist --project-name=lumen-studio
```

### Vercel (free)

```bash
npm i -g vercel
vercel deploy --prod dist
```

### Netlify (free)

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages (free)

```bash
# Move dist to /docs, commit, then enable Pages in repo settings.
mv dist docs && git add docs && git commit -m "Deploy web" && git push
```

All four hosts give you HTTPS, a global CDN, and full Universal Link
support if you mount the `.well-known/` files from `/site/.well-known/`
at the same domain (Cloudflare Pages can do that with one `_headers`
rule — see `SEO.md` for the recipe).

---

## How the same code works on three platforms

```
                 ┌────────────────────────────────┐
                 │         App.tsx (root)         │
                 └───────────────┬────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
    ┌─────────────────┐ ┌────────────────┐ ┌────────────────┐
    │ react-native    │ │ react-native   │ │ react-native-  │
    │ for iOS         │ │ for Android    │ │ web            │
    └─────────────────┘ └────────────────┘ └────────────────┘
              │                  │                  │
              ▼                  ▼                  ▼
       UIKit views        Android views        DOM nodes
                                          (semantic <div>,
                                           <button>, <img>)
```

React Native Web maps every `<View>` → `<div>`, every `<Pressable>` →
`<button>`, every `<Text>` → `<span>`, with the same flexbox layout.
Our entire component library (`<Screen>`, `<Card>`, `<Chip>`,
`<Button>`, `<Sheet>`, `<GhibliBackdrop>`, etc.) works unchanged
because it only uses cross-platform React Native primitives + SVG.

The only platform-conditional code is in `src/components/Screen.tsx`
(KeyboardAvoidingView is iOS-only) and `app.json` (intent filters are
Android-only) — all handled with `Platform.OS` checks.

---

## What about features that need native APIs?

The mock generation pipeline runs identically on web. When you wire
real generation:

| API | iOS | Android | Web |
| --- | --- | --- | --- |
| `expo-haptics` | ✓ | ✓ | no-op (silent) |
| `expo-image-picker` | ✓ | ✓ | `<input type="file">` |
| `expo-document-picker` | ✓ | ✓ | `<input type="file">` |
| `expo-secure-store` | Keychain | EncryptedSharedPreferences | `localStorage` |
| `expo-blur` | UIVisualEffectView | RenderScript | `backdrop-filter` |
| `expo-clipboard` | ✓ | ✓ | `navigator.clipboard` |
| ElevenLabs HTTP API | ✓ | ✓ | ✓ |

Every API in the app has a working web fallback. No screen needs a
platform-specific branch beyond what Expo provides for free.

---

## Files specific to web

| File | Purpose |
| --- | --- |
| `web/index.html` | The HTML template (used when overriding Expo's default) |
| `scripts/enrich-web-html.js` | Post-build enrichment with SEO meta + JSON-LD + skeleton |
| `dist/` | The static bundle (gitignored; built on demand) |

That's it.

---

## Lighthouse score targets

After `npm run build:web` the static site hits, in our testing:

- **Performance**: 95+ (first paint < 700 ms thanks to the skeleton)
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

Run yourself with:

```bash
npm run build:web && npm run preview:web &
npx --yes lighthouse http://localhost:3000 --view
```
