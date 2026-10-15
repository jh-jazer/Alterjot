import { create } from 'zustand';
import type { Novel, Chapter, Scene, CodexEntry, SaveStatus, NarrativeTheme, OnboardingAnswers, AuthUser, ActivePassage, InvitedReader, LineComment } from '../types';
import type { CollaborativeProject, ContributorRequest, ApprovedCollaborator, CreativeDiscipline } from '../data/collaborativeProjectsData';
import { COLLABORATIVE_PROJECTS } from '../data/collaborativeProjectsData';
import { api } from '../services/api';

export type LeftPanelTab = 'search' | 'chapters' | 'contexts' | 'ai';

export interface PanelState {
  isSidebarOpen: boolean;
  isCodexOpen: boolean;
  isZenMode: boolean;
  isNotesDeckOpen: boolean;
  isAiAssistantOpen: boolean;
  isLeftPanelOpen: boolean;
  activeLeftTab: LeftPanelTab;
}

interface TypographySettings {
  fontFamily: 'serif' | 'sans' | 'typewriter' | 'mono';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  fontSize: number;
}

interface WorkspaceState {
  currentView: 'dashboard' | 'landing' | 'library' | 'studio' | 'play' | 'ranking' | 'challenge' | 'book';
  activeChallengeId: string | null;
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
  isWriteForProjectModalOpen: boolean;

  librarySearchQuery: string;
  setLibrarySearchQuery: (query: string) => void;

  setCurrentView: (view: 'dashboard' | 'landing' | 'library' | 'studio' | 'play' | 'ranking' | 'challenge' | 'book') => void;
  openDashboard: () => void;
  openLanding: () => void;
  openLibrary: () => void;
  openPlay: () => void;
  openRanking: () => void;
  openStudio: (novelId?: string) => Promise<void>;
  openBook: (novelId?: string) => Promise<void>;
  openChallenge: (challengeId: string) => void;
  closeChallenge: () => void;

  setPanelState: (partial: Partial<PanelState>) => void;
  setActiveLeftTab: (tab: LeftPanelTab) => void;
  toggleLeftPanel: (tab?: LeftPanelTab) => void;
  openLeftPanel: (tab?: LeftPanelTab) => void;
  closeLeftPanel: () => void;
  toggleSidebar: () => void;
  toggleCodex: () => void;
  toggleNotesDeck: () => void;
  openSearch: () => void;
  replaceTextThroughoutStory: (
    searchTerm: string,
    replaceWith: string,
    options?: { caseSensitive?: boolean; wholeWord?: boolean; sceneId?: string }
  ) => { totalReplacements: number; affectedScenes: number; affectedChapters: number };
  toggleAiAssistant: () => void;
  openAiAssistant: (passage?: ActivePassage) => void;
  closeAiAssistant: () => void;
  activePassage: ActivePassage | null;
  setActivePassage: (passage: ActivePassage | null) => void;
  toggleZenMode: () => void;
  setZenMode: (val: boolean) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setTypography: (partial: Partial<TypographySettings>) => void;
  setIsDashboardOpen: (val: boolean) => void;
  setIsExportOpen: (val: boolean) => void;
  setIsNewNovelModalOpen: (val: boolean) => void;
  setIsWriteForProjectModalOpen: (val: boolean) => void;
  openWriteForProjectModal: () => void;
  writeForProject: (project: CollaborativeProject, customTitle?: string) => Promise<boolean>;

  collaborativeProjects: CollaborativeProject[];
  submitContributionPitch: (
    projectId: string,
    pitch: { discipline: CreativeDiscipline; pitchTitle: string; pitchNotes: string }
  ) => void;
  approveContributorRequest: (projectId: string, requestId: string) => void;
  declineContributorRequest: (projectId: string, requestId: string) => void;
  removeCollaborator: (projectId: string, penName: string) => void;
  claimProjectAsCreator: (projectId: string) => void;

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
  isProfileModalOpen: boolean;
  hasCompletedOnboarding: boolean;
  isOnboardingModalOpen: boolean;
  preferredTheme: NarrativeTheme;

  login: (penName: string, email?: string) => void;
  loginWithGoogleCredential: (credential: string) => Promise<boolean>;
  logout: () => void;
  setIsAuthModalOpen: (open: boolean, mode?: 'signin' | 'signup') => void;
  setIsProfileModalOpen: (open: boolean) => void;
  setIsOnboardingModalOpen: (open: boolean) => void;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  setPreferredTheme: (theme: NarrativeTheme) => void;
  requireAuth: (callback?: () => void) => boolean;

