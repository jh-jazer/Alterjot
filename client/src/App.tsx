import React, { useEffect } from 'react';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProseEditor } from './components/editor/ProseEditor';
import { CodexDrawer } from './components/layout/CodexDrawer';
import { LibraryView } from './components/library/LibraryView';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlayView } from './components/play/PlayView';
import { RankingView } from './components/ranking/RankingView';
import { ChallengeDetailView } from './components/challenge/ChallengeDetailView';
import { ProjectDashboardModal } from './components/dashboard/ProjectDashboardModal';
import { ExportModal } from './components/export/ExportModal';
import { WriteForProjectModal } from './components/collaborative/WriteForProjectModal';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileModal } from './components/profile/ProfileDropdown';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { PWAStatusBanner } from './components/pwa/PWAStatusBanner';

export const App: React.FC = () => {
  const loadInitialWorkspace = useWorkspaceStore((s) => s.loadInitialWorkspace);
  const currentView = useWorkspaceStore((s) => s.currentView);

  // Register global shortcuts (Cmd/Ctrl + \, Escape, etc.)
  useKeyboardShortcuts();

  useEffect(() => {
    loadInitialWorkspace();
  }, [loadInitialWorkspace]);

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full overflow-hidden bg-canvas text-ink">
      {/* Top Application Bar with Side Margins */}
      <Header />

      {/* Main Viewport: Dashboard (Root), Play, Ranking, Library, Challenge, or Studio */}
      {currentView === 'dashboard' || currentView === 'landing' ? (
        <DashboardView />
      ) : currentView === 'play' ? (
        <PlayView />
      ) : currentView === 'ranking' ? (
        <RankingView />
      ) : currentView === 'library' ? (
        <LibraryView />
      ) : currentView === 'challenge' ? (
        <ChallengeDetailView />
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
      <WriteForProjectModal />
      <AuthModal />
      <ProfileModal />
      <OnboardingModal />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* PWA Offline & Install Banner */}
      <PWAStatusBanner />
    </div>
  );
};

export default App;
