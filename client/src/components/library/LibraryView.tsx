import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { Novel } from '../../types';
import { NewNovelModal } from './NewNovelModal';
import {
  Book,
  BookOpen,
  Layers,
  Target,
  Edit,
  Trash2,
  FileDown,
  TrendingUp,
  Search,
} from 'lucide-react';
import { BookCover } from '../common/BookCover';

export const LibraryView: React.FC = () => {
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);
  const novels = useWorkspaceStore((s) => s.novels);
  const openStudio = useWorkspaceStore((s) => s.openStudio);
  const deleteNovel = useWorkspaceStore((s) => s.deleteNovel);
  const setIsExportOpen = useWorkspaceStore((s) => s.setIsExportOpen);
  const setIsDashboardOpen = useWorkspaceStore((s) => s.setIsDashboardOpen);
  const selectNovel = useWorkspaceStore((s) => s.selectNovel);
  const isNewNovelModalOpen = useWorkspaceStore((s) => s.isNewNovelModalOpen);
  const setIsNewNovelModalOpen = useWorkspaceStore((s) => s.setIsNewNovelModalOpen);

  const librarySearchQuery = useWorkspaceStore((s) => s.librarySearchQuery);
  const setLibrarySearchQuery = useWorkspaceStore((s) => s.setLibrarySearchQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 overflow-y-auto bg-canvas text-ink p-4 sm:p-8 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full text-center p-6 sm:p-8 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment-lg space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center mx-auto shadow-sm">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 font-bold">Manuscript Shelf</span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink mt-1">Sign In Required</h2>
            <p className="text-xs text-ink-muted font-sans mt-2 leading-relaxed">
              Sign in to access your manuscript library, organize your chapters, and review book statistics.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true, 'signin')}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-sm shadow-md shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Sign In to Unlock Shelf</span>
          </button>
        </div>
      </div>
    );
  }

  const totalWordsAcrossLibrary = novels.reduce((acc, n) => acc + (n.totalWordCount || 0), 0);

  const filteredNovels = novels.filter((novel) => {
    if (!librarySearchQuery.trim()) return true;
    const q = librarySearchQuery.toLowerCase();
    return (
      (novel.title && novel.title.toLowerCase().includes(q)) ||
      (novel.subtitle && novel.subtitle.toLowerCase().includes(q)) ||
      (novel.genre && novel.genre.toLowerCase().includes(q)) ||
      (novel.status && novel.status.toLowerCase().includes(q)) ||
      (novel.synopsis && novel.synopsis.toLowerCase().includes(q)) ||
      (novel.author && novel.author.toLowerCase().includes(q))
    );
  });

  const handleOpenBook = async (novelId: string) => {
    await openStudio(novelId);
  };

  const handleEditBook = (novel: Novel, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNovel(novel);
    setIsModalOpen(true);
  };

  const handleDeleteBook = async (novel: Novel, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to permanently delete "${novel.title}" and all its chapters?`)) {
      await deleteNovel(novel._id);
    }
  };

  const handleExportBook = async (novel: Novel, e: React.MouseEvent) => {
    e.stopPropagation();
    await selectNovel(novel._id);
    setIsExportOpen(true);
  };

  const handleMetricsBook = async (novel: Novel, e: React.MouseEvent) => {
    e.stopPropagation();
    await selectNovel(novel._id);
    setIsDashboardOpen(true);
  };

  const getStatusBadge = (_status?: string) => {
    return 'bg-canvas-surface text-ink-muted border-canvas-border';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-10">
      {/* Clean centered container with responsive padding on left and right */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
        
        {/* Library Desk Hero Banner (matching Dashboard cinematic dark card aesthetic) */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2c221a] via-[#211a14] to-[#16120e] text-white p-5 sm:p-7 shadow-xl border border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          {/* Ambient soft glow */}
          <div className="absolute right-0 top-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                Atelier Shelf Collection
              </span>
              <span className="text-xs font-mono text-neutral-400">
                • {novels.length} {novels.length === 1 ? 'Volume' : 'Volumes'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
              Your Manuscript Archive
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-serif max-w-xl leading-relaxed">
              Every volume resting upon your private study desk. Continue drafts in the studio or export ready manuscripts.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap w-full md:w-auto justify-between sm:justify-start relative z-10">
            {/* Library Output Metric Pill */}
            <div className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/5 border border-white/10 text-left backdrop-blur-xs min-w-[130px]">
              <span className="block text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                Total Words
              </span>
              <span className="text-base sm:text-lg font-serif font-bold text-amber-300">
                {totalWordsAcrossLibrary.toLocaleString()}{' '}
                <span className="text-[10px] sm:text-[11px] font-mono font-normal text-neutral-400">words</span>
              </span>
            </div>

            {/* New Manuscript Button */}
            <button
              type="button"
              onClick={() => setIsNewNovelModalOpen(true)}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-mono font-semibold uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-center whitespace-nowrap"
            >
              + New Book
            </button>
          </div>
        </div>

        {/* Mobile Dedicated Search Input (Visible on small screens where navbar search is hidden) */}
        <div className="sm:hidden relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={librarySearchQuery}
            onChange={(e) => setLibrarySearchQuery(e.target.value)}
            placeholder="Search manuscripts by title, genre..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-canvas-card border border-canvas-border text-xs font-sans text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-xs"
          />
          {librarySearchQuery && (
            <button
              type="button"
              onClick={() => setLibrarySearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink rounded-md"
              title="Clear search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Active Search Results Indicator */}
        {librarySearchQuery && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-canvas-card border border-canvas-border text-xs font-mono text-ink-muted shadow-xs">
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">
                Found <strong className="text-ink">{filteredNovels.length}</strong> {filteredNovels.length === 1 ? 'manuscript' : 'manuscripts'} matching &ldquo;<span className="text-brand-700">{librarySearchQuery}</span>&rdquo;
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLibrarySearchQuery('')}
              className="text-xs font-mono text-brand-600 hover:text-brand-700 underline cursor-pointer self-end sm:self-auto"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Manuscript Shelf Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight">
              Volumes on Shelf
            </h2>
            <span className="text-xs font-mono text-ink-muted">
              Tap any volume to open in Studio
            </span>
          </div>

          {novels.length === 0 ? (
            <div className="min-h-[430px] sm:min-h-[460px] py-16 sm:py-20 px-4 sm:px-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment text-center flex flex-col items-center justify-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-canvas-surface border border-canvas-border flex items-center justify-center text-brand-700 mx-auto mb-4 shadow-xs">
                <Book className="w-7 sm:w-8 h-7 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-ink mb-1">
                Your Library is Quiet
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed font-sans mb-5">
                No manuscripts found on your shelf. Start drafting with quick-write or build a new story volume.
              </p>
              <button
                type="button"
                onClick={() => setIsNewNovelModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Create First Manuscript
              </button>
            </div>
          ) : filteredNovels.length === 0 ? (
            <div className="min-h-[430px] sm:min-h-[460px] py-16 sm:py-20 px-4 sm:px-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment text-center flex flex-col items-center justify-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-canvas-surface border border-canvas-border flex items-center justify-center text-ink-muted mx-auto mb-3 shadow-xs">
                <Search className="w-5 sm:w-6 h-5 sm:h-6 text-brand-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-ink mb-1">
                No Matching Manuscripts
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto mb-4 leading-relaxed font-sans">
                We couldn&apos;t find any manuscripts matching &ldquo;{librarySearchQuery}&rdquo;. Try another title, genre, or premise keyword.
              </p>
              <button
                type="button"
                onClick={() => setLibrarySearchQuery('')}
                className="px-4 py-2 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-xs font-mono font-medium text-ink shadow-xs transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-h-[430px] sm:min-h-[460px]">
              {filteredNovels.map((novel) => {
                const totalWords = novel.totalWordCount || 0;
                const targetGoal = novel.targetWordCount || 80000;
                const progressPct = Math.min(100, Math.round((totalWords / targetGoal) * 100));

                return (
                  <div
                    key={novel._id}
                    onClick={() => handleOpenBook(novel._id)}
                    className="rounded-2xl border border-canvas-border bg-canvas-card hover:border-brand-500/70 transition-all duration-300 shadow-parchment hover:shadow-parchment-lg cursor-pointer group flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Top ribbon accent (unified for all manuscripts) */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-brand-700 via-amber-600/70 to-brand-800" />

                    <div className="p-3.5 sm:p-4 flex-1 flex flex-row gap-3 sm:gap-3.5 items-stretch">
                      {/* Book Cover Container */}
                      <div className="flex-shrink-0 flex items-center justify-center pt-0.5">
                        <div className="transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1">
                          <BookCover
                            title={novel.title}
                            author={novel.author}
                            genre={novel.genre}
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Genre & Status */}
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-700 font-semibold truncate">
                              {novel.genre}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded-full border tracking-wide uppercase font-medium shadow-xs ${getStatusBadge(
                                novel.status
                              )}`}
                            >
                              {novel.status}
                            </span>
                          </div>

                          {/* Title & Subtitle */}
                          <h3 className="text-sm sm:text-base font-serif font-bold text-ink group-hover:text-brand-700 transition-colors line-clamp-1">
                            {novel.title}
                          </h3>
                          {novel.subtitle && (
                            <p className="text-xs text-ink-muted italic font-serif mt-0.5 line-clamp-1">
                              {novel.subtitle}
                            </p>
                          )}

                          <div className="text-[11px] text-ink-faint font-mono mt-0.5 truncate">
                            By {novel.author || 'Anonymous'}
                          </div>

                          {/* Synopsis */}
                          {novel.synopsis && (
                            <p className="text-xs text-ink-muted mt-1 line-clamp-2 leading-relaxed font-sans">
                              {novel.synopsis}
                            </p>
                          )}
                        </div>

                        {/* Progress Bar & Word Metrics */}
                        <div className="mt-3 pt-2 border-t border-canvas-border">
                          <div className="flex items-baseline justify-between text-xs font-mono mb-1">
                            <span className="text-ink font-semibold text-xs">
                              {totalWords.toLocaleString()} <span className="text-ink-faint text-[10px]">words</span>
                            </span>
                            <span className="text-brand-700 font-bold">{progressPct}%</span>
                          </div>

                          <div className="w-full bg-canvas-surface rounded-full h-1.5 overflow-hidden border border-canvas-border/60">
                            <div
                              className="bg-brand-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(3, progressPct)}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mt-2">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3 text-ink-faint" />
                              <span>{novel.chapterCount ?? 1} ch</span>
                            </span>

                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3 text-ink-faint" />
                              <span>Goal: {targetGoal.toLocaleString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="px-4 sm:px-5 py-2.5 bg-canvas-surface/70 border-t border-canvas-border flex items-center justify-between text-xs gap-2">
                      <span className="text-brand-700 font-serif font-semibold text-xs group-hover:underline truncate">
                        Open in Studio →
                      </span>

                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleMetricsBook(novel, e)}
                          className="p-1.5 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-brand-700 transition-colors touch-manipulation"
                          title="View Metrics"
                          aria-label="View Metrics"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleExportBook(novel, e)}
                          className="p-1.5 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-brand-700 transition-colors touch-manipulation"
                          title="Export Manuscript"
                          aria-label="Export Manuscript"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleEditBook(novel, e)}
                          className="p-1.5 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-brand-700 transition-colors touch-manipulation"
                          title="Edit Book Details"
                          aria-label="Edit Book Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteBook(novel, e)}
                          className="p-1.5 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-rose-600 transition-colors touch-manipulation"
                          title="Delete Book"
                          aria-label="Delete Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Creation / Edit Modal */}
      <NewNovelModal
        isOpen={isModalOpen || isNewNovelModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsNewNovelModalOpen(false);
          setEditingNovel(null);
        }}
        editingNovel={editingNovel}
      />
    </div>
  );
};
