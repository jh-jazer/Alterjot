import React, { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { Novel } from '../../types';
import { NewNovelModal } from './NewNovelModal';
import {
  Book,
  BookOpen,
  Edit,
  Trash2,
  FileDown,
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
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

  const shelfRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [isMouseDragging, setIsMouseDragging] = useState(false);

  // Global mousemove and mouseup listeners for butter-smooth shelf swipe
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current || !shelfRef.current) return;
      const walk = (e.clientX - startXRef.current) * 1.5;
      if (Math.abs(walk) > 4) {
        hasMovedRef.current = true;
        if (!isMouseDragging) setIsMouseDragging(true);
        shelfRef.current.scrollLeft = scrollLeftRef.current - walk;
      }
    };

    const handleGlobalMouseUp = () => {
      if (isMouseDownRef.current) {
        isMouseDownRef.current = false;
        setTimeout(() => {
          setIsMouseDragging(false);
          hasMovedRef.current = false;
        }, 80);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isMouseDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!shelfRef.current) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;

    isMouseDownRef.current = true;
    startXRef.current = e.clientX;
    scrollLeftRef.current = shelfRef.current.scrollLeft;
    hasMovedRef.current = false;
  };

  const scrollShelf = (direction: 'left' | 'right') => {
    if (!shelfRef.current) return;
    const scrollAmount = shelfRef.current.clientWidth * 0.75;
    shelfRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleOpenBook = async (novelId: string) => {
    if (hasMovedRef.current || isMouseDragging) return;
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

  const renderBookItem = (novel: Novel, idx: number) => (
    <div
      key={novel._id}
      onClick={() => handleOpenBook(novel._id)}
      style={{ userSelect: 'none' }}
      className={`w-[160px] xs:w-[175px] sm:w-[195px] md:w-[215px] flex-shrink-0 flex flex-col group select-none transition-all duration-300 ${
        isMouseDragging ? 'cursor-grabbing' : 'cursor-pointer'
      } hover:scale-[1.02] relative`}
      title={`${novel.title} by ${novel.author}`}
    >
      <div className="relative aspect-[2/3] w-full rounded-none overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-300 border border-black/15 dark:border-white/10 bg-neutral-900">
        <BookCover
          title={novel.title}
          author={novel.author}
          genre={novel.genre}
          coverImage={novel.coverImage}
          size="full"
          badge={idx === 0 ? 'alterjot' : undefined}
        />

        {/* Genre tag badge */}
        <div className="absolute top-1.5 left-1.5 z-20 text-[9px] font-mono uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-black/75 backdrop-blur-md text-stone-200 border border-white/10 pointer-events-none">
          {novel.genre === 'Zombie Apocalypse' ? '🧟 Zombie' : (novel.genre || 'Manuscript')}
        </div>

        {/* Top-Right Status Badge */}
        <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 bg-black/75 backdrop-blur-md text-amber-400 border border-white/10 shadow-sm pointer-events-none select-none">
          <span>{novel.status || 'Draft'}</span>
        </div>

        {/* Subtle hover gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Card Hover Action Bar for Manuscript Management */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2 inset-x-2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-around bg-black/85 backdrop-blur-md py-1.5 px-2 border border-white/15 shadow-lg"
        >
          <button
            type="button"
            onClick={(e) => handleEditBook(novel, e)}
            className="p-1 rounded text-stone-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title="Edit Book Details"
            aria-label="Edit Book Details"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => handleExportBook(novel, e)}
            className="p-1 rounded text-stone-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title="Export Manuscript"
            aria-label="Export Manuscript"
          >
            <FileDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => handleMetricsBook(novel, e)}
            className="p-1 rounded text-stone-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title="View Metrics"
            aria-label="View Metrics"
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => handleDeleteBook(novel, e)}
            className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-900/50 transition-colors cursor-pointer"
            title="Delete Book"
            aria-label="Delete Book"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Book Metadata Under Cover matching Explore Library */}
      <div className="mt-2 px-0.5">
        <h4 className="font-serif font-bold text-xs sm:text-sm text-ink truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {novel.title}
        </h4>
        <p className="text-[11px] text-ink-muted truncate font-sans mt-0.5">
          {novel.author || 'Anonymous'}
        </p>
        <p className="text-[10px] text-ink-faint font-mono mt-0.5 truncate">
          {novel.chapterCount ?? 1} ch • {(novel.totalWordCount || 0).toLocaleString()} words
        </p>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="flex-1 overflow-y-auto bg-canvas text-ink p-4 sm:p-8 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full text-center p-6 sm:p-8 rounded-xl bg-canvas-card border border-canvas-border shadow-parchment-lg space-y-4">
          <div className="w-14 h-14 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center mx-auto shadow-sm">
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
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-sm shadow-md shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-10">
      {/* Full width panel container */}
      <div className="w-full px-4 sm:px-8 md:px-12 py-6 sm:py-10 space-y-6 sm:space-y-10">
        
        {/* Library Desk Hero Banner (Sharp 90° edge aesthetic) */}
        <div className="relative rounded-none overflow-hidden bg-gradient-to-r from-[#2c221a] via-[#211a14] to-[#16120e] text-white p-5 sm:p-7 shadow-none border border-black/20 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          {/* Ambient soft glow */}
          <div className="absolute right-0 top-0 w-72 h-72 bg-amber-500/10 rounded-none blur-3xl pointer-events-none" />

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

        {/* Manuscript Shelf Section (Always Slider Only) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-stone-300/80 dark:border-white/15 rounded-none shadow-sm">
              <div className="w-0.5 h-3 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-900 dark:text-stone-100">
                Volumes on Shelf
              </h2>
            </div>

            <span className="text-xs font-mono text-ink-muted">
              Tap any volume to open in Studio • Drag or swipe shelf
            </span>
          </div>

          {novels.length === 0 ? (
            <div className="min-h-[430px] sm:min-h-[460px] py-16 sm:py-20 px-4 sm:px-6 rounded-xl bg-canvas-card border border-canvas-border shadow-parchment text-center flex flex-col items-center justify-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-canvas-surface border border-canvas-border flex items-center justify-center text-brand-700 mx-auto mb-4 shadow-xs">
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
                className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Create First Manuscript
              </button>
            </div>
          ) : filteredNovels.length === 0 ? (
            <div className="min-h-[430px] sm:min-h-[460px] py-16 sm:py-20 px-4 sm:px-6 rounded-xl bg-canvas-card border border-canvas-border shadow-parchment text-center flex flex-col items-center justify-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-canvas-surface border border-canvas-border flex items-center justify-center text-ink-muted mx-auto mb-3 shadow-xs">
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
                className="px-4 py-2 rounded-lg bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-xs font-mono font-medium text-ink shadow-xs transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* DRAGGABLE HORIZONTAL SHELF CAROUSEL SLIDER (ALWAYS SLIDER ONLY) */
            <div className="relative group/shelf w-full">
              {/* Left Chevron Button */}
              <button
                type="button"
                onClick={() => scrollShelf('left')}
                className="absolute -left-3 sm:-left-5 top-[38%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
                title="Scroll shelf left"
                aria-label="Scroll shelf left"
              >
                <ChevronLeft className="w-5 h-5 text-ink" />
              </button>

              {/* Scrollable Track with Fluid Mouse Drag / Swipe */}
              <div
                ref={shelfRef}
                onMouseDown={handleMouseDown}
                className={`flex gap-3.5 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-none pb-4 pt-1 px-1 select-none transition-all ${
                  isMouseDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  scrollBehavior: isMouseDragging ? 'auto' : 'smooth',
                  userSelect: 'none',
                }}
              >
                {filteredNovels.map((novel, idx) => renderBookItem(novel, idx))}
              </div>

              {/* Right Chevron Button */}
              <button
                type="button"
                onClick={() => scrollShelf('right')}
                className="absolute -right-3 sm:-right-5 top-[38%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
                title="Scroll shelf right"
                aria-label="Scroll shelf right"
              >
                <ChevronRight className="w-5 h-5 text-ink" />
              </button>
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
