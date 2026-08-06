import type { PreviewPage } from '../../types/builder';
import type { WizardV2State } from '../../types/wizard-v2';
import { renderExampleDomainBar } from '../builder/render-preview';
import { futureDomain } from '../builder/templates';
import { renderPreviewPageTabs } from '../builder/render-builder';
import { DEFAULT_ENABLED_PAGES } from '../../types/builder';
import type { WizardResolvedMedia } from './media';
import {
  renderWizardComplete,
  renderWizardProgress,
  renderWizardStep1,
  renderWizardStep2,
  renderWizardStep3,
} from './render-form';
import { mapWizardToBuilderState } from './state-mapper';

export function renderWizardShell(
  state: WizardV2State,
  media: WizardResolvedMedia,
  errors: Record<string, string>,
  previewViewport: 'desktop' | 'tablet' | 'mobile',
  previewPage: PreviewPage,
  isComplete: boolean,
  saveMessage: string | null,
  saveError: string | null,
): string {
  const builderState = mapWizardToBuilderState(state);
  const stepContent = isComplete
    ? renderWizardComplete(state, saveMessage, saveError)
    : state.currentStep === 1
      ? renderWizardStep1(state, errors)
      : state.currentStep === 2
        ? renderWizardStep2(state, errors)
        : renderWizardStep3(state, media, errors);

  const showNext = !isComplete && state.currentStep < 3;
  const nextLabel = state.currentStep === 3 ? 'Voltooien' : 'Volgende';

  return `
    <div class="builder-workspace wizard-v2-workspace">
      <div class="builder-workspace__form">
        <div class="builder-shell">
          <header class="builder-header">
            <p class="eyebrow">Website Wizard — Fase 2</p>
            <h1>Bouw uw website</h1>
            <p class="builder-subtitle">Vul uw gegevens in en zie direct een live voorbeeld rechts.</p>
            ${isComplete ? '' : renderWizardProgress(state.currentStep)}
          </header>

          <div class="builder-body">${stepContent}</div>

          ${
            !isComplete
              ? `
            <footer class="builder-footer">
              <button type="button" class="btn btn-secondary" data-wizard-back ${state.currentStep === 1 ? 'disabled' : ''}>Vorige</button>
              <button type="button" class="btn btn-primary" data-wizard-next>${nextLabel}</button>
            </footer>
          `
              : `
            <footer class="builder-footer">
              <button type="button" class="btn btn-secondary" data-wizard-back>Terug naar huisstijl</button>
              <button type="button" class="btn btn-secondary" data-wizard-reset>Opnieuw beginnen</button>
            </footer>
          `
          }
        </div>
      </div>

      <aside class="builder-live-panel" aria-label="Live website preview">
        ${renderExampleDomainBar(futureDomain(builderState))}
        <div class="builder-live-panel__head">
          <strong>Live preview</strong>
          <div class="builder-viewport-switch" role="group" aria-label="Apparaatweergave">
            <button type="button" class="builder-viewport-btn ${previewViewport === 'desktop' ? 'is-active' : ''}" data-wizard-viewport="desktop">Desktop</button>
            <button type="button" class="builder-viewport-btn ${previewViewport === 'tablet' ? 'is-active' : ''}" data-wizard-viewport="tablet">Tablet</button>
            <button type="button" class="builder-viewport-btn ${previewViewport === 'mobile' ? 'is-active' : ''}" data-wizard-viewport="mobile">Mobiel</button>
          </div>
        </div>
        ${renderPreviewPageTabs(previewPage, DEFAULT_ENABLED_PAGES)}
        <div class="builder-live-preview__canvas builder-live-preview__canvas--${previewViewport}">
          <div id="wizard-v2-preview-frame" class="builder-live-preview__frame"></div>
        </div>
      </aside>
    </div>
  `;
}
