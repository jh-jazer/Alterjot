import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  Library,
  Edit3,
  Check,
  Sun,
  Moon,
} from 'lucide-react';

export const WorkstationNavbar: React.FC = () => {
  const navigate = useNavigate();
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);
  const panelState = useWorkspaceStore((s) => s.panelState);

  const activeNovel = useWorkspaceStore((s) => s.novels.find((n) => n._id === s.activeNovelId));
  const updateNovel = useWorkspaceStore((s) => s.updateNovel);

  const theme = useWorkspaceStore((s) => s.theme);
  const toggleTheme = useWorkspaceStore((s) => s.toggleTheme);
  const penName = useWorkspaceStore((s) => s.penName);
  const currentUser = useWorkspaceStore((s) => s.currentUser);
  const isProfileModalOpen = useWorkspaceStore((s) => s.isProfileModalOpen);
  const setIsProfileModalOpen = useWorkspaceStore((s) => s.setIsProfileModalOpen);

  const isReaderMode = useWorkspaceStore((s) => s.isReaderMode);
  const activeReaderName = useWorkspaceStore((s) => s.activeReaderName);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  const handleStartEditTitle = () => {
    if (!activeNovel || isReaderMode) return;
    setTempTitle(activeNovel.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (!activeNovel || isReaderMode) return;
    const newTitle = tempTitle.trim() || 'Untitled Manuscript';
    updateNovel(activeNovel._id, { title: newTitle });
    setIsEditingTitle(false);
  };

  // If Zen mode is activated, collapse the entire chrome for pure focus
  if (panelState.isZenMode) return null;

  return (
    <header className="w-full border-b border-canvas-border bg-canvas sticky top-0 z-30 select-none">
      <div className="w-full px-2 sm:px-4 lg:px-6 h-14 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Left Section: Library Exit & Manuscript Title */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
          {/* Exit / Return to Manuscript Shelf */}
          <button
            type="button"
            onClick={() => {
              openLibrary();
              navigate('/library');
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-canvas-border bg-canvas-card hover:bg-canvas-hover text-ink-muted hover:text-ink flex items-center justify-center transition-all shadow-xs group cursor-pointer flex-shrink-0"
            title="Return to Manuscript Shelf"
            aria-label="Return to Manuscript Shelf"
          >
            <Library className="w-4 h-4 text-ink-muted group-hover:text-brand-600 dark:group-hover:text-amber-400 group-hover:scale-110 transition-transform" />
          </button>

          <div className="h-4 w-px bg-canvas-border mx-0.5 sm:mx-1 flex-shrink-0" />

          {/* Manuscript Title Breadcrumbs */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            {isReaderMode ? (
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-serif font-semibold text-xs sm:text-sm text-ink truncate max-w-[180px] xs:max-w-[280px] sm:max-w-[420px]">
                  {activeNovel?.title || 'Untitled Manuscript'}
                </span>
                <span
                  title={activeReaderName ? `Reviewing as @${activeReaderName}` : 'Invited Reader Review Access'}
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/25 flex-shrink-0"
                >
                  Reader: @{activeReaderName || 'Reader'}
                </span>
              </div>
            ) : isEditingTitle ? (
              <div className="flex items-center gap-1 w-full max-w-xs sm:max-w-md md:max-w-xl">
                <input
                  type="text"
                  autoFocus
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') setIsEditingTitle(false);
                  }}
                  className="px-2 py-0.5 rounded bg-canvas-card border border-brand-500 font-serif font-semibold text-ink text-xs sm:text-sm focus:outline-none shadow-xs w-full"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-1 text-emerald-600 hover:text-emerald-700 flex-shrink-0"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartEditTitle}
                className="font-serif font-semibold text-xs sm:text-sm text-ink hover:text-brand-700 truncate max-w-[180px] xs:max-w-[280px] sm:max-w-[420px] md:max-w-[560px] lg:max-w-[720px] flex items-center gap-1.5 group/title text-left transition-colors cursor-pointer"
                title="Click to rename manuscript"
              >
                <span className="truncate">{activeNovel?.title || 'Untitled Manuscript'}</span>
                <Edit3 className="w-2.5 h-2.5 text-ink-faint opacity-40 group-hover/title:opacity-100 transition-opacity flex-shrink-0 hidden xs:inline" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Light Mode Toggle & Profile Icon (Direct on both Mobile & Desktop) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            id="theme-toggle-btn"
            onClick={(e) => toggleTheme(e)}
            className="p-2 rounded-xl border border-canvas-border bg-canvas-card hover:bg-canvas-hover text-ink-muted hover:text-ink shadow-xs relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-transform active:scale-95 cursor-pointer"
            title={theme === 'light' ? 'Switch to Nocturne Dark Mode' : 'Switch to Retro Light Mode'}
            aria-label={theme === 'light' ? 'Switch to Nocturne Dark Mode' : 'Switch to Retro Light Mode'}
          >
            <div className="w-4 h-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              {theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-600 transition-transform duration-500 transform rotate-0 group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-brand-300 transition-transform duration-500 transform -rotate-12 group-hover:rotate-0" />
              )}
            </div>
          </button>

          {/* Author Profile Icon */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
              className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-canvas-card border text-ink text-xs font-serif shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/30 active:scale-95 ${
                isProfileModalOpen
                  ? 'border-brand-500 ring-2 ring-brand-500/20'
                  : 'border-canvas-border hover:border-brand-500/60 hover:bg-canvas-hover'
              }`}
              title={`Pen Name: ${penName} (Click to manage Profile, Notifications, Settings)`}
              aria-label="Author Profile"
            >
              <div className="w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-600/30 dark:text-brand-300 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={penName} className="w-full h-full object-cover" />
                ) : (
                  penName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="font-semibold hidden lg:inline max-w-[100px] truncate">{penName}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
