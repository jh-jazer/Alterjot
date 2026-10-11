import React, { useState, useEffect } from 'react';
import type { SharedManuscript } from '../../data/communityData';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  X,
  BookOpen,
  User,
  Star,
  FileText,
  ListOrdered,
  Feather,
} from 'lucide-react';
import { BookCover } from '../common/BookCover';

interface SharedManuscriptModalProps {
  manuscript: SharedManuscript | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SharedManuscriptModal: React.FC<SharedManuscriptModalProps> = ({
  manuscript,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'excerpt' | 'chapters'>('overview');
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
    }
  }, [isOpen, manuscript?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !manuscript) return null;

  const handleStartWriting = async () => {
    onClose();
    if (!isAuthenticated) {
      setIsAuthModalOpen(true, 'signin');
    } else {
      await startWritingImmediately();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shared-manuscript-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] bg-canvas-card border border-canvas-border rounded-2xl sm:rounded-3xl shadow-parchment-2xl flex flex-col overflow-hidden text-ink animate-scaleUp"
      >
        {/* Top Spine Ribbon (unified for all manuscripts) */}
        <div className="h-2.5 w-full bg-gradient-to-r from-brand-700 via-amber-600/70 to-brand-800" />

        {/* Header Section */}
        <div className="p-5 sm:p-7 border-b border-canvas-border/80 bg-canvas-surface/40 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors"
            title="Close manuscript view"
            aria-label="Close manuscript view"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 pr-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 min-w-0 flex-1">
              {/* Dedicated Book Cover Container in Modal */}
              <div className="flex-shrink-0">
                <div className="shadow-xl rounded-r-lg rounded-l-xs">
                  <BookCover
                    title={manuscript.title}
                    author={manuscript.author}
                    genre={manuscript.genre}
                    coverImage={manuscript.coverImage}
                    size="md"
                  />
                </div>
              </div>

              <div className="space-y-1.5 min-w-0 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 font-bold border border-brand-500/20">
                    {manuscript.genre}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-canvas-surface border border-canvas-border text-ink-muted">
                    {manuscript.status}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {manuscript.rating.toFixed(2)}
                  </span>
                </div>

                <h2
                  id="shared-manuscript-title"
                  className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-ink tracking-tight"
                >
                  {manuscript.title}
                </h2>

                {manuscript.subtitle && (
                  <p className="text-xs sm:text-sm text-ink-muted font-serif italic">
                    {manuscript.subtitle}
                  </p>
                )}

                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs font-mono text-ink-muted">
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <span className="font-semibold text-ink">{manuscript.author}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    {manuscript.authorRank}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-xs font-mono bg-canvas-card px-3.5 py-2 rounded-xl border border-canvas-border flex-shrink-0">
              <div className="text-right">
                <span className="text-base sm:text-lg font-bold font-serif text-brand-700 dark:text-brand-400">
                  {manuscript.totalWordCount.toLocaleString()}
                </span>
                <span className="text-[10px] text-ink-faint block">words penned</span>
              </div>
              <span className="text-[11px] text-ink-muted">
                {manuscript.chapterCount} chapters
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 pt-2 border-t border-canvas-border/60">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas-hover'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('excerpt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTab === 'excerpt'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas-hover'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Read Excerpt</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chapters')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTab === 'chapters'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas-hover'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Table of Contents ({manuscript.chapters.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 max-h-[50vh]">
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted font-bold mb-2">
                  Manuscript Synopsis
                </h4>
                <p className="font-serif text-sm sm:text-base leading-relaxed text-ink/90 bg-canvas-surface/50 p-4 rounded-xl border border-canvas-border/70">
                  {manuscript.synopsis}
                </p>
              </div>

              {/* Progress & Target words */}
              <div className="space-y-2 p-4 rounded-xl bg-canvas-card border border-canvas-border">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-ink-muted">Milestone Progress</span>
                  <span className="font-bold text-ink">
                    {Math.min(100, Math.round((manuscript.totalWordCount / manuscript.targetWordCount) * 100))}% of {manuscript.targetWordCount.toLocaleString()} w goal
                  </span>
                </div>
                <div className="h-2 w-full bg-canvas-surface rounded-full overflow-hidden border border-canvas-border/50">
                  <div
                    className="h-full bg-brand-600 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((manuscript.totalWordCount / manuscript.targetWordCount) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Story Highlights */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted font-bold mb-2.5">
                  Archived Chapters Preview
                </h4>
                <div className="space-y-2">
                  {manuscript.chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-canvas-surface border border-canvas-border/80 flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-serif font-bold text-ink block">
                          {ch.title}
                        </span>
                        <p className="text-[11px] text-ink-muted font-sans mt-0.5 line-clamp-1">
                          {ch.synopsis}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-ink-faint flex-shrink-0">
                        {ch.wordCount.toLocaleString()} w
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'excerpt' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-canvas-border pb-2.5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-700 dark:text-brand-300 font-bold">
                    Author Excerpt
                  </span>
                  <h4 className="font-serif font-bold text-base text-ink">
                    {manuscript.sampleExcerpt.chapterTitle}
                  </h4>
                </div>
                <span className="text-xs font-mono text-ink-faint">
                  Draft Sample
                </span>
              </div>

              {/* Formatted Book Reader Canvas */}
              <div className="p-6 sm:p-8 rounded-2xl bg-canvas-surface/80 border border-canvas-border font-serif text-sm sm:text-base leading-relaxed text-ink space-y-4 select-text">
                {manuscript.sampleExcerpt.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="indent-6 sm:indent-8 first:indent-0 text-justify">
                    {pIdx === 0 ? (
                      <>
                        <span className="float-left text-3xl sm:text-4xl leading-none font-bold font-serif mr-2 text-brand-700 dark:text-brand-300">
                          {paragraph.charAt(0)}
                        </span>
                        {paragraph.slice(1)}
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chapters' && (
            <div className="space-y-3 animate-fadeIn">
              <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted font-bold">
                Chapter Directory ({manuscript.chapters.length} recorded)
              </h4>
              <div className="divide-y divide-canvas-border/80 border border-canvas-border rounded-xl bg-canvas-card overflow-hidden">
                {manuscript.chapters.map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 hover:bg-canvas-hover transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-canvas-surface border border-canvas-border flex items-center justify-center text-[10px] font-mono font-bold text-ink-muted flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-serif font-bold text-ink block truncate">
                          {ch.title}
                        </span>
                        <p className="text-[11px] text-ink-muted font-sans line-clamp-1">
                          {ch.synopsis}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-ink-muted font-medium flex-shrink-0">
                      {ch.wordCount.toLocaleString()} w
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-canvas-border bg-canvas-surface/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-ink-muted text-center sm:text-left">
            <span>Authored by </span>
            <strong className="text-ink">{manuscript.author}</strong>
            <span> in the Alterjot Atelier</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-canvas-border bg-canvas-card hover:bg-canvas-hover text-ink text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleStartWriting}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-serif font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Start Writing in Studio' : 'Sign In to Write Story'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
