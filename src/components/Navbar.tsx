import React, { useState } from 'react';
import { 
  BookOpen, 
  Monitor, 
  Presentation, 
  ListOrdered, 
  BarChart2, 
  Download, 
  Sparkles, 
  UploadCloud, 
  Settings, 
  Palette, 
  Check, 
  ChevronDown,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileJson,
  Printer
} from 'lucide-react';
import { Theme, ViewMode, WebsiteConfig } from '../types';
import { THEMES } from '../utils/theme';

interface NavbarProps {
  config: WebsiteConfig;
  onOpenConfig: () => void;
  onOpenUpload: () => void;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  currentTheme: Theme;
  onSelectTheme: (themeId: string) => void;
  onExport: (exportType: 'website' | 'ppt' | 'pdf' | 'csv' | 'txt' | 'json') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  onOpenConfig,
  onOpenUpload,
  viewMode,
  onSelectViewMode,
  currentTheme,
  onSelectTheme,
  onExport
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b px-4 md:px-6 transition-colors duration-200"
      style={{
        backgroundColor: currentTheme.cardBg,
        borderColor: currentTheme.border,
        color: currentTheme.text
      }}
    >
      {/* Brand & Upload */}
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg font-bold shadow-sm transition-transform hover:scale-105"
          style={{
            backgroundColor: currentTheme.accent,
            color: currentTheme.accentText
          }}
        >
          <Sparkles className="h-5 w-5" />
        </div>
        
