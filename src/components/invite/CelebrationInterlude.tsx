"use client";

import { motion, useReducedMotion } from "framer-motion";
import { wedding } from "@/config/wedding";
import { Reveal } from "@/components/invite/Reveal";

const petals = Array.from({ length: 12 }, (_, index) => index * 30);

export function CelebrationInterlude() {
  const reduce = useReducedMotion();

  return (
    <Reveal>
      <section className="celebration-interlude relative overflow-hidden px-5 py-14 text-center sm:py-20">
        <div className="celebration-orb pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden />
        <motion.svg
          viewBox="0 0 240 190"
          role="img"
          aria-label="An original ornamental lotus illustration"
          className="relative mx-auto mb-6 h-40 w-52 overflow-visible sm:h-48 sm:w-60"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
        >
          <defs>
            <linearGradient id="lotus-stem" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#a7ad91" />
              <stop offset="1" stopColor="#b89a62" />
            </linearGradient>
          </defs>
          <path d="M42 166c34-10 122-10 156 0" fill="none" stroke="#b89a62" strokeOpacity=".65" strokeWidth="1" />
          <path d="M60 166c15-11 30-12 43-4m77 4c-15-11-30-12-43-4" fill="none" stroke="#a7ad91" strokeWidth="1.2" />
          <motion.g
            style={{ transformOrigin: "120px 104px" }}
            animate={reduce ? undefined : { rotate: [0, 2, -2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            {petals.map((angle, index) => (
              <motion.ellipse
                key={angle}
                cx="120"
                cy="104"
                rx={index % 3 === 0 ? 13 : 10}
                ry={index % 3 === 0 ? 39 : 32}
                transform={`rotate(${angle} 120 104)`}
                fill={index % 2 === 0 ? "#d9b9ae" : "#e9dcc7"}
                fillOpacity={index % 2 === 0 ? ".72" : ".92"}
                stroke="#b89a62"
                strokeOpacity=".7"
                strokeWidth=".8"
                initial={reduce ? false : { scale: 0.35, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
            <circle cx="120" cy="104" r="13" fill="#b89a62" />
            <circle cx="120" cy="104" r="5" fill="#f8f3e9" />
          </motion.g>
          <path d="M120 117c-2 13-1 27 0 43" fill="none" stroke="url(#lotus-stem)" strokeWidth="1.5" />
          <path d="M118 144c-16-14-27-13-35-6 12 14 24 17 35 11m5-6c16-14 27-13 35-6-12 14-24 17-35 11" fill="#a7ad91" fillOpacity=".48" stroke="#8b9275" strokeWidth=".8" />
          <circle cx="47" cy="90" r="2" fill="#b89a62" />
          <circle cx="195" cy="80" r="2.5" fill="#b89a62" />
          <circle cx="174" cy="44" r="1.5" fill="#d9b9ae" />
        </motion.svg>

        <p className="relative text-[0.63rem] uppercase tracking-[0.32em] text-sage">{wedding.interlude.eyebrow}</p>
        <h2 className="relative mx-auto mt-3 max-w-[19rem] font-serif text-3xl leading-tight text-olive sm:text-4xl">{wedding.interlude.title}</h2>
        <p className="relative mx-auto mt-4 max-w-[18rem] font-serif text-lg leading-relaxed text-olive/70">{wedding.interlude.body}</p>
      </section>
    </Reveal>
  );
}
