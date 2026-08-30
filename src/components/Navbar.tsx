import React from 'react';
import { BookOpen, ShieldCheck, Sparkles, LogOut, PlusCircle, User as UserIcon } from 'lucide-react';
import type { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  onSignOut: () => void;
  onOpenThreatModel: () => void;
  onNewEntry: () => void;
  currentView: 'dashboard' | 'chat';
  onNavigateDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onSignOut,
  onOpenThreatModel,
  onNewEntry,
  currentView,
  onNavigateDashboard
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateDashboard}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-900/20 text-stone-950 font-bold">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-display text-lg font-bold tracking-tight text-white">
                  Personal Gemini Journal
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Hack2Skill Ideathon
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-sans hidden md:block">
                Zero-Leakage Firestore Isolation • Resilient AI Companion
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Threat Model Trigger */}
            <button
              onClick={onOpenThreatModel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/40 rounded-lg transition-colors"
              title="View Threat Model & Security Compliance"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Threat Model</span>
            </button>

            {/* View Switching */}
            {currentView === 'chat' ? (
              <button
                onClick={onNavigateDashboard}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors border border-stone-700"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={onNewEntry}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Reflection</span>
              </button>
            )}

            {/* User Profile & Sign Out */}
            <div className="flex items-center pl-2 border-l border-stone-800 space-x-2">
              <div className="flex items-center space-x-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-stone-700 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 text-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-medium text-stone-200 truncate max-w-[130px]">
                    {user.displayName || user.email?.split('@')[0] || 'Journaler'}
                  </div>
                  <div className="text-[10px] text-stone-500 flex items-center gap-1 font-mono-code truncate max-w-[130px]">
                    UID: {user.uid.substring(0, 6)}...
                  </div>
                </div>
              </div>

              <button
                onClick={onSignOut}
                className="p-1.5 text-stone-400 hover:text-rose-300 hover:bg-stone-800/80 rounded-lg transition-colors"
                title="Sign out securely"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
