import type { Novel, Chapter, Scene, CodexEntry } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const userId =
    typeof window !== 'undefined'
      ? localStorage.getItem('endfiles_user_id') || localStorage.getItem('alterjot_user_id') || ''
      : '';
  const headers = new Headers(init.headers || {});
  if (userId) {
    headers.set('x-user-id', userId);
  }
  return fetch(input, { ...init, headers });
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }
  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Health
  getHealth: async () => {
    const res = await authFetch(`${API_BASE}/health`);
    return res.json();
  },

  // Novels
  getNovels: async (): Promise<Novel[]> => {
    const res = await authFetch(`${API_BASE}/novels`);
    return handleResponse<Novel[]>(res);
  },
  getPublishedNovels: async (): Promise<Novel[]> => {
    const res = await authFetch(`${API_BASE}/novels?published=true`);
    return handleResponse<Novel[]>(res);
  },
  getNovel: async (id: string): Promise<Novel> => {
    const res = await authFetch(`${API_BASE}/novels/${id}`);
    return handleResponse<Novel>(res);
  },
  createNovel: async (data: Partial<Novel>): Promise<Novel> => {
    const res = await authFetch(`${API_BASE}/novels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Novel>(res);
  },
  updateNovel: async (id: string, data: Partial<Novel>): Promise<Novel> => {
    const res = await authFetch(`${API_BASE}/novels/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Novel>(res);
  },
  deleteNovel: async (id: string): Promise<{ success: boolean }> => {
    const res = await authFetch(`${API_BASE}/novels/${id}`, { method: 'DELETE' });
    return handleResponse<{ success: boolean }>(res);
  },
  incrementNovelViews: async (id: string): Promise<{ views: number }> => {
    const res = await authFetch(`${API_BASE}/novels/${id}/view`, { method: 'POST' });
    return handleResponse<{ views: number }>(res);
  },
  rateNovel: async (id: string, rating: number): Promise<{ rating: number; ratingCount: number }> => {
    const res = await authFetch(`${API_BASE}/novels/${id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
    return handleResponse<{ rating: number; ratingCount: number }>(res);
  },
  exportManuscript: async (id: string, format: 'markdown' | 'text' = 'markdown') => {
    const res = await authFetch(`${API_BASE}/novels/${id}/export?format=${format}`);
    return handleResponse<{ title: string; format: string; totalWordCount: number; content: string }>(res);
  },

  // Chapters
  getChapters: async (novelId: string): Promise<Chapter[]> => {
    const res = await authFetch(`${API_BASE}/chapters?novelId=${novelId}`);
    return handleResponse<Chapter[]>(res);
  },
  createChapter: async (data: Partial<Chapter>): Promise<Chapter> => {
    const res = await authFetch(`${API_BASE}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Chapter>(res);
  },
  updateChapter: async (id: string, data: Partial<Chapter>): Promise<Chapter> => {
    const res = await authFetch(`${API_BASE}/chapters/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Chapter>(res);
  },
  reorderChapters: async (novelId: string, orderedIds: string[]): Promise<Chapter[]> => {
    const res = await authFetch(`${API_BASE}/chapters/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ novelId, orderedIds }),
    });
    return handleResponse<Chapter[]>(res);
  },
  deleteChapter: async (id: string): Promise<{ success: boolean }> => {
    const res = await authFetch(`${API_BASE}/chapters/${id}`, { method: 'DELETE' });
    return handleResponse<{ success: boolean }>(res);
  },

  // Scenes
  getScenes: async (chapterId?: string, novelId?: string): Promise<Scene[]> => {
    const params = new URLSearchParams();
    if (chapterId) params.append('chapterId', chapterId);
    if (novelId) params.append('novelId', novelId);
    const res = await authFetch(`${API_BASE}/scenes?${params.toString()}`);
    return handleResponse<Scene[]>(res);
  },
  getScene: async (id: string): Promise<Scene> => {
    const res = await authFetch(`${API_BASE}/scenes/${id}`);
    return handleResponse<Scene>(res);
  },
  createScene: async (data: Partial<Scene>): Promise<Scene> => {
    const res = await authFetch(`${API_BASE}/scenes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Scene>(res);
  },
  patchScene: async (id: string, data: Partial<Scene>): Promise<Scene> => {
    const res = await authFetch(`${API_BASE}/scenes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Scene>(res);
  },
  updateScene: async (id: string, data: Partial<Scene>): Promise<Scene> => {
    const res = await authFetch(`${API_BASE}/scenes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Scene>(res);
  },
  reorderScenes: async (chapterId: string, orderedIds: string[]): Promise<Scene[]> => {
    const res = await authFetch(`${API_BASE}/scenes/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId, orderedIds }),
    });
    return handleResponse<Scene[]>(res);
  },
  deleteScene: async (id: string): Promise<{ success: boolean }> => {
    const res = await authFetch(`${API_BASE}/scenes/${id}`, { method: 'DELETE' });
    return handleResponse<{ success: boolean }>(res);
  },

  // Codex
  getCodex: async (novelId: string, category?: string): Promise<CodexEntry[]> => {
    const params = new URLSearchParams({ novelId });
    if (category) params.append('category', category);
    const res = await authFetch(`${API_BASE}/codex?${params.toString()}`);
    return handleResponse<CodexEntry[]>(res);
  },
  createCodex: async (data: Partial<CodexEntry>): Promise<CodexEntry> => {
    const res = await authFetch(`${API_BASE}/codex`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<CodexEntry>(res);
  },
  updateCodex: async (id: string, data: Partial<CodexEntry>): Promise<CodexEntry> => {
    const res = await authFetch(`${API_BASE}/codex/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<CodexEntry>(res);
  },
  deleteCodex: async (id: string): Promise<{ success: boolean }> => {
    const res = await authFetch(`${API_BASE}/codex/${id}`, { method: 'DELETE' });
    return handleResponse<{ success: boolean }>(res);
  },

  // Auth
  loginWithGoogle: async (credential: string): Promise<{ success: boolean; user: import('../types').AuthUser; message?: string }> => {
    const res = await authFetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    return handleResponse<{ success: boolean; user: import('../types').AuthUser; message?: string }>(res);
  },
  getAuthConfig: async (): Promise<{ success: boolean; googleAuthEnabled: boolean; clientIdConfigured: boolean }> => {
    const res = await authFetch(`${API_BASE}/auth/config`);
    return handleResponse<{ success: boolean; googleAuthEnabled: boolean; clientIdConfigured: boolean }>(res);
  },
};
