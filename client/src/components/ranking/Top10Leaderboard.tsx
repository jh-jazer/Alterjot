import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { TOP_10_AUTHORS } from '../../data/communityData';
import {
  Trophy,
  ArrowRight,
} from 'lucide-react';

interface Top10LeaderboardProps {
  onSelectAuthorWork?: (workTitle: string) => void;
}

// Stylized Author Avatar component matching ink sketch portrait aesthetic
const AuthorAvatar: React.FC<{
  author: string;
  rank: 1 | 2 | 3;
  avatarUrl?: string;
  className?: string;
}> = ({ author, rank, avatarUrl, className = 'w-12 h-12 xs:w-14 xs:h-14 sm:w-18 sm:h-18 md:w-20 md:h-20' }) => {
  if (avatarUrl) {
    return (
      <div
        className={`relative rounded-full overflow-hidden p-0.5 border-2 ${
          rank === 1
            ? 'border-amber-400 bg-amber-950/80 shadow-[0_0_16px_rgba(245,158,11,0.4)]'
            : rank === 2
            ? 'border-slate-300 bg-slate-900/80 shadow-[0_0_14px_rgba(148,163,184,0.3)]'
            : 'border-orange-500 bg-orange-950/80 shadow-[0_0_14px_rgba(234,88,12,0.3)]'
        } ${className}`}
      >
        <img
          src={avatarUrl}
          alt={author}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="w-full h-full object-cover rounded-full pointer-events-none select-none"
        />
      </div>
    );
  }

  const initials = author
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return (
    <div
      className={`relative rounded-full p-0.5 border-2 flex items-center justify-center overflow-hidden select-none ${
        rank === 1
          ? 'border-amber-500 dark:border-amber-400/90 bg-amber-50 dark:bg-gradient-to-b dark:from-[#2e2619] dark:to-[#16130d] shadow-[0_2px_10px_rgba(245,158,11,0.2)] dark:shadow-[0_0_20px_rgba(245,158,11,0.35)]'
          : rank === 2
          ? 'border-slate-400 dark:border-slate-300/80 bg-slate-100 dark:bg-gradient-to-b dark:from-[#25282e] dark:to-[#131518] shadow-[0_2px_8px_rgba(148,163,184,0.2)] dark:shadow-[0_0_16px_rgba(148,163,184,0.25)]'
          : 'border-orange-500 dark:border-orange-500/80 bg-orange-50 dark:bg-gradient-to-b dark:from-[#291e17] dark:to-[#140e0a] shadow-[0_2px_8px_rgba(234,88,12,0.2)] dark:shadow-[0_0_16px_rgba(234,88,12,0.25)]'
      } ${className}`}
    >
      {/* Inner sketch ring */}
      <div className="absolute inset-0.5 rounded-full border border-black/10 dark:border-white/10 pointer-events-none" />

      {/* Sketched avatar silhouettes matching reference aesthetic */}
      {rank === 1 ? (
        <svg viewBox="0 0 40 40" className="w-7 h-7 xs:w-8 xs:h-8 sm:w-11 sm:h-11 text-amber-900 dark:text-amber-200/90 relative z-10" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="20" cy="15" r="7" stroke="currentColor" fill="rgba(245, 158, 11, 0.15)" />
          <path d="M10 35C10 28 14.5 24.5 20 24.5C25.5 24.5 30 28 30 35" stroke="currentColor" />
          <path d="M15 11C17.5 9 22.5 9 25 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ) : rank === 2 ? (
        <svg viewBox="0 0 40 40" className="w-7 h-7 xs:w-8 xs:h-8 sm:w-11 sm:h-11 text-slate-800 dark:text-slate-200 relative z-10" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="20" cy="15" r="7" stroke="currentColor" fill="rgba(148, 163, 184, 0.15)" />
          <path d="M10 35C10 28 14.5 24.5 20 24.5C25.5 24.5 30 28 30 35" stroke="currentColor" />
          <path d="M14 13C16 10.5 24 10.5 26 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 40 40" className="w-7 h-7 xs:w-8 xs:h-8 sm:w-11 sm:h-11 text-orange-900 dark:text-orange-200 relative z-10" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="20" cy="15" r="7" stroke="currentColor" fill="rgba(234, 88, 12, 0.15)" />
          <path d="M10 35C10 28 14.5 24.5 20 24.5C25.5 24.5 30 28 30 35" stroke="currentColor" />
          <circle cx="20" cy="7.5" r="2.5" stroke="currentColor" fill="currentColor" opacity="0.8" />
        </svg>
      )}

      {/* Monogram tag */}
      <span className="absolute bottom-0.5 font-mono font-bold text-[7px] xs:text-[8px] sm:text-[9px] text-stone-700 dark:text-white/70 tracking-wider z-20">
        {initials}
      </span>
    </div>
  );
};

