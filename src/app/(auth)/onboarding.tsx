import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 justify-between bg-white">
        {/* Top Section */}
        <View>
          {/* Brand Logo Header */}
          <View className="flex-row items-center justify-center pt-3 pb-2">
            <Image
              source={images.mascot}
              className="h-9 w-9"
              resizeMode="contain"
            />
            <Text className="font-['Poppins-Bold'] text-[26px] tracking-tight text-text-primary ml-2">
              muolingo
            </Text>
          </View>

          {/* Headline & Subtitle */}
          <View className="mt-7 px-7">
            <Text className="font-['Poppins-Bold'] text-[32px] leading-[40px] text-text-primary">
              Your AI language{"\n"}
              <Text className="text-lingua-purple">teacher</Text>.
            </Text>
            <Text className="font-['Poppins-Regular'] text-[15px] leading-[24px] text-text-secondary mt-3">
              Real conversations, personalized{"\n"}lessons, anytime, anywhere.
            </Text>
          </View>
        </View>

        {/* Center Illustration */}
        <View className="flex-1 items-center justify-center px-4 my-2">
          <Image
            source={images.onboardingIllustration}
            className="w-full max-w-[340px] h-[330px]"
            resizeMode="contain"
          />
        </View>

        {/* Bottom CTA Section (Pagination dots omitted per user instruction) */}
        <View className="px-6 pb-6 pt-2">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/sign-up")}
            className="lingua-button lingua-button--primary w-full relative flex-row items-center justify-center py-4 rounded-2xl"
          >
            <Text className="font-['Poppins-SemiBold'] text-[17px] text-white">
              Get Started
            </Text>
            <View className="absolute right-6 top-0 bottom-0 justify-center">
              <Text className="font-['Poppins-Bold'] text-2xl leading-none text-white">
                ›
              </Text>
            </View>
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
});
