export const EDITOR_PATH = '/dashboard/editor/';

export const EDITOR_NAV = [
  { id: 'website', label: 'Website', icon: '🏠' },
  { id: 'pages', label: "Pagina's", icon: '📝' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'media', label: 'Afbeeldingen', icon: '🖼' },
  { id: 'contact', label: 'Contact', icon: '📞' },
  { id: 'services', label: 'Diensten', icon: '⭐' },
  { id: 'seo', label: 'SEO', icon: '📈' },
  { id: 'settings', label: 'Instellingen', icon: '⚙' },
] as const;

export type EditorNavSection = (typeof EDITOR_NAV)[number]['id'];

export const EDITOR_PREVIEW_PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Over ons' },
  { id: 'services', label: 'Diensten' },
  { id: 'contact', label: 'Contact' },
  { id: 'privacy', label: 'Privacy' },
] as const;

export type EditorViewport = 'desktop' | 'tablet' | 'mobile';

export const EDITOR_VIEWPORTS: { id: EditorViewport; label: string }[] = [
  { id: 'desktop', label: 'Desktop' },
  { id: 'tablet', label: 'Tablet' },
  { id: 'mobile', label: 'Mobiel' },
];

export const EDITOR_FONTS = [
  { id: 'system', label: 'Systeem (modern)' },
  { id: 'serif', label: 'Klassiek serif' },
  { id: 'modern', label: 'Sans modern' },
  { id: 'display', label: 'Display' },
] as const;

export const EDITOR_BUTTON_STYLES = [
  { id: 'solid', label: 'Solid' },
  { id: 'soft', label: 'Soft' },
  { id: 'outline', label: 'Outline' },
] as const;

export const EDITOR_CORNER_RADIUS = [
  { id: 'sharp', label: 'Scherp' },
  { id: 'rounded', label: 'Afgerond' },
  { id: 'pill', label: 'Pill' },
] as const;

export const EDITOR_SHADOWS = [
  { id: 'none', label: 'Geen' },
  { id: 'soft', label: 'Zacht' },
  { id: 'medium', label: 'Medium' },
] as const;
