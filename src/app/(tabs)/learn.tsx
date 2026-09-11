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

  // Fallback to Spanish ('es') or first language
  const currentLang = useMemo(() => {
    return selectedLanguage || languages.find((l) => l.id === "es") || languages[0];
  }, [selectedLanguage]);

  // Get units for current language
  const currentUnits = useMemo(() => {
    return getUnitsForLanguage(currentLang.id);
  }, [currentLang.id]);

  // Select active unit: first unit with incomplete lessons, falling back to first available unit
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

  // Calculate completion progress
  const completedCountInUnit = useMemo(() => {
    return unitLessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  }, [unitLessons, completedLessonIds]);

  // Determine lesson status
  const getLessonStatus = (lesson: Lesson, index: number) => {
    const isCompleted = completedLessonIds.includes(lesson.id);
    if (isCompleted) return "completed";

    const firstUncompletedIndex = unitLessons.findIndex(
      (l) => !completedLessonIds.includes(l.id)
    );
    if (index === firstUncompletedIndex || (firstUncompletedIndex === -1 && index === 2)) {
      return "in_progress";
    }

    return "upcoming";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View className="bg-white px-5 py-3 flex-row items-center justify-between border-b border-slate-100/60 z-20">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="h-10 w-10 items-center justify-center rounded-full mr-3 active:bg-slate-100"
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#0D132B" />
          </TouchableOpacity>

          <View>
            <Text className="font-['Poppins-Bold'] text-lg text-[#0D132B] leading-tight">
              {activeUnit ? activeUnit.title : `${currentLang.name} Course`}
            </Text>
            <Text className="font-['Poppins-Medium'] text-xs text-[#8E8A9F] mt-0.5">
              Unit {activeUnit?.order || 3} • {completedCountInUnit} / {unitLessons.length || 6} lessons
            </Text>
          </View>
        </View>

        {/* Orange Bookmark Icon Badge */}
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm active:bg-slate-50"
          activeOpacity={0.8}
        >
          <Ionicons name="bookmark-outline" size={20} color="#FF9500" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-md w-full mx-auto">
          {/* Hero Café Illustration Banner */}
          <View className="relative h-52 w-full rounded-3xl overflow-hidden bg-sky-200 justify-end items-center">
            <Image
              source={images.onboardingIllustration || images.mascot}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            {/* Fallback Mascot Overlay if banner image renders mascot */}
            <View className="absolute bottom-2 left-6 right-6 flex-row items-end justify-between pointer-events-none">
              <Image
                source={images.mascot}
                style={{ width: 110, height: 110 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Floating Segmented Tab Bar */}
          <View className="bg-white rounded-3xl p-1.5 flex-row mx-4 -mt-7 z-30 shadow-lg border border-slate-100/80">
            <TouchableOpacity
              onPress={() => setActiveTab("lessons")}
              className={`flex-1 py-3 items-center justify-center rounded-2xl transition-all ${
                activeTab === "lessons" ? "bg-white shadow-sm" : "bg-transparent"
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`font-['Poppins-Bold'] text-sm ${
                  activeTab === "lessons" ? "text-[#6C4EF5]" : "text-[#8E8A9F]"
                }`}
              >
                Lessons
              </Text>
              {activeTab === "lessons" && (
                <View className="h-0.5 w-8 bg-[#6C4EF5] rounded-full mt-1" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("practice")}
              className={`flex-1 py-3 items-center justify-center rounded-2xl transition-all ${
                activeTab === "practice" ? "bg-white shadow-sm" : "bg-transparent"
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`font-['Poppins-Bold'] text-sm ${
                  activeTab === "practice" ? "text-[#6C4EF5]" : "text-[#8E8A9F]"
                }`}
              >
                Practice
              </Text>
              {activeTab === "practice" && (
                <View className="h-0.5 w-8 bg-[#6C4EF5] rounded-full mt-1" />
              )}
            </TouchableOpacity>
          </View>

          {/* Tab Content: Lessons */}
          {activeTab === "lessons" ? (
            <View className="pt-6 px-1">
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
                    className={`rounded-3xl p-5 mb-3.5 flex-row items-center justify-between border ${
                      isInProgress
                        ? "bg-[#F6F4FE] border-2 border-[#8B5CF6] shadow-sm"
                        : "bg-white border-slate-100 shadow-sm"
                    }`}
                  >
                    <View className="flex-1 pr-3">
                      {/* Top Small Lesson Number */}
                      <Text
                        className={`font-['Poppins-SemiBold'] text-xs ${
                          isInProgress ? "text-[#6C4EF5]" : "text-[#A09CB0]"
                        }`}
                      >
                        Lesson {lesson.order || index + 1}
                      </Text>

                      {/* Main Title */}
                      <Text className="font-['Poppins-Bold'] text-base text-[#0D132B] mt-0.5 leading-snug">
                        {lesson.title}
                      </Text>

                      {/* Bottom Status / Subtitle */}
                      {isInProgress ? (
                        <Text className="font-['Poppins-Medium'] text-xs text-[#6C4EF5] mt-1.5">
                          In progress
                        </Text>
                      ) : !isCompleted ? (
                        <Text className="font-['Poppins-Regular'] text-xs text-[#A09CB0] mt-1">
                          0 / 6 lessons
                        </Text>
                      ) : null}
                    </View>

                    {/* Right Side Icon / Graphic */}
                    {isCompleted ? (
                      <View className="h-7 w-7 rounded-full bg-[#22C55E] items-center justify-center shadow-xs">
                        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                      </View>
                    ) : isInProgress ? (
                      <View className="items-center justify-center p-1">
                        <Image
                          source={images.mascotPeeking || images.mascot}
                          style={{ width: 44, height: 44 }}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <Ionicons name="lock-closed-outline" size={22} color="#8E8A9F" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            /* Tab Content: Practice */
            <View className="pt-6 px-1">
              <Text className="font-['Poppins-Bold'] text-base text-[#0D132B] mb-3">
                Practice Modes
              </Text>

              <TouchableOpacity
                onPress={() => {
                  const aiLesson = unitLessons.find((l) => l.type === "ai_teacher") || unitLessons[0];
                  if (aiLesson) router.push(`/lesson/${aiLesson.id}` as any);
                }}
                className="bg-white border border-slate-100 rounded-3xl p-5 mb-3 flex-row items-center justify-between shadow-sm"
                activeOpacity={0.85}
              >
                <View className="flex-1 pr-3">
                  <Text className="font-['Poppins-SemiBold'] text-xs text-[#6C4EF5]">
                    AI Voice Tutor
                  </Text>
                  <Text className="font-['Poppins-Bold'] text-base text-[#0D132B] mt-0.5">
                    Audio Lesson Practice
                  </Text>
                </View>
                <Ionicons name="mic-outline" size={24} color="#6C4EF5" />
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
    paddingBottom: 40,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
});
