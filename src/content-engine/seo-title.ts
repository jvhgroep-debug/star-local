import type { LocationContext } from './types';

/** Fixed SEO title pattern requested for the €199 offer city pages. */
export function buildSeoTitle(ctx: LocationContext): { title: string; variationId: number } {
  return {
    title: `Website laten maken ${ctx.city} voor €${ctx.offerPrice} | Star Local`,
    variationId: 0,
  };
}
