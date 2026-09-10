import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as AuthSession from "expo-auth-session";
import { useAuth, useSignIn, useSignUp, useSSO } from "@clerk/expo";
import { images } from "@/constants/images";
import VerificationModal from "@/components/VerificationModal";

export default function SignUpScreen() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    if (!password || password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp.password({
        emailAddress: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Sign up failed. Please check your credentials.");
        setIsSubmitting(false);
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setErrorMessage(sendError.message || "Failed to send verification code.");
        setIsSubmitting(false);
        return;
      }

      setShowVerification(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        return {
          success: false,
          error: error.message || "Invalid verification code.",
        };
      }

      const { error: finalizeError } = await signUp.finalize();

      if (finalizeError) {
        return {
          success: false,
          error: finalizeError.message || "Failed to finalize session.",
        };
      }

      router.replace("/(tabs)/index");
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Verification failed.",
      };
    }
  };

  const handleResendCode = async () => {
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      throw new Error(error.message || "Failed to resend code.");
    }
  };

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      console.log(`[SocialAuth] Starting ${strategy} via useSSO...`);

      const redirectUrl = AuthSession.makeRedirectUri({ path: "sso-callback" });
      console.log(`[SocialAuth] Redirect URL: ${redirectUrl}`);

      const { createdSessionId, setActive, signUp: ssoSignUp, signIn: ssoSignIn } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      console.log(
        `[SocialAuth] startSSOFlow finished. createdSessionId: ${createdSessionId}, signUp status: ${ssoSignUp?.status}, signIn status: ${ssoSignIn?.status}`
      );

      const targetSessionId = createdSessionId || ssoSignUp?.createdSessionId || ssoSignIn?.createdSessionId;

      if (targetSessionId && setActive) {
        console.log(`[SocialAuth] Activating session: ${targetSessionId}`);
        await setActive({ session: targetSessionId });
        router.replace("/(tabs)/index");
        return;
      }

      // Transfer flow: SSO resolved an existing sign-in instead
      if (ssoSignIn && ssoSignIn.status === "complete" && ssoSignIn.createdSessionId && setActive) {
        console.log("[SocialAuth] Transfer flow resolved existing signIn. Activating session...");
        await setActive({ session: ssoSignIn.createdSessionId });
        router.replace("/(tabs)/index");
        return;
      }
    } catch (err: any) {
      console.error(`[SocialAuth] Error (${strategy}):`, JSON.stringify(err, null, 2));

      // User cancellation is not an error — silently swallow it
      if (
        err.code === "SIGN_IN_CANCELLED" ||
        err.message?.includes("cancelled") ||
        err.message?.includes("closed")
      ) {
        return;
      }

      if (err.errors?.[0]?.message) {
        setErrorMessage(err.errors[0].message);
      } else if (err.message) {
        setErrorMessage(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/onboarding"))}
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          <Text className="font-['Poppins-Bold'] text-2xl text-text-primary">
            ‹
          </Text>
        </TouchableOpacity>

        {/* Header Title & Subtitle */}
        <View className="mt-4">
          <Text className="font-['Poppins-Bold'] text-[28px] tracking-tight text-text-primary">
            Create your account
          </Text>
          <Text className="font-['Poppins-Regular'] text-[15px] text-text-secondary mt-1">
            Start your language journey today ✨
          </Text>
        </View>

        {/* Mascot Peeking with Sparkles */}
        <View className="items-center justify-center -mb-2 mt-4">
          <Image
            source={images.mascotPeeking}
            className="h-28 w-56"
            resizeMode="contain"
          />
        </View>

        {/* Error Alert */}
        {errorMessage ? (
          <View className="mb-3 rounded-2xl bg-error/10 p-3">
            <Text className="font-['Poppins-Medium'] text-xs text-error text-center">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Input Cards */}
        <View className="gap-3">
          {/* Email Card */}
          <View className="rounded-2xl border border-border bg-white px-4 py-3">
            <Text className="font-['Poppins-Medium'] text-xs text-text-secondary">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="font-['Poppins-Regular'] text-base text-text-primary mt-1 p-0"
            />
          </View>

          {/* Password Card */}
          <View className="rounded-2xl border border-border bg-white px-4 py-3">
            <Text className="font-['Poppins-Medium'] text-xs text-text-secondary">
              Password
            </Text>
            <View className="flex-row items-center justify-between">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 font-['Poppins-Regular'] text-base text-text-primary mt-1 p-0"
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowPassword(!showPassword)}
                className="p-1"
              >
                <Text className="text-lg text-text-secondary">
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Sign Up Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={isSubmitting || fetchStatus === "fetching"}
          onPress={handleSignUp}
          className="lingua-button lingua-button--primary mt-5 py-4 rounded-2xl items-center justify-center"
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="font-['Poppins-SemiBold'] text-base text-white">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="my-6 flex-row items-center">
          <View className="h-[1px] flex-1 bg-border" />
          <Text className="mx-3 font-['Poppins-Regular'] text-xs text-text-secondary">
            or continue with
          </Text>
          <View className="h-[1px] flex-1 bg-border" />
        </View>

        {/* Social Auth Buttons */}
        <View className="gap-3">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleSocialAuth("oauth_google")}
            className="w-full flex-row items-center justify-center rounded-2xl border border-border bg-white py-3.5 px-4 min-h-[52px]"
          >
            <Image
              source={images.googleIcon}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text
              numberOfLines={1}
              style={styles.socialText}
              className="font-['Poppins-Medium'] text-sm text-text-primary"
            >
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleSocialAuth("oauth_facebook")}
            className="w-full flex-row items-center justify-center rounded-2xl border border-border bg-white py-3.5 px-4 min-h-[52px]"
          >
            <Image
              source={images.facebookIcon}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text
              numberOfLines={1}
              style={styles.socialText}
              className="font-['Poppins-Medium'] text-sm text-text-primary"
            >
              Continue with Facebook
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleSocialAuth("oauth_apple")}
            className="w-full flex-row items-center justify-center rounded-2xl border border-border bg-white py-3.5 px-4 min-h-[52px]"
          >
            <Image
              source={images.appleIcon}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text
              numberOfLines={1}
              style={styles.socialText}
              className="font-['Poppins-Medium'] text-sm text-text-primary"
            >
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="my-8 flex-row items-center justify-center gap-1">
          <Text className="font-['Poppins-Regular'] text-sm text-text-secondary">
            Already have an account?
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/sign-in")}
          >
            <Text className="font-['Poppins-Bold'] text-sm text-lingua-purple">
              Log in
            </Text>
          </TouchableOpacity>
        </View>

        {/* Required for Clerk bot protection on web */}
        <View nativeID="clerk-captcha" />
      </ScrollView>

      {/* Verification Code Modal */}
      <VerificationModal
        visible={showVerification}
        email={email}
        onClose={() => setShowVerification(false)}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  socialText: {
    flexShrink: 0,
    includeFontPadding: false,
  },
});
