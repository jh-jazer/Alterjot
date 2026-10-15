import React, { useEffect, useRef } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export const RouteSync: React.FC = () => {
  const location = useLocation();
  const currentView = useWorkspaceStore((s) => s.currentView);
  const setCurrentView = useWorkspaceStore((s) => s.setCurrentView);
  const activeNovelId = useWorkspaceStore((s) => s.activeNovelId);
  const selectNovel = useWorkspaceStore((s) => s.selectNovel);
  const openChallenge = useWorkspaceStore((s) => s.openChallenge);
  const activeChallengeId = useWorkspaceStore((s) => s.activeChallengeId);
  const novels = useWorkspaceStore((s) => s.novels);

  const prevPathRef = useRef<string>('');

  useEffect(() => {
    const pathname = location.pathname;

    // Synchronize query parameters like ?role=reader or ?mode=reader
    const searchParams = new URLSearchParams(location.search);
    const hasReaderParam = searchParams.get('role') === 'reader' || searchParams.get('mode') === 'reader';
    if (hasReaderParam && !useWorkspaceStore.getState().isReaderMode) {
      useWorkspaceStore.getState().setIsReaderMode(true);
    }

    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    // Match /book/:id or /novel/:id (Book Details page)
    const bookMatch = matchPath('/book/:id', pathname) || matchPath('/novel/:id', pathname);
    if (bookMatch && bookMatch.params.id) {
      const targetId = bookMatch.params.id;
      if (currentView !== 'book') {
        setCurrentView('book');
      }
      if (activeNovelId !== targetId) {
        selectNovel(targetId).catch((err) => {
          console.warn('[RouteSync] Failed to select novel from URL ID:', err);
        });
      }
      return;
    }

    // Match /works/:id or /studio/:id (Studio Workspace)
    const worksMatch = matchPath('/works/:id', pathname) || matchPath('/studio/:id', pathname);
    if (worksMatch && worksMatch.params.id) {
      const targetId = worksMatch.params.id;
      if (currentView !== 'studio') {
        setCurrentView('studio');
      }
      if (activeNovelId !== targetId) {
        selectNovel(targetId).catch((err) => {
          console.warn('[RouteSync] Failed to select novel from URL ID:', err);
        });
      }
      return;
    }

    // Match /challenge/:id
    const challengeMatch = matchPath('/challenge/:id', pathname);
    if (challengeMatch && challengeMatch.params.id) {
      const challengeId = challengeMatch.params.id;
      if (currentView !== 'challenge' || activeChallengeId !== challengeId) {
        openChallenge(challengeId);
      }
      return;
    }

    // Match static views
    if (pathname === '/play') {
      if (currentView !== 'play') setCurrentView('play');
    } else if (pathname === '/ranking') {
      if (currentView !== 'ranking') setCurrentView('ranking');
    } else if (pathname === '/library' || pathname === '/works') {
      if (currentView !== 'library') setCurrentView('library');
    } else if (pathname === '/' || pathname === '/home' || pathname === '/dashboard' || pathname.startsWith('/shared/')) {
      if (currentView !== 'dashboard' && currentView !== 'landing') setCurrentView('dashboard');
    } else if (pathname === '/studio') {
      if (currentView !== 'studio') {
        if (activeNovelId) {
          selectNovel(activeNovelId);
        } else if (novels.length > 0) {
          selectNovel(novels[0]._id);
        }
        setCurrentView('studio');
      }
    }
  }, [location.pathname, currentView, activeNovelId, activeChallengeId, novels, selectNovel, openChallenge, setCurrentView]);

  return null;
};
