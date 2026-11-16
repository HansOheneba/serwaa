"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { MoneyBadge } from "@/components/ui";
import { Weave } from "@/components/weave";
import { photos, type Photo } from "@/lib/photos";

const SCENE_MS = 6000;

type Scene = { photo: Photo; tags: string[]; caption: string; widget: ReactNode; align: "left" | "right" };

function Glass({ children }: { children: ReactNode }) {
  return <div className="w-72 rounded-2xl bg-white/95 p-4 shadow-2xl shadow-aubergine-950/30 ring-1 ring-white/60 backdrop-blur sm:w-80">{children}</div>;
}

const mono = "font-mono text-[11px] tracking-[0.08em] uppercase";

const scenes: Scene[] = [
  {
    photo: photos.shopkeeper,
    tags: ["Trade and distribution", "Invoice financing", "3 months"],
    caption: "A shop owner turns a supermarket invoice into stock on the shelves.",
    align: "right",
    widget: (
      <Glass>
        <p className={`${mono} text-aubergine-500`}>Campaign · Funding</p>
        <p className="mt-1 font-bold text-aubergine-800">GH₵ 400,000 invoice advance</p>
        <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-ink-100">
          <span className="h-full w-[62%] bg-money-cleared" />
          <span className="h-full w-[14%] bg-money-pending" />
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <MoneyBadge state="cleared" /> <span className="font-mono">62%</span>
          <MoneyBadge state="pending" /> <span className="font-mono">14%</span>
        </div>
      </Glass>
    ),
  },
  {
    photo: photos.tailor,
    tags: ["Manufacturing", "Contract financing", "Application"],
    caption: "A tailor wins a uniform contract and funds the fabric to deliver it.",
    align: "left",
    widget: (
      <Glass>
        <p className={`${mono} text-aubergine-500`}>Application · SRW-APP-00433</p>
        <p className="mt-1 font-bold text-aubergine-800">Credit assessment</p>
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-sm ${i < 7 ? "bg-aubergine-800" : i === 7 ? "bg-saffron-500" : "bg-ink-100"}`} />
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-600">Stage 8 of 12 · documents verified</p>
      </Glass>
    ),
  },
  {
    photo: photos.investorLaptop,
    tags: ["Investor", "Portfolio", "Monthly income"],
    caption: "An investor follows every repayment, labelled exactly as it stands.",
    align: "right",
    widget: (
      <Glass>
        <div className="flex items-center justify-between">
          <p className={`${mono} text-aubergine-500`}>Returns received</p>
          <MoneyBadge state="received" />
        </div>
        <p className="mt-1 font-mono text-2xl font-medium text-aubergine-800">GH₵ 1,284.50</p>
        <svg viewBox="0 0 200 40" className="mt-2 h-10 w-full" aria-hidden="true">
          <path d="M0 34 L28 30 L56 31 L84 22 L112 24 L140 14 L168 12 L200 4" fill="none" stroke="#F2A900" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 34 L28 30 L56 31 L84 22 L112 24 L140 14 L168 12 L200 4 V40 H0 Z" fill="#F2A900" fillOpacity="0.12" />
        </svg>
        <p className="text-xs text-ink-600">Next repayment 30 Nov · GH₵ 2,706.25 expected</p>
      </Glass>
    ),
  },
];

/** Full-width cinematic stage: opens from a pill, then cycles real scenes with live product UI. */
export function HeroStage() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % scenes.length), SCENE_MS + (active === 0 ? 1500 : 0));
    return () => clearTimeout(t);
  }, [active, paused]);

  return (
    <div
      className="stage-open relative h-[72svh] min-h-[520px] max-h-[820px] overflow-hidden rounded-[2rem] bg-aubergine-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {scenes.map((s, i) => {
        const on = i === active;
        return (
          <div
            key={s.photo.src}
            aria-hidden={!on}
            className={`absolute inset-0 transition-[opacity,transform] duration-[1200ms] ease-[var(--ease-out)] ${on ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]"}`}
          >
            <Image src={s.photo.src} alt={s.photo.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-aubergine-950/80 via-aubergine-950/10 to-aubergine-950/30" />
            <div className="absolute top-5 left-5 flex flex-wrap gap-2 sm:top-7 sm:left-7">
              {s.tags.map((t, ti) => (
                <span
                  key={t}
                  style={{ transitionDelay: on ? `${300 + ti * 60}ms` : "0ms" }}
                  className={`rounded-full bg-white/90 px-3 py-1 font-mono text-[11px] tracking-[0.08em] text-aubergine-800 uppercase backdrop-blur transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${on ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"}`}
                >
                  {t}
                </span>
              ))}
            </div>
            <div
              style={{ transitionDelay: on ? "450ms" : "0ms" }}
              className={`absolute bottom-16 sm:bottom-24 ${s.align === "right" ? "right-5 sm:right-10" : "left-5 sm:left-10"} transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
            >
              {s.widget}
            </div>
            <p
              style={{ transitionDelay: on ? "550ms" : "0ms" }}
              className={`absolute bottom-8 left-7 hidden max-w-md text-base leading-6 text-white/90 transition-opacity duration-500 sm:block ${on ? "opacity-100" : "opacity-0"}`}
            >
              {s.caption}
            </p>
          </div>
        );
      })}

      <Weave tone="dark" fade="l" className="inset-y-0 right-0 w-24 opacity-40 mix-blend-screen" />

      <div className="absolute right-5 bottom-7 flex gap-2 sm:right-7 sm:bottom-9" role="tablist" aria-label="Scenes">
        {scenes.map((s, i) => (
          <button
            key={s.photo.src}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Show scene ${i + 1}: ${s.tags[0]}`}
            onClick={() => setActive(i)}
            className="group relative h-11 w-10 cursor-pointer"
          >
            <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/30">
              {i === active && (
                <span
                  key={`${active}-${paused}`}
                  className="block h-full origin-left bg-saffron-400"
                  style={{
                    animation: `fill-x ${SCENE_MS + (active === 0 ? 1500 : 0)}ms linear forwards`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
