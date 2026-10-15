import React, { useState, useEffect } from 'react';
import {
  aiService,
  AI_PROVIDERS,
  type AiProvider,
  type StoredApiKey,
  type EngineMode,
} from '../../../services/aiService';
import {
  Key,
  ShieldCheck,
  ExternalLink,
  Check,
  AlertCircle,
  Loader2,
  Trash2,
  X,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  Zap,
  Globe,
  Sliders,
  Plus,
  Cloud,
  Lock,
  RefreshCw,
} from 'lucide-react';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'add' | 'settings'>('vault');
  const [vaultKeys, setVaultKeys] = useState<StoredApiKey[]>([]);
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
  const [engineMode, setEngineMode] = useState<EngineMode>('auto');

  // Form state for adding a key
  const [newKeyProvider, setNewKeyProvider] = useState<AiProvider>('gemini');
  const [newKeyInput, setNewKeyInput] = useState('');
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Cloud Sync state
  const [isCloudSyncOn, setIsCloudSyncOn] = useState<boolean>(aiService.isCloudSyncEnabled());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(aiService.getLastSyncTime());

  const reloadVaultState = () => {
    const keys = aiService.getVaultKeys();
    setVaultKeys(keys);
    setActiveKeyId(aiService.getActiveKeyId());
    setEngineMode(aiService.getEngineMode());
    setIsCloudSyncOn(aiService.isCloudSyncEnabled());
    setLastSyncTime(aiService.getLastSyncTime());
    if (keys.length === 0) {
      setActiveTab('add');
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setErrorMsg(null);
    try {
      const res = await aiService.syncVaultToCloud();
      if (res.success) {
        setSuccessMsg('Encrypted vault synced across devices!');
        setLastSyncTime(new Date().toISOString());
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        // If empty on cloud, try loading
        const loadRes = await aiService.loadVaultFromCloud();
        if (loadRes.success && loadRes.count > 0) {
          reloadVaultState();
          setSuccessMsg(`Restored ${loadRes.count} keys from cloud vault!`);
          setTimeout(() => setSuccessMsg(null), 3000);
        } else {
          setErrorMsg(res.error || 'Failed to sync to cloud. Ensure you are signed in.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Cloud sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleCloudSync = (enabled: boolean) => {
    setIsCloudSyncOn(enabled);
    aiService.setCloudSyncEnabled(enabled);
    if (enabled) {
      handleManualSync();
    }
  };

  useEffect(() => {
    if (isOpen) {
      reloadVaultState();
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentProviderConfig = AI_PROVIDERS[newKeyProvider];

  const getMaskedKey = (key: string) => {
    if (!key || key.length < 8) return '••••';
    return `${key.slice(0, 6)}••••••••${key.slice(-4)}`;
  };

  const handleSelectActiveKey = (id: string) => {
    aiService.setActiveKeyId(id);
    setActiveKeyId(id);
    const item = vaultKeys.find((k) => k.id === id);
    setSuccessMsg(`Active key switched to: "${item?.label || 'Selected Key'}"`);
    onKeyUpdated();
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleDeleteKey = (id: string) => {
    aiService.removeVaultKey(id);
    const remaining = aiService.getVaultKeys();
    setVaultKeys(remaining);
    setActiveKeyId(aiService.getActiveKeyId());
    setSuccessMsg('API key removed from vault.');
    onKeyUpdated();
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const handleSetEngineMode = (mode: EngineMode) => {
    aiService.setEngineMode(mode);
    setEngineMode(mode);
    onKeyUpdated();
  };

  const handleAddAndVerifyKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = newKeyInput.trim();
    if (!cleanKey) {
      setErrorMsg(`Please enter a valid ${currentProviderConfig.name} key.`);
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await aiService.verifyKey(cleanKey, newKeyProvider);
      if (res.valid) {
        aiService.addVaultKey(newKeyProvider, cleanKey, newKeyLabel);
        reloadVaultState();
        setNewKeyInput('');
        setNewKeyLabel('');
        setSuccessMsg(
          `Key verified & added! Connected to ${res.model || currentProviderConfig.model}.`
        );
        onKeyUpdated();
        setTimeout(() => {
          setActiveTab('vault');
          setSuccessMsg(null);
        }, 1200);
      } else {
        setErrorMsg(`Invalid API key. Please check your key at ${currentProviderConfig.name}.`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please verify your connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-vault-modal-title"
    >
      <div className="relative w-full max-w-xl bg-canvas-card rounded-2xl border border-canvas-border shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[85vh]">
        {/* Header Ribbon */}
        <div className="px-6 py-4 border-b border-canvas-border flex items-center justify-between bg-canvas-surface/80 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 id="ai-vault-modal-title" className="text-base font-serif font-bold text-ink">
                AI Vault & Engine Controls
              </h3>
              <p className="text-[11px] font-mono text-ink-muted">
                Add unlimited keys • Instant failover • Toggle built-in heuristic engine
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 pb-0 bg-canvas-surface/40 border-b border-canvas-border flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('vault');
              setErrorMsg(null);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'vault'
                ? 'border-brand-500 text-ink bg-canvas-card font-semibold'
                : 'border-transparent text-ink-muted hover:text-ink hover:bg-canvas-hover/50'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>Key Vault ({vaultKeys.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('add');
              setErrorMsg(null);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'add'
                ? 'border-brand-500 text-ink bg-canvas-card font-semibold'
                : 'border-transparent text-ink-muted hover:text-ink hover:bg-canvas-hover/50'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-blue-500" />
            <span>Add Key</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              setErrorMsg(null);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-brand-500 text-ink bg-canvas-card font-semibold'
                : 'border-transparent text-ink-muted hover:text-ink hover:bg-canvas-hover/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-500" />
            <span>Engine Mode</span>
          </button>
        </div>

        {/* Global Notifications */}
        {successMsg && (
          <div className="mx-6 mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="truncate">{successMsg}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* ========================================================= */}
          {/* TAB 1: KEY VAULT (Manage Multiple Keys) */}
          {/* ========================================================= */}
          {activeTab === 'vault' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
                    Stored API Keys ({vaultKeys.length})
                  </h4>
                  <p className="text-[11px] text-ink-muted">
                    Alterjot automatically uses your active key, and can roll over to backup keys if one hits rate limits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('add')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-mono font-medium transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Key</span>
                </button>
              </div>

              {vaultKeys.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-canvas-border bg-canvas-surface/40 space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <Key className="w-5 h-5" />
                  </div>
                  <h5 className="font-serif font-bold text-ink text-sm">No Keys in Vault Yet</h5>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    Add as many free keys as you want from Google Gemini, Groq (Llama 3.3), or OpenRouter to unlock unlimited live AI critique.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('add')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Your First Key (100% Free)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {vaultKeys.map((item) => {
                    const isActive = item.id === activeKeyId;
                    const providerConf = AI_PROVIDERS[item.provider];

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500/35 shadow-xs'
                            : 'bg-canvas-surface/70 border-canvas-border hover:border-canvas-border/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              type="button"
                              onClick={() => handleSelectActiveKey(item.id)}
                              className="cursor-pointer"
                              title={isActive ? 'Active Key' : 'Click to make active'}
                            >
                              <span
                                className={`w-3 h-3 rounded-full flex items-center justify-center border transition-all ${
                                  isActive
                                    ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                                    : 'border-zinc-400 bg-transparent hover:border-emerald-500'
                                }`}
                              />
                            </button>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-ink truncate">
                                  {item.label}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-canvas-card border border-canvas-border text-ink-muted">
                                  {providerConf?.name || item.provider}
                                </span>
                                {isActive && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500 text-white uppercase tracking-wider">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-mono text-ink-muted truncate mt-0.5">
                                {getMaskedKey(item.key)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!isActive && (
                              <button
                                type="button"
                                onClick={() => handleSelectActiveKey(item.id)}
                                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-canvas-hover hover:bg-canvas-card border border-canvas-border text-ink font-medium transition-colors cursor-pointer"
                              >
                                Use
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteKey(item.id)}
                              className="p-1 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete key"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* End-to-End Encrypted Cloud Sync Card */}
              <div className="p-3.5 rounded-2xl border border-canvas-border bg-canvas-surface/60 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono font-semibold text-ink">Cross-Device Cloud Sync</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          AES-256-GCM
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted leading-tight">
                        Encrypted locally in your browser before uploading. Your keys remain 100% private.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleCloudSync(!isCloudSyncOn)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer flex-shrink-0 ${
                      isCloudSyncOn ? 'bg-brand-600' : 'bg-canvas-border'
                    }`}
                    title={isCloudSyncOn ? 'Disable Cloud Sync' : 'Enable Encrypted Cloud Sync'}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isCloudSyncOn ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {isCloudSyncOn && (
                  <div className="pt-2 border-t border-canvas-border/50 flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span className="truncate">
                      {lastSyncTime
                        ? `Synced: ${new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : 'Ready to sync across devices'}
                    </span>
                    <button
                      type="button"
                      onClick={handleManualSync}
                      disabled={isSyncing}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink text-[11px] font-mono transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-brand-600' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ADD NEW KEY (Supports any number of keys) */}
          {/* ========================================================= */}
          {activeTab === 'add' && (
            <div className="space-y-4">
              {/* Provider Selector */}
              <div>
                <label className="block text-xs font-mono font-medium text-ink mb-1.5">
                  1. Choose AI Provider
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewKeyProvider('gemini')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      newKeyProvider === 'gemini'
                        ? 'border-brand-500 bg-brand-500/10 text-ink shadow-2xs font-semibold'
                        : 'border-canvas-border bg-canvas-surface/50 text-ink-muted hover:bg-canvas-hover'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-mono font-semibold">Gemini</span>
                    </div>
                    <div className="text-[10px] text-ink-muted line-clamp-1">Google AI Studio</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewKeyProvider('groq')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      newKeyProvider === 'groq'
                        ? 'border-brand-500 bg-brand-500/10 text-ink shadow-2xs font-semibold'
                        : 'border-canvas-border bg-canvas-surface/50 text-ink-muted hover:bg-canvas-hover'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-mono font-semibold">Groq</span>
                    </div>
                    <div className="text-[10px] text-ink-muted line-clamp-1">Llama 3.3 (Fastest)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewKeyProvider('openrouter')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      newKeyProvider === 'openrouter'
                        ? 'border-brand-500 bg-brand-500/10 text-ink shadow-2xs font-semibold'
                        : 'border-canvas-border bg-canvas-surface/50 text-ink-muted hover:bg-canvas-hover'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Globe className="w-3.5 h-3.5 text-purple-500" />
                      <span className="text-xs font-mono font-semibold">OpenRouter</span>
                    </div>
                    <div className="text-[10px] text-ink-muted line-clamp-1">Free Open Models</div>
                  </button>
                </div>
              </div>

              {/* Step instructions */}
              <div className="p-3.5 rounded-xl bg-canvas-surface/80 border border-canvas-border space-y-2 text-xs text-ink-muted">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-ink flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
                    How to get your free key:
                  </span>
                  <a
                    href={currentProviderConfig.docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-brand-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <span>{currentProviderConfig.name}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Sign in at <a href={currentProviderConfig.docUrl} target="_blank" rel="noreferrer" className="text-brand-600 font-semibold underline">{currentProviderConfig.docUrl}</a>, click Create API Key, and paste the key below. No credit card required.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleAddAndVerifyKey} className="space-y-3.5">
                <div>
                  <label htmlFor="new-key-label" className="block text-xs font-mono font-medium text-ink mb-1">
                    Key Label (Optional)
                  </label>
                  <input
                    id="new-key-label"
                    type="text"
                    value={newKeyLabel}
                    onChange={(e) => setNewKeyLabel(e.target.value)}
                    placeholder={`e.g. Primary ${currentProviderConfig.name}`}
                    className="w-full px-3.5 py-2 text-xs font-mono bg-canvas border border-canvas-border rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>

                <div>
                  <label htmlFor="new-key-input" className="block text-xs font-mono font-medium text-ink mb-1">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      id="new-key-input"
                      type={showKey ? 'text' : 'password'}
                      value={newKeyInput}
                      onChange={(e) => {
                        setNewKeyInput(e.target.value);
                        setErrorMsg(null);
                      }}
                      placeholder={currentProviderConfig.placeholder}
                      className="w-full px-3.5 py-2.5 pr-10 text-xs font-mono bg-canvas border border-canvas-border rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink cursor-pointer"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={isVerifying || !newKeyInput.trim()}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-mono font-semibold transition-all cursor-pointer shadow-md"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Key...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify & Add to Vault</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: ENGINE MODE (Toggle Built-in Engine Answer or Not) */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
                  Built-in Engine & Fallback Controls
                </h4>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  Choose whether Alterjot should use its local heuristic engine when offline or if an API key fails.
                </p>
              </div>

              <div className="space-y-3">
                {/* Mode 1: Auto-Fallback (Recommended) */}
                <div
                  onClick={() => handleSetEngineMode('auto')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    engineMode === 'auto'
                      ? 'border-brand-500 bg-brand-500/10 shadow-xs'
                      : 'border-canvas-border bg-canvas-surface/50 hover:bg-canvas-hover/50'
                  }`}
                >
                  <div className="mt-0.5">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        engineMode === 'auto'
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-zinc-400'
                      }`}
                    >
                      {engineMode === 'auto' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-ink">
                        Auto-Fallback (Recommended)
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        Smooth Flow
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      Uses your live AI model. If you go offline, or if your key hits a rate limit, Alterjot automatically uses the built-in narrative heuristics so your writing flow is never broken.
                    </p>
                  </div>
                </div>

                {/* Mode 2: Strict Live AI Only */}
                <div
                  onClick={() => handleSetEngineMode('strict')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    engineMode === 'strict'
                      ? 'border-brand-500 bg-brand-500/10 shadow-xs'
                      : 'border-canvas-border bg-canvas-surface/50 hover:bg-canvas-hover/50'
                  }`}
                >
                  <div className="mt-0.5">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        engineMode === 'strict'
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-zinc-400'
                      }`}
                    >
                      {engineMode === 'strict' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-ink">
                        Strict Live AI Only (Disable Built-in Fallback)
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                        100% Guaranteed LLM
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      <strong>Never uses the built-in heuristic engine.</strong> If your API key fails, expires, or runs out of quota, Alterjot will display the exact error instead of falling back to heuristic answers.
                    </p>
                  </div>
                </div>

                {/* Mode 3: Local Engine Only */}
                <div
                  onClick={() => handleSetEngineMode('local')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    engineMode === 'local'
                      ? 'border-brand-500 bg-brand-500/10 shadow-xs'
                      : 'border-canvas-border bg-canvas-surface/50 hover:bg-canvas-hover/50'
                  }`}
                >
                  <div className="mt-0.5">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        engineMode === 'local'
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-zinc-400'
                      }`}
                    >
                      {engineMode === 'local' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-ink">
                        Built-in Engine Only (Offline Mode)
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-zinc-500/15 text-ink-muted">
                        $0 / Zero API Calls
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      Completely disables all remote API calls. Uses Alterjot&apos;s instant offline literary rules and pacing metrics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-canvas-border bg-canvas-surface/60 flex items-center justify-between text-[11px] font-mono text-ink-muted flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Encrypted locally in browser</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-mono bg-canvas hover:bg-canvas-hover border border-canvas-border text-ink cursor-pointer font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
