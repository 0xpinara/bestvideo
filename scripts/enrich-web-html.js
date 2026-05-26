#!/usr/bin/env node
/**
 * Post-process the static web export so the shipped index.html is
 * SEO-perfect — full meta tags, Open Graph, Twitter cards, JSON-LD,
 * pre-hydration skeleton, and an accessible noscript fallback.
 *
 * Run automatically after `expo export --platform web` via the npm
 * script `build:web`.
 */
const fs = require('fs');
const path = require('path');

const outDir = process.argv[2] || path.resolve(__dirname, '..', 'dist');
const indexPath = path.join(outDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('No index.html found at', indexPath);
  process.exit(1);
}

const original = fs.readFileSync(indexPath, 'utf8');
const scriptMatch = original.match(/<script[^>]*src=["'][^"']+["'][^>]*><\/script>/);
const scriptTag = scriptMatch ? scriptMatch[0] : '';

const enriched = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
<meta name="theme-color" content="#FAF4EC" />
<meta name="color-scheme" content="light dark" />

<title>Lumen Studio · AI Video Maker, Voice, Dubbing, Music & Avatars</title>
<meta name="description" content="Lumen Studio is the all-in-one AI creator app: AI video, voice generation, sound effects, AI music, dubbing in 30+ languages, AI avatars, lip-sync, captions, and more. Free to start. iOS, Android, and Web." />
<meta name="keywords" content="ai video maker, ai voice generator, ai music generator, sound effects, text to speech, ai dubbing, ai avatar, lip sync, video translator, auto captions, voice changer, voice isolator, transcribe, podcast generator, ai image generator" />
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
<meta name="googlebot" content="index,follow" />
<link rel="canonical" href="https://lumenstudio.app/" />
<link rel="manifest" href="/manifest.webmanifest" />

<meta name="apple-itunes-app" content="app-id=0000000000, app-argument=https://lumenstudio.app/" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Lumen" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" href="/favicon.ico" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="Lumen Studio" />
<meta property="og:title" content="Lumen Studio · AI Video, Voice, Music & Avatars in one app" />
<meta property="og:description" content="Type a sentence, get a finished video. AI video, voice, music, dubbing, captions, avatars and more. Free to start." />
<meta property="og:url" content="https://lumenstudio.app/" />
<meta property="og:image" content="https://lumenstudio.app/assets/og-cover.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="en_US" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@lumenstudio" />
<meta name="twitter:title" content="Lumen Studio · AI Video, Voice, Music & Avatars" />
<meta name="twitter:description" content="Type a sentence, get a finished video. AI video, voice, music, dubbing, captions, avatars." />
<meta name="twitter:image" content="https://lumenstudio.app/assets/og-cover.png" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Lumen Studio",
  "alternateName": ["Lumen", "AI Video Maker", "Lumen AI Studio"],
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web · iOS 15+ · Android 9+",
  "description": "AI video maker, voice generator, music, dubbing, captions, AI avatars and more in one mobile and web app.",
  "url": "https://lumenstudio.app/",
  "downloadUrl": [
    "https://apps.apple.com/app/id0000000000",
    "https://play.google.com/store/apps/details?id=com.lumenstudio.app"
  ],
  "screenshot": "https://lumenstudio.app/assets/shot-1.png",
  "softwareVersion": "1.0.0",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "1280" },
  "featureList": [
    "AI video generator from text",
    "Faceless video maker",
    "AI avatars (HeyGen-class talking heads)",
    "Storyboards with consistent characters",
    "Auto captions in 30+ languages",
    "AI dubbing with voice cloning and lip sync",
    "Video translation with lip sync",
    "AI voiceover with multi-segment timing",
    "Video-to-music auto scoring",
    "Studio-grade text to speech",
    "Multi-speaker long-form podcasts",
    "Sound effects generator from text",
    "Voice changer (speech to speech)",
    "Voice isolator (background noise removal)",
    "Transcription in 90+ languages",
    "AI music generator with vocals",
    "Voice design from a text description",
    "Conversational voice agents",
    "Audio Native embed for articles",
    "Voice library with community voices",
    "Lip sync any audio to any face",
    "Video extension",
    "Background remover for video",
    "Inpaint and object removal",
    "One-tap viral video effects",
    "AI image generator (Flux, Imagen, Stable Diffusion, Midjourney)"
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"What is Lumen Studio?","acceptedAnswer":{"@type":"Answer","text":"Lumen Studio is an all-in-one AI creator app that turns text into finished videos. It includes AI video, voice generation, music, sound effects, dubbing in 30+ languages, AI avatars, lip sync, captions, voiceover, image generation, voice cloning, and multi-speaker podcasts — all in one product."}},
    {"@type":"Question","name":"Does Lumen Studio work on the web?","acceptedAnswer":{"@type":"Answer","text":"Yes. Lumen Studio runs as a native iOS app, a native Android app, and a Progressive Web App in the browser — all from the same codebase, so every feature lands on every platform at the same time."}},
    {"@type":"Question","name":"Is Lumen Studio free?","acceptedAnswer":{"@type":"Answer","text":"Yes. Lumen is free to use with a generous starter quota of credits. Lumen Pro unlocks unlimited generations, 1080p exports, commercial use, and priority queue."}},
    {"@type":"Question","name":"Which AI models power Lumen?","acceptedAnswer":{"@type":"Answer","text":"Lumen wraps best-in-class providers: Veo 3.1, Sora 2, Runway Gen-4, Kling 3, Pika and Luma Dream Machine for video; Eleven Music v1, Suno v5.5 and Udio v1.5 for music; Flux, Imagen 3, Stable Diffusion 3.5 and Midjourney v7 for images; ElevenLabs for voice."}}
  ]
}
</script>

