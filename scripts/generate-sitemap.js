#!/usr/bin/env node
/** Writes site/sitemap.xml from real pages under site/ (marketing domain only). */
const fs = require('fs');
const path = require('path');
const { marketing, brand } = require('./domains');

const SITE = path.join(__dirname, '..', 'site');
const BASE = marketing.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/login.html', priority: '0.5', changefreq: 'monthly' },
  { path: '/signup.html', priority: '0.8', changefreq: 'monthly' },
  { path: '/articles/', priority: '0.9', changefreq: 'weekly' },
  { path: '/legal/privacy.html', priority: '0.3', changefreq: 'yearly' },
  { path: '/legal/terms.html', priority: '0.3', changefreq: 'yearly' },
  { path: '/legal/cookies.html', priority: '0.3', changefreq: 'yearly' },
  { path: '/legal/support.html', priority: '0.5', changefreq: 'monthly' },
];

for (const name of fs.readdirSync(path.join(SITE, 'articles'))) {
  if (name.endsWith('.html') && name !== 'index.html') {
    pages.push({ path: `/articles/${name}`, priority: '0.85', changefreq: 'monthly' });
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${BASE}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(SITE, 'sitemap.xml'), xml);
console.log(`✓ Wrote sitemap.xml (${pages.length} URLs) for ${brand}`);
