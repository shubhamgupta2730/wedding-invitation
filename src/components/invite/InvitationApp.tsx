"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Cover } from "@/components/invite/Cover";
import { HeroCard } from "@/components/invite/HeroCard";
import { ScratchReveal } from "@/components/invite/ScratchReveal";
import { WelcomeMessage } from "@/components/invite/WelcomeMessage";
import { Countdown } from "@/components/invite/Countdown";
import { Events } from "@/components/invite/Events";
import { Venue } from "@/components/invite/Venue";
import { Story } from "@/components/invite/Story";
import { Rsvp, type RsvpConfirmation } from "@/components/invite/Rsvp";
import { Closing } from "@/components/invite/Closing";
import { MusicToggle } from "@/components/invite/MusicToggle";
import { CelebrationInterlude } from "@/components/invite/CelebrationInterlude";
import { Reveal } from "@/components/invite/Reveal";
import { BlossomGarden } from "@/components/invite/BlossomGarden";
import { FamilyBlessing } from "@/components/invite/FamilyBlessing";
import { VoiceBlessing } from "@/components/invite/VoiceBlessing";
import { InvitationNav } from "@/components/invite/InvitationNav";
import { trackInvitationEvent } from "@/lib/analytics";

export function InvitationApp() {
  const [opened, setOpened] = useState(false);
  const [rsvpConfirmation, setRsvpConfirmation] = useState<RsvpConfirmation | null>(null);
  const pageOpenTracked = useRef(false);

  useEffect(() => {
    if (pageOpenTracked.current) return;
    pageOpenTracked.current = true;
    trackInvitationEvent("page_opened");
  }, []);

  const returnToCoverPosition = useCallback(() => {
    // Browsers can restore an old #date-reveal anchor before the cover hydrates.
    // Clear it while the cover is shown so opening always reveals the invitation from its beginning.
    const { pathname, search, hash } = window.location;
    if (hash) window.history.replaceState(window.history.state, "", `${pathname}${search}`);
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousBehavior;
  }, []);

  useLayoutEffect(() => {
    returnToCoverPosition();
  }, [returnToCoverPosition]);

  const restart = () => {
    returnToCoverPosition();
    setOpened(false);
  };

  return (
    <div className="paper relative min-h-dvh">
      <div aria-hidden={!opened} inert={!opened} className={opened ? undefined : "h-dvh overflow-hidden"}>
        <MusicToggle />
        <a href="#invitation" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ivory focus:px-3 focus:py-2">
          Skip to invitation
        </a>
        <div id="invitation" className="invitation-shell">
          <InvitationNav />
          <Reveal><HeroCard /></Reveal>
          <ScratchReveal />
          <WelcomeMessage />
          <FamilyBlessing />
          <CelebrationInterlude />
          <BlossomGarden />
          <Countdown />
          <Events />
          <Venue />
          <Story />
          <Rsvp onSuccess={setRsvpConfirmation} />
          <VoiceBlessing />
          <Closing onRestart={restart} rsvpConfirmation={rsvpConfirmation} />
        </div>
      </div>
      {!opened ? <Cover onOpen={() => {
        trackInvitationEvent("curtain_opened");
        returnToCoverPosition();
        setOpened(true);
      }} /> : null}
    </div>
  );
}
