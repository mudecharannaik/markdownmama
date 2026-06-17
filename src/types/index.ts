export type ThemeCategory = 'Light' | 'Dark' | 'Colorful' | 'Monochrome' | 'High Contrast';

export interface Theme {
  id: string;
  name: string;
  category: ThemeCategory;
  bg: string;
  text: string;
  textSubtle: string;
  sidebarBg: string;
  cardBg: string;
  border: string;
  accent: string;
  accentHover: string;
  accentText: string;
  codeBg: string;
  codeText: string;
  fontFamily: string;
}

export interface DocumentStats {
  lineCount: number;
  wordCount: number;
  charCount: number;
  readTimeMinutes: number;
  headingsCount: number;
  codeBlocksCount: number;
  tablesCount: number;
  fileSizeKb: string;
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
  startLine: number;
}

export interface Chapter {
  id: string;
  title: string;
  level: number;
  startLine: number;
  endLine: number;
  rawMarkdown: string;
  htmlContent?: string;
  subChapters?: Chapter[];
}

export interface LineItem {
  lineNumber: number;
  raw: string;
  type: 'heading' | 'code' | 'table' | 'quote' | 'list' | 'paragraph' | 'blank';
  level?: number;
}

export interface PresentationSlide {
  id: string;
  title: string;
  subtitle?: string;
  contentHtml: string;
  notes?: string;
  slideNumber: number;
}

export interface WebsiteConfig {
  siteTitle: string;
  siteSubtitle: string;
  authorName: string;
  logoIcon: string;
  showLineNumbers: boolean;
  enableAdmonitions: boolean;
  enableSearch: boolean;
  activeThemeId: string;
  headingFontFamily: string;
  markdownFontFamily: string;
  codeFontFamily: string;
  fontScale: number;
}

export type ViewMode = 'website' | 'presentation' | 'book' | 'lines' | 'stats';
