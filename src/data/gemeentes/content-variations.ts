import { getEnrichment } from './enrichment';

export function hashSlug(slug: string): number {
  let h = 0;
  for (const char of slug) {
    h = (h * 31 + char.charCodeAt(0)) >>> 0;
  }
  return h;
}

export function pick<T>(items: T[], slug: string, offset = 0): T {
  return items[(hashSlug(slug) + offset) % items.length];
}

export function pickMany<T>(items: T[], slug: string, count: number, offset = 0): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pick(items, slug, offset + i));
  }
  return [...new Set(result)];
}

const PROVINCE_TRAITS: Record<string, string[]> = {
  'Noord-Holland': [
    'retail en horeca',
    'toerisme',
    'zakelijke dienstverlening',
    'logistiek',
    'creatieve sector',
    'tech en dienstverlening',
  ],
  'Zuid-Holland': [
    'industrie en logistiek',
    'maritieme activiteit',
    'retail',
    'zakelijke dienstverlening',
    'horeca',
    'tech en innovatie',
  ],
  'Noord-Brabant': [
    'industrie en logistiek',
    'tech en innovatie',
    'retail en horeca',
    'zakelijke dienstverlening',
    'creatieve sector',
    'agribusiness',
  ],
  Utrecht: [
    'kenniseconomie',
    'zorg en onderwijs',
    'retail',
    'creatieve sector',
    'zakelijke dienstverlening',
    'tech',
  ],
  Gelderland: [
    'industrie',
    'logistiek',
    'retail',
    'agribusiness',
    'zorg',
    'toerisme',
  ],
  Overijssel: [
    'industrie en tech',
    'logistiek',
    'retail',
    'agribusiness',
    'zakelijke dienstverlening',
    'toerisme',
  ],
  Limburg: [
    'industrie',
    'logistiek',
    'horeca en toerisme',
    'retail',
    'zorg',
    'agribusiness',
  ],
  Friesland: [
    'agribusiness',
    'toerisme',
    'retail',
    'maritieme sector',
    'zakelijke dienstverlening',
    'energie',
  ],
  Fryslân: [
    'agribusiness',
    'toerisme',
    'retail',
    'maritieme sector',
    'zakelijke dienstverlening',
    'energie',
  ],
  Groningen: [
    'energie',
    'retail',
    'logistiek',
    'onderwijs en zorg',
    'agribusiness',
    'industrie',
  ],
  Drenthe: [
    'toerisme',
    'retail',
    'industrie',
    'agribusiness',
    'zorg',
    'logistiek',
  ],
  Flevoland: [
    'logistiek',
    'agribusiness',
    'retail',
    'tech',
    'industrie',
    'zakelijke dienstverlening',
  ],
  Zeeland: [
    'toerisme',
    'logistiek',
    'maritieme sector',
    'industrie',
    'retail',
    'agribusiness',
  ],
};

export function getEconomicTraits(provincie: string, slug: string): string[] {
  const enrichment = getEnrichment(slug);
  if (enrichment?.economicTraits?.length) return enrichment.economicTraits;
  const traits = PROVINCE_TRAITS[provincie] ?? [
    'retail',
    'dienstverlening',
    'horeca',
    'ambacht',
    'zorg',
    'logistiek',
  ];
  return pickMany(traits, slug, 4);
}

export function traitsSummary(traits: string[], slug: string): string {
  const t0 = traits[0];
  const t1 = pick(traits, slug, 1);
  const t2 = pick(traits, slug, 2);
  return `${t0}, ${t1} en ${t2}`;
}

const META_TEMPLATES = [
  (n: string, p: string, t: string) =>
    `Website laten maken in ${n}? Star Local bouwt snelle websites met lokale SEO voor ondernemers in ${p} — ${t}.`,
  (n: string, p: string) =>
    `Professionele website laten maken in ${n}? Star Local helpt ondernemers in ${p} met lokale SEO, snelheid en conversie.`,
  (n: string, _p: string, t: string) =>
    `Star Local bouwt conversiegerichte websites in ${n} met lokale SEO. Ideaal voor ${t} — lokaal sterk, landelijk schaalbaar.`,
  (n: string, p: string) =>
    `Snelle, professionele website in ${n}? Star Local combineert lokale SEO en modern design voor ondernemers in ${p}.`,
  (n: string, _p: string, t: string) =>
    `Website laten maken ${n}: Star Local bouwt vindbare, snelle sites voor ${t}. Vraag een vrijblijvend gesprek aan.`,
  (n: string, p: string, t: string) =>
    `Lokaal online groeien in ${n}? Star Local bouwt websites met lokale SEO voor ${t} in ${p}.`,
];

