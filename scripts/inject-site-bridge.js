#!/usr/bin/env node
/** Adds urls.js + bridge.js to static HTML pages under site/. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');
const SNIPPET =
  '<script src="/js/urls.js"></script>\n<script src="/js/bridge.js" defer></script>\n';

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

let n = 0;
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('/js/bridge.js')) continue;
  if (!html.includes('</body>')) continue;
  html = html.replace('</body>', SNIPPET + '</body>');
  fs.writeFileSync(file, html);
  n++;
}
console.log(`✓ Injected bridge scripts into ${n} HTML files`);
