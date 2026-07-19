import type { Locale } from '../../i18n/config';

export type LegalPageKey = 'privacy' | 'cookies' | 'terms' | 'disclaimer';

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'contact' };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalPageContent {
  title: string;
  breadcrumbLabel: string;
  intro: string;
  notice?: string;
  lastUpdated: string;
  seoTitle: string;
  seoDescription: string;
  tocLabel: string;
  sections: LegalSection[];
}

export type LegalPageSet = Record<Locale, LegalPageContent>;
