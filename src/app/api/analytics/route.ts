import { NextResponse } from "next/server";

const allowedEvents = new Set([
  "page_opened",
  "curtain_opened",
  "date_revealed",
  "calendar_download_clicked",
  "date_navigation_clicked",
  "celebrations_navigation_clicked",
  "venue_navigation_clicked",
  "rsvp_navigation_clicked",
  "directions_clicked",
  "rsvp_started",
  "rsvp_submitted",
  "wish_submitted",
  "voice_recording_started",
  "voice_note_submitted",
  "invitation_share_clicked",
]);

export async function POST(request: Request) {
  let event: unknown;
  try {
    const body = (await request.json()) as { event?: unknown };
    event = body.event;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof event !== "string" || !allowedEvents.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const webhook = process.env.RSVP_WEBHOOK_URL;
  const secret = process.env.RSVP_WEBHOOK_SECRET;
  // Analytics is intentionally best effort and never blocks the guest experience.
  if (!webhook || !secret) return new NextResponse(null, { status: 204 });

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ kind: "analytics", event, secret }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Analytics failures should not affect RSVP, navigation, or other invitation features.
  }

  return new NextResponse(null, { status: 204 });
}
