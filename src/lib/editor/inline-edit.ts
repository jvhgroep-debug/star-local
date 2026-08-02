import type { BuilderState } from '../../types/builder';

export type InlineEditHandler = (field: string, value: string) => void;

export function applyInlineField(state: BuilderState, field: string, value: string): BuilderState {
  const next = { ...state, business: { ...state.business }, contact: { ...state.contact } };

  switch (field) {
    case 'business.name':
      next.business.name = value;
      break;
    case 'business.industry':
      next.business.industry = value;
      break;
    case 'hero.title':
      next.heroTitle = value;
      break;
    case 'hero.subtitle':
      next.heroSubtitle = value;
      break;
    case 'hero.description':
      next.business.description = value;
      break;
    case 'cta.quote':
      next.ctaQuoteLabel = value || 'Offerte aanvragen';
      break;
    default:
      break;
  }

  return next;
}

export function bindInlineEditing(frame: Element, onEdit: InlineEditHandler): void {
  frame.querySelectorAll('[data-editor-field]').forEach((node) => {
    const element = node as HTMLElement;
    element.addEventListener('click', (event) => {
      event.stopPropagation();
      element.classList.add('is-editing');
    });
    element.addEventListener('focus', () => element.classList.add('is-editing'));
    element.addEventListener('blur', () => element.classList.remove('is-editing'));
    element.addEventListener('input', () => {
      const field = element.dataset.editorField;
      if (!field) return;
      onEdit(field, element.textContent?.trim() ?? '');
    });
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        element.blur();
      }
    });
  });
}

export function syncInlineFields(frame: Element, state: BuilderState): void {
  const map: Record<string, string> = {
    'business.name': state.business.name,
    'business.industry': state.business.industry,
    'hero.title': state.heroTitle?.trim() || state.business.name,
    'hero.subtitle': state.heroSubtitle,
    'hero.description': state.business.description,
    'cta.quote': state.ctaQuoteLabel,
  };

  frame.querySelectorAll('[data-editor-field]').forEach((node) => {
    const field = (node as HTMLElement).dataset.editorField;
    if (!field || map[field] === undefined) return;
    if (document.activeElement === node) return;
    node.textContent = map[field];
  });
}
