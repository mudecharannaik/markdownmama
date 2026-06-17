import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Type, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Chapter, Theme, WebsiteConfig } from '../types';

import { useEffect } from 'react';
import { TocHeading } from '../types';

interface BookModeProps {
  chapters: Chapter[];
  toc: TocHeading[];
  currentTheme: Theme;
  config: WebsiteConfig;
  activeHeadingId?: string;
}

export const BookMode: React.FC<BookModeProps> = ({
  chapters,
  toc,
  currentTheme,
  config,
  activeHeadingId
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // When user clicks any TOC link in the sidebar, locate the correct Chapter
  // and smoothly jump to that subsection inside the reader.
  useEffect(() => {
    if (!activeHeadingId) return;
    const heading = toc.find((h) => h.id === activeHeadingId);
    if (!heading) return;

    const targetLine = heading.startLine;
    const foundChapIdx = chapters.findIndex(
      (c) => c.startLine <= targetLine && c.endLine >= targetLine
    );

    if (foundChapIdx !== -1) {
      setCurrentIdx(foundChapIdx);
      setTimeout(() => {
        const el = document.getElementById(activeHeadingId);
        if (el) {
          scrollWithStickyOffset(el);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
    }
  }, [activeHeadingId, toc, chapters]);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [fontStyle, setFontStyle] = useState<'sans' | 'serif' | 'mono'>('serif');
  const [showChapterMenu, setShowChapterMenu] = useState(false);

  const currentChapter = chapters[currentIdx] || chapters[0];

  const fontClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };

  const sizeClasses = {
    sm: 'text-sm leading-relaxed max-w-3xl',
    md: 'text-lg leading-relaxed max-w-4xl',
    lg: 'text-xl leading-loose max-w-4xl',
    xl: 'text-2xl leading-loose max-w-5xl'
  };

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-4rem)] w-full transition-colors duration-300 pb-28 select-text"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text
      }}
    >
      {/* Upper Book Reading Control Toolbar */}
      <div className="sticky top-16 z-50 flex items-center justify-between border-b px-6 py-3 shadow-xl backdrop-blur-xl"
        style={{
          backgroundColor: currentTheme.cardBg,
          borderColor: currentTheme.border
        }}
      >
        {/* Chapter Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowChapterMenu(!showChapterMenu)}
            className="flex items-center space-x-2 rounded-lg border px-4 py-2 text-xs font-bold shadow-xs transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: currentTheme.sidebarBg,
              borderColor: currentTheme.border,
              color: currentTheme.accent
            }}
          >
            <BookOpen className="h-4 w-4" />
            <span className="truncate max-w-[200px] md:max-w-[350px]">
              {currentChapter ? currentChapter.title : 'Select Chapter'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>

          {showChapterMenu && (
            <div className="absolute left-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border shadow-2xl p-2 grid grid-cols-1 gap-1 z-50"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: currentTheme.border
              }}
            >
              <div className="px-3 py-1 text-[10px] uppercase font-extrabold tracking-wider" style={{ color: currentTheme.textSubtle }}>
                All Chapters ({chapters.length})
              </div>
              
              {chapters.map((chap, idx) => {
                const isSel = idx === currentIdx;
                return (
                  <button
                    key={chap.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setShowChapterMenu(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs text-left transition-all ${
                      isSel ? 'font-bold shadow-xs' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isSel ? currentTheme.accent : 'transparent',
                      color: isSel ? currentTheme.accentText : currentTheme.text
                    }}
                  >
                    <span className="truncate pr-2">{chap.title}</span>
                    <span className="text-[10px] opacity-60 shrink-0 font-mono font-normal">L{chap.startLine}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Typography Customization Pill */}
        <div className="flex items-center space-x-2 rounded-lg border p-1"
          style={{
            backgroundColor: currentTheme.sidebarBg,
            borderColor: currentTheme.border
          }}
        >
          <span className="text-xs font-bold opacity-60 px-2 flex items-center gap-1 hidden sm:inline-flex">
            <Type className="h-3.5 w-3.5" /> Font:
          </span>

          <div className="flex space-x-1 border-r pr-2" style={{ borderColor: currentTheme.border }}>
            <button
              onClick={() => setFontStyle('serif')}
              className={`rounded px-2 py-1 text-xs font-serif ${fontStyle === 'serif' ? 'font-bold shadow-xs' : 'opacity-60'}`}
              style={{
                backgroundColor: fontStyle === 'serif' ? currentTheme.accent : 'transparent',
                color: fontStyle === 'serif' ? currentTheme.accentText : currentTheme.text
              }}
            >
              Serif
            </button>
            <button
              onClick={() => setFontStyle('sans')}
              className={`rounded px-2 py-1 text-xs font-sans ${fontStyle === 'sans' ? 'font-bold shadow-xs' : 'opacity-60'}`}
              style={{
                backgroundColor: fontStyle === 'sans' ? currentTheme.accent : 'transparent',
                color: fontStyle === 'sans' ? currentTheme.accentText : currentTheme.text
              }}
            >
              Sans
            </button>
            <button
              onClick={() => setFontStyle('mono')}
              className={`rounded px-2 py-1 text-xs font-mono ${fontStyle === 'mono' ? 'font-bold shadow-xs' : 'opacity-60'}`}
              style={{
                backgroundColor: fontStyle === 'mono' ? currentTheme.accent : 'transparent',
                color: fontStyle === 'mono' ? currentTheme.accentText : currentTheme.text
              }}
            >
              Mono
            </button>
          </div>

          <div className="flex space-x-1 pl-1">
            {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`rounded px-2 py-1 text-xs uppercase ${fontSize === s ? 'font-bold shadow-xs' : 'opacity-60'}`}
                style={{
                  backgroundColor: fontSize === s ? currentTheme.accent : 'transparent',
                  color: fontSize === s ? currentTheme.accentText : currentTheme.text
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actual Book Margin Content Page */}
      <div className="flex-1 flex justify-center px-4 sm:px-8 pt-24 pb-12">
        {!currentChapter ? (
          <div className="text-center py-20">
            <Sparkles className="h-10 w-10 mx-auto animate-pulse opacity-50" />
            <p className="mt-2 text-sm">Chapter Unloaded</p>
          </div>
        ) : (
          <article className={`w-full ${sizeClasses[fontSize]} ${fontClasses[fontStyle]} transition-all duration-300`}>
            {/* Book Chapter Title Bar */}
            <div className="border-b pb-6 mb-10 text-center" style={{ borderColor: currentTheme.border, scrollMarginTop: '160px' }}>
              <span className="text-xs font-mono tracking-widest uppercase font-extrabold" style={{ color: currentTheme.textSubtle }}>
                Chapter {currentIdx + 1} of {chapters.length} • Lines {currentChapter.startLine} to {currentChapter.endLine}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold mt-3 leading-tight tracking-tight" style={{ color: currentTheme.accent }}>
                {currentChapter.title}
              </h1>
            </div>

            {/* Render Chapter Markdown */}
            <div 
              className="book-prose space-y-6"
              style={{ color: currentTheme.text }}
              dangerouslySetInnerHTML={{ __html: styleBookHtml(currentChapter.htmlContent || '', currentTheme) }}
            />
          </article>
        )}
      </div>

      {/* Bottom Fixed Book Chapter Paginator */}
      <div className="fixed bottom-0 inset-x-0 h-20 border-t flex items-center justify-between px-6 md:px-12 backdrop-blur-xl z-20 shadow-2xl transition-colors"
        style={{
          backgroundColor: `${currentTheme.cardBg}f0`,
          borderColor: currentTheme.border
        }}
      >
        <button
          onClick={() => {
            if (currentIdx > 0) {
              setCurrentIdx(currentIdx - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={currentIdx === 0}
          className="flex items-center space-x-2 rounded-lg border px-5 py-2.5 text-xs font-bold transition-all hover:scale-102 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-xs"
          style={{
            backgroundColor: currentTheme.sidebarBg,
            borderColor: currentTheme.border,
            color: currentTheme.text
          }}
        >
          <ChevronLeft className="h-4 w-4" style={{ color: currentTheme.accent }} />
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-mono opacity-60">Previous Chapter</span>
            <span className="font-bold truncate max-w-[120px] sm:max-w-[220px]">
              {chapters[currentIdx - 1]?.title || 'Beginning'}
            </span>
          </div>
        </button>

        <div className="text-xs font-mono font-semibold hidden md:block" style={{ color: currentTheme.textSubtle }}>
          {config.siteTitle} • Chapter {currentIdx + 1} / {chapters.length}
        </div>

        <button
          onClick={() => {
            if (currentIdx < chapters.length - 1) {
              setCurrentIdx(currentIdx + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={currentIdx === chapters.length - 1}
          className="flex items-center space-x-2 rounded-lg border px-5 py-2.5 text-xs font-bold transition-all hover:scale-102 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-xs"
          style={{
            backgroundColor: currentTheme.sidebarBg,
            borderColor: currentTheme.border,
            color: currentTheme.text
          }}
        >
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-mono opacity-60">Next Chapter</span>
            <span className="font-bold truncate max-w-[120px] sm:max-w-[220px]">
              {chapters[currentIdx + 1]?.title || 'Conclusion'}
            </span>
          </div>
          <ChevronRight className="h-4 w-4" style={{ color: currentTheme.accent }} />
        </button>
      </div>
    </div>
  );
};

function styleBookHtml(html: string, theme: Theme): string {
  if (!html) return '<p style="font-style:italic; opacity:0.6;">This chapter serves as a title division node without direct paragraphs.</p>';

  let processed = html;

  processed = processed
    .replace(/<h1(\s[^>]*)?>/gi, (_: string, attrs: string) => `<h1${attrs || ''} style="scroll-margin-top:160px;font-size:2.25rem;font-weight:800;color:${theme.accent};margin:1.5rem 0 1rem;">`)
    .replace(/<h2(\s[^>]*)?>/gi, (_: string, attrs: string) => `<h2${attrs || ''} style="scroll-margin-top:160px;font-size:1.75rem;font-weight:700;color:${theme.text};margin:2rem 0 .85rem;border-bottom:1px solid ${theme.border};padding-bottom:.4rem;">`)
    .replace(/<h3(\s[^>]*)?>/gi, (_: string, attrs: string) => `<h3${attrs || ''} style="scroll-margin-top:160px;font-size:1.35rem;font-weight:600;color:${theme.text};margin:1.5rem 0 .75rem;">`)
    .replace(/<h4(\s[^>]*)?>/gi, (_: string, attrs: string) => `<h4${attrs || ''} style="scroll-margin-top:160px;font-size:1.15rem;font-weight:600;color:${theme.text};margin:1.3rem 0 .6rem;">`)
    .replace(/<h5(\s[^>]*)?>/gi, (_: string, attrs: string) => `<h5${attrs || ''} style="scroll-margin-top:160px;font-size:1rem;font-weight:600;color:${theme.text};margin:1.1rem 0 .5rem;">`)
    .replace(/<h6(\s[^>]*)?>/gi, (_: string, attrs: string) => `<h6${attrs || ''} style="scroll-margin-top:160px;font-size:.95rem;font-weight:600;color:${theme.textSubtle};margin:1rem 0 .5rem;">`);

  processed = processed.replace(
    /<p>/gi,
    `<p style="margin-bottom: 1.5rem; text-indent: 1.5rem; line-height: 1.85;">`
  );

  processed = processed.replace(
    /<ul>/gi,
    `<ul style="list-style-type: disc; margin-left: 2.5rem; margin-bottom: 1.5rem; line-height: 1.8;">`
  );

  processed = processed.replace(
    /<ol>/gi,
    `<ol style="list-style-type: decimal; margin-left: 2.5rem; margin-bottom: 1.5rem; line-height: 1.8;">`
  );

  processed = processed.replace(
    /<pre><code(.*?)>([\s\S]*?)<\/code><\/pre>/gi,
    `<pre style="background-color: ${theme.codeBg}; color: ${theme.codeText}; padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 0.85em; overflow-x: auto; border: 1px solid ${theme.border}; margin: 2rem 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);"><code$1>$2</code></pre>`
  );

  processed = processed.replace(
    /<blockquote>/gi,
    `<blockquote style="border-left: 4px solid ${theme.accent}; padding-left: 2rem; margin: 2rem 0; font-style: italic; color: ${theme.textSubtle}; font-size: 1.05em;">`
  );

  return processed;
}

function scrollWithStickyOffset(element: HTMLElement) {
  // Navbar is 64px and book toolbar is roughly 64px. Add buffer so text never sits behind the toolbar.
  const stickyOffset = 160;
  const targetTop = element.getBoundingClientRect().top + window.scrollY - stickyOffset;
  window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
}
