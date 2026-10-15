/**
 * AI Narrative Controller for Alterjot
 * Multi-Provider Architecture supporting:
 * 1. Google Gemini (Google AI Studio - 100% Free Tier)
 * 2. Groq Cloud (Meta Llama 3.3 70B & 8B - 100% Free Tier, ultra-fast 300+ tok/s)
 * 3. OpenRouter (Open-Source Free Models)
 * With zero-delay fallback to Alterjot's local literary heuristics engine.
 */

// In-memory cache of discovered active models per API key
const modelCache = new Map();

/**
 * Resolves active provider, API key, and origin (user BYOK header vs server env)
 */
export function resolveAiCredentials(req) {
  const forceLocal = req.headers['x-force-local'] === 'true' || req.headers['x-engine-mode'] === 'local';
  const disableFallback = req.headers['x-disable-fallback'] === 'true' || req.headers['x-engine-mode'] === 'strict';

  const userGroqKey = req.headers['x-groq-key'];
  const userOpenRouterKey = req.headers['x-openrouter-key'];
  const userGeminiKey = req.headers['x-gemini-key'];
  const genericKey = req.headers['x-ai-key'];
  const requestedProvider = req.headers['x-ai-provider'];

  // Parse backup keys if provided for multi-key rotation
  let backupKeys = [];
  const backupHeader = req.headers['x-ai-backup-keys'];
  if (backupHeader) {
    try {
      backupKeys = JSON.parse(backupHeader);
    } catch {
      backupKeys = backupHeader.split(',').map((k) => k.trim()).filter(Boolean);
    }
  }

  let resolved = { provider: 'none', key: null, source: 'none' };

  // 1. Direct header keys
  if (userGroqKey && typeof userGroqKey === 'string' && userGroqKey.trim().length > 8) {
    resolved = { provider: 'groq', key: userGroqKey.trim(), source: 'user' };
  } else if (userOpenRouterKey && typeof userOpenRouterKey === 'string' && userOpenRouterKey.trim().length > 8) {
    resolved = { provider: 'openrouter', key: userOpenRouterKey.trim(), source: 'user' };
  } else if (userGeminiKey && typeof userGeminiKey === 'string' && userGeminiKey.trim().length > 8) {
    resolved = { provider: 'gemini', key: userGeminiKey.trim(), source: 'user' };
  } else if (genericKey && typeof genericKey === 'string' && genericKey.trim().length > 8) {
    // 2. Generic x-ai-key with signature auto-detection
    const k = genericKey.trim();
    if (k.startsWith('gsk_') || requestedProvider === 'groq') {
      resolved = { provider: 'groq', key: k, source: 'user' };
    } else if (k.startsWith('sk-or-') || requestedProvider === 'openrouter') {
      resolved = { provider: 'openrouter', key: k, source: 'user' };
    } else {
      resolved = { provider: 'gemini', key: k, source: 'user' };
    }
  } else if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.length > 8 && !process.env.GROQ_API_KEY.includes('your-')) {
    // 3. Server Environment Keys Fallback
    resolved = { provider: 'groq', key: process.env.GROQ_API_KEY.trim(), source: 'server' };
  } else if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.length > 8 && !process.env.OPENROUTER_API_KEY.includes('your-')) {
    resolved = { provider: 'openrouter', key: process.env.OPENROUTER_API_KEY.trim(), source: 'server' };
  } else if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 8 && !process.env.GEMINI_API_KEY.includes('your-')) {
    resolved = { provider: 'gemini', key: process.env.GEMINI_API_KEY.trim(), source: 'server' };
  }

  return {
    ...resolved,
    backupKeys: Array.isArray(backupKeys) ? backupKeys : [],
    forceLocal,
    disableFallback,
  };
}

/**
 * Dynamically queries Google's ListModels endpoint to get models active for this key
 */
