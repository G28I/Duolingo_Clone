import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { FlagCircle } from "@/components/FlagCircle";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { selectedLanguage, setSelectedLanguage } = useLanguageStore();
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(
    selectedLanguage?.id || "es"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    const targetLang =
      languages.find((l) => l.id === selectedLanguageId) || languages[0];
    setSelectedLanguage(targetLang);
    router.replace("/(tabs)/index");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 w-full max-w-md mx-auto bg-white">
        {/* Header Bar */}
        <View className="flex-row items-center justify-between border-b border-border/30 px-5 pt-2 pb-3">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/index"))}
            className="h-10 w-10 items-center justify-center rounded-full"
          >
            <Text className="font-['Poppins-Bold'] text-2xl text-text-primary">
              ‹
            </Text>
          </TouchableOpacity>
          <Text className="font-['Poppins-Bold'] text-[18px] text-text-primary mr-10 flex-1 text-center">
            Choose a language
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Search Bar */}
          <View className="mx-5 mt-4 mb-5 flex-row items-center rounded-full border border-[#E9ECEF] bg-[#F8F9FB] px-4 py-2.5">
            <Text className="text-base text-text-secondary mr-2.5">🔍</Text>
            <TextInput
              placeholder="Search languages"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 font-['Poppins-Regular'] text-[15px] text-text-primary"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSearchQuery("")}
                className="h-6 w-6 items-center justify-center rounded-full bg-border"
              >
                <Text className="font-['Poppins-Bold'] text-xs text-text-secondary">
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Popular Section Title */}
          <View className="px-5 mb-3">
            <Text className="font-['Poppins-Bold'] text-[17px] text-text-primary">
              Popular
            </Text>
          </View>

          {/* Language Cards List */}
          <View className="px-5 gap-3">
            {filteredLanguages.map((lang) => {
              const isSelected = selectedLanguageId === lang.id;
              return (
                <TouchableOpacity
                  key={lang.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedLanguageId(lang.id)}
                  className={`flex-row items-center justify-between rounded-2xl p-4 bg-white ${
                    isSelected
                      ? "border-2 border-lingua-purple"
                      : "border border-[#F0F0F0]"
                  }`}
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <FlagCircle
                      languageId={lang.id}
                      flagEmoji={lang.flag}
                      size={44}
                    />
                    <View className="ml-3.5 flex-1">
                      <Text className="font-['Poppins-Bold'] text-[16px] text-text-primary">
                        {lang.name}
                      </Text>
                      <Text className="font-['Poppins-Regular'] text-[13px] text-text-secondary mt-0.5">
                        {lang.totalLearners || `${lang.totalLessons} lessons`}
                      </Text>
                    </View>
                  </View>

                  {isSelected ? (
                    <View className="h-6 w-6 items-center justify-center rounded-full bg-lingua-purple">
                      <Text className="font-['Poppins-Bold'] text-xs text-white">
                        ✓
                      </Text>
                    </View>
                  ) : (
                    <Text className="font-['Poppins-Bold'] text-xl text-[#9CA3AF]">
                      ›
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}

            {filteredLanguages.length === 0 && (
              <View className="items-center justify-center py-8">
                <Text className="font-['Poppins-Regular'] text-sm text-text-secondary">
                  No languages found matching "{searchQuery}"
                </Text>
              </View>
            )}
          </View>

          {/* Confirmation Button replacing "See all languages" */}
          <View className="px-5 mt-5">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleConfirm}
              className="lingua-button lingua-button--primary w-full py-4 rounded-2xl shadow-sm"
            >
              <Text className="font-['Poppins-SemiBold'] text-[16px] text-white">
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          {/* Earth Illustration at the bottom */}
          <View className="w-full items-center justify-end mt-2 overflow-hidden">
            <Image
              source={images.earth}
              className="w-full h-48"
              resizeMode="contain"
            />
          </View>
        </ScrollView>
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
    paddingBottom: 24,
  },
});
