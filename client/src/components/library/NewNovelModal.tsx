import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { Novel, NovelStatus } from '../../types';
import { X, BookPlus, Target, Feather } from 'lucide-react';

interface NewNovelModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingNovel?: Novel | null;
}

export const NewNovelModal: React.FC<NewNovelModalProps> = ({ isOpen, onClose, editingNovel }) => {
  const createNovel = useWorkspaceStore((s) => s.createNovel);
  const updateNovel = useWorkspaceStore((s) => s.updateNovel);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Literary Fiction');
  const [targetWordCount, setTargetWordCount] = useState(80000);
  const [synopsis, setSynopsis] = useState('');
  const [status, setStatus] = useState<NovelStatus>('In Progress');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingNovel) {
      setTitle(editingNovel.title);
      setSubtitle(editingNovel.subtitle || '');
      setAuthor(editingNovel.author || '');
      setGenre(editingNovel.genre || 'General Fiction');
      setTargetWordCount(editingNovel.targetWordCount || 80000);
      setSynopsis(editingNovel.synopsis || '');
      setStatus(editingNovel.status || 'In Progress');
    } else {
      setTitle('');
      setSubtitle('');
      setAuthor('');
      setGenre('Literary Fiction');
      setTargetWordCount(80000);
      setSynopsis('');
      setStatus('In Progress');
    }
  }, [editingNovel, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || (editingNovel ? editingNovel.title : 'Untitled Manuscript');

    setIsSubmitting(true);
    if (editingNovel) {
      await updateNovel(editingNovel._id, {
        title: finalTitle,
        subtitle: subtitle.trim(),
        author: author.trim() || '',
        genre: genre.trim(),
        targetWordCount: Number(targetWordCount),
        synopsis: synopsis.trim(),
        status,
      });
    } else {
      await createNovel({
        title: finalTitle,
        subtitle: subtitle.trim(),
        author: author.trim() || '',
        genre: genre.trim(),
        targetWordCount: Number(targetWordCount),
        synopsis: synopsis.trim(),
        status,
      });
    }

    setIsSubmitting(false);
    onClose();
  };

  const genrePresets = [
    'Literary Fiction',
    'Historical Fiction',
    'Speculative Noir',
    'Sci-Fi / Cyberpunk',
    'Fantasy & Mythos',
    'Mystery & Crime',
    'Gothic Romance',
    'Memoir / Essay',
  ];

  const statuses: NovelStatus[] = ['Planning', 'In Progress', 'First Draft', 'Revision', 'Completed'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment-lg p-4 sm:p-6 text-ink">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-canvas-border">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-600/20 dark:text-brand-300 flex-shrink-0">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-ink">
                {editingNovel ? 'Edit Manuscript Details' : 'Begin a New Book'}
              </h3>
              <p className="text-xs text-ink-muted font-mono">
                {editingNovel ? 'Update title, target goal, or metadata' : 'Set up your novel canvas and target word count'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-canvas-hover text-ink-muted hover:text-ink"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono text-ink-muted mb-1 uppercase font-medium">
              Book Title (Optional)
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional — leave blank to write untitled)"
              className="w-full px-3 py-2 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 font-serif text-base shadow-xs"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-mono text-ink-muted mb-1 uppercase font-medium">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Subtitle (optional)"
              className="w-full px-3 py-2 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-sm shadow-xs"
            />
          </div>

          {/* Author & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-ink-muted mb-1 uppercase font-medium">
                Author Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                className="w-full px-3 py-2 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-sm shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-ink-muted mb-1 uppercase font-medium">
                Project Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NovelStatus)}
                className="w-full px-3 py-2 rounded-lg bg-canvas-card border border-canvas-border text-ink focus:outline-none focus:border-brand-600 text-sm shadow-xs"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Genre and Presets */}
          <div>
            <label className="block text-xs font-mono text-ink-muted mb-1 uppercase font-medium">
              Genre
            </label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Genre"
              className="w-full px-3 py-2 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-sm shadow-xs"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {genrePresets.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-colors shadow-xs ${
                    genre === g
                      ? 'bg-brand-600 border-brand-700 text-white font-medium'
                      : 'bg-canvas-surface border-canvas-border text-ink-muted hover:text-ink hover:bg-canvas-hover'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Target Word Count */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono text-ink-muted uppercase font-medium flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-brand-700" />
                Target Goal Word Count
              </label>
              <span className="text-xs font-mono text-brand-700 font-bold">
                {Number(targetWordCount).toLocaleString()} words
              </span>
            </div>
            <input
              type="number"
              min="1000"
              step="5000"
              value={targetWordCount}
              onChange={(e) => setTargetWordCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-canvas-card border border-canvas-border text-ink font-mono text-sm shadow-xs"
            />
            <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono text-ink-muted">
              <span>Presets:</span>
              <button
                type="button"
                onClick={() => setTargetWordCount(50000)}
                className="underline hover:text-brand-700"
              >
                50k (NaNoWriMo)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setTargetWordCount(80000)}
                className="underline hover:text-brand-700"
              >
                80k (Standard Novel)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setTargetWordCount(110000)}
                className="underline hover:text-brand-700"
              >
                110k (Epic / Fantasy)
              </button>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-xs font-mono text-ink-muted mb-1 uppercase font-medium">
              Premise / Synopsis
            </label>
            <textarea
              rows={3}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Synopsis or premise..."
              className="w-full px-3 py-2 rounded-lg bg-canvas-card border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 text-sm shadow-xs font-sans leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-canvas-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-serif font-medium text-sm transition-all shadow-sm shadow-brand-600/30 disabled:opacity-50"
            >
              <Feather className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Opening Canvas...'
                  : editingNovel
                  ? 'Save Changes'
                  : title.trim()
                  ? 'Create & Start Writing'
                  : 'Start Writing (Untitled)'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
