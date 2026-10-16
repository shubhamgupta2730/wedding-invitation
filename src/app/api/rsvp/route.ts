import { NextResponse } from "next/server";

type Payload = {
  name?: unknown;
  attending?: unknown;
  guests?: unknown;
  message?: unknown;
};

function invalid(message: string) {
  return NextResponse.json({ ok: false, message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return invalid("RSVP could not be read. Please try again.");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const attending = body.attending === "yes" || body.attending === "no" ? body.attending : "";
  const guests = typeof body.guests === "number" ? body.guests : Number(body.guests);
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 120) return invalid("Please enter a valid guest name.");
  if (!attending) return invalid("Please choose whether you will attend.");
  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    return invalid("Number of guests must be between 1 and 20.");
  }
  if (message.length > 1000) return invalid("Please keep your message under 1,000 characters.");

  const webhook = process.env.RSVP_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        message: "RSVP replies cannot be received right now. Please try again later.",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name,
        attending,
        guests,
        message,
        source: "rishi-nikita-wedding",
        secret: process.env.RSVP_WEBHOOK_SECRET,
      }),
    });
    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: "The RSVP service did not accept this reply. Please try again later." },
        { status: 502 },
      );
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const result = (await response.json()) as { ok?: boolean };
      if (result.ok === false) {
        return NextResponse.json(
          { ok: false, message: "We couldn't send your RSVP just now. Please try again later." },
          { status: 502 },
        );
      }
    }
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not reach the RSVP service." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
