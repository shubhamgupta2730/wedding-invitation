import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import { wedding } from "@/config/wedding";
import { trackInvitationEvent, type InvitationEvent } from "@/lib/analytics";

const links = [
  { href: "#date-reveal", label: "Our date", icon: CalendarDays, event: "date_navigation_clicked" },
  { href: "#events", label: "Celebrations", icon: Sparkles, event: "celebrations_navigation_clicked" },
  { href: "#venue", label: "Venue", icon: MapPin, event: "venue_navigation_clicked" },
  { href: "#rsvp", label: "RSVP", icon: null, event: "rsvp_navigation_clicked" },
];

export function InvitationNav() {
  return (
    <nav aria-label="Invitation sections" className="invitation-nav sticky top-0 z-40 border-b border-gold/15 px-3 py-2 sm:px-6">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <a href="#invitation" className="group flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 text-olive" aria-label={`${wedding.couple.namesDisplay}, back to invitation top`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/35 bg-white/75 font-serif text-[0.62rem] tracking-tight shadow-sm">
            R<span className="text-gold">&amp;</span>N
          </span>
          <span className="hidden font-serif text-sm sm:inline">{wedding.couple.namesDisplay}</span>
        </a>
        <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-full border border-gold/20 bg-white/65 p-1 shadow-[0_4px_14px_rgba(73,58,55,.04)] backdrop-blur-md sm:gap-1">
          {links.map(({ href, label, icon: Icon, event }) => (
            <a key={href} href={href} onClick={() => trackInvitationEvent(event as InvitationEvent)} className="nav-link inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-[0.64rem] font-medium text-olive/70 transition-colors hover:bg-[#f3e8df] hover:text-olive focus-visible:bg-[#f3e8df] sm:px-3 sm:text-xs">
              {Icon ? <Icon size={13} aria-hidden="true" /> : null}
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
