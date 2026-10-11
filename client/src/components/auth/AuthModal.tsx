import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { GoogleSignInButton } from './GoogleSignInButton';
import { X, Feather, Lock, Mail, User, Sparkles, ArrowRight, BookOpen } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const isAuthModalOpen = useWorkspaceStore((s) => s.isAuthModalOpen);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);
  const authModalMode = useWorkspaceStore((s) => s.authModalMode);
  const login = useWorkspaceStore((s) => s.login);

  const [mode, setMode] = useState<'signin' | 'signup'>(authModalMode);
  const [penName, setPenName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sync mode if changed from store
  React.useEffect(() => {
    setMode(authModalMode);
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPenName = penName.trim() || (email ? email.split('@')[0] : 'Ernest Quill');
    login(finalPenName, email.trim());
  };

  const handleInstantDemoLogin = () => {
    login('Ernest Quill', 'ernest.quill@alterjot.com');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-canvas-card border border-canvas-border shadow-parchment-lg p-5 sm:p-7 text-ink relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-hover transition-colors"
          title="Close"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center pb-5 border-b border-canvas-border">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-brand-600/30">
            <Feather className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-ink">
            {mode === 'signin' ? 'Welcome Back, Author' : 'Join the Alterjot Atelier'}
          </h2>
          <p className="text-xs text-ink-muted font-sans mt-1 max-w-xs mx-auto leading-relaxed">
            {mode === 'signin'
              ? 'Sign in to access your manuscript library, writing challenges, and world codex.'
              : 'Create your author dossier to draft distraction-free, organize lore, and climb scribe ranks.'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-canvas-surface border border-canvas-border text-xs font-mono my-4">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-1.5 rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-canvas-card text-brand-700 font-bold shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-1.5 rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-canvas-card text-brand-700 font-bold shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Create Scribe Account
          </button>
        </div>

        {/* Google OAuth Sign In */}
        <div className="mb-4">
          <GoogleSignInButton onSuccess={() => setIsAuthModalOpen(false)} />
        </div>

        {/* Divider */}
        <div className="relative my-3.5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-canvas-border" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest text-ink-faint">
            <span className="bg-canvas-card px-2">or continue with pen name</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold mb-1">
                Author Pen Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-ink-faint absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={penName}
                  onChange={(e) => setPenName(e.target.value)}
                  placeholder="e.g. Mary Shelley, Arthur Conan"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-canvas-surface border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 shadow-xs transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-faint absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scribe@alterjot.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-canvas-surface border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 shadow-xs transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-faint absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-canvas-surface border border-canvas-border text-ink placeholder-ink-faint focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 shadow-xs transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-serif font-semibold text-sm transition-all shadow-md shadow-brand-600/30 hover:scale-[1.01] active:scale-[0.99] mt-2 cursor-pointer"
          >
            <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Scribe Dossier'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-canvas-border" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest text-ink-faint">
            <span className="bg-canvas-card px-2">or quick demo access</span>
          </div>
        </div>

        {/* Instant Demo Login Button */}
        <button
          type="button"
          onClick={handleInstantDemoLogin}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-canvas-surface hover:bg-canvas-hover border border-canvas-border text-ink text-xs font-mono transition-colors group cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
          <span>One-Click Guest Scribe (Instant Entry)</span>
        </button>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-canvas-border text-center">
          <p className="text-[11px] text-ink-muted">
            <BookOpen className="w-3.5 h-3.5 inline mr-1 text-brand-600 opacity-80" />
            Distraction-free manuscript drafting with automated local saving.
          </p>
        </div>
      </div>
    </div>
  );
};