async function getGeminiAvailableModels(apiKey) {
  if (modelCache.has(apiKey)) {
    return modelCache.get(apiKey);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const message = err.error?.message || `HTTP ${res.status}`;
      throw new Error(message);
    }

    const data = await res.json();
    const supported = (data.models || [])
      .filter(
        (m) =>
          m.supportedGenerationMethods &&
          m.supportedGenerationMethods.includes('generateContent')
      )
      .map((m) => m.name.replace(/^models\//, ''));

    if (supported.length > 0) {
      const ranked = [
        ...supported.filter((n) => n.includes('3.8-flash')),
        ...supported.filter((n) => n.includes('3.5-flash')),
        ...supported.filter((n) => n.includes('2.5-flash')),
        ...supported.filter((n) => n.includes('flash') && !n.includes('8b') && !n.includes('1.5')),
        ...supported.filter((n) => n.includes('flash')),
        ...supported.filter((n) => !n.includes('embedding') && !n.includes('aqa')),
      ];

      const chosenChain = Array.from(new Set(ranked.length > 0 ? ranked : supported));
      modelCache.set(apiKey, chosenChain);
      return chosenChain;
    }
  } catch (err) {
    console.warn('[AI Controller] Gemini ListModels query failed:', err.message);
    if (
      err.message &&
      (err.message.includes('API key not valid') ||
        err.message.includes('API_KEY_INVALID') ||
        err.message.includes('PERMISSION_DENIED'))
    ) {
      throw err;
    }
  }

  return ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-2.0-flash'];
}

/**
 * Caller for Google Gemini API
 */
async function callGemini(prompt, systemInstruction = '', preferredModel = null, apiKey = null) {
  const key = (apiKey || process.env.GEMINI_API_KEY || '').trim();
  if (!key || key.includes('your-gemini') || key.length < 8) {
    throw new Error('NO_API_KEY');
  }

  const availableModels = await getGeminiAvailableModels(key);
  const modelChain = preferredModel
    ? [preferredModel, ...availableModels.filter((m) => m !== preferredModel)]
    : availableModels;

  let lastError = null;

  for (const model of modelChain) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      };

      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson.error?.message || `HTTP ${response.status}`;
        if (response.status === 404 || errMsg.includes('not found') || errMsg.includes('not supported')) {
          lastError = new Error(errMsg);
          continue;
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return { text: text.trim(), model, provider: 'Google Gemini' };
      }
    } catch (err) {
      lastError = err;
      if (
        err.message &&
        (err.message.includes('API key not valid') ||
          err.message.includes('API_KEY_INVALID') ||
          err.message.includes('PERMISSION_DENIED'))
      ) {
        throw err;
      }
    }
  }

  throw lastError || new Error('No available Gemini model could process this request.');
}

// In-memory cache of discovered active models for Groq
const groqModelCache = new Map();

/**
 * Dynamically queries Groq's active models endpoint to discover supported models for this account
 */
async function getGroqAvailableModels(apiKey) {
  if (groqModelCache.has(apiKey)) {
    return groqModelCache.get(apiKey);
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) {
      const data = await res.json();
      const rawList = (data.data || []).map((m) => m.id);
      const textModels = rawList.filter(
        (id) =>
          !id.includes('whisper') &&
          !id.includes('guard') &&
          !id.includes('tts') &&
          !id.includes('vision')
      );

      if (textModels.length > 0) {
        const ranked = [
          ...textModels.filter((id) => id.includes('gpt-oss') || id.includes('120b')),
          ...textModels.filter((id) => id.includes('qwen') || id.includes('27b')),
          ...textModels.filter((id) => id.includes('llama-3.3') || id.includes('llama3.3')),
          ...textModels.filter((id) => id.includes('70b')),
          ...textModels.filter((id) => id.includes('llama-3.1') || id.includes('8b')),
          ...textModels.filter((id) => id.includes('gemma')),
          ...textModels.filter((id) => id.includes('mixtral')),
          ...textModels,
        ];
        const unique = Array.from(new Set(ranked));
        groqModelCache.set(apiKey, unique);
        return unique;
      }
    }
  } catch (err) {
    console.warn('[AI Controller] Groq ListModels failed:', err.message);
  }

  return ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'llama-3.1-8b-instant'];
}

/**
 * Caller for Groq API with Dynamic Model Discovery
 */
