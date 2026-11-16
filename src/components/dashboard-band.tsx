import type { ReactNode } from "react";
import type { MoneyState } from "@/lib/data";
import { MoneyBadge } from "./ui";
import { Weave } from "./weave";

export type BandStat = { label: string; value: string; state?: MoneyState; hint?: string };

/** Smooth-ish area chart path from a series, scaled into a w×h box. */
function areaPath(points: number[], w: number, h: number) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const xy = points.map((p, i) => [(i / (points.length - 1)) * w, h - ((p - min) / (max - min || 1)) * (h - 8) - 4]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return { line, area: `${line} L${w} ${h} L0 ${h} Z`, last: xy[xy.length - 1] };
}

/**
 * The cinematic top of every dashboard: a greeting, one headline figure,
 * a trend line across the full width, and a row of supporting stats.
 */
export function DashboardBand({
  eyebrow,
  greeting,
  figureLabel,
  figure,
  figureState,
  series,
  stats,
  action,
}: {
  eyebrow: string;
  greeting: string;
  figureLabel: string;
  figure: string;
  figureState?: MoneyState;
  series?: number[];
  stats: BandStat[];
  action?: ReactNode;
}) {
  const chart = series ? areaPath(series, 1000, 120) : null;
  return (
    <section className="rise-in relative overflow-hidden rounded-[1.75rem] bg-aubergine-800 text-white">
      <Weave tone="dark" fade="l" className="inset-y-0 right-0 w-1/2 opacity-80" />
      <div className="relative px-7 pt-8 sm:px-10 sm:pt-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.1em] text-saffron-300 uppercase">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{greeting}</h1>
          </div>
          {action}
        </div>
        <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-2">
          <p className="font-mono text-[clamp(2.5rem,6vw,4.25rem)] leading-none font-medium tracking-tight tabular-nums">{figure}</p>
          <div className="pb-2">
            <p className="font-mono text-[11px] tracking-[0.1em] text-aubergine-200 uppercase">{figureLabel}</p>
            {figureState && (
              <div className="mt-1">
                <MoneyBadge state={figureState} />
              </div>
            )}
          </div>
        </div>
      </div>
      {chart && (
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="relative mt-4 block h-24 w-full sm:h-28" aria-hidden="true">
          <defs>
            <linearGradient id="band-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#F2A900" stopOpacity="0.35" />
              <stop offset="1" stopColor="#F2A900" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={chart.area} fill="url(#band-fill)" />
          <path d={chart.line} fill="none" stroke="#F2A900" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <dl className="stagger relative grid grid-cols-2 gap-px border-t border-aubergine-700 bg-aubergine-700 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-aubergine-800 px-7 py-6 sm:px-10">
            <dt className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-aubergine-200 uppercase">
              {s.label}
            </dt>
            <dd className="mt-2 font-mono text-xl font-medium tabular-nums">{s.value}</dd>
            {(s.state || s.hint) && (
              <dd className="mt-1.5 flex items-center gap-2 text-xs text-aubergine-200">
                {s.state && <MoneyBadge state={s.state} />}
                {s.hint}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
