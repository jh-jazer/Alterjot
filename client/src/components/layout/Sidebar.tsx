import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { Badge } from '../common/Badge';
import {
  Book,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  FileText,
  FolderPlus,
  ArrowUp,
  ArrowDown,
  Search,
  Edit3,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const isSidebarOpen = useWorkspaceStore((s) => s.panelState.isSidebarOpen);
  const activeChapterId = useWorkspaceStore((s) => s.activeChapterId);
  const activeSceneId = useWorkspaceStore((s) => s.activeSceneId);
  const chapters = useWorkspaceStore((s) => s.chapters);
  const scenes = useWorkspaceStore((s) => s.scenes);
  const activeNovel = useWorkspaceStore((s) => s.novels.find((n) => n._id === s.activeNovelId));

  const selectChapter = useWorkspaceStore((s) => s.selectChapter);
  const selectScene = useWorkspaceStore((s) => s.selectScene);
  const createNewChapter = useWorkspaceStore((s) => s.createNewChapter);
  const createNewScene = useWorkspaceStore((s) => s.createNewScene);
  const deleteChapter = useWorkspaceStore((s) => s.deleteChapter);
  const deleteScene = useWorkspaceStore((s) => s.deleteScene);
  const reorderChapters = useWorkspaceStore((s) => s.reorderChapters);
  const reorderScenes = useWorkspaceStore((s) => s.reorderScenes);
  const updateNovel = useWorkspaceStore((s) => s.updateNovel);
  const updateChapterTitle = useWorkspaceStore((s) => s.updateChapterTitle);
  const updateSceneTitle = useWorkspaceStore((s) => s.updateSceneTitle);

  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [treeSearch, setTreeSearch] = useState('');

  const [isEditingNovelTitle, setIsEditingNovelTitle] = useState(false);
  const [tempNovelTitle, setTempNovelTitle] = useState('');

  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [tempChapterTitle, setTempChapterTitle] = useState('');

  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [tempSceneTitle, setTempSceneTitle] = useState('');

  if (!isSidebarOpen) return null;

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: prev[chapterId] !== undefined ? !prev[chapterId] : false,
    }));
  };

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

  const handleStartEditScene = (sc: { _id: string; title: string }, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSceneId(sc._id);
    setTempSceneTitle(sc.title);
  };

  const handleSaveSceneTitle = (sceneId: string) => {
    updateSceneTitle(sceneId, tempSceneTitle.trim() || 'Untitled Scene');
    setEditingSceneId(null);
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= chapters.length) return;

    const reordered = [...chapters];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    reorderChapters(reordered.map((c) => c._id));
  };

  const handleMoveScene = (chapterId: string, index: number, direction: 'up' | 'down') => {
    const chapterScenes = scenes.filter((s) => s.chapterId === chapterId);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= chapterScenes.length) return;

    const reordered = [...chapterScenes];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    reorderScenes(chapterId, reordered.map((s) => s._id));
  };

  return (
    <aside className="w-72 md:w-80 border-r border-canvas-border bg-canvas/95 backdrop-blur-xl flex flex-col h-full z-20 shadow-md select-none">
      {/* Novel Header Info */}
      <div className="p-4 border-b border-canvas-border bg-canvas-subtle/60">
        <div className="flex items-center gap-2 text-brand-700 mb-1">
          <Book className="w-4 h-4" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold">
            {activeNovel?.genre || 'Manuscript'}
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
            className="w-full px-2 py-0.5 rounded bg-canvas-card border border-brand-500 font-serif font-bold text-ink text-base focus:outline-none shadow-xs"
          />
        ) : (
          <h2
            onClick={() => {
              if (!activeNovel) return;
              setTempNovelTitle(activeNovel.title);
              setIsEditingNovelTitle(true);
            }}
            className="font-serif font-bold text-ink text-base truncate cursor-pointer hover:text-brand-700 transition-colors flex items-center justify-between group/title"
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

      {/* Tree Search Bar */}
      <div className="p-2.5 border-b border-canvas-border bg-canvas">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-ink-faint absolute left-2.5 top-2" />
          <input
            type="text"
            value={treeSearch}
            onChange={(e) => setTreeSearch(e.target.value)}
            placeholder="Search chapters & scenes..."
            className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-canvas-card border border-canvas-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 shadow-xs"
          />
        </div>
      </div>

      {/* Chapters & Scenes Tree Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {chapters.map((chapter, chIdx) => {
          const isExpanded = expandedChapters[chapter._id] !== false;
          const chapterScenes = scenes.filter((s) => s.chapterId === chapter._id);
          const chWords = chapterScenes.reduce((acc, s) => acc + (s.wordCount || 0), 0);

          const matchesChapter = chapter.title.toLowerCase().includes(treeSearch.toLowerCase());
          const filteredScenes = treeSearch
            ? chapterScenes.filter(
                (s) =>
                  s.title.toLowerCase().includes(treeSearch.toLowerCase()) ||
                  s.plainText.toLowerCase().includes(treeSearch.toLowerCase())
              )
            : chapterScenes;

          if (treeSearch && !matchesChapter && filteredScenes.length === 0) {
            return null;
          }

          return (
            <div
              key={chapter._id}
              className="rounded-lg border border-canvas-border bg-canvas-card shadow-xs overflow-hidden"
            >
              {/* Chapter Header row */}
              <div
                className={`flex items-center justify-between p-2 hover:bg-canvas-hover transition-colors cursor-pointer group ${
                  activeChapterId === chapter._id ? 'bg-canvas-surface border-l-3 border-brand-600' : ''
                }`}
                onClick={() => {
                  selectChapter(chapter._id);
                  toggleChapter(chapter._id);
                }}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="text-ink-faint">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
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
                      className="text-xs font-serif font-medium text-ink truncate cursor-pointer hover:text-brand-700 transition-colors"
                      title="Double-click to rename chapter"
                    >
                      {chapter.title}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-ink-muted">
                  <span>{chWords.toLocaleString()} w</span>

                  {/* Reorder & actions */}
                  <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                    <button
                      type="button"
                      onClick={(e) => handleStartEditChapter(chapter, e)}
                      className="p-0.5 text-ink-muted hover:text-brand-700"
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
                        createNewScene(chapter._id);
                      }}
                      className="p-0.5 hover:text-brand-800 text-brand-600"
                      title="Add scene to chapter"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete chapter "${chapter.title}" and its scenes?`)) {
                          deleteChapter(chapter._id);
                        }
                      }}
                      className="p-0.5 hover:text-rose-600 text-ink-faint"
                      title="Delete chapter"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Nested Scenes */}
              {isExpanded && (
                <div className="pl-4 pr-1.5 py-1 space-y-1 bg-canvas-subtle/50 border-t border-canvas-border">
                  {filteredScenes.map((scene, sIdx) => (
                    <div
                      key={scene._id}
                      onClick={() => selectScene(scene._id)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-all group/scene ${
                        activeSceneId === scene._id
                          ? 'bg-brand-50 text-brand-900 border border-brand-300 font-medium shadow-xs dark:bg-brand-600/20 dark:text-brand-200 dark:border-brand-500/40'
                          : 'hover:bg-canvas-hover text-ink-muted hover:text-ink'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="w-3 h-3 text-ink-faint flex-shrink-0" />
                        {editingSceneId === scene._id ? (
                          <input
                            type="text"
                            autoFocus
                            value={tempSceneTitle}
                            onChange={(e) => setTempSceneTitle(e.target.value)}
                            onBlur={() => handleSaveSceneTitle(scene._id)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveSceneTitle(scene._id);
                              if (e.key === 'Escape') setEditingSceneId(null);
                            }}
                            className="px-1.5 py-0.5 rounded bg-canvas-card border border-brand-500 font-sans text-ink text-xs focus:outline-none shadow-xs w-full"
                          />
                        ) : (
                          <span
                            onDoubleClick={(e) => handleStartEditScene(scene, e)}
                            className="truncate font-sans hover:text-brand-700 transition-colors"
                            title="Double-click to rename scene"
                          >
                            {scene.title}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Badge status={scene.status} size="sm" />

                        <span className="text-[10px] font-mono text-ink-muted">
                          {scene.wordCount || 0}
                        </span>

                        <div className="hidden group-hover/scene:flex items-center gap-0.5 ml-1">
                          <button
                            type="button"
                            onClick={(e) => handleStartEditScene(scene, e)}
                            className="p-0.5 text-ink-muted hover:text-brand-700"
                            title="Rename scene"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveScene(chapter._id, sIdx, 'up');
                            }}
                            disabled={sIdx === 0}
                            className="p-0.5 text-ink-muted hover:text-ink disabled:opacity-30"
                            title="Move scene up"
                          >
                            <ArrowUp className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveScene(chapter._id, sIdx, 'down');
                            }}
                            disabled={sIdx === filteredScenes.length - 1}
                            className="p-0.5 text-ink-muted hover:text-ink disabled:opacity-30"
                            title="Move scene down"
                          >
                            <ArrowDown className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete scene "${scene.title}"?`)) {
                                deleteScene(scene._id);
                              }
                            }}
                            className="p-0.5 hover:text-rose-600 text-ink-faint"
                            title="Delete scene"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => createNewScene(chapter._id)}
                    className="w-full flex items-center justify-center gap-1 py-1 text-[11px] font-mono text-ink-muted hover:text-brand-700 hover:bg-canvas-hover rounded transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Scene</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
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
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-canvas-border hover:border-brand-600 text-ink-muted hover:text-brand-700 text-xs font-mono transition-all bg-canvas-card/50 shadow-xs"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ New Chapter</span>
          </button>
        )}
      </div>
    </aside>
  );
};
