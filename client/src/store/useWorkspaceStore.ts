import { create } from 'zustand';
import type { Novel, Chapter, Scene, CodexEntry, SaveStatus, NarrativeTheme, OnboardingAnswers, AuthUser } from '../types';
import { api } from '../services/api';

interface PanelState {
  isSidebarOpen: boolean;
  isCodexOpen: boolean;
  isZenMode: boolean;
  isNotesDeckOpen: boolean;
}

interface TypographySettings {
  fontFamily: 'serif' | 'sans' | 'typewriter' | 'mono';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  fontSize: number;
}

interface WorkspaceState {
  currentView: 'dashboard' | 'landing' | 'library' | 'studio' | 'play' | 'ranking';
  activeNovelId: string | null;
  activeChapterId: string | null;
  activeSceneId: string | null;

  penName: string;
  setPenName: (name: string) => void;

  novels: Novel[];
  chapters: Chapter[];
  scenes: Scene[];
  codexEntries: CodexEntry[];
  activeScene: Scene | null;

  panelState: PanelState;
  typography: TypographySettings;

  // Theme: 'light' (Light Retro - default) | 'dark'
  theme: 'light' | 'dark';
  toggleTheme: (event?: { clientX?: number; clientY?: number } | MouseEvent | any) => void;
  setTheme: (theme: 'light' | 'dark', coords?: { x: number; y: number }) => void;

  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  serverConnected: boolean;
  isAtlas: boolean;

  isDashboardOpen: boolean;
  isExportOpen: boolean;
  isNewNovelModalOpen: boolean;

  librarySearchQuery: string;
  setLibrarySearchQuery: (query: string) => void;

  setCurrentView: (view: 'dashboard' | 'landing' | 'library' | 'studio' | 'play' | 'ranking') => void;
  openDashboard: () => void;
  openLanding: () => void;
  openLibrary: () => void;
  openPlay: () => void;
  openRanking: () => void;
  openStudio: (novelId?: string) => Promise<void>;

  setPanelState: (partial: Partial<PanelState>) => void;
  toggleSidebar: () => void;
  toggleCodex: () => void;
  toggleNotesDeck: () => void;
  toggleZenMode: () => void;
  setZenMode: (val: boolean) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setTypography: (partial: Partial<TypographySettings>) => void;
  setIsDashboardOpen: (val: boolean) => void;
  setIsExportOpen: (val: boolean) => void;
  setIsNewNovelModalOpen: (val: boolean) => void;

  selectNovel: (novelId: string) => Promise<void>;
  selectChapter: (chapterId: string) => void;
  selectScene: (sceneId: string) => Promise<void>;

  startWritingImmediately: () => Promise<void>;
  createNovel: (data: Partial<Novel>) => Promise<Novel | null>;
  updateNovel: (novelId: string, data: Partial<Novel>) => Promise<void>;
  deleteNovel: (novelId: string) => Promise<void>;
  updateSceneTitle: (sceneId: string, title: string) => Promise<void>;
  updateChapterTitle: (chapterId: string, title: string) => Promise<void>;

  loadInitialWorkspace: () => Promise<void>;
  refreshNovel: () => Promise<void>;
  refreshChaptersAndScenes: () => Promise<void>;
  refreshCodex: () => Promise<void>;

  updateActiveSceneLocally: (contentJson: any, plainText: string, wordCount: number, characterCount: number) => void;
  updateSceneMetadataLocally: (metadata: Partial<Scene['metadata']>) => void;

  createNewChapter: (title?: string) => Promise<Chapter | null>;
  createNewScene: (chapterId: string, title?: string) => Promise<Scene | null>;
  deleteChapter: (chapterId: string) => Promise<void>;
  deleteScene: (sceneId: string) => Promise<void>;
  reorderChapters: (orderedIds: string[]) => Promise<void>;
  reorderScenes: (chapterId: string, orderedIds: string[]) => Promise<void>;

  // Auth & Onboarding
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  hasCompletedOnboarding: boolean;
  isOnboardingModalOpen: boolean;
  preferredTheme: NarrativeTheme;

  login: (penName: string, email?: string) => void;
  logout: () => void;
  setIsAuthModalOpen: (open: boolean, mode?: 'signin' | 'signup') => void;
  setIsOnboardingModalOpen: (open: boolean) => void;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  setPreferredTheme: (theme: NarrativeTheme) => void;
  requireAuth: (callback?: () => void) => boolean;
}

