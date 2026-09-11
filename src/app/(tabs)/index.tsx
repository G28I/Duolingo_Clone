import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { images } from "@/constants/images";
import { useLanguageStore } from "@/store/useLanguageStore";
import { getLessonsForLanguage, getUnitsForLanguage } from "@/data";

export default function HomeScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { selectedLanguage } = useLanguageStore();
  const insets = useSafeAreaInsets();

  const topInset = Math.max(
    insets.top,
    Platform.OS === "android" ? (RNStatusBar.currentHeight || 28) : 0
  );

  const userFirstName = useMemo(() => {
    return user?.firstName || user?.username || "Alex";
  }, [user]);

  const greetingPrefix = useMemo(() => {
    switch (selectedLanguage?.id) {
      case "fr":
        return "Bonjour";
      case "de":
        return "Hallo";
      case "ja":
        return "Konnichiwa";
      case "es":
      default:
        return "Hola";
    }
  }, [selectedLanguage]);

  const languageUnits = useMemo(() => {
    if (!selectedLanguage?.id) return [];
    return getUnitsForLanguage(selectedLanguage.id);
  }, [selectedLanguage]);

  const currentUnitText = useMemo(() => {
    if (languageUnits.length > 0) {
      return `A1 • Unit ${languageUnits[0].order}`;
    }
    return "A1 • Unit 3";
  }, [languageUnits]);

  const firstLessonTitle = useMemo(() => {
    if (!selectedLanguage?.id) return "At the café";
    const lessons = getLessonsForLanguage(selectedLanguage.id);
    return lessons.length > 0 ? lessons[0].title : "At the café";
  }, [selectedLanguage]);

  if (!isLoaded || !isSignedIn) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header Bar */}
        <View
          style={{ paddingTop: Math.max(topInset, 12) }}
          className="mb-5 flex-row items-center justify-between"
        >
          {/* Left: Language Flag + Greeting */}
          <View className="flex-row items-center gap-2 flex-1 mr-2">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-gray-100 shadow-sm overflow-hidden border border-gray-200 flex-shrink-0">
              <Text className="text-xl">
                {selectedLanguage?.flag || "🇯🇵"}
              </Text>
            </View>
            <Text
              numberOfLines={1}
              className="font-['Poppins-Bold'] text-lg text-[#1E1B4B] flex-1"
            >
              {greetingPrefix}, {userFirstName}! 👋
            </Text>
          </View>

          {/* Right: Streak & Notifications & Sign Out */}
          <View className="flex-row items-center gap-2 flex-shrink-0">
            {/* Streak Badge */}
            <View className="flex-row items-center gap-1.5 rounded-full bg-white px-2.5 py-1 border border-gray-100 shadow-sm">
              <Image
                source={images.streakFire}
                style={styles.streakIcon}
                resizeMode="contain"
              />
              <Text className="font-['Poppins-Bold'] text-sm text-[#1E1B4B]">
                12
              </Text>
            </View>

            {/* Notification Bell */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm"
            >
              <Ionicons name="notifications-outline" size={18} color="#1E1B4B" />
            </TouchableOpacity>

            {/* Sign Out Button */}
            <TouchableOpacity
              onPress={() => signOut()}
              activeOpacity={0.7}
              accessibilityLabel="Sign Out"
              className="h-9 w-9 items-center justify-center rounded-full bg-red-50 border border-red-100 shadow-sm active:opacity-80"
            >
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 1: Daily Goal Card */}
        <View className="relative mb-5 flex-row items-center justify-between rounded-[24px] bg-[#FFF9F2] p-5 border border-[#FFF0E0]/60">
          <View className="flex-1 pr-4">
            <Text className="font-['Poppins-Medium'] text-sm text-[#8E8A9F]">
              Daily goal
            </Text>

            <View className="mt-1 flex-row items-baseline">
              <Text className="font-['Poppins-Bold'] text-2xl text-[#1E1B4B]">
                15
              </Text>
              <Text className="font-['Poppins-Medium'] text-sm text-[#8E8A9F] ml-1">
                / 20 XP
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="mt-3.5 h-3 w-44 rounded-full bg-[#FFE8D6] overflow-hidden">
              <View className="h-full w-[75%] rounded-full bg-[#FF9600]" />
            </View>
          </View>

          {/* Treasure Illustration */}
          <Image
            source={images.treasure}
            style={styles.treasureImage}
            resizeMode="contain"
          />
        </View>

        {/* Section 2: Continue Learning Hero Banner */}
        <View className="relative mb-6 overflow-hidden rounded-[24px] bg-[#5A31E1] p-5 shadow-sm">
          {/* Palace Background Illustration */}
          <Image
            source={images.palace}
            style={styles.palaceImage}
            resizeMode="contain"
          />

          <View className="z-10 max-w-[65%]">
            <Text className="font-['Poppins-Medium'] text-xs text-white/80">
              Continue learning
            </Text>

            <Text className="font-['Poppins-Bold'] text-2xl text-white mt-1">
              {selectedLanguage?.name || "Spanish"}
            </Text>

            <Text className="font-['Poppins-Regular'] text-xs text-white/80 mt-0.5 mb-5">
              {currentUnitText}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/(tabs)/learn")}
              className="rounded-full bg-white px-6 py-2.5 self-start shadow-sm"
            >
              <Text className="font-['Poppins-Bold'] text-sm text-[#5A31E1]">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 3: Today's Plan */}
        <View className="mb-6">
          <View className="mb-3.5 flex-row items-center justify-between">
            <Text className="font-['Poppins-Bold'] text-lg text-[#1E1B4B]">
              {"Today's plan"}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(tabs)/learn")}
            >
              <Text className="font-['Poppins-Bold'] text-sm text-[#6C4EF5]">
                View all
              </Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {/* Plan Item 1: Lesson (Completed) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)/learn")}
              className="flex-row items-center justify-between rounded-2xl bg-white p-3 border border-gray-100 shadow-sm"
            >
              <View className="flex-row items-center gap-3.5">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#6C4EF5]">
                  <Ionicons name="book" size={22} color="#FFFFFF" />
                </View>
                <View>
                  <Text className="font-['Poppins-Bold'] text-base text-[#1E1B4B]">
                    Lesson
                  </Text>
                  <Text className="font-['Poppins-Regular'] text-xs text-[#8E8A9F] mt-0.5">
                    {firstLessonTitle}
                  </Text>
                </View>
              </View>

              <Ionicons name="checkmark-circle" size={26} color="#6C4EF5" />
            </TouchableOpacity>

            {/* Plan Item 2: AI Conversation */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)/chat")}
              className="flex-row items-center justify-between rounded-2xl bg-white p-3 border border-gray-100 shadow-sm"
            >
              <View className="flex-row items-center gap-3.5">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#6C4EF5]">
                  <Ionicons name="headset" size={22} color="#FFFFFF" />
                </View>
                <View>
                  <Text className="font-['Poppins-Bold'] text-base text-[#1E1B4B]">
                    AI Conversation
                  </Text>
                  <Text className="font-['Poppins-Regular'] text-xs text-[#8E8A9F] mt-0.5">
                    Talk about your day
                  </Text>
                </View>
              </View>

              <Ionicons name="ellipse-outline" size={26} color="#CBD5E1" />
            </TouchableOpacity>

            {/* Plan Item 3: New words */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)/learn")}
              className="flex-row items-center justify-between rounded-2xl bg-white p-3 border border-gray-100 shadow-sm"
            >
              <View className="flex-row items-center gap-3.5">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5C5C]">
                  <Ionicons name="chatbubbles" size={22} color="#FFFFFF" />
                </View>
                <View>
                  <Text className="font-['Poppins-Bold'] text-base text-[#1E1B4B]">
                    New words
                  </Text>
                  <Text className="font-['Poppins-Regular'] text-xs text-[#8E8A9F] mt-0.5">
                    10 words
                  </Text>
                </View>
              </View>

              <Ionicons name="ellipse-outline" size={26} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 4: AI Video Call ("Next up") Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/(tabs)/ai-teacher")}
          className="flex-row items-center justify-between rounded-[24px] bg-[#EFF9EC] p-4.5 border border-[#DCFCE7]/60 mb-4"
        >
          <View>
            <Text className="font-['Poppins-Medium'] text-xs text-[#52796F]">
              Next up
            </Text>
            <Text className="font-['Poppins-Bold'] text-base text-[#1E1B4B] mt-0.5">
              AI Video Call
            </Text>
            <Text className="font-['Poppins-Regular'] text-xs text-[#6B7280] mt-0.5">
              Practice speaking
            </Text>
          </View>

          {/* Right Avatar & Call Action Button */}
          <View className="flex-row items-center gap-2">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
              }}
              style={styles.avatarImage}
              className="border-2 border-white shadow-sm"
              resizeMode="cover"
            />
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#58CC02] shadow-md">
              <Ionicons name="videocam" size={20} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 28,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  streakIcon: {
    width: 20,
    height: 20,
  },
  treasureImage: {
    width: 96,
    height: 80,
  },
  palaceImage: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 160,
    height: 144,
    opacity: 0.95,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});
