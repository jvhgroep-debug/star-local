import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.starlocal.nl',
  redirects: {
    '/privacybeleid/': '/privacy/',
    '/cookiebeleid/': '/cookies/',
    '/algemene-voorwaarden/': '/voorwaarden/',
    '/en/privacy-policy/': '/en/privacy/',
    '/en/cookie-policy/': '/en/cookies/',
  },
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap()],
});