        <div>
          <h1 className="text-base font-bold leading-tight tracking-tight md:text-lg flex items-center gap-2">
            {config.siteTitle}
          </h1>
          <p className="text-xs opacity-75 hidden sm:block leading-none mt-0.5" style={{ color: currentTheme.textSubtle }}>
            {config.siteSubtitle} • 40k Engine
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="ml-2 flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-xs transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: currentTheme.sidebarBg,
            borderColor: currentTheme.border,
            color: currentTheme.text
          }}
          title="Upload new Markdown file or load sample"
        >
          <UploadCloud className="h-4 w-4 text-emerald-500 animate-pulse" />
          <span className="hidden lg:inline">Upload Markdown</span>
        </button>

        <button
          onClick={onOpenConfig}
          className="flex items-center space-x-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold shadow-xs transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: currentTheme.sidebarBg,
            borderColor: currentTheme.border,
            color: currentTheme.text
          }}
          title="Customize branding & parameters"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden xl:inline">Configure</span>
        </button>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center rounded-lg p-1 border shadow-xs"
        style={{
          backgroundColor: currentTheme.sidebarBg,
          borderColor: currentTheme.border
        }}
      >
        <button
          onClick={() => onSelectViewMode('website')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
            viewMode === 'website' ? 'shadow-sm scale-102 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: viewMode === 'website' ? currentTheme.accent : 'transparent',
            color: viewMode === 'website' ? currentTheme.accentText : currentTheme.text
          }}
        >
          <Monitor className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Website</span>
        </button>

        <button
          onClick={() => onSelectViewMode('book')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
            viewMode === 'book' ? 'shadow-sm scale-102 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: viewMode === 'book' ? currentTheme.accent : 'transparent',
            color: viewMode === 'book' ? currentTheme.accentText : currentTheme.text
          }}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Book Reader</span>
        </button>

        <button
          onClick={() => onSelectViewMode('presentation')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
            viewMode === 'presentation' ? 'shadow-sm scale-102 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: viewMode === 'presentation' ? currentTheme.accent : 'transparent',
            color: viewMode === 'presentation' ? currentTheme.accentText : currentTheme.text
          }}
        >
          <Presentation className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Slide Deck</span>
        </button>

        <button
          onClick={() => onSelectViewMode('lines')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
            viewMode === 'lines' ? 'shadow-sm scale-102 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: viewMode === 'lines' ? currentTheme.accent : 'transparent',
            color: viewMode === 'lines' ? currentTheme.accentText : currentTheme.text
          }}
        >
          <ListOrdered className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Line Inspector</span>
        </button>

        <button
          onClick={() => onSelectViewMode('stats')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
            viewMode === 'stats' ? 'shadow-sm scale-102 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: viewMode === 'stats' ? currentTheme.accent : 'transparent',
            color: viewMode === 'stats' ? currentTheme.accentText : currentTheme.text
          }}
        >
          <BarChart2 className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Analytics</span>
        </button>
      </div>

      {/* Themes & Export Dropdowns */}
      <div className="flex items-center space-x-2">
        {/* Theme Select */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowExportMenu(false);
            }}
            className="flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-xs transition-all hover:opacity-90"
            style={{
              backgroundColor: currentTheme.sidebarBg,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
          >
            <Palette className="h-4 w-4" style={{ color: currentTheme.accent }} />
            <span className="hidden lg:inline">{currentTheme.name}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>

          {showThemeMenu && (
            <div 
              className="absolute right-0 mt-2 w-72 rounded-xl border shadow-2xl p-2 z-50 max-h-96 overflow-y-auto grid grid-cols-1 gap-1"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: currentTheme.border,
                color: currentTheme.text
              }}
            >
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider" style={{ color: currentTheme.textSubtle }}>
                Select Page Theme (20 Themes)
              </div>
              
              {THEMES.map((theme) => {
                const isActive = theme.id === currentTheme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onSelectTheme(theme.id);
                      setShowThemeMenu(false);
                    }}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      isActive ? 'font-bold shadow-xs' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isActive ? currentTheme.accent : 'transparent',
                      color: isActive ? currentTheme.accentText : currentTheme.text
                    }}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div 
                        className="h-4 w-4 rounded-full border shadow-inner flex shrink-0"
                        style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                      />
                      <span className="truncate max-w-[170px]">{theme.name}</span>
                    </div>
                    
                    <span 
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md uppercase"
                      style={{ 
                        backgroundColor: isActive ? 'rgba(0,0,0,0.2)' : theme.sidebarBg,
                        color: isActive ? currentTheme.accentText : theme.textSubtle
                      }}
                    >
                      {theme.category}
                    </span>
                    {isActive && <Check className="h-3.5 w-3.5 ml-1" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Export Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowExportMenu(!showExportMenu);
              setShowThemeMenu(false);
            }}
            className="flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold shadow-md transition-transform hover:scale-102 active:scale-95"
            style={{
              backgroundColor: currentTheme.accent,
              color: currentTheme.accentText
            }}
          >
            <Download className="h-4 w-4 animate-bounce" />
            <span className="hidden sm:inline">Export Website</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {showExportMenu && (
            <div 
              className="absolute right-0 mt-2 w-64 rounded-xl border shadow-2xl p-2 z-50 flex flex-col gap-1"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: currentTheme.border,
                color: currentTheme.text
              }}
            >
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider" style={{ color: currentTheme.textSubtle }}>
                Export Options (Fully Offline)
              </div>

              <button
                onClick={() => { onExport('website'); setShowExportMenu(false); }}
                className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <FileCode className="h-4 w-4 text-blue-500" />
                <div className="flex flex-col text-left">
                  <span>Standalone HTML Website</span>
                  <span className="text-[10px] font-normal opacity-70">Single responsive web file</span>
                </div>
              </button>

              <button
                onClick={() => { onExport('ppt'); setShowExportMenu(false); }}
                className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <Presentation className="h-4 w-4 text-orange-500" />
                <div className="flex flex-col text-left">
                  <span>Interactive Slide Deck</span>
                  <span className="text-[10px] font-normal opacity-70">Interactive HTML Presentation</span>
                </div>
              </button>

              <button
                onClick={() => { onExport('pdf'); setShowExportMenu(false); }}
                className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <Printer className="h-4 w-4 text-red-500" />
                <div className="flex flex-col text-left">
                  <span>Formatted Book / PDF</span>
                  <span className="text-[10px] font-normal opacity-70">Clean print styling</span>
                </div>
              </button>

              <button
                onClick={() => { onExport('csv'); setShowExportMenu(false); }}
                className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                <div className="flex flex-col text-left">
                  <span>Structured CSV / Excel</span>
                  <span className="text-[10px] font-normal opacity-70">Chapters & metrics data</span>
                </div>
              </button>

              <button
                onClick={() => { onExport('json'); setShowExportMenu(false); }}
                className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <FileJson className="h-4 w-4 text-purple-500" />
                <div className="flex flex-col text-left">
                  <span>Structured JSON Token Map</span>
                  <span className="text-[10px] font-normal opacity-70">Complete document AST payload</span>
                </div>
              </button>

              <button
                onClick={() => { onExport('txt'); setShowExportMenu(false); }}
                className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <FileText className="h-4 w-4 text-gray-500" />
                <div className="flex flex-col text-left">
                  <span>Raw Plain Text (.txt)</span>
                  <span className="text-[10px] font-normal opacity-70">Universal UTF-8 text bundle</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
