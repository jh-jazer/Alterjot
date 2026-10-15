import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  Medal,
  User,
} from 'lucide-react';

import { TOP_10_AUTHORS } from '../../data/communityData';
import { Top10Leaderboard } from './Top10Leaderboard';
import { Footer } from '../layout/Footer';

export const RankingView: React.FC = () => {
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const novels = useWorkspaceStore((s) => s.novels);
  const penName = useWorkspaceStore((s) => s.penName);

  const totalWords = novels.reduce((acc, n) => acc + (n.totalWordCount || 0), 0);

  // Author Tier Calculation for apocalyptic chroniclers
  const getAuthorRank = (words: number) => {
    if (words >= 60000) {
      return {
        title: 'Doomsday Cartographer',
        badge: 'Overseer of the Fall',
        color: 'text-amber-700 bg-amber-50 border-amber-300 dark:bg-amber-600/20 dark:text-amber-300',
        nextThreshold: 100000,
      };
    }
    if (words >= 25000) {
      return {
        title: 'Enclave Lorekeeper',
        badge: 'Black Box Historian',
        color: 'text-[#2e4785] bg-[#e1e9f8] border-[#a8bee7] dark:bg-indigo-600/20 dark:text-indigo-300',
        nextThreshold: 60000,
      };
    }
    if (words >= 5000) {
      return {
        title: 'Bunker Chronicler',
        badge: 'Vault Scribe',
        color: 'text-[#245b32] bg-[#dff0e4] border-[#a0cea9] dark:bg-emerald-600/20 dark:text-emerald-300',
        nextThreshold: 25000,
      };
    }
    return {
      title: 'Wasteland Drifter',
      badge: 'Scavenger Scribe',
      color: 'text-brand-800 bg-brand-50 border-brand-200 dark:bg-brand-600/20 dark:text-brand-300',
      nextThreshold: 5000,
    };
  };

  const rankInfo = getAuthorRank(totalWords);

  // Leaderboard data: woven with user if authenticated, or top 10 if guest
  const sortedLeaderboard = React.useMemo(() => {
    if (!isAuthenticated) {
      return TOP_10_AUTHORS.map((item, idx) => ({ ...item, rank: idx + 1, isCurrentUser: false }));
    }

    const userEntry = {
      rank: 4,
      author: penName,
      title: novels[0]?.title || 'Untitled Book',
      genre: novels[0]?.genre || 'General Fiction',
      words: totalWords,
      streak: 7,
      badge: rankInfo.title,
      avatarColor: 'from-brand-600 to-brand-800 text-white',
      isCurrentUser: true,
    };

    const combined = [
      ...TOP_10_AUTHORS.filter((a) => a.author.toLowerCase() !== penName.toLowerCase()),
      userEntry,
    ].sort((a, b) => b.words - a.words);

    return combined.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [isAuthenticated, penName, novels, totalWords, rankInfo.title]);

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-10">
      {/* Full width panel container */}
      <div className="w-full px-4 sm:px-8 md:px-12 py-6 sm:py-10 space-y-6 sm:space-y-10">
        
        {/* WRITING CHAMPIONS PODIUM DISPLAY */}
        <div className="w-full p-4 sm:p-6 bg-canvas-card/30 border border-canvas-border">
          <Top10Leaderboard />
        </div>

        {/* FULL LEADERBOARD TABLE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-600" />
              Complete Atelier Scribes Ranking
            </h2>
            <span className="text-xs font-mono text-ink-muted">
              Live Word Counts
            </span>
          </div>

          <div className="rounded-none bg-canvas-card border border-canvas-border shadow-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-canvas-surface border-b border-canvas-border text-[10px] font-mono uppercase text-ink-muted tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-center w-12">#</th>
                    <th className="py-3 px-4">Author (Pen Name)</th>
                    <th className="py-3 px-4">Latest Book</th>
                    <th className="py-3 px-4">Rank Tier</th>
                    <th className="py-3 px-4 text-right">Words Written</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-canvas-border/80">
                  {sortedLeaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs text-ink-muted font-sans">
                        No scribes ranked yet. Sign in, write words, and publish books to lead the rankings.
                      </td>
                    </tr>
                  ) : (
                    sortedLeaderboard.map((item, idx) => (
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
                              <span className="px-1.5 py-0.5 rounded-none text-[9px] font-mono bg-brand-600 text-white font-bold tracking-wider">
                                YOU
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-ink-muted font-serif">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-none text-[10px] font-mono bg-canvas-surface border border-canvas-border text-ink">
                            {item.badge}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-ink">
                          {item.words.toLocaleString()}{' '}
                          <span className="text-[10px] font-normal text-ink-muted">w</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* Website Footer */}
      <Footer />
    </div>
  );
};
