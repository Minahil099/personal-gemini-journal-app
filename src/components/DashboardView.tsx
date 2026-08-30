import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Calendar, 
  MessageSquare, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  Tag, 
  Heart, 
  BookOpen, 
  Clock, 
  Compass,
  FileText
} from 'lucide-react';
import type { JournalEntry, UserProfile, JournalMood } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  entries: JournalEntry[];
  isLoading: boolean;
  onNewEntry: (promptTheme?: string) => void;
  onSelectEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entryId: string) => Promise<void>;
  onOpenThreatModel: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  entries,
  isLoading,
  onNewEntry,
  onSelectEntry,
  onDeleteEntry,
  onOpenThreatModel
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Dynamic greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    const totalEntries = entries.length;
    const totalMessages = entries.reduce((acc, curr) => acc + (curr.messages?.length || 1), 0);
    const totalWords = entries.reduce((acc, curr) => {
      if (curr.wordCount) return acc + curr.wordCount;
      const text = curr.messages?.map(m => m.text).join(' ') || curr.content || '';
      return acc + text.split(/\s+/).filter(Boolean).length;
    }, 0);

    // Mood counts
    const moodCounts: Record<string, number> = {};
    const themeCounts: Record<string, number> = {};

    entries.forEach((e) => {
      if (e.moodTag) {
        moodCounts[e.moodTag] = (moodCounts[e.moodTag] || 0) + 1;
      }
      if (Array.isArray(e.keyThemes)) {
        e.keyThemes.forEach((t) => {
          themeCounts[t] = (themeCounts[t] || 0) + 1;
        });
      }
    });

    let dominantMood = 'Contemplative';
    let maxMoodCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxMoodCount) {
        maxMoodCount = count;
        dominantMood = mood;
      }
    });

    const topThemes = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme);

    return {
      totalEntries,
      totalMessages,
      totalWords,
      dominantMood: totalEntries > 0 ? dominantMood : 'Grounded & Ready',
      topThemes
    };
  }, [entries]);

  // Unique mood options for filter
  const moodOptions = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      if (e.moodTag) set.add(e.moodTag);
    });
    return Array.from(set);
  }, [entries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        searchTerm === '' ||
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.messages?.some((m) => m.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
        entry.keyThemes?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesMood = selectedMood === 'all' || entry.moodTag === selectedMood;
      const matchesTheme = selectedTheme === 'all' || entry.keyThemes?.includes(selectedTheme);

      return matchesSearch && matchesMood && matchesTheme;
    });
  }, [entries, searchTerm, selectedMood, selectedTheme]);

  const getMoodBadgeColor = (mood: string) => {
    const lower = mood.toLowerCase();
    if (lower.includes('grateful') || lower.includes('joy') || lower.includes('peaceful') || lower.includes('calm')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (lower.includes('contemplative') || lower.includes('focused')) {
      return 'bg-blue-50 text-blue-800 border-blue-200';
    }
    if (lower.includes('vulnerable') || lower.includes('healing')) {
      return 'bg-purple-50 text-purple-800 border-purple-200';
    }
    if (lower.includes('restless') || lower.includes('anxious') || lower.includes('overwhelmed')) {
      return 'bg-amber-50 text-amber-900 border-amber-200';
    }
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  const guidedThemes = [
    { title: 'Daily Check-In', desc: 'Unpack your day and clarify priorities' },
    { title: 'Gratitude & Joy', desc: 'Anchor in moments of appreciation' },
    { title: 'Working Through Friction', desc: 'Deconstruct stress and gain perspective' },
    { title: 'Creative Introspection', desc: 'Explore aspirations and inner wisdom' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Welcome Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-6 sm:p-8 text-white border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal AI Journaling Sanctuary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif-display text-white">
              {greeting}, {user.displayName?.split(' ')[0] || 'Reflector'}
            </h1>
            <p className="mt-2 text-stone-300 text-sm max-w-xl leading-relaxed">
              Your confidential space for grounded thought processing, multi-turn AI dialogues, and continuous mindful self-discovery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNewEntry()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/30 transition-all active:scale-98 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Start Reflection</span>
            </button>
          </div>
        </div>

        {/* Quick Guided Prompt Starters */}
        <div className="mt-8 pt-6 border-t border-stone-800/80">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Guided Reflection Inquiries</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {guidedThemes.map((theme, i) => (
              <button
                key={i}
                onClick={() => onNewEntry(theme.title)}
                className="text-left p-3.5 rounded-xl bg-stone-800/60 hover:bg-stone-850 border border-stone-700/60 hover:border-amber-400/40 transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-stone-200 group-hover:text-amber-300 flex items-center justify-between">
                  <span>{theme.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-400" />
                </div>
                <div className="text-[11px] text-stone-400 mt-1 line-clamp-1">{theme.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Journal Entries</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-serif-display text-stone-900">
            {stats.totalEntries}
          </div>
          <p className="mt-1 text-[11px] text-stone-400">Total recorded reflections</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Gemini Dialogue Turns</span>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-serif-display text-stone-900">
            {stats.totalMessages}
          </div>
          <p className="mt-1 text-[11px] text-stone-400">Multi-turn exchanges</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Dominant Mood</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-base font-bold font-serif-display text-stone-900 truncate">
            {stats.dominantMood}
          </div>
          <p className="mt-1 text-[11px] text-stone-400">Synthesized emotional baseline</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <span>Words Processed</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-serif-display text-stone-900">
            {stats.totalWords.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-stone-400">Total reflective expression</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search reflections, themes, insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Mood:</span>
            </div>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="all">All Emotional States</option>
              {moodOptions.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top themes pill filter */}
        {stats.topThemes.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-stone-100 flex-wrap text-xs">
            <span className="text-stone-400 font-medium">Filter by Theme:</span>
            <button
              onClick={() => setSelectedTheme('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedTheme === 'all'
                  ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-200'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All
            </button>
            {stats.topThemes.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme === selectedTheme ? 'all' : theme)}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  selectedTheme === theme
                    ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-200'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Tag className="w-3 h-3" />
                <span>#{theme}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Journal Entries Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-serif-display text-stone-900 flex items-center gap-2">
            <span>Your Personal Journal Entries</span>
            <span className="text-xs font-sans font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
              {filteredEntries.length}
            </span>
          </h2>

          <div className="text-xs text-stone-500 font-medium">
            Strictly isolated to your authenticated UID
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-stone-200 p-5 animate-pulse space-y-3">
                <div className="h-4 bg-stone-200 rounded-md w-1/3"></div>
                <div className="h-6 bg-stone-200 rounded-md w-3/4"></div>
                <div className="h-16 bg-stone-100 rounded-md w-full"></div>
                <div className="h-4 bg-stone-200 rounded-md w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-serif-display text-stone-900">
              {searchTerm || selectedMood !== 'all' || selectedTheme !== 'all'
                ? 'No matching journal entries found'
                : 'Your journal is a blank canvas'}
            </h3>
            <p className="mt-2 text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
              {searchTerm || selectedMood !== 'all' || selectedTheme !== 'all'
                ? 'Try adjusting your search terms or filters to locate other reflections.'
                : 'Start your first reflective dialogue with Gemini. You can explore thoughts, work through challenges, and generate deep insights.'}
            </p>
            <button
              onClick={() => onNewEntry()}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Begin First Reflection</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEntries.map((entry) => {
              const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              const previewText =
                entry.insights?.summary ||
                entry.messages?.find((m) => m.sender === 'user')?.text ||
                entry.content ||
                'No message preview available.';

              return (
                <div
                  key={entry.id}
                  className="group bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between flex-1 text-left relative overflow-hidden"
                >
                  <div>
                    {/* Top Metadata */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getMoodBadgeColor(
                          entry.moodTag
                        )}`}
                      >
                        {entry.moodTag}
                      </span>

                      <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                        <Clock className="w-3 h-3" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onSelectEntry(entry)}
                      className="text-base font-bold font-serif-display text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {entry.title}
                    </h3>

                    {/* Preview Content */}
                    <p className="mt-2 text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {previewText}
                    </p>

                    {/* Key Theme Badges */}
                    {entry.keyThemes && entry.keyThemes.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1">
                        {entry.keyThemes.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-medium rounded-md"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-stone-400">
                      <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                      <span>{entry.messages?.length || 1} turns</span>
                      {entry.insights && (
                        <span className="inline-flex items-center gap-0.5 text-amber-600 font-semibold ml-1.5">
                          <Sparkles className="w-3 h-3" />
                          <span>Insights</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectEntry(entry)}
                        className="inline-flex items-center gap-1 px-3 py-1 font-semibold text-xs text-stone-900 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 rounded-lg transition-colors"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
