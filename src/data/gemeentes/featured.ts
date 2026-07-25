import gemeentes from '../gemeentes.json';

export const FEATURED_GEMEENTEN = [
  { slug: 'amsterdam', naam: 'Amsterdam' },
  { slug: 'rotterdam', naam: 'Rotterdam' },
  { slug: 'utrecht', naam: 'Utrecht' },
  { slug: 'breda', naam: 'Breda' },
  { slug: 'eindhoven', naam: 'Eindhoven' },
  { slug: 'groningen', naam: 'Groningen' },
] as const;

export const GEMEENTE_OVERVIEW_HREF = '/sitemap/#gemeenten';

export function getMunicipalityCount(): number {
  return gemeentes.length;
}
