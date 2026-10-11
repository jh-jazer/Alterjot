import React, { useEffect, useRef, useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { Loader2, AlertCircle, KeyRound, ExternalLink } from 'lucide-react';

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
  const [showConfigGuide, setShowConfigGuide] = useState(false);

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
              text: 'continue_with',
              shape: 'pill',
              logo_alignment: 'left',
              width: 320,
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
      // Check every 250ms for script load (max 4 seconds)
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

  return (
    <div className="w-full flex flex-col items-center">
      {/* Loading state overlay */}
      {isLoading && (
        <div className="flex items-center gap-2 text-xs font-mono text-brand-600 my-2 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verifying Google Author Credentials...</span>
        </div>
      )}

      {/* Render Google Button container if client ID is set */}
      {clientId ? (
        <div className="flex justify-center w-full min-h-[44px]">
          <div ref={buttonRef} className="flex justify-center" />
        </div>
      ) : (
        /* Setup guidance button when VITE_GOOGLE_CLIENT_ID is not configured yet */
        <div className="w-full">
          <button
            type="button"
            onClick={() => setShowConfigGuide(!showConfigGuide)}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-full border border-canvas-border hover:border-brand-500/50 bg-canvas-surface hover:bg-canvas-hover text-ink text-xs font-sans font-medium transition-all shadow-xs group cursor-pointer"
          >
            {/* Authentic Google Multi-Color G Icon */}
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
            <span>Continue with Google</span>
            <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              Setup Key
            </span>
          </button>

          {showConfigGuide && (
            <div className="mt-3 p-3 rounded-xl bg-canvas-subtle border border-amber-500/30 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-start gap-2 text-amber-800 dark:text-amber-200 font-semibold font-sans">
                <KeyRound className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                <span>Google Client ID Required</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed">
                To connect real Google accounts, obtain an OAuth Client ID from Google Cloud Console and paste it into:
              </p>
              <div className="space-y-1 font-mono text-[10px] bg-canvas-card p-2 rounded border border-canvas-border text-ink-muted overflow-x-auto">
                <div>client/.env &rarr; <span className="text-brand-600">VITE_GOOGLE_CLIENT_ID=...</span></div>
                <div>server/.env &rarr; <span className="text-brand-600">GOOGLE_CLIENT_ID=...</span></div>
              </div>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-brand-600 hover:text-brand-700 font-medium hover:underline pt-1"
              >
                <span>Open Google Cloud Credentials Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-2 rounded-lg mt-2 w-full">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
