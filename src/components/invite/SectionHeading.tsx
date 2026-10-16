"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GoldDivider } from "@/components/ornaments/GoldDivider";

export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.header
      className="mb-8 text-center"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow ? (
        <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-sage">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-serif text-3xl text-olive sm:text-4xl">{title}</h2>
      <GoldDivider className="mx-auto mt-4 max-w-48" />
    </motion.header>
  );
}
