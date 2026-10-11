import React, { useMemo, useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { NarrativeTheme } from '../../types';
import { NARRATIVE_THEMES } from '../../data/narrativeThemes';
import { calculateRecommendedTheme } from '../../services/recommendationEngine';
import {
  ArrowRight,
  Feather,
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ChallengesSectionProps {
  showPlaygroundLink?: boolean;
  className?: string;
}

export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  showPlaygroundLink = true,
  className = '',
}) => {
  const novels = useWorkspaceStore((s) => s.novels);
  const scenes = useWorkspaceStore((s) => s.scenes);
  const codexEntries = useWorkspaceStore((s) => s.codexEntries);
  const preferredTheme = useWorkspaceStore((s) => s.preferredTheme);
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const openStudio = useWorkspaceStore((s) => s.openStudio);
  const openPlay = useWorkspaceStore((s) => s.openPlay);
  const createNovel = useWorkspaceStore((s) => s.createNovel);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);

  // Dynamic recommendation algorithm
  const recommendation = useMemo(() => {
    return calculateRecommendedTheme(novels, scenes, codexEntries, preferredTheme, isAuthenticated);
  }, [novels, scenes, codexEntries, preferredTheme, isAuthenticated]);

  // Order all narrative universe slides with recommended/popular theme first
  const allThemes = useMemo(() => {
    const list: NarrativeTheme[] = [
      recommendation.theme,
      ...(['dark-fantasy', 'cyberpunk', 'steampunk', 'apocalyptic'] as NarrativeTheme[]).filter(
        (t) => t !== recommendation.theme
      ),
    ];
    return list;
  }, [recommendation.theme]);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide effect every 5 seconds, automatically pauses on mouse hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % allThemes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, allThemes.length]);

  // Reset to first slide when recommendation changes
  useEffect(() => {
    setActiveSlideIndex(0);
  }, [recommendation.theme]);

  // Left column (World Challenge): follows the carousel sliding index
  const slidingWorldThemeKey = allThemes[activeSlideIndex] || recommendation.theme;
  const slidingWorldTheme = NARRATIVE_THEMES[slidingWorldThemeKey] || NARRATIVE_THEMES['dark-fantasy'];

  // Right column (Three Elements Challenge): does NOT slide, stays fixed on author's recommended theme
  const staticTriadTheme = NARRATIVE_THEMES[recommendation.theme] || NARRATIVE_THEMES['dark-fantasy'];

  // World Challenge Action
  const handleTryWorldChallenge = async () => {
    const novel = await createNovel({
      title: slidingWorldTheme.weeklyWorld.title,
      genre: slidingWorldTheme.weeklyWorld.novelGenre,
      synopsis: slidingWorldTheme.weeklyWorld.novelSynopsis,
      status: 'In Progress',
    });
    if (novel) {
      await openStudio(novel._id);
    } else {
      await startWritingImmediately();
    }
  };

  // Triad Prompt Action
  const handleTryTriad = async () => {
    const novel = await createNovel({
      title: staticTriadTheme.threeElements.novelTitle,
      genre: staticTriadTheme.threeElements.novelGenre,
      synopsis: staticTriadTheme.threeElements.novelSynopsis,
      status: 'In Progress',
    });
    if (novel) {
      await openStudio(novel._id);
    } else {
      await startWritingImmediately();
    }
  };

  return (
    <section className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        {/* LEFT COLUMN: WORLD CHALLENGE (SLIDING) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight">
                World Challenge
              </h2>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full shadow-2xs border ${
                  recommendation.isPopular
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                    : 'bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/20'
                }`}
                title={recommendation.reason}
              >
                {recommendation.isPopular ? (
                  <Flame className="w-3 h-3 text-amber-600" />
                ) : (
                  <Sparkles className="w-3 h-3 text-brand-600" />
                )}
                <span>{recommendation.badgeLabel}</span>
              </span>
            </div>
          </div>

          {/* Dark cinematic card with auto-slide */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2c221a] via-[#211a14] to-[#16120e] text-white p-4 sm:p-6 shadow-xl border border-black/10 flex flex-col justify-between min-h-[310px] group/carousel select-none transition-colors duration-500"
          >
            {/* Ambient warm glow overlay */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Manual Navigation Chevrons (shown on hover) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlideIndex((prev) => (prev - 1 + allThemes.length) % allThemes.length);
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 z-20 cursor-pointer shadow-md hover:scale-105"
              title="Previous universe"
              aria-label="Previous universe"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlideIndex((prev) => (prev + 1) % allThemes.length);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 z-20 cursor-pointer shadow-md hover:scale-105"
              title="Next universe"
              aria-label="Next universe"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div key={slidingWorldThemeKey} className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start relative z-10 animate-fadeIn transition-opacity duration-300">
              {/* Book Cover Sample with subtle 3D spine depth */}
              <div className="w-32 sm:w-40 aspect-[2/3] flex-shrink-0 relative select-none group">
                <img
                  src={slidingWorldTheme.weeklyWorld.coverImage}
                  alt={`${slidingWorldTheme.weeklyWorld.title} Book Cover`}
                  className="w-full h-full object-cover rounded-xl shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent rounded-l-xl pointer-events-none" />
              </div>

              {/* World Details & Problem */}
              <div className="flex-1 min-w-0 space-y-2.5 text-left flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                    {slidingWorldTheme.weeklyWorld.universe}
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight mt-0.5 line-clamp-2">
                    {slidingWorldTheme.weeklyWorld.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 font-serif leading-relaxed line-clamp-4">
                  {slidingWorldTheme.weeklyWorld.description}
                </p>

                {/* Interactive Auto-Slide indicator dots */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  {allThemes.map((tKey, idx) => (
                    <button
                      key={tKey}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlideIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeSlideIndex === idx
                          ? 'w-5 bg-white shadow-xs'
                          : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      title={`Slide ${idx + 1}: ${NARRATIVE_THEMES[tKey].name}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                  {isHovered && (
                    <span className="text-[9px] font-mono text-white/50 ml-1.5 select-none animate-pulse">Paused</span>
                  )}
                </div>

                {/* Try this challenge CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleTryWorldChallenge}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-serif font-semibold text-xs shadow-md shadow-brand-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    title="Create a manuscript and write in this world"
                  >
                    <Feather className="w-3.5 h-3.5" />
                    <span>Try this challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Try more challenges in Playground below World Challenge (aligned to left) */}
          {showPlaygroundLink && (
            <div className="flex justify-start pt-2 px-0.5">
              <button
                type="button"
                onClick={openPlay}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-ink-muted hover:text-brand-700 dark:hover:text-brand-300 transition-colors group cursor-pointer"
                title="Go to Play page for more challenges and creative timer"
              >
                <span>Try more challenges in Playground</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: THREE ELEMENTS CHALLENGE (STATIC - DOES NOT SLIDE) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight">
              Three Elements Challenge
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-2xs">
              <Flame className="w-3 h-3 text-amber-600" />
              <span>Popular</span>
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
                      {staticTriadTheme.threeElements.character.name}
                    </h4>
                  </div>
                  <p className="text-xs text-ink-muted font-sans mt-0.5 line-clamp-2 leading-relaxed">
                    {staticTriadTheme.threeElements.character.description}
                  </p>
                </div>
                <div className="w-20 sm:w-28 h-14 sm:h-18 rounded-xl overflow-hidden border border-canvas-border flex-shrink-0 shadow-xs">
                  <img
                    src={staticTriadTheme.threeElements.character.image}
                    alt={staticTriadTheme.threeElements.character.name}
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
                      {staticTriadTheme.threeElements.place.name}
                    </h4>
                  </div>
                  <p className="text-xs text-ink-muted font-sans mt-0.5 line-clamp-2 leading-relaxed">
                    {staticTriadTheme.threeElements.place.description}
                  </p>
                </div>
                <div className="w-20 sm:w-28 h-14 sm:h-18 rounded-xl overflow-hidden border border-canvas-border flex-shrink-0 shadow-xs">
                  <img
                    src={staticTriadTheme.threeElements.place.image}
                    alt={staticTriadTheme.threeElements.place.name}
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
                      {staticTriadTheme.threeElements.world.name}
                    </h4>
                  </div>
                  <p className="text-xs text-ink-muted font-sans mt-0.5 line-clamp-2 leading-relaxed">
                    {staticTriadTheme.threeElements.world.description}
                  </p>
                </div>
                <div className="w-20 sm:w-28 h-14 sm:h-18 rounded-xl overflow-hidden border border-canvas-border flex-shrink-0 shadow-xs">
                  <img
                    src={staticTriadTheme.threeElements.world.image}
                    alt={staticTriadTheme.threeElements.world.name}
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
        </div>
      </div>
    </section>
  );
};
