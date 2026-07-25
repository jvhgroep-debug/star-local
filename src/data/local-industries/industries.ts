export type IndustryBenefitIcon =
  | 'speed'
  | 'design'
  | 'seo'
  | 'mobile'
  | 'communication'
  | 'scale'
  | 'custom'
  | 'growth';

export interface IndustryBenefitTemplate {
  icon: IndustryBenefitIcon;
  title: string;
  descriptionTemplate: string;
}

export interface IndustryProcessStepTemplate {
  number: string;
  title: string;
  descriptionTemplate: string;
}

export interface IndustryFaqTemplate {
  questionTemplate: string;
  answerTemplate: string;
}

export interface IndustryDefinition {
  slug: string;
  name: string;
  nameSingular: string;
  namePluralLower: string;
  relatedSlugs: string[];
  websiteRequirements: string[];
  features: string[];
  benefits: IndustryBenefitTemplate[];
  processSteps: IndustryProcessStepTemplate[];
  whyImportantParagraphs: string[];
  challengesParagraphs: string[];
  requirementsIntro: string;
  localIntroParagraphs: string[];
  heroIntroTemplates: string[];
  faqTemplates: IndustryFaqTemplate[];
  bottomCtaTitleTemplate: string;
  bottomCtaTextTemplate: string;
  metaDescriptionTemplates: string[];
  relatedIndustryDescriptionTemplate: string;
}

