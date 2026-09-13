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

export interface StreamVideoClient {
  call: (type: string, id: string) => Call;
  disconnectUser?: () => Promise<void>;
}

export interface Call {
  join: (options?: any) => Promise<any>;
  leave: () => Promise<void>;
  camera: {
    disable: () => Promise<void>;
    enable: () => Promise<void>;
  };
  microphone: {
    disable: () => Promise<void>;
    enable: () => Promise<void>;
  };
}

const PUBLIC_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY || "3g659fxdykha";

let StreamVideoClientSDK: any = null;

try {
  // Dynamically require Stream Video SDK if native WebRTC is supported
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const streamSdk = require("@stream-io/video-react-native-sdk");
  StreamVideoClientSDK = streamSdk.StreamVideoClient;
} catch (e) {
  console.warn("[Stream] WebRTC native module not available in current environment (Expo Go/Web mode). Using fallback call session.");
}

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
  if (StreamVideoClientSDK) {
    try {
      const client = new StreamVideoClientSDK({
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
    } catch (err) {
      console.warn("[Stream Client Init Error, falling back to mock call]:", err);
    }
  }

  // Fallback Mock Call for Expo Go / Web sandbox where native WebRTC is not compiled
  const mockCall: Call = {
    join: async () => {},
    leave: async () => {},
    camera: {
      disable: async () => {},
      enable: async () => {},
    },
    microphone: {
      disable: async () => {},
      enable: async () => {},
    },
  };

  const mockClient: StreamVideoClient = {
    call: () => mockCall,
  };

  return { client: mockClient, call: mockCall };
}
