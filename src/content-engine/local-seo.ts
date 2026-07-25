import { getCityOfferProfile } from './profiles/nl-website-offer';
import { joinNames } from './hash';
import type { LocationContext } from './types';

export function buildLocalSeo(ctx: LocationContext): {
  heading: string;
  paragraphs: string[];
  variationId: number;
} {
  const profile = getCityOfferProfile(ctx.citySlug);
  const nearby = joinNames(
    ctx.nearbyCities.slice(0, 3).map((n) => n.name),
    'nl',
  );
  const phrases = profile?.searchPhrases?.slice(0, 2).join('” of “') ?? `website laten maken ${ctx.city}`;

  return {
    heading: `Website laten maken voor ondernemers in ${ctx.city}`,
    paragraphs: profile?.localArticle ?? [
      `Voor ondernemers in ${ctx.city} (${ctx.province}) is een professionele website belangrijk om gevonden te worden en vertrouwen te wekken. Met vijf pagina’s voor €${ctx.offerPrice} excl. btw zet je een duidelijke online basis neer.`,
      `Omliggende gemeenten zoals ${nearby} laten zien dat bereik vaak regionaal is. Een snelle, mobielvriendelijke site helpt je om ook die bezoekers goed te bedienen.`,
      `Zoektermen als “${phrases}” horen bij lokale intentie. Wij bouwen een structuur met basis-SEO, zodat jouw pagina’s klaar zijn voor die zoekvragen zonder overoptimalisatie.`,
    ],
    variationId: profile ? 0 : 1,
  };
}
