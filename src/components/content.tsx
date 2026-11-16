import type { ReactNode } from "react";
import { Label } from "./ui";

/** Opening block for an information page: eyebrow, large title, one-paragraph intro. */
export function ContentHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-8 lg:pt-28">
        <Label className="rise-in">{eyebrow}</Label>
        <h1 className="rise-in mt-4 max-w-4xl text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-aubergine-800 text-balance">
          {title}
        </h1>
        <p className="rise-in mt-6 max-w-2xl text-lg leading-8 text-ink-600" style={{ animationDelay: "120ms" }}>
          {intro}
        </p>
        {children}
      </div>
    </section>
  );
}

/** A titled section on an information page, with an optional short lead. */
export function ContentSection({
  id,
  eyebrow,
  title,
  lead,
  tone = "white",
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  tone?: "white" | "tint" | "dark";
  children: ReactNode;
}) {
  const bg = tone === "dark" ? "bg-aubergine-800 text-white" : tone === "tint" ? "bg-ink-50" : "bg-white";
  return (
    <section id={id} className={`scroll-mt-24 ${bg}`}>
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-8 lg:py-28">
        <div data-reveal className="max-w-3xl">
          {eyebrow && <Label className={tone === "dark" ? "text-saffron-300" : ""}>{eyebrow}</Label>}
          <h2 className={`mt-3 text-3xl leading-[1.08] font-extrabold tracking-[-0.03em] text-balance sm:text-4xl ${tone === "dark" ? "text-white" : "text-aubergine-800"}`}>
            {title}
          </h2>
          {lead && <p className={`mt-4 text-lg leading-8 ${tone === "dark" ? "text-aubergine-100" : "text-ink-600"}`}>{lead}</p>}
        </div>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}

/** A simple two-column definition card: name on top, explanation below, optional meta line. */
export function InfoCard({ title, body, meta, tone = "white" }: { title: string; body: string; meta?: string; tone?: "white" | "dark" }) {
  return (
    <div className={`flex h-full flex-col rounded-2xl p-7 ${tone === "dark" ? "bg-aubergine-700/60 ring-1 ring-white/10" : "bg-white ring-1 ring-ink-200"}`}>
      <h3 className={`text-lg font-bold ${tone === "dark" ? "text-white" : "text-aubergine-800"}`}>{title}</h3>
      <p className={`mt-2 flex-1 text-sm leading-6 ${tone === "dark" ? "text-aubergine-100" : "text-ink-600"}`}>{body}</p>
      {meta && <p className={`mt-4 font-mono text-[11px] tracking-[0.08em] uppercase ${tone === "dark" ? "text-saffron-300" : "text-aubergine-500"}`}>{meta}</p>}
    </div>
  );
}
