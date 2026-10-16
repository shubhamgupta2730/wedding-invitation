"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Music2 } from "lucide-react";
import { wedding } from "@/config/wedding";

export function MusicToggle() {
  const src = wedding.music.src;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "none";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  if (!src) return null;

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
      }
    } catch {
      setError(true);
      setPlaying(false);
    }
  };

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-gold/50 bg-ivory/90 text-olive shadow-sm backdrop-blur-sm"
      >
        {playing ? <Music2 size={18} /> : <Music size={18} />}
      </button>
      {error ? (
        <p className="mt-2 max-w-36 text-right text-[0.65rem] text-olive/70">
          Music could not start. Add a licensed file at the configured path.
        </p>
      ) : null}
    </div>
  );
}
