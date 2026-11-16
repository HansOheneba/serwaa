"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { applicationStages } from "@/lib/data";
import { cedis } from "@/lib/format";
import { useWorkspace, type Application } from "@/lib/store";
import { FilterChip, StatusPill } from "./ui";

const filters: { id: string; label: string; test: (a: Application, replies: Set<string>) => boolean }[] = [
  { id: "replies", label: "Replies to review", test: (a, r) => r.has(a.ref) },
  { id: "waiting", label: "Waiting on business", test: (a) => a.status === "Information requested" },
  { id: "unassigned", label: "Unassigned", test: (a) => a.officer === "Unassigned" },
  { id: "decided", label: "Decided", test: (a) => a.status === "Approved" || a.status === "Rejected" },
];

/** The application queue as an inbox: chips to filter, bold rows when action is needed, each row opens its case. */
export function QueueList() {
  const ws = useWorkspace();
  const q = (useSearchParams().get("q") ?? "").toLowerCase();
  const [active, setActive] = useState<string[]>([]);
  const replies = new Set(ws.requests.filter((r) => r.status === "Responded").map((r) => r.appRef));

  const rows = ws.applications
    .filter((a) => !q || [a.ref, a.business, a.industry, a.product].some((t) => t.toLowerCase().includes(q)))
    .filter((a) => active.every((id) => filters.find((f) => f.id === id)!.test(a, replies)));

  return (
    <div className="rise-in mt-10">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <FilterChip key={f.id} selected={active.includes(f.id)} onClick={() => setActive((a) => (a.includes(f.id) ? a.filter((x) => x !== f.id) : [...a, f.id]))}>
            {f.label}
          </FilterChip>
        ))}
        <p className="ml-auto font-mono text-xs text-ink-500">
          {rows.length} of {ws.applications.length}
          {q && <span className="ml-2 font-sans">for &ldquo;{q}&rdquo;</span>}
        </p>
      </div>

      <ul className="stagger mt-5 border-t border-ink-100">
        {rows.map((a) => {
          const needsAction = replies.has(a.ref) || a.officer === "Unassigned" || a.status === "In review";
          return (
            <li key={a.ref}>
              <Link
                href={`/ops/applications/${a.ref}`}
                className={`flex min-h-14 items-center gap-4 border-b border-ink-100 px-3 transition-shadow hover:relative hover:z-10 hover:elev-1 ${needsAction ? "bg-white" : "bg-ink-50/60"}`}
              >
                <p className={`w-52 shrink-0 truncate text-sm ${needsAction ? "font-bold text-ink-900" : "text-ink-700"}`}>{a.business}</p>
                <span className="hidden shrink-0 sm:inline">
                  <StatusPill tone={a.status === "Approved" ? "good" : a.status === "Rejected" ? "bad" : a.status === "In review" ? "brand" : "warn"}>{a.status}</StatusPill>
                </span>
                <p className="min-w-0 flex-1 truncate text-sm text-ink-600">
                  <span className={needsAction ? "font-semibold text-ink-900" : ""}>{replies.has(a.ref) ? "Reply to review" : applicationStages[a.stageIndex]}</span>
                  <span className="text-ink-500">
                    {" "}
                    · {a.product} · {a.officer} · {a.ref}
                  </span>
                </p>
                <p className={`shrink-0 font-mono text-xs tabular-nums ${needsAction ? "font-semibold text-ink-900" : "text-ink-600"}`}>{cedis(a.amount)}</p>
              </Link>
            </li>
          );
        })}
        {rows.length === 0 && <li className="px-4 py-12 text-center text-ink-600">Nothing in the queue matches these filters.</li>}
      </ul>
    </div>
  );
}
