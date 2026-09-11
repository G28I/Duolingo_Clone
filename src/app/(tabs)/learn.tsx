import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useLessonStore } from "@/store/useLessonStore";
import { getUnitsForLanguage, getLessonsForUnit, languages } from "@/data";
import { images } from "@/constants/images";
import { Lesson } from "@/types/learning";

export default function LearnScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"lessons" | "practice">("lessons");

  const { selectedLanguage } = useLanguageStore();
  const { completedLessonIds } = useLessonStore();

  // Fallback to French ('fr') or Spanish ('es') if selectedLanguage is not set
  const currentLang = useMemo(() => {
    return selectedLanguage || languages.find((l) => l.id === "fr") || languages[0];
  }, [selectedLanguage]);

  // Get units for current language
  const currentUnits = useMemo(() => {
    return getUnitsForLanguage(currentLang.id);
  }, [currentLang.id]);

  // Select first unit with incomplete lessons, fallback to first available unit
  const activeUnit = useMemo(() => {
    if (!currentUnits.length) return null;
    const incompleteUnit = currentUnits.find((u) => {
      const lessons = getLessonsForUnit(u.id);
      return lessons.some((l) => !completedLessonIds.includes(l.id));
    });
    return incompleteUnit || currentUnits[0];
  }, [currentUnits, completedLessonIds]);

  // Get lessons for active unit
  const unitLessons = useMemo(() => {
    if (!activeUnit) return [];
    return getLessonsForUnit(activeUnit.id);
  }, [activeUnit]);

  // Calculate completion progress for current unit
  const completedCountInUnit = useMemo(() => {
    return unitLessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  }, [unitLessons, completedLessonIds]);

  // Determine status of each lesson card in unit
  const getLessonStatus = (lesson: Lesson, index: number) => {
    const isCompleted = completedLessonIds.includes(lesson.id);
    if (isCompleted) return "completed";

    const firstUncompletedIndex = unitLessons.findIndex(
      (l) => !completedLessonIds.includes(l.id)
    );
    if (index === firstUncompletedIndex || (firstUncompletedIndex === -1 && index === 0)) {
      return "in_progress";
    }

    return "upcoming";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar Header */}
      <View className="border-b border-slate-100 bg-white">
        <View className="flex-row items-center justify-between px-5 py-3.5 max-w-5xl w-full mx-auto">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#0D132B" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="font-['Poppins-Bold'] text-lg text-text-primary">
              {activeUnit ? activeUnit.title : `${currentLang.name} Course`}
            </Text>
            <Text className="font-['Poppins-Medium'] text-xs text-text-secondary mt-0.5">
              Unit {activeUnit?.order || 1} • {completedCountInUnit} / {unitLessons.length} lessons
            </Text>
          </View>

          {/* Orange Bookmark Action Badge Button */}
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-2xl bg-[#FF9500] shadow-sm active:opacity-90"
            activeOpacity={0.8}
          >
            <Ionicons name="bookmark" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-5xl w-full mx-auto">
          {/* Hero Scenery Banner */}
          <View className="relative bg-[#6C4EF5] rounded-3xl p-6 mb-6 overflow-hidden shadow-md">
            {/* Decorative Background Elements */}
            <View className="absolute top-2 right-2 opacity-25">
              <Ionicons name="sparkles" size={90} color="#FFFFFF" />
            </View>
            <View className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/10" />

            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <View className="flex-row items-center bg-white/20 self-start px-3 py-1 rounded-full mb-2.5">
                  <View className="h-4 w-4 rounded-full bg-white/30 items-center justify-center mr-1.5">
                    <Text className="font-['Poppins-Bold'] text-[9px] text-white">
                      {currentLang.id.toUpperCase()}
                    </Text>
                  </View>
                  <Text className="font-['Poppins-Bold'] text-xs text-white uppercase tracking-wider">
                    {currentLang.name}
                  </Text>
                </View>
                <Text className="font-['Poppins-Bold'] text-2xl text-white leading-tight">
                  {activeUnit ? activeUnit.title : "Start Learning"}
                </Text>
                <Text className="font-['Poppins-Regular'] text-xs text-white/90 mt-1.5 leading-relaxed">
                  {activeUnit?.description || "Master new phrases every day."}
                </Text>
              </View>

              {/* Mascot Banner Image */}
              <View className="items-center justify-center">
                <Image
                  source={images.mascot}
                  style={{ width: 96, height: 96 }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          {/* Segmented Tab Control Switcher */}
          <View className="bg-slate-100 rounded-2xl p-1.5 flex-row mb-6 border border-slate-200/60">
            <TouchableOpacity
              onPress={() => setActiveTab("lessons")}
              className={`flex-1 py-3 items-center justify-center rounded-xl transition-all will-change-variable ${
                activeTab === "lessons"
                  ? "bg-[#6C4EF5] shadow-sm"
                  : "bg-transparent"
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`font-['Poppins-Bold'] text-sm ${
                  activeTab === "lessons" ? "text-white" : "text-slate-600"
                }`}
              >
                Lessons
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("practice")}
              className={`flex-1 py-3 items-center justify-center rounded-xl transition-all will-change-variable ${
                activeTab === "practice"
                  ? "bg-[#6C4EF5] shadow-sm"
                  : "bg-transparent"
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`font-['Poppins-Bold'] text-sm ${
                  activeTab === "practice" ? "text-white" : "text-slate-600"
                }`}
              >
                Practice
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content: Lessons */}
          {activeTab === "lessons" ? (
            <View>
              <View className="flex-row items-center justify-between mb-3.5 px-1">
                <Text className="font-['Poppins-Bold'] text-lg text-text-primary">
                  Unit Timeline
                </Text>
                <Text className="font-['Poppins-SemiBold'] text-xs text-lingua-purple">
                  {unitLessons.length} Lessons Available
                </Text>
              </View>

              {/* Lesson Cards List */}
              {unitLessons.map((lesson, index) => {
                const status = getLessonStatus(lesson, index);
                const isCompleted = status === "completed";
                const isInProgress = status === "in_progress";

                return (
                  <TouchableOpacity
                    key={lesson.id}
                    onPress={() => router.push(`/lesson/${lesson.id}` as any)}
                    activeOpacity={0.85}
                    className={`rounded-2xl p-4.5 mb-3.5 flex-row items-center border will-change-variable ${
                      isInProgress
                        ? "bg-[#F8F7FF] border-[#6C4EF5] border-2 shadow-md"
                        : isCompleted
                        ? "bg-white border-slate-200 shadow-sm"
                        : "bg-slate-50/90 border-slate-200"
                    }`}
                  >
                    {/* Status Circle Icon */}
                    {isCompleted ? (
                      <View className="h-11 w-11 rounded-full bg-[#22C55E] items-center justify-center mr-4 shadow-sm">
                        <Ionicons name="checkmark-sharp" size={22} color="#FFFFFF" />
                      </View>
                    ) : isInProgress ? (
                      <View className="h-11 w-11 rounded-full bg-[#6C4EF5] items-center justify-center mr-4 shadow-md">
                        <Ionicons name="play" size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
                      </View>
                    ) : (
                      <View className="h-11 w-11 rounded-full bg-slate-200/80 items-center justify-center mr-4 border border-slate-300/50">
                        <Ionicons name="lock-closed-outline" size={18} color="#8E8A9F" />
                      </View>
                    )}

                    {/* Card Content Details */}
                    <View className="flex-1 pr-2">
                      <Text className="font-['Poppins-Bold'] text-base text-text-primary leading-snug">
                        {lesson.title}
                      </Text>

                      <Text className="font-['Poppins-Regular'] text-xs text-text-secondary mt-0.5" numberOfLines={1}>
                        {lesson.description}
                      </Text>

                      <View className="flex-row items-center mt-2.5 gap-3">
                        {/* Status Tag Badge */}
                        {isCompleted ? (
                          <View className="bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                            <Text className="font-['Poppins-SemiBold'] text-[11px] text-[#22C55E]">
                              Completed
                            </Text>
                          </View>
                        ) : isInProgress ? (
                          <View className="bg-[#6C4EF5] px-2.5 py-0.5 rounded-full">
                            <Text className="font-['Poppins-SemiBold'] text-[11px] text-white">
                              In progress
                            </Text>
                          </View>
                        ) : (
                          <View className="bg-slate-200/60 px-2.5 py-0.5 rounded-full">
                            <Text className="font-['Poppins-Medium'] text-[11px] text-slate-500">
                              Unlocked
                            </Text>
                          </View>
                        )}

                        <Text className="font-['Poppins-Medium'] text-xs text-slate-500">
                          {lesson.estimatedDurationMinutes} mins
                        </Text>

                        <Text className="font-['Poppins-SemiBold'] text-xs text-lingua-purple">
                          +{lesson.xpReward} XP
                        </Text>
                      </View>
                    </View>

                    {/* Right Graphic Thumbnail or Arrow */}
                    {isInProgress ? (
                      <View className="items-center justify-center pl-1">
                        <Image
                          source={images.mascotPeeking}
                          style={{ width: 44, height: 44 }}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <View className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center">
                        <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            /* Tab Content: Practice */
            <View>
              <Text className="font-['Poppins-Bold'] text-lg text-text-primary mb-3.5">
                Practice Modes
              </Text>

              {/* AI Teacher Live Practice Card */}
              <TouchableOpacity
                onPress={() => {
                  const aiLesson = unitLessons.find((l) => l.type === "ai_teacher") || unitLessons[0];
                  if (aiLesson) router.push(`/lesson/${aiLesson.id}` as any);
                }}
                className="bg-purple-50 border-2 border-lingua-purple rounded-2xl p-5 mb-4 shadow-sm"
                activeOpacity={0.85}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="bg-lingua-purple px-3 py-1 rounded-full">
                    <Text className="font-['Poppins-SemiBold'] text-xs text-white">
                      AI Vision Teacher
                    </Text>
                  </View>
                  <Ionicons name="videocam" size={24} color="#6C4EF5" />
                </View>
                <Text className="font-['Poppins-Bold'] text-lg text-text-primary mt-1">
                  Live Conversation Session
                </Text>
                <Text className="font-['Poppins-Regular'] text-xs text-text-secondary mt-1">
                  Practice real-time speaking and pronunciation with {currentLang.aiTeacherPersona?.name || "your AI tutor"}.
                </Text>
              </TouchableOpacity>

              {/* Flashcards Practice Card */}
              <TouchableOpacity
                onPress={() => {
                  const vocabLesson = unitLessons.find((l) => l.type === "vocabulary_review") || unitLessons[0];
                  if (vocabLesson) router.push(`/lesson/${vocabLesson.id}` as any);
                }}
                className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 flex-row items-center justify-between shadow-sm"
                activeOpacity={0.85}
              >
                <View className="flex-1 pr-3">
                  <Text className="font-['Poppins-Bold'] text-base text-text-primary">
                    Vocabulary Review
                  </Text>
                  <Text className="font-['Poppins-Regular'] text-xs text-text-secondary mt-1">
                    Master essential terms from your completed lessons.
                  </Text>
                </View>
                <View className="h-12 w-12 rounded-2xl bg-amber-100 items-center justify-center">
                  <Ionicons name="card" size={24} color="#FF9500" />
                </View>
              </TouchableOpacity>

              {/* Listening & Pronunciation */}
              <TouchableOpacity
                onPress={() => {
                  const audioLesson = unitLessons.find((l) => l.type === "audio") || unitLessons[1] || unitLessons[0];
                  if (audioLesson) router.push(`/lesson/${audioLesson.id}` as any);
                }}
                className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 flex-row items-center justify-between shadow-sm"
                activeOpacity={0.85}
              >
                <View className="flex-1 pr-3">
                  <Text className="font-['Poppins-Bold'] text-base text-text-primary">
                    Listening & Pronunciation
                  </Text>
                  <Text className="font-['Poppins-Regular'] text-xs text-text-secondary mt-1">
                    Listen to native audio samples and perfect your accent.
                  </Text>
                </View>
                <View className="h-12 w-12 rounded-2xl bg-emerald-100 items-center justify-center">
                  <Ionicons name="mic" size={24} color="#22C55E" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});
