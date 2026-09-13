import { StreamClient } from "@stream-io/node-sdk";

function getStreamServerConfig() {
  const apiKey = process.env.STREAM_API_KEY || process.env.EXPO_PUBLIC_STREAM_API_KEY || "";
  const apiSecret = process.env.STREAM_API_SECRET || "";

  if (!apiSecret) {
    throw new Error("STREAM_API_SECRET is missing from server environment");
  }

  return {
    apiKey,
    serverClient: new StreamClient(apiKey, apiSecret),
  };
}

export async function POST(request: Request) {
  try {
    const { apiKey, serverClient } = getStreamServerConfig();
    const body = await request.json().catch(() => ({}));
    const userId = body.userId;

    if (!userId || typeof userId !== "string" || !userId.trim()) {
      return Response.json(
        { error: "Unauthorized: A valid userId is required to issue a token." },
        { status: 401 }
      );
    }

    const lessonId = body.lessonId || "default-lesson";
    const userName = body.name || "Learner";

    // Generate Stream user token securely on backend
    const token = serverClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: 3600 * 24,
    });

    // Generate call ID for lesson
    const callId = `audio_call_${lessonId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

    // Upsert call details on server
    try {
      const call = serverClient.video.call("default", callId);
      await call.getOrCreate({
        data: {
          created_by_id: userId,
          custom: {
            lessonId,
            userName,
            audioOnly: true,
          },
        },
      });
    } catch {
      // Ignore if call initialization is handled by client or fallback
    }

    return Response.json({
      token,
      apiKey,
      callId,
      userId,
      callType: "default",
    });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Failed to generate Stream token" },
      { status: 500 }
    );
  }
}
