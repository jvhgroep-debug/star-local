import type { Locale } from '../i18n/config';
import type { Dictionary } from '../i18n';
import { route } from '../i18n/routes';
import { FREE_WEBSITE_START_PATH } from './site';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavDropdownItem extends NavItem {
  description?: string;
}

export function getMainNav(locale: Locale, dict: Dictionary): (NavItem | { label: string; children: NavDropdownItem[] })[] {
  const ns = dict.navServices;
  return [
    { label: dict.nav.home, href: route('home', locale) },
    {
      label: dict.nav.services,
      children: [
        { label: ns.website, href: route('service', locale, { slug: 'website-laten-maken' }) },
        { label: ns.webshop, href: route('service', locale, { slug: 'webshop-laten-maken' }) },
        { label: ns.localSeo, href: route('service', locale, { slug: 'lokale-seo' }) },
        { label: ns.nationalSeo, href: route('service', locale, { slug: 'landelijke-seo' }) },
        { label: ns.googleBusiness, href: route('service', locale, { slug: 'google-bedrijfsprofiel' }) },
        { label: ns.maintenance, href: route('service', locale, { slug: 'website-onderhoud' }) },
        { label: ns.seoAudit, href: route('service', locale, { slug: 'seo-audit' }) },
      ],
    },
    { label: dict.nav.projects, href: route('projects', locale) },
    { label: dict.nav.approach, href: route('approach', locale) },
    { label: dict.nav.about, href: route('about', locale) },
    { label: dict.nav.blog, href: route('blog', locale) },
    { label: dict.nav.contact, href: route('contact', locale) },
  ];
}

export function getFooterServices(locale: Locale, dict: Dictionary): NavItem[] {
  const ns = dict.navServices;
  return [
    { label: dict.footer.freeWebsiteLink, href: FREE_WEBSITE_START_PATH },
    { label: ns.website, href: route('service', locale, { slug: 'website-laten-maken' }) },
    { label: ns.localSeo, href: route('service', locale, { slug: 'lokale-seo' }) },
    { label: ns.nationalSeo, href: route('service', locale, { slug: 'landelijke-seo' }) },
    { label: ns.googleBusiness, href: route('service', locale, { slug: 'google-bedrijfsprofiel' }) },
    { label: ns.maintenance, href: route('service', locale, { slug: 'website-onderhoud' }) },
    { label: ns.seoAudit, href: route('service', locale, { slug: 'seo-audit' }) },
  ];
}

export function getFooterCompany(locale: Locale, dict: Dictionary): NavItem[] {
  const fc = dict.footerCompany;
  return [
    { label: fc.about, href: route('about', locale) },
    { label: fc.projects, href: route('projects', locale) },
    { label: fc.approach, href: route('approach', locale) },
    { label: fc.reviews, href: route('reviews', locale) },
    { label: fc.blog, href: route('blog', locale) },
    { label: fc.contact, href: route('contact', locale) },
  ];
}

export function getFooterLegal(locale: Locale, dict: Dictionary): NavItem[] {
  const fl = dict.footerLegal;
  return [
    { label: fl.privacy, href: route('privacy', locale) },
    { label: fl.terms, href: route('terms', locale) },
    { label: fl.cookies, href: route('cookies', locale) },
    { label: fl.disclaimer, href: route('disclaimer', locale) },
    { label: fl.sitemap, href: route('sitemap', locale) },
  ];
}
