import { StreamClient } from "@stream-io/node-sdk";
import { getLessonById, getLanguageById } from "@/data";

function getStreamServerConfig() {
  const apiKey = process.env.STREAM_API_KEY || process.env.EXPO_PUBLIC_STREAM_API_KEY || "";
  const apiSecret = process.env.STREAM_API_SECRET || "";

  if (!apiSecret) {
    throw new Error("STREAM_API_SECRET is missing from server environment");
  }

  return {
    apiKey,
    serverClient: new StreamClient(apiKey, apiSecret, { timeout: 15000 }),
  };
}

async function withRetry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return withRetry(fn, retries - 1);
    }
    throw err;
  }
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

    const lessonId = body.lessonId || "lesson-fr-1-1";
    const languageId = body.languageId || "fr";
    const userName = body.name || "Learner";

    const lesson = getLessonById(lessonId);
    const language = getLanguageById(languageId || lesson?.languageId || "fr");

    // Upsert AI Teacher agent user with admin role so it has full audio publishing permissions
    try {
      await withRetry(() =>
        serverClient.upsertUsers([
          {
            id: "ai-teacher",
            name: language?.aiTeacherPersona?.name || "AI Teacher",
            role: "admin",
          },
        ])
      );
    } catch (upsertErr) {
      console.warn("[Stream API] Warning upserting ai-teacher admin user:", upsertErr);
    }

    // Generate Stream user token securely on backend for learner
    const token = serverClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: 3600 * 24,
    });

    // Generate call ID for lesson
    const callId = `audio_call_${lessonId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

    const vocabulary = lesson?.vocabulary
      ? lesson.vocabulary.map((v) => `${v.term} (${v.translation})`)
      : [];
    const phrases = lesson?.phrases
      ? lesson.phrases.map((p) => `${p.phrase} -> ${p.translation}`)
      : [];
    const goals = lesson?.goals
      ? lesson.goals.map((g) => g.text)
      : lesson?.description
      ? [lesson.description]
      : ["Practice speaking and pronunciation"];

    const customData = {
      lessonId,
      lessonTitle: lesson?.title || "Language Lesson",
      languageId: language?.id || languageId,
      targetLanguage: language?.name || "French",
      goals,
      vocabulary,
      phrases,
      aiTeacherPrompt: language?.aiTeacherPersona
        ? `${language.aiTeacherPersona.name} (${language.aiTeacherPersona.title})`
        : "Encouraging AI Language Teacher",
      userName,
      audioOnly: true,
    };

    // Upsert call details with custom metadata & audio permission overrides
    try {
      const call = serverClient.video.call("default", callId);
      await withRetry(() =>
        call.getOrCreate({
          data: {
            created_by_id: userId,
            settings_override: {
              audio: {
                mic_default_on: true,
                default_device: "speaker",
              },
            },
            custom: customData,
          },
        })
      );
    } catch (callErr) {
      console.warn("[Stream API] Call getOrCreate warning:", callErr);
    }

    return Response.json({
      token,
      apiKey,
      callId,
      userId,
      callType: "default",
      custom: customData,
    });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Failed to generate Stream token" },
      { status: 500 }
    );
  }
}
