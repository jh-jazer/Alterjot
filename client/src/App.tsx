import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/layout/Header';
import { ProseEditor } from './components/editor/ProseEditor';
import { LeftPanel } from './components/layout/LeftPanel';
import { LibraryView } from './components/library/LibraryView';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlayView } from './components/play/PlayView';
import { RankingView } from './components/ranking/RankingView';
import { ChallengeDetailView } from './components/challenge/ChallengeDetailView';
import { BookDetailView } from './components/library/BookDetailView';
import { ProjectDashboardModal } from './components/dashboard/ProjectDashboardModal';
import { ExportModal } from './components/export/ExportModal';
import { WriteForProjectModal } from './components/collaborative/WriteForProjectModal';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileModal } from './components/profile/ProfileDropdown';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { PWAStatusBanner } from './components/pwa/PWAStatusBanner';
import { RouteSync } from './components/common/RouteSync';

const StudioWorkspace: React.FC = () => {
  const isZenMode = useWorkspaceStore((s) => s.panelState.isZenMode);

  return (
    <main
      className={`flex-1 flex overflow-hidden relative ${
        isZenMode ? '' : 'pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:pb-0'
      }`}
    >
      {/* Left: VS Code Style Activity Bar Tabs (Chapters, Contexts, AI) */}
      <LeftPanel />

      {/* Center: TipTap Prose Canvas */}
      <ProseEditor />
    </main>
  );
};

export const App: React.FC = () => {
  const loadInitialWorkspace = useWorkspaceStore((s) => s.loadInitialWorkspace);

  // Register global shortcuts (Cmd/Ctrl + \, Escape, etc.)
  useKeyboardShortcuts();

  useEffect(() => {
    loadInitialWorkspace();
  }, [loadInitialWorkspace]);

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full overflow-hidden bg-canvas text-ink">
      {/* Synchronize URL routes and route parameters with Zustand store */}
      <RouteSync />

      {/* Top Application Bar */}
      <Header />

      {/* Main Viewport Routing */}
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/home" element={<DashboardView />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/play" element={<PlayView />} />
        <Route path="/ranking" element={<RankingView />} />
        <Route path="/library" element={<LibraryView />} />
        <Route path="/works" element={<LibraryView />} />
        <Route path="/book/:id" element={<BookDetailView />} />
        <Route path="/novel/:id" element={<BookDetailView />} />
        <Route path="/book" element={<Navigate to="/library" replace />} />
        <Route path="/works/:id" element={<StudioWorkspace />} />
        <Route path="/studio/:id" element={<StudioWorkspace />} />
        <Route path="/studio" element={<StudioWorkspace />} />
        <Route path="/challenge/:id" element={<ChallengeDetailView />} />
        <Route path="/challenge" element={<ChallengeDetailView />} />
        <Route path="/shared/:id" element={<DashboardView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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
