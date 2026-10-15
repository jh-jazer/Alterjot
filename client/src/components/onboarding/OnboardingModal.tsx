import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { NarrativeTheme } from '../../types';
import { AlterjotLogo } from '../common/AlterjotLogo';
import {
  X,
  User,
  Flame,
  Cog,
  Ghost,
  Cpu,
  Target,
  ChevronDown,
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const isOnboardingModalOpen = useWorkspaceStore((s) => s.isOnboardingModalOpen);
  const penName = useWorkspaceStore((s) => s.penName);
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding);

  const [authorName, setAuthorName] = useState(penName || '');
  const [selectedTheme, setSelectedTheme] = useState<NarrativeTheme>('apocalyptic');
  const [writingGoal, setWritingGoal] = useState('Epic Survival Novel (50,000+ words)');

  if (!isOnboardingModalOpen) return null;

  const handleClose = () => {
    completeOnboarding({
      penName: authorName.trim() || penName || 'Author',
      preferredTheme: selectedTheme,
      writingGoal,
      ambiance: 'Dust & Whispering Wind',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      penName: authorName.trim() || 'Author',
      preferredTheme: selectedTheme,
      writingGoal,
      ambiance: 'Dust & Whispering Wind',
    });
  };

  const themes: Array<{ key: NarrativeTheme; name: string; icon: React.ReactNode }> = [
    { key: 'apocalyptic', name: 'Post-Apocalypse', icon: <Flame className="w-4 h-4 text-amber-500" /> },
    { key: 'steampunk', name: 'Steampunk', icon: <Cog className="w-4 h-4 text-[#c2593f]" /> },
    { key: 'dark-fantasy', name: 'Dark Fantasy', icon: <Ghost className="w-4 h-4 text-purple-400" /> },
    { key: 'cyberpunk', name: 'Cyberpunk', icon: <Cpu className="w-4 h-4 text-sky-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-[420px] rounded-xl bg-white dark:bg-[#181615] border border-neutral-100 dark:border-neutral-800 shadow-2xl p-7 sm:p-9 text-neutral-900 dark:text-neutral-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Skip"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Centered Logo Container */}
        <div className="flex justify-center mb-5">
          <AlterjotLogo size="lg" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white text-center">
          Welcome to Alterjot Studio
        </h2>

        {/* Subtitle Description */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2 mb-6 max-w-[300px] mx-auto leading-relaxed">
          Personalize your author workshop and choose your primary genre.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pen Name Field */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Pen Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Pen Name"
                className="w-full h-12 pl-11 pr-4 rounded-lg bg-[#f4f6fa] dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-sm font-sans placeholder:text-neutral-400 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400/20 transition-all"
              />
            </div>
          </div>

          {/* Narrative Theme Selection (2x2 Compact Grid) */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Narrative Universe
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => {
                const isSelected = selectedTheme === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setSelectedTheme(t.key)}
                    className={`h-11 px-3 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 dark:border-white bg-[#18181b] text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                        : 'border-neutral-200/80 dark:border-neutral-700/80 bg-[#f4f6fa] dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    <span className="flex-shrink-0">
                      {t.icon}
                    </span>
                    <span className="truncate">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Writing Ambition Dropdown */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Writing Ambition
            </label>
            <div className="relative">
              <Target className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={writingGoal}
                onChange={(e) => setWritingGoal(e.target.value)}
                className="w-full h-12 pl-11 pr-9 rounded-lg bg-[#f4f6fa] dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-sm font-sans text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400/20 transition-all appearance-none cursor-pointer"
              >
                <option value="Epic Survival Novel (50,000+ words)">Novel (50,000+ words)</option>
                <option value="Black Box Novella (15k–30k words)">Novella (15,000–30,000 words)</option>
                <option value="Daily Scavenger Sprints (500w/day)">Daily Cadence (500 words/day)</option>
                <option value="Survival Codex & Worldbuilding">Worldbuilding & Lore</option>
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Primary Action Button: "Get Started" */}
          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-[#18181b] hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-semibold text-sm transition-all shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center mt-3"
          >
            <span>Enter Studio</span>
          </button>
        </form>
      </div>
    </div>
  );
};
