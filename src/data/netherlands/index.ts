import municipalitiesData from './municipalities.json';
import type { Municipality } from './types';

export type { Municipality, MunicipalityNeighbor } from './types';

export const municipalities = municipalitiesData as Municipality[];

const bySlug = new Map(municipalities.map((item) => [item.slug, item]));

export function getAllMunicipalities(): Municipality[] {
  return municipalities;
}

export function getMunicipality(slug: string): Municipality | undefined {
  return bySlug.get(slug);
}

export function requireMunicipality(slug: string): Municipality {
  const municipality = getMunicipality(slug);
  if (!municipality) {
    throw new Error(`Municipality not found: ${slug}`);
  }
  return municipality;
}

export function formatPopulation(value: number): string {
  return new Intl.NumberFormat('nl-NL').format(value);
}
