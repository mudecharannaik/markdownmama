import { ParsedMarkdownResult } from './markdownParser';
import { Theme, WebsiteConfig } from '../types';
import { generateThemeCssVariables } from './theme';

export function triggerFileDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAsTxt(markdownText: string, config: WebsiteConfig) {
  const filename = `${config.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
  triggerFileDownload(markdownText, filename, 'text/plain;charset=utf-8');
}

export function exportAsJson(parsedData: ParsedMarkdownResult, config: WebsiteConfig) {
  const payload = {
    metadata: {
      title: config.siteTitle,
      subtitle: config.siteSubtitle,
      author: config.authorName,
      generatedAt: new Date().toISOString(),
      stats: parsedData.stats
    },
    toc: parsedData.toc,
    chapters: parsedData.chapters.map((c) => ({
      id: c.id,
      title: c.title,
      level: c.level,
      startLine: c.startLine,
      endLine: c.endLine,
      content: c.rawMarkdown
    })),
    slides: parsedData.slides
  };

  const filename = `${config.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
  triggerFileDownload(JSON.stringify(payload, null, 2), filename, 'application/json;charset=utf-8');
}

export function exportAsCsv(parsedData: ParsedMarkdownResult, config: WebsiteConfig) {
  // We can export either all structured headings/chapters or a line-by-line inspection
  let csvContent = 'Chapter ID,Level,Start Line,End Line,Chapter Title,Word Count\n';

  for (const chap of parsedData.chapters) {
    const safeTitle = `"${chap.title.replace(/"/g, '""')}"`;
    const words = chap.rawMarkdown.split(/\s+/).length;
    csvContent += `${chap.id},${chap.level},${chap.startLine},${chap.endLine},${safeTitle},${words}\n`;
  }

  const filename = `${config.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-chapters.csv`;
  triggerFileDownload(csvContent, filename, 'text/csv;charset=utf-8');
}

/**
 * Apply theme-aware inline styles to raw marked.js HTML output.
 * This ensures exported content has correct dark-mode text contrast
 * and uses the chosen theme's colors for all elements.
 */
function styleExportedHtml(html: string, theme: Theme): string {
  let processed = html;

  // Process GitHub-style Admonitions
  processed = processed
    .replace(
      />\s*\[!IMPORTANT\]([\s\S]*?)(?=(>|\n\n|$))/gi,
      `<div style="border-left: 4px solid #ef4444; background-color: ${theme.sidebarBg}; padding: 1.25rem 1.5rem; border-radius: 0 8px 8px 0; margin: 1rem 0;">
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #ef4444; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.85rem; margin-bottom: 0.5rem;">⚠️ Critical Importance</div>
        <div style="font-size: 1.05rem; line-height: 1.6; color: ${theme.text};">$1</div>
      </div>`
    )
    .replace(
      />\s*\[!WARNING\]([\s\S]*?)(?=(>|\n\n|$))/gi,
      `<div style="border-left: 4px solid #f59e0b; background-color: ${theme.sidebarBg}; padding: 1.25rem 1.5rem; border-radius: 0 8px 8px 0; margin: 1rem 0;">
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #f59e0b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.85rem; margin-bottom: 0.5rem;">⚡ System Warning</div>
        <div style="font-size: 1.05rem; line-height: 1.6; color: ${theme.text};">$1</div>
      </div>`
    )
    .replace(
      />\s*\[!TIP\]([\s\S]*?)(?=(>|\n\n|$))/gi,
      `<div style="border-left: 4px solid #10b981; background-color: ${theme.sidebarBg}; padding: 1.25rem 1.5rem; border-radius: 0 8px 8px 0; margin: 1rem 0;">
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #10b981; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.85rem; margin-bottom: 0.5rem;">💡 Pro Tip</div>
        <div style="font-size: 1.05rem; line-height: 1.6; color: ${theme.text};">$1</div>
      </div>`
    );

  // Wrap code blocks with themed header
  processed = processed.replace(
    /<pre><code(.*?)>([\s\S]*?)<\/code><\/pre>/gi,
    `<div style="position: relative; margin: 1.5rem 0;">
      <div style="background-color: ${theme.sidebarBg}; border: 1px solid ${theme.border}; border-bottom: none; border-radius: 8px 8px 0 0; padding: 0.5rem 1rem; font-size: 0.75rem; font-family: monospace; color: ${theme.textSubtle}; display: flex; justify-content: space-between; align-items: center;">
        <span>Source Code</span>
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${theme.accent};"></span>
      </div>
      <pre style="background-color: ${theme.codeBg}; color: ${theme.codeText}; padding: 1.5rem; border-radius: 0 0 8px 8px; overflow-x: auto; font-family: monospace; font-size: 0.95rem; line-height: 1.6; margin: 0; border: 1px solid ${theme.border};"><code$1>$2</code></pre>
    </div>`
  );

  // Style tables for flawless visibility
  processed = processed
    .replace(/<table>/gi, `<div style="overflow-x: auto; margin: 1.5rem 0; border: 1px solid ${theme.border}; border-radius: 8px;"><table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">`)
    .replace(/<\/table>/gi, `</table></div>`)
    .replace(/<thead>/gi, `<thead style="background-color: ${theme.sidebarBg}; border-bottom: 2px solid ${theme.border}; color: ${theme.text}; font-weight: bold;">`)
    .replace(/<th>/gi, `<th style="padding: 1rem; border-right: 1px solid ${theme.border}; color: ${theme.text};">`)
    .replace(/<td>/gi, `<td style="padding: 1rem; border-bottom: 1px solid ${theme.border}; border-right: 1px solid ${theme.border}; color: ${theme.text};">`);

  // Style Blockquotes
  processed = processed.replace(
    /<blockquote>/gi,
    `<blockquote style="border-left: 4px solid ${theme.accent}; background-color: ${theme.sidebarBg}; padding: 1rem 1.5rem; border-radius: 0 8px 8px 0; margin: 1.5rem 0; font-style: italic; color: ${theme.text};">`
  );

  // Style Headings with theme accent
  processed = processed
    .replace(/<h1>/gi, `<h1 style="font-size: 2.25rem; font-weight: 800; color: ${theme.accent}; margin-top: 1.5rem; margin-bottom: 1rem;">`)
    .replace(/<h2>/gi, `<h2 style="font-size: 1.75rem; font-weight: 700; color: ${theme.text}; margin-top: 2rem; margin-bottom: 0.85rem; border-bottom: 1px solid ${theme.border}; padding-bottom: 0.4rem;">`)
    .replace(/<h3>/gi, `<h3 style="font-size: 1.35rem; font-weight: 600; color: ${theme.text}; margin-top: 1.5rem; margin-bottom: 0.75rem;">`)
    .replace(/<h4>/gi, `<h4 style="font-size: 1.1rem; font-weight: 600; color: ${theme.text}; margin-top: 1.25rem; margin-bottom: 0.6rem;">`);

  // Style inline code
  processed = processed.replace(
    /<code>(.*?)<\/code>/gi,
    `<code style="background-color: ${theme.codeBg}; color: ${theme.codeText}; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>`
  );

  // Style paragraphs and lists
  processed = processed
    .replace(/<p>/gi, `<p style="color: ${theme.text}; margin-bottom: 1.25rem; font-size: 1.1rem; line-height: 1.75;">`)
    .replace(/<ul>/gi, `<ul style="color: ${theme.text}; margin: 0 0 1.25rem 1.5rem; font-size: 1.1rem; line-height: 1.75;">`)
    .replace(/<ol>/gi, `<ol style="color: ${theme.text}; margin: 0 0 1.25rem 1.5rem; font-size: 1.1rem; line-height: 1.75;">`)
    .replace(/<li>/gi, `<li style="color: ${theme.text}; margin-bottom: 0.4rem;">`)
    .replace(/<strong>/gi, `<strong style="color: ${theme.text};">`)
    .replace(/<em>/gi, `<em style="color: ${theme.text};">`)
    .replace(/<a /gi, `<a style="color: ${theme.accent}; text-decoration: none;" `)
    .replace(/<hr>/gi, `<hr style="border: none; border-top: 1px solid ${theme.border}; margin: 2rem 0;">`);

  // Style table rows
  processed = processed.replace(
    /<tr>/gi,
    `<tr style="border-bottom: 1px solid ${theme.border};">`
  );

  return processed;
}

export function exportAsPpt(parsedData: ParsedMarkdownResult, config: WebsiteConfig, theme: Theme) {
  // Generate a fully self-contained interactive HTML Presentation Slide Deck!
  const themeVariables = generateThemeCssVariables(theme);

  const slidesHtml = parsedData.slides
    .map(
      (slide) => `
    <div class="slide" id="${slide.id}">
      <div class="slide-header">
        <span class="slide-number">Slide ${slide.slideNumber} of ${parsedData.slides.length}</span>
        <span class="slide-brand">${escapeHtml(config.siteTitle)}</span>
      </div>
      <div class="slide-body">
        <h1 class="slide-title">${escapeHtml(slide.title)}</h1>
        ${slide.subtitle ? `<h3 class="slide-subtitle">${escapeHtml(slide.subtitle)}</h3>` : ''}
        <div class="slide-content">
          ${slide.contentHtml ? styleExportedHtml(slide.contentHtml, theme) : '<p class="empty-note">Press Next or Use Arrow Keys to navigate slides.</p>'}
        </div>
      </div>
      <div class="slide-footer">
        <span>${escapeHtml(config.authorName)}</span>
        <span>Interactive Slide Deck</span>
      </div>
    </div>
  `
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.siteTitle)} - Presentation Deck</title>
  <style>
    :root {
      ${themeVariables}
      --heading-font: ${config.headingFontFamily};
      --markdown-font: ${config.markdownFontFamily};
      --export-code-font: ${config.codeFontFamily};
      --export-font-scale: ${config.fontScale / 100};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--markdown-font);
      font-size: calc(16px * var(--export-font-scale));
      background-color: var(--bg-color);
      color: var(--text-color);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
    }
    .deck-container {
      position: relative;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
    .slide {
      display: none;
      width: 100%;
      max-width: 1100px;
      height: 100%;
      max-height: 700px;
      background-color: var(--card-bg);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 3rem;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      overflow-y: auto;
    }
    .slide.active {
      display: flex;
      animation: fadeIn 0.3s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }
    .slide-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: var(--text-subtle);
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
      margin-bottom: 2rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .slide-title {
      font-family: var(--heading-font);
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--accent-color);
      margin-bottom: 0.5rem;
    }
    .slide-subtitle {
      font-family: var(--heading-font);
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-subtle);
      margin-bottom: 2rem;
    }
    .slide-content {
      font-size: 1.25rem;
      line-height: 1.7;
      flex: 1;
    }
    .slide-content h1, .slide-content h2, .slide-content h3 {
      color: var(--accent-color);
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    .slide-content p { margin-bottom: 1rem; }
    .slide-content ul, .slide-content ol { margin-left: 2rem; margin-bottom: 1.5rem; }
    .slide-content li { margin-bottom: 0.5rem; }
    .slide-content pre {
      background-color: var(--code-bg);
      color: var(--code-text);
      padding: 1.25rem;
      border-radius: 8px;
      overflow-x: auto;
      font-family: var(--export-code-font), monospace;
      font-size: 1.05rem;
      margin-bottom: 1.5rem;
      border: 1px solid var(--border-color);
    }
    .slide-content code {
      background-color: var(--code-bg);
      color: var(--code-text);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: var(--export-code-font), monospace;
    }
    .slide-footer {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--text-subtle);
      border-top: 1px solid var(--border-color);
      padding-top: 1rem;
      margin-top: 2rem;
    }
    .controls {
      height: 60px;
      background-color: var(--sidebar-bg);
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 0 2rem;
    }
    .btn {
      background-color: var(--accent-color);
      color: var(--accent-text);
      border: none;
      padding: 0.6rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.9; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .deck-instructions {
      color: var(--text-subtle);
      font-size: 0.9rem;
      margin-left: 2rem;
    }
  </style>
</head>
<body>
  <div class="deck-container">
    ${slidesHtml}
  </div>
  <div class="controls">
    <button class="btn" id="prevBtn" onclick="prevSlide()">← Previous Slide</button>
    <button class="btn" id="nextBtn" onclick="nextSlide()">Next Slide →</button>
    <span class="deck-instructions">💡 Tip: Use Left (←) and Right (→) Arrow keys to flip slides</span>
  </div>

  <script>
    let currentIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function updateDeck() {
      slides.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === slides.length - 1;
    }

    function nextSlide() {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateDeck();
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateDeck();
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    });

    // Initialize
    updateDeck();
  </script>
