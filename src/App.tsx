import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Theme, ViewMode, WebsiteConfig } from './types';
import { getThemeById } from './utils/theme';
import { DEFAULT_TYPOGRAPHY } from './utils/typography';
import { parseMassiveMarkdown, ParsedMarkdownResult } from './utils/markdownParser';
import { generateMassiveMockMarkdown } from './utils/mockData';
import {
  exportAsCsv,
  exportAsJson,
  exportAsPpt,
  exportAsStandaloneWebsite,
  exportAsTxt
} from './utils/exporter';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { WebsiteView } from './components/WebsiteView';
import { PresentationMode } from './components/PresentationMode';
import { BookMode } from './components/BookMode';
import { LineInspector } from './components/LineInspector';
import { StatsView } from './components/StatsView';
import { UploadModal } from './components/UploadModal';
import { ConfigModal } from './components/ConfigModal';
import { Sparkles } from 'lucide-react';

export function App() {
  const [config, setConfig] = useState<WebsiteConfig>({
    siteTitle: 'Hyper-Scale System Lexicon',
    siteSubtitle: 'Line Master Documentation Engine',
    authorName: 'Core Infrastructure Group',
    logoIcon: 'Sparkles',
    showLineNumbers: true,
    enableAdmonitions: true,
    enableSearch: true,
    activeThemeId: 'midnight-slate',
    ...DEFAULT_TYPOGRAPHY
  });

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => getThemeById(config.activeThemeId));
  const [viewMode, setViewMode] = useState<ViewMode>('website');

  const [parsedData, setParsedData] = useState<ParsedMarkdownResult | null>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string | undefined>(undefined);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleLoadSample = useCallback(async () => {
    const rawText = generateMassiveMockMarkdown();
    const result = await parseMassiveMarkdown(rawText);
    setParsedData(result);
    if (result.toc.length > 0) {
      setActiveHeadingId(result.toc[0].id);
    }
  }, []);

  const handleLoadCustomMarkdown = useCallback(async (content: string, filename?: string) => {
    const result = await parseMassiveMarkdown(content);
    setParsedData(result);
    if (filename) {
      setConfig((prev) => ({ ...prev, siteTitle: filename }));
    }
    if (result.toc.length > 0) {
      setActiveHeadingId(result.toc[0].id);
    }
  }, []);

  useEffect(() => {
    handleLoadSample();
  }, [handleLoadSample]);

  // Fully synchronize Core Application UI & Custom Markdown HTML styles with CSS variables
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--bg-color', currentTheme.bg);
    root.setProperty('--text-color', currentTheme.text);
    root.setProperty('--text-subtle', currentTheme.textSubtle);
    root.setProperty('--sidebar-bg', currentTheme.sidebarBg);
    root.setProperty('--card-bg', currentTheme.cardBg);
    root.setProperty('--border-color', currentTheme.border);
    root.setProperty('--accent-color', currentTheme.accent);
    root.setProperty('--accent-hover', currentTheme.accentHover);
    root.setProperty('--accent-text', currentTheme.accentText);
    root.setProperty('--code-bg', currentTheme.codeBg);
    root.setProperty('--code-text', currentTheme.codeText);
    root.setProperty('--font-family', config.markdownFontFamily || currentTheme.fontFamily);
    root.setProperty('--heading-font', config.headingFontFamily || currentTheme.fontFamily);
    root.setProperty('--markdown-font', config.markdownFontFamily || currentTheme.fontFamily);
    root.setProperty('--code-font', config.codeFontFamily || 'monospace');
    root.setProperty('--global-font-scale', String((config.fontScale || 100) / 100));

    document.body.style.backgroundColor = currentTheme.bg;
    document.body.style.color = currentTheme.text;
    document.body.style.fontFamily = config.markdownFontFamily || currentTheme.fontFamily;
    document.body.style.fontSize = `${config.fontScale || 100}%`;
  }, [currentTheme, config.headingFontFamily, config.markdownFontFamily, config.codeFontFamily, config.fontScale]);

  const handleSelectTheme = (themeId: string) => {
    const chosen = getThemeById(themeId);
    setCurrentTheme(chosen);
    setConfig((prev) => ({ ...prev, activeThemeId: themeId }));
  };

  const handleExport = (exportType: 'website' | 'ppt' | 'pdf' | 'csv' | 'txt' | 'json') => {
    if (!parsedData) return;

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.3 } });

    switch (exportType) {
      case 'website':
        exportAsStandaloneWebsite(parsedData, config, currentTheme);
        break;
      case 'ppt':
        exportAsPpt(parsedData, config, currentTheme);
        break;
      case 'pdf':
        window.print();
        break;
      case 'csv':
        exportAsCsv(parsedData, config);
        break;
      case 'txt': {
        const fullRaw = parsedData.chapters.map((c) => c.rawMarkdown).join('\n\n');
        exportAsTxt(fullRaw, config);
        break;
      }
      case 'json':
        exportAsJson(parsedData, config);
        break;
    }
  };

  if (!parsedData) {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center select-none"
        style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
      >
        <div className="text-center space-y-4">
          <Sparkles className="h-14 w-14 mx-auto animate-spin" style={{ color: currentTheme.accent }} />
          <h2 className="text-2xl font-black tracking-tight">Markdown to Other files…</h2>
          <p className="text-xs opacity-60 font-mono">Initializing High-Performance Markdown Tokenizer</p>
        </div>
      </div>
    );
  }

  const searchResultsCount = parsedData.toc.filter((h) =>
    sidebarSearchQuery.trim()
      ? h.text.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
      : false
  ).length;

  return (
    <div
      className="flex min-h-screen flex-col w-full"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
        fontFamily: config.markdownFontFamily || currentTheme.fontFamily,
        fontSize: `${config.fontScale || 100}%`
      }}
    >
      {/* ── Navbar ── */}
      <Navbar
        config={config}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        viewMode={viewMode}
        onSelectViewMode={(mode) => {
          setViewMode(mode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        onExport={handleExport}
      />

      {/* ── Body ── */}
      <div className="flex flex-1 w-full relative">
        {/* Sidebar shown in Website & Book modes */}
        {(viewMode === 'website' || viewMode === 'book') && (
          <Sidebar
            toc={parsedData.toc}
            currentTheme={currentTheme}
            activeHeadingId={activeHeadingId}
            onSelectHeading={(id) => {
              setActiveHeadingId(id);
              if (viewMode === 'website') {
                setTimeout(() => {
                  // For H1/H2, getElementById returns the <article> container. We need the actual heading tag inside it.
                  let targetEl = document.getElementById(id);
                  if (targetEl && targetEl.tagName === 'ARTICLE') {
                    // Search inside the article for the matching heading tag
                    const innerHeading = targetEl.querySelector(`h1[id="${id}"], h2[id="${id}"], h3[id="${id}"], h4[id="${id}"], h5[id="${id}"], h6[id="${id}"]`);
                    if (innerHeading) {
                      innerHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      // Glow the actual heading
                      const glowTarget = innerHeading as HTMLElement;
                      glowTarget.style.transition = 'all 0.4s ease';
                      glowTarget.style.backgroundColor = currentTheme.category === 'Dark' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(37, 99, 235, 0.15)';
                      glowTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.5)';
                      setTimeout(() => {
                        glowTarget.style.backgroundColor = 'transparent';
                        glowTarget.style.boxShadow = 'none';
                      }, 2000);
                    } else {
                      // Fallback: scroll to the article card itself
                      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    return;
                  }
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Glow highlight
                    targetEl.style.transition = 'all 0.4s ease';
                    targetEl.style.backgroundColor = currentTheme.category === 'Dark' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(37, 99, 235, 0.15)';
                    targetEl.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.5)';
                    setTimeout(() => {
                      targetEl.style.backgroundColor = 'transparent';
                      targetEl.style.boxShadow = 'none';
                    }, 2000);
                  }
                }, 80);
              }
            }}
            searchQuery={sidebarSearchQuery}
            onSearchChange={setSidebarSearchQuery}
            searchResultsCount={searchResultsCount}
          />
        )}

        {/* ── Main canvas ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {viewMode === 'website' && (
            <WebsiteView
              chapters={parsedData.chapters}
              toc={parsedData.toc}
              currentTheme={currentTheme}
              config={config}
              onToggleLineNumbers={() =>
                setConfig((prev) => ({ ...prev, showLineNumbers: !prev.showLineNumbers }))
              }
              activeHeadingId={activeHeadingId}
            />
          )}

          {viewMode === 'presentation' && (
            <PresentationMode
              slides={parsedData.slides}
              currentTheme={currentTheme}
              config={config}
              onExportPpt={() => handleExport('ppt')}
            />
          )}

          {viewMode === 'book' && (
            <BookMode
              chapters={parsedData.chapters}
              toc={parsedData.toc}
              currentTheme={currentTheme}
              config={config}
              activeHeadingId={activeHeadingId}
            />
          )}

          {viewMode === 'lines' && (
            <LineInspector
              lineItems={parsedData.lineItems}
              currentTheme={currentTheme}
            />
          )}

          {viewMode === 'stats' && (
            <StatsView
              stats={parsedData.stats}
              currentTheme={currentTheme}
              config={config}
            />
          )}
        </main>
      </div>

      {/* ── Modals ── */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onLoadMarkdown={handleLoadCustomMarkdown}
        onLoadSample={handleLoadSample}
        currentTheme={currentTheme}
      />

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={(newConf) => setConfig(newConf)}
        currentTheme={currentTheme}
      />
    </div>
  );
}

export default App;
