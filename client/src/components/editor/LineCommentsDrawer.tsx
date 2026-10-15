import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  X,
  MessageSquare,
  Send,
  Trash2,
  User,
  Quote,
  Sparkles,
  Check,
} from 'lucide-react';

export const LineCommentsDrawer: React.FC = () => {
  const isLineCommentsOpen = useWorkspaceStore((s) => s.isLineCommentsOpen);
  const closeLineComments = useWorkspaceStore((s) => s.closeLineComments);
  const activeCommentLine = useWorkspaceStore((s) => s.activeCommentLine);
  const lineComments = useWorkspaceStore((s) => s.lineComments);
  const addLineComment = useWorkspaceStore((s) => s.addLineComment);
  const deleteLineComment = useWorkspaceStore((s) => s.deleteLineComment);
  const isReaderMode = useWorkspaceStore((s) => s.isReaderMode);
  const activeReaderName = useWorkspaceStore((s) => s.activeReaderName);
  const penName = useWorkspaceStore((s) => s.penName);
  const activeChapterId = useWorkspaceStore((s) => s.activeChapterId);
  const chapters = useWorkspaceStore((s) => s.chapters);
  const activeChapter = chapters.find((c) => c._id === activeChapterId);

  const [commentText, setCommentText] = useState('');
  const [justPosted, setJustPosted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Auto-focus textarea when opening
  useEffect(() => {
    if (isLineCommentsOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    }
  }, [isLineCommentsOpen, activeCommentLine?.lineText]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLineCommentsOpen) {
        closeLineComments();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLineCommentsOpen, closeLineComments]);

  if (!isLineCommentsOpen || !activeCommentLine) return null;

  // Filter comments specifically for this line
  const matchingComments = lineComments.filter(
    (c) =>
      c.lineText.trim() === activeCommentLine.lineText.trim() ||
      (c.lineFrom === activeCommentLine.lineFrom && c.lineTo === activeCommentLine.lineTo)
  );

  const currentCommenter = isReaderMode
    ? activeReaderName || 'Invited Reader'
    : penName || 'Author';

  const handlePostComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = commentText.trim();
    if (!clean) return;

    addLineComment({
      novelId: activeCommentLine.novelId,
      chapterId: activeCommentLine.chapterId,
      lineFrom: activeCommentLine.lineFrom,
      lineTo: activeCommentLine.lineTo,
      lineText: activeCommentLine.lineText,
      authorPenName: currentCommenter,
      content: clean,
    });

    setCommentText('');
    setJustPosted(true);
    setTimeout(() => {
      setJustPosted(false);
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handlePostComment();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Line Comments Drawer"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] md:w-[460px] bg-canvas-card border-l border-canvas-border shadow-parchment-2xl flex flex-col overflow-hidden text-ink animate-slideLeft"
    >
      {/* Top Accent Strip in Reader Orange */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-canvas-border bg-canvas-surface/40 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/25 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-sm sm:text-base text-ink truncate">
                Line Comments & Feedback
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/25">
                {matchingComments.length}
              </span>
            </div>
            <p className="text-[11px] text-ink-muted font-mono truncate mt-0.5">
              {activeChapter?.title || 'Current Chapter'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={closeLineComments}
          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors cursor-pointer"
          title="Close comments drawer (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Target Line Excerpt */}
      <div className="p-4 bg-canvas-surface/60 border-b border-canvas-border flex-shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold mb-1.5">
          <Quote className="w-3 h-3" />
          <span>Selected Line:</span>
        </div>
        <div className="pl-3 border-l-2 border-orange-500/70 text-xs sm:text-sm font-serif italic text-ink leading-relaxed line-clamp-3 bg-canvas-card/60 p-2 rounded-r-lg">
          "{activeCommentLine.lineText}"
        </div>
      </div>

      {/* Comments List (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
        {matchingComments.length === 0 ? (
          <div className="py-10 px-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center mx-auto shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-semibold text-xs sm:text-sm text-ink">
              No Comments on this Line Yet
            </h4>
            <p className="text-xs text-ink-muted font-sans max-w-xs mx-auto leading-relaxed">
              {isReaderMode
                ? 'Be the first to share your thoughts, critique, or reaction with the author.'
                : 'Your readers will be able to leave line-level feedback right here.'}
            </p>
          </div>
        ) : (
          matchingComments.map((comment) => {
            const isMe =
              comment.authorPenName.toLowerCase() === currentCommenter.toLowerCase();

            return (
              <div
                key={comment.id}
                className="p-3.5 rounded-xl bg-canvas-surface border border-canvas-border shadow-2xs space-y-2 group transition-all hover:border-orange-500/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300 font-serif font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                      {comment.authorPenName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-serif font-semibold text-xs text-ink truncate">
                      {comment.authorPenName}
                    </span>
                    {isMe && (
                      <span className="text-[9px] font-mono font-bold text-orange-600 dark:text-orange-400">
                        (You)
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-canvas-card border border-canvas-border text-ink-muted">
                      {comment.authorPenName === (penName || 'Ernest Quill')
                        ? 'Author'
                        : 'Reader'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-mono text-ink-faint">
                      {new Date(comment.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteLineComment(comment.id)}
                      className="p-1 rounded text-ink-faint hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-sans text-ink leading-relaxed whitespace-pre-wrap pl-8">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Comment Input Composer (Fixed at Bottom) */}
      <div className="p-4 border-t border-canvas-border bg-canvas-surface/80 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
          <span className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-orange-600 dark:text-orange-400" />
            Posting as: <strong className="text-ink">{currentCommenter}</strong>
          </span>
          <span className="text-ink-faint hidden xs:inline">Cmd+Enter to post</span>
        </div>

        <form onSubmit={handlePostComment} className="space-y-2">
          <textarea
            ref={textareaRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            rows={3}
            placeholder={
              isReaderMode
                ? 'Write your feedback or note on this line for the author...'
                : 'Reply or add an author annotation on this line...'
            }
            className="w-full p-3 rounded-xl bg-canvas-card border border-canvas-border text-ink text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all resize-none shadow-2xs placeholder:text-ink-faint"
          />

          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-ink-faint">
              {commentText.length} characters
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeLineComments}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-serif font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                {justPosted ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Posted!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Comment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
