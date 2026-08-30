import React, { useState, useEffect, useCallback } from 'react';
import { subscribeToAuthState, signOut, fetchUserJournalEntries, saveUserJournalEntry, deleteUserJournalEntry } from './firebase/config';
import type { UserProfile, JournalEntry } from './types';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { JournalChatView } from './components/JournalChatView';
import { JournalDetailModal } from './components/JournalDetailModal';
import { ThreatModelModal } from './components/ThreatModelModal';
import { ToastContainer, type ToastMessage } from './components/Toast';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'chat'>('dashboard');
  
  // Journal entries state
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState<boolean>(false);
  
  // Active chat context
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [activePromptTheme, setActivePromptTheme] = useState<string | undefined>(undefined);
  
  // Modals & UI state
  const [selectedModalEntry, setSelectedModalEntry] = useState<JournalEntry | null>(null);
  const [isThreatModelOpen, setIsThreatModelOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast notification helper
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // Load user journal entries whenever authenticated user changes
  const loadUserEntries = useCallback(async (userId: string) => {
    setIsLoadingEntries(true);
    try {
      const userEntries = await fetchUserJournalEntries(userId);
      setEntries(userEntries);
    } catch (err: any) {
      console.error('Failed to load user journals:', err);
      showToast('Could not load journals from Firestore.', 'error');
    } finally {
      setIsLoadingEntries(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (user?.uid) {
      loadUserEntries(user.uid);
    } else {
      setEntries([]);
      setCurrentView('dashboard');
    }
  }, [user?.uid, loadUserEntries]);

  // Handle Save Journal Entry to Firestore
  const handleSaveEntry = async (entryData: Omit<JournalEntry, 'userId'> & { id?: string }): Promise<string> => {
    if (!user?.uid) throw new Error('User not authenticated');
    
    const savedId = await saveUserJournalEntry(user.uid, entryData);
    // Reload entries to keep dashboard synced
    await loadUserEntries(user.uid);
    return savedId;
  };

  // Handle Delete Journal Entry from Firestore
  const handleDeleteEntry = async (entryId: string): Promise<void> => {
    if (!user?.uid) return;
    try {
      await deleteUserJournalEntry(user.uid, entryId);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
      if (selectedModalEntry?.id === entryId) {
        setSelectedModalEntry(null);
      }
      showToast('Journal reflection deleted securely.', 'info');
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast('Failed to delete entry from Firestore.', 'error');
    }
  };

  // Start a new reflection
  const handleStartNewReflection = (promptTheme?: string) => {
    setActiveEntry(null);
    setActivePromptTheme(promptTheme || 'Daily Reflection');
    setCurrentView('chat');
  };

  // Resume or open past reflection in chat
  const handleResumeReflectionInChat = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setActivePromptTheme(entry.promptTheme || 'Journal Reflection');
    setCurrentView('chat');
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setCurrentView('dashboard');
      showToast('Signed out securely.', 'info');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="h-full min-h-screen bg-stone-900 flex flex-col items-center justify-center text-stone-100 space-y-4">
        <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-stone-300 font-serif-display">
          Securing Personal Gemini Journal...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginView
          onLoginSuccess={() => showToast('Authenticated with Google successfully!', 'success')}
          onOpenThreatModel={() => setIsThreatModelOpen(true)}
        />
        <ThreatModelModal
          isOpen={isThreatModelOpen}
          onClose={() => setIsThreatModelOpen(false)}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Navbar
        user={user}
        onSignOut={handleSignOut}
        onOpenThreatModel={() => setIsThreatModelOpen(true)}
        onNewEntry={() => handleStartNewReflection()}
        currentView={currentView}
        onNavigateDashboard={() => setCurrentView('dashboard')}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'dashboard' ? (
          <DashboardView
            user={user}
            entries={entries}
            isLoading={isLoadingEntries}
            onNewEntry={handleStartNewReflection}
            onSelectEntry={(entry) => setSelectedModalEntry(entry)}
            onDeleteEntry={handleDeleteEntry}
            onOpenThreatModel={() => setIsThreatModelOpen(true)}
          />
        ) : (
          <JournalChatView
            user={user}
            initialEntry={activeEntry}
            initialPromptTheme={activePromptTheme}
            onSaveEntry={handleSaveEntry}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Detail & History Modal */}
      <JournalDetailModal
        entry={selectedModalEntry}
        isOpen={Boolean(selectedModalEntry)}
        onClose={() => setSelectedModalEntry(null)}
        onDelete={handleDeleteEntry}
        onResumeChat={handleResumeReflectionInChat}
      />

      {/* Threat Modeling & Security Modal */}
      <ThreatModelModal
        isOpen={isThreatModelOpen}
        onClose={() => setIsThreatModelOpen(false)}
      />

      {/* Reactive Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
