#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { marketing, app } = require('./domains');

const out = path.join(__dirname, '..', 'site', 'js', 'urls.js');
const body = `/** Auto-generated — edit scripts/domains.js or set LUMEN_* env vars, then npm run build:site */
window.LUMEN_URLS = {
  marketing: '${marketing.replace(/\/$/, '')}',
  app: '${app.replace(/\/$/, '')}',
};
`;

fs.writeFileSync(out, body);
console.log('✓ Wrote site/js/urls.js');
