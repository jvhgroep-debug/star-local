/**
 * Future AI enhancement hook.
 *
 * Today: templates + variations only (no API calls).
 * Later: pass composed sections to OpenAI (or similar) to rewrite for fluency
 * while keeping facts (city, province, price, postal codes) locked.
 *
 * Example future flow:
 *   const draft = composePage(ctx);
 *   const enhanced = await enhanceWithAi(draft, { model: 'gpt-4.1-mini' });
 */

import type { ComposedPageContent } from './types';

export interface AiEnhanceOptions {
  /** When false (default), returns content unchanged. */
  enabled?: boolean;
  model?: string;
  /** Sections allowed to be rewritten by AI. */
  sections?: Array<keyof ComposedPageContent>;
}

/**
 * Placeholder for OpenAI (or other LLM) post-processing.
 * Keep deterministic template output until explicitly enabled.
 */
export async function enhanceWithAi(
  content: ComposedPageContent,
  options: AiEnhanceOptions = {},
): Promise<ComposedPageContent> {
  if (!options.enabled) {
    return content;
  }

  // Intentionally not implemented yet — wire OpenAI here later.
  throw new Error(
    'AI enhancement is not enabled yet. Use template composePage() until OpenAI is connected.',
  );
}
