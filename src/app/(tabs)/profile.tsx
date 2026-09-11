import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 items-center justify-center px-6">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-lingua-purple/10 mb-4">
          <Ionicons name="person-outline" size={32} color="#6C4EF5" />
        </View>
        <Text className="font-['Poppins-Bold'] text-2xl text-text-primary text-center">
          Profile & Progress
        </Text>
        <Text className="font-['Poppins-Regular'] text-sm text-text-secondary mt-2 text-center">
          Learner stats, XP history, and account settings coming soon!
        </Text>
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
