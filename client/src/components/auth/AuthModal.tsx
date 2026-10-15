import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { GoogleSignInButton } from './GoogleSignInButton';
import { AlterjotLogo } from '../common/AlterjotLogo';
import { X, ShieldCheck, Cloud, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const isAuthModalOpen = useWorkspaceStore((s) => s.isAuthModalOpen);
  const setIsAuthModalOpen = useWorkspaceStore((s) => s.setIsAuthModalOpen);

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-[420px] rounded-2xl bg-white dark:bg-[#181615] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-7 sm:p-9 text-neutral-900 dark:text-neutral-100">
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
        <div className="flex justify-center mb-5">
          <AlterjotLogo size="lg" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-serif font-bold tracking-tight text-neutral-900 dark:text-white text-center">
          Author Sign In
        </h2>

        {/* Subtitle Description */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2 mb-6 max-w-[320px] mx-auto leading-relaxed font-sans">
          Sign in with your Google account to access and synchronize your manuscripts, pen name, and encrypted AI keys seamlessly across all your devices.
        </p>

        {/* Google Authentication Pill */}
        <div className="flex justify-center my-4">
          <GoogleSignInButton onSuccess={() => setIsAuthModalOpen(false)} />
        </div>

        {/* Security & Sync Guarantees */}
        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-300">
            <Cloud className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />
            <span>Real-time cross-device sync on MongoDB Atlas</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>Zero-Knowledge AES-256 encrypted API key vault</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-300">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>Unified Pen Name and collaborative story craft</span>
          </div>
        </div>

        {/* Notice: No Guest Divergence */}
        <div className="mt-5 text-center">
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-normal">
            Guest mode is disabled to protect against data divergence and ensure all drafts are backed up in the cloud.
          </p>
        </div>
      </div>
    </div>
  );
};
