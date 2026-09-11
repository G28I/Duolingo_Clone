import "../../global.css";
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useAppFonts } from "@/hooks/useAppFonts";
import { useLanguageStore } from "@/store/useLanguageStore";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { selectedLanguage, hasHydrated } = useLanguageStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !hasHydrated) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inSsoCallback = segments[0] === "sso-callback";
    const inLanguageSelect = segments[0] === "language-select";

    if (isSignedIn) {
      if (!selectedLanguage) {
        // Authenticated user without selected language must be on language-select
        if (!inLanguageSelect) {
          router.replace("/language-select");
        }
      } else {
        // Authenticated user with selected language should leave auth / callback / language-select
        if (inAuthGroup || inSsoCallback || inLanguageSelect) {
          router.replace("/(tabs)");
        }
      }
    } else {
      // Unauthenticated users attempting to access protected screens redirect to onboarding
      if (!inAuthGroup && !inSsoCallback) {
        router.replace("/(auth)/onboarding");
      }
    }
  }, [isLoaded, isSignedIn, selectedLanguage, hasHydrated, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
}

