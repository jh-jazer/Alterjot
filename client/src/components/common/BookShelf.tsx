import React, { useState, useRef, useEffect } from 'react';
import type { Novel } from '../../types';
import { ChevronLeft, ChevronRight, Star, Eye } from 'lucide-react';
import { BookCover } from './BookCover';

export interface BookShelfProps {
  title: string;
  count: number;
  subtitle?: string;
  badgeIcon?: React.ComponentType<{ className?: string }>;
  books: Novel[];
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  onOpenBook: (novelId: string) => void;
  badgeType?: 'rating' | 'views' | 'new' | 'invited' | 'none';
  className?: string;
}

export const BookShelf: React.FC<BookShelfProps> = ({
  title,
  count,
  subtitle,
  badgeIcon: BadgeIcon,
  books,
  emptyMessage = 'No books in this shelf yet.',
  emptyAction,
  onOpenBook,
  badgeType = 'none',
  className = '',
}) => {
  const shelfRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [isMouseDragging, setIsMouseDragging] = useState(false);

  // Global mousemove and mouseup listeners for smooth shelf swipe
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

  const handleShelfMouseDown = (e: React.MouseEvent) => {
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

  const handleCardClick = (novelId: string) => {
    if (hasMovedRef.current || isMouseDragging) return;
    onOpenBook(novelId);
  };

  return (
    <section className={`space-y-3.5 ${className}`}>
      {/* Shelf Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-stone-300/80 dark:border-white/15 rounded-none shadow-sm">
            <div className="w-0.5 h-3 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
            <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />}
              <span>{title} ({count})</span>
            </h2>
          </div>
          {subtitle && (
            <span className="text-xs font-mono text-ink-muted hidden sm:inline">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Shelf Content */}
      {books.length === 0 ? (
        <div className="py-12 px-4 rounded-xl bg-canvas-card border border-canvas-border text-center flex flex-col items-center justify-center space-y-3">
          <p className="text-xs text-ink-muted font-sans">
            {emptyMessage}
          </p>
          {emptyAction && (
            <button
              type="button"
              onClick={emptyAction.onClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              {emptyAction.icon && <emptyAction.icon className="w-3.5 h-3.5" />}
              <span>{emptyAction.label}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="relative group/shelf w-full">
          {/* Left Chevron Button */}
          <button
            type="button"
            onClick={() => scrollShelf('left')}
            className="absolute -left-3 sm:-left-5 top-[40%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
            title="Scroll shelf left"
            aria-label="Scroll shelf left"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>

          {/* Slider Track */}
          <div
            ref={shelfRef}
            onMouseDown={handleShelfMouseDown}
            className={`flex gap-3 sm:gap-3.5 md:gap-4 overflow-x-auto scrollbar-none pb-3 pt-1 px-1 select-none transition-all ${
              isMouseDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              scrollBehavior: isMouseDragging ? 'auto' : 'smooth',
              userSelect: 'none',
            }}
          >
            {books.map((novel) => {
              const rating = novel.rating ?? 5.0;
              const views = novel.views ?? 0;

              return (
                <div
                  key={novel._id}
                  onClick={() => handleCardClick(novel._id)}
                  style={{ userSelect: 'none' }}
                  className={`w-[110px] xs:w-[125px] sm:w-[140px] md:w-[155px] flex-shrink-0 flex flex-col select-none group relative ${
                    isMouseDragging ? 'cursor-grabbing' : 'cursor-pointer'
                  }`}
                  title={`${novel.title} by ${novel.author || 'Anonymous'}`}
                >
                  <div className="relative aspect-[2/3] w-full rounded-none overflow-hidden shadow-sm border border-black/15 dark:border-white/10 bg-neutral-900">
                    <BookCover
                      title={novel.title}
                      author={novel.author}
                      genre={novel.genre}
                      coverImage={novel.coverImage}
                      size="full"
                    />

                    {/* Shelf-specific badge */}
                    {badgeType === 'rating' && (
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-amber-500/95 text-white font-mono text-[8px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>{rating.toFixed(1)}</span>
                      </div>
                    )}
                    {badgeType === 'views' && (
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-brand-600/95 text-white font-mono text-[8px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" />
                        <span>{views}</span>
                      </div>
                    )}
                    {badgeType === 'new' && (
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-brand-600/95 text-white font-mono text-[8px] font-bold uppercase tracking-wider shadow-sm">
                        New
                      </div>
                    )}
                    {badgeType === 'invited' && (
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-amber-600/95 text-white font-mono text-[8px] font-bold uppercase tracking-wider shadow-sm">
                        Invited
                      </div>
                    )}
                  </div>

                  <div className="mt-1.5 px-0.5">
                    <h4 className="font-serif font-bold text-xs text-ink truncate group-hover:text-brand-600 dark:group-hover:text-amber-400 transition-colors">
                      {novel.title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-ink-muted truncate font-sans mt-0.5">
                      {novel.author || 'Anonymous'}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-ink-faint font-mono mt-0.5 truncate">
                      {novel.chapterCount ?? 1} ch • {(novel.totalWordCount || 0).toLocaleString()} words
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Chevron Button */}
          <button
            type="button"
            onClick={() => scrollShelf('right')}
            className="absolute -right-3 sm:-right-5 top-[40%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
            title="Scroll shelf right"
            aria-label="Scroll shelf right"
          >
            <ChevronRight className="w-5 h-5 text-ink" />
          </button>
        </div>
      )}
    </section>
  );
};
