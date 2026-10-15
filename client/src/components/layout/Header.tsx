import React from 'react';
import { useLocation } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { GlobalNavbar } from './GlobalNavbar';
import { WorkstationNavbar } from './WorkstationNavbar';

export const Header: React.FC = () => {
  const currentView = useWorkspaceStore((s) => s.currentView);
  const location = useLocation();

  const isStudioRoute =
    currentView === 'studio' ||
    (location.pathname.startsWith('/works/') && !location.pathname.endsWith('/edit')) ||
    (location.pathname.startsWith('/studio') && !location.pathname.endsWith('/edit'));

  const isCreateStoryRoute =
    currentView === 'create-story' ||
    location.pathname === '/stories/new' ||
    location.pathname === '/new' ||
    location.pathname.endsWith('/edit');

  if (isCreateStoryRoute) {
    return null;
  }

  if (isStudioRoute) {
    return <WorkstationNavbar />;
  }

  return <GlobalNavbar />;
};

