"use client";

import { MapPin, Navigation } from "lucide-react";
import { wedding } from "@/config/wedding";
import { getDirectionsUrl } from "@/lib/maps";
import { SectionHeading } from "@/components/invite/SectionHeading";
import { Reveal } from "@/components/invite/Reveal";
import { trackInvitationEvent } from "@/lib/analytics";

export function Venue() {
  const directions = getDirectionsUrl();
  const previewQuery = wedding.venue.mapsQuery.trim();

  return (
    <Reveal>
      <section id="venue" className="scroll-mt-20 px-5 py-10">
        <SectionHeading eyebrow="Join us" title="Venue" />
        <div className="interactive-card overflow-hidden rounded-[1.4rem] border border-gold/25 bg-ivory shadow-sm">
          <div className="px-5 py-7 sm:px-7">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-champagne/40">
                <MapPin className="text-gold" size={19} aria-hidden />
              </span>
              <div>
                <h3 className="font-serif text-2xl text-olive">{wedding.venue.confirmed ? wedding.venue.name : "Location details to follow"}</h3>
                <p className="mt-2 text-sm leading-relaxed text-olive/75">{wedding.venue.address}</p>
                {!wedding.venue.confirmed ? (
                  <p className="mt-3 max-w-xs text-xs leading-relaxed text-olive/60">
                    {wedding.venue.note}
                  </p>
                ) : null}
              </div>
            </div>
            {directions ? (
              <a
                href={directions}
                onClick={() => trackInvitationEvent("directions_clicked")}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-button mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-olive px-5 text-sm text-ivory"
              >
                <Navigation size={16} aria-hidden />
                Get Directions
              </a>
            ) : null}
          </div>
          {wedding.venue.confirmed && previewQuery ? (
            <iframe
              title="Map preview of the wedding venue"
              className="h-48 w-full border-t border-gold/20"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(previewQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            />
          ) : !wedding.venue.confirmed ? (
            <div aria-hidden className="venue-ornament relative flex h-24 items-center justify-center overflow-hidden border-t border-gold/15">
              <span className="absolute h-16 w-16 rounded-full border border-gold/20" />
              <span className="absolute h-11 w-11 rounded-full border border-gold/25" />
              <MapPin className="relative text-gold/70" size={19} />
            </div>
          ) : null}
        </div>
      </section>
    </Reveal>
  );
}
