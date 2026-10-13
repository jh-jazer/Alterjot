import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
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
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const isSidebarOpen = useWorkspaceStore((s) => s.panelState.isSidebarOpen);
  const toggleSidebar = useWorkspaceStore((s) => s.toggleSidebar);
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

  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [treeSearch, setTreeSearch] = useState('');

  const [isEditingNovelTitle, setIsEditingNovelTitle] = useState(false);
  const [tempNovelTitle, setTempNovelTitle] = useState('');

  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [tempChapterTitle, setTempChapterTitle] = useState('');

  if (!isSidebarOpen) return null;

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNewChapter(newChapterTitle.trim() || undefined);
    setNewChapterTitle('');
    setIsAddingChapter(false);
  };

  const handleSaveNovelTitle = () => {
    if (!activeNovel) return;
    const finalTitle = tempNovelTitle.trim() || 'Untitled Manuscript';
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

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden animate-fadeIn"
        onClick={toggleSidebar}
        title="Close Manuscript Tree"
      />

      <aside className="fixed md:relative inset-y-0 left-0 z-40 w-4/5 max-w-xs md:max-w-none md:w-80 border-r border-canvas-border bg-canvas flex flex-col h-full shadow-2xl md:shadow-md select-none animate-in slide-in-from-left duration-200">
        {/* Novel Header Info */}
        <div className="p-4 border-b border-canvas-border bg-canvas-subtle/60">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-brand-700">
              <Book className="w-4 h-4" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold">
                {activeNovel?.genre || 'Manuscript'}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              className="md:hidden p-1 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-ink transition-colors"
              title="Close Tree"
            >
              <X className="w-4 h-4" />
            </button>
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
              className="w-full px-2 py-0.5 rounded bg-canvas-card border border-brand-500 font-serif font-bold text-ink text-base focus:outline-none shadow-xs"
            />
          ) : (
            <h2
              onClick={() => {
                if (!activeNovel) return;
                setTempNovelTitle(activeNovel.title);
                setIsEditingNovelTitle(true);
              }}
              className="font-serif font-bold text-ink text-base truncate cursor-pointer hover:text-brand-700 dark:hover:text-amber-400 transition-colors flex items-center justify-between group/title"
              title="Click to rename manuscript"
            >
              <span className="truncate">{activeNovel?.title || 'Untitled Manuscript'}</span>
              <Edit3 className="w-3 h-3 text-ink-faint opacity-40 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
            </h2>
          )}
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted mt-1">
            <span>{activeNovel?.totalWordCount?.toLocaleString() || 0} total words</span>
            <span className="text-brand-700 font-medium">
              {Math.round(((activeNovel?.totalWordCount || 0) / (activeNovel?.targetWordCount || 80000)) * 100)}% goal
            </span>
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
                onClick={() => {
                  selectChapter(chapter._id);
                  if (window.innerWidth < 768) toggleSidebar();
                }}
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
                      className="p-0.5 text-ink-muted hover:text-brand-700 dark:hover:text-amber-300"
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
                      className="p-0.5 text-ink-muted hover:text-ink disabled:opacity-30"
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
                      className="p-0.5 text-ink-muted hover:text-ink disabled:opacity-30"
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
                      className="p-0.5 hover:text-rose-600 dark:hover:text-rose-400 text-ink-faint"
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
              {treeSearch ? 'No chapters found.' : 'No chapters yet. Click "+ New Chapter" below to begin.'}
            </div>
          )}
        </div>

        {/* Add Chapter footer */}
        <div className="p-3 border-t border-canvas-border bg-canvas-subtle/50">
          {isAddingChapter ? (
            <form onSubmit={handleCreateChapter} className="space-y-2">
              <input
                type="text"
                autoFocus
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                placeholder="Chapter title (optional)"
                className="w-full px-2.5 py-1.5 rounded-lg bg-canvas-card border border-canvas-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 shadow-xs"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium shadow-xs"
                >
                  {newChapterTitle.trim() ? 'Add Chapter' : 'Add Chapter (Untitled)'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingChapter(false)}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-canvas-hover text-ink-muted text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingChapter(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-canvas-border hover:border-brand-600 text-ink-muted hover:text-brand-700 dark:hover:text-amber-400 text-xs font-mono transition-all bg-canvas-card/50 shadow-xs cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>+ New Chapter</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
