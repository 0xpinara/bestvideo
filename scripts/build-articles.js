#!/usr/bin/env node
/**
 * Static article generator for Lumen Studio.
 *
 * Reads `scripts/articles.json` (the catalog), wraps each entry's HTML body
 * in the shared layout template, and writes /site/articles/<slug>.html.
 *
 * Each page is a fully indexable static HTML file with full SEO meta,
 * BreadcrumbList + Article JSON-LD, and the same Ghibli look as the rest
 * of the site.
 *
 * Run with:  node scripts/build-articles.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES = require('./articles.json');
const OUT = path.join(ROOT, 'site', 'articles');
fs.mkdirSync(OUT, { recursive: true });

const ACCENT_CLASSES = {
  sky: 'sky', meadow: 'meadow', peach: 'peach', lavender: 'lavender',
  rose: 'rose', amber: 'amber', terra: 'terra',
};

function tpl(article, prevNext) {
  const url = `https://lumenstudio.app/articles/${article.slug}.html`;
  const safeBody = article.body.replace(/\n\n/g, '\n');
  const accent = ACCENT_CLASSES[article.accent] || 'terra';

  const breadcrumbs = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Lumen Studio', item: 'https://lumenstudio.app/' },
      { '@type': 'ListItem', position: 2, name: 'Tutorials', item: 'https://lumenstudio.app/articles/' },
      { '@type': 'ListItem', position: 3, name: article.title, item: url },
    ],
  });

  const articleJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    author: { '@type': 'Organization', name: 'Lumen Studio' },
    publisher: { '@type': 'Organization', name: 'Lumen Studio', logo: 'https://lumenstudio.app/assets/icon-512.png' },
    image: 'https://lumenstudio.app/assets/og-cover.png',
    datePublished: article.published || '2026-05-25',
    dateModified: article.updated || article.published || '2026-05-25',
    mainEntityOfPage: url,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
<meta name="theme-color" content="#FAF4EC" />
<title>${escapeHtml(article.title)} · Lumen Studio</title>
<meta name="description" content="${escapeHtml(article.description)}" />
<meta name="keywords" content="${escapeHtml(article.keywords.join(', '))}" />
<meta name="robots" content="index,follow,max-image-preview:large" />
<link rel="canonical" href="${url}" />
<link rel="stylesheet" href="/css/style.css" />
<link rel="stylesheet" href="/css/anim.css" />

<meta property="og:type" content="article" />
<meta property="og:title" content="${escapeHtml(article.title)}" />
<meta property="og:description" content="${escapeHtml(article.description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="https://lumenstudio.app/assets/og-cover.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(article.title)}" />
<meta name="twitter:description" content="${escapeHtml(article.description)}" />

<script type="application/ld+json">${breadcrumbs}</script>
<script type="application/ld+json">${articleJson}</script>
</head>
<body>

<header class="site-header">
  <div class="inner">
    <a class="brand" href="/">
      <span class="brand-mark">L</span>
      <span>Lumen Studio</span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="/#tools">Tools</a>
      <a href="/articles/">Learn</a>
      <a href="/#pricing">Pricing</a>
      <a class="btn btn-ghost" href="/login.html">Sign in</a>
      <a class="btn btn-primary" href="/signup.html">Get started</a>
    </nav>
  </div>
</header>

<!-- Header art -->
<section style="padding: 56px 0 36px; position: relative; overflow: hidden;">
  <img src="/assets/svg/cloud.svg" alt="" class="anim-drift parallax" data-depth="0.15"
       style="position:absolute; top: 24px; left: -30px; width: 200px; opacity: 0.55;"/>
  <img src="/assets/svg/cloud.svg" alt="" class="anim-drift-rev parallax" data-depth="0.10"
       style="position:absolute; top: 110px; right: -20px; width: 160px; opacity: 0.45;"/>
  <span class="sparkle" style="position:absolute; top: 90px; left: 12%;"></span>

  <div class="narrow" style="position: relative;">
    <p class="article-meta fade-up" style="margin-bottom: 14px;">
      <a href="/articles/" style="color: var(--ink-muted);">Tutorials</a>
      <span style="color: var(--ink-faint);">›</span>
      <span style="color: var(--ink-muted);">${escapeHtml(article.category)}</span>
    </p>
    <h1 class="fade-up delay-1" style="font-family: var(--serif); font-size: clamp(34px, 5vw, 50px); line-height: 1.1; letter-spacing: -0.3px;">${escapeHtml(article.title)}</h1>
    <p class="lede fade-up delay-2" style="margin-top: 12px;">${escapeHtml(article.description)}</p>

    <div class="row fade-up delay-3" style="margin-top: 22px; gap: 8px; flex-wrap: wrap; align-items: center;">
      <div class="icon-badge ${accent}" style="width: 38px; height: 38px; margin-bottom: 0;">
        <svg width="20" height="20"><use href="/assets/svg/icons.svg#${article.icon}"/></svg>
      </div>
      <span class="chip dot">${escapeHtml(article.level)}</span>
      <span class="chip">${article.readMins} min read</span>
      <span class="chip">Updated ${escapeHtml(article.updated || '2026-05-25')}</span>
    </div>
  </div>
</section>

<!-- Body -->
<article class="narrow article-body fade-up" style="padding-bottom: 80px;">
${article.body}
</article>

<!-- Prev / Next -->
<section class="narrow tight" style="padding-top: 24px; border-top: 1px solid var(--hairline);">
  <div class="row" style="justify-content: space-between; gap: 16px; flex-wrap: wrap;">
    ${prevNext.prev ? `<a class="btn btn-secondary" href="/articles/${prevNext.prev.slug}.html">← ${escapeHtml(prevNext.prev.title)}</a>` : '<span></span>'}
    ${prevNext.next ? `<a class="btn btn-primary" href="/articles/${prevNext.next.slug}.html">${escapeHtml(prevNext.next.title)} →</a>` : ''}
  </div>
</section>

<!-- Try it CTA -->
<section style="padding: 32px 0 80px;">
  <div class="narrow">
    <div class="card fade-up" style="background: linear-gradient(135deg, var(--peach-tint), var(--peach)); border: none; text-align: center; padding: 36px;">
      <h2 style="color: var(--terracotta-deep); margin-bottom: 6px;">Try it now.</h2>
      <p style="color: var(--terracotta-deep); opacity: 0.85; max-width: 50ch; margin: 0 auto 22px;">
        The fastest way to learn is to make. Open Lumen Studio and try the steps above on your own footage.
      </p>
      <a class="btn btn-primary btn-lg" href="/signup.html">Start free in 20 seconds</a>
    </div>
  </div>
</section>

<footer class="site-footer">
  <div class="wrap">
    <div class="cols">
      <div>
        <a class="brand" href="/" style="margin-bottom: 14px;">
          <span class="brand-mark">L</span>
          <span>Lumen Studio</span>
        </a>
        <p class="subtle" style="max-width: 36ch; margin-top: 12px;">A whole video studio, gently in your pocket.</p>
      </div>
      <div><h4>Product</h4><a href="/#tools">Tools</a><a href="/#pricing">Pricing</a><a href="/articles/">Tutorials</a></div>
      <div><h4>Company</h4><a href="#">About</a><a href="/legal/support.html">Support</a></div>
      <div><h4>Legal</h4><a href="/legal/privacy.html">Privacy</a><a href="/legal/terms.html">Terms</a></div>
    </div>
    <div class="copy">
      <p>© <span data-year>2026</span> Lumen Studio.</p>
      <p><a href="/login.html">Sign in</a> · <a href="/signup.html">Get started</a></p>
    </div>
  </div>
</footer>

<script src="/js/anim.js" defer></script>
</body>
</html>
`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

ARTICLES.forEach((art, i) => {
  const prev = i > 0 ? ARTICLES[i - 1] : null;
  const next = i < ARTICLES.length - 1 ? ARTICLES[i + 1] : null;
  const html = tpl(art, { prev, next });
  fs.writeFileSync(path.join(OUT, `${art.slug}.html`), html, 'utf8');
});

console.log(`✓ Wrote ${ARTICLES.length} articles to ${OUT}`);
