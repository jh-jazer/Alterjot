import type { Novel, Chapter, Scene, CodexEntry } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const userId =
    typeof window !== 'undefined'
      ? localStorage.getItem('endfiles_user_id') || localStorage.getItem('alterjot_user_id') || ''
      : '';
  const activeProvider =
    typeof window !== 'undefined'
      ? localStorage.getItem('alterjot_ai_provider') || 'gemini'
      : 'gemini';
  const geminiKey =
    typeof window !== 'undefined'
      ? localStorage.getItem('alterjot_gemini_api_key') || ''
      : '';
  const groqKey =
    typeof window !== 'undefined'
      ? localStorage.getItem('alterjot_groq_api_key') || ''
      : '';
  const openrouterKey =
    typeof window !== 'undefined'
      ? localStorage.getItem('alterjot_openrouter_api_key') || ''
      : '';

  const engineMode =
    typeof window !== 'undefined'
      ? (localStorage.getItem('alterjot_engine_mode') as 'auto' | 'strict' | 'local') || 'auto'
      : 'auto';

  // Read Multi-Key Vault
  let vault: Array<{ id: string; provider: string; key: string; label?: string }> = [];
  if (typeof window !== 'undefined') {
    try {
      vault = JSON.parse(localStorage.getItem('alterjot_api_vault') || '[]');
    } catch {
      vault = [];
    }
  }

  const activeKeyId =
    typeof window !== 'undefined'
      ? localStorage.getItem('alterjot_active_key_id') || ''
      : '';
  const activeVaultItem = vault.find((v) => v.id === activeKeyId) || vault[0] || null;

  const headers = new Headers(init.headers || {});
  if (userId) {
    headers.set('x-user-id', userId);
  }

  headers.set('x-engine-mode', engineMode);
  if (engineMode === 'strict') {
    headers.set('x-disable-fallback', 'true');
  }
  if (engineMode === 'local') {
    headers.set('x-force-local', 'true');
  }

  // Active key resolution: vault has priority, with fallback to legacy single keys
  if (activeVaultItem) {
    headers.set('x-ai-key', activeVaultItem.key);
    headers.set('x-ai-provider', activeVaultItem.provider);
    if (activeVaultItem.provider === 'gemini') headers.set('x-gemini-key', activeVaultItem.key);
    if (activeVaultItem.provider === 'groq') headers.set('x-groq-key', activeVaultItem.key);
    if (activeVaultItem.provider === 'openrouter') headers.set('x-openrouter-key', activeVaultItem.key);

    // Send backup keys for instant rate-limit rollover
    const backupKeys = vault.filter((v) => v.id !== activeVaultItem.id).map((v) => ({ key: v.key, provider: v.provider }));
    if (backupKeys.length > 0) {
      headers.set('x-ai-backup-keys', JSON.stringify(backupKeys));
    }
  } else {
    headers.set('x-ai-provider', activeProvider);
    if (geminiKey) headers.set('x-gemini-key', geminiKey);
    if (groqKey) headers.set('x-groq-key', groqKey);
    if (openrouterKey) headers.set('x-openrouter-key', openrouterKey);

    if (activeProvider === 'groq' && groqKey) {
      headers.set('x-ai-key', groqKey);
    } else if (activeProvider === 'openrouter' && openrouterKey) {
      headers.set('x-ai-key', openrouterKey);
    } else if (geminiKey) {
      headers.set('x-ai-key', geminiKey);
    }
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
  getCloudVault: async (): Promise<{ success: boolean; encryptedVault: string; vaultUpdatedAt: string | null }> => {
    const res = await authFetch(`${API_BASE}/auth/vault`);
    return handleResponse<{ success: boolean; encryptedVault: string; vaultUpdatedAt: string | null }>(res);
  },
  saveCloudVault: async (encryptedVault: string): Promise<{ success: boolean; message: string; vaultUpdatedAt: string }> => {
    const res = await authFetch(`${API_BASE}/auth/vault`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedVault }),
    });
    return handleResponse<{ success: boolean; message: string; vaultUpdatedAt: string }>(res);
  },

  // AI Copilot with Google Gemini
  getAiStatus: async (): Promise<{ isLiveGemini: boolean; model: string; provider: string }> => {
    const res = await authFetch(`${API_BASE}/ai/status`);
    return handleResponse<{ isLiveGemini: boolean; model: string; provider: string }>(res);
  },
  analyzePassage: async (text: string): Promise<import('../types').AiPassageAnalysis> => {
    const res = await authFetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return handleResponse<import('../types').AiPassageAnalysis>(res);
  },
  queryAi: async (
    lineText: string,
    query: string
  ): Promise<{
    answer: string;
    proposedRewrite?: string;
    isLiveGemini?: boolean;
    isLiveAi?: boolean;
    provider?: string;
    model?: string;
    source?: string;
  }> => {
    const res = await authFetch(`${API_BASE}/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineText, query }),
    });
    return handleResponse<{
      answer: string;
      proposedRewrite?: string;
      isLiveGemini?: boolean;
      isLiveAi?: boolean;
      provider?: string;
      model?: string;
      source?: string;
    }>(res);
  },
  generateAiRewrite: async (
    originalText: string,
    instruction: string
  ): Promise<{ rewrite: string; isLiveGemini?: boolean; model?: string }> => {
    const res = await authFetch(`${API_BASE}/ai/rewrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalText, instruction }),
    });
    return handleResponse<{ rewrite: string; isLiveGemini?: boolean; model?: string }>(res);
  },
  verifyAiKey: async (
    apiKey: string,
    provider?: 'gemini' | 'groq' | 'openrouter'
  ): Promise<{ success: boolean; valid: boolean; provider?: string; model?: string; message?: string }> => {
    const res = await authFetch(`${API_BASE}/ai/verify-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, provider }),
    });
    return handleResponse<{ success: boolean; valid: boolean; provider?: string; model?: string; message?: string }>(res);
  },
  verifyGeminiKey: async (apiKey: string): Promise<{ success: boolean; valid: boolean; model?: string; message?: string }> => {
    return api.verifyAiKey(apiKey, 'gemini');
  },
};
