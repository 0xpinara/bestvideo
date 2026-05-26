# Lumen Studio · SEO + ASO playbook

> Zero ad budget. Every win comes from organic search, deep links, and
> word-of-mouth. This is the system we'll run.

Mobile apps have **two** discovery surfaces:

1. **ASO** — App Store + Play Store search and category browse.
2. **SEO** — Google, Bing, Apple Spotlight, YouTube, TikTok and AI search
   answers ("what's the best AI video maker?").

We're optimising for both, and the two reinforce each other.

---

## Why "Lumen" instead of "Ghibli Studio"

Calling the public app `Ghibli` would risk:

- **Trademark rejection** — Studio Ghibli (Hayao Miyazaki) is a heavily
  protected mark; Apple and Google both reject apps that confusingly
  mirror an established brand name.
- **Cannibalised search intent** — people searching "ghibli" want
  Miyazaki-related things, not your tool. The traffic that does arrive
  bounces, which kills your store ranking.

**Lumen** keeps the warm "candle of an idea" feeling, is unowned in our
category, is short (5 chars), and reads naturally as a verb ("I luminated
this in Lumen"). If you have a stronger brand in mind, swap it
everywhere — but follow the same naming structure (keyword + brand).

---

## The 90-day plan

### Week 1 — Foundation

- [ ] Buy `lumenstudio.app`, deploy `/site` to it (Vercel / Cloudflare Pages — both free).
- [ ] Submit `sitemap.xml` to Google Search Console and Bing Webmaster.
- [ ] Create Apple Developer + Google Play Console accounts.
- [ ] Generate **8 portrait screenshots** (1290×2796 iPhone, 1080×1920 Android) using the templates in `store/screenshots/`.
- [ ] Submit a v1.0 build to TestFlight + Play Internal Testing.

### Weeks 2-4 — Soft launch

- [ ] Ship to production. Use **phased release** (1% → 10% → 100%) so
      early ratings dominate the listing.
- [ ] Post one **demo video** per feature to TikTok, Reels and Shorts.
      These rank for the same keywords we target in search.
- [ ] Reply within 24h to every review. Apple weighs response rate.

### Months 2-3 — Content compounding

- [ ] Publish one feature landing page per month (`/ai-video-maker`,
      `/auto-captions`, etc.). They already exist in `sitemap.xml`.
- [ ] Publish one blog post per week from the list in `/site/blog/ideas.md`.
- [ ] Localize the App Store listing to **10 high-CPI markets** (free,
      multiplies impressions ×4-6).

---

## ASO scoring sheet (what Apple + Google actually rank)

| Signal | Weight | Where we win |
| --- | --- | --- |
| Title keywords | ★★★★★ | `AI Video Maker · Lumen Studio` puts the top query first |
| Subtitle keywords (iOS) / short desc (Android) | ★★★★ | Hits voice, captions, music |
| Keyword field (iOS) | ★★★ | 16 high-volume keywords, no brand infringement |
| Long description | ★★ | Naturally repeats every category term 3-7× |
| First 3 screenshots | ★★★★★ | Caption-led, mock results, social proof |
| Icon | ★★★ | Single color, recognisable at 60×60 |
| Ratings + reviews | ★★★★★ | Driven by in-app review prompt after success |
| Install velocity week 1 | ★★★★★ | Phased rollout + social posts |
| Universal Links / App Links | ★★★ | `apple-app-site-association` + `assetlinks.json` shipped |
| Spotlight indexing | ★★ | `src/services/spotlight.ts` already wired |

---

## Top-of-funnel keywords we're targeting

Ordered by combined volume × intent. All present in either the iOS
keyword field, Android short description, or both.

1. ai video maker / generator
2. text to video
3. faceless video
4. ai voice / text to speech
5. ai dubbing / video translator
6. auto captions / subtitle generator
7. ai voiceover
8. reels maker / shorts maker / tiktok maker
9. video editor with ai
10. podcast generator / voice cloning

**Forbidden** in the iOS keyword field: any competitor or model name
(`sora`, `veo`, `runway`, `elevenlabs`, `capcut`, `canva`, `descript`).
Apple rejects listings that use other brands, and Google demotes them.

---

## Off-store growth loops (highest leverage, $0 cost)

### A. Shareable artefacts
Every output the user generates carries a **subtle watermark + link** by
default on the free plan. Every share becomes an installation funnel.
Add this in `src/services/api.ts` when wiring real generation.

### B. SEO-optimised user pages
When a user makes a project public, we generate a public page at
`lumenstudio.app/u/<handle>/<slug>` with full Open Graph + JSON-LD. These
indexes accumulate over time — by month 12, this is typically the largest
organic channel for tools like ours.

### C. TikTok / YouTube Shorts loop
The same outputs your users post become free ads on the platforms with
the highest intent for your category. Watermark with the tool name (not
the brand — "made in Lumen Studio" reads as both).

### D. AI Search optimisation (new + huge)
Perplexity, ChatGPT and Claude all cite indexed web pages. The FAQ and
feature pages in `/site` are pre-formatted for citation:
- Question / answer pairs
- One concrete claim per paragraph
- Schema.org `FAQPage` markup
- Listed in `robots.txt` as explicitly allowed for `GPTBot`,
  `PerplexityBot`, `ClaudeBot`, `Google-Extended`.

When someone asks an LLM "what's the best AI video maker for iPhone?", the
LLM cites the highest-authority page with the cleanest claims. That's us.

---

## How the marketing site, store listing and app reinforce each other

```
                    ┌──────────────────────────┐
        Search →    │  lumenstudio.app/<page>  │
                    │  - keyword in URL        │
                    │  - JSON-LD               │
                    │  - Apple smart banner    │
                    └────────────┬─────────────┘
                                 │ tap
                  Universal Link │
                                 ▼
                    ┌──────────────────────────┐
                    │   Open Lumen Studio app  │
                    │   directly on that tool  │
                    └────────────┬─────────────┘
                                 │ generate
                                 ▼
                    ┌──────────────────────────┐
                    │   Share output to TikTok │
                    │   "made in Lumen Studio" │
                    └────────────┬─────────────┘
                                 │ click
                                 ▼
                       More searches ⟲
```

Universal Links (set up in `app.json`, `linking.ts`,
`/site/.well-known/apple-app-site-association`,
`/site/.well-known/assetlinks.json`) are what make the loop work.
**Without them, every web → app click bounces through the App Store.**
With them, the user lands on the exact tool the page advertised.

---

## Files to know

| File | Purpose |
| --- | --- |
| `store/ios/en-US/*` | Drop straight into App Store Connect (or fastlane deliver) |
| `store/android/en-US/*` | Drop into Play Console (or fastlane supply) |
| `site/index.html` | Marketing landing page with full SEO |
| `site/sitemap.xml` | Submit to Google Search Console + Bing |
| `site/robots.txt` | Lets Google, Apple, Perplexity, GPT, Claude crawl us |
| `site/manifest.webmanifest` | PWA + Android home-screen install metadata |
| `site/.well-known/apple-app-site-association` | iOS Universal Links |
| `site/.well-known/assetlinks.json` | Android App Links |
| `src/navigation/linking.ts` | In-app deep-link router |
| `src/services/spotlight.ts` | iOS Spotlight + Android App Indexing |
| `app.json` | Bundle IDs, associated domains, intent filters |

---

## Before you ship

Replace these placeholders in the files above:

- `id0000000000` → real App Store app ID (after first TestFlight submission)
- `TEAMID0000` → your Apple Developer Team ID
- `PLACEHOLDER:AA:BB:...` → SHA-256 fingerprint of your Play signing key
- `YOUR_PROMO_VIDEO_ID` → YouTube ID of your store listing promo
- `lumenstudio.app` everywhere → the domain you actually buy

That's it. Ship, listen, iterate.
