import type { PublicationPackage } from '../../types/publication';
import type { PublicationManifest } from '../../types/publication-package';
import { productionBaseUrl } from '../../config/publication';
import { getPackageFile } from '../publish/publication-package.builder';

const FORBIDDEN_LINK_PATTERNS = [
  /localhost/i,
  /127\.0\.0\.1/,
  /\/admin\//i,
  /\/gratis-website\//i,
  /\/dashboard\//i,
  /\/login/i,
  /data-admin/i,
  /builder-/i,
];

const REQUIRED_PAGES = [
  'index.html',
  'over-ons/index.html',
  'diensten/index.html',
  'contact/index.html',
  'privacy/index.html',
];

export interface PackageValidationReport {
  valid: boolean;
  errors: string[];
  warnings: string[];
  pageCount: number;
  assetCount: number;
  checks: {
    pages: boolean;
    sitemap: boolean;
    robots: boolean;
    manifest: boolean;
    favicon: boolean;
    canonicals: boolean;
    openGraph: boolean;
    jsonLd: boolean;
    internalLinks: boolean;
    noForbiddenLinks: boolean;
  };
}

export function validateProductionPackage(
  pkg: PublicationPackage,
  slug: string,
  options: { preview?: boolean } = {},
): PackageValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const base = productionBaseUrl(slug);

  for (const pagePath of REQUIRED_PAGES) {
    const file = getPackageFile(pkg, pagePath);
    if (!file) {
      errors.push(`Ontbrekende pagina: ${pagePath}`);
      continue;
    }
    validatePageHtml(file.content, pagePath, base, errors, warnings, options.preview);
  }

  const sitemap = getPackageFile(pkg, 'sitemap.xml');
  const robots = getPackageFile(pkg, 'robots.txt');
  const manifest = getPackageFile(pkg, 'manifest.webmanifest');
  const favicon = getPackageFile(pkg, 'favicon.svg');

  if (!sitemap?.content.includes('<urlset')) errors.push('sitemap.xml ongeldig');
  if (sitemap?.content.includes('localhost')) errors.push('sitemap.xml bevat localhost');
  if (!robots?.content.includes('Sitemap:')) errors.push('robots.txt mist Sitemap-directive');
  if (robots?.content.includes('localhost')) errors.push('robots.txt bevat localhost');
  if (!manifest?.content.includes('"name"')) errors.push('manifest.webmanifest ongeldig');
  if (!favicon?.content.includes('<svg')) errors.push('favicon.svg ongeldig');

  const assetCount = pkg.files.filter((f) => f.path.startsWith('assets/')).length;

  const checks = {
    pages: REQUIRED_PAGES.every((p) => Boolean(getPackageFile(pkg, p))),
    sitemap: Boolean(sitemap?.content.includes('<urlset') && !sitemap.content.includes('localhost')),
    robots: Boolean(robots?.content.includes('Sitemap:') && !robots.content.includes('localhost')),
    manifest: Boolean(manifest?.content.includes('"name"')),
    favicon: Boolean(favicon?.content.includes('<svg')),
    canonicals: errors.filter((e) => e.includes('canonical')).length === 0,
    openGraph: errors.filter((e) => e.includes('Open Graph')).length === 0,
    jsonLd: errors.filter((e) => e.includes('JSON-LD')).length === 0,
    internalLinks: errors.filter((e) => e.includes('interne link')).length === 0,
    noForbiddenLinks: errors.filter((e) => e.includes('verboden link')).length === 0,
  };

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    pageCount: REQUIRED_PAGES.length,
    assetCount,
    checks,
  };
}

function validatePageHtml(
  html: string,
  pagePath: string,
  productionBase: string,
  errors: string[],
  warnings: string[],
  preview?: boolean,
): void {
  if (!html.includes('charset="utf-8"') && !html.includes("charset='utf-8'")) {
    errors.push(`${pagePath}: mist charset`);
  }
  if (!html.includes('name="viewport"')) errors.push(`${pagePath}: mist viewport`);
  if (!html.includes('lang="nl"')) warnings.push(`${pagePath}: taalcode niet nl`);

  if (!html.includes('rel="canonical"')) errors.push(`${pagePath}: mist canonical`);
  else if (html.includes('localhost') || html.includes('127.0.0.1')) {
    errors.push(`${pagePath}: canonical bevat localhost`);
  }

  if (!html.includes('property="og:title"')) errors.push(`${pagePath}: mist Open Graph title`);
  if (!html.includes('property="og:description"')) errors.push(`${pagePath}: mist Open Graph description`);
  if (!html.includes('name="twitter:card"')) warnings.push(`${pagePath}: mist Twitter Card`);

  if (!html.includes('application/ld+json')) errors.push(`${pagePath}: mist JSON-LD`);

  if (preview) {
    if (!html.includes('noindex')) warnings.push(`${pagePath}: preview mist noindex`);
  } else if (html.includes('noindex')) {
    warnings.push(`${pagePath}: productiepagina bevat noindex`);
  }

  for (const pattern of FORBIDDEN_LINK_PATTERNS) {
    if (pattern.test(html)) {
      errors.push(`${pagePath}: verboden link (${pattern.source})`);
    }
  }

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (href.startsWith('http') && !href.startsWith(productionBase)) {
      if (!href.startsWith('tel:') && !href.startsWith('mailto:') && !href.startsWith('https://wa.me')) {
        warnings.push(`${pagePath}: externe link ${href}`);
      }
    }
  }

  if (html.includes('data:') && html.includes('base64')) {
    warnings.push(`${pagePath}: bevat data-URL (prefer asset files)`);
  }
}

export function validatePublicationManifest(manifest: PublicationManifest): string[] {
  const errors: string[] = [];
  if (!manifest.publicationId) errors.push('publicationId ontbreekt');
  if (!manifest.tenantId) errors.push('tenantId ontbreekt');
  if (!manifest.websiteId) errors.push('websiteId ontbreekt');
  if (!manifest.slug) errors.push('slug ontbreekt');
  if (!manifest.domain.includes('starlocal.nl')) errors.push('domain ongeldig');
  if (manifest.canonicalBaseUrl.includes('localhost')) errors.push('canonicalBaseUrl bevat localhost');
  if (manifest.fileHashes.length === 0) errors.push('fileHashes leeg');
  return errors;
}
