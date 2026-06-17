import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  BookOpen,
  Layers,
  ChevronRight,
  ChevronDown,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { Theme, TocHeading } from '../types';

interface SidebarProps {
  toc: TocHeading[];
  currentTheme: Theme;
  activeHeadingId?: string;
  onSelectHeading: (headingId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchResultsCount: number;
}

/* ─────────────────────────────────────────────
   Tree node shape used internally
───────────────────────────────────────────── */
interface TocNode {
  heading: TocHeading;
  children: TocNode[];
}

/** Convert a flat TocHeading[] → nested TocNode tree */
function buildTree(headings: TocHeading[]): TocNode[] {
  const roots: TocNode[] = [];
  const stack: TocNode[] = [];

  for (const heading of headings) {
    const node: TocNode = { heading, children: [] };

    // Pop stack until we find a parent with a smaller level
    while (stack.length > 0 && stack[stack.length - 1].heading.level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return roots;
}

/** Collect all IDs that appear in a subtree */
function collectIds(nodes: TocNode[]): string[] {
  const ids: string[] = [];
  for (const n of nodes) {
    ids.push(n.heading.id);
    ids.push(...collectIds(n.children));
  }
  return ids;
}

export const Sidebar: React.FC<SidebarProps> = ({
  toc,
  currentTheme,
  activeHeadingId,
  onSelectHeading,
  searchQuery,
  onSearchChange,
  searchResultsCount
}) => {
  const [maxDepth, setMaxDepth] = useState<number>(6);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  // collapsed set: if an id is in here, that node's children are hidden
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ── depth-filtered flat list ── */
  const filteredToc = useMemo(
    () =>
      toc.filter((h) => {
        if (h.level > maxDepth) return false;
        if (searchQuery.trim())
          return h.text.toLowerCase().includes(searchQuery.toLowerCase());
        return true;
      }),
    [toc, maxDepth, searchQuery]
  );

  /* ── build tree from filtered list ── */
  const tree = useMemo(() => buildTree(filteredToc), [filteredToc]);

  /* ── when search is active, auto-expand everything ── */
  useEffect(() => {
    if (searchQuery.trim()) {
      setCollapsedIds(new Set()); // expand all when searching
    }
  }, [searchQuery]);

  /* ── auto-expand the branch that contains the activeHeadingId ── */
  useEffect(() => {
    if (!activeHeadingId) return;
    // Build ancestor map
    const parentMap = new Map<string, string>();
    const walkTree = (nodes: TocNode[], parentId?: string) => {
      for (const n of nodes) {
        if (parentId) parentMap.set(n.heading.id, parentId);
        walkTree(n.children, n.heading.id);
      }
    };
    walkTree(tree);

    // Walk up from activeHeadingId and make sure none of them are collapsed
    const idsToOpen: string[] = [];
    let cur = parentMap.get(activeHeadingId);
    while (cur) {
      idsToOpen.push(cur);
      cur = parentMap.get(cur);
    }
    if (idsToOpen.length > 0) {
      setCollapsedIds((prev) => {
        const next = new Set(prev);
        for (const id of idsToOpen) next.delete(id);
        return next;
      });
    }
  }, [activeHeadingId, tree]);

  /* ── collapse / expand helpers ── */
  const toggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setCollapsedIds(new Set());

  const collapseAll = () => {
    const allIds = collectIds(tree);
    setCollapsedIds(new Set(allIds));
  };

  /* ── bookmark helpers ── */
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  /* ── sidebar collapse (hide panel entirely) ── */
  if (!sidebarOpen) {
    return (
      <div
        className="hidden md:flex flex-col items-center justify-start pt-4 w-12 border-r h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300"
        style={{ backgroundColor: currentTheme.sidebarBg, borderColor: currentTheme.border }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg transition-colors hover:opacity-80"
          style={{ color: currentTheme.accent }}
          title="Open Table of Contents"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <aside
      className="hidden md:flex flex-col w-72 xl:w-80 shrink-0 border-r h-[calc(100vh-4rem)] sticky top-16 select-none transition-all duration-300"
      style={{
        backgroundColor: currentTheme.sidebarBg,
        borderColor: currentTheme.border,
        color: currentTheme.text
      }}
    >
      {/* ── Header bar ── */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b font-extrabold text-[11px] uppercase tracking-wider"
        style={{ borderColor: currentTheme.border, color: currentTheme.accent }}
      >
        <span className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          Table of Contents
        </span>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
          title="Collapse sidebar"
          style={{ color: currentTheme.text }}
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* ── Search box ── */}
      <div className="p-3 border-b space-y-2" style={{ borderColor: currentTheme.border }}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 opacity-40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search headings…"
            className="w-full rounded-lg border py-1.5 pl-8 pr-8 text-xs font-medium transition-all focus:outline-none"
            style={{
              backgroundColor: currentTheme.cardBg,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
          />
          {searchQuery && (
            <>
              <span
                className="absolute right-7 top-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold"
                style={{ backgroundColor: currentTheme.accent, color: currentTheme.accentText }}
              >
                {searchResultsCount}
              </span>
              <button
                className="absolute right-2 top-2 opacity-50 hover:opacity-100"
                onClick={() => onSearchChange('')}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>

        {/* ── Depth filter + expand/collapse all ── */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Filter className="h-3 w-3 opacity-50 shrink-0" />
            {([1, 2, 3, 6] as const).map((d) => (
              <button
                key={d}
                onClick={() => setMaxDepth(d)}
                className="rounded px-1.5 py-0.5 text-[10px] font-bold transition-all"
                style={{
                  backgroundColor: maxDepth === d ? currentTheme.accent : 'transparent',
                  color: maxDepth === d ? currentTheme.accentText : currentTheme.text,
                  opacity: maxDepth === d ? 1 : 0.55
                }}
              >
                {d === 6 ? 'All' : `H${d}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={expandAll}
              className="rounded px-1.5 py-0.5 text-[10px] font-semibold border transition-all hover:opacity-100 opacity-60"
              style={{ borderColor: currentTheme.border, color: currentTheme.text }}
              title="Expand all sections"
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              className="rounded px-1.5 py-0.5 text-[10px] font-semibold border transition-all hover:opacity-100 opacity-60"
              style={{ borderColor: currentTheme.border, color: currentTheme.text }}
              title="Collapse all sections"
            >
              Close all
            </button>
          </div>
        </div>
      </div>

      {/* ── Tree ── */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {filteredToc.length === 0 ? (
          <div className="text-center py-10 text-xs opacity-50">
            No headings match your filter.
          </div>
        ) : (
          <TocTree
            nodes={tree}
            collapsedIds={collapsedIds}
            activeHeadingId={activeHeadingId}
            bookmarkedIds={bookmarkedIds}
            currentTheme={currentTheme}
            onSelect={onSelectHeading}
            onToggle={toggle}
            onBookmark={toggleBookmark}
          />
        )}
      </div>

      {/* ── Footer ── */}
      <div
        className="px-4 py-2.5 border-t text-[10px] flex items-center justify-between"
        style={{ borderColor: currentTheme.border, color: currentTheme.textSubtle }}
      >
        <span className="flex items-center gap-1.5 font-semibold">
          <BookOpen className="h-3 w-3" />
          {filteredToc.length} headings
        </span>
        {bookmarkedIds.length > 0 && (
          <span className="flex items-center gap-1 font-bold" style={{ color: '#f59e0b' }}>
            <Bookmark className="h-3 w-3 fill-amber-400" />
            {bookmarkedIds.length} saved
          </span>
        )}
      </div>
    </aside>
  );
};

/* ═══════════════════════════════════════════════════════
   Recursive tree renderer
═══════════════════════════════════════════════════════ */
interface TocTreeProps {
  nodes: TocNode[];
  collapsedIds: Set<string>;
  activeHeadingId?: string;
  bookmarkedIds: string[];
  currentTheme: Theme;
  depth?: number;
  onSelect: (id: string) => void;
  onToggle: (id: string, e: React.MouseEvent) => void;
  onBookmark: (id: string, e: React.MouseEvent) => void;
}

const TocTree: React.FC<TocTreeProps> = ({
  nodes,
  collapsedIds,
  activeHeadingId,
  bookmarkedIds,
  currentTheme,
  depth = 0,
  onSelect,
  onToggle,
  onBookmark
}) => {
  return (
    <ul className="flex flex-col gap-0.5" style={{ paddingLeft: depth === 0 ? 0 : '0.85rem' }}>
      {nodes.map((node) => {
        const { heading, children } = node;
        const hasChildren = children.length > 0;
        const isCollapsed = collapsedIds.has(heading.id);
        const isActive = activeHeadingId === heading.id;
        const isBookmarked = bookmarkedIds.includes(heading.id);

        /* Visual weight by heading level */
        const fontWeight =
          heading.level === 1 ? 'font-bold' :
          heading.level === 2 ? 'font-semibold' :
          'font-medium';

        const textSize =
          heading.level === 1 ? 'text-[13px]' :
          heading.level === 2 ? 'text-[12px]' :
          'text-[11px]';

        return (
          <li key={heading.id}>
            {/* ── Row ── */}
            <div
              className={`group flex items-center rounded-lg cursor-pointer transition-all duration-150 ${fontWeight} ${textSize}`}
              style={{
                backgroundColor: isActive ? currentTheme.accent : 'transparent',
                color: isActive ? currentTheme.accentText : currentTheme.text,
              }}
              onClick={() => onSelect(heading.id)}
              title={`Go to: ${heading.text} (line ${heading.startLine})`}
            >
              {/* ── Chevron toggle (only when has children) ── */}
              <button
                className="shrink-0 flex items-center justify-center w-6 h-6 rounded transition-all"
                style={{
                  opacity: hasChildren ? 1 : 0,
                  pointerEvents: hasChildren ? 'auto' : 'none',
                  color: isActive ? currentTheme.accentText : currentTheme.accent
                }}
                onClick={(e) => hasChildren && onToggle(heading.id, e)}
                aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {/* ── Label ── */}
              <span
                className="flex-1 py-1.5 pr-1 truncate leading-snug"
                style={{ paddingLeft: hasChildren ? '0.1rem' : '0.35rem' }}
              >
                {heading.text}
              </span>

              {/* ── Right-side info: line number + bookmark (visible on hover / when bookmarked) ── */}
              <div className="flex items-center gap-0.5 shrink-0 pr-1">
                <span
                  className="text-[9px] font-mono opacity-0 group-hover:opacity-50 transition-opacity"
                  style={{ color: isActive ? currentTheme.accentText : currentTheme.textSubtle }}
                >
                  L{heading.startLine}
                </span>
                <button
                  onClick={(e) => onBookmark(heading.id, e)}
                  className={`transition-all ${isBookmarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-40 hover:!opacity-100'}`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark this heading'}
                >
                  <Bookmark
                    className="h-3 w-3"
                    style={{
                      color: isBookmarked ? '#f59e0b' : isActive ? currentTheme.accentText : currentTheme.text,
                      fill: isBookmarked ? '#f59e0b' : 'none'
                    }}
                  />
                </button>
              </div>
            </div>

            {/* ── Children (animated slide) ── */}
            {hasChildren && !isCollapsed && (
              <div
                style={{
                  borderLeft: `2px solid ${isActive ? currentTheme.accent : currentTheme.border}`,
                  marginLeft: '0.85rem',
                  marginTop: '2px',
                  marginBottom: '2px',
                  paddingLeft: '2px'
                }}
              >
                <TocTree
                  nodes={children}
                  collapsedIds={collapsedIds}
                  activeHeadingId={activeHeadingId}
                  bookmarkedIds={bookmarkedIds}
                  currentTheme={currentTheme}
                  depth={depth + 1}
                  onSelect={onSelect}
                  onToggle={onToggle}
                  onBookmark={onBookmark}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};
