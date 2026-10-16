"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { wedding, type WeddingEvent } from "@/config/wedding";
import { getCountdownParts, type CountdownParts } from "@/lib/datetime";
import { SectionHeading } from "@/components/invite/SectionHeading";
import { Reveal } from "@/components/invite/Reveal";

const timeZone = wedding.timeZone;

function eventStart(event: WeddingEvent): number | null {
  const match = event.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!event.date || !match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return new Date(`${event.date}T${String(hour).padStart(2, "0")}:${match[2]}:00+05:30`).getTime();
}

const timeline: { event: WeddingEvent; start: number }[] = wedding.events
  .flatMap((event) => {
    const start = event.configured ? eventStart(event) : null;
    return start === null ? [] : [{ event, start }];
  })
  .sort((left, right) => left.start - right.start);

function dateKeyInIndia(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function formattedTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formattedDay(dateKey: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00+05:30`));
}

function getPartsUntil(target: number, now: Date): CountdownParts {
  const difference = target - now.getTime();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true };
  const totalSeconds = Math.floor(difference / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    complete: false,
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown-digit interactive-card flex min-w-[4.4rem] flex-col items-center rounded-2xl border border-gold/25 bg-ivory px-3 py-4 shadow-sm">
      <motion.span
        key={value}
        initial={{ opacity: 0.45, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="font-serif text-3xl text-olive tabular-nums"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-sage">{label}</span>
    </div>
  );
}

function LiveSchedule({ now, today }: { now: Date; today: string }) {
  const events = timeline.filter(({ event }) => event.date === today);
  const next = events.find(({ start }) => start > now.getTime());
  const startedCount = events.filter(({ start }) => start <= now.getTime()).length;

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-gold/35 bg-ivory shadow-[0_14px_36px_rgba(73,58,55,.08)]">
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(173,128,81,.16),rgba(217,170,164,.16)_55%,rgba(251,246,240,.75))] px-5 pb-5 pt-6 text-center">
        <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full border border-gold/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-3 -top-7 h-24 w-24 rounded-full border border-gold/20" aria-hidden="true" />
        <span className="relative mx-auto inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/70 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-olive">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#a07770]" aria-hidden="true" />
          Live celebration
        </span>
        <p className="relative mt-3 font-serif text-2xl text-olive">{formattedDay(today)}</p>
        <p className="relative mt-1 inline-flex items-center gap-1.5 text-xs text-olive/60"><Clock3 size={13} aria-hidden="true" /> {formattedTime(now)} IST</p>
      </div>

      <div className="px-5 py-5">
        {next ? (
          <div className="mb-4 rounded-2xl border border-gold/30 bg-[#f7eee4] px-4 py-3 text-center">
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-sage">Next scheduled</p>
            <p className="mt-1 font-serif text-xl text-olive">{next.event.name}</p>
            <p className="mt-0.5 text-sm text-olive/65">Begins at {next.event.time}</p>
          </div>
        ) : startedCount > 0 ? (
          <p className="mb-4 rounded-2xl border border-gold/25 bg-[#f7eee4] px-4 py-3 text-center font-serif text-lg text-olive">
            Today&apos;s celebrations are in full swing.
          </p>
        ) : (
          <p className="mb-4 rounded-2xl border border-gold/25 bg-[#f7eee4] px-4 py-3 text-center font-serif text-lg text-olive">
            The first celebration begins soon.
          </p>
        )}

        <div className="space-y-2" aria-label="Today's live event schedule">
          {events.map(({ event, start }) => {
            const started = start <= now.getTime();
            const isNext = next?.event.id === event.id;
            return (
              <div key={event.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${isNext ? "border-gold/50 bg-white shadow-sm" : "border-gold/15 bg-white/55"}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${started ? "bg-sage/20 text-sage" : "bg-champagne/70 text-olive"}`}>
                  {started ? <Check size={15} aria-hidden="true" /> : <Sparkles size={14} aria-hidden="true" />}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-serif text-base text-olive">{event.name}</span>
                  <span className="block text-xs text-olive/60">{event.time}</span>
                </span>
                <span className={`text-[0.57rem] uppercase tracking-[0.12em] ${started ? "text-sage" : isNext ? "font-semibold text-gold" : "text-olive/45"}`}>
                  {started ? "Started" : isNext ? "Up next" : "Later"}
                </span>
              </div>
            );
          })}
        </div>
        <a href="#events" className="interactive-button mx-auto mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-gold/35 px-4 text-[0.62rem] font-medium uppercase tracking-[0.15em] text-olive hover:bg-champagne/30">
          Full celebration program <ArrowRight size={14} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export function Countdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const first = timeline[0];
  const last = timeline[timeline.length - 1];
  const today = now ? dateKeyInIndia(now) : "";
  const beforeCelebrations = !now || !first || today < first.event.date;
  const duringCelebrations = !!now && !!first && !!last && today >= first.event.date && today <= last.event.date;
  const afterCelebrations = !!now && !!last && today > last.event.date;
  const fallbackParts = now ? getCountdownParts(now) : null;
  const countdown = now && first && beforeCelebrations ? getPartsUntil(first.start, now) : fallbackParts;
  const firstEventText = first ? `${first.event.name} on ${formattedDay(first.event.date)} at ${first.event.time}` : "the wedding day";

  return (
    <Reveal>
      <section className="px-5 py-10">
        {duringCelebrations ? (
          <>
            <SectionHeading eyebrow="Together, at last" title="Today at the celebration" />
            <LiveSchedule now={now!} today={today} />
          </>
        ) : afterCelebrations ? (
          <>
            <SectionHeading eyebrow="With love and gratitude" title="What a beautiful celebration" />
            <p className="rounded-2xl border border-gold/30 bg-ivory px-5 py-8 text-center font-serif text-xl leading-relaxed text-olive">
              Thank you for being part of Rishi &amp; Nikita&apos;s celebration. The memories will stay with us forever.
            </p>
          </>
        ) : (
          <>
            <SectionHeading eyebrow="The celebrations are near" title="Counting down to our first celebration" />
            {countdown ? (
              <div className="flex flex-wrap justify-center gap-3" aria-label={`Time until ${firstEventText}`}>
                <Digit value={countdown.days} label="Days" />
                <Digit value={countdown.hours} label="Hours" />
                <Digit value={countdown.minutes} label="Minutes" />
                <Digit value={countdown.seconds} label="Seconds" />
              </div>
            ) : (
              <p className="text-center text-sm text-olive/60">Preparing countdown…</p>
            )}
            <p className="mt-4 text-center text-[0.7rem] text-olive/55">
              {first ? `The festivities begin with ${firstEventText}.` : "Indian Standard Time"}
            </p>
          </>
        )}
      </section>
    </Reveal>
  );
}
