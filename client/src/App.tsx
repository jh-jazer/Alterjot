import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/layout/Header';
import { ProseEditor } from './components/editor/ProseEditor';
import { CodexDrawer } from './components/layout/CodexDrawer';
import { AiAssistantDrawer } from './components/layout/AiAssistantDrawer';
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
import { RouteSync } from './components/common/RouteSync';

const StudioWorkspace: React.FC = () => (
  <main className="flex-1 flex overflow-hidden relative">
    {/* Left: AI Narrative Copilot Sidebar */}
    <AiAssistantDrawer />

    {/* Center: TipTap Prose Canvas */}
    <ProseEditor />

    {/* Right: World Codex & Lore Reference Drawer */}
    <CodexDrawer />
  </main>
);

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
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/play" element={<PlayView />} />
        <Route path="/ranking" element={<RankingView />} />
        <Route path="/library" element={<LibraryView />} />
        <Route path="/works" element={<LibraryView />} />
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
