import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Dice5,
  Dices,
  ArrowRight,
} from 'lucide-react';
import vampireSiegeBanner from '../../assets/vampire_siege_banner.jpg';
import elevatorDeliveryBanner from '../../assets/elevator_delivery_banner.jpg';
import writingSprintBanner from '../../assets/writing_sprint_banner.jpg';
import storySparkBanner from '../../assets/story_spark_banner.jpg';
import { RankingSection } from '../ranking/RankingSection';
import { Footer } from '../layout/Footer';

export const PlayView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useWorkspaceStore((s) => s.isAuthenticated);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);
  const startWritingImmediately = useWorkspaceStore((s) => s.startWritingImmediately);
  const openStudio = useWorkspaceStore((s) => s.openStudio);
  const activeScene = useWorkspaceStore((s) => s.activeScene);
  const openChallenge = useWorkspaceStore((s) => s.openChallenge);
  const preferredTheme = useWorkspaceStore((s) => s.preferredTheme);
  const createNovel = useWorkspaceStore((s) => s.createNovel);
  const createNewChapter = useWorkspaceStore((s) => s.createNewChapter);
  const createNewScene = useWorkspaceStore((s) => s.createNewScene);
  const updateActiveSceneLocally = useWorkspaceStore((s) => s.updateActiveSceneLocally);

  // Challenge navigation targets
  const challengeIdWorld =
    preferredTheme === 'cyberpunk'
      ? 'cyberpunk-world'
      : preferredTheme === 'dark-fantasy'
      ? 'dark-fantasy-world'
      : preferredTheme === 'steampunk'
      ? 'steampunk-world'
      : 'apocalyptic-world';

  const challengeIdTriad =
    preferredTheme === 'cyberpunk'
      ? 'cyberpunk-triad'
      : preferredTheme === 'dark-fantasy'
      ? 'dark-fantasy-triad'
      : preferredTheme === 'steampunk'
      ? 'steampunk-triad'
      : 'apocalyptic-triad';

  // Smooth scroll to rankings section when loaded with #rankings
  useEffect(() => {
    if (location.hash === '#rankings') {
      const timer = setTimeout(() => {
        const el = document.getElementById('rankings');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  // --- SPRINT TIMER STATE ---
  const [sprintMinutes, setSprintMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sprintCompleted, setSprintCompleted] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setSprintCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSetDuration = (mins: number) => {
    setIsRunning(false);
    setSprintMinutes(mins);
    setTimeLeft(mins * 60);
    setSprintCompleted(false);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sprintMinutes * 60);
    setSprintCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- STORY SPARK SLOTS (Collapse & Survival) ---
  const genres = [
    'Post-Apocalyptic Survival',
    'Societal Collapse & The Fall',
    'Nuclear Winter & Fallout',
    'Biohazard & Pandemic Ruin',
    'EMP & Tech Blackout',
    'Bunker & Vault Dystopia',
  ];
  const protagonists = [
    'A solitary Geiger scavenger',
    'An ex-telecom technician guarding the last ham radio tower',
    'A quarantine medic with three expiring ampoules of antitoxin',
    'A vault hydro-engineer whose water filters just failed',
    'A wandering cartographer tracing dead highway sectors',
    'A convoy scout who knows which dead cities are booby-trapped',
  ];
  const catalysts = [
    'picks up a repeating radio broadcast from an abandoned military bunker',
    'discovers the radiation dosimeter has spiked 500% in a supposedly safe sanctuary',
    'finds the underground aquifer contaminated with industrial ash',
    'encounters an automated defense drone executing a forgotten war order',
    'unearths a sealed pre-collapse fallout shelter bolted from the inside',
    'intercepts a distress flare from an uncharted offshore oil platform',
  ];
  const twists = [
    'the "clean sanctuary" enclave is running on an unshielded nuclear core',
    'the broadcast was pre-recorded sixty years before society collapsed',
    'the antidote works, but causes permanent memory loss of the old world',
    'the ash storm on the horizon is not natural weather but a rogue atmospheric weapon',
    'the scavenged ration crate is stamped with their own family name',
  ];

  const [currentGenre, setCurrentGenre] = useState(genres[0]);
  const [currentProtagonist, setCurrentProtagonist] = useState(protagonists[0]);
  const [currentCatalyst, setCurrentCatalyst] = useState(catalysts[0]);
  const [currentTwist, setCurrentTwist] = useState(twists[0]);

  const rollStoryWheel = () => {
    setCurrentGenre(genres[Math.floor(Math.random() * genres.length)]);
    setCurrentProtagonist(protagonists[Math.floor(Math.random() * protagonists.length)]);
    setCurrentCatalyst(catalysts[Math.floor(Math.random() * catalysts.length)]);
    setCurrentTwist(twists[Math.floor(Math.random() * twists.length)]);
  };

  // --- WORD ROULETTE (Survival Terminology) ---
  const wordBank = [
    'fallout',
    'geiger',
    'dosimeter',
    'ash',
    'bunker',
    'scavenge',
    'rations',
    'quarantine',
    'blackout',
    'static',
    'cinder',
    'perimeter',
    'reactor',
    'beacon',
    'salvage',
    'remnant',
    'obsidian',
    'aquifer',
    'convoy',
    'relic',
  ];
  const [rouletteWords, setRouletteWords] = useState(['geiger', 'bunker', 'rations']);

  const spinWordRoulette = () => {
    const shuffled = [...wordBank].sort(() => 0.5 - Math.random());
    setRouletteWords(shuffled.slice(0, 3));
  };

  const handleStartSprintInStudio = async () => {
    setIsRunning(true);
    if (activeScene) {
      await openStudio();
    } else {
      await startWritingImmediately();
    }
  };

  const handleDraftWithSpark = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true, 'signin');
      return;
    }
    const novelTitle = `${currentGenre}: ${currentProtagonist.replace(/^An? /i, '')}`;
    const synopsis = `${currentProtagonist} ${currentCatalyst}, and ${currentTwist}. Secret word constraints: ${rouletteWords.join(', ')}.`;
    const novel = await createNovel({
      title: novelTitle,
      genre: currentGenre,
      synopsis: synopsis,
      status: 'In Progress',
    });
    if (novel) {
      const chapter = await createNewChapter('Chapter 1: The Inciting Catalyst');
      if (chapter) {
        const scene = await createNewScene(chapter._id, 'Scene 1: Survival Breach');
        if (scene) {
          const starterText = `${synopsis}\n\n`;
          updateActiveSceneLocally(
            {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: starterText }],
                },
              ],
            },
            starterText,
            starterText.split(/\s+/).length,
            starterText.length
          );
        }
      }
      await openStudio(novel._id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 overflow-y-auto bg-canvas text-ink p-4 sm:p-8 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full text-center p-6 sm:p-8 rounded-xl bg-canvas-card border border-canvas-border shadow-parchment-lg space-y-4">
          <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center mx-auto shadow-sm">
            <Dices className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-bold">Creative Playground</span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink mt-1">Sign In Required</h2>
            <p className="text-xs text-ink-muted font-sans mt-2 leading-relaxed">
              Sign in to participate in writing challenges, timed sprints, and procedural story sparks.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true, 'signin')}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-sm shadow-md shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Sign In to Access Playground</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-12">
      {/* Full width panel container with 4 separate challenge panels */}
      <div className="w-full px-4 sm:px-8 md:px-12 py-6 sm:py-10 space-y-8 sm:space-y-12">

        {/* ========================================================
            1. WORLD CHALLENGE PANEL (FIRST)
        ======================================================== */}
        <div
          onClick={() => {
            openChallenge(challengeIdWorld);
            navigate(`/challenge/${challengeIdWorld}`);
          }}
          className="relative rounded-xl overflow-hidden border border-canvas-border shadow-parchment-lg group select-none bg-stone-950 transition-all duration-300 hover:border-amber-500/50 cursor-pointer"
        >
          <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] overflow-hidden">
            {/* Background Image */}
            <img
              src={vampireSiegeBanner}
              alt="World Challenge: Phantom of Their Nightmares"
              draggable={false}
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out pointer-events-none select-none"
            />

            {/* Ambient Lighting Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/85 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Top-Left Panel Header Badge */}
            <div className="absolute top-0 left-0 p-4 sm:p-6 md:p-8 z-20 pointer-events-none flex items-center">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/15 rounded-none shadow-sm">
                <div className="w-0.5 h-3 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-100 drop-shadow-sm">
                  World Challenge
                </h2>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end pointer-events-none z-10">
              <div className="space-y-2.5 max-w-2xl pl-1">
                {/* Big Challenge Type / Main Heading */}
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-white tracking-tight drop-shadow-xl leading-none">
                  World Challenge
                </h2>

                {/* Challenge Title & Universe Subtext */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap pt-0.5">
                  <span className="text-base sm:text-xl md:text-2xl font-serif font-bold text-amber-300 drop-shadow-md">
                    Phantom of Their Nightmares
                  </span>
                  <span className="text-xs font-mono text-white/75 hidden sm:inline">
                    • The Last Bastion • Midnight Siege
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-200 font-serif line-clamp-3 sm:line-clamp-4 drop-shadow-md leading-relaxed">
                  By night, the streets belong entirely to the infected—pale, predatory vampires who swarm out of the dark to besiege his fortified house, clawing at the barricades while he waits out the siege inside with whiskey, blaring music, and fresh wooden stakes. It is an inversion of nature where humanity is extinct, the monsters are the dominant society, and the last surviving man has become the phantom of their nightmares.
                </p>

                {/* CTA Action Button */}
                <div className="pointer-events-auto pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openChallenge(challengeIdWorld);
                      navigate(`/challenge/${challengeIdWorld}`);
                    }}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-none bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
                  >
                    <span>Join World Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. THREE ELEMENTS CHALLENGE PANEL (BELOW WORLD CHALLENGE)
        ======================================================== */}
        <div
          onClick={() => {
            openChallenge(challengeIdTriad);
            navigate(`/challenge/${challengeIdTriad}`);
          }}
          className="relative rounded-xl overflow-hidden border border-canvas-border shadow-parchment-lg group select-none bg-stone-950 transition-all duration-300 hover:border-cyan-500/50 cursor-pointer"
        >
          <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] overflow-hidden">
            {/* Background Image */}
            <img
              src={elevatorDeliveryBanner}
              alt="Three Elements Challenge: The 43rd Floor Delivery"
              draggable={false}
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out pointer-events-none select-none"
            />

            {/* Ambient Lighting Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/85 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Top-Left Panel Header Badge */}
            <div className="absolute top-0 left-0 p-4 sm:p-6 md:p-8 z-20 pointer-events-none flex items-center">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/15 rounded-none shadow-sm">
                <div className="w-0.5 h-3 bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-100 drop-shadow-sm">
                  Three Elements
                </h2>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end pointer-events-none z-10">
              <div className="space-y-2.5 max-w-2xl pl-1">
                {/* Big Challenge Type / Main Heading */}
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-white tracking-tight drop-shadow-xl leading-none">
                  Three Elements
                </h2>

                {/* Challenge Title & Universe Subtext */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap pt-0.5">
                  <span className="text-base sm:text-xl md:text-2xl font-serif font-bold text-amber-300 drop-shadow-md">
                    The 43rd Floor Delivery
                  </span>
                  <span className="text-xs font-mono text-white/75 hidden sm:inline">
                    • Floor 43 Ascent • Outbreak Day 1
                  </span>
                </div>

                {/* Elements Breakdown into One Continuous Highlighted Paragraph */}
                <p className="text-xs sm:text-sm text-neutral-100 font-serif drop-shadow-md max-w-2xl leading-relaxed sm:leading-loose">
                  <span className="box-decoration-clone bg-amber-400/20 text-amber-100 border border-amber-400/40 px-1.5 py-0.5 rounded-none mr-1.5 inline">
                    Day 1 of the zombie apocalypse.
                  </span>{' '}
                  <span className="box-decoration-clone bg-cyan-400/20 text-cyan-100 border border-cyan-400/40 px-1.5 py-0.5 rounded-none mr-1.5 inline">
                    An Asian delivery guy in uniform, holding a food bag and his phone,
                  </span>{' '}
                  <span className="box-decoration-clone bg-rose-400/20 text-rose-100 border border-rose-400/40 px-1.5 py-0.5 rounded-none inline">
                    Inside a rising elevator, passing the 30th floor on its way to the 43rd floor.
                  </span>
                </p>

                {/* CTA Action Button */}
                <div className="pointer-events-auto pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openChallenge(challengeIdTriad);
                      navigate(`/challenge/${challengeIdTriad}`);
                    }}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-none bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
                  >
                    <span>Join Three Elements Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. WRITING SPRINT CHALLENGE PANEL (WITH OWN BANNER)
        ======================================================== */}
        <div className="relative rounded-xl overflow-hidden border border-canvas-border shadow-parchment-lg bg-canvas-card flex flex-col lg:flex-row transition-all duration-300 hover:border-brand-500/40">
          {/* Banner Section */}
          <div className="relative lg:w-7/12 min-h-[260px] sm:min-h-[320px] md:min-h-[380px] overflow-hidden bg-stone-950 group">
            <img
              src={writingSprintBanner}
              alt="Writing Sprint Challenge Banner"
              draggable={false}
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out pointer-events-none select-none"
            />
            {/* Ambient Lighting Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-black/80 lg:to-transparent pointer-events-none" />

            {/* Top-Left Header Badge */}
            <div className="absolute top-0 left-0 p-4 sm:p-6 md:p-8 z-20 pointer-events-none flex items-center">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/15 rounded-none shadow-sm">
                <div className="w-0.5 h-3 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-100 drop-shadow-sm flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  Writing Sprint
                </h2>
              </div>
            </div>

            {/* Banner Lower Text */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8 z-10 space-y-2 pointer-events-none">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white tracking-tight drop-shadow-xl leading-none">
                The Hourglass Trial
              </h2>
              <div className="text-sm font-serif font-bold text-amber-300 drop-shadow-md">
                Pomodoro Focus Burst • Silence Your Inner Critic
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 font-serif drop-shadow-md max-w-xl leading-relaxed">
                Race against time to pour raw thoughts onto the page without hesitation. Select your countdown, lock in your concentration, and let the sprint carry your prose forward.
              </p>
            </div>
          </div>

          {/* Interactive Timer Controls Section */}
          <div className="lg:w-5/12 p-5 sm:p-8 flex flex-col justify-between bg-canvas-card border-t lg:border-t-0 lg:border-l border-canvas-border space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-brand-700">
                  Pomodoro Interval
                </span>
                <span className="text-[11px] font-mono text-ink-faint">
                  {sprintMinutes} min challenge
                </span>
              </div>

              {/* Big Digital Countdown */}
              <div className="text-center py-6 px-4 rounded-lg bg-canvas-surface border border-canvas-border shadow-inner">
                <span className="font-mono text-5xl font-bold tracking-tight text-ink">
                  {formatTime(timeLeft)}
                </span>
                <div className="mt-2 text-xs font-mono text-ink-muted">
                  {isRunning ? (
                    <span className="text-emerald-700 dark:text-emerald-400 animate-pulse font-semibold">
                      ⚡ SPRINT IN PROGRESS — WRITE!
                    </span>
                  ) : sprintCompleted ? (
                    <span className="text-amber-700 dark:text-amber-400 font-semibold">
                      🎉 SPRINT COMPLETE! GREAT JOB!
                    </span>
                  ) : (
                    <span>Ready for a quick focus burst?</span>
                  )}
                </div>
              </div>

              {/* Preset Selector */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs font-mono">
                {[5, 15, 25, 45].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSetDuration(m)}
                    className={`px-3 py-1.5 rounded-md border transition-colors cursor-pointer ${
                      sprintMinutes === m
                        ? 'bg-brand-600 text-white border-brand-700 font-semibold shadow-sm'
                        : 'bg-canvas-card border-canvas-border text-ink-muted hover:text-ink'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Controls */}
            <div className="space-y-2.5 pt-4 border-t border-canvas-border">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-serif font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
                    isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-brand-600 hover:bg-brand-700'
                  }`}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? 'Pause Timer' : 'Start Sprint'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetTimer}
                  className="p-2.5 rounded-lg bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink-muted hover:text-ink transition-colors cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleStartSprintInStudio}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink-muted hover:text-brand-700 text-xs font-mono transition-colors cursor-pointer"
              >
                <span>Open Studio with Active Sprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            4. STORY SPARK GENERATOR CHALLENGE PANEL (WITH OWN BANNER)
        ======================================================== */}
        <div className="relative rounded-xl overflow-hidden border border-canvas-border shadow-parchment-lg bg-canvas-card flex flex-col lg:flex-row transition-all duration-300 hover:border-brand-500/40">
          {/* Banner Section */}
          <div className="relative lg:w-5/12 min-h-[260px] sm:min-h-[320px] md:min-h-[380px] overflow-hidden bg-stone-950 group">
            <img
              src={storySparkBanner}
              alt="Story Spark Generator Challenge Banner"
              draggable={false}
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out pointer-events-none select-none"
            />
            {/* Ambient Lighting Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-black/80 lg:to-transparent pointer-events-none" />

            {/* Top-Left Header Badge */}
            <div className="absolute top-0 left-0 p-4 sm:p-6 md:p-8 z-20 pointer-events-none flex items-center">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/15 rounded-none shadow-sm">
                <div className="w-0.5 h-3 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                <h2 className="text-xs sm:text-sm font-serif font-bold tracking-widest uppercase text-stone-100 drop-shadow-sm flex items-center gap-1.5">
                  <Dices className="w-3.5 h-3.5 text-amber-400" />
                  Story Spark
                </h2>
              </div>
            </div>

            {/* Banner Lower Text */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8 z-10 space-y-2 pointer-events-none">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white tracking-tight drop-shadow-xl leading-none">
                Story Spark Generator
              </h2>
              <div className="text-sm font-serif font-bold text-amber-300 drop-shadow-md">
                Procedural Narrative Slots • Word Roulette
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 font-serif drop-shadow-md max-w-md leading-relaxed">
                Roll the dice of fate to forge unforeseen premises, desperate protagonists, catastrophic catalysts, and wild narrative twists to ignite your next chapter.
              </p>
            </div>
          </div>

          {/* Interactive Spark Generator & Slots Section */}
          <div className="lg:w-7/12 p-5 sm:p-8 flex flex-col justify-between bg-canvas-card border-t lg:border-t-0 lg:border-l border-canvas-border space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-brand-700">
                  Procedural Premise Roller
                </span>
                <button
                  type="button"
                  onClick={rollStoryWheel}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/40 text-xs font-mono font-semibold hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <Dice5 className="w-3.5 h-3.5" />
                  <span>Roll New Spark</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Genre Slot */}
                <div className="p-3.5 rounded-lg bg-canvas-surface border border-canvas-border space-y-1">
                  <span className="text-[10px] font-mono text-ink-faint uppercase font-semibold">Genre</span>
                  <div className="font-serif font-bold text-sm text-brand-700">{currentGenre}</div>
                </div>

                {/* Protagonist Slot */}
                <div className="p-3.5 rounded-lg bg-canvas-surface border border-canvas-border space-y-1">
                  <span className="text-[10px] font-mono text-ink-faint uppercase font-semibold">Protagonist</span>
                  <div className="font-serif font-medium text-ink">{currentProtagonist}</div>
                </div>

                {/* Catalyst Slot */}
                <div className="p-3.5 rounded-lg bg-canvas-surface border border-canvas-border space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-mono text-ink-faint uppercase font-semibold">Inciting Catalyst</span>
                  <div className="font-serif font-medium text-ink leading-relaxed">{currentCatalyst}</div>
                </div>

                {/* Twist Slot */}
                <div className="p-3.5 rounded-lg bg-canvas-surface border border-canvas-border space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-mono text-ink-faint uppercase font-semibold">Wildcard Twist</span>
                  <div className="font-serif italic text-amber-800 dark:text-amber-300 leading-relaxed">
                    &ldquo;...and {currentTwist}&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* Word Roulette & Action */}
            <div className="pt-4 border-t border-canvas-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-ink-muted">Roulette:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {rouletteWords.map((w) => (
                    <span
                      key={w}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-canvas-surface border border-canvas-border text-ink font-semibold"
                    >
                      {w}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={spinWordRoulette}
                    className="p-1 text-ink-muted hover:text-brand-700 transition-colors cursor-pointer"
                    title="Spin new secret words"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDraftWithSpark}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-serif text-xs font-semibold shadow-md transition-all w-full sm:w-auto cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Draft With This Prompt</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            5. ATELIER SCRIBES RANKINGS (AT BOTTOM OF PLAY)
        ======================================================== */}
        <div className="border-t border-canvas-border/80 pt-8 sm:pt-10">
          <RankingSection />
        </div>

      </div>

      {/* Website Footer at bottom of Play */}
      <Footer />
    </div>
  );
};