  // Reader Mode & Invited Readers
  isReaderMode: boolean;
  activeReaderName: string;
  setIsReaderMode: (isReader: boolean, readerName?: string) => void;
  invitedReadersByNovel: Record<string, InvitedReader[]>;
  inviteReaderToNovel: (novelId: string, username: string, email?: string) => void;
  removeInvitedReader: (novelId: string, username: string) => void;

  // Line-Level Comments for Readers
  lineComments: LineComment[];
  addLineComment: (comment: Omit<LineComment, 'id' | 'createdAt'>) => LineComment;
  deleteLineComment: (commentId: string) => void;
  isLineCommentsOpen: boolean;
  activeCommentLine: { novelId: string; chapterId: string; lineFrom: number; lineTo: number; lineText: string } | null;
  openLineComments: (target: { novelId: string; chapterId: string; lineFrom: number; lineTo: number; lineText: string }) => void;
  closeLineComments: () => void;
}

// Storage helpers for Alterjot with backward compatibility for existing keys
const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`alterjot_${key}`) || localStorage.getItem(`endfiles_${key}`);
};

const setStorageItem = (key: string, val: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`alterjot_${key}`, val);
    localStorage.setItem(`endfiles_${key}`, val);
  } catch {}
};

const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`alterjot_${key}`);
    localStorage.removeItem(`endfiles_${key}`);
  } catch {}
};

