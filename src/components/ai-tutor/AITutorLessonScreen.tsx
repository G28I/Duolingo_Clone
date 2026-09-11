import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getLessonById, getLanguageById } from "@/data";
import { useLessonStore } from "@/store/useLessonStore";
import { images } from "@/constants/images";

interface AITutorLessonScreenProps {
  lessonId?: string;
  onClose?: () => void;
}

export function AITutorLessonScreen({
  lessonId = "lesson-fr-1-1",
  onClose,
}: AITutorLessonScreenProps) {
  const lesson = getLessonById(lessonId) || getLessonById("lesson-fr-1-1");
  const language = lesson ? getLanguageById(lesson.languageId) : null;
  const { completeLesson } = useLessonStore();

  // Interactive Call UI States
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isLearnerSpeaking, setIsLearnerSpeaking] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [tutorState, setTutorState] = useState<"speaking" | "listening">("speaking");

  const teacherPersona = language?.aiTeacherPersona || {
    name: "Julien",
    title: "Parisian Language Coach",
  };

  const activePhrase = {
    tutorUtterance: "Bonjour ! Comment allez-vous ?",
    tutorTranslation: "Hello! How are you?",
    praise: "¡Muy bien! That was great! 👏",
    learnerPrompt: "Bonjour ! Comment allez-vous ?",
    learnerTranslation: "Hello! How are you?",
  };

  // Sync tutor state with learner speaking state
  useEffect(() => {
    if (isLearnerSpeaking) {
      setTutorState("listening");
    } else {
      setTutorState("speaking");
    }
  }, [isLearnerSpeaking]);

  const handleEndCall = () => {
    if (lesson) {
      completeLesson(lesson.id, lesson.xpReward);
    }
    if (onClose) {
      onClose();
    }
  };

  const playUtteranceAudio = () => {
    setAudioPlaying(true);
    setTimeout(() => setAudioPlaying(false), 1800);
  };

  const toggleLearnerSpeech = () => {
    setIsLearnerSpeaking((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Auto-adjustable App Shell: Fills 100% on mobile, centered max-w-[430px] on desktop */}
      <View className="flex-1 w-full max-w-[430px] mx-auto bg-white flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* ========================================================
            1. TOP HEADER (COMPACT)
            ======================================================== */}
        <View className="px-5 py-3 flex-row items-center justify-between border-b border-slate-100 bg-white z-20">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={handleEndCall}
              className="h-9 w-9 items-center justify-center rounded-full bg-[#F4F5F9] active:opacity-80"
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color="#0D132B" />
            </TouchableOpacity>

            <View>
              <Text className="font-['Poppins-Bold'] text-base text-[#0D132B] leading-5">
                AI Teacher
              </Text>
              <View className="flex-row items-center gap-1.5 mt-0.5">
                <View className="h-2 w-2 rounded-full bg-[#22C55E]" />
                <Text className="font-['Poppins-Medium'] text-xs text-[#22C55E]">
                  Online
                </Text>
              </View>
            </View>
          </View>

          {/* Subtitles / Language Options */}
          <TouchableOpacity
            onPress={() => setShowSubtitles((prev) => !prev)}
            className={`h-9 w-9 items-center justify-center rounded-full active:opacity-80 ${
              showSubtitles ? "bg-[#ECE9FE]" : "bg-[#F4F5F9]"
            }`}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={18}
              color={showSubtitles ? "#6C4EF5" : "#0D132B"}
            />
          </TouchableOpacity>
        </View>

        {/* ========================================================
            2. AUTO-ADJUSTABLE MIDDLE CONTENT (EXPANDS TO FILL SCREEN)
            ======================================================== */}
        <View className="flex-1 px-4 py-2 justify-between flex-col">
          {/* Dominant AI Tutor Stage: Auto-adjusts height to fill available viewport */}
          <View className="w-full bg-gradient-to-b from-[#FAF8FF] via-[#F4F0FF] to-[#FAF8FF] border border-[#DDD6FE] rounded-[28px] p-3.5 relative items-center justify-between flex-1 overflow-hidden shadow-xs my-1 min-h-[300px]">
            {/* Ambient Background Lighting */}
            <View className="absolute inset-0 items-center justify-center pointer-events-none opacity-40">
              <View className="h-72 w-72 rounded-full bg-purple-300/40" />
              <View className="h-48 w-48 rounded-full bg-indigo-200/40 absolute" />
            </View>

            {/* Student PIP (Picture-In-Picture) Floating Top-Right */}
            <View className="absolute top-3 right-3 z-30 w-24 h-32 rounded-2xl border-2 border-white shadow-lg bg-slate-900 overflow-hidden">
              {isCameraOn ? (
                <View className="w-full h-full bg-slate-800 items-center justify-between p-1.5">
                  {/* PIP Header */}
                  <View className="w-full flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded-full">
                      <View className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                      <Text className="font-['Poppins-Bold'] text-[8px] text-white">
                        HD
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setIsFrontCamera((prev) => !prev)}
                      className="h-5 w-5 rounded-full bg-black/40 items-center justify-center"
                    >
                      <Ionicons name="camera-reverse" size={11} color="#FFF" />
                    </TouchableOpacity>
                  </View>

                  {/* Student Self-view Avatar */}
                  <View className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#6C4EF5] to-[#9078FF] items-center justify-center border-2 border-white/50 shadow-sm">
                    <Text className="font-['Poppins-Bold'] text-xs text-white">
                      YOU
                    </Text>
                  </View>

                  {/* PIP Bottom Label */}
                  <View className="bg-black/50 px-2 py-0.5 rounded-full">
                    <Text className="font-['Poppins-Medium'] text-[8px] text-slate-200 text-center">
                      {isFrontCamera ? "Front Cam" : "Back Cam"}
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="w-full h-full bg-slate-900 items-center justify-center p-2">
                  <View className="h-9 w-9 rounded-full bg-slate-800 items-center justify-center mb-1 border border-slate-700">
                    <Ionicons name="videocam-off" size={16} color="#94A3B8" />
                  </View>
                  <Text className="font-['Poppins-Medium'] text-[9px] text-slate-400 text-center">
                    Cam Off
                  </Text>
                </View>
              )}
            </View>

            {/* Central Hero: Large Fox AI Teacher Visual */}
            <View className="items-center justify-center z-10 flex-1 my-auto pt-2">
              <View className="items-center justify-center relative">
                {/* Subtle Speaking Pulse Ring */}
                {tutorState === "speaking" && (
                  <View className="absolute -inset-2 rounded-full bg-purple-300/30 animate-pulse pointer-events-none" />
                )}

                <Image
                  source={images.mascotWelcome || images.mascot}
                  style={{ width: 170, height: 170 }}
                  resizeMode="contain"
                />

                {/* Tutor Status Pill */}
                <View className="mt-2 flex-row items-center gap-1.5 bg-white/95 px-3.5 py-1 rounded-full border border-purple-100 shadow-sm">
                  <View
                    className={`h-2 w-2 rounded-full ${
                      tutorState === "speaking" ? "bg-[#6C4EF5]" : "bg-emerald-500"
                    }`}
                  />
                  <Text className="font-['Poppins-Bold'] text-xs text-[#0D132B]">
                    {teacherPersona.name}
                  </Text>
                  <Text className="font-['Poppins-Medium'] text-[11px] text-[#8E8A9F]">
                    • {tutorState === "speaking" ? "Speaking" : "Listening to you"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Floating Speech Bubble Overlay */}
            {showSubtitles && (
              <View className="w-full bg-white/95 backdrop-blur-md border border-[#E0D8FE] rounded-2xl p-3 shadow-sm z-20 relative mt-1">
                {/* Speech Bubble Pointer/Tail */}
                <View
                  style={{
                    position: "absolute",
                    top: -6,
                    left: 28,
                    width: 12,
                    height: 12,
                    backgroundColor: "#FFFFFF",
                    transform: [{ rotate: "45deg" }],
                    borderTopWidth: 1,
                    borderLeftWidth: 1,
                    borderColor: "#E0D8FE",
                  }}
                />

                <View className="flex-row items-center justify-between mb-1">
                  <Text className="font-['Poppins-Bold'] text-xs text-[#6C4EF5]">
                    {teacherPersona.name}
                  </Text>

                  <TouchableOpacity
                    onPress={playUtteranceAudio}
                    className="h-7 w-7 rounded-full bg-[#ECE9FE] items-center justify-center active:opacity-80"
                  >
                    <Ionicons
                      name={audioPlaying ? "volume-high" : "volume-medium-outline"}
                      size={16}
                      color="#6C4EF5"
                    />
                  </TouchableOpacity>
                </View>

                <Text className="font-['Poppins-Bold'] text-sm text-[#0D132B] leading-snug">
                  {`"${activePhrase.tutorUtterance}"`}
                </Text>
                <Text className="font-['Poppins-Regular'] text-xs text-[#8E8A9F] mt-0.5">
                  {activePhrase.tutorTranslation}
                </Text>
              </View>
            )}
          </View>

          {/* Learner Response Section ("YOUR TURN") */}
          <View className="w-full mt-2 mb-1.5">
            <Text className="font-['Poppins-Bold'] text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1 px-1">
              YOUR TURN • TRY SAYING
            </Text>

            <TouchableOpacity
              onPress={toggleLearnerSpeech}
              activeOpacity={0.85}
              className={`bg-white border rounded-2xl p-3.5 flex-row items-center justify-between shadow-xs ${
                isLearnerSpeaking
                  ? "border-[#6C4EF5] bg-purple-50/40"
                  : "border-slate-200"
              }`}
            >
              <View className="flex-1 pr-3">
                <Text className="font-['Poppins-Bold'] text-sm text-[#6C4EF5]">
                  {activePhrase.learnerPrompt}
                </Text>
                <Text className="font-['Poppins-Regular'] text-xs text-[#8E8A9F] mt-0.5">
                  {activePhrase.learnerTranslation}
                </Text>
              </View>

              <View
                className={`h-11 w-11 rounded-full items-center justify-center shadow-xs ${
                  isLearnerSpeaking ? "bg-[#6C4EF5]" : "bg-[#ECE9FE]"
                }`}
              >
                <Ionicons
                  name="mic"
                  size={22}
                  color={isLearnerSpeaking ? "#FFFFFF" : "#6C4EF5"}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Compact Learning Feedback Metrics */}
          <View className="w-full my-1">
            <View className="flex-row items-center justify-between bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-2">
              <View className="flex-1 items-center border-r border-slate-200/60 pr-1">
                <Text className="font-['Poppins-Medium'] text-[10px] text-slate-400 uppercase">
                  Speaking
                </Text>
                <View className="mt-0.5 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  <Text className="font-['Poppins-Bold'] text-xs text-emerald-700">
                    Excellent
                  </Text>
                </View>
              </View>

              <View className="flex-1 items-center border-r border-slate-200/60 px-1">
                <Text className="font-['Poppins-Medium'] text-[10px] text-slate-400 uppercase">
                  Pronunciation
                </Text>
                <View className="mt-0.5 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  <Text className="font-['Poppins-Bold'] text-xs text-[#6C4EF5]">
                    Great
                  </Text>
                </View>
              </View>

              <View className="flex-1 items-center pl-1">
                <Text className="font-['Poppins-Medium'] text-[10px] text-slate-400 uppercase">
                  Grammar
                </Text>
                <View className="mt-0.5 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  <Text className="font-['Poppins-Bold'] text-xs text-blue-700">
                    Good
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================
            3. BOTTOM CALL CONTROLS BAR (ANCHORED TO THE BOTTOM)
            ======================================================== */}
        <View className="w-full bg-white border-t border-slate-100 pt-3 pb-3 px-6 z-20">
          <View className="flex-row items-center justify-around max-w-sm mx-auto gap-4 w-full">
            {/* 🎥 Camera Toggle Button */}
            <TouchableOpacity
              onPress={() => setIsCameraOn((prev) => !prev)}
              className={`h-14 w-14 rounded-full items-center justify-center ${
                isCameraOn ? "bg-[#F3F4F6]" : "bg-red-100"
              }`}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isCameraOn ? "videocam-outline" : "videocam-off-outline"}
                size={22}
                color={isCameraOn ? "#0D132B" : "#EF4444"}
              />
            </TouchableOpacity>

            {/* 🎙 Mic Toggle Button */}
            <TouchableOpacity
              onPress={() => setIsMuted((prev) => !prev)}
              className={`h-14 w-14 rounded-full items-center justify-center ${
                !isMuted ? "bg-[#F3F4F6]" : "bg-red-100"
              }`}
              activeOpacity={0.8}
            >
              <Ionicons
                name={!isMuted ? "mic-outline" : "mic-off-outline"}
                size={22}
                color={!isMuted ? "#0D132B" : "#EF4444"}
              />
            </TouchableOpacity>

            {/* 🌐 Subtitles / Translation Toggle */}
            <TouchableOpacity
              onPress={() => setShowSubtitles((prev) => !prev)}
              className={`h-14 w-14 rounded-full items-center justify-center ${
                showSubtitles ? "bg-[#ECE9FE]" : "bg-[#F3F4F6]"
              }`}
              activeOpacity={0.8}
            >
              <Ionicons
                name="globe-outline"
                size={22}
                color={showSubtitles ? "#6C4EF5" : "#0D132B"}
              />
            </TouchableOpacity>

            {/* 🔴 Prominent Red End Call Button */}
            <TouchableOpacity
              onPress={handleEndCall}
              className="h-16 w-16 rounded-full bg-[#FF3B30] items-center justify-center shadow-lg shadow-red-200 active:opacity-90"
              activeOpacity={0.8}
            >
              <Ionicons
                name="call"
                size={26}
                color="#FFFFFF"
                style={{ transform: [{ rotate: "135deg" }] }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
