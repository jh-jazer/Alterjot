import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { LeftPanelTab } from '../../store/useWorkspaceStore';
import { ChaptersTabContent } from './left-panel/ChaptersTabContent';
import { ContextsTabContent } from './left-panel/ContextsTabContent';
import { AiTabContent } from './left-panel/AiTabContent';
import { SearchTabContent } from './left-panel/SearchTabContent';
import {
  Files,
  BookMarked,
  Sparkles,
  Search,
  Maximize2,
  X,
} from 'lucide-react';

export const LeftPanel: React.FC = () => {
  const panelState = useWorkspaceStore((s) => s.panelState);
  const activeLeftTab = panelState.activeLeftTab;
  const isLeftPanelOpen = panelState.isLeftPanelOpen;
  const isZenMode = panelState.isZenMode;

  const setActiveLeftTab = useWorkspaceStore((s) => s.setActiveLeftTab);
  const closeLeftPanel = useWorkspaceStore((s) => s.closeLeftPanel);
  const toggleZenMode = useWorkspaceStore((s) => s.toggleZenMode);

  const chapters = useWorkspaceStore((s) => s.chapters);
  const codexEntries = useWorkspaceStore((s) => s.codexEntries);
  const activePassage = useWorkspaceStore((s) => s.activePassage);

  // If in Zen focus mode, hide chrome completely
  if (isZenMode) return null;

  const tabs: {
    id: LeftPanelTab;
    label: string;
    icon: React.ReactNode;
    shortcut: string;
    badge?: number | string;
    hasIndicator?: boolean;
  }[] = [
    {
      id: 'search',
      label: 'Search & Replace',
      icon: <Search className="w-5 h-5" />,
      shortcut: 'Ctrl+Shift+F',
    },
    {
      id: 'chapters',
      label: 'Chapters',
      icon: <Files className="w-5 h-5" />,
      shortcut: 'Ctrl+Shift+S',
      badge: chapters.length > 0 ? chapters.length : undefined,
    },
    {
      id: 'contexts',
      label: 'Contexts',
      icon: <BookMarked className="w-5 h-5" />,
      shortcut: 'Ctrl+Shift+C',
      badge: codexEntries.length > 0 ? codexEntries.length : undefined,
    },
    {
      id: 'ai',
      label: 'AI Copilot',
      icon: <Sparkles className="w-5 h-5" />,
      shortcut: 'Ctrl+J',
      hasIndicator: Boolean(activePassage?.text),
    },
  ];

  const handleTabClick = (tabId: LeftPanelTab) => {
    if (isLeftPanelOpen && activeLeftTab === tabId) {
      // Clicking the currently active tab collapses the panel (standard VS Code behavior)
      closeLeftPanel();
    } else {
      setActiveLeftTab(tabId);
    }
  };

  const getTabTitle = () => {
    switch (activeLeftTab) {
      case 'search':
        return 'Search & Replace in Story';
      case 'chapters':
        return 'Manuscript Chapters';
      case 'contexts':
        return 'Survival Codex & Lore';
      case 'ai':
        return 'AI Narrative Copilot';
      default:
        return 'Panel';
    }
  };

  const getTabIcon = () => {
    switch (activeLeftTab) {
      case 'search':
        return <Search className="w-4 h-4 text-brand-600 dark:text-amber-400" />;
      case 'chapters':
        return <Files className="w-4 h-4 text-brand-600 dark:text-amber-400" />;
      case 'contexts':
        return <BookMarked className="w-4 h-4 text-brand-600 dark:text-amber-400" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop when panel is expanded */}
      {isLeftPanelOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-30 md:hidden animate-fadeIn"
          onClick={closeLeftPanel}
          title="Close panel"
        />
      )}

      <div className="flex h-full flex-shrink-0 z-30 relative select-none">
        {/* ======================================================== */}
        {/* 1. SLIM VERTICAL ACTIVITY BAR (Light / Dark Adaptive Rail) */}
        {/* ======================================================== */}
        <aside
          className="hidden md:flex w-12 sm:w-[50px] bg-canvas-subtle border-r border-canvas-border flex-col items-center justify-between py-2.5 z-40 flex-shrink-0 text-ink-muted transition-colors select-none"
          aria-label="Activity Bar"
        >
          {/* Primary Navigation Tabs */}
          <div className="flex flex-col items-center w-full space-y-1">
            {tabs.map((tab) => {
              const isActive = isLeftPanelOpen && activeLeftTab === tab.id;

              return (
                <div key={tab.id} className="relative group w-full flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-canvas-card text-brand-700 dark:text-amber-300 dark:bg-white/12 font-semibold shadow-xs border border-canvas-border/80 dark:border-white/10'
                        : 'text-ink-muted hover:text-ink hover:bg-canvas-hover'
                    }`}
                    aria-label={`${tab.label} (${tab.shortcut})`}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-brand-600 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    )}

                    {tab.icon}

                    {/* Pill Badge (e.g. chapter count or codex count) */}
                    {tab.badge !== undefined && (
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 rounded-full text-[9px] font-mono flex items-center justify-center leading-none font-bold ${
                          isActive
                            ? 'bg-brand-600 text-white dark:bg-amber-400 dark:text-zinc-950 shadow-xs'
                            : 'bg-canvas-surface border border-canvas-border text-ink-muted dark:bg-zinc-800 dark:text-zinc-300 dark:border-transparent'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}

                    {/* Active Indicator Pulse (e.g. for AI selected line) */}
                    {tab.hasIndicator && (
                      <span className="absolute top-1 right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                      </span>
                    )}
                  </button>

                  {/* Popover Tooltip */}
                  <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-canvas-card dark:bg-zinc-900 border border-canvas-border dark:border-zinc-700/80 text-ink dark:text-white text-xs font-mono shadow-xl z-50 whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                    <span>{tab.label}</span>
                    <span className="text-[10px] text-ink-muted dark:text-zinc-400">({tab.shortcut})</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Utility Actions */}
          <div className="flex flex-col items-center w-full space-y-1.5">
            {/* Zen Focus Mode Button */}
            <div className="relative group w-full flex justify-center">
              <button
                type="button"
                onClick={toggleZenMode}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors cursor-pointer"
                title="Zen Focus Mode (Ctrl+\)"
                aria-label="Zen Focus Mode"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-2 py-1 rounded-lg bg-canvas-card dark:bg-zinc-900 border border-canvas-border dark:border-zinc-700/80 text-ink dark:text-white text-xs font-mono shadow-xl z-50 whitespace-nowrap pointer-events-none">
                Zen Mode (Ctrl+\)
              </div>
            </div>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* 2. EXPANDABLE PANEL CONTENT CONTAINER                    */}
        {/* ======================================================== */}
        {isLeftPanelOpen && (
          <aside
            className="fixed md:relative inset-x-0 md:inset-x-auto top-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:bottom-0 left-0 md:left-0 z-40 w-full md:w-80 lg:w-[350px] border-b md:border-b-0 border-r-0 md:border-r border-canvas-border bg-canvas flex flex-col shadow-2xl md:shadow-md animate-in slide-in-from-bottom-2 md:slide-in-from-left duration-150 overflow-hidden"
            aria-label={getTabTitle()}
          >
            {/* Panel Top Header Bar */}
            <div className="p-3 border-b border-canvas-border flex items-center justify-between bg-canvas-subtle/60 pt-[max(0.75rem,env(safe-area-inset-top,0px))] md:pt-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-canvas-card border border-canvas-border flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {getTabIcon()}
                </div>
                <h3 className="font-serif font-bold text-ink text-xs sm:text-sm tracking-wide truncate">
                  {getTabTitle()}
                </h3>
              </div>

              <div className="flex items-center gap-1">
                {/* Close Panel Button */}
                <button
                  type="button"
                  onClick={closeLeftPanel}
                  className="p-1 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-ink transition-colors cursor-pointer"
                  title="Close Side Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Content by Active Tab */}
            <div className="flex-1 overflow-hidden">
              {activeLeftTab === 'search' && <SearchTabContent />}
              {activeLeftTab === 'chapters' && <ChaptersTabContent />}
              {activeLeftTab === 'contexts' && <ContextsTabContent />}
              {activeLeftTab === 'ai' && <AiTabContent />}
            </div>
          </aside>
        )}
      </div>
    </>
  );
};
