import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { NovelStatus } from '../../types';
import {
  ArrowRight,
  BookOpen,
  Trophy,
  User,
  Star,
  Book,
  Plus,
  Feather,
} from 'lucide-react';
import { SHARED_MANUSCRIPTS, type SharedManuscript } from '../../data/communityData';
import { Top10Leaderboard } from '../ranking/Top10Leaderboard';
import { SharedManuscriptModal } from '../library/SharedManuscriptModal';
import { BookCover } from '../common/BookCover';
import { ChallengesSection } from './ChallengesSection';

export const DashboardView: React.FC = () => {
  const novels = useWorkspaceStore((s) => s.novels);
  const penName = useWorkspaceStore((s) => s.penName);
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const openStudio = useWorkspaceStore((s) => s.openStudio);
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);
  const openRanking = useWorkspaceStore((s) => s.openRanking);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);

  const [selectedSharedManuscript, setSelectedSharedManuscript] = useState<SharedManuscript | null>(null);
  const [isSharedModalOpen, setIsSharedModalOpen] = useState(false);
  const [shelfTab, setShelfTab] = useState<'my-shelf' | 'shared'>('my-shelf');

  const totalWords = novels.reduce((acc, n) => acc + (n.totalWordCount || 0), 0);

  // Author rank tiers calculation
  const getAuthorRank = (words: number) => {
    if (words >= 60000) {
      return {
        title: 'Master Lorekeeper',
        badge: 'Grand Atelier',
        nextThreshold: 100000,
        nextTitle: 'Mythic Scribe',
        color: 'text-amber-700 bg-amber-50 border-amber-300 dark:bg-amber-600/20 dark:text-amber-300',
      };
    }
    if (words >= 25000) {
      return {
        title: 'Seasoned Novelist',
        badge: 'Senior Scribe',
        nextThreshold: 60000,
        nextTitle: 'Master Lorekeeper',
        color: 'text-[#2e4785] bg-[#e1e9f8] border-[#a8bee7] dark:bg-indigo-600/20 dark:text-indigo-300',
      };
    }
    if (words >= 5000) {
      return {
        title: 'Journeyman Author',
        badge: 'Atelier Artisan',
        nextThreshold: 25000,
        nextTitle: 'Seasoned Novelist',
        color: 'text-[#245b32] bg-[#dff0e4] border-[#a0cea9] dark:bg-emerald-600/20 dark:text-emerald-300',
      };
    }
    return {
      title: 'Apprentice Scribe',
      badge: 'Novice Quill',
      nextThreshold: 5000,
      nextTitle: 'Journeyman Author',
      color: 'text-brand-800 bg-brand-50 border-brand-200 dark:bg-brand-600/20 dark:text-brand-300',
    };
  };

  const rankInfo = getAuthorRank(totalWords);
  const rankProgress = Math.min(100, Math.round((totalWords / rankInfo.nextThreshold) * 100));

  const getStatusBadge = (status: NovelStatus) => {
    switch (status) {
      case 'Planning':
        return 'bg-[#faeed1] text-[#7c4a03] border-[#e3c788]';
      case 'In Progress':
        return 'bg-[#dcf0f2] text-[#1b5966] border-[#9ec8ce]';
      case 'First Draft':
        return 'bg-[#e1e9f8] text-[#2e4785] border-[#a8bee7]';
      case 'Revision':
        return 'bg-[#fae6de] text-[#913d1e] border-[#e7b6a4]';
      case 'Completed':
        return 'bg-[#dff0e4] text-[#245b32] border-[#a0cea9]';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-10">
      {/* Clean centered container with responsive padding on left and right */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* FIRST PART OF DASHBOARD: TWO COLUMNS (World Challenge & Three Elements Challenge) */}
        <ChallengesSection showPlaygroundLink={true} className="pt-6 sm:pt-12 pb-6 sm:pb-10" />

        {/* SECOND PART OF DASHBOARD: AUTHOR RANKING / LEADERBOARD & RECENT SHELF MANUSCRIPTS */}
        <section className="space-y-6 pt-2">
          
          {/* Leaderboard: Top 10 when not signed in; Personal Standing Banner when signed in */}
          {isAuthenticated ? (
            <div className="p-4 sm:p-6 rounded-2xl bg-[#1e1c19] text-white border border-black/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 relative z-10">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <Trophy className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                      Author Atelier Standing
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      • {penName}
                    </span>
                  </div>

                  {/* Author Ranking Place and Title */}
                  <div className="flex items-baseline gap-2.5 sm:gap-6 flex-wrap">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 uppercase font-bold">
                        Place
                      </span>
                      <span className="text-xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
                        #4
                      </span>
                    </div>

                    <div className="h-4 sm:h-5 w-px bg-white/20 self-center" />

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 uppercase font-bold">
                        Title
                      </span>
                      <span className="text-lg sm:text-2xl font-serif font-bold text-amber-300">
                        {rankInfo.title}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-medium">
                      {rankInfo.badge}
                    </span>
                  </div>

                  {/* Velocity to next title */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-xs font-mono text-neutral-400">
                    <span>{totalWords.toLocaleString()} words written</span>
                    <span>•</span>
                    <span>{rankProgress}% to {rankInfo.nextTitle}</span>
                    <div className="w-20 sm:w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(4, rankProgress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Button: View Full Leaderboard */}
              <div className="flex items-center gap-3 flex-shrink-0 relative z-10 w-full md:w-auto">
                <button
                  type="button"
                  onClick={openRanking}
                  className="w-full md:w-auto px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-mono font-semibold uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-center"
                  title="View atelier leaderboard rankings"
                >
                  Leaderboard
                </button>
              </div>
            </div>
          ) : (
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
          )}

          {/* Recent Shelf Manuscripts */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-serif font-bold text-ink flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-600" />
                    Recent Shelf Manuscripts
                  </h3>
                  {!isAuthenticated ? (
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 font-bold">
                      Shared Works
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-ink-muted font-mono mt-0.5">
                  {!isAuthenticated
                    ? 'Shared manuscripts from fellow authors across the atelier'
                    : 'Volumes resting in your personal atelier'}
                </p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
                {isAuthenticated && (
                  <div className="inline-flex p-1 rounded-xl bg-canvas-surface border border-canvas-border text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setShelfTab('my-shelf')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        shelfTab === 'my-shelf'
                          ? 'bg-canvas-card text-ink font-bold shadow-2xs'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      My Shelf ({novels.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setShelfTab('shared')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        shelfTab === 'shared'
                          ? 'bg-canvas-card text-ink font-bold shadow-2xs'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      Shared Works ({SHARED_MANUSCRIPTS.length})
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={openLibrary}
                  className="text-xs font-mono text-brand-700 hover:text-brand-800 dark:text-brand-400 font-semibold flex items-center gap-1 group cursor-pointer"
                  title="Open full library shelf"
                >
                  <span>View All Library Shelf</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Constant Size Manuscripts Panel Container */}
            <div className="min-h-[430px] sm:min-h-[460px] flex flex-col justify-start">
              {/* Manuscripts Grid: Shared Works when not authenticated (or if shared tab is selected) */}
              {!isAuthenticated || shelfTab === 'shared' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 min-h-[430px] sm:min-h-[460px]">
                  {SHARED_MANUSCRIPTS.map((sharedNovel) => {
                    const totalWords = sharedNovel.totalWordCount || 0;
                    const targetGoal = sharedNovel.targetWordCount || 80000;
                    const progressPct = Math.min(100, Math.round((totalWords / targetGoal) * 100));

                    return (
                      <div
                        key={sharedNovel.id}
                        onClick={() => {
                          setSelectedSharedManuscript(sharedNovel);
                          setIsSharedModalOpen(true);
                        }}
                        className="min-h-[195px] h-full rounded-2xl border border-canvas-border bg-canvas-card hover:border-brand-500/60 transition-all duration-300 shadow-parchment hover:shadow-parchment-lg cursor-pointer group flex flex-row overflow-hidden relative p-3 sm:p-4 gap-3 sm:gap-4 items-stretch"
                      >
                        {/* Top ribbon accent */}
                        <div className={`h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r ${sharedNovel.spineGradient}`} />

                        {/* Book Cover Container */}
                        <div className="flex-shrink-0 flex items-center justify-center pt-0.5">
                          <div className="transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1">
                            <BookCover
                              title={sharedNovel.title}
                              author={sharedNovel.author}
                              genre={sharedNovel.genre}
                              coverImage={sharedNovel.coverImage}
                              size="sm"
                            />
                          </div>
                        </div>

                        {/* Content Details Container */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between pt-0.5">
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-700 font-semibold truncate">
                                {sharedNovel.genre}
                              </span>
                              <span
                                className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase font-medium ${getStatusBadge(
                                  sharedNovel.status
                                )}`}
                              >
                                {sharedNovel.status}
                              </span>
                            </div>

                            <h4 className="font-serif font-bold text-sm sm:text-base text-ink group-hover:text-brand-700 transition-colors line-clamp-1">
                              {sharedNovel.title}
                            </h4>

                            {/* Author Attribution */}
                            <div className="flex items-center gap-1.5 mt-0.5 mb-1 text-[11px] font-mono text-ink-muted">
                              <User className="w-3 h-3 text-brand-600 flex-shrink-0" />
                              <span className="font-medium text-ink truncate">by {sharedNovel.author}</span>
                              <span className="text-[10px] text-ink-faint truncate">• {sharedNovel.authorRank}</span>
                            </div>

                            {sharedNovel.synopsis && (
                              <p className="text-xs text-ink-muted font-sans line-clamp-2 mt-1 leading-relaxed">
                                {sharedNovel.synopsis}
                              </p>
                            )}
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-canvas-border">
                            <div className="flex items-baseline justify-between text-xs font-mono mb-1">
                              <span className="font-semibold text-ink text-xs">
                                {totalWords.toLocaleString()} <span className="text-[10px] text-ink-faint font-normal">words</span>
                              </span>
                              <span className="text-[11px] text-ink-muted">
                                {sharedNovel.chapterCount} ch ({progressPct}%)
                              </span>
                            </div>

                            <div className="h-1.5 w-full bg-canvas-surface rounded-full overflow-hidden border border-canvas-border/50">
                              <div
                                className="h-full bg-brand-600 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(2, progressPct)}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-ink-faint">
                              <span className="group-hover:text-brand-700 transition-colors flex items-center gap-1 font-semibold">
                                <span>Read Excerpt</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                {sharedNovel.rating.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : novels.length === 0 ? (
                /* Constant Panel Size When Empty */
                <div className="w-full min-h-[430px] sm:min-h-[460px] rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment flex flex-col items-center justify-center p-8 sm:p-12 text-center relative overflow-hidden group">
                  <div className="w-16 h-16 rounded-2xl bg-canvas-surface border border-canvas-border flex items-center justify-center text-brand-700 mx-auto mb-4 shadow-xs group-hover:scale-105 transition-transform duration-300">
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
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs shadow-sm shadow-brand-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <Feather className="w-3.5 h-3.5" />
                      <span>Start Writing Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShelfTab('shared')}
                      className="px-5 py-2.5 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink font-serif font-medium text-xs shadow-xs transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-1.5"
                    >
                      <Book className="w-3.5 h-3.5 text-brand-600" />
                      <span>Browse Shared Works</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 min-h-[430px] sm:min-h-[460px]">
                  {novels.slice(0, 6).map((novel, idx) => {
                    const totalWords = novel.totalWordCount || 0;
                    const targetGoal = novel.targetWordCount || 80000;
                    const progressPct = Math.min(100, Math.round((totalWords / targetGoal) * 100));

                    const spineColors = [
                      'from-[#c2593f] to-[#a2402a]',
                      'from-[#b45309] to-[#92400e]',
                      'from-[#2e4785] to-[#1e3a8a]',
                      'from-[#225744] to-[#14532d]',
                    ];
                    const spineGradient = spineColors[idx % spineColors.length];

                    return (
                      <div
                        key={novel._id}
                        onClick={() => openStudio(novel._id)}
                        className="min-h-[195px] h-full rounded-2xl border border-canvas-border bg-canvas-card hover:border-brand-500/60 transition-all duration-300 shadow-parchment hover:shadow-parchment-lg cursor-pointer group flex flex-row overflow-hidden relative p-3 sm:p-4 gap-3 sm:gap-4 items-stretch"
                      >
                        {/* Top ribbon accent */}
                        <div className={`h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r ${spineGradient}`} />

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

                        {/* Content Details Container */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between pt-0.5">
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-700 font-semibold truncate">
                                {novel.genre}
                              </span>
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase font-medium ${getStatusBadge(novel.status)}`}>
                                {novel.status}
                              </span>
                            </div>

                            <h4 className="font-serif font-bold text-sm sm:text-base text-ink group-hover:text-brand-700 transition-colors line-clamp-1">
                              {novel.title}
                            </h4>

                            {novel.subtitle && (
                              <p className="text-xs text-ink-muted italic font-serif line-clamp-1 mt-0.5">
                                {novel.subtitle}
                              </p>
                            )}

                            {novel.synopsis && (
                              <p className="text-xs text-ink-muted font-sans line-clamp-2 mt-1 leading-relaxed">
                                {novel.synopsis}
                              </p>
                            )}
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-canvas-border">
                            <div className="flex items-baseline justify-between text-xs font-mono mb-1">
                              <span className="font-semibold text-ink text-xs">
                                {totalWords.toLocaleString()} <span className="text-[10px] text-ink-faint font-normal">words</span>
                              </span>
                              <span className="text-[11px] text-ink-muted">
                                {progressPct}% of goal
                              </span>
                            </div>

                            <div className="h-1.5 w-full bg-canvas-surface rounded-full overflow-hidden border border-canvas-border/50">
                              <div
                                className="h-full bg-brand-600 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(2, progressPct)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add New Volume Card when user has fewer than 6 manuscripts */}
                  {novels.length < 6 && (
                    <button
                      type="button"
                      onClick={startWritingImmediately}
                      className="min-h-[195px] h-full rounded-2xl border-2 border-dashed border-canvas-border hover:border-brand-500/60 bg-canvas-card/40 hover:bg-canvas-card flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 group shadow-xs hover:shadow-parchment"
                    >
                      <div className="w-10 h-10 rounded-xl bg-canvas-surface border border-canvas-border group-hover:border-brand-500/40 group-hover:bg-brand-50 dark:group-hover:bg-brand-600/20 text-brand-600 flex items-center justify-center mb-2.5 transition-all group-hover:scale-110">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="font-serif font-bold text-sm text-ink group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                        Start New Manuscript
                      </span>
                      <span className="text-[11px] text-ink-muted mt-1 font-sans">
                        Draft an original story volume
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Shared Manuscript Reader Modal */}
        <SharedManuscriptModal
          manuscript={selectedSharedManuscript}
          isOpen={isSharedModalOpen}
          onClose={() => setIsSharedModalOpen(false)}
        />

      </div>
    </div>
  );
};
