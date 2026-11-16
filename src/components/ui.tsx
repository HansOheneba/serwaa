import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { MoneyState } from "@/lib/data";

/*
 * Buttons follow Material 3 (md-comp-*-button tokens): 40px container, full
 * corner, 24px side padding (16px on an icon side), label-large type (14/20,
 * medium, 0.1px tracking), 18px icons, state layers 8% hover / 12% press.
 *   filled    – primary action (aubergine)
 *   tonal     – secondary emphasis (aubergine container)
 *   outlined  – medium emphasis
 *   text      – lowest emphasis
 *   accent    – brand filled (saffron), for use on aubergine surfaces
 * Legacy names map onto these: primary→filled, secondary→outlined, ghost→text.
 */
type ButtonVariant = "filled" | "tonal" | "outlined" | "text" | "accent" | "primary" | "secondary" | "ghost";

const buttonStyles: Record<ButtonVariant, string> = {
  filled: "bg-aubergine-800 text-white hover:elev-1",
  primary: "bg-aubergine-800 text-white hover:elev-1",
  tonal: "bg-aubergine-100 text-aubergine-900 hover:elev-1",
  outlined: "bg-transparent text-aubergine-700 ring-1 ring-inset ring-ink-400",
  secondary: "bg-transparent text-aubergine-700 ring-1 ring-inset ring-ink-400",
  text: "bg-transparent px-3 text-aubergine-700",
  ghost: "bg-transparent px-3 text-aubergine-700",
  accent: "bg-saffron-500 text-aubergine-950 hover:elev-1",
};

const buttonBase =
  "state-layer inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm leading-5 font-semibold tracking-[0.1px] whitespace-nowrap transition-shadow select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aubergine-500 [&>svg]:size-[18px] has-[>svg:first-child]:pl-4 has-[>svg:last-child]:pr-4 disabled:cursor-not-allowed disabled:bg-ink-900/12 disabled:text-ink-900/38 disabled:shadow-none disabled:ring-0";

export function ButtonLink({
  variant = "filled",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={`${buttonBase} ${buttonStyles[variant]} ${className}`} {...props} />;
}

export function Button({
  variant = "filled",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button className={`${buttonBase} ${buttonStyles[variant]} ${className}`} {...props} />;
}

/** Material 3 extended FAB (Gmail's Compose): 56px, 16px corners, level-3 elevation. */
export function Fab({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`state-layer elev-3 hover:elev-4 inline-flex h-14 items-center gap-3 rounded-2xl bg-aubergine-100 pr-5 pl-4 text-sm font-semibold tracking-[0.1px] text-aubergine-900 transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aubergine-500 [&>svg]:size-6 ${className}`}
      {...props}
    />
  );
}

/** Material 3 filter chip: 32px, 8px corners, 1px outline; selected fills and shows a check. */
export function FilterChip({
  selected,
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { selected: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`state-layer inline-flex h-8 shrink-0 items-center gap-2 rounded-lg text-sm font-semibold tracking-[0.1px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aubergine-500 ${
        selected ? "bg-aubergine-100 pr-4 pl-2 text-aubergine-900" : "px-4 text-ink-700 ring-1 ring-inset ring-ink-400"
      } ${className}`}
      {...props}
    >
      {selected && (
        <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
          <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" fill="currentColor" />
        </svg>
      )}
      {children}
    </button>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  // Default surface is white; a caller-supplied background replaces it rather than fighting it.
  const surface = /(^|\s)bg-/.test(className) ? "" : "bg-white";
  return <div className={`rounded-2xl p-5 ring-1 ring-ink-200 ${surface} ${className}`}>{children}</div>;
}

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-semibold tracking-[0.08em] text-aubergine-500 uppercase ${className}`}>{children}</p>
  );
}

const moneyDot: Record<MoneyState, string> = {
  expected: "bg-money-expected",
  pending: "bg-money-pending",
  confirmed: "bg-money-confirmed",
  cleared: "bg-money-cleared",
  received: "bg-money-received",
  overdue: "bg-money-overdue",
};

const moneyLabel: Record<MoneyState, string> = {
  expected: "Expected",
  pending: "Pending",
  confirmed: "Confirmed",
  cleared: "Cleared",
  received: "Received",
  overdue: "Overdue",
};

/** The one way to label an amount's state. Spec: states are never blended. */
export function MoneyBadge({ state }: { state: MoneyState }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-ink-700 ring-1 ring-ink-200">
      <span className={`size-2 rounded-full ${moneyDot[state]}`} aria-hidden="true" />
      {moneyLabel[state]}
    </span>
  );
}

export function Stat({
  label,
  value,
  state,
  hint,
}: {
  label: string;
  value: string;
  state?: MoneyState;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-ink-200">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink-600">{label}</p>
        {state && <MoneyBadge state={state} />}
      </div>
      <p className="mt-2 font-mono text-2xl font-medium tabular-nums text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

/** Funding bar: only cleared money counts toward progress; pending is shown apart. */
export function FundingBar({ target, cleared, pending }: { target: number; cleared: number; pending: number }) {
  const c = Math.min(100, (cleared / target) * 100);
  const p = Math.min(100 - c, (pending / target) * 100);
  return (
    <div
      className="flex h-2.5 overflow-hidden rounded-full bg-ink-100"
      role="img"
      aria-label={`${Math.round(c)}% cleared, ${Math.round(p)}% pending`}
    >
      <span className="h-full bg-money-cleared" style={{ width: `${c}%` }} />
      <span className="h-full bg-money-pending" style={{ width: `${p}%` }} />
    </div>
  );
}

export function StatusPill({ tone = "neutral", children }: { tone?: "neutral" | "good" | "warn" | "bad" | "brand"; children: ReactNode }) {
  const tones = {
    neutral: "bg-ink-100 text-ink-700",
    good: "bg-success-50 text-success-600",
    warn: "bg-saffron-50 text-saffron-800",
    bad: "bg-danger-50 text-danger-600",
    brand: "bg-aubergine-50 text-aubergine-700",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <Label>{eyebrow}</Label>}
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-aubergine-800 text-balance">{title}</h1>
      </div>
      {children}
    </div>
  );
}
