import { getServiceImagePath } from '../service-images';
import type { GemeenteServiceCard } from './types';

const GEMEENTE_SERVICE_DEFINITIONS: {
  slug: string;
  title: string;
  description: (naam: string) => string;
  imageAlt: (naam: string) => string;
}[] = [
  {
    slug: 'website-laten-maken',
    title: 'Website laten maken',
    description: (naam) =>
      `Maatwerk websites voor ondernemers in ${naam} — snel, professioneel en gericht op aanvragen.`,
    imageAlt: (naam) => `Website laten maken in ${naam} door Star Local`,
  },
  {
    slug: 'lokale-seo',
    title: 'Lokale SEO',
    description: (naam) =>
      `Beter gevonden worden in ${naam} met lokale content, structuur en een sterk Google-profiel.`,
    imageAlt: (naam) => `Lokale SEO ${naam} door Star Local`,
  },
  {
    slug: 'google-bedrijfsprofiel',
    title: 'Google Bedrijfsprofiel',
    description: (naam) =>
      `Optimalisatie van uw profiel voor Maps en lokale zoekresultaten in ${naam}.`,
    imageAlt: (naam) => `Google Bedrijfsprofiel optimalisatie ${naam}`,
  },
  {
    slug: 'webshop-laten-maken',
    title: 'Webshop laten maken',
    description: (naam) =>
      `Conversiegerichte webshops voor merken die online willen groeien vanuit ${naam}.`,
    imageAlt: (naam) => `Webshop laten maken in ${naam}`,
  },
  {
    slug: 'technische-seo',
    title: 'Technische SEO',
    description: () => 'Indexatie, snelheid en crawlbaarheid — het fundament onder uw vindbaarheid.',
    imageAlt: (naam) => `Technische SEO voor websites in ${naam}`,
  },
  {
    slug: 'conversie-optimalisatie',
    title: 'Conversie-optimalisatie',
    description: () => "Meer leads uit hetzelfde verkeer door betere pagina's en duidelijke CTA's.",
    imageAlt: (naam) => `Conversie-optimalisatie voor bedrijven in ${naam}`,
  },
  {
    slug: 'website-onderhoud',
    title: 'Hosting en onderhoud',
    description: () => 'Betrouwbare hosting en updates zodat uw site stabiel en actueel blijft.',
    imageAlt: (naam) => `Website hosting en onderhoud in ${naam}`,
  },
  {
    slug: 'ai-seo',
    title: 'AI SEO',
    description: () =>
      'Optimaliseer uw website en content voor moderne zoekervaringen met lokale relevantie.',
    imageAlt: () => 'AI SEO voor lokale bedrijven door Star Local',
  },
];

export function getGemeenteServices(naam: string): GemeenteServiceCard[] {
  return GEMEENTE_SERVICE_DEFINITIONS.map(({ slug, title, description, imageAlt }) => ({
    title,
    description: description(naam),
    href: `/diensten/${slug}/`,
    image: getServiceImagePath(slug),
    imageAlt: imageAlt(naam),
  }));
}
