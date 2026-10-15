import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Novel } from '../../types';
import { Globe, X, ArrowRight, Sparkles, Star, Eye } from 'lucide-react';
import { BookCover } from '../common/BookCover';

interface PublishSuccessModalProps {
  novel: Novel | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PublishSuccessModal: React.FC<PublishSuccessModalProps> = ({
  novel,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !novel) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-canvas-card border border-canvas-border rounded-2xl shadow-parchment-2xl overflow-hidden animate-scaleUp">
        {/* Glow Accent Header */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-brand-500" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-ink-muted hover:text-ink rounded-lg bg-canvas-surface hover:bg-canvas-hover border border-canvas-border transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold shadow-2xs mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Published to Explore</span>
          </div>

          {/* Book Preview */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-28 aspect-[2/3] rounded-sm overflow-hidden shadow-parchment-lg border border-black/20 dark:border-white/10 bg-neutral-900 mx-auto">
              <BookCover
                title={novel.title}
                author={novel.author}
                genre={novel.genre}
                coverImage={novel.coverImage}
                size="full"
              />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-ink">
                {novel.title}
              </h3>
              <p className="text-xs text-ink-muted font-mono mt-0.5">
                by {novel.author || 'Anonymous'} • {novel.genre}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed max-w-xs mx-auto">
            Your volume is now live on the global <strong className="text-ink font-semibold">Explore</strong> shelf. Readers can now discover, read, and rate your work.
          </p>

          {/* Live Shelf Highlights */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-ink-muted bg-canvas-surface/60 border border-canvas-border/80 p-2.5 rounded-xl">
            <div className="flex items-center justify-center gap-1.5">
              <Star className="w-3 h-3 text-amber-500" />
              <span>Open for Ratings</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Eye className="w-3 h-3 text-emerald-600" />
              <span>Live View Tracking</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/explore');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98"
            >
              <Globe className="w-4 h-4" />
              <span>View on Explore Shelf</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink font-mono text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
