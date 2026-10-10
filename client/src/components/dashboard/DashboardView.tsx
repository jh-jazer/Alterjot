import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { NovelStatus, NarrativeTheme } from '../../types';
import { NARRATIVE_THEMES } from '../../data/narrativeThemes';
import {
  ArrowRight,
  BookOpen,
  Trophy,
  Feather,
  Sparkles,
  Flame,
  Cog,
  Ghost,
  Cpu,
  Compass,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const novels = useWorkspaceStore((s) => s.novels);
  const penName = useWorkspaceStore((s) => s.penName);
  const preferredTheme = useWorkspaceStore((s) => s.preferredTheme);
  const setPreferredTheme = useWorkspaceStore((s) => s.setPreferredTheme);
  const openStudio = useWorkspaceStore((s) => s.openStudio);
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);
  const openPlay = useWorkspaceStore((s) => s.openPlay);
  const openRanking = useWorkspaceStore((s) => s.openRanking);
  const createNovel = useWorkspaceStore((s) => s.createNovel);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);

  const activeTheme = NARRATIVE_THEMES[preferredTheme] || NARRATIVE_THEMES['apocalyptic'];

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

  // Weekly World Action: lets the author write something about this world
  const handleTryWeeklyWorld = async () => {
    const novel = await createNovel({
      title: activeTheme.weeklyWorld.title,
      genre: activeTheme.weeklyWorld.novelGenre,
      synopsis: activeTheme.weeklyWorld.novelSynopsis,
      status: 'In Progress',
    });
    if (novel) {
      await openStudio(novel._id);
    } else {
      await startWritingImmediately();
    }
  };

  // Triad Prompt Action: write with character, place, and world
  const handleTryTriad = async () => {
    const novel = await createNovel({
      title: activeTheme.threeElements.novelTitle,
      genre: activeTheme.threeElements.novelGenre,
      synopsis: activeTheme.threeElements.novelSynopsis,
      status: 'In Progress',
    });
    if (novel) {
      await openStudio(novel._id);
    } else {
      await startWritingImmediately();
    }
  };

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
        {/* THEME PREFERENCE SELECTOR BANNER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-canvas-card border border-canvas-border shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-ink">Narrative Universe Theme:</span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-600/25 dark:text-brand-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-600" />
                  <span>{activeTheme.badge}</span>
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">
                {activeTheme.tagline}
              </p>
            </div>
          </div>

          {/* Theme Quick Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-mono text-xs">
            {(Object.keys(NARRATIVE_THEMES) as NarrativeTheme[]).map((tKey) => {
              const t = NARRATIVE_THEMES[tKey];
              const isSelected = preferredTheme === tKey;
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => setPreferredTheme(tKey)}
                  className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-brand-600 border-brand-700 text-white font-bold shadow-xs'
                      : 'bg-canvas-surface border-canvas-border text-ink-muted hover:text-ink hover:bg-canvas-hover'
                  }`}
                >
                  {tKey === 'apocalyptic' && <Flame className="w-3.5 h-3.5" />}
                  {tKey === 'steampunk' && <Cog className="w-3.5 h-3.5" />}
                  {tKey === 'dark-fantasy' && <Ghost className="w-3.5 h-3.5" />}
                  {tKey === 'cyberpunk' && <Cpu className="w-3.5 h-3.5" />}
                  <span>{tKey === 'apocalyptic' ? 'Apocalyptic' : tKey === 'dark-fantasy' ? 'Dark Fantasy' : t.name.split('&')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FIRST PART OF DASHBOARD: TWO COLUMNS (Weekly World & Creative Triad) */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
            
            {/* LEFT COLUMN: WEEKLY WORLD */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight">
                  Weekly World
                </h2>
                <span className="text-[10px] font-mono text-ink-faint uppercase tracking-wider">
                  {activeTheme.name.split('&')[0].trim()}
                </span>
              </div>

              {/* Dark cinematic card matching reference layout */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2c221a] via-[#211a14] to-[#16120e] text-white p-4 sm:p-6 shadow-xl border border-black/10 flex flex-col justify-between min-h-[310px]">
                {/* Ambient warm glow overlay */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start relative z-10">
                  {/* Book Cover Sample with subtle 3D spine depth */}
                  <div className="w-32 sm:w-40 aspect-[2/3] flex-shrink-0 relative select-none group">
                    <img
                      src={activeTheme.weeklyWorld.coverImage}
                      alt={`${activeTheme.weeklyWorld.title} Book Cover`}
                      className="w-full h-full object-cover rounded-xl shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent rounded-l-xl pointer-events-none" />
                  </div>

                  {/* World Details & Problem */}
                  <div className="flex-1 min-w-0 space-y-2.5 text-left flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                        {activeTheme.weeklyWorld.universe}
                      </span>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight mt-0.5 line-clamp-2">
                        {activeTheme.weeklyWorld.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-300 font-serif leading-relaxed line-clamp-4">
                      {activeTheme.weeklyWorld.description}
                    </p>

                    {/* Carousel indicator dots */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    </div>

                    {/* Try this world CTA */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleTryWeeklyWorld}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-serif font-semibold text-xs shadow-md shadow-brand-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        title="Create a manuscript and write in this world"
                      >
                        <Feather className="w-3.5 h-3.5" />
                        <span>Try this world</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: THREE ELEMENTS CHALLENGE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight">
                  Three Elements Challenge
                </h2>
                <span className="text-[10px] font-mono text-ink-faint uppercase tracking-wider">
                  Weekly Triad
                </span>
              </div>

              {/* Clean list panel with right-aligned images */}
              <div className="rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment p-4 sm:p-6 flex flex-col justify-between">
                <div className="divide-y divide-canvas-border/80">
                  {/* Row 1: Character */}
                  <div className="pb-3.5 flex items-center justify-between gap-3 sm:gap-4 group">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
                          Character
                        </span>
                        <h4 className="text-sm sm:text-base font-serif font-bold text-ink group-hover:text-brand-700 transition-colors truncate">
                          {activeTheme.threeElements.character.name}
                        </h4>
                      </div>
                      <p className="text-xs text-ink-muted font-sans mt-0.5 line-clamp-2 leading-relaxed">
                        {activeTheme.threeElements.character.description}
                      </p>
                    </div>
                    <div className="w-20 sm:w-28 h-14 sm:h-18 rounded-xl overflow-hidden border border-canvas-border flex-shrink-0 shadow-xs">
                      <img
                        src={activeTheme.threeElements.character.image}
                        alt={activeTheme.threeElements.character.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Row 2: Place */}
                  <div className="py-3.5 flex items-center justify-between gap-3 sm:gap-4 group">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-semibold">
                          Place
                        </span>
                        <h4 className="text-sm sm:text-base font-serif font-bold text-ink group-hover:text-brand-700 transition-colors truncate">
                          {activeTheme.threeElements.place.name}
                        </h4>
                      </div>
                      <p className="text-xs text-ink-muted font-sans mt-0.5 line-clamp-2 leading-relaxed">
                        {activeTheme.threeElements.place.description}
                      </p>
                    </div>
                    <div className="w-20 sm:w-28 h-14 sm:h-18 rounded-xl overflow-hidden border border-canvas-border flex-shrink-0 shadow-xs">
                      <img
                        src={activeTheme.threeElements.place.image}
                        alt={activeTheme.threeElements.place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Row 3: World */}
                  <div className="pt-3.5 flex items-center justify-between gap-3 sm:gap-4 group">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
                          World
                        </span>
                        <h4 className="text-sm sm:text-base font-serif font-bold text-ink group-hover:text-brand-700 transition-colors truncate">
                          {activeTheme.threeElements.world.name}
                        </h4>
                      </div>
                      <p className="text-xs text-ink-muted font-sans mt-0.5 line-clamp-2 leading-relaxed">
                        {activeTheme.threeElements.world.description}
                      </p>
                    </div>
                    <div className="w-20 sm:w-28 h-14 sm:h-18 rounded-xl overflow-hidden border border-canvas-border flex-shrink-0 shadow-xs">
                      <img
                        src={activeTheme.threeElements.world.image}
                        alt={activeTheme.threeElements.world.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action inside panel */}
                <div className="pt-4 mt-2 border-t border-canvas-border">
                  <button
                    type="button"
                    onClick={handleTryTriad}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs sm:text-sm shadow-sm shadow-brand-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <Feather className="w-3.5 h-3.5" />
                    <span>Write with these Three</span>
                  </button>
                </div>
              </div>

              {/* Try more prompts text OUTSIDE the panel and below it */}
              <div className="flex justify-end pt-1 px-1">
                <button
                  type="button"
                  onClick={openPlay}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-ink-muted hover:text-brand-700 dark:hover:text-brand-300 transition-colors group cursor-pointer"
                  title="Go to Play page for more prompts and creative timer"
                >
                  <span>Try more prompts in Playground</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECOND PART OF DASHBOARD: AUTHOR RANKING & RECENT SHELF MANUSCRIPTS */}
        <section className="space-y-6 pt-2">
          
          {/* Author Ranking Banner (styled cleanly echoing the sleek horizontal banner in reference) */}
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

            {/* Right Button: View Full Leaderboard (styled like READ NOW pill) */}
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

          {/* Recent Shelf Manuscripts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-ink flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-600" />
                  Recent Shelf Manuscripts
                </h3>
                <p className="text-xs text-ink-muted font-mono mt-0.5">
                  Volumes resting in your personal atelier
                </p>
              </div>

              <button
                type="button"
                onClick={openLibrary}
                className="text-xs font-mono text-brand-700 hover:text-brand-800 dark:text-brand-400 font-semibold flex items-center gap-1 group"
                title="Open full library shelf"
              >
                <span>View All Library Shelf</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Manuscripts Grid */}
            {novels.length === 0 ? (
              <div className="p-8 rounded-2xl bg-canvas-card border border-dashed border-canvas-border text-center shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-canvas-surface border border-canvas-border flex items-center justify-center text-brand-700 mx-auto mb-3 shadow-xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-ink mb-1">
                  Your shelf is quiet
                </h4>
                <p className="text-xs text-ink-muted max-w-sm mx-auto mb-4 font-sans">
                  No manuscripts on your desk yet. Use the Weekly World or Triad prompts above to start writing.
                </p>
                <button
                  type="button"
                  onClick={startWritingImmediately}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs shadow-xs transition-all hover:scale-105"
                >
                  Start Writing Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
                      className="rounded-2xl border border-canvas-border bg-canvas-card hover:border-brand-500/60 transition-all duration-200 shadow-parchment hover:shadow-parchment-lg cursor-pointer group flex flex-col justify-between overflow-hidden"
                    >
                      {/* Top ribbon accent */}
                      <div className={`h-2 w-full bg-gradient-to-r ${spineGradient}`} />

                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-700 font-semibold truncate">
                              {novel.genre}
                            </span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase font-medium ${getStatusBadge(novel.status)}`}>
                              {novel.status}
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-lg text-ink group-hover:text-brand-700 transition-colors line-clamp-1">
                            {novel.title}
                          </h4>

                          {novel.subtitle && (
                            <p className="text-xs text-ink-muted italic font-serif line-clamp-1 mt-0.5">
                              {novel.subtitle}
                            </p>
                          )}

                          {novel.synopsis && (
                            <p className="text-xs text-ink-muted font-sans line-clamp-2 mt-2 leading-relaxed">
                              {novel.synopsis}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-canvas-border">
                          <div className="flex items-baseline justify-between text-xs font-mono mb-1.5">
                            <span className="font-semibold text-ink">
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
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
