import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  Feather,
  Sun,
  Moon,
  Edit3,
  User,
  Check,
} from 'lucide-react';

export const GlobalNavbar: React.FC = () => {
  const currentView = useWorkspaceStore((s) => s.currentView);
  const openLanding = useWorkspaceStore((s) => s.openLanding);
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);
  const openPlay = useWorkspaceStore((s) => s.openPlay);
  const openRanking = useWorkspaceStore((s) => s.openRanking);
  const openStudio = useWorkspaceStore((s) => s.openStudio);

  const activeNovel = useWorkspaceStore((s) => s.novels.find((n) => n._id === s.activeNovelId));
  const theme = useWorkspaceStore((s) => s.theme);
  const toggleTheme = useWorkspaceStore((s) => s.toggleTheme);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);

  const penName = useWorkspaceStore((s) => s.penName);
  const setPenName = useWorkspaceStore((s) => s.setPenName);

  const [isEditingPenName, setIsEditingPenName] = useState(false);
  const [tempPenName, setTempPenName] = useState(penName);

  const handleStartEditPenName = () => {
    setTempPenName(penName);
    setIsEditingPenName(true);
  };

  const handleSavePenName = () => {
    const finalPenName = tempPenName.trim() || 'Ernest Quill';
    setPenName(finalPenName);
    setIsEditingPenName(false);
  };

  const handleWriteClick = async () => {
    if (activeNovel) {
      await openStudio(activeNovel._id);
    } else {
      await startWritingImmediately();
    }
  };

  return (
    <header className="border-b border-canvas-border bg-canvas/90 backdrop-blur-md sticky top-0 z-30 select-none">
      {/* Side margin container: aligned with landing & library pages */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Left Side: Website Name + Beside it: PLAY, RANKING, LIBRARY */}
        <div className="flex items-center gap-5 sm:gap-7 md:gap-9">
          {/* Website Name (Very Left) */}
          <button
            type="button"
            onClick={openLanding}
            className="flex items-center gap-2.5 hover:opacity-85 transition-opacity group"
            title="Go to Alterjot Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-brand-600/30 group-hover:scale-105 transition-transform">
              <Feather className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-xl text-ink tracking-tight">
              Alterjot
            </span>
          </button>

          {/* Beside Website Name: PLAY, RANKING, LIBRARY */}
          <nav className="flex items-center gap-1.5 sm:gap-2.5 pl-3 sm:pl-5 border-l border-canvas-border text-xs font-mono font-bold">
            <button
              type="button"
              onClick={openPlay}
              className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                currentView === 'play'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-600/20 dark:text-amber-200 dark:border-amber-500/30 shadow-xs'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas-hover'
              }`}
            >
              PLAY
            </button>

            <button
              type="button"
              onClick={openRanking}
              className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                currentView === 'ranking'
                  ? 'bg-[#e1e9f8] text-[#2e4785] border border-[#a8bee7] dark:bg-indigo-600/20 dark:text-indigo-200 dark:border-indigo-500/30 shadow-xs'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas-hover'
              }`}
            >
              RANKING
            </button>

            <button
              type="button"
              onClick={openLibrary}
              className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                currentView === 'library'
                  ? 'bg-brand-50 text-brand-800 border border-brand-200 dark:bg-brand-600/20 dark:text-brand-200 dark:border-brand-500/30 shadow-xs'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas-hover'
              }`}
            >
              LIBRARY
            </button>
          </nav>
        </div>

        {/* Right Side: Theme Toggle + Profile & Pen Name + Write Button */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Theme Toggle (Retro Light / Nocturne Dark with smooth spreading circle) */}
          <button
            type="button"
            id="theme-toggle-btn"
            onClick={(e) => toggleTheme(e)}
            className="p-2 rounded-xl border border-canvas-border bg-canvas-card hover:bg-canvas-hover text-ink-muted hover:text-ink shadow-xs relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-transform active:scale-95"
            title={theme === 'light' ? 'Switch to Nocturne Dark Mode' : 'Switch to Retro Light Mode'}
            aria-label={theme === 'light' ? 'Switch to Nocturne Dark Mode' : 'Switch to Retro Light Mode'}
          >
            <div className="w-4 h-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              {theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-600 transition-transform duration-500 transform rotate-0 group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-brand-300 transition-transform duration-500 transform -rotate-12 group-hover:rotate-0" />
              )}
            </div>
          </button>

          {/* Profile Icon and Pen Name */}
          <div className="relative">
            {isEditingPenName ? (
              <div className="flex items-center gap-1 bg-canvas-card border border-brand-500 rounded-xl px-2 py-1 shadow-xs">
                <input
                  type="text"
                  autoFocus
                  value={tempPenName}
                  onChange={(e) => setTempPenName(e.target.value)}
                  onBlur={handleSavePenName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSavePenName();
                    if (e.key === 'Escape') setIsEditingPenName(false);
                  }}
                  className="w-24 text-xs font-serif font-medium text-ink bg-transparent outline-none"
                  placeholder="Pen Name"
                />
                <button
                  type="button"
                  onClick={handleSavePenName}
                  className="p-0.5 text-emerald-600 hover:text-emerald-700"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartEditPenName}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-ink shadow-xs transition-colors group/profile"
                title="Click to edit Pen Name"
              >
                <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-600/30 dark:text-brand-300 flex items-center justify-center font-serif text-xs font-bold shadow-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-serif font-medium max-w-[90px] sm:max-w-[130px] truncate text-ink group-hover/profile:text-brand-700">
                  {penName}
                </span>
                <Edit3 className="w-2.5 h-2.5 text-ink-faint opacity-30 group-hover/profile:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          {/* Write Button (Primary CTA) */}
          <button
            type="button"
            onClick={handleWriteClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs transition-all shadow-sm shadow-brand-600/30 hover:scale-[1.03] active:scale-[0.97]"
            title="Start writing immediately without title setup"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
        </div>
      </div>
    </header>
  );
};
