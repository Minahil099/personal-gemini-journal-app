import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Lock, Sparkles, Heart, Brain, ChevronRight, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../firebase/config';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onOpenThreatModel: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onOpenThreatModel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      console.error('Sign-in error:', err);
      // Helpful fallback message if popup closed or blocked
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign-in window was closed. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setError('Popup was blocked by browser. Please enable popups for this site.');
      } else {
        setError(err?.message || 'Authentication failed. Please verify your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950">
      {/* Top Banner */}
      <div className="w-full border-b border-stone-800 bg-stone-950/60 py-3 px-4 sm:px-8 flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-stone-200">Hack2Skill Gen AI Academy Ideathon</span>
        </div>
        <button
          onClick={onOpenThreatModel}
          className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>View Security & Threat Model</span>
        </button>
      </div>

      {/* Main Sanctuary Hero Section */}
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 w-full flex flex-col items-center text-center">
        {/* Emblem */}
        <div className="mb-6 inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-transparent border border-amber-500/30 text-amber-400 shadow-xl shadow-amber-950/40">
          <BookOpen className="w-10 h-10" />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif-display tracking-tight text-white max-w-3xl leading-[1.15]">
          A Private Sanctuary for Mindful Self-Reflection
        </h1>

        <p className="mt-5 text-base sm:text-lg text-stone-300 max-w-2xl font-sans leading-relaxed">
          Experience confidential, multi-turn AI journaling powered by Gemini. Track personal growth, unearth emotional themes, and discover gentle reflection prompts with strict Firestore UID data isolation.
        </p>

        {/* Auth CTA Card */}
        <div className="mt-10 w-full max-w-md bg-stone-950/80 p-6 sm:p-8 rounded-2xl border border-stone-800 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-200 flex items-start gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 py-3.5 px-4 bg-white text-stone-900 font-semibold text-sm rounded-xl hover:bg-stone-100 active:scale-[0.98] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google Sign-In</span>
              </>
            )}
          </button>

          <p className="mt-4 text-[11px] text-stone-400 text-center leading-relaxed">
            By signing in, your journal entries are securely stored in your personal, UID-isolated Firestore collection.
          </p>
        </div>

        {/* Value Pillars */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left">
          <div className="p-5 rounded-2xl bg-stone-950/40 border border-stone-800/80">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-stone-100">Strict User Isolation</h3>
            <p className="mt-1.5 text-xs text-stone-400 leading-relaxed">
              Firestore security rules enforce that only your authenticated UID can ever read, write, or delete your personal journals.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-950/40 border border-stone-800/80">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-stone-100">Multi-Turn Gemini Chat</h3>
            <p className="mt-1.5 text-xs text-stone-400 leading-relaxed">
              Engage in compassionate, thoughtful dialogues with resilient server-side model fallback across Gemini 3.6, 3.1-Lite, and 3.7.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-950/40 border border-stone-800/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-stone-100">Mood & Reflection Insights</h3>
            <p className="mt-1.5 text-xs text-stone-400 leading-relaxed">
              Synthesize key emotional themes, gentle self-compassion summaries, and actionable journaling prompts for your journey.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="w-full border-t border-stone-800/80 py-4 px-4 sm:px-8 text-center text-xs text-stone-500">
        Personal Gemini Journal • Built for Hack2Skill Gen AI Academy Ideathon • Informational & Reflective Use Only
      </div>
    </div>
  );
};
