import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { getLessonById, getLanguageById } from "@/data";
import { useLessonStore } from "@/store/useLessonStore";
import { images } from "@/constants/images";
import {
  fetchStreamToken,
  setupStreamAudioCall,
  StreamTokenResponse,
  StreamVideoClient,
  Call,
} from "@/lib/stream";

export default function AudioLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();

  const lesson = getLessonById(id as string);
  const language = lesson ? getLanguageById(lesson.languageId) : undefined;
  const completeLesson = useLessonStore((s) => s.completeLesson);

  // Audio Call & Session States
  const [sessionState, setSessionState] = useState<"connecting" | "joined" | "error" | "ended">("connecting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedPhraseIndex, setSelectedPhraseIndex] = useState(0);

  // Stream Client and Call References
  const clientRef = useRef<StreamVideoClient | null>(null);
  const callRef = useRef<Call | null>(null);

  const teacherPersona = language?.aiTeacherPersona || {
    name: "Julien",
    title: "Parisian Language Coach",
  };

  const userName = user?.fullName || user?.primaryEmailAddress?.emailAddress || "Learner";
  const userId = user?.id || `user_${id || "guest"}`;

  // Start & Join Stream Audio Call
  const startAudioCall = async () => {
    if (!lesson) return;
    try {
      setSessionState("connecting");
      setErrorMessage(null);

      // Fetch Stream token securely from Expo API route
      const credentials: StreamTokenResponse = await fetchStreamToken({
        userId,
        userName,
        userImage: user?.imageUrl,
        lessonId: lesson.id,
        languageId: lesson.languageId,
      });

      // Initialize Stream Video Client and join Audio-Only Call
      const { client, call } = await setupStreamAudioCall(credentials, {
        id: userId,
        name: userName,
        image: user?.imageUrl,
      });

      clientRef.current = client;
      callRef.current = call;

      setSessionState("joined");
      setIsSpeaking(true);
    } catch (err: any) {
      console.warn("[Stream Call Error]:", err);
      setErrorMessage(err?.message || "Could not connect to call");
      setSessionState("joined");
    }
  };

  useEffect(() => {
    let isCancelled = false;

    async function initAudioCall() {
      if (!lesson) return;
      try {
        // Fetch Stream token securely from Expo API route
        const credentials: StreamTokenResponse = await fetchStreamToken({
          userId,
          userName,
          userImage: user?.imageUrl,
          lessonId: lesson.id,
          languageId: lesson.languageId,
        });

        if (isCancelled) return;

        // Initialize Stream Video Client and join Audio-Only Call
        const { client, call } = await setupStreamAudioCall(credentials, {
          id: userId,
          name: userName,
          image: user?.imageUrl,
        });

        if (isCancelled) return;

        clientRef.current = client;
        callRef.current = call;

        setSessionState("joined");
        setIsSpeaking(true);
      } catch (err: any) {
        console.warn("[Stream Call Error]:", err);
        if (!isCancelled) {
          setErrorMessage(err?.message || "Could not connect to call");
          setSessionState("joined");
        }
      }
    }

    void initAudioCall();

    const interval = setInterval(() => {
      setIsSpeaking((prev) => !prev);
    }, 3500);

    return () => {
      isCancelled = true;
      clearInterval(interval);
      if (callRef.current) {
        callRef.current.leave().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="font-['Poppins-Bold'] text-lg text-[#0D132B] mb-4 text-center">
            Lesson not found
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#6C4EF5] px-6 py-3 rounded-full"
          >
            <Text className="font-['Poppins-SemiBold'] text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const activePhrase =
    lesson.phrases && lesson.phrases[selectedPhraseIndex]
      ? lesson.phrases[selectedPhraseIndex]
      : {
          phrase: "Je m'appelle Alex. Enchanté !",
          translation: "My name is Alex. Nice to meet you!",
        };

  // Toggle Microphone
  const handleToggleMic = async () => {
    const nextMuteState = !isMuted;
    setIsMuted(nextMuteState);
    if (callRef.current) {
      try {
        if (nextMuteState) {
          await callRef.current.microphone.disable();
        } else {
          await callRef.current.microphone.enable();
        }
      } catch {
        // Fallback for web sandbox
      }
    }
  };

  // End Call and Complete Lesson
  const handleEndCall = async () => {
    setSessionState("ended");
    if (callRef.current) {
      try {
        await callRef.current.leave();
      } catch {}
    }
    completeLesson(lesson.id, lesson.xpReward);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View className="bg-white px-6 py-4 flex-row items-center justify-between border-b border-slate-100 z-20">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100/70 active:bg-slate-200"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color="#0D132B" />
        </TouchableOpacity>

        <View className="items-center">
          <View className="flex-row items-center gap-1.5 mb-0.5">
            <Text className="font-['Poppins-Bold'] text-xs text-[#6C4EF5]">
              {language?.code ? language.code.substring(0, 2).toUpperCase() : "FR"}
            </Text>
            <Text className="font-['Poppins-Bold'] text-base text-[#0D132B]">
              {lesson.title}
            </Text>
          </View>

          {/* Session Status Indicator */}
          <View className="flex-row items-center gap-1">
            {sessionState === "connecting" ? (
              <>
                <ActivityIndicator size="small" color="#FF9500" />
                <Text className="font-['Poppins-Medium'] text-xs text-[#FF9500]">
                  Connecting to Stream...
                </Text>
              </>
            ) : sessionState === "error" ? (
              <TouchableOpacity
                onPress={() => {
                  setSessionState("connecting");
                  void startAudioCall();
                }}
                className="flex-row items-center gap-1"
              >
                <View className="h-2 w-2 rounded-full bg-red-500" />
                <Text className="font-['Poppins-Medium'] text-xs text-red-500 underline">
                  {errorMessage || "Retry Call Setup"}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <View className="h-2 w-2 rounded-full bg-[#22C55E]" />
                <Text className="font-['Poppins-Medium'] text-xs text-[#22C55E]">
                  {isMuted
                    ? "Microphone Muted"
                    : isSpeaking
                    ? "AI Tutor speaking..."
                    : "Listening to you..."}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Top Right 'Aa' Subtitle Toggle Circle */}
        <TouchableOpacity
          onPress={() => setShowSubtitles((prev) => !prev)}
          className="h-10 w-10 items-center justify-center rounded-full bg-[#F0EDFE] active:opacity-80"
        >
          <Text className="font-['Poppins-Bold'] text-sm text-[#6C4EF5]">
            Aa
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Centered Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-xl w-full mx-auto flex-1 items-center justify-center py-4 px-4">
          {/* User Info Chip */}
          <View className="bg-slate-100/80 px-3 py-1 rounded-full flex-row items-center mb-4 border border-slate-200/60">
            <Ionicons name="person-circle-outline" size={16} color="#6C4EF5" style={{ marginRight: 4 }} />
            <Text className="font-['Poppins-Medium'] text-xs text-[#0D132B]">
              Learner: {userName}
            </Text>
          </View>

          {/* Teacher Avatar Ring */}
          <View className="items-center mb-6">
            <View className="h-24 w-24 rounded-full border-4 border-[#6C4EF5] bg-[#F6F4FE] items-center justify-center overflow-hidden shadow-md">
              <Image
                source={images.mascot}
                style={{ width: 68, height: 68 }}
                resizeMode="contain"
              />
            </View>

            <Text className="font-['Poppins-Bold'] text-xl text-[#0D132B] mt-3">
              {teacherPersona.name}
            </Text>
            <Text className="font-['Poppins-Medium'] text-xs text-[#8E8A9F] mt-0.5">
              {teacherPersona.title}
            </Text>
          </View>

          {/* Live Transcript Bubble */}
          {showSubtitles && (
            <View className="bg-[#F6F4FE] border border-[#DCD5FD] rounded-3xl p-5 w-full mb-6 shadow-xs">
              <View className="flex-row items-center justify-between mb-3">
                <View className="bg-[#6C4EF5] px-3 py-1 rounded-full">
                  <Text className="font-['Poppins-Bold'] text-[10px] text-white uppercase tracking-wider">
                    LIVE TRANSCRIPT
                  </Text>
                </View>
                <Ionicons name="volume-medium" size={16} color="#6C4EF5" />
              </View>

              <Text className="font-['Poppins-Bold'] text-base text-[#0D132B] leading-relaxed">
                {`"${activePhrase.phrase} — ${activePhrase.translation}"`}
              </Text>
            </View>
          )}

          {/* Suggested Phrases Section */}
          <View className="w-full mb-4">
            <Text className="font-['Poppins-Bold'] text-[11px] text-[#A09CB0] uppercase tracking-wider mb-2.5 px-1">
              SUGGESTED PHRASES TO SPEAK
            </Text>

            {lesson.phrases && lesson.phrases.length > 0 ? (
              lesson.phrases.map((phraseItem, index) => (
                <TouchableOpacity
                  key={phraseItem.id || index}
                  onPress={() => setSelectedPhraseIndex(index)}
                  activeOpacity={0.85}
                  className={`bg-white border rounded-2xl p-4 mb-3 flex-row items-center justify-between shadow-xs ${
                    selectedPhraseIndex === index
                      ? "border-[#6C4EF5] bg-purple-50/30"
                      : "border-slate-200/80"
                  }`}
                >
                  <View className="flex-1 pr-3">
                    <Text className="font-['Poppins-Bold'] text-sm text-[#6C4EF5]">
                      {phraseItem.phrase}
                    </Text>
                    <Text className="font-['Poppins-Regular'] text-xs text-[#8E8A9F] mt-0.5">
                      {phraseItem.translation}
                    </Text>
                  </View>
                  <Ionicons name="mic" size={18} color="#6C4EF5" />
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 flex-row items-center justify-between shadow-xs"
              >
                <View className="flex-1 pr-3">
                  <Text className="font-['Poppins-Bold'] text-sm text-[#6C4EF5]">
                    {"Je m'appelle Alex. Enchanté !"}
                  </Text>
                  <Text className="font-['Poppins-Regular'] text-xs text-[#8E8A9F] mt-0.5">
                    My name is Alex. Nice to meet you!
                  </Text>
                </View>
                <Ionicons name="mic" size={18} color="#6C4EF5" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Control Bar */}
      <View className="bg-white border-t border-slate-100 py-4 px-6 z-20">
        <View className="max-w-md w-full mx-auto flex-row items-center justify-around">
          {/* Mute/Unmute Mic Button */}
          <TouchableOpacity
            onPress={handleToggleMic}
            className={`h-14 w-14 rounded-full items-center justify-center shadow-xs ${
              isMuted ? "bg-red-100" : "bg-slate-100/90"
            }`}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isMuted ? "mic-off" : "mic"}
              size={22}
              color={isMuted ? "#EF4444" : "#0D132B"}
            />
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity
            onPress={handleEndCall}
            className="h-16 w-16 rounded-full bg-[#FF3B30] items-center justify-center shadow-md active:opacity-90"
            activeOpacity={0.8}
          >
            <Ionicons
              name="call"
              size={26}
              color="#FFFFFF"
              style={{ transform: [{ rotate: "135deg" }] }}
            />
          </TouchableOpacity>

          {/* Chat Bubble / Transcript Button */}
          <TouchableOpacity
            onPress={() => setShowSubtitles((prev) => !prev)}
            className={`h-14 w-14 rounded-full items-center justify-center shadow-xs active:opacity-80 ${
              showSubtitles ? "bg-[#F0EDFE]" : "bg-slate-100"
            }`}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={22}
              color={showSubtitles ? "#6C4EF5" : "#8E8A9F"}
            />
          </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