export function uniqueMetaDescription(
  naam: string,
  provincie: string,
  slug: string,
  traits: string[],
): string {
  const summary = traitsSummary(traits, slug);
  const template = pick(META_TEMPLATES, slug);
  let desc = template(naam, provincie, summary);
  if (desc.length > 160) desc = desc.slice(0, 157) + '…';
  if (desc.length < 130) {
    desc = `Website laten maken in ${naam}? Star Local bouwt professionele, snelle websites met lokale SEO voor ondernemers in ${provincie}.`;
  }
  return desc.length > 160 ? desc.slice(0, 157) + '…' : desc;
}

const HERO_TEMPLATES = [
  (n: string, t: string) =>
    `In ${n} draait ondernemen om zichtbaarheid in een markt met ${t}. Star Local bouwt websites die snel laden, vertrouwen wekken en lokaal gevonden worden.`,
  (n: string) =>
    `Ondernemers in ${n} winnen online met een website die direct duidelijk maakt wat u doet — en bezoekers naar contact leidt. Star Local bouwt dat fundament.`,
  (n: string, t: string) =>
    `${n} vraagt om een professionele online aanwezigheid, zeker in sectoren als ${t}. Star Local bouwt snelle, conversiegerichte websites met lokale SEO.`,
  (n: string) =>
    `Klanten in ${n} zoeken online, vergelijken snel en kiezen binnen minuten. Star Local bouwt websites die op dat moment overtuigen — mobiel, snel en vindbaar.`,
  (n: string, t: string) =>
    `Of u actief bent in ${t} of een andere sector in ${n}: uw website moet lokaal gevonden worden én commercieel werken. Star Local regelt beide.`,
];

export function uniqueHeroIntro(
  naam: string,
  slug: string,
  traits: string[],
): string {
  const summary = traitsSummary(traits, slug);
  return pick(HERO_TEMPLATES, slug)(naam, summary);
}

const LOCAL_INTRO_OPENERS = [
  (n: string, p: string, t: string) =>
    `${n} heeft binnen ${p} een eigen economisch karakter. ${t.charAt(0).toUpperCase() + t.slice(1)} spelen een belangrijke rol — en online is de concurrentie daar even scherp als offline.`,
  (n: string, p: string, t: string) =>
    `In ${n} en ${p} concurreren ondernemers om dezelfde lokale aandacht. Sectoren als ${t} vragen om een professionele website die direct vertrouwen wekt.`,
  (n: string, _p: string, t: string) =>
    `${n} kent een gevarieerde lokale economie met ${t}. Wie online investeert, pakt kansen wanneer klanten zoeken en vergelijken.`,
];

const LOCAL_INTRO_MIDDLES = [
  (n: string) =>
    `Klanten in ${n} bellen of langskomen pas nadat ze online hebben gekeken. Uitstraling, snelheid en duidelijkheid bepalen of u in beeld komt — of een concurrent wint.`,
  (n: string) =>
    `Zonder sterke website mist u zichtbaarheid op het moment van keuze. In ${n} geldt: wie professioneel online staat, krijgt vaker de aanvraag.`,
  (n: string) =>
    `De meeste aanvragen in ${n} beginnen op smartphone. Uw site moet snel laden, helder uitleggen wat u doet en direct tot contact leiden.`,
];

const LOCAL_INTRO_CLOSERS = [
  (n: string, b: string) =>
    `Rond ${b} is online zichtbaarheid geen luxe. Star Local helpt ondernemers in ${n} om mee te dingen met een site die past bij hun markt.`,
  (n: string) =>
    `Star Local bouwt voor ondernemers in ${n} die serieus willen groeien — lokaal sterk, technisch klaar om verder te schalen.`,
  (n: string, b: string) =>
    `Of u werkt in het centrum of op ${b}: Star Local zorgt voor een website die lokaal relevant is en commercieel werkt.`,
];

