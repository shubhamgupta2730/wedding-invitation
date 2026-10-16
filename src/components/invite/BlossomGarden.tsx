"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/invite/SectionHeading";
import { Reveal } from "@/components/invite/Reveal";
import { trackInvitationEvent } from "@/lib/analytics";

const wishes = [
  { title: "A wish for joy", note: "May the happiest moments bloom in the smallest things." },
  { title: "A wish for laughter", note: "May every new chapter have a story worth laughing about." },
  { title: "A wish for adventure", note: "May the road ahead always feel better together." },
  { title: "A wish for kindness", note: "May gentle words and thoughtful gestures fill your days." },
  { title: "A wish for forever", note: "May this beautiful beginning keep unfolding, year after year." },
];

const petalColors = ["#d9aaa4", "#edc8b6", "#ad8051", "#c78c84", "#f2dfcf"];
const burstVectors = [
  [-29, -28], [-4, -39], [26, -28], [38, -3], [24, 25], [0, 37], [-27, 25], [-38, -3],
];

function Blossom({ color, active, reduce }: { color: string; active: boolean; reduce: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-14 w-14 overflow-visible sm:h-16 sm:w-16"
      animate={active || reduce ? undefined : { rotate: [-3, 3, -3], y: [0, -2, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <ellipse
          key={index}
          cx="32"
          cy="18"
          rx="7.2"
          ry="12"
          transform={`rotate(${index * 45} 32 32)`}
          fill={color}
          fillOpacity={index % 2 === 0 ? 0.92 : 0.7}
          stroke="#fffaf3"
          strokeOpacity="0.8"
          strokeWidth="1"
        />
      ))}
      <circle cx="32" cy="32" r="7" fill="#ad8051" />
      <circle cx="32" cy="32" r="2.2" fill="#fff3d7" />
    </motion.svg>
  );
}

