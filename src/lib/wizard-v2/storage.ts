import type { WizardV2State } from '../../types/wizard-v2';
import { createDefaultHours, WIZARD_V2_STORAGE_KEY } from './constants';

export function createDefaultWizardState(): WizardV2State {
  return {
    version: 2,
    currentStep: 1,
    businessName: '',
    industry: '',
    description: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    street: '',
    postcode: '',
    city: '',
    hours: createDefaultHours(),
    social: {
      facebook: '',
      instagram: '',
      linkedin: '',
    },
    primaryColor: '#1a2332',
    accentColor: '#cdb880',
    fontFamily: 'system',
  };
}

export function loadWizardState(): WizardV2State {
  if (typeof window === 'undefined') return createDefaultWizardState();

  try {
    const raw = window.localStorage.getItem(WIZARD_V2_STORAGE_KEY);
    if (!raw) return createDefaultWizardState();

    const parsed = JSON.parse(raw) as Partial<WizardV2State>;
    if (parsed.version !== 2) return createDefaultWizardState();

    const defaults = createDefaultWizardState();
    return {
      ...defaults,
      ...parsed,
      hours: parsed.hours?.length === 7 ? parsed.hours : defaults.hours,
      social: { ...defaults.social, ...parsed.social },
    };
  } catch {
    return createDefaultWizardState();
  }
}

export function saveWizardState(state: WizardV2State): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WIZARD_V2_STORAGE_KEY, JSON.stringify(state));
}

export function clearWizardState(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(WIZARD_V2_STORAGE_KEY);
}
