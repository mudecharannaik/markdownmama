import { marked } from 'marked';
import { Chapter, DocumentStats, LineItem, PresentationSlide, TocHeading } from '../types';

export interface ParsedMarkdownResult {
  stats: DocumentStats;
  toc: TocHeading[];
  chapters: Chapter[];
  lineItems: LineItem[];
  slides: PresentationSlide[];
}

export async function parseMassiveMarkdown(markdownText: string): Promise<ParsedMarkdownResult> {
  const startTime = Date.now();
  const lines = markdownText.split(/\r?\n/);
  const totalLines = lines.length;
  
  let wordCount = 0;
  let charCount = 0;
  let headingsCount = 0;
  let codeBlocksCount = 0;
  let tablesCount = 0;

  const toc: TocHeading[] = [];
  const lineItems: LineItem[] = [];
  const chapters: Chapter[] = [];
  const slides: PresentationSlide[] = [];

  let inCodeBlock = false;

  let currentChapter: Chapter | null = null;
  let chapterBuffer: string[] = [];

  const finalizeChapter = (nextStartLine: number) => {
    if (currentChapter) {
      currentChapter.endLine = nextStartLine - 1;
      currentChapter.rawMarkdown = chapterBuffer.join('\n');
      
      let html = marked.parse(currentChapter.rawMarkdown, { async: false }) as string;

      // Admonitions
      html = html
        .replace(
          />\s*\[!IMPORTANT\]([\s\S]*?)(?=(<\/blockquote>))/gi,
          `<div class="admonition important"><div class="adm-head">⚠️ Critical Importance</div><div>$1</div></div>`
        )
        .replace(
          />\s*\[!WARNING\]([\s\S]*?)(?=(<\/blockquote>))/gi,
          `<div class="admonition warning"><div class="adm-head">⚡ System Warning</div><div>$1</div></div>`
        )
        .replace(
          />\s*\[!TIP\]([\s\S]*?)(?=(<\/blockquote>))/gi,
          `<div class="admonition tip"><div class="adm-head">💡 Pro Tip</div><div>$1</div></div>`
        );
      
      // Clean up remaining blockquote tags around admonitions if any
      html = html.replace(/<blockquote>\s*(<div class="admonition[\s\S]*?<\/div>)\s*<\/blockquote>/gi, '$1');

      // Code blocks
      html = html.replace(
        /<pre><code(.*?)>([\s\S]*?)<\/code><\/pre>/gi,
        (_, attrs, code) => {
          const langMatch = attrs.match(/class="language-(\w+)"/);
          const lang = langMatch ? langMatch[1].toUpperCase() : 'CODE';
          return `<div class="code-block-wrap"><div class="code-block-head"><span>${lang}</span><div class="code-dot"></div></div><pre><code${attrs}>${code}</code></pre></div>`;
        }
      );

      // Post-process HTML to attach exact ID attributes and scroll-margin to every heading tag (H1 to H6)
      const chapHeadings = toc.filter((h) => h.startLine >= currentChapter!.startLine);
      for (const h of chapHeadings) {
        const escapedText = h.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(<h${h.level}[^>]*>)([\\s\\S]*?${escapedText}[\\s\\S]*?)(</h${h.level}>)`, 'i');
        html = html.replace(
          regex,
          `<h${h.level} id="${h.id}" class="toc-heading-tag">$2</h${h.level}>`
        );
      }

      currentChapter.htmlContent = html;
      chapters.push(currentChapter);
    }
  };

  // If document doesn't start with a heading, create an Introduction chapter
  if (totalLines > 0 && !lines[0].startsWith('#')) {
    currentChapter = {
      id: 'chapter-intro-0',
      title: 'Introduction & Overview',
      level: 1,
      startLine: 1,
      endLine: 1,
      rawMarkdown: ''
    };
  }

  let slideCounter = 1;

  for (let i = 0; i < totalLines; i++) {
    const rawLine = lines[i];
    const lineNum = i + 1;
    const trimmed = rawLine.trim();

    charCount += rawLine.length;
    if (trimmed) {
      wordCount += trimmed.split(/\s+/).length;
    }

    // Determine line type for LineInspector
    let type: LineItem['type'] = 'paragraph';
    let level: number | undefined = undefined;

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      type = 'code';
      if (inCodeBlock) codeBlocksCount++;
    } else if (inCodeBlock) {
      type = 'code';
    } else if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      type = 'table';
      if (trimmed.includes('---')) tablesCount++;
    } else if (trimmed.startsWith('#')) {
      type = 'heading';
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        headingsCount++;
        level = headingMatch[1].length;
        const text = headingMatch[2];
        const id = `heading-${lineNum}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

        toc.push({
          id,
          text,
          level,
          startLine: lineNum
        });

        // If it's H1 or H2, treat as a Chapter boundary
        if (level === 1 || level === 2) {
          finalizeChapter(lineNum);
          currentChapter = {
            id,
            title: text,
            level,
            startLine: lineNum,
            endLine: totalLines,
            rawMarkdown: ''
          };
          chapterBuffer = [];

          // Create a Presentation Slide
          slides.push({
            id: `slide-${slideCounter}`,
            title: text,
            subtitle: level === 2 ? 'Section Breakdown' : undefined,
            contentHtml: '', // filled below
            slideNumber: slideCounter++
          });
        }
      }
    } else if (trimmed.startsWith('>')) {
      type = 'quote';
    } else if (/^[-*+]\s|^\d+\.\s/.test(trimmed)) {
      type = 'list';
    } else if (!trimmed) {
      type = 'blank';
    }

    chapterBuffer.push(rawLine);

    // If we have an active slide, append to its content if it's not the title line itself
    if (slides.length > 0 && (type !== 'heading' || (level && level > 2))) {
      const activeSlide = slides[slides.length - 1];
      // Keep slide content concise
      if (chapterBuffer.length < 35) {
        activeSlide.contentHtml += rawLine + '\n';
      }
    }

    lineItems.push({
      lineNumber: lineNum,
      raw: rawLine,
      type,
      level
    });
  }

  // Finalize the last chapter
  finalizeChapter(totalLines + 1);

  // Parse Markdown for slides
  for (const slide of slides) {
    if (slide.contentHtml) {
      slide.contentHtml = marked.parse(slide.contentHtml, { async: false }) as string;
    }
  }

  // Calculate stats
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const fileSizeKb = (new Blob([markdownText]).size / 1024).toFixed(1);

  const stats: DocumentStats = {
    lineCount: totalLines,
    wordCount,
    charCount,
    readTimeMinutes,
    headingsCount,
    codeBlocksCount,
    tablesCount,
    fileSizeKb: `${fileSizeKb} KB`
  };

  console.log(`Successfully parsed ${totalLines} lines in ${Date.now() - startTime}ms`);

  return {
    stats,
    toc,
    chapters,
    lineItems,
    slides
  };
}