async function callGroq(prompt, systemInstruction = '', preferredModel = null, apiKey = null) {
  const key = (apiKey || process.env.GROQ_API_KEY || '').trim();
  if (!key || key.length < 8) {
    throw new Error('NO_GROQ_KEY');
  }

  const availableModels = await getGroqAvailableModels(key);
  const modelChain = preferredModel
    ? [preferredModel, ...availableModels.filter((m) => m !== preferredModel)]
    : availableModels;

  let lastError = null;

  for (const model of modelChain) {
    try {
      const messages = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson.error?.message || `Groq API Error (${response.status})`;
        if (
          response.status === 404 ||
          errMsg.includes('does not exist') ||
          errMsg.includes('do not have access') ||
          errMsg.includes('decommissioned')
        ) {
          lastError = new Error(errMsg);
          continue;
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) {
        return { text: text.trim(), model, provider: 'Groq Cloud' };
      }
    } catch (err) {
      lastError = err;
      if (
        err.message &&
        (err.message.includes('Invalid API Key') ||
          err.message.includes('Unauthorized') ||
          err.message.includes('invalid_api_key'))
      ) {
        throw err;
      }
    }
  }

  throw lastError || new Error('No available Groq model could process this request.');
}

/**
 * Caller for OpenRouter API (Access to diverse free open-source models)
 */
async function callOpenRouter(prompt, systemInstruction = '', preferredModel = null, apiKey = null) {
  const key = (apiKey || process.env.OPENROUTER_API_KEY || '').trim();
  if (!key || key.length < 8) {
    throw new Error('NO_OPENROUTER_KEY');
  }

  const model = preferredModel || 'meta-llama/llama-3.3-70b-instruct:free';
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://alterjot.vercel.app',
      'X-Title': 'Alterjot Book Studio',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const errMsg = errJson.error?.message || `OpenRouter API Error (${response.status})`;
    throw new Error(errMsg);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('No text returned from OpenRouter');
  }

  return { text: text.trim(), model, provider: 'OpenRouter' };
}

/**
 * Unified AI Dispatcher
 */
async function callUnifiedAi(prompt, systemInstruction = '', req) {
  const creds = resolveAiCredentials(req);
  if (!creds.key) {
    throw new Error('NO_AI_KEY_CONFIGURED');
  }

  const preferredModel = req.headers['x-ai-model'] || null;

  // Build key attempt queue: active key, then any backup keys
  const queue = [
    { key: creds.key, provider: creds.provider },
    ...(creds.backupKeys || []).map((item) => {
      if (typeof item === 'string') {
        const p = item.startsWith('gsk_') ? 'groq' : item.startsWith('sk-or-') ? 'openrouter' : 'gemini';
        return { key: item, provider: p };
      }
      return {
        key: item.key,
        provider: item.provider || (item.key.startsWith('gsk_') ? 'groq' : 'gemini'),
      };
    }),
  ];

  let lastError = null;
  for (const { key, provider } of queue) {
    if (!key || key.length < 8) continue;
    try {
      if (provider === 'groq') {
        return await callGroq(prompt, systemInstruction, preferredModel, key);
      }
      if (provider === 'openrouter') {
        return await callOpenRouter(prompt, systemInstruction, preferredModel, key);
      }
      return await callGemini(prompt, systemInstruction, preferredModel, key);
    } catch (err) {
      lastError = err;
      console.warn(`[AI Controller] Key attempt failed for ${provider}:`, err.message);
    }
  }

  throw lastError || new Error('All configured AI keys failed to generate a response.');
}

/**
 * Get current AI Engine status
 */
export const getAiStatus = async (req, res) => {
  const creds = resolveAiCredentials(req);
  if (creds.forceLocal) {
    return res.json({
      success: true,
      data: {
        isLiveAi: false,
        isLiveGemini: false,
        provider: 'local',
        providerName: 'Built-in Engine Only',
        source: 'local_mode',
        model: 'Alterjot Narrative Engine',
        engineMode: 'local',
      },
    });
  }

  const isLive = Boolean(creds.key);
  let activeModel = 'Local Heuristic Engine';
  let providerName = 'Alterjot Built-in';

  if (isLive) {
    if (creds.provider === 'groq') {
      providerName = 'Groq Cloud (Free)';
      try {
        const models = await getGroqAvailableModels(creds.key);
        activeModel = models[0] || 'Groq Cloud Model';
      } catch {
        activeModel = 'Groq Cloud Model';
      }
    } else if (creds.provider === 'openrouter') {
      activeModel = 'Llama 3.3 70B Free';
      providerName = 'OpenRouter (Free)';
    } else {
      providerName = 'Google AI Studio (Free)';
      try {
        const models = await getGeminiAvailableModels(creds.key);
        activeModel = models[0] || 'Gemini 2.5 Flash';
      } catch {
        activeModel = 'Gemini 2.5 Flash';
      }
    }
  }

  res.json({
    success: true,
    data: {
      isLiveAi: isLive,
      isLiveGemini: isLive, // backwards compatibility
      provider: creds.provider,
      providerName,
      source: creds.source, // 'user' | 'server' | 'none'
      model: activeModel,
      engineMode: creds.disableFallback ? 'strict' : 'auto',
    },
  });
};

