/**
 * Public URLs + brand for the two-site setup (marketing + app).
 * Override with LUMEN_* or EXPO_PUBLIC_* env vars on Vercel.
 */
module.exports = {
  marketing:
    process.env.LUMEN_MARKETING_URL ||
    process.env.EXPO_PUBLIC_MARKETING_URL ||
    'https://makefacelessvideos.com',
  app:
    process.env.LUMEN_APP_URL ||
    process.env.EXPO_PUBLIC_APP_URL ||
    'https://app.makefacelessvideos.com',
  brand: 'Make Faceless Videos',
  supportEmail: 'hello@makefacelessvideos.com',
  privacyEmail: 'privacy@makefacelessvideos.com',
};
