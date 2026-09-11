import { Unit } from "@/types/learning";

export const units: Unit[] = [
  // Spanish Units
  {
    id: "unit-es-1",
    languageId: "es",
    order: 1,
    title: "Unit 1: Basics & Greetings",
    description:
      "Say hello, introduce yourself, and learn everyday polite expressions in Spanish.",
    icon: "sparkles",
    color: "#6C4EF5",
    lessonIds: ["lesson-es-1-1", "lesson-es-1-2"],
    totalXP: 60,
  },
  {
    id: "unit-es-3",
    languageId: "es",
    order: 3,
    title: "At the Café",
    description:
      "Order food and drinks, ask for the bill, and express your preferences in Spanish.",
    icon: "coffee",
    color: "#22C55E",
    lessonIds: ["lesson-es-3-1", "lesson-es-3-2", "lesson-es-3-3", "lesson-es-3-4", "lesson-es-3-5", "lesson-es-3-6"],
    totalXP: 185,
  },

  // French Units
  {
    id: "unit-fr-1",
    languageId: "fr",
    order: 1,
    title: "Unit 1: Premiers Pas",
    description:
      "Master fundamental French salutations, polite phrasing, and self-introductions.",
    icon: "sparkles",
    color: "#3B82F6",
    lessonIds: ["lesson-fr-1-1", "lesson-fr-1-2", "lesson-fr-1-3", "lesson-fr-1-4", "lesson-fr-1-5", "lesson-fr-1-6"],
    totalXP: 185,
  },

  // Japanese Units
  {
    id: "unit-ja-1",
    languageId: "ja",
    order: 1,
    title: "Unit 1: First Steps in Tokyo",
    description:
      "Learn essential Japanese greetings, self-introductions, and daily polite expressions.",
    icon: "sparkles",
    color: "#EC4899",
    lessonIds: ["lesson-ja-1-1", "lesson-ja-1-2", "lesson-ja-1-3", "lesson-ja-1-4", "lesson-ja-1-5", "lesson-ja-1-6"],
    totalXP: 185,
  },

  // German Units
  {
    id: "unit-de-1",
    languageId: "de",
    order: 1,
    title: "Unit 1: Hallo & Begrüßung",
    description:
      "Begin speaking German with daily greetings, introductions, and simple questions.",
    icon: "sparkles",
    color: "#F59E0B",
    lessonIds: ["lesson-de-1-1", "lesson-de-1-2", "lesson-de-1-3", "lesson-de-1-4", "lesson-de-1-5", "lesson-de-1-6"],
    totalXP: 185,
  },
];
