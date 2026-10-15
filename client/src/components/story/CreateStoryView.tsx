import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { Novel, NovelStatus } from '../../types';
import {
  ArrowLeft,
  Image as ImageIcon,
  Info,
  Plus,
  X,
  Upload,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

// Preset banner cover options from assets
import vampireCover from '../../assets/vampire_siege_banner.jpg';
import storySparkCover from '../../assets/story_spark_banner.jpg';
import sprintCover from '../../assets/writing_sprint_banner.jpg';
import elevatorCover from '../../assets/elevator_delivery_banner.jpg';

interface CreateStoryViewProps {
  isEditing?: boolean;
}

export const CreateStoryView: React.FC<CreateStoryViewProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id: routeNovelId } = useParams<{ id?: string }>();

  const novels = useWorkspaceStore((s) => s.novels);
  const createNovel = useWorkspaceStore((s) => s.createNovel);
  const updateNovel = useWorkspaceStore((s) => s.updateNovel);
  const selectNovel = useWorkspaceStore((s) => s.selectNovel);
  const penName = useWorkspaceStore((s) => s.penName);

  const existingNovel = routeNovelId ? novels.find((n) => n._id === routeNovelId) || null : null;
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);

  // Guest accounts disallowed: redirect unauthenticated users to library with auth prompt
  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true, 'signin');
      navigate('/library');
    }
  }, [isAuthenticated, navigate, setIsAuthModalOpen]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [storyType, setStoryType] = useState('Fiction');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [copyright, setCopyright] = useState('All Rights Reserved');
  const [isMature, setIsMature] = useState(false);
  const [mainCharacters, setMainCharacters] = useState<string[]>([]);
  const [characterInput, setCharacterInput] = useState('');
  const [targetAudience, setTargetAudience] = useState('Young Adult');
  const [targetWordCount, setTargetWordCount] = useState(80000);
  const [coverImage, setCoverImage] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize editing state if editing
  useEffect(() => {
    if (existingNovel) {
      setTitle(existingNovel.title || '');
      setDescription(existingNovel.synopsis || '');
      setLanguage(existingNovel.language || 'English');
      setStoryType(existingNovel.genre || 'Fiction');
      setTags(existingNovel.tags || []);
      setCopyright(existingNovel.copyright || 'All Rights Reserved');
      setIsMature(existingNovel.contentRating === 'Mature');
      setMainCharacters(existingNovel.mainCharacters || []);
      setTargetAudience(existingNovel.targetAudience || 'Young Adult');
      setTargetWordCount(existingNovel.targetWordCount || 80000);
      setCoverImage(existingNovel.coverImage || '');
    }
  }, [existingNovel]);

  // Story Type Options
  const storyTypes = [
    'Fiction',
    'Fanfiction',
    'Nonfiction',
    'Poetry',
    'Fantasy',
    'Sci-Fi',
    'Romance',
    'Mystery / Thriller',
    'Horror',
    'Historical Fiction',
  ];

  // Language Options
  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Japanese',
    'Tagalog',
    'Korean',
    'Chinese',
  ];

  // Target Audience Options
  const audienceOptions = [
    'Young Adult',
    'New Adult',
    'Adult',
    'Middle Grade',
    'All Audiences',
  ];

  // Copyright Options
  const copyrightExplanations: Record<string, string> = {
    'All Rights Reserved': 'You do not allow your work to be used or adapted in any way without your permission.',
    'Creative Commons (CC BY-NC)': 'Others can share and adapt your work with credit, for non-commercial purposes.',
    'Public Domain': 'You dedicate your story to the public domain with no rights reserved.',
  };

  // Handle Cover File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Cover image must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
          setErrorMsg(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Tag Add / Remove
  const handleAddTag = (raw: string) => {
    const cleaned = raw.trim().replace(/^#+/, '');
    if (!cleaned) return;
    if (!tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  // Character Add / Remove
  const handleAddCharacter = () => {
    const name = characterInput.trim();
    if (name && !mainCharacters.includes(name)) {
      setMainCharacters([...mainCharacters, name]);
      setCharacterInput('');
    }
  };

  const handleRemoveCharacter = (name: string) => {
    setMainCharacters(mainCharacters.filter((c) => c !== name));
  };

  // Handle Save
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalTitle = title.trim() || 'Untitled Story';

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload: Partial<Novel> = {
        title: finalTitle,
        synopsis: description.trim(),
        author: penName || 'Author',
        genre: storyType,
        coverImage: coverImage.trim(),
        tags,
        language,
        contentRating: isMature ? 'Mature' : 'All Audiences',
        copyright,
        targetAudience,
        targetWordCount: Number(targetWordCount) || 80000,
        status: (existingNovel?.status || 'In Progress') as NovelStatus,
      };

      if (isEditing && existingNovel?._id) {
        await updateNovel(existingNovel._id, payload);
        navigate(`/book/${existingNovel._id}`);
      } else {
        const created = await createNovel(payload);
        if (created?._id) {
          await selectNovel(created._id);
          navigate(`/works/${created._id}`);
        } else {
          navigate('/library');
        }
      }
    } catch (err: any) {
      console.error('[CreateStoryView] Save failed:', err);
      setErrorMsg(err.message || 'Failed to save story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col selection:bg-brand-500/20">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR (Clean, Minimal, Distraction-Free)                 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-canvas/95 backdrop-blur-md border-b border-canvas-border px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Back & Live Story Title Preview */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/library')}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors cursor-pointer flex-shrink-0"
            title="Return to Library"
            aria-label="Back to Library"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="text-[11px] font-sans font-medium text-ink-muted tracking-tight">
              {isEditing ? 'Edit Story Info' : 'Add Story Info'}
            </div>
            <h1 className="text-sm sm:text-base font-serif font-bold text-ink truncate leading-tight">
              {title.trim() || 'Untitled Story'}
            </h1>
          </div>
        </div>

        {/* Right: Cancel & Save Buttons */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => navigate('/library')}
            className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-canvas-border bg-canvas-card hover:bg-canvas-hover text-ink font-sans text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSubmitting}
            className="px-5 sm:px-6 py-1.5 sm:py-2 rounded-full bg-ink text-canvas hover:opacity-90 dark:bg-brand-600 dark:hover:bg-brand-700 dark:text-white font-sans text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <span>{isEditing ? 'Save Changes' : 'Save & Continue'}</span>
            )}
          </button>
        </div>
      </header>

      {/* Error Message Toast */}
      {errorMsg && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-sans">
            {errorMsg}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN STORY DETAILS FORM (Wattpad-inspired minimal 2-column layout)       */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: BOOK COVER (Standard 2:3 vertical aspect ratio)         */}
          {/* --------------------------------------------------------------------- */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start space-y-3">
            <div className="w-full max-w-[260px] sm:max-w-[280px]">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-[2/3] w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 text-center group ${
                  coverImage
                    ? 'border-transparent shadow-lg bg-neutral-900'
                    : 'border-canvas-border hover:border-brand-500 bg-canvas-surface/40 hover:bg-canvas-surface/70'
                }`}
                title="Click to upload story cover (2:3 ratio)"
              >
                {coverImage ? (
                  <>
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-3 gap-1.5">
                      <Upload className="w-6 h-6" />
                      <span className="font-sans text-xs font-semibold">Change Cover</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 text-ink-muted group-hover:text-ink">
                    <div className="w-14 h-14 rounded-2xl bg-canvas-card border border-canvas-border shadow-2xs flex items-center justify-center text-ink-muted group-hover:text-brand-600 group-hover:border-brand-500/40 transition-colors">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-sans font-semibold text-xs text-ink block">
                        Add a cover
                      </span>
                      <span className="font-sans text-[11px] text-ink-muted block">
                        Click to upload (JPG, PNG)
                      </span>
                    </div>
                  </div>
                )}

                {/* Bottom Corner Info Icon */}
                <div
                  className="absolute bottom-2.5 right-2.5 text-ink-muted/70 hover:text-ink transition-colors p-1"
                  title="Recommended cover size: 600 x 900px (2:3 portrait aspect ratio)"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Recommended cover size: 600 x 900 px (2:3 portrait aspect ratio). Supports JPG, PNG, and WebP.');
                  }}
                >
                  <HelpCircle className="w-4 h-4" />
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Cover Helpers & Preset Selector */}
              <div className="mt-3 flex items-center justify-between text-[11px] font-sans text-ink-muted">
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-brand-600 hover:text-brand-700 font-medium hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{showPresets ? 'Hide Presets' : 'Choose Preset Cover'}</span>
                </button>

                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="text-rose-600 hover:underline cursor-pointer"
                  >
                    Remove Cover
                  </button>
                )}
              </div>

              {/* Preset Covers Grid */}
              {showPresets && (
                <div className="mt-2.5 p-2.5 rounded-xl border border-canvas-border bg-canvas-card space-y-2 animate-fadeIn">
                  <div className="text-[10px] font-sans font-semibold text-ink-muted uppercase tracking-wider">
                    Alterjot Studio Covers
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { img: storySparkCover, label: 'Ember' },
                      { img: vampireCover, label: 'Siege' },
                      { img: sprintCover, label: 'Noir' },
                      { img: elevatorCover, label: 'Dystopia' },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCoverImage(preset.img);
                          setShowPresets(false);
                        }}
                        className="aspect-[2/3] rounded-lg overflow-hidden border border-canvas-border hover:border-brand-500 hover:scale-105 transition-all cursor-pointer relative group"
                        title={`Select ${preset.label}`}
                      >
                        <img src={preset.img} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: STORY DETAILS (Clean, spacious form card)              */}
          {/* --------------------------------------------------------------------- */}
          <div className="md:col-span-8">
            <div className="rounded-2xl border border-canvas-border bg-canvas-card p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Section Header with Signature Brand Underline */}
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-ink">
                  Story Details
                </h2>
                <div className="w-12 h-1 bg-brand-500 rounded-full mt-2" />
              </div>

              {/* FIELD 1: TITLE* */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-sans font-bold text-ink">
                  Title<span className="text-rose-600 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled Story"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-canvas-surface/30 dark:bg-canvas-surface/20 border border-canvas-border focus:border-brand-500 focus:bg-canvas-card text-ink font-serif text-sm sm:text-base placeholder:text-ink-faint focus:outline-none transition-all shadow-2xs"
                  required
                />
              </div>

              {/* FIELD 2: DESCRIPTION* */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="block text-xs sm:text-sm font-sans font-bold text-ink">
                    Description<span className="text-rose-600 ml-0.5">*</span>
                  </label>
                  <div
                    className="text-ink-muted hover:text-ink cursor-pointer"
                    title="Write a compelling premise or hook for your readers"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Introduce your story premise, inciting incident, or hook..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-canvas-surface/30 dark:bg-canvas-surface/20 border border-canvas-border focus:border-brand-500 focus:bg-canvas-card text-ink font-sans text-xs sm:text-sm placeholder:text-ink-faint focus:outline-none transition-all leading-relaxed shadow-2xs resize-y"
                  required
                />
              </div>

              {/* FIELD 3: LANGUAGE */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="block text-xs sm:text-sm font-sans font-bold text-ink">
                    Language
                  </label>
                  <div
                    className="text-ink-muted hover:text-ink cursor-pointer"
                    title="Primary language your story is written in"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </div>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full max-w-xs px-3.5 py-2 rounded-xl bg-canvas-surface/30 dark:bg-canvas-surface/20 border border-canvas-border text-ink font-sans text-xs sm:text-sm focus:outline-none focus:border-brand-500 shadow-2xs cursor-pointer"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* FIELD 4: STORY TYPE / CATEGORY */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <label className="block text-xs sm:text-sm font-sans font-bold text-ink">
                    Story type
                  </label>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-sans font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 uppercase tracking-tight">
                    NEW
                  </span>
                  <span className="text-rose-600 text-xs font-semibold font-sans">*Required</span>
                </div>
                <p className="text-[11px] sm:text-xs text-ink-muted font-sans leading-relaxed">
                  Selecting a story type will allow you to define genres and classifications that help readers and AI co-pilots better connect with your story.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {storyTypes.map((type) => {
                    const isSelected = storyType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setStoryType(type)}
                        className={`px-3.5 py-1.5 rounded-full font-sans text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-ink text-canvas dark:bg-amber-500 dark:text-stone-950 shadow-xs font-semibold'
                            : 'bg-canvas-surface/50 hover:bg-canvas-hover text-ink border border-canvas-border'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FIELD 5: TAGS */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="block text-xs sm:text-sm font-sans font-bold text-ink">
                    Tags
                  </label>
                  <div
                    className="text-ink-muted hover:text-ink cursor-pointer"
                    title="Add relevant keywords to help readers find your story"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Separate tags with a space (e.g. slowburn dystopian fantasy)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-canvas-surface/30 dark:bg-canvas-surface/20 border border-canvas-border focus:border-brand-500 text-ink font-sans text-xs sm:text-sm placeholder:text-ink-faint focus:outline-none transition-all shadow-2xs"
                  />

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-canvas-surface border border-canvas-border text-ink font-sans text-xs font-medium"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-ink-muted hover:text-rose-600 transition-colors p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* FIELD 6: COPYRIGHT */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="block text-xs sm:text-sm font-sans font-bold text-ink">
                    Copyright
                  </label>
                  <div
                    className="text-ink-muted hover:text-ink cursor-pointer"
                    title="Choose licensing rights for your original work"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </div>
                </div>
                <select
                  value={copyright}
                  onChange={(e) => setCopyright(e.target.value)}
                  className="w-full max-w-sm px-3.5 py-2 rounded-xl bg-canvas-surface/30 dark:bg-canvas-surface/20 border border-canvas-border text-ink font-sans text-xs sm:text-sm focus:outline-none focus:border-brand-500 shadow-2xs cursor-pointer"
                >
                  <option value="All Rights Reserved">All Rights Reserved</option>
                  <option value="Creative Commons (CC BY-NC)">Creative Commons (CC BY-NC)</option>
                  <option value="Public Domain">Public Domain</option>
                </select>
                <p className="text-[11px] font-sans text-ink-muted leading-relaxed">
                  {copyrightExplanations[copyright] || copyrightExplanations['All Rights Reserved']}
                </p>
              </div>

              {/* FIELD 7: RATING (MATURE TOGGLE) */}
              <div className="space-y-2 pt-1 border-t border-canvas-border/50">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs sm:text-sm font-sans font-bold text-ink">
                      Rating
                    </label>
                    <div
                      className="text-ink-muted hover:text-ink cursor-pointer"
                      title="Mark if this story contains graphic violence, explicit language, or adult themes"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-sans text-ink-muted">Mature</span>
                    <button
                      type="button"
                      onClick={() => setIsMature(!isMature)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        isMature ? 'bg-brand-600' : 'bg-canvas-border'
                      }`}
                      title={isMature ? 'Rated Mature' : 'Rated All Audiences'}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          isMature ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] font-sans text-ink-muted leading-relaxed">
                  {isMature
                    ? 'Your story contains mature themes intended for adult audiences.'
                    : 'Your story is appropriate for general audiences.'}
                </p>
              </div>

              {/* FIELD 8: MAIN CHARACTERS */}
              <div className="space-y-1.5 pt-1 border-t border-canvas-border/50">
                <div className="flex items-center gap-1.5">
                  <label className="block text-xs sm:text-sm font-sans font-bold text-ink">
                    Main Characters:
                  </label>
                  <div
                    className="text-ink-muted hover:text-ink cursor-pointer"
                    title="Add key protagonists or deuteragonists"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex items-center gap-2 max-w-md">
                  <input
                    type="text"
                    value={characterInput}
                    onChange={(e) => setCharacterInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCharacter();
                      }
                    }}
                    placeholder="Add character name..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-canvas-surface/30 dark:bg-canvas-surface/20 border border-canvas-border focus:border-brand-500 text-ink font-sans text-xs sm:text-sm placeholder:text-ink-faint focus:outline-none transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCharacter}
                    className="p-2 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink transition-colors cursor-pointer"
                    title="Add Character"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {mainCharacters.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mainCharacters.map((char) => (
                      <span
                        key={char}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-canvas-surface border border-canvas-border text-ink font-sans text-xs"
                      >
                        <span>{char}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCharacter(char)}
                          className="text-ink-muted hover:text-rose-600 transition-colors p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* FIELD 9: TARGET AUDIENCE */}
              <div className="space-y-1.5 pt-1 border-t border-canvas-border/50">
                <div className="flex items-center gap-1.5">
                  <label className="block text-xs sm:text-sm font-sans font-bold text-ink">
                    Target Audience
                  </label>
                  <div
                    className="text-ink-muted hover:text-ink cursor-pointer"
                    title="Primary age group or reader demographic"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </div>
                </div>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full max-w-xs px-3.5 py-2 rounded-xl bg-canvas-surface/30 dark:bg-canvas-surface/20 border border-canvas-border text-ink font-sans text-xs sm:text-sm focus:outline-none focus:border-brand-500 shadow-2xs cursor-pointer"
                >
                  {audienceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
