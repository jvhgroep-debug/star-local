import { IMAGES } from './images';

export const SITE = {
  name: 'Star Local',
  url: 'https://www.starlocal.nl',
  email: 'info@starlocal.nl',
  phone: '+31 6 84002350',
  phoneRaw: '+31684002350',
  whatsappUrl:
    'https://wa.me/31684002350?text=Hallo%20Star%20Local%2C%20ik%20wil%20graag%20meer%20informatie.',
  defaultDescription:
    'Star Local bouwt professionele websites en helpt bedrijven beter gevonden te worden in Google.',
  logo: IMAGES.logo,
  ogImage: IMAGES.heroHome,
} as const;

/** Website Builder entry — all marketing CTAs point here (OPDRACHT 81). */
export const FREE_WEBSITE_START_PATH = '/gratis-website/start/' as const;

export function canonical(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${normalized.endsWith('/') ? normalized : `${normalized}/`}`;
}
