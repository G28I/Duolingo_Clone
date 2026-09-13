import React from "react";
import { useRouter } from "expo-router";
import { AITutorLessonScreen } from "@/components/ai-tutor/AITutorLessonScreen";

export default function AITeacherScreen() {
  const router = useRouter();

  return (
    <AITutorLessonScreen
      lessonId="lesson-fr-1-1"
      onClose={() => router.push("/(tabs)/learn")}
    />
  );
}