// Read initial theme preference: default to 'dark' for bunker atmosphere or existing stored
const initialTheme = (typeof window !== 'undefined' && (getStorageItem('theme') as 'light' | 'dark')) || 'dark';
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
  activeChallengeId: null,
  activeNovelId: null,
  activeChapterId: null,
  activeSceneId: null,

  penName: (() => {
    if (typeof window === 'undefined') return '';
    const stored = getStorageItem('pen_name');
    if (stored === 'Ernest Quill') return '';
    return stored || '';
  })(),
  setPenName: (name) => {
    setStorageItem('pen_name', name);
    set({ penName: name });
  },

  // Auth & Onboarding State
  isAuthenticated: (() => {
    if (typeof window === 'undefined') return false;
    if (getStorageItem('auth') !== 'true') return false;
    const email = getStorageItem('user_email');
    const pen = getStorageItem('pen_name');
    if (email === 'scribe@alterjot.com' && pen === 'Ernest Quill' && !getStorageItem('user_id')?.startsWith('google_')) {
      return false;
    }
    return true;
  })(),
  currentUser: (() => {
    if (typeof window === 'undefined') return null;
    if (getStorageItem('auth') !== 'true') return null;
    const pen = getStorageItem('pen_name');
    const email = getStorageItem('user_email');
    if (email === 'scribe@alterjot.com' && pen === 'Ernest Quill' && !getStorageItem('user_id')?.startsWith('google_')) {
      try {
        removeStorageItem('auth');
        removeStorageItem('pen_name');
        removeStorageItem('user_id');
        removeStorageItem('user_email');
      } catch {}
      return null;
    }
    return {
      id: getStorageItem('user_id') || 'author_default',
      penName: pen || 'Author',
      email: email || '',
      avatarUrl: getStorageItem('user_avatar') || undefined,
    };
  })(),
  isAuthModalOpen: false,
  authModalMode: 'signin',
  isProfileModalOpen: false,
  hasCompletedOnboarding: (typeof window !== 'undefined' && getStorageItem('onboarded') === 'true') || false,
  isOnboardingModalOpen: false,
  preferredTheme: ((typeof window !== 'undefined' && getStorageItem('preferred_theme')) as NarrativeTheme) || 'apocalyptic',

  novels: [],
  chapters: [],
  scenes: [],
  codexEntries: [],
  activeScene: null,
  activePassage: null,

  panelState: {
    isSidebarOpen: true,
    isCodexOpen: false,
    isZenMode: false,
    isNotesDeckOpen: true,
    isAiAssistantOpen: false,
    isLeftPanelOpen: true,
    activeLeftTab: 'chapters',
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
        setStorageItem('theme', theme);
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
  openDashboard: () => set({ currentView: 'dashboard', activeChallengeId: null }),
  openLanding: () => set({ currentView: 'dashboard', activeChallengeId: null }),
  openLibrary: () => {
    if (get().requireAuth(() => set({ currentView: 'library', activeChallengeId: null }))) {
      set({ currentView: 'library', activeChallengeId: null });
    }
  },
  openPlay: () => {
    if (get().requireAuth(() => set({ currentView: 'play', activeChallengeId: null }))) {
      set({ currentView: 'play', activeChallengeId: null });
    }
  },
  openRanking: () => {
    set({ currentView: 'ranking', activeChallengeId: null });
  },
  openChallenge: (challengeId: string) => {
    set({ currentView: 'challenge', activeChallengeId: challengeId });
  },
  closeChallenge: () => {
    set({ currentView: 'dashboard', activeChallengeId: null });
  },
  openStudio: async (novelId) => {
    if (!get().requireAuth()) return;
    const targetId = novelId || get().activeNovelId;
    if (targetId) {
      await get().selectNovel(targetId);
      set({ currentView: 'studio', activeChallengeId: null });
    }
  },
  openBook: async (novelId) => {
    if (!get().requireAuth()) return;
    const targetId = novelId || get().activeNovelId;
    if (targetId) {
      await get().selectNovel(targetId);
      set({ currentView: 'book', activeChallengeId: null });
    }
  },

  // Auth & Onboarding Actions
  login: (penName: string, email?: string) => {
    const finalPenName = penName.trim() || 'Author';
    const finalEmail = email?.trim() || '';
    const user: AuthUser = {
      id: 'author_' + Date.now(),
      penName: finalPenName,
      email: finalEmail,
    };
    try {
      setStorageItem('auth', 'true');
      setStorageItem('pen_name', finalPenName);
      setStorageItem('user_id', user.id);
      setStorageItem('user_email', finalEmail);
    } catch {}

    const hasOnboarded = typeof window !== 'undefined' && getStorageItem('onboarded') === 'true';
    set({
      isAuthenticated: true,
      currentUser: user,
      penName: finalPenName,
      isAuthModalOpen: false,
      isOnboardingModalOpen: !hasOnboarded,
    });
    get().loadInitialWorkspace();
  },

  loginWithGoogleCredential: async (credential: string) => {
    try {
      let finalUser: AuthUser;

      try {
        const response = await api.loginWithGoogle(credential);
        finalUser = response.user;
      } catch (serverErr) {
        console.warn('[Auth] Server Google verification failed or offline, using decoded token fallback:', serverErr);
        // Client-side fallback: safely decode JWT payload
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payloadJson = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          finalUser = {
            id: payloadJson.sub || 'author_google_' + Date.now(),
            googleId: payloadJson.sub,
            email: payloadJson.email || '',
            penName: payloadJson.name || payloadJson.email?.split('@')[0] || 'Author',
            avatarUrl: payloadJson.picture || '',
          };
        } else {
          throw serverErr;
        }
      }

      try {
        setStorageItem('auth', 'true');
        setStorageItem('pen_name', finalUser.penName);
        setStorageItem('user_id', finalUser.id);
        if (finalUser.email) setStorageItem('user_email', finalUser.email);
        if (finalUser.avatarUrl) setStorageItem('user_avatar', finalUser.avatarUrl);
      } catch {}

      const hasOnboarded = typeof window !== 'undefined' && getStorageItem('onboarded') === 'true';
      set({
        isAuthenticated: true,
        currentUser: finalUser,
        penName: finalUser.penName,
        isAuthModalOpen: false,
        isOnboardingModalOpen: !hasOnboarded,
      });

      // Reload author's private manuscripts
      get().loadInitialWorkspace();
      return true;
    } catch (err) {
      console.error('[Auth] Failed to complete Google sign in:', err);
      return false;
    }
  },

  logout: () => {
    try {
      removeStorageItem('auth');
      removeStorageItem('user_id');
      removeStorageItem('user_email');
      removeStorageItem('user_avatar');
    } catch {}
    set({
      isAuthenticated: false,
      currentUser: null,
      currentView: 'dashboard',
      isProfileModalOpen: false,
    });
    // Reload guest manuscripts
    get().loadInitialWorkspace();
  },

  setIsAuthModalOpen: (open, mode = 'signin') => {
    set({ isAuthModalOpen: open, authModalMode: mode });
  },

  setIsProfileModalOpen: (open) => {
    set({ isProfileModalOpen: open });
  },

  setIsOnboardingModalOpen: (open) => {
    set({ isOnboardingModalOpen: open });
  },

  completeOnboarding: (answers) => {
    const finalPenName = answers.penName.trim() || get().penName;
    try {
      setStorageItem('onboarded', 'true');
      setStorageItem('preferred_theme', answers.preferredTheme);
      setStorageItem('pen_name', finalPenName);
      setStorageItem('writing_goal', answers.writingGoal);
      setStorageItem('ambiance', answers.ambiance);
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
      setStorageItem('preferred_theme', theme);
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

  // Reader Mode & Invited Readers
  isReaderMode: false,
  activeReaderName: '',
  setIsReaderMode: (isReader, readerName) => {
    set({ isReaderMode: isReader, activeReaderName: readerName || '' });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('alterjot:reader-mode-changed', { detail: { isReader } }));
    }
  },

  invitedReadersByNovel: (() => {
    try {
      const raw = getStorageItem('invited_readers_map');
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  })(),

  inviteReaderToNovel: (novelId, username, email) => {
    const cleanUser = username.trim();
    if (!cleanUser) return;
    const currentMap = { ...get().invitedReadersByNovel };
    const list = currentMap[novelId] ? [...currentMap[novelId]] : [];

    const existingIndex = list.findIndex((r) => r.username.toLowerCase() === cleanUser.toLowerCase());
    const newReader: InvitedReader = {
      username: cleanUser,
      email: email?.trim(),
      invitedAt: new Date().toISOString(),
      status: 'invited',
      role: 'reader',
    };

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...newReader };
    } else {
      list.unshift(newReader);
    }

    currentMap[novelId] = list;
    try {
      setStorageItem('invited_readers_map', JSON.stringify(currentMap));
    } catch {}

    set({
      invitedReadersByNovel: currentMap,
      novels: get().novels.map((n) => (n._id === novelId ? { ...n, invitedReaders: list } : n)),
    });
  },

  removeInvitedReader: (novelId, username) => {
    const currentMap = { ...get().invitedReadersByNovel };
    if (!currentMap[novelId]) return;
    const filtered = currentMap[novelId].filter((r) => r.username.toLowerCase() !== username.toLowerCase());
    currentMap[novelId] = filtered;
    try {
      setStorageItem('invited_readers_map', JSON.stringify(currentMap));
    } catch {}

    set({
      invitedReadersByNovel: currentMap,
      novels: get().novels.map((n) => (n._id === novelId ? { ...n, invitedReaders: filtered } : n)),
    });
  },

  // Line Comments for Readers
  lineComments: (() => {
    try {
      const raw = getStorageItem('line_comments');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  })(),

  addLineComment: (commentData) => {
    const id = 'lc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newComment: LineComment = {
      ...commentData,
      id,
      createdAt: new Date().toISOString(),
    };

    const updated = [newComment, ...get().lineComments];
    try {
      setStorageItem('line_comments', JSON.stringify(updated));
    } catch {}

    set({ lineComments: updated });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('alterjot:comments-updated'));
    }
    return newComment;
  },

  deleteLineComment: (commentId) => {
    const updated = get().lineComments.filter((c) => c.id !== commentId);
    try {
      setStorageItem('line_comments', JSON.stringify(updated));
    } catch {}
    set({ lineComments: updated });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('alterjot:comments-updated'));
    }
  },

  isLineCommentsOpen: false,
  activeCommentLine: null,

  openLineComments: (target) => {
    set({
      activeCommentLine: target,
      isLineCommentsOpen: true,
    });
  },

  closeLineComments: () => {
    set({
      activeCommentLine: null,
      isLineCommentsOpen: false,
    });
  },

  saveStatus: 'idle',
  lastSavedAt: null,
  serverConnected: true,
  isAtlas: false,

  isDashboardOpen: false,
  isExportOpen: false,
  isNewNovelModalOpen: false,
  isWriteForProjectModalOpen: false,

  librarySearchQuery: '',
  setLibrarySearchQuery: (query) => set({ librarySearchQuery: query }),

  setPanelState: (partial) =>
    set((state) => ({
      panelState: { ...state.panelState, ...partial },
    })),

  setActiveLeftTab: (tab) =>
    set((state) => ({
      panelState: {
        ...state.panelState,
        activeLeftTab: tab,
        isLeftPanelOpen: true,
        isSidebarOpen: tab === 'chapters',
        isAiAssistantOpen: tab === 'ai',
        isCodexOpen: tab === 'contexts',
      },
    })),

  toggleLeftPanel: (tab) =>
    set((state) => {
      if (tab) {
        if (state.panelState.isLeftPanelOpen && state.panelState.activeLeftTab === tab) {
          return {
            panelState: {
              ...state.panelState,
              isLeftPanelOpen: false,
              isSidebarOpen: false,
              isAiAssistantOpen: false,
              isCodexOpen: false,
            },
          };
        }
        return {
          panelState: {
            ...state.panelState,
            activeLeftTab: tab,
            isLeftPanelOpen: true,
            isSidebarOpen: tab === 'chapters',
            isAiAssistantOpen: tab === 'ai',
            isCodexOpen: tab === 'contexts',
          },
        };
      }
      const nextOpen = !state.panelState.isLeftPanelOpen;
      return {
        panelState: {
          ...state.panelState,
          isLeftPanelOpen: nextOpen,
          isSidebarOpen: nextOpen && state.panelState.activeLeftTab === 'chapters',
          isAiAssistantOpen: nextOpen && state.panelState.activeLeftTab === 'ai',
          isCodexOpen: nextOpen && state.panelState.activeLeftTab === 'contexts',
        },
      };
    }),

  openLeftPanel: (tab) =>
    set((state) => {
      const targetTab = tab || state.panelState.activeLeftTab;
      return {
        panelState: {
          ...state.panelState,
          activeLeftTab: targetTab,
          isLeftPanelOpen: true,
          isSidebarOpen: targetTab === 'chapters',
          isAiAssistantOpen: targetTab === 'ai',
          isCodexOpen: targetTab === 'contexts',
        },
      };
    }),

  closeLeftPanel: () =>
    set((state) => ({
      panelState: {
        ...state.panelState,
        isLeftPanelOpen: false,
        isSidebarOpen: false,
        isAiAssistantOpen: false,
        isCodexOpen: false,
      },
    })),

  toggleSidebar: () => get().toggleLeftPanel('chapters'),

  toggleCodex: () => get().toggleLeftPanel('contexts'),

  toggleNotesDeck: () =>
    set((state) => ({
      panelState: { ...state.panelState, isNotesDeckOpen: !state.panelState.isNotesDeckOpen },
    })),

  openSearch: () => get().openLeftPanel('search'),

  toggleAiAssistant: () => get().toggleLeftPanel('ai'),

  openAiAssistant: (passage) =>
    set((state) => ({
      panelState: {
        ...state.panelState,
        isLeftPanelOpen: true,
        activeLeftTab: 'ai',
        isAiAssistantOpen: true,
        isSidebarOpen: false,
        isCodexOpen: false,
      },
      ...(passage ? { activePassage: passage } : {}),
    })),

  closeAiAssistant: () => {
    const s = get();
    if (s.panelState.activeLeftTab === 'ai') {
      s.closeLeftPanel();
    } else {
      set((state) => ({
        panelState: { ...state.panelState, isAiAssistantOpen: false },
      }));
    }
  },

  setActivePassage: (passage) => set({ activePassage: passage }),

  toggleZenMode: () =>
    set((state) => {
      const nextZen = !state.panelState.isZenMode;
      return {
        panelState: {
          ...state.panelState,
          isZenMode: nextZen,
          isLeftPanelOpen: nextZen ? false : true,
          isSidebarOpen: nextZen ? false : true,
          isCodexOpen: false,
          isAiAssistantOpen: false,
        },
      };
    }),

  setZenMode: (val) =>
    set((state) => ({
      panelState: {
        ...state.panelState,
        isZenMode: val,
        isLeftPanelOpen: val ? false : true,
        isSidebarOpen: val ? false : true,
        isCodexOpen: false,
        isAiAssistantOpen: false,
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
  setIsWriteForProjectModalOpen: (val) => set({ isWriteForProjectModalOpen: val }),
  openWriteForProjectModal: () => set({ isWriteForProjectModalOpen: true }),

  collaborativeProjects: (() => {
    try {
      const saved = getStorageItem('collab_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        const dummyIds = new Set(['cinder-wastes', 'ironveil-foundry', 'voidwalker-expanse', 'sunstone-chronicles']);
        const filtered = Array.isArray(parsed) ? parsed.filter((p: any) => !dummyIds.has(p.id)) : [];
        if (filtered.length !== parsed.length) {
          try {
            setStorageItem('collab_projects', JSON.stringify(filtered));
          } catch {}
        }
        return filtered;
      }
    } catch {}
    return COLLABORATIVE_PROJECTS;
  })(),

  submitContributionPitch: (projectId, pitch) => {
    const penName = get().penName;
    const newRequest: ContributorRequest = {
      id: 'req-' + Date.now(),
      applicantPenName: penName,
      discipline: pitch.discipline,
      pitchTitle: pitch.pitchTitle,
      pitchNotes: pitch.pitchNotes,
      submittedAt: 'Just now',
      status: 'pending',
    };

    const updated = get().collaborativeProjects.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        pendingRequests: [newRequest, ...(p.pendingRequests || [])],
      };
    });

    try {
      setStorageItem('collab_projects', JSON.stringify(updated));
    } catch {}
    set({ collaborativeProjects: updated });
  },

  approveContributorRequest: (projectId, requestId) => {
    const updated = get().collaborativeProjects.map((p) => {
      if (p.id !== projectId) return p;
      const targetReq = (p.pendingRequests || []).find((r) => r.id === requestId);
      if (!targetReq) return p;

      const roleMap: Record<string, ApprovedCollaborator['role']> = {
        writing: 'Writer',
        cover: 'Cover Designer',
        art: 'Concept Artist',
        webtoon: 'Webtoonist',
        animation: 'Animator',
      };

      const newCollaborator: ApprovedCollaborator = {
        penName: targetReq.applicantPenName,
        role: roleMap[targetReq.discipline] || 'Writer',
        approvedAt: 'Just now',
      };

      return {
        ...p,
        approvedCollaborators: [
          newCollaborator,
          ...(p.approvedCollaborators || []).filter(
            (c) => !(c.penName.toLowerCase() === newCollaborator.penName.toLowerCase() && c.role === newCollaborator.role)
          ),
        ],
        pendingRequests: (p.pendingRequests || []).filter((r) => r.id !== requestId),
      };
    });

    try {
      setStorageItem('collab_projects', JSON.stringify(updated));
    } catch {}
    set({ collaborativeProjects: updated });
  },

  declineContributorRequest: (projectId, requestId) => {
    const updated = get().collaborativeProjects.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        pendingRequests: (p.pendingRequests || []).filter((r) => r.id !== requestId),
      };
    });

    try {
      setStorageItem('collab_projects', JSON.stringify(updated));
    } catch {}
    set({ collaborativeProjects: updated });
  },

  removeCollaborator: (projectId, penName) => {
    const updated = get().collaborativeProjects.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        approvedCollaborators: (p.approvedCollaborators || []).filter((c) => c.penName !== penName),
      };
    });

    try {
      setStorageItem('collab_projects', JSON.stringify(updated));
    } catch {}
    set({ collaborativeProjects: updated });
  },

  claimProjectAsCreator: (projectId) => {
    const penName = get().penName;
    const updated = get().collaborativeProjects.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        creatorPenName: penName,
      };
    });

    try {
      setStorageItem('collab_projects', JSON.stringify(updated));
    } catch {}
    set({ collaborativeProjects: updated });
  },

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
      setStorageItem(`scene_${activeScene._id}`, JSON.stringify(updatedScene));
      setStorageItem('last_scene_id', activeScene._id);
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
      setStorageItem(`scene_${activeScene._id}`, JSON.stringify(updatedScene));
    } catch (e) {
      console.warn('localStorage write failed:', e);
    }

    set({
      activeScene: updatedScene,
      scenes: scenes.map((s) => (s._id === updatedScene._id ? updatedScene : s)),
    });
  },

  replaceTextThroughoutStory: (searchTerm, replaceWith, options = {}) => {
    const { caseSensitive = false, wholeWord = false, sceneId } = options;
    if (!searchTerm) return { totalReplacements: 0, affectedScenes: 0, affectedChapters: 0 };

    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);

    const { scenes, activeScene } = get();
    let totalReplacements = 0;
    const affectedSceneIds = new Set<string>();
    const affectedChapterIds = new Set<string>();

    const helperReplaceInJson = (node: any): { updated: any; count: number } => {
      if (!node) return { updated: node, count: 0 };
      let count = 0;
      if (node.type === 'text' && typeof node.text === 'string') {
        const matches = node.text.match(regex);
        if (matches) {
          count += matches.length;
          return {
            updated: { ...node, text: node.text.replace(regex, replaceWith) },
            count,
          };
        }
        return { updated: node, count: 0 };
      }
      if (Array.isArray(node.content)) {
        let childCount = 0;
        const newContent = node.content.map((child: any) => {
          const res = helperReplaceInJson(child);
          childCount += res.count;
          return res.updated;
        });
        return {
          updated: { ...node, content: newContent },
          count: childCount,
        };
      }
      return { updated: node, count: 0 };
    };

    const updatedScenes = scenes.map((scene) => {
      if (sceneId && scene._id !== sceneId) return scene;

      const plainMatches = (scene.plainText || '').match(regex);
      if (!plainMatches) return scene;

      const plainReplacements = plainMatches.length;
      totalReplacements += plainReplacements;
      affectedSceneIds.add(scene._id);
      affectedChapterIds.add(scene.chapterId);

      const newPlainText = (scene.plainText || '').replace(regex, replaceWith);
      let newContentJson = scene.contentJson;
      if (scene.contentJson) {
        const jsonResult = helperReplaceInJson(scene.contentJson);
        newContentJson = jsonResult.updated;
      } else {
        newContentJson = {
          type: 'doc',
          content: newPlainText.split('\n\n').map((p) => ({
            type: 'paragraph',
            content: p ? [{ type: 'text', text: p }] : [],
          })),
        };
      }

      const words = newPlainText.trim().split(/\s+/).filter(Boolean).length;
      const chars = newPlainText.length;

      const updated: Scene = {
        ...scene,
        plainText: newPlainText,
        contentJson: newContentJson,
        wordCount: words,
        characterCount: chars,
        updatedAt: new Date().toISOString(),
      };

      try {
        setStorageItem(`scene_${scene._id}`, JSON.stringify(updated));
      } catch {}

      return updated;
    });

    const activeSceneModified = activeScene
      ? updatedScenes.find((s) => s._id === activeScene._id && affectedSceneIds.has(s._id))
      : undefined;

    if (totalReplacements > 0) {
      const newTotalWords = updatedScenes.reduce((acc, s) => acc + (s.wordCount || 0), 0);
      set({
        scenes: updatedScenes,
        ...(activeSceneModified ? { activeScene: activeSceneModified } : {}),
        novels: get().novels.map((n) =>
          n._id === get().activeNovelId ? { ...n, totalWordCount: newTotalWords } : n
        ),
      });

      if (activeSceneModified && typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('alterjot:replace-active-scene-content', {
            detail: {
              newContentJson: activeSceneModified.contentJson,
              newPlainText: activeSceneModified.plainText,
              wordCount: activeSceneModified.wordCount,
              characterCount: activeSceneModified.characterCount,
            },
          })
        );
      }
    }

    return {
      totalReplacements,
      affectedScenes: affectedSceneIds.size,
      affectedChapters: affectedChapterIds.size,
    };
  },

  startWritingImmediately: async () => {
    if (!get().requireAuth()) return;
    // Always start a fresh untitled book ready for immediate drafting
    await get().createNovel({
      title: 'Untitled Book',
      subtitle: '',
      author: get().penName,
      genre: 'General Fiction',
      status: 'In Progress',
      targetWordCount: 50000,
    });
  },

  writeForProject: async (project: CollaborativeProject, customTitle?: string) => {
    if (!get().requireAuth()) return false;

    // Creator Sovereignty: Only the Project Creator or an approved Writer can add a manuscript
    const currentProject = get().collaborativeProjects.find((p) => p.id === project.id) || project;
    const userPenName = get().penName.toLowerCase();
    const isCreator = currentProject.creatorPenName.toLowerCase() === userPenName;
    const isApprovedWriter = (currentProject.approvedCollaborators || []).some(
      (c) => c.penName.toLowerCase() === userPenName && c.role === 'Writer'
    );

    if (!isCreator && !isApprovedWriter) {
      return false;
    }

    set({ isWriteForProjectModalOpen: false });

    const finalTitle = customTitle?.trim() || `${project.name}: Chronicles`;
    const novel = await get().createNovel({
      title: finalTitle,
      subtitle: project.universe,
      author: get().penName,
      genre: project.genre,
      status: 'In Progress',
      synopsis: project.starterPrompt?.synopsis || project.tagline,
      targetWordCount: 50000,
    });

    if (novel && project.starterPrompt?.openingParagraph) {
      const activeScene = get().activeScene;
      if (activeScene) {
        const openingText = project.starterPrompt.openingParagraph;
        const wordCount = openingText.split(/\s+/).filter(Boolean).length;
        const starterJson = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: openingText }],
            },
          ],
        };
        try {
          await api.updateScene(activeScene._id, {
            title: project.starterPrompt.hookTitle || 'Scene 1: Inciting Incident',
            contentJson: starterJson,
            plainText: openingText,
            wordCount,
          });
          const updatedScene = {
            ...activeScene,
            title: project.starterPrompt.hookTitle || 'Scene 1: Inciting Incident',
            contentJson: starterJson,
            plainText: openingText,
            wordCount,
          };
          set({
            activeScene: updatedScene,
            scenes: get().scenes.map((s) => (s._id === updatedScene._id ? updatedScene : s)),
          });
        } catch (e) {
          console.warn('Failed to populate starter scene for project:', e);
        }
      }
    }
    return true;
  },

  createNovel: async (data) => {
    if (!get().requireAuth()) return null;
    try {
      const payload: Partial<Novel> = {
        ...data,
        title: data.title?.trim() || 'Untitled Book',
        author: data.author?.trim() || get().penName,
        genre: data.genre || 'General Fiction',
        status: data.status || 'In Progress',
        targetWordCount: data.targetWordCount || 50000,
      };

      const novel = await api.createNovel(payload);
      const updatedNovels = [novel, ...get().novels];
      set({ novels: updatedNovels, activeNovelId: novel._id });
      setStorageItem('last_novel_id', novel._id);

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
    const { chapters, activeScene, activeChapterId } = get();
    set({
      chapters: chapters.map((c) => (c._id === chapterId ? { ...c, title: cleanTitle } : c)),
    });
    if (activeChapterId === chapterId && activeScene) {
      get().updateSceneTitle(activeScene._id, cleanTitle);
    }
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
      setStorageItem('last_novel_id', novelId);
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
          const newSc = await get().createNewScene(firstChapter._id, firstChapter.title);
          if (newSc) {
            get().selectScene(newSc._id);
          } else {
            set({ activeSceneId: null, activeScene: null });
          }
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
      api.getScenes(chapterId, activeNovelId).then(async (scenes) => {
        set({ scenes });
        if (scenes.length > 0) {
          get().selectScene(scenes[0]._id);
        } else {
          const ch = get().chapters.find((c) => c._id === chapterId);
          const newSc = await get().createNewScene(chapterId, ch?.title || 'Chapter Content');
          if (newSc) {
            get().selectScene(newSc._id);
          } else {
            set({ activeSceneId: null, activeScene: null });
          }
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
      const localTier = getStorageItem(`scene_${sceneId}`);
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

      const invitedMap = get().invitedReadersByNovel || {};
      const enrichedNovels = novels.map((n: Novel) => ({
        ...n,
        invitedReaders: invitedMap[n._id] || n.invitedReaders || [],
      }));

      set({
        serverConnected: true,
        isAtlas: !!health.isAtlas,
        novels: enrichedNovels,
      });

      if (novels.length === 0) {
        set({ activeNovelId: null });
      } else {
        const lastNovelId = getStorageItem('last_novel_id');
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
      const existingNumbers = chapters
        .map((c) => {
          const match = c.title.trim().match(/^Chapter\s+(\d+)$/i);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter((n): n is number => n !== null && !isNaN(n));

      const nextNum =
        existingNumbers.length > 0
          ? Math.max(...existingNumbers) + 1
          : chapters.some((c) => c.title.toLowerCase().includes('chapter 1'))
          ? chapters.length + 1
          : 1;

      const chapterTitle = title?.trim() || `Chapter ${nextNum}`;
      const newCh = await api.createChapter({
        novelId: activeNovelId,
        title: chapterTitle,
        order: chapters.length + 1,
        status: 'Draft',
      });
      const updatedChapters = [...chapters, newCh];
      set({ chapters: updatedChapters, activeChapterId: newCh._id });

      await get().createNewScene(newCh._id, chapterTitle);
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
      if (activeChapterId === chapterId) {
        if (filtered.length > 0) {
          get().selectChapter(filtered[0]._id);
        } else {
          set({
            activeChapterId: null,
            activeSceneId: null,
            activeScene: null,
            scenes: [],
          });
        }
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
