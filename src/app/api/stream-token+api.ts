import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY || process.env.EXPO_PUBLIC_STREAM_API_KEY || "3g659fxdykha";
const apiSecret = process.env.STREAM_API_SECRET || "j5mdmsymycdakfkfnasjvbedjcqc9yfzne6qsrw9w95gx2np95hg4uwnapuf9eb2";

const serverClient = new StreamClient(apiKey, apiSecret);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || `user_${Math.random().toString(36).substring(2, 9)}`;
    const lessonId = body.lessonId || "default-lesson";
    const userName = body.name || "Learner";

    // Generate Stream user token securely on backend
    const token = serverClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: 3600 * 24,
    });

    // Generate call ID for lesson
    const callId = `audio_call_${lessonId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

    // Optionally upsert user / call details on server
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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") || `user_${Math.random().toString(36).substring(2, 9)}`;
  const lessonId = url.searchParams.get("lessonId") || "default-lesson";

  const token = serverClient.generateUserToken({
    user_id: userId,
    validity_in_seconds: 3600 * 24,
  });

  const callId = `audio_call_${lessonId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

  return Response.json({
    token,
    apiKey,
    callId,
    userId,
    callType: "default",
  });
}
