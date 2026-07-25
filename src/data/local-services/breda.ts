import type { LocalServicePageContent, LocalServiceNeighbor, LocalServiceRelated } from './types';
import {
  BREDA_LOCAL_SERVICE_SLUGS,
  getLocalServiceImagePath,
  getLocalServicePath,
  LOCAL_TO_NATIONAL_SLUG,
} from './config';

const CITY = 'Breda';
const CITY_SLUG = 'breda';
const PROVINCE = 'Noord-Brabant';

export const BREDA_SHARED = {
  districts: [
    'Centrum',
    'Ginneken',
    'Princenhage',
    'Belcrum',
    'Haagse Beemden',
    'Brabantpark',
    'IJpelaar',
    'Breda-Noord',
    'Minervum',
    'Hazeldonk',
  ],
  neighbors: [
    { naam: 'Etten-Leur', slug: 'etten-leur' },
    { naam: 'Oosterhout', slug: 'oosterhout' },
    { naam: 'Tilburg', slug: 'tilburg' },
    { naam: 'Zundert', slug: 'zundert' },
    { naam: 'Drimmelen', slug: 'drimmelen' },
    { naam: 'Roosendaal', slug: 'roosendaal' },
  ] satisfies LocalServiceNeighbor[],
  industries: [
    'horeca',
    'winkels',
    'beauty',
    'bouw en installatie',
    'makelaars',
    'zakelijke dienstverlening',
    'transport en logistiek',
    'coaches',
    'zorg',
    'creatieve bedrijven',
  ],
};

const BREDA_NEIGHBORS = BREDA_SHARED.neighbors;

const CTA = {
  primaryLabel: 'Gratis advies aanvragen',
  secondaryLabel: 'Bekijk onze werkwijze',
} as const;

function related(slug: string, title: string, description: string): LocalServiceRelated {
  return {
    title,
    href: getLocalServicePath(CITY_SLUG, slug),
    description,
  };
}

const websiteLatenMaken: LocalServicePageContent = {
  city: CITY,
  citySlug: CITY_SLUG,
  province: PROVINCE,
  serviceName: 'Website laten maken',
  serviceSlug: 'website-laten-maken',
  nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['website-laten-maken'],
  seo: {
    title: 'Website laten maken Breda | Star Local',
    description:
      'Professionele website laten maken in Breda? Star Local bouwt snelle, conversiegerichte sites met lokale SEO voor ondernemers in heel Breda en West-Brabant.',
  },
  hero: {
    label: 'Star Local · Website · Breda',
    h1: 'Website laten maken in Breda',
    intro:
      'Wilt u met uw bedrijf in Breda professioneel online zichtbaar worden? Star Local bouwt snelle, conversiegerichte websites die lokaal gevonden worden en kunnen meegroeien naar heel Nederland.',
  },
  serviceIntro: {
    title: 'Een website die past bij ondernemen in Breda',
    paragraphs: [
      'In Breda vergelijken klanten razendsnel: een horecazaak op de Havermarkt, een installateur in Belcrum of een adviseur in Breda-Noord — iedereen wordt online beoordeeld op uitstraling, snelheid en duidelijkheid. Uw website is vaak het eerste contactmoment en bepaalt of iemand belt, mailt of doorklikt naar een concurrent.',
      'Star Local bouwt websites met moderne Astro-techniek: lichtgewicht, mobiel-first en klaar voor lokale én landelijke vindbaarheid. Geen trage templates of plugin-chaos, wel een platform dat vertrouwen wekt en aanvragen genereert.',
      'Heeft u al een verouderde site? Ook dan helpen we: van redesign tot migratie, met behoud van SEO-waarde en een structuur die meegroeit wanneer u buiten Breda uitbreidt.',
    ],
  },
  localProblem: {
    title: 'Waarom een professionele website belangrijk is in Breda',
    paragraphs: [
      'Breda combineert een drukke binnenstad met bedrijventerreinen als Brabantpark en Haagse Beemden. Horeca, retail, logistiek en zakelijke dienstverlening vechten om dezelfde online aandacht. Een site die traag laadt, slecht leesbaar is op mobiel of geen duidelijke contactroute biedt, kost u elke dag aanvragen.',
      'Bezoekers uit Ginneken, Princenhage of het centrum verwachten binnen seconden te snappen wat u doet, voor wie u werkt en hoe ze contact opnemen. Verouderde pagina\'s, stockfoto\'s zonder context of ontbrekende mobiele optimalisatie ondermijnen vertrouwen — zeker in een stad waar concurrentie toeneemt.',
      'Zonder schaalbare basis blijft landelijke groei lastig. Wie nu investeert in snelheid, structuur en conversie, wint lokaal in Breda én legt de fundering om later Tilburg, Roosendaal of heel Nederland te bedienen.',
    ],
  },
  localSolution: {
    title: 'Wat Star Local voor bedrijven in Breda doet',
    paragraphs: [
      'Star Local ontwerpt en bouwt custom websites die passen bij uw markt in Breda: heldere diensten, sterke CTA\'s, snelle laadtijden en een technische basis voor lokale SEO. Of u nu horeca, bouw, beauty of creatieve diensten levert — uw site moet commercieel werken op elk scherm.',
      'We starten met uw doelen: meer offerteaanvragen, betere vindbaarheid in de binnenstad, of een platform dat meegroeit met nieuwe vestigingen op Minervum of Hazeldonk. Design, contentstructuur en techniek sluiten daarop aan.',
      'Na livegang blijven we beschikbaar voor optimalisatie. Uw website is geen statisch visitekaartje, maar een groeikanaal dat meebeweegt met Breda\'s dynamische ondernemerslandschap.',
    ],
  },
  benefits: [
    {
      icon: 'design',
      title: 'Uitstraling die vertrouwen wekt',
      description:
        'Professioneel design dat past bij horeca in het centrum, retail in Ginneken of zakelijke dienstverlening in Breda-Noord.',
    },
    {
      icon: 'mobile',
      title: 'Mobile-first voor Bredase zoekers',
      description:
        'Klanten vergelijken onderweg. Uw site laadt snel en leidt direct naar bellen, mailen of een offerteaanvraag.',
    },
    {
      icon: 'speed',
      title: 'Razendsnelle Astro-techniek',
      description:
        'Lichtgewicht code zonder onnodige plugins. Essentieel wanneer seconden het verschil maken tussen contact en afhaken.',
    },
    {
      icon: 'seo',
      title: 'Lokaal én landelijk vindbaar',
      description:
        'Technische SEO-basis en structuur om gevonden te worden in Breda en door te groeien naar West-Brabant en verder.',
    },
    {
      icon: 'growth',
      title: 'Schaalbaar platform',
      description:
        'Voeg diensten, pagina\'s of regio\'s toe zonder opnieuw te beginnen. Ideaal voor groeiende MKB-bedrijven in Breda.',
    },
    {
      icon: 'communication',
      title: 'Heldere samenwerking',
      description:
        'Direct contact, duidelijke planning en eerlijk advies over wat u nodig heeft — zonder overkill of ondermaatse shortcuts.',
    },
    {
      icon: 'custom',
      title: 'Maatwerk, geen template',
      description:
        'Elke site wordt op maat gebouwd voor uw propositie, doelgroep en concurrentie in de Bredase markt.',
    },
  ],
  processSteps: [
    {
      number: '01',
      title: 'Kennismaking & doelen',
      description:
        'We bespreken uw markt in Breda, doelgroep, concurrentie en wat de website concreet moet opleveren: aanvragen, vertrouwen of schaalbare groei.',
    },
    {
      number: '02',
      title: 'Structuur & design',
      description:
        'Wireframes, paginastructuur en visueel ontwerp afgestemd op uw merk — met focus op conversie en mobiel gebruik.',
    },
    {
      number: '03',
      title: 'Bouw & content',
      description:
        'Ontwikkeling in Astro, integratie van teksten en beelden, en technische SEO-basis voor lokale vindbaarheid in Breda.',
    },
    {
      number: '04',
      title: 'Test & livegang',
      description:
        'Controle op snelheid, mobiele weergave en contactroutes. Daarna live — zichtbaar voor klanten in heel Breda.',
    },
    {
      number: '05',
      title: 'Doorontwikkeling',
      description:
        'Optimaliseren, uitbreiden met nieuwe diensten of regio\'s, en meegroeien wanneer uw bedrijf buiten Breda expandeert.',
    },
  ],
  industries: {
    title: 'Voor welke bedrijven in Breda wij websites bouwen',
    items: BREDA_SHARED.industries,
    paragraphs: [
      'Breda kent een brede mix: horeca en winkels in de binnenstad, logistiek op Brabantpark, beauty in Ginneken, bouw en installatie in Haagse Beemden, en creatieve bedrijven verspreid over de stad. Elke sector vraagt een andere online propositie — maar allemaal een site die snel scannbaar is en tot contact leidt.',
      'Star Local bouwt voor ondernemers die in Breda willen winnen: van starter tot gevestigde speler. Uw website sluit aan op hoe uw klanten zoeken, vergelijken en beslissen — lokaal verankerd, klaar om te schalen.',
    ],
  },
  districts: {
    title: 'Website laten maken in heel Breda',
    intro:
      'Of u vestigd bent in het centrum, op een bedrijventerrein of in een woonwijk — uw website moet klanten aantrekken uit heel de gemeente. Star Local bouwt voor ondernemers in alle Bredase gebieden.',
    items: BREDA_SHARED.districts,
  },
  relatedServices: [
    related(
      'lokale-seo',
      'Lokale SEO Breda',
      'Gevonden worden wanneer klanten in Breda naar uw dienst zoeken via Google en Maps.',
    ),
    related(
      'technische-seo',
      'Technische SEO Breda',
      'Een snelle, crawlbare technische basis zodat uw nieuwe site maximaal presteert in zoekmachines.',
    ),
    related(
      'conversie-optimalisatie',
      'Conversie-optimalisatie Breda',
      'Meer aanvragen uit hetzelfde verkeer met sterkere CTA\'s, formulieren en vertrouwenssignalen.',
    ),
  ],
  faqs: [
    {
      question: 'Wat kost een website laten maken in Breda?',
      answer:
        'De investering hangt af van scope: een compacte site voor een lokale beautyzaak in Ginneken vraagt een ander budget dan een uitgebreide website voor logistiek op Brabantpark. Star Local bespreekt vooraf wat u nodig heeft om professioneel zichtbaar te worden in Breda — zonder onnodige extra\'s.',
    },
    {
      question: 'Hoe lang duurt het bouwen van een website?',
      answer:
        'Een professioneel traject duurt doorgaans enkele weken, afhankelijk van het aantal pagina\'s, content en feedbackrondes. Star Local werkt met een heldere planning zodat Bredase ondernemers weten wanneer de site live gaat.',
    },
    {
      question: 'Kan ik ook in omliggende gemeenten gevonden worden?',
      answer:
        'Ja. Star Local bouwt websites met een technische basis voor lokale SEO in Breda én ruimte om later uit te breiden naar Etten-Leur, Oosterhout, Tilburg en andere omliggende gemeenten — binnen hetzelfde platform.',
    },
    {
      question: 'Kunnen jullie mijn bestaande website verbeteren?',
      answer:
        'In veel gevallen wel. Als uw huidige site traag, verouderd of commercieel zwak is, onderzoeken we of redesign of migratie het meest zinnig is. Star Local kijkt eerlijk naar wat de snelste route naar betere resultaten in Breda oplevert.',
    },
    {
      question: 'Is mijn website mobiel geoptimaliseerd?',
      answer:
        'Star Local bouwt mobile-first. In Breda komt veel verkeer via smartphone — van horecagasten in het centrum tot zakelijke klanten die onderweg zoeken. Uw site moet snel laden en direct tot contact leiden op elk scherm.',
    },
    {
      question: 'Kan mijn website later landelijk uitbreiden?',
      answer:
        'Ja. Met Astro-techniek en een schaalbare structuur legt u nu de basis in Breda en breidt u later uit met landingspagina\'s, diensten of regio\'s — zonder opnieuw te beginnen en met behoud van snelheid en SEO-waarde.',
    },
  ],
  neighbors: BREDA_NEIGHBORS,
  image: getLocalServiceImagePath('website-laten-maken'),
  imageAlt: 'Website laten maken in Breda — Star Local bouwt snelle, conversiegerichte websites',
  bottomCta: {
    title: 'Klaar voor een professionele website in Breda?',
    text: 'Laat een website bouwen die vertrouwen wekt, snel laadt en lokaal gevonden wordt. Vraag vrijblijvend advies aan — we denken graag mee over uw doelen in Breda.',
    ...CTA,
  },
};

