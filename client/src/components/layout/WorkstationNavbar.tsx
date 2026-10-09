import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  PanelLeft,
  ChevronLeft,
  BookOpen,
  Edit3,
  Check,
  TrendingUp,
  FileDown,
  BookMarked,
  Maximize2,
  Sun,
  Moon,
  User,
} from 'lucide-react';

export const WorkstationNavbar: React.FC = () => {
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);
  const panelState = useWorkspaceStore((s) => s.panelState);
  const toggleSidebar = useWorkspaceStore((s) => s.toggleSidebar);
  const toggleCodex = useWorkspaceStore((s) => s.toggleCodex);
  const toggleZenMode = useWorkspaceStore((s) => s.toggleZenMode);
  const setIsDashboardOpen = useWorkspaceStore((s) => s.setIsDashboardOpen);
  const setIsExportOpen = useWorkspaceStore((s) => s.setIsExportOpen);
  
  const activeNovel = useWorkspaceStore((s) => s.novels.find((n) => n._id === s.activeNovelId));
  const updateNovel = useWorkspaceStore((s) => s.updateNovel);

  const theme = useWorkspaceStore((s) => s.theme);
  const toggleTheme = useWorkspaceStore((s) => s.toggleTheme);
  const penName = useWorkspaceStore((s) => s.penName);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

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
    <header className="w-full border-b border-canvas-border bg-canvas/95 backdrop-blur-md sticky top-0 z-30 select-none">
      <div className="w-full px-3 sm:px-4 lg:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left Section: Workstation Structure, Library Exit & Manuscript Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Toggle Sidebar Icon Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className={`p-2 rounded-lg border transition-all ${
              panelState.isSidebarOpen
                ? 'bg-canvas-card border-canvas-border text-brand-600 shadow-xs'
                : 'border-transparent text-ink-muted hover:bg-canvas-hover hover:text-ink'
            }`}
            title="Toggle Manuscript Tree (Ctrl+Shift+S)"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          {/* Exit / Return to Library */}
          <button
            type="button"
            onClick={openLibrary}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-hover text-xs font-mono font-medium transition-all group border border-transparent hover:border-canvas-border"
            title="Return to Manuscript Library"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Library</span>
          </button>

          <div className="h-4 w-px bg-canvas-border mx-0.5 sm:mx-1 flex-shrink-0" />

          {/* Manuscript Title & Hierarchy Breadcrumbs */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>

            {isEditingTitle ? (
              <div className="flex items-center gap-1">
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
                  className="px-2 py-0.5 rounded bg-canvas-card border border-brand-500 font-serif font-semibold text-ink text-xs sm:text-sm focus:outline-none shadow-xs max-w-[180px] sm:max-w-[240px]"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-1 text-emerald-600 hover:text-emerald-700"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartEditTitle}
                className="font-serif font-semibold text-xs sm:text-sm text-ink hover:text-brand-700 truncate max-w-[130px] sm:max-w-[190px] md:max-w-[240px] flex items-center gap-1.5 group/title text-left transition-colors"
                title="Click to rename manuscript"
              >
                <span className="truncate">{activeNovel?.title || 'Untitled Manuscript'}</span>
                <Edit3 className="w-2.5 h-2.5 text-ink-faint opacity-40 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Dedicated Workstation Tools (Metrics, Export, Codex, Zen, Theme, Profile) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Workstation Tools Group */}
          <div className="flex items-center gap-1 bg-canvas-card/50 p-1 rounded-xl border border-canvas-border">
            {/* Project Metrics */}
            <button
              type="button"
              onClick={() => setIsDashboardOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-hover text-xs font-mono transition-colors"
              title="Project Metrics & Word Goals"
            >
              <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden sm:inline">Metrics</span>
            </button>

            {/* Clean Export */}
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-hover text-xs font-mono transition-colors"
              title="Export Manuscript (PDF, DOCX, TXT)"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* World Codex Lore */}
            <button
              type="button"
              onClick={toggleCodex}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono transition-colors ${
                panelState.isCodexOpen
                  ? 'bg-brand-100 text-brand-900 border border-brand-300 dark:bg-brand-600/25 dark:text-brand-200 dark:border-brand-500/30'
                  : 'text-ink-muted hover:text-ink hover:bg-canvas-hover'
              }`}
              title="World Codex & Lore Reference (Ctrl+Shift+C)"
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

          {/* Author Pen Name Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-canvas-card border border-canvas-border text-ink text-xs font-serif shadow-xs"
            title={`Drafting as ${penName}`}
          >
            <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-600/30 dark:text-brand-300 flex items-center justify-center text-[10px] font-bold">
              <User className="w-3 h-3" />
            </div>
            <span className="max-w-[90px] lg:max-w-[120px] truncate font-medium">
              {penName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
