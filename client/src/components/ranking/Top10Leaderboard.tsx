import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { TOP_10_AUTHORS } from '../../data/communityData';
import {
  Trophy,
  Flame,
  User,
  BookOpen,
} from 'lucide-react';

interface Top10LeaderboardProps {
  onSelectAuthorWork?: (workTitle: string) => void;
}

export const Top10Leaderboard: React.FC<Top10LeaderboardProps> = ({
  onSelectAuthorWork,
}) => {
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const penName = useWorkspaceStore((s) => s.penName);
  const novels = useWorkspaceStore((s) => s.novels);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);

  const totalWords = novels.reduce((acc, n) => acc + (n.totalWordCount || 0), 0);

  // If user is authenticated, we can dynamically weave them into the list if they rank in top 10
  const authorsList = React.useMemo(() => {
    if (!isAuthenticated) {
      return TOP_10_AUTHORS.slice(0, 10);
    }

    // Merge signed in user into the list if signed in
    const userEntry = {
      rank: 4,
      author: penName,
      title: novels[0]?.title || 'Untitled Manuscript',
      genre: novels[0]?.genre || 'General Fiction',
      words: totalWords,
      streak: 7,
      badge: totalWords >= 25000 ? 'Seasoned Novelist' : totalWords >= 5000 ? 'Journeyman Author' : 'Apprentice Scribe',
      avatarColor: 'from-brand-600 to-brand-800 text-white',
      isCurrentUser: true,
    };

    const combined = [
      ...TOP_10_AUTHORS.filter((a) => a.author.toLowerCase() !== penName.toLowerCase()),
      userEntry,
    ].sort((a, b) => b.words - a.words);

    return combined.slice(0, 10).map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [isAuthenticated, penName, novels, totalWords]);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-serif font-bold text-ink tracking-tight flex items-center gap-2">
            Leaderboard
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold">
              Top 10 Scribes
            </span>
          </h3>
        </div>
      </div>

      {/* Top 10 Table Container */}
      <div className="rounded-xl bg-canvas-card border border-canvas-border shadow-parchment overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-canvas-surface border-b border-canvas-border text-[10px] font-mono uppercase text-ink-muted tracking-wider">
              <tr>
                <th className="py-3 px-3.5 text-center w-12">#</th>
                <th className="py-3 px-3.5">Author (Pen Name)</th>
                <th className="py-3 px-3.5 hidden md:table-cell">Notable Manuscript</th>
                <th className="py-3 px-3.5 hidden sm:table-cell">Rank Tier</th>
                <th className="py-3 px-3.5 text-center hidden sm:table-cell">Streak</th>
                <th className="py-3 px-3.5 text-right">Words Penned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border/80">
              {authorsList.map((item, idx) => {
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;

                return (
                  <tr
                    key={item.author + idx}
                    onClick={() => onSelectAuthorWork && onSelectAuthorWork(item.title)}
                    className={`transition-colors cursor-pointer group ${
                      item.isCurrentUser
                        ? 'bg-brand-500/10 dark:bg-brand-500/15 font-medium'
                        : isFirst
                        ? 'bg-amber-500/5 hover:bg-amber-500/10'
                        : 'hover:bg-canvas-hover'
                    }`}
                  >
                    {/* Rank column */}
                    <td className="py-3 px-3.5 text-center font-mono font-bold">
                      {isFirst ? (
                        <span className="text-base" title="1st Place (Gold)">🥇</span>
                      ) : isSecond ? (
                        <span className="text-base" title="2nd Place (Silver)">🥈</span>
                      ) : isThird ? (
                        <span className="text-base" title="3rd Place (Bronze)">🥉</span>
                      ) : (
                        <span className="text-ink-faint text-xs font-mono">#{item.rank}</span>
                      )}
                    </td>

                    {/* Author column */}
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${
                            item.avatarColor || 'from-neutral-600 to-neutral-800 text-white'
                          } flex items-center justify-center font-serif font-bold text-xs shadow-xs flex-shrink-0`}
                        >
                          {item.author.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-serif font-semibold text-ink text-sm group-hover:text-brand-700 transition-colors truncate">
                              {item.author}
                            </span>
                            {item.isCurrentUser && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-brand-600 text-white font-bold tracking-wider">
                                YOU
                              </span>
                            )}
                          </div>
                          {/* Visible on mobile if notable manuscript column is hidden */}
                          <span className="md:hidden text-[11px] text-ink-muted font-serif block truncate">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Notable manuscript */}
                    <td className="py-3 px-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-ink-faint flex-shrink-0" />
                        <span className="text-ink-muted font-serif text-xs truncate max-w-[200px]">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-canvas-surface border border-canvas-border text-ink-faint uppercase flex-shrink-0">
                          {item.genre}
                        </span>
                      </div>
                    </td>

                    {/* Rank Tier Badge */}
                    <td className="py-3 px-3.5 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-canvas-surface border border-canvas-border text-ink whitespace-nowrap">
                        {item.badge}
                      </span>
                    </td>

                    {/* Streak */}
                    <td className="py-3 px-3.5 text-center hidden sm:table-cell">
                      <div className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                        <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                        <span>{item.streak}d</span>
                      </div>
                    </td>

                    {/* Words Written */}
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-ink whitespace-nowrap">
                      <span className="text-sm">{item.words.toLocaleString()}</span>{' '}
                      <span className="text-[10px] font-normal text-ink-muted">w</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Guest Notice */}
        {!isAuthenticated && (
          <div className="p-3 bg-canvas-surface/60 border-t border-canvas-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-ink-muted">
            <div className="flex items-center gap-1.5 text-center sm:text-left">
              <User className="w-3.5 h-3.5 text-brand-600" />
              <span>You are viewing atelier standings as a guest.</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true, 'signin')}
              className="text-brand-700 hover:text-brand-800 dark:text-brand-300 font-bold underline underline-offset-2 cursor-pointer"
            >
              Sign in to record words and claim your place
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
