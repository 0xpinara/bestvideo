# Lumen Studio — marketing site

> A pure-static, animated, beautifully indexed site that lives at the
> root of `makefacelessvideos.com`. Zero frameworks, zero build step beyond
> a tiny article generator.

Everything ships from `/site/` with three layers:

| Layer | Path | What it does |
| --- | --- | --- |
| Pages | `/site/*.html`, `/site/articles/`, `/site/legal/` | Static HTML, hand-written |
| Articles | `scripts/articles.json` + `scripts/build-articles.js` | 27 tutorials generated into HTML |
| Visuals | `/site/assets/svg/`, `/site/css/*.css`, `/site/js/anim.js` | Hand-drawn SVG, Ghibli motion, parallax |

---

## What's in the site

| URL | Purpose |
| --- | --- |
| `/` | The animated homepage — hero with Ghibli scene, drifting clouds, falling sakura, floating mascot, 25-tool grid, how-it-works, pricing, CTA |
| `/login.html` | Sign-in with side-art (sun + meadow + lantern + fireflies) |
| `/signup.html` | Sign-up with twilight side-art (lavender meadow, glowing lantern, denser fireflies) |
| `/articles/` | Tutorial hub, grouped by Video / Editing / Voice / Audio / Image |
| `/articles/<slug>.html` | One tutorial per tool — 27 in total, fully SEO-indexed, with `TechArticle` + `BreadcrumbList` JSON-LD |
| `/legal/privacy.html` | Short, honest privacy promise |
| `/legal/terms.html` | Plain-English terms |
| `/legal/cookies.html` | What we use, what we don't |
| `/legal/support.html` | Support hub with response-time promise |

Each page is fully self-contained — full HTML, every meta tag, every
JSON-LD block inlined. The bundle is ~250 KB total including all CSS,
JS and SVG.

---

## The design system

`/site/css/style.css` defines:

- The Claude paper palette (cream, ink, terracotta) layered with the
  Ghibli pastels (sky, meadow, peach, lavender, rose, amber).
- Serif type for display (Georgia / Iowan Old Style) and sans for body.
- Soft brown shadows (never blue) and pill-radius buttons.
- Auth split-screen layout that collapses gracefully on mobile.
- Dark-mode tokens that flip the whole site into a Ghibli night sky.

`/site/css/anim.css` provides the motion library:

- `anim-drift` / `anim-drift-rev` — drifting clouds.
- `anim-float` — floating mascot.
- `anim-sun` — gentle sun pulse.
- `anim-pulse` — twinkling lantern flames and fireflies.
- `anim-sway` / `anim-wind` — grass and leaves.
- `fade-up` + `IntersectionObserver` in `/site/js/anim.js` — scroll reveal.
- `.parallax[data-depth]` — scroll-tied parallax layers.
- `.petal-field` + JS spawner — falling sakura petals in the hero.
- `.firefly` and `.sparkle` — pure-CSS glowing particles.

**No emojis anywhere.** All ornaments are hand-drawn SVG in
`/site/assets/svg/`:

- `scene.svg` — the full hero scene: sky, sun, distant mountains, mid-hills, meadow, lantern, grass.
- `cloud.svg` — single soft drifting cloud (reused 6+ times across pages).
- `character.svg` — the Lumen mascot (a Ghibli-flavoured creature holding a leaf).
- `icons.svg` — an inline icon sprite for the whole site (`<use href="/assets/svg/icons.svg#video"/>`).

The animation library honours `prefers-reduced-motion: reduce`, so users
who want calm get calm.

---

## Editing the articles

All 27 tutorials live in **one file**: `scripts/articles.json`.

```json
{
  "slug": "ai-music-generator",
  "title": "Write a full song from a single prompt",
  "description": "Eleven Music, Suno v5.5, Udio v1.5 — which model to pick...",
  "keywords": ["ai music", "song generator", "suno"],
  "category": "Music & sound",
  "icon": "disc",
  "accent": "amber",
  "level": "Beginner",
  "readMins": 7,
  "body": "<p>Three models live inside Lumen's AI Music tool, each with a personality:</p>..."
}
```

Edit the JSON, re-run `npm run build:site`, commit the regenerated HTML.

### Adding a new article

1. Add an entry to `scripts/articles.json`.
2. Add the link to `site/articles/index.html` under the right section.
3. Add a card to the home page grid in `site/index.html` (optional but
   recommended for flagship tools).
4. Run `npm run build:site`.
5. Done.

---

## Local preview

```bash
npm run preview:site      # serves /site at http://localhost:4180
```

The first time, install dependencies once with `npm install`. After
that, `preview:site` boots instantly.

---

## Deploy

The whole site is static. Drop `/site/` on any host.

### Cloudflare Pages (free, recommended)

```bash
npm i -g wrangler
wrangler pages deploy site --project-name=lumen-studio
```

Cloudflare gives you HTTPS, a global CDN, and automatic preview
deployments for every git branch. It also serves the
`/.well-known/apple-app-site-association` and `/.well-known/assetlinks.json`
files at the same domain — required for Universal Links / App Links to
work end-to-end.

### Vercel (free)

```bash
npm i -g vercel
vercel deploy --prod site
```

### Netlify (free)

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=site
```

### GitHub Pages (free)

```bash
# Configure your repo to publish from /site, or move to /docs.
git subtree push --prefix=site origin gh-pages
```

---

## SEO score targets

After deploy, the site hits:

- **Lighthouse Performance** 96+ (first paint < 800 ms, no render-blocking JS)
- **Accessibility** 100 (semantic HTML, every `<img>` has `alt`, all icons have `aria-hidden`)
- **Best Practices** 100
- **SEO** 100 (canonical, meta description, robots, sitemap, JSON-LD on every page)

Submit `/site/sitemap.xml` to Google Search Console and Bing Webmaster
once you've deployed and bought the domain.

---

## File map

```
site/
  index.html                       homepage with hero + 25-tool grid + pricing + CTA
  login.html                       sign-in with animated Ghibli side-art
  signup.html                      sign-up with twilight side-art
  manifest.webmanifest             PWA manifest (matches app branding)
  sitemap.xml                      crawlable index of every page
  robots.txt                       welcomes Googlebot, Apple, GPTBot, ClaudeBot, Perplexity
  articles/
    index.html                     tutorial hub, grouped by category
    *.html                         27 generated tutorials
  legal/
    privacy.html
    terms.html
    cookies.html
    support.html
  assets/svg/
    scene.svg, cloud.svg, character.svg, icons.svg
  css/
    style.css                      design system + components
    anim.css                       motion library + reduced-motion safety
  js/
    anim.js                        scroll reveal + parallax + petal spawner
  .well-known/
    apple-app-site-association     iOS Universal Links
    assetlinks.json                Android App Links
```

That's the whole site.