const lokaleSeo: LocalServicePageContent = {
  city: CITY,
  citySlug: CITY_SLUG,
  province: PROVINCE,
  serviceName: 'Lokale SEO',
  serviceSlug: 'lokale-seo',
  nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['lokale-seo'],
  seo: {
    title: 'Lokale SEO Breda | Beter gevonden in Google | Star Local',
    description:
      'Lokale SEO in Breda: hoger in Google en Maps wanneer klanten zoeken. Star Local optimaliseert content, profiel en techniek voor zichtbaarheid in heel Breda.',
  },
  hero: {
    label: 'Star Local · Lokale SEO · Breda',
    h1: 'Lokale SEO in Breda',
    intro:
      'Meer klanten bereiken in Breda begint met zichtbaar zijn op het moment dat zij zoeken. Star Local helpt lokale bedrijven hoger te verschijnen in Google en Google Maps.',
  },
  serviceIntro: {
    title: 'Gevonden worden door klanten in Breda',
    paragraphs: [
      'Lokale SEO draait om het juiste moment: wanneer iemand in Princenhage, het centrum of op Brabantpark zoekt naar uw dienst, moet u verschijnen — in Google en op Maps. Dat vraagt meer dan een mooie website; het vraagt lokale relevantie, consistente bedrijfsgegevens en content die aansluit op hoe Breda zoekt.',
      'Star Local combineert lokale landingspagina\'s, interne links, Google Bedrijfsprofiel-optimalisatie en reviews als signaal. Zo bouwt u zichtbaarheid op per wijk en sector, zonder generieke zoekwoorden die niets opleveren.',
      'Breda fungeert ook als regionaal knooppunt. Met de juiste aanpak kunt u naast Breda ook vindbaar worden in omliggende gemeenten als Oosterhout, Etten-Leur en Tilburg — passend bij uw groeiplannen.',
    ],
  },
  localProblem: {
    title: 'Waarom lokale SEO belangrijk is in Breda',
    paragraphs: [
      'In Breda zoeken klanten specifiek: "kapper Ginneken", "logistiek Breda", "restaurant centrum". Wie alleen op landelijke termen optimaliseert, mist het lokale verkeer dat direct tot contact, bellen of een bezoek leidt. Concurrenten met een sterk Google Bedrijfsprofiel en lokale content pakken die aanvragen nu al.',
      'Google Maps is voor horeca, winkels, beauty en zorg vaak belangrijker dan de klassieke blauwe links. Zonder consistente NAP-gegevens, juiste categorieën en actieve reviews blijft u onzichtbaar — ook met een goede website.',
      'De Bredase markt is gevarieerd: centrum versus bedrijventerrein, B2C versus zakelijke dienstverlening. Lokale SEO moet aansluiten op uw werkelijke klantgebied — van Hazeldonk tot Breda-Noord — niet op generieke SEO-advies uit een handboek.',
    ],
  },
  localSolution: {
    title: 'Wat Star Local voor bedrijven in Breda doet',
    paragraphs: [
      'Star Local analyseert waar u nu staat: rankings, Google Bedrijfsprofiel, website-structuur en concurrentie in Breda. Vervolgens bouwen we een lokale strategie met concrete acties: content per dienst en gebied, interne links, profieloptimalisatie en review-aanpak.',
      'We koppelen lokale SEO aan uw commerciële doelen. Meer zichtbaarheid in de binnenstad voor horeca, sterkere aanwezigheid op Maps voor installateurs in Belcrum, of regionale vindbaarheid voor logistiek op IJpelaar — de aanpak volgt uw markt.',
      'Lokale SEO is geen eenmalige actie. Star Local monitort ontwikkelingen en past content en profiel aan wanneer Google, uw concurrentie of uw dienstenaanbod verandert.',
    ],
  },
  benefits: [
    {
      icon: 'seo',
      title: 'Zichtbaar in lokale zoekresultaten',
      description:
        'Verschijn wanneer prospects in Breda naar uw dienst zoeken — met pagina\'s die aansluiten op intentie en locatie.',
    },
    {
      icon: 'growth',
      title: 'Sterkere Google Maps-aanwezigheid',
      description:
        'Optimalisatie van categorieën, diensten en content zodat u opvalt in het Maps-overzicht in heel Breda.',
    },
    {
      icon: 'custom',
      title: 'Lokale landingspagina\'s',
      description:
        'Gerichte pagina\'s per dienst en regio, gekoppeld via interne links — relevant voor Ginneken, centrum en bedrijventerreinen.',
    },
    {
      icon: 'communication',
      title: 'Review-strategie',
      description:
        'Meer en betere reviews als vertrouwenssignaal — cruciaal voor horeca, beauty, zorg en retail in Breda.',
    },
    {
      icon: 'scale',
      title: 'Regionale uitbreiding',
      description:
        'Na Breda uitbreiden naar Tilburg, Roosendaal of Drimmelen zonder losse SEO-projecten per gemeente.',
    },
    {
      icon: 'design',
      title: 'Content die lokaal resoneert',
      description:
        'Teksten die Bredase context benutten — natuurlijk, commercieel en afgestemd op hoe uw doelgroep zoekt.',
    },
    {
      icon: 'mobile',
      title: 'Mobiel-first vindbaarheid',
      description:
        'Lokaal zoeken gebeurt vooral op smartphone. Uw SEO-aanpak is daarop afgestemd.',
    },
  ],
  processSteps: [
    {
      number: '01',
      title: 'Lokale analyse',
      description:
        'Inventarisatie van huidige rankings, Google Bedrijfsprofiel, website en concurrentie in Breda en omliggende regio\'s.',
    },
    {
      number: '02',
      title: 'Strategie & prioriteiten',
      description:
        'Keuze van focus: welke diensten, wijken en zoektermen leveren de meeste commerciële kansen in Breda?',
    },
    {
      number: '03',
      title: 'Uitvoering',
      description:
        'Content, interne links, profieloptimalisatie en technische verbeteringen — stap voor stap uitgerold.',
    },
    {
      number: '04',
      title: 'Meten & bijsturen',
      description:
        'Volgen van zichtbaarheid, verkeer en contactmomenten. Bijsturen waar Breda-specifieke kansen of problemen zichtbaar worden.',
    },
  ],
  industries: {
    title: 'Lokale SEO voor bedrijven in Breda',
    items: BREDA_SHARED.industries,
    paragraphs: [
      'Horeca en winkels in het centrum leunen zwaar op Maps en "near me"-zoekopdrachten. Logistiek en zakelijke dienstverlening op Brabantpark en Minervum zoeken regionale vindbaarheid. Beauty, zorg en coaches in Ginneken en Princenhage willen lokaal vertrouwen opbouwen via reviews en relevante content.',
      'Star Local past lokale SEO toe per sector: de juiste categorieën, content en signalen voor uw markt in Breda — zonder generieke pakketten die nergens echt landen.',
    ],
  },
  districts: {
    title: 'Lokaal gevonden worden in heel Breda',
    intro:
      'Klanten zoeken per wijk en bedrijventerrein. Star Local helpt u zichtbaar te worden in Centrum, Ginneken, Brabantpark en alle andere Bredase gebieden waar uw doelgroep zit.',
    items: BREDA_SHARED.districts,
  },
  relatedServices: [
    related(
      'google-bedrijfsprofiel',
      'Google Bedrijfsprofiel Breda',
      'Uw profiel optimaliseren voor Maps, reviews en lokale klikacties in Breda.',
    ),
    related(
      'website-laten-maken',
      'Website laten maken Breda',
      'Een snelle, conversiegerichte website als fundament voor lokale vindbaarheid.',
    ),
    related(
      'ai-seo',
      'AI SEO Breda',
      'Content en structuur verbeteren voor moderne zoekervaringen en AI-zoekmachines.',
    ),
  ],
  faqs: [
    {
      question: 'Hoe werkt lokale SEO in Breda?',
      answer:
        'Lokale SEO combineert een geoptimaliseerd Google Bedrijfsprofiel, relevante content op uw website, consistente bedrijfsgegevens, reviews en interne links. Star Local stemt dit af op uw diensten en de wijken waar uw klanten zitten — van centrum tot Brabantpark.',
    },
    {
      question: 'Kan ik ook in omliggende gemeenten gevonden worden?',
      answer:
        'Ja, mits dat past bij uw marktgebied. Star Local kan naast Breda ook zichtbaarheid opbouwen richting Oosterhout, Etten-Leur, Tilburg en andere omliggende gemeenten — met landingspagina\'s en profielinstellingen die regionaal kloppen.',
    },
    {
      question: 'Helpen jullie met mijn Google Bedrijfsprofiel?',
      answer:
        'Ja. Google Bedrijfsprofiel is kernonderdeel van lokale SEO. Star Local optimaliseert categorieën, diensten, foto\'s, berichten en consistentie met uw website — essentieel voor Maps-zichtbaarheid in Breda.',
    },
    {
      question: 'Hoe snel zie ik resultaat van lokale SEO?',
      answer:
        'Lokale SEO vraagt tijd: profieloptimalisatie kan sneller effect tonen, content en rankings bouwen geleidelijk op. Star Local geeft een realistisch beeld van wat u in Breda kunt verwachten en wanneer.',
    },
    {
      question: 'Is lokale SEO zinvol voor B2B in Breda?',
      answer:
        'Absoluut. Zakelijke dienstverlening, bouw, logistiek en coaches profiteren van lokale vindbaarheid wanneer prospects zoeken op "adviseur Breda" of "installateur Haagse Beemden". De aanpak verschilt per sector, het principe niet.',
    },
    {
      question: 'Wat als ik al een website heb maar niet gevonden word?',
      answer:
        'Dan kijken we eerst naar techniek, content, profiel en concurrentie. Vaak ontbreken lokale landingspagina\'s, interne links of een sterk Google Bedrijfsprofiel. Star Local stelt een concreet verbeterplan op voor Breda.',
    },
  ],
  neighbors: BREDA_NEIGHBORS,
  image: getLocalServiceImagePath('lokale-seo'),
  imageAlt: 'Lokale SEO in Breda — beter gevonden in Google en Google Maps',
  bottomCta: {
    title: 'Meer zichtbaarheid in Breda nodig?',
    text: 'Star Local helpt u hoger te verschijnen wanneer klanten in Breda zoeken. Vraag gratis advies aan over lokale SEO voor uw bedrijf.',
    ...CTA,
  },
};