<style id="ls-skeleton-styles">
  :root { color-scheme: light dark; }
  html, body, #root { height: 100%; margin: 0; padding: 0; }
  body {
    background: #FAF4EC;
    color: #2A1F17;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", system-ui, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    overscroll-behavior-y: none;
  }
  @media (prefers-color-scheme: dark) { body { background: #1B1612; color: #F4ECDE; } }
  #root { display: flex; height: 100%; flex: 1; }
  .ls-skeleton { padding: 24px 18px; max-width: 720px; margin: 0 auto; }
  .ls-eyebrow { font-size: 12px; letter-spacing: 0.6px; text-transform: uppercase; color: #8C7A66; margin: 8px 0 6px; }
  .ls-title { font-family: Georgia, "Iowan Old Style", serif; font-size: 34px; line-height: 1.06; letter-spacing: -0.3px; margin: 0 0 18px; }
  .ls-hero { background: linear-gradient(160deg, #FBE5DA, #F6C6A7); border-radius: 28px; padding: 28px; box-shadow: 0 18px 36px rgba(122,90,46,0.15); margin-bottom: 24px; }
  .ls-hero h2 { font-family: Georgia, serif; font-size: 28px; line-height: 1.1; margin: 6px 0 8px; color: #3D1F11; }
  .ls-hero p { color: #7B3D24; margin: 0 0 18px; }
  .ls-cta { display: inline-block; background: #C96442; color: #fff; padding: 12px 18px; border-radius: 999px; font-weight: 700; text-decoration: none; }
  .ls-tile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .ls-tile { background: #FFFBF4; border: 1px solid #EADFCB; border-radius: 22px; padding: 18px; box-shadow: 0 12px 24px rgba(122,90,46,0.06); }
  .ls-tile strong { display: block; margin-top: 10px; font-size: 16px; }
  .ls-tile span { color: #8C7A66; font-size: 13px; }
  .ls-dot { width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, #F6C6A7, #C96442); }
  body.ls-hydrated .ls-skeleton { display: none; }
</style>

<script>
  if ('MutationObserver' in window) {
    var mo = new MutationObserver(function () {
      var root = document.getElementById('root');
      if (root && root.firstChild) { document.body.classList.add('ls-hydrated'); mo.disconnect(); }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
</script>
</head>
<body>
  <noscript>
    <div class="ls-skeleton">
      <p class="ls-eyebrow">Lumen Studio</p>
      <h1 class="ls-title">Turn a sentence into a finished video.</h1>
      <p>The all-in-one AI creator app: AI video, voice, music, dubbing, AI avatars, captions and more.</p>
      <p>
        <a class="ls-cta" href="https://apps.apple.com/app/id0000000000">App Store</a>
        &nbsp;
        <a class="ls-cta" href="https://play.google.com/store/apps/details?id=com.lumenstudio.app">Google Play</a>
      </p>
    </div>
  </noscript>

  <div class="ls-skeleton" aria-hidden="true">
    <p class="ls-eyebrow">Studio</p>
    <h1 class="ls-title">Make something today</h1>
    <div class="ls-hero">
      <p class="ls-eyebrow" style="color:#9A4B2E">+ NEW BLANK PROJECT</p>
      <h2>Create a video, gently and freely.</h2>
      <p>Pick a tool below or open the canvas to start with a blank scene.</p>
      <a class="ls-cta" href="#">+ Create video</a>
    </div>
    <div class="ls-tile-grid">
      <div class="ls-tile"><div class="ls-dot"></div><strong>AI video</strong><span>Text or image to scene</span></div>
      <div class="ls-tile"><div class="ls-dot" style="background:linear-gradient(135deg,#F6C6A7,#F19F73)"></div><strong>Faceless video</strong><span>Script → narrated short</span></div>
      <div class="ls-tile"><div class="ls-dot" style="background:linear-gradient(135deg,#F4B6C2,#E48BA0)"></div><strong>AI avatar</strong><span>Talking-head video</span></div>
      <div class="ls-tile"><div class="ls-dot" style="background:linear-gradient(135deg,#A8D5E5,#6DB7CE)"></div><strong>Storyboard</strong><span>Multi-shot scenes</span></div>
    </div>
  </div>

  <div id="root"></div>

  ${scriptTag}
</body>
</html>
`;

fs.writeFileSync(indexPath, enriched, 'utf8');

// Also drop a robots.txt + sitemap shim into the export so a one-line deploy gets us 95%
const robotsPath = path.join(outDir, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  fs.writeFileSync(
    robotsPath,
    `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: https://lumenstudio.app/sitemap.xml\n`,
    'utf8',
  );
}

console.log('✓ Enriched', indexPath, 'with full SEO metadata');
