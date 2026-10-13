import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  ChevronDown,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
} from 'lucide-react';
import type { Scene, SceneStatus, SceneMetadata } from '../../types';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

interface SceneNotesDeckProps {
  scene: Scene;
  onChange?: (metadata: Partial<SceneMetadata>, status?: SceneStatus) => void;
}

export const SceneNotesDeck: React.FC<SceneNotesDeckProps> = ({ scene }) => {
  const chapters = useWorkspaceStore((s) => s.chapters);
  const activeChapterId = useWorkspaceStore((s) => s.activeChapterId);
  const selectChapter = useWorkspaceStore((s) => s.selectChapter);
  const createNewChapter = useWorkspaceStore((s) => s.createNewChapter);
  const updateChapterTitle = useWorkspaceStore((s) => s.updateChapterTitle);
  const updateSceneTitle = useWorkspaceStore((s) => s.updateSceneTitle);

  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeChapterIndex = chapters.findIndex((c) => c._id === activeChapterId);
  const currentChapter = chapters[activeChapterIndex] || chapters[0];
  const defaultChapterNumber = `Chapter ${activeChapterIndex >= 0 ? activeChapterIndex + 1 : 1}`;

  // If the title is just the default "Chapter 1", "Chapter 2", etc., do not duplicate it
  const rawTitle = (currentChapter?.title || scene.title || '').trim();
  const isDefaultNumbered =
    !rawTitle ||
    rawTitle.toLowerCase() === defaultChapterNumber.toLowerCase() ||
    /^chapter\s+\d+$/i.test(rawTitle);
  const customSubtitle = isDefaultNumbered ? '' : rawTitle;

  // Close chapter dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsChapterMenuOpen(false);
      }
    };
    if (isChapterMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isChapterMenuOpen]);

  const handleTitleChange = (val: string) => {
    const finalTitle = val.trim() ? val : defaultChapterNumber;
    if (currentChapter) {
      updateChapterTitle(currentChapter._id, finalTitle);
    }
    updateSceneTitle(scene._id, finalTitle);
  };

  const handleCreateNew = async () => {
    const newCh = await createNewChapter();
    if (newCh) {
      selectChapter(newCh._id);
      setIsChapterMenuOpen(false);
    }
  };

  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      selectChapter(chapters[activeChapterIndex - 1]._id);
    }
  };

  const handleNextChapter = () => {
    if (activeChapterIndex < chapters.length - 1) {
      selectChapter(chapters[activeChapterIndex + 1]._id);
    }
  };

  return (
    <div className="border-b border-canvas-border bg-canvas-subtle/70 px-3 sm:px-6 py-2 transition-colors flex items-center justify-between gap-3 text-xs select-none">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Chapter Switcher Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsChapterMenuOpen(!isChapterMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-ink text-xs font-mono font-medium shadow-2xs transition-colors cursor-pointer group"
            title="Click to switch or manage chapters"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400 flex-shrink-0" />
            <span className="font-semibold truncate max-w-[120px] sm:max-w-[160px]">
              {`Chapter ${activeChapterIndex >= 0 ? activeChapterIndex + 1 : 1}`}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-ink-faint group-hover:text-ink transition-transform ${
                isChapterMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Chapters Dropdown Menu */}
          {isChapterMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-canvas-card border border-canvas-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-canvas-border/60 pb-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-ink uppercase tracking-wider">
                  <span>Chapters</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-canvas-subtle text-ink-muted font-normal">
                    {chapters.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-mono font-medium transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Chapter</span>
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1 pr-0.5">
                {chapters.map((ch, idx) => {
                  const isCurrent = ch._id === (currentChapter?._id || activeChapterId);
                  return (
                    <button
                      key={ch._id}
                      type="button"
                      onClick={() => {
                        selectChapter(ch._id);
                        setIsChapterMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-brand-500/15 border border-brand-500/30 text-brand-900 dark:text-amber-200 font-semibold'
                          : 'hover:bg-canvas-hover text-ink border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-canvas-subtle text-ink-muted text-[10px] font-mono flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate font-serif">{ch.title || `Chapter ${idx + 1}`}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <span className="text-canvas-border select-none">|</span>

        {/* Editable Chapter Title */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0 group/title">
          <input
            type="text"
            value={customSubtitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Add title (optional)..."
            className="w-full max-w-sm px-2 py-1 rounded-lg bg-transparent hover:bg-canvas-card focus:bg-canvas-card border border-transparent hover:border-canvas-border/60 focus:border-brand-500 font-serif font-semibold text-xs sm:text-sm text-ink placeholder:text-ink-faint focus:outline-none transition-colors"
            title="Add or edit custom chapter title"
          />
          <Edit3 className="w-3 h-3 text-ink-faint opacity-0 group-hover/title:opacity-60 transition-opacity flex-shrink-0 hidden sm:inline" />
        </div>
      </div>

      {/* Steppers & New Chapter Quick Action */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={handlePrevChapter}
          disabled={activeChapterIndex <= 0}
          className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-canvas-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Previous Chapter"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <span className="text-[11px] font-mono text-ink-muted px-1">
          {activeChapterIndex >= 0 ? activeChapterIndex + 1 : 1} / {chapters.length}
        </span>

        <button
          type="button"
          onClick={handleNextChapter}
          disabled={activeChapterIndex >= chapters.length - 1}
          className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-canvas-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Next Chapter"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleCreateNew}
          className="ml-1 flex items-center gap-1 px-2 py-1 rounded-lg bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-[11px] font-mono text-ink transition-colors cursor-pointer"
          title="Create New Chapter"
        >
          <Plus className="w-3 h-3 text-brand-600 dark:text-amber-400" />
          <span className="hidden md:inline">Chapter</span>
        </button>
      </div>
    </div>
  );
};
