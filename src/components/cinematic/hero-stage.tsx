"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { photos, type Photo } from "@/lib/photos";

const SCENE_MS = 6500;

/**
 * Each scene reads like a film title card: an index and sector, one line of
 * story, and a hairline "ledger" along the bottom that carries the figures.
 */
type Scene = {
  photo: Photo;
  sector: string;
  line: string;
  ledger: { left: string; right: string; solid: number; pending?: number };
};

const scenes: Scene[] = [
  {
    photo: photos.shopkeeper,
    sector: "Trade and distribution",
    line: "A supermarket invoice becomes stock on the shelves.",
    ledger: { left: "Invoice advance · GH₵ 400,000", right: "62% cleared · 14% pending", solid: 62, pending: 14 },
  },
  {
    photo: photos.tailor,
    sector: "Manufacturing",
    line: "A uniform contract, with the fabric funded first.",
    ledger: { left: "Contract financing · GH₵ 180,000", right: "Credit assessment · stage 8 of 12", solid: 67 },
  },
  {
    photo: photos.investorLaptop,
    sector: "Investors",
    line: "Know what you've been paid, and what's still to come.",
    ledger: { left: "Received · GH₵ 1,284.50", right: "Next · 30 Nov · GH₵ 2,706.25 expected", solid: 36, pending: 0 },
  },
];

export function HeroStage() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const duration = SCENE_MS + (active === 0 ? 1500 : 0);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % scenes.length), duration);
    return () => clearTimeout(t);
  }, [active, paused, duration]);

  return (
    <div
      className="stage-open relative h-[78svh] min-h-[520px] max-h-[860px] overflow-hidden rounded-[1.5rem] bg-aubergine-950 sm:rounded-[2rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {scenes.map((s, i) => {
        const on = i === active;
        return (
          <div
            key={s.photo.src}
            aria-hidden={!on}
            className={`absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-[var(--ease-out)] ${on ? "scale-100 opacity-100" : "scale-[1.05] opacity-0"}`}
          >
            <Image src={s.photo.src} alt={s.photo.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
            {/* Legibility: a deep wash from the bottom, light at the top. */}
            <div className="absolute inset-0 bg-gradient-to-t from-aubergine-950/90 via-aubergine-950/25 to-transparent" />
          </div>
        );
      })}

      {/* Title card */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-10 sm:pb-9 lg:px-14 lg:pb-12">
        {scenes.map((s, i) => {
          const on = i === active;
          return (
            <div key={s.photo.src} aria-hidden={!on} className={on ? "relative" : "pointer-events-none absolute inset-x-5 bottom-6 sm:inset-x-10 sm:bottom-9 lg:inset-x-14 lg:bottom-12"}>
              <p
                style={{ transitionDelay: on ? "250ms" : "0ms" }}
                className={`font-mono text-[11px] tracking-[0.14em] text-saffron-300 uppercase transition-[opacity,transform] duration-500 ease-[var(--ease-out)] sm:text-xs ${
                  on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
              >
                {String(i + 1).padStart(2, "0")} — {s.sector}
              </p>
              <p
                style={{ transitionDelay: on ? "350ms" : "0ms" }}
                className={`mt-3 max-w-[18ch] text-[clamp(1.75rem,4.6vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.035em] text-white transition-[opacity,transform,filter] duration-700 ease-[var(--ease-out)] ${
                  on ? "translate-y-0 opacity-100 blur-0" : "translate-y-3 opacity-0 blur-[3px]"
                }`}
              >
                {s.line}
              </p>

              {/* The ledger: a hairline track with the figures written along it. */}
              <div
                style={{ transitionDelay: on ? "550ms" : "0ms" }}
                className={`mt-6 transition-opacity duration-500 sm:mt-8 ${on ? "opacity-100" : "opacity-0"}`}
              >
                <div className="relative h-px bg-white/25">
                  <span
                    className="absolute inset-y-0 left-0 origin-left bg-white transition-transform duration-[1200ms] ease-[var(--ease-out)]"
                    style={{ width: `${s.ledger.solid}%`, transform: on ? "scaleX(1)" : "scaleX(0)", transitionDelay: on ? "650ms" : "0ms" }}
                  />
                  {!!s.ledger.pending && (
                    <span
                      className="absolute inset-y-0 origin-left bg-saffron-400 transition-transform duration-[900ms] ease-[var(--ease-out)]"
                      style={{
                        left: `${s.ledger.solid}%`,
                        width: `${s.ledger.pending}%`,
                        transform: on ? "scaleX(1)" : "scaleX(0)",
                        transitionDelay: on ? "1200ms" : "0ms",
                      }}
                    />
                  )}
                  <span
                    className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity duration-300"
                    style={{ left: `${s.ledger.solid}%`, opacity: on ? 1 : 0, transitionDelay: on ? "1500ms" : "0ms" }}
                  />
                </div>
                <div className="mt-3 flex flex-col gap-1 font-mono text-[11px] tracking-[0.06em] text-white/80 sm:flex-row sm:justify-between sm:text-xs">
                  <span>{s.ledger.left}</span>
                  <span className="text-white/60">{s.ledger.right}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scene index: 01 02 03, the active one drawing its timer underneath. */}
      <div className="absolute top-5 right-5 flex gap-1 sm:top-8 sm:right-10 lg:right-14" role="tablist" aria-label="Scenes">
        {scenes.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.photo.src}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={`Scene ${i + 1}: ${s.sector}`}
              onClick={() => setActive(i)}
              className={`relative h-11 min-w-11 px-2 font-mono text-xs tracking-[0.1em] transition-colors ${on ? "text-white" : "text-white/45 hover:text-white/80"}`}
            >
              {String(i + 1).padStart(2, "0")}
              <span className="absolute inset-x-2 bottom-2 h-px overflow-hidden bg-white/20">
                {on && (
                  <span
                    key={`${active}-${paused}`}
                    className="block h-full origin-left bg-saffron-400"
                    style={{ animation: `fill-x ${duration}ms linear forwards`, animationPlayState: paused ? "paused" : "running" }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
