import type { PreviewPage } from '../../types/builder';
import type { WizardV2State } from '../../types/wizard-v2';
import { renderTenantPreview } from '../builder/render-preview';
import { bindPreviewInteractions } from '../builder/preview-interactions';
import { resolveWizardMedia } from './media';
import { formatSocialUrl, mapWizardMediaToBuilderFiles, mapWizardToBuilderState } from './state-mapper';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSocialBar(state: WizardV2State): string {
  const links = [
    { label: 'Facebook', url: formatSocialUrl(state.social.facebook, 'https://facebook.com/') },
    { label: 'Instagram', url: formatSocialUrl(state.social.instagram, 'https://instagram.com/') },
    { label: 'LinkedIn', url: formatSocialUrl(state.social.linkedin, 'https://linkedin.com/company/') },
  ].filter((item) => item.url);

  if (links.length === 0) return '';

  return `
    <section class="wizard-v2-social-bar tenant-section tenant-section--alt">
      <div class="tenant-section__inner tenant-section__inner--narrow">
        <p class="tenant-section__eyebrow">Volg ons</p>
        <div class="wizard-v2-social-links">
          ${links
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

export function renderWizardPreviewHtml(state: WizardV2State, page: PreviewPage): string {
  const builderState = mapWizardToBuilderState(state);
  const media = resolveWizardMedia(state);
  const files = mapWizardMediaToBuilderFiles(media);
  const tenantHtml = renderTenantPreview(builderState, files, page);
  const socialHtml = page === 'home' || page === 'contact' ? renderSocialBar(state) : '';

  if (!socialHtml) return tenantHtml;

  const marker = '<footer class="tenant-footer">';
  const index = tenantHtml.indexOf(marker);
  if (index === -1) return tenantHtml + socialHtml;
  return tenantHtml.slice(0, index) + socialHtml + tenantHtml.slice(index);
}

export function attachWizardPreview(frame: HTMLElement, state: WizardV2State, page: PreviewPage): void {
  frame.innerHTML = renderWizardPreviewHtml(state, page);
  bindPreviewInteractions(frame, (nextPage) => {
    frame.dispatchEvent(new CustomEvent('wizard-preview-page', { detail: nextPage, bubbles: true }));
  });
}