const googleBedrijfsprofiel: LocalServicePageContent = {
  city: CITY,
  citySlug: CITY_SLUG,
  province: PROVINCE,
  serviceName: 'Google Bedrijfsprofiel',
  serviceSlug: 'google-bedrijfsprofiel',
  nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['google-bedrijfsprofiel'],
  seo: {
    title: 'Google Bedrijfsprofiel Breda optimaliseren | Star Local',
    description:
      'Google Bedrijfsprofiel optimaliseren in Breda? Star Local verbetert categorieën, reviews en content voor meer zichtbaarheid in Maps en lokale zoekresultaten.',
  },
  hero: {
    label: 'Star Local · Google Bedrijfsprofiel · Breda',
    h1: 'Google Bedrijfsprofiel optimaliseren in Breda',
    intro:
      'Een sterk Google Bedrijfsprofiel helpt bedrijven in Breda opvallen in lokale zoekresultaten en Google Maps. Wij optimaliseren uw profiel voor betere zichtbaarheid en meer contactmomenten.',
  },
  serviceIntro: {
    title: 'Uw visitekaartje in Google Maps en lokale zoekresultaten',
    paragraphs: [
      'Voor veel Bredase bedrijven — horeca in het centrum, kappers in Ginneken, installateurs in Belcrum — is het Google Bedrijfsprofiel het eerste wat klanten zien. Categorieën, openingstijden, foto\'s, reviews en berichten bepalen of iemand belt, route aanvraagt of doorklikt naar een concurrent.',
      'Star Local optimaliseert elk onderdeel: juiste categorieën en diensten, consistente NAP-gegevens, aantrekkelijke foto\'s, actieve berichten en een review-aanpak die vertrouwen opbouwt. Alles afgestemd op lokale zoekintentie in Breda.',
      'Een sterk profiel werkt samen met uw website. Star Local zorgt voor consistentie tussen profiel en site — cruciaal voor Google én voor klanten die u online beoordelen.',
    ],
  },
  localProblem: {
    title: 'Waarom Google Bedrijfsprofiel optimaliseren belangrijk is in Breda',
    paragraphs: [
      'In Breda kiezen klanten snel op basis van wat ze in Maps zien: sterren, foto\'s, openingstijden en reacties op reviews. Een incompleet profiel, verkeerde categorie of verouderde openingstijden kost direct contactmomenten — zeker in drukke sectoren als horeca, retail en beauty.',
      'NAP-inconsistentie — verschillende adres- of telefoongegevens op profiel, website en directories — ondermijnt lokale rankings. Veel Bredase ondernemers onderschatten hoe gevoelig Google is voor deze details.',
      'Reviews zijn beslissend. Zonder actieve follow-up en professionele reacties wint een concurrent in Princenhage of het centrum alsnog de klik, ook als uw dienst objectief beter is.',
    ],
  },
  localSolution: {
    title: 'Wat Star Local voor bedrijven in Breda doet',
    paragraphs: [
      'Star Local audit uw huidige profiel en concurrentie in Breda. We corrigeren categorieën, vullen diensten aan, optimaliseren foto\'s en berichten, en stemmen NAP af met uw website en andere vermeldingen.',
      'We begeleiden review-verzameling en professionele reacties — passend bij horeca, zorg, retail of zakelijke dienstverlening. Het doel: meer doorklikken, bellen en routeaanvragen vanuit Maps.',
      'Doorlopend monitoren we prestaties en passen het profiel aan bij wijzigingen in openingstijden, diensten of seizoensacties — relevant voor ondernemers in heel Breda.',
    ],
  },
  benefits: [
    {
      icon: 'seo',
      title: 'Juiste categorieën en diensten',
      description:
        'Google begrijpt precies wat u levert — essentieel om te verschijnen bij relevante zoekopdrachten in Breda.',
    },
    {
      icon: 'communication',
      title: 'Review-management',
      description:
        'Meer reviews en professionele reacties die vertrouwen wekken bij klanten in het centrum en daarbuiten.',
    },
    {
      icon: 'design',
      title: 'Professionele foto\'s en berichten',
      description:
        'Visueel aantrekkelijk profiel dat opvalt tussen concurrenten in Maps — met actuele aanbiedingen en updates.',
    },
    {
      icon: 'mobile',
      title: 'Meer Maps-acties',
      description:
        'Optimalisatie gericht op bellen, route aanvragen en websitebezoek — de acties die in Breda tot klanten leiden.',
    },
    {
      icon: 'custom',
      title: 'NAP-consistentie',
      description:
        'Eenduidige bedrijfsgegevens op profiel, website en directories — een basis voor lokale vindbaarheid.',
    },
    {
      icon: 'growth',
      title: 'Koppeling met lokale SEO',
      description:
        'Profiel en website versterken elkaar voor bredere zichtbaarheid in Breda en omliggende regio\'s.',
    },
  ],
  processSteps: [
    {
      number: '01',
      title: 'Profiel-audit',
      description:
        'Analyse van uw huidige Google Bedrijfsprofiel, reviews, categorieën en vergelijking met concurrenten in Breda.',
    },
    {
      number: '02',
      title: 'Optimalisatieplan',
      description:
        'Prioriteiten voor categorieën, diensten, foto\'s, berichten en NAP-consistentie — afgestemd op uw sector.',
    },
    {
      number: '03',
      title: 'Uitvoering',
      description:
        'Profiel bijwerken, content toevoegen, website afstemmen en review-proces inrichten.',
    },
    {
      number: '04',
      title: 'Monitoring',
      description:
        'Volgen van zichtbaarheid, acties en reviews. Bijsturen bij wijzigingen of nieuwe kansen in Breda.',
    },
  ],
  industries: {
    title: 'Google Bedrijfsprofiel voor bedrijven in Breda',
    items: BREDA_SHARED.industries,
    paragraphs: [
      'Horeca en winkels in de binnenstad leunen op Maps voor directe bezoekers. Beauty en zorg in Ginneken en Princenhage winnen via reviews en foto\'s. Bouw, logistiek en zakelijke dienstverlening op bedrijventerreinen profiteren van duidelijke diensten en routeaanvragen.',
      'Star Local optimaliseert profielen per sector — met de categorieën, content en review-aanpak die passen bij uw markt in Breda.',
    ],
  },
  districts: {
    title: 'Google Bedrijfsprofiel in heel Breda',
    intro:
      'Klanten vinden u via Maps in heel de gemeente. Star Local optimaliseert profielen voor ondernemers in Centrum, Ginneken, Brabantpark en alle andere Bredase gebieden.',
    items: BREDA_SHARED.districts,
  },
  relatedServices: [
    related(
      'lokale-seo',
      'Lokale SEO Breda',
      'Brede lokale SEO-strategie met content, links en profiel voor maximale zichtbaarheid.',
    ),
    related(
      'website-laten-maken',
      'Website laten maken Breda',
      'Een website die naadloos aansluit op uw geoptimaliseerde Google Bedrijfsprofiel.',
    ),
    related(
      'ai-seo',
      'AI SEO Breda',
      'Content en data versterken voor moderne zoekervaringen naast klassieke Maps-zichtbaarheid.',
    ),
  ],
  faqs: [
    {
      question: 'Helpen jullie met mijn Google Bedrijfsprofiel in Breda?',
      answer:
        'Ja, dat is een kernonderdeel van onze dienstverlening. Star Local optimaliseert categorieën, diensten, foto\'s, berichten, reviews en NAP-consistentie — specifiek voor uw markt in Breda.',
    },
    {
      question: 'Hoe belangrijk zijn reviews voor mijn profiel in Breda?',
      answer:
        'Zeer belangrijk. Reviews beïnvloeden zichtbaarheid én conversie in Maps. Star Local helpt met een structurele aanpak om reviews te verzamelen en professioneel te reageren — passend bij uw branche.',
    },
    {
      question: 'Wat is NAP-consistentie en waarom telt het?',
      answer:
        'NAP staat voor Name, Address, Phone. Google verwacht dezelfde gegevens op uw profiel, website en andere vermeldingen. Inconsistentie schaadt lokale rankings — iets Star Local corrigeert en bewaakt.',
    },
    {
      question: 'Kan ik met mijn profiel ook buiten Breda gevonden worden?',
      answer:
        'Dat hangt af van uw servicegebied. Star Local stelt het profiel en de content zo in dat zichtbaarheid aansluit bij waar u klanten bedient — Breda en eventueel omliggende gemeenten.',
    },
    {
      question: 'Hoe vaak moet mijn profiel worden bijgewerkt?',
      answer:
        'Regelmatig: openingstijden bij feestdagen, nieuwe diensten, foto\'s en berichten houden uw profiel actueel. Star Local kan dit doorlopend verzorgen of u begeleiden bij onderhoud.',
    },
    {
      question: 'Werkt profieloptimalisatie ook voor zakelijke dienstverlening?',
      answer:
        'Ja. Adviseurs, coaches, makelaars en creatieve bedrijven in Breda profiteren van een compleet profiel met juiste categorieën, diensten en reviews — ook als klanten u niet fysiek bezoeken.',
    },
  ],
  neighbors: BREDA_NEIGHBORS,
  image: getLocalServiceImagePath('google-bedrijfsprofiel'),
  imageAlt: 'Google Bedrijfsprofiel optimaliseren in Breda voor betere Maps-zichtbaarheid',
  bottomCta: {
    title: 'Sterker profiel nodig in Breda?',
    text: 'Laat Star Local uw Google Bedrijfsprofiel optimaliseren voor meer zichtbaarheid, reviews en contactmomenten in Breda. Vraag gratis advies aan.',
    ...CTA,
  },
};

