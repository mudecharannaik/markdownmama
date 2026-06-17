export const FONT_OPTIONS = [
  { id: 'system', name: 'System Sans', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { id: 'serif', name: 'Classic Serif', value: 'Georgia, Cambria, "Times New Roman", serif' },
  { id: 'mono', name: 'Technical Mono', value: '"Courier New", Courier, monospace' },
  { id: 'rounded', name: 'Rounded UI', value: 'ui-rounded, "SF Pro Rounded", "Segoe UI", system-ui, sans-serif' },
  { id: 'editorial', name: 'Editorial Reader', value: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif' }
];

export const DEFAULT_TYPOGRAPHY = {
  headingFontFamily: FONT_OPTIONS[0].value,
  markdownFontFamily: FONT_OPTIONS[1].value,
  codeFontFamily: FONT_OPTIONS[2].value,
  fontScale: 100
};
