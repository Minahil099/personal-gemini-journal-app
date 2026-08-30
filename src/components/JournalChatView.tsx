import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Save, 
  ArrowLeft, 
  RotateCcw, 
  Tag, 
  Brain, 
  Heart, 
  Check, 
  Clock, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage, ReflectionInsight, JournalEntry, UserProfile, JournalMood } from '../types';
import { InsightPanel } from './InsightPanel';

interface JournalChatViewProps {
  user: UserProfile;
  initialEntry?: JournalEntry | null;
  initialPromptTheme?: string;
  onSaveEntry: (entryData: Omit<JournalEntry, 'userId'> & { id?: string }) => Promise<string>;
  onBackToDashboard: () => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const GUIDED_STARTERS = [
  {
    theme: 'Daily Check-In',
    prompt: 'How has today felt overall? What moments or interactions stood out to you?',
    opening: "Today had a mix of emotions. I wanted to reflect on..."
  },
  {
    theme: 'Gratitude & Micro-Joys',
    prompt: 'What are 3 small things that brought you peace, comfort, or a smile recently?',
    opening: "I want to celebrate 3 things I'm genuinely grateful for right now: 1. "
  },
  {
    theme: 'Working Through Friction',
    prompt: 'What is currently weighing on your mind or causing friction, and what is within your control?',
    opening: "I've been feeling tension around..."
  },
  {
    theme: 'Future Intentions',
    prompt: 'What kind of energy or mindset would you like to cultivate for the days ahead?',
    opening: "My intention moving forward is to focus on..."
  }
];

export const JournalChatView: React.FC<JournalChatViewProps> = ({
  user,
  initialEntry,
  initialPromptTheme,
  onSaveEntry,
  onBackToDashboard,
  onShowToast
}) => {
  const [entryId, setEntryId] = useState<string | undefined>(initialEntry?.id);
  const [title, setTitle] = useState<string>(
    initialEntry?.title || (initialPromptTheme ? `${initialPromptTheme} Reflection` : `Journal • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`)
  );
  const [promptTheme, setPromptTheme] = useState<string>(initialEntry?.promptTheme || initialPromptTheme || 'Daily Reflection');
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialEntry?.messages || [
      {
        id: 'init-1',
        sender: 'gemini',
        text: initialPromptTheme 
          ? `Welcome to your **${initialPromptTheme}** reflection space. I'm here to listen, hold non-judgmental space, and help you gently untangle your thoughts. Whenever you're ready, share whatever is on your mind.`
          : `Hello, ${user.displayName?.split(' ')[0] || 'friend'}. This is your private, secure reflection sanctuary. How are you arriving in this moment, and what would you like to explore today?`,
        timestamp: new Date().toISOString()
      }
    ]
  );
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [insights, setInsights] = useState<ReflectionInsight | undefined>(initialEntry?.insights);
  const [moodTag, setMoodTag] = useState<JournalMood | string>(initialEntry?.moodTag || 'Contemplative');
  const [keyThemes, setKeyThemes] = useState<string[]>(initialEntry?.keyThemes || ['Self-Reflection']);
  const [showInsightsDrawer, setShowInsightsDrawer] = useState(Boolean(initialEntry?.insights));

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Handle sending a chat message to Gemini server-side endpoint
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsSending(true);
    setHasUnsavedChanges(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          promptTheme,
          userMoodContext: moodTag
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to receive AI reflection.');
      }

      const data = await response.json();
      const geminiMessage: ChatMessage = {
        id: `gemini-${Date.now()}`,
        sender: 'gemini',
        text: data.reply,
        timestamp: data.timestamp || new Date().toISOString()
      };

