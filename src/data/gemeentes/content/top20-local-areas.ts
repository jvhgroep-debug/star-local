export interface Top20LocalAreas {
  businessAreas: string[];
  landmarks: string[];
  localSeoExtra: string[];
}

export const TOP20_LOCAL_AREAS: Record<string, Top20LocalAreas> = {
  amsterdam: {
    businessAreas: ['Zuidas', 'NDSM', 'Sloterdijk', 'Amstel III', 'Amsterdam Science Park', 'Havengebied'],
    landmarks: ['Dam', 'Negen Straatjes', 'Kalverstraat', 'Amsterdam Centraal', 'Museumplein', 'Jordaan'],
    localSeoExtra: [
      'Ondernemers rond de Zuidas, in Noord en langs de Amstel zoeken anders — Star Local vertaalt dat naar pagina\'s en content die aansluiten op uw werkelijke werkgebied in Amsterdam.',
    ],
  },
  rotterdam: {
    businessAreas: ['Spaanse Polder', 'Brainpark', 'Rotterdam Airport Businesspark', 'Maasvlakte', 'Kop van Zuid', 'Feijenoord City'],
    landmarks: ['Erasmusbrug', 'Markthal', 'Coolsingel', 'Euromast', 'Rotterdam Centraal', 'Witte de Withstraat'],
    localSeoExtra: [
      'Van Charlois tot Hillegersberg: lokale SEO in Rotterdam werkt wanneer uw site aansluit op wijk, sector en zoekintentie — niet alleen op de gemeentenaam.',
    ],
  },
  'den-haag': {
    businessAreas: ['Binckhorst', 'Beatrixkwartier', 'Ypenburg', 'Televisiestraat', 'Laakkwartier', 'Rijswijkse Landingsbaan'],
    landmarks: ['Binnenhof', 'Scheveningen', 'Den Haag Centraal', 'Spuistraat', 'Madurodam', 'Haagse Bos'],
    localSeoExtra: [
      'Scheveningen, Centrum en Ypenburg hebben elk eigen zoekgedrag. Star Local koppelt uw website aan de wijken en doelgroepen waar u daadwerkelijk klanten bedient.',
    ],
  },
  utrecht: {
    businessAreas: ['Utrecht Science Park', 'Rotsoord', 'Papendorp', 'De Uithof', 'Lage Weide', 'Rijnsweerd'],
    landmarks: ['Domtoren', 'Oudegracht', 'Hoog Catharijne', 'Utrecht Centraal', 'Neude', 'Leidsche Rijn'],
    localSeoExtra: [
      'Utrecht combineert studenten, zorg, retail en kennisinstellingen. Lokale vindbaarheid vraagt content die past bij uw sector én uw buurt in de stad.',
    ],
  },
  eindhoven: {
    businessAreas: ['High Tech Campus', 'Strijp-S', 'Brainport Industries Campus', 'Flight Forum', 'Ekkersrijt', 'Tongelre'],
    landmarks: ['Strijp-S', 'Evoluon', 'Eindhoven Centraal', '18 Septemberplein', 'Philips Stadion', 'Woensel XL'],
    localSeoExtra: [
      'Brainport vraagt om tech-scherpe propositie online. Star Local bouwt sites die technisch sterk zijn en lokaal gevonden worden in Woensel, Strijp en het centrum.',
    ],
  },
  groningen: {
    businessAreas: ['Bedrijvenpark Delfzijl-Noord', 'Euvelgunne', 'De Enk', 'Peizerweg', 'Industrieterrein Adum', 'Zernike Campus'],
    landmarks: ['Grote Markt', 'Martinitoren', 'Groningen Centraal', 'Forum Groningen', 'Noordelijke haven', 'Helpman'],
    localSeoExtra: [
      'Als noordelijke stadscoördinaat zoeken Groningers direct en praktisch. Uw website moet snel duidelijk maken wat u doet — in Helpman, Centrum of op een bedrijventerrein.',
    ],
  },
  tilburg: {
    businessAreas: ['Bedrijvenpark Stappegoor', 'Koolhoven', 'De Schans', 'La Pulver', 'Heikant', 'Tilburg-Noord'],
    landmarks: ['Heuvel', 'Spoorzone', 'Tilburg Centraal', 'Piushaven', '013 Poppodium', 'Reeshof'],
    localSeoExtra: [
      'Tilburg groeit rond Spoorzone en Reeshof. Lokale SEO werkt wanneer uw site aansluit op de wijk of het bedrijventerrein waar klanten u zoeken.',
    ],
  },
  almere: {
    businessAreas: ['Almere Poort', 'Almere Haven', 'Tussen de Vaarten', 'De Hoven', 'Industrieterrein De Lange Dreef', 'Almere Buiten'],
    landmarks: ['Almere Centrum', 'Weerwater', 'Almere Haven', 'Almere Buiten', 'Oostvaardersplassen', 'Almere Stad'],
    localSeoExtra: [
      'Almere is jong, gepland en digitaal gewend. Ondernemers in Poort, Haven en Stad concurreren online — een snelle, heldere website maakt daar het verschil.',
    ],
  },
  breda: {
    businessAreas: ['Brabantpark', 'Haagse Beemden', 'Belcrum', 'IJpelaar', 'Breda-Noord', 'De Flines'],
    landmarks: ['Grote Markt', 'Haven', 'Valkenberg', 'Breda Centraal', 'Ginneken', 'Nieuwe Mark'],
    localSeoExtra: [
      'Van Ginneken tot Brabantpark: Bredase klanten zoeken per wijk en sector. Star Local zorgt dat uw site en Google-profiel dat lokale verhaal ondersteunen.',
    ],
  },
  nijmegen: {
    businessAreas: ['Wijchense Poort', 'Nijmegen-Noord', 'Lindenholt', 'Dukenburg', 'Westpoort', 'Kennispark'],
    landmarks: ['Grote Markt', 'Waalkade', 'Nijmegen Centraal', 'Valkhof', 'Molenpoort', 'Dukenburg'],
    localSeoExtra: [
      'Nijmegen combineert studentenleven, zorg en industrie. Lokale SEO in Lindenholt, Centrum of Dukenburg vraagt om relevante, unieke content per doelgroep.',
    ],
  },
  apeldoorn: {
    businessAreas: ['Bedrijvenpark De Maten', 'De Parken', 'Zuidbroek', 'Apeldoorn-Zuid', 'De Voorwaart', 'Hoog Buurlo'],
    landmarks: ['Paleis Het Loo', 'Markt', 'Apeldoorn Centraal', 'Orden', 'Caterpillar-terrein', 'Station Apeldoorn De Maten'],
    localSeoExtra: [
      'Apeldoorn is regionaal centrum voor Veluwe en zakelijke dienstverlening. Uw website moet lokaal vertrouwen wekken én professioneel genoeg zijn voor landelijke klanten.',
    ],
  },
  arnhem: {
    businessAreas: ['Kennispark Twente Arnhem', 'Rijnhallen', 'De Overmaat', 'Elden', 'Schuytgraaf', 'Westervoortseweg'],
    landmarks: ['Korenmarkt', 'Rijnkade', 'Arnhem Centraal', 'Sonsbeek', 'Modekwartier', 'Presikhaaf'],
    localSeoExtra: [
      'Arnhem profileert zich als creatieve en zakelijke stad. Lokale vindbaarheid werkt wanneer uw site aansluit op Presikhaaf, Centrum of Elden — waar uw klanten zoeken.',
    ],
  },
  haarlem: {
    businessAreas: ['Spaarne Business Park', 'Schalkwijk', 'Waarderpolder', 'Heemstede rand', 'Overveen', 'Boerhaavewijk'],
    landmarks: ['Grote Markt', 'Grote Houtstraat', 'Haarlem Centraal', 'Frans Hals Museum', 'Spaarne', 'Haarlemmerhout'],
    localSeoExtra: [
      'Haarlem combineert toerisme, retail en creatieve sector. Star Local bouwt sites die lokaal in Haarlem en Schalkwijk gevonden worden zonder generieke stadsteksten.',
    ],
  },
  haarlemmermeer: {
    businessAreas: ['Schiphol Trade Park', 'Hoofddorp Centrum', 'Spoorzone Hoofddorp', 'Rijnlanderweg', 'Aalsmeer', 'Lisserbroek'],
    landmarks: ['Schiphol', 'Hoofddorp Centrum', 'Haarlemmermeerse Bos', 'Toolenburg', 'Cruquius', 'Vijfhuizen'],
    localSeoExtra: [
      'Haarlemmermeer draait om logistiek, luchtvaart en bedrijventerreinen rond Schiphol. Lokale SEO moet aansluiten op Hoofddorp, Nieuw-Vennep of het terrein waar u zit.',
    ],
  },
  zaanstad: {
    businessAreas: ['Westzanerpolder', 'Industrieterrein De Gouw', 'Zuidoost', 'Assendelft', 'Koog aan de Zaan', 'Wormerveer'],
    landmarks: ['Zaanse Schans', 'Gedempte Gracht', 'Zaandam Centrum', 'Inntel Hotels', 'Zaan', 'Stadhuis Zaandam'],
    localSeoExtra: [
      'Zaanstad kent industrie, retail en toerisme rond de Zaan. Star Local helpt ondernemers in Zaandam, Wormerveer en op bedrijventerreinen om online zichtbaar te worden.',
    ],
  },
  amersfoort: {
    businessAreas: ['Bedrijvenpark De Brand', 'De Horst', 'Amersfoort Vathorst', 'Leusden-A28', 'Bergkwartier', 'Stoutenburg'],
    landmarks: ['Onze Lieve Vrouwetoren', 'Koppelpoort', 'Amersfoort Centraal', 'Stadsring', 'Vathorst', 'Muurhuizen'],
    localSeoExtra: [
      'Amersfoort groeit rond Vathorst en het historische centrum. Lokale SEO werkt wanneer uw site wijk, sector en zoekintentie combineert — niet alleen de gemeentenaam.',
    ],
  },
  enschede: {
    businessAreas: ['Business Park Twente', 'Roombeek', 'Westerval', 'Deppenbroek', 'Stroinkslanden', 'Twente Airport'],
    landmarks: ['Oude Markt', 'Enschede Centraal', 'Roombeek', 'Universiteit Twente', 'Grolsch Veste', 'Volksbank-gebied'],
    localSeoExtra: [
      'Enschede is tech- en kennisgericht. Ondernemers in Roombeek, Stroinkslanden en op Business Park Twente hebben een professionele, snelle website nodig om lokaal te winnen.',
    ],
  },
  's-hertogenbosch': {
    businessAreas: ['De Brand', 'De Hurk', 'De Rompert', 'Empel', 'Rosmalen', 'Maaspoort'],
    landmarks: ['Markt', 'Sint-Janskathedraal', 'Binnendieze', 'Den Bosch Centraal', 'Bossche Bol', 'Paleiskwartier'],
    localSeoExtra: [
      'Den Bosch combineert retail in het centrum met bedrijven op De Hurk en Rosmalen. Star Local koppelt uw site aan de plekken waar Bossche klanten daadwerkelijk zoeken.',
    ],
  },
  zwolle: {
    businessAreas: ['Bedrijvenpark H2O', 'Marslanden', 'Westenholte', 'Assendorp', 'Holtenbroek', 'A28-terreinen'],
    landmarks: ['Grote Kerk', 'Peperbus', 'Zwolle Centraal', 'Diezerstraat', 'Sassenpoort', 'IJsseldelta'],
    localSeoExtra: [
      'Zwolle is regionaal knooppunt in Overijssel. Lokale SEO in Holtenbroek, Assendorp of het centrum vraagt om content die past bij uw sector en werkgebied.',
    ],
  },
  leiden: {
    businessAreas: ['Leiden Bio Science Park', 'Tachthuis', 'Leiden-Noord', 'Rijnzicht', 'Transferium A44', 'Stationsgebied'],
    landmarks: ['Pieterskerk', 'Rapenburg', 'Leiden Centraal', 'Hortus Botanicus', 'Morspoort', 'Stadion Galgenwaard'],
    localSeoExtra: [
      'Leiden combineert wetenschap, studenten en zorg. Star Local bouwt websites die lokaal in Leiden en rond Bio Science Park gevonden worden — professioneel en conversiegericht.',
    ],
  },
};

