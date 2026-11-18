"use client";

import { Bookmark, BookmarkCheck, Columns3, Download, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DashboardBand, hello } from "./dashboard-band";
import { ActionResult } from "./notifications";
import { InvestPanel } from "./invest-panel";
import { OpportunityCard } from "./opportunity-card";
import { Button, ButtonLink, Card, FilterChip, FundingBar, Label, MoneyBadge, StatusPill } from "./ui";
import { portfolio as samplePortfolio, type Opportunity } from "@/lib/data";

/** Only real money counts: holdings come from the investor's own investments. */
const seedPortfolio = { ...samplePortfolio, invested: 0, outstandingPrincipal: 0, expectedFutureReturns: 0, holdings: [] as typeof samplePortfolio.holdings };
import { cedis, percent } from "@/lib/format";
import {
  isOpen,
  matchFor,
  setAlerts,
  setPayout,
  toggleWatch,
  updatePrefs,
  useWorkspace,
  reinvestCash,
  withdrawCash,
  type Campaign,
  type Prefs,
  type Result,
} from "@/lib/store";

const asOpportunity = (c: Campaign, p: Prefs): Opportunity => {
  const m = matchFor(c, p);
  return { ...c, match: m.score, matched: m.matched, unmatched: m.unmatched };
};
const field = "mt-1.5 w-full rounded-xl bg-white px-3.5 py-3 text-sm ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none";

function downloadCsv(name: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  Object.assign(document.createElement("a"), { href: url, download: name }).click();
  URL.revokeObjectURL(url);
}

/* ── Discover: filters, watchlist, compare ───────────────── */

const filters: { id: string; label: string; test: (o: Opportunity, watch: string[]) => boolean }[] = [
  { id: "watch", label: "Saved", test: (o, w) => w.includes(o.id) },
  { id: "short", label: "Up to 6 months", test: (o) => o.tenorMonths <= 6 },
  { id: "secured", label: "Secured", test: (o) => !/unsecured/i.test(o.security) },
  { id: "monthly", label: "Pays monthly", test: (o) => /monthly/i.test(o.frequency) },
];

