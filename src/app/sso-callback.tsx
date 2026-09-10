import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth, useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";

export default function SSOCallbackScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();
  const router = useRouter();
  const [statusText, setStatusText] = useState("Signing you in...");

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace("/");
      return;
    }

    async function handleWebCallback() {
      if (clerk && typeof (clerk as any).handleRedirectCallback === "function") {
        try {
          await (clerk as any).handleRedirectCallback({
            signInFallbackRedirectUrl: "/",
            signUpFallbackRedirectUrl: "/",
          });
        } catch (err: any) {
          console.error("[SSOCallback] handleRedirectCallback error:", err);
          setStatusText("Authentication failed. Please try again.");
        }
      }
    }

    handleWebCallback();
  }, [isLoaded, isSignedIn, clerk, router]);

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <ActivityIndicator size="large" color="#6C5CE7" />
      <Text className="font-['Poppins-Medium'] text-sm text-text-secondary mt-4 text-center">
        {statusText}
      </Text>
    </View>
  );
}




