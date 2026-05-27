# Deploy on Vercel (two projects, $0)

Industry-standard split: **fast marketing HTML** on your main domain, **React app** on a subdomain.

| Project | Vercel name (example) | Root | Build | Output | Domain |
|--------|------------------------|------|-------|--------|--------|
| 1 — Marketing | `makefacelessvideos-marketing` | `site` | *(empty)* | `.` | `makefacelessvideos.com` |
| 2 — Web app | `makefacelessvideos-app` | `./` | `npm run build:web` | `dist` | `app.makefacelessvideos.com` |

---

## Before you deploy

Edit **`scripts/domains.js`** (or set Vercel env on both projects):

- `EXPO_PUBLIC_MARKETING_URL` = `https://makefacelessvideos.com`
- `EXPO_PUBLIC_APP_URL` = `https://app.makefacelessvideos.com`

Then run `npm run build:site` and push.

Then push to GitHub; both projects redeploy automatically.

---

## Project 1 — Marketing (traffic + SEO)

1. [vercel.com/new](https://vercel.com/new) → Import **`0xpinara/bestvideo`**
2. Name: `makefacelessvideos-marketing`
3. **Root Directory:** `site`
4. **Build Command:** leave empty
5. **Output Directory:** `.`
6. Deploy → **Settings → Domains** → add `makefacelessvideos.com` (or your domain)

---

## Project 2 — Web app (Studio + tools)

1. **Add New → Project** → import the **same** repo again
2. Name: `makefacelessvideos-app`
3. **Root Directory:** `./` (repo root)
4. **Build Command:** `npm run build:web`
5. **Output Directory:** `dist`
6. **Environment variables:** `EXPO_PUBLIC_MARKETING_URL`, `EXPO_PUBLIC_APP_URL` (see above)
7. Deploy → **Settings → Domains** → add `app.makefacelessvideos.com`

---

## DNS (at your registrar)

| Type | Name | Value |
|------|------|--------|
| A or CNAME | `@` | Vercel shows the target for Project 1 |
| CNAME | `app` | Vercel shows the target for Project 2 |

---

## How links connect

- Marketing **Sign in / Get started** → `app.yourdomain.com` (via `site/js/bridge.js`)
- App **Profile → Website** → main domain (via `src/config/urls.ts`)
- Deep links in the app use `app.yourdomain.com/ai-video-maker`, etc. (`src/navigation/linking.ts`)

Articles and homepage stay on the main domain so Google indexes lightweight HTML.
