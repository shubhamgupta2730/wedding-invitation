"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { wedding } from "@/config/wedding";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { GardenScene } from "@/components/ornaments/GardenScene";

export function HeroCard() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.72, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative px-4 py-8 sm:px-8 sm:py-12">
      <div className="hero-invitation-card interactive-card group relative mx-auto max-w-[650px] overflow-hidden rounded-[2rem] border border-gold/35 bg-ivory px-5 pb-9 pt-10 text-center shadow-[0_24px_70px_rgba(73,58,55,0.10)] sm:rounded-[2.25rem] sm:px-12 sm:pb-12 sm:pt-12">
        <div className="pointer-events-none absolute inset-[7px] rounded-[1.65rem] border border-gold/20" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(ellipse_at_top,rgba(217,170,164,.15),transparent_72%)]" aria-hidden="true" />
        <FloralCorner className="pointer-events-none absolute left-2 top-2 h-[4.5rem] w-[4.5rem] opacity-65" position="tl" />
        <FloralCorner className="pointer-events-none absolute right-2 top-2 h-[4.5rem] w-[4.5rem] opacity-65" position="tr" />
        <FloralCorner className="pointer-events-none absolute bottom-2 left-2 h-[4.5rem] w-[4.5rem] opacity-50" position="bl" />
        <FloralCorner className="pointer-events-none absolute bottom-2 right-2 h-[4.5rem] w-[4.5rem] opacity-50" position="br" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            {...rise(0.08)}
            className="hero-monogram mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-white/60 font-serif text-sm tracking-[0.08em] text-olive shadow-[0_4px_16px_rgba(173,128,81,.12)]"
            aria-label="Rishi and Nikita"
          >
            R<span className="mx-0.5 text-gold">&amp;</span>N
          </motion.div>

          <motion.p {...rise(0.16)} className="text-[0.62rem] font-medium uppercase tracking-[0.34em] text-sage sm:text-[0.68rem]">
            {wedding.tagline}
          </motion.p>

          <motion.h1 {...rise(0.24)} className="mt-4 flex flex-wrap items-baseline justify-center gap-x-2 font-serif text-[2.9rem] leading-none tracking-[-0.045em] text-olive sm:gap-x-4 sm:text-[4.1rem]">
            <span>{wedding.couple.groom}</span>
            <span className="relative -top-1 font-serif text-[1.8rem] font-normal italic tracking-normal text-gold sm:text-[2.15rem]">&amp;</span>
            <span>{wedding.couple.bride}</span>
          </motion.h1>

          <motion.p {...rise(0.34)} className="mt-4 max-w-[19rem] font-serif text-base italic leading-relaxed text-olive/65 sm:text-lg">
            Together with their families, they invite you to celebrate a beautiful beginning.
          </motion.p>

          <motion.div {...rise(0.4)} className="w-full" whileHover={reduce ? undefined : { scale: 1.035, y: -2 }} transition={{ duration: 0.5 }}>
            <GardenScene className="mx-auto mt-2 w-full max-w-[26rem] drop-shadow-[0_8px_15px_rgba(73,58,55,.06)]" />
          </motion.div>

          <motion.div {...rise(0.48)} className="mt-1 flex items-center gap-3 text-[0.58rem] uppercase tracking-[0.28em] text-sage/85">
            <span className="h-px w-8 bg-gold/50" />
            <Sparkles size={12} className="text-gold" aria-hidden="true" />
            <span>A day to remember</span>
            <span className="h-px w-8 bg-gold/50" />
          </motion.div>

          <motion.a
            {...rise(0.56)}
            href="#date-reveal"
            whileHover={reduce ? undefined : { y: 3, scale: 1.025 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            className="interactive-button mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/35 bg-white/55 px-5 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-olive shadow-sm hover:border-gold/70 hover:bg-white/80"
          >
            Discover the invitation
            <ArrowDown size={14} aria-hidden="true" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
