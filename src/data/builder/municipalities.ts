import gemeentes from '../gemeentes.json';

export interface BuilderMunicipality {
  naam: string;
  slug: string;
  provincie: string;
}

export const BUILDER_MUNICIPALITIES: BuilderMunicipality[] = gemeentes as BuilderMunicipality[];

export function filterMunicipalities(query: string): BuilderMunicipality[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return BUILDER_MUNICIPALITIES;

  return BUILDER_MUNICIPALITIES.filter(
    (item) =>
      item.naam.toLowerCase().includes(normalized) ||
      item.provincie.toLowerCase().includes(normalized) ||
      item.slug.includes(normalized),
  );
}

export function findMunicipalityBySlug(slug: string): BuilderMunicipality | undefined {
  return BUILDER_MUNICIPALITIES.find((item) => item.slug === slug);
}
