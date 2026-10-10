import React, { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  Feather,
  Sun,
  Moon,
  User,
  Search,
  X,
  Zap,
  BookOpen,
  ChevronDown,
  FileText,
  LogIn,
  LogOut,
} from 'lucide-react';

export const GlobalNavbar: React.FC = () => {
  const currentView = useWorkspaceStore((s) => s.currentView);
  const openDashboard = useWorkspaceStore((s) => s.openDashboard);
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);
  const openPlay = useWorkspaceStore((s) => s.openPlay);
  const openRanking = useWorkspaceStore((s) => s.openRanking);

  const novels = useWorkspaceStore((s) => s.novels);
  const scenes = useWorkspaceStore((s) => s.scenes);

  const theme = useWorkspaceStore((s) => s.theme);
  const toggleTheme = useWorkspaceStore((s) => s.toggleTheme);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);

  const penName = useWorkspaceStore((s) => s.penName);
  const setPenName = useWorkspaceStore((s) => s.setPenName);

  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);
  const logout = useWorkspaceStore((s) => s.logout);

  // Currency 1: Common - 1 word = 1 currency
  const currencyWords = novels.reduce((acc, n) => acc + (n.totalWordCount || 0), 0);

  // Currency 2: Per sentence written
  const sentenceMatches = scenes.reduce((acc, s) => {
    const text = s.plainText || '';
    const match = text.match(/[^.!?]+[.!?]+(\s|$)/g);
    return acc + (match ? match.length : 0);
  }, 0);
  const currencySentences = Math.max(sentenceMatches, Math.floor(currencyWords / 15));

  // Currency 3: Per chapter written
  const currencyChapters = novels.reduce((acc, n) => acc + (n.chapterCount || 1), 0);

  const librarySearchQuery = useWorkspaceStore((s) => s.librarySearchQuery);
  const setLibrarySearchQuery = useWorkspaceStore((s) => s.setLibrarySearchQuery);

  const [isWriteMenuOpen, setIsWriteMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [tempPenName, setTempPenName] = useState(penName);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const writeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempPenName(penName);
  }, [penName]);

  // Handle escape key to dismiss menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsWriteMenuOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (writeMenuRef.current && !writeMenuRef.current.contains(e.target as Node)) {
        setIsWriteMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSavePenName = () => {
    const finalPenName = tempPenName.trim() || 'Ernest Quill';
    setPenName(finalPenName);
    setIsProfileOpen(false);
  };

  return (
    <header className="border-b border-canvas-border bg-canvas/90 backdrop-blur-md sticky top-0 z-30 select-none">
      {/* Side margin container: aligned with landing & library pages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Website Name + Beside it: (desktop only) DASHBOARD, PLAY, RANKING, LIBRARY */}
        <div className="flex items-center gap-3 sm:gap-6 md:gap-8 flex-shrink-0">
          {/* Website Name (Very Left) */}
          <button
            type="button"
            onClick={openDashboard}
            className="flex items-center gap-2 sm:gap-2.5 hover:opacity-85 transition-opacity group"
            title="Go to Alterjot Dashboard"
          >
            <div className="w-7 h-7 sm:w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-brand-600/30 group-hover:scale-105 transition-transform">
              <Feather className="w-3.5 h-3.5 sm:w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-lg sm:text-xl text-ink tracking-tight">
              Alterjot
            </span>
          </button>

          {/* Beside Website Name: DASHBOARD, PLAY, RANKING, LIBRARY (Desktop and Tablet) */}
          <nav className="hidden md:flex items-center gap-2 sm:gap-4 pl-3 sm:pl-5 border-l border-canvas-border text-xs font-mono font-medium">
            <button
              type="button"
              onClick={openDashboard}
              className={`py-1.5 px-2 uppercase tracking-wider relative transition-colors ${
                currentView === 'dashboard' || currentView === 'landing'
                  ? 'text-ink font-bold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              DASHBOARD
              {(currentView === 'dashboard' || currentView === 'landing') && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-brand-500/70 dark:bg-brand-400/80 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={openPlay}
              className={`py-1.5 px-2 uppercase tracking-wider relative transition-colors ${
                currentView === 'play'
                  ? 'text-ink font-bold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              PLAY
              {currentView === 'play' && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-brand-500/70 dark:bg-brand-400/80 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={openRanking}
              className={`py-1.5 px-2 uppercase tracking-wider relative transition-colors ${
                currentView === 'ranking'
                  ? 'text-ink font-bold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              RANKING
              {currentView === 'ranking' && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-brand-500/70 dark:bg-brand-400/80 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={openLibrary}
              className={`py-1.5 px-2 uppercase tracking-wider relative transition-colors ${
                currentView === 'library'
                  ? 'text-ink font-bold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              LIBRARY
              {currentView === 'library' && (
                <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-brand-500/70 dark:bg-brand-400/80 rounded-full" />
              )}
            </button>
          </nav>
        </div>

        {/* Center: Search Bar in Navbar when Library is Active (Desktop/Tablet) */}
        {currentView === 'library' ? (
          <div className="hidden sm:block flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4 transition-all duration-200">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-ink-muted absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={librarySearchQuery}
                onChange={(e) => setLibrarySearchQuery(e.target.value)}
                placeholder="Search manuscripts by title, genre..."
                className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-canvas-card border border-canvas-border text-xs font-sans text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-xs transition-all"
              />
              {librarySearchQuery && (
                <button
                  type="button"
                  onClick={() => setLibrarySearchQuery('')}
                  className="absolute right-2.5 p-0.5 text-ink-muted hover:text-ink rounded-md hover:bg-canvas-hover transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right Side: Theme Toggle + Profile Icon Only + Write Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
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

          {/* Profile Icon Only */}
          {/* Profile Icon Only */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  setIsAuthModalOpen(true, 'signin');
                } else {
                  setIsProfileOpen((prev) => !prev);
                }
              }}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all shadow-xs group focus:outline-none focus:ring-2 focus:ring-brand-500/30 active:scale-95 ${
                isProfileOpen
                  ? 'bg-canvas-card border-brand-500 ring-2 ring-brand-500/20'
                  : 'bg-canvas-card border-canvas-border hover:border-brand-500/60 hover:bg-canvas-hover'
              }`}
              title={isAuthenticated ? `Pen Name: ${penName} (Click to manage)` : 'Sign In to Author Account'}
              aria-label="Author Profile"
            >
              <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-600/30 dark:text-brand-300 flex items-center justify-center font-serif text-xs font-bold shadow-xs">
                <User className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Profile Dropdown Popover */}
            {isProfileOpen && isAuthenticated && (
              <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] p-3.5 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment-lg z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-600/30 dark:text-brand-300 flex items-center justify-center font-serif text-xs font-bold shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-serif font-semibold text-ink truncate">{penName}</div>
                    <div className="text-[10px] font-mono text-ink-muted">Author Pen Name</div>
                  </div>
                </div>

                {/* 3 Author Currencies Vault */}
                <div className="p-2.5 rounded-xl bg-canvas-surface border border-canvas-border space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold">
                    <span>Atelier Vault</span>
                    <span className="text-brand-600 font-bold">Currencies</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                    {/* Currency 1: Common (1 per word) */}
                    <div className="p-2 rounded-lg bg-canvas-card border border-canvas-border flex flex-col items-center justify-center shadow-xs" title="Common Currency: 1 per word written">
                      <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
                        <Feather className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-mono font-bold text-ink truncate w-full">
                        {currencyWords.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-mono text-ink-muted uppercase tracking-tight mt-0.5">
                        Words
                      </span>
                    </div>

                    {/* Currency 2: Per sentence */}
                    <div className="p-2 rounded-lg bg-canvas-card border border-canvas-border flex flex-col items-center justify-center shadow-xs" title="Sentence Currency: 1 per sentence written">
                      <div className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
                        <FileText className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-mono font-bold text-ink truncate w-full">
                        {currencySentences.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-mono text-ink-muted uppercase tracking-tight mt-0.5">
                        Sentences
                      </span>
                    </div>

                    {/* Currency 3: Per chapter written */}
                    <div className="p-2 rounded-lg bg-canvas-card border border-canvas-border flex flex-col items-center justify-center shadow-xs" title="Chapter Currency: 1 per chapter written">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
                        <BookOpen className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-mono font-bold text-ink truncate w-full">
                        {currencyChapters.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-mono text-ink-muted uppercase tracking-tight mt-0.5">
                        Chapters
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-canvas-border space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold">
                    Change Pen Name
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempPenName}
                      onChange={(e) => setTempPenName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSavePenName();
                        if (e.key === 'Escape') setIsProfileOpen(false);
                      }}
                      className="flex-1 px-2.5 py-1 text-xs font-serif rounded-lg bg-canvas-surface border border-canvas-border focus:border-brand-500 focus:outline-none text-ink"
                      placeholder="Enter pen name"
                    />
                    <button
                      type="button"
                      onClick={handleSavePenName}
                      className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-mono font-medium transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Sign Out Button */}
                <div className="pt-2.5 mt-2.5 border-t border-canvas-border flex items-center justify-between">
                  <span className="text-[10px] font-mono text-ink-faint">Logged in as Scribe</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-1.5 text-xs font-mono text-rose-600 dark:text-rose-400 hover:text-rose-700 py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* If NOT signed in: Sign In Button; If signed in: Write Button with dropdown */}
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true, 'signin')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs transition-all shadow-sm shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="Sign in to your author account"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="relative" ref={writeMenuRef}>
              <button
                type="button"
                onClick={() => setIsWriteMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs transition-all shadow-sm shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98]"
                title="Drafting Options (Quick Write or Open Library)"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Write</span>
                <ChevronDown className={`w-3 h-3 opacity-80 transition-transform duration-200 ${isWriteMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Refined Anchored Dropdown Menu */}
              {isWriteMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-24px)] p-2 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment-lg z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold border-b border-canvas-border/70 mb-1">
                    Drafting Options
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      setIsWriteMenuOpen(false);
                      await startWritingImmediately();
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-canvas-hover border border-transparent hover:border-canvas-border transition-all group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-bold text-xs text-ink group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                        Quick Write
                      </div>
                      <div className="text-[11px] text-ink-muted leading-tight mt-0.5 font-sans">
                        Start typing on blank canvas immediately
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsWriteMenuOpen(false);
                      openLibrary();
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-canvas-hover border border-transparent hover:border-canvas-border transition-all group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-bold text-xs text-ink group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                        Open Library
                      </div>
                      <div className="text-[11px] text-ink-muted leading-tight mt-0.5 font-sans">
                        Browse your manuscript shelf
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
