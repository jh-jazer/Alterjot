import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWorkspaceStore, type LeftPanelTab } from '../../store/useWorkspaceStore';
import {
  Home,
  Dices,
  Compass,
  BookOpen,
  Search,
  Files,
  BookMarked,
  Sparkles,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentView = useWorkspaceStore((s) => s.currentView);
  const panelState = useWorkspaceStore((s) => s.panelState);
  const isLeftPanelOpen = panelState.isLeftPanelOpen;
  const activeLeftTab = panelState.activeLeftTab;
  const isZenMode = panelState.isZenMode;
  const toggleLeftPanel = useWorkspaceStore((s) => s.toggleLeftPanel);

  const chapters = useWorkspaceStore((s) => s.chapters);
  const codexEntries = useWorkspaceStore((s) => s.codexEntries);
  const activePassage = useWorkspaceStore((s) => s.activePassage);

  const openDashboard = useWorkspaceStore((s) => s.openDashboard);
  const openPlay = useWorkspaceStore((s) => s.openPlay);
  const openExplore = useWorkspaceStore((s) => s.openExplore);
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);

  const isStudioRoute =
    currentView === 'studio' ||
    location.pathname.startsWith('/works') ||
    location.pathname.startsWith('/studio');

  // In Zen focus mode, hide chrome completely so the writer has 100% distraction-free focus
  if (isZenMode) {
    return null;
  }

  // =========================================================================
  // 1. STUDIO WORKSTATION MOBILE BOTTOM NAV
  // The four core workstation tabs: Search, Chapters, Codex, and AI Copilot
  // =========================================================================
  if (isStudioRoute) {
    const studioNavItems: {
      id: LeftPanelTab;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      active: boolean;
      badge?: number | string;
      hasIndicator?: boolean;
      onClick: () => void;
    }[] = [
      {
        id: 'search',
        label: 'Search',
        icon: Search,
        active: isLeftPanelOpen && activeLeftTab === 'search',
        onClick: () => toggleLeftPanel('search'),
      },
      {
        id: 'chapters',
        label: 'Chapters',
        icon: Files,
        active: isLeftPanelOpen && activeLeftTab === 'chapters',
        badge: chapters.length > 0 ? chapters.length : undefined,
        onClick: () => toggleLeftPanel('chapters'),
      },
      {
        id: 'contexts',
        label: 'Codex',
        icon: BookMarked,
        active: isLeftPanelOpen && activeLeftTab === 'contexts',
        badge: codexEntries.length > 0 ? codexEntries.length : undefined,
        onClick: () => toggleLeftPanel('contexts'),
      },
      {
        id: 'ai',
        label: 'AI',
        icon: Sparkles,
        active: isLeftPanelOpen && activeLeftTab === 'ai',
        hasIndicator: Boolean(activePassage?.text),
        onClick: () => toggleLeftPanel('ai'),
      },
    ];

    return (
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-canvas/95 backdrop-blur-md border-t border-canvas-border px-3 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom,0px))] shadow-parchment-lg select-none"
        aria-label="Studio Mobile Navigation Bar"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {studioNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative cursor-pointer text-ink-muted hover:text-ink active:scale-95"
                aria-label={`${item.label} Panel`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon className="w-5 h-5 text-ink-muted" />

                  {/* Count Badge (Chapters / Codex) */}
                  {item.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-3 min-w-[15px] h-[15px] px-1 rounded-full text-[9px] font-mono flex items-center justify-center leading-none font-bold bg-canvas-card border border-canvas-border text-ink-muted dark:bg-zinc-800 dark:text-zinc-300">
                      {item.badge}
                    </span>
                  )}

                  {/* Active Passage pulse indicator for AI */}
                  {item.hasIndicator && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-mono tracking-wider uppercase mt-1 text-ink-muted">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // =========================================================================
  // 2. GLOBAL / EXPLORATION MOBILE BOTTOM NAV (Home, Play, Rank, Library)
  // =========================================================================
  const globalNavItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      active: currentView === 'dashboard' || currentView === 'landing',
      onClick: () => {
        openDashboard();
        navigate('/');
      },
    },
    {
      id: 'play',
      label: 'Play',
      icon: Dices,
      active: currentView === 'play',
      onClick: () => {
        openPlay();
        navigate('/play');
      },
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      active: currentView === 'explore' || location.pathname.startsWith('/explore'),
      onClick: () => {
        openExplore();
        navigate('/explore');
      },
    },
    {
      id: 'library',
      label: 'Library',
      icon: BookOpen,
      active:
        currentView === 'library' ||
        currentView === 'book' ||
        location.pathname.startsWith('/book') ||
        location.pathname.startsWith('/novel'),
      onClick: () => {
        openLibrary();
        navigate('/library');
      },
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-canvas/95 backdrop-blur-md border-t border-canvas-border px-3 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom,0px))] shadow-parchment-lg select-none"
      aria-label="Mobile Navigation Bar"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {globalNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative cursor-pointer ${
                item.active
                  ? 'text-brand-700 dark:text-amber-400 font-bold'
                  : 'text-ink-muted hover:text-ink active:scale-95'
              }`}
            >
              {item.active && (
                <span className="absolute -top-1.5 w-8 h-1 bg-brand-600 dark:bg-amber-400 rounded-full shadow-[0_0_8px_rgba(217,119,6,0.4)]" />
              )}
              <Icon
                className={`w-5 h-5 transition-transform ${
                  item.active ? 'scale-110 text-brand-600 dark:text-amber-400' : ''
                }`}
              />
              <span className="text-[10px] font-mono tracking-wider uppercase mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
