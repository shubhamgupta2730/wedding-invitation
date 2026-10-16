import { NextResponse } from "next/server";

const fallback = "The wishes tree is not connected yet. Please try again later.";

function webhookUrl() {
  return process.env.RSVP_WEBHOOK_URL;
}

export async function GET() {
  const webhook = webhookUrl();
  if (!webhook) return NextResponse.json({ ok: true, wishes: [] });

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ kind: "list-wishes", secret: process.env.RSVP_WEBHOOK_SECRET }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Wishes service unavailable");
    const result = (await response.json()) as { ok?: boolean; wishes?: unknown[] };
    if (!result.ok || !Array.isArray(result.wishes)) throw new Error("Invalid wishes response");
    return NextResponse.json({ ok: true, wishes: result.wishes });
  } catch {
    return NextResponse.json({ ok: false, wishes: [], message: fallback }, { status: 502 });
  }
}

export async function POST(request: Request) {
  let body: { name?: unknown; wish?: unknown; share?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "We could not read your wish. Please try again." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const wish = typeof body.wish === "string" ? body.wish.trim() : "";
  const share = body.share === true;
  if (!name || name.length > 60) return NextResponse.json({ ok: false, message: "Please enter a name (up to 60 characters)." }, { status: 400 });
  if (!wish || wish.length > 180) return NextResponse.json({ ok: false, message: "Please keep your blessing under 180 characters." }, { status: 400 });

  const webhook = webhookUrl();
  if (!webhook) {
    return NextResponse.json({ ok: false, code: "not_configured", message: fallback }, { status: 503 });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ kind: "wish", name, wish, share, secret: process.env.RSVP_WEBHOOK_SECRET }),
    });
    if (!response.ok) throw new Error("Wishes service unavailable");
    const result = (await response.json()) as { ok?: boolean };
    if (result.ok !== true) throw new Error("Wish was not accepted");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: fallback }, { status: 502 });
  }
}
