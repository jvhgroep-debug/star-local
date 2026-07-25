import { getCityOfferProfile } from './profiles/nl-website-offer';
import { joinNames, pickIndex } from './hash';
import type { LocationContext } from './types';

function clampMeta(text: string, max = 158): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function buildMetaDescription(ctx: LocationContext): {
  description: string;
  ogDescription: string;
  variationId: number;
} {
  const profile = getCityOfferProfile(ctx.citySlug);
  const sectors = profile?.sectorFocus ?? `ondernemers in ${ctx.province}`;
  const nearby = joinNames(
    ctx.nearbyCities.slice(0, 2).map((n) => n.name),
    ctx.language,
  );

  const templates = [
    () =>
      `Website laten maken in ${ctx.city} voor €${ctx.offerPrice} excl. btw. Vijf pagina’s, mobiel ontwerp en basis-SEO voor ${sectors}.`,
    () =>
      `Professionele website in ${ctx.city} (${ctx.province}) vanaf €${ctx.offerPrice} excl. btw. Ideaal voor lokale ondernemers en bereik richting ${nearby}.`,
    () =>
      `Star Local bouwt in ${ctx.city} een snelle bedrijfswebsite met 5 pagina’s voor €${ctx.offerPrice} excl. btw — gericht op ${sectors}.`,
  ];

  const variationId = pickIndex(templates.length, `${ctx.citySlug}:meta`);
  const description = clampMeta(templates[variationId]!());
  const ogDescription = clampMeta(
    `Website laten maken in ${ctx.city}: 5 pagina’s, mobiel ontwerp en basis-SEO voor €${ctx.offerPrice} excl. btw.`,
    140,
  );

  return { description, ogDescription, variationId };
}
