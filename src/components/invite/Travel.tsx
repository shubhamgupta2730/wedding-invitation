import { CarFront, CircleParking, TrainFront } from "lucide-react";
import { wedding } from "@/config/wedding";
import { SectionHeading } from "@/components/invite/SectionHeading";
import { Reveal } from "@/components/invite/Reveal";

const travelIcons = [CarFront, TrainFront, CircleParking];

export function Travel() {
  const details = wedding.travel.details;

  return (
    <Reveal>
      <section className="px-5 py-10">
        <SectionHeading eyebrow="Plan your visit" title="Getting here" />
        {!wedding.travel.confirmed || details.length === 0 ? (
          <div className="interactive-card rounded-[1.4rem] border border-gold/25 bg-ivory px-5 py-8 text-center shadow-sm">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/35 bg-champagne/35 text-gold">
              <CarFront size={21} aria-hidden />
            </span>
            <h3 className="font-serif text-2xl text-olive">Travel notes</h3>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-olive/65">{wedding.travel.note}</p>
          </div>
        ) : (
          <div className="travel-list relative grid gap-3">
            {details.map((detail, index) => {
              const Icon = travelIcons[index % travelIcons.length];
              return (
                <article key={`${detail.title}-${index}`} className="interactive-card flex items-start gap-4 rounded-2xl border border-gold/25 bg-ivory p-5 shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne/50 text-olive">
                    <Icon size={18} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-olive">{detail.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-olive/70">{detail.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </Reveal>
  );
}
