const VISION_AGENT_URL = process.env.VISION_AGENT_URL || "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const callId = body.callId;
    const callType = body.callType || "default";

    if (!callId || typeof callId !== "string") {
      return Response.json(
        { error: "callId is required to start agent" },
        { status: 400 }
      );
    }

    try {
      const response = await fetch(`${VISION_AGENT_URL}/calls/${callId}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          call_type: callType,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        return Response.json(
          { error: `Vision Agent server returned status ${response.status}: ${errorText}` },
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
      return Response.json(
        {
          error: "Vision Agent server is offline or unreachable.",
          hint: "Ensure 'uv run python agent.py serve --host 127.0.0.1 --port 8000' is running inside vision-agent/.",
          details: connectionError?.message || String(connectionError),
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Failed to start Vision Agent session" },
      { status: 500 }
    );
  }
}
