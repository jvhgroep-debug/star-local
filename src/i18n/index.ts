import type { Locale } from './config';
import { defaultLocale, locales } from './config';
import { getLocaleFromPath, route, translatePath } from './routes';
import nl from './nl.json';
import en from './en.json';

const dictionaries = { nl, en } as const;
export type Dictionary = typeof nl;

export function getLocale(url: URL): Locale {
  return getLocaleFromPath(url.pathname);
}

export function useTranslations(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function t(locale: Locale) {
  return dictionaries[locale];
}

export { defaultLocale, locales, route, translatePath, getLocaleFromPath };
