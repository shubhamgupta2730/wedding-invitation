"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Upload, RotateCcw, Download } from "lucide-react";
import { SectionHeading } from "@/components/invite/SectionHeading";
import { Reveal } from "@/components/invite/Reveal";
import { trackInvitationEvent } from "@/lib/analytics";

type VoiceStatus = "idle" | "recording" | "recorded" | "sending" | "sent" | "error";

function toBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const data = result.split(",")[1];
      if (data) resolve(data);
      else reject(new Error("Audio could not be prepared."));
    };
    reader.onerror = () => reject(new Error("Audio could not be prepared."));
    reader.readAsDataURL(blob);
  });
}

export function VoiceBlessing() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [message, setMessage] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const elapsedRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const startRecording = async () => {
    setMessage("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("error");
      setMessage("Voice recording is not supported in this browser. Please try a recent version of Chrome, Edge, or Safari.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"]
        .find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      chunksRef.current = [];
      elapsedRef.current = 0;
      setSeconds(0);
      setAudioBlob(null);
      setAudioUrl("");
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        if (timerRef.current !== null) window.clearInterval(timerRef.current);
        timerRef.current = null;
        const elapsed = Math.max(1, Math.min(20, Math.ceil((Date.now() - startedAtRef.current) / 1000)));
        elapsedRef.current = elapsed;
        setSeconds(elapsed);
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size > 0) {
          setAudioBlob(blob);
          setAudioUrl(URL.createObjectURL(blob));
          setStatus("recorded");
          setMessage("Your blessing is ready to listen to or send.");
        } else {
          setStatus("error");
          setMessage("We couldn't capture that recording. Please try again.");
        }
      };
      recorder.start();
      trackInvitationEvent("voice_recording_started");
      startedAtRef.current = Date.now();
      setStatus("recording");
      timerRef.current = window.setInterval(() => {
        const elapsed = Math.min(20, Math.floor((Date.now() - startedAtRef.current) / 1000));
        elapsedRef.current = elapsed;
        setSeconds(elapsed);
        if (elapsed >= 20) stopRecording();
      }, 250);
    } catch {
      setStatus("error");
      setMessage("Microphone access was not available. Allow microphone access and try again.");
    }
  };

  const sendRecording = async () => {
    if (!audioBlob) return;
    if (!name.trim()) {
      setStatus("error");
      setMessage("Add your name so the couple knows who sent this blessing.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/voice-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), mimeType: audioBlob.type, audio: await toBase64(audioBlob), duration: Math.max(1, elapsedRef.current) }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message || "Your voice blessing could not be sent. Please try again.");
      trackInvitationEvent("voice_note_submitted");
      setStatus("sent");
      setMessage("Your voice blessing has been sent to the couple. Thank you for sharing it.");
      setAudioBlob(null);
      setAudioUrl("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Your voice blessing could not be sent. Please try again.");
    }
  };

  const recordAgain = () => {
    setStatus("idle");
    setMessage("");
    setSeconds(0);
    setAudioBlob(null);
    setAudioUrl("");
  };

  return (
    <Reveal>
      <section className="px-5 py-10" aria-labelledby="voice-blessing-title">
        <SectionHeading eyebrow="A message from the heart" title="Leave a voice blessing" />
        <p id="voice-blessing-title" className="-mt-4 mb-6 text-center text-sm leading-relaxed text-olive/65">Record up to 20 seconds for the couple to keep. Recordings are sent privately when the guestbook is connected.</p>
        <div className="interactive-card space-y-4 rounded-2xl border border-gold/25 bg-ivory p-5 shadow-sm">
          <label className="block text-sm text-olive">
            Your name
            <input required maxLength={60} value={name} onChange={(event) => setName(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-gold/30 bg-champagne/30 px-3" autoComplete="name" />
          </label>
          <div className="rounded-2xl border border-gold/20 bg-white/60 px-4 py-5 text-center">
            <div className="font-serif text-2xl tabular-nums text-olive">00:{String(seconds).padStart(2, "0")} <span className="text-xs font-sans text-olive/50">/ 00:20</span></div>
            {status === "recording" ? <p className="mt-2 text-xs uppercase tracking-[0.16em] text-sage">Recording your message…</p> : null}
            {status === "recording" ? (
              <button type="button" onClick={stopRecording} className="interactive-button mx-auto mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-olive px-5 text-xs uppercase tracking-[0.12em] text-ivory">
                <Square size={14} fill="currentColor" aria-hidden /> Stop recording
              </button>
            ) : audioBlob ? (
              <div className="mt-4 space-y-3">
                {audioUrl ? <audio controls src={audioUrl} className="mx-auto h-10 w-full max-w-[280px]" aria-label="Preview your voice blessing" /> : null}
                <div className="flex flex-wrap justify-center gap-2">
                  {audioUrl ? <a href={audioUrl} download={audioBlob.type.includes("mp4") ? "wedding-blessing.m4a" : "wedding-blessing.webm"} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-gold/35 px-4 text-xs text-olive"><Download size={14} aria-hidden /> Save recording</a> : null}
                  <button type="button" onClick={recordAgain} disabled={status === "sending"} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-gold/35 px-4 text-xs text-olive disabled:opacity-50"><RotateCcw size={14} aria-hidden /> Record again</button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={startRecording} className="interactive-button mx-auto mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/40 bg-ivory px-5 text-xs uppercase tracking-[0.12em] text-olive">
                <Mic size={15} aria-hidden /> Start recording
              </button>
            )}
          </div>
          {audioBlob ? (
            <button type="button" onClick={sendRecording} disabled={status === "sending"} className="interactive-button flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-olive text-sm uppercase tracking-[0.16em] text-ivory disabled:opacity-60">
              <Upload size={16} aria-hidden /> {status === "sending" ? "Sending voice blessing…" : "Send voice blessing"}
            </button>
          ) : null}
          {message ? <p role="status" className={`rounded-xl px-3 py-3 text-center text-sm leading-relaxed ${status === "sent" ? "bg-sage/20 text-olive" : "bg-champagne/60 text-olive"}`}>{message}</p> : null}
          <p className="text-center text-[0.68rem] leading-relaxed text-olive/50">Sent recordings are saved in the couple&apos;s private voice blessings folder and are never posted publicly.</p>
        </div>
      </section>
    </Reveal>
  );
}
