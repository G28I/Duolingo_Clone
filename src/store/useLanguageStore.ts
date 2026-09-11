import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "@/types/learning";

interface LanguageState {
  selectedLanguage: Language | null;
  hasHydrated: boolean;
  setSelectedLanguage: (language: Language) => void;
  clearSelectedLanguage: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: null,
      hasHydrated: false,
      setSelectedLanguage: (language: Language) =>
        set({ selectedLanguage: language }),
      clearSelectedLanguage: async () => {
        set({ selectedLanguage: null });
        await AsyncStorage.removeItem("language-storage");
      },
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