const webshopLatenMaken: LocalServicePageContent = {
  city: CITY,
  citySlug: CITY_SLUG,
  province: PROVINCE,
  serviceName: 'Webshop laten maken',
  serviceSlug: 'webshop-laten-maken',
  nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['webshop-laten-maken'],
  seo: {
    title: 'Webshop laten maken Breda | Star Local',
    description:
      'Webshop laten maken in Breda? Star Local bouwt snelle, mobiele webshops met SEO en conversie — voor lokale verkoop in Breda en landelijke groei daarbuiten.',
  },
  hero: {
    label: 'Star Local · Webshop · Breda',
    h1: 'Webshop laten maken in Breda',
    intro:
      'Online verkopen vanuit Breda vraagt meer dan een mooie vitrine. Star Local bouwt webshops die snel laden, mobiel bestellen mogelijk maken en klaar zijn voor lokale én landelijke groei.',
  },
  serviceIntro: {
    title: 'Een webshop die verkoopt — lokaal en verder',
    paragraphs: [
      'Bredase retailers, producenten en creatieve ondernemers verkopen steeds vaker online — naast fysieke verkoop in het centrum of op bedrijventerreinen. Een webshop moet gebruiksvriendelijk zijn, snel laden op mobiel, duidelijke productstructuur bieden en vertrouwde betaalmethoden ondersteunen.',
      'Star Local bouwt webshops met conversie en SEO in het DNA: heldere categorieën, snelle checkout, technische basis voor vindbaarheid en ruimte om door te groeien van Breda naar heel Nederland.',
      'Of u nu lokaal levert in Ginneken en Princenhage of landelijk verzendt vanuit Brabantpark: uw webshop moet schaalbaar, veilig en commercieel sterk zijn.',
    ],
  },
  localProblem: {
    title: 'Waarom een professionele webshop belangrijk is in Breda',
    paragraphs: [
      'Consumenten in Breda vergelijken webshops op snelheid, gebruiksgemak en vertrouwen. Trage pagina\'s, onduidelijke productfilters of een checkout die op mobiel hapert leiden tot afgebroken bestellingen — terwijl concurrenten met een strakkere shop wél converteren.',
      'Lokale webshops hebben vaak potentieel buiten de stad: creatieve bedrijven, specialty retail en producenten uit Breda bedienen klanten in Tilburg, Roosendaal en verder. Zonder SEO-basis en schaalbare techniek blijft dat onbenut.',
      'Betaalmethoden, voorraadstructuur en productpagina\'s moeten kloppen. Een generieke template zonder lokale relevantie of commerciële fine-tuning kost omzet — zeker in sectoren als winkels, beauty en horeca-gerelateerde verkoop.',
    ],
  },
  localSolution: {
    title: 'Wat Star Local voor bedrijven in Breda doet',
    paragraphs: [
      'Star Local ontwerpt en bouwt webshops op maat: productstructuur, categorieën, filters, checkout en integraties afgestemd op uw aanbod en doelgroep in Breda.',
      'We optimaliseren voor mobiel bestellen, snelheid en conversie — met SEO-basis zodat u gevonden wordt op product- en categoriezoektermen. Lokale verkoop, afhalen of landelijke verzending: de shop volgt uw model.',
      'Na livegang helpen we met doorontwikkeling: nieuwe productlijnen, seizoenscampagnes en conversie-optimalisatie wanneer uw webshop groeit.',
    ],
  },
  benefits: [
    {
      icon: 'mobile',
      title: 'Mobiel bestellen zonder frictie',
      description:
        'Checkout en productpagina\'s geoptimaliseerd voor smartphone — waar Bredase klanten het meest bestellen.',
    },
    {
      icon: 'design',
      title: 'Duidelijke productstructuur',
      description:
        'Logische categorieën en filters zodat bezoekers snel vinden wat ze zoeken — minder afhakers, meer bestellingen.',
    },
    {
      icon: 'speed',
      title: 'Snelle laadtijden',
      description:
        'Lichtgewicht techniek zodat productpagina\'s snel laden. Essentieel voor conversie en SEO.',
    },
    {
      icon: 'seo',
      title: 'SEO voor producten en categorieën',
      description:
        'Vindbaarheid op zoektermen die passen bij uw aanbod — lokaal in Breda en landelijk waar u levert.',
    },
    {
      icon: 'growth',
      title: 'Schaalbare groei',
      description:
        'Van lokale verkoop naar landelijke verzending: uw webshop groeit mee zonder technische beperkingen.',
    },
    {
      icon: 'custom',
      title: 'Betrouwbare betaalmethodes',
      description:
        'Integratie van gangbare betaaloplossingen die vertrouwen wekken bij Nederlandse consumenten.',
    },
    {
      icon: 'scale',
      title: 'Conversiegericht design',
      description:
        'CTA\'s, productpresentatie en vertrouwenssignalen afgestemd op commerciële resultaten.',
    },
  ],
  processSteps: [
    {
      number: '01',
      title: 'Inventarisatie & doelen',
      description:
        'Productaanbod, doelgroep, lokale vs. landelijke verkoop en technische wensen — helder vooraf in Breda.',
    },
    {
      number: '02',
      title: 'Structuur & UX',
      description:
        'Categorieën, filters, checkout-flow en mobiele ervaring — ontworpen voor conversie.',
    },
    {
      number: '03',
      title: 'Bouw & integraties',
      description:
        'Ontwikkeling, betaalmethoden, voorraadkoppelingen en SEO-basis voor product- en categoriepagina\'s.',
    },
    {
      number: '04',
      title: 'Test & lancering',
      description:
        'Controle op snelheid, checkout en mobiele weergave. Livegang wanneer alles commercieel klopt.',
    },
    {
      number: '05',
      title: 'Optimaliseren & uitbreiden',
      description:
        'Conversie verbeteren, assortiment uitbreiden en SEO doorontwikkelen naarmate uw shop groeit.',
    },
  ],
  industries: {
    title: 'Webshops voor bedrijven in Breda',
    items: BREDA_SHARED.industries,
    paragraphs: [
      'Winkels en retail in het centrum, beauty en creatieve bedrijven in Ginneken, producenten op bedrijventerreinen — Breda kent diverse webshop-potentie. Star Local bouwt shops die passen bij uw product, merk en verkoopmodel.',
      'Of u lokaal levert, afhaalt in Breda of landelijk verzendt: uw webshop moet snel, betrouwbaar en vindbaar zijn. Star Local combineert techniek, design en SEO voor commerciële resultaten.',
    ],
  },
  districts: {
    title: 'Webshop laten maken vanuit heel Breda',
    intro:
      'Online verkopen doet u vanuit elke wijk of bedrijventerrein. Star Local ondersteunt webshop-projecten voor ondernemers in Centrum, Haagse Beemden, Brabantpark en alle andere Bredase gebieden.',
    items: BREDA_SHARED.districts,
  },
  relatedServices: [
    related(
      'conversie-optimalisatie',
      'Conversie-optimalisatie Breda',
      'Meer bestellingen uit hetzelfde verkeer met sterkere checkout en vertrouwenssignalen.',
    ),
    related(
      'technische-seo',
      'Technische SEO Breda',
      'Technische basis zodat productpagina\'s crawlbare, snelle en indexeerbare shops opleveren.',
    ),
    related(
      'lokale-seo',
      'Lokale SEO Breda',
      'Lokaal gevonden worden wanneer Bredase klanten online naar uw producten zoeken.',
    ),
  ],
  faqs: [
    {
      question: 'Wat kost een webshop laten maken in Breda?',
      answer:
        'De investering hangt af van het aantal producten, integraties, designwensen en functionaliteit. Star Local bespreekt vooraf wat u nodig heeft voor een professionele webshop — zonder onnodige complexiteit.',
    },
    {
      question: 'Kan ik lokaal verkopen én landelijk verzenden?',
      answer:
        'Ja. Star Local bouwt webshops die beide modellen ondersteunen: lokale afhalen of bezorging in Breda en landelijke verzending wanneer u verder wilt groeien.',
    },
    {
      question: 'Is mijn webshop mobiel geoptimaliseerd?',
      answer:
        'Star Local bouwt mobile-first. In Breda en daarbuiten bestellen klanten vooral via smartphone — uw shop moet op elk scherm snel en intuïtief werken.',
    },
    {
      question: 'Helpen jullie met SEO voor mijn webshop?',
      answer:
        'Ja. Product- en categoriepagina\'s krijgen een SEO-basis: titels, structuur, snelheid en technische instellingen zodat u vindbaar wordt op relevante zoektermen.',
    },
    {
      question: 'Welke betaalmethoden kunnen worden gekoppeld?',
      answer:
        'Star Local integreert gangbare Nederlandse betaaloplossingen die vertrouwen wekken. Welke opties passen, bespreken we in het traject op basis van uw doelgroep en omzet.',
    },
    {
      question: 'Kan ik mijn bestaande webshop laten verbeteren?',
      answer:
        'In veel gevallen wel. Trage shops, slechte mobiele ervaring of lage conversie zijn veelvoorkomende redenen voor redesign of migratie. Star Local kijkt eerlijk naar de beste route voor uw situatie in Breda.',
    },
  ],
  neighbors: BREDA_NEIGHBORS,
  image: getLocalServiceImagePath('webshop-laten-maken'),
  imageAlt: 'Webshop laten maken in Breda — snelle, conversiegerichte online winkels',
  bottomCta: {
    title: 'Klaar om online te verkopen vanuit Breda?',
    text: 'Laat een webshop bouwen die snel laadt, mobiel sterk is en klaar is voor groei. Vraag vrijblijvend advies aan over uw webshop in Breda.',
    ...CTA,
  },
};

