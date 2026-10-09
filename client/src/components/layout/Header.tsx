import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { GlobalNavbar } from './GlobalNavbar';
import { WorkstationNavbar } from './WorkstationNavbar';

export const Header: React.FC = () => {
  const currentView = useWorkspaceStore((s) => s.currentView);

  if (currentView === 'studio') {
    return <WorkstationNavbar />;
  }

  return <GlobalNavbar />;
};

