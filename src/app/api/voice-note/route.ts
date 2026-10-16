import { NextResponse } from "next/server";

const MAX_AUDIO_BASE64_LENGTH = 2_800_000;
const ALLOWED_TYPES = new Set(["audio/webm", "audio/mp4", "audio/ogg", "audio/mpeg", "audio/wav"]);

export async function POST(request: Request) {
  let body: { name?: unknown; mimeType?: unknown; audio?: unknown; duration?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "We could not read the voice note. Please try again." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const mimeType = typeof body.mimeType === "string" ? body.mimeType.split(";")[0] : "";
  const audio = typeof body.audio === "string" ? body.audio : "";
  const duration = Number(body.duration);
  if (!name || name.length > 60) return NextResponse.json({ ok: false, message: "Please enter a name (up to 60 characters)." }, { status: 400 });
  if (!ALLOWED_TYPES.has(mimeType) || !audio || audio.length > MAX_AUDIO_BASE64_LENGTH || !/^[A-Za-z0-9+/]+={0,2}$/.test(audio)) {
    return NextResponse.json({ ok: false, message: "This audio file could not be sent. Please record a shorter note." }, { status: 400 });
  }
  if (!Number.isFinite(duration) || duration < 1 || duration > 20) {
    return NextResponse.json({ ok: false, message: "Voice notes can be up to 20 seconds long." }, { status: 400 });
  }

  const webhook = process.env.RSVP_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ ok: false, code: "not_configured", message: "Voice notes are not connected yet. Please try again later." }, { status: 503 });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        kind: "voice-note",
        name,
        mimeType,
        audio,
        duration: Math.round(duration),
        secret: process.env.RSVP_WEBHOOK_SECRET,
      }),
    });
    if (!response.ok) throw new Error("Voice note service unavailable");
    const result = (await response.json()) as { ok?: boolean };
    if (result.ok !== true) throw new Error("Voice note was not accepted");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "We could not send your voice note right now. Please try again later." }, { status: 502 });
  }
}