const technischeSeo: LocalServicePageContent = {
  city: CITY,
  citySlug: CITY_SLUG,
  province: PROVINCE,
  serviceName: 'Technische SEO',
  serviceSlug: 'technische-seo',
  nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['technische-seo'],
  seo: {
    title: 'Technische SEO Breda | Star Local',
    description:
      'Technische SEO in Breda: crawlbaarheid, Core Web Vitals en schone code. Star Local lost technische blokkades op zodat uw site beter presteert in Google.',
  },
  hero: {
    label: 'Star Local · Technische SEO · Breda',
    h1: 'Technische SEO in Breda',
    intro:
      'Zonder solide technische basis blijft zelfs de beste content onzichtbaar. Star Local analyseert en verbetert crawlbaarheid, indexering en laadsnelheid — zodat uw site in Breda én landelijk maximaal presteert.',
  },
  serviceIntro: {
    title: 'De technische fundering onder vindbaarheid',
    paragraphs: [
      'Technische SEO gaat over wat Google wél en niet kan lezen: crawlbaarheid, indexering, canonicals, redirects, sitemap, robots.txt, structured data en Core Web Vitals. Fouten hier blokkeren groei — ook als uw content en Google Bedrijfsprofiel in Breda op orde lijken.',
      'Star Local werkt met schone Astro-code: lichtgewicht, snel en zonder onnodige plugin-overhead. We auditen bestaande sites en lossen technische blokkades op — van dubbele pagina\'s tot trage laadtijden op mobiel.',
      'Voor Bredase ondernemers die investeren in lokale SEO of een nieuwe website: technische SEO is geen luxe, maar voorwaarde om zichtbaarheid en conversie te laten renderen.',
    ],
  },
  localProblem: {
    title: 'Waarom technische SEO belangrijk is in Breda',
    paragraphs: [
      'Veel websites in Breda — van horeca tot logistiek — draaien op trage platforms, verkeerde redirects of pagina\'s die Google niet indexeert. Het gevolg: u betaalt voor content of advertenties terwijl organische groei stokt.',
      'Core Web Vitals en laadsnelheid beïnvloeden rankings én conversie. Klanten in het centrum of op Brabantpark wachten niet op trage pagina\'s — Google ook niet.',
      'Structured data, canonicals en sitemaps lijken abstract, maar bepalen of Google uw diensten, producten en locatie correct interpreteert. Zonder schone techniek blijft lokale SEO onderbenut.',
    ],
  },
  localSolution: {
    title: 'Wat Star Local voor bedrijven in Breda doet',
    paragraphs: [
      'Star Local voert een technische SEO-audit uit: crawlbaarheid, indexstatus, redirects, canonicals, sitemap, robots.txt, structured data en Core Web Vitals. U krijgt inzicht in wat Google blokkeert en wat prioriteit heeft.',
      'We implementeren oplossingen: redirect-structuur, canonical tags, sitemap-optimalisatie, schema markup en performance-verbeteringen. Bij nieuwe sites bouwen we technische SEO vanaf dag één in.',
      'Doorlopend monitoren we indexering en snelheid — essentieel wanneer u uitbreidt met nieuwe diensten, pagina\'s of regio\'s vanuit Breda.',
    ],
  },
  benefits: [
    {
      icon: 'speed',
      title: 'Betere Core Web Vitals',
      description:
        'Snellere laadtijden en stabielere weergave — rankingfactor én conversievoordeel voor Bredase bezoekers.',
    },
    {
      icon: 'seo',
      title: 'Correcte indexering',
      description:
        'Google indexeert de juiste pagina\'s — geen duplicate content of verloren lokale landingspagina\'s.',
    },
    {
      icon: 'custom',
      title: 'Schone redirect-structuur',
      description:
        '301-redirects en canonicals die waarde behouden bij migraties of URL-wijzigingen.',
    },
    {
      icon: 'scale',
      title: 'Structured data',
      description:
        'Schema markup zodat Google uw diensten, bedrijf en content rijker kan weergeven.',
    },
    {
      icon: 'communication',
      title: 'Transparante audit',
      description:
        'Duidelijk rapport over technische issues en prioriteiten — geen vage SEO-jargon zonder actie.',
    },
    {
      icon: 'growth',
      title: 'Schaalbare techniek',
      description:
        'Fundament dat meegroeit wanneer u nieuwe pagina\'s of regio\'s toevoegt vanuit Breda.',
    },
    {
      icon: 'mobile',
      title: 'Mobiele performance',
      description:
        'Technische optimalisatie gericht op het mobiele verkeer dat in Breda dominant is.',
    },
  ],
  processSteps: [
    {
      number: '01',
      title: 'Technische audit',
      description:
        'Crawl-analyse, indexcheck, snelheidstest en review van redirects, sitemap en structured data.',
    },
    {
      number: '02',
      title: 'Prioriteiten & plan',
      description:
        'Welke technische issues blokkeren zichtbaarheid en conversie het meest voor uw site in Breda?',
    },
    {
      number: '03',
      title: 'Implementatie',
      description:
        'Oplossen van crawl- en indexproblemen, performance-verbeteringen en schema markup.',
    },
    {
      number: '04',
      title: 'Validatie',
      description:
        'Controle via Search Console en snelheidstools. Bevestiging dat Google de site correct verwerkt.',
    },
    {
      number: '05',
      title: 'Monitoring',
      description:
        'Doorlopend toezicht op indexering en Core Web Vitals bij site-uitbreidingen.',
    },
  ],
  industries: {
    title: 'Technische SEO voor bedrijven in Breda',
    items: BREDA_SHARED.industries,
    paragraphs: [
      'Logistiek en zakelijke dienstverlening op Brabantpark hebben vaak uitgebreide sites met veel pagina\'s — crawlproblemen kosten zichtbaarheid. Horeca en retail in het centrum leunen op snelheid en mobiele performance. Creatieve bedrijven en webshops hebben product- en portfolio-pagina\'s die correct geïndexeerd moeten worden.',
      'Star Local past technische SEO toe op uw situatie — of u nu een nieuwe Astro-site lanceert of een bestaande site in Breda wilt verbeteren.',
    ],
  },
  districts: {
    title: 'Technische SEO voor sites in heel Breda',
    intro:
      'Technische SEO is locatie-onafhankelijk, maar essentieel voor elke Bredase ondernemer die online wil groeien. Star Local helpt bedrijven in alle wijken en op alle bedrijventerreinen.',
    items: BREDA_SHARED.districts,
  },
  relatedServices: [
    related(
      'website-laten-maken',
      'Website laten maken Breda',
      'Nieuwe site bouwen met technische SEO ingebouwd vanaf de start.',
    ),
    related(
      'lokale-seo',
      'Lokale SEO Breda',
      'Lokale zichtbaarheid opbouwen op een technisch solide fundament.',
    ),
    related(
      'ai-seo',
      'AI SEO Breda',
      'Structured data en contentstructuur voor moderne zoekervaringen.',
    ),
  ],
  faqs: [
    {
      question: 'Wat is technische SEO en waarom is het belangrijk?',
      answer:
        'Technische SEO zorgt dat Google uw site kan crawlen, indexeren en snel laden. Zonder die basis blijft content — ook lokale content voor Breda — onderbenut in zoekresultaten.',
    },
    {
      question: 'Kunnen jullie technische SEO op mijn bestaande website doen?',
      answer:
        'Ja. Star Local auditeert bestaande sites en lost problemen op: redirects, canonicals, indexering, sitemap, robots.txt en Core Web Vitals — ongeacht platform.',
    },
    {
      question: 'Wat zijn Core Web Vitals?',
      answer:
        'Google\'s metrics voor laadsnelheid, interactiviteit en visuele stabiliteit. Ze beïnvloeden rankings en gebruikerservaring — cruciaal voor mobiele bezoekers in Breda.',
    },
    {
      question: 'Helpt technische SEO ook mijn lokale vindbaarheid in Breda?',
      answer:
        'Ja. Lokale landingspagina\'s, Google Bedrijfsprofiel-koppelingen en schema markup werken alleen optimaal op een technisch gezonde site. Technische SEO is de basis onder lokale SEO.',
    },
    {
      question: 'Hoe lang duurt een technische SEO-traject?',
      answer:
        'Dat hangt af van de omvang van problemen. Een audit levert snel inzicht; implementatie varieert van enkele dagen tot weken bij complexe sites. Star Local geeft vooraf een realistisch beeld.',
    },
    {
      question: 'Bouwen jullie nieuwe sites met technische SEO ingebouwd?',
      answer:
        'Ja. Star Local bouwt in Astro met schone code, snelle laadtijden, correcte sitemap-structuur en schema markup — technische SEO vanaf dag één.',
    },
  ],
  neighbors: BREDA_NEIGHBORS,
  image: getLocalServiceImagePath('technische-seo'),
  imageAlt: 'Technische SEO in Breda — crawlbaarheid, snelheid en indexering verbeteren',
  bottomCta: {
    title: 'Technische SEO nodig voor uw site in Breda?',
    text: 'Laat Star Local technische blokkades oplossen zodat uw site beter presteert in Google. Vraag een technische audit of advies aan.',
    ...CTA,
  },
};