export const INDUSTRY_DEFINITIONS: IndustryDefinition[] = [
  {
    slug: 'restaurants',
    name: 'Restaurants',
    nameSingular: 'restaurant',
    namePluralLower: 'restaurants',
    relatedSlugs: ['kappers', 'sportscholen', 'autobedrijven'],
    websiteRequirements: [
      "Online menukaart die eenvoudig zelf te updaten is",
      'Duidelijke reserveringsknop of reserveringswidget',
      "Sfeervolle foto's van gerechten en interieur",
      'Actuele openingstijden met feestdagmelding',
      'Informatie over allergenen en dieetwensen',
      'Google Maps-integratie en routebeschrijving',
      'Reviews en beoordelingen zichtbaar op de site',
      'Snelle laadtijd, ook op mobiel tijdens spitsuren',
    ],
    features: [
      'Digitale menukaart met categorieën en prijzen',
      'Reserveringswidget of koppeling met reserveringssysteem',
      "Fotogalerij van gerechten, terras en interieur",
      'Google Reviews-widget voor social proof',
      'Openingstijden met automatische feestdagmelding',
      'Contactformulier voor groepen, feesten en catering',
      'Bezorg- en afhaalinformatie met externe links',
    ],
    benefits: [
      {
        icon: 'design',
        title: 'Sfeervolle uitstraling',
        descriptionTemplate:
          'Fotografie en vormgeving die de smaak en beleving van uw {industrySingular} in {city} laten proeven, nog voor het eerste bezoek.',
      },
      {
        icon: 'mobile',
        title: 'Reserveren vanaf de bank',
        descriptionTemplate:
          'Gasten van uw {industrySingular} reserveren eenvoudig via mobiel, met een reserveringsknop die altijd in beeld blijft.',
      },
      {
        icon: 'speed',
        title: 'Snel laden tijdens spitsuren',
        descriptionTemplate:
          'Ook rond etenstijd, wanneer veel gasten in {city} gelijktijdig zoeken, blijft de website van uw {industrySingular} razendsnel.',
      },
      {
        icon: 'seo',
        title: 'Vindbaar bij lokale zoekopdrachten',
        descriptionTemplate:
          "Technische SEO-basis zodat uw {industrySingular} verschijnt bij zoektermen als '{industrySingular} {city}'.",
      },
      {
        icon: 'communication',
        title: 'Directe lijn met de gast',
        descriptionTemplate:
          'Contactgegevens, reserveringsformulier en social links van uw {industrySingular} op één centrale plek in {city}, zonder omwegen.',
      },
      {
        icon: 'custom',
        title: 'Menukaart op maat',
        descriptionTemplate:
          'Geen statische PDF, maar een overzichtelijke menukaart voor uw {industrySingular} die u zelf actueel houdt.',
      },
      {
        icon: 'growth',
        title: 'Ruimte om te groeien',
        descriptionTemplate:
          'Voeg eenvoudig een tweede vestiging, cateringpagina of bezorgoptie toe wanneer uw {industrySingular} in {city} uitbreidt.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Kennismaking & concept',
        descriptionTemplate:
          'We bespreken uw keuken, doelgroep en concurrentie in {city}, en wat de website concreet moet opleveren.',
      },
      {
        number: '02',
        title: 'Menukaart & fotografie',
        descriptionTemplate:
          'We structureren uw menukaart en adviseren over fotografie die gerechten aantrekkelijk presenteert, passend bij uw doelgroep in {city}.',
      },
      {
        number: '03',
        title: 'Bouw & reserveringen',
        descriptionTemplate:
          'Ontwikkeling in Astro met reserveringsfunctionaliteit en een technische SEO-basis voor vindbaarheid in {city}.',
      },
      {
        number: '04',
        title: 'Test & livegang',
        descriptionTemplate:
          'Controle op snelheid, mobiele weergave en de reserveringsflow. Daarna live, zichtbaar voor gasten in heel {city}.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate:
          "Optimaliseren op basis van reserveringsdata, en uitbreiden met seizoensmenu's of een tweede locatie in {city}.",
      },
    ],
    whyImportantParagraphs: [
      "Gasten googelen op '{industrySingular} {city}' of zoeken specifiek op keuken, wijk of gelegenheid, bijvoorbeeld rond {district}. Staat uw menukaart niet online of laadt de site traag op mobiel? Dan haken hongerige bezoekers af naar het volgende zoekresultaat.",
      "Een sterke website bouwt vertrouwen op nog vóór het eerste bezoek: foto's van gerechten, actuele openingstijden en reviews van andere gasten. Dat verkleint drempels en verhoogt het aantal reserveringen in {city}.",
      'In een provincie als {province}, met veel horeca-aanbod, maakt een professionele uitstraling het verschil tussen een vol terras en een lege zaak op een doordeweekse avond in {city}.',
    ],
    challengesParagraphs: [
      "Veel restaurantwebsites zijn gebouwd op verouderde templates: een PDF-menukaart die niet leesbaar is op een telefoon, geen werkend reserveringssysteem en foto's die de sfeer niet overbrengen.",
      'Andere veelvoorkomende problemen zijn openingstijden die niet kloppen met de praktijk, ontbrekende informatie over allergenen of dieetwensen, en een gebrek aan koppeling met Google Maps en reviews, waardoor gasten in {city} twijfelen of ze welkom zijn.',
      'Tot slot leunen veel horecazaken in {city} te sterk op externe bezorgplatforms, die commissie vragen en de directe relatie met de gast wegnemen.',
    ],
    requirementsIntro:
      'Een restaurantwebsite moet binnen enkele seconden duidelijk maken wat u serveert, waar u zit in {city} en hoe iemand een tafel kan reserveren.',
    localIntroParagraphs: [
      "{city} heeft binnen {province} een levendige horecascene, van sfeervolle terrassen tot verborgen adresjes rond {district} en {district2}. Gasten kiezen steeds vaker online voor een restaurant nog voordat ze de deur binnenstappen, op basis van foto's, reviews en een duidelijke menukaart.",
      'Star Local bouwt websites voor restaurants in {city} die er op elk scherm smakelijk uitzien: heldere gerechten, sfeervolle beelden en een reserveringsknop die niet te missen is.',
      'Of u een bistro nabij {district} runt, een eetcafé in {district2} of een familierestaurant elders in {city}, uw website moet gasten overtuigen vóórdat ze bij de concurrent boeken.',
    ],
    heroIntroTemplates: [
      'Gasten zoeken uw menukaart, openingstijden en reserveringsmogelijkheid vaak al onderweg op hun telefoon. Star Local bouwt snelle, smaakvolle restaurantwebsites die gasten in {city} naar uw deur leiden. Van online menukaart tot reserveren staat alles op één overzichtelijke plek.',
      'Een goed restaurant verdient een website die de smaak alvast laat proeven. Star Local bouwt sfeervolle, snelle websites voor restaurants in {city} met een duidelijke menukaart en reserveringsknop. Zo overtuigt u gasten nog voor ze binnenstappen.',
      'In {city} kiezen gasten hun restaurant steeds vaker al op de bank, via foto\'s, menukaart en reviews. Star Local bouwt websites die uw keuken en sfeer overtuigend presenteren. Reserveren wordt daarbij net zo eenvoudig als scrollen.',
    ],
    faqTemplates: [
      {
        questionTemplate: 'Kan ik reserveringen voor mijn {industrySingular} via de website laten verlopen?',
        answerTemplate:
          'Ja, we integreren een reserveringswidget of koppelen uw bestaande reserveringssysteem, zodat gasten in {city} direct via de website een tafel kunnen boeken.',
      },
      {
        questionTemplate: 'Kan ik zelf de menukaart van mijn {industrySingular} aanpassen?',
        answerTemplate:
          'Ja, u kunt prijzen en gerechten eenvoudig zelf bijwerken zonder technische kennis, zodat uw kaart altijd actueel is.',
      },
      {
        questionTemplate: 'Helpen jullie ook met foto\'s van mijn gerechten?',
        answerTemplate:
          'We adviseren over sfeervolle fotografie en verwerken de beelden in een aantrekkelijke fotogalerij voor uw {industrySingular}.',
      },
      {
        questionTemplate: 'Wordt mijn {industrySingular} ook goed gevonden op Google Maps in {city}?',
        answerTemplate:
          'Ja, we zorgen voor een technische koppeling en optimalisatie zodat u goed vindbaar bent in Google Maps en lokale zoekresultaten in {city}.',
      },
      {
        questionTemplate: 'Kan de website ook cateringaanvragen verwerken?',
        answerTemplate:
          'Zeker, we voegen een apart contactformulier toe voor catering, groepen of zakelijke evenementen, los van reguliere reserveringen.',
      },
      {
        questionTemplate: 'Wat als mijn {industrySingular} meerdere vestigingen in de regio rond {city} heeft?',
        answerTemplate:
          'Dan bouwen we een schaalbare structuur met een pagina per vestiging, zodat gasten in {city} en omstreken altijd de juiste locatie vinden.',
      },
    ],
    bottomCtaTitleTemplate: 'Klaar voor een website die uw {industrySingular} in {city} laat groeien?',
    bottomCtaTextTemplate:
      'Laat een website bouwen die gasten aantrekt, reserveringen verhoogt en uw menukaart altijd actueel houdt. Vraag vrijblijvend advies aan, we denken graag mee over uw {industrySingular} in {city}.',
    metaDescriptionTemplates: [
      "Website voor {industryPluralLower} in {city} laten maken? Star Local bouwt snelle websites met online menukaart, reserveren en sfeervolle foto's van uw keuken.",
      'Laat een website voor {industryPluralLower} in {city} maken met menukaart, reserveringen en een koppeling met Google Maps. Star Local bouwt smaakvolle sites.',
      "Meer reserveringen voor {industryPluralLower} in {city}: Star Local bouwt snelle, smaakvolle websites met menukaart, foto's en klantreviews voor uw gasten.",
      'Website laten maken voor {industryPluralLower} in {city}? Star Local zorgt voor een online menukaart, reserveren en sterke lokale vindbaarheid.',
    ],
    relatedIndustryDescriptionTemplate:
      'Ook voor {industryPluralLower} in {city} bouwen we snelle websites die meer aanvragen en boekingen opleveren.',
  },
  {
    slug: 'kappers',
    name: 'Kappers',
    nameSingular: 'kapper',
    namePluralLower: 'kappers',
    relatedSlugs: ['restaurants', 'tandartsen', 'sportscholen'],
    websiteRequirements: [
      'Online afsprakenmodule of boekingswidget',
      "Portfolio met foto's van kapsels en behandelingen",
      'Duidelijk prijzenoverzicht per behandeling',
      'Teampagina met specialismen',
      'Openingstijden en actuele beschikbaarheid',
      'Reviews van klanten',
      'Contactgegevens en routebeschrijving',
      'Snelle, mobielvriendelijke weergave',
    ],
    features: [
      'Online boekingsmodule met tijdslots per kapper',
      "Portfolio met voor- en na-foto's per behandeling",
      'Prijslijst die eenvoudig zelf te updaten is',
      'Teampagina met specialismen en ervaring',
      'Instagram-feed die automatisch uw laatste werk toont',
      'Google Reviews-widget voor social proof',
      'WhatsApp-knop voor snelle vragen',
    ],
    benefits: [
      {
        icon: 'mobile',
        title: 'Boeken vanaf de smartphone',
        descriptionTemplate:
          'Klanten van uw {industrySingular} plannen hun afspraak razendsnel via mobiel, met een boekingsknop die altijd binnen handbereik is.',
      },
      {
        icon: 'design',
        title: 'Portfolio dat overtuigt',
        descriptionTemplate:
          'Laat het beste werk van uw {industrySingular} zien met een strak vormgegeven fotogalerij die past bij uw stijl in {city}.',
      },
      {
        icon: 'speed',
        title: 'Snel geladen, ook op drukke momenten',
        descriptionTemplate:
          'Geen wachttijd, zelfs wanneer veel klanten in {city} gelijktijdig een afspraak proberen te boeken bij uw {industrySingular}.',
      },
      {
        icon: 'seo',
        title: 'Vindbaar in {city}',
        descriptionTemplate:
          "Technische SEO-basis zodat uw {industrySingular} verschijnt bij zoekopdrachten als '{industrySingular} {city}'.",
      },
      {
        icon: 'communication',
        title: 'Direct contact',
        descriptionTemplate:
          'Telefoon, WhatsApp en boekingslink van uw {industrySingular} centraal, zodat klanten nooit hoeven te zoeken.',
      },
      {
        icon: 'custom',
        title: 'Uw merk, geen sjabloon',
        descriptionTemplate:
          'Een website die past bij de identiteit van uw {industrySingular}, niet bij een generiek kappersjabloon.',
      },
      {
        icon: 'growth',
        title: 'Klaar voor uitbreiding',
        descriptionTemplate:
          'Voeg eenvoudig een tweede stoel, nieuwe behandeling of vestiging toe aan de website van uw {industrySingular} in {city}.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Kennismaking & doelen',
        descriptionTemplate:
          'We bespreken uw salon, doelgroep en concurrentie in {city}, en of de focus ligt op nieuwe klanten of vaste boekingen.',
      },
      {
        number: '02',
        title: 'Structuur & portfolio',
        descriptionTemplate:
          'We bepalen de paginastructuur en adviseren over fotografie die past bij de stijl van uw salon in {city}.',
      },
      {
        number: '03',
        title: 'Bouw & boekingssysteem',
        descriptionTemplate:
          'Ontwikkeling in Astro met boekingsfunctionaliteit en een technische SEO-basis voor vindbaarheid in {city}.',
      },
      {
        number: '04',
        title: 'Test & livegang',
        descriptionTemplate:
          'Controle op snelheid, mobiele weergave en de boekingsflow, daarna live voor klanten in {city}.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate:
          'Optimaliseren en uitbreiden met nieuwe behandelingen, acties of een tweede vestiging in {city}.',
      },
    ],
    whyImportantParagraphs: [
      "Klanten zoeken op '{industrySingular} {city}' of '{industrySingular} bij mij in de buurt' en kiezen vaak de salon met de duidelijkste website en snelste boekingsopties, ook rond {district}.",
      'Een professionele website toont uw stijl, tarieven en beschikbaarheid, en verlaagt de drempel om een eerste afspraak te maken bij een nieuwe kapper in {city}.',
      "In {province} zijn klanten gewend om 's avonds of in het weekend online te boeken in plaats van te bellen. Zonder boekingsmogelijkheid mist u die aanvragen in {city}.",
    ],
    challengesParagraphs: [
      'Veel kapperswebsites tonen geen actuele foto\'s van kapsels, hebben geen boekingsfunctie en zijn niet leesbaar op mobiel, precies het apparaat waarmee de meeste klanten boeken.',
      'Ook ontbreekt vaak duidelijke informatie over prijzen, specialismen zoals kleuring of baardverzorging, en het team, waardoor nieuwe klanten in {city} twijfelen wie te kiezen.',
      'Sommige salons in {city} zijn volledig afhankelijk van een externe boekingsapp met eigen commissie, zonder een eigen website die vertrouwen en merkidentiteit opbouwt.',
    ],
    requirementsIntro:
      'Een kapperswebsite moet in één oogopslag laten zien wat u doet, voor wie, en hoe iemand in {city} snel een afspraak boekt.',
    localIntroParagraphs: [
      '{city} telt talloze kappers, van kleine salons rond {district} tot trendy barbershops nabij {district2}. Klanten vergelijken stijl, prijzen en beschikbaarheid online voordat ze een afspraak maken.',
      'Star Local bouwt websites die uw werk laten spreken: een portfolio met kapsels, een teampagina en een boekingsknop die altijd zichtbaar is.',
      'Of u nu dames, heren of gezinnen knipt rond {district} of in {district2}, uw website moet nieuwe klanten in {city} overtuigen en vaste klanten makkelijk laten terugboeken.',
    ],
    heroIntroTemplates: [
      'Klanten boeken hun knipbeurt steeds vaker online, ook buiten openingstijden. Star Local bouwt websites voor kappers in {city} met online boeken, een stijlvolle portfolio en snelle laadtijden. Zo blijft uw stoel gevuld, ook zonder telefoontjes.',
      'Een kapsalon verdient een website die stijl uitstraalt en boeken moeiteloos maakt. Star Local bouwt snelle, stijlvolle websites voor kappers in {city} met portfolio en online boekingsmodule. Zo wint u nieuwe klanten zonder extra moeite.',
      'In {city} kiezen klanten hun kapper vaak op basis van foto\'s en beschikbaarheid, nog voor het eerste telefoontje. Star Local bouwt websites die uw stijl laten zien en boeken vereenvoudigen. Zo houdt u uw agenda vol.',
    ],
    faqTemplates: [
      {
        questionTemplate: 'Kunnen klanten online een afspraak boeken bij mijn {industrySingular}?',
        answerTemplate:
          'Ja, we integreren een boekingsmodule of koppelen uw bestaande boekingssysteem, zodat klanten in {city} zelf een tijdslot kiezen wanneer het hen uitkomt.',
      },
      {
        questionTemplate: 'Kan ik zelf mijn prijslijst aanpassen?',
        answerTemplate: 'Ja, prijzen en behandelingen zijn eenvoudig zelf te wijzigen, zonder technische kennis.',
      },
      {
        questionTemplate: 'Helpen jullie met fotografie voor mijn {industrySingular}?',
        answerTemplate:
          'We adviseren over stijl en verwerken uw foto\'s in een overzichtelijke portfolio die uw werk laat spreken.',
      },
      {
        questionTemplate: 'Word ik ook gevonden als mensen in {city} zoeken op mijn wijk?',
        answerTemplate:
          "Ja, we optimaliseren de website technisch zodat u zichtbaar wordt bij zoekopdrachten zoals '{industrySingular} {city}'.",
      },
      {
        questionTemplate: 'Kan ik een cadeaubonpagina toevoegen?',
        answerTemplate: 'Zeker, we voegen een pagina toe waar klanten cadeaubonnen kunnen aanvragen of bestellen.',
      },
      {
        questionTemplate: 'Werkt de website ook goed op mobiel?',
        answerTemplate:
          'Ja, de website is mobile-first gebouwd, zodat boeken vanaf de telefoon in {city} net zo makkelijk gaat als vanaf de computer.',
      },
    ],
    bottomCtaTitleTemplate: 'Klaar voor een website die de stoelen van uw {industrySingular} in {city} gevuld houdt?',
    bottomCtaTextTemplate:
      'Laat een website bouwen die boekingen vereenvoudigt en uw stijl laat zien. Vraag vrijblijvend advies aan, we denken graag mee over uw {industrySingular} in {city}.',
    metaDescriptionTemplates: [
      'Website voor {industryPluralLower} in {city} laten maken? Star Local bouwt snelle, stijlvolle websites met online boeken, portfolio en heldere prijzen.',
      'Laat een website voor {industryPluralLower} in {city} maken met een boekingsmodule, portfolio en Google Reviews. Star Local bouwt stijlvolle sites voor u.',
      'Meer boekingen voor {industryPluralLower} in {city}: Star Local bouwt snelle, stijlvolle websites met portfolio, prijzen en een online boekingsagenda.',
      'Website laten maken voor {industryPluralLower} in {city}? Star Local zorgt voor online boeken, een stijlvolle portfolio en sterke lokale vindbaarheid.',
    ],
    relatedIndustryDescriptionTemplate:
      'Ook voor {industryPluralLower} in {city} bouwen we stijlvolle websites die boekingen en klantloyaliteit verhogen.',
  },
  {
    slug: 'makelaars',
    name: 'Makelaars',
    nameSingular: 'makelaar',
    namePluralLower: 'makelaars',
    relatedSlugs: ['schilders', 'loodgieters', 'autobedrijven'],
    websiteRequirements: [
      'Actuele koppeling met woningaanbod',
      'Gratis waarderingsformulier voor verkopers',
      'Wijkinformatie en lokale expertise',
      "Foto's, video's of 360°-tours van woningen",
      'Klantreviews en verkoopresultaten',
      'Duidelijke contactroutes per doelgroep',
      'Snelle laadtijd voor woningaanbod op mobiel',
      'Technische SEO-basis voor wijk- en woningtype-zoekopdrachten',
    ],
    features: [
      'Koppeling met woningaanbod en zoekfilters',
      'Waarderingsformulier met directe opvolging',
      "Wijkpagina's met lokale informatie",
      'Foto- en videopresentatie van woningen',
      'Klantreviews en referenties',
      'Contactformulieren per dienst: koop, verkoop en taxatie',
      'Blog of nieuwspagina over de woningmarkt',
    ],
    benefits: [
      {
        icon: 'design',
        title: 'Professionele, betrouwbare uitstraling',
        descriptionTemplate:
          'Een website die de kwaliteit van uw {industrySingular} weerspiegelt en vertrouwen wekt bij kopers en verkopers in {city}.',
      },
      {
        icon: 'seo',
        title: 'Vindbaar per wijk en woningtype',
        descriptionTemplate:
          "Technische SEO-structuur zodat uw {industrySingular} verschijnt bij zoekopdrachten als 'huis verkopen {city}'.",
      },
      {
        icon: 'mobile',
        title: 'Woningaanbod altijd bij de hand',
        descriptionTemplate:
          'Woningzoekers bekijken het aanbod van uw {industrySingular} net zo makkelijk op de telefoon als op de laptop.',
      },
      {
        icon: 'speed',
        title: 'Snel laden bij veel aanbod',
        descriptionTemplate: 'Ook met een uitgebreid woningaanbod blijft de website van uw {industrySingular} razendsnel.',
      },
      {
        icon: 'communication',
        title: 'Heldere leadopvolging',
        descriptionTemplate:
          'Waarderingsaanvragen en contactformulieren van uw {industrySingular} komen gestructureerd bij u binnen.',
      },
      {
        icon: 'custom',
        title: 'Op maat voor uw kantoor',
        descriptionTemplate:
          'Geen generiek makelaarsjabloon, maar een website die het specialisme van uw {industrySingular} in {city} uitdrukt.',
      },
      {
        icon: 'growth',
        title: 'Meegroeien met uw kantoor',
        descriptionTemplate:
          'Voeg eenvoudig nieuwe diensten toe aan uw {industrySingular}, zoals taxaties, verhuur of bedrijfsmakelaardij in {city}.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Kennismaking & positionering',
        descriptionTemplate: 'We bespreken uw specialisatie, doelgroep en concurrentie op de woningmarkt in {city}.',
      },
      {
        number: '02',
        title: 'Structuur & content',
        descriptionTemplate:
          'We bepalen de paginastructuur voor kopers, verkopers en taxaties, en adviseren over content en beeldmateriaal.',
      },
      {
        number: '03',
        title: 'Bouw & koppelingen',
        descriptionTemplate: 'Ontwikkeling in Astro met koppeling naar woningaanbod en een technische SEO-basis voor {city}.',
      },
      {
        number: '04',
        title: 'Test & livegang',
        descriptionTemplate: 'Controle op snelheid, mobiele weergave en formulieren, daarna live voor kopers en verkopers in {city}.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate: "Optimaliseren op basis van leads, en uitbreiden met nieuwe diensten of wijkpagina's in {city}.",
      },
    ],
    whyImportantParagraphs: [
      'Verkopers kiezen een {industrySingular} deels op basis van online uitstraling: hoe presenteert u woningen, en straalt uw website professionaliteit en lokale kennis van {city} uit?',
      'Kopers zoeken snel en specifiek, op wijk, prijsklasse of woningtype, bijvoorbeeld rond {district}. Een trage of onduidelijke site kost u bezichtigingsaanvragen aan concurrerende kantoren in {city}.',
      'In {province} verwachten kopers en verkopers een snelle, heldere website. Een sterke website met duidelijke waarderingsformulieren verhoogt het aantal serieuze aanvragen in {city}.',
    ],
    challengesParagraphs: [
      'Veel makelaarswebsites tonen woningaanbod via een verouderde koppeling die traag laadt of niet goed werkt op mobiel, terwijl juist woningzoekers vaak onderweg zoeken.',
      'Ook missen sites vaak een duidelijk waarderingsformulier voor verkopers, of ontbreekt lokale expertise en kennis van wijken in {city} op de pagina\'s.',
      'Verder zien we websites zonder heldere differentiatie: geen duidelijk verhaal waarom een verkoper in {city} voor dit kantoor zou kiezen boven een andere makelaar in de regio.',
    ],
    requirementsIntro:
      'Een makelaarswebsite moet kopers en verkopers in {city} apart bedienen, met heldere paden naar woningaanbod, waardering en contact.',
    localIntroParagraphs: [
      'De woningmarkt in {city} is dynamisch: van karakteristieke woningen rond {district} tot nieuwbouw nabij {district2}. Kopers en verkopers vergelijken makelaars eerst online voordat ze contact opnemen.',
      'Star Local bouwt websites die uw aanbod, expertise en lokale kennis van {city} overtuigend presenteren, met een heldere structuur voor kopers, verkopers en taxatieaanvragen.',
      'Of u zich richt op starters rond {district}, gezinswoningen nabij {district2} of bedrijfsvastgoed elders in {city}, uw website moet vertrouwen wekken en leads genereren.',
    ],
    heroIntroTemplates: [
      'Woningzoekers en verkopers vormen binnen seconden een eerste indruk van uw makelaarskantoor online. Star Local bouwt websites voor makelaars in {city} met woningaanbod, waarderingsformulieren en een professionele uitstraling. Zo wint u het vertrouwen van kopers en verkopers in een competitieve woningmarkt.',
      'Een makelaarskantoor verdient een website die vertrouwen wekt vanaf de eerste klik. Star Local bouwt professionele websites voor makelaars in {city} met actueel woningaanbod en een helder waarderingsformulier. Zo genereert u meer serieuze leads.',
      'In {city} vergelijken kopers en verkopers makelaars eerst online, voordat ze bellen of langskomen. Star Local bouwt websites die uw expertise en aanbod overtuigend presenteren. Zo blijft u de eerste keuze in een competitieve markt.',
    ],
    faqTemplates: [
      {
        questionTemplate: 'Kunnen jullie het woningaanbod van mijn {industrySingular} koppelen aan de website?',
        answerTemplate:
          'Ja, we koppelen uw website met uw bestaande aanbodsysteem, zodat woningen automatisch en actueel worden weergegeven.',
      },
      {
        questionTemplate: 'Kan ik een waarderingsformulier toevoegen?',
        answerTemplate: 'Zeker, we bouwen een duidelijk waarderingsformulier waarmee verkopers in {city} eenvoudig een aanvraag indienen.',
      },
      {
        questionTemplate: 'Word ik gevonden als mensen in {city} zoeken op een specifieke wijk?',
        answerTemplate:
          "Ja, we optimaliseren de website technisch voor wijkgerichte zoekopdrachten zoals 'huis verkopen {city}'.",
      },
      {
        questionTemplate: "Kan de website ook video's of 360°-tours tonen?",
        answerTemplate: 'Ja, we integreren video- en tourweergave zodat woningen optimaal gepresenteerd worden.',
      },
      {
        questionTemplate: 'Kan ik zelf content of woningen aanpassen?',
        answerTemplate: 'Ja, u kunt eenvoudig teksten, aanbod en nieuwsberichten zelf beheren zonder technische kennis.',
      },
      {
        questionTemplate: 'Kan mijn website ook bedrijfsmakelaardij of verhuur bevatten?',
        answerTemplate:
          'Ja, we bouwen een schaalbare structuur waarin u eenvoudig aparte pagina\'s toevoegt voor verhuur, taxaties of bedrijfsmakelaardij in {city}.',
      },
    ],
    bottomCtaTitleTemplate: 'Klaar voor een website die kopers en verkopers in {city} overtuigt?',
    bottomCtaTextTemplate:
      'Laat een website bouwen die kopers en verkopers overtuigt en leads genereert. Vraag vrijblijvend advies aan, we denken graag mee over uw {industrySingular} in {city}.',
    metaDescriptionTemplates: [
      'Website voor {industryPluralLower} in {city} laten maken? Star Local bouwt professionele websites met actueel woningaanbod en waarderingsformulier.',
      'Laat een website voor {industryPluralLower} in {city} maken met actueel woningaanbod, waardering en lokale marktexpertise. Star Local helpt u verder.',
      'Meer leads voor {industryPluralLower} in {city}: Star Local bouwt professionele websites met woningaanbod en heldere contactroutes voor kopers en verkopers.',
      'Website laten maken voor {industryPluralLower} in {city}? Star Local zorgt voor woningaanbod, een waarderingsformulier en sterke lokale vindbaarheid.',
    ],
    relatedIndustryDescriptionTemplate:
      'Ook voor {industryPluralLower} in {city} bouwen we professionele websites die vertrouwen wekken en leads opleveren.',
  },
  {
    slug: 'loodgieters',
    name: 'Loodgieters',
    nameSingular: 'loodgieter',
    namePluralLower: 'loodgieters',
    relatedSlugs: ['schilders', 'makelaars', 'autobedrijven'],
    websiteRequirements: [
      'Telefoonnummer direct zichtbaar, ook op mobiel',
      'Duidelijke dienstenlijst voor lekkage, ontstopping, cv en sanitair',
      'Zichtbare spoedservice of 24/7-bereikbaarheid',
      'Werkgebied met duidelijke regio-afbakening',
      'Reviews en voorbeelden van eerdere klussen',
      'Snelle laadtijd, ook onder tijdsdruk bij spoedgevallen',
      'Contactformulier voor niet-spoedeisende aanvragen',
      'Duidelijke uitleg over prijsopbouw of voorrijkosten',
    ],
    features: [
      'Prominente click-to-call knop',
      'Dienstenoverzicht met duidelijke iconen',
      'Werkgebiedkaart met omliggende gemeenten',
      'Spoedservice-banner of 24/7-melding',
      'WhatsApp-knop voor snelle contactopname',
      'Reviews- en referentiesectie',
      'Fotogalerij van uitgevoerde klussen',
    ],
    benefits: [
      {
        icon: 'speed',
        title: 'Razendsnel geladen',
        descriptionTemplate:
          'Bij spoedklussen voor uw {industrySingular} telt elke seconde. Uw site laadt direct, ook op een mobiel netwerk in {city}.',
      },
      {
        icon: 'mobile',
        title: 'Direct bellen vanaf mobiel',
        descriptionTemplate:
          'Een klikbaar telefoonnummer boven aan elke pagina, zodat bellen naar uw {industrySingular} nooit een zoekactie wordt.',
      },
      {
        icon: 'communication',
        title: 'Vertrouwen door duidelijkheid',
        descriptionTemplate:
          'Heldere dienstenlijst en werkgebied, zodat klanten in {city} direct weten of uw {industrySingular} kan helpen.',
      },
      {
        icon: 'seo',
        title: 'Vindbaar bij spoedzoekopdrachten',
        descriptionTemplate: "Technische SEO-basis voor zoektermen als '{industrySingular} {city} spoed'.",
      },
      {
        icon: 'design',
        title: 'Professionele, betrouwbare uitstraling',
        descriptionTemplate:
          'Een strakke website die het vakmanschap van uw {industrySingular} uitstraalt, ook als u geen tijd heeft voor marketing.',
      },
      {
        icon: 'custom',
        title: 'Op maat voor uw diensten',
        descriptionTemplate:
          'Geen generiek sjabloon, maar een structuur die de specialismen en spoedservice van uw {industrySingular} centraal zet.',
      },
      {
        icon: 'growth',
        title: 'Ruimte om te groeien',
        descriptionTemplate: 'Voeg eenvoudig nieuwe diensten of een tweede werkgebied toe wanneer uw {industrySingular} in {city} groeit.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Kennismaking & werkgebied',
        descriptionTemplate: 'We bespreken uw diensten, spoedservice en werkgebied rond {city}.',
      },
      {
        number: '02',
        title: 'Structuur & prioriteiten',
        descriptionTemplate: 'We bepalen welke informatie het snelst zichtbaar moet zijn: telefoonnummer, diensten en werkgebied.',
      },
      {
        number: '03',
        title: 'Bouw & optimalisatie',
        descriptionTemplate: 'Ontwikkeling in Astro met focus op snelheid en een technische SEO-basis voor spoedzoekopdrachten in {city}.',
      },
      {
        number: '04',
        title: 'Test & livegang',
        descriptionTemplate: 'Controle op laadtijd, mobiele weergave en belknoppen, daarna live voor klanten in {city}.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate: 'Optimaliseren op basis van belgedrag, en uitbreiden met nieuwe diensten of werkgebieden rond {city}.',
      },
    ],
    whyImportantParagraphs: [
      'Bij klussen voor uw {industrySingular} is snelheid cruciaal: klanten met een lekkage in {city} zoeken direct via mobiel en bellen vaak het eerste bedrijf dat vertrouwen wekt en bereikbaar lijkt.',
      'Een onduidelijke website, zonder telefoonnummer bovenaan of zonder duidelijke dienstenlijst, kost u spoedklussen aan concurrenten in {city} die wel snel te bereiken zijn, ook rond {district}.',
      'Reviews, werkgebied en duidelijke prijsindicaties bouwen vertrouwen op bij klanten in {province} die voor het eerst met uw {industrySingular} werken.',
    ],
    challengesParagraphs: [
      'Veel loodgieterswebsites zijn traag, niet mobielvriendelijk of missen een duidelijk telefoonnummer op een prominente plek, een groot probleem bij spoedklussen.',
      'Ook ontbreekt vaak een overzicht van het werkgebied, waardoor klanten in {city} niet zeker weten of het bedrijf wel bij hen langskomt.',
      'Verder zien we sites zonder duidelijke dienstenlijst voor lekkage, ontstopping of cv-onderhoud, waardoor klanten in {city} twijfelen of het bedrijf de juiste specialist is.',
    ],
    requirementsIntro:
      'Een loodgieterswebsite moet binnen enkele seconden duidelijk maken wat u doet, of u spoedservice biedt en hoe iemand u in {city} het snelst bereikt.',
    localIntroParagraphs: [
      'Van oude leidingen rond {district} tot nieuwbouwinstallaties nabij {district2}, loodgieters in {city} werken in uiteenlopende situaties, vaak met spoed.',
      'Star Local bouwt websites die direct laten zien welke diensten u levert, of u spoedservice biedt en hoe snel iemand u kan bereiken.',
      'Of het gaat om een particuliere lekkage rond {district} of onderhoud voor een VvE nabij {district2}, uw website moet vertrouwen wekken en snel tot een telefoontje leiden in {city}.',
    ],
    heroIntroTemplates: [
      'Bij een lekkage of verstopping zoeken klanten direct en onder tijdsdruk naar een loodgieter bij hen in de buurt. Star Local bouwt snelle, duidelijke websites voor loodgieters in {city} met zichtbare spoedservice en eenvoudige contactroutes. Zo bent u de eerste die gebeld wordt, ook buiten kantoortijden.',
      'Bij loodgietersklussen telt elke minuut. Star Local bouwt razendsnelle websites voor loodgieters in {city} met een prominent telefoonnummer en duidelijk dienstenoverzicht. Zo kiezen klanten direct voor u, niet voor de concurrent.',
      'Klanten in {city} met een spoedklus zoeken en bellen razendsnel. Star Local bouwt websites voor loodgieters die vertrouwen wekken en direct tot een telefoontje leiden. Zo blijft uw telefoon rinkelen, ook buiten kantoortijden.',
    ],
    faqTemplates: [
      {
        questionTemplate: 'Kan ik spoedservice duidelijk op de website van mijn {industrySingular} laten zien?',
        answerTemplate:
          'Ja, we plaatsen uw spoedservice of 24/7-bereikbaarheid prominent, zodat klanten in {city} direct zien dat u snel kunt helpen.',
      },
      {
        questionTemplate: 'Is mijn telefoonnummer overal klikbaar op mobiel?',
        answerTemplate: 'Ja, we bouwen de website mobile-first met een klikbaar telefoonnummer op elke pagina.',
      },
      {
        questionTemplate: 'Kan ik mijn werkgebied rond {city} duidelijk aangeven?',
        answerTemplate:
          'Zeker, we voegen een werkgebiedoverzicht toe met {city} en omliggende gemeenten, zodat klanten weten of u langskomt.',
      },
      {
        questionTemplate: 'Word ik gevonden bij spoedzoekopdrachten in {city}?',
        answerTemplate: "Ja, we optimaliseren technisch voor zoektermen zoals '{industrySingular} {city} spoed'.",
      },
      {
        questionTemplate: 'Kan ik foto\'s van eerdere klussen tonen?',
        answerTemplate: 'Ja, we bouwen een fotogalerij waarin u eerdere klussen en resultaten kunt laten zien.',
      },
      {
        questionTemplate: 'Kan de website ook offertes verwerken voor grotere klussen?',
        answerTemplate:
          'Ja, naast de spoedfunctionaliteit voegen we een contactformulier toe specifiek voor offerteaanvragen van grotere projecten in {city}.',
      },
    ],
    bottomCtaTitleTemplate: 'Klaar voor een website die spoedklanten in {city} direct naar uw {industrySingular} leidt?',
    bottomCtaTextTemplate:
      'Laat een website bouwen die spoedklanten direct naar u leidt. Vraag vrijblijvend advies aan, we denken graag mee over uw {industrySingular} in {city}.',
    metaDescriptionTemplates: [
      'Website voor {industryPluralLower} in {city} laten maken? Star Local bouwt razendsnelle websites met zichtbare spoedservice en heldere contactroutes.',
      'Laat een website voor {industryPluralLower} in {city} maken met spoedservice, werkgebied en een prominent klikbaar telefoonnummer. Star Local helpt verder.',
      'Meer spoedklanten voor {industryPluralLower} in {city}: Star Local bouwt razendsnelle websites met heldere contactroutes en een dienstenoverzicht.',
      'Website laten maken voor {industryPluralLower} in {city}? Star Local zorgt voor spoedservice, werkgebied en sterke lokale online vindbaarheid voor u.',
    ],
    relatedIndustryDescriptionTemplate:
      'Ook voor {industryPluralLower} in {city} bouwen we snelle websites met duidelijke contactroutes en meer aanvragen.',
  },
  {
    slug: 'schilders',
    name: 'Schilders',
    nameSingular: 'schilder',
    namePluralLower: 'schilders',
    relatedSlugs: ['loodgieters', 'makelaars', 'autobedrijven'],
    websiteRequirements: [
      'Voor- en na-foto\'s van eerdere projecten',
      'Duidelijk dienstenoverzicht: binnen, buiten, houtrot en VvE',
      'Eenvoudig offerteformulier met foto-upload',
      'Werkgebied met duidelijke regio-afbakening',
      'Reviews en referenties van eerdere klanten',
      'Informatie over garantie en verfmerken',
      'Snelle laadtijd en mobielvriendelijke weergave',
      'Duidelijke contactgegevens en reactietijd',
    ],
    features: [
      'Voor- en na-fotogalerij per project',
      'Offerteformulier met foto-upload',
      'Dienstenoverzicht per type schilderwerk',
      'Werkgebiedkaart met omliggende gemeenten',
      'Reviews- en referentiesectie',
      'Informatiepagina over garantie en materialen',
      'Contactformulier voor VvE- en zakelijke aanvragen',
    ],
    benefits: [
      {
        icon: 'design',
        title: 'Portfolio dat vakmanschap toont',
        descriptionTemplate:
          'Voor- en na-foto\'s die de kwaliteit van het werk van uw {industrySingular} in {city} overtuigend presenteren.',
      },
      {
        icon: 'seo',
        title: 'Vindbaar in {city} en omstreken',
        descriptionTemplate: "Technische SEO-basis voor zoektermen als 'buitenschilderwerk {city}'.",
      },
      {
        icon: 'mobile',
        title: 'Offerte aanvragen vanaf elk apparaat',
        descriptionTemplate:
          'Klanten uploaden eenvoudig foto\'s van hun project vanaf hun telefoon voor een snelle offerte van uw {industrySingular}.',
      },
      {
        icon: 'speed',
        title: 'Snel geladen portfolio',
        descriptionTemplate: 'Ook met veel foto\'s blijft de website van uw {industrySingular} snel en soepel laden.',
      },
      {
        icon: 'communication',
        title: 'Heldere offerteopvolging',
        descriptionTemplate: 'Aanvragen voor uw {industrySingular} komen gestructureerd binnen, met alle benodigde projectinformatie.',
      },
      {
        icon: 'custom',
        title: 'Op maat voor uw specialisme',
        descriptionTemplate:
          'Een website die de focus van uw {industrySingular} op particulier, zakelijk of VvE-werk duidelijk naar voren brengt.',
      },
      {
        icon: 'growth',
        title: 'Meegroeien met uw bedrijf',
        descriptionTemplate: 'Voeg eenvoudig nieuwe diensten of werkgebieden toe wanneer het team van uw {industrySingular} in {city} groeit.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Kennismaking & specialisatie',
        descriptionTemplate: 'We bespreken uw diensten, doelgroep en concurrentie in {city}.',
      },
      {
        number: '02',
        title: 'Structuur & portfolio',
        descriptionTemplate: 'We bepalen de paginastructuur en adviseren over de presentatie van voor- en na-foto\'s.',
      },
      {
        number: '03',
        title: 'Bouw & offerteflow',
        descriptionTemplate: 'Ontwikkeling in Astro met een eenvoudig offerteformulier en een technische SEO-basis voor {city}.',
      },
      {
        number: '04',
        title: 'Test & livegang',
        descriptionTemplate: 'Controle op snelheid, mobiele weergave en het offerteproces, daarna live voor klanten in {city}.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate: 'Optimaliseren op basis van offerteaanvragen, en uitbreiden met nieuwe diensten of projecten in {city}.',
      },
    ],
    whyImportantParagraphs: [
      'Klanten vergelijken schilders op basis van eerder werk, reviews en reactiesnelheid. Een website zonder voorbeeldfoto\'s of duidelijke offerteroute verliest klussen aan concurrenten in {city}.',
      'Een professionele website bouwt vertrouwen op, vooral bij grotere projecten rond {district} waarbij klanten zeker willen weten dat het werk vakkundig wordt uitgevoerd.',
      'Zonder duidelijke online aanwezigheid blijft uw {industrySingular} afhankelijk van mond-tot-mondreclame, terwijl steeds meer klanten in {province} eerst online zoeken en vergelijken.',
    ],
    challengesParagraphs: [
      'Veel schilderswebsites tonen geen of weinig voorbeeldfoto\'s van eerder werk, waardoor klanten geen goed beeld krijgen van kwaliteit en stijl.',
      'Ook ontbreekt vaak een duidelijk offerteformulier, waardoor klanten in {city} moeten bellen of mailen zonder te weten welke informatie ze moeten aanleveren.',
      'Verder zijn veel sites niet ingericht op zowel particuliere klanten als zakelijke klanten en VvE\'s in {city}, terwijl de aanpak en communicatie kunnen verschillen.',
    ],
    requirementsIntro:
      'Een schilderswebsite moet het vakmanschap van uw {industrySingular} tonen en het aanvragen van een offerte in {city} zo eenvoudig mogelijk maken.',
    localIntroParagraphs: [
      'Van monumentale panden rond {district} tot nieuwbouwwoningen nabij {district2}, schilders in {city} werken aan uiteenlopende projecten, binnen en buiten.',
      'Star Local bouwt websites die uw vakmanschap tonen via een sterk voorbeeldportfolio, duidelijke diensten en een eenvoudig offerteformulier.',
      'Of u nu gespecialiseerd bent in buitenschilderwerk rond {district} of renovatieprojecten nabij {district2}, uw website moet potentiële klanten in {city} overtuigen vóór het eerste contact.',
    ],
    heroIntroTemplates: [
      'Klanten die hun woning of pand willen laten schilderen, vergelijken eerst voorbeelden en prijzen online. Star Local bouwt websites voor schilders in {city} met een sterk voorbeeldportfolio en helder offerteproces. Zo wint u meer klussen zonder alleen op prijs te concurreren.',
      'Een schildersbedrijf verdient een website die vakmanschap direct laat zien. Star Local bouwt overtuigende websites voor schilders in {city} met voor- en na-foto\'s en een eenvoudig offerteformulier. Zo kiezen klanten voor kwaliteit, niet alleen voor prijs.',
      'In {city} vergelijken klanten schilders op basis van eerder werk en reactiesnelheid. Star Local bouwt websites die uw portfolio overtuigend presenteren en offerteaanvragen vereenvoudigen. Zo wint u meer klussen in uw regio.',
    ],
    faqTemplates: [
      {
        questionTemplate: 'Kan ik voor- en na-foto\'s van projecten van mijn {industrySingular} tonen?',
        answerTemplate:
          'Ja, we bouwen een fotogalerij specifiek voor voor- en na-beelden, zodat klanten in {city} direct de kwaliteit van uw werk zien.',
      },
      {
        questionTemplate: 'Kunnen klanten foto\'s uploaden bij een offerteaanvraag?',
        answerTemplate:
          'Ja, het offerteformulier bevat een optie om foto\'s van het project te uploaden, zodat u sneller een goede inschatting kunt maken.',
      },
      {
        questionTemplate: 'Werken jullie ook voor VvE\'s of zakelijke klanten?',
        answerTemplate: 'Zeker, we richten de website in op zowel particuliere als zakelijke doelgroepen, met apart aandacht voor VvE-aanvragen.',
      },
      {
        questionTemplate: 'Word ik gevonden bij zoekopdrachten in specifieke wijken van {city}?',
        answerTemplate: "Ja, we optimaliseren technisch voor zoektermen zoals 'buitenschilderwerk {city}'.",
      },
      {
        questionTemplate: 'Kan ik informatie over garantie en verfmerken toevoegen?',
        answerTemplate: 'Ja, we voegen een pagina toe waarin u garantievoorwaarden en gebruikte materialen kunt toelichten.',
      },
      {
        questionTemplate: 'Kan de website meegroeien als mijn team groter wordt?',
        answerTemplate:
          'Ja, de structuur is schaalbaar, zodat u eenvoudig nieuwe diensten, medewerkers of werkgebieden rond {city} kunt toevoegen.',
      },
    ],
    bottomCtaTitleTemplate: 'Klaar voor een website die het werk van uw {industrySingular} in {city} laat zien?',
    bottomCtaTextTemplate:
      'Laat een website bouwen die uw vakmanschap toont en offerteaanvragen verhoogt. Vraag vrijblijvend advies aan, we denken graag mee over uw {industrySingular} in {city}.',
    metaDescriptionTemplates: [
      'Website voor {industryPluralLower} in {city} laten maken? Star Local bouwt websites met een sterk voorbeeldportfolio en offerteformulier op maat.',
      'Laat een website voor {industryPluralLower} in {city} maken met voor- en na-foto\'s en een eenvoudig offerteformulier. Star Local bouwt overtuigende sites.',
      'Meer offerteaanvragen voor {industryPluralLower} in {city}: Star Local bouwt websites met een sterk portfolio en een heldere offerteflow voor klanten.',
      'Website laten maken voor {industryPluralLower} in {city}? Star Local zorgt voor een portfolio, offertes en sterke lokale online vindbaarheid voor u.',
    ],
    relatedIndustryDescriptionTemplate:
      'Ook voor {industryPluralLower} in {city} bouwen we overtuigende websites met portfolio en meer offerteaanvragen.',
  },
  {
    slug: 'tandartsen',
    name: 'Tandartsen',
    nameSingular: 'tandarts',
    namePluralLower: 'tandartsen',
    relatedSlugs: ['kappers', 'sportscholen', 'restaurants'],
    websiteRequirements: [
      'Duidelijke aanmeldprocedure voor nieuwe patiënten',
      'Online afsprakenoverzicht of contactformulier',
      'Praktijkinformatie over team, sfeer en faciliteiten',
      'Openingstijden en spreekuren',
      'Informatie over bereikbaarheid en parkeren',
      'Verwijzing bij spoedgevallen buiten kantoortijden',
      'Praktische informatie over verzekering en vergoedingen',
      'Snelle, toegankelijke en mobielvriendelijke weergave',
    ],
    features: [
      'Contactformulier voor nieuwe patiënten',
      'Teampagina met korte introductie per behandelaar',
      'Overzicht van openingstijden en spreekuren',
      'Informatiepagina over aanmelden en verzekering',
      'Routebeschrijving en parkeerinformatie',
      'Praktijkfoto\'s voor een geruststellende eerste indruk',
      'Duidelijke verwijzing bij spoed buiten kantoortijden',
    ],
    benefits: [
      {
        icon: 'design',
        title: 'Rustige, professionele uitstraling',
        descriptionTemplate: 'Een website die geruststelt en de sfeer van uw {industrySingular} in {city} goed weergeeft.',
      },
      {
        icon: 'communication',
        title: 'Duidelijke aanmeldprocedure',
        descriptionTemplate: 'Nieuwe patiënten van uw {industrySingular} weten direct hoe ze zich kunnen inschrijven, zonder onduidelijkheid.',
      },
      {
        icon: 'mobile',
        title: 'Praktijkinformatie altijd bij de hand',
        descriptionTemplate:
          'Openingstijden, adres en contactgegevens van uw {industrySingular} zijn direct te vinden, ook onderweg in {city}.',
      },
      {
        icon: 'seo',
        title: 'Vindbaar in {city}',
        descriptionTemplate: "Technische SEO-basis voor zoektermen als '{industrySingular} {city} nieuwe patiënten'.",
      },
      {
        icon: 'speed',
        title: 'Snel en toegankelijk',
        descriptionTemplate: 'Een website die snel laadt, ook voor bezoekers van uw {industrySingular} met een minder snelle verbinding.',
      },
      {
        icon: 'custom',
        title: 'Op maat voor uw praktijk',
        descriptionTemplate:
          'Geen generiek praktijksjabloon, maar een website die past bij de uitstraling en werkwijze van uw {industrySingular} in {city}.',
      },
      {
        icon: 'growth',
        title: 'Ruimte voor uitbreiding',
        descriptionTemplate: 'Voeg eenvoudig nieuwe teamleden of praktijkinformatie toe aan uw {industrySingular}.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Kennismaking & praktijkinformatie',
        descriptionTemplate: 'We bespreken uw praktijk, team en de informatie die nieuwe patiënten in {city} nodig hebben.',
      },
      {
        number: '02',
        title: 'Structuur & content',
        descriptionTemplate: 'We bepalen de paginastructuur, van aanmelden tot praktische informatie, en adviseren over content.',
      },
      {
        number: '03',
        title: 'Bouw & aanmeldproces',
        descriptionTemplate: 'Ontwikkeling in Astro met een duidelijk aanmeldproces en een technische SEO-basis voor {city}.',
      },
      {
        number: '04',
        title: 'Test & livegang',
        descriptionTemplate: 'Controle op snelheid, mobiele weergave en het contactformulier, daarna live voor patiënten in {city}.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate: 'Optimaliseren en uitbreiden met nieuwe teamleden of praktijkinformatie in {city}.',
      },
    ],
    whyImportantParagraphs: [
      'Mensen die op zoek zijn naar een nieuwe {industrySingular} in {city} vergelijken praktijken online: is er ruimte voor nieuwe patiënten, hoe ziet de praktijk eruit, en hoe verloopt een afspraak maken, ook rond {district}?',
      'Een heldere, professionele website verlaagt de drempel om over te stappen naar een nieuwe praktijk en maakt duidelijk wat mensen kunnen verwachten qua sfeer en praktische zaken in {city}.',
      'Praktijken in {province} met een verouderde of onduidelijke website lopen aanmeldingen mis aan praktijken die wel duidelijk communiceren over beschikbaarheid en de aanmeldprocedure.',
    ],
    challengesParagraphs: [
      'Veel tandartswebsites zijn verouderd, laden traag en missen duidelijke informatie over of de praktijk nieuwe patiënten aanneemt.',
      'Ook ontbreekt vaak praktische informatie zoals parkeergelegenheid, openingstijden, spreekuren en de te volgen stappen bij spoedgevallen buiten kantoortijden in {city}.',
      'Verder zien we sites zonder duidelijke aanmeldprocedure, waardoor potentiële patiënten in {city} niet weten hoe ze zich kunnen inschrijven bij de praktijk.',
    ],
    requirementsIntro:
      'Een tandartswebsite moet duidelijk, geruststellend en praktisch zijn: patiënten in {city} willen snel weten of ze welkom zijn en hoe ze een afspraak maken.',
    localIntroParagraphs: [
      '{city} heeft meerdere tandartspraktijken, van kleine praktijken rond {district} tot grotere klinieken nabij {district2}. Patiënten kiezen vaak op basis van bereikbaarheid, sfeer en of de praktijk nieuwe patiënten aanneemt.',
      'Star Local bouwt websites die uw praktijk toegankelijk en professioneel presenteren, met heldere informatie over het team, de praktijk en hoe iemand zich kan aanmelden.',
      'Of uw praktijk rond {district}, nabij {district2} of elders in {city} staat, uw website moet potentiële patiënten geruststellen en het aanmeldproces eenvoudig maken.',
    ],
    heroIntroTemplates: [
      'Patiënten zoeken online naar een tandartspraktijk die nieuwe patiënten aanneemt, praktisch bereikbaar is en een prettige eerste indruk geeft. Star Local bouwt websites voor tandartspraktijken in {city} met online afspraken maken en heldere praktijkinformatie. Zo maakt u het patiënten eenvoudig om voor uw praktijk te kiezen.',
      'Een tandartspraktijk verdient een website die geruststelt en snel duidelijkheid geeft. Star Local bouwt toegankelijke websites voor tandartspraktijken in {city} met heldere aanmeldprocedure en praktijkinformatie. Zo verlaagt u de drempel voor nieuwe patiënten.',
      'In {city} kiezen patiënten hun tandarts vaak op basis van bereikbaarheid en sfeer. Star Local bouwt websites die uw praktijk professioneel en toegankelijk presenteren. Zo maakt u aanmelden eenvoudig voor iedereen.',
    ],
    faqTemplates: [
      {
        questionTemplate: 'Kan ik duidelijk aangeven dat mijn {industrySingular} nieuwe patiënten aanneemt?',
        answerTemplate: 'Ja, we plaatsen dit prominent op de homepage, zodat potentiële patiënten in {city} dit direct zien.',
      },
      {
        questionTemplate: 'Kunnen patiënten via de website een afspraak aanvragen?',
        answerTemplate: 'Ja, we bouwen een contactformulier of koppelen uw bestaande afsprakensysteem, zodat aanmelden eenvoudig verloopt.',
      },
      {
        questionTemplate: 'Kan ik informatie over mijn team toevoegen?',
        answerTemplate:
          'Zeker, we maken een teampagina met een korte introductie per behandelaar, zodat patiënten weten wie hen gaat helpen.',
      },
      {
        questionTemplate: 'Word ik gevonden als mensen in {city} zoeken naar een tandarts in mijn wijk?',
        answerTemplate: "Ja, we optimaliseren technisch voor zoektermen zoals '{industrySingular} {city}'.",
      },
      {
        questionTemplate: 'Kan ik praktische informatie over verzekering en vergoeding toevoegen?',
        answerTemplate: 'Ja, we voegen een informatiepagina toe waarin u algemene praktische zaken rond verzekering kunt toelichten.',
      },
      {
        questionTemplate: 'Is de website ook toegankelijk voor oudere patiënten?',
        answerTemplate:
          'Ja, we houden rekening met leesbaarheid, contrast en eenvoudige navigatie, zodat de website voor alle leeftijden in {city} prettig te gebruiken is.',
      },
    ],
    bottomCtaTitleTemplate: 'Klaar voor een website die nieuwe patiënten in {city} aanspreekt?',
    bottomCtaTextTemplate:
      'Laat een website bouwen die nieuwe patiënten aanspreekt en aanmelden eenvoudig maakt. Vraag vrijblijvend advies aan, we denken graag mee over uw {industrySingular} in {city}.',
    metaDescriptionTemplates: [
      'Website voor {industryPluralLower} in {city} laten maken? Star Local bouwt toegankelijke websites met heldere praktijkinformatie en aanmelden voor u.',
      'Laat een website voor {industryPluralLower} in {city} maken met eenvoudig aanmelden en duidelijke praktijkinformatie. Star Local bouwt praktijkwebsites voor u.',
      'Meer nieuwe patiënten voor {industryPluralLower} in {city}: Star Local bouwt toegankelijke websites met een heldere aanmeldprocedure en praktijkinfo.',
      'Website laten maken voor {industryPluralLower} in {city}? Star Local zorgt voor aanmelden, praktijkinfo en sterke lokale online vindbaarheid voor u.',
    ],
    relatedIndustryDescriptionTemplate:
      'Ook voor {industryPluralLower} in {city} bouwen we toegankelijke websites die nieuwe aanmeldingen vereenvoudigen.',
  },
  {
    slug: 'autobedrijven',
    name: 'Autobedrijven',
    nameSingular: 'autobedrijf',
    namePluralLower: 'autobedrijven',
    relatedSlugs: ['loodgieters', 'schilders', 'sportscholen'],
    websiteRequirements: [
      "Actueel occasion-aanbod met foto's en specificaties",
      'Duidelijk overzicht van werkplaatsdiensten',
      'Online afsprakenmodule voor onderhoud en APK',
      'Transparante prijsindicaties waar mogelijk',
      'Reviews en klantbeoordelingen',
      'Informatie over merken en specialismen',
      "Snelle laadtijd, ook bij veel occasion-foto's",
      'Duidelijke contactgegevens en openingstijden',
    ],
    features: [
      'Occasion-aanbod met filters op merk, type en prijs',
      'Online afsprakenmodule voor onderhoud en APK',
      'Dienstenoverzicht met iconen per specialisme',
      'Reviews- en referentiesectie',
      'Contactformulier voor offerteaanvragen',
      'Informatiepagina over garantie en financiering',
      'Aanvraagformulier voor een proefrit',
    ],
    benefits: [
      {
        icon: 'seo',
        title: 'Vindbaar bij garage- en occasionzoekopdrachten',
        descriptionTemplate: "Technische SEO-basis voor zoektermen als 'garage {city}' of 'occasion kopen {city}'.",
      },
      {
        icon: 'speed',
        title: 'Snel laden met veel foto\'s',
        descriptionTemplate: 'Ook met een uitgebreid occasion-aanbod blijft de website van uw {industrySingular} snel en soepel.',
      },
      {
        icon: 'mobile',
        title: 'Afspraak maken vanaf de telefoon',
        descriptionTemplate:
          'Klanten van uw {industrySingular} plannen onderhoud of APK eenvoudig via mobiel, waar en wanneer het hen uitkomt.',
      },
      {
        icon: 'design',
        title: 'Uitstraling die vertrouwen wekt',
        descriptionTemplate: 'Een professionele website die de kwaliteit van uw {industrySingular} in {city} weerspiegelt.',
      },
      {
        icon: 'communication',
        title: 'Heldere afsprakenopvolging',
        descriptionTemplate: 'Aanvragen voor onderhoud, APK of offertes bij uw {industrySingular} komen gestructureerd binnen.',
      },
      {
        icon: 'custom',
        title: 'Op maat voor uw bedrijf',
        descriptionTemplate:
          'Een website die het specialisme van uw {industrySingular}, zoals onderhoud, verkoop of schadeherstel, duidelijk centraal zet.',
      },
      {
        icon: 'growth',
        title: 'Ruimte om te groeien',
        descriptionTemplate: 'Voeg eenvoudig nieuwe diensten, merken of een tweede vestiging toe aan uw {industrySingular} in {city}.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Kennismaking & aanbod',
        descriptionTemplate: 'We bespreken uw diensten, occasion-aanbod en concurrentie in {city}.',
      },
      {
        number: '02',
        title: 'Structuur & presentatie',
        descriptionTemplate: 'We bepalen de paginastructuur voor werkplaats, verkoop en contact, en adviseren over fotografie.',
      },
      {
        number: '03',
        title: 'Bouw & afsprakensysteem',
        descriptionTemplate: 'Ontwikkeling in Astro met afsprakenfunctionaliteit en een technische SEO-basis voor {city}.',
      },
      {
        number: '04',
        title: 'Test & livegang',
        descriptionTemplate: 'Controle op snelheid, mobiele weergave en het afsprakenproces, daarna live voor klanten in {city}.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate: 'Optimaliseren op basis van afspraken en aanvragen, en uitbreiden met nieuw aanbod of diensten in {city}.',
      },
    ],
    whyImportantParagraphs: [
      "Klanten zoeken online naar 'garage {city}', 'APK laten keuren' of specifieke merken, en kiezen vaak het bedrijf met de duidelijkste website en snelste reactie.",
      'Een professionele website met transparante prijzen, online afspraken en reviews bouwt vertrouwen op, belangrijk in een branche waar klanten in {city} soms terughoudend zijn richting onbekende garages, ook rond {district}.',
      'Zonder actueel occasion-aanbod of duidelijke dienstenlijst mist uw {industrySingular} klanten in {province} die eerst online oriënteren voordat ze naar uw showroom of werkplaats komen.',
    ],
    challengesParagraphs: [
      'Veel websites van autobedrijven tonen een verouderd of traag ladend occasion-aanbod, wat potentiële kopers direct laat afhaken naar een concurrent.',
      'Ook ontbreekt vaak een duidelijk overzicht van werkplaatsdiensten zoals onderhoud, APK, banden en schadeherstel, en de mogelijkheid om online een afspraak te maken in {city}.',
      'Verder missen veel sites reviews en referenties, terwijl vertrouwen cruciaal is bij zowel autoverkoop als onderhoud in {city}.',
    ],
    requirementsIntro:
      "Een website voor een {industrySingular} moet duidelijk maken welke diensten u levert, welke auto's beschikbaar zijn en hoe iemand in {city} snel een afspraak maakt.",
    localIntroParagraphs: [
      'Van onderhoudsgarages rond {district} tot autoverkoop nabij {district2}, autobedrijven in {city} bedienen een brede klantengroep die snel wil kunnen vergelijken en boeken.',
      'Star Local bouwt websites die uw diensten, occasion-aanbod en werkplaatscapaciteit duidelijk presenteren, met een eenvoudige route naar een afspraak of offerte.',
      'Of u nu gespecialiseerd bent in onderhoud, APK, schadeherstel of autoverkoop rond {district2}, uw website moet vertrouwen wekken en klanten in {city} snel laten boeken.',
    ],
    heroIntroTemplates: [
      'Klanten zoeken online naar een garage voor onderhoud, APK of een nieuwe auto, en vergelijken snel op prijs en vertrouwen. Star Local bouwt websites voor autobedrijven in {city} met helder aanbod, online afspraken en een sterke uitstraling. Zo kiest de klant voor uw garage in plaats van de eerste concurrent in het zoekresultaat.',
      'Een autobedrijf verdient een website die vertrouwen wekt en snel tot een afspraak leidt. Star Local bouwt snelle websites voor autobedrijven in {city} met occasion-aanbod en online afsprakenmodule. Zo blijft uw werkplaats en showroom goed gevuld.',
      'In {city} vergelijken klanten garages op prijs, aanbod en reviews voordat ze bellen. Star Local bouwt websites die uw diensten en occasion-aanbod overtuigend presenteren. Zo wint u meer klanten in uw regio.',
    ],
    faqTemplates: [
      {
        questionTemplate: 'Kan ik het occasion-aanbod van mijn {industrySingular} op de website tonen?',
        answerTemplate: 'Ja, we bouwen een overzichtelijk aanbodsysteem met filters op merk, type en prijs, dat u zelf kunt bijhouden.',
      },
      {
        questionTemplate: 'Kunnen klanten online een afspraak maken voor onderhoud?',
        answerTemplate: 'Ja, we integreren een afsprakenmodule waarmee klanten zelf een moment kiezen voor onderhoud, APK of andere diensten.',
      },
      {
        questionTemplate: 'Word ik gevonden bij zoekopdrachten naar garages in {city}?',
        answerTemplate: "Ja, we optimaliseren technisch voor zoektermen zoals 'garage {city}'.",
      },
      {
        questionTemplate: 'Kan ik reviews van klanten tonen?',
        answerTemplate: 'Zeker, we integreren een reviews-widget zodat nieuwe klanten ervaringen van eerdere klanten kunnen zien.',
      },
      {
        questionTemplate: 'Kan de website ook informatie over financiering tonen?',
        answerTemplate: 'Ja, we voegen een pagina toe waarin u algemene informatie over financieringsmogelijkheden kunt delen.',
      },
      {
        questionTemplate: 'Kan mijn website meegroeien met een tweede vestiging in {city}?',
        answerTemplate: 'Ja, de structuur is schaalbaar, zodat u eenvoudig een tweede locatie of extra diensten kunt toevoegen.',
      },
    ],
    bottomCtaTitleTemplate: 'Klaar voor een website die klanten naar uw {industrySingular} in {city} leidt?',
    bottomCtaTextTemplate:
      'Laat een website bouwen die klanten naar uw werkplaats of showroom leidt. Vraag vrijblijvend advies aan, we denken graag mee over uw {industrySingular} in {city}.',
    metaDescriptionTemplates: [
      'Website voor {industryPluralLower} in {city} laten maken? Star Local bouwt snelle websites met occasion-aanbod en een online afsprakenmodule.',
      'Laat een website voor {industryPluralLower} in {city} maken met occasion-aanbod, afspraken en heldere werkplaatsdiensten. Star Local helpt verder.',
      'Meer afspraken voor {industryPluralLower} in {city}: Star Local bouwt snelle websites met occasion-aanbod en overzichtelijke werkplaatsdiensten.',
      'Website laten maken voor {industryPluralLower} in {city}? Star Local zorgt voor occasions, afspraken en sterke lokale online vindbaarheid voor u.',
    ],
    relatedIndustryDescriptionTemplate:
      'Ook voor {industryPluralLower} in {city} bouwen we snelle websites die meer afspraken en aanvragen opleveren.',
  },
  {
    slug: 'sportscholen',
    name: 'Sportscholen',
    nameSingular: 'sportschool',
    namePluralLower: 'sportscholen',
    relatedSlugs: ['kappers', 'restaurants', 'tandartsen'],
    websiteRequirements: [
      'Duidelijk en actueel lesrooster',
      'Overzicht van abonnementsvormen en prijzen',
      'Online aanmelden voor proefles of lidmaatschap',
      "Sfeervolle foto's en video's van de sportschool",
      'Informatie over trainers en specialismen',
      'Reviews en ledenervaringen',
      'Openingstijden en toegangsinformatie',
      'Snelle, mobielvriendelijke weergave',
    ],
    features: [
      'Interactief lesrooster met filters per soort les',
      'Online aanmelden voor proefles of lidmaatschap',
      'Abonnementenoverzicht met prijzen',
      'Trainersprofielen met specialismen',
      "Sfeervolle fotogalerij en video's",
      'Reviews- en ledenervaringensectie',
      'Contactformulier voor bedrijfsfitness of groepslessen',
    ],
    benefits: [
      {
        icon: 'design',
        title: 'Energieke uitstraling',
        descriptionTemplate: 'Een website die de sfeer en energie van uw {industrySingular} in {city} overbrengt, nog voor het eerste bezoek.',
      },
      {
        icon: 'mobile',
        title: 'Aanmelden vanaf de telefoon',
        descriptionTemplate: 'Potentiële leden boeken een proefles of abonnement bij uw {industrySingular} eenvoudig via mobiel.',
      },
      {
        icon: 'seo',
        title: 'Vindbaar in {city}',
        descriptionTemplate: "Technische SEO-basis voor zoektermen als '{industrySingular} {city}'.",
      },
      {
        icon: 'speed',
        title: 'Snel geladen roosteroverzicht',
        descriptionTemplate: 'Het lesrooster en abonnementenoverzicht van uw {industrySingular} laden direct, ook op drukke momenten.',
      },
      {
        icon: 'communication',
        title: 'Heldere aanmeldopvolging',
        descriptionTemplate: 'Aanvragen voor proeflessen en abonnementen bij uw {industrySingular} komen gestructureerd binnen.',
      },
      {
        icon: 'custom',
        title: 'Op maat voor uw concept',
        descriptionTemplate: 'Een website die past bij het type {industrySingular} dat u runt, van fitness tot boxen of crossfit.',
      },
      {
        icon: 'growth',
        title: 'Ruimte om te groeien',
        descriptionTemplate: 'Voeg eenvoudig nieuwe lessen, trainers of een tweede locatie toe aan uw {industrySingular} in {city}.',
      },
    ],
    processSteps: [
      {
        number: '01',
        title: 'Kennismaking & concept',
        descriptionTemplate: 'We bespreken uw type sportschool, doelgroep en concurrentie in {city}.',
      },
      {
        number: '02',
        title: 'Structuur & sfeer',
        descriptionTemplate: 'We bepalen de paginastructuur en adviseren over fotografie die de sfeer van uw sportschool overbrengt.',
      },
      {
        number: '03',
        title: 'Bouw & aanmeldproces',
        descriptionTemplate: 'Ontwikkeling in Astro met online aanmelden voor proeflessen en een technische SEO-basis voor {city}.',
      },
      {
        number: '04',
        title: 'Test & livegang',
        descriptionTemplate: 'Controle op snelheid, mobiele weergave en het aanmeldproces, daarna live voor leden in {city}.',
      },
      {
        number: '05',
        title: 'Doorontwikkeling',
        descriptionTemplate: 'Optimaliseren op basis van aanmeldingen, en uitbreiden met nieuwe lessen of locaties in {city}.',
      },
    ],
    whyImportantParagraphs: [
      "Potentiële leden zoeken online naar '{industrySingular} {city}' of specifieke lessen, en vergelijken sfeer, prijzen en beschikbaarheid voordat ze een keuze maken.",
      'Een energieke, duidelijke website met een zichtbaar lesrooster en eenvoudige aanmeldknop verlaagt de drempel om een eerste proefles te boeken bij uw {industrySingular} rond {district}.',
      'Zonder heldere informatie over abonnementsvormen of met een verouderde uitstraling verliest u potentiële leden in {province} aan sportscholen die wel een sterke online eerste indruk maken.',
    ],
    challengesParagraphs: [
      'Veel websites van sportscholen tonen een verouderd of onduidelijk lesrooster, waardoor potentiële leden niet weten welke lessen er zijn en wanneer.',
      'Ook ontbreekt vaak een simpele manier om een proefles te boeken of een abonnement aan te vragen, waardoor geïnteresseerden in {city} afhaken.',
      'Verder missen veel sites sfeerfoto\'s en reviews, terwijl juist die elementen twijfelaars in {city} over de streep trekken om langs te komen.',
    ],
    requirementsIntro:
      'Een sportschoolwebsite moet de sfeer van uw {industrySingular} overbrengen en het aanmelden voor een proefles of abonnement in {city} zo laagdrempelig mogelijk maken.',
    localIntroParagraphs: [
      '{city} kent een actieve sportcultuur, van fitnessclubs rond {district} tot boxsportscholen of crossfit-boxen nabij {district2}.',
      'Star Local bouwt websites die de energie van uw sportschool overbrengen, met een duidelijk lesrooster, abonnementsvormen en een eenvoudige aanmeldroute.',
      'Of u nu een kleine personal training studio rond {district} runt of een grote fitnessclub nabij {district2}, uw website moet twijfelaars in {city} overtuigen om een proefles te boeken.',
    ],
    heroIntroTemplates: [
      'Nieuwe leden vergelijken sportscholen online op sfeer, lessen en abonnementsvormen voordat ze langskomen. Star Local bouwt websites voor sportscholen in {city} met roosteroverzicht, online aanmelden en een energieke uitstraling. Zo zet u twijfelaars om in leden.',
      'Een sportschool verdient een website die energie en sfeer direct overbrengt. Star Local bouwt websites voor sportscholen in {city} met een helder lesrooster en eenvoudig aanmelden. Zo boekt een twijfelaar sneller een proefles.',
      'In {city} vergelijken potentiële leden sportscholen op sfeer, prijzen en beschikbaarheid. Star Local bouwt websites die uw energie overtuigend laten zien en aanmelden vereenvoudigen. Zo houdt u uw ledenaantal groeiend.',
    ],
    faqTemplates: [
      {
        questionTemplate: 'Kunnen leden zich online aanmelden voor een proefles bij mijn {industrySingular}?',
        answerTemplate: 'Ja, we bouwen een eenvoudig aanmeldformulier of koppelen uw ledenadministratiesysteem, zodat aanmelden direct kan.',
      },
      {
        questionTemplate: 'Kan ik mijn lesrooster op de website tonen?',
        answerTemplate: 'Zeker, we bouwen een overzichtelijk en actueel lesrooster dat u zelf kunt bijhouden.',
      },
      {
        questionTemplate: 'Word ik gevonden bij zoekopdrachten in mijn wijk van {city}?',
        answerTemplate: "Ja, we optimaliseren technisch voor zoektermen zoals '{industrySingular} {city}'.",
      },
      {
        questionTemplate: 'Kan ik informatie over abonnementen en prijzen tonen?',
        answerTemplate: 'Ja, we maken een duidelijk overzicht van abonnementsvormen en prijzen, zodat leden direct weten wat ze kunnen verwachten.',
      },
      {
        questionTemplate: 'Kan de website ook bedrijfsfitness of groepslessen faciliteren?',
        answerTemplate: 'Ja, we voegen een apart contactformulier toe voor zakelijke aanvragen zoals bedrijfsfitness in {city}.',
      },
      {
        questionTemplate: 'Kan mijn website meegroeien met een tweede locatie?',
        answerTemplate: 'Ja, de structuur is schaalbaar, zodat u eenvoudig een tweede vestiging of nieuwe lessen in {city} kunt toevoegen.',
      },
    ],
    bottomCtaTitleTemplate: 'Klaar voor een website die twijfelaars in {city} omzet in leden?',
    bottomCtaTextTemplate:
      'Laat een website bouwen die twijfelaars omzet in leden. Vraag vrijblijvend advies aan, we denken graag mee over uw {industrySingular} in {city}.',
    metaDescriptionTemplates: [
      'Website voor {industryPluralLower} in {city} laten maken? Star Local bouwt energieke websites met lesrooster, online aanmelden en heldere prijzen.',
      'Laat een website voor {industryPluralLower} in {city} maken met lesrooster, online aanmelden en een energieke uitstraling. Star Local helpt u verder.',
      'Meer aanmeldingen voor {industryPluralLower} in {city}: Star Local bouwt energieke websites met lesrooster en heldere abonnementsvormen voor leden.',
      'Website laten maken voor {industryPluralLower} in {city}? Star Local zorgt voor lesrooster, aanmelden en sterke lokale online vindbaarheid voor u.',
    ],
    relatedIndustryDescriptionTemplate:
      'Ook voor {industryPluralLower} in {city} bouwen we energieke websites die aanmeldingen en proeflessen verhogen.',
  },
];

export const INDUSTRY_SLUGS: string[] = INDUSTRY_DEFINITIONS.map((industry) => industry.slug);

export const INDUSTRY_BY_SLUG: Record<string, IndustryDefinition> = INDUSTRY_DEFINITIONS.reduce(
  (acc, industry) => {
    acc[industry.slug] = industry;
    return acc;
  },
  {} as Record<string, IndustryDefinition>,
);

export function getIndustryDefinition(slug: string): IndustryDefinition | undefined {
  return INDUSTRY_BY_SLUG[slug];
}
