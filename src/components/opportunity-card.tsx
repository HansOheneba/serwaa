import Link from "next/link";
import type { Opportunity } from "@/lib/data";
import { cedis, percent } from "@/lib/format";
import { FundingBar, Label, MoneyBadge } from "./ui";

export function OpportunityCard({
  o,
  href,
  showMatch = false,
  anonymous = false,
}: {
  o: Opportunity;
  href?: string;
  showMatch?: boolean;
  /** Public pages describe the borrower by sector instead of naming it. */
  anonymous?: boolean;
}) {
  const body = (
    <div className="flex h-full flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200 transition-shadow group-hover:shadow-md group-hover:ring-aubergine-200">
      <div className="flex items-start justify-between gap-3">
        <Label>
          {o.product} · {o.tenorMonths} months
        </Label>
        {showMatch ? (
          <span className="rounded-full bg-aubergine-50 px-2 py-0.5 font-mono text-xs font-medium text-aubergine-700">{o.match}% match</span>
        ) : (
          <span className="font-mono text-xs text-ink-500">{o.ref}</span>
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold text-aubergine-800">{anonymous ? `${o.sector} company` : o.business}</h3>
        <p className="mt-1 text-sm leading-6 text-ink-600">{o.purpose}</p>
      </div>
      <div className="mt-auto space-y-2">
        <FundingBar target={o.target} cleared={o.cleared} pending={o.pending} />
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <MoneyBadge state="cleared" />
          <span className="font-mono text-ink-700">{percent(o.cleared, o.target)}%</span>
          <MoneyBadge state="pending" />
          <span className="font-mono text-ink-700">{percent(o.pending, o.target)}%</span>
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-3 border-t border-ink-100 pt-4">
        <div>
          <dt className="text-xs text-ink-500">Target</dt>
          <dd className="font-mono text-sm font-medium">{cedis(o.target)}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-500">Expected return</dt>
          <dd className="font-mono text-sm font-medium">{o.expectedReturn}% p.a.</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-500">Minimum</dt>
          <dd className="font-mono text-sm font-medium">{cedis(o.minTicket)}</dd>
        </div>
      </dl>
    </div>
  );
  return href ? (
    <Link href={href} className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aubergine-500">
      {body}
    </Link>
  ) : (
    body
  );
}
