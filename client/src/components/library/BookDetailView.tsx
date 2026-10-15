import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { BookCover } from '../common/BookCover';
import { InviteReaderModal } from './InviteReaderModal';
import { PublishSuccessModal } from './PublishSuccessModal';
import {
  ArrowLeft,
  Feather,
  BookOpen,
  Edit,
  Trash2,
  FileDown,
  TrendingUp,
  Target,
  Layers,
  Clock,
  Calendar,
  ChevronRight,
  BookMarked,
  Plus,
  UserPlus,
  Eye,
  ShieldCheck,
  Users,
  CheckCircle,
  Globe,
  Star,
  MessageSquare,
} from 'lucide-react';

export const BookDetailView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const novels = useWorkspaceStore((s) => s.novels);
  const activeNovelId = useWorkspaceStore((s) => s.activeNovelId);
  const selectNovel = useWorkspaceStore((s) => s.selectNovel);
  const openStudio = useWorkspaceStore((s) => s.openStudio);
  const deleteNovel = useWorkspaceStore((s) => s.deleteNovel);
  const togglePublishNovel = useWorkspaceStore((s) => s.togglePublishNovel);
  const recordNovelView = useWorkspaceStore((s) => s.recordNovelView);
  const rateNovel = useWorkspaceStore((s) => s.rateNovel);
  const setIsExportOpen = useWorkspaceStore((s) => s.setIsExportOpen);
  const setIsDashboardOpen = useWorkspaceStore((s) => s.setIsDashboardOpen);
  const openLibrary = useWorkspaceStore((s) => s.openLibrary);

  const chapters = useWorkspaceStore((s) => s.chapters);
  const scenes = useWorkspaceStore((s) => s.scenes);
  const codexEntries = useWorkspaceStore((s) => s.codexEntries);
  const selectChapter = useWorkspaceStore((s) => s.selectChapter);
  const isReaderMode = useWorkspaceStore((s) => s.isReaderMode);
  const setIsReaderMode = useWorkspaceStore((s) => s.setIsReaderMode);
  const activeReaderName = useWorkspaceStore((s) => s.activeReaderName);
  const invitedReadersByNovel = useWorkspaceStore((s) => s.invitedReadersByNovel);
  const lineComments = useWorkspaceStore((s) => s.lineComments);

  const [searchParams, setSearchParams] = useSearchParams();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isPublishSuccessModalOpen, setIsPublishSuccessModalOpen] = useState(false);
  const [isOpeningStudio, setIsOpeningStudio] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [userGivenRating, setUserGivenRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Identify target novel
  const targetId = id || activeNovelId;
  const novel = novels.find((n) => n._id === targetId);

  // Auto record view when viewing a published novel
  useEffect(() => {
    if (novel?._id && novel.isPublished) {
      recordNovelView(novel._id);
    }
  }, [novel?._id, novel?.isPublished, recordNovelView]);

  const handleTogglePublish = async () => {
    if (!novel || isPublishing) return;
    const willPublish = !novel.isPublished;
    if (!willPublish && !confirm(`Unpublish "${novel.title}" from the Explore shelf?`)) {
      return;
    }
    setIsPublishing(true);
    try {
      const res = await togglePublishNovel(novel._id);
      if (res && willPublish) {
        setIsPublishSuccessModalOpen(true);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRate = async (star: number) => {
    if (!novel || isSubmittingRating) return;
    setIsSubmittingRating(true);
    setUserGivenRating(star);
    try {
      await rateNovel(novel._id, star);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Check if viewing in view-only reader mode
  const roleParam = searchParams.get('role');
  const isViewingAsReader = roleParam === 'reader' || isReaderMode;

  const currentInvited =
    (novel ? invitedReadersByNovel[novel._id] : undefined) || novel?.invitedReaders || [];

  // Ensure novel data is loaded when visiting directly
  useEffect(() => {
    if (id && id !== activeNovelId) {
      selectNovel(id).catch((err) => {
        console.warn('[BookDetailView] Could not load novel by ID:', err);
      });
    }
  }, [id, activeNovelId, selectNovel]);

  const handleContinueWriting = async (specificChapterId?: string) => {
    if (!novel) return;
    setIsOpeningStudio(true);
    try {
      setIsReaderMode(false);
      await openStudio(novel._id);
      if (specificChapterId) {
        selectChapter(specificChapterId);
      }
      navigate(`/works/${novel._id}`);
    } finally {
      setIsOpeningStudio(false);
    }
  };

  const handleReadBook = async (specificChapterId?: string) => {
    if (!novel) return;
    setIsOpeningStudio(true);
    try {
      setIsReaderMode(true, activeReaderName || 'Invited Reader');
      await openStudio(novel._id);
      if (specificChapterId) {
        selectChapter(specificChapterId);
      }
      navigate(`/works/${novel._id}?mode=reader`);
    } finally {
      setIsOpeningStudio(false);
    }
  };

  const handleSwitchToAuthorView = () => {
    setIsReaderMode(false);
    setSearchParams({});
  };

  const handleSwitchToReaderView = (readerName: string = 'Beta Reader') => {
    setIsReaderMode(true, readerName);
    setSearchParams({ role: 'reader' });
  };

  const handleDeleteBook = async () => {
    if (!novel) return;
    if (confirm(`Are you sure you want to permanently delete "${novel.title}" and all its chapters?`)) {
      await deleteNovel(novel._id);
      openLibrary();
      navigate('/library');
    }
  };

  const handleExportBook = async () => {
    if (!novel) return;
    await selectNovel(novel._id);
    setIsExportOpen(true);
  };

  const handleOpenMetrics = async () => {
    if (!novel) return;
    await selectNovel(novel._id);
    setIsDashboardOpen(true);
  };

  if (!novel) {
    return (
      <div className="flex-1 overflow-y-auto bg-canvas text-ink p-4 sm:p-8 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 rounded-2xl bg-canvas-card border border-canvas-border flex items-center justify-center text-ink-muted mb-4 shadow-sm">
          <BookOpen className="w-8 h-8 text-brand-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink mb-2">Book Not Found</h2>
        <p className="text-xs sm:text-sm text-ink-muted mb-6 text-center max-w-sm font-sans">
          The requested book could not be found or may have been deleted.
        </p>
        <button
          type="button"
          onClick={() => {
            openLibrary();
            navigate('/library');
          }}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Library Shelf</span>
        </button>
      </div>
    );
  }

  const totalWords = novel.totalWordCount || 0;
  const targetWords = novel.targetWordCount || 80000;
  const progressPercent = Math.min(100, Math.round((totalWords / targetWords) * 100));
  const readingTimeMins = Math.max(1, Math.ceil(totalWords / 200));

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-12">
      {/* Top Header Navigation & Breadcrumbs */}
      <div className="w-full border-b border-canvas-border bg-canvas/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              openLibrary();
              navigate('/library');
            }}
            className="flex items-center gap-2 text-xs sm:text-sm font-mono text-ink-muted hover:text-ink transition-colors cursor-pointer group"
            title="Return to Library"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Library</span>
          </button>

          {/* Quick Header CTA */}
          {isViewingAsReader ? (
            <button
              type="button"
              onClick={() => handleReadBook()}
              disabled={isOpeningStudio}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-serif font-semibold text-xs shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Book</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePublish}
                disabled={isPublishing}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium shadow-2xs transition-all cursor-pointer ${
                  novel.isPublished
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-canvas-card hover:bg-canvas-hover border-canvas-border text-ink'
                }`}
                title={novel.isPublished ? 'Unpublish from Explore' : 'Publish to Explore shelf'}
              >
                <Globe className={`w-3.5 h-3.5 ${novel.isPublished ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink-muted'}`} />
                <span>{novel.isPublished ? 'Published' : 'Publish Book'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-ink font-mono font-medium text-xs shadow-2xs transition-all cursor-pointer"
                title="Invite a reader to review this book"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">Invite Reader</span>
              </button>
              <button
                type="button"
                onClick={() => handleContinueWriting()}
                disabled={isOpeningStudio}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-xs shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Continue Writing</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* =================================================================== */}
        {/* READER / AUTHOR BANNER                                              */}
        {/* =================================================================== */}
        {isViewingAsReader ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-ink text-xs font-sans shadow-xs animate-fadeIn">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5 sm:mt-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm">Invited Reader Access • View Only Mode</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-800 dark:text-amber-200">
                    @{activeReaderName || 'Reader'}
                  </span>
                </div>
                <p className="text-ink-muted text-xs mt-1 leading-relaxed">
                  You are viewing this book as an invited reader. Story text is view only. You can read the chapters and click any <span className="text-amber-600 dark:text-amber-400 font-bold">orange dot</span> to leave line-level comments.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSwitchToAuthorView}
              className="px-3.5 py-2 rounded-xl bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-xs font-mono text-ink transition-colors cursor-pointer flex-shrink-0 self-start sm:self-auto shadow-2xs"
            >
              Switch to Author View
            </button>
          </div>
        ) : currentInvited.length > 0 ? (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-canvas-card border border-canvas-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-ink text-xs font-sans shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <div className="min-w-0 truncate">
                <span className="text-ink-muted">
                  Active Reader Invites:{' '}
                  <strong className="text-ink font-semibold">
                    {currentInvited.length} reader{currentInvited.length > 1 ? 's' : ''}
                  </strong>{' '}
                  <span className="text-ink-faint">
                    ({currentInvited.map((r) => `@${r.username}`).join(', ')})
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleSwitchToReaderView(currentInvited[0]?.username)}
                className="text-xs font-mono text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Reader View</span>
              </button>
              <span className="text-ink-faint">•</span>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                className="text-xs font-mono text-brand-600 hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Manage Invites</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* =================================================================== */}
        {/* 1. HERO SECTION: COVER + PRIMARY DETAILS + ACTIONS                  */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-8 rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-10 items-start">
            {/* Book Cover Artwork */}
            <div className="flex-shrink-0 mx-auto md:mx-0 w-44 xs:w-52 sm:w-60 md:w-56 lg:w-64">
              <div className="shadow-2xl rounded-none overflow-hidden border border-black/20 dark:border-white/10 group">
                <BookCover
                  title={novel.title}
                  author={novel.author}
                  genre={novel.genre}
                  coverImage={novel.coverImage}
                  size="full"
                  badge="alterjot"
                />
              </div>
            </div>

            {/* Book Metadata & Primary Call-to-Actions */}
            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
              <div>
                {/* Badges: Genre & Status */}
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  {isViewingAsReader ? (
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Reader Access • View Only</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" />
                      <span>Author Master Copy</span>
                    </span>
                  )}
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50">
                    {novel.genre === 'Zombie Apocalypse' ? '🧟 Zombie Apocalypse' : novel.genre || 'Novel'}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-canvas-surface text-ink-muted border border-canvas-border">
                    {novel.status || 'Draft'}
                  </span>
                  {novel.isPublished && (
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-2xs">
                      <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Published to Explore</span>
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-ink tracking-tight leading-tight">
                  {novel.title}
                </h1>
                {novel.subtitle && (
                  <p className="text-sm sm:text-base font-serif italic text-ink-muted mt-1">
                    {novel.subtitle}
                  </p>
                )}

                {/* Author Pen Name */}
                <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-ink-muted font-mono">
                  <span className="text-ink-faint">Pen Name:</span>
                  <span className="font-semibold text-ink">{novel.author || 'Anonymous'}</span>
                </div>

                {/* Timestamps */}
                <div className="flex items-center gap-4 text-[11px] font-mono text-ink-faint mt-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-ink-muted" />
                    Started {new Date(novel.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span>•</span>
                  <span>
                    Last active {new Date(novel.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Dynamic Views, Star Ratings & Reader Line Comments */}
                <div className="mt-4 pt-4 border-t border-canvas-border/80 flex flex-wrap items-center gap-3 sm:gap-4">
                  {/* Views Counter */}
                  <div className="flex items-center gap-1.5 text-xs font-mono text-ink-muted bg-canvas-surface/80 px-3 py-1.5 rounded-lg border border-canvas-border shadow-2xs">
                    <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-ink">{(novel.views ?? 0).toLocaleString()}</span>
                    <span>views</span>
                  </div>

                  {/* Interactive Star Rating Widget */}
                  <div className="flex items-center gap-2 text-xs font-mono bg-canvas-surface/80 px-3 py-1.5 rounded-lg border border-canvas-border shadow-2xs">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const current = novel.rating ?? 5.0;
                        const isHovered = hoverRating !== null;
                        const activeStar = isHovered
                          ? hoverRating >= star
                          : userGivenRating !== null
                          ? userGivenRating >= star
                          : current >= star;

                        return (
                          <button
                            key={star}
                            type="button"
                            disabled={isSubmittingRating}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => handleRate(star)}
                            className="cursor-pointer transition-transform hover:scale-125 p-0.5 focus:outline-none"
                            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          >
                            <Star
                              className={`w-4 h-4 transition-colors ${
                                activeStar
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-stone-300 dark:text-stone-600'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="font-bold text-ink ml-1">
                      {(novel.rating ?? 5.0).toFixed(1)}
                    </span>
                    <span className="text-[11px] text-ink-faint">
                      ({novel.ratingCount ?? 0} {novel.ratingCount === 1 ? 'rating' : 'ratings'})
                    </span>
                    {userGivenRating && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-1 animate-fadeIn">
                        ✓ Rated!
                      </span>
                    )}
                  </div>

                  {/* Reader Feedback / Line Comments Counter */}
                  <button
                    type="button"
                    onClick={() => handleReadBook()}
                    className="flex items-center gap-1.5 text-xs font-mono text-ink-muted bg-canvas-surface/80 hover:bg-canvas-hover px-3 py-1.5 rounded-lg border border-canvas-border shadow-2xs hover:border-amber-500/40 hover:text-ink cursor-pointer transition-colors"
                    title="Read book and view line-level reader feedback"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="font-bold text-ink">
                      {lineComments.filter((c) => c.novelId === novel._id).length}
                    </span>
                    <span>
                      {lineComments.filter((c) => c.novelId === novel._id).length === 1
                        ? 'reader comment'
                        : 'reader comments'}
                    </span>
                  </button>
                </div>
              </div>

              {/* ACTION AREA: CONTINUE WRITING / READ BOOK */}
              <div className="mt-6 pt-6 border-t border-canvas-border space-y-3">
                {isViewingAsReader ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReadBook()}
                      disabled={isOpeningStudio}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-base shadow-md hover:shadow-xl transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
                    >
                      <BookOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span>Read Book</span>
                      <ChevronRight className="w-4 h-4 ml-1 opacity-80 transition-transform group-hover:translate-x-1" />
                    </button>

                    {/* Secondary Actions for Reader */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        type="button"
                        onClick={handleExportBook}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink text-xs font-mono transition-colors shadow-2xs cursor-pointer"
                        title="Export to Markdown, PDF, or Word"
                      >
                        <FileDown className="w-3.5 h-3.5 text-sky-600" />
                        <span>Export</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenMetrics}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink text-xs font-mono transition-colors shadow-2xs cursor-pointer"
                        title="View Story Scale"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                        <span>Metrics</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSwitchToAuthorView}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink-muted hover:text-ink text-xs font-mono transition-colors shadow-2xs cursor-pointer ml-auto"
                      >
                        <span>Switch to Author Mode</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleContinueWriting()}
                        disabled={isOpeningStudio}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-bold text-base shadow-md hover:shadow-xl transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
                      >
                        <Feather className="w-5 h-5 transition-transform group-hover:rotate-12" />
                        <span>Continue Writing</span>
                        <ChevronRight className="w-4 h-4 ml-1 opacity-80 transition-transform group-hover:translate-x-1" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsInviteModalOpen(true)}
                        className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink font-serif font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
                        title="Invite a reader by searching their username"
                      >
                        <UserPlus className="w-4 h-4 text-amber-600 dark:text-amber-400 transition-transform group-hover:scale-110" />
                        <span>Invite a Reader</span>
                        {currentInvited.length > 0 && (
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center">
                            {currentInvited.length}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Secondary Actions Row for Author */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => navigate(`/stories/${novel._id}/edit`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink text-xs font-mono transition-colors shadow-2xs cursor-pointer"
                        title="Edit Title, Genre, Cover, and Target Word Goal"
                      >
                        <Edit className="w-3.5 h-3.5 text-brand-600" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportBook}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink text-xs font-mono transition-colors shadow-2xs cursor-pointer"
                        title="Export to Markdown, PDF, or Word"
                      >
                        <FileDown className="w-3.5 h-3.5 text-sky-600" />
                        <span>Export</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenMetrics}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink text-xs font-mono transition-colors shadow-2xs cursor-pointer"
                        title="View Writing Velocity & Scene Pipeline"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                        <span>Metrics</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDeleteBook}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas-surface hover:bg-rose-500/10 border border-canvas-border text-rose-500 hover:text-rose-600 text-xs font-mono transition-colors shadow-2xs cursor-pointer ml-auto"
                        title="Permanently Delete Book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. PROGRESS & STORY VELOCITY STATS                                  */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Word Count Progress Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-canvas-card border border-canvas-border shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-1">
                <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-brand-600" />
                  Target Goal
                </span>
                <span className="font-bold text-brand-700 dark:text-amber-400">{progressPercent}%</span>
              </div>
              <div className="text-xl sm:text-2xl font-serif font-extrabold text-ink mt-1">
                {totalWords.toLocaleString()}
                <span className="text-xs text-ink-muted font-mono font-normal ml-1">
                  / {targetWords.toLocaleString()}
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-canvas-surface rounded-full h-2.5 mt-3 overflow-hidden p-0.5 border border-canvas-border">
              <div
                className="bg-gradient-to-r from-amber-600 via-[#c2593f] to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(3, progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Chapters & Scenes Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-canvas-card border border-canvas-border shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-muted font-semibold">
              <Layers className="w-4 h-4 text-indigo-600" />
              Book Scale
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-serif font-extrabold text-ink">
                {chapters.length} Chapters
              </div>
              <div className="text-xs text-ink-muted font-mono mt-0.5">
                {scenes.length} Scenes in repository
              </div>
            </div>
            <div className="text-[11px] text-ink-faint font-mono mt-2">
              Avg. {chapters.length > 0 ? Math.round(totalWords / chapters.length).toLocaleString() : 0} words/ch
            </div>
          </div>

          {/* Reading Time Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-canvas-card border border-canvas-border shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-muted font-semibold">
              <Clock className="w-4 h-4 text-amber-600" />
              Reading Length
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-serif font-extrabold text-ink">
                ~{readingTimeMins} mins
              </div>
              <div className="text-xs text-ink-muted font-mono mt-0.5">
                Est. Reader Immersion
              </div>
            </div>
            <div className="text-[11px] text-ink-faint font-mono mt-2">
              Standard 200 WPM pacing
            </div>
          </div>

          {/* Codex Lore Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-canvas-card border border-canvas-border shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-muted font-semibold">
              <BookMarked className="w-4 h-4 text-emerald-600" />
              World Codex
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-serif font-extrabold text-ink">
                {codexEntries.length} Elements
              </div>
              <div className="text-xs text-ink-muted font-mono mt-0.5">
                Characters, Places & Lore
              </div>
            </div>
            <div className="text-[11px] text-ink-faint font-sans mt-2">
              Active story codex & lore
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 3. SYNOPSIS & STORY PREMISE                                         */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-brand-600 rounded-full" />
              <h3 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-ink">
                Story Premise & Synopsis
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/stories/${novel._id}/edit`)}
              className="text-xs font-sans font-medium text-ink-muted hover:text-brand-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          {novel.synopsis ? (
            <p className="text-sm sm:text-base font-serif text-ink leading-relaxed whitespace-pre-line bg-canvas-surface/60 p-4 rounded-xl border border-canvas-border/60">
              {novel.synopsis}
            </p>
          ) : (
            <div className="p-4 rounded-xl bg-canvas-surface/40 border border-dashed border-canvas-border text-center">
              <p className="text-xs text-ink-muted font-sans italic">
                No synopsis drafted for this book yet.
              </p>
              <button
                type="button"
                onClick={() => navigate(`/stories/${novel._id}/edit`)}
                className="mt-2 text-xs font-sans font-semibold text-brand-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Add Story Details & Synopsis
              </button>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* 4. INVITED READERS & BETA REVIEWERS SECTION                         */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-amber-500 rounded-full" />
              <h3 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Invited Readers & Beta Critics ({currentInvited.length})</span>
              </h3>
            </div>
            {!isViewingAsReader && (
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                className="text-xs font-mono text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite New Reader</span>
              </button>
            )}
          </div>

          {currentInvited.length === 0 ? (
            <div className="p-5 rounded-xl bg-canvas-surface/40 border border-dashed border-canvas-border text-center space-y-2">
              <p className="text-xs text-ink-muted font-sans">
                No readers have been invited to this book yet.
              </p>
              {!isViewingAsReader && (
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-serif font-semibold text-xs shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Invite First Reader</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentInvited.map((reader) => (
                <div
                  key={reader.username}
                  className="p-3.5 rounded-xl bg-canvas-surface border border-canvas-border flex items-center justify-between gap-3 shadow-2xs hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {reader.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-semibold text-xs sm:text-sm text-ink truncate">
                        {reader.username}
                      </h4>
                      <p className="text-[10px] text-ink-faint font-mono">
                        Invited Reader • View Only
                      </p>
                    </div>
                  </div>

                  {!isViewingAsReader ? (
                    <button
                      type="button"
                      onClick={() => handleSwitchToReaderView(reader.username)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-canvas-card hover:bg-canvas-hover border border-canvas-border text-[11px] font-mono text-amber-600 dark:text-amber-400 transition-colors cursor-pointer flex-shrink-0"
                      title={`Preview book as ${reader.username}`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* 5. CHAPTER OUTLINE BREAKDOWN (QUICK JUMP INTO CHAPTER)              */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 rounded-2xl bg-canvas-card border border-canvas-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-brand-600 rounded-full" />
              <h3 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-ink">
                Chapter Directory ({chapters.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-ink-faint hidden sm:inline">
              {isViewingAsReader
                ? 'Click any chapter to start reading. Orange dots allow line-level commenting.'
                : 'Click any chapter to continue writing directly from that point'}
            </span>
          </div>

          {chapters.length === 0 ? (
            <div className="p-6 rounded-xl bg-canvas-surface/40 border border-canvas-border text-center space-y-2">
              <p className="text-xs sm:text-sm text-ink-muted font-sans">
                No chapters added to this volume yet.
              </p>
              {!isViewingAsReader && (
                <button
                  type="button"
                  onClick={() => handleContinueWriting()}
                  className="px-4 py-2 rounded-lg bg-brand-600 text-white font-serif font-semibold text-xs shadow-sm hover:bg-brand-700 transition-colors cursor-pointer"
                >
                  Write First Chapter
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {chapters.map((ch, idx) => {
                const chScenes = scenes.filter((s) => s.chapterId === ch._id);
                const chWords = chScenes.reduce((acc, s) => acc + (s.wordCount || 0), 0);

                return (
                  <div
                    key={ch._id}
                    onClick={() =>
                      isViewingAsReader
                        ? handleReadBook(ch._id)
                        : handleContinueWriting(ch._id)
                    }
                    className="p-3 sm:p-3.5 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-2xs hover:shadow-xs"
                    title={isViewingAsReader ? `Read ${ch.title}` : `Jump into ${ch.title}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-canvas-card border border-canvas-border text-[11px] font-mono font-bold flex items-center justify-center text-ink-muted group-hover:text-brand-600 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-ink group-hover:text-brand-600 truncate transition-colors">
                          {ch.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-ink-muted mt-0.5">
                          <span>{chScenes.length} scenes</span>
                          <span>•</span>
                          <span>{chWords.toLocaleString()} words</span>
                          {lineComments.filter((c) => c.chapterId === ch._id).length > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                                <MessageSquare className="w-2.5 h-2.5" />
                                {lineComments.filter((c) => c.chapterId === ch._id).length}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-canvas-card border border-canvas-border text-ink-muted group-hover:border-brand-500/30">
                        {isViewingAsReader ? 'Read Only' : ch.status || 'Draft'}
                      </span>
                      {isViewingAsReader ? (
                        <BookOpen className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                      ) : (
                        <Feather className="w-3.5 h-3.5 text-ink-muted group-hover:text-brand-600 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Invite Reader Modal */}
      <InviteReaderModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        novel={novel}
      />

      {/* Publish Celebration Modal */}
      <PublishSuccessModal
        isOpen={isPublishSuccessModalOpen}
        onClose={() => setIsPublishSuccessModalOpen(false)}
        novel={novel}
      />
    </div>
  );
};
