import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  X, 
  AlertCircle, 
  CheckCircle,
  FolderOpen,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Layers,
  FileCode
} from 'lucide-react';
import { Theme } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadMarkdown: (content: string, filename?: string) => Promise<void>;
  onLoadSample: () => Promise<void>;
  currentTheme: Theme;
}

interface UploadedFileItem {
  id: string;
  name: string;
  content: string;
  lineCount: number;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onLoadMarkdown,
  onLoadSample,
  currentTheme
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>('file');
  const [pastedText, setPastedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Multi-file state
  const [fileItems, setFileItems] = useState<UploadedFileItem[]>([]);
  const [consolidatedTitle, setConsolidatedTitle] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const newItems: UploadedFileItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const text = await file.text();
        const lines = text.split(/\r?\n/).length;
        newItems.push({
          id: `file-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          content: text,
          lineCount: lines
        });
      }

      setFileItems((prev) => {
        const joined = [...prev, ...newItems];
        if (joined.length > 0 && !consolidatedTitle) {
          setConsolidatedTitle(joined.length === 1 ? joined[0].name : `${joined[0].name} & ${joined.length - 1} More`);
        }
        return joined;
      });
    } catch (err: any) {
      setError(err.message || 'Failed to read uploaded files.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const moveFileUp = (index: number) => {
    if (index <= 0) return;
    setFileItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const moveFileDown = (index: number) => {
    if (index >= fileItems.length - 1) return;
    setFileItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const removeFile = (id: string) => {
    setFileItems((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConvertCombined = async () => {
    if (fileItems.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      // Concatenate files in user's exact ordered sequence
      const combinedText = fileItems
        .map((f, idx) => {
          // If the file doesn't start with a heading and we have multiple files, inject a nice title division
          const prefix = fileItems.length > 1 && !f.content.trim().startsWith('#') ? `# Section ${idx + 1}: ${f.name}\n\n` : '';
          return prefix + f.content;
        })
        .join('\n\n');

      const titleToUse = consolidatedTitle.trim() || 'Consolidated Specification';
      await onLoadMarkdown(combinedText, titleToUse);
      setFileItems([]);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to convert combined files.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await onLoadMarkdown(pastedText, 'Pasted Specification');
      setPastedText('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to parse pasted text.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerSample = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onLoadSample();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to load master sample.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-fade-in select-none">
      <div 
        className="relative w-full max-w-xl rounded-3xl border shadow-2xl p-8 flex flex-col space-y-6 overflow-hidden transition-all duration-300 animate-scale-up"
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
              <Upload className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-black">Upload Markdown Document</h2>
              <p className="text-xs opacity-70 mt-0.5">Instant Website Converter (Supports 40k+ lines)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 opacity-60 hover:opacity-100" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl p-1 border" style={{ backgroundColor: currentTheme.sidebarBg, borderColor: currentTheme.border }}>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'file' ? 'shadow-md scale-102' : 'opacity-60'
            }`}
            style={{
              backgroundColor: activeTab === 'file' ? currentTheme.accent : 'transparent',
              color: activeTab === 'file' ? currentTheme.accentText : currentTheme.text
            }}
          >
            📂 Select File (.md / .txt)
          </button>
          
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'paste' ? 'shadow-md scale-102' : 'opacity-60'
            }`}
            style={{
              backgroundColor: activeTab === 'paste' ? currentTheme.accent : 'transparent',
              color: activeTab === 'paste' ? currentTheme.accentText : currentTheme.text
            }}
          >
            📋 Paste Direct Markdown
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center space-x-2 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-xs font-bold text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* File Drag-Drop Area */}
        {activeTab === 'file' ? (
          <div className="flex flex-col space-y-4 text-left">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".md,.markdown,.txt"
              className="hidden"
              multiple
            />

            {fileItems.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group w-full rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-solid hover:scale-101 text-center"
                style={{
                  backgroundColor: currentTheme.sidebarBg,
                  borderColor: currentTheme.accent
                }}
              >
                <FolderOpen className="h-12 w-12 opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all mb-3" style={{ color: currentTheme.accent }} />
                <span className="text-base font-bold">Click or drop one or more Markdown files</span>
                <span className="text-xs opacity-60 mt-1">Combine multiple files into a single structured website!</span>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: currentTheme.border }}>
                  <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5" style={{ color: currentTheme.accent }}>
                    <Layers className="h-4 w-4" />
                    <span>Merged Document Sequence ({fileItems.length} Files)</span>
                  </span>
                  <span className="text-[10px] opacity-60">Reorder with ▲ / ▼ keys</span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {fileItems.map((item, idx) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl border shadow-xs transition-all hover:scale-101"
                      style={{
                        backgroundColor: currentTheme.sidebarBg,
                        borderColor: currentTheme.border
                      }}
                    >
                      <div className="flex items-center space-x-3 overflow-hidden pr-2">
                        <span className="text-xs font-mono font-bold shrink-0 opacity-40">#{idx + 1}</span>
                        <FileCode className="h-4 w-4 shrink-0" style={{ color: currentTheme.accent }} />
                        <div className="flex flex-col truncate">
                          <span className="text-xs font-bold truncate">{item.name}</span>
                          <span className="text-[10px] font-mono opacity-60">{item.lineCount.toLocaleString()} lines</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => moveFileUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg border transition-all hover:opacity-100 opacity-70 active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
                          style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}
                          title="Move file up earlier in sequence"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => moveFileDown(idx)}
                          disabled={idx === fileItems.length - 1}
                          className="p-1.5 rounded-lg border transition-all hover:opacity-100 opacity-70 active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
                          style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}
                          title="Move file down later in sequence"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => removeFile(item.id)}
                          className="p-1.5 rounded-lg border transition-all hover:opacity-100 opacity-70 active:scale-95 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 ml-1"
                          style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}
                          title="Remove file from sequence"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center space-x-1.5 rounded-xl border py-2.5 text-xs font-bold transition-all hover:opacity-90 active:scale-98 shadow-xs"
                    style={{
                      backgroundColor: currentTheme.sidebarBg,
                      borderColor: currentTheme.accent,
                      color: currentTheme.text
                    }}
                  >
                    <Plus className="h-4 w-4" style={{ color: currentTheme.accent }} />
                    <span>Add More Files</span>
                  </button>

                  <button
                    onClick={() => setFileItems([])}
                    className="px-3 py-2.5 rounded-xl border text-xs font-semibold opacity-60 hover:opacity-100"
                    style={{ backgroundColor: currentTheme.sidebarBg, borderColor: currentTheme.border }}
                  >
                    Clear List
                  </button>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider opacity-80">
                    Consolidated Website Title
                  </label>
                  <input
                    type="text"
                    value={consolidatedTitle}
                    onChange={(e) => setConsolidatedTitle(e.target.value)}
                    placeholder="e.g. Master Consolidated Database Specification"
                    className="w-full rounded-xl border p-3 text-xs font-semibold focus:outline-none"
                    style={{
                      backgroundColor: currentTheme.sidebarBg,
                      borderColor: currentTheme.border,
                      color: currentTheme.text
                    }}
                  />
                </div>

                <button
                  onClick={handleConvertCombined}
                  disabled={isLoading}
                  className="w-full rounded-xl py-3.5 text-xs font-black shadow-xl transition-transform hover:scale-102 active:scale-98 flex items-center justify-center space-x-2 mt-2 tracking-wide uppercase"
                  style={{
                    backgroundColor: currentTheme.accent,
                    color: currentTheme.accentText
                  }}
                >
                  <Sparkles className="h-4 w-4 animate-bounce" />
                  <span>Combine & Convert {fileItems.length} Files to Website 🚀</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handlePasteSubmit} className="flex flex-col space-y-4">
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={8}
              placeholder="# Enter your markdown text here...&#10;&#10;## Features&#10;- Lightning fast&#10;- 20 Stunning custom themes"
              className="w-full rounded-xl border p-4 text-xs font-mono focus:outline-none leading-relaxed resize-none"
              style={{
                backgroundColor: currentTheme.sidebarBg,
                borderColor: currentTheme.border,
                color: currentTheme.text
              }}
            />

            <button
              type="submit"
              disabled={isLoading || !pastedText.trim()}
              className="w-full rounded-xl py-3 text-xs font-extrabold shadow-lg transition-transform hover:scale-102 active:scale-98 disabled:opacity-40 disabled:pointer-events-none"
              style={{
                backgroundColor: currentTheme.accent,
                color: currentTheme.accentText
              }}
            >
              {isLoading ? 'Converting Website...' : 'Convert Pasted Text to Website 🚀'}
            </button>
          </form>
        )}

        {/* Modal Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t" style={{ borderColor: currentTheme.border }} />
          <span className="shrink mx-4 text-xs font-bold uppercase opacity-50 tracking-wider">Or Quick Test</span>
          <div className="flex-grow border-t" style={{ borderColor: currentTheme.border }} />
        </div>

        {/* Load 35k Master Technical Lexicon Sample Button */}
        <button
          onClick={triggerSample}
          disabled={isLoading}
          className="group flex items-center justify-between rounded-2xl border-2 p-4 transition-all hover:scale-102 active:scale-98 shadow-md"
          style={{
            backgroundColor: currentTheme.sidebarBg,
            borderColor: currentTheme.accent,
            color: currentTheme.text
          }}
        >
          <div className="flex items-center space-x-3 text-left">
            <Sparkles className="h-7 w-7 text-amber-500 shrink-0 group-hover:rotate-12 transition-transform" />
            <div>
              <div className="text-sm font-black" style={{ color: currentTheme.accent }}>
                Load 35,000-Line Master Technical Lexicon Sample
              </div>
              <div className="text-xs opacity-70 mt-0.5">
                Instantly generates a 35k technical document to test extreme performance
              </div>
            </div>
          </div>

          <CheckCircle className="h-5 w-5 opacity-40 group-hover:opacity-100 transition-opacity ml-2 shrink-0" style={{ color: currentTheme.accent }} />
        </button>
      </div>
    </div>
  );
};
