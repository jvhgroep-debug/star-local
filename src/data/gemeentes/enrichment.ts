export interface GemeenteEnrichment {
  provincie?: string;
  districts?: string[];
  businessAreas?: string[];
  retailAreas?: string[];
  economicTraits?: string[];
}

export const GEMEENTE_ENRICHMENT: Record<string, GemeenteEnrichment> = {
  amsterdam: {
    provincie: 'Noord-Holland',
    districts: [
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
    businessAreas: ['Zuidas', 'Amsterdam-Noord (NDSM)', 'Amstel III', 'Sloterdijk', 'Amsterdam Science Park'],
    retailAreas: ['Negen Straatjes', 'Kalverstraat', 'Haarlemmerdijk', 'Oost/West', 'Bijlmer'],
    economicTraits: [
      'internationale zakelijke dienstverlening',
      'toerisme en horeca',
      'creatieve industrie en tech',
      'retail en stedelijke dienstverlening',
    ],
  },
  rotterdam: {
    provincie: 'Zuid-Holland',
    districts: ['Centrum', 'Noord', 'Zuid', 'West', 'Oost', 'Kralingen-Crooswijk', 'Charlois', 'Feijenoord'],
    businessAreas: ['Rotterdam Centrum', 'Brainpark', 'Rotterdam Airport Businesspark', 'Maasvlakte'],
    retailAreas: ['Lijnbaan', 'Meent', 'Witte de Withstraat', 'Zuidplein', 'Markthal'],
    economicTraits: ['logistiek en haven', 'maritieme sector', 'zakelijke dienstverlening', 'retail en horeca'],
  },
  's-gravenhage': {
    provincie: 'Zuid-Holland',
    districts: ['Centrum', 'Scheveningen', 'Loosduinen', 'Escamp', 'Segbroek', 'Laak', 'Haagse Hout'],
    businessAreas: ['Binckhorst', 'Televisiestraat', 'Ypenburg', 'Beatrixkwartier'],
    retailAreas: ['Den Haag Centrum', 'Frederik Hendriklaan', 'Spuistraat', 'Scheveningen Boulevard'],
    economicTraits: ['overheid en internationale organisaties', 'juridische dienstverlening', 'horeca en toerisme'],
  },
  'den-haag': {
    provincie: 'Zuid-Holland',
    districts: [
      'Centrum',
      'Scheveningen',
      'Bezuidenhout',
      'Statenkwartier',
      'Laak',
      'Escamp',
      'Haagse Hout',
      'Binckhorst',
      'Ypenburg',
      'Leidschenveen',
    ],
    businessAreas: ['Binckhorst', 'Beatrixkwartier', 'Ypenburg', 'Televisiestraat'],
    retailAreas: ['Spuistraat', 'Frederik Hendriklaan', 'Scheveningen', 'Den Haag Centrum'],
    economicTraits: ['internationale dienstverlening', 'juridische sector', 'horeca en toerisme', 'overheid'],
  },
  utrecht: {
    provincie: 'Utrecht',
    districts: ['Centrum', 'Oost', 'West', 'Overvecht', 'Leidsche Rijn', 'Lombok', 'Tuindorp'],
    businessAreas: ['Utrecht Science Park', 'Rotsoord', 'Papendorp', 'De Uithof'],
    retailAreas: ['Hoog Catharijne', 'Oudegracht', 'Vredenburg', 'Lombok'],
    economicTraits: ['kenniseconomie', 'zorg en onderwijs', 'retail', 'creatieve sector'],
  },
  breda: {
    provincie: 'Noord-Brabant',
    districts: [
      'Centrum',
      'Ginneken',
      'Princenhage',
      'Haagse Beemden',
      'Breda-Noord',
      'Brabantpark',
      'Belcrum',
      'IJpelaar',
    ],
    businessAreas: ['Brabantpark', 'Haagse Beemden', 'Belcrum', 'IJpelaar', 'Breda-Noord'],
    retailAreas: ['Binnenstad', 'Ginneken', 'Haagse Beemden', 'Hoge Vucht'],
    economicTraits: [
      'horeca en retail',
      'logistiek en industrie',
      'zakelijke dienstverlening',
      'creatieve sector',
    ],
  },
  eindhoven: {
    provincie: 'Noord-Brabant',
    districts: ['Centrum', 'Strijp', 'Woensel', 'Tongelre', 'Gestel', 'Stratum'],
    businessAreas: ['High Tech Campus', 'Strijp-S', 'Brainport Industries Campus', 'Flight Forum'],
    retailAreas: ['Centrum', 'Woensel XL', 'Strijp-S', 'Meerhoven'],
    economicTraits: ['tech en innovatie', 'industrie en design', 'kennisinstellingen', 'retail'],
  },
  's-hertogenbosch': {
    provincie: 'Noord-Brabant',
    districts: ['Centrum', 'North', 'Oost', 'West', 'Zuid', 'Rosmalen', 'Empel', 'Molenhoek'],
    businessAreas: ['Bedrijvenpark De Brand', 'Industrial Estate De Hurk', 'De Rompert'],
    retailAreas: ['Markt', 'Vughterstraat', 'Helftheuvelpassage', 'Rompertpassage'],
    economicTraits: ['zorg en kennis', 'logistiek', 'retail', 'creatieve sector'],
  },
};

export function getEnrichment(slug: string): GemeenteEnrichment | undefined {
  return GEMEENTE_ENRICHMENT[slug] ?? (slug === 'den-haag' ? GEMEENTE_ENRICHMENT['s-gravenhage'] : undefined);
}
