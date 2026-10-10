import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  Trophy,
  Medal,
  Feather,
  User,
  Crown,
} from 'lucide-react';

export const RankingView: React.FC = () => {
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);
  const novels = useWorkspaceStore((s) => s.novels);
  const penName = useWorkspaceStore((s) => s.penName);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 overflow-y-auto bg-canvas text-ink p-4 sm:p-8 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full text-center p-6 sm:p-8 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment-lg space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-bold">Author Standings</span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink mt-1">Sign In Required</h2>
            <p className="text-xs text-ink-muted font-sans mt-2 leading-relaxed">
              Sign in to view your global ranking tier, track lifetime wordcount milestones, and climb scribe leaderboards.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true, 'signin')}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-sm shadow-md shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Sign In to Access Standings</span>
          </button>
        </div>
      </div>
    );
  }

  const totalWords = novels.reduce((acc, n) => acc + (n.totalWordCount || 0), 0);

  // Author Tier Calculation
  const getAuthorRank = (words: number) => {
    if (words >= 60000) {
      return {
        title: 'Master Lorekeeper',
        badge: 'Grand Atelier',
        color: 'text-amber-700 bg-amber-50 border-amber-300 dark:bg-amber-600/20 dark:text-amber-300',
        nextThreshold: 100000,
      };
    }
    if (words >= 25000) {
      return {
        title: 'Seasoned Novelist',
        badge: 'Senior Scribe',
        color: 'text-[#2e4785] bg-[#e1e9f8] border-[#a8bee7] dark:bg-indigo-600/20 dark:text-indigo-300',
        nextThreshold: 60000,
      };
    }
    if (words >= 5000) {
      return {
        title: 'Journeyman Author',
        badge: 'Atelier Artisan',
        color: 'text-[#245b32] bg-[#dff0e4] border-[#a0cea9] dark:bg-emerald-600/20 dark:text-emerald-300',
        nextThreshold: 25000,
      };
    }
    return {
      title: 'Apprentice Scribe',
      badge: 'Novice Quill',
      color: 'text-brand-800 bg-brand-50 border-brand-200 dark:bg-brand-600/20 dark:text-brand-300',
      nextThreshold: 5000,
    };
  };

  const rankInfo = getAuthorRank(totalWords);
  const progressPercent = Math.min(100, Math.round((totalWords / rankInfo.nextThreshold) * 100));

  // Simulated Atelier Leaderboard with current user highlighted
  const leaderboardEntries = [
    { rank: 1, author: 'Helena Vance', title: 'The Clockwork Citadel', words: 94250, streak: 42, badge: 'Grand Master' },
    { rank: 2, author: 'C. W. Holloway', title: 'Echoes of the Void', words: 71320, streak: 28, badge: 'Master Lorekeeper' },
    { rank: 3, author: 'Anya Sterling', title: 'A Waltz in Charcoal', words: 58900, streak: 19, badge: 'Seasoned Novelist' },
    { rank: 4, author: penName, title: novels[0]?.title || 'Untitled Manuscript', words: totalWords, streak: 7, isCurrentUser: true, badge: rankInfo.title },
    { rank: 5, author: 'Dante Mercer', title: 'The Glass Alchemist', words: 32400, streak: 14, badge: 'Seasoned Novelist' },
    { rank: 6, author: 'S. K. Thorne', title: 'Winter Over Blackwood', words: 18450, streak: 11, badge: 'Journeyman Author' },
    { rank: 7, author: 'Mira Lawson', title: 'Letters from the Lighthouse', words: 12100, streak: 9, badge: 'Journeyman Author' },
  ];

  // Sort leaderboard dynamically so user's real total words positions them correctly
  const sortedLeaderboard = [...leaderboardEntries].sort((a, b) => b.words - a.words);

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-10">
      {/* Clean centered container with responsive padding on left and right */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
        
        {/* Banner Header (matching Dashboard cinematic dark card aesthetic) */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2c221a] via-[#211a14] to-[#16120e] text-white p-5 sm:p-7 shadow-xl border border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          {/* Ambient warm glow */}
          <div className="absolute right-0 top-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                Atelier Word Hall of Fame
              </span>
              <span className="text-xs font-mono text-neutral-400">
                • Global Author Leaderboard
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
              Rankings & Output Velocity
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-serif max-w-xl leading-relaxed">
              Celebrate manuscript milestones, track your writing echelon, and join fellow authors in persistent drafting momentum.
            </p>
          </div>

          <button
            type="button"
            onClick={startWritingImmediately}
            className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-mono font-semibold uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer relative z-10 flex-shrink-0 flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Write & Climb</span>
          </button>
        </div>

        {/* AUTHOR CURRENT TIER CARD (Matching Dashboard Author Standing Banner) */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#1e1c19] text-white border border-black/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 relative z-10">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Trophy className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                  Your Atelier Standing
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
                    #{sortedLeaderboard.findIndex((i) => i.isCurrentUser) + 1 || 4}
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

              {/* Progress Bar towards next title */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-xs font-mono text-neutral-400">
                <span>{totalWords.toLocaleString()} words</span>
                <span>•</span>
                <span>{progressPercent}% to {rankInfo.nextThreshold.toLocaleString()} w</span>
                <div className="w-20 sm:w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(4, progressPercent)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 relative z-10 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <Crown className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <span className="block text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Active Shelf</span>
                <span className="text-xs font-mono font-bold text-white">{novels.length} Books</span>
              </div>
            </div>
          </div>
        </div>

        {/* LEADERBOARD TABLE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-600" />
              Atelier Scribes Ranking
            </h2>
            <span className="text-xs font-mono text-ink-muted">
              Live Word Counts
            </span>
          </div>

          <div className="rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-canvas-surface border-b border-canvas-border text-[10px] font-mono uppercase text-ink-muted tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-center w-12">#</th>
                    <th className="py-3 px-4">Author (Pen Name)</th>
                    <th className="py-3 px-4">Latest Manuscript</th>
                    <th className="py-3 px-4">Rank Tier</th>
                    <th className="py-3 px-4 text-right">Words Written</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-canvas-border/80">
                  {sortedLeaderboard.map((item, idx) => (
                    <tr
                      key={item.author + idx}
                      className={`transition-colors ${
                        item.isCurrentUser
                          ? 'bg-brand-500/10 dark:bg-brand-500/15 font-medium'
                          : 'hover:bg-canvas-hover'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        {idx === 0 ? (
                          <span className="text-amber-600 text-sm">🥇</span>
                        ) : idx === 1 ? (
                          <span className="text-slate-500 text-sm">🥈</span>
                        ) : idx === 2 ? (
                          <span className="text-amber-800 text-sm">🥉</span>
                        ) : (
                          <span className="text-ink-faint">#{idx + 1}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-ink-faint" />
                          <span className="font-serif font-semibold text-ink text-sm">
                            {item.author}
                          </span>
                          {item.isCurrentUser && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-brand-600 text-white font-bold tracking-wider">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-ink-muted font-serif">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-canvas-surface border border-canvas-border text-ink">
                          {item.badge}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-ink">
                        {item.words.toLocaleString()}{' '}
                        <span className="text-[10px] font-normal text-ink-muted">w</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
