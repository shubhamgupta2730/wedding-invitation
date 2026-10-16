"use client";

import { Flower2, Music, Sparkles, Heart, GlassWater } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { wedding, type WeddingEvent } from "@/config/wedding";
import { SectionHeading } from "@/components/invite/SectionHeading";
import { Reveal } from "@/components/invite/Reveal";

const icons: Record<string, typeof Flower2> = {
  haldi: Sparkles,
  mayra: Flower2,
  sangeet: Music,
  sagai: Heart,
  reception: GlassWater,
};

function formatDay(date: string) {
  if (!date) return "Celebration";
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: wedding.timeZone,
  }).format(new Date(`${date}T00:00:00+05:30`));
}

function EventCard({ event }: { event: WeddingEvent }) {
  const Icon = icons[event.id] ?? Flower2;
  return (
    <article className="schedule-event rounded-xl border border-gold/20 bg-ivory/90 px-2.5 py-3 shadow-[0_3px_12px_rgba(73,58,55,.035)] sm:px-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-champagne/70 text-olive">
          <Icon size={14} aria-hidden="true" />
        </span>
        <h3 className="font-serif text-[0.98rem] leading-tight text-olive sm:text-lg">{event.name}</h3>
      </div>
      {event.time ? <p className="mt-2 pl-9 text-[0.72rem] font-medium tracking-wide text-sage sm:text-xs">{event.time}</p> : null}
      {event.venue ? <p className="mt-1 pl-9 text-xs leading-snug text-olive/65">{event.venue}</p> : null}
      {event.description ? <p className="mt-1 pl-9 text-xs leading-snug text-olive/65">{event.description}</p> : null}
    </article>
  );
}

export function Events() {
  const configured = wedding.events.filter((event) => event.configured);
  const groups = configured.reduce<Record<string, WeddingEvent[]>>((result, event) => {
    const key = event.date || "undated";
    (result[key] ??= []).push(event);
    return result;
  }, {});
  const days = Object.entries(groups).sort(([left], [right]) => left.localeCompare(right));
  const reduce = useReducedMotion();

  return (
    <Reveal>
      <section id="events" className="scroll-mt-5 px-4 py-8 sm:px-5 sm:py-10">
        <SectionHeading eyebrow="The celebrations" title="Program timeline" />
        {days.length === 0 ? (
          <div className="rounded-2xl border border-gold/25 bg-ivory px-5 py-8 text-center shadow-sm">
            <div aria-hidden className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 font-serif text-xl text-gold">✦</div>
            <p className="font-serif text-xl text-olive">The celebrations await</p>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-olive/65">
              We are putting the finishing touches on the festivities. The event details will be shared here soon.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 items-start gap-2.5 sm:gap-4"
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {days.map(([date, events]) => {
              const [weekday, ...dayParts] = formatDay(date).split(", ");
              return (
                <motion.div
                  key={date}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } }}
                  className="min-w-0 rounded-2xl border border-gold/30 bg-[#f4e9df]/65 p-2 sm:p-3"
                >
                  <header className="mb-2 px-1 py-1 text-center">
                    <p className="text-[0.55rem] font-medium uppercase tracking-[0.16em] text-sage sm:text-[0.62rem] sm:tracking-[0.2em]">{weekday}</p>
                    <h3 className="mt-0.5 font-serif text-[1.05rem] leading-tight text-olive sm:text-xl">{dayParts.join(" ")}</h3>
                  </header>
                  <div className="grid gap-2">
                    {events.map((event) => <EventCard key={event.id} event={event} />)}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </Reveal>
  );
}
