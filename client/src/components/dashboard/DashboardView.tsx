import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  ArrowRight,
  BookOpen,
  Book,
  Plus,
  Feather,
  Globe,
} from 'lucide-react';
import { SHARED_MANUSCRIPTS, type SharedManuscript } from '../../data/communityData';
import { Top10Leaderboard } from '../ranking/Top10Leaderboard';
import { SharedManuscriptModal } from '../library/SharedManuscriptModal';
import { BookCover } from '../common/BookCover';
import { ChallengesSection } from './ChallengesSection';
import { Footer } from '../layout/Footer';

export const DashboardView: React.FC = () => {
  const novels = useWorkspaceStore((s) => s.novels);
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const openStudio = useWorkspaceStore((s) => s.openStudio);
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);
  const openRanking = useWorkspaceStore((s) => s.openRanking);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);
  const openWriteForProjectModal = useWorkspaceStore((s) => s.openWriteForProjectModal);

  const [selectedSharedManuscript, setSelectedSharedManuscript] = useState<SharedManuscript | null>(null);
  const [isSharedModalOpen, setIsSharedModalOpen] = useState(false);
  const [shelfTab, setShelfTab] = useState<'my-shelf' | 'shared'>('my-shelf');


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

            <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
              {isAuthenticated && (
                <div className="inline-flex p-1 rounded-none bg-canvas-surface border border-canvas-border text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setShelfTab('shared')}
                    className={`px-3 py-1 rounded-none transition-colors cursor-pointer ${
                      shelfTab === 'shared'
                        ? 'bg-canvas-card text-ink font-bold shadow-xs'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Explore ({SHARED_MANUSCRIPTS.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setShelfTab('my-shelf')}
                    className={`px-3 py-1 rounded-none transition-colors cursor-pointer ${
                      shelfTab === 'my-shelf'
                        ? 'bg-canvas-card text-ink font-bold shadow-xs'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    My Shelf ({novels.length})
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={openLibrary}
                className="text-xs font-mono text-brand-700 hover:text-brand-800 dark:text-brand-400 font-semibold flex items-center gap-1 group cursor-pointer"
                title="Open full library shelf"
              >
                <span>View All Shelf</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Constant Size Manuscripts Panel Container */}
          <div className="min-h-0 sm:min-h-[440px] md:min-h-[460px] flex flex-col justify-start px-3 sm:px-8 md:px-12">
            {/* Wattpad Style "Top picks for you" Book Covers Showcase */}
            {!isAuthenticated || shelfTab === 'shared' ? (
              <div className="w-full max-w-none sm:max-w-[640px] md:max-w-[700px] lg:max-w-[740px]">
                <div className="flex gap-2 sm:gap-3 md:gap-3.5 items-stretch overflow-x-auto sm:overflow-hidden scrollbar-none pb-1">
                  {/* 1. Large Featured Book Cover (Left) */}
                  {SHARED_MANUSCRIPTS[0] && (
                    <div
                      onClick={() => {
                        setSelectedSharedManuscript(SHARED_MANUSCRIPTS[0]);
                        setIsSharedModalOpen(true);
                      }}
                      className="w-[48vw] xs:w-[47vw] sm:w-[45%] max-w-[320px] min-w-[165px] flex-shrink-0 cursor-pointer group"
                      title={`${SHARED_MANUSCRIPTS[0].title} by ${SHARED_MANUSCRIPTS[0].author}`}
                    >
                      <div className="relative w-full h-full rounded-none overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.015] border border-black/15 dark:border-white/10 bg-neutral-900">
                        <img
                          src={SHARED_MANUSCRIPTS[0].coverImage}
                          alt={SHARED_MANUSCRIPTS[0].title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}

                  {/* 2. 2x2 Grid of Book Covers (Middle) */}
                  <div className="w-[48vw] xs:w-[47vw] sm:w-[45%] sm:flex-1 max-w-[320px] min-w-[165px] flex-shrink-0 grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3">
                    {SHARED_MANUSCRIPTS.slice(1, 5).map((novel, idx) => {
                      const isBadgeItem = idx === 3;
                      return (
                        <div
                          key={novel.id}
                          onClick={() => {
                            setSelectedSharedManuscript(novel);
                            setIsSharedModalOpen(true);
                          }}
                          className="cursor-pointer group relative"
                          title={`${novel.title} by ${novel.author}`}
                        >
                          <div className="relative aspect-[2/3] w-full rounded-none overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border border-black/15 dark:border-white/10 bg-neutral-900">
                            <img
                              src={novel.coverImage}
                              alt={novel.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {isBadgeItem && (
                              <div className="absolute top-0 left-0 z-20 bg-gradient-to-br from-[#ff6100] to-[#e64a00] text-white font-extrabold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-none shadow-md flex items-center justify-center tracking-tight leading-none pointer-events-none select-none">
                                <span className="font-serif italic font-black">A</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 3. Peek of 6th Book Cover (Far Right) */}
                  {SHARED_MANUSCRIPTS[5] && (
                    <div
                      onClick={() => {
                        setSelectedSharedManuscript(SHARED_MANUSCRIPTS[5]);
                        setIsSharedModalOpen(true);
                      }}
                      className="w-[18vw] xs:w-[16vw] sm:w-12 md:w-16 flex-shrink-0 cursor-pointer group overflow-hidden"
                      title={`${SHARED_MANUSCRIPTS[5].title} by ${SHARED_MANUSCRIPTS[5].author}`}
                    >
                      <div className="relative aspect-[2/3] w-28 sm:w-36 md:w-44 h-full rounded-none overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border border-black/15 dark:border-white/10 bg-neutral-900">
                        <img
                          src={SHARED_MANUSCRIPTS[5].coverImage}
                          alt={SHARED_MANUSCRIPTS[5].title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : novels.length === 0 ? (
              /* Constant Panel Size When Empty */
              <div className="w-full min-h-[430px] sm:min-h-[460px] rounded-none bg-canvas-card border border-canvas-border shadow-sm flex flex-col items-center justify-center p-8 sm:p-12 text-center relative overflow-hidden group">
                <div className="w-16 h-16 rounded-none bg-canvas-surface border border-canvas-border flex items-center justify-center text-brand-700 mx-auto mb-4 shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-brand-600" />
                </div>
                <h4 className="font-serif font-bold text-lg sm:text-xl text-ink mb-1.5">
                  Your Shelf is Quiet
                </h4>
                <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto mb-6 font-sans leading-relaxed">
                  No manuscripts on your desk yet. Use the World Challenge or Three Elements prompt above to begin drafting, or explore shared works from other authors.
                </p>
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <button
                    type="button"
                    onClick={startWritingImmediately}
                    className="px-5 py-2.5 rounded-none bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Feather className="w-3.5 h-3.5" />
                    <span>Start Writing Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={openWriteForProjectModal}
                    className="px-5 py-2.5 rounded-none bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-serif font-semibold text-xs shadow-xs transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Write for a Shared World</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShelfTab('shared')}
                    className="px-5 py-2.5 rounded-none bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink font-serif font-medium text-xs shadow-xs transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-1.5"
                  >
                    <Book className="w-3.5 h-3.5 text-brand-600" />
                    <span>Browse Shared Works</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4.5">
                {novels.map((novel) => (
                  <div
                    key={novel._id}
                    onClick={() => openStudio(novel._id)}
                    className="cursor-pointer group flex flex-col"
                    title={novel.title}
                  >
                    <div className="relative aspect-[2/3] w-full rounded-none overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border border-black/15 dark:border-white/10 bg-neutral-900">
                      <BookCover
                        title={novel.title}
                        author="You"
                        genre={novel.genre}
                        coverImage={novel.coverImage}
                        size="full"
                      />
                    </div>
                    <div className="mt-2 px-0.5">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-ink truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {novel.title}
                      </h4>
                      <p className="text-[11px] text-ink-muted truncate font-sans mt-0.5">
                        {novel.genre || 'Original Work'} • {(novel.totalWordCount || 0).toLocaleString()} words
                      </p>
                    </div>
                  </div>
                ))}

                {/* Add New Volume Card */}
                <button
                  type="button"
                  onClick={startWritingImmediately}
                  className="aspect-[2/3] w-full rounded-none border-2 border-dashed border-canvas-border hover:border-brand-500/60 bg-canvas-card/40 hover:bg-canvas-card flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300 group hover:scale-[1.02] shadow-xs"
                >
                  <div className="w-10 h-10 rounded-none bg-canvas-surface border border-canvas-border group-hover:border-brand-500/40 text-brand-600 flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-serif font-bold text-xs sm:text-sm text-ink group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    New Volume
                  </span>
                  <span className="text-[10px] text-ink-muted font-sans mt-0.5">
                    Draft new story
                  </span>
                </button>
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
