import type { Locale } from './config';

export type RouteKey =
  | 'home'
  | 'services'
  | 'service'
  | 'portfolio'
  | 'portfolioItem'
  | 'projects'
  | 'contact'
  | 'about'
  | 'approach'
  | 'pricing'
  | 'reviews'
  | 'blog'
  | 'sitemap'
  | 'privacy'
  | 'cookies'
  | 'terms'
  | 'disclaimer'
  | 'notFound';

const paths: Record<RouteKey, Record<Locale, string>> = {
  home: { nl: '/', en: '/en/' },
  services: { nl: '/diensten/', en: '/en/services/' },
  service: { nl: '/diensten/{slug}/', en: '/en/services/{slug}/' },
  portfolio: { nl: '/portfolio/', en: '/en/portfolio/' },
  portfolioItem: { nl: '/portfolio/{slug}/', en: '/en/portfolio/{slug}/' },
  projects: { nl: '/projecten/', en: '/en/projects/' },
  contact: { nl: '/contact/', en: '/en/contact/' },
  about: { nl: '/over-ons/', en: '/en/about/' },
  approach: { nl: '/werkwijze/', en: '/en/approach/' },
  pricing: { nl: '/tarieven/', en: '/en/pricing/' },
  reviews: { nl: '/reviews/', en: '/en/reviews/' },
  blog: { nl: '/blog/', en: '/en/blog/' },
  sitemap: { nl: '/sitemap/', en: '/en/sitemap/' },
  privacy: { nl: '/privacybeleid/', en: '/en/privacy-policy/' },
  cookies: { nl: '/cookiebeleid/', en: '/en/cookie-policy/' },
  terms: { nl: '/algemene-voorwaarden/', en: '/en/terms/' },
  disclaimer: { nl: '/disclaimer/', en: '/en/disclaimer/' },
  notFound: { nl: '/404', en: '/en/404' },
};

export function route(key: RouteKey, locale: Locale, params?: { slug?: string }): string {
  let path = paths[key][locale];
  if (params?.slug) path = path.replace('{slug}', params.slug);
  return path;
}

const nlToKey: [RegExp, RouteKey, (m: RegExpMatchArray) => { slug?: string } | undefined][] = [
  [/^\/$/, 'home', () => undefined],
  [/^\/diensten\/([^/]+)\/$/, 'service', (m) => ({ slug: m[1] })],
  [/^\/diensten\/$/, 'services', () => undefined],
  [/^\/portfolio\/([^/]+)\/$/, 'portfolioItem', (m) => ({ slug: m[1] })],
  [/^\/portfolio\/$/, 'portfolio', () => undefined],
  [/^\/projecten\/$/, 'projects', () => undefined],
  [/^\/contact\/$/, 'contact', () => undefined],
  [/^\/over-ons\/$/, 'about', () => undefined],
  [/^\/werkwijze\/$/, 'approach', () => undefined],
  [/^\/tarieven\/$/, 'pricing', () => undefined],
  [/^\/reviews\/$/, 'reviews', () => undefined],
  [/^\/blog\/$/, 'blog', () => undefined],
  [/^\/sitemap\/$/, 'sitemap', () => undefined],
  [/^\/privacybeleid\/$/, 'privacy', () => undefined],
  [/^\/cookiebeleid\/$/, 'cookies', () => undefined],
  [/^\/algemene-voorwaarden\/$/, 'terms', () => undefined],
  [/^\/disclaimer\/$/, 'disclaimer', () => undefined],
];

const enToKey: [RegExp, RouteKey, (m: RegExpMatchArray) => { slug?: string } | undefined][] = [
  [/^\/en\/?$/, 'home', () => undefined],
  [/^\/en\/services\/([^/]+)\/$/, 'service', (m) => ({ slug: m[1] })],
  [/^\/en\/services\/$/, 'services', () => undefined],
  [/^\/en\/portfolio\/([^/]+)\/$/, 'portfolioItem', (m) => ({ slug: m[1] })],
  [/^\/en\/portfolio\/$/, 'portfolio', () => undefined],
  [/^\/en\/projects\/$/, 'projects', () => undefined],
  [/^\/en\/contact\/$/, 'contact', () => undefined],
  [/^\/en\/about\/$/, 'about', () => undefined],
  [/^\/en\/approach\/$/, 'approach', () => undefined],
  [/^\/en\/pricing\/$/, 'pricing', () => undefined],
  [/^\/en\/reviews\/$/, 'reviews', () => undefined],
  [/^\/en\/blog\/$/, 'blog', () => undefined],
  [/^\/en\/sitemap\/$/, 'sitemap', () => undefined],
  [/^\/en\/privacy-policy\/$/, 'privacy', () => undefined],
  [/^\/en\/cookie-policy\/$/, 'cookies', () => undefined],
  [/^\/en\/terms\/$/, 'terms', () => undefined],
  [/^\/en\/disclaimer\/$/, 'disclaimer', () => undefined],
];

function matchRoute(pathname: string, table: typeof nlToKey): { key: RouteKey; params?: { slug?: string } } | null {
  for (const [regex, key, paramsFn] of table) {
    const match = pathname.match(regex);
    if (match) return { key, params: paramsFn(match) };
  }
  return null;
}

export function getLocaleFromPath(pathname: string): Locale {
  return pathname.startsWith('/en') ? 'en' : 'nl';
}

export function translatePath(pathname: string, targetLocale: Locale): string {
  const currentLocale = getLocaleFromPath(pathname);
  if (currentLocale === targetLocale) return pathname;

  const table = currentLocale === 'nl' ? nlToKey : enToKey;
  const matched = matchRoute(pathname, table);
  if (matched) return route(matched.key, targetLocale, matched.params);

  if (targetLocale === 'en') return '/en/';
  return '/';
}
