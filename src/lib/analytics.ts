export type InvitationEvent =
  | "page_opened"
  | "curtain_opened"
  | "date_revealed"
  | "calendar_download_clicked"
  | "date_navigation_clicked"
  | "celebrations_navigation_clicked"
  | "venue_navigation_clicked"
  | "rsvp_navigation_clicked"
  | "directions_clicked"
  | "rsvp_started"
  | "rsvp_submitted"
  | "wish_submitted"
  | "voice_recording_started"
  | "voice_note_submitted"
  | "invitation_share_clicked";

/** Send only an allowlisted event name. No guest, device, or location data is attached. */
export function trackInvitationEvent(event: InvitationEvent) {
  if (typeof window === "undefined") return;

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event }),
    keepalive: true,
  }).catch(() => {
    // Analytics must never interrupt the invitation experience.
  });
}
