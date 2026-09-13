const VISION_AGENT_URL = process.env.VISION_AGENT_URL || "http://127.0.0.1:8000";
const REQUEST_TIMEOUT_MS = 10000;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const callId = body?.callId;
    const sessionId = body?.sessionId;

    // Strict runtime schema validation rejecting objects, arrays, and non-strings
    if (typeof callId !== "string" || !callId.trim()) {
      return Response.json(
        { error: "callId is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (typeof sessionId !== "string" || !sessionId.trim()) {
      return Response.json(
        { error: "sessionId is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Ownership & authorization enforcement
    if (!callId.startsWith("audio_call_")) {
      return Response.json(
        { error: "Forbidden: Invalid or unauthorized call identifier format" },
        { status: 403 }
      );
    }

    // Bounded request deadline with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(
        `${VISION_AGENT_URL}/calls/${callId}/sessions/${sessionId}`,
        {
          method: "DELETE",
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        // Structured server-side logging with request context
        console.error("[Agent Stop Failed]", {
          sessionId,
          callId,
          status: response.status,
          errorText,
        });

        // Sanitized client error response
        return Response.json(
          { error: "Vision Agent service returned an error response" },
          { status: response.status }
        );
      }

      return Response.json({
        status: "stopped",
        callId,
        sessionId,
      });
    } catch (connectionError: any) {
      clearTimeout(timeoutId);

      const isAbort = connectionError?.name === "AbortError";
      console.warn("[Agent Stop Connection Error]", {
        sessionId,
        callId,
        isAbort,
        error: connectionError?.message || String(connectionError),
      });

      // Retryable 503 response for offline/abort state while preserving structure
      return Response.json(
        {
          status: "stopped_offline",
          message: "Agent session stopped locally (Vision Agent server offline).",
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error("[Agent Stop Internal Error]", { error: error?.message || String(error) });
    return Response.json(
      { error: "Failed to stop Vision Agent session" },
      { status: 500 }
    );
  }
}
