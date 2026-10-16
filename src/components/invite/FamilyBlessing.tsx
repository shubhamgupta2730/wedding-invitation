import { Quote } from "lucide-react";
import { wedding } from "@/config/wedding";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { Reveal } from "@/components/invite/Reveal";

export function FamilyBlessing() {
  return (
    <Reveal>
      <section className="px-5 py-7" aria-labelledby="family-blessing-title">
        <div className="family-note interactive-card relative mx-auto max-w-[390px] overflow-hidden rounded-[1.6rem] border border-gold/35 px-6 py-9 text-center shadow-[0_14px_38px_rgba(73,58,55,.07)] sm:px-9 sm:py-11">
          <FloralCorner className="pointer-events-none absolute -left-1 -top-1 h-20 w-20 opacity-45" position="tl" />
          <FloralCorner className="pointer-events-none absolute -right-1 -top-1 h-20 w-20 opacity-45" position="tr" />
          <FloralCorner className="pointer-events-none absolute -bottom-1 -left-1 h-20 w-20 opacity-35" position="bl" />
          <FloralCorner className="pointer-events-none absolute -bottom-1 -right-1 h-20 w-20 opacity-35" position="br" />
          <div className="relative z-10">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-ivory/80 text-gold">
              <Quote size={17} aria-hidden="true" />
            </span>
            <p className="mt-3 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-sage">A note from our families</p>
            <h2 id="family-blessing-title" className="mt-2 font-serif text-2xl text-olive">A blessing for our beginning</h2>
            <GoldDivider className="mx-auto mt-4 max-w-32" />
            <p className="font-note mx-auto mt-4 max-w-[19rem] text-[1.65rem] leading-[1.2] text-olive/85 sm:text-[1.85rem]">
              {wedding.familyBlessing}
            </p>
            <p className="font-note mt-4 text-xl italic text-sage">{wedding.familySignoff}</p>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
