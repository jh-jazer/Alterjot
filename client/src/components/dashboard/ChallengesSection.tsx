import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import worldChallengeBanner from '../../assets/world_challenge_banner.jpg';
import threeElementsBanner from '../../assets/three_elements_banner.jpg';
import { ArrowRight, Flame, ChevronLeft, ChevronRight } from 'lucide-react';

interface ChallengesSectionProps {
  showPlaygroundLink?: boolean;
  className?: string;
}

export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  showPlaygroundLink = true,
  className = '',
}) => {
  const openPlay = useWorkspaceStore((s) => s.openPlay);
  const openChallenge = useWorkspaceStore((s) => s.openChallenge);
  const preferredTheme = useWorkspaceStore((s) => s.preferredTheme);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      id: 'world',
      challengeId:
        preferredTheme === 'cyberpunk'
          ? 'cyberpunk-world'
          : preferredTheme === 'dark-fantasy'
          ? 'dark-fantasy-world'
          : preferredTheme === 'steampunk'
          ? 'steampunk-world'
          : 'apocalyptic-world',
      badge: 'World Challenge',
      universe: 'Ashland Waste • Year 2049',
      title: 'The Salted Horizon',
      description: 'Write a survival chronicle of the first scouts venturing past the ash-wall into the unmapped wastes.',
      image: worldChallengeBanner,
      alt: 'World Challenge: The Salted Horizon',
    },
    {
      id: 'triad',
      challengeId:
        preferredTheme === 'cyberpunk'
          ? 'cyberpunk-triad'
          : preferredTheme === 'dark-fantasy'
          ? 'dark-fantasy-triad'
          : preferredTheme === 'steampunk'
          ? 'steampunk-triad'
          : 'apocalyptic-triad',
      badge: 'Three Elements',
      universe: 'Babel Silo • Outpost',
      title: 'Echoes of the Obsidian Rustbelt',
      description: 'Weave Jax Vance, the Ruined Silo of Babel, and the Salted Horizon into a harrowing survival narrative.',
      image: threeElementsBanner,
      alt: 'Three Elements Challenge: Echoes of the Obsidian Rustbelt',
    },
  ];

  // Auto-advance slideshow every 5 seconds, pausing on hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const currentSlide = slides[currentSlideIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className={`space-y-3 ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-serif font-bold text-ink tracking-tight flex items-center gap-2">
            Challenges
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold hidden xs:inline-block">
              {currentSlide.badge}
            </span>
          </h3>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlideIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlideIndex === idx
                  ? 'w-5 bg-amber-500 dark:bg-amber-400'
                  : 'w-1.5 bg-canvas-border hover:bg-ink-muted'
              }`}
              title={`Switch to ${s.title}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Panoramic Banner Slideshow Card */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => openChallenge(currentSlide.challengeId)}
        className="relative rounded-xl overflow-hidden shadow-xl border border-canvas-border hover:border-brand-500/40 transition-all duration-300 group cursor-pointer select-none bg-stone-950"
      >
        <div className="relative w-full aspect-[21/8] sm:aspect-[24/8] max-h-[250px] min-h-[160px] overflow-hidden">
          {/* Active Banner Image with fade-in on slide change */}
          <img
            key={currentSlide.id}
            src={currentSlide.image}
            alt={currentSlide.alt}
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out animate-fadeIn"
          />

          {/* Ambient Lighting Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Previous / Next Arrow Controls */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white backdrop-blur-xs flex items-center justify-center z-20 cursor-pointer transition-all duration-200 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 shadow-md active:scale-95"
            title="Previous challenge"
            aria-label="Previous challenge"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white backdrop-blur-xs flex items-center justify-center z-20 cursor-pointer transition-all duration-200 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 shadow-md active:scale-95"
            title="Next challenge"
            aria-label="Next challenge"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Banner Overlay Content */}
          <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 flex items-end justify-between gap-3 pointer-events-none">
            <div className="space-y-1 max-w-xl pl-1 sm:pl-8">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs border border-amber-400/30">
                  {currentSlide.badge}
                </span>
                <span className="text-xs font-mono text-white/80 hidden sm:inline">
                  {currentSlide.universe}
                </span>
              </div>
              <h3 className="text-base sm:text-2xl font-serif font-bold text-white tracking-tight drop-shadow-md">
                {currentSlide.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200 font-serif line-clamp-1 sm:line-clamp-2 drop-shadow-sm opacity-90 hidden xs:block">
                {currentSlide.description}
              </p>
            </div>

            {/* CTA Action Pill */}
            <div className="pointer-events-auto flex items-center gap-2 flex-shrink-0 pr-1 sm:pr-8">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openChallenge(currentSlide.challengeId);
                }}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Enter Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Playground Shortcut Bar */}
      {showPlaygroundLink && (
        <div className="flex justify-between items-center px-1 pt-0.5 text-xs font-mono">
          <span className="text-[11px] text-ink-faint hidden sm:inline">
            Click banner to inspect survival constraints & lore prompts
          </span>
          <button
            type="button"
            onClick={openPlay}
            className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors cursor-pointer ml-auto"
          >
            <span>Try writing sprints in Playground</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </section>
  );
};
