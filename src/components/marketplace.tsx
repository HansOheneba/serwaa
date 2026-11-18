"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ButtonLink, FilterChip, FundingBar, Label, MoneyBadge, StatusPill } from "./ui";
import { cedis, percent } from "@/lib/format";
import { isOpen, useWorkspace, type Campaign } from "@/lib/store";

/** What the public may see: the name only if the business chose to show it. */
export const publicName = (c: Campaign) => (c.disclosure === "public" ? c.business : `${c.sector} business`);

function DealCard({ c }: { c: Campaign }) {
  const raised = percent(c.cleared, c.target);
  return (
    <Link
      href={`/marketplace/${c.id}`}
      className="group flex h-full flex-col rounded-2xl bg-white p-7 ring-1 ring-ink-200 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-aubergine-500"
    >
      <div className="flex items-start justify-between gap-3">
        <Label>{c.product}</Label>
        {c.disclosure === "investors" && (
          <span className="inline-flex items-center gap-1 text-xs text-ink-500">
            <Lock className="size-3.5" aria-hidden="true" />
            Name shown to investors
          </span>
        )}
      </div>
      <h3 className="mt-3 text-xl font-bold text-aubergine-800">{publicName(c)}</h3>
      <p className="mt-2 flex-1 leading-7 text-ink-600">{c.purpose}</p>
      <div className="mt-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-2xl font-medium text-ink-900">{cedis(c.cleared)}</p>
          <p className="font-mono text-sm text-ink-500">of {cedis(c.target)}</p>
        </div>
        <div className="mt-3">
          <FundingBar target={c.target} cleared={c.cleared} pending={c.pending} />
        </div>
        <p className="mt-2 text-sm text-ink-600">
          {raised}% raised · {c.closesInDays} days left
        </p>
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-ink-100 pt-5">
        <div>
          <dt className="text-xs text-ink-500">Expected return</dt>
          <dd className="mt-1 font-mono text-sm font-medium">{c.expectedReturn}% a year</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-500">Length</dt>
          <dd className="mt-1 font-mono text-sm font-medium">{c.tenorMonths} months</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-500">From</dt>
          <dd className="mt-1 font-mono text-sm font-medium">{cedis(c.minTicket)}</dd>
        </div>
      </dl>
    </Link>
  );
}

export function MarketplaceList() {
  const ws = useWorkspace();
  const live = ws.campaigns.filter(isOpen);
  const sectors = Array.from(new Set(live.map((c) => c.sector)));
  const [sector, setSector] = useState<string | null>(null);
  const shown = live.filter((c) => !sector || c.sector === sector);
  const raised = live.reduce((t, c) => t + c.cleared, 0);

  return (
    <>
      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        {[
          ["Deals open now", String(live.length)],
          ["Raised so far", cedis(raised)],
          ["Start investing from", cedis(Math.min(...live.map((c) => c.minTicket), 100))],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-ink-50 p-6">
            <p className="text-sm text-ink-600">{k}</p>
            <p className="mt-2 font-mono text-2xl font-medium text-aubergine-800">{v}</p>
          </div>
        ))}
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip selected={sector === null} onClick={() => setSector(null)}>
          All sectors
        </FilterChip>
        {sectors.map((s) => (
          <FilterChip key={s} selected={sector === s} onClick={() => setSector(sector === s ? null : s)}>
            {s}
          </FilterChip>
        ))}
      </div>
      <div className="stagger grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((c) => (
          <DealCard key={c.id} c={c} />
        ))}
      </div>
    </>
  );
}

export function MarketplaceDetail({ id }: { id: string }) {
  const ws = useWorkspace();
  const c = ws.campaigns.find((x) => x.id === id && isOpen(x));
  if (!c) return <p className="text-ink-600">This deal isn&apos;t open right now.</p>;
  const terms: [string, string][] = [
    ["Financing", c.product],
    ["Length", `${c.tenorMonths} months`],
    ["Expected return", `${c.expectedReturn}% a year`],
    ["How investors are repaid", c.frequency],
    ["Security", c.security],
    ["Minimum investment", cedis(c.minTicket)],
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-8">
        <div>
          <Link href="/marketplace" className="text-sm font-semibold text-aubergine-500 hover:underline">
            ← All deals
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Label>{c.sector}</Label>
            <StatusPill tone={c.risk === "Lower" ? "good" : c.risk === "Moderate" ? "warn" : "bad"}>{c.risk} risk</StatusPill>
          </div>
          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] text-aubergine-800 sm:text-5xl">{publicName(c)}</h1>
          {c.disclosure === "investors" && (
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-600">
              <Lock className="size-4" aria-hidden="true" />
              This business has chosen to share its name with signed-in investors only.
            </p>
          )}
        </div>
        <section className="rounded-2xl bg-white p-7 ring-1 ring-ink-200">
          <Label>What the money is for</Label>
          <p className="mt-3 text-lg leading-8 text-ink-800">{c.purpose}</p>
        </section>
        <section className="rounded-2xl bg-white p-7 ring-1 ring-ink-200">
          <Label>The terms</Label>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            {terms.map(([k, v]) => (
              <div key={k} className="border-t border-ink-100 pt-3">
                <dt className="text-xs text-ink-500">{k}</dt>
                <dd className="mt-1 font-semibold text-ink-800">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
        <p className="text-sm leading-6 text-ink-500">
          Expected returns are not guaranteed. The business may repay late or not in full, and you could lose some or all of your money.{" "}
          <Link href="/protection#risks" className="font-semibold text-aubergine-500 underline">
            Read the risks
          </Link>
          .
        </p>
      </div>

      <aside className="h-fit space-y-6 lg:sticky lg:top-28">
        <div className="rounded-2xl bg-aubergine-800 p-7 text-white">
          <p className="font-mono text-[11px] tracking-[0.1em] text-saffron-300 uppercase">Raised so far</p>
          <p className="mt-3 font-mono text-4xl font-medium">{cedis(c.cleared)}</p>
          <p className="mt-1 text-sm text-aubergine-200">of {cedis(c.target)} target</p>
          <div className="mt-5">
            <FundingBar target={c.target} cleared={c.cleared} pending={c.pending} />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <MoneyBadge state="cleared" />
            <MoneyBadge state="pending" />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-sm">
            <div>
              <dt className="text-aubergine-200">Investors</dt>
              <dd className="mt-1 font-mono">{c.investors}</dd>
            </div>
            <div>
              <dt className="text-aubergine-200">Closes in</dt>
              <dd className="mt-1 font-mono">{c.closesInDays} days</dd>
            </div>
          </dl>
          <ButtonLink href={`/invest/opportunities/${c.id}`} variant="accent" className="mt-7 w-full">
            Invest in this deal
          </ButtonLink>
          <p className="mt-3 text-center text-xs text-aubergine-200">
            New to Serwaa?{" "}
            <Link href="/onboarding?as=investor" className="font-semibold text-saffron-300 underline">
              Create an account
            </Link>
          </p>
        </div>
      </aside>
    </div>
  );
}
