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
    id: "unit-es-2",
    languageId: "es",
    order: 2,
    title: "Unit 2: At the Café",
    description:
      "Order food and drinks, ask for the bill, and express your preferences.",
    icon: "coffee",
    color: "#22C55E",
    lessonIds: ["lesson-es-2-1", "lesson-es-2-2"],
    totalXP: 60,
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
    lessonIds: ["lesson-fr-1-1", "lesson-fr-1-2"],
    totalXP: 60,
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
    lessonIds: ["lesson-ja-1-1", "lesson-ja-1-2"],
    totalXP: 60,
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
    lessonIds: ["lesson-de-1-1", "lesson-de-1-2"],
    totalXP: 60,
  },
];