export function BlossomGarden() {
  const [selected, setSelected] = useState<{ title: string; note: string } | null>(null);
  const [guestWishes, setGuestWishes] = useState<{ id: string; name: string; message: string }[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [shareWish, setShareWish] = useState(false);
  const [wishStatus, setWishStatus] = useState("");
  const [sendingWish, setSendingWish] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let active = true;
    fetch("/api/wishes")
      .then((response) => response.json())
      .then((data: { wishes?: { id: string; name: string; message: string }[] }) => {
        if (active && Array.isArray(data.wishes)) setGuestWishes(data.wishes.slice(0, 12));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const submitWish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSendingWish(true);
    setWishStatus("");
    try {
      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName.trim(), wish: guestMessage.trim(), share: shareWish }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message || "Your blessing could not be saved. Please try again.");
      trackInvitationEvent("wish_submitted");
      const added = { id: `${Date.now()}`, name: guestName.trim(), message: guestMessage.trim() };
      setGuestWishes((current) => [{ ...added, name: added.name.split(/\s+/)[0] }, ...current].slice(0, 12));
      setSelected({ title: `A wish from ${added.name}`, note: added.message });
      setGuestMessage("");
      setWishStatus(shareWish ? "Your blessing has blossomed on the wishes tree." : "Your blessing was sent privately to the couple.");
    } catch (error) {
      setWishStatus(error instanceof Error ? error.message : "Your blessing could not be saved. Please try again.");
    } finally {
      setSendingWish(false);
    }
  };

  return (
    <Reveal>
      <section className="blossom-garden relative overflow-hidden px-5 py-14 sm:py-16" aria-labelledby="blossom-title">
        <div className="pointer-events-none absolute inset-x-10 top-10 -z-0 h-48 rounded-full bg-[radial-gradient(ellipse,rgba(217,170,164,.16),transparent_70%)]" aria-hidden="true" />
        <div className="relative z-10">
          <SectionHeading eyebrow="A little something from everyone" title="The wishes tree" />
          <p className="-mt-4 mb-8 text-center text-sm text-olive/65">Tap a blossom to read its blessing, or leave one of your own.</p>

          <div className="relative mx-auto grid min-h-[285px] max-w-sm grid-cols-3 content-center justify-items-center gap-x-3 gap-y-5 overflow-hidden rounded-[2rem] border border-gold/15 bg-[radial-gradient(ellipse_at_50%_80%,rgba(173,128,81,.12),transparent_58%)] px-2 py-5 sm:grid-cols-5 sm:gap-x-1">
            <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[.3]" viewBox="0 0 360 285" fill="none" aria-hidden="true">
              <path d="M178 286C181 242 178 214 183 178C187 145 168 130 143 112M182 209C204 177 216 151 218 118M180 178C166 160 157 143 157 125M185 152C200 135 208 120 208 101" stroke="#ad8051" strokeWidth="5" strokeLinecap="round" />
              <path d="M143 112C128 98 115 101 106 111M218 118C231 104 245 107 252 118M157 125C143 114 131 117 125 127M208 101C218 88 232 91 238 101" stroke="#a07770" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="178" cy="270" rx="93" ry="9" fill="#ad8051" fillOpacity=".2" />
            </svg>
            {wishes.map((wish, index) => (
              <motion.button
                key={wish.title}
                type="button"
                aria-pressed={selected?.title === wish.title}
                onClick={() => setSelected({ title: wish.title, note: wish.note })}
                whileHover={reduce ? undefined : { y: -5, scale: 1.08, rotate: index % 2 ? 5 : -5 }}
                whileTap={reduce ? undefined : { scale: 0.94 }}
                className="blossom-choice group relative flex min-h-28 w-full flex-col items-center justify-start rounded-2xl px-1 py-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <span className="relative flex h-[4.5rem] items-center justify-center">
                  <Blossom color={petalColors[index]} active={selected?.title === wish.title} reduce={!!reduce} />
                  <AnimatePresence>
                    {selected?.title === wish.title && !reduce ? burstVectors.map(([x, y], petal) => (
                      <motion.i
                        key={`${selected}-${petal}`}
                        className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                        style={{ backgroundColor: petalColors[(index + petal) % petalColors.length] }}
                        initial={{ x: 0, y: 0, opacity: 0.95, scale: 0.3 }}
                        animate={{ x, y, opacity: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.78, ease: "easeOut" }}
                        aria-hidden="true"
                      />
                    )) : null}
                  </AnimatePresence>
                </span>
                <span className={`mt-1 text-[0.62rem] leading-tight transition-colors ${selected?.title === wish.title ? "font-medium text-olive" : "text-olive/60 group-hover:text-olive"}`}>
                  {wish.title.replace("A wish for ", "")}
                </span>
              </motion.button>
            ))}
            {guestWishes.map((wish, index) => (
              <motion.button
                key={wish.id}
                type="button"
                aria-label={`Read a blessing from ${wish.name}`}
                aria-pressed={selected?.title === `A wish from ${wish.name}`}
                onClick={() => setSelected({ title: `A wish from ${wish.name}`, note: wish.message })}
                whileHover={reduce ? undefined : { y: -5, scale: 1.08, rotate: index % 2 ? 5 : -5 }}
                whileTap={reduce ? undefined : { scale: 0.94 }}
                className="blossom-choice group relative flex min-h-28 w-full flex-col items-center justify-start rounded-2xl px-1 py-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <span className="relative flex h-[4.5rem] items-center justify-center">
                  <Blossom color={petalColors[(index + 1) % petalColors.length]} active={selected?.title === `A wish from ${wish.name}`} reduce={!!reduce} />
                </span>
                <span className="mt-1 max-w-full truncate text-[0.62rem] leading-tight text-olive/65 group-hover:text-olive">{wish.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="mx-auto mt-5 min-h-[5.4rem] max-w-sm" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait">
              {selected !== null ? (
                <motion.div
                  key={selected.title}
                  initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-gold/25 bg-ivory/80 px-5 py-4 text-center shadow-sm"
                >
                  <p className="font-serif text-xl text-olive">{selected.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-olive/70">{selected.note}</p>
                </motion.div>
              ) : (
                <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-5 text-center font-serif text-base italic text-sage/80">
                  Five little blossoms are waiting for you
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={submitWish} className="mx-auto mt-5 max-w-sm space-y-3 rounded-2xl border border-gold/25 bg-ivory/90 p-4 text-left shadow-sm">
            <p className="text-center font-serif text-xl text-olive">Leave a blessing</p>
            <label className="block text-sm text-olive">
              Your name
              <input required maxLength={60} value={guestName} onChange={(event) => setGuestName(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-gold/30 bg-white/70 px-3" />
            </label>
            <label className="block text-sm text-olive">
              A short wish for the couple
              <textarea required maxLength={180} rows={3} value={guestMessage} onChange={(event) => setGuestMessage(event.target.value)} className="mt-1 w-full rounded-xl border border-gold/30 bg-white/70 px-3 py-2" placeholder="May your days be full of laughter…" />
              <span className="mt-1 block text-right text-xs text-olive/50">{guestMessage.length}/180</span>
            </label>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-olive/75">
              <input type="checkbox" checked={shareWish} onChange={(event) => setShareWish(event.target.checked)} className="mt-0.5 accent-[#ad8051]" />
              Show my first name and blessing on the tree for other guests.
            </label>
            <button type="submit" disabled={sendingWish} className="interactive-button flex min-h-11 w-full items-center justify-center rounded-full bg-olive text-xs font-medium uppercase tracking-[0.16em] text-ivory disabled:opacity-60">
              {sendingWish ? "Sending your blessing…" : "Plant my wish"}
            </button>
            {wishStatus ? <p role="status" className="text-center text-xs leading-relaxed text-olive/75">{wishStatus}</p> : null}
          </form>
        </div>
      </section>
    </Reveal>
  );
}
