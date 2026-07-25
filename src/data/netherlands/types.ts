export interface MunicipalityNeighbor {
  naam: string;
  slug: string;
}

/** One Dutch municipality record used by the Location Engine. */
export interface Municipality {
  naam: string;
  slug: string;
  provincie: string;
  inwonersaantal: number;
  postcodegebied: string;
  omliggendeGemeenten: MunicipalityNeighbor[];
  latitude: number;
  longitude: number;
  /** ISO country code — enables multi-country datasets later. */
  countryCode: 'NL';
}
