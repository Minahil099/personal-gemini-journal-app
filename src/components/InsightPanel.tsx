import React from 'react';
import { Sparkles, Tag, ArrowRight, Heart, Info, Check, Copy } from 'lucide-react';
import type { ReflectionInsight } from '../types';

interface InsightPanelProps {
  insights: ReflectionInsight;
  onSelectPrompt?: (promptText: string) => void;
  isLoading?: boolean;
}

export const InsightPanel: React.FC<InsightPanelProps> = ({
  insights,
  onSelectPrompt,
  isLoading
}) => {
  const [copiedPromptIdx, setCopiedPromptIdx] = React.useState<number | null>(null);

  const getMoodColor = (mood: string) => {
    const lower = mood.toLowerCase();
    if (lower.includes('grateful') || lower.includes('joy') || lower.includes('peaceful') || lower.includes('calm')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    if (lower.includes('contemplative') || lower.includes('focused')) {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (lower.includes('vulnerable') || lower.includes('healing')) {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    }
    if (lower.includes('restless') || lower.includes('anxious') || lower.includes('overwhelmed')) {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    return 'bg-stone-100 text-stone-800 border-stone-300';
  };

  const handleCopyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptIdx(idx);
    setTimeout(() => setCopiedPromptIdx(null), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-stone-50 to-orange-50/40 rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-200/60">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-700 rounded-xl border border-amber-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold font-serif-display text-stone-900">
              Mood & Reflection Insights
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              AI-synthesized emotional themes and supportive forward prompts
            </p>
          </div>
        </div>

        {/* Mood Tag */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getMoodColor(
            insights.moodTag
          )}`}
        >
          {insights.moodTag}
        </span>
      </div>

      {/* Summary Narrative */}
      <div className="mt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Gentle Reflection Summary</span>
        </h4>
        <p className="text-sm text-stone-800 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-stone-200/60">
          {insights.summary}
        </p>
      </div>

      {/* Themes */}
      {insights.keyThemes && insights.keyThemes.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>Key Themes & Focal Points</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {insights.keyThemes.map((theme, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-white text-stone-700 text-xs font-medium rounded-lg border border-stone-200 shadow-2xs"
              >
                #{theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Next Steps / Prompts */}
      {insights.actionablePrompts && insights.actionablePrompts.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Suggested Next-Step Reflection Prompts
          </h4>
          <div className="space-y-2">
            {insights.actionablePrompts.map((prompt, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between p-3 bg-white hover:bg-amber-50/50 rounded-xl border border-stone-200/80 hover:border-amber-300 transition-all text-left"
              >
                <span className="text-xs text-stone-800 font-medium pr-2 leading-relaxed">
                  {prompt}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleCopyPrompt(prompt, idx)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Copy prompt"
                  >
                    {copiedPromptIdx === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {onSelectPrompt && (
                    <button
                      onClick={() => onSelectPrompt(prompt)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                      title="Continue chat with this prompt"
                    >
                      <span>Ask</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-5 pt-3 border-t border-amber-200/40 flex items-start gap-2 text-[11px] text-stone-500">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
        <span>
          <strong>Ethical Note:</strong> These insights are created for personal self-reflection and mindful awareness. They are informational and supportive, never medical or psychiatric diagnoses.
        </span>
      </div>
    </div>
  );
};
