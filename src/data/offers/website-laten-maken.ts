/**
 * Shared package content for the €199 Website laten maken offer
 * (national + city test pages).
 */
export const WEBSITE_OFFER_IMAGES = {
  /** Hero for /website-laten-maken/ only — never used on city pages. */
  hero: {
    filename: 'hero-website-laten-maken.png',
    path: '/images/offers/hero-website-laten-maken.webp',
    webpPath: '/images/offers/hero-website-laten-maken.webp',
    fallbackPath: '/images/offers/hero-website-laten-maken.jpg',
    description:
      'Een fotorealistische professionele ondernemer die achter een laptop werkt in een modern, licht kantoor. Warme, zakelijke uitstraling. Geen tekst, logo’s, kaders of grafische elementen in de afbeelding.',
    width: 1600,
    height: 1200,
    ratio: '4:3',
    alt: 'Ondernemer werkt aan een professionele bedrijfswebsite',
  },
  /**
   * Hero for /website-laten-maken/[city]/ only — not used on the national offer page.
   */
  cityHero: {
    filename: 'hero-website-laten-maken.png',
    path: '/images/offers/gemeente/hero-website-laten-maken.webp',
    fallbackPath: '/images/offers/gemeente/hero-website-laten-maken.jpg',
    description:
      'Laptop met professionele bedrijfswebsite op een donker bureau met Star Local branding.',
    width: 1400,
    height: 1050,
    ratio: '4:3',
  },
  /** CTA shared by national + city pages. */
  cta: {
    filename: 'cta-website-laten-maken.png',
    path: '/images/offers/cta-website-laten-maken.png',
    webpPath: '/images/offers/cta-website-laten-maken.webp',
    fallbackPath: '/images/offers/cta-website-laten-maken.jpg',
    description:
      'Een professionele close-up van een laptop met een moderne website, gecombineerd met een smartphone. Fris, zakelijk en betrouwbaar. Geen tekst en geen logo in de afbeelding.',
    width: 1600,
    height: 900,
    ratio: '16:9',
    alt: 'Professionele website laten maken voor ondernemers.',
  },
  og: {
    filename: 'og-website-laten-maken.png',
    path: '/images/offers/og-website-laten-maken.png',
    description:
      'Professionele merkafbeelding van Star Local voor de dienst Website laten maken. Geen lange tekst in de afbeelding.',
    width: 1200,
    height: 630,
    ratio: '1.91:1',
  },
} as const;

/** Only the three Location Engine test cities — no links to non-generated city routes. */
export const WEBSITE_OFFER_CITY_LINKS = [
  { label: 'Website laten maken Amsterdam', href: '/website-laten-maken/amsterdam/' },
  { label: 'Website laten maken Rotterdam', href: '/website-laten-maken/rotterdam/' },
  { label: 'Website laten maken Breda', href: '/website-laten-maken/breda/' },
] as const;

export const WEBSITE_OFFER_TRUST = [
  '5 professionele pagina’s',
  'Mobielvriendelijk ontwerp',
  'Basis-SEO inbegrepen',
  'Snelle laadtijd',
  'Persoonlijk contact',
] as const;

export const WEBSITE_OFFER_INCLUDED = [
  {
    title: 'Vijf professionele pagina’s',
    text: 'Een complete website met maximaal vijf pagina’s, afgestemd op jouw bedrijf en diensten.',
  },
  {
    title: 'Responsive ontwerp',
    text: 'De website werkt goed op mobiel, tablet en desktop.',
  },
  {
    title: 'Basis zoekmachineoptimalisatie',
    text: 'We verzorgen de belangrijkste technische SEO-instellingen, paginatitels, meta descriptions en een logische paginastructuur.',
  },
  {
    title: 'Contactmogelijkheden',
    text: 'Duidelijke contactknoppen, een contactformulier en indien gewenst een WhatsApp-knop.',
  },
  {
    title: 'Snelle website',
    text: 'De website wordt gebouwd met moderne technologie en zonder onnodig zware onderdelen.',
  },
  {
    title: 'Professionele uitstraling',
    text: 'Een ontwerp dat past bij jouw bedrijf, huisstijl en doelgroep.',
  },
] as const;