export const TOP20_NEIGHBORS: Record<string, { naam: string; slug: string }[]> = {
  amsterdam: [
    { naam: 'Amstelveen', slug: 'amstelveen' },
    { naam: 'Diemen', slug: 'diemen' },
    { naam: 'Haarlem', slug: 'haarlem' },
    { naam: 'Zaanstad', slug: 'zaanstad' },
    { naam: 'Almere', slug: 'almere' },
    { naam: 'Haarlemmermeer', slug: 'haarlemmermeer' },
    { naam: 'Purmerend', slug: 'purmerend' },
  ],
  rotterdam: [
    { naam: 'Schiedam', slug: 'schiedam' },
    { naam: 'Capelle aan den IJssel', slug: 'capelle-aan-den-ijssel' },
    { naam: 'Barendrecht', slug: 'barendrecht' },
    { naam: 'Delft', slug: 'delft' },
    { naam: 'Maassluis', slug: 'maassluis' },
    { naam: 'Rijswijk', slug: 'rijswijk' },
  ],
  breda: [
    { naam: 'Etten-Leur', slug: 'etten-leur' },
    { naam: 'Oosterhout', slug: 'oosterhout' },
    { naam: 'Tilburg', slug: 'tilburg' },
    { naam: 'Roosendaal', slug: 'roosendaal' },
    { naam: 'Zundert', slug: 'zundert' },
    { naam: 'Drimmelen', slug: 'drimmelen' },
  ],
};
