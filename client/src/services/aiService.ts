import type { AiPassageAnalysis } from '../types';
import { api } from './api';
import { cryptoVault } from './cryptoVaultService';

export interface AiQueryResponse {
  answer: string;
  proposedRewrite?: string;
  isLiveGemini?: boolean;
  isLiveAi?: boolean;
  provider?: string;
  model?: string;
  source?: string;
}

export type AiProvider = 'gemini' | 'groq' | 'openrouter';

export interface AiProviderConfig {
  id: AiProvider;
  name: string;
  tagline: string;
  badge: string;
  model: string;
  keyPrefix: string;
  placeholder: string;
  docUrl: string;
  freeTerms: string;
}

export const AI_PROVIDERS: Record<AiProvider, AiProviderConfig> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    tagline: 'Deep narrative understanding & 1M token memory',
    badge: '100% Free • Recommended',
    model: 'Gemini 2.5 Flash',
    keyPrefix: 'AIzaSy',
    placeholder: 'AIzaSy...',
    docUrl: 'https://aistudio.google.com/app/apikey',
    freeTerms: 'Up to 15 req/min, 1,500 req/day at $0 cost',
  },
  groq: {
    id: 'groq',
    name: 'Groq (Llama 3.3 70B)',
    tagline: 'Blazing fast 300+ tok/s • Excellent for fiction prose & dialogue',
    badge: '100% Free • Fastest',
    model: 'Llama 3.3 70B Versatile',
    keyPrefix: 'gsk_',
    placeholder: 'gsk_...',
    docUrl: 'https://console.groq.com/keys',
    freeTerms: 'Up to 30 req/min, instant responses at $0 cost',
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    tagline: 'Access to open-source models with unified key',
    badge: '100% Free Models',
    model: 'Llama 3.3 70B Free',
    keyPrefix: 'sk-or-',
    placeholder: 'sk-or-...',
    docUrl: 'https://openrouter.ai/keys',
    freeTerms: 'Free open models with zero card requirement',
  },
};

export type EngineMode = 'auto' | 'strict' | 'local';

export interface StoredApiKey {
  id: string;
  provider: AiProvider;
  label: string;
  key: string;
  createdAt: number;
}

/**
 * AI Narrative Engine for Line Thoughts, Q&A, and Rewriting.
 * Supports:
 * 1. Multi-Key Vault: Store unlimited keys across Google Gemini, Groq (Llama 3.3), & OpenRouter
 * 2. Instant Key Rotation & Failover
 * 3. Engine Mode Toggle: Auto-Fallback vs Strict Live AI vs Built-in Engine Only
 */
