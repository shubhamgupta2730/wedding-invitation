import { wedding } from "@/config/wedding";

export function getDirectionsUrl(): string | null {
  const query = wedding.venue.mapsQuery.trim() || (wedding.venue.confirmed ? wedding.venue.address.trim() : "");
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
