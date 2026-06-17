import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Grid, 
  Sparkles, 
  Download, 
  Layers,
  Check
} from 'lucide-react';
import { PresentationSlide, Theme, WebsiteConfig } from '../types';

interface PresentationModeProps {
  slides: PresentationSlide[];
  currentTheme: Theme;
  config: WebsiteConfig;
  onExportPpt: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  slides,
  currentTheme,
  config,
  onExportPpt
}) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeSlide = slides[currentSlideIdx] || slides[0];

  const nextSlide = useCallback(() => {
    if (currentSlideIdx < slides.length - 1) {
      setCurrentSlideIdx((prev) => prev + 1);
    }
  }, [currentSlideIdx, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx((prev) => prev - 1);
    }
  }, [currentSlideIdx]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-4rem)] w-full relative transition-colors duration-200 select-none overflow-hidden"
      style={{
        backgroundColor: currentTheme.sidebarBg,
        color: currentTheme.text
      }}
    >
      {/* Top Slide Control Bar */}
      <div className="flex items-center justify-between border-b px-6 py-3"
        style={{
          backgroundColor: currentTheme.cardBg,
          borderColor: currentTheme.border
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <Layers className="h-4 w-4" style={{ color: currentTheme.accent }} />
            <span>Interactive Slide Mode</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold"
            style={{
              backgroundColor: currentTheme.sidebarBg,
              color: currentTheme.textSubtle
            }}
          >
            Slide {currentSlideIdx + 1} / {slides.length}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onExportPpt}
            className="flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: currentTheme.accent,
              borderColor: currentTheme.border,
              color: currentTheme.accentText
            }}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Offline Presentation</span>
          </button>

          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`flex items-center space-x-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              showThumbnails ? 'shadow-inner font-bold' : ''
            }`}
            style={{
              backgroundColor: showThumbnails ? currentTheme.accent : currentTheme.sidebarBg,
              borderColor: currentTheme.border,
              color: showThumbnails ? currentTheme.accentText : currentTheme.text
            }}
            title="Open slides grid thumbnail drawer"
          >
            <Grid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Thumbnails</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg border transition-all hover:scale-105"
            style={{
              backgroundColor: currentTheme.sidebarBg,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Deck Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-y-auto">
        {!activeSlide ? (
          <div className="text-center py-12">
            <Sparkles className="h-10 w-10 mx-auto animate-spin opacity-50" />
            <p className="mt-2 text-sm">Synthesizing Presentation Slides...</p>
          </div>
        ) : (
          <div 
            className="w-full max-w-5xl aspect-[16/9] max-h-[750px] rounded-2xl border flex flex-col justify-between p-8 md:p-14 shadow-2xl transition-all duration-300 relative overflow-y-auto"
            style={{
              backgroundColor: currentTheme.cardBg,
              borderColor: currentTheme.border,
              boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.4)`
            }}
          >
            {/* Slide Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-6 text-xs uppercase tracking-widest font-extrabold opacity-75"
              style={{ borderColor: currentTheme.border }}
            >
              <span className="truncate max-w-[300px]">{config.siteTitle}</span>
              <span>Slide {activeSlide.slideNumber} of {slides.length}</span>
            </div>

            {/* Slide Body */}
            <div className="flex-1 flex flex-col justify-center my-auto py-4">
              <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-3"
                style={{ color: currentTheme.accent }}
              >
                {activeSlide.title}
              </h1>

              {activeSlide.subtitle && (
                <h3 className="text-xl md:text-2xl font-bold mb-6 opacity-85"
                  style={{ color: currentTheme.textSubtle }}
                >
                  {activeSlide.subtitle}
                </h3>
              )}

              <div 
                className="slide-content-prose text-lg md:text-xl leading-relaxed max-w-4xl space-y-4"
                style={{ color: currentTheme.text }}
                dangerouslySetInnerHTML={{ __html: styleSlideContent(activeSlide.contentHtml, currentTheme) }}
              />
            </div>

            {/* Slide Footer Branding */}
            <div className="flex items-center justify-between border-t pt-4 mt-8 text-xs font-medium opacity-60"
              style={{ borderColor: currentTheme.border }}
            >
              <span>Authored by {config.authorName}</span>
              <span className="hidden md:inline">Use Left/Right arrows to navigate</span>
            </div>
          </div>
        )}

        {/* Thumbnail Bottom Drawer */}
        {showThumbnails && (
          <div 
            className="absolute bottom-4 inset-x-4 h-64 rounded-2xl border shadow-2xl p-4 flex flex-col z-30 backdrop-blur-xl animate-slide-up"
            style={{
              backgroundColor: `${currentTheme.cardBg}f2`,
              borderColor: currentTheme.border
            }}
          >
            <div className="flex items-center justify-between mb-3 border-b pb-2" style={{ borderColor: currentTheme.border }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.accent }}>
                Slide Deck Thumbnails ({slides.length} total)
              </span>
              <button 
                onClick={() => setShowThumbnails(false)}
                className="text-xs font-semibold px-2 py-1 rounded hover:opacity-80"
                style={{ backgroundColor: currentTheme.sidebarBg }}
              >
                Close Drawer
              </button>
            </div>

            <div className="flex-1 overflow-x-auto flex items-center space-x-3 pb-2 scrollbar-thin">
              {slides.map((s, idx) => {
                const isSelected = idx === currentSlideIdx;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setCurrentSlideIdx(idx);
                      setShowThumbnails(false);
                    }}
                    className={`shrink-0 w-52 h-36 rounded-xl border p-3 flex flex-col justify-between cursor-pointer transition-all ${
                      isSelected ? 'ring-4 scale-105 font-bold' : 'hover:opacity-90 opacity-75'
                    }`}
                    style={{
                      backgroundColor: currentTheme.sidebarBg,
                      borderColor: isSelected ? currentTheme.accent : currentTheme.border
                    }}
                  >
                    <div className="text-[10px] uppercase font-mono tracking-wider opacity-60 flex justify-between">
                      <span>Slide {s.slideNumber}</span>
                      {isSelected && <Check className="h-3 w-3" style={{ color: currentTheme.accent }} />}
                    </div>
                    
                    <div className="text-xs font-bold line-clamp-3 my-auto leading-snug" style={{ color: currentTheme.accent }}>
                      {s.title}
                    </div>

                    <div className="text-[9px] opacity-60 truncate">
                      {s.subtitle || 'Content Details'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Navigation Toolbar */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none z-20">
        <div className="pointer-events-auto flex items-center space-x-4 rounded-full border px-6 py-2.5 shadow-2xl backdrop-blur-lg"
          style={{
            backgroundColor: `${currentTheme.cardBg}eb`,
            borderColor: currentTheme.border
          }}
        >
          <button
            onClick={prevSlide}
            disabled={currentSlideIdx === 0}
            className="flex items-center space-x-1.5 px-3 py-1 text-sm font-bold rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            style={{ color: currentTheme.accent }}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="h-4 w-px opacity-30" style={{ backgroundColor: currentTheme.border }} />

          <span className="text-xs font-mono font-bold tracking-widest px-2" style={{ color: currentTheme.text }}>
            {currentSlideIdx + 1} / {slides.length}
          </span>

          <div className="h-4 w-px opacity-30" style={{ backgroundColor: currentTheme.border }} />

          <button
            onClick={nextSlide}
            disabled={currentSlideIdx === slides.length - 1}
            className="flex items-center space-x-1.5 px-3 py-1 text-sm font-bold rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            style={{ color: currentTheme.accent }}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

function styleSlideContent(html: string, theme: Theme): string {
  if (!html) return '<p style="opacity:0.5; font-style:italic;">No secondary text. Press Next or use Arrow keys.</p>';
  
  let processed = html;
  
  processed = processed.replace(
    /<ul>/gi, 
    `<ul style="list-style-type: disc; margin-left: 2rem; margin-top: 1rem; margin-bottom: 1rem; space-y: 0.75rem;">`
  );

  processed = processed.replace(
    /<ol>/gi, 
    `<ol style="list-style-type: decimal; margin-left: 2rem; margin-top: 1rem; margin-bottom: 1rem; space-y: 0.75rem;">`
  );

  processed = processed.replace(
    /<li>/gi, 
    `<li style="margin-bottom: 0.75rem;">`
  );

  processed = processed.replace(
    /<pre><code(.*?)>([\s\S]*?)<\/code><\/pre>/gi,
    `<pre style="background-color: ${theme.codeBg}; color: ${theme.codeText}; padding: 1.25rem; border-radius: 8px; font-family: monospace; font-size: 0.9rem; max-height: 280px; overflow-y: auto; border: 1px solid ${theme.border}; margin: 1.5rem 0;"><code$1>$2</code></pre>`
  );

  return processed;
}
