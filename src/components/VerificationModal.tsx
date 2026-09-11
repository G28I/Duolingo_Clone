import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface VerificationModalProps {
  visible: boolean;
  email?: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<{ success: boolean; error?: string }>;
  onResend?: () => Promise<void>;
}

export default function VerificationModal({
  visible,
  email = "",
  onClose,
  onVerify,
  onResend,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendStatus, setResendStatus] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setCode("");
        setIsVerifying(false);
        setErrorMessage("");
        setResendStatus("");
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleCodeChange = async (text: string) => {
    const numericCode = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(numericCode);
    setErrorMessage("");

    // Auto verify when 6 digits are entered
    if (numericCode.length === 6) {
      setIsVerifying(true);
      try {
        const result = await onVerify(numericCode);
        if (result.success) {
          onClose();
        } else {
          setErrorMessage(result.error || "Verification failed. Please try again.");
          setIsVerifying(false);
          inputRef.current?.focus();
        }
      } catch (err: any) {
        setErrorMessage(err.message || "An unexpected error occurred.");
        setIsVerifying(false);
        inputRef.current?.focus();
      }
    }
  };

  const handleResend = async () => {
    if (!onResend) return;
    try {
      setResendStatus("Sending code...");
      await onResend();
      setResendStatus("Code resent successfully!");
      setCode("");
      setErrorMessage("");
      inputRef.current?.focus();
      setTimeout(() => setResendStatus(""), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend code.");
      setResendStatus("");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            style={styles.modalCard}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-full bg-surface"
            >
              <Text className="font-['Poppins-Bold'] text-sm text-text-secondary">
                ✕
              </Text>
            </TouchableOpacity>

            {/* Header Icon */}
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-[#F0ECFE]">
              <Text className="text-2xl">✉️</Text>
            </View>

            {/* Title & Description */}
            <Text className="font-['Poppins-Bold'] text-2xl text-text-primary">
              Check your email
            </Text>
            <Text className="font-['Poppins-Regular'] text-sm leading-[22px] text-text-secondary mt-2">
              We have sent a 6-digit verification code to{"\n"}
              <Text className="font-['Poppins-SemiBold'] text-text-primary">
                {email || "your email address"}
              </Text>
            </Text>

            {/* Error Message */}
            {errorMessage ? (
              <View className="mt-3 rounded-xl bg-error/10 px-3 py-2">
                <Text className="font-['Poppins-Medium'] text-xs text-error text-center">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Resend Status Message */}
            {resendStatus ? (
              <View className="mt-3 rounded-xl bg-lingua-purple/10 px-3 py-2">
                <Text className="font-['Poppins-Medium'] text-xs text-lingua-purple text-center">
                  {resendStatus}
                </Text>
              </View>
            ) : null}

            {/* Hidden number-pad TextInput */}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleCodeChange}
              keyboardType="number-pad"
              maxLength={6}
              caretHidden={true}
              style={styles.hiddenInput}
            />

            {/* 6 Digit Display Boxes */}
            <Pressable
              onPress={() => inputRef.current?.focus()}
              className="my-6 flex-row justify-between gap-2"
            >
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const digit = code[index] || "";
                const isFocused = code.length === index;

                return (
                  <View
                    key={index}
                    className={`h-13 flex-1 items-center justify-center rounded-xl border ${
                      isFocused
                        ? "border-lingua-purple border-2 bg-white"
                        : digit
                        ? "border-border bg-white"
                        : "border-border bg-surface"
                    }`}
                  >
                    <Text className="font-['Poppins-Bold'] text-xl text-text-primary">
                      {digit}
                    </Text>
                  </View>
                );
              })}
            </Pressable>

            {/* Verification Status or Resend Link */}
            {isVerifying ? (
              <View className="flex-row items-center justify-center gap-2 py-2">
                <ActivityIndicator size="small" color="#6C4EF5" />
                <Text className="font-['Poppins-Medium'] text-sm text-lingua-purple">
                  Verifying code...
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center justify-center gap-1 pt-1">
                <Text className="font-['Poppins-Regular'] text-xs text-text-secondary">
                  {"Didn't receive the email?"}
                </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={handleResend}>
                  <Text className="font-['Poppins-Bold'] text-xs text-lingua-purple">
                    Resend Code
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(13, 19, 43, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});
