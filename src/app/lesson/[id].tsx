import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AITutorLessonScreen } from "@/components/ai-tutor/AITutorLessonScreen";

export default function AudioLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <AITutorLessonScreen
      lessonId={(id as string) || "lesson-fr-1-1"}
      onClose={() => router.back()}
    />
  );
}

