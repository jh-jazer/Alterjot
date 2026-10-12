import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { NARRATIVE_THEMES } from '../../data/narrativeThemes';
import type { NarrativeTheme } from '../../types';
import {
  Radio,
  Sparkles,
  Flame,
  Cog,
  Ghost,
  Cpu,
  Target,
  Compass,
  ArrowRight,
  Check,
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const isOnboardingModalOpen = useWorkspaceStore((s) => s.isOnboardingModalOpen);
  const penName = useWorkspaceStore((s) => s.penName);
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding);

  const [authorName, setAuthorName] = useState(penName || 'Ernest Quill');
  const [selectedTheme, setSelectedTheme] = useState<NarrativeTheme>('apocalyptic');
  const [writingGoal, setWritingGoal] = useState('Epic Survival Novel (50,000+ words)');
  const [ambiance, setAmbiance] = useState('Dust & Whispering Wind');

  if (!isOnboardingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      penName: authorName.trim() || 'Ernest Quill',
      preferredTheme: selectedTheme,
      writingGoal,
      ambiance,
    });
  };

  const themeIcons: Record<NarrativeTheme, React.ReactNode> = {
    apocalyptic: <Flame className="w-5 h-5 text-amber-500" />,
    steampunk: <Cog className="w-5 h-5 text-[#c2593f]" />,
    'dark-fantasy': <Ghost className="w-5 h-5 text-purple-400" />,
    cyberpunk: <Cpu className="w-5 h-5 text-sky-400" />,
  };

  const goalOptions = [
    { label: 'Epic Survival Novel (50k+ words)', desc: 'Multi-chapter collapse chronicle' },
    { label: 'Black Box Novella (15k–30k words)', desc: 'Focused survival arcs & incident logs' },
    { label: 'Daily Scavenger Sprints (500w/day)', desc: 'Consistent wasteland writing cadence' },
    { label: 'Survival Codex & Worldbuilding', desc: 'Factions, hazards, outposts, and gear' },
  ];

  const ambianceOptions = [
    { label: 'Dust & Whispering Wind', desc: 'Desolate, evocative wasteland aura' },
    { label: 'Bunker Terminal Silence', desc: 'Distraction-free high contrast focus' },
    { label: 'Typewriter Ribbon & Static', desc: 'Mechanical retro-survivalist cadence' },
  ];

  const currentThemeData = NARRATIVE_THEMES[selectedTheme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-3xl my-6 rounded-xl bg-canvas-card border border-canvas-border shadow-parchment-lg p-5 sm:p-8 text-ink max-h-[92vh] overflow-y-auto">
        {/* Header Banner */}
        <div className="flex items-center gap-3 pb-5 border-b border-canvas-border">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-600/30 flex-shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-600/25 dark:text-brand-300 font-bold">
                Survivor Intake
              </span>
              <span className="text-xs font-mono text-ink-muted hidden sm:inline">• Calibration Protocol</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink mt-0.5">
              Welcome to Alterjot
            </h2>
            <p className="text-xs text-ink-muted font-sans mt-0.5">
              The distraction-free manuscript studio for novelists, worldbuilders, and storytellers.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Question 1: Pen Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-faint font-semibold">
              1. What pen name will appear on your title pages?
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Ernest Quill, Octavia Butler"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-canvas-surface border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 shadow-xs font-serif"
            />
          </div>

          {/* Question 2: THE THEME PREFERENCE (Crucial Part) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-faint font-semibold">
                2. Which narrative universe theme inspires your writing?
              </label>
              <span className="text-[11px] font-mono text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Customizes World Challenge & Triad
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(NARRATIVE_THEMES) as NarrativeTheme[]).map((themeKey) => {
                const item = NARRATIVE_THEMES[themeKey];
                const isSelected = selectedTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => setSelectedTheme(themeKey)}
                    className={`p-3.5 rounded-lg border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-600/15 ring-2 ring-brand-500/30 shadow-sm'
                        : 'border-canvas-border bg-canvas-surface hover:border-brand-400/50 hover:bg-canvas-hover'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="p-1.5 rounded-md bg-canvas-card border border-canvas-border">
                          {themeIcons[themeKey]}
                        </div>
                        <div className="min-w-0 pr-5">
                          <h4 className="font-serif font-bold text-sm text-ink truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-mono uppercase tracking-tight text-brand-700 dark:text-brand-400 block font-semibold truncate">
                            {item.badge}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2 mt-1">
                        {item.tagline}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-canvas-border/50 text-[10px] font-mono text-ink-faint">
                      World: <span className="text-ink font-semibold">{item.weeklyWorld.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Preview of chosen theme */}
            <div className="p-3 rounded-lg bg-canvas-surface border border-canvas-border flex items-start gap-3">
              <Compass className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-ink font-serif">Selected Universe Motif: </span>
                <span className="text-ink-muted">
                  Your desk will feature <strong className="text-brand-700 dark:text-brand-300 font-bold">{currentThemeData.weeklyWorld.title}</strong> as your World Challenge, accompanied by character, place, and world cards matching the <strong className="text-ink">{currentThemeData.name}</strong> lore.
                </span>
              </div>
            </div>
          </div>

          {/* Question 3: Writing Goal */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-faint font-semibold flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-brand-600" />
              <span>3. Primary Writing Ambition</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goalOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setWritingGoal(opt.label)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                    writingGoal === opt.label
                      ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-600/15 font-semibold text-brand-900 dark:text-brand-200'
                      : 'border-canvas-border bg-canvas-surface text-ink-muted hover:border-canvas-border hover:bg-canvas-hover'
                  }`}
                >
                  <div className="font-serif font-bold text-ink">{opt.label}</div>
                  <div className="text-[10px] text-ink-faint mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Atmospheric Soundscape & Pace */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-faint font-semibold">
              4. Preferred Drafting Ambiance
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ambianceOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setAmbiance(opt.label)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                    ambiance === opt.label
                      ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-600/15 font-semibold text-brand-900 dark:text-brand-200'
                      : 'border-canvas-border bg-canvas-surface text-ink-muted hover:border-canvas-border hover:bg-canvas-hover'
                  }`}
                >
                  <div className="font-serif font-bold text-ink">{opt.label}</div>
                  <div className="text-[10px] text-ink-faint mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-canvas-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] font-mono text-ink-muted">
              You can switch your narrative theme anytime from your profile desk.
            </p>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-sm shadow-md shadow-brand-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Enter Atelier in {currentThemeData.name.split('&')[0].trim()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
