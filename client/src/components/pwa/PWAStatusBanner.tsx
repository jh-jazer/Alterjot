import React, { useState } from 'react';
import { Download, WifiOff, RefreshCw, X, Feather } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export const PWAStatusBanner: React.FC = () => {
  const { canInstall, isInstalled, isOffline, hasUpdate, installApp, updateApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  // If there's an offline status, always show the offline badge/banner
  if (isOffline) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-[#29241f] text-[#fbf9f4] dark:bg-[#181824] dark:text-[#f1f5f9] border border-amber-600/40 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 backdrop-blur-md">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg flex-shrink-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-wide uppercase text-amber-400">Offline Studio</p>
            <p className="text-xs text-stone-300 dark:text-stone-400 leading-tight truncate sm:whitespace-normal">
              Writing offline. Your manuscript autosaves safely locally.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If an update is ready
  if (hasUpdate) {
    return (
      <div className="fixed bottom-4 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-canvas-card border border-brand-500/50 rounded-xl p-3.5 shadow-2xl flex items-center gap-3 text-ink max-w-sm">
          <div className="p-2 bg-brand-500/10 text-brand-600 rounded-lg flex-shrink-0">
            <RefreshCw className="w-4 h-4 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold">Update Available</p>
            <p className="text-xs text-ink-muted">A fresh edition of Alterjot is ready.</p>
          </div>
          <button
            type="button"
            onClick={updateApp}
            className="px-3 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  // If installable and not dismissed and not already installed
  if (canInstall && !isInstalled && !isDismissed) {
    return (
      <div className="fixed bottom-4 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-canvas-card border border-canvas-border rounded-2xl p-4 shadow-parchment-lg text-ink relative">
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="absolute top-2.5 right-2.5 p-1 text-ink-faint hover:text-ink transition-colors rounded-lg cursor-pointer"
            aria-label="Dismiss install prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Feather className="w-5 h-5" />
            </div>
            <div className="flex-1 pr-4">
              <h4 className="text-sm font-serif font-bold text-ink">Install Alterjot App</h4>
              <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                Enjoy distraction-free writing, full-screen canvas, and offline access right on your desktop or home screen.
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors cursor-pointer"
            >
              Maybe later
            </button>
            <button
              type="button"
              onClick={installApp}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition-all hover:shadow cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