/**
 * Verify any user-provided API key (Gemini, Groq, or OpenRouter)
 */
export const verifyGeminiKey = async (req, res) => {
  const { apiKey, provider } = req.body;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 8) {
    return res.status(400).json({ success: false, valid: false, error: 'A valid API key is required.' });
  }

  const cleanKey = apiKey.trim();

  // Determine provider by explicit argument or signature prefix
  let targetProvider = provider;
  if (!targetProvider) {
    if (cleanKey.startsWith('gsk_')) targetProvider = 'groq';
    else if (cleanKey.startsWith('sk-or-')) targetProvider = 'openrouter';
    else targetProvider = 'gemini';
  }

  try {
    if (targetProvider === 'groq') {
      // Verify with Groq models endpoint & dynamic discovery
      const models = await getGroqAvailableModels(cleanKey);
      if (!models || models.length === 0) {
        throw new Error('No available text models found on this Groq account.');
      }
      return res.json({
        success: true,
        valid: true,
        provider: 'groq',
        model: models[0],
        message: `Groq API Key verified! Connected to ${models[0]} (Ultra-fast inference).`,
      });
    }

    if (targetProvider === 'openrouter') {
      // Verify with OpenRouter auth endpoint
      const orRes = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: { Authorization: `Bearer ${cleanKey}` },
      });
      if (!orRes.ok) {
        throw new Error('Invalid OpenRouter API key. Check your key at https://openrouter.ai/keys');
      }
      return res.json({
        success: true,
        valid: true,
        provider: 'openrouter',
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        message: 'OpenRouter API Key verified! Connected to free open-source models.',
      });
    }

    // Default to Gemini verification
    const models = await getGeminiAvailableModels(cleanKey);
    if (!models || models.length === 0) {
      throw new Error('No compatible Gemini generation models found for this account.');
    }

    const testResult = await callGemini('Say "Ready" in one word.', '', models[0], cleanKey);

    return res.json({
      success: true,
      valid: true,
      provider: 'gemini',
      model: testResult.model,
      message: `Gemini API Key verified! Connected to ${testResult.model}.`,
    });
  } catch (err) {
    let message = err.message || 'Failed to authenticate with AI provider. Check your key.';
    if (message.includes('API_KEY_INVALID') || message.includes('API key not valid')) {
      message = 'Invalid API key. Please check that you copied the complete key.';
    }

    return res.status(400).json({
      success: false,
      valid: false,
      error: message,
    });
  }
};

/**
 * Analyze a prose line or paragraph
 */
