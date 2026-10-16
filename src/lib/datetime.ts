import { wedding } from "@/config/wedding";

const IST = wedding.timeZone;

export function getWeddingDate(): Date | null {
  const date = new Date(wedding.countdownIso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatLongWeddingDate(): string | null {
  const date = getWeddingDate();
  if (!date) return null;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: IST,
  }).format(date);
}

export function formatEventDate(isoDate: string): string | null {
  if (!isoDate) return null;
  const date = new Date(`${isoDate}T00:00:00+05:30`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: IST,
  }).format(date);
}

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
};

export function getCountdownParts(now = new Date()): CountdownParts | null {
  const target = getWeddingDate();
  if (!target) return null;
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, complete: false };
}
