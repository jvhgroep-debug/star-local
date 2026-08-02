import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://www.starlocal.nl',
  output: 'static',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CONTACT_TO_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
  redirects: {
    '/privacybeleid/': '/privacy/',
    '/cookiebeleid/': '/cookies/',
    '/algemene-voorwaarden/': '/voorwaarden/',
    '/en/privacy-policy/': '/en/privacy/',
    '/en/cookie-policy/': '/en/cookies/',
    '/website-laten-maken-breda': '/website-laten-maken/',
    '/website-laten-maken-breda/': '/website-laten-maken/',
    // Option 2: alias / plaats cleanup → canonieke SEO-slugs
    '/website-laten-maken/beek-l': '/website-laten-maken/beek/',
    '/website-laten-maken/beek-l/': '/website-laten-maken/beek/',
    '/website-laten-maken/hengelo-o': '/website-laten-maken/hengelo/',
    '/website-laten-maken/hengelo-o/': '/website-laten-maken/hengelo/',
    '/website-laten-maken/laren-nh': '/website-laten-maken/laren/',
    '/website-laten-maken/laren-nh/': '/website-laten-maken/laren/',
    '/website-laten-maken/middelburg-z': '/website-laten-maken/middelburg/',
    '/website-laten-maken/middelburg-z/': '/website-laten-maken/middelburg/',
    '/website-laten-maken/rijswijk-zh': '/website-laten-maken/rijswijk/',
    '/website-laten-maken/rijswijk-zh/': '/website-laten-maken/rijswijk/',
    '/website-laten-maken/stein-l': '/website-laten-maken/stein/',
    '/website-laten-maken/stein-l/': '/website-laten-maken/stein/',
    '/website-laten-maken/gerwen-en-nederwetten': '/website-laten-maken/nuenen/',
    '/website-laten-maken/gerwen-en-nederwetten/': '/website-laten-maken/nuenen/',
  },
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/dashboard') &&
        !page.includes('/login') &&
        !page.includes('/check-email') &&
        !page.includes('/auth/') &&
        !page.includes('/logout'),
    }),
  ],
});
