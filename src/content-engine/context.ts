import type { CitySizeBand, LocationContext } from './types';
import { formatPopulation } from './hash';

const PROVINCE_TRAITS: Record<string, string[]> = {
  'Noord-Holland': ['retail', 'horeca', 'toerisme', 'zakelijke dienstverlening', 'logistiek', 'creatieve sector'],
  'Zuid-Holland': ['industrie', 'logistiek', 'maritieme activiteit', 'retail', 'horeca', 'tech'],
  'Noord-Brabant': ['industrie', 'tech', 'logistiek', 'retail', 'horeca', 'agribusiness'],
  Utrecht: ['kenniseconomie', 'zorg', 'retail', 'creatieve sector', 'zakelijke dienstverlening'],
  Gelderland: ['industrie', 'logistiek', 'retail', 'agribusiness', 'zorg', 'toerisme'],
  Overijssel: ['industrie', 'logistiek', 'retail', 'agribusiness', 'toerisme'],
  Limburg: ['industrie', 'horeca', 'toerisme', 'retail', 'zorg'],
  Fryslân: ['agribusiness', 'toerisme', 'retail', 'maritieme sector', 'energie'],
  Friesland: ['agribusiness', 'toerisme', 'retail', 'maritieme sector', 'energie'],
  Groningen: ['energie', 'retail', 'logistiek', 'onderwijs', 'zorg'],
  Drenthe: ['toerisme', 'retail', 'agribusiness', 'zorg', 'logistiek'],
  Flevoland: ['logistiek', 'agribusiness', 'retail', 'tech', 'industrie'],
  Zeeland: ['toerisme', 'logistiek', 'maritieme sector', 'retail', 'agribusiness'],
};

export function getCitySizeBand(population: number): CitySizeBand {
  if (population >= 500_000) return 'metro';
  if (population >= 150_000) return 'large';
  if (population >= 50_000) return 'medium';
  return 'small';
}

export function getEconomicTraits(province: string): string[] {
  return (
    PROVINCE_TRAITS[province] ?? [
      'retail',
      'dienstverlening',
      'horeca',
      'ambacht',
      'zorg',
      'logistiek',
    ]
  );
}

export function sizeWording(band: CitySizeBand, language: 'nl' | 'en' = 'nl'): string {
  if (language === 'en') {
    const map = {
      metro: 'a major metropolitan market',
      large: 'a large urban market',
      medium: 'a mid-sized local market',
      small: 'a close-knit local market',
    } as const;
    return map[band];
  }
  const map = {
    metro: 'een grootstedelijke markt',
    large: 'een grote stedelijke markt',
    medium: 'een middelgrote lokale markt',
    small: 'een overzichtelijke lokale markt',
  } as const;
  return map[band];
}

export function populationPhrase(ctx: LocationContext): string {
  const label = formatPopulation(ctx.population, ctx.language);
  if (ctx.language === 'en') {
    return `around ${label} residents`;
  }
  return `ongeveer ${label} inwoners`;
}
