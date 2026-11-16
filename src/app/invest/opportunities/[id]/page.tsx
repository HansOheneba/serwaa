import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button, Card, FundingBar, Label, MoneyBadge, StatusPill } from "@/components/ui";
import { opportunities } from "@/lib/data";
import { cedis, percent } from "@/lib/format";

export function generateStaticParams() {
  return opportunities.map((o) => ({ id: o.id }));
}

export async function generateMetadata(props: PageProps<"/invest/opportunities/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  return { title: opportunities.find((o) => o.id === id)?.business ?? "Opportunity" };
}

export default function OpportunityPage(props: PageProps<"/invest/opportunities/[id]">) {
  return (
    <Suspense fallback={<p className="text-ink-500">Loading opportunity…</p>}>
      <Opportunity params={props.params} />
    </Suspense>
  );
}

async function Opportunity({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = opportunities.find((x) => x.id === id);
  if (!o) notFound();

  const terms: [string, string][] = [
    ["Structure", o.product],
    ["Tenor", `${o.tenorMonths} months`],
    ["Expected return", `${o.expectedReturn}% a year`],
    ["Repayment", o.frequency],
    ["Security", o.security],
    ["Minimum investment", cedis(o.minTicket)],
  ];

  return (
    <>
      <Link href="/invest/discover" className="text-sm font-semibold text-aubergine-500 hover:underline">
        ← All opportunities
      </Link>
      <div className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>
            {o.sector} · {o.product}
          </Label>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-aubergine-800">{o.business}</h1>
          <p className="mt-1 font-mono text-xs text-ink-500">{o.ref}</p>
        </div>
        <StatusPill tone={o.risk === "Lower" ? "good" : o.risk === "Moderate" ? "warn" : "bad"}>{o.risk} risk</StatusPill>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <Card>
            <Label>Funding</Label>
            <div className="mt-3">
              <FundingBar target={o.target} cleared={o.cleared} pending={o.pending} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <div>
                <dt className="flex items-center gap-2 text-xs text-ink-500"><MoneyBadge state="cleared" /></dt>
                <dd className="mt-1 font-mono">{cedis(o.cleared)}</dd>
                <dd className="text-xs text-ink-500">{percent(o.cleared, o.target)}% of target</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-xs text-ink-500"><MoneyBadge state="pending" /></dt>
                <dd className="mt-1 font-mono">{cedis(o.pending)}</dd>
                <dd className="text-xs text-ink-500">Not counted yet</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Target</dt>
                <dd className="mt-1 font-mono">{cedis(o.target)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Closes in</dt>
                <dd className="mt-1 font-mono">{o.closesInDays} days</dd>
                <dd className="text-xs text-ink-500">{o.investors} investors</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <Label>About this deal</Label>
            <p className="mt-2 leading-7 text-ink-700">{o.purpose}</p>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {terms.map(([k, v]) => (
                <div key={k} className="border-t border-ink-100 pt-3">
                  <dt className="text-xs text-ink-500">{k}</dt>
                  <dd className="font-semibold text-ink-800">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="bg-danger-50 ring-danger-50">
            <Label className="text-danger-600">Risks</Label>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-ink-800">
              <li>The business may repay late or not at all, and you could lose some or all of your money.</li>
              <li>You can&apos;t withdraw before maturity.</li>
              <li>The expected return is a target, not a promise.</li>
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <Label>Why you&apos;re seeing this</Label>
              <span className="font-mono text-sm text-aubergine-700">{o.match}% match</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {o.matched.map((m) => (
                <li key={m} className="flex gap-2 text-ink-800">
                  <span className="text-success-600" aria-hidden="true">✓</span>
                  <span><span className="sr-only">Matches: </span>{m}</span>
                </li>
              ))}
              {o.unmatched.map((m) => (
                <li key={m} className="flex gap-2 text-ink-600">
                  <span className="text-saffron-700" aria-hidden="true">–</span>
                  <span><span className="sr-only">Doesn&apos;t match: </span>{m}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="bg-aubergine-800 text-white ring-aubergine-800">
            <p className="text-xs font-semibold tracking-[0.08em] text-saffron-300 uppercase">Subscribe</p>
            <p className="mt-2 text-lg font-bold">Investing opens after regulatory approval</p>
            <p className="mt-2 text-sm leading-6 text-aubergine-100">
              When live, you&apos;ll enter an amount, accept the subscription documents and pay the custodian by Mobile Money or bank transfer.
            </p>
            <Button variant="accent" className="mt-5 w-full" disabled>
              Subscribe
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
