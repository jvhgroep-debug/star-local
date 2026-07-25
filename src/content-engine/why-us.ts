import { getCityOfferProfile } from './profiles/nl-website-offer';
import type { LocationContext } from './types';

export function buildWhyUs(ctx: LocationContext): {
  heading: string;
  paragraphs: string[];
  points: string[];
  variationId: number;
} {
  const profile = getCityOfferProfile(ctx.citySlug);
  const sectors = profile?.sectorFocus ?? `lokale ondernemers in ${ctx.province}`;

  return {
    heading: `Waarom kiezen voor Star Local in ${ctx.city}?`,
    paragraphs: [
      `Ondernemers in ${ctx.city} hebben baat bij een website die lokaal herkenbaar is én technisch snel werkt. Wij bouwen die basis met een vaste actieprijs van €${ctx.offerPrice} excl. btw — zonder onduidelijke pakketten.`,
      `Of je actief bent in ${sectors}: we houden de scope overzichtelijk (maximaal vijf pagina’s) en stemmen teksten en structuur af op jouw bedrijf in ${ctx.province}.`,
    ],
    points: [
      `Vaste actieprijs van €${ctx.offerPrice} excl. btw`,
      `Gericht op ondernemers in ${ctx.city}`,
      'Mobielvriendelijk en snel',
      'Basis-SEO inbegrepen',
      'Later uitbreidbaar',
      'Persoonlijk digitaal contact',
    ],
    variationId: 0,
  };
}
