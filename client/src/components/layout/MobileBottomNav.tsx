import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { LayoutDashboard, Dices, Trophy, BookOpen } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const currentView = useWorkspaceStore((s) => s.currentView);
  const openDashboard = useWorkspaceStore((s) => s.openDashboard);
  const openPlay = useWorkspaceStore((s) => s.openPlay);
  const openRanking = useWorkspaceStore((s) => s.openRanking);
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);

  // In Studio mode, the writer wants maximum screen real estate for drafting without distractions
  if (currentView === 'studio') {
    return null;
  }

  const navItems = [
    {
      id: 'dashboard',
      label: 'Desk',
      icon: LayoutDashboard,
      active: currentView === 'dashboard' || currentView === 'landing',
      onClick: () => {
        openDashboard();
        navigate('/dashboard');
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
      id: 'ranking',
      label: 'Rank',
      icon: Trophy,
      active: currentView === 'ranking',
      onClick: () => {
        openRanking();
        navigate('/ranking');
      },
    },
    {
      id: 'library',
      label: 'Library',
      icon: BookOpen,
      active: currentView === 'library',
      onClick: () => {
        openLibrary();
        navigate('/library');
      },
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas border-t border-canvas-border px-3 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-parchment-lg select-none"
      aria-label="Mobile Navigation Bar"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
                item.active
                  ? 'text-brand-700 dark:text-brand-300 font-bold'
                  : 'text-ink-muted hover:text-ink active:scale-95'
              }`}
            >
              {item.active && (
                <span className="absolute -top-1 w-8 h-1 bg-brand-600 dark:bg-brand-400 rounded-full" />
              )}
              <Icon
                className={`w-5 h-5 transition-transform ${
                  item.active ? 'scale-110 text-brand-600 dark:text-brand-400' : ''
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
