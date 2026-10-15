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
import { ExploreView } from './components/explore/ExploreView';
import { ChallengeDetailView } from './components/challenge/ChallengeDetailView';
import { BookDetailView } from './components/library/BookDetailView';
import { CreateStoryView } from './components/story/CreateStoryView';
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
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-canvas text-ink select-none">
        <div className="max-w-md w-full p-8 rounded-2xl bg-canvas-card border border-canvas-border shadow-xl text-center space-y-4">
          <h2 className="text-xl font-serif font-bold">Author Sign In Required</h2>
          <p className="text-xs text-ink-muted leading-relaxed font-sans">
            Guest mode is disabled. Please sign in with your Google account to access your studio canvas, synchronized manuscripts, and AI writing tools.
          </p>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true, 'signin')}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

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
        <Route path="/explore" element={<ExploreView />} />
        <Route path="/ranking" element={<Navigate to="/play" replace />} />
        <Route path="/library" element={<LibraryView />} />
        <Route path="/works" element={<LibraryView />} />
        <Route path="/stories/new" element={<CreateStoryView />} />
        <Route path="/new" element={<CreateStoryView />} />
        <Route path="/works/:id/edit" element={<CreateStoryView isEditing />} />
        <Route path="/book/:id/edit" element={<CreateStoryView isEditing />} />
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
