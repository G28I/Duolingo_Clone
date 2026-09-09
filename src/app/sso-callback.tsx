import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useClerk } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";

// Complete the browser-based auth session for web and popup redirects
WebBrowser.maybeCompleteAuthSession({ skipRedirectCheck: true });

export default function SSOCallbackScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const clerk = useClerk();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 1. If in a web popup window, complete the session and close the window so the parent resolves
    if (typeof window !== "undefined" && window.opener) {
      const handle = window.localStorage.getItem("expo-web-browser-state-handle");
      const url = window.location.href;

      // Call maybeCompleteAuthSession
      try {
        WebBrowser.maybeCompleteAuthSession({ skipRedirectCheck: true });
      } catch (e) {
        console.error("Popup maybeCompleteAuthSession error:", e);
      }

      // Explicitly postMessage to window.opener with both origin and * as safe fallbacks
      try {
        window.opener.postMessage({ url, expoSender: handle }, window.location.origin);
      } catch {
        try {
          window.opener.postMessage({ url, expoSender: handle }, "*");
        } catch (e) {
          console.error("Popup direct postMessage error:", e);
        }
      }

      // Store in origin url handle for AppState listener fallback
      if (handle) {
        try {
          window.localStorage.setItem(`expo-web-browser-state-origin-url-${handle}`, url);
        } catch {}
      }

      const closeTimer = setTimeout(() => {
        try {
          window.close();
        } catch {
          // ignore
        }
      }, 350);
      return () => clearTimeout(closeTimer);
    }

    // 2. If already signed in or session is available, navigate to home immediately
    if (isLoaded && (isSignedIn || clerk.session)) {
      router.replace("/");
      return;
    }

    // 3. If in main window and not signed in, let Clerk handle the redirect callback from URL params
    if (isLoaded && !isSignedIn && clerk) {
      if (typeof clerk.handleRedirectCallback === "function") {
        clerk
          .handleRedirectCallback(
            {
              signInFallbackRedirectUrl: "/",
              signUpFallbackRedirectUrl: "/",
              continueSignUpUrl: "/sso-callback",
            },
            async (to) => {
              // If session is already created and active, route directly to home
              if (clerk.session) {
                router.replace("/");
                return;
              }

              // Handle missing requirements (such as username required by Clerk instance)
              const currentSignUp = clerk.client?.signUp;
              if (currentSignUp && currentSignUp.status === "missing_requirements") {
                const missing = currentSignUp.missingFields || [];
                const updatePayload: Record<string, any> = {};

                if (missing.includes("username")) {
                  const emailPrefix = (currentSignUp.emailAddress || "user")
                    .split("@")[0]
                    .replace(/[^a-zA-Z0-9_]/g, "");
                  const cleanPrefix = emailPrefix.length >= 3 ? emailPrefix : `user_${emailPrefix}`;
                  updatePayload.username = `${cleanPrefix}_${Math.floor(1000 + Math.random() * 9000)}`;
                }

                try {
                  const updatedSignUp = await currentSignUp.update(updatePayload);
                  if (updatedSignUp.status === "complete" && updatedSignUp.createdSessionId) {
                    await clerk.setActive({ session: updatedSignUp.createdSessionId });
                    router.replace("/");
                    return;
                  }
                } catch (updateErr) {
                  console.error("Failed to auto-update missing fields in sso-callback:", updateErr);
                }
              }

              // Always navigate to "/" on successful redirect callback instead of routing to sign-in
              router.replace("/");
            }
          )
          .catch(async (err) => {
            console.error("handleRedirectCallback error:", err);
            if (clerk.session) {
              router.replace("/");
            } else {
              setErrorMessage(err.message || "Failed to complete sign in.");
            }
          });
      }
    }
  }, [isLoaded, isSignedIn, clerk, router]);

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <ActivityIndicator size="large" color="#6C5CE7" />
      <Text className="font-['Poppins-Medium'] text-sm text-text-secondary mt-4">
        {errorMessage ? errorMessage : "Signing you in..."}
      </Text>
    </View>
  );
}

