import { languages } from "./languages";
import { units } from "./units";
import { lessons } from "./lessons";
import {
  Activity,
  KeyPhrase,
  Language,
  Lesson,
  Unit,
  VocabularyItem,
} from "@/types/learning";

export * from "./languages";
export * from "./units";
export * from "./lessons";

/**
 * Returns all supported languages
 */
export function getLanguages(): Language[] {
  return languages;
}

/**
 * Returns a single language by its ID (e.g. 'es', 'fr', 'ja', 'de')
 */
export function getLanguageById(id: string): Language | undefined {
  return languages.find((lang) => lang.id === id);
}

/**
 * Returns all units belonging to a specific language, sorted by order
 */
export function getUnitsForLanguage(languageId: string): Unit[] {
  return units
    .filter((unit) => unit.languageId === languageId)
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns a unit by its unique ID
 */
export function getUnitById(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}

/**
 * Returns all lessons belonging to a specific unit, sorted by order
 */
export function getLessonsForUnit(unitId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns all lessons for a language across all units
 */
export function getLessonsForLanguage(languageId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.languageId === languageId)
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns a single lesson by its ID
 */
export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}

/**
 * Returns all vocabulary items in a lesson
 */
export function getLessonVocabulary(lessonId: string): VocabularyItem[] {
  const lesson = getLessonById(lessonId);
  return lesson ? lesson.vocabulary : [];
}

/**
 * Returns all key phrases in a lesson
 */
export function getLessonPhrases(lessonId: string): KeyPhrase[] {
  const lesson = getLessonById(lessonId);
  return lesson ? lesson.phrases : [];
}

/**
 * Returns all interactive activities in a lesson
 */
export function getLessonActivities(lessonId: string): Activity[] {
  const lesson = getLessonById(lessonId);
  return lesson ? lesson.activities : [];
}
