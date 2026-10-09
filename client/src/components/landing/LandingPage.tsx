import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  Feather,
  BookOpen,
  Sparkles,
  Trophy,
  Compass,
  ArrowRight,
  Layers,
  Shuffle,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);
  const openPlay = useWorkspaceStore((s) => s.openPlay);
  const openRanking = useWorkspaceStore((s) => s.openRanking);
  const novels = useWorkspaceStore((s) => s.novels);
  const penName = useWorkspaceStore((s) => s.penName);

  const totalWords = novels.reduce((acc, n) => acc + (n.totalWordCount || 0), 0);

  // Creative prompt generator for the hero spark
  const promptSparks = [
    {
      genre: 'Speculative Noir',
      hook: 'A private detective in a rain-soaked metropolis discovers their own name in a classified death registry dated tomorrow.',
    },
    {
      genre: 'Historical Mythos',
      hook: 'An apprentice cartographer unearths a forgotten archipelago that shifts its borders with every full moon.',
    },
    {
      genre: 'Gothic Mystery',
      hook: 'The clocktower in a secluded mountain hamlet chimes a thirteenth hour, during which shadows move independently of their owners.',
    },
    {
      genre: 'Space Opera',
      hook: 'The last deep-space salvage vessel intercepts an ancient automated lighthouse broadcasting a voice speaking extinct Earth poetry.',
    },
  ];

  const [sparkIndex, setSparkIndex] = useState(0);

  const nextSpark = () => {
    setSparkIndex((prev) => (prev + 1) % promptSparks.length);
  };

  const currentSpark = promptSparks[sparkIndex];

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none">
      {/* Content wrapper with side margins */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 md:py-16 space-y-16">
        {/* HERO SECTION */}
        <section className="relative rounded-3xl bg-canvas-card border border-canvas-border shadow-parchment-lg p-8 sm:p-12 lg:p-16 overflow-hidden">
          {/* Subtle background ambient gradients */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-6 relative z-10">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 dark:bg-brand-600/20 dark:border-brand-500/30 dark:text-brand-300 text-xs font-mono font-medium shadow-xs">
              <Feather className="w-3.5 h-3.5 text-brand-600" />
              <span>THE NOVELIST'S DISTRACTION-FREE ATELIER</span>
            </div>

            {/* Main Catchy Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-ink tracking-tight leading-[1.15]">
              Write Freely. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-amber-700 to-brand-600 dark:from-brand-400 dark:via-amber-400 dark:to-brand-300">
                Name Later.
              </span>{' '}
              Craft Your Magnum Opus.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-ink-muted font-sans leading-relaxed max-w-2xl">
              Alterjot gives authors total flexibility to jump straight into prose without being forced to choose a title first. Experience seamless chapters, deep codex lore, and gamified writing sprints in a warm, retro sanctuary.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={startWritingImmediately}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-base transition-all shadow-md shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Feather className="w-5 h-5" />
                <span>Start Writing Immediately</span>
              </button>

              <button
                type="button"
                onClick={openLibrary}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink font-serif text-sm transition-all shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-brand-700" />
                <span>Open Manuscript Library</span>
              </button>

              <button
                type="button"
                onClick={openPlay}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-ink-muted hover:text-ink font-mono text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Play Sprints</span>
              </button>
            </div>

            {/* Zero Friction Assurances */}
            <div className="flex flex-wrap items-center gap-5 pt-3 text-xs font-mono text-ink-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero mandatory titles</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant local auto-save</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Retro light & nocturne modes</span>
              </span>
            </div>
          </div>
        </section>

        {/* AUTHOR QUICK STATUS & PROMPT SPARK WIDGET */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Author Pen Name & Output Stats */}
          <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold">
                  Author Dossier
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-50 text-brand-800 border border-brand-200">
                  Active
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-ink">
                Pen Name: {penName}
              </h3>
              <p className="text-xs text-ink-muted mt-1 font-sans">
                Ready to weave another chapter today?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-canvas-border">
              <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border/80">
                <span className="block text-[10px] font-mono text-ink-faint uppercase font-semibold">Manuscripts</span>
                <span className="text-xl font-serif font-bold text-ink">{novels.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border/80">
                <span className="block text-[10px] font-mono text-ink-faint uppercase font-semibold">Total Output</span>
                <span className="text-xl font-serif font-bold text-ink">
                  {totalWords.toLocaleString()} <span className="text-xs font-mono font-normal text-ink-muted">w</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={openRanking}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-xs font-mono text-ink-muted hover:text-ink transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Check Atelier Ranking & Badges</span>
            </button>
          </div>

          {/* Interactive Spark Generator (2 columns on large screens) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-700">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Daily Story Spark • {currentSpark.genre}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={nextSpark}
                  className="flex items-center gap-1 text-xs font-mono text-ink-muted hover:text-brand-700 transition-colors"
                  title="Roll another prompt"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Shuffle</span>
                </button>
              </div>

              <blockquote className="text-lg md:text-xl font-serif italic text-ink border-l-2 border-brand-500 pl-4 py-1 leading-relaxed">
                "{currentSpark.hook}"
              </blockquote>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-canvas-border">
              <span className="text-xs font-mono text-ink-muted">
                Need a spark to break the ice? Take this prompt directly into the studio.
              </span>
              <button
                type="button"
                onClick={startWritingImmediately}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif text-xs font-semibold shadow-xs transition-all active:scale-95"
              >
                <span>Draft This Scene</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* FOUR ATELIER PILLARS */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-700 font-semibold">
              Crafted for Storytellers
            </span>
            <h2 className="text-3xl font-serif font-bold text-ink">
              The Four Pillars of Alterjot
            </h2>
            <p className="text-sm text-ink-muted font-sans">
              Everything you need to outline, draft, organize, and finish your novel without bloated friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center shadow-xs dark:bg-brand-600/20 dark:border-brand-500/30">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink">Frictionless Prose</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Start writing immediately without a title. Clean typography, customizable line spacing, and a pure parchment canvas.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shadow-xs dark:bg-amber-600/20 dark:border-amber-500/30">
                <Compass className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink">World Codex Lore</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Keep track of characters, timeline dates, factions, and immediate scene objectives without leaving your prose canvas.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#e1e9f8] text-[#2e4785] border border-[#a8bee7] flex items-center justify-center shadow-xs dark:bg-indigo-600/20 dark:border-indigo-500/30">
                <Layers className="w-5 h-5 text-[#2e4785] dark:text-indigo-400" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink">Manuscript Tree</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Fluid hierarchy of chapters and scenes. Drag or shift scenes, view per-scene word metrics, and rename anything on the fly.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#dff0e4] text-[#245b32] border border-[#a0cea9] flex items-center justify-center shadow-xs dark:bg-emerald-600/20 dark:border-emerald-500/30">
                <Sparkles className="w-5 h-5 text-[#245b32] dark:text-emerald-400" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink">Play & Rankings</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Timed writing sprints, surprise word roulette, and atelier rankings to maintain your drafting momentum day after day.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-700 to-amber-700 text-white shadow-xl text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            The Page Is Waiting. No Questions Asked.
          </h2>
          <p className="text-white/80 max-w-xl mx-auto font-sans text-sm sm:text-base leading-relaxed">
            Don't let title block stop your momentum. Jump into the studio right now and put down your opening words.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={startWritingImmediately}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-brand-900 font-serif font-bold text-base shadow-md hover:bg-amber-50 transition-all hover:scale-105 active:scale-95"
            >
              <Feather className="w-5 h-5 text-brand-700" />
              <span>Start Writing Immediately</span>
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-8 border-t border-canvas-border flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-ink-muted gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-ink">Alterjot Atelier</span>
            <span>•</span>
            <span>Version 2.4</span>
            <span>•</span>
            <span>Retro Light Edition</span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={openLibrary} className="hover:text-ink transition-colors">
              Library Shelf
            </button>
            <button type="button" onClick={openPlay} className="hover:text-ink transition-colors">
              Play Sprints
            </button>
            <button type="button" onClick={openRanking} className="hover:text-ink transition-colors">
              Rankings
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
