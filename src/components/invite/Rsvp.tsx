"use client";

import { FormEvent, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { SectionHeading } from "@/components/invite/SectionHeading";
import { Reveal } from "@/components/invite/Reveal";
import { trackInvitationEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error" | "not_configured";

export type RsvpConfirmation = { name: string; attending: "yes" | "no" };

export function Rsvp({ onSuccess }: { onSuccess: (confirmation: RsvpConfirmation) => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState("1");
  const [note, setNote] = useState("");
  const startedTracked = useRef(false);

  if (!wedding.rsvp.enabled) return null;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !attending) {
      setStatus("error");
      setMessage("Please enter your name and attendance.");
      return;
    }
    const guestCount = Number(guests);
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20) {
      setStatus("error");
      setMessage("Number of guests must be between 1 and 20.");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          attending,
          guests: guestCount,
          message: note.trim(),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; code?: string; message?: string };
      if (response.status === 503 || data.code === "not_configured") {
        setStatus("not_configured");
        setMessage(data.message ?? "RSVP replies cannot be received right now. Please try again later.");
        return;
      }
      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage("Thank you. Your response has been received.");
      trackInvitationEvent("rsvp_submitted");
      onSuccess({ name: name.trim(), attending: attending as RsvpConfirmation["attending"] });
    } catch {
      setStatus("error");
      setMessage("Could not send your RSVP. Please check your connection and try again.");
    }
  };

  return (
    <Reveal>
      <section id="rsvp" className="scroll-mt-20 px-5 py-10">
        <SectionHeading eyebrow="RSVP" title={wedding.rsvp.headline} />
        <p className="mb-6 text-center text-sm leading-relaxed text-olive/75">{wedding.rsvp.intro}</p>
        <form
          onFocusCapture={() => {
            if (startedTracked.current) return;
            startedTracked.current = true;
            trackInvitationEvent("rsvp_started");
          }}
          onSubmit={onSubmit}
          className="interactive-card space-y-4 rounded-2xl border border-gold/25 bg-ivory p-5 shadow-sm"
        >
          <label className="block text-sm text-olive">
            Guest name
            <input
              required
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 min-h-12 w-full rounded-xl border border-gold/30 bg-champagne/30 px-3 text-olive"
              autoComplete="name"
            />
          </label>
          <fieldset>
            <legend className="text-sm text-olive">Will you attend?</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { value: "yes", label: "Joyfully yes" },
                { value: "no", label: "Regretfully no" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex min-h-12 items-center justify-center rounded-xl border text-sm ${
                    attending === option.value
                      ? "border-gold bg-champagne text-olive"
                      : "border-gold/30 text-olive/80"
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value={option.value}
                    checked={attending === option.value}
                    onChange={(event) => setAttending(event.target.value)}
                    className="sr-only"
                    required
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm text-olive">
            Number of guests
            <input
              type="number"
              min={1}
              max={20}
              name="guests"
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              className="mt-1 min-h-12 w-full rounded-xl border border-gold/30 bg-champagne/30 px-3 text-olive"
            />
          </label>
          <label className="block text-sm text-olive">
            Message <span className="text-olive/50">(optional)</span>
            <textarea
              name="message"
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-1 w-full rounded-xl border border-gold/30 bg-champagne/30 px-3 py-3 text-olive"
            />
          </label>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="interactive-button flex min-h-12 w-full items-center justify-center rounded-full bg-olive text-sm tracking-[0.16em] text-ivory uppercase disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Send RSVP"}
          </button>
          {status !== "idle" && message ? (
            <p
              role="status"
              className={`rounded-xl px-3 py-3 text-sm leading-relaxed ${
                status === "success"
                  ? "bg-sage/20 text-olive"
                  : "bg-blush/30 text-olive"
              }`}
            >
              {message}
            </p>
          ) : null}
          {wedding.rsvp.contactNote ? (
            <p className="text-center text-xs text-olive/55">{wedding.rsvp.contactNote}</p>
          ) : null}
        </form>
      </section>
    </Reveal>
  );
}
