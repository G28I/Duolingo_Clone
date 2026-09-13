const VISION_AGENT_URL = process.env.VISION_AGENT_URL || "http://127.0.0.1:8000";
const REQUEST_TIMEOUT_MS = 10000;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const callId = body?.callId;
    const callType = body?.callType ?? "default";

    // Strict runtime schema validation
    if (typeof callId !== "string" || !callId.trim()) {
      return Response.json(
        { error: "callId is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (typeof callType !== "string" || !callType.trim()) {
      return Response.json(
        { error: "callType must be a string" },
        { status: 400 }
      );
    }

    // Caller identity / authorization verification for callId ownership
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
      const response = await fetch(`${VISION_AGENT_URL}/calls/${callId}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          call_type: callType,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        // Structured server-side logging with request context
        console.error("[Agent Start Failed]", {
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

      const data = await response.json();
      return Response.json({
        sessionId: data.id || data.session_id,
        callId,
        status: "started",
        data,
      });
    } catch (connectionError: any) {
      clearTimeout(timeoutId);

      const isAbort = connectionError?.name === "AbortError";
      console.error("[Agent Start Connection Error]", {
        callId,
        isAbort,
        error: connectionError?.message || String(connectionError),
      });

      return Response.json(
        {
          error: isAbort
            ? "Vision Agent request timed out (retryable)."
            : "Vision Agent server is offline or unreachable.",
          hint: "Ensure 'uv run python agent.py serve --host 127.0.0.1 --port 8000' is running inside vision-agent/.",
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error("[Agent Start Internal Error]", { error: error?.message || String(error) });
    return Response.json(
      { error: "Failed to start Vision Agent session" },
      { status: 500 }
    );
  }
}
