const VISION_AGENT_URL = process.env.VISION_AGENT_URL || "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const callId = body.callId;
    const sessionId = body.sessionId;

    if (!callId || !sessionId) {
      return Response.json(
        { error: "callId and sessionId are required to stop agent" },
        { status: 400 }
      );
    }

    try {
      const response = await fetch(
        `${VISION_AGENT_URL}/calls/${callId}/sessions/${sessionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        return Response.json(
          { error: `Vision Agent server returned status ${response.status}: ${errorText}` },
          { status: response.status }
        );
      }

      return Response.json({
        status: "stopped",
        callId,
        sessionId,
      });
    } catch (connectionError: any) {
      return Response.json(
        {
          status: "stopped_offline",
          message: "Agent session stopped locally (Vision Agent server offline).",
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Failed to stop Vision Agent session" },
      { status: 500 }
    );
  }
}
