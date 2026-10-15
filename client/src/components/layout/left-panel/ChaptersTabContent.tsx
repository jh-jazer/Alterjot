import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';
import {
  Book,
  Trash2,
  FileText,
  FolderPlus,
  ArrowUp,
  ArrowDown,
  Search,
  Edit3,
  X,
  Target,
} from 'lucide-react';

export const ChaptersTabContent: React.FC = () => {
  const activeChapterId = useWorkspaceStore((s) => s.activeChapterId);
  const chapters = useWorkspaceStore((s) => s.chapters);
  const scenes = useWorkspaceStore((s) => s.scenes);
  const activeNovel = useWorkspaceStore((s) => s.novels.find((n) => n._id === s.activeNovelId));

  const selectChapter = useWorkspaceStore((s) => s.selectChapter);
  const createNewChapter = useWorkspaceStore((s) => s.createNewChapter);
  const deleteChapter = useWorkspaceStore((s) => s.deleteChapter);
  const reorderChapters = useWorkspaceStore((s) => s.reorderChapters);
  const updateNovel = useWorkspaceStore((s) => s.updateNovel);
  const updateChapterTitle = useWorkspaceStore((s) => s.updateChapterTitle);

  const [treeSearch, setTreeSearch] = useState('');
  const [isEditingNovelTitle, setIsEditingNovelTitle] = useState(false);
  const [tempNovelTitle, setTempNovelTitle] = useState('');

  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [tempChapterTitle, setTempChapterTitle] = useState('');

  const handleCreateChapter = async () => {
    const newCh = await createNewChapter();
    if (newCh) {
      selectChapter(newCh._id);
    }
  };

  const handleSaveNovelTitle = () => {
    if (!activeNovel) return;
    const finalTitle = tempNovelTitle.trim() || 'Untitled Book';
    updateNovel(activeNovel._id, { title: finalTitle });
    setIsEditingNovelTitle(false);
  };

  const handleStartEditChapter = (ch: { _id: string; title: string }, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingChapterId(ch._id);
    setTempChapterTitle(ch.title);
  };

  const handleSaveChapterTitle = (chapterId: string) => {
    updateChapterTitle(chapterId, tempChapterTitle.trim() || 'Untitled Chapter');
    setEditingChapterId(null);
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= chapters.length) return;

    const reordered = [...chapters];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    reorderChapters(reordered.map((c) => c._id));
  };

  const filteredChapters = treeSearch
    ? chapters.filter((c) => c.title.toLowerCase().includes(treeSearch.toLowerCase()))
    : chapters;

  const totalWords = activeNovel?.totalWordCount || 0;
  const targetWords = activeNovel?.targetWordCount || 80000;
  const progressPct = Math.min(100, Math.round((totalWords / targetWords) * 100));

  return (
    <div className="flex flex-col h-full bg-canvas select-none">
      {/* Novel Header Info & Progress */}
      <div className="p-3.5 border-b border-canvas-border bg-canvas-subtle/50">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-brand-700 dark:text-amber-400">
            <Book className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faint font-semibold">
              {activeNovel?.genre || 'Book'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-ink-muted">
            {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}
          </span>
        </div>

        {isEditingNovelTitle ? (
          <input
            type="text"
            autoFocus
            value={tempNovelTitle}
            onChange={(e) => setTempNovelTitle(e.target.value)}
            onBlur={handleSaveNovelTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveNovelTitle();
              if (e.key === 'Escape') setIsEditingNovelTitle(false);
            }}
            className="w-full px-2 py-0.5 rounded bg-canvas-card border border-brand-500 font-serif font-bold text-ink text-sm focus:outline-none shadow-xs"
          />
        ) : (
          <h2
            onClick={() => {
              if (!activeNovel) return;
              setTempNovelTitle(activeNovel.title);
              setIsEditingNovelTitle(true);
            }}
            className="font-serif font-bold text-ink text-sm truncate cursor-pointer hover:text-brand-700 dark:hover:text-amber-400 transition-colors flex items-center justify-between group/title"
            title="Click to rename book"
          >
            <span className="truncate">{activeNovel?.title || 'Untitled Book'}</span>
            <Edit3 className="w-3 h-3 text-ink-faint opacity-40 group-hover/title:opacity-100 transition-opacity flex-shrink-0 ml-1.5" />
          </h2>
        )}

        {/* Word count & Goal Progress Bar */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
            <span>{totalWords.toLocaleString()} total words</span>
            <span className="text-brand-700 dark:text-amber-400 font-medium flex items-center gap-1">
              <Target className="w-3 h-3" />
              {progressPct}% goal
            </span>
          </div>
          <div className="w-full h-1 bg-canvas-card border border-canvas-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chapters Search Bar */}
      <div className="p-2.5 border-b border-canvas-border bg-canvas">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-ink-faint absolute left-2.5 top-2" />
          <input
            type="text"
            value={treeSearch}
            onChange={(e) => setTreeSearch(e.target.value)}
            placeholder="Search chapters..."
            className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-canvas-card border border-canvas-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 shadow-xs"
          />
          {treeSearch && (
            <button
              type="button"
              onClick={() => setTreeSearch('')}
              className="absolute right-2 top-1.5 text-ink-faint hover:text-ink"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Chapters List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredChapters.map((chapter, chIdx) => {
          const isActive = activeChapterId === chapter._id;
          const chapterScenes = scenes.filter((s) => s.chapterId === chapter._id);
          const chWords =
            chapterScenes.reduce((acc, s) => acc + (s.wordCount || 0), 0) || chapter.totalWordCount || 0;

          return (
            <div
              key={chapter._id}
              onClick={() => selectChapter(chapter._id)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all group ${
                isActive
                  ? 'bg-brand-50 text-brand-950 border-brand-300 font-medium shadow-xs dark:bg-amber-500/15 dark:border-amber-400/50 dark:text-white dark:shadow-[0_0_12px_rgba(245,158,11,0.12)]'
                  : 'bg-canvas-card border-canvas-border hover:bg-canvas-hover text-ink-muted hover:text-ink'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-brand-600 dark:text-amber-400' : 'text-ink-faint group-hover:text-ink-muted'
                  }`}
                />
                {editingChapterId === chapter._id ? (
                  <input
                    type="text"
                    autoFocus
                    value={tempChapterTitle}
                    onChange={(e) => setTempChapterTitle(e.target.value)}
                    onBlur={() => handleSaveChapterTitle(chapter._id)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveChapterTitle(chapter._id);
                      if (e.key === 'Escape') setEditingChapterId(null);
                    }}
                    className="px-1.5 py-0.5 rounded bg-canvas-card border border-brand-500 font-serif font-medium text-ink text-xs focus:outline-none shadow-xs w-full"
                  />
                ) : (
                  <span
                    onDoubleClick={(e) => handleStartEditChapter(chapter, e)}
                    className={`truncate font-serif transition-colors ${
                      isActive
                        ? 'font-semibold text-brand-950 dark:text-white dark:hover:text-amber-200'
                        : 'font-medium text-ink hover:text-brand-700 dark:hover:text-amber-300'
                    }`}
                    title="Double-click to rename chapter"
                  >
                    {chapter.title}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className={`text-[10px] font-mono transition-colors ${
                    isActive
                      ? 'text-brand-800 dark:text-amber-200/90 font-medium'
                      : 'text-ink-muted'
                  }`}
                >
                  {chWords.toLocaleString()} w
                </span>

                <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                  <button
                    type="button"
                    onClick={(e) => handleStartEditChapter(chapter, e)}
                    className="p-0.5 text-ink-muted hover:text-brand-700 dark:hover:text-amber-300 transition-colors"
                    title="Rename chapter"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveChapter(chIdx, 'up');
                    }}
                    disabled={chIdx === 0}
                    className="p-0.5 text-ink-muted hover:text-ink disabled:opacity-30 transition-colors"
                    title="Move chapter up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveChapter(chIdx, 'down');
                    }}
                    disabled={chIdx === chapters.length - 1}
                    className="p-0.5 text-ink-muted hover:text-ink disabled:opacity-30 transition-colors"
                    title="Move chapter down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete chapter "${chapter.title}"?`)) {
                        deleteChapter(chapter._id);
                      }
                    }}
                    className="p-0.5 hover:text-rose-600 dark:hover:text-rose-400 text-ink-faint transition-colors"
                    title="Delete chapter"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredChapters.length === 0 && (
          <div className="text-center py-8 px-4 text-xs text-ink-faint font-sans">
            {treeSearch ? 'No chapters found matching search.' : 'No chapters yet. Click "+ New Chapter" below to begin.'}
          </div>
        )}
      </div>

      {/* Add Chapter Footer */}
      <div className="p-3 border-t border-canvas-border bg-canvas-subtle/50">
        <button
          type="button"
          onClick={handleCreateChapter}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-canvas-border hover:border-brand-600 text-ink-muted hover:text-brand-700 dark:hover:text-amber-400 text-xs font-mono transition-all bg-canvas-card/60 hover:bg-canvas-card shadow-xs cursor-pointer active:scale-[0.99]"
          title="Create new chapter"
        >
          <FolderPlus className="w-4 h-4" />
          <span>+ New Chapter</span>
        </button>
      </div>
    </div>
  );
};
