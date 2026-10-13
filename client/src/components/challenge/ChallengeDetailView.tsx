import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { ALL_CHALLENGES, getChallengeById } from '../../data/challengesData';
import {
  ArrowLeft,
  Feather,
  Timer,
  Flame,
  Sparkles,
  ShieldAlert,
  Compass,
  CheckCircle2,
  Copy,
  Share2,
  BookOpen,
  ChevronRight,
  User,
  MapPin,
  Globe,
  Clock,
} from 'lucide-react';

export const ChallengeDetailView: React.FC = () => {
  const activeChallengeId = useWorkspaceStore((s) => s.activeChallengeId);
  const openDashboard = useWorkspaceStore((s) => s.openDashboard);
  const openPlay = useWorkspaceStore((s) => s.openPlay);
  const openStudio = useWorkspaceStore((s) => s.openStudio);
  const openChallenge = useWorkspaceStore((s) => s.openChallenge);
  const createNovel = useWorkspaceStore((s) => s.createNovel);
  const createNewChapter = useWorkspaceStore((s) => s.createNewChapter);
  const createNewScene = useWorkspaceStore((s) => s.createNewScene);
  const updateActiveSceneLocally = useWorkspaceStore((s) => s.updateActiveSceneLocally);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);

  const [copiedHook, setCopiedHook] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  // Find challenge data or default to apocalyptic world challenge
  const challenge = getChallengeById(activeChallengeId || '') || ALL_CHALLENGES[0];

  const otherChallenges = ALL_CHALLENGES.filter((c) => c.id !== challenge.id);

  // Accept challenge and jump into writing
  const handleAcceptChallenge = async () => {
    setIsAccepting(true);
    try {
      const novel = await createNovel({
        title: challenge.title,
        genre: challenge.genre,
        synopsis: challenge.synopsis,
        status: 'In Progress',
      });

      if (novel) {
        // Automatically create initial chapter & starter scene with the prompt hook
        const chapter = await createNewChapter('Chapter 1: The Inciting Breach');
        if (chapter) {
          const scene = await createNewScene(chapter._id, 'Scene 1: Survival Breach');
          if (scene && challenge.starterHook) {
            // Seed content with starter hook
            updateActiveSceneLocally(
              {
                type: 'doc',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: challenge.starterHook }],
                  },
                ],
              },
              challenge.starterHook,
              challenge.starterHook.split(/\s+/).length,
              challenge.starterHook.length
            );
          }
        }
        await openStudio(novel._id);
      } else {
        await startWritingImmediately();
      }
    } catch {
      await startWritingImmediately();
    } finally {
      setIsAccepting(false);
    }
  };

  const handleCopyHook = () => {
    navigator.clipboard.writeText(challenge.starterHook);
    setCopiedHook(true);
    setTimeout(() => setCopiedHook(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `HOT CHALLENGE: ${challenge.title}`,
        text: `${challenge.synopsis}\n\nJoin the challenge on Alterjot!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-12">
      {/* Top sticky navigation bar */}
      <header className="sticky top-0 z-30 bg-canvas/90 backdrop-blur-md border-b border-canvas-border px-4 sm:px-8 md:px-12 py-3 transition-colors">
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={openDashboard}
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-ink-muted hover:text-ink transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-brand-600 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>HOT CHALLENGE</span>
            </span>

            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-none border border-canvas-border hover:bg-canvas-surface text-ink-muted hover:text-ink transition-colors cursor-pointer"
              title="Share challenge"
            >
              {copiedShare ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main container */}
      <main className="w-full px-4 sm:px-8 md:px-12 py-6 sm:py-10 space-y-8 sm:space-y-10">
        {/* HERO SECTION */}
        <div className="relative rounded-none overflow-hidden bg-gradient-to-br from-[#2c221a] via-[#1e1712] to-[#120e0a] text-white p-6 sm:p-10 shadow-none border border-black/20">
          {/* Ambient warm glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/15 rounded-none blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start">
            {/* Visual Cover / Thumbnail */}
            <div className="w-40 sm:w-52 aspect-[2/3] flex-shrink-0 relative group select-none">
              <img
                src={challenge.coverImage}
                alt={challenge.title}
                className="w-full h-full object-cover rounded-lg shadow-2xl border border-white/15 group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/60 via-white/10 to-transparent rounded-l-lg pointer-events-none" />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono text-amber-400 font-bold border border-amber-500/30">
                {challenge.badgeEmoji} {challenge.type === 'world' ? 'WORLD' : 'TRIAD'}
              </div>
            </div>

            {/* Info and Synopsis */}
            <div className="flex-1 min-w-0 space-y-4 text-center md:text-left">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    {challenge.universe}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-[11px] font-mono text-neutral-300 bg-white/10 px-2 py-0.5 rounded-full">
                    {challenge.genre}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-tight leading-tight">
                  {challenge.title}
                </h1>
                <p className="text-sm sm:text-base text-amber-200/90 font-serif italic">
                  "{challenge.tagline}"
                </p>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 font-serif leading-relaxed">
                {challenge.synopsis}
              </p>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 max-w-lg mx-auto md:mx-0">
                <div className="p-2.5 sm:p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Difficulty</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono mt-0.5 block truncate">
                    {challenge.difficulty}
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Sprint Target</span>
                  <span className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5 block truncate">
                    {challenge.estimatedTime}
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Scribes Joined</span>
                  <span className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5 block truncate">
                    {challenge.participantsCount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleAcceptChallenge}
                  disabled={isAccepting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-serif font-bold text-sm shadow-lg shadow-brand-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-60"
                >
                  <Feather className="w-4 h-4" />
                  <span>{isAccepting ? 'Seeding Manuscript...' : 'Accept Challenge & Begin Writing'}</span>
                </button>

                <button
                  type="button"
                  onClick={openPlay}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/15"
                >
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span>15-Min Sprint in Play</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* THREE ELEMENTS TRIAD SHOWCASE (if Triad Challenge) */}
        {challenge.threeElements && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                The Mandatory Triad Elements
              </h2>
              <span className="text-xs font-mono text-ink-muted">All 3 must appear in the text</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Element 1: Character */}
              <div className="p-4 sm:p-5 rounded-xl bg-canvas-card border border-canvas-border shadow-parchment flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-canvas-border shadow-xs">
                    <img
                      src={challenge.threeElements.character.image}
                      alt={challenge.threeElements.character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                      <User className="w-3 h-3" /> Character
                    </span>
                    <h3 className="text-base font-serif font-bold text-ink mt-0.5">
                      {challenge.threeElements.character.name}
                    </h3>
                    <p className="text-xs text-ink-muted font-sans mt-1 leading-relaxed">
                      {challenge.threeElements.character.description}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-md bg-canvas-surface border border-canvas-border text-[11px] font-mono text-ink-faint">
                  <span className="font-bold text-amber-700 dark:text-amber-400">Psychological Flaw: </span>
                  {challenge.threeElements.character.quirk}
                </div>
              </div>

              {/* Element 2: Place */}
              <div className="p-4 sm:p-5 rounded-xl bg-canvas-card border border-canvas-border shadow-parchment flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-canvas-border shadow-xs">
                    <img
                      src={challenge.threeElements.place.image}
                      alt={challenge.threeElements.place.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-bold">
                      <MapPin className="w-3 h-3" /> Location
                    </span>
                    <h3 className="text-base font-serif font-bold text-ink mt-0.5">
                      {challenge.threeElements.place.name}
                    </h3>
                    <p className="text-xs text-ink-muted font-sans mt-1 leading-relaxed">
                      {challenge.threeElements.place.description}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-md bg-canvas-surface border border-canvas-border text-[11px] font-mono text-ink-faint">
                  <span className="font-bold text-indigo-700 dark:text-indigo-400">Environmental Danger: </span>
                  {challenge.threeElements.place.hazard}
                </div>
              </div>

              {/* Element 3: Time / World */}
              <div className="p-4 sm:p-5 rounded-xl bg-canvas-card border border-canvas-border shadow-parchment flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-canvas-border shadow-xs">
                    <img
                      src={challenge.threeElements.world.image}
                      alt={challenge.threeElements.world.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                      {challenge.threeElements.world.role?.includes('Time') ? (
                        <>
                          <Clock className="w-3 h-3" /> Time Setting
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3" /> World Rule
                        </>
                      )}
                    </span>
                    <h3 className="text-base font-serif font-bold text-ink mt-0.5">
                      {challenge.threeElements.world.name}
                    </h3>
                    <p className="text-xs text-ink-muted font-sans mt-1 leading-relaxed">
                      {challenge.threeElements.world.description}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-md bg-canvas-surface border border-canvas-border text-[11px] font-mono text-ink-faint">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {challenge.threeElements.world.role?.includes('Time') ? 'Outbreak Clock: ' : 'Cosmological Law: '}
                  </span>
                  {challenge.threeElements.world.rule}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SURVIVAL CONSTRAINTS & CHALLENGE RULES */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-brand-600" />
            Survival Constraints & Rules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challenge.survivalConstraints.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-lg bg-canvas-card border border-canvas-border shadow-xs space-y-2 relative"
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>CONSTRAINT #{idx + 1}</span>
                </div>
                <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* INCITING INCIDENT SPARKS */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            Inciting Incident Seeds
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challenge.incitingSparks.map((spark, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-lg bg-canvas-card border border-canvas-border shadow-xs space-y-2 hover:border-brand-500/40 transition-colors"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 font-bold block">
                  Plot Catalyst #{idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-ink font-serif leading-relaxed italic">
                  "{spark}"
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* STARTER PROSE HOOK (THE OPENING PARAGRAPH) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Starter Prose Hook
            </h2>
            <button
              type="button"
              onClick={handleCopyHook}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-600 hover:text-brand-700 cursor-pointer"
            >
              {copiedHook ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Hook</span>
                </>
              )}
            </button>
          </div>

          <div className="p-5 sm:p-7 rounded-xl bg-canvas-surface border border-canvas-border shadow-inner relative">
            <div className="absolute top-4 left-4 text-4xl font-serif text-ink-faint select-none">“</div>
            <p className="text-sm sm:text-base text-ink font-serif leading-relaxed pl-6 italic">
              {challenge.starterHook}
            </p>
            <div className="mt-4 pt-3 border-t border-canvas-border/70 flex justify-between items-center text-xs font-mono text-ink-muted">
              <span>Target: {challenge.wordGoal}</span>
              <button
                type="button"
                onClick={handleAcceptChallenge}
                className="text-brand-600 hover:underline font-bold flex items-center gap-1"
              >
                Insert this opening & write <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

        {/* EXPLORE OTHER HOT CHALLENGES */}
        <section className="space-y-4 pt-4 border-t border-canvas-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-ink tracking-tight flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" />
              Explore More Hot Challenges
            </h3>
            <span className="text-xs font-mono text-ink-muted">Select to view dossier</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {otherChallenges.slice(0, 4).map((other) => (
              <div
                key={other.id}
                onClick={() => openChallenge(other.id)}
                className="p-3 rounded-lg bg-canvas-card border border-canvas-border hover:border-brand-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-full aspect-[3/2] rounded-md overflow-hidden border border-canvas-border">
                    <img
                      src={other.coverImage}
                      alt={other.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-amber-600 font-bold block truncate">
                      {other.type === 'world' ? 'World Challenge' : 'Three Elements Triad'}
                    </span>
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-ink group-hover:text-brand-600 transition-colors line-clamp-1 mt-0.5">
                      {other.title}
                    </h4>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-canvas-border/60 flex items-center justify-between text-[10px] font-mono text-ink-muted">
                  <span>{other.difficulty}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-brand-600" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
