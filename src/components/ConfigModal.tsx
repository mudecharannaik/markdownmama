import React, { useEffect, useState } from 'react';
import { Settings, X, Save, Sparkles, Check } from 'lucide-react';
import { Theme, WebsiteConfig } from '../types';
import { FONT_OPTIONS } from '../utils/typography';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WebsiteConfig;
  onSaveConfig: (newConfig: WebsiteConfig) => void;
  currentTheme: Theme;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  currentTheme
}) => {
  const [siteTitle, setSiteTitle] = useState(config.siteTitle);
  const [siteSubtitle, setSiteSubtitle] = useState(config.siteSubtitle);
  const [authorName, setAuthorName] = useState(config.authorName);
  const [showLineNumbers, setShowLineNumbers] = useState(config.showLineNumbers);
  const [enableAdmonitions, setEnableAdmonitions] = useState(config.enableAdmonitions);
  const [headingFontFamily, setHeadingFontFamily] = useState(config.headingFontFamily);
  const [markdownFontFamily, setMarkdownFontFamily] = useState(config.markdownFontFamily);
  const [codeFontFamily, setCodeFontFamily] = useState(config.codeFontFamily);
  const [fontScale, setFontScale] = useState(config.fontScale || 100);

  useEffect(() => {
    if (!isOpen) return;
    setSiteTitle(config.siteTitle);
    setSiteSubtitle(config.siteSubtitle);
    setAuthorName(config.authorName);
    setShowLineNumbers(config.showLineNumbers);
    setEnableAdmonitions(config.enableAdmonitions);
    setHeadingFontFamily(config.headingFontFamily);
    setMarkdownFontFamily(config.markdownFontFamily);
    setCodeFontFamily(config.codeFontFamily);
    setFontScale(config.fontScale || 100);
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      siteTitle: siteTitle.trim() || 'Markdown Doc Engine',
      siteSubtitle: siteSubtitle.trim() || 'Massive Document Renderer',
      authorName: authorName.trim() || 'System Architect',
      showLineNumbers,
      enableAdmonitions,
      headingFontFamily,
      markdownFontFamily,
      codeFontFamily,
      fontScale
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-fade-in select-none">
      <div 
        className="relative w-full max-w-2xl rounded-3xl border shadow-2xl p-8 flex flex-col space-y-6 overflow-y-auto max-h-[92vh] transition-all duration-300 animate-scale-up"
        style={{
          backgroundColor: currentTheme.cardBg,
          borderColor: currentTheme.border,
          color: currentTheme.text
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold"
              style={{ backgroundColor: currentTheme.accent, color: currentTheme.accentText }}
            >
              <Settings className="h-5 w-5 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-black">Website Customization</h2>
              <p className="text-xs opacity-70 mt-0.5">Customize metadata & active UI features</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 opacity-60 hover:opacity-100" />
          </button>
        </div>

        {/* Customization Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-extrabold uppercase tracking-wider opacity-80">
              Website Brand Title
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="e.g. Master Deployment Specification"
              className="w-full rounded-xl border p-3 text-xs font-semibold focus:outline-none"
              style={{
                backgroundColor: currentTheme.sidebarBg,
                borderColor: currentTheme.border,
                color: currentTheme.text
              }}
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-extrabold uppercase tracking-wider opacity-80">
              Website Tagline / Subtitle
            </label>
            <input
              type="text"
              value={siteSubtitle}
              onChange={(e) => setSiteSubtitle(e.target.value)}
              placeholder="e.g. Volume IV: Distributed Infrastructure"
              className="w-full rounded-xl border p-3 text-xs font-semibold focus:outline-none"
              style={{
                backgroundColor: currentTheme.sidebarBg,
                borderColor: currentTheme.border,
                color: currentTheme.text
              }}
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-extrabold uppercase tracking-wider opacity-80">
              Author / Organization Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Global Enterprise Core Engineering"
              className="w-full rounded-xl border p-3 text-xs font-semibold focus:outline-none"
              style={{
                backgroundColor: currentTheme.sidebarBg,
                borderColor: currentTheme.border,
                color: currentTheme.text
              }}
              required
            />
          </div>

          {/* Typography */}
          <div className="pt-2 space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider opacity-80 text-left border-b pb-1" style={{ borderColor: currentTheme.border }}>
              Typography & Page Size
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FontSelect label="Header Font" value={headingFontFamily} onChange={setHeadingFontFamily} currentTheme={currentTheme} />
              <FontSelect label="Markdown Font" value={markdownFontFamily} onChange={setMarkdownFontFamily} currentTheme={currentTheme} />
              <FontSelect label="Code Font" value={codeFontFamily} onChange={setCodeFontFamily} currentTheme={currentTheme} />
            </div>

            <div className="rounded-xl border p-3 flex items-center justify-between gap-3" style={{ backgroundColor: currentTheme.sidebarBg, borderColor: currentTheme.border }}>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold">Global Font Size</span>
                <span className="text-[10px] opacity-70">Applies to website, book, slides, line inspector, and analytics.</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => setFontScale(Math.max(75, fontScale - 5))} className="rounded-lg border px-3 py-1 text-xs font-black" style={{ borderColor: currentTheme.border, backgroundColor: currentTheme.cardBg, color: currentTheme.text }}>-</button>
                <span className="font-mono text-xs font-bold min-w-12 text-center" style={{ color: currentTheme.accent }}>{fontScale}%</span>
                <button type="button" onClick={() => setFontScale(Math.min(150, fontScale + 5))} className="rounded-lg border px-3 py-1 text-xs font-black" style={{ borderColor: currentTheme.border, backgroundColor: currentTheme.cardBg, color: currentTheme.text }}>+</button>
              </div>
            </div>
          </div>

          {/* Interactive Feature Checkboxes */}
          <div className="pt-2 space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider opacity-80 text-left border-b pb-1" style={{ borderColor: currentTheme.border }}>
              Feature Parameters
            </div>

            <label 
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all hover:scale-101"
              style={{
                backgroundColor: showLineNumbers ? `${currentTheme.accent}22` : currentTheme.sidebarBg,
                borderColor: showLineNumbers ? currentTheme.accent : currentTheme.border
              }}
            >
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold flex items-center gap-2">
                  <span>Display Line Numbers by Default</span>
                </span>
                <span className="text-[10px] opacity-70 mt-0.5">Show line numbers next to headings and code blocks</span>
              </div>
              <div className="h-5 w-5 rounded border flex items-center justify-center font-bold shrink-0"
                style={{ backgroundColor: showLineNumbers ? currentTheme.accent : 'transparent', borderColor: currentTheme.border }}
              >
                {showLineNumbers && <Check className="h-3.5 w-3.5" style={{ color: currentTheme.accentText }} />}
              </div>
            </label>

            <label 
              onClick={() => setEnableAdmonitions(!enableAdmonitions)}
              className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all hover:scale-101"
              style={{
                backgroundColor: enableAdmonitions ? `${currentTheme.accent}22` : currentTheme.sidebarBg,
                borderColor: enableAdmonitions ? currentTheme.accent : currentTheme.border
              }}
            >
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Parse GitHub Admonitions (!IMPORTANT / !WARNING)</span>
                </span>
                <span className="text-[10px] opacity-70 mt-0.5">Transforms callouts into vibrant alert boxes</span>
              </div>
              <div className="h-5 w-5 rounded border flex items-center justify-center font-bold shrink-0"
                style={{ backgroundColor: enableAdmonitions ? currentTheme.accent : 'transparent', borderColor: currentTheme.border }}
              >
                {enableAdmonitions && <Check className="h-3.5 w-3.5" style={{ color: currentTheme.accentText }} />}
              </div>
            </label>
          </div>

          {/* Save Action */}
          <button
            type="submit"
            className="w-full rounded-xl py-3.5 text-xs font-extrabold shadow-xl transition-transform hover:scale-102 active:scale-98 flex items-center justify-center space-x-2 mt-4"
            style={{
              backgroundColor: currentTheme.accent,
              color: currentTheme.accentText
            }}
          >
            <Save className="h-4 w-4" />
            <span>Save Configurations & Apply to Website</span>
          </button>
        </form>
      </div>
    </div>
  );
};

interface FontSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  currentTheme: Theme;
}

const FontSelect: React.FC<FontSelectProps> = ({ label, value, onChange, currentTheme }) => (
  <label className="flex flex-col gap-1.5 text-left">
    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-70">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border p-2.5 text-xs font-semibold focus:outline-none"
      style={{
        backgroundColor: currentTheme.sidebarBg,
        borderColor: currentTheme.border,
        color: currentTheme.text
      }}
    >
      {FONT_OPTIONS.map((font) => (
        <option key={font.id} value={font.value}>
          {font.name}
        </option>
      ))}
    </select>
  </label>
);
