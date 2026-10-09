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
  Search,
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

  const librarySearchQuery = useWorkspaceStore((s) => s.librarySearchQuery);
  const setLibrarySearchQuery = useWorkspaceStore((s) => s.setLibrarySearchQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);

  const totalWordsAcrossLibrary = novels.reduce((acc, n) => acc + (n.totalWordCount || 0), 0);

  const filteredNovels = novels.filter((novel) => {
    if (!librarySearchQuery.trim()) return true;
    const q = librarySearchQuery.toLowerCase();
    return (
      (novel.title && novel.title.toLowerCase().includes(q)) ||
      (novel.subtitle && novel.subtitle.toLowerCase().includes(q)) ||
      (novel.genre && novel.genre.toLowerCase().includes(q)) ||
      (novel.status && novel.status.toLowerCase().includes(q)) ||
      (novel.synopsis && novel.synopsis.toLowerCase().includes(q)) ||
      (novel.author && novel.author.toLowerCase().includes(q))
    );
  });

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
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none">
      {/* Clean centered container with generous white space on left and right */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 sm:py-10 space-y-10">
        
        {/* Library Desk Hero Banner (matching Dashboard cinematic dark card aesthetic) */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2c221a] via-[#211a14] to-[#16120e] text-white p-6 sm:p-7 shadow-xl border border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Ambient soft glow */}
          <div className="absolute right-0 top-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                Atelier Shelf Collection
              </span>
              <span className="text-xs font-mono text-neutral-400">
                • {novels.length} {novels.length === 1 ? 'Volume' : 'Volumes'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Your Manuscript Archive
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-serif max-w-xl leading-relaxed">
              Every volume resting upon your private study desk. Continue drafts in the studio or export ready manuscripts.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 relative z-10">
            {/* Library Output Metric Pill */}
            <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-left backdrop-blur-xs">
              <span className="block text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                Total Words
              </span>
              <span className="text-lg font-serif font-bold text-amber-300">
                {totalWordsAcrossLibrary.toLocaleString()}{' '}
                <span className="text-[11px] font-mono font-normal text-neutral-400">words</span>
              </span>
            </div>

            {/* New Manuscript Button */}
            <button
              type="button"
              onClick={() => setIsNewNovelModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-mono font-semibold uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              + New Book
            </button>
          </div>
        </div>

        {/* Active Search Results Indicator */}
        {librarySearchQuery && (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-canvas-card border border-canvas-border text-xs font-mono text-ink-muted shadow-xs">
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-brand-600" />
              <span>
                Found <strong className="text-ink">{filteredNovels.length}</strong> {filteredNovels.length === 1 ? 'manuscript' : 'manuscripts'} matching &ldquo;<span className="text-brand-700">{librarySearchQuery}</span>&rdquo;
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLibrarySearchQuery('')}
              className="text-xs font-mono text-brand-600 hover:text-brand-700 underline cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Manuscript Shelf Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight">
              Volumes on Shelf
            </h2>
            <span className="text-xs font-mono text-ink-muted">
              Click any volume to open in Studio
            </span>
          </div>

          {novels.length === 0 ? (
            <div className="py-20 px-6 rounded-2xl bg-canvas-card border border-dashed border-canvas-border text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-canvas-surface border border-canvas-border flex items-center justify-center text-brand-700 mx-auto mb-4 shadow-xs">
                <Book className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-ink mb-1">
                Your Library is Quiet
              </h3>
              <p className="text-sm text-ink-muted max-w-md mx-auto leading-relaxed font-sans mb-5">
                No manuscripts found on your shelf. Start drafting with quick-write or build a new story volume.
              </p>
              <button
                type="button"
                onClick={() => setIsNewNovelModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Create First Manuscript
              </button>
            </div>
          ) : filteredNovels.length === 0 ? (
            <div className="py-20 px-6 rounded-2xl bg-canvas-card border border-dashed border-canvas-border text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-canvas-surface border border-canvas-border flex items-center justify-center text-ink-muted mx-auto mb-3 shadow-xs">
                <Search className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-ink mb-1">
                No Matching Manuscripts
              </h3>
              <p className="text-sm text-ink-muted max-w-md mx-auto mb-4 leading-relaxed font-sans">
                We couldn&apos;t find any manuscripts matching &ldquo;{librarySearchQuery}&rdquo;. Try another title, genre, or premise keyword.
              </p>
              <button
                type="button"
                onClick={() => setLibrarySearchQuery('')}
                className="px-4 py-2 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-xs font-mono font-medium text-ink shadow-xs transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNovels.map((novel, idx) => {
                const totalWords = novel.totalWordCount || 0;
                const targetGoal = novel.targetWordCount || 80000;
                const progressPct = Math.min(100, Math.round((totalWords / targetGoal) * 100));

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
                    className="rounded-2xl border border-canvas-border bg-canvas-card hover:border-brand-500/70 transition-all duration-200 shadow-parchment hover:shadow-parchment-lg cursor-pointer group flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Top ribbon accent */}
                    <div className={`h-2.5 w-full bg-gradient-to-r ${spineGradient}`} />

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Genre & Status */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-700 font-semibold truncate">
                            {novel.genre}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded-full border tracking-wide uppercase font-medium shadow-xs ${getStatusBadge(
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

                        <div className="text-[11px] text-ink-faint font-mono mt-1">
                          By {novel.author || 'Anonymous'}
                        </div>

                        {/* Synopsis */}
                        {novel.synopsis && (
                          <p className="text-xs text-ink-muted mt-2.5 line-clamp-2 leading-relaxed font-sans">
                            {novel.synopsis}
                          </p>
                        )}
                      </div>

                      {/* Progress Bar & Word Metrics */}
                      <div className="mt-5 pt-3.5 border-t border-canvas-border">
                        <div className="flex items-baseline justify-between text-xs font-mono mb-1.5">
                          <span className="text-ink font-semibold">
                            {totalWords.toLocaleString()} <span className="text-ink-faint text-[10px]">words</span>
                          </span>
                          <span className="text-brand-700 font-bold">{progressPct}%</span>
                        </div>

                        <div className="w-full bg-canvas-surface rounded-full h-1.5 overflow-hidden border border-canvas-border/60">
                          <div
                            className="bg-brand-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(3, progressPct)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mt-2.5">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3 text-ink-faint" />
                            <span>{novel.chapterCount ?? 1} chapters</span>
                          </span>

                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-ink-faint" />
                            <span>Goal: {targetGoal.toLocaleString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="px-5 py-2.5 bg-canvas-surface/70 border-t border-canvas-border flex items-center justify-between text-xs">
                      <span className="text-brand-700 font-serif font-semibold text-xs group-hover:underline">
                        Open in Studio →
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleMetricsBook(novel, e)}
                          className="p-1.5 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-brand-700 transition-colors"
                          title="View Metrics"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleExportBook(novel, e)}
                          className="p-1.5 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-brand-700 transition-colors"
                          title="Export Manuscript"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleEditBook(novel, e)}
                          className="p-1.5 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-brand-700 transition-colors"
                          title="Edit Book Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteBook(novel, e)}
                          className="p-1.5 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-rose-600 transition-colors"
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
        </section>
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
