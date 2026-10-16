import { wedding } from "@/config/wedding";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { SectionHeading } from "@/components/invite/SectionHeading";
import { Reveal } from "@/components/invite/Reveal";

export function Story() {
  if (!wedding.story.enabled) return null;

  return (
    <Reveal>
      <section className="px-5 py-10">
        <SectionHeading eyebrow={wedding.story.eyebrow} title={wedding.story.title} />
        <div className="relative overflow-hidden rounded-[1.4rem] border border-gold/20 bg-ivory px-6 py-10">
          <FloralCorner className="absolute right-0 top-0 h-20 w-20 opacity-70" position="tr" />
          <p className="font-serif text-xl leading-relaxed text-olive">{wedding.story.body}</p>
        </div>
      </section>
    </Reveal>
  );
}
