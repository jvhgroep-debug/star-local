import { getEconomicTraits } from './context';
import { pickIndex, pickMany } from './hash';
import type { ContentServiceItem, LocationContext } from './types';

export function buildServices(ctx: LocationContext): {
  heading: string;
  intro: string;
  items: ContentServiceItem[];
  variationId: number;
} {
  const traits = pickMany(getEconomicTraits(ctx.province), `${ctx.citySlug}:svc-traits`, 2);

  const headings = [
    `Diensten voor ondernemers in ${ctx.city}`,
    `Wat we voor bedrijven in ${ctx.city} kunnen betekenen`,
    `Website en online groei in ${ctx.city}`,
  ];

  const intros = [
    `Voor ondernemers in ${ctx.city} starten we met een sterke basiswebsite. Daarna kun je uitbreiden met SEO of conversie-optimalisatie wanneer je klaar bent voor de volgende stap.`,
    `Het basispakket in ${ctx.city} dekt de kern: presentatie, contact en vindbaarheid. Extra diensten zetten we alleen in als ze écht bijdragen aan resultaat in ${ctx.province}.`,
    `Of je in ${traits[0]} of ${traits[1]} actief bent: de opbouw blijft praktisch. Eerst een goede website, daarna gerichte groei.`,
  ];

  const itemSets: ContentServiceItem[][] = [
    [
      {
        title: 'Website laten maken',
        text: `Een professionele basiswebsite met maximaal vijf pagina’s, afgestemd op jouw bedrijf in ${ctx.city}. Inclusief responsive ontwerp en basis-SEO.`,
      },
      {
        title: 'Lokale SEO',
        text: `Technische en contentmatige basis zodat je beter vindbaar wordt op zoekopdrachten rond ${ctx.city} en ${ctx.province}.`,
      },
      {
        title: 'Conversie-optimalisatie',
        text: 'Duidelijke CTA’s, contactroutes en pagina-opbouw die bezoekers sneller laten reageren.',
      },
      {
        title: 'Doorontwikkeling',
        text: `Later uitbreiden met extra diensten, blog of locatiepagina’s — handig als je groeit buiten ${ctx.city}.`,
      },
    ],
    [
      {
        title: `Bedrijfswebsite ${ctx.city}`,
        text: `Home, over, diensten, FAQ/projecten en contact — klaar voor mobiel gebruik in postcodegebied ${ctx.postalCodes}.`,
      },
      {
        title: 'Basis zoekmachineoptimalisatie',
        text: 'Titels, meta descriptions, snelle laadtijd en een logische URL-structuur vanaf de start.',
      },
      {
        title: 'Contact & WhatsApp',
        text: `Laagdrempelig contact voor klanten uit ${ctx.city} en omliggende gemeenten.`,
      },
      {
        title: 'Hosting-advies',
        text: 'We adviseren over domein en hosting zodat je technisch stabiel live gaat.',
      },
    ],
  ];

  const variationId = pickIndex(headings.length, `${ctx.citySlug}:services`);
  const itemsId = pickIndex(itemSets.length, `${ctx.citySlug}:service-items`);

  if (ctx.language === 'en') {
    return {
      heading: `Services for businesses in ${ctx.city}`,
      intro: `We start with a solid website foundation in ${ctx.city}, then expand with SEO or conversion work when you are ready.`,
      items: itemSets[0]!,
      variationId,
    };
  }

  return {
    heading: headings[variationId]!,
    intro: intros[pickIndex(intros.length, `${ctx.citySlug}:svc-intro`)]!,
    items: itemSets[itemsId]!,
    variationId,
  };
}
