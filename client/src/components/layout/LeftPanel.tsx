import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { LeftPanelTab } from '../../store/useWorkspaceStore';
import { ChaptersTabContent } from './left-panel/ChaptersTabContent';
import { ContextsTabContent } from './left-panel/ContextsTabContent';
import { AiTabContent } from './left-panel/AiTabContent';
import {
  Files,
  BookMarked,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  X,
} from 'lucide-react';

export const LeftPanel: React.FC = () => {
  const panelState = useWorkspaceStore((s) => s.panelState);
  const activeLeftTab = panelState.activeLeftTab;
  const isLeftPanelOpen = panelState.isLeftPanelOpen;
  const isZenMode = panelState.isZenMode;

  const toggleLeftPanel = useWorkspaceStore((s) => s.toggleLeftPanel);
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
          className="fixed inset-0 bg-black/60 backdrop-blur-2xs z-30 md:hidden animate-fadeIn"
          onClick={closeLeftPanel}
          title="Close panel"
        />
      )}

      <div className="flex h-full flex-shrink-0 z-30 relative select-none">
        {/* ======================================================== */}
        {/* 1. SLIM VERTICAL ACTIVITY BAR (VS Code / Studio Rail)     */}
        {/* ======================================================== */}
        <aside
          className="w-12 sm:w-[50px] bg-[#14151a] border-r border-[#242633] flex flex-col items-center justify-between py-2.5 z-40 flex-shrink-0 text-zinc-400"
          aria-label="Activity Bar"
        >
          {/* Top Brand Glyph / Logo */}
          <div className="flex flex-col items-center w-full gap-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-1 group cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="Alterjot Studio"
            >
              {/* Iridescent Rainbow Arch / Chevron Glyph (matches screenshot) */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] transition-all"
                fill="none"
              >
                <defs>
                  <linearGradient id="rainbowArch" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
                <path
                  d="M4 18C4 13.5 7.5 8 12 8C16.5 8 20 13.5 20 18M7.5 18C7.5 15 9.5 11.5 12 11.5C14.5 11.5 16.5 15 16.5 18"
                  stroke="url(#rainbowArch)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="w-6 h-px bg-white/10 mb-1" />

            {/* Core Tab Icons */}
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
                          ? 'bg-white/12 text-white dark:text-amber-300 font-semibold shadow-inner'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/6'
                      }`}
                      aria-label={`${tab.label} (${tab.shortcut})`}
                    >
                      {/* Active Left Indicator Bar (VS Code style) */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-brand-500 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                      )}

                      {tab.icon}

                      {/* Pill Badge (e.g. chapter count or codex count) */}
                      {tab.badge !== undefined && (
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 rounded-full text-[9px] font-mono flex items-center justify-center leading-none font-bold ${
                            isActive
                              ? 'bg-brand-500 text-white dark:bg-amber-400 dark:text-zinc-950 shadow-xs'
                              : 'bg-zinc-700 text-zinc-200'
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
                    <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-xs font-mono shadow-xl z-50 whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                      <span>{tab.label}</span>
                      <span className="text-[10px] text-zinc-400">({tab.shortcut})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Utility Actions */}
          <div className="flex flex-col items-center w-full space-y-1.5">
            {/* Toggle / Collapse Side Panel */}
            <div className="relative group w-full flex justify-center">
              <button
                type="button"
                onClick={() => toggleLeftPanel()}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-white/6 transition-colors cursor-pointer"
                title={isLeftPanelOpen ? 'Collapse Left Panel' : 'Expand Left Panel'}
                aria-label="Toggle Panel"
              >
                {isLeftPanelOpen ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4" />
                )}
              </button>
              <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-xs font-mono shadow-xl z-50 whitespace-nowrap pointer-events-none">
                {isLeftPanelOpen ? 'Collapse Panel' : 'Expand Panel'}
              </div>
            </div>

            {/* Zen Focus Mode Button */}
            <div className="relative group w-full flex justify-center">
              <button
                type="button"
                onClick={toggleZenMode}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-white/6 transition-colors cursor-pointer"
                title="Zen Focus Mode (Ctrl+\)"
                aria-label="Zen Focus Mode"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-xs font-mono shadow-xl z-50 whitespace-nowrap pointer-events-none">
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
            className="fixed md:relative inset-y-0 left-12 sm:left-[50px] md:left-0 z-40 w-[calc(100vw-48px)] xs:w-80 sm:w-88 md:w-80 lg:w-[350px] border-r border-canvas-border bg-canvas flex flex-col h-full shadow-2xl md:shadow-md animate-in slide-in-from-left duration-150 overflow-hidden"
            aria-label={getTabTitle()}
          >
            {/* Panel Top Header Bar */}
            <div className="p-3 border-b border-canvas-border flex items-center justify-between bg-canvas-subtle/60">
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