export const WEBSITE_OFFER_FIVE_PAGES = [
  { title: 'Home', text: 'Een duidelijke introductie van jouw bedrijf met voordelen en call-to-action.' },
  { title: 'Over ons', text: 'Kennismaken met jouw bedrijf, werkwijze en verhaal.' },
  { title: 'Diensten', text: 'Een overzichtelijke presentatie van jouw diensten of producten.' },
  {
    title: 'Projecten of veelgestelde vragen',
    text: 'Een pagina die vertrouwen versterkt met voorbeelden of antwoorden.',
  },
  { title: 'Contact', text: 'Bedrijfsgegevens, contactformulier en bereikbaarheid via WhatsApp.' },
] as const;

export const WEBSITE_OFFER_STEPS = [
  {
    title: 'Kennismaking',
    text: 'We bespreken jouw bedrijf, doelgroep, wensen en benodigde pagina’s.',
  },
  {
    title: 'Aanleveren',
    text: 'Je levert het logo, de teksten, contactgegevens en beschikbare foto’s aan.',
  },
  {
    title: 'Ontwerp en bouw',
    text: 'Wij bouwen de website en zorgen dat deze goed werkt op mobiel en desktop.',
  },
  {
    title: 'Controle en oplevering',
    text: 'Je bekijkt de website, geeft feedback en na goedkeuring zetten we hem live.',
  },
] as const;

export const WEBSITE_OFFER_NOT_INCLUDED = [
  'domeinnaam',
  'hosting',
  'betaalde software of externe abonnementen',
  'uitgebreide webshops',
  'maatwerk boekingssystemen',
  'complexe koppelingen',
  'professionele fotografie',
  'grote hoeveelheden tekstschrijven',
  'extra pagina’s buiten het pakket',
] as const;

export const WEBSITE_OFFER_WHY = [
  'Ervaring met websites voor lokale ondernemers',
  'Moderne en snelle techniek',
  'Gericht op mobiel gebruik',
  'Heldere communicatie',
  'Mogelijkheid om later uit te breiden',
  'SEO als onderdeel van de websitestructuur',
] as const;

export const WEBSITE_OFFER_FAQS = [
  {
    question: 'Wat kost een website laten maken?',
    answer:
      'Een professionele basiswebsite met maximaal vijf pagina’s kost tijdens deze actie €199 excl. btw. Eventuele extra wensen worden vooraf besproken.',
  },
  {
    question: 'Wat krijg ik voor €199?',
    answer:
      'Je krijgt een professionele website met maximaal vijf pagina’s, responsive ontwerp, basis-SEO, contactmogelijkheden en een snelle technische basis.',
  },
  {
    question: 'Is hosting inbegrepen?',
    answer:
      'Hosting en een domeinnaam zijn niet standaard bij de actieprijs inbegrepen. We kunnen je wel adviseren of helpen met de technische inrichting.',
  },
  {
    question: 'Kan ik later extra pagina’s toevoegen?',
    answer:
      'Ja. De website wordt zo gebouwd dat deze later kan worden uitgebreid met extra diensten, locaties, blogs of andere functies.',
  },
  {
    question: 'Moet ik zelf teksten en foto’s aanleveren?',
    answer:
      'Je kunt bestaande teksten en foto’s aanleveren. Wanneer je hulp nodig hebt met aanvullende content, bespreken we vooraf wat daarvoor nodig is.',
  },
  {
    question: 'Is de website geschikt voor mobiele telefoons?',
    answer:
      'Ja. Iedere website wordt responsive gebouwd en gecontroleerd op mobiel, tablet en desktop.',
  },
  {
    question: 'Hoe snel kan mijn website klaar zijn?',
    answer:
      'De planning hangt af van de aanlevering van de inhoud en de omvang van de opdracht. Na ontvangst van alle informatie spreken we een duidelijke oplevertermijn af.',
  },
  {
    question: 'Werken jullie door heel Nederland?',
    answer:
      'Ja. Wij werken volledig digitaal en bouwen websites voor ondernemers in alle Nederlandse gemeenten. Daarnaast werken we ook internationaal.',
  },
] as const;
