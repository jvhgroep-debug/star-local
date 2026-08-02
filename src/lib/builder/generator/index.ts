import type { PreviewPage, WebsiteConfig } from '../../types/website-config';

export type GeneratorPage = PreviewPage;

export function pageSeoTitle(config: WebsiteConfig, page: GeneratorPage): string {
  const { copy, seo } = config;
  switch (page) {
    case 'about':
      return `${copy.aboutIntro} | ${copy.localTitle}`;
    case 'services':
      return `Diensten | ${copy.localTitle}`;
    case 'contact':
      return `Contact | ${copy.localTitle}`;
    case 'privacy':
      return `Privacybeleid | ${config.slug.domain.replace('.starlocal.nl', '')}`;
    default:
      return seo.title;
  }
}

export function pageHeading(config: WebsiteConfig, page: GeneratorPage): string {
  switch (page) {
    case 'about':
      return config.copy.aboutIntro;
    case 'services':
      return 'Onze diensten';
    case 'contact':
      return `Contact — ${config.copy.localTitle}`;
    case 'privacy':
      return 'Privacybeleid';
    default:
      return config.seo.h1;
  }
}
