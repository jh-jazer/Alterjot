import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { Novel, InvitedReader } from '../../types';
import { TOP_10_AUTHORS } from '../../data/communityData';
import {
  X,
  UserPlus,
  Search,
  Check,
  User,
  Trash2,
  Mail,
  Sparkles,
  ShieldCheck,
  Eye,
} from 'lucide-react';

interface InviteReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  novel: Novel;
}

export const InviteReaderModal: React.FC<InviteReaderModalProps> = ({
  isOpen,
  onClose,
  novel,
}) => {
  const navigate = useNavigate();
  const inviteReaderToNovel = useWorkspaceStore((s) => s.inviteReaderToNovel);
  const removeInvitedReader = useWorkspaceStore((s) => s.removeInvitedReader);
  const setIsReaderMode = useWorkspaceStore((s) => s.setIsReaderMode);
  const selectNovel = useWorkspaceStore((s) => s.selectNovel);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [readerEmail, setReaderEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get current invited list from store or novel
  const invitedReadersByNovel = useWorkspaceStore((s) => s.invitedReadersByNovel);
  const currentInvited: InvitedReader[] =
    invitedReadersByNovel[novel._id] || novel.invitedReaders || [];

  // Filtered community authors for autocomplete
  const communitySuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const alreadyInvitedUsers = new Set(currentInvited.map((r) => r.username.toLowerCase()));

    return TOP_10_AUTHORS.filter((a) => {
      if (alreadyInvitedUsers.has(a.author.toLowerCase())) return false;
      if (!q) return true;
      return (
        a.author.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q) ||
        a.badge.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, currentInvited]);

  if (!isOpen) return null;

  const handleSelectSuggestion = (authorName: string) => {
    setSelectedUser(authorName);
    setSearchQuery(authorName);
  };

  const handleSendInvite = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetUsername = selectedUser.trim() || searchQuery.trim();
    if (!targetUsername) return;

    inviteReaderToNovel(novel._id, targetUsername, readerEmail);
    setSuccessMessage(`Reader invitation sent to "${targetUsername}"! They can now access this book view-only in their library.`);
    setSearchQuery('');
    setSelectedUser('');
    setReaderEmail('');

    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  const handleTestAsReader = async (readerName: string) => {
    setIsReaderMode(true, readerName);
    await selectNovel(novel._id);
    onClose();
    navigate(`/book/${novel._id}?role=reader`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-reader-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-canvas-card border border-canvas-border rounded-2xl shadow-parchment-2xl flex flex-col overflow-hidden text-ink animate-scaleUp max-h-[92vh]"
      >
        {/* Top Spine Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-600 via-brand-600 to-amber-700" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-canvas-border flex items-start justify-between gap-4 bg-canvas-surface/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0 shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 id="invite-reader-title" className="text-lg sm:text-xl font-serif font-bold text-ink">
                Invite a Reader
              </h2>
              <p className="text-xs text-ink-muted font-sans mt-0.5">
                Book: <span className="font-semibold text-ink italic">{novel.title}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors cursor-pointer"
            title="Close invite dialog"
            aria-label="Close invite dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(92vh-140px)]">
          {/* Permission explanation banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-ink text-xs font-sans space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Invited Reader Permissions:</span>
            </div>
            <p className="text-ink-muted leading-relaxed">
              Once invited, the reader will see this book in their library under{' '}
              <strong className="text-ink">"Books I Am Invited to Read"</strong>. They can inspect
              book details in <strong>View Only</strong> mode and read the story. In their reader, the
              line indicator is an <strong className="text-amber-600 dark:text-amber-400">orange dot</strong>,
              allowing them to write line-level comments and feedback.
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn font-sans">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Search Form */}
          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label htmlFor="reader-username" className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                Search Reader Username or Pen Name
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reader-username"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedUser(e.target.value);
                  }}
                  placeholder="Type username or pen name..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas-surface border border-canvas-border text-ink text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-ink-faint shadow-2xs"
                  autoFocus
                />
              </div>
            </div>

            {/* Optional Email Notification */}
            <div>
              <label htmlFor="reader-email" className="block text-xs font-mono text-ink-muted mb-1.5">
                Reader Email <span className="text-ink-faint">(Optional invitation notification)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reader-email"
                  type="email"
                  value={readerEmail}
                  onChange={(e) => setReaderEmail(e.target.value)}
                  placeholder="reader@example.com"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-canvas-surface border border-canvas-border text-ink text-xs font-sans focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-ink-faint shadow-2xs"
                />
              </div>
            </div>

            {/* Community Writer Suggestions (Shown only if available) */}
            {communitySuggestions.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted mb-2">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Suggested Community Authors
                  </span>
                  <span className="text-ink-faint">Click to select</span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-canvas-surface/50 rounded-xl border border-canvas-border/70">
                  {communitySuggestions.slice(0, 8).map((author) => {
                    const isChosen =
                      (selectedUser || searchQuery).toLowerCase() === author.author.toLowerCase();
                    return (
                      <button
                        key={author.author}
                        type="button"
                        onClick={() => handleSelectSuggestion(author.author)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer border ${
                          isChosen
                            ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                            : 'bg-canvas-card hover:bg-canvas-hover border-canvas-border text-ink'
                        }`}
                      >
                        <User className="w-3 h-3 opacity-70" />
                        <span className="font-medium">{author.author}</span>
                        <span className="text-[10px] opacity-75 font-mono">({author.badge})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink text-xs font-mono transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={!(selectedUser.trim() || searchQuery.trim())}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-serif font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Send Reader Invite</span>
              </button>
            </div>
          </form>

          {/* List of currently invited readers */}
          <div className="pt-4 border-t border-canvas-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-ink">
                Invited Readers on this Book ({currentInvited.length})
              </h3>
            </div>

            {currentInvited.length === 0 ? (
              <div className="p-4 rounded-xl bg-canvas-surface/40 border border-dashed border-canvas-border text-center">
                <p className="text-xs text-ink-muted font-sans">
                  No readers have been invited yet. Use the search above to invite beta-readers or critics.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {currentInvited.map((reader) => (
                  <div
                    key={reader.username}
                    className="p-3 rounded-xl bg-canvas-surface border border-canvas-border flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {reader.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-semibold text-xs sm:text-sm text-ink truncate">
                            {reader.username}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Invited Reader
                          </span>
                        </div>
                        <p className="text-[10px] text-ink-faint font-mono mt-0.5">
                          Invited {new Date(reader.invitedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Test as Reader button */}
                      <button
                        type="button"
                        onClick={() => handleTestAsReader(reader.username)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-xs font-mono text-ink-muted hover:text-ink transition-colors cursor-pointer"
                        title={`Preview reading experience as ${reader.username}`}
                      >
                        <Eye className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span className="hidden xs:inline">Test View</span>
                      </button>

                      {/* Remove invite */}
                      <button
                        type="button"
                        onClick={() => removeInvitedReader(novel._id, reader.username)}
                        className="p-1 rounded-lg text-ink-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove reader access"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
