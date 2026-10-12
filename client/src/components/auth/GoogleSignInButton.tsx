import React, { useEffect, useRef, useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { Loader2, AlertCircle } from 'lucide-react';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSuccess, onError }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const theme = useWorkspaceStore((s) => s.theme);
  const loginWithGoogleCredential = useWorkspaceStore((s) => s.loginWithGoogleCredential);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Vite environment variable for Google Client ID
  const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID?.trim() || '';

  const handleCredentialResponse = async (response: any) => {
    if (!response?.credential) {
      setErrorMessage('No credential returned by Google.');
      if (onError) onError('No credential returned by Google.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const ok = await loginWithGoogleCredential(response.credential);
      if (ok) {
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage('Authentication failed. Please check backend connection.');
        if (onError) onError('Authentication failed.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to authenticate with Google.');
      if (onError) onError(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!clientId) return;

    let checkInterval: any = null;

    const initGoogle = () => {
      if (typeof window === 'undefined') return;
      const google = (window as any).google;

      if (google?.accounts?.id) {
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (buttonRef.current) {
            buttonRef.current.innerHTML = '';
            google.accounts.id.renderButton(buttonRef.current, {
              type: 'standard',
              theme: theme === 'dark' ? 'filled_black' : 'outline',
              size: 'large',
              shape: 'pill',
              width: 360,
            });
          }
        } catch (e: any) {
          console.warn('[GoogleSignIn] Initialization warning:', e);
        }
      }
    };

    if ((window as any).google?.accounts?.id) {
      initGoogle();
    } else {
      let attempts = 0;
      checkInterval = setInterval(() => {
        attempts++;
        if ((window as any).google?.accounts?.id) {
          clearInterval(checkInterval);
          initGoogle();
        } else if (attempts > 16) {
          clearInterval(checkInterval);
        }
      }, 250);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [clientId, theme]);

  const handleCustomClick = () => {
    const google = (window as any)?.google;
    if (google?.accounts?.id && clientId) {
      try {
        google.accounts.id.prompt();
      } catch (err) {
        console.warn('Google One Tap prompt failed:', err);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {isLoading && (
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-2 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Signing in with Google...</span>
        </div>
      )}

      {/* Button styled exactly like the reference screenshot */}
      <div className="relative w-full">
        <button
          type="button"
          onClick={handleCustomClick}
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 text-sm font-medium text-neutral-800 dark:text-neutral-100 transition-all shadow-xs active:scale-[0.99] cursor-pointer"
        >
          {/* Authentic Google Multi-Color G Icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google</span>
        </button>

        {/* Transparent Google GSI overlay for genuine iframe OAuth trigger */}
        {clientId && (
          <div
            ref={buttonRef}
            className="absolute inset-0 opacity-0 overflow-hidden cursor-pointer flex items-center justify-center z-10"
            style={{ transform: 'scale(1.15)' }}
          />
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-2 rounded-lg mt-2 w-full">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
