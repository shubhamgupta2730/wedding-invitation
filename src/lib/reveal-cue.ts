/** A short, original bell-like arpeggio made with Web Audio for the curtain reveal. */
export async function playRevealCue() {
  if (typeof window === "undefined" || !window.AudioContext) return;

  try {
    const context = new window.AudioContext();
    await context.resume();
    const master = context.createGain();
    master.gain.value = 0.42;
    master.connect(context.destination);

    const now = context.currentTime + 0.04;
    const notes = [
      { frequency: 440, at: 0, pan: -0.35 },
      { frequency: 554.37, at: 0.23, pan: -0.15 },
      { frequency: 659.25, at: 0.47, pan: 0.1 },
      { frequency: 880, at: 0.72, pan: 0.28 },
      { frequency: 1108.73, at: 1.02, pan: 0.05 },
    ];

    for (const note of notes) {
      const start = now + note.at;
      const panner = context.createStereoPanner();
      panner.pan.value = note.pan;
      panner.connect(master);

      // Two partials create a soft, bell-like tone without an external audio asset.
      for (const partial of [
        { ratio: 1, volume: 0.075 },
        { ratio: 2.76, volume: 0.018 },
      ]) {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = note.frequency * partial.ratio;
        envelope.gain.setValueAtTime(0.0001, start);
        envelope.gain.exponentialRampToValueAtTime(partial.volume, start + 0.025);
        envelope.gain.exponentialRampToValueAtTime(0.0001, start + 1.35);
        oscillator.connect(envelope);
        envelope.connect(panner);
        oscillator.start(start);
        oscillator.stop(start + 1.4);
      }
    }

    window.setTimeout(() => {
      void context.close();
    }, 3200);
  } catch {
    // Keep the invitation experience working if audio is unavailable or blocked.
  }
}
