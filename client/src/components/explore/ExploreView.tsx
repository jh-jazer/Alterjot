import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { Novel } from '../../types';
import {
  Search,
  Star,
  Eye,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { BookCover } from '../common/BookCover';
import { Footer } from '../layout/Footer';

export const ExploreView: React.FC = () => {
  const navigate = useNavigate();
  const publishedNovels = useWorkspaceStore((s) => s.publishedNovels);
  const myNovels = useWorkspaceStore((s) => s.novels);
  const loadPublishedNovels = useWorkspaceStore((s) => s.loadPublishedNovels);
  const selectNovel = useWorkspaceStore((s) => s.selectNovel);
  const setIsReaderMode = useWorkspaceStore((s) => s.setIsReaderMode);

  const [searchQuery, setSearchQuery] = useState('');

  // Refs for horizontal shelf dragging & chevron scrolling (matching LibraryView)
  const highestRatedShelfRef = useRef<HTMLDivElement>(null);
  const highestViewsShelfRef = useRef<HTMLDivElement>(null);
  const newShelfRef = useRef<HTMLDivElement>(null);
  const allPublishedShelfRef = useRef<HTMLDivElement>(null);

  const activeShelfRef = useRef<HTMLDivElement | null>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [isMouseDragging, setIsMouseDragging] = useState(false);

  // Load published books on mount
  useEffect(() => {
    loadPublishedNovels();
  }, [loadPublishedNovels]);

  // Global mousemove and mouseup listeners for smooth shelf swipe
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current || !activeShelfRef.current) return;
      const walk = (e.clientX - startXRef.current) * 1.5;
      if (Math.abs(walk) > 4) {
        hasMovedRef.current = true;
        if (!isMouseDragging) setIsMouseDragging(true);
        activeShelfRef.current.scrollLeft = scrollLeftRef.current - walk;
      }
    };

    const handleGlobalMouseUp = () => {
      if (isMouseDownRef.current) {
        isMouseDownRef.current = false;
        activeShelfRef.current = null;
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

  const handleShelfMouseDown = (shelfEl: HTMLDivElement | null, e: React.MouseEvent) => {
    if (!shelfEl) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;

    isMouseDownRef.current = true;
    activeShelfRef.current = shelfEl;
    startXRef.current = e.clientX;
    scrollLeftRef.current = shelfEl.scrollLeft;
    hasMovedRef.current = false;
  };

  const scrollShelf = (shelfEl: HTMLDivElement | null, direction: 'left' | 'right') => {
    if (!shelfEl) return;
    const scrollAmount = shelfEl.clientWidth * 0.75;
    shelfEl.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleOpenBook = async (novelId: string) => {
    if (hasMovedRef.current || isMouseDragging) return;
    setIsReaderMode(true);
    await selectNovel(novelId);
    navigate(`/book/${novelId}?mode=reader`);
  };

  // Consolidate genuine published books (strictly no dummy data)
  const allPublishedBooks = useMemo<Novel[]>(() => {
    const map = new Map<string, Novel>();
    (publishedNovels || []).forEach((n) => {
      if (n && n._id && n.isPublished) {
        map.set(n._id, n);
      }
    });
    (myNovels || []).forEach((n) => {
      if (n && n._id && n.isPublished) {
        map.set(n._id, n);
      }
    });
    return Array.from(map.values());
  }, [publishedNovels, myNovels]);

  // Apply search query filter
  const filteredAll = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allPublishedBooks;
    return allPublishedBooks.filter(
      (b) =>
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        (b.genre && b.genre.toLowerCase().includes(q)) ||
        (b.synopsis && b.synopsis.toLowerCase().includes(q))
    );
  }, [allPublishedBooks, searchQuery]);

  // CATEGORY 1: HIGHEST RATED
  const highestRatedBooks = useMemo(() => {
    return [...filteredAll].sort((a, b) => {
      const ratingA = a.rating ?? 5.0;
      const ratingB = b.rating ?? 5.0;
      if (ratingB !== ratingA) return ratingB - ratingA;
      return (b.ratingCount || 0) - (a.ratingCount || 0);
    });
  }, [filteredAll]);

  // CATEGORY 2: HIGHEST VIEWS
  const highestViewsBooks = useMemo(() => {
    return [...filteredAll].sort((a, b) => (b.views || 0) - (a.views || 0));
  }, [filteredAll]);

  // CATEGORY 3: NEW (chronological by publishedAt / createdAt)
  const newBooks = useMemo(() => {
    return [...filteredAll].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [filteredAll]);

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-12">
      <div className="w-full px-4 sm:px-8 md:px-12 py-5 sm:py-8 space-y-8">

        {/* Search Input Bar (Matching Library styling) */}
        <div className="relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all published shelves..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-canvas-card border border-canvas-border text-xs font-sans text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand-500 shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Active Search Results Indicator */}
        {searchQuery && (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-canvas-card border border-canvas-border text-xs font-mono text-ink-muted shadow-xs">
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">
                Searching published books for &ldquo;<span className="text-brand-700 font-semibold">{searchQuery}</span>&rdquo;
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-mono text-brand-600 hover:underline cursor-pointer flex-shrink-0"
            >
              Clear
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* CATEGORY 1: HIGHEST RATED                                           */}
        {/* =================================================================== */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-stone-300/80 dark:border-white/15 rounded-none shadow-sm">
                <div className="w-0.5 h-3 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Highest Rated ({highestRatedBooks.length})
                </h2>
              </div>
              <span className="text-xs font-mono text-ink-muted hidden sm:inline">
                Top rated stories penned by community authors
              </span>
            </div>
          </div>

          {highestRatedBooks.length === 0 ? (
            <div className="py-12 px-4 rounded-xl bg-canvas-card border border-canvas-border text-center">
              <p className="text-xs text-ink-muted font-sans">
                {searchQuery
                  ? `No highest rated books matching "${searchQuery}".`
                  : 'No published books rated yet.'}
              </p>
            </div>
          ) : (
            <div className="relative group/shelf w-full">
              {/* Left Chevron Button */}
              <button
                type="button"
                onClick={() => scrollShelf(highestRatedShelfRef.current, 'left')}
                className="absolute -left-3 sm:-left-5 top-[40%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
                title="Scroll shelf left"
                aria-label="Scroll shelf left"
              >
                <ChevronLeft className="w-5 h-5 text-ink" />
              </button>

              {/* Shelf Slider Track */}
              <div
                ref={highestRatedShelfRef}
                onMouseDown={(e) => handleShelfMouseDown(highestRatedShelfRef.current, e)}
                className={`flex gap-3 sm:gap-3.5 md:gap-4 overflow-x-auto scrollbar-none pb-3 pt-1 px-1 select-none transition-all ${
                  isMouseDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  scrollBehavior: isMouseDragging ? 'auto' : 'smooth',
                  userSelect: 'none',
                }}
              >
                {highestRatedBooks.map((novel) => (
                  <div
                    key={`highest-rated-${novel._id}`}
                    onClick={() => handleOpenBook(novel._id)}
                    style={{ userSelect: 'none' }}
                    className={`w-[110px] xs:w-[125px] sm:w-[140px] md:w-[155px] flex-shrink-0 flex flex-col select-none group ${
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
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-amber-500/90 text-white font-mono text-[8px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>{(novel.rating ?? 5.0).toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="mt-1.5 px-0.5">
                      <h4 className="font-serif font-bold text-xs text-ink truncate group-hover:text-brand-600 transition-colors">
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
                ))}
              </div>

              {/* Right Chevron Button */}
              <button
                type="button"
                onClick={() => scrollShelf(highestRatedShelfRef.current, 'right')}
                className="absolute -right-3 sm:-right-5 top-[40%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
                title="Scroll shelf right"
                aria-label="Scroll shelf right"
              >
                <ChevronRight className="w-5 h-5 text-ink" />
              </button>
            </div>
          )}
        </section>

        {/* =================================================================== */}
        {/* CATEGORY 2: HIGHEST VIEWS                                           */}
        {/* =================================================================== */}
        <section className="space-y-3.5 pt-4 border-t border-canvas-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-stone-300/80 dark:border-white/15 rounded-none shadow-sm">
                <div className="w-0.5 h-3 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />
                  Highest Views ({highestViewsBooks.length})
                </h2>
              </div>
              <span className="text-xs font-mono text-ink-muted hidden sm:inline">
                Most read and discovered volumes across the community
              </span>
            </div>
          </div>

          {highestViewsBooks.length === 0 ? (
            <div className="py-12 px-4 rounded-xl bg-canvas-card border border-canvas-border text-center">
              <p className="text-xs text-ink-muted font-sans">
                {searchQuery
                  ? `No highest view books matching "${searchQuery}".`
                  : 'No published books with views recorded yet.'}
              </p>
            </div>
          ) : (
            <div className="relative group/shelf w-full">
              {/* Left Chevron Button */}
              <button
                type="button"
                onClick={() => scrollShelf(highestViewsShelfRef.current, 'left')}
                className="absolute -left-3 sm:-left-5 top-[40%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
                title="Scroll shelf left"
                aria-label="Scroll shelf left"
              >
                <ChevronLeft className="w-5 h-5 text-ink" />
              </button>

              {/* Shelf Slider Track */}
              <div
                ref={highestViewsShelfRef}
                onMouseDown={(e) => handleShelfMouseDown(highestViewsShelfRef.current, e)}
                className={`flex gap-3 sm:gap-3.5 md:gap-4 overflow-x-auto scrollbar-none pb-3 pt-1 px-1 select-none transition-all ${
                  isMouseDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  scrollBehavior: isMouseDragging ? 'auto' : 'smooth',
                  userSelect: 'none',
                }}
              >
                {highestViewsBooks.map((novel) => (
                  <div
                    key={`highest-views-${novel._id}`}
                    onClick={() => handleOpenBook(novel._id)}
                    style={{ userSelect: 'none' }}
                    className={`w-[110px] xs:w-[125px] sm:w-[140px] md:w-[155px] flex-shrink-0 flex flex-col select-none group ${
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
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-brand-600/90 text-white font-mono text-[8px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" />
                        <span>{novel.views || 0}</span>
                      </div>
                    </div>
                    <div className="mt-1.5 px-0.5">
                      <h4 className="font-serif font-bold text-xs text-ink truncate group-hover:text-brand-600 transition-colors">
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
                ))}
              </div>

              {/* Right Chevron Button */}
              <button
                type="button"
                onClick={() => scrollShelf(highestViewsShelfRef.current, 'right')}
                className="absolute -right-3 sm:-right-5 top-[40%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
                title="Scroll shelf right"
                aria-label="Scroll shelf right"
              >
                <ChevronRight className="w-5 h-5 text-ink" />
              </button>
            </div>
          )}
        </section>

        {/* =================================================================== */}
        {/* CATEGORY 3: NEW RELEASES                                            */}
        {/* =================================================================== */}
        <section className="space-y-3.5 pt-4 border-t border-canvas-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-stone-300/80 dark:border-white/15 rounded-none shadow-sm">
                <div className="w-0.5 h-3 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  New ({newBooks.length})
                </h2>
              </div>
              <span className="text-xs font-mono text-ink-muted hidden sm:inline">
                Recently published releases fresh from the quill
              </span>
            </div>
          </div>

          {newBooks.length === 0 ? (
            <div className="py-12 px-4 rounded-xl bg-canvas-card border border-canvas-border text-center">
              <p className="text-xs text-ink-muted font-sans">
                {searchQuery
                  ? `No new releases matching "${searchQuery}".`
                  : 'No new releases published yet.'}
              </p>
            </div>
          ) : (
            <div className="relative group/shelf w-full">
              {/* Left Chevron Button */}
              <button
                type="button"
                onClick={() => scrollShelf(newShelfRef.current, 'left')}
                className="absolute -left-3 sm:-left-5 top-[40%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
                title="Scroll shelf left"
                aria-label="Scroll shelf left"
              >
                <ChevronLeft className="w-5 h-5 text-ink" />
              </button>

              {/* Shelf Slider Track */}
              <div
                ref={newShelfRef}
                onMouseDown={(e) => handleShelfMouseDown(newShelfRef.current, e)}
                className={`flex gap-3 sm:gap-3.5 md:gap-4 overflow-x-auto scrollbar-none pb-3 pt-1 px-1 select-none transition-all ${
                  isMouseDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  scrollBehavior: isMouseDragging ? 'auto' : 'smooth',
                  userSelect: 'none',
                }}
              >
                {newBooks.map((novel) => (
                  <div
                    key={`new-${novel._id}`}
                    onClick={() => handleOpenBook(novel._id)}
                    style={{ userSelect: 'none' }}
                    className={`w-[110px] xs:w-[125px] sm:w-[140px] md:w-[155px] flex-shrink-0 flex flex-col select-none group ${
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
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-brand-600/95 text-white font-mono text-[8px] font-bold uppercase tracking-wider shadow-sm">
                        New
                      </div>
                    </div>
                    <div className="mt-1.5 px-0.5">
                      <h4 className="font-serif font-bold text-xs text-ink truncate group-hover:text-brand-600 transition-colors">
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
                ))}
              </div>

              {/* Right Chevron Button */}
              <button
                type="button"
                onClick={() => scrollShelf(newShelfRef.current, 'right')}
                className="absolute -right-3 sm:-right-5 top-[40%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
                title="Scroll shelf right"
                aria-label="Scroll shelf right"
              >
                <ChevronRight className="w-5 h-5 text-ink" />
              </button>
            </div>
          )}
        </section>

        {/* =================================================================== */}
        {/* CATEGORY 4: ALL PUBLISHED                                           */}
        {/* =================================================================== */}
        <section className="space-y-3.5 pt-4 border-t border-canvas-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-stone-300/80 dark:border-white/15 rounded-none shadow-sm">
                <div className="w-0.5 h-3 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />
                  All Published Books ({filteredAll.length})
                </h2>
              </div>
              <span className="text-xs font-mono text-ink-muted hidden sm:inline">
                Complete catalog of published Atelier manuscripts
              </span>
            </div>
          </div>

          {filteredAll.length === 0 ? (
            <div className="py-12 px-4 rounded-xl bg-canvas-card border border-canvas-border text-center">
              <p className="text-xs text-ink-muted font-sans">
                {searchQuery
                  ? `No published books matching "${searchQuery}".`
                  : 'No published books in the library catalog yet.'}
              </p>
            </div>
          ) : (
            <div className="relative group/shelf w-full">
              {/* Left Chevron Button */}
              <button
                type="button"
                onClick={() => scrollShelf(allPublishedShelfRef.current, 'left')}
                className="absolute -left-3 sm:-left-5 top-[40%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
                title="Scroll shelf left"
                aria-label="Scroll shelf left"
              >
                <ChevronLeft className="w-5 h-5 text-ink" />
              </button>

              {/* Shelf Slider Track */}
              <div
                ref={allPublishedShelfRef}
                onMouseDown={(e) => handleShelfMouseDown(allPublishedShelfRef.current, e)}
                className={`flex gap-3 sm:gap-3.5 md:gap-4 overflow-x-auto scrollbar-none pb-3 pt-1 px-1 select-none transition-all ${
                  isMouseDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  scrollBehavior: isMouseDragging ? 'auto' : 'smooth',
                  userSelect: 'none',
                }}
              >
                {filteredAll.map((novel) => (
                  <div
                    key={`all-published-${novel._id}`}
                    onClick={() => handleOpenBook(novel._id)}
                    style={{ userSelect: 'none' }}
                    className={`w-[110px] xs:w-[125px] sm:w-[140px] md:w-[155px] flex-shrink-0 flex flex-col select-none group ${
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
                    </div>
                    <div className="mt-1.5 px-0.5">
                      <h4 className="font-serif font-bold text-xs text-ink truncate group-hover:text-brand-600 transition-colors">
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
                ))}
              </div>

              {/* Right Chevron Button */}
              <button
                type="button"
                onClick={() => scrollShelf(allPublishedShelfRef.current, 'right')}
                className="absolute -right-3 sm:-right-5 top-[40%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
                title="Scroll shelf right"
                aria-label="Scroll shelf right"
              >
                <ChevronRight className="w-5 h-5 text-ink" />
              </button>
            </div>
          )}
        </section>

      </div>

      {/* Website Footer */}
      <Footer />
    </div>
  );
};
