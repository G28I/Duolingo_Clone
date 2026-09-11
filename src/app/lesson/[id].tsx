import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getLessonById, getUnitById } from "@/data";
import { useLessonStore } from "@/store/useLessonStore";
import { images } from "@/constants/images";

export default function LessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const lesson = getLessonById(id as string);
  const unit = lesson ? getUnitById(lesson.unitId) : null;
  const { isLessonCompleted, completeLesson } = useLessonStore();

  const isCompleted = lesson ? isLessonCompleted(lesson.id) : false;

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="font-['Poppins-Bold'] text-lg text-text-primary mb-4 text-center">
            Lesson not found
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-lingua-purple px-6 py-3 rounded-full"
          >
            <Text className="font-['Poppins-SemiBold'] text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleStartOrComplete = () => {
    completeLesson(lesson.id, lesson.xpReward);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-light bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text className="font-['Poppins-Bold'] text-base text-text-primary">
          {unit?.title || "Lesson Overview"}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Illustration */}
        <View className="bg-purple-50 rounded-3xl p-6 mb-6 items-center border border-purple-100">
          <Image
            source={images.mascot}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
          <View className="mt-4 bg-lingua-purple/10 px-4 py-1.5 rounded-full">
            <Text className="font-['Poppins-SemiBold'] text-xs text-lingua-purple uppercase tracking-wider">
              {lesson.type === "ai_teacher"
                ? "AI Teacher Video Lesson"
                : lesson.type === "vocabulary_review"
                ? "Vocabulary Review"
                : "Interactive Lesson"}
            </Text>
          </View>
          <Text className="font-['Poppins-Bold'] text-2xl text-text-primary mt-3 text-center">
            {lesson.title}
          </Text>
          <Text className="font-['Poppins-Regular'] text-sm text-text-secondary mt-1 text-center">
            {lesson.description}
          </Text>
        </View>

        {/* Stats Row */}
        <View className="flex-row items-center justify-around bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-200">
          <View className="items-center">
            <Text className="font-['Poppins-Bold'] text-lg text-lingua-green">
              +{lesson.xpReward} XP
            </Text>
            <Text className="font-['Poppins-Regular'] text-xs text-slate-500">
              Reward
            </Text>
          </View>
          <View className="h-8 w-[1px] bg-slate-200" />
          <View className="items-center">
            <Text className="font-['Poppins-Bold'] text-lg text-text-primary">
              {lesson.estimatedDurationMinutes} mins
            </Text>
            <Text className="font-['Poppins-Regular'] text-xs text-slate-500">
              Duration
            </Text>
          </View>
          <View className="h-8 w-[1px] bg-slate-200" />
          <View className="items-center">
            <Text
              className={`font-['Poppins-Bold'] text-lg ${
                isCompleted ? "text-lingua-green" : "text-lingua-purple"
              }`}
            >
              {isCompleted ? "Completed" : "Ready"}
            </Text>
            <Text className="font-['Poppins-Regular'] text-xs text-slate-500">
              Status
            </Text>
          </View>
        </View>

        {/* Goals */}
        {lesson.goals && lesson.goals.length > 0 && (
          <View className="mb-6">
            <Text className="font-['Poppins-Bold'] text-base text-text-primary mb-3">
              What you will learn
            </Text>
            {lesson.goals.map((goal) => (
              <View
                key={goal.id}
                className="flex-row items-center bg-white p-3 rounded-xl mb-2 border border-slate-100 shadow-sm"
              >
                <View className="h-6 w-6 rounded-full bg-emerald-100 items-center justify-center mr-3">
                  <Ionicons name="checkmark" size={14} color="#22C55E" />
                </View>
                <Text className="font-['Poppins-Medium'] text-sm text-slate-700 flex-1">
                  {goal.text}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Vocabulary Preview */}
        {lesson.vocabulary && lesson.vocabulary.length > 0 && (
          <View className="mb-6">
            <Text className="font-['Poppins-Bold'] text-base text-text-primary mb-3">
              Key Vocabulary ({lesson.vocabulary.length})
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {lesson.vocabulary.map((vocab) => (
                <View
                  key={vocab.id}
                  className="bg-white border border-slate-200 px-3 py-2 rounded-xl"
                >
                  <Text className="font-['Poppins-SemiBold'] text-sm text-lingua-purple">
                    {vocab.term}
                  </Text>
                  <Text className="font-['Poppins-Regular'] text-xs text-slate-500">
                    {vocab.translation}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Footer */}
      <View className="p-6 bg-white border-t border-slate-100 shadow-lg">
        <TouchableOpacity
          onPress={handleStartOrComplete}
          className="bg-lingua-purple rounded-2xl py-4 items-center justify-center shadow-md active:opacity-90"
        >
          <Text className="font-['Poppins-Bold'] text-white text-base">
            {isCompleted ? "Practice Lesson Again" : "Start Lesson"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
});
