import React from 'react';
import type { SceneStatus } from '../../types';

interface BadgeProps {
  status: SceneStatus | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  let colorStyles = 'bg-canvas-surface text-ink-muted border-canvas-border';

  switch (status) {
    case 'Draft':
      colorStyles = 'bg-[#faeed1] text-[#7c4a03] border-[#e3c788] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40';
      break;
    case 'In Review':
      colorStyles = 'bg-[#dcf0f2] text-[#1b5966] border-[#9ec8ce] dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/40';
      break;
    case 'Final':
      colorStyles = 'bg-[#dff0e4] text-[#245b32] border-[#a0cea9] dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40';
      break;
    case 'Characters':
      colorStyles = 'bg-[#e1e9f8] text-[#2e4785] border-[#a8bee7] dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40';
      break;
    case 'Locations':
      colorStyles = 'bg-[#dff2ea] text-[#225744] border-[#a1d6be] dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40';
      break;
    case 'Factions':
      colorStyles = 'bg-[#fae6de] text-[#913d1e] border-[#e7b6a4] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40';
      break;
    case 'Timeline':
      colorStyles = 'bg-[#f8e2ec] text-[#86294d] border-[#dfa9c0] dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40';
      break;
    case 'Hazards':
      colorStyles = 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50';
      break;
    case 'Scavenge':
      colorStyles = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50';
      break;
  }

  const sizeStyles = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border tracking-wide uppercase font-mono shadow-xs ${colorStyles} ${sizeStyles}`}
    >
      {status}
    </span>
  );
};
