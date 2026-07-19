export const defaultLocale = 'nl' as const;
export const locales = ['nl', 'en'] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, { flag: string; name: string; hreflang: string; htmlLang: string; ogLocale: string }> = {
  nl: { flag: '🇳🇱', name: 'Nederlands', hreflang: 'nl-NL', htmlLang: 'nl', ogLocale: 'nl_NL' },
  en: { flag: '🇬🇧', name: 'English', hreflang: 'en', htmlLang: 'en', ogLocale: 'en_GB' },
};

export const futureLocales = ['de', 'fr', 'es'] as const;