export const analyzePassage = async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ success: false, error: 'Text passage is required' });
  }

  const clean = text.trim();
  const creds = resolveAiCredentials(req);

  // 1. If user explicitly toggled "Force Built-in Heuristics Engine"
  if (creds.forceLocal) {
    const fallback = localAnalyzePassage(clean);
    return res.json({
      success: true,
      data: {
        ...fallback,
        isLiveGemini: false,
        isLiveAi: false,
        provider: 'Local Heuristics',
        source: 'local_mode',
        model: 'Alterjot Narrative Engine',
      },
    });
  }

  // 2. Try live AI if configured
  if (creds.key) {
    try {
      const systemPrompt = `You are an elite novel editor, developmental literary coach, and narrative mentor for Alterjot.
Analyze the provided prose passage from a novel in progress.
Return a valid JSON object matching EXACTLY these keys:
{
  "tone": "2 to 4 words describing the emotional atmosphere (e.g. 'Foreboding & Tense Dread')",
  "thoughts": "2 to 3 sentences of empathetic, insightful first-person editorial feedback explaining what the line conveys to readers, its psychological stakes, and how it impacts the scene.",
  "conveys": "1 to 2 sentences summarizing what subtext or plot stakes this passage communicates.",
  "pacing": "2 to 4 words describing cadence and rhythm (e.g. 'Staccato & Urgent Velocity' or 'Expansive & Lingering')",
  "strengths": "1 to 2 sentences highlighting the strongest literary element (imagery, verb strength, subtext, tension).",
  "suggestions": "1 actionable sentence on how the author could heighten immersion, add sensory textures, or deepen character interiority."
}
IMPORTANT: Return ONLY raw JSON without markdown code blocks, backticks, or preamble.`;

      const result = await callUnifiedAi(`Analyze this excerpt:\n\n"${clean}"`, systemPrompt, req);

      let jsonText = result.text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(jsonText);

      return res.json({
        success: true,
        data: {
          tone: parsed.tone || 'Reflective & Atmospheric',
          thoughts: parsed.thoughts || 'A strong narrative moment that grounds the reader in the scene.',
          conveys: parsed.conveys || 'Communicates the immediate stakes and character perspective.',
          pacing: parsed.pacing || 'Balanced Cadence',
          strengths: parsed.strengths || 'Clean prose with authentic voice.',
          suggestions: parsed.suggestions || 'Consider layering a sensory detail to ground the moment.',
          isLiveGemini: true,
          isLiveAi: true,
          provider: result.provider,
          source: creds.source,
          model: result.model,
        },
      });
    } catch (err) {
      console.warn('[AI Controller] Remote AI call failed:', err.message);
      if (creds.disableFallback) {
        return res.status(502).json({
          success: false,
          error: `AI Error (${err.message}). Built-in engine fallback is toggled OFF.`,
        });
      }
    }
  } else if (creds.disableFallback) {
    return res.status(400).json({
      success: false,
      error: 'No active AI key found and built-in engine fallback is toggled OFF. Please configure a key in AI Settings.',
    });
  }

  // Graceful fallback to local heuristic engine
  const fallback = localAnalyzePassage(clean);
  return res.json({
    success: true,
    data: {
      ...fallback,
      isLiveGemini: false,
      isLiveAi: false,
      provider: 'Local Heuristics',
      source: 'none',
      model: 'Alterjot Narrative Engine',
    },
  });
};

/**
 * Handle author queries or rewrite requests
 */
export const respondToQuery = async (req, res) => {
  const { lineText, query } = req.body;
  if (!lineText || !query) {
    return res.status(400).json({ success: false, error: 'lineText and query are required' });
  }

  const clean = lineText.trim();
  const q = query.trim();
  const creds = resolveAiCredentials(req);

  // 1. Forced Local Mode
  if (creds.forceLocal) {
    const fallback = localRespondToQuery(clean, q);
    return res.json({
      success: true,
      data: {
        ...fallback,
        isLiveGemini: false,
        isLiveAi: false,
        provider: 'Local Heuristics',
        source: 'local_mode',
        model: 'Alterjot Narrative Engine',
      },
    });
  }

  // 2. Try live AI if configured
  if (creds.key) {
    try {
      const systemPrompt = `You are a supportive, insightful literary mentor and novel prose master for Alterjot.
The author is writing a novel and asking about a specific line or requesting a rewrite.
Respond with a JSON object:
{
  "answer": "A concise, thoughtful answer (2-4 sentences) addressing the author's question or explaining the craft behind the suggested revision.",
  "proposedRewrite": "If the author asked to rewrite, enhance, deepen, tighten, or change the prose, provide a high-caliber revised passage here. If they just asked a pure theoretical question with no rewrite requested, set this to null or omit."
}
IMPORTANT: Return ONLY raw JSON without markdown backticks or preamble.`;

      const prompt = `Passage: "${clean}"\nAuthor's Request/Question: "${q}"`;
      const result = await callUnifiedAi(prompt, systemPrompt, req);

      let jsonText = result.text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(jsonText);

      return res.json({
        success: true,
        data: {
          answer: parsed.answer || 'Here is an editorial perspective on this line.',
          proposedRewrite: parsed.proposedRewrite || undefined,
          isLiveGemini: true,
          isLiveAi: true,
          provider: result.provider,
          source: creds.source,
          model: result.model,
        },
      });
    } catch (err) {
      console.warn('[AI Controller] Remote query failed:', err.message);
      if (creds.disableFallback) {
        return res.status(502).json({
          success: false,
          error: `AI Error (${err.message}). Built-in engine fallback is toggled OFF.`,
        });
      }
    }
  } else if (creds.disableFallback) {
    return res.status(400).json({
      success: false,
      error: 'No active AI key found and built-in engine fallback is toggled OFF. Please configure a key in AI Settings.',
    });
  }

  const fallback = localRespondToQuery(clean, q);
  return res.json({
    success: true,
    data: {
      ...fallback,
      isLiveGemini: false,
      isLiveAi: false,
      provider: 'Local Heuristics',
      source: 'none',
      model: 'Alterjot Narrative Engine',
    },
  });
};

