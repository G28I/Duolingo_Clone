import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LessonState {
  completedLessonIds: string[];
  userXP: number;
  streakDays: number;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  resetProgress: () => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set, get) => ({
      // Pre-fill first lesson for Spanish, French, Japanese as completed for rich visual demonstration
      completedLessonIds: ["lesson-es-1-1", "lesson-fr-1-1", "lesson-ja-1-1"],
      userXP: 120,
      streakDays: 5,

      completeLesson: (lessonId: string, xpEarned: number) => {
        const currentCompleted = get().completedLessonIds;
        if (!currentCompleted.includes(lessonId)) {
          set({
            completedLessonIds: [...currentCompleted, lessonId],
            userXP: get().userXP + xpEarned,
          });
        }
      },

      isLessonCompleted: (lessonId: string) => {
        return get().completedLessonIds.includes(lessonId);
      },

      resetProgress: () => {
        set({
          completedLessonIds: [],
          userXP: 0,
          streakDays: 0,
        });
      },
    }),
    {
      name: "lesson-progress-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
