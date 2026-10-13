import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  ChevronLeft,
  Edit3,
  Check,
  TrendingUp,
  FileDown,
  BookMarked,
  Sparkles,
  Maximize2,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

export const WorkstationNavbar: React.FC = () => {
  const navigate = useNavigate();
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);
  const panelState = useWorkspaceStore((s) => s.panelState);
  const toggleCodex = useWorkspaceStore((s) => s.toggleCodex);
  const toggleAiAssistant = useWorkspaceStore((s) => s.toggleAiAssistant);
  const toggleZenMode = useWorkspaceStore((s) => s.toggleZenMode);
  const setIsDashboardOpen = useWorkspaceStore((s) => s.setIsDashboardOpen);
  const setIsExportOpen = useWorkspaceStore((s) => s.setIsExportOpen);

  const activeNovel = useWorkspaceStore((s) => s.novels.find((n) => n._id === s.activeNovelId));
  const updateNovel = useWorkspaceStore((s) => s.updateNovel);

  const theme = useWorkspaceStore((s) => s.theme);
  const toggleTheme = useWorkspaceStore((s) => s.toggleTheme);
  const penName = useWorkspaceStore((s) => s.penName);
  const currentUser = useWorkspaceStore((s) => s.currentUser);
  const isProfileModalOpen = useWorkspaceStore((s) => s.isProfileModalOpen);
  const setIsProfileModalOpen = useWorkspaceStore((s) => s.setIsProfileModalOpen);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMobileMenuOpen]);

  const handleStartEditTitle = () => {
    if (!activeNovel) return;
    setTempTitle(activeNovel.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (!activeNovel) return;
    const newTitle = tempTitle.trim() || 'Untitled Manuscript';
    updateNovel(activeNovel._id, { title: newTitle });
    setIsEditingTitle(false);
  };

  // If Zen mode is activated, collapse the entire chrome for pure focus
  if (panelState.isZenMode) return null;

  return (
    <header className="w-full border-b border-canvas-border bg-canvas sticky top-0 z-30 select-none">
      <div className="w-full px-2 sm:px-4 lg:px-6 h-14 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Left Section: Library Exit & Manuscript Title */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
          {/* Exit / Return to Library */}
          <button
            type="button"
            onClick={() => {
              openLibrary();
              navigate('/library');
            }}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-hover text-xs font-mono font-medium transition-all group border border-transparent hover:border-canvas-border flex-shrink-0"
            title="Return to Manuscript Library"
            aria-label="Return to Manuscript Library"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Library</span>
          </button>

          <div className="h-4 w-px bg-canvas-border mx-0.5 sm:mx-1 flex-shrink-0" />

          {/* Manuscript Title Breadcrumbs */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            {isEditingTitle ? (
              <div className="flex items-center gap-1 w-full max-w-xs sm:max-w-md md:max-w-xl">
                <input
                  type="text"
                  autoFocus
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') setIsEditingTitle(false);
                  }}
                  className="px-2 py-0.5 rounded bg-canvas-card border border-brand-500 font-serif font-semibold text-ink text-xs sm:text-sm focus:outline-none shadow-xs w-full"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-1 text-emerald-600 hover:text-emerald-700 flex-shrink-0"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartEditTitle}
                className="font-serif font-semibold text-xs sm:text-sm text-ink hover:text-brand-700 truncate max-w-[180px] xs:max-w-[280px] sm:max-w-[420px] md:max-w-[560px] lg:max-w-[720px] flex items-center gap-1.5 group/title text-left transition-colors"
                title="Click to rename manuscript"
              >
                <span className="truncate">{activeNovel?.title || 'Untitled Manuscript'}</span>
                <Edit3 className="w-2.5 h-2.5 text-ink-faint opacity-40 group-hover/title:opacity-100 transition-opacity flex-shrink-0 hidden xs:inline" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Mobile Menu & Desktop Workstation Tools */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Mobile Only: Workstation Menu Button & Dropdown */}
          <div className="relative sm:hidden" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                isMobileMenuOpen
                  ? 'bg-canvas-hover border-brand-500 text-ink ring-2 ring-brand-500/20'
                  : 'border-canvas-border bg-canvas-card hover:bg-canvas-hover text-ink-muted hover:text-ink'
              }`}
              title="Open Workstation Menu & Settings"
              aria-label="Workstation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 text-ink" />
              ) : (
                <Menu className="w-4 h-4 text-ink" />
              )}
            </button>

            {/* Mobile Dropdown Menu Popover */}
            {isMobileMenuOpen && (
              <>
                {/* Backdrop overlay */}
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40"
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                <div className="absolute right-0 top-full mt-2 w-72 xs:w-80 bg-canvas-card border border-canvas-border rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* 1. Author Profile Card (Click to open Profile Dropdown) */}
                  <div className="p-1 mb-2 border-b border-canvas-border/70 pb-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-canvas-subtle/80 hover:bg-canvas-hover border border-canvas-border transition-all cursor-pointer group text-left"
                      title="Open Author Profile, Notifications & Settings"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-600/30 dark:text-brand-300 flex items-center justify-center font-serif text-xs font-bold shadow-xs overflow-hidden flex-shrink-0 border border-brand-500/20 group-hover:scale-105 transition-transform">
                          {currentUser?.avatarUrl ? (
                            <img src={currentUser.avatarUrl} alt={penName} className="w-full h-full object-cover" />
                          ) : (
                            penName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif font-bold text-xs text-ink truncate">{penName}</span>
                            <span className="px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-700 dark:text-brand-300 text-[9px] font-mono font-semibold">
                              Author
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-ink-muted truncate">
                            Open Profile & Preferences
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>

                  {/* 2. Workstation Settings & Tools List */}
                  <div className="px-2 py-1 text-[10px] font-mono font-semibold text-ink-muted uppercase tracking-wider flex items-center justify-between">
                    <span>Workstation Settings</span>
                    <SlidersHorizontal className="w-3 h-3 text-ink-faint" />
                  </div>

                  <div className="space-y-1">
                    {/* Project Metrics */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsDashboardOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-mono text-ink hover:bg-canvas-hover transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left min-w-0">
                          <span className="block font-medium truncate">Project Metrics</span>
                          <span className="text-[10px] text-ink-muted truncate">Word goals & sprint targets</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-ink-faint" />
                    </button>

                    {/* Export Manuscript */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsExportOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-mono text-ink hover:bg-canvas-hover transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                          <FileDown className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left min-w-0">
                          <span className="block font-medium truncate">Export Manuscript</span>
                          <span className="text-[10px] text-ink-muted truncate">PDF, DOCX, Plain TXT</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-ink-faint" />
                    </button>

                    {/* World Codex Lore */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        toggleCodex();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-mono text-ink hover:bg-canvas-hover transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                          <BookMarked className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left min-w-0">
                          <span className="block font-medium truncate">World Codex Lore</span>
                          <span className="text-[10px] text-ink-muted truncate">Characters, locations & rules</span>
                        </div>
                      </div>
                      {panelState.isCodexOpen ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-semibold">
                          Active
                        </span>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-ink-faint" />
                      )}
                    </button>

                    {/* AI Narrative Copilot */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        toggleAiAssistant();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-mono text-ink hover:bg-canvas-hover transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left min-w-0">
                          <span className="block font-medium truncate">AI Narrative Copilot</span>
                          <span className="text-[10px] text-ink-muted truncate">Line critique & rewrites</span>
                        </div>
                      </div>
                      {panelState.isAiAssistantOpen ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold">
                          Open
                        </span>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-ink-faint" />
                      )}
                    </button>

                    {/* Zen Focus Mode */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        toggleZenMode();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-mono text-ink hover:bg-canvas-hover transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-canvas-subtle text-ink-muted flex items-center justify-center flex-shrink-0">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left min-w-0">
                          <span className="block font-medium truncate">Zen Focus Mode</span>
                          <span className="text-[10px] text-ink-muted truncate">Distraction-free canvas</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-ink-faint" />
                    </button>

                    {/* Theme Mode Toggle */}
                    <div className="pt-1 border-t border-canvas-border/70 mt-1">
                      <button
                        type="button"
                        onClick={(e) => toggleTheme(e)}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-mono text-ink hover:bg-canvas-hover transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                            {theme === 'light' ? (
                              <Sun className="w-3.5 h-3.5" />
                            ) : (
                              <Moon className="w-3.5 h-3.5 text-brand-300" />
                            )}
                          </div>
                          <div className="text-left min-w-0">
                            <span className="block font-medium truncate">Theme Mode</span>
                            <span className="text-[10px] text-ink-muted truncate">
                              {theme === 'light' ? 'Retro Light Mode' : 'Nocturne Dark Mode'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-canvas-subtle text-ink-muted">
                          Switch
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Desktop Only: AI Narrative Copilot Button (replaces Menu Button on desktop) */}
          <button
            type="button"
            onClick={toggleAiAssistant}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer shadow-2xs ${
              panelState.isAiAssistantOpen
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 font-semibold'
                : 'border-canvas-border bg-canvas-card hover:bg-canvas-hover text-ink-muted hover:text-ink'
            }`}
            title="AI Narrative Copilot (Line Critique & Rewrite)"
            aria-label="AI Narrative Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>AI</span>
          </button>

          {/* DESKTOP ONLY: Dedicated Workstation Tools Group */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-canvas-card/50 p-0.5 sm:p-1 rounded-xl border border-canvas-border">
              {/* Project Metrics */}
              <button
                type="button"
                onClick={() => setIsDashboardOpen(true)}
                className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-hover text-xs font-mono transition-colors"
                title="Project Metrics & Word Goals"
                aria-label="Project Metrics"
              >
                <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
                <span className="hidden sm:inline">Metrics</span>
              </button>

              {/* Clean Export */}
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-hover text-xs font-mono transition-colors"
                title="Export Manuscript (PDF, DOCX, TXT)"
                aria-label="Export Manuscript"
              >
                <FileDown className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {/* World Codex Lore */}
              <button
                type="button"
                onClick={toggleCodex}
                className={`flex items-center gap-1 p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs font-mono transition-colors ${
                  panelState.isCodexOpen
                    ? 'bg-brand-100 text-brand-900 border border-brand-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-400/40'
                    : 'text-ink-muted hover:text-ink hover:bg-canvas-hover'
                }`}
                title="World Codex & Lore Reference (Ctrl+Shift+C)"
                aria-label="World Codex Lore"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Codex</span>
              </button>

              {/* Zen Focus Mode */}
              <button
                type="button"
                onClick={toggleZenMode}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors"
                title="Zen Focus Mode (Ctrl+\)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-4 w-px bg-canvas-border mx-0.5 sm:mx-1" />

            {/* Theme Toggle (Retro Light / Nocturne Dark) */}
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

            {/* Author Pen Name Badge (Clickable Profile Menu) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-canvas-card border text-ink text-xs font-serif shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/30 active:scale-95 ${
                  isProfileModalOpen
                    ? 'border-brand-500 ring-2 ring-brand-500/20'
                    : 'border-canvas-border hover:border-brand-500/60 hover:bg-canvas-hover'
                }`}
                title={`Pen Name: ${penName} (Click to manage Profile, Notifications, Settings)`}
                aria-label="Author Profile"
              >
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-600/30 dark:text-brand-300 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={penName} className="w-full h-full object-cover" />
                  ) : (
                    penName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="font-semibold hidden lg:inline max-w-[100px] truncate">{penName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
