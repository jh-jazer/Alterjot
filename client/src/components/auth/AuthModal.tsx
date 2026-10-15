import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { GoogleSignInButton } from './GoogleSignInButton';
import { AlterjotLogo } from '../common/AlterjotLogo';
import { X, Lock, Mail, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const isAuthModalOpen = useWorkspaceStore((s) => s.isAuthModalOpen);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);
  const authModalMode = useWorkspaceStore((s) => s.authModalMode);
  const login = useWorkspaceStore((s) => s.login);

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(authModalMode);
  const [penName, setPenName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Sync mode if changed from store
  React.useEffect(() => {
    setMode(authModalMode);
    setResetSent(false);
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setResetSent(true);
      return;
    }
    const finalPenName = penName.trim() || (email ? email.split('@')[0] : 'Author');
    login(finalPenName, email.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-[420px] rounded-xl bg-white dark:bg-[#181615] border border-neutral-100 dark:border-neutral-800 shadow-2xl p-7 sm:p-9 text-neutral-900 dark:text-neutral-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute right-5 top-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Centered Logo */}
        <div className="flex justify-center mb-4">
          <AlterjotLogo size="md" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white text-center">
          {mode === 'signin' && 'Sign in with email'}
          {mode === 'signup' && 'Sign up with email'}
          {mode === 'forgot' && 'Reset your password'}
        </h2>

        {/* Subtitle Description */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2 mb-6 max-w-[300px] mx-auto leading-relaxed">
          {mode === 'signin' &&
            'Access your manuscript library, world codex, and writing challenges with AI-powered craft tools.'}
          {mode === 'signup' &&
            'Start your authorial journey to draft distraction-free, organize lore, and climb scribe ranks.'}
          {mode === 'forgot' &&
            'Enter your registered email address and we will dispatch password recovery instructions.'}
        </p>

        {/* Success message when password reset requested */}
        {mode === 'forgot' && resetSent ? (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-center space-y-2 mb-4 animate-fadeIn">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-200">
              Reset instructions sent to <span className="font-semibold">{email}</span>
            </p>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
              Please check your inbox or spam folder.
            </p>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setResetSent(false);
              }}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline pt-1 cursor-pointer block mx-auto"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Pen Name Field (Sign Up mode only) */}
            {mode === 'signup' && (
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={penName}
                  onChange={(e) => setPenName(e.target.value)}
                  placeholder="Pen Name"
                  className="w-full h-12 pl-11 pr-4 rounded-lg bg-[#f4f6fa] dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-sm font-sans placeholder:text-neutral-400 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400/20 transition-all"
                />
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full h-12 pl-11 pr-4 rounded-lg bg-[#f4f6fa] dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-sm font-sans placeholder:text-neutral-400 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400/20 transition-all"
              />
            </div>

            {/* Password Field (Sign In and Sign Up modes) */}
            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-12 pl-11 pr-11 rounded-lg bg-[#f4f6fa] dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-sm font-sans placeholder:text-neutral-400 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-0.5 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Forgot password? link in Sign In mode */}
            {mode === 'signin' && (
              <div className="text-right pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setResetSent(false);
                  }}
                  className="text-xs font-normal text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Primary Action Button: "Get Started" */}
            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-[#18181b] hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-semibold text-sm transition-all shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center mt-3"
            >
              <span>{mode === 'forgot' ? 'Send Reset Link' : 'Get Started'}</span>
            </button>
          </form>
        )}

        {/* Divider and Google Sign-in (for signin and signup modes) */}
        {mode !== 'forgot' && (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-neutral-200 dark:border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-xs text-neutral-400 dark:text-neutral-500">
                <span className="bg-white dark:bg-[#181615] px-3 font-normal">
                  {mode === 'signin' ? 'Or sign in with' : 'Or sign up with'}
                </span>
              </div>
            </div>

            {/* Google Pill Button */}
            <GoogleSignInButton onSuccess={() => setIsAuthModalOpen(false)} />
          </>
        )}

        {/* Bottom Mode Switcher */}
        <div className="mt-5 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {mode === 'signin' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-semibold text-neutral-900 dark:text-white hover:underline cursor-pointer ml-0.5"
              >
                Sign up
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-semibold text-neutral-900 dark:text-white hover:underline cursor-pointer ml-0.5"
              >
                Sign in
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <p>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setResetSent(false);
                }}
                className="font-semibold text-neutral-900 dark:text-white hover:underline cursor-pointer ml-0.5"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