export const aiService = {
  // ==========================================
  // Engine Mode Controls (Toggle Built-in Engine)
  // ==========================================
  getEngineMode: (): EngineMode => {
    if (typeof window === 'undefined') return 'auto';
    const stored = localStorage.getItem('alterjot_engine_mode') as EngineMode;
    if (stored === 'strict' || stored === 'local' || stored === 'auto') {
      return stored;
    }
    return 'auto';
  },

  setEngineMode: (mode: EngineMode): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('alterjot_engine_mode', mode);
  },

  // ==========================================
  // Multi-Key Vault (Unlimited API Keys)
  // ==========================================
  getVaultKeys: (): StoredApiKey[] => {
    if (typeof window === 'undefined') return [];
    aiService.migrateLegacyKeys();
    try {
      return JSON.parse(localStorage.getItem('alterjot_api_vault') || '[]');
    } catch {
      return [];
    }
  },

  addVaultKey: (provider: AiProvider, key: string, label?: string): StoredApiKey => {
    const cleanKey = key.trim();
    const vault = aiService.getVaultKeys();
    const countForProv = vault.filter((k) => k.provider === provider).length + 1;
    const defaultLabel = label?.trim() || `${AI_PROVIDERS[provider].name} #${countForProv}`;

    const newKey: StoredApiKey = {
      id: 'key-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      provider,
      label: defaultLabel,
      key: cleanKey,
      createdAt: Date.now(),
    };

    vault.unshift(newKey);
    localStorage.setItem('alterjot_api_vault', JSON.stringify(vault));
    if (!localStorage.getItem('alterjot_active_key_id')) {
      localStorage.setItem('alterjot_active_key_id', newKey.id);
      aiService.setActiveProvider(provider);
    }

    // Auto-sync encrypted vault to cloud if signed in
    aiService.syncVaultToCloud().catch(() => {});

    return newKey;
  },

  removeVaultKey: (id: string): void => {
    if (typeof window === 'undefined') return;
    const vault = aiService.getVaultKeys().filter((k) => k.id !== id);
    localStorage.setItem('alterjot_api_vault', JSON.stringify(vault));
    if (localStorage.getItem('alterjot_active_key_id') === id) {
      if (vault.length > 0) {
        localStorage.setItem('alterjot_active_key_id', vault[0].id);
        aiService.setActiveProvider(vault[0].provider);
      } else {
        localStorage.removeItem('alterjot_active_key_id');
      }
    }

    // Auto-sync encrypted vault to cloud if signed in
    aiService.syncVaultToCloud().catch(() => {});
  },

  getActiveKeyId: (): string | null => {
    if (typeof window === 'undefined') return null;
    aiService.migrateLegacyKeys();
    const activeId = localStorage.getItem('alterjot_active_key_id');
    const vault = aiService.getVaultKeys();
    if (activeId && vault.some((k) => k.id === activeId)) {
      return activeId;
    }
    return vault.length > 0 ? vault[0].id : null;
  },

  setActiveKeyId: (id: string): void => {
    if (typeof window === 'undefined') return;
    const vault = aiService.getVaultKeys();
    const target = vault.find((k) => k.id === id);
    if (target) {
      localStorage.setItem('alterjot_active_key_id', id);
      aiService.setActiveProvider(target.provider);
      if (target.provider === 'groq') localStorage.setItem('alterjot_groq_api_key', target.key);
      else if (target.provider === 'openrouter') localStorage.setItem('alterjot_openrouter_api_key', target.key);
      else localStorage.setItem('alterjot_gemini_api_key', target.key);

      // Auto-sync active key preference
      aiService.syncVaultToCloud().catch(() => {});
    }
  },

  getActiveVaultKey: (): StoredApiKey | null => {
    const vault = aiService.getVaultKeys();
    const activeId = aiService.getActiveKeyId();
    if (!activeId) return null;
    return vault.find((k) => k.id === activeId) || null;
  },

  // ==========================================
  // Cloud Sync Controls (AES-256-GCM Encrypted)
  // ==========================================
  isCloudSyncEnabled: (): boolean => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('alterjot_vault_cloud_sync');
    if (stored === null) return true; // Enabled by default
    return stored === 'true';
  },

  setCloudSyncEnabled: (enabled: boolean): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('alterjot_vault_cloud_sync', enabled ? 'true' : 'false');
    if (enabled) {
      aiService.syncVaultToCloud().catch(() => {});
    }
  },

  getLastSyncTime: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('alterjot_vault_last_sync');
  },

  setLastSyncTime: (timeIso: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('alterjot_vault_last_sync', timeIso);
  },

  getEffectiveUser: (userOverride?: { id: string; email?: string }): { id: string; email?: string } | null => {
    if (userOverride?.id) return userOverride;
    if (typeof window === 'undefined') return null;
    const id = localStorage.getItem('endfiles_user_id') || localStorage.getItem('alterjot_user_id');
    const email = localStorage.getItem('alterjot_user_email');
    if (id) return { id, email: email || undefined };
    return null;
  },

  syncVaultToCloud: async (
    userOverride?: { id: string; email?: string },
    options: { allowEmptyOverwrite?: boolean } = {}
  ): Promise<{ success: boolean; error?: string }> => {
    if (!aiService.isCloudSyncEnabled()) return { success: false, error: 'Sync disabled' };
    const user = aiService.getEffectiveUser(userOverride);
    if (!user) return { success: false, error: 'User not signed in' };

    try {
      const vault = aiService.getVaultKeys();

      // Safeguard: If local vault is empty and empty overwrite is not explicitly approved,
      // try to pull existing cloud keys first instead of overwriting the user's cloud keys!
      if (vault.length === 0 && !options.allowEmptyOverwrite) {
        const loadRes = await aiService.loadVaultFromCloud(user);
        if (loadRes.success && loadRes.count > 0) {
          return { success: true };
        }
        return { success: true };
      }

      const passphrase = cryptoVault.getUserPassphrase(user.id, user.email);
      const encrypted = await cryptoVault.encrypt(vault, passphrase);

      const res = await api.saveCloudVault(encrypted);
      if (res.success) {
        aiService.setLastSyncTime(res.vaultUpdatedAt || new Date().toISOString());
        return { success: true };
      }
      return { success: false, error: res.message || 'Failed to save to cloud' };
    } catch (err: any) {
      console.warn('[AI Service] Cloud vault sync failed:', err);
      return { success: false, error: err.message };
    }
  },

  loadVaultFromCloud: async (userOverride?: { id: string; email?: string }): Promise<{ success: boolean; count: number; error?: string }> => {
    const user = aiService.getEffectiveUser(userOverride);
    if (!user) return { success: false, count: 0, error: 'User not signed in' };

    try {
      const res = await api.getCloudVault();
      if (!res.success || !res.encryptedVault) {
        return { success: true, count: 0 };
      }

      const candidates = cryptoVault.getUserPassphraseCandidates(user.id, user.email);
      const cloudVault = await cryptoVault.decrypt<StoredApiKey[]>(res.encryptedVault, candidates);

      if (Array.isArray(cloudVault)) {
        const localVault = aiService.getVaultKeys();

        if (localVault.length === 0) {
          if (cloudVault.length > 0) {
            localStorage.setItem('alterjot_api_vault', JSON.stringify(cloudVault));
            aiService.setActiveKeyId(cloudVault[0].id);
          }
        } else {
          // Merge avoiding duplicates by key
          const existingKeyStrings = new Set(localVault.map((k) => k.key.trim()));
          let added = 0;
          for (const item of cloudVault) {
            if (item.key && !existingKeyStrings.has(item.key.trim())) {
              localVault.push(item);
              added++;
            }
          }
          if (added > 0) {
            localStorage.setItem('alterjot_api_vault', JSON.stringify(localVault));
          }

          // If local device had more keys than cloud, re-encrypt merged vault to cloud
          if (localVault.length > cloudVault.length) {
            aiService.syncVaultToCloud(user).catch(() => {});
          }
        }

        if (res.vaultUpdatedAt) {
          aiService.setLastSyncTime(res.vaultUpdatedAt);
        }
        return { success: true, count: cloudVault.length };
      }
      return { success: false, count: 0, error: 'Decryption yielded invalid vault format' };
    } catch (err: any) {
      console.warn('[AI Service] Load vault from cloud failed:', err);
      return { success: false, count: 0, error: err.message };
    }
  },

  migrateLegacyKeys: (): void => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('alterjot_api_vault')) return;

    const vault: StoredApiKey[] = [];
    const gemini = localStorage.getItem('alterjot_gemini_api_key');
    if (gemini && gemini.length > 8) {
      vault.push({
        id: 'legacy-gemini-' + Date.now(),
        provider: 'gemini',
        label: 'My Google Gemini Key',
        key: gemini.trim(),
        createdAt: Date.now(),
      });
    }
    const groq = localStorage.getItem('alterjot_groq_api_key');
    if (groq && groq.length > 8) {
      vault.push({
        id: 'legacy-groq-' + Date.now(),
        provider: 'groq',
        label: 'My Groq Llama 3.3 Key',
        key: groq.trim(),
        createdAt: Date.now(),
      });
    }
    const openrouter = localStorage.getItem('alterjot_openrouter_api_key');
    if (openrouter && openrouter.length > 8) {
      vault.push({
        id: 'legacy-openrouter-' + Date.now(),
        provider: 'openrouter',
        label: 'My OpenRouter Key',
        key: openrouter.trim(),
        createdAt: Date.now(),
      });
    }

    if (vault.length > 0) {
      localStorage.setItem('alterjot_api_vault', JSON.stringify(vault));
      localStorage.setItem('alterjot_active_key_id', vault[0].id);
    }
  },

  /**
   * Get active provider (default 'gemini')
   */
  getActiveProvider: (): AiProvider => {
    const active = aiService.getActiveVaultKey();
    if (active) return active.provider;

    if (typeof window === 'undefined') return 'gemini';
    const stored = localStorage.getItem('alterjot_ai_provider') as AiProvider;
    if (stored && (stored === 'gemini' || stored === 'groq' || stored === 'openrouter')) {
      return stored;
    }
    if (localStorage.getItem('alterjot_groq_api_key')) return 'groq';
    if (localStorage.getItem('alterjot_openrouter_api_key')) return 'openrouter';
    return 'gemini';
  },

  setActiveProvider: (provider: AiProvider): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('alterjot_ai_provider', provider);
  },

  /**
   * User BYOK LocalStorage helpers
   */
  getUserKey: (provider?: AiProvider): string | null => {
    const active = aiService.getActiveVaultKey();
    if (active && (!provider || active.provider === provider)) {
      return active.key;
    }

    if (typeof window === 'undefined') return null;
    const targetProvider = provider || aiService.getActiveProvider();
    if (targetProvider === 'groq') return localStorage.getItem('alterjot_groq_api_key');
    if (targetProvider === 'openrouter') return localStorage.getItem('alterjot_openrouter_api_key');
    return localStorage.getItem('alterjot_gemini_api_key');
  },

  setUserKey: (key: string, provider?: AiProvider, label?: string): void => {
    if (typeof window === 'undefined') return;
    const clean = key.trim();
    let targetProvider = provider;
    if (!targetProvider) {
      if (clean.startsWith('gsk_')) targetProvider = 'groq';
      else if (clean.startsWith('sk-or-')) targetProvider = 'openrouter';
      else targetProvider = aiService.getActiveProvider();
    }
    aiService.addVaultKey(targetProvider, clean, label);
  },

  removeUserKey: (provider?: AiProvider): void => {
    if (typeof window === 'undefined') return;
    const targetProvider = provider || aiService.getActiveProvider();
    const vault = aiService.getVaultKeys();
    const remaining = vault.filter((k) => k.provider !== targetProvider);
    localStorage.setItem('alterjot_api_vault', JSON.stringify(remaining));
    if (targetProvider === 'groq') localStorage.removeItem('alterjot_groq_api_key');
    else if (targetProvider === 'openrouter') localStorage.removeItem('alterjot_openrouter_api_key');
    else localStorage.removeItem('alterjot_gemini_api_key');
  },

  hasAnyKey: (): boolean => {
    return aiService.getVaultKeys().length > 0;
  },

  verifyKey: async (apiKey: string, provider?: AiProvider) => {
    return await api.verifyAiKey(apiKey, provider);
  },

  /**
   * Check status of AI configuration
   */
  getStatus: async (): Promise<{
    isLiveGemini: boolean;
    isLiveAi?: boolean;
    model: string;
    provider: string;
    source?: string;
    engineMode?: EngineMode;
    keyLabel?: string;
    totalVaultKeys?: number;
  }> => {
    const engineMode = aiService.getEngineMode();
    const activeVaultKey = aiService.getActiveVaultKey();
    const totalVaultKeys = aiService.getVaultKeys().length;

    if (engineMode === 'local') {
      return {
        isLiveGemini: false,
        isLiveAi: false,
        model: 'Local Narrative Engine',
        provider: 'Built-in Engine (Forced Offline)',
        source: 'local_mode',
        engineMode: 'local',
        totalVaultKeys,
      };
    }

    try {
      const res = await api.getAiStatus();
      if (activeVaultKey) {
        const config = AI_PROVIDERS[activeVaultKey.provider];
        return {
          isLiveGemini: true,
          isLiveAi: true,
          model: config.model,
          provider: activeVaultKey.label || `Personal ${config.name}`,
          source: 'user',
          engineMode,
          keyLabel: activeVaultKey.label,
          totalVaultKeys,
        };
      }
      return {
        ...res,
        engineMode,
        totalVaultKeys,
      };
    } catch {
      const isLive = Boolean(activeVaultKey);
      const config = activeVaultKey ? AI_PROVIDERS[activeVaultKey.provider] : null;
      return {
        isLiveGemini: isLive,
        isLiveAi: isLive,
        model: isLive && config ? config.model : 'Local Narrative Engine',
        provider: isLive && config ? activeVaultKey?.label || `Personal ${config.name}` : 'Alterjot Built-in',
        source: isLive ? 'user' : 'none',
        engineMode,
        keyLabel: activeVaultKey?.label,
        totalVaultKeys,
      };
    }
  },

  /**
   * Analyzes what the AI thinks of the given line (literary critique, tone, impact).
   */
  analyzePassage: async (text: string): Promise<AiPassageAnalysis> => {
    const mode = aiService.getEngineMode();
    if (mode === 'local') {
      return localAnalyzePassage(text);
    }

    try {
      const remote = await api.analyzePassage(text);
      if (remote && remote.tone) {
        return remote;
      }
    } catch (err: any) {
      console.warn('[aiService] Remote analysis unavailable:', err);
      if (mode === 'strict') {
        throw new Error(err.message || 'Live AI call failed and fallback engine is disabled.');
      }
    }

    // Local heuristic fallback
    await new Promise((resolve) => setTimeout(resolve, 350));
    return localAnalyzePassage(text);
  },

  /**
   * Responds to author questions or rewrite requests about the specific line.
   */
  respondToQuery: async (lineText: string, query: string): Promise<AiQueryResponse> => {
    const mode = aiService.getEngineMode();
    if (mode === 'local') {
      return localRespondToQuery(lineText, query);
    }

    try {
      const remote = await api.queryAi(lineText, query);
      if (remote && remote.answer) {
        return remote;
      }
    } catch (err: any) {
      console.warn('[aiService] Remote query unavailable:', err);
      if (mode === 'strict') {
        throw new Error(err.message || 'Live AI call failed and fallback engine is disabled.');
      }
    }

    // Local heuristic fallback
    await new Promise((resolve) => setTimeout(resolve, 450));
    return localRespondToQuery(lineText, query);
  },

  /**
   * Generates a rewritten variation of the line based on author instructions.
   */
  generateRewrite: async (originalText: string, instruction: string): Promise<string> => {
    const mode = aiService.getEngineMode();
    if (mode === 'local') {
      return localGenerateRewrite(originalText, instruction);
    }

    try {
      const remote = await api.generateAiRewrite(originalText, instruction);
      if (remote && remote.rewrite) {
        return remote.rewrite;
      }
    } catch (err: any) {
      console.warn('[aiService] Remote rewrite unavailable:', err);
      if (mode === 'strict') {
        throw new Error(err.message || 'Live AI call failed and fallback engine is disabled.');
      }
    }

    // Local heuristic fallback
    await new Promise((resolve) => setTimeout(resolve, 450));
    return localGenerateRewrite(originalText, instruction);
  },
};