// Read initial theme preference: default to 'light' (Light Retro)
const initialTheme = (typeof window !== 'undefined' && (localStorage.getItem('alterjot_theme') as 'light' | 'dark')) || 'light';
if (typeof document !== 'undefined') {
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Track ongoing theme transition to prevent clashing
let isTransitioningTheme = false;

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  currentView: 'dashboard',
  activeNovelId: null,
  activeChapterId: null,
  activeSceneId: null,

  penName: (typeof window !== 'undefined' && localStorage.getItem('alterjot_pen_name')) || 'Ernest Quill',
  setPenName: (name) => {
    try {
      localStorage.setItem('alterjot_pen_name', name);
    } catch {}
    set({ penName: name });
  },

  // Auth & Onboarding State
  isAuthenticated: (typeof window !== 'undefined' && localStorage.getItem('alterjot_auth') === 'true') || false,
  currentUser:
    typeof window !== 'undefined' && localStorage.getItem('alterjot_auth') === 'true'
      ? {
          id: localStorage.getItem('alterjot_user_id') || 'author_default',
          penName: localStorage.getItem('alterjot_pen_name') || 'Ernest Quill',
          email: localStorage.getItem('alterjot_user_email') || 'scribe@alterjot.com',
        }
      : null,
  isAuthModalOpen: false,
  authModalMode: 'signin',
  hasCompletedOnboarding: (typeof window !== 'undefined' && localStorage.getItem('alterjot_onboarded') === 'true') || false,
  isOnboardingModalOpen: false,
  preferredTheme: ((typeof window !== 'undefined' && localStorage.getItem('alterjot_preferred_theme')) as NarrativeTheme) || 'apocalyptic',

  novels: [],
  chapters: [],
  scenes: [],
  codexEntries: [],
  activeScene: null,

  panelState: {
    isSidebarOpen: true,
    isCodexOpen: false,
    isZenMode: false,
    isNotesDeckOpen: true,
  },

  typography: {
    fontFamily: 'serif',
    lineHeight: 'relaxed',
    fontSize: 18,
  },

  theme: initialTheme,

  toggleTheme: (event) => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    let coords: { x: number; y: number } | undefined;
    if (event && 'clientX' in event && typeof event.clientX === 'number') {
      coords = { x: event.clientX, y: event.clientY };
    }
    get().setTheme(nextTheme, coords);
  },

  setTheme: async (theme, coords) => {
    if (typeof document === 'undefined') {
      set({ theme });
      return;
    }

    if (get().theme === theme && document.documentElement.classList.contains(theme)) {
      return;
    }

    if (isTransitioningTheme) return;

    const isDark = theme === 'dark';
    const applyDOMTheme = () => {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('alterjot_theme', theme);
      } catch {
        // ignore
      }
    };

    const isViewTransitionSupported =
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isViewTransitionSupported) {
      document.documentElement.classList.add('theme-transitioning');
      applyDOMTheme();
      set({ theme });
      window.setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 350);
      return;
    }

    // Determine circular animation origin coordinates
    let x = coords?.x;
    let y = coords?.y;

    if (x === undefined || y === undefined) {
      const btn = document.getElementById('theme-toggle-btn');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else {
        x = window.innerWidth - 60;
        y = 30;
      }
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    isTransitioningTheme = true;

    try {
      const transition = (document as any).startViewTransition(() => {
        applyDOMTheme();
        set({ theme });
      });

      await transition.ready;

      const animation = document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 480,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)',
        }
      );

      // Wait for both the expanding wave and the browser view transition to finalize cleanly
      await Promise.all([
        animation.finished,
        transition.finished.catch(() => {}),
      ]);
    } catch {
      applyDOMTheme();
      set({ theme });
    } finally {
      isTransitioningTheme = false;
    }
  },

  setCurrentView: (view) => set({ currentView: view }),
  openDashboard: () => set({ currentView: 'dashboard' }),
  openLanding: () => set({ currentView: 'dashboard' }),
  openLibrary: () => {
    if (get().requireAuth(() => set({ currentView: 'library' }))) {
      set({ currentView: 'library' });
    }
  },
  openPlay: () => {
    if (get().requireAuth(() => set({ currentView: 'play' }))) {
      set({ currentView: 'play' });
    }
  },
  openRanking: () => {
    if (get().requireAuth(() => set({ currentView: 'ranking' }))) {
      set({ currentView: 'ranking' });
    }
  },
  openStudio: async (novelId) => {
    if (!get().requireAuth()) return;
    const targetId = novelId || get().activeNovelId;
    if (targetId) {
      await get().selectNovel(targetId);
      set({ currentView: 'studio' });
    }
  },

  // Auth & Onboarding Actions
  login: (penName: string, email?: string) => {
    const finalPenName = penName.trim() || 'Ernest Quill';
    const finalEmail = email?.trim() || `${finalPenName.toLowerCase().replace(/\s+/g, '')}@alterjot.com`;
    const user: AuthUser = {
      id: 'author_' + Date.now(),
      penName: finalPenName,
      email: finalEmail,
    };
    try {
      localStorage.setItem('alterjot_auth', 'true');
      localStorage.setItem('alterjot_pen_name', finalPenName);
      localStorage.setItem('alterjot_user_id', user.id);
      localStorage.setItem('alterjot_user_email', finalEmail);
    } catch {}

    const hasOnboarded = typeof window !== 'undefined' && localStorage.getItem('alterjot_onboarded') === 'true';
    set({
      isAuthenticated: true,
      currentUser: user,
      penName: finalPenName,
      isAuthModalOpen: false,
      isOnboardingModalOpen: !hasOnboarded,
    });
  },

  logout: () => {
    try {
      localStorage.removeItem('alterjot_auth');
      localStorage.removeItem('alterjot_user_id');
      localStorage.removeItem('alterjot_user_email');
    } catch {}
    set({
      isAuthenticated: false,
      currentUser: null,
      currentView: 'dashboard',
    });
  },

  setIsAuthModalOpen: (open, mode = 'signin') => {
    set({ isAuthModalOpen: open, authModalMode: mode });
  },

  setIsOnboardingModalOpen: (open) => {
    set({ isOnboardingModalOpen: open });
  },

  completeOnboarding: (answers) => {
    const finalPenName = answers.penName.trim() || get().penName;
    try {
      localStorage.setItem('alterjot_onboarded', 'true');
      localStorage.setItem('alterjot_preferred_theme', answers.preferredTheme);
      localStorage.setItem('alterjot_pen_name', finalPenName);
      localStorage.setItem('alterjot_writing_goal', answers.writingGoal);
      localStorage.setItem('alterjot_ambiance', answers.ambiance);
    } catch {}

    set({
      hasCompletedOnboarding: true,
      preferredTheme: answers.preferredTheme,
      penName: finalPenName,
      isOnboardingModalOpen: false,
      currentUser: get().currentUser ? { ...get().currentUser!, penName: finalPenName } : null,
    });
  },

  setPreferredTheme: (theme) => {
    try {
      localStorage.setItem('alterjot_preferred_theme', theme);
    } catch {}
    set({ preferredTheme: theme });
  },

  requireAuth: (callback) => {
    if (get().isAuthenticated) {
      if (callback) callback();
      return true;
    }
    set({ isAuthModalOpen: true });
    return false;
  },

  saveStatus: 'idle',
  lastSavedAt: null,
  serverConnected: true,
  isAtlas: false,

  isDashboardOpen: false,
  isExportOpen: false,
  isNewNovelModalOpen: false,

  librarySearchQuery: '',
  setLibrarySearchQuery: (query) => set({ librarySearchQuery: query }),

  setPanelState: (partial) =>
    set((state) => ({
      panelState: { ...state.panelState, ...partial },
    })),

  toggleSidebar: () =>
    set((state) => ({
      panelState: { ...state.panelState, isSidebarOpen: !state.panelState.isSidebarOpen },
    })),

  toggleCodex: () =>
    set((state) => ({
      panelState: { ...state.panelState, isCodexOpen: !state.panelState.isCodexOpen },
    })),

  toggleNotesDeck: () =>
    set((state) => ({
      panelState: { ...state.panelState, isNotesDeckOpen: !state.panelState.isNotesDeckOpen },
    })),

  toggleZenMode: () =>
    set((state) => {
      const nextZen = !state.panelState.isZenMode;
      return {
        panelState: {
          ...state.panelState,
          isZenMode: nextZen,
          isSidebarOpen: nextZen ? false : true,
          isCodexOpen: false,
        },
      };
    }),

  setZenMode: (val) =>
    set((state) => ({
      panelState: {
        ...state.panelState,
        isZenMode: val,
        isSidebarOpen: val ? false : true,
        isCodexOpen: false,
      },
    })),

  setSaveStatus: (status) => set({ saveStatus: status }),
  setTypography: (partial) =>
    set((state) => ({
      typography: { ...state.typography, ...partial },
    })),

  setIsDashboardOpen: (val) => set({ isDashboardOpen: val }),
  setIsExportOpen: (val) => set({ isExportOpen: val }),
  setIsNewNovelModalOpen: (val) => set({ isNewNovelModalOpen: val }),

  updateActiveSceneLocally: (contentJson, plainText, wordCount, characterCount) => {
    const { activeScene, scenes } = get();
    if (!activeScene) return;

    const wordDelta = wordCount - (activeScene.wordCount || 0);
    const updatedScene: Scene = {
      ...activeScene,
      contentJson,
      plainText,
      wordCount,
      characterCount,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(`alterjot_scene_${activeScene._id}`, JSON.stringify(updatedScene));
      localStorage.setItem('alterjot_last_scene_id', activeScene._id);
    } catch (e) {
      console.warn('localStorage write failed:', e);
    }

    set({
      activeScene: updatedScene,
      scenes: scenes.map((s) => (s._id === updatedScene._id ? updatedScene : s)),
      novels: get().novels.map((n) =>
        n._id === updatedScene.novelId
          ? { ...n, totalWordCount: Math.max(0, (n.totalWordCount || 0) + wordDelta) }
          : n
      ),
    });
  },

  updateSceneMetadataLocally: (metadata) => {
    const { activeScene, scenes } = get();
    if (!activeScene) return;

    const updatedScene: Scene = {
      ...activeScene,
      metadata: { ...activeScene.metadata, ...metadata },
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(`alterjot_scene_${activeScene._id}`, JSON.stringify(updatedScene));
    } catch (e) {
      console.warn('localStorage write failed:', e);
    }

    set({
      activeScene: updatedScene,
      scenes: scenes.map((s) => (s._id === updatedScene._id ? updatedScene : s)),
    });
  },

  startWritingImmediately: async () => {
    if (!get().requireAuth()) return;
    // Always start a fresh untitled manuscript ready for immediate drafting
    await get().createNovel({
      title: 'Untitled Manuscript',
      subtitle: '',
      author: get().penName,
      genre: 'General Fiction',
      status: 'In Progress',
      targetWordCount: 50000,
    });
  },

  createNovel: async (data) => {
    if (!get().requireAuth()) return null;
    try {
      const payload: Partial<Novel> = {
        ...data,
        title: data.title?.trim() || 'Untitled Manuscript',
        author: data.author?.trim() || get().penName,
        genre: data.genre || 'General Fiction',
        status: data.status || 'In Progress',
        targetWordCount: data.targetWordCount || 50000,
      };

      const novel = await api.createNovel(payload);
      const updatedNovels = [novel, ...get().novels];
      set({ novels: updatedNovels, activeNovelId: novel._id });
      localStorage.setItem('alterjot_last_novel_id', novel._id);

      // Retrieve or ensure initial chapter and clean scene
      let chapters = await api.getChapters(novel._id).catch(() => []);
      let activeChapter = chapters[0];
      if (!activeChapter) {
        activeChapter = await api.createChapter({
          novelId: novel._id,
          title: 'Chapter 1',
          order: 1,
          status: 'Draft',
        });
        chapters = [activeChapter];
      }

      let scenes = await api.getScenes(activeChapter._id, novel._id).catch(() => []);
      let activeScene = scenes[0];
      if (!activeScene) {
        activeScene = await api.createScene({
          novelId: novel._id,
          chapterId: activeChapter._id,
          title: 'Scene 1',
          order: 1,
          status: 'Draft',
          contentJson: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          },
          plainText: '',
          wordCount: 0,
        });
        scenes = [activeScene];
      }

      set({
        chapters,
        scenes,
        activeChapterId: activeChapter._id,
        activeSceneId: activeScene._id,
        activeScene,
        currentView: 'studio',
      });

      return novel;
    } catch (err) {
      console.error('Failed to create novel:', err);
      return null;
    }
  },

  updateNovel: async (novelId, data) => {
    try {
      const updated = await api.updateNovel(novelId, data);
      set((state) => ({
        novels: state.novels.map((n) => (n._id === novelId ? { ...n, ...updated } : n)),
      }));
    } catch (err) {
      console.error('Failed to update novel:', err);
    }
  },

  updateSceneTitle: async (sceneId, title) => {
    const cleanTitle = title.trim() || 'Untitled Scene';
    set((state) => ({
      scenes: state.scenes.map((s) => (s._id === sceneId ? { ...s, title: cleanTitle } : s)),
      activeScene:
        state.activeScene && state.activeScene._id === sceneId
          ? { ...state.activeScene, title: cleanTitle }
          : state.activeScene,
    }));
    try {
      await api.updateScene(sceneId, { title: cleanTitle });
    } catch (err) {
      console.error('Failed to update scene title:', err);
    }
  },

  updateChapterTitle: async (chapterId, title) => {
    const cleanTitle = title.trim() || 'Untitled Chapter';
    set((state) => ({
      chapters: state.chapters.map((c) => (c._id === chapterId ? { ...c, title: cleanTitle } : c)),
    }));
    try {
      await api.updateChapter(chapterId, { title: cleanTitle });
    } catch (err) {
      console.error('Failed to update chapter title:', err);
    }
  },

  deleteNovel: async (novelId) => {
    try {
      await api.deleteNovel(novelId);
      const remaining = get().novels.filter((n) => n._id !== novelId);
      set({ novels: remaining });
      if (get().activeNovelId === novelId) {
        if (remaining.length > 0) {
          await get().selectNovel(remaining[0]._id);
        } else {
          set({
            activeNovelId: null,
            activeChapterId: null,
            activeSceneId: null,
            activeScene: null,
            chapters: [],
            scenes: [],
            codexEntries: [],
            currentView: 'library',
          });
        }
      }
    } catch (err) {
      console.error('Failed to delete novel:', err);
    }
  },

  selectNovel: async (novelId: string) => {
    set({ activeNovelId: novelId });
    try {
      localStorage.setItem('alterjot_last_novel_id', novelId);
      const [chapters, codex] = await Promise.all([
        api.getChapters(novelId),
        api.getCodex(novelId),
      ]);
      set({ chapters, codexEntries: codex });

      if (chapters.length > 0) {
        const firstChapter = chapters[0];
        set({ activeChapterId: firstChapter._id });
        const scenes = await api.getScenes(firstChapter._id, novelId);
        set({ scenes });
        if (scenes.length > 0) {
          get().selectScene(scenes[0]._id);
        } else {
          set({ activeSceneId: null, activeScene: null });
        }
      } else {
        set({
          activeChapterId: null,
          activeSceneId: null,
          activeScene: null,
          scenes: [],
        });
      }
    } catch (err) {
      console.error('Failed to select novel:', err);
    }
  },

  selectChapter: (chapterId: string) => {
    set({ activeChapterId: chapterId });
    const { activeNovelId } = get();
    if (activeNovelId) {
      api.getScenes(chapterId, activeNovelId).then((scenes) => {
        set({ scenes });
        if (scenes.length > 0) {
          get().selectScene(scenes[0]._id);
        } else {
          set({ activeSceneId: null, activeScene: null });
        }
      });
    }
  },

  selectScene: async (sceneId: string) => {
    const { scenes } = get();
    const cached = scenes.find((s) => s._id === sceneId);

    if (cached) {
      set({ activeSceneId: sceneId, activeScene: cached });
    }

    try {
      const localTier = localStorage.getItem(`alterjot_scene_${sceneId}`);
      if (localTier) {
        const parsed = JSON.parse(localTier);
        if (parsed && (!cached || new Date(parsed.updatedAt) > new Date(cached.updatedAt))) {
          set({ activeSceneId: sceneId, activeScene: parsed });
        }
      }
    } catch (e) {
      // ignore
    }

    try {
      const remoteScene = await api.getScene(sceneId);
      set((state) => ({
        activeSceneId: sceneId,
        activeScene: remoteScene,
        scenes: state.scenes.map((s) => (s._id === sceneId ? remoteScene : s)),
      }));
    } catch (err) {
      console.warn('Network scene fetch fallback to cache:', err);
    }
  },

  loadInitialWorkspace: async () => {
    try {
      const [health, novels] = await Promise.all([
        api.getHealth().catch(() => ({ isAtlas: false })),
        api.getNovels().catch(() => []),
      ]);

      set({
        serverConnected: true,
        isAtlas: !!health.isAtlas,
        novels,
      });

      if (novels.length === 0) {
        set({ activeNovelId: null });
      } else {
        const lastNovelId = localStorage.getItem('alterjot_last_novel_id');
        const match = novels.find((n) => n._id === lastNovelId);
        if (match) {
          await get().selectNovel(match._id);
          // Keep currentView as library or studio
        } else {
          await get().selectNovel(novels[0]._id);
        }
      }
    } catch (err) {
      console.error('Error loading initial workspace:', err);
      set({ serverConnected: false, saveStatus: 'cached-offline', currentView: 'library' });
    }
  },

  refreshNovel: async () => {
    const { activeNovelId } = get();
    if (!activeNovelId) return;
    try {
      const novel = await api.getNovel(activeNovelId);
      set((state) => ({
        novels: state.novels.map((n) => (n._id === novel._id ? { ...n, ...novel } : n)),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  refreshChaptersAndScenes: async () => {
    const { activeNovelId, activeChapterId } = get();
    if (!activeNovelId) return;
    try {
      const chapters = await api.getChapters(activeNovelId);
      const chId = activeChapterId || (chapters[0] ? chapters[0]._id : undefined);
      const scenes = chId ? await api.getScenes(chId, activeNovelId) : [];
      set({ chapters, scenes });
    } catch (err) {
      console.error(err);
    }
  },

  refreshCodex: async () => {
    const { activeNovelId } = get();
    if (!activeNovelId) return;
    try {
      const entries = await api.getCodex(activeNovelId);
      set({ codexEntries: entries });
    } catch (err) {
      console.error(err);
    }
  },

  createNewChapter: async (title) => {
    const { activeNovelId, chapters } = get();
    if (!activeNovelId) return null;
    try {
      const newCh = await api.createChapter({
        novelId: activeNovelId,
        title: title || `Chapter ${chapters.length + 1}`,
        order: chapters.length + 1,
        status: 'Draft',
      });
      const updatedChapters = [...chapters, newCh];
      set({ chapters: updatedChapters, activeChapterId: newCh._id });

      await get().createNewScene(newCh._id, 'Scene 1');
      return newCh;
    } catch (err) {
      console.error('Failed to create chapter:', err);
      return null;
    }
  },

  createNewScene: async (chapterId, title) => {
    const { activeNovelId, scenes } = get();
    if (!activeNovelId) return null;
    try {
      const newSc = await api.createScene({
        novelId: activeNovelId,
        chapterId,
        title: title || `Scene ${scenes.length + 1}`,
        order: scenes.length + 1,
        status: 'Draft',
        contentJson: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
        plainText: '',
        wordCount: 0,
      });

      const updatedScenes = [...scenes, newSc];
      set({ scenes: updatedScenes, activeSceneId: newSc._id, activeScene: newSc });
      return newSc;
    } catch (err) {
      console.error('Failed to create scene:', err);
      return null;
    }
  },

  deleteChapter: async (chapterId) => {
    try {
      await api.deleteChapter(chapterId);
      const { chapters, activeChapterId } = get();
      const filtered = chapters.filter((c) => c._id !== chapterId);
      set({ chapters: filtered });
      if (activeChapterId === chapterId && filtered.length > 0) {
        get().selectChapter(filtered[0]._id);
      }
      get().refreshNovel();
    } catch (err) {
      console.error(err);
    }
  },

  deleteScene: async (sceneId) => {
    try {
      await api.deleteScene(sceneId);
      const { scenes, activeSceneId } = get();
      const filtered = scenes.filter((s) => s._id !== sceneId);
      set({ scenes: filtered });
      if (activeSceneId === sceneId) {
        if (filtered.length > 0) {
          get().selectScene(filtered[0]._id);
        } else {
          set({ activeSceneId: null, activeScene: null });
        }
      }
      get().refreshNovel();
    } catch (err) {
      console.error(err);
    }
  },

  reorderChapters: async (orderedIds) => {
    const { activeNovelId } = get();
    if (!activeNovelId) return;
    try {
      const reordered = await api.reorderChapters(activeNovelId, orderedIds);
      set({ chapters: reordered });
    } catch (err) {
      console.error(err);
    }
  },

  reorderScenes: async (chapterId, orderedIds) => {
    try {
      const reordered = await api.reorderScenes(chapterId, orderedIds);
      set({ scenes: reordered });
    } catch (err) {
      console.error(err);
    }
  },
}));
