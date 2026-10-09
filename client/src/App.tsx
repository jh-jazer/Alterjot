import React, { useEffect } from 'react';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProseEditor } from './components/editor/ProseEditor';
import { CodexDrawer } from './components/layout/CodexDrawer';
import { LibraryView } from './components/library/LibraryView';
import { LandingPage } from './components/landing/LandingPage';
import { PlayView } from './components/play/PlayView';
import { RankingView } from './components/ranking/RankingView';
import { ProjectDashboardModal } from './components/dashboard/ProjectDashboardModal';
import { ExportModal } from './components/export/ExportModal';

export const App: React.FC = () => {
  const loadInitialWorkspace = useWorkspaceStore((s) => s.loadInitialWorkspace);
  const currentView = useWorkspaceStore((s) => s.currentView);

  // Register global shortcuts (Cmd/Ctrl + \, Escape, etc.)
  useKeyboardShortcuts();

  useEffect(() => {
    loadInitialWorkspace();
  }, [loadInitialWorkspace]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-canvas text-ink">
      {/* Top Application Bar with Side Margins */}
      <Header />

      {/* Main Viewport: Landing Page (Root), Play, Ranking, Library, or Studio */}
      {currentView === 'landing' ? (
        <LandingPage />
      ) : currentView === 'play' ? (
        <PlayView />
      ) : currentView === 'ranking' ? (
        <RankingView />
      ) : currentView === 'library' ? (
        <LibraryView />
      ) : (
        <main className="flex-1 flex overflow-hidden relative">
          {/* Left: Manuscript Tree (Sidebar) */}
          <Sidebar />

          {/* Center: TipTap Prose Canvas */}
          <ProseEditor />

          {/* Right: World Codex & Lore Reference Drawer */}
          <CodexDrawer />
        </main>
      )}

      {/* Modals & Dialogs */}
      <ProjectDashboardModal />
      <ExportModal />
    </div>
  );
};

export default App;
