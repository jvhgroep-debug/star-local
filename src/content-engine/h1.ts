import type { LocationContext } from './types';

export function buildH1(ctx: LocationContext): { h1: string; eyebrow: string; heroSubtitle: string; variationId: number } {
  return {
    h1: `Website laten maken in ${ctx.city} voor €${ctx.offerPrice}`,
    eyebrow: `Website voor ondernemers in ${ctx.city}`,
    heroSubtitle: `Een moderne, snelle en mobielvriendelijke website met vijf professionele pagina’s voor ondernemers in ${ctx.city} en omgeving.`,
    variationId: 0,
  };
}