const conversieOptimalisatie: LocalServicePageContent = {
  city: CITY,
  citySlug: CITY_SLUG,
  province: PROVINCE,
  serviceName: 'Conversie-optimalisatie',
  serviceSlug: 'conversie-optimalisatie',
  nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['conversie-optimalisatie'],
  seo: {
    title: 'Conversie-optimalisatie Breda | Star Local',
    description:
      'Conversie-optimalisatie in Breda: meer aanvragen uit hetzelfde verkeer. Star Local verbetert CTA\'s, formulieren en vertrouwen op uw website voor Bredase bezoekers.',
  },
  hero: {
    label: 'Star Local · Conversie · Breda',
    h1: 'Conversie-optimalisatie in Breda',
    intro:
      'Bezoekers komen op uw site — maar nemen ze contact op? Star Local analyseert gebruikersgedrag en verbetert CTA\'s, formulieren en structuur zodat meer Bredase bezoekers klant worden.',
  },
  serviceIntro: {
    title: 'Meer resultaat uit bestaand verkeer',
    paragraphs: [
      'Conversie-optimalisatie draait om wat bezoekers doen op uw site: klikken ze op "Offerte aanvragen", vullen ze het formulier in, bellen ze — of haken ze af? In Breda, waar concurrentie online toeneemt, is elk verloren contactmoment kostbaar.',
      'Star Local kijkt naar CTA\'s, formulieren, paginastructuur, vertrouwenssignalen en mobiele conversie. We meten gedrag, testen verbeteringen en implementeren wat aantoonbaar meer aanvragen oplevert.',
      'Of u horeca, zakelijke dienstverlening, webshop of creatieve diensten levert: conversie-optimalisatie maakt het verschil tussen verkeer en omzet.',
    ],
  },
  localProblem: {
    title: 'Waarom conversie-optimalisatie belangrijk is in Breda',
    paragraphs: [
      'Veel Bredase websites trekken verkeer — via lokale SEO, advertenties of mond-tot-mond — maar converteren ondermaats. Onduidelijke CTA\'s, te lange formulieren, gebrek aan vertrouwenssignalen of slechte mobiele ervaring kosten dagelijks aanvragen.',
      'Klanten in Ginneken, het centrum of Breda-Noord vergelijken snel. Wie niet binnen seconden ziet hoe contact werkt, kiest een concurrent met een duidelijkere route.',
      'Zonder meten en verbeteren blijft u gissen. Conversie-optimalisatie maakt zichtbaar waar bezoekers afhaken en wat u concreet kunt aanpassen.',
    ],
  },
  localSolution: {
    title: 'Wat Star Local voor bedrijven in Breda doet',
    paragraphs: [
      'Star Local analyseert uw huidige site: heatmaps, scrollgedrag, formulier-voltooiing en contactroutes. We identificeren knelpunten en prioriteren verbeteringen met de hoogste impact.',
      'We optimaliseren CTA\'s, formulieren, paginastructuur en vertrouwenssignalen — afgestemd op mobiel gebruik in Breda. A/B-testen waar zinvol, implementatie van bewezen verbeteringen.',
      'Conversie-optimalisatie is iteratief. Star Local blijft meten en bijsturen wanneer uw verkeer, aanbod of doelgroep verandert.',
    ],
  },
  benefits: [
    {
      icon: 'growth',
      title: 'Meer aanvragen zonder extra verkeer',
      description:
        'Haal meer uit bezoekers die u al heeft — essentieel wanneer lokale SEO in Breda begint te renderen.',
    },
    {
      icon: 'mobile',
      title: 'Mobiele conversie',
      description:
        'Optimalisatie gericht op smartphone-gebruikers die onderweg in Breda uw site bezoeken.',
    },
    {
      icon: 'design',
      title: 'Sterkere CTA\'s',
      description:
        'Duidelijke, opvallende call-to-actions die bezoekers naar contact, bellen of bestellen leiden.',
    },
    {
      icon: 'communication',
      title: 'Betere formulieren',
      description:
        'Kortere, duidelijkere formulieren die meer voltooiingen opleveren — minder afhakers.',
    },
    {
      icon: 'custom',
      title: 'Vertrouwenssignalen',
      description:
        'Reviews, cases en garanties zichtbaar op de juiste plekken — cruciaal voor zakelijke dienstverlening en zorg.',
    },
    {
      icon: 'scale',
      title: 'Data-gedreven verbetering',
      description:
        'Beslissingen op basis van gedrag en resultaten, niet op onderbuikgevoel.',
    },
    {
      icon: 'seo',
      title: 'Koppeling met SEO',
      description:
        'Conversie en vindbaarheid versterken elkaar — sterke pagina\'s die zowel ranken als converteren.',
    },
  ],
  processSteps: [
    {
      number: '01',
      title: 'Gedraganalyse',
      description:
        'Inzicht in hoe bezoekers uw site gebruiken: waar klikken ze, waar haken ze af, welke pagina\'s converteren?',
    },
    {
      number: '02',
      title: 'Knelpunten & hypotheses',
      description:
        'Identificatie van conversieblokkades en formulering van concrete verbeteringen voor uw Bredase doelgroep.',
    },
    {
      number: '03',
      title: 'Implementatie',
      description:
        'Aanpassen van CTA\'s, formulieren, structuur en vertrouwenssignalen — met focus op mobiel.',
    },
    {
      number: '04',
      title: 'Meten & optimaliseren',
      description:
        'Volgen van resultaten en doorlopend bijsturen voor structureel hogere conversie.',
    },
  ],
  industries: {
    title: 'Conversie-optimalisatie voor bedrijven in Breda',
    items: BREDA_SHARED.industries,
    paragraphs: [
      'Horeca en winkels willen reserveringen en aanvragen. Zakelijke dienstverlening en coaches leunen op offerteaanvragen. Webshops en beauty streven naar bestellingen en afspraken. Bouw en logistiek willen snelle contactroutes voor serieuze leads.',
      'Star Local past conversie-optimalisatie toe per sector — met CTA\'s, formulieren en vertrouwenssignalen die passen bij hoe klanten in Breda beslissen.',
    ],
  },
  districts: {
    title: 'Conversie-optimalisatie voor heel Breda',
    intro:
      'Uw bezoekers komen uit alle wijken en bedrijventerreinen. Star Local optimaliseert websites voor ondernemers in Centrum, Ginneken, Brabantpark en de rest van Breda.',
    items: BREDA_SHARED.districts,
  },
  relatedServices: [
    related(
      'website-laten-maken',
      'Website laten maken Breda',
      'Nieuwe site bouwen met conversie en structuur vanaf de start.',
    ),
    related(
      'lokale-seo',
      'Lokale SEO Breda',
      'Meer relevant verkeer naar uw site — de basis voor conversie-optimalisatie.',
    ),
    related(
      'webshop-laten-maken',
      'Webshop laten maken Breda',
      'Webshop bouwen of verbeteren met checkout en productpagina\'s die converteren.',
    ),
  ],
  faqs: [
    {
      question: 'Wat is conversie-optimalisatie?',
      answer:
        'Het verbeteren van uw website zodat meer bezoekers de gewenste actie uitvoeren: contact opnemen, offerte aanvragen, reserveren of bestellen. Star Local analyseert gedrag en implementeert gerichte verbeteringen.',
    },
    {
      question: 'Werkt conversie-optimalisatie ook voor kleine bedrijven in Breda?',
      answer:
        'Ja. Juist lokale MKB-bedrijven profiteren wanneer elk contactmoment telt. Kleine aanpassingen aan CTA\'s en formulieren kunnen al merkbaar meer aanvragen opleveren.',
    },
    {
      question: 'Hoe meten jullie resultaat?',
      answer:
        'Via analytics, formulier-voltooiing, heatmaps en — waar zinvol — A/B-testen. Star Local rapporteert wat verbetert en wat de volgende stap is.',
    },
    {
      question: 'Kan conversie-optimalisatie op mijn bestaande site?',
      answer:
        'Ja. Star Local verbetert bestaande websites zonder volledige rebuild — tenzij de technische basis conversie structureel blokkeert.',
    },
    {
      question: 'Hoe snel zie ik resultaat?',
      answer:
        'Sommige verbeteringen — duidelijkere CTA\'s, kortere formulieren — kunnen snel effect tonen. Structurele optimalisatie is een doorlopend proces met cumulatief resultaat.',
    },
    {
      question: 'Is conversie-optimalisatie relevant na lokale SEO?',
      answer:
        'Absoluut. Lokale SEO brengt verkeer; conversie-optimalisatie zorgt dat dat verkeer ook klanten oplevert. Beide versterken elkaar voor ondernemers in Breda.',
    },
  ],
  neighbors: BREDA_NEIGHBORS,
  image: getLocalServiceImagePath('conversie-optimalisatie'),
  imageAlt: 'Conversie-optimalisatie in Breda — meer aanvragen uit websitebezoekers',
  bottomCta: {
    title: 'Meer aanvragen uit uw website in Breda?',
    text: 'Star Local helpt u meer bezoekers om te zetten in klanten. Vraag gratis advies aan over conversie-optimalisatie voor uw site.',
    ...CTA,
  },
};

