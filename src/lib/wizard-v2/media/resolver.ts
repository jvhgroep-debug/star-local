import type { WizardV2State } from '../../../types/wizard-v2';
import type { WizardResolvedMedia } from './types';
import {
  WIZARD_PLACEHOLDER_GALLERY,
  WIZARD_PLACEHOLDER_HERO,
  WIZARD_PLACEHOLDER_LOGO,
} from './placeholders';

/**
 * Resolves wizard media slots for preview and export.
 * Phase 2: placeholders only. Later: check state.mediaOverrides or R2 keys here.
 */
export function resolveWizardMedia(_state: WizardV2State): WizardResolvedMedia {
  return {
    logo: WIZARD_PLACEHOLDER_LOGO,
    hero: WIZARD_PLACEHOLDER_HERO,
    gallery: WIZARD_PLACEHOLDER_GALLERY,
  };
}
