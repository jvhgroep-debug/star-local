import type { PreviewPage } from '../../types/builder';
import type { WebsiteConfig } from '../../types/website-config';
import type { WizardV2SocialLinks } from '../../types/wizard-v2';
import type { BuilderFiles } from '../builder/files';
import type { BuilderState } from '../../types/builder';
import { buildWebsiteConfig } from '../builder/website-config';
import { buildAllPageSeo } from '../builder/generator/seo';
import { renderGeneratedWebsiteFromConfig } from '../builder/generator/template';
import { buildTenantPageDocument } from '../builder/generator/document';
import { formatSocialUrl } from '../wizard-v2/state-mapper';
import { previewPageFromSitePath } from './paths';

export interface PublicationSnapshotMeta {
  socialLinks?: WizardV2SocialLinks;
  publicSiteBaseUrl?: string;
}

export interface PublicationSnapshot {
  config: WebsiteConfig;
  meta?: PublicationSnapshotMeta;
}

export function buildPublicationSnapshot(
  state: BuilderState,
  files: BuilderFiles,
  options: { publicSiteBaseUrl: string; socialLinks?: WizardV2SocialLinks },
): PublicationSnapshot {
  const config = buildWebsiteConfig(state, files, { status: 'concept', package: 'free' });
  const base = options.publicSiteBaseUrl.replace(/\/$/, '');
  config.slug.url = `${base}/`;
  config.slug.domain = new URL(base).host || config.slug.domain;

  return {
    config,
    meta: {
      socialLinks: options.socialLinks,
      publicSiteBaseUrl: base,
    },
  };
}

export function serializePublicationSnapshot(snapshot: PublicationSnapshot): string {
  return JSON.stringify(snapshot);
}

export function parsePublicationSnapshot(raw: string | null | undefined): PublicationSnapshot | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PublicationSnapshot | WebsiteConfig;
    if ('config' in parsed && parsed.config?.version === 1) {
      return parsed as PublicationSnapshot;
    }
    if ('version' in parsed && parsed.version === 1) {
      return { config: parsed as WebsiteConfig };
    }
    return null;
  } catch {
    return null;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSocialSection(links?: WizardV2SocialLinks): string {
  if (!links) return '';
  const items = [
    { label: 'Facebook', url: formatSocialUrl(links.facebook, 'https://facebook.com/') },
    { label: 'Instagram', url: formatSocialUrl(links.instagram, 'https://instagram.com/') },
    { label: 'LinkedIn', url: formatSocialUrl(links.linkedin, 'https://linkedin.com/company/') },
  ].filter((item) => item.url);

  if (items.length === 0) return '';

  return `
    <section class="wizard-v2-social-bar tenant-section tenant-section--alt">
      <div class="tenant-section__inner tenant-section__inner--narrow">
        <p class="tenant-section__eyebrow">Volg ons</p>
        <div class="wizard-v2-social-links">
          ${items
            .map(
              (link) =>
                `<a class="wizard-v2-social-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`,
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function injectSocial(html: string, socialHtml: string): string {
  if (!socialHtml) return html;
  const marker = '<footer class="tenant-footer">';
  const index = html.indexOf(marker);
  if (index === -1) return html + socialHtml;
  return html.slice(0, index) + socialHtml + html.slice(index);
}

export function renderPublishedSitePage(snapshot: PublicationSnapshot, subPath: string): string | null {
  const page = previewPageFromSitePath(subPath);
  if (!page) return null;

  const config = snapshot.config;
  const seoByPage = buildAllPageSeo(config);
  const seo = seoByPage[page];
  const body = renderGeneratedWebsiteFromConfig(config, page, seo, { standalone: true });
  const withSocial = injectSocial(body, page === 'home' || page === 'contact' ? renderSocialSection(snapshot.meta?.socialLinks) : '');
  return buildTenantPageDocument(config, page, withSocial, seo);
}

export function listPublishedPages(): PreviewPage[] {
  return ['home', 'about', 'services', 'contact', 'privacy'];
}