const hostingEnOnderhoud: LocalServicePageContent = {
  city: CITY,
  citySlug: CITY_SLUG,
  province: PROVINCE,
  serviceName: 'Hosting en onderhoud',
  serviceSlug: 'hosting-en-onderhoud',
  nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['hosting-en-onderhoud'],
  seo: {
    title: 'Hosting en onderhoud Breda | Star Local',
    description:
      'Hosting en website-onderhoud in Breda: snelheid, beveiliging, updates en back-ups. Star Local houdt uw site stabiel, veilig en up-to-date voor ondernemers in Breda.',
  },
  hero: {
    label: 'Star Local · Hosting · Breda',
    h1: 'Hosting en onderhoud in Breda',
    intro:
      'Een website die traag, verouderd of kwetsbaar is, kost vertrouwen en aanvragen. Star Local verzorgt hosting, updates, back-ups en monitoring — zodat uw site in Breda stabiel en veilig online blijft.',
  },
  serviceIntro: {
    title: 'Betrouwbare hosting en professioneel onderhoud',
    paragraphs: [
      'Na livegang is uw website geen statisch product. Updates, beveiligingspatches, back-ups en performance-monitoring zijn nodig om snelheid, uptime en veiligheid te waarborgen. Voor Bredase ondernemers die op hun site vertrouwen voor aanvragen, is downtime geen optie.',
      'Star Local biedt hosting en onderhoud op maat: snelle servers, regelmatige updates, automatische back-ups, beveiligingsmonitoring en technische ondersteuning wanneer iets misgaat.',
      'Of uw site door Star Local is gebouwd of later is overgenomen: wij zorgen dat uw online visitekaartje in Breda betrouwbaar blijft draaien.',
    ],
  },
  localProblem: {
    title: 'Waarom hosting en onderhoud belangrijk is in Breda',
    paragraphs: [
      'Verouderde plugins, ontbrekende back-ups of trage hosting kosten niet alleen rankings — ook directe omzet. Een horecazaak in het centrum die offline gaat op zaterdagavond, of een logistiek bedrijf op Brabantpark met een gehackte site: de schade is onmiddellijk.',
      'Veel ondernemers in Breda onderhouden hun site zelf of vertrouwen op goedkope hosting zonder monitoring. Updates worden uitgesteld, back-ups ontbreken en problemen worden pas opgemerkt wanneer klanten klagen.',
      'Snelheid en uptime zijn rankingfactoren én vertrouwenssignalen. Wie professioneel wil ondernemen in Breda, heeft professioneel website-onderhoud nodig.',
    ],
  },
  localSolution: {
    title: 'Wat Star Local voor bedrijven in Breda doet',
    paragraphs: [
      'Star Local host uw site op snelle, betrouwbare infrastructuur — afgestemd op Astro en moderne webstandaarden. Regelmatige updates, beveiligingspatches en back-ups houden uw site veilig en actueel.',
      'We monitoren uptime en performance. Bij problemen schakelen we snel — zodat uw site in Breda en daarbuiten bereikbaar blijft voor klanten die contact willen opnemen.',
      'Technische ondersteuning staat klaar voor vragen, kleine aanpassingen en incidenten. U focust op ondernemen; wij op een stabiele online basis.',
    ],
  },
  benefits: [
    {
      icon: 'speed',
      title: 'Snelle, stabiele hosting',
      description:
        'Servers en configuratie afgestemd op snelle laadtijden — essentieel voor SEO en conversie in Breda.',
    },
    {
      icon: 'custom',
      title: 'Regelmatige updates',
      description:
        'Beveiligingspatches en software-updates zonder dat u zelf technisch beheer hoeft te doen.',
    },
    {
      icon: 'scale',
      title: 'Automatische back-ups',
      description:
        'Uw site en data veilig gesteld — herstel mogelijk bij incidenten of menselijke fouten.',
    },
    {
      icon: 'communication',
      title: 'Technische ondersteuning',
      description:
        'Direct contact bij problemen of vragen — geen ticketsystemen zonder antwoord.',
    },
    {
      icon: 'growth',
      title: 'Uptime-monitoring',
      description:
        'Proactieve controle zodat downtime snel wordt opgemerkt en opgelost.',
    },
    {
      icon: 'seo',
      title: 'Performance in stand houden',
      description:
        'Core Web Vitals en snelheid bewaken — rankingfactoren die u niet wilt verliezen.',
    },
    {
      icon: 'design',
      title: 'Beveiliging',
      description:
        'Monitoring en updates die kwetsbaarheden beperken — bescherming voor uw site en bezoekers.',
    },
  ],
  processSteps: [
    {
      number: '01',
      title: 'Inventarisatie',
      description:
        'Review van huidige hosting, platform, updates en back-ups — wat heeft uw site in Breda nodig?',
    },
    {
      number: '02',
      title: 'Migratie of setup',
      description:
        'Overstap naar betrouwbare hosting of optimalisatie van bestaande omgeving — zonder onnodige downtime.',
    },
    {
      number: '03',
      title: 'Onderhoudsplan',
      description:
        'Updates, back-ups, monitoring en support afspraken — helder en voorspelbaar.',
    },
    {
      number: '04',
      title: 'Doorlopend beheer',
      description:
        'Regelmatig onderhoud, incidentafhandeling en performance-bewaking — maand na maand.',
    },
  ],
  industries: {
    title: 'Hosting en onderhoud voor bedrijven in Breda',
    items: BREDA_SHARED.industries,
    paragraphs: [
      'Horeca en retail in het centrum kunnen geen offline site veroorloven in het weekend. Logistiek en zakelijke dienstverlening op bedrijventerreinen leunen op formulieren en contactroutes die altijd werken. Webshops, zorg en creatieve bedrijven hebben stabiele sites nodig voor vertrouwen en conversie.',
      'Star Local onderhoudt websites voor ondernemers in Breda die professioneel online willen blijven — zonder zelf technisch beheer te doen.',
    ],
  },
  districts: {
    title: 'Hosting en onderhoud in heel Breda',
    intro:
      'Waar u ook gevestigd bent: uw site moet 24/7 bereikbaar zijn. Star Local ondersteunt ondernemers in Centrum, Brabantpark, Ginneken en alle andere Bredase gebieden.',
    items: BREDA_SHARED.districts,
  },
  relatedServices: [
    related(
      'website-laten-maken',
      'Website laten maken Breda',
      'Nieuwe site bouwen op een platform dat klaar is voor professioneel onderhoud.',
    ),
    related(
      'technische-seo',
      'Technische SEO Breda',
      'Technische gezondheid en performance bewaken naast hosting en updates.',
    ),
    related(
      'conversie-optimalisatie',
      'Conversie-optimalisatie Breda',
      'Conversie verbeteren op een stabiele, snelle site die altijd online is.',
    ),
  ],
  faqs: [
    {
      question: 'Wat houdt hosting en onderhoud precies in?',
      answer:
        'Hosting is waar uw site draait; onderhoud omvat updates, back-ups, beveiliging, monitoring en technische support. Star Local verzorgt beide zodat uw site stabiel en veilig blijft.',
    },
    {
      question: 'Kunnen jullie ook sites onderhouden die niet door Star Local zijn gebouwd?',
      answer:
        'In veel gevallen wel, afhankelijk van platform en technische staat. Star Local beoordeelt eerlijk of overname of migratie zinvoller is voor uw situatie in Breda.',
    },
    {
      question: 'Hoe vaak worden back-ups gemaakt?',
      answer:
        'Star Local maakt automatische back-ups volgens een vast schema. Frequentie en retentie bespreken we in het onderhoudsplan — passend bij uw site en risico\'s.',
    },
    {
      question: 'Wat als mijn site offline gaat?',
      answer:
        'Met uptime-monitoring merken we problemen snel op. Star Local schakelt direct om downtime te beperken en uw site in Breda weer bereikbaar te maken.',
    },
    {
      question: 'Beïnvloedt hosting mijn SEO in Breda?',
      answer:
        'Ja. Trage of instabiele hosting schaadt Core Web Vitals en gebruikerservaring — rankingfactoren. Betrouwbare hosting is onderdeel van een gezonde SEO-basis.',
    },
    {
      question: 'Kan ik kleine wijzigingen laten doorvoeren via onderhoud?',
      answer:
        'Ja. Star Local biedt technische ondersteuning en kan kleine content- of technische aanpassingen verzorgen binnen het onderhoudsabonnement — afhankelijk van de afspraken.',
    },
  ],
  neighbors: BREDA_NEIGHBORS,
  image: getLocalServiceImagePath('hosting-en-onderhoud'),
  imageAlt: 'Hosting en website-onderhoud in Breda — snelheid, veiligheid en stabiliteit',
  bottomCta: {
    title: 'Betrouwbare hosting nodig in Breda?',
    text: 'Laat Star Local uw website hosten en onderhouden — snel, veilig en met technische support. Vraag vrijblijvend advies aan.',
    ...CTA,
  },
};