export function buildLocalIntroParagraphs(
  naam: string,
  slug: string,
  provincie: string,
  traits: string[],
  businessText: string,
): string[] {
  const summary = traitsSummary(traits, slug);
  return [
    pick(LOCAL_INTRO_OPENERS, slug)(naam, provincie, summary),
    pick(LOCAL_INTRO_MIDDLES, slug, 1)(naam),
    pick(LOCAL_INTRO_CLOSERS, slug, 2)(naam, businessText),
    `Van zzp'er tot groeiend bedrijf in ${naam}: het begint met online zichtbaarheid die vertrouwen wekt en aanvragen oplevert.`,
  ];
}

const WHY_WEBSITE_VARIANTS = [
  [
    (n: string) =>
      `In ${n} is uw website vaak het eerste contactmoment. Bezoekers oordelen binnen seconden over professionaliteit en betrouwbaarheid.`,
    (n: string) =>
      `Een sterke site laat meteen zien wat u doet, voor wie u werkt in ${n} en hoe men contact opneemt — zonder omwegen of verouderde pagina's.`,
    (n: string) =>
      `Star Local bouwt websites met heldere diensten en duidelijke CTA's — afgestemd op hoe klanten in ${n} zoeken en kiezen.`,
  ],
  [
    (n: string) =>
      `Voor veel ondernemers in ${n} is de website het enige contactmoment vóór een offerte of afspraak. Die indruk telt.`,
    (n: string) =>
      `Geen trage laadtijden of onduidelijke propositie — wel een uitstraling die past bij uw ambities in ${n} en direct tot actie leidt.`,
    (_n: string) =>
      `Star Local bouwt mobile-first websites die converteren: snel, professioneel en gericht op aanvragen — niet alleen op indruk.`,
  ],
];

export function buildWhyWebsiteParagraphs(naam: string, slug: string): string[] {
  return pick(WHY_WEBSITE_VARIANTS, slug).map((fn) => fn(naam));
}

const LOCAL_SEO_VARIANTS = [
  [
    (n: string) =>
      `Lokaal gevonden worden in ${n} begint bij relevantie: content die aansluit op wat mensen zoeken, plus een sterk Google Bedrijfsprofiel.`,
    (n: string) =>
      `Star Local zorgt dat website en profiel één verhaal vertellen — consistent en afgestemd op ${n}.`,
    (_n: string) =>
      `Lokale vindbaarheid is een combinatie van goede content, techniek en focus op uw gemeente — geen truc, wel een solide aanpak.`,
  ],
  [
    (n: string) =>
      `Gevonden worden in ${n} betekent: verschijnen wanneer iemand uw dienst nodig heeft — via Google of Maps.`,
    (n: string) =>
      `Star Local koppelt uw website aan lokale content en een geoptimaliseerd Google Bedrijfsprofiel dat klopt met wat bezoekers op uw site vinden.`,
    (n: string) =>
      `Geen eindeloze SEO-theorie — wel een website en strategie die in ${n} concreet zichtbaarheid opleveren.`,
  ],
];

export function buildLocalSeoParagraphs(naam: string, slug: string): string[] {
  const base = pick(LOCAL_SEO_VARIANTS, slug).map((fn) => fn(naam));
  const extras = [
    (n: string, r: string) =>
      `Ook rond ${r} zoeken klanten lokaal. Star Local zorgt dat uw site aansluit op hoe mensen in ${n} en omgeving daadwerkelijk zoeken.`,
    (n: string, b: string) =>
      `Van ${b} tot het centrum: lokale SEO in ${n} werkt wanneer uw content past bij uw werkgebied en doelgroep.`,
    (n: string) =>
      `Star Local houdt het praktisch: pagina's, profiel en techniek die in ${n} samen resultaat opleveren.`,
  ];
  const retail = getEnrichment(slug)?.retailAreas?.[0] ?? 'het centrum';
  const business = getEnrichment(slug)?.businessAreas?.[0] ?? 'lokale bedrijventerreinen';
  const extraFn = pick(extras, slug, 3);
  return [...base, extraFn(naam, pick([retail, business], slug, 4))];
}

