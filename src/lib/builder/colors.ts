export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

/** Relative luminance for WCAG contrast checks. */
function luminance(r: number, g: number, b: number): number {
  const channels = [r, g, b].map((value) => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(colorA: string, colorB: string): number {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  if (!rgbA || !rgbB) return 1;

  const lumA = luminance(rgbA.r, rgbA.g, rgbA.b);
  const lumB = luminance(rgbB.r, rgbB.g, rgbB.b);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Pick readable text color against a background. */
export function readableTextColor(background: string): string {
  const whiteContrast = contrastRatio(background, '#ffffff');
  const darkContrast = contrastRatio(background, '#111827');
  return whiteContrast >= darkContrast ? '#ffffff' : '#111827';
}

export function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}
