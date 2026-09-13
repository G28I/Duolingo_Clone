import {
  StreamVideoClient,
  Call,
} from "@stream-io/video-react-native-sdk";

export interface StreamSessionConfig {
  userId: string;
  userName: string;
  userImage?: string;
  lessonId: string;
  languageId: string;
}

export interface StreamTokenResponse {
  token: string;
  apiKey: string;
  callId: string;
  userId: string;
  callType: string;
}

const PUBLIC_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY || "3g659fxdykha";

/**
 * Fetch Stream User Token and Call Credentials from server-side Expo API route
 */
export async function fetchStreamToken(
  config: StreamSessionConfig
): Promise<StreamTokenResponse> {
  try {
    const response = await fetch("/api/stream-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: config.userId,
        name: config.userName,
        lessonId: config.lessonId,
        languageId: config.languageId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn("[Stream] API route fetch fallback:", error);
  }

  // Fallback token response for dev / offline preview
  const callId = `audio_call_${config.lessonId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  return {
    apiKey: PUBLIC_API_KEY,
    token: "dev-token-fallback",
    callId,
    userId: config.userId,
    callType: "default",
  };
}

/**
 * Initialize Stream Audio Call session with audio-only settings
 */
export async function setupStreamAudioCall(
  credentials: StreamTokenResponse,
  userInfo: { id: string; name?: string; image?: string }
): Promise<{ client: StreamVideoClient; call: Call }> {
  const client = new StreamVideoClient({
    apiKey: credentials.apiKey || PUBLIC_API_KEY,
    user: {
      id: userInfo.id,
      name: userInfo.name || "Learner",
      image: userInfo.image,
      type: "authenticated",
    },
    token: credentials.token,
  });

  const call = client.call(credentials.callType || "default", credentials.callId);

  // Audio-only call configuration
  await call.join({
    create: true,
    data: {
      members: [{ user_id: userInfo.id }],
    },
  });

  // Ensure camera is disabled for audio-only experience
  try {
    await call.camera.disable();
    await call.microphone.enable();
  } catch {
    // Ignore native permissions if running in web preview
  }

  return { client, call };
}