const aiSeo: LocalServicePageContent = {
  city: CITY,
  citySlug: CITY_SLUG,
  province: PROVINCE,
  serviceName: 'AI SEO',
  serviceSlug: 'ai-seo',
  nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['ai-seo'],
  seo: {
    title: 'AI SEO Breda | Star Local',
    description:
      'AI SEO in Breda: content en structuur optimaliseren voor AI-zoekmachines en moderne zoekervaringen. Star Local bereidt uw Bredase website voor op de toekomst.',
  },
  hero: {
    label: 'Star Local · AI SEO · Breda',
    h1: 'AI SEO in Breda',
    intro:
      'Zoeken verandert: AI-zoekmachines en rijke antwoorden vragen andere content en structuur. Star Local helpt Bredase bedrijven hun website voor te bereiden op moderne zoekervaringen — zonder lokale relevantie te verliezen.',
  },
  serviceIntro: {
    title: 'SEO voor de volgende generatie zoeken',
    paragraphs: [
      'AI SEO gaat verder dan klassieke keywords. Het draait om zoekintentie, gestructureerde content, interne links, contentactualisatie en data die AI-systemen en zoekmachines helpen uw site te begrijpen en aan te bevelen.',
      'Star Local analyseert bestaande pagina\'s, signaleert kansen en verbetert content en structuur — zodat uw site in Breda relevant blijft in traditionele Google-resultaten én in opkomende AI-zoekervaringen.',
      'Voor ondernemers in horeca, zakelijke dienstverlening, logistiek en creatieve sector: AI SEO is geen hype, maar voorbereiding op hoe klanten steeds vaker informatie vinden en beslissingen nemen.',
    ],
  },
  localProblem: {
    title: 'Waarom AI SEO belangrijk is in Breda',
    paragraphs: [
      'Klanten in Breda stellen steeds vaker complexe vragen aan zoekmachines en AI-assistenten: "beste kapper Ginneken", "logistiek bedrijf Brabantpark", "website bureau Breda". Wie content plat of verouderd houdt, mist zichtbaarheid in nieuwe zoekkanalen.',
      'Gestructuurde data, heldere contenthiërarchie en actuele pagina\'s helpen zowel Google als AI-systemen uw diensten te koppelen aan lokale intentie. Zonder die basis wint een concurrent die wél investeert in moderne SEO.',
      'AI SEO sluit aan op lokale SEO: uw Bredase context — wijken, sectoren, diensten — moet machine-leesbaar en commercieel sterk zijn. Dat vraagt meer dan keyword-stuffing of generieke teksten.',
    ],
  },
  localSolution: {
    title: 'Wat Star Local voor bedrijven in Breda doet',
    paragraphs: [
      'Star Local audit uw content en structuur: welke pagina\'s zijn verouderd, welke interne links ontbreken, waar is gestructureerde data nodig? We signaleren kansen en verbeteren pagina\'s gericht op zoekintentie en lokale relevantie.',
      'We actualiseren content, versterken interne links en optimaliseren structured data — zodat AI-zoekmachines en klassieke Google uw site beter begrijpen. Automatische verbeteringen waar zinvol, menselijke controle waar kwaliteit telt.',
      'AI SEO is een doorlopend proces. Star Local blijft pagina\'s verbeteren wanneer zoekgedrag, uw aanbod of de Bredase markt verandert.',
    ],
  },
  benefits: [
    {
      icon: 'growth',
      title: 'Voorbereid op AI-zoeken',
      description:
        'Content en structuur die aansluiten op hoe klanten steeds vaker via AI informatie vinden.',
    },
    {
      icon: 'seo',
      title: 'Zoekintentie centraal',
      description:
        'Pagina\'s afgestemd op wat prospects in Breda werkelijk zoeken — niet op verouderde keyword-trucs.',
    },
    {
      icon: 'custom',
      title: 'Contentactualisatie',
      description:
        'Verouderde pagina\'s verbeteren zodat uw site actueel en relevant blijft voor Google en AI.',
    },
    {
      icon: 'scale',
      title: 'Interne linkstructuur',
      description:
        'Sterke interne links die AI en zoekmachines helpen uw diensten en lokale pagina\'s te begrijpen.',
    },
    {
      icon: 'communication',
      title: 'Kansen signaleren',
      description:
        'Proactief identificeren van contentgaten en verbeterpunten in uw Bredase online aanwezigheid.',
    },
    {
      icon: 'design',
      title: 'Gestructureerde data',
      description:
        'Schema markup en structuur die machine-leesbaarheid en rijke resultaten ondersteunen.',
    },
    {
      icon: 'mobile',
      title: 'Lokaal én modern',
      description:
        'Bredase relevantie behouden terwijl u voorbereid bent op landelijke en AI-gedreven zoekervaringen.',
    },
  ],
  processSteps: [
    {
      number: '01',
      title: 'Content- en structuuranalyse',
      description:
        'Review van bestaande pagina\'s, interne links, structured data en verouderde content — met focus op Bredase relevantie.',
    },
    {
      number: '02',
      title: 'Kansen & prioriteiten',
      description:
        'Welke pagina\'s en onderwerpen leveren de meeste winst op voor AI SEO en lokale vindbaarheid?',
    },
    {
      number: '03',
      title: 'Verbetering & actualisatie',
      description:
        'Content verbeteren, links versterken, structured data toevoegen — pagina voor pagina.',
    },
    {
      number: '04',
      title: 'Monitoring & iteratie',
      description:
        'Volgen van ontwikkelingen in zoekgedrag en doorlopend verbeteren wanneer nieuwe kansen ontstaan.',
    },
  ],
  industries: {
    title: 'AI SEO voor bedrijven in Breda',
    items: BREDA_SHARED.industries,
    paragraphs: [
      'Zakelijke dienstverlening en coaches in Breda-Noord profiteren van content die vragen beantwoordt. Horeca en retail in het centrum willen gevonden worden op intentie-gerichte zoekopdrachten. Logistiek en creatieve bedrijven hebben vaak veel pagina\'s die actualisatie en structuur nodig hebben.',
      'Star Local past AI SEO toe per sector — met contentverbetering die lokaal in Breda resoneert en voorbereid is op moderne zoekervaringen.',
    ],
  },
  districts: {
    title: 'AI SEO voor ondernemers in heel Breda',
    intro:
      'Lokale context blijft centraal. Star Local verbetert content en structuur voor bedrijven in Centrum, Ginneken, Brabantpark en alle andere Bredase gebieden.',
    items: BREDA_SHARED.districts,
  },
  relatedServices: [
    related(
      'lokale-seo',
      'Lokale SEO Breda',
      'Klassieke lokale zichtbaarheid in Google en Maps als basis onder AI SEO.',
    ),
    related(
      'technische-seo',
      'Technische SEO Breda',
      'Technische fundering en structured data voor AI en zoekmachines.',
    ),
    related(
      'website-laten-maken',
      'Website laten maken Breda',
      'Nieuwe site bouwen met moderne structuur en content vanaf de start.',
    ),
  ],
  faqs: [
    {
      question: 'Is AI SEO geschikt voor een lokaal bedrijf in Breda?',
      answer:
        'Ja. Juist lokale bedrijven profiteren wanneer content en structuur aansluiten op hoe klanten zoeken — inclusief AI-zoekervaringen met lokale intentie zoals "kapper Ginneken" of "adviseur Breda".',
    },
    {
      question: 'Vervangt AI SEO lokale SEO?',
      answer:
        'Nee, het vult aan. Lokale SEO blijft essentieel voor Google en Maps. AI SEO bereidt uw content en structuur voor op aanvullende zoekkanalen en rijkere antwoorden.',
    },
    {
      question: 'Wat verbetert Star Local concreet op mijn site?',
      answer:
        'Verouderde content, interne links, structured data, paginastructuur en zoekintentie-afstemming. Star Local signaleert kansen en verbetert pagina\'s gericht op commerciële en lokale relevantie in Breda.',
    },
    {
      question: 'Hoe snel zie ik resultaat van AI SEO?',
      answer:
        'Contentverbeteringen kunnen geleidelijk effect tonen in rankings en zichtbaarheid. AI SEO is een doorlopend proces — Star Local geeft een realistisch beeld van verwachtingen.',
    },
    {
      question: 'Werkt AI SEO samen met mijn Google Bedrijfsprofiel?',
      answer:
        'Ja. Profiel en website versterken elkaar. AI SEO optimaliseert website-content; een sterk Google Bedrijfsprofiel ondersteunt lokale vindbaarheid in Maps — beide horen bij een complete aanpak in Breda.',
    },
    {
      question: 'Moet ik een nieuwe website hebben voor AI SEO?',
      answer:
        'Nee. Star Local verbetert bestaande pagina\'s en structuur. Bij verouderde of technisch zwakke sites kan een nieuwe site of migratie wel de snelste route zijn — dat bespreken we eerlijk.',
    },
  ],
  neighbors: BREDA_NEIGHBORS,
  image: getLocalServiceImagePath('ai-seo'),
  imageAlt: 'AI SEO in Breda — content en structuur voor moderne zoekervaringen',
  bottomCta: {
    title: 'Voorbereid op moderne zoeken in Breda?',
    text: 'Star Local helpt uw website klaar te maken voor AI-zoekmachines en klassieke Google. Vraag gratis advies aan over AI SEO voor uw bedrijf in Breda.',
    ...CTA,
  },
};

export const BREDA_LOCAL_SERVICES: LocalServicePageContent[] = [
  websiteLatenMaken,
  lokaleSeo,
  googleBedrijfsprofiel,
  webshopLatenMaken,
  technischeSeo,
  conversieOptimalisatie,
  hostingEnOnderhoud,
  aiSeo,
];

export function getBredaLocalService(slug: string): LocalServicePageContent | undefined {
  return BREDA_LOCAL_SERVICES.find((service) => service.serviceSlug === slug);
}

export function getAllBredaLocalServices(): LocalServicePageContent[] {
  return BREDA_LOCAL_SERVICES;
}

/** Type-safe slug list re-exported for route generation */
export { BREDA_LOCAL_SERVICE_SLUGS };
