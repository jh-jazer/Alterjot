import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { Novel } from '../../types';
import type { CollaborativeProject } from '../../data/collaborativeProjectsData';
import { BookShelf } from '../common/BookShelf';
import {
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { BookCover } from '../common/BookCover';

export const LibraryView: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);
  const novels = useWorkspaceStore((s) => s.novels);
  const selectNovel = useWorkspaceStore((s) => s.selectNovel);
  const isNewNovelModalOpen = useWorkspaceStore((s) => s.isNewNovelModalOpen);
  const setIsNewNovelModalOpen = useWorkspaceStore((s) => s.setIsNewNovelModalOpen);

  // Automatically redirect modal triggers to the full-page creation route
  useEffect(() => {
    if (isNewNovelModalOpen) {
      setIsNewNovelModalOpen(false);
      navigate('/stories/new');
    }
  }, [isNewNovelModalOpen, navigate, setIsNewNovelModalOpen]);
  const collaborativeProjects = useWorkspaceStore((s) => s.collaborativeProjects);
  const openWriteForProjectModal = useWorkspaceStore((s) => s.openWriteForProjectModal);

  const librarySearchQuery = useWorkspaceStore((s) => s.librarySearchQuery);
  const setLibrarySearchQuery = useWorkspaceStore((s) => s.setLibrarySearchQuery);
  const invitedReadersByNovel = useWorkspaceStore((s) => s.invitedReadersByNovel);
  const setIsReaderMode = useWorkspaceStore((s) => s.setIsReaderMode);

  // Shelf track ref for projects
  const projectsShelfRef = useRef<HTMLDivElement>(null);

  // Mouse drag state
  const isMouseDownRef = useRef(false);
  const activeShelfRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [isMouseDragging, setIsMouseDragging] = useState(false);

  // Global mousemove and mouseup listeners for butter-smooth shelf swipe
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

  const handleOpenMyWork = async (novelId: string) => {
    if (hasMovedRef.current || isMouseDragging) return;
    setIsReaderMode(false);
    await selectNovel(novelId);
    navigate(`/book/${novelId}`);
  };

  const handleOpenInvitedAuthorNovel = async (novel: Novel) => {
    if (hasMovedRef.current || isMouseDragging) return;
    const readers = invitedReadersByNovel[novel._id] || novel.invitedReaders || [];
    const readerName = readers[0]?.username || 'Invited Reader';
    setIsReaderMode(true, readerName);
    await selectNovel(novel._id);
    navigate(`/book/${novel._id}?role=reader`);
  };

  const handleOpenProject = (_project: CollaborativeProject) => {
    if (hasMovedRef.current || isMouseDragging) return;
    openWriteForProjectModal();
  };

  // Filter My Works
  const filteredMyWorks = novels.filter((novel) => {
    if (!librarySearchQuery) return true;
    const q = librarySearchQuery.toLowerCase();
    return (
      (novel.title && novel.title.toLowerCase().includes(q)) ||
      (novel.genre && novel.genre.toLowerCase().includes(q)) ||
      (novel.author && novel.author.toLowerCase().includes(q)) ||
      (novel.synopsis && novel.synopsis.toLowerCase().includes(q))
    );
  });

  // Filter Invited Author Novels (books where the user or someone was invited to read)
  const invitedAuthorNovels = novels.filter((novel) => {
    const list = invitedReadersByNovel[novel._id] || novel.invitedReaders || [];
    if (list.length === 0) return false;
    if (!librarySearchQuery) return true;
    const q = librarySearchQuery.toLowerCase();
    return (
      (novel.title && novel.title.toLowerCase().includes(q)) ||
      (novel.genre && novel.genre.toLowerCase().includes(q)) ||
      (novel.author && novel.author.toLowerCase().includes(q)) ||
      (novel.synopsis && novel.synopsis.toLowerCase().includes(q)) ||
      list.some((r) => r.username.toLowerCase().includes(q))
    );
  });

  const totalInvitedCount = invitedAuthorNovels.length;

  // Filter Projects
  const filteredProjects = collaborativeProjects.filter((p) => {
    if (!librarySearchQuery) return true;
    const q = librarySearchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.genre && p.genre.toLowerCase().includes(q)) ||
      (p.creatorPenName && p.creatorPenName.toLowerCase().includes(q)) ||
      (p.tagline && p.tagline.toLowerCase().includes(q))
    );
  });

  if (!isAuthenticated) {
    return (
      <div className="flex-1 overflow-y-auto bg-canvas text-ink p-4 sm:p-8 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full text-center p-6 sm:p-8 rounded-xl bg-canvas-card border border-canvas-border shadow-parchment-lg space-y-4">
          <div className="w-14 h-14 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center mx-auto shadow-sm">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
            Author Authentication Required
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
            Sign in to access your book repository, invited reading copies, and collaborative story projects.
          </p>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            Sign In / Register Pen Name
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-12">
      <div className="w-full px-4 sm:px-8 md:px-12 py-5 sm:py-8 space-y-8">

        {/* Mobile Search Input */}
        <div className="sm:hidden relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={librarySearchQuery}
            onChange={(e) => setLibrarySearchQuery(e.target.value)}
            placeholder="Search across all library shelves..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-canvas-card border border-canvas-border text-xs font-sans text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand-500 shadow-xs"
          />
          {librarySearchQuery && (
            <button
              type="button"
              onClick={() => setLibrarySearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink"
            >
              ✕
            </button>
          )}
        </div>

        {/* Active Search Results Indicator */}
        {librarySearchQuery && (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-canvas-card border border-canvas-border text-xs font-mono text-ink-muted shadow-xs">
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">
                Searching for &ldquo;<span className="text-brand-700 font-semibold">{librarySearchQuery}</span>&rdquo;
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLibrarySearchQuery('')}
              className="text-xs font-mono text-brand-600 hover:underline cursor-pointer flex-shrink-0"
            >
              Clear
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* CATEGORY 1: MY WORKS                                                */}
        {/* =================================================================== */}
        <BookShelf
          title="My Works"
          count={filteredMyWorks.length}
          subtitle="Your private books"
          books={filteredMyWorks}
          headerAction={{
            label: 'New Story',
            icon: Plus,
            onClick: () => navigate('/stories/new'),
          }}
          emptyMessage={
            librarySearchQuery
              ? `No books found matching "${librarySearchQuery}".`
              : 'Create your first volume to begin drafting in Alterjot.'
          }
          emptyAction={{
            label: 'Create First Book',
            onClick: () => navigate('/stories/new'),
          }}
          onOpenBook={handleOpenMyWork}
        />

        {/* =================================================================== */}
        {/* CATEGORY 2: BOOKS I AM INVITED TO READ                              */}
        {/* =================================================================== */}
        <BookShelf
          title="Books I Am Invited to Read"
          count={totalInvitedCount}
          subtitle="Shared with you for reading, beta-feedback, and line commenting"
          books={invitedAuthorNovels}
          badgeType="invited"
          emptyMessage={
            librarySearchQuery
              ? `No invited books found matching "${librarySearchQuery}".`
              : 'No books found in your invited reading list.'
          }
          onOpenBook={(novelId) => {
            const target = invitedAuthorNovels.find((n) => n._id === novelId);
            if (target) handleOpenInvitedAuthorNovel(target);
          }}
          className="pt-4 border-t border-canvas-border"
        />

        {/* =================================================================== */}
        {/* CATEGORY 3: PROJECTS                                                */}
        {/* =================================================================== */}
        <section className="space-y-3.5 pt-4 border-t border-canvas-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-stone-300/80 dark:border-white/15 rounded-none shadow-sm">
                  <div className="w-0.5 h-3 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                  <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-900 dark:text-stone-100">
                    Projects ({filteredProjects.length})
                  </h2>
                </div>
                <span className="text-xs font-mono text-ink-muted hidden sm:inline">
                  Collaborative multi-author story universes and anthologies
                </span>
              </div>

              <button
                type="button"
                onClick={() => openWriteForProjectModal()}
                className="text-xs font-mono text-brand-600 hover:text-brand-700 underline cursor-pointer"
              >
                Explore All Projects
              </button>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="py-12 px-4 rounded-xl bg-canvas-card border border-canvas-border text-center">
                <p className="text-xs text-ink-muted font-sans">
                  {librarySearchQuery
                    ? 'No collaborative projects found matching your query.'
                    : 'No collaborative projects yet. Community story universes will appear here once created.'}
                </p>
              </div>
            ) : (
              <div className="relative group/shelf w-full">
                {/* Left Chevron Button */}
                <button
                  type="button"
                  onClick={() => scrollShelf(projectsShelfRef.current, 'left')}
                  className="absolute -left-3 sm:-left-5 top-[40%] -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-300 dark:border-white/20 text-ink shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/shelf:opacity-100"
                  title="Scroll shelf left"
                  aria-label="Scroll shelf left"
                >
                  <ChevronLeft className="w-5 h-5 text-ink" />
                </button>

                {/* Shelf Slider Track */}
                <div
                  ref={projectsShelfRef}
                  onMouseDown={(e) => handleShelfMouseDown(projectsShelfRef.current, e)}
                  className={`flex gap-3 sm:gap-3.5 md:gap-4 overflow-x-auto scrollbar-none pb-3 pt-1 px-1 select-none transition-all ${
                    isMouseDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  style={{
                    scrollBehavior: isMouseDragging ? 'auto' : 'smooth',
                    userSelect: 'none',
                  }}
                >
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => handleOpenProject(project)}
                      style={{ userSelect: 'none' }}
                      className={`w-[110px] xs:w-[125px] sm:w-[140px] md:w-[155px] flex-shrink-0 flex flex-col select-none ${
                        isMouseDragging ? 'cursor-grabbing' : 'cursor-pointer'
                      }`}
                      title={`${project.name} (Created by ${project.creatorPenName})`}
                    >
                      <div className="relative aspect-[2/3] w-full rounded-none overflow-hidden shadow-sm border border-black/15 dark:border-white/10 bg-neutral-900">
                        <BookCover
                          title={project.name}
                          author={project.creatorPenName}
                          genre={project.genre}
                          coverImage={project.bannerImage}
                          size="full"
                        />
                      </div>
                      <div className="mt-1.5 px-0.5">
                        <h4 className="font-serif font-bold text-xs text-ink truncate">
                          {project.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-ink-muted truncate font-sans mt-0.5">
                          By {project.creatorPenName}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-ink-faint font-mono mt-0.5 truncate">
                          {project.metrics.booksCount} books • {project.approvedCollaborators.length} collaborators
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Chevron Button */}
                <button
                  type="button"
                  onClick={() => scrollShelf(projectsShelfRef.current, 'right')}
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
    </div>
  );
};
