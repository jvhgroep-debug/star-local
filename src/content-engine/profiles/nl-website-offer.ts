/**
 * Curated local profiles for the three Website laten maken (€199) test cities.
 * Only soft, non-invented context: province, known sector character, nearby names from dataset.
 */
export interface CityOfferProfile {
  slug: string;
  /** Branches that fit this city without claiming exact counts. */
  audiences: string[];
  /** Short sector framing used in intros and meta. */
  sectorFocus: string;
  /** Search-term style phrases for natural local SEO wording. */
  searchPhrases: string[];
  /** Unique local intro (hero subtitle support / section). */
  localIntro: string;
  /** Long local section — min ~250 words. */
  localArticle: string[];
}

export const CITY_OFFER_PROFILES: Record<string, CityOfferProfile> = {
  amsterdam: {
    slug: 'amsterdam',
    audiences: [
      'horeca en cafés',
      'retail en conceptstores',
      'creatieve bureaus',
      'zzp-consultants',
      'schoonheidssalons',
      'fitness en coaches',
      'taxidiensten',
      'bouw- en klusbedrijven',
      'tech startups',
      'lokale dienstverleners',
    ],
    sectorFocus: 'horeca, retail, creatieve dienstverlening en zakelijke zzp’ers',
    searchPhrases: [
      'website laten maken Amsterdam',
      'webdesign Amsterdam',
      'goedkope website Amsterdam',
      'bedrijfswebsite Amsterdam',
    ],
    localIntro:
      'In Amsterdam vergelijken klanten snel meerdere aanbieders. Een duidelijke, snelle website helpt ondernemers om vertrouwen te winnen — of je nu in de stad zelf zit of klanten trekt uit omliggende gemeenten zoals Amstelveen en Aalsmeer.',
    localArticle: [
      'Website laten maken voor ondernemers in Amsterdam vraagt om meer dan een standaard landelijke tekst. Amsterdam ligt in Noord-Holland en is een grootstedelijke markt waarin horeca, retail, creatieve bureaus en zelfstandige professionals naast elkaar opereren. Bezoekers verwachten snelle laadtijden, een heldere dienstomschrijving en een makkelijke manier om contact op te nemen — vaak via mobiel.',
      'Lokale vindbaarheid speelt daarbij een grote rol. Mensen zoeken gericht op formuleringen als “website laten maken Amsterdam” of “bedrijfswebsite Amsterdam”. Wie online vaag blijft, verliest sneller aan concurrenten die wél laten zien wat ze doen, waar ze actief zijn en hoe je een afspraak maakt. Een professionele basiswebsite van vijf pagina’s geeft precies die duidelijkheid: wie je bent, wat je biedt, en hoe klanten je bereiken.',
      'Ondernemers in Amsterdam bedienen vaak niet alleen de stad zelf. Klanten komen ook uit omliggende gemeenten in de regio, zoals Amstelveen, Aalsmeer of andere plaatsen in Noord-Holland. Daarom is het slim om online bereikbaar te zijn met een site die zowel lokaal herkenbaar is als technisch stevig staat. Denk aan nette paginatitels, een logische structuur en contactopties die op telefoon én desktop werken.',
      'Voor branches als horeca, retail, coaches, kappers, bouwbedrijven en consultants geldt hetzelfde: online moet het in één oogopslag kloppen. Een menukaart, portfolio of tarievenoverzicht kan later nog worden toegevoegd, maar de basis moet eerst vertrouwen wekken. Met de actieprijs van €199 excl. btw krijg je die basis zonder een groot traject te starten.',
      'Star Local werkt digitaal met ondernemers in Amsterdam en omgeving. Overleg kan via telefoon, WhatsApp of videogesprek. Zo blijft het proces overzichtelijk, met een vaste scope van maximaal vijf pagina’s en ruimte om later uit te breiden wanneer jouw bedrijf in Amsterdam groeit.',
    ],
  },
  rotterdam: {
    slug: 'rotterdam',
    audiences: [
      'logistieke dienstverleners',
      'industrie en toelevering',
      'bouwbedrijven',
      'installatiebedrijven',
      'horeca',
      'retail',
      'zzp’ers in de havenregio',
      'schoonmaakbedrijven',
      'autobedrijven',
      'lokale specialisten',
    ],
    sectorFocus: 'logistiek, industrie, bouw en praktische dienstverlening',
    searchPhrases: [
      'website laten maken Rotterdam',
      'webdesign Rotterdam',
      'bedrijfswebsite Rotterdam',
      'website voor ondernemers Rotterdam',
    ],
    localIntro:
      'Rotterdam is een zakelijke, no-nonsense omgeving. Ondernemers in Zuid-Holland willen online vooral duidelijkheid: wat doe je, voor wie, en hoe snel kan iemand contact opnemen — ook vanuit plaatsen als Capelle aan den IJssel of Schiedam.',
    localArticle: [
      'Een website laten maken in Rotterdam is voor veel ondernemers een praktische keuze: je wilt online serieus overkomen zonder weken in een duur traject te zitten. Rotterdam ligt in Zuid-Holland en kent een sterke mix van logistiek, industrie, bouw, horeca en lokale dienstverlening. Klanten zoeken vaak gericht naar een betrouwbare partij in de regio en verwachten een website die snel laadt en meteen laat zien wat je levert.',
      'Online vindbaarheid rond zoektermen als “website laten maken Rotterdam” of “bedrijfswebsite Rotterdam” helpt om zichtbaar te worden bij mensen die écht op zoek zijn. Tegelijk is een website meer dan SEO: het is je visitekaartje wanneer iemand je via via hoort, een visitekaartje scant of je Google-bedrijfsprofiel bekijkt. Zonder duidelijke site blijft de volgende stap hangen.',
      'Veel Rotterdamse ondernemers werken regionaal. Opdrachten komen niet alleen uit de stad, maar ook uit omliggende gemeenten zoals Capelle aan den IJssel, Barendrecht of Schiedam. Een overzichtelijke website met heldere diensten, bereikbaarheid en contactmogelijkheden maakt het makkelijker om ook die regionale klanten te bedienen — zonder dat je meteen een complexe multi-locatie site nodig hebt.',
      'Voor bouwbedrijven, installateurs, logistieke dienstverleners, horeca en zzp’ers geldt: laat zien waar je sterk in bent, welke werkwijze je hanteert en hoe iemand vrijblijvend contact opneemt. Vijf professionele pagina’s zijn daarvoor vaak genoeg als start. Later kun je uitbreiden met projecten, blogs of extra diensten.',
      'Star Local bouwt voor ondernemers in Rotterdam een moderne basiswebsite voor €199 excl. btw. We werken digitaal en stemmen de inhoud af op jouw bedrijf in de Rotterdamse markt — met focus op snelheid, mobiel gebruik en een structuur die klaar is om verder te groeien in Zuid-Holland.',
    ],
  },
  breda: {
    slug: 'breda',
    audiences: [
      'horeca en cafés',
      'retail',
      'schoonheidssalons',
      'kappers',
      'bouw- en klusbedrijven',
      'coaches',
      'consultants',
      'zorgondersteunende diensten',
      'events en hospitality',
      'lokale zzp’ers',
    ],
    sectorFocus: 'horeca, retail, persoonlijke dienstverlening en MKB',
    searchPhrases: [
      'website laten maken Breda',
      'webdesign Breda',
      'bedrijfswebsite Breda',
      'website laten maken Noord-Brabant',
    ],
    localIntro:
      'In Breda en de rest van Noord-Brabant groeien veel bedrijven via mond-tot-mondreclame én online zoekgedrag. Een professionele website maakt die twee werelden rond: herkenbaar lokaal, technisch klaar voor klanten uit de stad en omgeving.',
    localArticle: [
      'Website laten maken voor ondernemers in Breda betekent: lokaal relevant zijn zonder overdreven marketingtaal. Breda ligt in Noord-Brabant en heeft een levendige mix van horeca, retail, persoonlijke dienstverlening en MKB. Bezoekers willen snel weten of je in de buurt actief bent, wat je kost of biedt, en hoe ze je kunnen bereiken — vaak vanaf hun telefoon.',
      'Zoekopdrachten als “website laten maken Breda” of “webdesign Breda” laten zien dat er lokale intentie is. Wie alleen op social media zichtbaar is, mist bezoekers die liever eerst een serieuze website bekijken. Een heldere basis van vijf pagina’s helpt je om diensten, werkwijze en contact netjes te presenteren, met basis-SEO zodat je pagina’s überhaupt vindbaar kunnen worden.',
      'Ondernemers in Breda trekken regelmatig ook klanten uit omliggende gemeenten in Brabant. In onze dataset staan bijvoorbeeld plaatsen als Best, Bladel of Boxtel in de nabije set; of jouw bereik precies daar ligt, hangt van je dienst af. Online is het vooral belangrijk dat je bereikbaarheid en dienstverlening duidelijk zijn, zodat geïnteresseerden uit de regio niet afhaken.',
      'Voor kappers, salons, horeca, coaches, bouwbedrijven en consultants in Breda werkt een overzichtelijke site het best: geen overbodige ballast, wél sterke call-to-actions. Denk aan een duidelijke home, een dienstenoverzicht, een korte over-ons, FAQ of projecten, en een contactpagina. Extra pagina’s kunnen later, wanneer je merkt welke content echt nodig is.',
      'Met Star Local krijg je in Breda een moderne website voor €199 excl. btw. We stemmen de inhoud af op jouw lokale context in Noord-Brabant, zorgen voor een snelle technische basis en houden de afspraken overzichtelijk — zodat je snel professioneel online staat en later kunt uitbreiden.',
    ],
  },
  nuenen: {
    slug: 'nuenen',
    audiences: [
      'zzp’ers',
      'horeca',
      'retail',
      'bouw- en klusbedrijven',
      'coaches',
      'lokale dienstverleners',
    ],
    sectorFocus: 'lokaal MKB en persoonlijke dienstverlening in Nuenen',
    searchPhrases: [
      'website laten maken Nuenen',
      'webdesign Nuenen',
      'bedrijfswebsite Nuenen',
    ],
    localIntro:
      'Nuenen is een woonplaats in de gemeente Nuenen, Gerwen en Nederwetten (Noord-Brabant). Ondernemers die lokaal gevonden willen worden op “Nuenen”, hebben baat bij een duidelijke website — naast de bredere gemeentepagina.',
    localArticle: [
      'Website laten maken in Nuenen richt zich op ondernemers die klanten aanspreken vanuit deze plaats in Noord-Brabant. Nuenen valt bestuurlijk onder de gemeente Nuenen, Gerwen en Nederwetten. Voor zoekverkeer is de plaatsnaam vaak relevanter dan de lange gemeentenaam: mensen zoeken “webdesign Nuenen” of “website laten maken Nuenen”.',
      'Een compacte basiswebsite van vijf pagina’s helpt je om diensten, bereikbaarheid en contact helder te tonen. Dat is nuttig voor zzp’ers, horeca, retail en lokale dienstverleners die in en rond Nuenen actief zijn, zonder meteen een complexe multi-locatiesite te bouwen.',
      'Wil je ook de officiële gemeente-context meenemen? Bekijk dan onze pagina voor Nuenen, Gerwen en Nederwetten. Beide pagina’s kunnen naast elkaar bestaan: Nuenen voor plaatsgerichte zoekintentie, de gemeentepagina voor de bredere regio.',
      'Star Local levert het €199-pakket (excl. btw) digitaal op: vijf pagina’s, mobiel ontwerp en basis-SEO. Extra uitbreidingen bespreken we vooraf, zodat de scope helder blijft.',
      'Zo combineer je lokale herkenning in Nuenen met een professionele technische basis die klaar is om later te groeien binnen Noord-Brabant.',
    ],
  },
};

export function getCityOfferProfile(slug: string): CityOfferProfile | undefined {
  return CITY_OFFER_PROFILES[slug];
}