</body>
</html>`;

  const filename = `${config.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-presentation.html`;
  triggerFileDownload(html, filename, 'text/html;charset=utf-8');
}

export function exportAsStandaloneWebsite(parsedData: ParsedMarkdownResult, config: WebsiteConfig, theme: Theme) {
  // Generate a magnificent, standalone single HTML file containing their full website!
  const themeVariables = generateThemeCssVariables(theme);

  const tocHtml = parsedData.toc
    .map(
      (h) => `
    <a href="#${h.id}" class="toc-link level-${h.level}" onclick="highlightChapter('${h.id}')">
      ${escapeHtml(h.text)}
    </a>
  `
    )
    .join('\n');

  const contentHtml = parsedData.chapters
    .map(
      (c) => `
    <article class="chapter-card" id="${c.id}">
      <div class="chapter-meta">Chapter Start: Line ${c.startLine}</div>
      <div class="chapter-content">
        ${c.htmlContent ? styleExportedHtml(c.htmlContent, theme) : ''}
      </div>
    </article>
  `
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.siteTitle)}</title>
  <style>
    :root {
      ${themeVariables}
      --heading-font: ${config.headingFontFamily};
      --markdown-font: ${config.markdownFontFamily};
      --export-code-font: ${config.codeFontFamily};
      --export-font-scale: ${config.fontScale / 100};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--markdown-font);
      font-size: calc(16px * var(--export-font-scale));
      background-color: var(--bg-color);
      color: var(--text-color);
      line-height: 1.6;
      display: flex;
      min-height: 100vh;
    }
    
    /* Standalone Website Layout */
    .app-sidebar {
      width: 340px;
      background-color: var(--sidebar-bg);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      overflow-y: auto;
    }
    .sidebar-brand {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    .site-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--accent-color);
      margin-bottom: 0.25rem;
    }
    .site-subtitle {
      font-size: 0.9rem;
      color: var(--text-subtle);
    }
    .sidebar-search {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }
    .search-input {
      width: 100%;
      padding: 0.65rem 1rem;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      background-color: var(--card-bg);
      color: var(--text-color);
      font-size: 0.95rem;
    }
    .search-input:focus {
      outline: 2px solid var(--accent-color);
    }
    .toc-container {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .toc-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-subtle);
      margin-bottom: 0.5rem;
      padding-left: 0.5rem;
      font-weight: 700;
    }
    .toc-link {
      text-decoration: none;
      color: var(--text-color);
      font-size: 0.95rem;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      transition: all 0.2s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
    .toc-link:hover, .toc-link.active {
      background-color: var(--accent-color);
      color: var(--accent-text);
    }
    .toc-link.level-1 { font-weight: 700; }
    .toc-link.level-2 { margin-left: 1rem; font-size: 0.9rem; color: var(--text-subtle); }
    .toc-link.level-3 { margin-left: 2rem; font-size: 0.85rem; color: var(--text-subtle); }
    .toc-link.active.level-2, .toc-link.active.level-3 { color: var(--accent-text); }

    .app-main {
      margin-left: 340px;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .app-header {
      background-color: var(--card-bg);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .stats-bar {
      display: flex;
      gap: 1.5rem;
      font-size: 0.9rem;
      color: var(--text-subtle);
    }
    .stat-badge {
      background-color: var(--sidebar-bg);
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
      border: 1px solid var(--border-color);
      font-weight: 600;
      color: var(--text-color);
    }

    .content-area {
      padding: 3rem 4rem;
      max-width: 1000px;
      margin: 0 auto;
      width: 100%;
    }
    .chapter-card {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 3rem;
      margin-bottom: 3rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: border-color 0.3s;
    }
    .chapter-card.highlighted {
      border: 2px solid var(--accent-color);
    }
    .chapter-meta {
      font-size: 0.85rem;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
    }

    /* Standard Markdown Formatting */
    .chapter-content h1 { font-family: var(--heading-font); font-size: 2.25rem; font-weight: 800; color: var(--accent-color); margin-top: 1.5rem; margin-bottom: 1rem; }
    .chapter-content h2 { font-family: var(--heading-font); font-size: 1.75rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.85rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem; }
    .chapter-content h3 { font-family: var(--heading-font); font-size: 1.35rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
    .chapter-content p { margin-bottom: 1.25rem; font-size: 1.1rem; }
    .chapter-content ul, .chapter-content ol { margin-left: 1.5rem; margin-bottom: 1.25rem; font-size: 1.1rem; }
    .chapter-content li { margin-bottom: 0.4rem; }
    
    .chapter-content blockquote {
      border-left: 4px solid var(--accent-color);
      background-color: var(--sidebar-bg);
      padding: 1rem 1.5rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1.5rem;
      font-style: italic;
    }
    
    .chapter-content pre {
      background-color: var(--code-bg);
      color: var(--code-text);
      padding: 1.25rem;
      border-radius: 8px;
      overflow-x: auto;
      font-family: var(--export-code-font), monospace;
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      border: 1px solid var(--border-color);
    }
    .chapter-content code {
      background-color: var(--code-bg);
      color: var(--code-text);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: var(--export-code-font), monospace;
      font-size: 0.9rem;
    }
    
    .chapter-content table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
      font-size: 1rem;
    }
    .chapter-content th {
      background-color: var(--sidebar-bg);
      color: var(--text-color);
      font-weight: 700;
      text-align: left;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
    }
    .chapter-content td {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
    }
    .chapter-content tr:nth-child(even) {
      background-color: var(--sidebar-bg);
    }

    /* Print / PDF styling — keeps theme colors, hides navigation */
    @media print {
      .app-sidebar, .app-header { display: none !important; }
      .app-main { margin-left: 0 !important; width: 100% !important; }
      .content-area { padding: 0 !important; max-width: 100% !important; }
      .chapter-card { border: none !important; box-shadow: none !important; padding: 0 !important; margin-bottom: 2rem !important; }
      .chapter-meta { color: #666 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .chapter-content h1 { color: var(--accent-color) !important; }
      .chapter-content h2, .chapter-content h3 { color: var(--text-color) !important; }
      .chapter-content p, .chapter-content li { color: var(--text-color) !important; }
      .chapter-content blockquote { border-left-color: var(--accent-color) !important; background-color: var(--sidebar-bg) !important; }
      .chapter-content pre { background-color: var(--code-bg) !important; color: var(--code-text) !important; }
    }

    /* Mobile Responsive */
    @media (max-width: 1024px) {
      .app-sidebar { width: 260px; }
      .app-main { margin-left: 260px; }
    }
    @media (max-width: 768px) {
      .app-sidebar { display: none; }
      .app-main { margin-left: 0; }
      .content-area { padding: 1.5rem; }
    }
  </style>
</head>
<body>

  <aside class="app-sidebar">
    <div class="sidebar-brand">
      <div class="site-title">${escapeHtml(config.siteTitle)}</div>
      <div class="site-subtitle">${escapeHtml(config.siteSubtitle)}</div>
    </div>
    <div class="sidebar-search">
      <input type="text" class="search-input" id="searchBox" placeholder="Search documentation..." oninput="filterContent()">
    </div>
    <nav class="toc-container">
      <div class="toc-title">Table of Contents</div>
      ${tocHtml}
    </nav>
  </aside>

  <main class="app-main">
    <header class="app-header">
      <div class="stats-bar">
        <span class="stat-badge">📄 ${parsedData.stats.lineCount.toLocaleString()} Lines</span>
        <span class="stat-badge">📝 ${parsedData.stats.wordCount.toLocaleString()} Words</span>
        <span class="stat-badge">⏱️ ~${parsedData.stats.readTimeMinutes} min read</span>
      </div>
      <div class="stats-bar">
        <span>Created by <strong>${escapeHtml(config.authorName)}</strong></span>
      </div>
    </header>

    <div class="content-area" id="contentArea">
      ${contentHtml}
    </div>
  </main>

  <script>
    function highlightChapter(id) {
      document.querySelectorAll('.chapter-card').forEach(c => c.classList.remove('highlighted'));
      document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
      
      const target = document.getElementById(id);
      if (target) {
        target.classList.add('highlighted');
      }
      
      const link = document.querySelector(\`.toc-link[href="#\${id}"]\`);
      if (link) {
        link.classList.add('active');
      }
    }

    function filterContent() {
      const q = document.getElementById('searchBox').value.toLowerCase();
      const articles = document.querySelectorAll('.chapter-card');
      
      articles.forEach(art => {
        const text = art.innerText.toLowerCase();
        if (text.includes(q)) {
          art.style.display = 'block';
        } else {
          art.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;

  const filename = `${config.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-website.html`;
  triggerFileDownload(html, filename, 'text/html;charset=utf-8');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
