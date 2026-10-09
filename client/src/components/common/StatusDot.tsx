import React from 'react';
import type { SaveStatus } from '../../types';

interface StatusDotProps {
  status: SaveStatus;
  lastSavedAt?: Date | null;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, lastSavedAt }) => {
  let dotColor = 'bg-[#887b6d] dark:bg-slate-400';
  let label = 'Idle';
  let animate = false;

  switch (status) {
    case 'saving':
      dotColor = 'bg-[#c2593f] dark:bg-amber-400';
      label = 'Saving...';
      animate = true;
      break;
    case 'saved':
      dotColor = 'bg-[#2a7a44] dark:bg-emerald-400';
      label = 'Saved';
      break;
    case 'cached-offline':
      dotColor = 'bg-[#1b5966] dark:bg-sky-400';
      label = 'Cached Offline';
      break;
    case 'error':
      dotColor = 'bg-[#b91c1c] dark:bg-rose-500';
      label = 'Sync Error';
      break;
    case 'idle':
    default:
      dotColor = 'bg-[#887b6d] dark:bg-slate-500';
      label = 'All changes saved';
      break;
  }

  return (
    <div className="flex items-center gap-2 text-xs font-mono select-none px-2.5 py-1 rounded-full bg-canvas-card border border-canvas-border shadow-xs">
      <span className="relative flex h-2 w-2">
        {animate && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      <span className="text-ink font-medium">{label}</span>
      {lastSavedAt && status === 'saved' && (
        <span className="text-[10px] text-ink-faint hidden sm:inline">
          {new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      )}
    </div>
  );
};
