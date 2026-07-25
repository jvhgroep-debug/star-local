import { getCityOfferProfile } from './profiles/nl-website-offer';
import type { ContentFaqItem, LocationContext } from './types';

export function buildFaq(ctx: LocationContext): { faqs: ContentFaqItem[]; variationId: number } {
  const profile = getCityOfferProfile(ctx.citySlug);
  const sectors = profile?.sectorFocus ?? `ondernemers in ${ctx.province}`;

  const faqs: ContentFaqItem[] = [
    {
      question: `Wat kost een website laten maken in ${ctx.city}?`,
      answer: `Tijdens deze actie kost een professionele basiswebsite met maximaal vijf pagina’s €${ctx.offerPrice} excl. btw. Extra wensen voor jouw bedrijf in ${ctx.city} bespreken we altijd vooraf.`,
    },
    {
      question: 'Wat krijg ik voor €199?',
      answer: `Je krijgt een professionele website met maximaal vijf pagina’s, responsive ontwerp, basis-SEO, contactmogelijkheden en een snelle technische basis — afgestemd op jouw uitstraling in ${ctx.city}.`,
    },
    {
      question: `Werken jullie alleen in ${ctx.city}?`,
      answer: `Nee. We helpen ondernemers in ${ctx.city} en daarbuiten. Het traject verloopt digitaal, dus ook bedrijven elders in ${ctx.province} of Nederland kunnen meedoen. Wel maken we de content lokaal relevant voor ${ctx.city}.`,
    },
    {
      question: 'Is de website mobielvriendelijk?',
      answer: `Ja. Iedere website wordt responsive gebouwd en gecontroleerd op mobiel, tablet en desktop — belangrijk omdat veel klanten in ${ctx.city} eerst via hun telefoon zoeken.`,
    },
    {
      question: 'Kan ik later pagina’s toevoegen?',
      answer: `Ja. De basis in ${ctx.city} is zo opgezet dat je later kunt uitbreiden met extra diensten, projecten, blogs of locatiepagina’s wanneer dat nodig is.`,
    },
    {
      question: 'Hoe snel kan mijn website klaar zijn?',
      answer: `Dat hangt af van hoe snel logo, teksten en contactgegevens compleet zijn. Na ontvangst van alle informatie spreken we een duidelijke oplevertermijn af voor jouw website in ${ctx.city}.`,
    },
    {
      question: `Voor welke ondernemers in ${ctx.city} is dit pakket geschikt?`,
      answer: `Het pakket past goed bij ${sectors}. Het is bedoeld als sterke basiswebsite, niet als complexe webshop of maatwerkplatform.`,
    },
  ];

  return { faqs, variationId: 0 };
}
