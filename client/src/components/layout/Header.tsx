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
    location.pathname.startsWith('/works/') ||
    location.pathname.startsWith('/studio');

  if (isStudioRoute) {
    return <WorkstationNavbar />;
  }

  return <GlobalNavbar />;
};