export const Top10Leaderboard: React.FC<Top10LeaderboardProps> = ({
  onSelectAuthorWork,
}) => {
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const penName = useWorkspaceStore((s) => s.penName);
  const currentUser = useWorkspaceStore((s) => s.currentUser);
  const novels = useWorkspaceStore((s) => s.novels);
  const openRanking = useWorkspaceStore((s) => s.openRanking);

  const totalWords = novels.reduce((acc, n) => acc + (n.totalWordCount || 0), 0);

  // Author rank tiers calculation
  const getAuthorRank = (words: number) => {
    if (words >= 60000) return 'Doomsday Cartographer';
    if (words >= 25000) return 'Enclave Lorekeeper';
    if (words >= 5000) return 'Bunker Chronicler';
    return 'Wasteland Drifter';
  };

  // Compute author rankings with user woven in if authenticated
  const authorsList = React.useMemo(() => {
    if (!isAuthenticated) {
      return TOP_10_AUTHORS.slice(0, 10).map((item, idx) => ({
        ...item,
        rank: idx + 1,
        isCurrentUser: false,
      }));
    }

    const userEntry = {
      rank: 4,
      author: penName,
      title: novels[0]?.title || 'Untitled Manuscript',
      genre: novels[0]?.genre || 'General Fiction',
      words: totalWords,
      streak: 7,
      badge: getAuthorRank(totalWords),
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

  const goldHolder = authorsList[0];
  const silverHolder = authorsList[1];
  const bronzeHolder = authorsList[2];

  // User position if authenticated and not in top 3
  const userEntry = authorsList.find((a) => a.isCurrentUser);
  const isUserOnPodium = userEntry ? userEntry.rank <= 3 : false;

  return (
    <div className="w-full space-y-3">
      {/* THREE TROPHIES PODIUM DISPLAY (Single Unified 3-Pillar Panel — 1 View on Mobile & Desktop) */}
      <div className="w-full relative overflow-hidden border-y border-stone-300 dark:border-stone-800 bg-[#eef0f3] dark:bg-[#14161a] pt-3 sm:pt-4 pb-0">
        {/* Light Mode Marble Backdrop Texture */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-75 dark:opacity-0 mix-blend-multiply pointer-events-none block dark:hidden"
          style={{ backgroundImage: `url('/images/podium-backdrop-light.jpg')` }}
        />
        {/* Dark Mode Marble Backdrop Texture */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-0 dark:opacity-30 mix-blend-luminosity pointer-events-none hidden dark:block"
          style={{ backgroundImage: `url('/images/podium-backdrop.jpg')` }}
        />
        {/* Ambient Subtle Lighting Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100/50 via-stone-200/30 to-stone-300/40 dark:from-[#181a20]/90 dark:via-[#121418]/80 dark:to-[#0b0c0e] pointer-events-none" />

        {/* TOP-LEFT PANEL HEADER: LEADERBOARD (INSIDE PANEL) */}
        <div className="relative z-20 px-4 sm:px-8 md:px-12 pb-2 sm:pb-3 flex items-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-stone-300/80 dark:border-white/15 rounded-none shadow-sm">
            <div className="w-0.5 h-3 bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
            <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-900 dark:text-stone-100">
              Leaderboard
            </h2>
          </div>
        </div>

        {/* Ambient Fog / Floor Mist */}
        <div className="absolute bottom-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-t from-[#dde1e7] via-[#dde1e7]/70 to-transparent dark:from-[#0c0d10] dark:via-[#0c0d10]/70 dark:to-transparent pointer-events-none z-10" />

        {/* Unified 3-Pillars Podium Stage (Single Viewable Frame on Mobile) */}
        {authorsList.length === 0 ? (
          <div className="relative z-10 py-12 px-4 text-center max-w-sm mx-auto space-y-2.5">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto shadow-sm">
              <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
              The Scribe Podium Awaits Its First Champion
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
              Pen manuscripts and log daily word counts to claim the top podium ranks.
            </p>
          </div>
        ) : (
          <div className="relative z-10 flex items-end justify-center gap-1.5 xs:gap-3 sm:gap-6 md:gap-8 max-w-lg mx-auto w-full px-2 sm:px-4">
            {/* ================= 2ND PLACE: SILVER (LEFT) ================= */}
            {silverHolder && (
              <div
                onClick={() => onSelectAuthorWork && onSelectAuthorWork(silverHolder.title)}
                className="flex-1 max-w-[110px] xs:max-w-[135px] sm:max-w-[170px] md:max-w-[190px] flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                title={`2nd Place: ${silverHolder.author} - ${silverHolder.title}`}
              >
                {/* Profile Icon with Trophy */}
                <div className="relative mb-1">
                  <AuthorAvatar
                    author={silverHolder.author}
                    rank={2}
                    avatarUrl={silverHolder.isCurrentUser ? currentUser?.avatarUrl : undefined}
                  />
                  {/* Silver Trophy Badge */}
                  <div 
                    className="absolute -top-1 -right-1 xs:-top-1.5 xs:-right-1.5 w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 border border-white/80 shadow-md flex items-center justify-center z-20"
                    title="Silver Trophy"
                  >
                    <Trophy className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 text-slate-900 fill-slate-900" />
                  </div>
                </div>

                {/* Username */}
                <span className="font-serif font-black text-xs xs:text-sm sm:text-base text-stone-900 dark:text-white tracking-tight truncate w-full text-center group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors px-0.5">
                  {silverHolder.author}
                </span>

                {/* Genre / Streak Subtext */}
                <span className="text-[9px] xs:text-[10px] sm:text-xs text-stone-600 dark:text-slate-400 font-sans truncate w-full text-center mt-0.5 px-0.5">
                  {silverHolder.genre}
                </span>

                {/* 2nd Place Pedestal Pillar */}
                <div className="w-full h-28 xs:h-32 sm:h-44 md:h-52 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-b from-[#2b3038] via-[#1d2127] to-[#121417] border-t border-x border-slate-500/40 shadow-xl flex flex-col items-center pt-2 xs:pt-3 sm:pt-4 px-1 sm:px-2 relative overflow-hidden mt-2">
                  {/* Top Silver Highlight Line */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-70" />

                  {/* Rank 2 Square Badge */}
                  <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-md bg-slate-300 text-slate-950 font-sans font-black text-xs xs:text-sm sm:text-base flex items-center justify-center shadow-md flex-shrink-0">
                    2
                  </div>

                  {/* Score / Words */}
                  <div className="mt-1.5 xs:mt-2 sm:mt-2.5 text-center">
                    <div className="font-sans font-black text-xs xs:text-sm sm:lg md:text-xl text-white tracking-tight leading-none">
                      {silverHolder.words.toLocaleString()}
                    </div>
                    <div className="font-sans text-[8px] xs:text-[9px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      words
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 1ST PLACE: GOLD (CENTER — TALLEST) ================= */}
            {goldHolder && (
              <div
                onClick={() => onSelectAuthorWork && onSelectAuthorWork(goldHolder.title)}
                className="flex-1 max-w-[125px] xs:max-w-[150px] sm:max-w-[190px] md:max-w-[215px] flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:-translate-y-1 relative z-20"
                title={`1st Place: ${goldHolder.author} - ${goldHolder.title}`}
              >
                {/* Profile Icon with Gold Trophy */}
                <div className="relative mb-1">
                  <AuthorAvatar
                    author={goldHolder.author}
                    rank={1}
                    avatarUrl={goldHolder.isCurrentUser ? currentUser?.avatarUrl : undefined}
                    className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-22 md:h-22"
                  />
                  {/* Gold Trophy Badge */}
                  <div 
                    className="absolute -top-1 -right-1 xs:-top-1.5 xs:-right-1.5 w-6 h-6 xs:w-7 xs:h-7 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 border border-white/80 shadow-lg flex items-center justify-center z-20"
                    title="Gold Trophy"
                  >
                    <Trophy className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-stone-950 fill-stone-950" />
                  </div>
                </div>

                {/* Username */}
                <span className="font-serif font-black text-xs xs:text-sm sm:text-base md:text-lg text-stone-900 dark:text-white tracking-tight truncate w-full text-center group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors px-0.5">
                  {goldHolder.author}
                </span>

                {/* Genre / Streak Subtext */}
                <span className="text-[9px] xs:text-[10px] sm:text-xs text-amber-800 dark:text-amber-300/80 font-sans font-medium truncate w-full text-center mt-0.5 px-0.5">
                  {goldHolder.genre}
                </span>

                {/* 1st Place Pedestal Pillar (Tallest) */}
                <div className="w-full h-40 xs:h-46 sm:h-60 md:h-70 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-b from-[#38414e] via-[#242a32] to-[#14161a] border-t-2 border-x border-amber-400/80 shadow-[0_-10px_35px_rgba(245,158,11,0.22)] flex flex-col items-center pt-2.5 xs:pt-3.5 sm:pt-5 px-1 sm:px-2 relative overflow-hidden mt-2">
                  {/* Top Gold Highlight Line */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 opacity-90" />

                  {/* Rank 1 Square Badge */}
                  <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-md bg-amber-400 text-stone-950 font-sans font-black text-sm xs:text-base sm:text-lg flex items-center justify-center shadow-lg flex-shrink-0">
                    1
                  </div>

                  {/* Score / Words */}
                  <div className="mt-1.5 xs:mt-2 sm:mt-2.5 text-center">
                    <div className="font-sans font-black text-sm xs:text-base sm:text-xl md:text-2xl text-white tracking-tight leading-none">
                      {goldHolder.words.toLocaleString()}
                    </div>
                    <div className="font-sans text-[8px] xs:text-[9px] sm:text-[11px] text-amber-300/80 uppercase tracking-wider font-bold mt-0.5">
                      words
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 3RD PLACE: BRONZE (RIGHT — SHORTEST) ================= */}
            {bronzeHolder && (
              <div
                onClick={() => onSelectAuthorWork && onSelectAuthorWork(bronzeHolder.title)}
                className="flex-1 max-w-[110px] xs:max-w-[135px] sm:max-w-[170px] md:max-w-[190px] flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                title={`3rd Place: ${bronzeHolder.author} - ${bronzeHolder.title}`}
              >
                {/* Profile Icon with Bronze Trophy */}
                <div className="relative mb-1">
                  <AuthorAvatar
                    author={bronzeHolder.author}
                    rank={3}
                    avatarUrl={bronzeHolder.isCurrentUser ? currentUser?.avatarUrl : undefined}
                  />
                  {/* Bronze Trophy Badge */}
                  <div 
                    className="absolute -top-1 -right-1 xs:-top-1.5 xs:-right-1.5 w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 border border-white/80 shadow-md flex items-center justify-center z-20"
                    title="Bronze Trophy"
                  >
                    <Trophy className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 text-stone-950 fill-stone-950" />
                  </div>
                </div>

                {/* Username */}
                <span className="font-serif font-black text-xs xs:text-sm sm:text-base text-stone-900 dark:text-white tracking-tight truncate w-full text-center group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors px-0.5">
                  {bronzeHolder.author}
                </span>

                {/* Genre / Streak Subtext */}
                <span className="text-[9px] xs:text-[10px] sm:text-xs text-stone-600 dark:text-orange-300/80 font-sans truncate w-full text-center mt-0.5 px-0.5">
                  {bronzeHolder.genre}
                </span>

                {/* 3rd Place Pedestal Pillar */}
                <div className="w-full h-20 xs:h-24 sm:h-34 md:h-40 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-b from-[#262b32] via-[#1a1e23] to-[#101215] border-t border-x border-orange-700/40 shadow-lg flex flex-col items-center pt-2 xs:pt-2.5 sm:pt-3.5 px-1 sm:px-2 relative overflow-hidden mt-2">
                  {/* Top Bronze Highlight Line */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-70" />

                  {/* Rank 3 Square Badge */}
                  <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-md bg-amber-600 text-white font-sans font-black text-xs xs:text-sm sm:text-base flex items-center justify-center shadow-md flex-shrink-0">
                    3
                  </div>

                  {/* Score / Words */}
                  <div className="mt-1.5 xs:mt-2 text-center">
                    <div className="font-sans font-black text-xs xs:text-sm sm:text-lg md:text-xl text-white tracking-tight leading-none">
                      {bronzeHolder.words.toLocaleString()}
                    </div>
                    <div className="font-sans text-[8px] xs:text-[9px] sm:text-[11px] text-orange-300/70 uppercase tracking-wider font-semibold mt-0.5">
                      words
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER BAR: User Standing (if signed in) */}
      {isAuthenticated && userEntry && (
        <div className="px-4 sm:px-8 md:px-12 pt-1">
          <div className="w-full p-3.5 sm:p-4 rounded-none bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-stone-700 dark:text-neutral-200">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-none bg-brand-600 text-white font-bold text-[10px] tracking-wider uppercase">
                {isUserOnPodium ? 'PODIUM SCRIBE' : `RANK #${userEntry.rank}`}
              </span>
              <span className="font-serif font-bold text-sm text-stone-900 dark:text-white">{penName}</span>
              <span className="text-stone-500 dark:text-neutral-400 hidden md:inline">
                • {userEntry.badge}
              </span>
              <span className="text-stone-500 dark:text-neutral-500">
                • {totalWords.toLocaleString()} words penned
              </span>
            </div>

            <button
              type="button"
              onClick={openRanking}
              className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold flex items-center gap-1 group cursor-pointer self-start sm:self-auto"
            >
              <span>See entire leaderboard rankings</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
