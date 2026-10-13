import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { usePWA } from '../../hooks/usePWA';
import {
  Radio,
  Feather,
  Trophy,
  Timer,
  ArrowUp,
  Shield,
  Download,
  Sun,
  Moon,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const openDashboard = useWorkspaceStore((s) => s.openDashboard);
  const openRanking = useWorkspaceStore((s) => s.openRanking);
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);
  const openPlay = useWorkspaceStore((s) => s.openPlay);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);
  const openChallenge = useWorkspaceStore((s) => s.openChallenge);
  const penName = useWorkspaceStore((s) => s.penName);
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const theme = useWorkspaceStore((s) => s.theme);
  const toggleTheme = useWorkspaceStore((s) => s.toggleTheme);

  const { canInstall, isInstalled, installApp } = usePWA();

  const scrollToTop = () => {
    const mainContainer = document.querySelector('.overflow-y-auto');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#111317] border-t border-stone-800 text-stone-300 select-none">
      
      {/* ================= MOBILE VIEW (Concise, Lightweight & Not Overwhelming) ================= */}
      <div className="sm:hidden px-4 pt-5 pb-20 space-y-3.5">
        {/* Brand & Scroll Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-none bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 flex items-center justify-center text-white shadow-xs">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <span className="font-serif font-black text-base text-white tracking-tight">
              Alterjot
            </span>
            <span className="px-1.5 py-0.2 rounded-none text-[9px] font-mono uppercase tracking-widest bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
              ATELIER
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-none border border-stone-800 bg-stone-900/90 hover:bg-stone-800 text-stone-300 text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

        {/* Compact 2-Column Links */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-stone-800/80 text-xs font-sans text-stone-400">
          <button
            type="button"
            onClick={startWritingImmediately}
            className="text-left hover:text-amber-400 transition-colors py-0.5 truncate cursor-pointer"
          >
            Draft Novel
          </button>
          <button
            type="button"
            onClick={openRanking}
            className="text-left hover:text-amber-400 transition-colors py-0.5 truncate flex items-center gap-1 cursor-pointer"
          >
            <Trophy className="w-3 h-3 text-amber-500 flex-shrink-0" />
            <span>Leaderboard</span>
          </button>
          <button
            type="button"
            onClick={openPlay}
            className="text-left hover:text-amber-400 transition-colors py-0.5 truncate cursor-pointer"
          >
            Word Sprints
          </button>
          <button
            type="button"
            onClick={openLibrary}
            className="text-left hover:text-amber-400 transition-colors py-0.5 truncate cursor-pointer"
          >
            Manuscript Shelf
          </button>
        </div>

        {/* Minimal Mobile Copyright */}
        <div className="pt-2 border-t border-stone-800/60 text-[10px] font-mono text-stone-500 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} Alterjot Atelier</span>
          <span className="truncate max-w-[140px] text-stone-400 font-semibold">
            {isAuthenticated ? penName : 'Offline PWA'}
          </span>
        </div>
      </div>

      {/* ================= TABLET & DESKTOP VIEW (Rich Editorial Layout) ================= */}
      <div className="hidden sm:block">
        {/* Main Columns Container */}
        <div className="w-full px-6 md:px-12 py-10 md:py-14 border-b border-stone-850">
          <div className="grid grid-cols-12 gap-8 md:gap-12">
            
            {/* Brand Column */}
            <div className="col-span-12 md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-none bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 flex items-center justify-center text-white shadow-sm shadow-amber-600/30">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <span className="font-serif font-black text-xl text-white tracking-tight">
                  Alterjot
                </span>
                <span className="px-1.5 py-0.5 rounded-none text-[10px] font-mono uppercase tracking-widest bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                  ATELIER
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-400 font-serif leading-relaxed max-w-md">
                A distraction-free manuscript workshop and digital atelier crafted for fiction writers, novelists, and scribes dedicated to persistent drafting momentum.
              </p>

              <div className="flex items-center gap-3 pt-1 flex-wrap text-[11px] font-mono text-stone-400">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-stone-900 border border-stone-800">
                  <Shield className="w-3 h-3 text-emerald-500" />
                  <span>Offline First PWA</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-stone-900 border border-stone-800">
                  <Feather className="w-3 h-3 text-amber-500" />
                  <span>TipTap Prose Canvas</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-stone-900 border border-stone-800">
                  <Timer className="w-3 h-3 text-blue-400" />
                  <span>15-Min Sprints</span>
                </span>
              </div>
            </div>

            {/* Studio & Tools Column */}
            <div className="col-span-6 md:col-span-2 space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-white">
                Studio & Tools
              </h4>
              <ul className="space-y-2 text-xs font-sans text-stone-400">
                <li>
                  <button
                    type="button"
                    onClick={startWritingImmediately}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    Draft Novel
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openPlay}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    Word Sprint Arena
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openLibrary}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    Personal Shelf
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openDashboard}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    Atelier Overview
                  </button>
                </li>
              </ul>
            </div>

            {/* Challenges Column */}
            <div className="col-span-6 md:col-span-2 space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-white">
                Challenges
              </h4>
              <ul className="space-y-2 text-xs font-sans text-stone-400">
                <li>
                  <button
                    type="button"
                    onClick={openRanking}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <Trophy className="w-3 h-3 text-amber-500" />
                    <span>Leaderboard</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openChallenge('apocalyptic-world')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    Midnight Siege
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openChallenge('apocalyptic-triad')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    Floor 43 Ascent
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openRanking}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    All Standings
                  </button>
                </li>
              </ul>
            </div>

            {/* Atelier Traditions Column */}
            <div className="col-span-12 md:col-span-3 space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-white">
                Atelier
              </h4>
              <div className="space-y-2 text-xs font-sans text-stone-400">
                <p className="leading-relaxed">
                  Speculative fiction, dark fantasy, clockwork steampunk, and survival horror drafting workspace.
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-stone-400">
                  <span>Active Scribe:</span>
                  <span className="font-bold text-amber-300 truncate">
                    {isAuthenticated ? penName : 'Anonymous Guest'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="w-full px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span>&copy; {new Date().getFullYear()} Alterjot Atelier.</span>
            <span>&bull;</span>
            <span className="font-serif italic text-stone-300">
              &ldquo;Every masterpiece begins with an unpolished draft.&rdquo;
            </span>
          </div>

          {/* Desktop Footer Actions: Install App + Lightmode Toggle + Scroll to Top */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Install App Button */}
            {!isInstalled && (
              <button
                type="button"
                onClick={() => {
                  if (canInstall) {
                    installApp();
                  } else {
                    alert('To install Alterjot as a desktop application, click the Install icon in your browser address bar (Chrome, Edge, Brave, or Safari).');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-stone-800 bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer font-mono text-xs"
                title="Install Alterjot as a Desktop Application"
              >
                <Download className="w-3.5 h-3.5 text-amber-500" />
                <span>Install App</span>
              </button>
            )}

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              id="footer-theme-toggle-btn"
              onClick={(e) => toggleTheme(e)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-stone-800 bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer font-mono text-xs"
              title={theme === 'light' ? 'Switch to Nocturne Dark Mode' : 'Switch to Retro Light Mode'}
              aria-label={theme === 'light' ? 'Switch to Nocturne Dark Mode' : 'Switch to Retro Light Mode'}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-brand-300" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {/* Scroll to Top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-stone-800 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-amber-400 transition-all cursor-pointer font-mono text-xs uppercase tracking-wider"
              title="Scroll to top of page"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
