import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { Novel, NovelStatus } from '../../types';
import { NewNovelModal } from './NewNovelModal';
import {
  Book,
  Layers,
  Target,
  Edit,
  Trash2,
  FileDown,
  TrendingUp,
} from 'lucide-react';

export const LibraryView: React.FC = () => {
  const novels = useWorkspaceStore((s) => s.novels);
  const openStudio = useWorkspaceStore((s) => s.openStudio);
  const deleteNovel = useWorkspaceStore((s) => s.deleteNovel);
  const setIsExportOpen = useWorkspaceStore((s) => s.setIsExportOpen);
  const setIsDashboardOpen = useWorkspaceStore((s) => s.setIsDashboardOpen);
  const selectNovel = useWorkspaceStore((s) => s.selectNovel);
  const isNewNovelModalOpen = useWorkspaceStore((s) => s.isNewNovelModalOpen);
  const setIsNewNovelModalOpen = useWorkspaceStore((s) => s.setIsNewNovelModalOpen);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);

  const totalWordsAcrossLibrary = novels.reduce((acc, n) => acc + (n.totalWordCount || 0), 0);

  const handleOpenBook = async (novelId: string) => {
    await openStudio(novelId);
  };

  const handleEditBook = (novel: Novel, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNovel(novel);
    setIsModalOpen(true);
  };

  const handleDeleteBook = async (novel: Novel, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to permanently delete "${novel.title}" and all its chapters?`)) {
      await deleteNovel(novel._id);
    }
  };

  const handleExportBook = async (novel: Novel, e: React.MouseEvent) => {
    e.stopPropagation();
    await selectNovel(novel._id);
    setIsExportOpen(true);
  };

  const handleMetricsBook = async (novel: Novel, e: React.MouseEvent) => {
    e.stopPropagation();
    await selectNovel(novel._id);
    setIsDashboardOpen(true);
  };

  const getStatusBadge = (status: NovelStatus) => {
    switch (status) {
      case 'Planning':
        return 'bg-[#faeed1] text-[#7c4a03] border-[#e3c788]';
      case 'In Progress':
        return 'bg-[#dcf0f2] text-[#1b5966] border-[#9ec8ce]';
      case 'First Draft':
        return 'bg-[#e1e9f8] text-[#2e4785] border-[#a8bee7]';
      case 'Revision':
        return 'bg-[#fae6de] text-[#913d1e] border-[#e7b6a4]';
      case 'Completed':
        return 'bg-[#dff0e4] text-[#245b32] border-[#a0cea9]';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-canvas select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Library Desk Hero Banner */}
        <div className="p-6 md:p-8 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 shadow-xs dark:bg-brand-600/20 dark:text-brand-300">
                  <Book className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-700 font-semibold">
                  Personal Atelier & Library
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink tracking-tight">
                Manuscript Shelf
              </h1>
              <p className="text-sm text-ink-muted max-w-xl font-sans leading-relaxed">
                Where stories live, breathe, and mature. Select a manuscript volume below to continue drafting in the prose studio.
              </p>
            </div>

            <div className="flex items-center">
              <div className="px-5 py-3 rounded-xl bg-canvas-surface border border-canvas-border text-left shadow-xs">
                <span className="block text-[10px] font-mono uppercase text-ink-faint font-semibold">Library Output</span>
                <span className="text-xl font-serif font-bold text-ink">
                  {totalWordsAcrossLibrary.toLocaleString()} <span className="text-xs font-mono font-normal text-ink-muted">words</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Book Gallery Grid */}
        {novels.length === 0 ? (
          <div className="py-20 px-6 rounded-2xl bg-canvas-card border border-dashed border-canvas-border text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-canvas-surface border border-canvas-border flex items-center justify-center text-brand-700 mx-auto mb-4 shadow-xs">
              <Book className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-ink mb-1">
              Your Library is Quiet
            </h3>
            <p className="text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
              No manuscripts found on your shelf. Use the Write button in the top navigation bar to start drafting your next story.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {novels.map((novel, idx) => {
              const totalWords = novel.totalWordCount || 0;
              const targetGoal = novel.targetWordCount || 80000;
              const progressPct = Math.min(100, Math.round((totalWords / targetGoal) * 100));

              // Accent spine color variations for visual charm
              const spineColors = [
                'from-[#c2593f] to-[#a2402a]',
                'from-[#b45309] to-[#92400e]',
                'from-[#2e4785] to-[#1e3a8a]',
                'from-[#225744] to-[#14532d]',
                'from-[#86294d] to-[#701a3d]',
              ];
              const spineGradient = spineColors[idx % spineColors.length];

              return (
                <div
                  key={novel._id}
                  onClick={() => handleOpenBook(novel._id)}
                  className="rounded-2xl border border-canvas-border bg-canvas-card hover:border-brand-400/80 transition-all duration-200 shadow-parchment hover:shadow-parchment-lg cursor-pointer group flex flex-col overflow-hidden relative"
                >
                  {/* Decorative embossed top ribbon spine */}
                  <div className={`h-2.5 w-full bg-gradient-to-r ${spineGradient}`} />

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Genre & Status */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-brand-700 font-semibold truncate">
                          {novel.genre}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border tracking-wide uppercase font-medium shadow-xs ${getStatusBadge(
                            novel.status
                          )}`}
                        >
                          {novel.status}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-xl font-serif font-bold text-ink group-hover:text-brand-700 transition-colors line-clamp-2">
                        {novel.title}
                      </h3>
                      {novel.subtitle && (
                        <p className="text-xs text-ink-muted italic font-serif mt-0.5 line-clamp-1">
                          {novel.subtitle}
                        </p>
                      )}

                      <div className="text-xs text-ink-faint font-mono mt-1">
                        By {novel.author || 'Anonymous'}
                      </div>

                      {/* Synopsis excerpt */}
                      {novel.synopsis && (
                        <p className="text-xs text-ink-muted mt-3 line-clamp-2 leading-relaxed font-sans">
                          {novel.synopsis}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar & Word Metrics */}
                    <div className="mt-5 pt-4 border-t border-canvas-border">
                      <div className="flex items-baseline justify-between text-xs font-mono mb-1.5">
                        <span className="text-ink font-semibold">
                          {totalWords.toLocaleString()} <span className="text-ink-faint text-[10px]">words</span>
                        </span>
                        <span className="text-brand-700 font-bold">{progressPct}%</span>
                      </div>

                      <div className="w-full bg-canvas-surface rounded-full h-2 overflow-hidden border border-canvas-border">
                        <div
                          className="bg-gradient-to-r from-amber-600 to-[#c2593f] h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(3, progressPct)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted mt-3">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-ink-faint" />
                          <span>{novel.chapterCount ?? '–'} chapters</span>
                        </span>

                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-ink-faint" />
                          <span>Goal: {targetGoal.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-5 py-2.5 bg-canvas-subtle/50 border-t border-canvas-border flex items-center justify-between text-xs">
                    <span className="text-brand-700 font-serif font-medium group-hover:underline">
                      Open in Studio →
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleMetricsBook(novel, e)}
                        className="p-1.5 rounded-md hover:bg-canvas-hover text-ink-muted hover:text-brand-700 transition-colors"
                        title="View Metrics"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleExportBook(novel, e)}
                        className="p-1.5 rounded-md hover:bg-canvas-hover text-ink-muted hover:text-brand-700 transition-colors"
                        title="Export Manuscript"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleEditBook(novel, e)}
                        className="p-1.5 rounded-md hover:bg-canvas-hover text-ink-muted hover:text-brand-700 transition-colors"
                        title="Edit Book Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteBook(novel, e)}
                        className="p-1.5 rounded-md hover:bg-canvas-hover text-ink-muted hover:text-rose-600 transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Creation / Edit Modal */}
      <NewNovelModal
        isOpen={isModalOpen || isNewNovelModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsNewNovelModalOpen(false);
          setEditingNovel(null);
        }}
        editingNovel={editingNovel}
      />
    </div>
  );
};
