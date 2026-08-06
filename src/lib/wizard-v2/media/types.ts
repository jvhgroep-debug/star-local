/** Media source — extend with `r2` when Cloudflare uploads are enabled. */
export type WizardMediaSource = 'placeholder' | 'local' | 'r2';

export interface WizardMediaAsset {
  url: string;
  label: string;
  source: WizardMediaSource;
  /** Future: R2 object key for persisted uploads. */
  r2Key?: string;
}

export interface WizardResolvedMedia {
  logo: WizardMediaAsset;
  hero: WizardMediaAsset;
  gallery: WizardMediaAsset[];
}
