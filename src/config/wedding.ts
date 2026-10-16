export type WeddingEvent = {
  id: string;
  name: string;
  /** Set to true when the date and time are confirmed. */
  configured: boolean;
  /** ISO date (YYYY-MM-DD) in India, or empty when unknown. */
  date: string;
  /** Display time, e.g. "10:30 AM". Leave empty if not confirmed. */
  time: string;
  venue: string;
  description: string;
};

export type TravelDetail = {
  title: string;
  description: string;
};

export const wedding = {
  couple: {
    groom: "Rishi",
    bride: "Nikita",
    namesDisplay: "Rishi & Nikita",
    /** Optional family lines; leave blank until names and wording are confirmed. */
    groomsParents: "",
    bridesParents: "",
  },
  /** Wedding date revealed in the scratch card and used to create the calendar event. */
  displayDate: "20 November 2026",
  /** All-day calendar date; the countdown derives its target from the first configured event below. */
  countdownIso: "2026-11-20T00:00:00+05:30",
  timeZone: "Asia/Kolkata",
  tagline: "We're getting married",
  saveTheDateLabel: "Save the Date",
  invitationMessage:
    "With the blessings of our families, we joyfully invite you to celebrate the wedding of Rishi & Nikita.",
  familyBlessing:
    "With grateful hearts and the blessings of our families, we begin this beautiful new chapter. It would mean so much to have you by our side as we celebrate together.",
  familySignoff: "With love, our families",
  interlude: {
    eyebrow: "A moment to celebrate",
    title: "Two hearts. One beautiful beginning.",
    body: "A celebration made brighter by the people who mean the most.",
  },
  closingMessage: "We look forward to celebrating with you.",
  story: {
    // Keep this optional section hidden until the couple supplies real copy.
    enabled: false,
    eyebrow: "A note from us",
    title: "Our forever begins",
    body: "",
  },
  venue: {
    confirmed: true,
    name: "Porwal Community Center & Marriage Garden",
    address: "4RGX+GQ2, Subhash Nagar First, Rangbari, Kota, Rajasthan 324005",
    /** Used for the embedded map and directions link. */
    mapsQuery: "Porwal Community Center & Marriage Garden, 4RGX+GQ2, Subhash Nagar First, Rangbari, Kota, Rajasthan 324005",
    note: "",
  },
  travel: {
    confirmed: false,
    note: "Travel and parking information will be shared here once the venue arrangements are confirmed.",
    details: [] as TravelDetail[],
  },
  events: [
    {
      id: "haldi",
      name: "Haldi",
      configured: true,
      date: "2026-11-19",
      time: "10:00 AM",
      venue: "",
      description: "",
    },
    {
      id: "mayra",
      name: "Mayra",
      configured: true,
      date: "2026-11-19",
      time: "1:00 PM",
      venue: "",
      description: "",
    },
    {
      id: "sangeet",
      name: "Sangeet",
      configured: true,
      date: "2026-11-19",
      time: "7:00 PM",
      venue: "",
      description: "",
    },
    {
      id: "sagai",
      name: "Sagai",
      configured: true,
      date: "2026-11-20",
      time: "11:00 AM",
      venue: "",
      description: "",
    },
    {
      id: "reception",
      name: "Reception",
      configured: true,
      date: "2026-11-20",
      time: "8:00 PM",
      venue: "",
      description: "",
    },
  ] satisfies WeddingEvent[],
  rsvp: {
    enabled: true,
    headline: "Kindly respond",
    intro: "Please let us know if you will celebrate with us. We cannot wait to hear from you.",
    /** Optional contact detail shown below the RSVP form. */
    contactNote: "",
    thankYouAttending: "Thank you, {name}. We're delighted you'll be with us. Your presence will make our celebration even more special.",
    thankYouDeclining: "Thank you for letting us know, {name}. We'll miss having you with us and send you our love.",
  },
  music: {
    /** Place a licensed audio file in public/audio and set the path here. */
    src: "",
    label: "Background music",
  },
  share: {
    title: "Rishi & Nikita — Wedding Invitation",
    text: "You are invited to celebrate the wedding of Rishi & Nikita.",
  },
  siteName: "Rishi & Nikita Wedding",
} as const;

export type WeddingConfig = typeof wedding;
