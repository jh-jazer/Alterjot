import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { User, Trophy } from 'lucide-react';
import { TOP_10_AUTHORS } from '../../data/communityData';
import { Top10Leaderboard } from './Top10Leaderboard';

export const RankingSection: React.FC<{ className?: string }> = ({ className = '' }) => {
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
    <section id="rankings" className={`space-y-6 select-none ${className}`}>
      {/* SECTION HEADER: MATCHING PLAY CHALLENGE PANELS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-canvas-border pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/15 rounded-none shadow-sm mb-2">
            <div className="w-0.5 h-3 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-100 drop-shadow-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Scribe Leaderboard & Rankings
            </h2>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
            Atelier Writing Champions
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
            Complete daily challenges, survive timed sprints, and pen books to climb the scribe podium.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Word Counts</span>
        </div>
      </div>

      {/* WRITING CHAMPIONS PODIUM DISPLAY */}
      <div className="w-full p-4 sm:p-6 bg-canvas-card border border-canvas-border rounded-xl shadow-parchment-lg">
        <Top10Leaderboard showRankingsLink={false} />
      </div>

      {/* FULL LEADERBOARD TABLE */}
      <div className="rounded-xl bg-canvas-card border border-canvas-border shadow-parchment-lg overflow-hidden">
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
  );
};
