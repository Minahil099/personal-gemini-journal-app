export type JournalMood = 
  | 'Grateful & Grounded'
  | 'Contemplative'
  | 'Restless & Seeking Clarity'
  | 'Joyful & Energized'
  | 'Vulnerable & Healing'
  | 'Focused & Determined'
  | 'Calm & Peaceful'
  | 'Anxious & Overwhelmed';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string; // ISO string
}

export interface ReflectionInsight {
  moodTag: JournalMood | string;
  moodValence: number; // -1.0 to 1.0
  summary: string;
  keyThemes: string[];
  actionablePrompts: string[];
  analyzedAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string; // initial or summarized text
  mode: 'chat' | 'freeform' | 'guided';
  promptTheme?: string;
  moodTag: JournalMood | string;
  keyThemes: string[];
  insights?: ReflectionInsight;
  messages: ChatMessage[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  wordCount?: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface JournalStats {
  totalEntries: number;
  totalConversations: number;
  reflectionStreak: number;
  dominantMood: string;
  topThemes: { theme: string; count: number }[];
}

export interface GuidedPromptCategory {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  initialGeminiPrompt: string;
  suggestedOpening: string;
}
