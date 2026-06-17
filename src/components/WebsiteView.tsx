import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Hash,
  Search
} from 'lucide-react';
import { Chapter, Theme, WebsiteConfig } from '../types';

import { useEffect } from 'react';
import { TocHeading } from '../types';

interface WebsiteViewProps {
  chapters: Chapter[];
  toc: TocHeading[];
  currentTheme: Theme;
  config: WebsiteConfig;
  onToggleLineNumbers: () => void;
  activeHeadingId?: string;
}

export const WebsiteView: React.FC<WebsiteViewProps> = ({
  chapters,
  toc,
  currentTheme,
  config,
  onToggleLineNumbers,
  activeHeadingId
}) => {
  const [collapsedChapters, setCollapsedChapters] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  // Progressive rendering: initial display is instantaneous,
  // subsequent chapters populate flawlessly in the background without UI lag.
  useEffect(() => {
    setVisibleCount(8);
  }, [chapters, searchTerm]);

  // Whenever a TOC link (H1 to H6) is clicked, ensure only up to the necessary chapters
  // are rendered into the DOM, keeping rendering lightning fast.
  useEffect(() => {
    if (!activeHeadingId) return;

    const targetHeading = toc.find((h) => h.id === activeHeadingId);
    if (targetHeading) {
      const line = targetHeading.startLine;
      const ownerChapIdx = chapters.findIndex((c) => c.startLine <= line && c.endLine >= line);
      if (ownerChapIdx !== -1) {
        const ownerChap = chapters[ownerChapIdx];
        setVisibleCount((prev) => Math.max(prev, ownerChapIdx + 2));
        setCollapsedChapters((prev) => prev.filter((id) => id !== ownerChap.id));
      }
    }
  }, [activeHeadingId, toc, chapters]);

  useEffect(() => {
    if (visibleCount < chapters.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 8, chapters.length));
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, chapters.length]);

  const handleCopyChapter = (raw: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(raw);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCollapse = (id: string) => {
    if (collapsedChapters.includes(id)) {
      setCollapsedChapters(collapsedChapters.filter((c) => c !== id));
    } else {
      setCollapsedChapters([...collapsedChapters, id]);
    }
  };

  const expandAll = () => setCollapsedChapters([]);
  const collapseAll = () => setCollapsedChapters(chapters.map((c) => c.id));

  // Filter chapters if user searches
  const displayedChapters = chapters.filter((c) => {
    if (!searchTerm.trim()) return true;
    return (
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rawMarkdown.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col w-full min-h-full pb-24 transition-colors duration-200"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text
      }}
    >
      {/* Sub-toolbar for page controls. It is intentionally not sticky so content is never hidden behind it. */}
      <div 
        className="flex flex-wrap items-center justify-between gap-2 border-b px-6 py-2.5 shadow-sm transition-colors"
        style={{
          backgroundColor: currentTheme.cardBg,
          borderColor: currentTheme.border
        }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline" style={{ color: currentTheme.accent }}>
            Interactive Doc Website
          </span>
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 opacity-50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter sections..."
              className="rounded-md border py-1 pl-8 pr-3 text-xs font-medium focus:outline-none w-44 sm:w-64"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: currentTheme.border,
                color: currentTheme.text
              }}
            />
          </div>
          <span className="text-xs font-semibold hidden md:inline" style={{ color: currentTheme.textSubtle }}>
            ({displayedChapters.length} Loaded)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleLineNumbers}
            className={`flex items-center space-x-1 rounded-md border px-2.5 py-1 text-xs font-semibold transition-all ${
              config.showLineNumbers ? 'shadow-xs font-bold' : 'opacity-70'
            }`}
            style={{
              backgroundColor: config.showLineNumbers ? currentTheme.accent : currentTheme.sidebarBg,
              borderColor: currentTheme.border,
              color: config.showLineNumbers ? currentTheme.accentText : currentTheme.text
            }}
          >
            <Hash className="h-3.5 w-3.5" />
            <span>Line Numbers: {config.showLineNumbers ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={expandAll}
            className="rounded-md border px-2.5 py-1 text-xs font-semibold opacity-80 hover:opacity-100 transition-all active:scale-95"
            style={{
              backgroundColor: currentTheme.sidebarBg,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
          >
            Expand All
          </button>

          <button
            onClick={collapseAll}
            className="rounded-md border px-2.5 py-1 text-xs font-semibold opacity-80 hover:opacity-100 transition-all active:scale-95"
            style={{
              backgroundColor: currentTheme.sidebarBg,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Main Content Render Container */}
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 pt-10 flex flex-col gap-8">
        {displayedChapters.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border p-8 shadow-sm"
            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}
          >
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-40 animate-pulse" />
            <h3 className="text-xl font-bold mb-2">No specific chapters found</h3>
            <p className="text-sm opacity-70 max-w-md mx-auto">
              Your search term did not match any headings or paragraphs across the document.
            </p>
          </div>
        ) : (
          displayedChapters.slice(0, visibleCount).map((chapter) => {
            const isCollapsed = collapsedChapters.includes(chapter.id);
            const lineRange = `Lines ${chapter.startLine} - ${chapter.endLine}`;

            return (
              <article
                key={chapter.id}
                id={chapter.id}
                className="rounded-xl border shadow-md transition-all duration-300 overflow-hidden chapter-card-accelerated"
                style={{
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.border
                }}
              >
                {/* Chapter Card Header */}
                <div
                  onClick={() => toggleCollapse(chapter.id)}
                  className="group flex items-center justify-between px-6 py-4 cursor-pointer select-none border-b transition-colors"
                  style={{
                    backgroundColor: currentTheme.sidebarBg,
                    borderColor: currentTheme.border
                  }}
                >
                  <div className="flex items-center space-x-3 overflow-hidden pr-4">
                    <button className="p-1 rounded-md transition-transform group-hover:scale-110">
                      {isCollapsed ? (
                        <ChevronRight className="h-5 w-5 font-bold" style={{ color: currentTheme.accent }} />
                      ) : (
                        <ChevronDown className="h-5 w-5 font-bold" style={{ color: currentTheme.accent }} />
                      )}
                    </button>

                    <h2 className="text-lg md:text-xl font-bold leading-snug truncate" style={{ color: currentTheme.accent }}>
                      {chapter.title}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span 
                      className="text-xs font-mono px-2.5 py-1 rounded-full font-semibold border"
                      style={{
                        backgroundColor: currentTheme.bg,
                        borderColor: currentTheme.border,
                        color: currentTheme.textSubtle
                      }}
                    >
                      {lineRange}
                    </span>

                    <button
                      onClick={(e) => handleCopyChapter(chapter.rawMarkdown, chapter.id, e)}
                      className="flex items-center space-x-1 rounded-lg border px-3 py-1.5 text-xs font-bold shadow-xs transition-all opacity-80 hover:opacity-100 active:scale-95"
                      style={{
                        backgroundColor: currentTheme.cardBg,
                        borderColor: currentTheme.border,
                        color: currentTheme.text
                      }}
                      title="Copy exact raw markdown for this section"
                    >
                      {copiedId === chapter.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500 animate-scale" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Copy Section</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Chapter Body (Pre-rendered HTML Output accelerated by CSS Variables) */}
                {!isCollapsed && (
                  <div className="p-6 md:p-8 relative">
                    <div 
                      className="markdown-body custom-prose flex flex-col gap-4 text-base md:text-lg leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: chapter.htmlContent || '' }}
                    />
                  </div>
                )}
              </article>
            );
          })
        )}

        {visibleCount < displayedChapters.length && (
          <div 
            onClick={() => setVisibleCount(displayedChapters.length)}
            className="w-full text-center py-6 rounded-xl border-2 border-dashed cursor-pointer hover:opacity-100 opacity-60 transition-all font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xs mb-8"
            style={{
              backgroundColor: currentTheme.sidebarBg,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
          >
            <Sparkles className="h-4 w-4 animate-spin" style={{ color: currentTheme.accent }} />
            <span>Progressively Rendering next sections ({displayedChapters.length - visibleCount} sections remaining) • Click to reveal all instantly</span>
          </div>
        )}
      </div>
    </div>
  );
};
