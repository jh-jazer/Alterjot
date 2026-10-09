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
  const novels = useWorkspaceStore((s) => s.novels);
  const penName = useWorkspaceStore((s) => s.penName);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);

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
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none">
      {/* Side margin container matching navbar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 space-y-10">
        {/* Banner Header */}
        <div className="p-6 md:p-8 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brand-700">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-mono uppercase tracking-widest font-semibold">
                Atelier Word Hall of Fame
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink">
              Rankings & Output
            </h1>
            <p className="text-sm text-ink-muted font-sans max-w-xl">
              Celebrate manuscript milestones, track your writing rank, and join fellow authors in persistent drafting momentum.
            </p>
          </div>

          <button
            type="button"
            onClick={startWritingImmediately}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-medium text-sm transition-all shadow-sm shadow-brand-600/30 active:scale-95 self-start md:self-auto"
          >
            <Feather className="w-4 h-4" />
            <span>Write & Climb Ranks</span>
          </button>
        </div>

        {/* AUTHOR CURRENT TIER CARD */}
        <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${rankInfo.color}`}>
                {rankInfo.badge}
              </span>
              <span className="text-xs font-mono text-ink-faint uppercase font-semibold">Author Standing</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-ink">
              {penName} • <span className="text-brand-700 dark:text-brand-400">{rankInfo.title}</span>
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed font-sans">
              You have written <strong>{totalWords.toLocaleString()} words</strong> across your active manuscripts. Keep drafting to ascend toward the next author echelon.
            </p>

            {/* Progress Bar */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                <span>{totalWords.toLocaleString()} words</span>
                <span>Next Rank: {rankInfo.nextThreshold.toLocaleString()} words ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-canvas-surface border border-canvas-border overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-amber-600 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-canvas-surface border border-canvas-border/80 flex flex-col justify-center items-center text-center space-y-1">
            <Crown className="w-8 h-8 text-amber-600 mb-1" />
            <span className="text-[10px] font-mono text-ink-faint uppercase font-semibold">Current Level</span>
            <span className="text-lg font-serif font-bold text-ink">{rankInfo.title}</span>
            <span className="text-xs font-mono text-brand-700 font-semibold">{novels.length} Books on Shelf</span>
          </div>
        </div>

        {/* LEADERBOARD TABLE */}
        <div className="rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment overflow-hidden">
          <div className="p-4 md:p-5 border-b border-canvas-border flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-ink flex items-center gap-2">
              <Medal className="w-4 h-4 text-amber-600" />
              <span>Atelier Scribes Ranking</span>
            </h3>
            <span className="text-xs font-mono text-ink-faint">
              Updated Live • Output Word Counts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-canvas-subtle/60 border-b border-canvas-border text-[11px] font-mono uppercase text-ink-muted">
                <tr>
                  <th className="py-3 px-4 text-center w-12">#</th>
                  <th className="py-3 px-4">Author (Pen Name)</th>
                  <th className="py-3 px-4">Latest Manuscript</th>
                  <th className="py-3 px-4">Rank Tier</th>
                  <th className="py-3 px-4 text-right">Words Written</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-border">
                {sortedLeaderboard.map((item, idx) => (
                    <tr
                      key={item.author + idx}
                      className={`transition-colors ${
                        item.isCurrentUser
                          ? 'bg-brand-50/70 dark:bg-brand-600/15 font-medium'
                          : 'hover:bg-canvas-hover'
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        {idx === 0 ? (
                          <span className="text-amber-600 text-sm">🥇</span>
                        ) : idx === 1 ? (
                          <span className="text-slate-500 text-sm">🥈</span>
                        ) : idx === 2 ? (
                          <span className="text-amber-800 text-sm">🥉</span>
                        ) : (
                          <span className="text-ink-faint">{idx + 1}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-ink-faint" />
                          <span className="font-serif font-semibold text-ink text-sm">
                            {item.author}
                          </span>
                          {item.isCurrentUser && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-brand-600 text-white font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-ink-muted font-serif">
                        {item.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-canvas-surface border border-canvas-border text-ink">
                          {item.badge}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-ink">
                        {item.words.toLocaleString()}{' '}
                        <span className="text-[10px] font-normal text-ink-muted">w</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
