import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth, useClerk, useUser } from "@clerk/expo";
import { images } from "@/constants/images";
import { theme } from "@/theme";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function HomeScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const { signOut } = clerk;
  const { selectedLanguage, clearSelectedLanguage } = useLanguageStore();
  const [streakCount, setStreakCount] = useState(5);
  const [activeTab, setActiveTab] = useState<"all" | "colors" | "typography" | "components">("all");

  if (!isLoaded || !isSignedIn) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Brand Header */}
        <View className="mb-6 flex-row items-center justify-between border-b border-border pb-4">
          <View className="flex-row items-center">
            <Image
              source={images.mascotLogo}
              className="h-12 w-36"
              resizeMode="contain"
            />
          </View>
          <View className="lingua-badge lingua-badge--streak flex-row items-center gap-1.5 px-3 py-1.5">
            <Text className="text-sm">🔥</Text>
            <Text className="font-['Poppins-Bold'] text-sm text-streak">
              {streakCount} Days
            </Text>
          </View>
        </View>

        {/* Authenticated User Status & Sign Out */}
        <View className="mb-4 flex-row items-center justify-between rounded-2xl border border-border bg-[#F5F3FF] p-3.5">
          <View className="flex-1 mr-3">
            <Text className="font-['Poppins-Bold'] text-sm text-text-primary">
              Welcome, {user?.firstName || user?.username || "Student"}!
            </Text>
            <Text numberOfLines={1} className="font-['Poppins-Regular'] text-xs text-text-secondary mt-0.5">
              {user?.primaryEmailAddress?.emailAddress || "Signed in with Clerk"}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => signOut()}
            className="rounded-xl bg-white px-3.5 py-2 border border-border"
          >
            <Text className="font-['Poppins-Bold'] text-xs text-error">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Language & Clear Storage Test Card */}
        <View className="mb-4 rounded-2xl border border-border bg-[#F8F9FB] p-3.5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Text className="text-3xl">{selectedLanguage?.flag || "🌐"}</Text>
              <View>
                <Text className="font-['Poppins-Bold'] text-sm text-text-primary">
                  Learning {selectedLanguage?.name || "No Language Selected"}
                </Text>
                <Text className="font-['Poppins-Regular'] text-xs text-text-secondary">
                  {selectedLanguage?.nativeName} · {selectedLanguage?.totalLessons || 0} lessons
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/language-select")}
              className="rounded-xl border border-border bg-white px-3 py-1.5"
            >
              <Text className="font-['Poppins-Medium'] text-xs text-lingua-purple">
                Change
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              await clearSelectedLanguage();
            }}
            className="mt-3 flex-row items-center justify-center rounded-xl bg-error/10 py-2 px-3 border border-error/20"
          >
            <Text className="font-['Poppins-Medium'] text-xs text-error">
              🗑️ Clear Language Storage (Test Selection Re-routing)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Onboarding Navigation Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/onboarding")}
          className="mb-4 flex-row items-center justify-between rounded-2xl bg-lingua-purple p-4"
        >
          <View className="flex-row items-center gap-3">
            <Image
              source={images.mascot}
              className="h-12 w-12"
              resizeMode="contain"
            />
            <View>
              <Text className="font-['Poppins-Bold'] text-base text-white">
                View Onboarding Screen
              </Text>
              <Text className="font-['Poppins-Regular'] text-xs text-white/80">
                Your AI language teacher · muolingo
              </Text>
            </View>
          </View>
          <View className="h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Text className="font-['Poppins-Bold'] text-lg text-white">›</Text>
          </View>
        </TouchableOpacity>

        {/* Language Selection Navigation Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/language-select")}
          className="mb-4 flex-row items-center justify-between rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] p-4"
        >
          <View className="flex-row items-center gap-3">
            <Image
              source={images.earth}
              className="h-12 w-12 rounded-xl"
              resizeMode="contain"
            />
            <View>
              <Text className="font-['Poppins-Bold'] text-base text-[#166534]">
                Choose Language
              </Text>
              <Text className="font-['Poppins-Regular'] text-xs text-[#15803D]">
                Spanish, French, Japanese, German & more
              </Text>
            </View>
          </View>
          <View className="h-8 w-8 items-center justify-center rounded-full bg-[#DCFCE7]">
            <Text className="font-['Poppins-Bold'] text-lg text-[#166534]">›</Text>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
