import type { GemeentePageContent } from '../types';
import { getGemeenteServices } from '../shared-services';

export const amsterdamGemeenteContent: GemeentePageContent = {
  slug: 'amsterdam',
  naam: 'Amsterdam',
  provincie: 'Noord-Holland',
  seo: {
    title: 'Website laten maken Amsterdam | Lokale SEO | Star Local',
    description:
      'Professionele website laten maken in Amsterdam? Star Local bouwt snelle, conversiegerichte websites met lokale SEO voor ondernemers in heel Amsterdam.',
  },
  hero: {
    eyebrow: 'Star Local · Amsterdam',
    h1: 'Website laten maken in Amsterdam',
    intro:
      'Amsterdamse ondernemers winnen online niet met een mooi plaatje alleen, maar met een website die snel laadt, vertrouwen wekt en lokaal gevonden wordt. Star Local bouwt dat fundament — gericht op Amsterdam, klaar om te groeien.',
  },
  services: getGemeenteServices('Amsterdam'),
  localIntro: {
    title: 'Ondernemen in Amsterdam',
    paragraphs: [
      'Amsterdam is een van de meest concurrerende economische centra van Nederland. Op de Zuidas presenteert een advocatenkantoor zich net zo scherp online als een boutique in de Negen Straatjes of een installateur in Amsterdam-Noord. De lat ligt hoog — en die lat wordt online bepaald.',
      'Klanten zoeken op "loodgieter Amsterdam", vergelijken drie aanbieders op hun telefoon en bellen degene die het snelst duidelijkheid geeft. In De Pijp, de Jordaan, Oost, West en Zuidoost geldt dezelfde regel: wie niet vindbaar is op het moment van zoeken, verliest omzet.',
      'Rond bedrijfsclusters als de Zuidas, NDSM, Sloterdijk en Amsterdam Science Park draait het om zichtbaarheid en vertrouwen. Winkelgebieden als de Negen Straatjes, Kalverstraat en Haarlemmerdijk trekken continu nieuwe zoekers. Lokale ondernemers die online investeren, pakken die kansen.',
      'Star Local helpt Amsterdamse bedrijven om professioneel mee te dingen — met een website die past bij deze markt, snel scannbaar is en direct tot contact leidt.',
      'Of u nu één wijk bedient of heel Amsterdam: het begint met online zichtbaarheid die vertrouwen wekt en commercieel werkt.',
    ],
  },
  whyWebsite: {
    title: 'Waarom een professionele website belangrijk is in Amsterdam',
    paragraphs: [
      'In Amsterdam is uw website vaak het enige contactmoment vóór het eerste gesprek. Bezoekers vergelijken binnen seconden: voelt dit bedrijf professioneel, begrijp ik wat ze doen, kan ik snel contact opnemen?',
      'Een sterke site laat direct zien wat u doet, voor welke klanten in Amsterdam u werkt en hoe men een offerte aanvraagt. Geen verouderde pagina\'s of onduidelijke diensten — wel een uitstraling die past bij een serieuze speler in deze stad.',
      'Star Local bouwt websites die converteren: heldere diensten, duidelijke CTA\'s en een structuur die bezoekers naar actie leidt. In Amsterdam telt elke indruk.',
    ],
  },
  localSeo: {
    title: 'Lokaal gevonden worden in Amsterdam',
    paragraphs: [
      'Gevonden worden in Amsterdam begint bij relevantie: pagina\'s die aansluiten op wat Amsterdammers zoeken, plus een sterk Google Bedrijfsprofiel dat klopt met uw website.',
      'Star Local zorgt dat website en profiel één verhaal vertellen — consistent over Centrum, Noord, Zuid en elke andere wijk waar u klanten bedient.',
      'Lokale vindbaarheid in Amsterdam is geen truc, maar een combinatie van goede content, techniek en focus op uw stad. Dat is waar wij u mee helpen.',
      'Geen eindeloze SEO-handleiding — wel een website en aanpak die in Amsterdam concreet resultaat opleveren.',
    ],
  },
  nationalGrowth: {
    title: 'Van lokale zichtbaarheid naar landelijke groei',
    paragraphs: [
      'Veel Amsterdamse ondernemers starten met een lokale focus — één wijk, één doelgroep, één duidelijke propositie. Maar de stad trekt ook landelijke en internationale klanten aan. Uw website moet beide kunnen: lokaal overtuigen én schalen wanneer u buiten Amsterdam groeit.',
      'Star Local bouwt met Astro een licht, technisch solide fundament. U voegt later diensten, regio\'s of taalvarianten toe zonder opnieuw te beginnen. Zo blijft uw SEO-waarde behouden terwijl u uitbreidt.',
      'Van Zuidas-adviseur tot retailer in Oost: wie in Amsterdam wint, kan met dezelfde site ook landelijk concurreren — mits de basis professioneel is gelegd.',
    ],
  },
  aboutCity: {
    title: 'Amsterdam als ondernemersmarkt',
    paragraphs: [
      'Amsterdam combineert toerisme, internationale zakelijke activiteit, creatieve industrie, retail en tech. Die mix maakt de stad aantrekkelijk én veeleisend: klanten vergelijken snel en verwachten online hetzelfde niveau als offline.',
      'Van horeca in het Centrum tot B2B-dienstverleners op de Zuidas: elke sector heeft eigen zoekgedrag. Wie dat begrijpt en vertaalt naar een professionele website, wint aanvragen.',
      'Star Local bouwt voor ondernemers die in Amsterdam willen domineren — lokaal sterk, landelijk uitbreidbaar wanneer u groeit.',
      'Van zzp\'er op de Zuidas tot retailer in Oost: uw online fundament moet meegroeien met uw ambities, niet remmen op verouderde techniek.',
    ],
  },
  industries: {
    title: 'Voor welke bedrijven wij werken in Amsterdam',
    paragraphs: [
      'Amsterdam kent een brede mix van sectoren — van horeca en retail in het centrum tot tech, creatieve bureaus en zakelijke dienstverlening op de Zuidas. Elke sector heeft eigen zoekgedrag en verwachtingen online.',
      'Star Local bouwt websites voor ondernemers die serieus willen meedoen in die markt: duidelijke propositie, snelle laadtijden en een structuur die bezoekers naar contact leidt — afgestemd op hoe klanten in Amsterdam zoeken.',
    ],
    sectors: [
      'Horeca',
      'Retail',
      'Zakelijke dienstverlening',
      'Creatieve bedrijven',
      'Technologie',
      'Beauty',
      'Bouw en installatie',
      'Coaches en adviseurs',
    ],
  },
  whyStarLocal: {
    title: 'Waarom Star Local',
    paragraphs: [
      'Star Local combineert maatwerk, snelle Astro-techniek en lokale SEO in één aanpak. Geen generieke templates of plugin-chaos — wel controle over performance, design en vindbaarheid.',
      'We begrijpen dat Amsterdam een veeleisende markt is. Uw website moet direct professioneel aanvoelen, mobiel perfect werken en commercieel resultaat opleveren. Dat is waar wij ons op richten.',
      'Van eerste gesprek tot livegang en doorontwikkeling: heldere communicatie, realistische planning en een site die meegroeit met uw ambities — lokaal in Amsterdam en verder.',
    ],
  },
  districts: {
    title: 'Wijken en belangrijke gebieden in Amsterdam',
    intro: 'Online zichtbaarheid in Amsterdam is niet alleen een centrum-verhaal. Star Local ondersteunt ondernemers in heel de stad.',
    items: [
      'Centrum',
      'Noord',
      'Zuid',
      'Oost',
      'West',
      'Zuidoost',
      'De Pijp',
      'Jordaan',
      'Zuidas',
      'IJburg',
    ],
    businessAreas: [],
    landmarks: [],
  },
  usps: [
    {
      icon: 'design',
      title: 'Amsterdam-waardig design',
      description: 'Uitstraling die past bij een concurrerende markt — geen generiek template.',
    },
    {
      icon: 'speed',
      title: 'Razendsnel op mobiel',
      description: 'Essentieel in een stad waar bijna alles via smartphone wordt gezocht.',
    },
    {
      icon: 'seo',
      title: 'Lokaal zichtbaar',
      description: 'Gevonden worden in Amsterdam wanneer klanten naar uw dienst zoeken.',
    },
    {
      icon: 'growth',
      title: 'Klaar om te schalen',
      description: 'Van Amsterdam naar heel Nederland — zonder opnieuw te beginnen.',
    },
  ],
  steps: [
    {
      number: '01',
      title: 'Kennismaking',
      description: 'We bespreken uw doelen, markt in Amsterdam en wat uw website concreet moet opleveren.',
    },
    {
      number: '02',
      title: 'Design & bouw',
      description: 'Professioneel ontwerp, snelle Astro-techniek en content die bij uw merk past.',
    },
    {
      number: '03',
      title: 'Lancering',
      description: 'Livegang met lokale SEO-basis — zichtbaar in Amsterdam vanaf dag één.',
    },
    {
      number: '04',
      title: 'Groei',
      description: 'Optimaliseren en uitbreiden wanneer u nieuwe wijken of diensten toevoegt.',
    },
  ],
  stats: [
    { value: '< 2s', label: 'Typische laadtijd op mobiel' },
    { value: '8', label: 'Diensten onder één dak' },
    { value: '100%', label: 'Mobile-first ontwerp' },
    { value: 'NL', label: 'Lokaal én landelijk inzetbaar' },
  ],
  cityHighlights: [
    {
      icon: 'custom',
      title: 'Kennis van Amsterdam',
      description: 'Van Zuidas tot Noord — we begrijpen hoe verschillende wijken online zoeken.',
    },
    {
      icon: 'communication',
      title: 'Persoonlijk contact',
      description: 'Direct schakelen, heldere planning, geen verrassingen achteraf.',
    },
    {
      icon: 'scale',
      title: 'Schaalbaar platform',
      description: 'Eén website die meegroeit wanneer u buiten Amsterdam uitbreidt.',
    },
  ],
  faqs: [
    {
      question: 'Wat kost een website laten maken in Amsterdam?',
      answer:
        'De investering hangt af van uw doelen: een compacte site voor een lokale dienstverlener vraagt een ander budget dan een uitgebreide website met meerdere diensten of webshop. Star Local bespreekt vooraf wat u nodig heeft om zichtbaar te worden in Amsterdam — zonder overkill, maar ook zonder een site die binnen een jaar opnieuw moet.',
    },
    {
      question: 'Hoe snel kan mijn website live staan?',
      answer:
        'Een professioneel traject duurt doorgaans enkele weken, afhankelijk van scope en content. Star Local werkt met een heldere planning: structuur, design, bouw, SEO-basis en livegang. Amsterdamse ondernemers willen vaak snel schakelen — dat kan, mits u tijdig content en feedback aanlevert.',
    },
    {
      question: 'Helpen jullie met lokale vindbaarheid in Amsterdam?',
      answer:
        'Ja. Lokale SEO is kern van onze aanpak: dienstenpagina\'s, lokale content, Google Bedrijfsprofiel en een technische basis. Het doel is dat u verschijnt wanneer mensen in Amsterdam zoeken naar wat u levert — met een fundament dat meegroeit.',
    },
    {
      question: 'Is mijn website mobiel geoptimaliseerd?',
      answer:
        'Star Local bouwt mobile-first. In Amsterdam komt het merendeel van uw verkeer via smartphone binnen. Uw site moet snel laden, duidelijk navigeren en direct tot contact leiden — op elk scherm, in elke wijk.',
    },
    {
      question: 'Werken jullie alleen in Amsterdam?',
      answer:
        'Deze pagina richt zich op Amsterdam, maar Star Local helpt ondernemers in heel Nederland. Vanuit Amsterdam kunt u later eenvoudig uitbreiden naar omliggende gemeenten of landelijk — binnen hetzelfde platform.',
    },
    {
      question: 'Waarom Star Local in plaats van een template?',
      answer:
        'Templates missen vaak snelheid, lokale relevantie en conversie. Star Local bouwt custom websites met moderne techniek — geen plugin-chaos, wel controle over performance en SEO. In Amsterdam telt elke seconde en elke indruk; uw site moet direct professioneel aanvoelen.',
    },
    {
      question: 'Kan ik later uitbreiden buiten Amsterdam?',
      answer:
        'Ja. Star Local bouwt websites die lokaal starten in Amsterdam en technisch klaar zijn om landelijk te schalen. U voegt diensten of regio\'s toe binnen hetzelfde platform — zonder opnieuw te beginnen, met behoud van snelheid en SEO-waarde.',
    },
    {
      question: 'Kunnen jullie mijn bestaande website verbeteren?',
      answer:
        'In veel gevallen wel. Als uw huidige site traag, verouderd of commercieel zwak is, onderzoeken we of redesign of migratie het meest zinnig is. Star Local kijkt eerlijk naar uw situatie: wat levert de snelste route naar betere resultaten in Amsterdam?',
    },
  ],
  neighbors: [],
  bottomCta: {
    title: 'Klaar om online te groeien in Amsterdam?',
    text: 'Laat een professionele website bouwen die lokaal zichtbaar is in Amsterdam. Vraag een vrijblijvend gesprek aan — we denken graag met u mee.',
    primaryLabel: 'Gratis offerte',
    secondaryLabel: 'Neem contact op',
  },
};
