import { BREDA_LOCAL_SERVICE_SLUGS, LOCAL_TO_NATIONAL_SLUG } from './config';

export type ServiceBenefitIcon =
  | 'speed'
  | 'design'
  | 'seo'
  | 'mobile'
  | 'communication'
  | 'scale'
  | 'custom'
  | 'growth';

export interface ServiceBenefitTemplate {
  icon: ServiceBenefitIcon;
  title: string;
  descriptionTemplate: string;
}

export interface ServiceProcessStepTemplate {
  number: string;
  title: string;
  descriptionTemplate: string;
}

export interface ServiceFaqTemplate {
  questionTemplate: string;
  answerTemplate: string;
}

export interface ServiceDefinition {
  slug: string;
  name: string;
  nationalServiceSlug: string;
  h1Template: string;
  seoTitleTemplates: string[];
  metaDescriptionTemplates: string[];
  heroIntroTemplates: string[];
  serviceIntroTitleTemplate: string;
  serviceIntroParagraphs: string[];
  localProblemTitleTemplate: string;
  localProblemParagraphs: string[];
  localSolutionTitleTemplate: string;
  localSolutionParagraphs: string[];
  benefits: ServiceBenefitTemplate[];
  processSteps: ServiceProcessStepTemplate[];
  industriesTitleTemplate: string;
  industriesParagraphs: string[];
  districtsTitleTemplate: string;
  districtsIntroTemplate: string;
  relatedSlugs: string[];
  relatedDescriptionTemplate: string;
  faqTemplates: ServiceFaqTemplate[];
  imageAltTemplate: string;
  bottomCtaTitleTemplate: string;
  bottomCtaTextTemplate: string;
}

