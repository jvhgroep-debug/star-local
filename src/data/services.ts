import { IMAGES } from './images';
import { getServiceImagePath } from './service-images';
import type { Locale } from '../i18n/config';
import { servicesEn } from '../i18n/data/services.en';

export interface FAQ {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  positioning: string;
  image: string;
  imageAlt: string;
  benefits: string[];
  approach: { title: string; text: string }[];
  whyUs: string[];
  relatedSlugs: string[];
  faqs: FAQ[];
}

const defaultWhyUs = [
  'Persoonlijke begeleiding van strategie tot oplevering',
  'Focus op vindbaarheid, snelheid en conversie',
  'Heldere communicatie en meetbare verbeteringen',
];

export const services: Service[] = [
  {
    slug: 'website-laten-maken',
    title: 'Website laten maken | Star Local',
    description:
      'Laat een professionele, snelle en goed vindbare website maken door Star Local. Vertrouwen wekken en meer aanvragen genereren.',
    h1: 'Website laten maken',
    intro:
      'Een sterke website is het fundament van uw online groei. Star Local ontwerpt en bouwt professionele websites die snel laden, vertrouwen wekken en bezoekers omzetten in klanten.',
    positioning:
      'Professionele, snelle en goed vindbare websites die vertrouwen wekken en aanvragen opleveren.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Professioneel webdesign door Star Local',
    benefits: [
      'Modern design dat past bij uw merk',
      'Snelle laadtijden en mobiele optimalisatie',
      'Duidelijke structuur voor betere vindbaarheid',
      'Conversiegerichte pagina’s en call-to-actions',
    ],
    approach: [
      { title: 'Kennismaking', text: 'We bespreken uw doelen, doelgroep en gewenste uitstraling.' },
      { title: 'Structuur & design', text: 'We bepalen pagina-opbouw, content en visuele richting.' },
      { title: 'Ontwikkeling', text: 'We bouwen een snelle, veilige website met sterke basis-SEO.' },
      { title: 'Lancering', text: 'Na controle en optimalisatie gaat uw website live.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['lokale-seo', 'technische-seo', 'website-onderhoud'],
    faqs: [
      { question: 'Hoe lang duurt het om een website te laten maken?', answer: 'Dat hangt af van omvang en functionaliteiten. Na een kennismaking ontvangt u een heldere planning.' },
      { question: 'Kunnen jullie ook content verzorgen?', answer: 'Ja, we ondersteunen bij professionele content en SEO-teksten waar nodig.' },
    ],
  },
  {
    slug: 'webshop-laten-maken',
    title: 'Webshop laten maken | Star Local',
    description:
      'Star Local bouwt conversiegerichte webshops met een snelle gebruikerservaring en duidelijke productstructuur.',
    h1: 'Webshop laten maken',
    intro:
      'Een succesvolle webshop vraagt om meer dan een mooi design. Star Local combineert gebruiksvriendelijkheid, technische kwaliteit en vindbaarheid om online verkopen te stimuleren.',
    positioning:
      'Conversiegerichte webshops met een snelle gebruikerservaring en een duidelijke productstructuur.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Webshop ontwikkeling door Star Local',
    benefits: ['Overzichtelijke productstructuur', 'Snelle checkout-ervaring', 'Mobiel geoptimaliseerd', 'Technische basis voor groei'],
    approach: [
      { title: 'Analyse', text: 'We brengen assortiment, doelgroep en verkoopdoelen in kaart.' },
      { title: 'UX & design', text: 'We ontwerpen een webshop die vertrouwen wekt en converteert.' },
      { title: 'Bouw & integraties', text: 'We realiseren betalingen, voorraad en essentiële koppelingen.' },
      { title: 'Optimalisatie', text: 'We verbeteren snelheid, vindbaarheid en conversie na livegang.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['shopify-ontwikkeling', 'conversie-optimalisatie', 'technische-seo'],
    faqs: [
      { question: 'Welke webshop-platformen ondersteunen jullie?', answer: 'We werken onder meer met Shopify en maatwerkoplossingen, afhankelijk van uw wensen.' },
    ],
  },
  {
    slug: 'lokale-seo',
    title: 'Lokale SEO | Star Local',
    description:
      'Verbeter uw lokale vindbaarheid in Google met Star Local. Meer klanten uit uw regio via gerichte SEO.',
    h1: 'Lokale SEO',
    intro:
      'Wilt u vaker gevonden worden door klanten in uw regio? Met lokale SEO verbetert Star Local uw zichtbaarheid in Google Maps en lokale zoekresultaten.',
    positioning: 'Betere zichtbaarheid voor lokale zoekopdrachten en klanten uit de regio.',
    image: IMAGES.serviceLocalSeo,
    imageAlt: 'Lokale SEO voor betere vindbaarheid in de regio',
    benefits: ['Sterkere positie in lokale zoekresultaten', 'Betere Google Bedrijfsprofiel-integratie', 'Meer relevante bezoekers uit de regio', 'Meetbare groei in zichtbaarheid'],
    approach: [
      { title: 'Lokale analyse', text: 'We onderzoeken zoekgedrag en concurrentie in uw regio.' },
      { title: 'Optimalisatie', text: 'We verbeteren pagina’s, content en lokale signalen.' },
      { title: 'Monitoring', text: 'We volgen resultaten en sturen bij waar nodig.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['google-bedrijfsprofiel', 'landelijke-seo', 'seo-audit'],
    faqs: [
      { question: 'Voor welke bedrijven is lokale SEO geschikt?', answer: 'Voor bedrijven die klanten in een specifieke regio of stad willen bereiken.' },
    ],
  },
  {
    slug: 'landelijke-seo',
    title: 'Landelijke SEO | Star Local',
    description:
      'Schaalbare SEO-strategie voor bedrijven die in meerdere steden en regio’s in Nederland gevonden willen worden.',
    h1: 'Landelijke SEO',
    intro:
      'Wilt u groeien buiten uw directe regio? Star Local helpt met een schaalbare SEO-strategie voor landelijke vindbaarheid.',
    positioning:
      'Een schaalbare SEO-strategie waarmee bedrijven in meerdere steden, regio’s en heel Nederland gevonden kunnen worden.',
    image: IMAGES.heroSeo,
    imageAlt: 'Landelijke SEO-strategie voor online groei',
    benefits: ['Strategie voor meerdere regio’s', 'Schaalbare contentstructuur', 'Technische SEO-basis', 'Doorlopende optimalisatie'],
    approach: [
      { title: 'Strategie', text: 'We bepalen prioritaire regio’s, zoekwoorden en paginastructuur.' },
      { title: 'Uitvoering', text: 'We bouwen en optimaliseren pagina’s en interne koppelingen.' },
      { title: 'Groei', text: 'We monitoren prestaties en schalen succesvolle onderdelen op.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['lokale-seo', 'linkbuilding', 'ai-content'],
    faqs: [
      { question: 'Wat is het verschil met lokale SEO?', answer: 'Landelijke SEO richt zich op bredere geografische dekking en schaalbare groei.' },
    ],
  },
  {
    slug: 'ai-seo',
    title: 'AI SEO | Star Local',
    description:
      'Optimaliseer uw website en content voor moderne zoekervaringen met de AI SEO-aanpak van Star Local.',
    h1: 'AI SEO',
    intro:
      'Zoekgedrag verandert. Star Local helpt uw website en content te optimaliseren voor moderne zoekmachines en AI-zoekervaringen — met focus op kwaliteit en merkconsistentie.',
    positioning:
      'Websites en content optimaliseren voor moderne zoekmachines en AI-zoekervaringen.',
    image: IMAGES.heroSeo,
    imageAlt: 'AI SEO optimalisatie voor moderne zoekervaringen',
    benefits: ['Content afgestemd op moderne zoekintentie', 'Heldere en betrouwbare informatiearchitectuur', 'Menselijke kwaliteitscontrole', 'Betere zichtbaarheid op meerdere kanalen'],
    approach: [
      { title: 'Analyse', text: 'We beoordelen huidige content, structuur en zoekintentie.' },
      { title: 'Optimalisatie', text: 'We verbeteren pagina’s, antwoorden en technische signalen.' },
      { title: 'Bewaking', text: 'We volgen prestaties en passen de strategie aan.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['ai-content', 'technische-seo', 'landelijke-seo'],
    faqs: [
      { question: 'Vervangt AI SEO traditionele SEO?', answer: 'Nee, het is een aanvulling die helpt bij moderne zoekervaringen en contentkwaliteit.' },
    ],
  },
  {
    slug: 'google-bedrijfsprofiel',
    title: 'Google Bedrijfsprofiel | Star Local',
    description:
      'Maximale zichtbaarheid in Google Maps en lokale zoekresultaten met optimalisatie van uw Google Bedrijfsprofiel.',
    h1: 'Google Bedrijfsprofiel',
    intro:
      'Uw Google Bedrijfsprofiel is vaak het eerste contactmoment met nieuwe klanten. Star Local optimaliseert uw profiel voor maximale lokale zichtbaarheid.',
    positioning: 'Betere zichtbaarheid in Google Maps en lokale zoekresultaten.',
    image: IMAGES.heroGoogleBusiness,
    imageAlt: 'Google Bedrijfsprofiel optimalisatie door Star Local',
    benefits: ['Compleet en betrouwbaar profiel', 'Betere lokale rankings', 'Meer vertrouwen bij zoekers', 'Consistente bedrijfsinformatie'],
    approach: [
      { title: 'Audit', text: 'We controleren profiel, categorieën, foto’s en reviews.' },
      { title: 'Optimalisatie', text: 'We verbeteren content, diensten en lokale signalen.' },
      { title: 'Beheer', text: 'We helpen met updates en doorlopende verbetering.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['lokale-seo', 'reviews', 'seo-audit'],
    faqs: [
      { question: 'Kunnen jullie helpen met reviewbeheer?', answer: 'We adviseren over structuur en communicatie rond reviews, zonder onrealistische beloftes.' },
    ],
  },
  {
    slug: 'website-onderhoud',
    title: 'Website onderhoud | Star Local',
    description:
      'Betrouwbaar website onderhoud: updates, beveiliging, snelheid en doorlopende verbeteringen door Star Local.',
    h1: 'Website onderhoud',
    intro:
      'Een website vereist continu onderhoud. Star Local zorgt voor updates, beveiliging, monitoring en doorlopende verbeteringen zodat uw site betrouwbaar blijft.',
    positioning: 'Updates, beveiliging, snelheid, monitoring en doorlopende verbeteringen.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Website onderhoud en technische optimalisatie',
    benefits: ['Regelmatige updates', 'Beveiligingsmonitoring', 'Snelheidsoptimalisatie', 'Technische support'],
    approach: [
      { title: 'Inventarisatie', text: 'We brengen huidige status en risico’s in kaart.' },
      { title: 'Onderhoudsplan', text: 'We stellen een helder onderhoudsschema op.' },
      { title: 'Uitvoering', text: 'We voeren updates en verbeteringen door.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['hosting', 'technische-seo', 'website-snelheid-optimaliseren'],
    faqs: [
      { question: 'Is onderhoud maandelijks mogelijk?', answer: 'Ja, we bieden doorlopend onderhoud op basis van uw behoefte.' },
    ],
  },
  {
    slug: 'hosting',
    title: 'Hosting | Star Local',
    description: 'Snelle, veilige en betrouwbare hosting voor uw website via Star Local.',
    h1: 'Hosting',
    intro: 'Betrouwbare hosting is essentieel voor prestaties en veiligheid. Star Local biedt snelle en veilige hostingoplossingen afgestemd op uw website.',
    positioning: 'Snelle, veilige en betrouwbare hosting.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Betrouwbare website hosting',
    benefits: ['Snelle servers', 'SSL en beveiliging', 'Monitoring', 'Technische ondersteuning'],
    approach: [
      { title: 'Advies', text: 'We bepalen de juiste hostingomgeving voor uw project.' },
      { title: 'Setup', text: 'We configureren domein, DNS en beveiliging.' },
      { title: 'Beheer', text: 'We monitoren prestaties en beschikbaarheid.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['domeinnaam-registratie', 'website-onderhoud', 'website-snelheid-optimaliseren'],
    faqs: [{ question: 'Kunnen jullie bestaande hosting migreren?', answer: 'Ja, we begeleiden migraties zorgvuldig om downtime te beperken.' }],
  },
  {
    slug: 'domeinnaam-registratie',
    title: 'Domeinnaam registratie | Star Local',
    description: 'Hulp bij domeinregistratie, DNS-configuratie en beveiliging door Star Local.',
    h1: 'Domeinnaam registratie',
    intro: 'Star Local helpt bij het kiezen, registreren en correct koppelen van uw domeinnaam, inclusief DNS en beveiliging.',
    positioning: 'Hulp bij registratie, koppeling, DNS en beveiliging.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Domeinnaam registratie en DNS-beheer',
    benefits: ['Advies bij domeinkeuze', 'Correcte DNS-configuratie', 'Beveiligingsinstellingen', 'Koppeling met website en e-mail'],
    approach: [
      { title: 'Selectie', text: 'We adviseren over geschikte domeinnamen.' },
      { title: 'Registratie', text: 'We regelen registratie en eigendom.' },
      { title: 'Koppeling', text: 'We koppelen domein aan website en diensten.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['hosting', 'website-laten-maken', 'website-onderhoud'],
    faqs: [{ question: 'Beheren jullie ook DNS-records?', answer: 'Ja, we helpen bij correcte DNS-instellingen en updates.' }],
  },
  {
    slug: 'shopify-ontwikkeling',
    title: 'Shopify ontwikkeling | Star Local',
    description: 'Professionele Shopify-webshops met SEO, structuur en conversieoptimalisatie door Star Local.',
    h1: 'Shopify ontwikkeling',
    intro: 'Star Local bouwt professionele Shopify-webshops met sterke structuur, vindbaarheid en conversiegerichte opzet.',
    positioning: 'Professionele Shopify-webshops met SEO, structuur en conversieoptimalisatie.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Shopify webshop ontwikkeling',
    benefits: ['Professioneel Shopify-design', 'SEO-vriendelijke structuur', 'Snelle performance', 'Conversiegerichte opzet'],
    approach: [
      { title: 'Setup', text: 'We configureren thema, structuur en basisinstellingen.' },
      { title: 'Ontwikkeling', text: 'We bouwen productpagina’s, collecties en checkout-flow.' },
      { title: 'Optimalisatie', text: 'We verbeteren snelheid, SEO en conversie.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['webshop-laten-maken', 'conversie-optimalisatie', 'technische-seo'],
    faqs: [{ question: 'Kunnen jullie bestaande Shopify-shops verbeteren?', answer: 'Ja, we optimaliseren bestaande shops op design, snelheid en vindbaarheid.' }],
  },
  {
    slug: 'wordpress-ontwikkeling',
    title: 'WordPress ontwikkeling | Star Local',
    description: 'Professionele WordPress-oplossingen voor bestaande klanten en specifieke projecten.',
    h1: 'WordPress ontwikkeling',
    intro: 'Voor bestaande WordPress-omgevingen en specifieke projecten biedt Star Local professionele ontwikkeling, optimalisatie en onderhoud.',
    positioning:
      'Professionele WordPress-oplossingen voor bestaande klanten, zonder WordPress als standaard voor alle nieuwe projecten te presenteren.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'WordPress ontwikkeling en optimalisatie',
    benefits: ['Maatwerk binnen WordPress', 'Performance-optimalisatie', 'Beveiligingsverbeteringen', 'Doorlopend onderhoud'],
    approach: [
      { title: 'Analyse', text: 'We beoordelen thema, plugins en technische status.' },
      { title: 'Verbetering', text: 'We optimaliseren structuur, snelheid en veiligheid.' },
      { title: 'Beheer', text: 'We bieden onderhoud en doorontwikkeling.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['website-onderhoud', 'technische-seo', 'website-laten-maken'],
    faqs: [{ question: 'Is WordPress altijd de beste keuze?', answer: 'Niet altijd. We adviseren het platform dat het beste past bij uw doelen.' }],
  },
  {
    slug: 'technische-seo',
    title: 'Technische SEO | Star Local',
    description: 'Verbeter indexeerbaarheid, structuur, snelheid en structured data met technische SEO van Star Local.',
    h1: 'Technische SEO',
    intro: 'Technische SEO vormt de basis van online vindbaarheid. Star Local verbetert indexeerbaarheid, site-structuur, snelheid en structured data.',
    positioning: 'Verbeter indexeerbaarheid, structuur, snelheid, structured data en technische kwaliteit.',
    image: IMAGES.heroSeo,
    imageAlt: 'Technische SEO analyse en optimalisatie',
    benefits: ['Betere crawlbaarheid', 'Sterke site-architectuur', 'Structured data', 'Performanceverbetering'],
    approach: [
      { title: 'Technische audit', text: 'We analyseren indexatie, structuur en performance.' },
      { title: 'Implementatie', text: 'We lossen technische knelpunten op.' },
      { title: 'Validatie', text: 'We controleren resultaten en borgen kwaliteit.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['seo-audit', 'website-snelheid-optimaliseren', 'lokale-seo'],
    faqs: [{ question: 'Wat valt onder technische SEO?', answer: 'Onder meer indexatie, redirects, structured data, sitemaps en Core Web Vitals.' }],
  },
  {
    slug: 'website-snelheid-optimaliseren',
    title: 'Website snelheid optimaliseren | Star Local',
    description: 'Verbeter Core Web Vitals, laadtijd en gebruikerservaring met snelheidsoptimalisatie door Star Local.',
    h1: 'Website snelheid optimaliseren',
    intro: 'Snelle websites scoren beter en converteren meer. Star Local optimaliseert afbeeldingen, code, caching en laadtijd.',
    positioning: 'Core Web Vitals, afbeeldingen, code, caching en laadtijd.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Website snelheid en performance optimalisatie',
    benefits: ['Betere Core Web Vitals', 'Snellere laadtijd', 'Lagere bounce rate', 'Betere gebruikerservaring'],
    approach: [
      { title: 'Meting', text: 'We analyseren huidige performance en knelpunten.' },
      { title: 'Optimalisatie', text: 'We verbeteren assets, code en caching.' },
      { title: 'Monitoring', text: 'We bewaken prestaties na optimalisatie.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['technische-seo', 'website-onderhoud', 'hosting'],
    faqs: [{ question: 'Hoe snel merk ik verschil?', answer: 'Veel verbeteringen zijn direct meetbaar na implementatie.' }],
  },
  {
    slug: 'seo-audit',
    title: 'SEO Audit | Star Local',
    description: 'Uitgebreide SEO-audit van techniek, content, interne links en groeikansen door Star Local.',
    h1: 'SEO Audit',
    intro: 'Weet u waar uw grootste SEO-kansen liggen? Star Local voert een grondige audit uit van techniek, content en groeikansen.',
    positioning: 'Analyse van techniek, content, interne links, zoekwoorden en groeikansen.',
    image: IMAGES.heroSeo,
    imageAlt: 'SEO audit en groeikansen analyse',
    benefits: ['Helder overzicht van knelpunten', 'Prioriteitenlijst met acties', 'Technische en contentanalyse', 'Concrete vervolgstappen'],
    approach: [
      { title: 'Scan', text: 'We analyseren techniek, content en concurrentie.' },
      { title: 'Rapportage', text: 'U ontvangt een helder overzicht met prioriteiten.' },
      { title: 'Plan', text: 'We stellen een uitvoerbaar verbeterplan op.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['technische-seo', 'lokale-seo', 'linkbuilding'],
    faqs: [{ question: 'Wat ontvang ik na een SEO-audit?', answer: 'Een overzicht van bevindingen, prioriteiten en aanbevolen vervolgstappen.' }],
  },
  {
    slug: 'conversie-optimalisatie',
    title: 'Conversie optimalisatie | Star Local',
    description: 'Meer aanvragen en verkopen uit bestaande bezoekers met conversieoptimalisatie door Star Local.',
    h1: 'Conversie optimalisatie',
    intro: 'Meer bezoekers is pas waardevol als ze converteren. Star Local optimaliseert pagina’s, formulieren en customer journeys voor meer resultaat.',
    positioning: 'Meer aanvragen en verkopen uit bestaande bezoekers.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Conversie optimalisatie voor meer aanvragen',
    benefits: ['Betere call-to-actions', 'Geoptimaliseerde formulieren', 'Duidelijkere proposities', 'Meer leads uit hetzelfde verkeer'],
    approach: [
      { title: 'Analyse', text: 'We bekijken gedrag, knelpunten en drop-off momenten.' },
      { title: 'Testen', text: 'We verbeteren pagina’s en conversie-elementen.' },
      { title: 'Optimalisatie', text: 'We implementeren succesvolle verbeteringen structureel.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['website-laten-maken', 'webshop-laten-maken', 'ai-content'],
    faqs: [{ question: 'Werkt CRO ook voor bestaande websites?', answer: 'Ja, vaak levert optimalisatie op bestaande verkeer snel winst op.' }],
  },
  {
    slug: 'linkbuilding',
    title: 'Linkbuilding | Star Local',
    description: 'Kwalitatieve autoriteit en relevante verwijzingen met professionele linkbuilding door Star Local.',
    h1: 'Linkbuilding',
    intro: 'Autoriteit blijft een belangrijk SEO-signaal. Star Local helpt met relevante, kwalitatieve verwijzingen die passen bij uw merk en sector.',
    positioning: 'Kwalitatieve autoriteit en relevante verwijzingen.',
    image: IMAGES.heroSeo,
    imageAlt: 'Linkbuilding en online autoriteit opbouwen',
    benefits: ['Relevante verwijzingen', 'Merkversterkende samenwerkingen', 'Duurzame autoriteitsopbouw', 'Strategische prioritering'],
    approach: [
      { title: 'Strategie', text: 'We bepalen relevante bronnen en kansen.' },
      { title: 'Uitvoering', text: 'We realiseren kwalitatieve verwijzingen.' },
      { title: 'Monitoring', text: 'We volgen impact en passen aan.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['landelijke-seo', 'seo-audit', 'ai-content'],
    faqs: [{ question: 'Hoe lang duurt linkbuilding?', answer: 'Autoriteitsopbouw is een doorlopend proces met resultaten op middellange termijn.' }],
  },
  {
    slug: 'ai-content',
    title: 'AI Content | Star Local',
    description: 'Professionele contentondersteuning met menselijke kwaliteitscontrole en merkconsistentie door Star Local.',
    h1: 'AI Content',
    intro: 'Goede content blijft cruciaal voor vindbaarheid. Star Local ondersteunt contentcreatie met professionele kwaliteitscontrole en merkconsistentie.',
    positioning: 'Professionele contentondersteuning met menselijke kwaliteitscontrole en merkconsistentie.',
    image: IMAGES.heroSeo,
    imageAlt: 'Professionele content en SEO-teksten',
    benefits: ['SEO-gerichte content', 'Merkconsistente tone of voice', 'Menselijke eindcontrole', 'Schaalbare contentproductie'],
    approach: [
      { title: 'Strategie', text: 'We bepalen onderwerpen, structuur en doelen.' },
      { title: 'Productie', text: 'We creëren en optimaliseren content.' },
      { title: 'Controle', text: 'We borgen kwaliteit en merkconsistentie.' },
    ],
    whyUs: defaultWhyUs,
    relatedSlugs: ['ai-seo', 'landelijke-seo', 'lokale-seo'],
    faqs: [{ question: 'Is alle content volledig geautomatiseerd?', answer: 'Nee, menselijke controle en merkafstemming zijn altijd onderdeel van het proces.' }],
  },
];

const servicesByLocale: Record<Locale, Service[]> = {
  nl: services,
  en: servicesEn,
};

function withServiceImage(service: Service): Service {
  return {
    ...service,
    image: getServiceImagePath(service.slug),
  };
}

export function getServices(locale: Locale): Service[] {
  return servicesByLocale[locale].map(withServiceImage);
}

export function getService(slug: string, locale: Locale = 'nl'): Service | undefined {
  return getServices(locale).find((s) => s.slug === slug);
}