export function buildNationalGrowthParagraphs(naam: string, slug: string, provincie: string): string[] {
  const variants = [
    [
      (n: string) =>
        `Veel ondernemers in ${n} starten lokaal, maar bedienen later ook klanten in ${provincie} of landelijk. Uw website moet beide kunnen.`,
      (_n: string) =>
        `Star Local bouwt een technisch solide fundament. U voegt diensten of regio's toe zonder opnieuw te beginnen — met behoud van snelheid en SEO-waarde.`,
      (n: string) =>
        `Wie in ${n} online wint, kan met dezelfde site verder groeien — mits de basis professioneel staat.`,
    ],
    [
      (n: string) =>
        `Lokaal sterk in ${n}, regionaal actief in ${provincie}: dat vraagt om een website die meeschaleert zonder kwaliteit te verliezen.`,
      (_n: string) =>
        `Star Local bouwt met moderne techniek een platform waaraan u pagina's, diensten of taalvarianten toevoegt wanneer u groeit.`,
      (n: string) =>
        `Van lokale dienstverlener tot regionaal merk — het begint in ${n} met een site die vertrouwen wekt en technisch klaar is voor meer.`,
    ],
  ];
  return pick(variants, slug).map((fn) => fn(naam));
}

export function buildMarketParagraphs(
  naam: string,
  slug: string,
  traits: string[],
  retailText: string,
): string[] {
  const summary = traitsSummary(traits, slug);
  return [
    `${naam} combineert lokale binding met regionale concurrentie. Ondernemers in ${summary} opereren naast elkaar — online telt elke indruk.`,
    `Gebieden als ${retailText} trekken veel zoekverkeer. Wie daar zichtbaar wil zijn, heeft een website nodig die meedoet op snelheid en vindbaarheid.`,
    `Star Local bouwt voor ondernemers die in ${naam} willen winnen — lokaal overtuigend, later eenvoudig uitbreidbaar.`,
    `Uw online fundament in ${naam} moet meegroeien met uw ambities — niet remmen op verouderde techniek of onduidelijke propositie.`,
  ];
}

const SECTOR_POOL: Record<string, string[]> = {
  default: [
    'Horeca',
    'Retail',
    'Zakelijke dienstverlening',
    'Bouw en installatie',
    'Beauty',
    'Coaches en adviseurs',
    'Lokale winkels',
    'Zorg',
    'Transport en logistiek',
    'Creatieve bedrijven',
    'Technologie',
    'Agribusiness',
  ],
};

export function buildSectors(provincie: string, slug: string, traits: string[]): string[] {
  const pool = SECTOR_POOL.default;
  const prioritized = traits.flatMap((t) => {
    if (t.includes('horeca') || t.includes('retail')) return ['Horeca', 'Retail'];
    if (t.includes('logistiek') || t.includes('transport')) return ['Transport en logistiek'];
    if (t.includes('tech') || t.includes('innovatie')) return ['Technologie'];
    if (t.includes('zorg')) return ['Zorg'];
    if (t.includes('agri')) return ['Agribusiness'];
    if (t.includes('creatief')) return ['Creatieve bedrijven'];
    return [];
  });
  const combined = [...new Set([...prioritized, ...pickMany(pool, slug, 8, 5)])];
  return combined.slice(0, 8);
}

export function buildIndustriesParagraphs(naam: string, slug: string, traits: string[]): string[] {
  const summary = traitsSummary(traits, slug);
  const openers = [
    `${naam} kent ondernemers in ${summary}. Elke sector heeft eigen zoekgedrag — maar allemaal behoefte aan een professionele online basis.`,
    `Of u actief bent in ${summary} of een andere niche in ${naam}: uw website moet snel duidelijk maken wat u levert en voor wie.`,
  ];
  return [
    pick(openers, slug),
    `Star Local bouwt websites voor bedrijven die in ${naam} serieus willen meedingen — met duidelijke propositie, snelle laadtijden en een structuur die bezoekers naar contact leidt.`,
  ];
}

