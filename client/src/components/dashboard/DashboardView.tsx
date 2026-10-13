import React, { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Columns3,
} from 'lucide-react';
import {
  SHARED_MANUSCRIPTS,
  type SharedManuscript,
} from '../../data/communityData';
import { Top10Leaderboard } from '../ranking/Top10Leaderboard';
import { SharedManuscriptModal } from '../library/SharedManuscriptModal';
import { BookCover } from '../common/BookCover';
import { ChallengesSection } from './ChallengesSection';
import { Footer } from '../layout/Footer';

export const DashboardView: React.FC = () => {
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);
  const openRanking = useWorkspaceStore((s) => s.openRanking);

  const [selectedSharedManuscript, setSelectedSharedManuscript] = useState<SharedManuscript | null>(null);
  const [isSharedModalOpen, setIsSharedModalOpen] = useState(false);
  const [shelfLayout, setShelfLayout] = useState<'slider' | 'grid'>('slider');

  // Horizontal mouse drag-to-scroll refs
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

  const handleBookClick = (novel: SharedManuscript) => {
    if (hasMovedRef.current || isMouseDragging) return;
    setSelectedSharedManuscript(novel);
    setIsSharedModalOpen(true);
  };


  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-10">
      {/* Full width panels stretching to the edge of the screen */}
      <div className="w-full space-y-0 divide-y divide-canvas-border">
        {/* FIRST PART OF DASHBOARD: HOT CHALLENGE IMAGE BANNER (FULL WIDTH PANEL) */}
        <div className="w-full">
          <ChallengesSection showPlaygroundLink={true} className="" />
        </div>

        {/* SECOND PART OF DASHBOARD: WRITING CHAMPIONS PODIUM (FULL WIDTH PANEL) */}
        <div className="w-full pb-4 sm:pb-6 bg-canvas text-ink">
          <Top10Leaderboard
            onSelectAuthorWork={(workTitle) => {
              const found = SHARED_MANUSCRIPTS.find(
                (m) => m.title.toLowerCase() === workTitle.toLowerCase()
              );
              if (found) {
                setSelectedSharedManuscript(found);
                setIsSharedModalOpen(true);
              } else {
                openRanking();
              }
            }}
          />
        </div>

        {/* THIRD PART OF DASHBOARD: EXPLORE LIBRARY / SHELF (FULL WIDTH PANEL) */}
        <div className="w-full py-6 sm:py-10 bg-canvas space-y-4">
          <div className="px-4 sm:px-8 md:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* PANEL HEADER: EXPLORE LIBRARY (Matching Writing Challenge & Leaderboard) */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-stone-300/80 dark:border-white/15 rounded-none shadow-sm">
              <div className="w-0.5 h-3 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-900 dark:text-stone-100">
                Explore Library
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto flex-wrap">
              {/* Shelf Slider vs Grid View Toggle */}
              <div className="inline-flex p-1 rounded-none bg-canvas-surface border border-canvas-border text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setShelfLayout('slider')}
                  className={`px-2.5 py-1 rounded-none transition-colors cursor-pointer flex items-center gap-1.5 ${
                    shelfLayout === 'slider'
                      ? 'bg-canvas-card text-ink font-bold shadow-xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  title="Horizontal Shelf Slider"
                >
                  <Columns3 className="w-3.5 h-3.5 text-brand-600" />
                  <span>Slider</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShelfLayout('grid')}
                  className={`px-2.5 py-1 rounded-none transition-colors cursor-pointer flex items-center gap-1.5 ${
                    shelfLayout === 'grid'
                      ? 'bg-canvas-card text-ink font-bold shadow-xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  title="Full Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
              </div>

              <button
                type="button"
                onClick={openLibrary}
                className="text-xs font-mono text-brand-700 hover:text-brand-800 dark:text-brand-400 font-semibold flex items-center gap-1 group cursor-pointer"
                title="Open full library shelf"
              >
                <span>Full Shelf</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Constant Size Manuscripts Panel Container */}
          <div className="min-h-0 sm:min-h-[440px] md:min-h-[460px] flex flex-col justify-start px-3 sm:px-8 md:px-12 space-y-3">
            {shelfLayout === 'slider' ? (
                /* 1. DRAGGABLE HORIZONTAL SHELF CAROUSEL SLIDER */
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
                    {SHARED_MANUSCRIPTS.map((novel, idx) => (
                      <div
                        key={novel.id}
                        onClick={() => handleBookClick(novel)}
                        style={{ userSelect: 'none' }}
                        className={`w-[160px] xs:w-[175px] sm:w-[195px] md:w-[215px] flex-shrink-0 flex flex-col group select-none transition-all duration-300 ${
                          isMouseDragging ? 'cursor-grabbing' : 'cursor-pointer'
                        } hover:scale-[1.02]`}
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
                            {novel.genre === 'Zombie Apocalypse' ? '🧟 Zombie' : novel.genre}
                          </div>

                          {/* Top-Right Star Rating Badge */}
                          <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 bg-black/75 backdrop-blur-md text-amber-400 border border-white/10 shadow-sm pointer-events-none select-none">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{novel.rating.toFixed(2)}</span>
                          </div>

                          {/* Subtle hover gradient vignette */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="mt-2 px-0.5">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-ink truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {novel.title}
                          </h4>
                          <p className="text-[11px] text-ink-muted truncate font-sans mt-0.5">
                            {novel.author} • {novel.authorRank}
                          </p>
                          <p className="text-[10px] text-ink-faint font-mono mt-0.5 truncate">
                            {novel.chapterCount} ch • {(novel.totalWordCount || 0).toLocaleString()} words
                          </p>
                        </div>
                      </div>
                    ))}
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
              ) : (
                /* 2. FULL RESPONSIVE GRID VIEW */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4.5">
                  {SHARED_MANUSCRIPTS.map((novel, idx) => (
                    <div
                      key={novel.id}
                      onClick={() => handleBookClick(novel)}
                      style={{ userSelect: 'none' }}
                      className="cursor-pointer group flex flex-col select-none transition-all duration-300 hover:scale-[1.02]"
                      title={`${novel.title} by ${novel.author}`}
                    >
                      <div className="relative aspect-[2/3] w-full rounded-none overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 border border-black/15 dark:border-white/10 bg-neutral-900">
                        <BookCover
                          title={novel.title}
                          author={novel.author}
                          genre={novel.genre}
                          coverImage={novel.coverImage}
                          size="full"
                          badge={idx === 0 ? 'alterjot' : undefined}
                        />

                        <div className="absolute top-1.5 left-1.5 z-20 text-[9px] font-mono uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-black/75 backdrop-blur-md text-stone-200 border border-white/10 pointer-events-none">
                          {novel.genre === 'Zombie Apocalypse' ? '🧟 Zombie' : novel.genre}
                        </div>

                        <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 bg-black/75 backdrop-blur-md text-amber-400 border border-white/10 shadow-sm pointer-events-none select-none">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{novel.rating.toFixed(2)}</span>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="mt-2 px-0.5">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-ink truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {novel.title}
                        </h4>
                        <p className="text-[11px] text-ink-muted truncate font-sans mt-0.5">
                          {novel.author} • {novel.authorRank}
                        </p>
                        <p className="text-[10px] text-ink-faint font-mono mt-0.5 truncate">
                          {novel.chapterCount} ch • {(novel.totalWordCount || 0).toLocaleString()} words
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Website Footer */}
      <Footer />

      {/* Shared Manuscript Reader Modal */}
      <SharedManuscriptModal
        manuscript={selectedSharedManuscript}
        isOpen={isSharedModalOpen}
        onClose={() => setIsSharedModalOpen(false)}
      />
    </div>
  );
};
