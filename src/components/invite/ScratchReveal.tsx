"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { wedding } from "@/config/wedding";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { formatLongWeddingDate } from "@/lib/datetime";
import { trackInvitationEvent } from "@/lib/analytics";

const CARD_WIDTH = 280;
const CARD_HEIGHT = 230;

function heartPath(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(140, 205);
  ctx.bezierCurveTo(125, 190, 18, 126, 18, 77);
  ctx.bezierCurveTo(18, 12, 92, 8, 140, 57);
  ctx.bezierCurveTo(188, 8, 262, 12, 262, 77);
  ctx.bezierCurveTo(262, 126, 155, 190, 140, 205);
  ctx.closePath();
}

function saveWeddingDate() {
  const eventDay = wedding.countdownIso.slice(0, 10).replaceAll("-", "");
  const nextDay = new Date(`${wedding.countdownIso.slice(0, 10)}T00:00:00Z`);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const endDay = nextDay.toISOString().slice(0, 10).replaceAll("-", "");
  const stamp = new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replace(/\.\d{3}Z$/, "Z");
  const escapeIcs = (value: string) => value.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n");
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rishi and Nikita//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:rishi-nikita-wedding@invitation",
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${eventDay}`,
    `DTEND;VALUE=DATE:${endDay}`,
    `SUMMARY:${escapeIcs(`${wedding.couple.namesDisplay} — Wedding`)}`,
    `DESCRIPTION:${escapeIcs(wedding.share.text)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "rishi-and-nikita-wedding.ics";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ScratchReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<Uint8ClampedArray | null>(null);
  const drawing = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const revealTracked = useRef(false);
  const reduce = useReducedMotion();
  const longDate = formatLongWeddingDate();

  const revealDate = () => {
    setRevealed(true);
    if (!revealTracked.current) {
      revealTracked.current = true;
      trackInvitationEvent("date_revealed");
    }
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    heartPath(ctx);
    const foil = ctx.createLinearGradient(0, 0, width, height);
    foil.addColorStop(0, "#f0e2bd");
    foil.addColorStop(0.22, "#cfb77e");
    foil.addColorStop(0.48, "#e7d7ab");
    foil.addColorStop(0.72, "#b99a60");
    foil.addColorStop(1, "#eadfc5");
    ctx.fillStyle = foil;
    ctx.fill();

    ctx.strokeStyle = "rgba(255,250,235,.85)";
    ctx.lineWidth = 1.5;
    heartPath(ctx);
    ctx.stroke();
    ctx.strokeStyle = "rgba(120,95,53,.27)";
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(0.92, 0.92);
    ctx.translate(-width / 2, -height / 2);
    heartPath(ctx);
    ctx.stroke();
    ctx.restore();

    // A soft foil sheen and tiny engraved flecks give the heart a more tactile finish.
    ctx.save();
    heartPath(ctx);
    ctx.clip();
    const sheen = ctx.createRadialGradient(95, 55, 3, 110, 72, 145);
    sheen.addColorStop(0, "rgba(255,255,245,.38)");
    sheen.addColorStop(1, "rgba(255,255,245,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,250,232,.45)";
    [[50, 70], [73, 44], [209, 45], [230, 71], [72, 132], [211, 130], [104, 169], [177, 170]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // Fine foil lines keep the reveal card tactile while remaining legible.
    ctx.save();
    heartPath(ctx);
    ctx.clip();
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1;
    for (let x = -height; x < width; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(width / 2, 83);
    ctx.strokeStyle = "rgba(91,72,43,.72)";
    ctx.fillStyle = "rgba(91,72,43,.72)";
    ctx.lineWidth = 1;
    for (let index = 0; index < 8; index += 1) {
      ctx.save();
      ctx.rotate((Math.PI * 2 * index) / 8);
      ctx.beginPath();
      ctx.ellipse(0, -13, 5, 13, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#55452b";
    ctx.font = "500 8px Arial, sans-serif";
    ctx.letterSpacing = "2.2px";
    ctx.fillText("A LITTLE SECRET", width / 2, 128);
    ctx.font = "italic 19px Georgia, serif";
    ctx.letterSpacing = "0px";
    ctx.fillText("Rishi  &  Nikita", width / 2, 153);
    ctx.font = "500 7px Arial, sans-serif";
    ctx.letterSpacing = "1.8px";
    ctx.fillText("SCRATCH TO REVEAL", width / 2, 178);
    ctx.beginPath();
    ctx.moveTo(width / 2 - 30, 189);
    ctx.lineTo(width / 2 + 30, 189);
    ctx.strokeStyle = "rgba(91,72,43,.55)";
    ctx.stroke();
    maskRef.current = ctx.getImageData(0, 0, width, height).data;
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 21, 0, Math.PI * 2);
    ctx.fill();
  };

  const measureReveal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const alpha = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const mask = maskRef.current;
    if (!mask) return;
    let erased = 0;
    let sampled = 0;
    for (let index = 3; index < alpha.length; index += 32) {
      if (mask[index] === 0) continue;
      sampled += 1;
      if (alpha[index] === 0) erased += 1;
    }
    if (erased / sampled > 0.32) revealDate();
  };

  return (
    <section id="date-reveal" className="relative scroll-mt-6 overflow-hidden px-5 py-14 sm:py-16">
      <div className="scratch-halo pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden />
      <motion.div
        className="relative mx-auto max-w-[370px] text-center"
        initial={reduce ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[0.65rem] uppercase tracking-[0.32em] text-sage">A keepsake for you</p>
        <h2 className="mt-2 font-serif text-3xl text-olive">A date worth uncovering</h2>
        <GoldDivider className="mx-auto mt-4 max-w-36" />
        <p className="mx-auto mt-4 max-w-[17rem] text-sm leading-relaxed text-olive/65">
          {revealed ? "Keep this date close. We can't wait to celebrate with you." : "A little scratch, and our special day is yours to keep."}
        </p>

        <div className="date-reveal-frame interactive-card relative mx-auto mt-7 h-[246px] w-full max-w-[320px] overflow-hidden rounded-[1.4rem] p-2">
          <div className="date-reveal-underlay absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
            <span className="mb-3 block h-px w-10 bg-gold/70" />
            <p className="font-serif text-lg italic text-olive/70">You&apos;re invited</p>
            {revealed ? (
              longDate ? (
                <div className="mt-1 flex flex-col items-center text-olive">
                  <p className="text-[0.58rem] uppercase tracking-[0.24em] text-sage">{longDate.split(", ")[0]}</p>
                  <p className="font-serif text-[1.25rem] leading-tight">{longDate.split(", ").slice(1).join(", ")}</p>
                </div>
              ) : (
                <p className="mt-2 font-serif text-base text-olive/75">Wedding date to be confirmed</p>
              )
            ) : null}
            <p className="mt-4 text-[0.58rem] uppercase tracking-[0.25em] text-sage">Rishi &amp; Nikita</p>
          </div>
          {!revealed ? (
            <canvas
              ref={canvasRef}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              aria-hidden="true"
              className={`date-heart-foil absolute inset-0 h-full w-full touch-none cursor-crosshair rounded-[1.3rem] ${reduce ? "" : "date-heart-prompt"}`}
              onPointerDown={(event) => {
                drawing.current = true;
                event.currentTarget.setPointerCapture(event.pointerId);
                scratch(event.clientX, event.clientY);
              }}
              onPointerMove={(event) => {
                if (drawing.current) scratch(event.clientX, event.clientY);
              }}
              onPointerUp={() => {
                drawing.current = false;
                measureReveal();
              }}
              onPointerCancel={() => {
                drawing.current = false;
                measureReveal();
              }}
            />
          ) : (
            <motion.div
              aria-hidden
              className="date-reveal-sparkle pointer-events-none absolute inset-0 rounded-[1.1rem]"
              initial={{ opacity: 0.7, scale: 0.96 }}
              animate={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </div>

        <button
          type="button"
          onClick={revealed ? () => {
            trackInvitationEvent("calendar_download_clicked");
            saveWeddingDate();
          } : revealDate}
          className="interactive-button mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/45 bg-ivory px-6 text-[0.67rem] font-medium uppercase tracking-[0.18em] text-olive shadow-sm transition hover:border-gold hover:bg-[#f3ead9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          {revealed ? <><CalendarDays size={16} aria-hidden /> Add to calendar</> : "Reveal our date"}
        </button>
        {revealed ? (
          <p className="mt-2 text-xs text-olive/60">Adds the wedding as an all-day calendar event.</p>
        ) : null}
      </motion.div>
    </section>
  );
}
