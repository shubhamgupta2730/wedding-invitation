import { wedding } from "@/config/wedding";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { Reveal } from "@/components/invite/Reveal";

export function WelcomeMessage() {
  return (
    <Reveal>
      <section className="relative px-5 py-12">
        <div className="interactive-card relative overflow-hidden rounded-[1.4rem] border border-gold/20 bg-ivory/80 px-6 py-12 text-center">
          <FloralCorner className="absolute left-0 top-0 h-20 w-20 opacity-80" position="tl" />
          <FloralCorner className="absolute right-0 top-0 h-20 w-20 opacity-80" position="tr" />
          <p className="text-[0.68rem] uppercase tracking-[0.3em] text-sage">Together with our families</p>
          <GoldDivider className="mx-auto mt-4 max-w-32" />
          <p className="mt-6 font-serif text-2xl leading-relaxed text-olive">
            {wedding.invitationMessage}
          </p>
        </div>
      </section>
    </Reveal>
  );
}