/**
 * Dedicated rewrite generator
 */
export const generateRewrite = async (req, res) => {
  const { originalText, instruction } = req.body;
  if (!originalText) {
    return res.status(400).json({ success: false, error: 'originalText is required' });
  }

  const clean = originalText.trim();
  const inst = (instruction || 'Enhance the prose').trim();
  const creds = resolveAiCredentials(req);

  // 1. Forced Local Mode
  if (creds.forceLocal) {
    const fallback = localGenerateRewrite(clean, inst);
    return res.json({
      success: true,
      data: {
        rewrite: fallback,
        isLiveGemini: false,
        isLiveAi: false,
        provider: 'Local Heuristics',
        source: 'local_mode',
        model: 'Alterjot Narrative Engine',
      },
    });
  }

  // 2. Try live AI if configured
  if (creds.key) {
    try {
      const systemPrompt = `You are a master fiction prose stylist for Alterjot.
Rewrite the provided passage following the author's directive (e.g. heighten tension, sensory depth, concise punchy, show don't tell).
Preserve the core narrative intent, character voice, and facts of the scene.
Output ONLY the rewritten prose. Do not include quotes, commentary, or markdown formatting.`;

      const prompt = `Passage to rewrite: "${clean}"\nDirective: ${inst}`;
      const result = await callUnifiedAi(prompt, systemPrompt, req);

      return res.json({
        success: true,
        data: {
          rewrite: result.text.replace(/^["']|["']$/g, '').trim(),
          isLiveGemini: true,
          isLiveAi: true,
          provider: result.provider,
          source: creds.source,
          model: result.model,
        },
      });
    } catch (err) {
      console.warn('[AI Controller] Remote rewrite failed:', err.message);
      if (creds.disableFallback) {
        return res.status(502).json({
          success: false,
          error: `AI Error (${err.message}). Built-in engine fallback is toggled OFF.`,
        });
      }
    }
  } else if (creds.disableFallback) {
    return res.status(400).json({
      success: false,
      error: 'No active AI key found and built-in engine fallback is toggled OFF.',
    });
  }

  const fallback = localGenerateRewrite(clean, inst);
  return res.json({
    success: true,
    data: {
      rewrite: fallback,
      isLiveGemini: false,
      isLiveAi: false,
      provider: 'Local Heuristics',
      source: 'none',
      model: 'Alterjot Narrative Engine',
    },
  });
};

// =========================================================================
// LOCAL FALLBACK HEURISTICS (Used seamlessly when API keys are not provided)
// =========================================================================

function localAnalyzePassage(text) {
  const clean = text.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const sentences = clean.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const wordCount = words.length;
  const avgWordsPerSentence = sentences.length > 0 ? Math.round(wordCount / sentences.length) : wordCount;
  const lower = clean.toLowerCase();

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

  return { tone, thoughts, conveys, pacing, strengths, suggestions };
}

function localRespondToQuery(lineText, query) {
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

  let proposedRewrite = undefined;
  if (wantsRewrite || !isQuestion) {
    proposedRewrite = localGenerateRewrite(clean, query);
  }

  return { answer, proposedRewrite };
}

function localGenerateRewrite(text, instruction) {
  const clean = text.trim();
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