      setMessages((prev) => [...prev, geminiMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      onShowToast(err.message || 'Unable to connect to Gemini companion.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  // Generate Mood & Reflection Insights
  const handleGenerateInsights = async () => {
    if (messages.length <= 1) {
      onShowToast('Share a few more thoughts in the journal first to generate insights.', 'info');
      return;
    }

    setIsGeneratingInsights(true);
    try {
      const response = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          journalContent: messages.filter(m => m.sender === 'user').map(m => m.text).join('\n\n')
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to synthesize insights.');
      }

      const data = await response.json();
      const newInsights: ReflectionInsight = data.insights;
      setInsights(newInsights);
      setMoodTag(newInsights.moodTag);
      setKeyThemes(newInsights.keyThemes || []);
      setShowInsightsDrawer(true);
      setHasUnsavedChanges(true);
      onShowToast('Mood & Reflection Insights synthesized!', 'success');
    } catch (err: any) {
      console.error('Insight generation error:', err);
      onShowToast(err.message || 'Failed to generate insights.', 'error');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Save entry to Firestore
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const totalWords = messages.reduce((acc, m) => acc + m.text.split(/\s+/).filter(Boolean).length, 0);

      const savedId = await onSaveEntry({
        id: entryId,
        title: title.trim() || 'Personal Journal Entry',
        content: messages.filter(m => m.sender === 'user').map(m => m.text).join('\n\n'),
        mode: 'chat',
        promptTheme,
        moodTag,
        keyThemes,
        insights,
        messages,
        createdAt: initialEntry?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: totalWords
      });

      setEntryId(savedId);
      setHasUnsavedChanges(false);
      onShowToast('Journal entry securely saved to Firestore!', 'success');
    } catch (err: any) {
      console.error('Save error:', err);
      onShowToast('Failed to save to Firestore. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard shortcut: Enter to send, Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <button
            onClick={onBackToDashboard}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors shrink-0"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Journal Entry Title..."
              className="w-full font-serif-display font-bold text-base sm:text-lg text-stone-900 focus:outline-none focus:border-amber-500 border-b border-transparent hover:border-stone-300 transition-colors py-0.5"
            />
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
              <span className="font-medium">{promptTheme}</span>
              <span>•</span>
              <span className="font-semibold text-amber-800">{moodTag}</span>
              {hasUnsavedChanges && (
                <>
                  <span>•</span>
                  <span className="text-amber-600 font-medium animate-pulse">Unsaved changes</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0 justify-end">
          <button
            onClick={handleGenerateInsights}
            disabled={isGeneratingInsights || messages.length <= 1}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              insights
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Synthesize Mood & Themes"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingInsights ? 'animate-spin text-amber-500' : 'text-amber-600'}`} />
            <span className="hidden sm:inline">
              {isGeneratingInsights ? 'Analyzing...' : insights ? 'Update Insights' : 'Generate Insights'}
            </span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save to Journal'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Chat & Insights split layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chat Stream Column */}
        <div className={`flex flex-col bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden ${
          showInsightsDrawer && insights ? 'lg:col-span-7' : 'lg:col-span-12'
        }`}>
          {/* Conversation messages */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                      ✨
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-stone-900 text-white rounded-br-xs'
                        : 'bg-stone-50 text-stone-800 border border-stone-200/80 rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 opacity-60 text-[10px]">
                      <span className="font-semibold">{isUser ? 'You' : 'Gemini Companion'}</span>
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="prose prose-sm max-w-none text-inherit prose-p:my-1 prose-headings:my-1.5 prose-strong:text-inherit">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-200 flex items-center justify-center shrink-0 text-xs font-semibold">
                      You
                    </div>
                  )}
                </div>
              );
            })}

            {isSending && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                  ✨
                </div>
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl rounded-bl-xs p-3.5 flex items-center space-x-2 text-stone-500 text-xs">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                  </div>
                  <span className="font-medium text-[11px]">Gemini is thoughtfully reflecting...</span>
                </div>
              </div>
            )}

            {/* Quick Starters if conversation is minimal */}
            {messages.length <= 2 && !isSending && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <div className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-700" />
                  <span>Choose a reflection springboard:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GUIDED_STARTERS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputText(s.opening);
                        textareaRef.current?.focus();
                      }}
                      className="text-left p-2.5 bg-white hover:bg-amber-100/50 rounded-lg border border-amber-200/80 transition-colors text-xs"
                    >
                      <span className="font-semibold text-stone-800 block">{s.theme}</span>
                      <span className="text-[11px] text-stone-500 line-clamp-1">{s.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick reflection actions */}
          <div className="px-4 py-2 bg-stone-50/80 border-t border-stone-100 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-stone-400 font-medium shrink-0">Prompts:</span>
            <button
              onClick={() => handleSendMessage("Could you give me an uplifting, mindful perspective on what I've shared?")}
              className="px-2.5 py-1 bg-white hover:bg-stone-200/70 text-stone-700 rounded-lg border border-stone-200 shrink-0 transition-colors"
            >
              🌱 Uplifting perspective
            </button>
            <button
              onClick={() => handleSendMessage("What is one gentle question that can help me unpack this deeper?")}
              className="px-2.5 py-1 bg-white hover:bg-stone-200/70 text-stone-700 rounded-lg border border-stone-200 shrink-0 transition-colors"
            >
              🔍 Deeper inquiry
            </button>
            <button
              onClick={() => handleSendMessage("Help me identify the silver lining and actionable step forward.")}
              className="px-2.5 py-1 bg-white hover:bg-stone-200/70 text-stone-700 rounded-lg border border-stone-200 shrink-0 transition-colors"
            >
              ✨ Next mindful step
            </button>
          </div>

          {/* Input Box Area */}
          <div className="p-3 sm:p-4 border-t border-stone-200 bg-white">
            <div className="relative flex items-end gap-2 bg-stone-50 border border-stone-200 rounded-2xl p-2 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your honest reflection (Shift+Enter for newline)..."
                rows={2}
                className="w-full resize-none bg-transparent text-xs sm:text-sm text-stone-900 focus:outline-none p-1.5 max-h-32"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isSending}
                className="p-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer shadow-xs"
                title="Send reflection"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-400 px-1">
              <span>Press <kbd className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px]">Enter</kbd> to send</span>
              <span>{inputText.length} / 4000 characters</span>
            </div>
          </div>
        </div>

        {/* Mood & Reflection Insights Column */}
        {showInsightsDrawer && insights && (
          <div className="lg:col-span-5 flex flex-col h-full overflow-y-auto">
            <InsightPanel
              insights={insights}
              onSelectPrompt={(promptText) => {
                setInputText(promptText);
                textareaRef.current?.focus();
              }}
              isLoading={isGeneratingInsights}
            />
          </div>
        )}
      </div>
    </div>
  );
};
