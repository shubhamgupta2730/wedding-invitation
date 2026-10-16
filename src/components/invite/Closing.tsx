"use client";

import { Share2, RotateCcw } from "lucide-react";
import { wedding } from "@/config/wedding";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { Reveal } from "@/components/invite/Reveal";
import type { RsvpConfirmation } from "@/components/invite/Rsvp";
import { trackInvitationEvent } from "@/lib/analytics";

export function Closing({
  onRestart,
  rsvpConfirmation,
}: {
  onRestart: () => void;
  rsvpConfirmation: RsvpConfirmation | null;
}) {
  const thankYou = rsvpConfirmation
    ? (rsvpConfirmation.attending === "yes"
        ? wedding.rsvp.thankYouAttending
        : wedding.rsvp.thankYouDeclining
      ).replace("{name}", rsvpConfirmation.name)
    : wedding.closingMessage;
  const share = async () => {
    trackInvitationEvent("invitation_share_clicked");
    const url = window.location.href;
    const payload = { title: wedding.share.title, text: wedding.share.text, url };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(url);
      window.alert("Invitation link copied.");
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        window.alert("Invitation link copied.");
      } catch {
        window.alert("Unable to share automatically. Please copy the page URL.");
      }
    }
  };

  return (
    <Reveal>
      <section className="px-5 pb-16 pt-8">
        <div className="interactive-card relative overflow-hidden rounded-[1.6rem] border border-gold/35 bg-ivory px-6 py-14 text-center shadow-[0_16px_40px_rgba(65,68,56,0.08)]">
          <FloralCorner className="absolute left-1 top-1 h-24 w-24" position="tl" />
          <FloralCorner className="absolute right-1 top-1 h-24 w-24" position="tr" />
          <FloralCorner className="absolute bottom-1 left-1 h-24 w-24" position="bl" />
          <FloralCorner className="absolute bottom-1 right-1 h-24 w-24" position="br" />
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-sage">With love</p>
          <h2 className="mt-4 font-serif text-4xl text-olive">{wedding.couple.namesDisplay}</h2>
          <GoldDivider className="mx-auto mt-4 max-w-36" />
          <p aria-live="polite" className="mt-6 font-serif text-lg leading-relaxed text-olive/85">
            {thankYou}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={share}
              className="interactive-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-olive px-5 text-sm text-ivory"
            >
              <Share2 size={16} aria-hidden />
              Share invitation
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="interactive-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/50 px-5 text-sm text-olive"
            >
              <RotateCcw size={16} aria-hidden />
              Return to beginning
            </button>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
