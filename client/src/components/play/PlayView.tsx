import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Dice5,
  Feather,
  Dices,
  ArrowRight,
} from 'lucide-react';

export const PlayView: React.FC = () => {
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);
  const openStudio = useWorkspaceStore((s) => s.openStudio);
  const activeScene = useWorkspaceStore((s) => s.activeScene);

  // --- SPRINT TIMER STATE ---
  const [sprintMinutes, setSprintMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sprintCompleted, setSprintCompleted] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setSprintCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSetDuration = (mins: number) => {
    setIsRunning(false);
    setSprintMinutes(mins);
    setTimeLeft(mins * 60);
    setSprintCompleted(false);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sprintMinutes * 60);
    setSprintCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- STORY SPARK SLOTS ---
  const genres = ['Speculative Noir', 'Gothic Romance', 'Historical Mythos', 'Cyberpunk Outlaw', 'Cosmic Horror', 'Solarpunk'];
  const protagonists = ['A disgraced watchmaker', 'A court herald with a counterfeit seal', 'An archivist who dreams in dead languages', 'A runaway lighthouse keeper', 'A botanical apothecary'];
  const catalysts = ['receives an unsent letter from their future self', 'discovers that midnight lasted an extra two hours', 'finds a map drawn on human vellum', 'is hired by a patron who does not cast a reflection', 'witnesses the city bells chime in reverse'];
  const twists = ['the antagonist is actually protecting them', 'the artifact will only work if willingly surrendered', 'every word spoken aloud leaves a temporary physical scar', 'the mentor lied about the prophecy'];

  const [currentGenre, setCurrentGenre] = useState(genres[0]);
  const [currentProtagonist, setCurrentProtagonist] = useState(protagonists[0]);
  const [currentCatalyst, setCurrentCatalyst] = useState(catalysts[0]);
  const [currentTwist, setCurrentTwist] = useState(twists[0]);

  const rollStoryWheel = () => {
    setCurrentGenre(genres[Math.floor(Math.random() * genres.length)]);
    setCurrentProtagonist(protagonists[Math.floor(Math.random() * protagonists.length)]);
    setCurrentCatalyst(catalysts[Math.floor(Math.random() * catalysts.length)]);
    setCurrentTwist(twists[Math.floor(Math.random() * twists.length)]);
  };

  // --- WORD ROULETTE ---
  const wordBank = ['amber', 'parchment', 'solitude', 'obsidian', 'labyrinth', 'whisper', 'chronometer', 'mirror', 'fog', 'resonance', 'feather', 'silence', 'crescent', 'chimera', 'vellum', 'horizon'];
  const [rouletteWords, setRouletteWords] = useState(['obsidian', 'chronometer', 'solitude']);

  const spinWordRoulette = () => {
    const shuffled = [...wordBank].sort(() => 0.5 - Math.random());
    setRouletteWords(shuffled.slice(0, 3));
  };

  const handleStartSprintInStudio = async () => {
    setIsRunning(true);
    if (activeScene) {
      await openStudio();
    } else {
      await startWritingImmediately();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none">
      {/* Clean centered container with generous white space on left and right */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 sm:py-10 space-y-10">
        
        {/* Play Banner Header (matching Dashboard cinematic dark card aesthetic) */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2c221a] via-[#211a14] to-[#16120e] text-white p-6 sm:p-7 shadow-xl border border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Ambient warm glow */}
          <div className="absolute right-0 top-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                Creative Writing Playground
              </span>
              <span className="text-xs font-mono text-neutral-400">
                • Overcome Blank Pages
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              The Play Arena
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-serif max-w-xl leading-relaxed">
              Spark rapid inspiration with timed Pomodoro sprints, randomized narrative catalysts, and word roulette challenges.
            </p>
          </div>

          <button
            type="button"
            onClick={startWritingImmediately}
            className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-mono font-semibold uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer relative z-10 flex-shrink-0 flex items-center gap-2"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Freeform Writing</span>
          </button>
        </div>

        {/* TWO-COLUMN PLAY MODULES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. WRITING SPRINT CHALLENGE (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-2">
              <Timer className="w-5 h-5 text-brand-600" />
              Writing Sprint
            </h2>

            <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-brand-700">
                    Pomodoro Interval
                  </span>
                  <span className="text-[11px] font-mono text-ink-faint">
                    {sprintMinutes} min challenge
                  </span>
                </div>

                {/* Big Digital Countdown */}
                <div className="text-center py-6 px-4 rounded-2xl bg-canvas-surface border border-canvas-border">
                  <span className="font-mono text-5xl font-bold tracking-tight text-ink">
                    {formatTime(timeLeft)}
                  </span>
                  <div className="mt-2 text-xs font-mono text-ink-muted">
                    {isRunning ? (
                      <span className="text-emerald-700 dark:text-emerald-400 animate-pulse font-semibold">
                        ⚡ SPRINT IN PROGRESS — WRITE!
                      </span>
                    ) : sprintCompleted ? (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold">
                        🎉 SPRINT COMPLETE! GREAT JOB!
                      </span>
                    ) : (
                      <span>Ready for a quick focus burst?</span>
                    )}
                  </div>
                </div>

                {/* Preset Selector */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs font-mono">
                  {[5, 15, 25].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSetDuration(m)}
                      className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        sprintMinutes === m
                          ? 'bg-brand-600 text-white border-brand-700 font-semibold'
                          : 'bg-canvas-card border-canvas-border text-ink-muted hover:text-ink'
                      }`}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer Controls */}
              <div className="space-y-2.5 pt-4 border-t border-canvas-border">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRunning(!isRunning)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-serif font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
                      isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-brand-600 hover:bg-brand-700'
                    }`}
                  >
                    {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isRunning ? 'Pause Timer' : 'Start Sprint'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetTimer}
                    className="p-2.5 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink-muted hover:text-ink transition-colors cursor-pointer"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleStartSprintInStudio}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink-muted hover:text-brand-700 text-xs font-mono transition-colors cursor-pointer"
                >
                  <span>Open Studio with Active Sprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. THE STORY SPARK GENERATOR (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-2">
                <Dices className="w-5 h-5 text-amber-600" />
                Story Spark Generator
              </h2>

              <button
                type="button"
                onClick={rollStoryWheel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/40 text-xs font-mono font-semibold hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <Dice5 className="w-3.5 h-3.5" />
                <span>Roll New Spark</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment flex flex-col justify-between space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Genre Slot */}
                <div className="p-3.5 rounded-xl bg-canvas-surface border border-canvas-border space-y-1">
                  <span className="text-[10px] font-mono text-ink-faint uppercase font-semibold">Genre</span>
                  <div className="font-serif font-bold text-sm text-brand-700">{currentGenre}</div>
                </div>

                {/* Protagonist Slot */}
                <div className="p-3.5 rounded-xl bg-canvas-surface border border-canvas-border space-y-1">
                  <span className="text-[10px] font-mono text-ink-faint uppercase font-semibold">Protagonist</span>
                  <div className="font-serif font-medium text-ink">{currentProtagonist}</div>
                </div>

                {/* Catalyst Slot */}
                <div className="p-3.5 rounded-xl bg-canvas-surface border border-canvas-border space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-mono text-ink-faint uppercase font-semibold">Inciting Catalyst</span>
                  <div className="font-serif font-medium text-ink leading-relaxed">{currentCatalyst}</div>
                </div>

                {/* Twist Slot */}
                <div className="p-3.5 rounded-xl bg-canvas-surface border border-canvas-border space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-mono text-ink-faint uppercase font-semibold">Wildcard Twist</span>
                  <div className="font-serif italic text-amber-800 dark:text-amber-300 leading-relaxed">
                    &ldquo;...and {currentTwist}&rdquo;
                  </div>
                </div>
              </div>

              {/* Word Roulette & Action */}
              <div className="pt-4 border-t border-canvas-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-ink-muted">Roulette:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {rouletteWords.map((w) => (
                      <span
                        key={w}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-canvas-surface border border-canvas-border text-ink font-semibold"
                      >
                        {w}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={spinWordRoulette}
                      className="p-1 text-ink-muted hover:text-brand-700 transition-colors cursor-pointer"
                      title="Spin new secret words"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startWritingImmediately}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif text-xs font-semibold shadow-md transition-all self-end sm:self-auto cursor-pointer hover:scale-105 active:scale-95"
                >
                  <span>Draft With This Prompt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
