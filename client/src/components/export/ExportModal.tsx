import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { api } from '../../services/api';
import { X, Download, Copy, Check, FileDown } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const isExportOpen = useWorkspaceStore((s) => s.isExportOpen);
  const setIsExportOpen = useWorkspaceStore((s) => s.setIsExportOpen);
  const activeNovel = useWorkspaceStore((s) => s.novels.find((n) => n._id === s.activeNovelId));

  const [format, setFormat] = useState<'markdown' | 'text'>('markdown');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isExportOpen || !activeNovel) return;

    setIsLoading(true);
    api
      .exportManuscript(activeNovel._id, format)
      .then((res) => {
        setContent(res.content || '');
      })
      .catch((err) => {
        console.error('Export failed:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isExportOpen, activeNovel?._id, format]);

  if (!isExportOpen || !activeNovel) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'markdown' ? 'md' : 'txt';
    const mime = format === 'markdown' ? 'text/markdown' : 'text/plain';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNovel.title.replace(/\s+/g, '_')}_Dossier.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl bg-canvas-card border border-canvas-border shadow-parchment-lg p-4 sm:p-6 text-ink">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-canvas-border">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-600/20 dark:text-brand-400 dark:border-brand-500/30">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-ink">Book Dossier Export</h3>
              <p className="text-[11px] sm:text-xs text-ink-muted font-mono">
                Compile complete survival chronicle with structured logs & dividers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExportOpen(false)}
            className="p-1.5 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 my-3 sm:my-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-ink-muted uppercase font-medium">Export Format:</span>
            <div className="flex rounded-lg bg-canvas-surface p-1 border border-canvas-border text-xs font-mono shadow-xs">
              <button
                type="button"
                onClick={() => setFormat('markdown')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  format === 'markdown'
                    ? 'bg-brand-600 text-white font-medium shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Markdown (.md)
              </button>
              <button
                type="button"
                onClick={() => setFormat('text')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  format === 'text'
                    ? 'bg-brand-600 text-white font-medium shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Plain Text (.txt)
              </button>
            </div>
          </div>

          <div className="text-xs font-mono text-ink-muted">
            Total Export Words: <span className="text-brand-700 font-bold">{activeNovel.totalWordCount?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="flex-1 min-h-[220px] sm:min-h-[300px] overflow-hidden rounded-xl border border-canvas-border bg-canvas-subtle/70 p-3 sm:p-4 font-typewriter text-xs text-ink shadow-inner">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-ink-faint">
              <span>Compiling book bundle...</span>
            </div>
          ) : (
            <textarea
              readOnly
              value={content}
              className="w-full h-full bg-transparent resize-none focus:outline-none select-text text-ink font-typewriter text-xs leading-relaxed"
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-canvas-border">
          <span className="text-[11px] sm:text-xs text-ink-muted leading-tight">
            Preserves chapters, headings, POVs, and divider glyphs.
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-ink text-xs font-mono transition-colors shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-[#245b32]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-mono font-medium transition-colors shadow-xs shadow-brand-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
