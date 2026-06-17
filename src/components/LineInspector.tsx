import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ListOrdered, 
  Sparkles,
  Hash
} from 'lucide-react';
import { LineItem, Theme } from '../types';

interface LineInspectorProps {
  lineItems: LineItem[];
  currentTheme: Theme;
}

export const LineInspector: React.FC<LineInspectorProps> = ({
  lineItems,
  currentTheme
}) => {
  const [filterType, setFilterType] = useState<LineItem['type'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetLineInput, setTargetLineInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [copiedLineNum, setCopiedLineNum] = useState<number | null>(null);

  const handleCopy = (text: string, lineNum: number) => {
    navigator.clipboard.writeText(text);
    setCopiedLineNum(lineNum);
    setTimeout(() => setCopiedLineNum(null), 2000);
  };

  // Filter lines
  const filteredLines = useMemo(() => {
    return lineItems.filter((item) => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.raw.toLowerCase().includes(q) ||
          item.lineNumber.toString().includes(q)
        );
      }
      return true;
    });
  }, [lineItems, filterType, searchQuery]);

  const totalPages = Math.ceil(filteredLines.length / rowsPerPage) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  // Jump to specific line
  const handleJumpToLine = (e: React.FormEvent) => {
    e.preventDefault();
    const lineTarget = parseInt(targetLineInput.trim(), 10);
    if (!isNaN(lineTarget)) {
      // Find index in filtered lines
      const foundIdx = filteredLines.findIndex((l) => l.lineNumber === lineTarget);
      if (foundIdx !== -1) {
        const calcPage = Math.floor(foundIdx / rowsPerPage) + 1;
        setCurrentPage(calcPage);
      }
    }
  };

  // Get current page items
  const currentRows = useMemo(() => {
    const startIndex = (safePage - 1) * rowsPerPage;
    return filteredLines.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLines, safePage, rowsPerPage]);

  const typeColors: Record<LineItem['type'], { bg: string; text: string }> = {
    heading: { bg: '#3b82f6', text: '#ffffff' },
    code: { bg: '#10b981', text: '#ffffff' },
    table: { bg: '#f59e0b', text: '#000000' },
    quote: { bg: '#8b5cf6', text: '#ffffff' },
    list: { bg: '#ec4899', text: '#ffffff' },
    paragraph: { bg: 'transparent', text: currentTheme.textSubtle },
    blank: { bg: 'transparent', text: '#9ca3af' }
  };

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-4rem)] w-full transition-colors duration-200 select-none pb-20"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text
      }}
    >
      {/* Top Filter & Jump Bar */}
      <div className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-4 border-b px-6 py-3 shadow-xs backdrop-blur-md transition-colors"
        style={{
          backgroundColor: `${currentTheme.cardBg}f2`,
          borderColor: currentTheme.border
        }}
      >
        {/* Left: Search & Target Line Jump */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search regex / snippet..."
              className="rounded-lg border py-1.5 pl-9 pr-4 text-xs font-medium focus:outline-none w-52 sm:w-64"
              style={{
                backgroundColor: currentTheme.sidebarBg,
                borderColor: currentTheme.border,
                color: currentTheme.text
              }}
            />
          </div>

          <form onSubmit={handleJumpToLine} className="flex items-center space-x-1">
            <div className="relative flex items-center">
              <Hash className="absolute left-2.5 h-3.5 w-3.5 opacity-50" style={{ color: currentTheme.accent }} />
              <input
                type="number"
                value={targetLineInput}
                onChange={(e) => setTargetLineInput(e.target.value)}
                placeholder="Line # jump"
                className="rounded-lg border py-1.5 pl-8 pr-2 text-xs font-mono w-28 focus:outline-none"
                style={{
                  backgroundColor: currentTheme.sidebarBg,
                  borderColor: currentTheme.border,
                  color: currentTheme.text
                }}
              />
            </div>
            <button
              type="submit"
              className="rounded-lg border px-3 py-1.5 text-xs font-bold transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: currentTheme.accent,
                borderColor: currentTheme.border,
                color: currentTheme.accentText
              }}
            >
              Go
            </button>
          </form>
        </div>

        {/* Right: Line Type Filters */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold opacity-60 mr-2 flex items-center gap-1 hidden lg:inline-flex">
            <Filter className="h-3.5 w-3.5" /> Filter Type:
          </span>

          {(['all', 'heading', 'code', 'table', 'quote', 'list', 'paragraph'] as const).map((t) => {
            const isSel = filterType === t;
            return (
              <button
                key={t}
                onClick={() => {
                  setFilterType(t);
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs uppercase font-semibold transition-all shrink-0 ${
                  isSel ? 'font-bold shadow-xs scale-105' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSel ? currentTheme.accent : currentTheme.sidebarBg,
                  borderColor: currentTheme.border,
                  color: isSel ? currentTheme.accentText : currentTheme.text,
                  border: `1px solid ${currentTheme.border}`
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actual Data Table Grid */}
      <div className="flex-1 p-4 md:p-8 overflow-x-auto">
        <div className="mx-auto max-w-7xl rounded-2xl border shadow-xl overflow-hidden"
          style={{
            backgroundColor: currentTheme.cardBg,
            borderColor: currentTheme.border
          }}
        >
          {/* Grid Metadata Bar */}
          <div className="flex items-center justify-between border-b px-6 py-3 text-xs font-semibold"
            style={{
              backgroundColor: currentTheme.sidebarBg,
              borderColor: currentTheme.border
            }}
          >
            <span className="flex items-center gap-2">
              <ListOrdered className="h-4 w-4" style={{ color: currentTheme.accent }} />
              <span>Showing Lines {(safePage - 1) * rowsPerPage + 1} - {Math.min(safePage * rowsPerPage, filteredLines.length)} of {filteredLines.length.toLocaleString()} matching lines</span>
            </span>

            <div className="flex items-center space-x-2">
              <span>Rows / Page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded border px-2 py-1 text-xs focus:outline-none font-mono"
                style={{
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.border,
                  color: currentTheme.text
                }}
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto max-h-[calc(100vh-17rem)] overflow-y-auto">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead className="sticky top-0 z-20 border-b shadow-xs"
                style={{
                  backgroundColor: currentTheme.sidebarBg,
                  borderColor: currentTheme.border,
                  color: currentTheme.text
                }}
              >
                <tr>
                  <th className="w-24 px-4 py-2.5 font-bold">Line #</th>
                  <th className="w-32 px-4 py-2.5 font-bold">Token Type</th>
                  <th className="px-4 py-2.5 font-bold">Raw Markdown Line</th>
                  <th className="w-24 px-4 py-2.5 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y select-text">
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16 font-sans text-sm opacity-60">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-40 animate-pulse" />
                      No lines match your current filter and search conditions.
                    </td>
                  </tr>
                ) : (
                  currentRows.map((line) => {
                    const isCopied = copiedLineNum === line.lineNumber;
                    const typeConfig = typeColors[line.type] || typeColors.paragraph;

                    return (
                      <tr 
                        key={line.lineNumber} 
                        className="transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <td className="px-4 py-2 font-bold opacity-60 shrink-0 select-none">
                          #{line.lineNumber}
                        </td>
                        
                        <td className="px-4 py-2 shrink-0 select-none">
                          <span 
                            className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                            style={{
                              backgroundColor: line.type === 'paragraph' || line.type === 'blank' ? currentTheme.sidebarBg : typeConfig.bg,
                              color: line.type === 'paragraph' || line.type === 'blank' ? currentTheme.text : typeConfig.text,
                              border: `1px solid ${currentTheme.border}`
                            }}
                          >
                            {line.type} {line.level ? `H${line.level}` : ''}
                          </span>
                        </td>

                        <td className="px-4 py-2 break-all whitespace-pre-wrap font-mono text-sm leading-snug">
                          {line.raw || <span className="opacity-30 italic font-sans">[Blank Line]</span>}
                        </td>

                        <td className="px-4 py-2 text-right shrink-0 select-none">
                          <button
                            onClick={() => handleCopy(line.raw, line.lineNumber)}
                            className="inline-flex items-center space-x-1 rounded border px-2 py-1 text-[10px] font-bold transition-all shadow-xs active:scale-95 hover:opacity-100 opacity-80"
                            style={{
                              backgroundColor: isCopied ? '#10b981' : currentTheme.cardBg,
                              borderColor: currentTheme.border,
                              color: isCopied ? '#ffffff' : currentTheme.text
                            }}
                            title="Copy single line to clipboard"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3 w-3 animate-scale" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Paginator Controls */}
          <div className="flex items-center justify-between border-t px-6 py-3 text-xs font-semibold select-none"
            style={{
              backgroundColor: currentTheme.sidebarBg,
              borderColor: currentTheme.border
            }}
          >
            <div>
              Page <span className="font-bold">{safePage}</span> of <span className="font-bold">{totalPages}</span>
            </div>

            <div className="flex items-center space-x-1.5 font-bold">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={safePage === 1}
                className="rounded border p-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}
                title="First Page"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => setCurrentPage(safePage - 1)}
                disabled={safePage === 1}
                className="flex items-center space-x-1 rounded border px-3 py-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-xs"
                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <button
                onClick={() => setCurrentPage(safePage + 1)}
                disabled={safePage === totalPages}
                className="flex items-center space-x-1 rounded border px-3 py-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-xs"
                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={safePage === totalPages}
                className="rounded border p-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}
                title="Last Page"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
