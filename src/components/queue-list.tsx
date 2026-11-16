"use client";

import { RefreshCw, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { opsQueue } from "@/lib/data";
import { cedis } from "@/lib/format";
import { FilterChip } from "./ui";

type Row = (typeof opsQueue)[number];

const filters: { id: string; label: string; test: (a: Row) => boolean }[] = [
  { id: "docs", label: "Awaiting documents", test: (a) => a.outstanding > 0 },
  { id: "committee", label: "At committee", test: (a) => a.stage === "Credit committee" },
  { id: "unassigned", label: "Unassigned", test: (a) => a.officer === "Unassigned" },
  { id: "mine", label: "Assigned to me", test: (a) => a.officer === "A. Mensah" },
];

/** The queue as a Gmail-style list: filter chips, dense rows, bold when action is needed. */
export function QueueList() {
  const q = (useSearchParams().get("q") ?? "").toLowerCase();
  const [active, setActive] = useState<string[]>([]);
  const [starred, setStarred] = useState<string[]>(["SRW-APP-2026-00418"]);
  const toggle = (id: string) => setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const rows = opsQueue
    .filter((a) => !q || [a.ref, a.business, a.industry, a.stage].some((t) => t.toLowerCase().includes(q)))
    .filter((a) => active.every((id) => filters.find((f) => f.id === id)!.test(a)));

  return (
    <div className="rise-in mt-6">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <FilterChip key={f.id} selected={active.includes(f.id)} onClick={() => toggle(f.id)}>
            {f.label}
          </FilterChip>
        ))}
      </div>

      <div className="mt-4 flex h-12 items-center gap-1 border-b border-ink-100 px-1 text-ink-600">
        <button type="button" aria-label="Refresh" className="state-layer flex size-10 items-center justify-center rounded-full">
          <RefreshCw className="size-[18px]" aria-hidden="true" />
        </button>
        <p className="ml-auto pr-2 font-mono text-xs">
          {rows.length ? `1–${rows.length} of ${rows.length}` : "0 of 0"}
          {q && <span className="ml-2 font-sans">for &ldquo;{q}&rdquo;</span>}
        </p>
      </div>

      <ul className="stagger">
        {rows.map((a) => {
          const needsAction = a.outstanding > 0 || a.officer === "Unassigned";
          const isStarred = starred.includes(a.ref);
          return (
            <li
              key={a.ref}
              className={`group flex min-h-12 cursor-pointer items-center gap-3 border-b border-ink-100 px-2 transition-shadow hover:z-10 hover:elev-1 ${
                needsAction ? "bg-white" : "bg-ink-50/60"
              }`}
            >
              <button
                type="button"
                aria-pressed={isStarred}
                aria-label={isStarred ? `Unstar ${a.ref}` : `Star ${a.ref}`}
                onClick={() => setStarred((s) => (s.includes(a.ref) ? s.filter((x) => x !== a.ref) : [...s, a.ref]))}
                className="state-layer flex size-9 shrink-0 items-center justify-center rounded-full"
              >
                <Star className={`size-[18px] ${isStarred ? "fill-saffron-500 text-saffron-500" : "text-ink-400"}`} aria-hidden="true" />
              </button>
              <p className={`w-48 shrink-0 truncate text-sm ${needsAction ? "font-bold text-ink-900" : "text-ink-700"}`}>{a.business}</p>
              <span className="hidden shrink-0 rounded bg-ink-100 px-1.5 py-0.5 text-xs text-ink-700 sm:inline">{a.stage}</span>
              <p className="min-w-0 flex-1 truncate text-sm text-ink-600">
                <span className={needsAction ? "font-semibold text-ink-900" : ""}>{a.next}</span>
                <span className="text-ink-500">
                  {" "}
                  · {a.officer} · {a.outstanding === 0 ? "no documents due" : `${a.outstanding} document${a.outstanding === 1 ? "" : "s"} due`} · {a.ref}
                </span>
              </p>
              <p className={`shrink-0 font-mono text-xs tabular-nums ${needsAction ? "font-semibold text-ink-900" : "text-ink-600"}`}>{cedis(a.amount)}</p>
            </li>
          );
        })}
        {rows.length === 0 && <li className="px-4 py-12 text-center text-ink-600">Nothing in the queue matches these filters.</li>}
      </ul>
    </div>
  );
}
