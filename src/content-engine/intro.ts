import { getCityOfferProfile } from './profiles/nl-website-offer';
import type { LocationContext } from './types';

export function buildIntro(ctx: LocationContext): { intro: string; variationId: number } {
  const profile = getCityOfferProfile(ctx.citySlug);
  if (profile) {
    return { intro: profile.localIntro, variationId: 0 };
  }

  return {
    intro: `Op zoek naar een website laten maken in ${ctx.city}? Star Local helpt ondernemers in ${ctx.province} met een snelle, moderne website van vijf pagina’s voor €${ctx.offerPrice} excl. btw.`,
    variationId: 1,
  };
}
