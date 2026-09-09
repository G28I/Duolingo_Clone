import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router";
import { useAuth, useClerk, useUser } from "@clerk/expo";
import { images } from "@/constants/images";
import { theme } from "@/theme";

export default function DesignSystemScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [streakCount, setStreakCount] = useState(5);
  const [activeTab, setActiveTab] = useState<"all" | "colors" | "typography" | "components">("all");

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/onboarding" />;
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

        {/* Auth Navigation Quick Cards */}
        <View className="mb-6 flex-row gap-3">
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push("/sign-up")}
            className="flex-1 rounded-2xl border border-border bg-white p-3.5"
          >
            <Text className="font-['Poppins-Bold'] text-sm text-text-primary">
              Sign Up Screen
            </Text>
            <Text className="font-['Poppins-Regular'] text-xs text-text-secondary mt-0.5">
              Create account & OTP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push("/sign-in")}
            className="flex-1 rounded-2xl border border-border bg-white p-3.5"
          >
            <Text className="font-['Poppins-Bold'] text-sm text-text-primary">
              Sign In Screen
            </Text>
            <Text className="font-['Poppins-Regular'] text-xs text-text-secondary mt-0.5">
              Passwordless login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Tabs */}
        <View className="mb-6 flex-row gap-2">
          {(["all", "colors", "typography", "components"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 ${
                activeTab === tab ? "bg-lingua-purple" : "bg-surface"
              }`}
            >
              <Text
                className={`font-['Poppins-Medium'] text-xs capitalize ${
                  activeTab === tab ? "text-white" : "text-text-secondary"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BRAND SECTION */}
        {(activeTab === "all" || activeTab === "components") && (
          <View className="lingua-card mb-6">
            <Text className="font-['Poppins-Bold'] text-xs tracking-wider text-lingua-purple uppercase">
              Brand
            </Text>
            <View className="mt-4 flex-row items-center gap-4">
              <Image
                source={images.mascot}
                className="h-20 w-20"
                resizeMode="contain"
              />
              <View className="flex-1">
                <Text className="typography__h2 text-text-primary">Lingua</Text>
                <Text className="typography__body-medium mt-1 text-text-secondary">
                  Friendly, playful AI language learning companion.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* COLORS SECTION */}
        {(activeTab === "all" || activeTab === "colors") && (
          <View className="lingua-card mb-6">
            <Text className="font-['Poppins-Bold'] text-xs tracking-wider text-lingua-purple uppercase">
              Colors
            </Text>

            {/* Primary Colors */}
            <View className="mt-4">
              <Text className="font-['Poppins-SemiBold'] text-xs tracking-wider text-text-secondary uppercase">
                Primary
              </Text>
              <View className="mt-3 flex-row flex-wrap gap-3">
                <ColorCard
                  title="LINGUA PURPLE"
                  hex={theme.colors.primary.purple}
                  bgClass="bg-lingua-purple"
                />
                <ColorCard
                  title="LINGUA DEEP PURPLE"
                  hex={theme.colors.primary.deepPurple}
                  bgClass="bg-lingua-deep-purple"
                />
                <ColorCard
                  title="LINGUA BLUE"
                  hex={theme.colors.primary.blue}
                  bgClass="bg-lingua-blue"
                />
                <ColorCard
                  title="LINGUA GREEN"
                  hex={theme.colors.primary.green}
                  bgClass="bg-lingua-green"
                />
              </View>
            </View>

            {/* Semantic Colors */}
            <View className="mt-6">
              <Text className="font-['Poppins-SemiBold'] text-xs tracking-wider text-text-secondary uppercase">
                Semantic
              </Text>
              <View className="mt-3 flex-row flex-wrap gap-3">
                <ColorCard
                  title="SUCCESS"
                  hex={theme.colors.semantic.success}
                  bgClass="bg-success"
                />
                <ColorCard
                  title="WARNING"
                  hex={theme.colors.semantic.warning}
                  bgClass="bg-warning"
                />
                <ColorCard
                  title="STREAK"
                  hex={theme.colors.semantic.streak}
                  bgClass="bg-streak"
                />
                <ColorCard
                  title="ERROR"
                  hex={theme.colors.semantic.error}
                  bgClass="bg-error"
                />
                <ColorCard
                  title="INFO"
                  hex={theme.colors.semantic.info}
                  bgClass="bg-info"
                />
              </View>
            </View>

            {/* Neutral Colors */}
            <View className="mt-6">
              <Text className="font-['Poppins-SemiBold'] text-xs tracking-wider text-text-secondary uppercase">
                Neutrals
              </Text>
              <View className="mt-3 flex-row flex-wrap gap-3">
                <ColorCard
                  title="TEXT / PRIMARY"
                  hex={theme.colors.neutrals.textPrimary}
                  bgClass="bg-text-primary"
                  isDark
                />
                <ColorCard
                  title="TEXT / SECONDARY"
                  hex={theme.colors.neutrals.textSecondary}
                  bgClass="bg-text-secondary"
                  isDark
                />
                <ColorCard
                  title="BORDER"
                  hex={theme.colors.neutrals.border}
                  bgClass="bg-border"
                />
                <ColorCard
                  title="SURFACE"
                  hex={theme.colors.neutrals.surface}
                  bgClass="bg-surface"
                />
                <ColorCard
                  title="BACKGROUND"
                  hex={theme.colors.neutrals.background}
                  bgClass="bg-background"
                  hasBorder
                />
              </View>
            </View>
          </View>
        )}

        {/* TYPOGRAPHY SECTION */}
        {(activeTab === "all" || activeTab === "typography") && (
          <View className="lingua-card mb-6">
            <Text className="font-['Poppins-Bold'] text-xs tracking-wider text-lingua-purple uppercase">
              Typography
            </Text>
            <View className="mt-2">
              <Text className="font-['Poppins-Bold'] text-2xl text-text-primary">
                Poppins
              </Text>
              <Text className="typography__body-medium mt-1 text-text-secondary">
                Poppins is a modern, geometric sans-serif typeface that provides
                excellent readability and a friendly personality.
              </Text>
            </View>

            {/* Type Scale Demonstration */}
            <View className="mt-6 divide-y divide-border">
              <TypeRow
                tag="H1"
                usage="Page / Screen Title"
                spec="32px · Bold · 1.2"
                render={<Text className="typography__h1">H1 Heading</Text>}
              />
              <TypeRow
                tag="H2"
                usage="Section Title"
                spec="24px · SemiBold · 1.3"
                render={<Text className="typography__h2">H2 Section Title</Text>}
              />
              <TypeRow
                tag="H3"
                usage="Card / Module Title"
                spec="20px · SemiBold · 1.3"
                render={<Text className="typography__h3">H3 Module Title</Text>}
              />
              <TypeRow
                tag="H4"
                usage="Subheading"
                spec="16px · Medium · 1.4"
                render={<Text className="typography__h4">H4 Subheading Text</Text>}
              />
              <TypeRow
                tag="Body Large"
                usage="Important content"
                spec="16px · Regular · 1.6"
                render={
                  <Text className="typography__body-large">
                    Body Large: Essential learning instructions and lesson highlights.
                  </Text>
                }
              />
              <TypeRow
                tag="Body Medium"
                usage="Body text"
                spec="14px · Regular · 1.6"
                render={
                  <Text className="typography__body-medium">
                    Body Medium: Standard paragraph text for lessons, feedback, and tips.
                  </Text>
                }
              />
              <TypeRow
                tag="Body Small"
                usage="Supporting text"
                spec="13px · Regular · 1.6"
                render={
                  <Text className="typography__body-small">
                    Body Small: Secondary hints, timestamps, and metadata.
                  </Text>
                }
              />
              <TypeRow
                tag="Caption"
                usage="Labels, meta text"
                spec="11px · Regular · 1.4"
                render={
                  <Text className="typography__caption">
                    CAPTION: BADGE LABELS &amp; SYSTEM TAGS
                  </Text>
                }
              />
            </View>
          </View>
        )}

        {/* COMPONENTS SECTION */}
        {(activeTab === "all" || activeTab === "components") && (
          <View className="lingua-card mb-6">
            <Text className="font-['Poppins-Bold'] text-xs tracking-wider text-lingua-purple uppercase">
              Components
            </Text>

            {/* Playful 3D Buttons */}
            <View className="mt-4 gap-3">
              <Text className="font-['Poppins-SemiBold'] text-xs tracking-wider text-text-secondary uppercase">
                Playful 3D Buttons
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                className="lingua-button lingua-button--primary"
              >
                <Text className="font-['Poppins-Bold'] text-base text-white">
                  Continue Lesson
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                className="lingua-button lingua-button--success"
              >
                <Text className="font-['Poppins-Bold'] text-base text-white">
                  Check Answer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setStreakCount((prev) => prev + 1)}
                className="lingua-button lingua-button--streak"
              >
                <Text className="font-['Poppins-Bold'] text-base text-white">
                  Increase Streak 🔥
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                className="lingua-button lingua-button--secondary"
              >
                <Text className="font-['Poppins-Bold'] text-base text-white">
                  Explore Courses
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                className="lingua-button lingua-button--outline"
              >
                <Text className="font-['Poppins-Bold'] text-base text-text-primary">
                  Skip for Now
                </Text>
              </TouchableOpacity>
            </View>

            {/* Badges & Chips */}
            <View className="mt-6">
              <Text className="font-['Poppins-SemiBold'] text-xs tracking-wider text-text-secondary uppercase">
                Badges &amp; Status Chips
              </Text>
              <View className="mt-3 flex-row flex-wrap gap-2">
                <View className="lingua-badge lingua-badge--purple">
                  <Text className="font-['Poppins-SemiBold'] text-xs text-lingua-purple">
                    Level 1 Beginner
                  </Text>
                </View>

                <View className="lingua-badge lingua-badge--success">
                  <Text className="font-['Poppins-SemiBold'] text-xs text-success">
                    ✓ 100% Completed
                  </Text>
                </View>

                <View className="lingua-badge lingua-badge--streak">
                  <Text className="font-['Poppins-SemiBold'] text-xs text-streak">
                    ⚡ 50 XP Boost
                  </Text>
                </View>
              </View>
            </View>

            {/* Surface Card Example */}
            <View className="lingua-card--surface mt-6">
              <Text className="font-['Poppins-SemiBold'] text-sm text-text-primary">
                Surface Card Module
              </Text>
              <Text className="typography__body-small mt-1">
                Uses the neutral surface token (#F6F7FB) with subtle borders for high-contrast card grouping.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ColorCard({
  title,
  hex,
  bgClass,
  isDark = false,
  hasBorder = false,
}: {
  title: string;
  hex: string;
  bgClass: string;
  isDark?: boolean;
  hasBorder?: boolean;
}) {
  return (
    <View className="w-[47%] rounded-2xl border border-border bg-white p-2.5">
      <View
        className={`h-14 w-full rounded-xl ${bgClass} ${
          hasBorder ? "border border-border" : ""
        }`}
      />
      <View className="mt-2">
        <Text
          numberOfLines={1}
          className="font-['Poppins-SemiBold'] text-[11px] text-text-primary"
        >
          {title}
        </Text>
        <Text className="font-['Poppins-Regular'] text-[10px] text-text-secondary">
          {hex}
        </Text>
      </View>
    </View>
  );
}

function TypeRow({
  tag,
  usage,
  spec,
  render,
}: {
  tag: string;
  usage: string;
  spec: string;
  render: React.ReactNode;
}) {
  return (
    <View className="py-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="font-['Poppins-Bold'] text-xs text-lingua-purple">
            {tag}
          </Text>
          <Text className="font-['Poppins-Regular'] text-xs text-text-secondary">
            {usage}
          </Text>
        </View>
        <Text className="font-['Poppins-Regular'] text-[10px] text-text-secondary">
          {spec}
        </Text>
      </View>
      <View className="mt-1.5">{render}</View>
    </View>
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
    paddingBottom: 40,
  },
});
