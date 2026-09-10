/**
 * Learning Content System Types
 * Defines data contracts for languages, units, lessons, activities, vocabulary,
 * phrases, goals, and AI Vision Agent teacher prompts.
 */

export interface AITeacherPersona {
  name: string;
  title: string;
  accent: string;
  bio: string;
  avatar?: string;
}

export interface Language {
  id: string; // e.g. 'es', 'fr', 'ja', 'de'
  name: string; // English display name: "Spanish"
  nativeName: string; // Native name: "Español"
  flag: string; // Emoji flag or icon identifier: "🇪🇸"
  code: string; // BCP 47 locale code: "es-ES"
  description: string;
  totalUnits: number;
  totalLessons: number;
  totalXP: number;
  totalLearners?: string; // e.g. "28.4M learners"
  isPopular?: boolean;
  aiTeacherVoiceId: string;
  aiTeacherPersona: AITeacherPersona;
}

export interface Unit {
  id: string; // e.g. 'unit-es-1'
  languageId: string; // e.g. 'es'
  order: number;
  title: string;
  description: string;
  icon: string; // Icon or badge name (e.g. 'sparkles', 'chat', 'coffee')
  color: string; // Theme color token or hex
  lessonIds: string[];
  totalXP: number;
}

export type LessonType =
  | "standard"
  | "audio"
  | "ai_teacher"
  | "vocabulary_review";

export interface LessonGoal {
  id: string;
  text: string;
}

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "greeting"
  | "phrase"
  | "pronoun"
  | "interjection";

export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  phonetic?: string;
  partOfSpeech: PartOfSpeech;
  exampleSentence: string;
  exampleTranslation: string;
  audioUrl?: string;
}

export interface KeyPhrase {
  id: string;
  phrase: string;
  translation: string;
  context: string;
  audioUrl?: string;
}

// Activity Types
export type ActivityType =
  | "multiple_choice"
  | "translate"
  | "fill_in_blank"
  | "listen_and_repeat"
  | "match_pairs"
  | "ai_conversation";

export interface BaseActivity {
  id: string;
  type: ActivityType;
  prompt: string;
}

export interface MultipleChoiceActivity extends BaseActivity {
  type: "multiple_choice";
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface TranslateActivity extends BaseActivity {
  type: "translate";
  sourceText: string;
  targetText: string;
  wordBank: string[];
}

export interface FillInBlankActivity extends BaseActivity {
  type: "fill_in_blank";
  sentence: string; // e.g. "¡___! ¿Cómo te llamas?"
  missingWord: string;
  options: string[];
  correctAnswer: string;
}

export interface ListenAndRepeatActivity extends BaseActivity {
  type: "listen_and_repeat";
  targetText: string;
  phonetic?: string;
  translation: string;
  audioUrl?: string;
}

export interface MatchPairsActivity extends BaseActivity {
  type: "match_pairs";
  pairs: {
    id: string;
    term: string;
    translation: string;
  }[];
}

export interface AIConversationActivity extends BaseActivity {
  type: "ai_conversation";
  scenario: string;
  roleplayObjective: string;
  suggestedStarters: string[];
}

export type Activity =
  | MultipleChoiceActivity
  | TranslateActivity
  | FillInBlankActivity
  | ListenAndRepeatActivity
  | MatchPairsActivity
  | AIConversationActivity;

export interface AITeacherPrompt {
  systemPrompt: string;
  greetingMessage: string;
  scenario: string;
  targetVocabulary: string[];
  evaluationCriteria: string[];
  fallbackResponses?: string[];
}

export interface Lesson {
  id: string; // e.g. 'lesson-es-1-1'
  unitId: string;
  languageId: string;
  order: number;
  title: string;
  description: string;
  type: LessonType;
  xpReward: number;
  estimatedDurationMinutes: number;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: KeyPhrase[];
  activities: Activity[];
  aiTeacherPrompt?: AITeacherPrompt;
}