export function buildWhyStarLocalParagraphs(naam: string, slug: string, provincie: string): string[] {
  const variants = [
    [
      `Star Local combineert maatwerk, snelle Astro-techniek en lokale SEO. Geen generieke templates — wel controle over performance en vindbaarheid in ${naam}.`,
      `We bouwen mobile-first websites die direct professioneel aanvoelen. Van kennismaking tot livegang: heldere communicatie en realistische planning.`,
      `Uw site groeit mee wanneer u buiten ${naam} of ${provincie} uitbreidt — lokaal sterk, landelijk inzetbaar.`,
    ],
    [
      `Star Local helpt ondernemers in ${naam} met websites die commercieel werken — snel, vindbaar en afgestemd op uw markt.`,
      `Geen plugin-chaos of trage templates: wel een solide technische basis en lokale SEO die meegroeit met uw bedrijf.`,
      `Van ${naam} naar de bredere regio: één platform, één merkbeleving, schaalbaar wanneer u groeit.`,
    ],
  ];
  return pick(variants, slug);
}

export function defaultDistricts(naam: string, slug: string): string[] {
  const enrichment = getEnrichment(slug);
  if (enrichment?.districts?.length) return enrichment.districts;

  const urban = ['Centrum', 'Noord', 'Zuid', 'Oost', 'West', 'Industrieterrein', 'Winkelgebied', 'Bedrijventerrein'];
  const suburban = ['Centrum', 'Kern', 'Woonwijken', 'Bedrijventerrein', 'Winkelgebied', 'Buitengebied'];
  const rural = ['Dorpskern', 'Kernen', 'Centrum', 'Bedrijventerrein', 'Landerd', 'Winkelgebied'];

  const pools = [urban, suburban, rural];
  const pool = pick(pools, slug);
  const withName = pool.map((d) => (d === 'Centrum' ? `Centrum ${naam}` : d === 'Kern' ? `Kern ${naam}` : d));
  return [...new Set(withName)].slice(0, 8);
}

export function generateBusinessAreas(naam: string, slug: string): string[] {
  const enrichment = getEnrichment(slug);
  if (enrichment?.businessAreas?.length) return enrichment.businessAreas.slice(0, 6);

  const sets = [
    [`Centrum ${naam}`, `Bedrijventerrein ${naam}`, 'Industrieterrein', 'Handelsgebied', 'Kantorenpark'],
    [`${naam} Centrum`, 'Bedrijvenpark', 'Industrieweg', 'Zakelijke zone', 'Bedrijventerrein'],
    ['Centrum', `Bedrijventerrein ${naam}`, 'Industrieterrein', 'Kern', 'Handelslocatie'],
    [`${naam}-Noord`, 'Bedrijventerrein', 'Industriepark', 'Centrum', 'Logistiek terrein'],
  ];
  return pick(sets, slug).slice(0, 5);
}

export function generateLandmarks(naam: string, slug: string): string[] {
  const enrichment = getEnrichment(slug);
  if (enrichment?.retailAreas?.length) return enrichment.retailAreas.slice(0, 6);

  const sets = [
    [`Centrum ${naam}`, 'Winkelgebied', 'Markt', 'Stationsgebied', 'Gemeentehuis'],
    ['Het centrum', `Winkelhart ${naam}`, 'Marktplein', 'Kern', 'Dorpscentrum'],
    [`${naam} Centrum`, 'Winkelgebied', 'Hoofdstraat', 'Centrum', 'Overdekt winkelcentrum'],
  ];
  return pick(sets, slug).slice(0, 5);
}

export function businessAreasText(naam: string, slug: string): string {
  const areas = generateBusinessAreas(naam, slug);
  return areas.slice(0, 3).join(', ');
}

export function retailAreasText(naam: string, slug: string): string {
  const landmarks = generateLandmarks(naam, slug);
  return landmarks.slice(0, 3).join(', ');
}

export function buildUsps(naam: string, slug: string) {
  const titles = [
    [`Design voor ${naam}`, 'Maatwerk voor uw markt', `${naam}-waardig design`],
    ['Razendsnel op mobiel', 'Snelle websites', 'Mobile-first design'],
    ['Lokaal zichtbaar', 'Lokale SEO', 'Gevonden in uw regio'],
    ['Klaar om te schalen', 'Schaalbaar platform', 'Groei zonder herstart'],
  ];
  return [
    {
      icon: 'design' as const,
      title: pick(titles[0], slug),
      description: `Uitstraling die past bij ondernemers en klanten in ${naam}.`,
    },
    {
      icon: 'speed' as const,
      title: pick(titles[1], slug, 1),
      description: 'Essentieel voor klanten die onderweg zoeken en direct vergelijken.',
    },
    {
      icon: 'seo' as const,
      title: pick(titles[2], slug, 2),
      description: `Gevonden worden in ${naam} wanneer prospects naar uw dienst zoeken.`,
    },
    {
      icon: 'growth' as const,
      title: pick(titles[3], slug, 3),
      description: `Van ${naam} naar de regio — zonder opnieuw te beginnen.`,
    },
  ];
}

