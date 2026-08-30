import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Sparkles, 
  MessageSquare, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Tag, 
  ArrowRight,
  AlertTriangle 
} from 'lucide-react';
import type { JournalEntry } from '../types';
import { InsightPanel } from './InsightPanel';

interface JournalDetailModalProps {
  entry: JournalEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (entryId: string) => Promise<void>;
  onResumeChat?: (entry: JournalEntry) => void;
}

export const JournalDetailModal: React.FC<JournalDetailModalProps> = ({
  entry,
  isOpen,
  onClose,
  onDelete,
  onResumeChat
}) => {
  const [activeTab, setActiveTab] = useState<'transcript' | 'insights'>('transcript');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !entry) return null;

  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleCopyTranscript = () => {
    let textToCopy = `# ${entry.title}\nDate: ${formattedDate}\nMood: ${entry.moodTag}\n\n`;
    if (entry.messages && entry.messages.length > 0) {
      textToCopy += entry.messages
        .map((m) => `[${m.sender === 'user' ? 'Me' : 'Gemini'}] (${new Date(m.timestamp).toLocaleTimeString()}):\n${m.text}\n`)
        .join('\n');
    } else {
      textToCopy += entry.content;
    }

    if (entry.insights) {
      textToCopy += `\n\n--- MOOD & REFLECTION INSIGHTS ---\nSummary: ${entry.insights.summary}\nThemes: ${entry.insights.keyThemes.join(', ')}\nPrompts:\n${entry.insights.actionablePrompts.map(p => `- ${p}`).join('\n')}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    let md = `---
title: "${entry.title}"
date: "${entry.createdAt}"
mood: "${entry.moodTag}"
themes: [${entry.keyThemes.map(t => `"${t}"`).join(', ')}]
---

# ${entry.title}
*Recorded on ${formattedDate}*

## Reflection Log

`;
    if (entry.messages && entry.messages.length > 0) {
      entry.messages.forEach((m) => {
        md += `### ${m.sender === 'user' ? '👤 You' : '✨ Gemini Companion'}\n\n${m.text}\n\n`;
      });
    } else {
      md += `${entry.content}\n\n`;
    }

    if (entry.insights) {
      md += `## 🌟 Mood & Reflection Insights\n\n`;
      md += `**Primary Emotion:** ${entry.insights.moodTag}\n\n`;
      md += `**Summary:** ${entry.insights.summary}\n\n`;
      md += `**Key Themes:** ${entry.insights.keyThemes.join(', ')}\n\n`;
      md += `**Next-Step Reflection Prompts:**\n`;
      entry.insights.actionablePrompts.forEach((p, i) => {
        md += `${i + 1}. ${p}\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${entry.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date(entry.createdAt).toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(entry, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal_${entry.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(entry.id);
      setShowConfirmDelete(false);
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {entry.moodTag}
              </span>
              {entry.promptTheme && (
                <span className="text-xs text-stone-400 font-medium">
                  • {entry.promptTheme}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold font-serif-display truncate text-white">
              {entry.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{entry.messages?.length || 1} turns</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex space-x-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('transcript')}
              className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'transcript'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Conversation & Entry ({entry.messages?.length || 1})</span>
            </button>

            {entry.insights && (
              <button
                onClick={() => setActiveTab('insights')}
                className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'insights'
                    ? 'border-amber-600 text-amber-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Mood & Insights</span>
              </button>
            )}
          </div>

          {/* Quick Action Export Buttons */}
          <div className="flex items-center space-x-1.5 py-2">
            <button
              onClick={handleCopyTranscript}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
              title="Download as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export .MD</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
              title="Download as JSON"
            >
              <span className="font-mono-code text-[11px] font-bold">JSON</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'transcript' ? (
            <div className="space-y-4">
              {entry.messages && entry.messages.length > 0 ? (
                entry.messages.map((msg, index) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                          ✨
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-stone-900 text-white rounded-br-xs'
                            : 'bg-stone-100 text-stone-800 border border-stone-200/80 rounded-bl-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5 opacity-60 text-[10px]">
                          <span className="font-semibold">{isUser ? 'You' : 'Gemini Companion'}</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>

                      {isUser && (
                        <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-200 flex items-center justify-center shrink-0 text-xs font-semibold">
                          You
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-stone-800 text-sm whitespace-pre-wrap leading-relaxed">
                  {entry.content}
                </div>
              )}
            </div>
          ) : (
            <div>
              {entry.insights ? (
                <InsightPanel insights={entry.insights} />
              ) : (
                <div className="text-center py-12 text-stone-400 text-sm">
                  No insights generated for this entry.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div>
            {showConfirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-700 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Confirm deletion?
                </span>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-2.5 py-1 text-xs font-medium text-stone-600 hover:bg-stone-200 rounded-md"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Entry</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {onResumeChat && (
              <button
                onClick={() => {
                  onResumeChat(entry);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
              >
                <span>Continue Reflecting</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