// =========================================================================
// LOCAL FALLBACK HEURISTICS
// =========================================================================

function localAnalyzePassage(text: string): AiPassageAnalysis {
  const clean = text.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const sentences = clean.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const wordCount = words.length;
  const avgWordsPerSentence = sentences.length > 0 ? Math.round(wordCount / sentences.length) : wordCount;
  const lower = clean.toLowerCase();

  // Tone & mood signals
  const hasDanger = /shadow|blood|cold|dark|decay|ruin|ash|wound|knife|gun|scream|trap|zombie|teeth|rot|fear|dead|kill|flesh|corpse/i.test(lower);
  const hasReflection = /remember|thought|knew|felt|wondered|wished|perhaps|silence|gaze|looked|breath|stared|waited/i.test(lower);
  const hasDialogue = /["'“”—]/.test(clean);
  const hasSensory = /smell|stench|metallic|cold|hot|frozen|burning|rattled|echo|whisper|damp|bitter|sharp|reek/i.test(lower);
  const hasAction = /ran|slammed|lunged|snapped|shattered|grabbed|sprinted|fired|struck|burst|hurled|scrambled/i.test(lower);

  let tone = 'Grounded & Observational';
  if (hasDanger && hasAction) tone = 'High-Stakes & Visceral Peril';
  else if (hasDanger) tone = 'Foreboding & Tense Dread';
  else if (hasAction) tone = 'Kinetic Action & Urgent Momentum';
  else if (hasReflection) tone = 'Introspective & Melancholic';
  else if (hasSensory) tone = 'Sensory & Atmospheric';

  let pacing = 'Moderate & Balanced';
  if (avgWordsPerSentence <= 8) pacing = 'Staccato & Urgent (High Velocity)';
  else if (avgWordsPerSentence >= 22) pacing = 'Expansive & Lingering (Atmospheric)';

  let thoughts = '';
  if (hasAction && hasDanger) {
    thoughts = `This line hits with strong kinetic adrenaline. The verbs carry real momentum, putting the protagonist in direct opposition to physical danger. The reader feels the immediate survival stakes without dragging expository weight.`;
  } else if (hasDanger) {
    thoughts = `I really like the creeping dread here. It plants an eerie seed of paranoia without shouting, signaling that safety is an illusion in this world.`;
  } else if (hasReflection) {
    thoughts = `There is poignant character weight in this line. It pauses the survival mechanics just long enough to remind us of the human stakes and what has been lost.`;
  } else if (hasDialogue) {
    thoughts = `The subtext between the words is working nicely. You can feel the unspoken friction and shifting power dynamics.`;
  } else if (wordCount <= 7) {
    thoughts = `Punchy and confident. Short lines like this command attention on the page and force the reader to absorb the gravity of the statement.`;
  } else {
    thoughts = `This line does good heavy lifting for spatial continuity and setting the immediate scene, grounding the reader smoothly in the physical reality of the narrative.`;
  }

  const conveys = thoughts;
  const strengths = hasSensory
    ? 'Tactile sensory textures bring vivid immersion to the line.'
    : hasAction
    ? 'Strong active verbs push narrative velocity forward.'
    : 'Crisp sentence economy that avoids unnecessary filler.';

  const suggestions = avgWordsPerSentence > 20
    ? 'Breaking long clauses into shorter beats can heighten immediate urgency.'
    : !hasSensory
    ? 'Adding an auditory or tactile anchor (e.g. cold condensation, distant metallic scrape) will deepen reader immersion.'
    : 'Try showing character physiological responses rather than abstract descriptions.';

  return {
    tone,
    thoughts,
    conveys,
    pacing,
    strengths,
    suggestions,
    isLiveGemini: false,
    isLiveAi: false,
    provider: 'Local Heuristics',
    model: 'Built-in Engine',
  };
}

function localRespondToQuery(lineText: string, query: string): AiQueryResponse {
  const clean = lineText.trim();
  const q = query.toLowerCase().trim();

  const isQuestion =
    q.includes('?') ||
    q.startsWith('why') ||
    q.startsWith('what') ||
    q.startsWith('how') ||
    q.startsWith('does') ||
    q.startsWith('is') ||
    q.startsWith('could') ||
    q.startsWith('should') ||
    q.startsWith('can you explain');

  const wantsRewrite =
    q.includes('rewrite') ||
    q.includes('change') ||
    q.includes('make it') ||
    q.includes('alternative') ||
    q.includes('tighter') ||
    q.includes('tension') ||
    q.includes('show don') ||
    q.includes('punchier') ||
    q.includes('darker') ||
    q.includes('sensory');

  let answer = '';
  if (q.includes('reader') || q.includes('interpret') || q.includes('feel')) {
    answer = `Readers will interpret this line as a signal of high vulnerability. The tone creates an expectation that things are not as stable as they seem, priming the reader to anticipate sudden conflict or a hidden threat.`;
  } else if (q.includes('voice') || q.includes('character')) {
    answer = `Character-wise, this reveals someone who is constantly vigilant and emotionally guarded. They aren't narrating casually—every observation feels like a survival calculus.`;
  } else if (q.includes('cliché') || q.includes('trope') || q.includes('original')) {
    answer = `The core concept is familiar in the genre, but your phrasing keeps it grounded. If you want to make it feel completely distinct, replace common visual markers with unexpected sensory textures.`;
  } else if (q.includes('pacing') || q.includes('rhythm') || q.includes('flow')) {
    answer = `The cadence is balanced and flows naturally. Because the syllables aren't overcrowded, it reads smoothly without stuttering the reader's inner ear.`;
  } else if (isQuestion && !wantsRewrite) {
    answer = `Looking closely at this line: It effectively establishes the immediate mood without over-explaining. The syntax is clean, and the word choice gives the narrative an understated, gritty authenticity.`;
  } else {
    answer = `Here is a refined revision based on your direction. Notice how the phrasing heightens the immediate presence and sharpens the emotional stakes:`;
  }

  let proposedRewrite: string | undefined = undefined;
  if (wantsRewrite || !isQuestion) {
    proposedRewrite = localGenerateRewrite(clean, query);
  }

  return {
    answer,
    proposedRewrite,
    isLiveGemini: false,
    isLiveAi: false,
    provider: 'Local Heuristics',
    model: 'Built-in Engine',
  };
}

function localGenerateRewrite(originalText: string, instruction: string): string {
  const clean = originalText.trim();
  const inst = instruction.toLowerCase().trim();
  const trimmed = clean.replace(/[.!?]+$/, '');

  if (inst.includes('show don') || inst.includes('show, don') || inst.includes('show not tell')) {
    return `${trimmed}. His pulse hammered against his throat, cold sweat pooling along his collarbone as his knuckles whitened against the metal. He didn't blink—dare not breathe—measuring the darkness by the shallow rasp in his own chest.`;
  }
  if (inst.includes('tension') || inst.includes('suspense') || inst.includes('darker') || inst.includes('dread')) {
    return `${trimmed}. Every shadow seemed to hold its breath. The hair on his arms stood on end before the sound even registered—a rhythmic, wet scraping just beyond the threshold of the dark.`;
  }
  if (inst.includes('punch') || inst.includes('tight') || inst.includes('short') || inst.includes('concise')) {
    const words = clean.split(/\s+/);
    if (words.length > 6) {
      const core = words.slice(0, Math.ceil(words.length * 0.65)).join(' ');
      return `${core.replace(/[.,;!?]+$/, '')}. Plain and brutal.`;
    }
    return `${trimmed}—no hesitation, no second chances.`;
  }
  if (inst.includes('sensory') || inst.includes('atmosphere') || inst.includes('weather') || inst.includes('cold')) {
    return `${trimmed}. The metallic stench of ozone hung heavy in the sub-zero air, biting at cracked lips and stinging raw skin with every sharp inhalation.`;
  }
  if (inst.includes('action') || inst.includes('urgent') || inst.includes('fast') || inst.includes('visceral')) {
    return `${trimmed}. Bone slammed against concrete; adrenaline flooded his veins in a scalding rush as he surged forward, teeth bared against the shockwave.`;
  }

  return `${trimmed}, shaped with sharper urgency and a deeper atmospheric undercurrent.`;
}
