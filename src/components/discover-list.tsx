"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Opportunity } from "@/lib/data";
import { OpportunityCard } from "./opportunity-card";
import { FilterChip } from "./ui";

const filters: { id: string; label: string; test: (o: Opportunity) => boolean }[] = [
  { id: "short", label: "Up to 6 months", test: (o) => o.tenorMonths <= 6 },
  { id: "secured", label: "Secured", test: (o) => !/unsecured/i.test(o.security) },
  { id: "lower", label: "Lower risk", test: (o) => o.risk === "Lower" },
  { id: "income", label: "Regular repayments", test: (o) => /monthly/i.test(o.frequency) },
];

/** Matched opportunities with Gmail-style filter chips and the top-bar search applied. */
export function DiscoverList({ opportunities }: { opportunities: Opportunity[] }) {
  const q = (useSearchParams().get("q") ?? "").toLowerCase();
  const [active, setActive] = useState<string[]>([]);
  const toggle = (id: string) => setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const shown = [...opportunities]
    .filter((o) => !q || [o.business, o.sector, o.product, o.purpose].some((t) => t.toLowerCase().includes(q)))
    .filter((o) => active.every((id) => filters.find((f) => f.id === id)!.test(o)))
    .sort((a, b) => b.match - a.match);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <FilterChip key={f.id} selected={active.includes(f.id)} onClick={() => toggle(f.id)}>
            {f.label}
          </FilterChip>
        ))}
        {q && (
          <p className="ml-1 text-sm text-ink-600">
            Results for <span className="font-semibold text-ink-900">&ldquo;{q}&rdquo;</span>
          </p>
        )}
      </div>
      {shown.length ? (
        <div className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((o) => (
            <OpportunityCard key={o.id} o={o} href={`/invest/opportunities/${o.id}`} showMatch />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-ink-50 p-10 text-center text-ink-600">No opportunities match these filters. Remove a filter to see more.</p>
      )}
    </>
  );
}
