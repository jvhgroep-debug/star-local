import type { Locale } from '../../i18n/config';
import type { LegalPageContent, LegalPageKey } from './types';
import { privacyContent } from './privacy';
import { cookiesContent } from './cookies';
import { termsContent } from './terms';
import { disclaimerContent } from './disclaimer';

const pages: Record<LegalPageKey, typeof privacyContent> = {
  privacy: privacyContent,
  cookies: cookiesContent,
  terms: termsContent,
  disclaimer: disclaimerContent,
};

export function getLegalPage(key: LegalPageKey, locale: Locale): LegalPageContent {
  return pages[key][locale];
}

export function getLegalRouteKey(key: LegalPageKey): 'privacy' | 'cookies' | 'terms' | 'disclaimer' {
  return key;
}
