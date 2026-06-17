import { Theme } from '../types';

export const THEMES: Theme[] = [
  // LIGHT THEMES
  {
    id: 'pristine-light',
    name: 'Pristine Light',
    category: 'Light',
    bg: '#ffffff',
    text: '#0f172a',
    textSubtle: '#64748b',
    sidebarBg: '#f8fafc',
    cardBg: '#ffffff',
    border: '#e2e8f0',
    accent: '#2563eb',
    accentHover: '#1d4ed8',
    accentText: '#ffffff',
    codeBg: '#f1f5f9',
    codeText: '#0f172a',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  {
    id: 'github-light',
    name: 'GitHub Clean Light',
    category: 'Light',
    bg: '#f6f8fa',
    text: '#1f2328',
    textSubtle: '#656d76',
    sidebarBg: '#ffffff',
    cardBg: '#ffffff',
    border: '#d0d7de',
    accent: '#0969da',
    accentHover: '#0550ae',
    accentText: '#ffffff',
    codeBg: '#eff2f5',
    codeText: '#24292f',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
  },
  {
    id: 'solarized-light',
    name: 'Solarized Parchment',
    category: 'Light',
    bg: '#fdf6e3',
    text: '#073642',
    textSubtle: '#586e75',
    sidebarBg: '#eee8d5',
    cardBg: '#fdf6e3',
    border: '#d3c6a6',
    accent: '#268bd2',
    accentHover: '#2075c0',
    accentText: '#ffffff',
    codeBg: '#eee8d5',
    codeText: '#b58900',
    fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif'
  },
  {
    id: 'sepia-manuscript',
    name: 'Sepia Classic',
    category: 'Light',
    bg: '#fbf0d9',
    text: '#43302e',
    textSubtle: '#7c6561',
    sidebarBg: '#f2e3c6',
    cardBg: '#fbf0d9',
    border: '#e2d0ab',
    accent: '#9e2a2b',
    accentHover: '#822022',
    accentText: '#ffffff',
    codeBg: '#f0e1c3',
    codeText: '#671d1e',
    fontFamily: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif'
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze Light',
    category: 'Light',
    bg: '#f0f9ff',
    text: '#0369a1',
    textSubtle: '#0284c7',
    sidebarBg: '#e0f2fe',
    cardBg: '#ffffff',
    border: '#bae6fd',
    accent: '#0284c7',
    accentHover: '#0369a1',
    accentText: '#ffffff',
    codeBg: '#e0f2fe',
    codeText: '#075985',
    fontFamily: 'Inter, system-ui, sans-serif'
  },

  // DARK THEMES
  {
    id: 'deep-obsidian',
    name: 'Deep Obsidian Pure Black',
    category: 'Dark',
    bg: '#000000',
    text: '#f8fafc',
    textSubtle: '#94a3b8',
    sidebarBg: '#090d16',
    cardBg: '#111827',
    border: '#1f2937',
    accent: '#10b981',
    accentHover: '#059669',
    accentText: '#000000',
    codeBg: '#111827',
    codeText: '#34d399',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  {
    id: 'midnight-slate',
    name: 'Midnight Slate',
    category: 'Dark',
    bg: '#0f172a',
    text: '#e2e8f0',
    textSubtle: '#94a3b8',
    sidebarBg: '#1e293b',
    cardBg: '#1e293b',
    border: '#334155',
    accent: '#38bdf8',
    accentHover: '#0284c7',
    accentText: '#0f172a',
    codeBg: '#090d16',
    codeText: '#7dd3fc',
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  {
    id: 'dracula-dark',
    name: 'Dracula Midnight',
    category: 'Dark',
    bg: '#282a36',
    text: '#f8f8f2',
    textSubtle: '#6272a4',
    sidebarBg: '#21222c',
    cardBg: '#44475a',
    border: '#6272a4',
    accent: '#ff79c6',
    accentHover: '#ff92d0',
    accentText: '#282a36',
    codeBg: '#21222c',
    codeText: '#8be9fd',
    fontFamily: '"Fira Code", "Source Code Pro", monospace'
  },
  {
    id: 'nordic-frost',
    name: 'Nord Frost',
    category: 'Dark',
    bg: '#2e3440',
    text: '#eceff4',
    textSubtle: '#d8dee9',
    sidebarBg: '#3b4252',
    cardBg: '#434c5e',
    border: '#4c566a',
    accent: '#88c0d0',
    accentHover: '#81a1c1',
    accentText: '#2e3440',
    codeBg: '#242933',
    codeText: '#a3be8c',
    fontFamily: 'Rubik, system-ui, sans-serif'
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark Deep',
    category: 'Dark',
    bg: '#002b36',
    text: '#93a1a1',
    textSubtle: '#586e75',
    sidebarBg: '#073642',
    cardBg: '#073642',
    border: '#586e75',
    accent: '#b58900',
    accentHover: '#cb4b16',
    accentText: '#002b36',
    codeBg: '#001e26',
    codeText: '#2aa198',
    fontFamily: 'Georgia, Cambria, serif'
  },

  // COLORFUL & ARTISTIC
  {
    id: 'tokyo-night',
    name: 'Tokyo Night Neon',
    category: 'Colorful',
    bg: '#1a1b26',
    text: '#c0caf5',
    textSubtle: '#7aa2f7',
    sidebarBg: '#16161e',
    cardBg: '#24283b',
    border: '#414868',
    accent: '#bb9af7',
    accentHover: '#9d7cd8',
    accentText: '#1a1b26',
    codeBg: '#101014',
    codeText: '#7dcfff',
    fontFamily: '"Segoe UI", Roboto, Helvetica, sans-serif'
  },
  {
    id: 'cyberpunk-2077',
    name: 'Cyberpunk Neon',
    category: 'Colorful',
    bg: '#120324',
    text: '#fae03c',
    textSubtle: '#f0528b',
    sidebarBg: '#1f063b',
    cardBg: '#2d0954',
    border: '#f0528b',
    accent: '#00f0ff',
    accentHover: '#00c4d1',
    accentText: '#120324',
    codeBg: '#0b0217',
    codeText: '#00f0ff',
    fontFamily: '"Courier New", Courier, monospace'
  },
  {
    id: 'matcha-green',
    name: 'Matcha Botanical',
    category: 'Colorful',
    bg: '#f0f7f4',
    text: '#1b4332',
    textSubtle: '#40916c',
    sidebarBg: '#d8f3dc',
    cardBg: '#ffffff',
    border: '#b7e4c7',
    accent: '#2d6a4f',
    accentHover: '#1b4332',
    accentText: '#ffffff',
    codeBg: '#e2ece9',
    codeText: '#081c15',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    category: 'Colorful',
    bg: '#fffbeb',
    text: '#78350f',
    textSubtle: '#b45309',
    sidebarBg: '#fef3c7',
    cardBg: '#ffffff',
    border: '#fde68a',
    accent: '#ea580c',
    accentHover: '#c05621',
    accentText: '#ffffff',
    codeBg: '#fef3c7',
    codeText: '#9a3412',
    fontFamily: 'system-ui, sans-serif'
  },
  {
    id: 'royal-amethyst',
    name: 'Royal Amethyst',
    category: 'Colorful',
    bg: '#2e1065',
    text: '#f3e8ff',
    textSubtle: '#c084fc',
    sidebarBg: '#1e0748',
    cardBg: '#3b0764',
    border: '#581c87',
    accent: '#d8b4fe',
    accentHover: '#e9d5ff',
    accentText: '#2e1065',
    codeBg: '#1e0748',
    codeText: '#e9d5ff',
    fontFamily: 'Inter, system-ui, sans-serif'
  },

  // HIGH CONTRAST & ACCESSIBLE
  {
    id: 'high-contrast-light',
    name: 'High Contrast Light',
    category: 'High Contrast',
    bg: '#ffffff',
    text: '#000000',
    textSubtle: '#000000',
    sidebarBg: '#ffffff',
    cardBg: '#ffffff',
    border: '#000000',
    accent: '#000000',
    accentHover: '#333333',
    accentText: '#ffffff',
    codeBg: '#ffffff',
    codeText: '#000000',
    fontFamily: 'Verdana, sans-serif'
  },
  {
    id: 'high-contrast-dark',
    name: 'High Contrast Dark',
    category: 'High Contrast',
    bg: '#000000',
    text: '#ffffff',
    textSubtle: '#ffff00',
    sidebarBg: '#000000',
    cardBg: '#000000',
    border: '#ffffff',
    accent: '#ffff00',
    accentHover: '#ffcc00',
    accentText: '#000000',
    codeBg: '#000000',
    codeText: '#ffff00',
    fontFamily: 'Verdana, sans-serif'
  },

  // MONOCHROME & VINTAGE
  {
    id: 'charcoal-elegance',
    name: 'Charcoal Minimal',
    category: 'Monochrome',
    bg: '#18181b',
    text: '#f4f4f5',
    textSubtle: '#a1a1aa',
    sidebarBg: '#27272a',
    cardBg: '#27272a',
    border: '#3f3f46',
    accent: '#e4e4e7',
    accentHover: '#ffffff',
    accentText: '#18181b',
    codeBg: '#0f0f12',
    codeText: '#d4d4d8',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
  },
  {
    id: 'velvet-coffee',
    name: 'Velvet Coffee Espresso',
    category: 'Monochrome',
    bg: '#261c14',
    text: '#f3e5ab',
    textSubtle: '#d97706',
    sidebarBg: '#1c140e',
    cardBg: '#36271c',
    border: '#543d2b',
    accent: '#f59e0b',
    accentHover: '#fbbf24',
    accentText: '#261c14',
    codeBg: '#1a120c',
    codeText: '#fcd34d',
    fontFamily: 'Georgia, Cambria, serif'
  },
  {
    id: 'retro-terminal',
    name: 'Retro 80s Terminal',
    category: 'Monochrome',
    bg: '#050505',
    text: '#22c55e',
    textSubtle: '#16a34a',
    sidebarBg: '#0a100d',
    cardBg: '#0a150f',
    border: '#15803d',
    accent: '#4ade80',
    accentHover: '#86efac',
    accentText: '#050505',
    codeBg: '#000000',
    codeText: '#4ade80',
    fontFamily: '"Courier New", Courier, monospace'
  }
];

export function getThemeById(id: string): Theme {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

export function generateThemeCssVariables(theme: Theme): string {
  return `
    --bg-color: ${theme.bg};
    --text-color: ${theme.text};
    --text-subtle: ${theme.textSubtle};
    --sidebar-bg: ${theme.sidebarBg};
    --card-bg: ${theme.cardBg};
    --border-color: ${theme.border};
    --accent-color: ${theme.accent};
    --accent-hover: ${theme.accentHover};
    --accent-text: ${theme.accentText};
    --code-bg: ${theme.codeBg};
    --code-text: ${theme.codeText};
    --font-family: ${theme.fontFamily};
  `;
}