export const SERVICE_DEFINITIONS: ServiceDefinition[] = [
  {
    slug: 'website-laten-maken',
    name: 'Website laten maken',
    nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['website-laten-maken'],
    h1Template: 'Website laten maken in {city}',
    seoTitleTemplates: [
      'Website laten maken {city} | Star Local',
      'Professionele website in {city} laten bouwen | Star Local',
      '{serviceName} in {city}: snel, lokaal en schaalbaar | Star Local',
    ],
    metaDescriptionTemplates: [
      'Website laten maken in {city}? Star Local bouwt snelle, conversiegerichte websites met lokale SEO voor ondernemers in {province}.',
      'Professionele website in {city} nodig? Star Local bouwt mobielvriendelijke sites met lokale SEO, snelheid en conversie op maat.',
      'Meer aanvragen uit {city}: Star Local bouwt razendsnelle websites met een sterke lokale SEO-basis voor ondernemers in {traits}.',
      'Website laten maken voor bedrijven in {city}? Star Local combineert modern design, snelheid en lokale vindbaarheid in {province}.',
    ],
    heroIntroTemplates: [
      'Wilt u met uw bedrijf in {city} professioneel online zichtbaar worden? Star Local bouwt snelle, conversiegerichte websites die lokaal gevonden worden. Zo kiest u niet voor een sjabloon, maar voor een platform dat meegroeit.',
      'Een sterke website is vaak het eerste contactmoment met klanten in {city}. Star Local bouwt met moderne Astro-techniek: licht, snel en klaar voor lokale én landelijke groei. Zo wekt uw site vertrouwen nog voor het eerste telefoontje.',
      'In {city} vergelijken klanten binnen seconden wie professioneel overkomt. Star Local bouwt websites die er op elk scherm overtuigend uitzien en snel laden. Zo wint u aanvragen die anders naar de concurrent gaan.',
    ],
    serviceIntroTitleTemplate: 'Een website die past bij ondernemen in {city}',
    serviceIntroParagraphs: [
      'In {city} vergelijken klanten razendsnel: een ondernemer rond {district}, een bedrijf nabij {district2} of een dienstverlener op {businessArea} — iedereen wordt online beoordeeld op uitstraling, snelheid en duidelijkheid. Uw website is vaak het eerste contactmoment en bepaalt of iemand belt, mailt of doorklikt naar een concurrent.',
      'Star Local bouwt websites met moderne Astro-techniek: lichtgewicht, mobiel-first en klaar voor lokale én landelijke vindbaarheid. Geen trage templates of plugin-chaos, wel een platform dat vertrouwen wekt en aanvragen genereert in sectoren als {traits}.',
      'Heeft u al een verouderde site? Ook dan helpen we: van redesign tot migratie, met behoud van SEO-waarde en een structuur die meegroeit wanneer u vanuit {city} uitbreidt naar {province} en verder.',
    ],
    localProblemTitleTemplate: 'Waarom een professionele website belangrijk is in {city}',
    localProblemParagraphs: [
      '{city} combineert een lokale kern met bedrijvigheid rond {district}. Ondernemers in {traits} vechten om dezelfde online aandacht. Een site die traag laadt, slecht leesbaar is op mobiel of geen duidelijke contactroute biedt, kost u elke dag aanvragen.',
      'Bezoekers uit {district} en omstreken verwachten binnen seconden te snappen wat u doet, voor wie u werkt en hoe ze contact opnemen. Verouderde pagina\'s, stockfoto\'s zonder context of ontbrekende mobiele optimalisatie ondermijnen vertrouwen, zeker in een gemeente waar concurrentie toeneemt.',
      'Zonder schaalbare basis blijft landelijke groei lastig. Wie nu investeert in snelheid, structuur en conversie, wint lokaal in {city} én legt de fundering om later heel {province} te bedienen.',
    ],
    localSolutionTitleTemplate: 'Wat Star Local voor bedrijven in {city} doet',
    localSolutionParagraphs: [
      'Star Local ontwerpt en bouwt custom websites die passen bij uw markt in {city}: heldere diensten, sterke CTA\'s, snelle laadtijden en een technische basis voor lokale SEO. Of u nu actief bent in {traits}, uw site moet commercieel werken op elk scherm.',
      'We starten met uw doelen: meer offerteaanvragen, betere vindbaarheid rond {district}, of een platform dat meegroeit met nieuwe vestigingen op {businessArea}. Design, contentstructuur en techniek sluiten daarop aan.',
      'Na livegang blijven we beschikbaar voor optimalisatie. Uw website is geen statisch visitekaartje, maar een groeikanaal dat meebeweegt met het ondernemersklimaat in {city}.',
    ],
    benefits: [
      {
        icon: 'design',
        title: 'Uitstraling die vertrouwen wekt',
        descriptionTemplate:
          'Professioneel design dat past bij ondernemers in {traits}, of u nu gevestigd bent rond {district} of elders in {city}.',
      },
      {
        icon: 'mobile',
        title: 'Mobile-first voor zoekers in {city}',
        descriptionTemplate:
          'Klanten vergelijken onderweg. Uw site laadt snel en leidt direct naar bellen, mailen of een offerteaanvraag.',
      },
      {
        icon: 'speed',
        title: 'Razendsnelle Astro-techniek',
        descriptionTemplate:
          'Lichtgewicht code zonder onnodige plugins. Essentieel wanneer seconden het verschil maken tussen contact en afhaken in {city}.',
      },
      {
        icon: 'seo',
        title: 'Lokaal én landelijk vindbaar',
        descriptionTemplate:
          'Technische SEO-basis en structuur om gevonden te worden in {city} en door te groeien naar {province} en verder.',
      },
      {
        icon: 'growth',
        title: 'Schaalbaar platform',
        descriptionTemplate:
          'Voeg diensten, pagina\'s of regio\'s toe zonder opnieuw te beginnen. Ideaal voor groeiende bedrijven rond {district}.',
      },
      {
        icon: 'communication',
        title: 'Heldere samenwerking',
        descriptionTemplate:
          'Direct contact, duidelijke planning en eerlijk advies over wat u nodig heeft in {city}, zonder overkill of ondermaatse shortcuts.',
      },
      {
        icon: 'custom',
        title: 'Maatwerk, geen template',
        descriptionTemplate:
          'Elke site wordt op maat gebouwd voor uw propositie, doelgroep en concurrentie in de markt rond {city}.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Kennismaking & doelen',
        descriptionTemplate:
          'We bespreken uw markt in {city}, doelgroep, concurrentie en wat de website concreet moet opleveren: aanvragen, vertrouwen of schaalbare groei.',
      },
      {
        number: '02',
        title: 'Structuur & design',
        descriptionTemplate:
          'Wireframes, paginastructuur en visueel ontwerp afgestemd op uw merk, met focus op conversie en mobiel gebruik in {city}.',
      },
      {
        number: '03',
        title: 'Bouw & content',
        descriptionTemplate:
          'Ontwikkeling in Astro, integratie van teksten en beelden, en een technische SEO-basis voor lokale vindbaarheid in {city}.',
      },
      {
        number: '04',
        title: 'Test & livegang',
        descriptionTemplate:
          'Controle op snelheid, mobiele weergave en contactroutes. Daarna live, zichtbaar voor klanten in heel {city}.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate:
          'Optimaliseren, uitbreiden met nieuwe diensten of regio\'s, en meegroeien wanneer uw bedrijf buiten {city} expandeert.',
      },
    ],
    industriesTitleTemplate: 'Voor welke bedrijven in {city} wij websites bouwen',
    industriesParagraphs: [
      '{city} kent een brede mix van sectoren, van {traits} tot lokale dienstverlening rond {district}. Elke sector vraagt een andere online propositie, maar allemaal een site die snel scanbaar is en tot contact leidt.',
      'Star Local bouwt voor ondernemers die in {city} willen winnen: van starter tot gevestigde speler. Uw website sluit aan op hoe uw klanten zoeken, vergelijken en beslissen, lokaal verankerd en klaar om te schalen.',
    ],
    districtsTitleTemplate: 'Website laten maken in heel {city}',
    districtsIntroTemplate:
      'Of u gevestigd bent rond {district}, nabij {district2} of elders in {city}, uw website moet klanten aantrekken uit de hele gemeente. Star Local bouwt voor ondernemers in alle gebieden van {city}.',
    relatedSlugs: ['lokale-seo', 'technische-seo', 'conversie-optimalisatie'],
    relatedDescriptionTemplate:
      'Ook voor {relatedServiceName} in {city} helpt Star Local ondernemers verder met een sterke, resultaatgerichte aanpak.',
    faqTemplates: [
      {
        questionTemplate: 'Wat kost {serviceName} in {city}?',
        answerTemplate:
          'De investering hangt af van scope: een compacte site vraagt een ander budget dan een uitgebreide website met meerdere diensten. Star Local bespreekt vooraf wat u nodig heeft om professioneel zichtbaar te worden in {city}, zonder onnodige extra\'s.',
      },
      {
        questionTemplate: 'Hoe lang duurt het bouwen van een website in {city}?',
        answerTemplate:
          'Een professioneel traject duurt doorgaans enkele weken, afhankelijk van het aantal pagina\'s, content en feedbackrondes. Star Local werkt met een heldere planning zodat ondernemers in {city} weten wanneer de site live gaat.',
      },
      {
        questionTemplate: 'Kan ik ook rond {district} gevonden worden?',
        answerTemplate:
          'Ja. Star Local bouwt websites met een technische basis voor lokale SEO in {city}, inclusief gebieden zoals {district}, en desgewenst uitbreidbaar naar {neighborNames}.',
      },
      {
        questionTemplate: 'Kunnen jullie mijn bestaande website in {city} verbeteren?',
        answerTemplate:
          'In veel gevallen wel. Als uw huidige site traag, verouderd of commercieel zwak is, onderzoeken we of redesign of migratie het meest zinnig is. Star Local kijkt eerlijk naar de snelste route naar betere resultaten.',
      },
      {
        questionTemplate: 'Is mijn website mobiel geoptimaliseerd voor klanten in {city}?',
        answerTemplate:
          'Star Local bouwt mobile-first. In {city} komt veel verkeer via smartphone, uw site moet snel laden en direct tot contact leiden op elk scherm.',
      },
      {
        questionTemplate: 'Kan mijn website later uitbreiden buiten {city}?',
        answerTemplate:
          'Ja. Met Astro-techniek en een schaalbare structuur legt u nu de basis in {city} en breidt u later uit met landingspagina\'s, diensten of regio\'s in {province}, zonder opnieuw te beginnen.',
      },
    ],
    imageAltTemplate: '{serviceName} in {city} — Star Local bouwt snelle, conversiegerichte websites',
    bottomCtaTitleTemplate: 'Klaar voor een professionele website in {city}?',
    bottomCtaTextTemplate:
      'Laat een website bouwen die vertrouwen wekt, snel laadt en lokaal gevonden wordt in {city}. Vraag vrijblijvend advies aan, we denken graag mee over uw doelen.',
  },
  {
    slug: 'lokale-seo',
    name: 'Lokale SEO',
    nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['lokale-seo'],
    h1Template: 'Lokale SEO in {city}',
    seoTitleTemplates: [
      'Lokale SEO {city} | Beter gevonden in Google | Star Local',
      '{serviceName} in {city}: hoger in Maps en Google | Star Local',
      'Lokale SEO laten doen in {city} | Star Local',
    ],
    metaDescriptionTemplates: [
      'Lokale SEO in {city}: hoger in Google en Maps wanneer klanten zoeken. Star Local optimaliseert content, profiel en techniek voor {city}.',
      'Meer klanten uit {city} via Google? Star Local bouwt lokale landingspagina\'s en optimaliseert uw Google Bedrijfsprofiel voor {traits}.',
      '{serviceName} voor bedrijven in {city}: Star Local verhoogt uw zichtbaarheid in Maps en lokale zoekresultaten in {province}.',
      'Lokaal gevonden worden in {city}? Star Local combineert content, reviews en techniek voor sterkere lokale SEO-resultaten.',
    ],
    heroIntroTemplates: [
      'Meer klanten bereiken in {city} begint met zichtbaar zijn op het moment dat zij zoeken. Star Local helpt lokale bedrijven hoger te verschijnen in Google en Google Maps. Zo wint u aanvragen die nu naar de concurrent gaan.',
      'Klanten in {city} zoeken specifiek: per wijk, dienst of sector. Star Local bouwt lokale landingspagina\'s en optimaliseert uw Google Bedrijfsprofiel voor precies die zoekopdrachten. Zo wordt u gevonden op het juiste moment.',
      'Zichtbaarheid in Google en Maps bepaalt vaak wie de klant belt in {city}. Star Local combineert content, techniek en reviews tot een lokale SEO-aanpak die concreet resultaat oplevert. Zo groeit uw zichtbaarheid stap voor stap.',
    ],
    serviceIntroTitleTemplate: 'Gevonden worden door klanten in {city}',
    serviceIntroParagraphs: [
      'Lokale SEO draait om het juiste moment: wanneer iemand rond {district} of nabij {district2} zoekt naar uw dienst, moet u verschijnen, in Google en op Maps. Dat vraagt meer dan een mooie website; het vraagt lokale relevantie, consistente bedrijfsgegevens en content die aansluit op hoe {city} zoekt.',
      'Star Local combineert lokale landingspagina\'s, interne links, Google Bedrijfsprofiel-optimalisatie en reviews als signaal. Zo bouwt u zichtbaarheid op per wijk en sector, relevant voor {traits}, zonder generieke zoekwoorden die niets opleveren.',
      '{city} fungeert vaak ook als regionaal knooppunt. Met de juiste aanpak kunt u naast {city} ook vindbaar worden in de bredere regio van {province}, passend bij uw groeiplannen.',
    ],
    localProblemTitleTemplate: 'Waarom lokale SEO belangrijk is in {city}',
    localProblemParagraphs: [
      'In {city} zoeken klanten specifiek: een dienst gecombineerd met een wijk of sector rond {district}. Wie alleen op landelijke termen optimaliseert, mist het lokale verkeer dat direct tot contact, bellen of een bezoek leidt. Concurrenten met een sterk Google Bedrijfsprofiel en lokale content pakken die aanvragen nu al.',
      'Google Maps is voor veel sectoren belangrijker dan de klassieke blauwe links. Zonder consistente NAP-gegevens, juiste categorieën en actieve reviews blijft u onzichtbaar rond {district}, ook met een goede website.',
      'De markt in {city} is gevarieerd: {traits} bestaan naast elkaar, elk met een ander klantgebied. Lokale SEO moet aansluiten op uw werkelijke klantgebied, niet op generiek SEO-advies uit een handboek.',
    ],
    localSolutionTitleTemplate: 'Wat Star Local voor bedrijven in {city} doet',
    localSolutionParagraphs: [
      'Star Local analyseert waar u nu staat: rankings, Google Bedrijfsprofiel, website-structuur en concurrentie in {city}. Vervolgens bouwen we een lokale strategie met concrete acties: content per dienst en gebied, interne links, profieloptimalisatie en review-aanpak.',
      'We koppelen lokale SEO aan uw commerciële doelen. Meer zichtbaarheid rond {district}, sterkere aanwezigheid op Maps nabij {district2}, of regionale vindbaarheid in {traits}, de aanpak volgt uw markt.',
      'Lokale SEO is geen eenmalige actie. Star Local monitort ontwikkelingen en past content en profiel aan wanneer Google, uw concurrentie of uw dienstenaanbod in {city} verandert.',
    ],
    benefits: [
      {
        icon: 'seo',
        title: 'Zichtbaar in lokale zoekresultaten',
        descriptionTemplate:
          'Verschijn wanneer prospects in {city} naar uw dienst zoeken, met pagina\'s die aansluiten op intentie en locatie rond {district}.',
      },
      {
        icon: 'growth',
        title: 'Sterkere Google Maps-aanwezigheid',
        descriptionTemplate:
          'Optimalisatie van categorieën, diensten en content zodat u opvalt in het Maps-overzicht in heel {city}.',
      },
      {
        icon: 'custom',
        title: 'Lokale landingspagina\'s',
        descriptionTemplate:
          'Gerichte pagina\'s per dienst en regio, gekoppeld via interne links, relevant voor {district} en omstreken.',
      },
      {
        icon: 'communication',
        title: 'Review-strategie',
        descriptionTemplate:
          'Meer en betere reviews als vertrouwenssignaal, cruciaal voor sectoren als {traits} in {city}.',
      },
      {
        icon: 'scale',
        title: 'Regionale uitbreiding',
        descriptionTemplate:
          'Na {city} uitbreiden naar de bredere regio zonder losse SEO-projecten per gemeente.',
      },
      {
        icon: 'design',
        title: 'Content die lokaal resoneert',
        descriptionTemplate:
          'Teksten die de context van {city} benutten, natuurlijk, commercieel en afgestemd op hoe uw doelgroep zoekt.',
      },
      {
        icon: 'mobile',
        title: 'Mobiel-first vindbaarheid',
        descriptionTemplate:
          'Lokaal zoeken gebeurt vooral op smartphone. Uw SEO-aanpak in {city} is daarop afgestemd.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Lokale analyse',
        descriptionTemplate:
          'Inventarisatie van huidige rankings, Google Bedrijfsprofiel, website en concurrentie in {city} en omliggende regio\'s.',
      },
      {
        number: '02',
        title: 'Strategie & prioriteiten',
        descriptionTemplate:
          'Keuze van focus: welke diensten, wijken en zoektermen leveren de meeste commerciële kansen in {city}?',
      },
      {
        number: '03',
        title: 'Uitvoering',
        descriptionTemplate:
          'Content, interne links, profieloptimalisatie en technische verbeteringen, stap voor stap uitgerold rond {district}.',
      },
      {
        number: '04',
        title: 'Meten & bijsturen',
        descriptionTemplate:
          'Volgen van zichtbaarheid, verkeer en contactmomenten. Bijsturen waar kansen of problemen in {city} zichtbaar worden.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate:
          'Content en profiel verder uitbreiden wanneer u nieuwe diensten of gebieden binnen {province} aanboort.',
      },
    ],
    industriesTitleTemplate: 'Lokale SEO voor bedrijven in {city}',
    industriesParagraphs: [
      'Sectoren als {traits} leunen zwaar op Maps en zoekopdrachten "in de buurt" rond {district}. Andere ondernemers in {city} zoeken juist regionale vindbaarheid richting {province}.',
      'Star Local past lokale SEO toe per sector: de juiste categorieën, content en signalen voor uw markt in {city}, zonder generieke pakketten die nergens echt landen.',
    ],
    districtsTitleTemplate: 'Lokaal gevonden worden in heel {city}',
    districtsIntroTemplate:
      'Klanten zoeken per wijk en bedrijventerrein. Star Local helpt u zichtbaar te worden rond {district}, nabij {district2} en in alle andere gebieden van {city}.',
    relatedSlugs: ['google-bedrijfsprofiel', 'website-laten-maken', 'ai-seo'],
    relatedDescriptionTemplate:
      'Ook voor {relatedServiceName} in {city} versterkt Star Local uw online zichtbaarheid met een gerichte aanpak.',
    faqTemplates: [
      {
        questionTemplate: 'Hoe werkt {serviceName} in {city}?',
        answerTemplate:
          'Lokale SEO combineert een geoptimaliseerd Google Bedrijfsprofiel, relevante content op uw website, consistente bedrijfsgegevens, reviews en interne links. Star Local stemt dit af op uw diensten en de wijken waar uw klanten zitten, van {district} tot {district2}.',
      },
      {
        questionTemplate: 'Kan ik ook rond {neighborNames} gevonden worden?',
        answerTemplate:
          'Ja, mits dat past bij uw marktgebied. Star Local kan naast {city} ook zichtbaarheid opbouwen richting {neighborNames}, met landingspagina\'s en profielinstellingen die regionaal kloppen.',
      },
      {
        questionTemplate: 'Helpen jullie met mijn Google Bedrijfsprofiel in {city}?',
        answerTemplate:
          'Ja. Google Bedrijfsprofiel is kernonderdeel van lokale SEO. Star Local optimaliseert categorieën, diensten, foto\'s, berichten en consistentie met uw website, essentieel voor Maps-zichtbaarheid in {city}.',
      },
      {
        questionTemplate: 'Hoe snel zie ik resultaat van lokale SEO in {city}?',
        answerTemplate:
          'Lokale SEO vraagt tijd: profieloptimalisatie kan sneller effect tonen, content en rankings bouwen geleidelijk op. Star Local geeft een realistisch beeld van wat u in {city} kunt verwachten.',
      },
      {
        questionTemplate: 'Is lokale SEO zinvol voor B2B-bedrijven in {city}?',
        answerTemplate:
          'Absoluut. Zakelijke dienstverlening en andere B2B-sectoren profiteren van lokale vindbaarheid wanneer prospects zoeken op een dienst gecombineerd met {district}. De aanpak verschilt per sector, het principe niet.',
      },
      {
        questionTemplate: 'Wat als ik al een website in {city} heb maar niet gevonden word?',
        answerTemplate:
          'Dan kijken we eerst naar techniek, content, profiel en concurrentie. Vaak ontbreken lokale landingspagina\'s, interne links of een sterk Google Bedrijfsprofiel. Star Local stelt een concreet verbeterplan op voor {city}.',
      },
    ],
    imageAltTemplate: 'Lokale SEO in {city} — beter gevonden in Google en Google Maps',
    bottomCtaTitleTemplate: 'Meer zichtbaarheid in {city} nodig?',
    bottomCtaTextTemplate:
      'Star Local helpt u hoger te verschijnen wanneer klanten in {city} zoeken. Vraag gratis advies aan over lokale SEO voor uw bedrijf.',
  },
  {
    slug: 'google-bedrijfsprofiel',
    name: 'Google Bedrijfsprofiel',
    nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['google-bedrijfsprofiel'],
    h1Template: 'Google Bedrijfsprofiel optimaliseren in {city}',
    seoTitleTemplates: [
      'Google Bedrijfsprofiel {city} optimaliseren | Star Local',
      '{serviceName} laten optimaliseren in {city} | Star Local',
      'Beter zichtbaar in Maps in {city} | Star Local',
    ],
    metaDescriptionTemplates: [
      'Google Bedrijfsprofiel optimaliseren in {city}? Star Local verbetert categorieën, reviews en content voor meer zichtbaarheid in Maps.',
      '{serviceName} in {city}: Star Local optimaliseert foto\'s, openingstijden en reviews voor meer klikken vanuit Maps.',
      'Meer contactmomenten uit Google Maps in {city}? Star Local optimaliseert uw bedrijfsprofiel voor {traits}.',
      'Google Bedrijfsprofiel laten verbeteren in {city}? Star Local zorgt voor NAP-consistentie en meer reviews.',
    ],
    heroIntroTemplates: [
      'Een sterk Google Bedrijfsprofiel helpt bedrijven in {city} opvallen in lokale zoekresultaten en Google Maps. Wij optimaliseren uw profiel voor betere zichtbaarheid en meer contactmomenten. Zo wint u de klik die anders naar een concurrent gaat.',
      'In {city} kiezen klanten vaak op basis van wat ze in Maps zien: sterren, foto\'s en openingstijden. Star Local optimaliseert elk onderdeel van uw profiel, van categorieën tot reviews. Zo wordt uw profiel het overtuigende eerste contactmoment.',
      'Uw Google Bedrijfsprofiel is voor veel bedrijven in {city} het eerste wat klanten zien. Star Local zorgt dat categorieën, foto\'s en reviews kloppen en overtuigen. Zo groeit het aantal belletjes en routeaanvragen.',
    ],
    serviceIntroTitleTemplate: 'Uw visitekaartje in Google Maps en lokale zoekresultaten',
    serviceIntroParagraphs: [
      'Voor veel bedrijven rond {district} en nabij {district2} in {city} is het Google Bedrijfsprofiel het eerste wat klanten zien. Categorieën, openingstijden, foto\'s, reviews en berichten bepalen of iemand belt, route aanvraagt of doorklikt naar een concurrent.',
      'Star Local optimaliseert elk onderdeel: juiste categorieën en diensten, consistente NAP-gegevens, aantrekkelijke foto\'s, actieve berichten en een review-aanpak die vertrouwen opbouwt. Alles afgestemd op lokale zoekintentie in {city} en sectoren als {traits}.',
      'Een sterk profiel werkt samen met uw website. Star Local zorgt voor consistentie tussen profiel en site, cruciaal voor Google én voor klanten die u online beoordelen in {city}.',
    ],
    localProblemTitleTemplate: 'Waarom Google Bedrijfsprofiel optimaliseren belangrijk is in {city}',
    localProblemParagraphs: [
      'In {city} kiezen klanten snel op basis van wat ze in Maps zien: sterren, foto\'s, openingstijden en reacties op reviews. Een incompleet profiel, verkeerde categorie of verouderde openingstijden kost direct contactmomenten, zeker in drukke sectoren als {traits}.',
      'NAP-inconsistentie, verschillende adres- of telefoongegevens op profiel, website en directories, ondermijnt lokale rankings. Veel ondernemers rond {district} onderschatten hoe gevoelig Google is voor deze details.',
      'Reviews zijn beslissend. Zonder actieve follow-up en professionele reacties wint een concurrent nabij {district2} alsnog de klik, ook als uw dienst objectief beter is.',
    ],
    localSolutionTitleTemplate: 'Wat Star Local voor bedrijven in {city} doet',
    localSolutionParagraphs: [
      'Star Local audit uw huidige profiel en concurrentie in {city}. We corrigeren categorieën, vullen diensten aan, optimaliseren foto\'s en berichten, en stemmen NAP af met uw website en andere vermeldingen.',
      'We begeleiden review-verzameling en professionele reacties, passend bij sectoren als {traits}. Het doel: meer doorklikken, bellen en routeaanvragen vanuit Maps rond {district}.',
      'Doorlopend monitoren we prestaties en passen het profiel aan bij wijzigingen in openingstijden, diensten of seizoensacties, relevant voor ondernemers in heel {city}.',
    ],
    benefits: [
      {
        icon: 'seo',
        title: 'Juiste categorieën en diensten',
        descriptionTemplate:
          'Google begrijpt precies wat u levert, essentieel om te verschijnen bij relevante zoekopdrachten in {city}.',
      },
      {
        icon: 'communication',
        title: 'Review-management',
        descriptionTemplate:
          'Meer reviews en professionele reacties die vertrouwen wekken bij klanten rond {district}.',
      },
      {
        icon: 'design',
        title: 'Professionele foto\'s en berichten',
        descriptionTemplate:
          'Visueel aantrekkelijk profiel dat opvalt tussen concurrenten in Maps, met actuele aanbiedingen en updates.',
      },
      {
        icon: 'mobile',
        title: 'Meer Maps-acties',
        descriptionTemplate:
          'Optimalisatie gericht op bellen, route aanvragen en websitebezoek, de acties die in {city} tot klanten leiden.',
      },
      {
        icon: 'custom',
        title: 'NAP-consistentie',
        descriptionTemplate:
          'Eenduidige bedrijfsgegevens op profiel, website en directories, een basis voor lokale vindbaarheid rond {district}.',
      },
      {
        icon: 'growth',
        title: 'Koppeling met lokale SEO',
        descriptionTemplate:
          'Profiel en website versterken elkaar voor bredere zichtbaarheid in {city} en de regio van {province}.',
      },
      {
        icon: 'scale',
        title: 'Schaalbaar naar meerdere locaties',
        descriptionTemplate:
          'Beheer meerdere vestigingen of profielen consistent wanneer uw bedrijf in {city} uitbreidt.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Profiel-audit',
        descriptionTemplate:
          'Analyse van uw huidige Google Bedrijfsprofiel, reviews, categorieën en vergelijking met concurrenten in {city}.',
      },
      {
        number: '02',
        title: 'Optimalisatieplan',
        descriptionTemplate:
          'Prioriteiten voor categorieën, diensten, foto\'s, berichten en NAP-consistentie, afgestemd op uw sector rond {district}.',
      },
      {
        number: '03',
        title: 'Uitvoering',
        descriptionTemplate:
          'Profiel bijwerken, content toevoegen, website afstemmen en review-proces inrichten.',
      },
      {
        number: '04',
        title: 'Monitoring',
        descriptionTemplate:
          'Volgen van zichtbaarheid, acties en reviews. Bijsturen bij wijzigingen of nieuwe kansen in {city}.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate:
          'Profiel uitbreiden met nieuwe diensten, foto\'s of locaties wanneer uw bedrijf in {city} groeit.',
      },
    ],
    industriesTitleTemplate: 'Google Bedrijfsprofiel voor bedrijven in {city}',
    industriesParagraphs: [
      'Sectoren als {traits} leunen sterk op Maps voor directe bezoekers en telefoontjes rond {district}. Andere bedrijven in {city} winnen vooral via reviews en foto\'s.',
      'Star Local optimaliseert profielen per sector, met de categorieën, content en review-aanpak die passen bij uw markt in {city}.',
    ],
    districtsTitleTemplate: 'Google Bedrijfsprofiel in heel {city}',
    districtsIntroTemplate:
      'Klanten vinden u via Maps in heel de gemeente. Star Local optimaliseert profielen voor ondernemers rond {district}, nabij {district2} en in alle andere gebieden van {city}.',
    relatedSlugs: ['lokale-seo', 'website-laten-maken', 'ai-seo'],
    relatedDescriptionTemplate:
      'Ook voor {relatedServiceName} in {city} bouwt Star Local aan sterkere online zichtbaarheid en meer contactmomenten.',
    faqTemplates: [
      {
        questionTemplate: 'Helpen jullie met mijn {serviceName} in {city}?',
        answerTemplate:
          'Ja, dat is een kernonderdeel van onze dienstverlening. Star Local optimaliseert categorieën, diensten, foto\'s, berichten, reviews en NAP-consistentie, specifiek voor uw markt in {city}.',
      },
      {
        questionTemplate: 'Hoe belangrijk zijn reviews voor mijn profiel in {city}?',
        answerTemplate:
          'Zeer belangrijk. Reviews beïnvloeden zichtbaarheid én conversie in Maps. Star Local helpt met een structurele aanpak om reviews te verzamelen en professioneel te reageren, passend bij uw branche rond {district}.',
      },
      {
        questionTemplate: 'Wat is NAP-consistentie en waarom telt het in {city}?',
        answerTemplate:
          'NAP staat voor Name, Address, Phone. Google verwacht dezelfde gegevens op uw profiel, website en andere vermeldingen. Inconsistentie schaadt lokale rankings in {city}, iets Star Local corrigeert en bewaakt.',
      },
      {
        questionTemplate: 'Kan ik met mijn profiel ook richting {neighborNames} gevonden worden?',
        answerTemplate:
          'Dat hangt af van uw servicegebied. Star Local stelt het profiel en de content zo in dat zichtbaarheid aansluit bij waar u klanten bedient, {city} en eventueel {neighborNames}.',
      },
      {
        questionTemplate: 'Hoe vaak moet mijn profiel worden bijgewerkt?',
        answerTemplate:
          'Regelmatig: openingstijden bij feestdagen, nieuwe diensten, foto\'s en berichten houden uw profiel actueel. Star Local kan dit doorlopend verzorgen of u begeleiden bij onderhoud.',
      },
      {
        questionTemplate: 'Werkt profieloptimalisatie ook voor zakelijke dienstverlening in {city}?',
        answerTemplate:
          'Ja. Adviseurs en andere zakelijke dienstverleners in {city} profiteren van een compleet profiel met juiste categorieën, diensten en reviews, ook als klanten u niet fysiek bezoeken.',
      },
    ],
    imageAltTemplate: 'Google Bedrijfsprofiel optimaliseren in {city} voor betere Maps-zichtbaarheid',
    bottomCtaTitleTemplate: 'Sterker profiel nodig in {city}?',
    bottomCtaTextTemplate:
      'Laat Star Local uw Google Bedrijfsprofiel optimaliseren voor meer zichtbaarheid, reviews en contactmomenten in {city}. Vraag gratis advies aan.',
  },
  {
    slug: 'webshop-laten-maken',
    name: 'Webshop laten maken',
    nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['webshop-laten-maken'],
    h1Template: 'Webshop laten maken in {city}',
    seoTitleTemplates: [
      'Webshop laten maken {city} | Star Local',
      '{serviceName} in {city}: snel en conversiegericht | Star Local',
      'Professionele webshop bouwen in {city} | Star Local',
    ],
    metaDescriptionTemplates: [
      'Webshop laten maken in {city}? Star Local bouwt snelle, mobiele webshops met SEO en conversie voor lokale én landelijke verkoop.',
      '{serviceName} voor ondernemers in {city}: mobiel bestellen, veilig betalen en sterke vindbaarheid in {province}.',
      'Online verkopen vanuit {city}? Star Local bouwt webshops die snel laden en converteren voor {traits}.',
      'Webshop bouwen in {city}? Star Local zorgt voor duidelijke productstructuur, snelle checkout en een SEO-basis.',
    ],
    heroIntroTemplates: [
      'Online verkopen vanuit {city} vraagt meer dan een mooie vitrine. Star Local bouwt webshops die snel laden, mobiel bestellen mogelijk maken en klaar zijn voor lokale én landelijke groei. Zo blijft uw omzet niet afhankelijk van alleen de fysieke winkel.',
      'Klanten in {city} bestellen steeds vaker via mobiel en vergelijken snel op snelheid en gebruiksgemak. Star Local bouwt webshops met een strakke productstructuur en veilige checkout. Zo zet u meer bezoekers om in bestellingen.',
      'Een webshop verdient een technische basis die conversie en SEO ondersteunt. Star Local bouwt shops voor ondernemers in {city} die lokaal willen verkopen én landelijk willen groeien. Zo werkt uw webshop mee aan omzet, niet tegen.',
    ],
    serviceIntroTitleTemplate: 'Een webshop die verkoopt — lokaal en verder',
    serviceIntroParagraphs: [
      'Ondernemers rond {district} en nabij {district2} in {city} verkopen steeds vaker online, naast fysieke verkoop. Een webshop moet gebruiksvriendelijk zijn, snel laden op mobiel, duidelijke productstructuur bieden en vertrouwde betaalmethoden ondersteunen.',
      'Star Local bouwt webshops met conversie en SEO in het DNA: heldere categorieën, snelle checkout, technische basis voor vindbaarheid en ruimte om door te groeien van {city} naar {province} en verder.',
      'Of u nu lokaal levert rond {district} of landelijk verzendt vanuit {businessArea}: uw webshop moet schaalbaar, veilig en commercieel sterk zijn.',
    ],
    localProblemTitleTemplate: 'Waarom een professionele webshop belangrijk is in {city}',
    localProblemParagraphs: [
      'Consumenten in {city} vergelijken webshops op snelheid, gebruiksgemak en vertrouwen. Trage pagina\'s, onduidelijke productfilters of een checkout die op mobiel hapert leiden tot afgebroken bestellingen, terwijl concurrenten met een strakkere shop wél converteren.',
      'Lokale webshops hebben vaak potentieel buiten {city}: ondernemers in {traits} bedienen klanten in de bredere regio van {province}. Zonder SEO-basis en schaalbare techniek blijft dat onbenut.',
      'Betaalmethoden, voorraadstructuur en productpagina\'s moeten kloppen. Een generieke template zonder lokale relevantie of commerciële fine-tuning kost omzet, zeker in sectoren als {traits} rond {district}.',
    ],
    localSolutionTitleTemplate: 'Wat Star Local voor bedrijven in {city} doet',
    localSolutionParagraphs: [
      'Star Local ontwerpt en bouwt webshops op maat: productstructuur, categorieën, filters, checkout en integraties afgestemd op uw aanbod en doelgroep in {city}.',
      'We optimaliseren voor mobiel bestellen, snelheid en conversie, met een SEO-basis zodat u gevonden wordt op product- en categoriezoektermen. Lokale verkoop, afhalen of landelijke verzending vanuit {businessArea}: de shop volgt uw model.',
      'Na livegang helpen we met doorontwikkeling: nieuwe productlijnen, seizoenscampagnes en conversie-optimalisatie wanneer uw webshop in {city} groeit.',
    ],
    benefits: [
      {
        icon: 'mobile',
        title: 'Mobiel bestellen zonder frictie',
        descriptionTemplate:
          'Checkout en productpagina\'s geoptimaliseerd voor smartphone, waar klanten in {city} het meest bestellen.',
      },
      {
        icon: 'design',
        title: 'Duidelijke productstructuur',
        descriptionTemplate:
          'Logische categorieën en filters zodat bezoekers rond {district} snel vinden wat ze zoeken, minder afhakers, meer bestellingen.',
      },
      {
        icon: 'speed',
        title: 'Snelle laadtijden',
        descriptionTemplate:
          'Lichtgewicht techniek zodat productpagina\'s snel laden. Essentieel voor conversie en SEO in {city}.',
      },
      {
        icon: 'seo',
        title: 'SEO voor producten en categorieën',
        descriptionTemplate:
          'Vindbaarheid op zoektermen die passen bij uw aanbod, lokaal in {city} en landelijk waar u levert.',
      },
      {
        icon: 'growth',
        title: 'Schaalbare groei',
        descriptionTemplate:
          'Van lokale verkoop naar landelijke verzending: uw webshop groeit mee zonder technische beperkingen.',
      },
      {
        icon: 'custom',
        title: 'Betrouwbare betaalmethodes',
        descriptionTemplate:
          'Integratie van gangbare betaaloplossingen die vertrouwen wekken bij klanten in {city}.',
      },
      {
        icon: 'scale',
        title: 'Conversiegericht design',
        descriptionTemplate:
          'CTA\'s, productpresentatie en vertrouwenssignalen afgestemd op commerciële resultaten rond {district}.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Inventarisatie & doelen',
        descriptionTemplate:
          'Productaanbod, doelgroep, lokale versus landelijke verkoop en technische wensen, helder vooraf voor uw bedrijf in {city}.',
      },
      {
        number: '02',
        title: 'Structuur & UX',
        descriptionTemplate:
          'Categorieën, filters, checkout-flow en mobiele ervaring, ontworpen voor conversie.',
      },
      {
        number: '03',
        title: 'Bouw & integraties',
        descriptionTemplate:
          'Ontwikkeling, betaalmethoden, voorraadkoppelingen en een SEO-basis voor product- en categoriepagina\'s.',
      },
      {
        number: '04',
        title: 'Test & lancering',
        descriptionTemplate:
          'Controle op snelheid, checkout en mobiele weergave. Livegang wanneer alles commercieel klopt voor klanten in {city}.',
      },
      {
        number: '05',
        title: 'Optimaliseren & uitbreiden',
        descriptionTemplate:
          'Conversie verbeteren, assortiment uitbreiden en SEO doorontwikkelen naarmate uw shop groeit.',
      },
    ],
    industriesTitleTemplate: 'Webshops voor bedrijven in {city}',
    industriesParagraphs: [
      'Ondernemers in {traits} rond {district} en {businessArea} kennen diverse webshop-potentie. Star Local bouwt shops die passen bij uw product, merk en verkoopmodel.',
      'Of u lokaal levert, afhaalt in {city} of landelijk verzendt: uw webshop moet snel, betrouwbaar en vindbaar zijn. Star Local combineert techniek, design en SEO voor commerciële resultaten.',
    ],
    districtsTitleTemplate: 'Webshop laten maken vanuit heel {city}',
    districtsIntroTemplate:
      'Online verkopen doet u vanuit elke wijk of bedrijventerrein. Star Local ondersteunt webshop-projecten voor ondernemers rond {district}, nabij {district2} en in alle andere gebieden van {city}.',
    relatedSlugs: ['conversie-optimalisatie', 'technische-seo', 'lokale-seo'],
    relatedDescriptionTemplate:
      'Ook voor {relatedServiceName} in {city} helpt Star Local uw webshop of website beter te laten presteren.',
    faqTemplates: [
      {
        questionTemplate: 'Wat kost {serviceName} in {city}?',
        answerTemplate:
          'De investering hangt af van het aantal producten, integraties, designwensen en functionaliteit. Star Local bespreekt vooraf wat u nodig heeft voor een professionele webshop in {city}, zonder onnodige complexiteit.',
      },
      {
        questionTemplate: 'Kan ik lokaal verkopen én landelijk verzenden vanuit {city}?',
        answerTemplate:
          'Ja. Star Local bouwt webshops die beide modellen ondersteunen: lokale afhalen of bezorging rond {district} en landelijke verzending wanneer u verder wilt groeien.',
      },
      {
        questionTemplate: 'Is mijn webshop mobiel geoptimaliseerd voor klanten in {city}?',
        answerTemplate:
          'Star Local bouwt mobile-first. In {city} en daarbuiten bestellen klanten vooral via smartphone, uw shop moet op elk scherm snel en intuïtief werken.',
      },
      {
        questionTemplate: 'Helpen jullie met SEO voor mijn webshop in {city}?',
        answerTemplate:
          'Ja. Product- en categoriepagina\'s krijgen een SEO-basis: titels, structuur, snelheid en technische instellingen zodat u vindbaar wordt op relevante zoektermen rond {district}.',
      },
      {
        questionTemplate: 'Kan ik ook klanten in {neighborNames} bereiken?',
        answerTemplate:
          'Zeker. Star Local bouwt webshops met landelijke verzendopties, zodat u naast {city} ook klanten in {neighborNames} en verder kunt bedienen.',
      },
      {
        questionTemplate: 'Kan ik mijn bestaande webshop in {city} laten verbeteren?',
        answerTemplate:
          'In veel gevallen wel. Trage shops, slechte mobiele ervaring of lage conversie zijn veelvoorkomende redenen voor redesign of migratie. Star Local kijkt eerlijk naar de beste route voor uw situatie in {city}.',
      },
    ],
    imageAltTemplate: 'Webshop laten maken in {city} — snelle, conversiegerichte online winkels',
    bottomCtaTitleTemplate: 'Klaar om online te verkopen vanuit {city}?',
    bottomCtaTextTemplate:
      'Laat een webshop bouwen die snel laadt, mobiel sterk is en klaar is voor groei. Vraag vrijblijvend advies aan over uw webshop in {city}.',
  },
  {
    slug: 'technische-seo',
    name: 'Technische SEO',
    nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['technische-seo'],
    h1Template: 'Technische SEO in {city}',
    seoTitleTemplates: [
      'Technische SEO {city} | Star Local',
      '{serviceName} in {city}: crawlbaarheid en snelheid | Star Local',
      'Technische SEO-audit voor {city} | Star Local',
    ],
    metaDescriptionTemplates: [
      'Technische SEO in {city}: crawlbaarheid, Core Web Vitals en schone code. Star Local lost technische blokkades op voor betere prestaties.',
      '{serviceName} voor bedrijven in {city}: sitemap, structured data en snelheid geoptimaliseerd door Star Local.',
      'Website traag of niet goed geïndexeerd in {city}? Star Local voert een technische SEO-audit uit en lost knelpunten op.',
      'Technische SEO-basis nodig in {city}? Star Local verbetert crawlbaarheid en Core Web Vitals voor {traits}.',
    ],
    heroIntroTemplates: [
      'Zonder solide technische basis blijft zelfs de beste content onzichtbaar. Star Local analyseert en verbetert crawlbaarheid, indexering en laadsnelheid voor bedrijven in {city}. Zo presteert uw site maximaal in Google.',
      'Trage pagina\'s of foutieve indexering kosten bedrijven in {city} dagelijks zichtbaarheid. Star Local voert een technische SEO-audit uit en lost knelpunten stap voor stap op. Zo krijgt uw content de kans die het verdient.',
      'Technische SEO is de fundering onder elke vorm van vindbaarheid in {city}. Star Local werkt met schone, snelle Astro-code en lost blokkades op bij bestaande websites. Zo bouwt u zichtbaarheid op een stabiele basis.',
    ],
    serviceIntroTitleTemplate: 'De technische fundering onder vindbaarheid',
    serviceIntroParagraphs: [
      'Technische SEO gaat over wat Google wél en niet kan lezen: crawlbaarheid, indexering, canonicals, redirects, sitemap, robots.txt, structured data en Core Web Vitals. Fouten hier blokkeren groei, ook als uw content en Google Bedrijfsprofiel in {city} op orde lijken.',
      'Star Local werkt met schone Astro-code: lichtgewicht, snel en zonder onnodige plugin-overhead. We auditen bestaande sites en lossen technische blokkades op, van dubbele pagina\'s tot trage laadtijden op mobiel, relevant voor ondernemers rond {district}.',
      'Voor bedrijven in {city} die investeren in lokale SEO of een nieuwe website: technische SEO is geen luxe, maar voorwaarde om zichtbaarheid en conversie te laten renderen in {province}.',
    ],
    localProblemTitleTemplate: 'Waarom technische SEO belangrijk is in {city}',
    localProblemParagraphs: [
      'Veel websites in {city}, actief in sectoren als {traits}, draaien op trage platforms, verkeerde redirects of pagina\'s die Google niet indexeert. Het gevolg: u betaalt voor content of advertenties terwijl organische groei stokt.',
      'Core Web Vitals en laadsnelheid beïnvloeden rankings én conversie. Klanten rond {district} wachten niet op trage pagina\'s, Google ook niet.',
      'Structured data, canonicals en sitemaps lijken abstract, maar bepalen of Google uw diensten, producten en locatie in {city} correct interpreteert. Zonder schone techniek blijft lokale SEO onderbenut.',
    ],
    localSolutionTitleTemplate: 'Wat Star Local voor bedrijven in {city} doet',
    localSolutionParagraphs: [
      'Star Local voert een technische SEO-audit uit: crawlbaarheid, indexstatus, redirects, canonicals, sitemap, robots.txt, structured data en Core Web Vitals. U krijgt inzicht in wat Google blokkeert en wat prioriteit heeft.',
      'We implementeren oplossingen: redirect-structuur, canonical tags, sitemap-optimalisatie, schema markup en performance-verbeteringen. Bij nieuwe sites bouwen we technische SEO vanaf dag één in, ook voor ondernemers rond {district}.',
      'Doorlopend monitoren we indexering en snelheid, essentieel wanneer u uitbreidt met nieuwe diensten, pagina\'s of regio\'s vanuit {city}.',
    ],
    benefits: [
      {
        icon: 'speed',
        title: 'Betere Core Web Vitals',
        descriptionTemplate:
          'Snellere laadtijden en stabielere weergave, rankingfactor én conversievoordeel voor bezoekers in {city}.',
      },
      {
        icon: 'seo',
        title: 'Correcte indexering',
        descriptionTemplate:
          'Google indexeert de juiste pagina\'s, geen duplicate content of verloren lokale landingspagina\'s rond {district}.',
      },
      {
        icon: 'custom',
        title: 'Schone redirect-structuur',
        descriptionTemplate:
          '301-redirects en canonicals die waarde behouden bij migraties of URL-wijzigingen.',
      },
      {
        icon: 'scale',
        title: 'Structured data',
        descriptionTemplate:
          'Schema markup zodat Google uw diensten, bedrijf en content in {city} rijker kan weergeven.',
      },
      {
        icon: 'communication',
        title: 'Transparante audit',
        descriptionTemplate:
          'Duidelijk rapport over technische issues en prioriteiten, geen vage SEO-jargon zonder actie.',
      },
      {
        icon: 'growth',
        title: 'Schaalbare techniek',
        descriptionTemplate:
          'Fundament dat meegroeit wanneer u nieuwe pagina\'s of regio\'s toevoegt vanuit {city}.',
      },
      {
        icon: 'mobile',
        title: 'Mobiele performance',
        descriptionTemplate:
          'Technische optimalisatie gericht op het mobiele verkeer dat in {city} dominant is.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Technische audit',
        descriptionTemplate:
          'Crawl-analyse, indexcheck, snelheidstest en review van redirects, sitemap en structured data voor uw site in {city}.',
      },
      {
        number: '02',
        title: 'Prioriteiten & plan',
        descriptionTemplate:
          'Welke technische issues blokkeren zichtbaarheid en conversie het meest voor uw bedrijf in {city}?',
      },
      {
        number: '03',
        title: 'Implementatie',
        descriptionTemplate:
          'Oplossen van crawl- en indexproblemen, performance-verbeteringen en schema markup.',
      },
      {
        number: '04',
        title: 'Validatie',
        descriptionTemplate:
          'Controle via Search Console en snelheidstools. Bevestiging dat Google de site correct verwerkt.',
      },
      {
        number: '05',
        title: 'Monitoring',
        descriptionTemplate:
          'Doorlopend toezicht op indexering en Core Web Vitals bij site-uitbreidingen in {city}.',
      },
    ],
    industriesTitleTemplate: 'Technische SEO voor bedrijven in {city}',
    industriesParagraphs: [
      'Bedrijven in {traits} met veel pagina\'s rond {district} lopen vaak tegen crawlproblemen aan. Andere ondernemers in {city} leunen sterk op snelheid en mobiele performance.',
      'Star Local past technische SEO toe op uw situatie, of u nu een nieuwe Astro-site lanceert of een bestaande site in {city} wilt verbeteren.',
    ],
    districtsTitleTemplate: 'Technische SEO voor sites in heel {city}',
    districtsIntroTemplate:
      'Technische SEO is locatie-onafhankelijk, maar essentieel voor elke ondernemer die online wil groeien. Star Local helpt bedrijven rond {district}, nabij {district2} en in alle andere gebieden van {city}.',
    relatedSlugs: ['website-laten-maken', 'lokale-seo', 'ai-seo'],
    relatedDescriptionTemplate:
      'Ook voor {relatedServiceName} in {city} zorgt Star Local voor een solide technische en commerciële basis.',
    faqTemplates: [
      {
        questionTemplate: 'Wat is {serviceName} en waarom is het belangrijk in {city}?',
        answerTemplate:
          'Technische SEO zorgt dat Google uw site kan crawlen, indexeren en snel laden. Zonder die basis blijft content, ook lokale content voor {city}, onderbenut in zoekresultaten.',
      },
      {
        questionTemplate: 'Kunnen jullie technische SEO op mijn bestaande website in {city} doen?',
        answerTemplate:
          'Ja. Star Local auditeert bestaande sites en lost problemen op: redirects, canonicals, indexering, sitemap, robots.txt en Core Web Vitals, ongeacht platform.',
      },
      {
        questionTemplate: 'Wat zijn Core Web Vitals?',
        answerTemplate:
          'Google\'s metrics voor laadsnelheid, interactiviteit en visuele stabiliteit. Ze beïnvloeden rankings en gebruikerservaring, cruciaal voor mobiele bezoekers rond {district}.',
      },
      {
        questionTemplate: 'Helpt technische SEO ook mijn lokale vindbaarheid in {city}?',
        answerTemplate:
          'Ja. Lokale landingspagina\'s, Google Bedrijfsprofiel-koppelingen en schema markup werken alleen optimaal op een technisch gezonde site. Technische SEO is de basis onder lokale SEO in {city}.',
      },
      {
        questionTemplate: 'Hoe lang duurt een technisch SEO-traject in {city}?',
        answerTemplate:
          'Dat hangt af van de omvang van problemen. Een audit levert snel inzicht; implementatie varieert van enkele dagen tot weken bij complexe sites. Star Local geeft vooraf een realistisch beeld.',
      },
      {
        questionTemplate: 'Werkt technische SEO ook voor bedrijven richting {neighborNames}?',
        answerTemplate:
          'Ja. Technische SEO is locatie-onafhankelijk, maar Star Local stemt content en structuur af zodat u zowel in {city} als richting {neighborNames} goed presteert.',
      },
    ],
    imageAltTemplate: 'Technische SEO in {city} — crawlbaarheid, snelheid en indexering verbeteren',
    bottomCtaTitleTemplate: 'Technische SEO nodig voor uw site in {city}?',
    bottomCtaTextTemplate:
      'Laat Star Local technische blokkades oplossen zodat uw site beter presteert in Google. Vraag een technische audit of advies aan voor {city}.',
  },
  {
    slug: 'conversie-optimalisatie',
    name: 'Conversie-optimalisatie',
    nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['conversie-optimalisatie'],
    h1Template: 'Conversie-optimalisatie in {city}',
    seoTitleTemplates: [
      'Conversie-optimalisatie {city} | Star Local',
      '{serviceName} in {city}: meer aanvragen uit verkeer | Star Local',
      'Meer conversie voor uw website in {city} | Star Local',
    ],
    metaDescriptionTemplates: [
      'Conversie-optimalisatie in {city}: meer aanvragen uit hetzelfde verkeer. Star Local verbetert CTA\'s, formulieren en vertrouwen op uw site.',
      '{serviceName} voor bedrijven in {city}: sterkere CTA\'s, kortere formulieren en meer mobiele conversie.',
      'Website trekt verkeer maar weinig aanvragen in {city}? Star Local optimaliseert conversie voor {traits}.',
      'Meer klanten uit bestaand websiteverkeer in {city}? Star Local verbetert structuur, CTA\'s en vertrouwen.',
    ],
    heroIntroTemplates: [
      'Bezoekers komen op uw site, maar nemen ze contact op? Star Local analyseert gebruikersgedrag en verbetert CTA\'s, formulieren en structuur voor bedrijven in {city}. Zo worden meer bezoekers daadwerkelijk klant.',
      'In {city} trekken veel websites verkeer, maar converteren ondermaats. Star Local identificeert knelpunten en implementeert gerichte verbeteringen. Zo haalt u meer resultaat uit bezoekers die u al heeft.',
      'Elk verloren contactmoment kost omzet in {city}. Star Local verbetert CTA\'s, formulieren en vertrouwenssignalen op basis van daadwerkelijk gedrag. Zo zet u twijfelaars om in aanvragen.',
    ],
    serviceIntroTitleTemplate: 'Meer resultaat uit bestaand verkeer',
    serviceIntroParagraphs: [
      'Conversie-optimalisatie draait om wat bezoekers doen op uw site: klikken ze op een duidelijke CTA, vullen ze het formulier in, bellen ze, of haken ze af? In {city}, waar concurrentie online toeneemt, is elk verloren contactmoment kostbaar.',
      'Star Local kijkt naar CTA\'s, formulieren, paginastructuur, vertrouwenssignalen en mobiele conversie. We meten gedrag, testen verbeteringen en implementeren wat aantoonbaar meer aanvragen oplevert voor ondernemers rond {district}.',
      'Of u actief bent in {traits} of een andere sector in {city}: conversie-optimalisatie maakt het verschil tussen verkeer en omzet.',
    ],
    localProblemTitleTemplate: 'Waarom conversie-optimalisatie belangrijk is in {city}',
    localProblemParagraphs: [
      'Veel websites in {city} trekken verkeer, via lokale SEO, advertenties of mond-tot-mond, maar converteren ondermaats. Onduidelijke CTA\'s, te lange formulieren, gebrek aan vertrouwenssignalen of slechte mobiele ervaring kosten dagelijks aanvragen.',
      'Klanten rond {district} vergelijken snel. Wie niet binnen seconden ziet hoe contact werkt, kiest een concurrent met een duidelijkere route.',
      'Zonder meten en verbeteren blijft u gissen. Conversie-optimalisatie maakt zichtbaar waar bezoekers in {city} afhaken en wat u concreet kunt aanpassen.',
    ],
    localSolutionTitleTemplate: 'Wat Star Local voor bedrijven in {city} doet',
    localSolutionParagraphs: [
      'Star Local analyseert uw huidige site: heatmaps, scrollgedrag, formulier-voltooiing en contactroutes. We identificeren knelpunten en prioriteren verbeteringen met de hoogste impact voor uw bedrijf in {city}.',
      'We optimaliseren CTA\'s, formulieren, paginastructuur en vertrouwenssignalen, afgestemd op mobiel gebruik rond {district}. A/B-testen waar zinvol, implementatie van bewezen verbeteringen.',
      'Conversie-optimalisatie is iteratief. Star Local blijft meten en bijsturen wanneer uw verkeer, aanbod of doelgroep in {city} verandert.',
    ],
    benefits: [
      {
        icon: 'growth',
        title: 'Meer aanvragen zonder extra verkeer',
        descriptionTemplate:
          'Haal meer uit bezoekers die u al heeft, essentieel wanneer lokale SEO in {city} begint te renderen.',
      },
      {
        icon: 'mobile',
        title: 'Mobiele conversie',
        descriptionTemplate:
          'Optimalisatie gericht op smartphone-gebruikers die onderweg in {city} uw site bezoeken.',
      },
      {
        icon: 'design',
        title: 'Sterkere CTA\'s',
        descriptionTemplate:
          'Duidelijke, opvallende call-to-actions die bezoekers naar contact, bellen of bestellen leiden.',
      },
      {
        icon: 'communication',
        title: 'Betere formulieren',
        descriptionTemplate:
          'Kortere, duidelijkere formulieren die meer voltooiingen opleveren, minder afhakers rond {district}.',
      },
      {
        icon: 'custom',
        title: 'Vertrouwenssignalen',
        descriptionTemplate:
          'Reviews, cases en garanties zichtbaar op de juiste plekken, cruciaal voor sectoren als {traits}.',
      },
      {
        icon: 'scale',
        title: 'Data-gedreven verbetering',
        descriptionTemplate:
          'Beslissingen op basis van gedrag en resultaten, niet op onderbuikgevoel.',
      },
      {
        icon: 'seo',
        title: 'Koppeling met SEO',
        descriptionTemplate:
          'Conversie en vindbaarheid versterken elkaar, sterke pagina\'s die zowel ranken als converteren in {city}.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Gedraganalyse',
        descriptionTemplate:
          'Inzicht in hoe bezoekers uw site gebruiken: waar klikken ze, waar haken ze af, welke pagina\'s converteren in {city}?',
      },
      {
        number: '02',
        title: 'Knelpunten & hypotheses',
        descriptionTemplate:
          'Identificatie van conversieblokkades en formulering van concrete verbeteringen voor uw doelgroep rond {district}.',
      },
      {
        number: '03',
        title: 'Implementatie',
        descriptionTemplate:
          'Aanpassen van CTA\'s, formulieren, structuur en vertrouwenssignalen, met focus op mobiel.',
      },
      {
        number: '04',
        title: 'Meten & optimaliseren',
        descriptionTemplate:
          'Volgen van resultaten en doorlopend bijsturen voor structureel hogere conversie in {city}.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate:
          'Nieuwe testhypotheses en verbeteringen toevoegen naarmate uw website en aanbod groeien.',
      },
    ],
    industriesTitleTemplate: 'Conversie-optimalisatie voor bedrijven in {city}',
    industriesParagraphs: [
      'Ondernemers in {traits} willen meer aanvragen, reserveringen of bestellingen uit hetzelfde verkeer rond {district}. Elke sector vraagt een eigen aanpak van CTA\'s en vertrouwenssignalen.',
      'Star Local past conversie-optimalisatie toe per sector, met CTA\'s, formulieren en vertrouwenssignalen die passen bij hoe klanten in {city} beslissen.',
    ],
    districtsTitleTemplate: 'Conversie-optimalisatie voor heel {city}',
    districtsIntroTemplate:
      'Uw bezoekers komen uit alle wijken en bedrijventerreinen. Star Local optimaliseert websites voor ondernemers rond {district}, nabij {district2} en de rest van {city}.',
    relatedSlugs: ['website-laten-maken', 'lokale-seo', 'webshop-laten-maken'],
    relatedDescriptionTemplate:
      'Ook voor {relatedServiceName} in {city} helpt Star Local uw website beter te laten presteren en converteren.',
    faqTemplates: [
      {
        questionTemplate: 'Wat is {serviceName}?',
        answerTemplate:
          'Het verbeteren van uw website zodat meer bezoekers de gewenste actie uitvoeren: contact opnemen, offerte aanvragen, reserveren of bestellen. Star Local analyseert gedrag en implementeert gerichte verbeteringen voor bedrijven in {city}.',
      },
      {
        questionTemplate: 'Werkt conversie-optimalisatie ook voor kleine bedrijven in {city}?',
        answerTemplate:
          'Ja. Juist lokale ondernemers rond {district} profiteren wanneer elk contactmoment telt. Kleine aanpassingen aan CTA\'s en formulieren kunnen al merkbaar meer aanvragen opleveren.',
      },
      {
        questionTemplate: 'Hoe meten jullie resultaat in {city}?',
        answerTemplate:
          'Via analytics, formulier-voltooiing, heatmaps en, waar zinvol, A/B-testen. Star Local rapporteert wat verbetert en wat de volgende stap is.',
      },
      {
        questionTemplate: 'Kan conversie-optimalisatie op mijn bestaande site in {city}?',
        answerTemplate:
          'Ja. Star Local verbetert bestaande websites zonder volledige rebuild, tenzij de technische basis conversie structureel blokkeert.',
      },
      {
        questionTemplate: 'Hoe snel zie ik resultaat van conversie-optimalisatie?',
        answerTemplate:
          'Sommige verbeteringen, duidelijkere CTA\'s, kortere formulieren, kunnen snel effect tonen. Structurele optimalisatie is een doorlopend proces met cumulatief resultaat voor uw bedrijf in {city}.',
      },
      {
        questionTemplate: 'Bereikt conversie-optimalisatie ook klanten in {neighborNames}?',
        answerTemplate:
          'Ja. Een geoptimaliseerde website converteert beter voor alle bezoekers, ook wanneer zij uit {neighborNames} of verder komen.',
      },
    ],
    imageAltTemplate: 'Conversie-optimalisatie in {city} — meer aanvragen uit websitebezoekers',
    bottomCtaTitleTemplate: 'Meer aanvragen uit uw website in {city}?',
    bottomCtaTextTemplate:
      'Star Local helpt u meer bezoekers om te zetten in klanten. Vraag gratis advies aan over conversie-optimalisatie voor uw site in {city}.',
  },
  {
    slug: 'hosting-en-onderhoud',
    name: 'Hosting en onderhoud',
    nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['hosting-en-onderhoud'],
    h1Template: 'Hosting en onderhoud in {city}',
    seoTitleTemplates: [
      'Hosting en onderhoud {city} | Star Local',
      '{serviceName} voor uw website in {city} | Star Local',
      'Website hosting en beheer in {city} | Star Local',
    ],
    metaDescriptionTemplates: [
      'Hosting en website-onderhoud in {city}: snelheid, beveiliging, updates en back-ups. Star Local houdt uw site stabiel en veilig.',
      '{serviceName} voor bedrijven in {city}: snelle servers, automatische back-ups en technische ondersteuning.',
      'Website veilig en snel houden in {city}? Star Local verzorgt hosting, updates en monitoring voor {traits}.',
      'Betrouwbare hosting in {city} nodig? Star Local biedt onderhoud, back-ups en uptime-monitoring op maat.',
    ],
    heroIntroTemplates: [
      'Een website die traag, verouderd of kwetsbaar is, kost vertrouwen en aanvragen. Star Local verzorgt hosting, updates, back-ups en monitoring voor bedrijven in {city}. Zo blijft uw site stabiel en veilig online.',
      'Na livegang is uw website geen statisch product. Star Local biedt hosting en onderhoud op maat voor ondernemers in {city}, van updates tot beveiliging. Zo voorkomt u downtime op het verkeerde moment.',
      'Downtime of een gehackte site kost bedrijven in {city} direct omzet. Star Local monitort uptime en performance en grijpt snel in bij problemen. Zo blijft uw online visitekaartje altijd bereikbaar.',
    ],
    serviceIntroTitleTemplate: 'Betrouwbare hosting en professioneel onderhoud',
    serviceIntroParagraphs: [
      'Na livegang is uw website geen statisch product. Updates, beveiligingspatches, back-ups en performance-monitoring zijn nodig om snelheid, uptime en veiligheid te waarborgen. Voor ondernemers rond {district} en nabij {district2} die op hun site vertrouwen voor aanvragen, is downtime geen optie.',
      'Star Local biedt hosting en onderhoud op maat: snelle servers, regelmatige updates, automatische back-ups, beveiligingsmonitoring en technische ondersteuning wanneer iets misgaat, relevant voor bedrijven in {traits}.',
      'Of uw site door Star Local is gebouwd of later is overgenomen: wij zorgen dat uw online visitekaartje in {city} betrouwbaar blijft draaien.',
    ],
    localProblemTitleTemplate: 'Waarom hosting en onderhoud belangrijk is in {city}',
    localProblemParagraphs: [
      'Verouderde plugins, ontbrekende back-ups of trage hosting kosten niet alleen rankings, ook directe omzet. Een bedrijf rond {district} dat offline gaat op een druk moment, of een site nabij {district2} die gehackt wordt: de schade is onmiddellijk.',
      'Veel ondernemers in {city} onderhouden hun site zelf of vertrouwen op goedkope hosting zonder monitoring. Updates worden uitgesteld, back-ups ontbreken en problemen worden pas opgemerkt wanneer klanten klagen.',
      'Snelheid en uptime zijn rankingfactoren én vertrouwenssignalen. Wie professioneel wil ondernemen in {city}, heeft professioneel website-onderhoud nodig.',
    ],
    localSolutionTitleTemplate: 'Wat Star Local voor bedrijven in {city} doet',
    localSolutionParagraphs: [
      'Star Local host uw site op snelle, betrouwbare infrastructuur, afgestemd op Astro en moderne webstandaarden. Regelmatige updates, beveiligingspatches en back-ups houden uw site veilig en actueel, ook rond {district}.',
      'We monitoren uptime en performance. Bij problemen schakelen we snel, zodat uw site in {city} en daarbuiten bereikbaar blijft voor klanten die contact willen opnemen.',
      'Technische ondersteuning staat klaar voor vragen, kleine aanpassingen en incidenten. U focust op ondernemen in {city}; wij op een stabiele online basis.',
    ],
    benefits: [
      {
        icon: 'speed',
        title: 'Snelle, stabiele hosting',
        descriptionTemplate:
          'Servers en configuratie afgestemd op snelle laadtijden, essentieel voor SEO en conversie in {city}.',
      },
      {
        icon: 'custom',
        title: 'Regelmatige updates',
        descriptionTemplate:
          'Beveiligingspatches en software-updates zonder dat u zelf technisch beheer hoeft te doen.',
      },
      {
        icon: 'scale',
        title: 'Automatische back-ups',
        descriptionTemplate:
          'Uw site en data veilig gesteld, herstel mogelijk bij incidenten of menselijke fouten.',
      },
      {
        icon: 'communication',
        title: 'Technische ondersteuning',
        descriptionTemplate:
          'Direct contact bij problemen of vragen, geen ticketsystemen zonder antwoord voor ondernemers rond {district}.',
      },
      {
        icon: 'growth',
        title: 'Uptime-monitoring',
        descriptionTemplate:
          'Proactieve controle zodat downtime snel wordt opgemerkt en opgelost.',
      },
      {
        icon: 'seo',
        title: 'Performance in stand houden',
        descriptionTemplate:
          'Core Web Vitals en snelheid bewaken, rankingfactoren die u niet wilt verliezen in {city}.',
      },
      {
        icon: 'design',
        title: 'Beveiliging',
        descriptionTemplate:
          'Monitoring en updates die kwetsbaarheden beperken, bescherming voor uw site en bezoekers.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Inventarisatie',
        descriptionTemplate:
          'Review van huidige hosting, platform, updates en back-ups, wat heeft uw site in {city} nodig?',
      },
      {
        number: '02',
        title: 'Migratie of setup',
        descriptionTemplate:
          'Overstap naar betrouwbare hosting of optimalisatie van bestaande omgeving, zonder onnodige downtime.',
      },
      {
        number: '03',
        title: 'Onderhoudsplan',
        descriptionTemplate:
          'Updates, back-ups, monitoring en supportafspraken, helder en voorspelbaar voor uw bedrijf in {city}.',
      },
      {
        number: '04',
        title: 'Doorlopend beheer',
        descriptionTemplate:
          'Regelmatig onderhoud, incidentafhandeling en performance-bewaking, maand na maand.',
      },
      {
        number: '05',
        title: 'Evaluatie & uitbreiding',
        descriptionTemplate:
          'Onderhoudsplan bijstellen wanneer uw website of bedrijf in {city} groeit.',
      },
    ],
    industriesTitleTemplate: 'Hosting en onderhoud voor bedrijven in {city}',
    industriesParagraphs: [
      'Ondernemers in {traits} rond {district} kunnen geen offline site veroorloven op drukke momenten. Andere sectoren in {city} leunen op formulieren en contactroutes die altijd moeten werken.',
      'Star Local onderhoudt websites voor ondernemers in {city} die professioneel online willen blijven, zonder zelf technisch beheer te doen.',
    ],
    districtsTitleTemplate: 'Hosting en onderhoud in heel {city}',
    districtsIntroTemplate:
      'Waar u ook gevestigd bent: uw site moet altijd bereikbaar zijn. Star Local ondersteunt ondernemers rond {district}, nabij {district2} en in alle andere gebieden van {city}.',
    relatedSlugs: ['website-laten-maken', 'technische-seo', 'conversie-optimalisatie'],
    relatedDescriptionTemplate:
      'Ook voor {relatedServiceName} in {city} zorgt Star Local voor een stabiele, snelle technische basis.',
    faqTemplates: [
      {
        questionTemplate: 'Wat houdt {serviceName} precies in?',
        answerTemplate:
          'Hosting is waar uw site draait; onderhoud omvat updates, back-ups, beveiliging, monitoring en technische support. Star Local verzorgt beide zodat uw site in {city} stabiel en veilig blijft.',
      },
      {
        questionTemplate: 'Kunnen jullie ook sites onderhouden die niet door Star Local zijn gebouwd, rond {district}?',
        answerTemplate:
          'In veel gevallen wel, afhankelijk van platform en technische staat. Star Local beoordeelt eerlijk of overname of migratie zinvoller is voor uw situatie in {city}.',
      },
      {
        questionTemplate: 'Hoe vaak worden back-ups gemaakt?',
        answerTemplate:
          'Star Local maakt automatische back-ups volgens een vast schema. Frequentie en retentie bespreken we in het onderhoudsplan, passend bij uw site en risico\'s.',
      },
      {
        questionTemplate: 'Wat als mijn site in {city} offline gaat?',
        answerTemplate:
          'Met uptime-monitoring merken we problemen snel op. Star Local schakelt direct om downtime te beperken en uw site weer bereikbaar te maken voor klanten in {city} en {neighborNames}.',
      },
      {
        questionTemplate: 'Beïnvloedt hosting mijn SEO in {city}?',
        answerTemplate:
          'Ja. Trage of instabiele hosting schaadt Core Web Vitals en gebruikerservaring, rankingfactoren. Betrouwbare hosting is onderdeel van een gezonde SEO-basis.',
      },
      {
        questionTemplate: 'Kan ik kleine wijzigingen laten doorvoeren via onderhoud?',
        answerTemplate:
          'Ja. Star Local biedt technische ondersteuning en kan kleine content- of technische aanpassingen verzorgen binnen het onderhoudsabonnement, afhankelijk van de afspraken.',
      },
    ],
    imageAltTemplate: 'Hosting en website-onderhoud in {city} — snelheid, veiligheid en stabiliteit',
    bottomCtaTitleTemplate: 'Betrouwbare hosting nodig in {city}?',
    bottomCtaTextTemplate:
      'Laat Star Local uw website hosten en onderhouden, snel, veilig en met technische support. Vraag vrijblijvend advies aan voor uw bedrijf in {city}.',
  },
  {
    slug: 'ai-seo',
    name: 'AI SEO',
    nationalServiceSlug: LOCAL_TO_NATIONAL_SLUG['ai-seo'],
    h1Template: 'AI SEO in {city}',
    seoTitleTemplates: [
      'AI SEO {city} | Star Local',
      '{serviceName} voor bedrijven in {city} | Star Local',
      'Klaar voor AI-zoekmachines in {city} | Star Local',
    ],
    metaDescriptionTemplates: [
      'AI SEO in {city}: content en structuur optimaliseren voor AI-zoekmachines en moderne zoekervaringen. Star Local bereidt uw website voor.',
      '{serviceName} voor ondernemers in {city}: zoekintentie, structured data en actuele content voor {traits}.',
      'Klaar voor AI-gedreven zoeken in {city}? Star Local verbetert content en interne links voor betere vindbaarheid.',
      'AI SEO laten toepassen in {city}? Star Local optimaliseert uw website voor moderne zoekervaringen en Google.',
    ],
    heroIntroTemplates: [
      'Zoeken verandert: AI-zoekmachines en rijke antwoorden vragen andere content en structuur. Star Local helpt bedrijven in {city} hun website voor te bereiden op moderne zoekervaringen. Zo blijft u zichtbaar zonder lokale relevantie te verliezen.',
      'Klanten in {city} stellen steeds vaker complexe vragen aan zoekmachines en AI-assistenten. Star Local verbetert content, structuur en interne links zodat AI-systemen uw diensten begrijpen. Zo blijft u relevant in nieuwe zoekkanalen.',
      'AI SEO gaat verder dan klassieke keywords. Star Local optimaliseert content en gestructureerde data voor bedrijven in {city} die voorbereid willen zijn op de toekomst van zoeken. Zo combineert u klassieke Google-zichtbaarheid met AI-gereedheid.',
    ],
    serviceIntroTitleTemplate: 'SEO voor de volgende generatie zoeken',
    serviceIntroParagraphs: [
      'AI SEO gaat verder dan klassieke keywords. Het draait om zoekintentie, gestructureerde content, interne links, contentactualisatie en data die AI-systemen en zoekmachines helpen uw site te begrijpen en aan te bevelen, relevant voor ondernemers rond {district}.',
      'Star Local analyseert bestaande pagina\'s, signaleert kansen en verbetert content en structuur, zodat uw site in {city} relevant blijft in traditionele Google-resultaten én in opkomende AI-zoekervaringen.',
      'Voor ondernemers in {traits}: AI SEO is geen hype, maar voorbereiding op hoe klanten steeds vaker informatie vinden en beslissingen nemen in {city} en {province}.',
    ],
    localProblemTitleTemplate: 'Waarom AI SEO belangrijk is in {city}',
    localProblemParagraphs: [
      'Klanten in {city} stellen steeds vaker complexe vragen aan zoekmachines en AI-assistenten, gericht op een dienst gecombineerd met {district}. Wie content plat of verouderd houdt, mist zichtbaarheid in nieuwe zoekkanalen.',
      'Gestructureerde data, heldere contenthiërarchie en actuele pagina\'s helpen zowel Google als AI-systemen uw diensten te koppelen aan lokale intentie. Zonder die basis wint een concurrent nabij {district2} die wél investeert in moderne SEO.',
      'AI SEO sluit aan op lokale SEO: uw context in {city}, wijken, sectoren, diensten, moet machine-leesbaar en commercieel sterk zijn. Dat vraagt meer dan keyword-stuffing of generieke teksten.',
    ],
    localSolutionTitleTemplate: 'Wat Star Local voor bedrijven in {city} doet',
    localSolutionParagraphs: [
      'Star Local audit uw content en structuur: welke pagina\'s zijn verouderd, welke interne links ontbreken, waar is gestructureerde data nodig? We signaleren kansen en verbeteren pagina\'s gericht op zoekintentie en lokale relevantie in {city}.',
      'We actualiseren content, versterken interne links en optimaliseren structured data, zodat AI-zoekmachines en klassieke Google uw site beter begrijpen. Automatische verbeteringen waar zinvol, menselijke controle waar kwaliteit telt, ook rond {district}.',
      'AI SEO is een doorlopend proces. Star Local blijft pagina\'s verbeteren wanneer zoekgedrag, uw aanbod of de markt in {city} verandert.',
    ],
    benefits: [
      {
        icon: 'growth',
        title: 'Voorbereid op AI-zoeken',
        descriptionTemplate:
          'Content en structuur die aansluiten op hoe klanten in {city} steeds vaker via AI informatie vinden.',
      },
      {
        icon: 'seo',
        title: 'Zoekintentie centraal',
        descriptionTemplate:
          'Pagina\'s afgestemd op wat prospects rond {district} werkelijk zoeken, niet op verouderde keyword-trucs.',
      },
      {
        icon: 'custom',
        title: 'Contentactualisatie',
        descriptionTemplate:
          'Verouderde pagina\'s verbeteren zodat uw site actueel en relevant blijft voor Google en AI.',
      },
      {
        icon: 'scale',
        title: 'Interne linkstructuur',
        descriptionTemplate:
          'Sterke interne links die AI en zoekmachines helpen uw diensten en lokale pagina\'s in {city} te begrijpen.',
      },
      {
        icon: 'communication',
        title: 'Kansen signaleren',
        descriptionTemplate:
          'Proactief identificeren van contentgaten en verbeterpunten in uw online aanwezigheid rond {district}.',
      },
      {
        icon: 'design',
        title: 'Gestructureerde data',
        descriptionTemplate:
          'Schema markup en structuur die machine-leesbaarheid en rijke resultaten ondersteunen.',
      },
      {
        icon: 'mobile',
        title: 'Lokaal én modern',
        descriptionTemplate:
          'Lokale relevantie in {city} behouden terwijl u voorbereid bent op landelijke en AI-gedreven zoekervaringen.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Content- en structuuranalyse',
        descriptionTemplate:
          'Review van bestaande pagina\'s, interne links, structured data en verouderde content, met focus op relevantie voor {city}.',
      },
      {
        number: '02',
        title: 'Kansen & prioriteiten',
        descriptionTemplate:
          'Welke pagina\'s en onderwerpen leveren de meeste winst op voor AI SEO en lokale vindbaarheid rond {district}?',
      },
      {
        number: '03',
        title: 'Verbetering & actualisatie',
        descriptionTemplate:
          'Content verbeteren, links versterken, structured data toevoegen, pagina voor pagina.',
      },
      {
        number: '04',
        title: 'Monitoring & iteratie',
        descriptionTemplate:
          'Volgen van ontwikkelingen in zoekgedrag en doorlopend verbeteren wanneer nieuwe kansen ontstaan in {city}.',
      },
      {
        number: '05',
        title: 'Uitbreiding',
        descriptionTemplate:
          'Nieuwe content en structuur toevoegen wanneer uw diensten of markt in {city} veranderen.',
      },
    ],
    industriesTitleTemplate: 'AI SEO voor bedrijven in {city}',
    industriesParagraphs: [
      'Ondernemers in {traits} rond {district} profiteren van content die vragen beantwoordt. Andere sectoren in {city} hebben vaak veel pagina\'s die actualisatie en structuur nodig hebben.',
      'Star Local past AI SEO toe per sector, met contentverbetering die lokaal in {city} resoneert en voorbereid is op moderne zoekervaringen.',
    ],
    districtsTitleTemplate: 'AI SEO voor ondernemers in heel {city}',
    districtsIntroTemplate:
      'Lokale context blijft centraal. Star Local verbetert content en structuur voor bedrijven rond {district}, nabij {district2} en in alle andere gebieden van {city}.',
    relatedSlugs: ['lokale-seo', 'technische-seo', 'website-laten-maken'],
    relatedDescriptionTemplate:
      'Ook voor {relatedServiceName} in {city} bouwt Star Local aan een sterke, toekomstbestendige online basis.',
    faqTemplates: [
      {
        questionTemplate: 'Is {serviceName} geschikt voor een lokaal bedrijf in {city}?',
        answerTemplate:
          'Ja. Juist lokale bedrijven profiteren wanneer content en structuur aansluiten op hoe klanten zoeken, inclusief AI-zoekervaringen met lokale intentie rond {district}.',
      },
      {
        questionTemplate: 'Vervangt AI SEO lokale SEO in {city}?',
        answerTemplate:
          'Nee, het vult aan. Lokale SEO blijft essentieel voor Google en Maps. AI SEO bereidt uw content en structuur voor op aanvullende zoekkanalen en rijkere antwoorden.',
      },
      {
        questionTemplate: 'Wat verbetert Star Local concreet op mijn site in {city}?',
        answerTemplate:
          'Verouderde content, interne links, structured data, paginastructuur en zoekintentie-afstemming. Star Local signaleert kansen en verbetert pagina\'s gericht op commerciële en lokale relevantie.',
      },
      {
        questionTemplate: 'Hoe snel zie ik resultaat van AI SEO?',
        answerTemplate:
          'Contentverbeteringen kunnen geleidelijk effect tonen in rankings en zichtbaarheid. AI SEO is een doorlopend proces, Star Local geeft een realistisch beeld van verwachtingen voor uw bedrijf in {city}.',
      },
      {
        questionTemplate: 'Werkt AI SEO samen met mijn Google Bedrijfsprofiel in {city}?',
        answerTemplate:
          'Ja. Profiel en website versterken elkaar. AI SEO optimaliseert website-content; een sterk Google Bedrijfsprofiel ondersteunt lokale vindbaarheid in Maps, beide horen bij een complete aanpak in {city}.',
      },
      {
        questionTemplate: 'Is AI SEO ook relevant voor klanten in {neighborNames}?',
        answerTemplate:
          'Ja. Verbeterde content en structuur werken breder dan alleen {city}, ook bezoekers uit {neighborNames} profiteren van heldere, actuele pagina\'s.',
      },
    ],
    imageAltTemplate: 'AI SEO in {city} — content en structuur voor moderne zoekervaringen',
    bottomCtaTitleTemplate: 'Voorbereid op moderne zoeken in {city}?',
    bottomCtaTextTemplate:
      'Star Local helpt uw website klaar te maken voor AI-zoekmachines en klassieke Google. Vraag gratis advies aan over AI SEO voor uw bedrijf in {city}.',
  },
];

export const LOCAL_SERVICE_SLUGS: string[] = [...BREDA_LOCAL_SERVICE_SLUGS];

export const SERVICE_BY_SLUG: Record<string, ServiceDefinition> = SERVICE_DEFINITIONS.reduce(
  (acc, service) => {
    acc[service.slug] = service;
    return acc;
  },
  {} as Record<string, ServiceDefinition>,
);

export function getServiceDefinition(slug: string): ServiceDefinition | undefined {
  return SERVICE_BY_SLUG[slug];
}