export function buildCityHighlights(naam: string, provincie: string, slug: string) {
  const customTitles = [
    `Kennis van ${naam}`,
    `Sterk in ${provincie}`,
    `Lokaal in ${naam}`,
  ];
  return [
    {
      icon: 'custom' as const,
      title: pick(customTitles, slug),
      description: 'We begrijpen hoe lokale klanten in uw regio online zoeken en kiezen.',
    },
    {
      icon: 'communication' as const,
      title: 'Persoonlijk contact',
      description: 'Direct schakelen, heldere planning, geen verrassingen achteraf.',
    },
    {
      icon: 'scale' as const,
      title: 'Schaalbaar platform',
      description: `Eén website die meegroeit wanneer u buiten ${naam} uitbreidt.`,
    },
  ];
}

export function buildFaqs(naam: string, provincie: string, slug: string) {
  const costAnswers = [
    `De investering hangt af van uw doelen: een compacte site voor een lokale dienstverlener vraagt een ander budget dan een uitgebreide website met webshop. Star Local bespreekt vooraf wat u nodig heeft in ${naam} — zonder overkill.`,
    `Star Local stemt het budget af op uw doelen in ${naam}. Een compacte bedrijfswebsite vraagt minder dan een uitgebreid platform — we bespreken vooraf wat commerciële waarde oplevert.`,
  ];
  const speedAnswers = [
    `Een professioneel traject duurt doorgaans enkele weken. Star Local werkt met een heldere planning; ondernemers in ${naam} kunnen snel schakelen wanneer u tijdig content aanlevert.`,
    `Doorgaans enkele weken — afhankelijk van scope en feedback. Star Local houdt het proces overzichtelijk: structuur, design, bouw, SEO-basis en livegang in ${naam}.`,
  ];

  return [
    {
      question: `Wat kost een website laten maken in ${naam}?`,
      answer: pick(costAnswers, slug),
    },
    {
      question: 'Hoe lang duurt het bouwen van een website?',
      answer: pick(speedAnswers, slug, 1),
    },
    {
      question: `Helpt Star Local met lokale SEO in ${naam}?`,
      answer: `Ja. Lokale SEO is kern van onze aanpak: dienstenpagina's, lokale content, Google Bedrijfsprofiel en een technische basis. Het doel is dat u verschijnt wanneer mensen in ${naam} of ${provincie} zoeken naar wat u levert.`,
    },
    {
      question: 'Kan mijn website ook landelijk gevonden worden?',
      answer: `Ja. Star Local bouwt websites die lokaal starten in ${naam} en technisch klaar zijn om landelijk te schalen. U voegt diensten of regio's toe binnen hetzelfde platform — met behoud van snelheid en SEO-waarde.`,
    },
    {
      question: 'Kunnen jullie een bestaande website verbeteren?',
      answer: `In veel gevallen wel. Als uw huidige site traag, verouderd of commercieel zwak is, onderzoeken we of redesign of migratie het meest zinnig is voor uw situatie in ${naam}.`,
    },
    {
      question: 'Is de website mobiel geoptimaliseerd?',
      answer: `Star Local bouwt mobile-first. In ${naam} komt een groot deel van uw verkeer via smartphone binnen. Uw site moet snel laden, duidelijk navigeren en direct tot contact leiden op elk scherm.`,
    },
    {
      question: 'Helpen jullie met het Google Bedrijfsprofiel?',
      answer: `Ja. Een sterk Google Bedrijfsprofiel hoort bij lokale vindbaarheid in ${naam}. Star Local zorgt dat profiel en website één consistent verhaal vertellen.`,
    },
    {
      question: `Werkt Star Local alleen in ${naam}?`,
      answer: `Deze pagina richt zich op ${naam}, maar Star Local helpt ondernemers in heel Nederland. Vanuit ${naam} kunt u later eenvoudig uitbreiden naar omliggende gemeenten of landelijk.`,
    },
  ];
}