export function DiscoverView() {
  const ws = useWorkspace();
  const q = (useSearchParams().get("q") ?? "").toLowerCase();
  const [active, setActive] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const all = ws.campaigns.filter(isOpen).map((c) => asOpportunity(c, ws.prefs));
  const shown = all
    .filter((o) => !q || [o.business, o.sector, o.product, o.purpose].some((t) => t.toLowerCase().includes(q)))
    .filter((o) => active.every((id) => filters.find((f) => f.id === id)!.test(o, ws.watchlist)))
    .sort((a, b) => b.match - a.match);
  const comparing = all.filter((o) => compare.includes(o.id));

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <FilterChip key={f.id} selected={active.includes(f.id)} onClick={() => setActive((a) => (a.includes(f.id) ? a.filter((x) => x !== f.id) : [...a, f.id]))}>
            {f.label}
          </FilterChip>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" checked={ws.alertsOn} onChange={(e) => setAlerts(e.target.checked)} className="size-4 accent-aubergine-800" />
          Tell me when a new match opens
        </label>
      </div>

      {shown.length ? (
        <div className="stagger grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((o) => {
            const saved = ws.watchlist.includes(o.id);
            const picked = compare.includes(o.id);
            return (
              <div key={o.id} className="flex flex-col gap-3">
                <OpportunityCard o={o} href={`/invest/opportunities/${o.id}`} showMatch />
                <div className="flex gap-2">
                  <Button variant="text" onClick={() => toggleWatch(o.id)} aria-pressed={saved}>
                    {saved ? <BookmarkCheck aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
                    {saved ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="text"
                    aria-pressed={picked}
                    onClick={() => setCompare((c) => (c.includes(o.id) ? c.filter((x) => x !== o.id) : c.length < 3 ? [...c, o.id] : c))}
                    disabled={!picked && compare.length >= 3}
                  >
                    <Columns3 aria-hidden="true" />
                    {picked ? "Comparing" : "Compare"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-2xl bg-ink-50 p-12 text-center text-ink-600">No opportunities match these filters. Remove one to see more.</p>
      )}

      {comparing.length >= 2 && (
        <section className="rise-in mt-12 overflow-x-auto rounded-2xl ring-1 ring-ink-200" aria-label="Comparison">
          <div className="flex items-center justify-between px-6 pt-5">
            <Label>Side by side</Label>
            <Button variant="text" onClick={() => setCompare([])}>
              <X aria-hidden="true" />
              Clear
            </Button>
          </div>
          <table className="mt-2 w-full min-w-[640px] text-sm">
            <tbody className="divide-y divide-ink-100">
              {(
                [
                  ["Business", (o: Opportunity) => o.business],
                  ["Your match", (o: Opportunity) => `${o.match}%`],
                  ["Expected return", (o: Opportunity) => `${o.expectedReturn}% a year`],
                  ["Length", (o: Opportunity) => `${o.tenorMonths} months`],
                  ["Repayment", (o: Opportunity) => o.frequency],
                  ["Security", (o: Opportunity) => o.security],
                  ["Risk", (o: Opportunity) => o.risk],
                  ["Funded so far", (o: Opportunity) => `${percent(o.cleared, o.target)}%`],
                ] as const
              ).map(([label, get]) => (
                <tr key={label}>
                  <th className="w-40 px-6 py-3.5 text-left text-xs font-semibold tracking-[0.08em] text-ink-500 uppercase">{label}</th>
                  {comparing.map((o) => (
                    <td key={o.id} className="px-6 py-3.5 font-medium text-ink-900">
                      {get(o)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}

/* ── Opportunity: save, reserve a place ──────────────────── */

export function OpportunityDetail({ id }: { id: string }) {
  const ws = useWorkspace();
  const c = ws.campaigns.find((x) => x.id === id);
  if (!c) return <p className="text-ink-600">This opportunity isn&apos;t available.</p>;
  const o = asOpportunity(c, ws.prefs);
  const saved = ws.watchlist.includes(id);
  const invested = seedPortfolio.invested + ws.investments.filter((i) => i.investor === "individual").reduce((t, i) => t + i.amount, 0);
  const already = ws.investments.filter((i) => i.campaignId === id && i.investor === "individual").reduce((t, i) => t + i.amount, 0);
  const share = already ? Math.round((already / invested) * 100) : 0;
  const tooMuch = share > ws.prefs.maxPerBusiness;
  const terms: [string, string][] = [
    ["Structure", o.product],
    ["Length", `${o.tenorMonths} months`],
    ["Expected return", `${o.expectedReturn}% a year`],
    ["Repayment", o.frequency],
    ["Security", o.security],
    ["Minimum", cedis(o.minTicket)],
  ];

  return (
    <>
      <Link href="/invest/discover" className="text-sm font-semibold text-aubergine-500 hover:underline">
        ← All opportunities
      </Link>
      <div className="mt-6 mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>
            {o.sector} · {o.product}
          </Label>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-aubergine-800 sm:text-4xl">{o.business}</h1>
          <p className="mt-1 font-mono text-xs text-ink-500">{o.ref}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill tone={o.risk === "Lower" ? "good" : o.risk === "Moderate" ? "warn" : "bad"}>{o.risk} risk</StatusPill>
          <Button variant="outlined" onClick={() => toggleWatch(id)} aria-pressed={saved}>
            {saved ? <BookmarkCheck aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          <Card className="p-7">
            <Label>Funding</Label>
            <div className="mt-4">
              <FundingBar target={o.target} cleared={o.cleared} pending={o.pending} />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-5 xl:grid-cols-4">
              <div>
                <dt><MoneyBadge state="cleared" /></dt>
                <dd className="mt-2 font-mono">{cedis(o.cleared)}</dd>
                <dd className="text-xs text-ink-500">{percent(o.cleared, o.target)}% of target</dd>
              </div>
              <div>
                <dt><MoneyBadge state="pending" /></dt>
                <dd className="mt-2 font-mono">{cedis(o.pending)}</dd>
                <dd className="text-xs text-ink-500">Not counted yet</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Target</dt>
                <dd className="mt-2 font-mono">{cedis(o.target)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Closes in</dt>
                <dd className="mt-2 font-mono">{o.closesInDays} days</dd>
              </div>
            </dl>
          </Card>
          <Card className="p-7">
            <Label>About this deal</Label>
            <p className="mt-3 leading-7 text-ink-700">{o.purpose}</p>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              {terms.map(([k, v]) => (
                <div key={k} className="border-t border-ink-100 pt-3">
                  <dt className="text-xs text-ink-500">{k}</dt>
                  <dd className="mt-1 font-semibold text-ink-800">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card className="bg-danger-50 p-7 ring-danger-50">
            <Label className="text-danger-600">Risks</Label>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-ink-800">
              <li>The business may repay late or not at all, and you could lose some or all of your money.</li>
              <li>Your money is tied up until the deal ends.</li>
              <li>The expected return is what the business agreed to pay, not a promise.</li>
            </ul>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-7">
            <div className="flex items-center justify-between">
              <Label>Why you&apos;re seeing this</Label>
              <span className="font-mono text-sm text-aubergine-700">{o.match}% match</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {o.matched.map((m) => (
                <li key={m} className="flex gap-2 text-ink-800">
                  <span className="text-success-600" aria-hidden="true">✓</span>
                  {m}
                </li>
              ))}
              {o.unmatched.map((m) => (
                <li key={m} className="flex gap-2 text-ink-600">
                  <span className="text-saffron-700" aria-hidden="true">–</span>
                  {m}
                </li>
              ))}
            </ul>
            <ButtonLink href="/invest/profile" variant="text" className="mt-4 -ml-3">
              Change my preferences
            </ButtonLink>
          </Card>

          <Card className="bg-aubergine-800 p-7 text-white ring-aubergine-800">
            <p className="mb-5 text-xs font-semibold tracking-[0.08em] text-saffron-300 uppercase">Invest</p>
            {tooMuch && (
              <p className="mb-4 rounded-lg bg-aubergine-700 p-3 text-xs leading-5 text-saffron-200">
                This would put {share}% of your money in one business, above your {ws.prefs.maxPerBusiness}% limit. You can still go ahead.
              </p>
            )}
            <InvestPanel c={c} afterHref="/invest?invested=1" />
          </Card>
        </div>
      </div>
    </>
  );
}

/* ── Portfolio: investments, cash, withdraw, reinvest, rebalance ── */

const invTone = { Cleared: "good", Confirmed: "brand", Pending: "warn", "Awaiting authorisation": "warn" } as const;

export function PortfolioView() {
  const ws = useWorkspace();
  const p = { ...seedPortfolio, asOf: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) };
  const justInvested = useSearchParams().get("invested");
  const mine = ws.investments.filter((i) => i.investor === "individual");
  const newInvested = mine.reduce((t, i) => t + i.amount, 0);
  const [payout, setP] = useState(ws.payout);
  const [result, setResult] = useState<Result | null>(null);
  const [wAmount, setWAmount] = useState("");
  const [cashResult, setCashResult] = useState<Result | null>(null);
  const [riCampaign, setRiCampaign] = useState("");
  const [riAmount, setRiAmount] = useState("");
  const live = ws.campaigns.filter(isOpen);
  // What the investor's money should earn over each deal's term, at the deal's expected rate.
  const expectedReturns = Math.round(
    mine.reduce((t, i) => {
      const c = ws.campaigns.find((x) => x.id === i.campaignId);
      return t + (c ? (i.amount * c.expectedReturn * c.tenorMonths) / 1200 : 0);
    }, 0),
  );
  const upcoming = p.holdings.filter((h) => h.nextAmount > 0);

  // Allocation by sector across old holdings and new investments, against the investor's own limit.
  const sectorOf: Record<string, string> = { "Asaase Textiles Ltd": "Manufacturing", "Ofie Logistics Ltd": "Logistics", "Abrewa Trading Ltd": "Trade and distribution" };
  const alloc: Record<string, number> = {};
  p.holdings.forEach((h) => (alloc[sectorOf[h.business] ?? "Other"] = (alloc[sectorOf[h.business] ?? "Other"] ?? 0) + h.outstanding));
  mine.forEach((i) => {
    const c = ws.campaigns.find((x) => x.id === i.campaignId);
    const k = c?.sector ?? "Other";
    alloc[k] = (alloc[k] ?? 0) + i.amount;
  });
  const total = Object.values(alloc).reduce((t, v) => t + v, 0) || 1;
  const rows = Object.entries(alloc).sort((a, b) => b[1] - a[1]);
  const over = rows.filter(([, v]) => (v / total) * 100 > ws.prefs.maxPerBusiness);
  const under = ws.prefs.sectors.filter((sct) => !alloc[sct]);

  return (
    <div className="space-y-10">
      {justInvested && (
        <p role="status" className="rise-in rounded-2xl bg-success-50 px-6 py-4 font-semibold text-success-600">
          Your investment is in. It shows below and will count as cleared once the custodian confirms your money has arrived.
        </p>
      )}
      <DashboardBand
        eyebrow={`Portfolio · as of ${p.asOf}`}
        greeting={hello(ws.me?.name)}
        figureLabel="Invested and outstanding"
        figure={cedis(p.outstandingPrincipal + newInvested)}
        figureState="cleared"
        series={[0, ...mine.slice().reverse().map((_, i, a) => a.slice(0, i + 1).reduce((t, x) => t + x.amount, 0))]}
        action={<ButtonLink href="/invest/discover" variant="accent">Find opportunities</ButtonLink>}
        stats={[
          { label: "Available to use", value: cedis(ws.cash.available, true), hint: "Held by the custodian" },
          { label: "Paid out to you", value: cedis(ws.cash.paidOut, true), state: "received" },
          { label: "Reinvested", value: cedis(ws.cash.reinvested, true) },
          { label: "Expected returns", value: cedis(expectedReturns), state: "expected", hint: "Not guaranteed" },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-x-auto p-0">
          <div className="flex items-center justify-between gap-3 px-7 pt-6">
            <Label>Your investments</Label>
            <Button
              variant="text"
              onClick={() =>
                downloadCsv("serwaa-statement.csv", [
                  ["Investment", "Amount", "Received", "Status", "Date"],
                  ...p.holdings.map((h) => [h.business, h.amount, h.received, h.status, ""]),
                  ...mine.map((i) => [ws.campaigns.find((c) => c.id === i.campaignId)?.business ?? i.campaignId, i.amount, 0, i.status, i.at.slice(0, 10)]),
                  ...ws.cash.history.map((h) => [h.kind + ": " + h.note, h.amount, "", "", h.at.slice(0, 10)]),
                ])
              }
            >
              <Download aria-hidden="true" />
              Statement
            </Button>
          </div>
          <table className="mt-3 w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs tracking-[0.08em] text-ink-500 uppercase">
                <th className="px-7 py-3 font-semibold">Investment</th>
                <th className="px-4 py-3 text-right font-semibold">Invested</th>
                <th className="px-4 py-3 text-right font-semibold">Received</th>
                <th className="px-7 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="stagger divide-y divide-ink-100">
              {mine.map((i) => {
                const c = ws.campaigns.find((x) => x.id === i.campaignId);
                return (
                  <tr key={i.id}>
                    <td className="px-7 py-4">
                      <Link href={`/invest/opportunities/${i.campaignId}`} className="font-semibold text-ink-900 hover:underline">
                        {c?.business ?? i.campaignId}
                      </Link>
                      <p className="text-xs text-ink-500">
                        {i.method} · {i.payRef}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right font-mono tabular-nums">{cedis(i.amount)}</td>
                    <td className="px-4 py-4 text-right font-mono tabular-nums text-ink-400">–</td>
                    <td className="px-7 py-4">
                      <StatusPill tone={invTone[i.status]}>{i.status === "Awaiting authorisation" ? "Approve on phone" : i.status}</StatusPill>
                    </td>
                  </tr>
                );
              })}
              {p.holdings.map((h) => (
                <tr key={h.business}>
                  <td className="px-7 py-4">
                    <p className="font-semibold text-ink-900">{h.business}</p>
                    <p className="text-xs text-ink-500">{h.product}</p>
                  </td>
                  <td className="px-4 py-4 text-right font-mono tabular-nums">{cedis(h.amount)}</td>
                  <td className="px-4 py-4 text-right font-mono tabular-nums">{cedis(h.received, true)}</td>
                  <td className="px-7 py-4">
                    <StatusPill tone={h.status === "Repaying" ? "good" : "brand"}>{h.status}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-7">
          <Label>Coming up</Label>
          <ul className="mt-5 space-y-5">
            {upcoming.map((h) => (
              <li key={h.business} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{h.business}</p>
                  <p className="text-xs text-ink-500">{h.nextPayment}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">{cedis(h.nextAmount, true)}</p>
                  <MoneyBadge state="expected" />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-7">
          <Label>Your available money</Label>
          <p className="mt-3 font-mono text-3xl font-medium text-aubergine-800">{cedis(ws.cash.available, true)}</p>
          <p className="mt-1 text-sm text-ink-600">From repayments, held by the custodian until you withdraw or reinvest it.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="block text-sm font-semibold text-ink-800">
              Withdraw to {ws.payout.method}
              <input className={`${field} font-mono`} inputMode="numeric" value={wAmount} onChange={(e) => setWAmount(e.target.value)} placeholder={ws.cash.available.toFixed(2)} />
            </label>
            <Button onClick={() => (withdrawCash(Number(wAmount.replace(/[^\d.]/g, ""))).then(setCashResult), setWAmount(""))}>Withdraw</Button>
          </div>
          <div className="mt-5 grid gap-4 border-t border-ink-100 pt-5 sm:grid-cols-[1fr_8rem_auto] sm:items-end">
            <label className="block text-sm font-semibold text-ink-800">
              Or reinvest in
              <select className={field} value={riCampaign} onChange={(e) => setRiCampaign(e.target.value)}>
                <option value="">Choose a deal</option>
                {live.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.business}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-ink-800">
              Amount
              <input className={`${field} font-mono`} inputMode="numeric" value={riAmount} onChange={(e) => setRiAmount(e.target.value)} placeholder="1,000" />
            </label>
            <Button variant="tonal" onClick={() => (reinvestCash(riCampaign, Number(riAmount.replace(/[^\d.]/g, ""))).then(setCashResult), setRiAmount(""))}>
              Reinvest
            </Button>
          </div>
          <ActionResult result={cashResult} />
          <ul className="mt-6 divide-y divide-ink-100 border-t border-ink-100">
            {ws.cash.history.slice(0, 6).map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>
                  <span className="font-semibold text-ink-900">{h.kind}</span>
                  <span className="block text-xs text-ink-500">
                    {h.note} · {new Date(h.at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </span>
                <span className={`font-mono ${h.kind === "Repayment" ? "text-success-600" : "text-ink-700"}`}>
                  {h.kind === "Repayment" ? "+" : "−"}
                  {cedis(h.amount, true)}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-7">
          <Label>How your money is spread</Label>
          <ul className="mt-5 space-y-4">
            {rows.map(([sct, v]) => {
              const pct = Math.round((v / total) * 100);
              return (
                <li key={sct}>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-ink-800">{sct}</span>
                    <span className="font-mono text-ink-600">{pct}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100">
                    <div className={`h-full ${pct > ws.prefs.maxPerBusiness ? "bg-saffron-500" : "bg-aubergine-800"}`} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 rounded-xl bg-aubergine-50 p-5 text-sm leading-6 text-aubergine-900">
            <p className="font-semibold">Rebalancing</p>
            {over.length ? (
              <p className="mt-1">
                {over.map(([k]) => k).join(" and ")} {over.length > 1 ? "are" : "is"} above your {ws.prefs.maxPerBusiness}% limit.
                {under.length ? ` Point new money or repayments at ${under.slice(0, 2).join(" or ")} to even things out.` : " Let new money go to other sectors to even things out."}
              </p>
            ) : (
              <p className="mt-1">You&apos;re within your limits. Nothing to rebalance.</p>
            )}
            <ButtonLink href="/invest/discover" variant="text" className="mt-2 -ml-3">
              See matching deals
            </ButtonLink>
          </div>
        </Card>
      </div>

      <Card className="p-7">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Label>Where your repayments go</Label>
            <p className="mt-3 text-ink-600">Paid straight to your Mobile Money or bank account, or kept with the custodian to reinvest.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink-800">
              Pay me by
              <select className={field} value={payout.method} onChange={(e) => setP({ ...payout, method: e.target.value })}>
                {["MTN MoMo", "Telecel Cash", "AT Money", "Bank account"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-ink-800">
              {payout.method === "Bank account" ? "Account number" : "Mobile Money number"}
              <input className={`${field} font-mono`} value={payout.number} onChange={(e) => setP({ ...payout, number: e.target.value })} placeholder="024 123 4567" />
            </label>
            <label className="flex items-center gap-3 text-sm text-ink-800 sm:col-span-2">
              <input type="checkbox" checked={payout.reinvest} onChange={(e) => setP({ ...payout, reinvest: e.target.checked })} className="size-4 accent-aubergine-800" />
              Keep repayments to reinvest instead of paying them out
            </label>
            <div className="sm:col-span-2">
              <Button onClick={() => setPayout(payout).then(setResult)}>Save</Button>
              <ActionResult result={result} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ── Profile: edit preferences, matches update everywhere ─── */

const sectorsAll = ["Trade and distribution", "Manufacturing", "Construction", "Services", "Healthcare", "Logistics", "Energy", "Agriculture and agro-processing"];

export function ProfileEditor() {
  const ws = useWorkspace();
  const [p, setP] = useState<Prefs>(ws.prefs);
  const [saved, setSaved] = useState(false);
  return (
    <Card className="p-7 sm:p-9">
      <div className="grid gap-8 lg:grid-cols-2">
        <label className="block text-sm font-semibold text-ink-800">
          Longest I&apos;m happy to invest for
          <select className={field} value={p.maxTenor} onChange={(e) => (setP({ ...p, maxTenor: Number(e.target.value) }), setSaved(false))}>
            {[3, 6, 12, 24].map((m) => (
              <option key={m} value={m}>
                {m} months
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-ink-800">
          Most I&apos;d put in one business
          <select className={field} value={p.maxPerBusiness} onChange={(e) => (setP({ ...p, maxPerBusiness: Number(e.target.value) }), setSaved(false))}>
            {[10, 20, 30, 50].map((m) => (
              <option key={m} value={m}>
                {m}% of my money
              </option>
            ))}
          </select>
        </label>
        <fieldset className="lg:col-span-2">
          <legend className="text-sm font-semibold text-ink-800">Sectors I want to back</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {sectorsAll.map((s) => (
              <FilterChip
                key={s}
                selected={p.sectors.includes(s)}
                onClick={() => (setP({ ...p, sectors: p.sectors.includes(s) ? p.sectors.filter((x) => x !== s) : [...p.sectors, s] }), setSaved(false))}
              >
                {s}
              </FilterChip>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-3 text-sm text-ink-800">
          <input type="checkbox" checked={p.securedOnly} onChange={(e) => (setP({ ...p, securedOnly: e.target.checked }), setSaved(false))} className="size-4 accent-aubergine-800" />
          Prefer deals with security behind them
        </label>
        <label className="flex items-center gap-3 text-sm text-ink-800">
          <input type="checkbox" checked={p.monthlyIncome} onChange={(e) => (setP({ ...p, monthlyIncome: e.target.checked }), setSaved(false))} className="size-4 accent-aubergine-800" />
          I want monthly income
        </label>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button onClick={() => (updatePrefs(p), setSaved(true))}>Save and update my matches</Button>
        {saved && (
          <Link href="/invest/discover" className="text-sm font-semibold text-success-600 hover:underline">
            Saved. See your updated matches →
          </Link>
        )}
      </div>
    </Card>
  );
}
