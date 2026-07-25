import { SITE } from '../data/site';
import type { ContentCta, LocationContext } from './types';

export function buildCta(ctx: LocationContext): { cta: ContentCta; variationId: number } {
  const contactHref = `/contact/?onderwerp=${encodeURIComponent(`Website laten maken ${ctx.city}`)}`;
  const whatsappHref = `https://wa.me/${SITE.phoneRaw.replace('+', '')}?text=${encodeURIComponent(
    `Hallo Star Local, ik wil graag een website laten maken in ${ctx.city} (€${ctx.offerPrice} excl. btw).`,
  )}`;

  return {
    cta: {
      primaryLabel: 'Start mijn website',
      primaryHref: contactHref,
      secondaryLabel: 'Bekijk wat inbegrepen is',
      secondaryHref: '#wat-krijg-je',
      whatsappHref,
      contactNote: 'Geen ingewikkelde pakketten. Duidelijke afspraken en een vaste prijs.',
      heading: `Een professionele website laten maken in ${ctx.city}?`,
      body: `Laat jouw bedrijf professioneel online presenteren met een moderne website van vijf pagina’s voor €${ctx.offerPrice} excl. btw.`,
    },
    variationId: 0,
  };
}
