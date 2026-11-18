"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ActionResult } from "./notifications";
import { StageTracker } from "./stage-tracker";
import { Button, Card, FundingBar, Label, MoneyBadge, StatusPill } from "./ui";
import { applicationStages, campaignStages } from "@/lib/data";
import { cedis, percent } from "@/lib/format";
import {
  acceptResponse,
  agreeAllocation,
  advanceStage,
  approveCampaignStage,
  assignOfficer,
  decide,
  matchPayment,
  requestInformation,
  resetWorkspace,
  setActingStaff,
  useWorkspace,
  type Result,
} from "@/lib/store";

const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const field = "mt-1.5 w-full rounded-xl bg-white px-3.5 py-2.5 text-sm ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none";

/** Who is acting. Approvals are checked against this person's role and history. */
export function ActingAs() {
  const ws = useWorkspace();
  const me = ws.staff.find((s) => s.name === ws.actingStaff) ?? ws.staff[0];
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl bg-ink-50 px-5 py-4">
      <span className="text-sm text-ink-600">Signed in as</span>
      <select
        aria-label="Signed in as"
        value={me.name}
        onChange={(e) => setActingStaff(e.target.value)}
        className="rounded-lg bg-white px-3 py-2 text-sm font-semibold ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none"
      >
        {ws.staff.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name} · {s.roles.join(", ")}
          </option>
        ))}
      </select>
      <button type="button" onClick={resetWorkspace} className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-ink-800">
        <RotateCcw className="size-3.5" aria-hidden="true" />
        Reset workspace data
      </button>
    </div>
  );
}

/* ── Case view: one application, every decision ─────────── */

export function CaseView({ refId }: { refId: string }) {
  const ws = useWorkspace();
  const a = ws.applications.find((x) => x.ref === refId);
  const [result, setResult] = useState<Result | null>(null);
  const [ask, setAsk] = useState("");
  const [due, setDue] = useState(() => new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10));
  const [reason, setReason] = useState("");
  if (!a) return <p className="text-ink-600">Application {refId} not found.</p>;
  const requests = ws.requests.filter((r) => r.appRef === refId);
  const history = ws.audit.filter((e) => e.subject === refId);
  const campaign = ws.campaigns.find((c) => c.appRef === refId);
  const decided = a.status === "Approved" || a.status === "Rejected";

  return (
    <>
      <Link href="/ops" className="text-sm font-semibold text-aubergine-500 hover:underline">
        ← Application queue
      </Link>
      <div className="mt-6 mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>
            {a.industry} · {a.product}
          </Label>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-aubergine-800">{a.business}</h1>
          <p className="mt-1 font-mono text-xs text-ink-500">
            {a.ref} · {cedis(a.amount)} · brought in by {a.originator}
          </p>
        </div>
        <StatusPill tone={a.status === "Approved" ? "good" : a.status === "Rejected" ? "bad" : a.status === "In review" ? "brand" : "warn"}>{a.status}</StatusPill>
      </div>
      <ActingAs />

      <div className="grid gap-8 xl:grid-cols-[1fr_1.3fr]">
        <div className="space-y-8">
          <Card className="p-7">
            <Label>Stage</Label>
            <div className="mt-5">
              <StageTracker stages={applicationStages} current={a.stageIndex} />
            </div>
            {!decided && (
              <Button variant="tonal" className="mt-6" onClick={() => setResult(advanceStage(refId))}>
                Move to next stage
              </Button>
            )}
          </Card>
          <Card className="p-7">
            <Label>Purpose</Label>
            <p className="mt-3 text-ink-700">{a.purpose}</p>
            <label className="mt-6 block text-sm font-semibold text-ink-800">
              Officer
              <select className={field} value={a.officer} onChange={(e) => assignOfficer(refId, e.target.value)}>
                <option>Unassigned</option>
                {ws.staff.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </select>
            </label>
          </Card>
        </div>

        <div className="space-y-8">
          <ActionResult result={result} />

          {!decided && (
            <Card className="p-7">
              <Label>Credit decision</Label>
              <label className="mt-4 block text-sm font-semibold text-ink-800">
                Reason (goes on the record)
                <textarea rows={3} className={field} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Strong receivable from a creditworthy buyer; 18 months of steady bank inflows." />
              </label>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button onClick={() => setResult(decide(refId, "approve", reason))}>Approve</Button>
                <Button variant="outlined" onClick={() => setResult(decide(refId, "return", reason))}>
                  Return for changes
                </Button>
                <Button variant="text" className="text-danger-600" onClick={() => setResult(decide(refId, "reject", reason))}>
                  Reject
                </Button>
              </div>
              <p className="mt-4 text-xs text-ink-500">Only a credit risk manager or committee member can approve, and never on an application they brought in.</p>
            </Card>
          )}

          {campaign && (
            <Card className="flex flex-wrap items-center justify-between gap-4 p-7">
              <div>
                <Label>Campaign</Label>
                <p className="mt-2 font-semibold text-ink-900">
                  {campaign.ref} · {campaignStages[campaign.stageIndex]}
                </p>
              </div>
              <Link href="/ops/campaigns" className="text-sm font-semibold text-aubergine-500 hover:underline">
                Open campaigns →
              </Link>
            </Card>
          )}

          <Card className="p-7">
            <Label>Information requests</Label>
            <ul className="mt-3 divide-y divide-ink-100">
              {requests.length === 0 && <li className="py-3 text-sm text-ink-600">None yet.</li>}
              {requests.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-semibold text-ink-900">{r.title}</p>
                    <p className="text-xs text-ink-500">
                      {r.status === "Open" ? `Waiting on business · due ${r.due}` : r.files.length ? `Sent: ${r.files.join(", ")}` : r.status}
                    </p>
                    {r.reply && <p className="mt-1 text-sm text-ink-700">&ldquo;{r.reply}&rdquo;</p>}
                  </div>
                  {r.status === "Responded" ? (
                    <Button variant="tonal" onClick={() => acceptResponse(r.id)}>
                      Accept
                    </Button>
                  ) : (
                    <StatusPill tone={r.status === "Accepted" ? "good" : "warn"}>{r.status}</StatusPill>
                  )}
                </li>
              ))}
            </ul>
            {!decided && (
              <div className="mt-4 grid gap-3 border-t border-ink-100 pt-5 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
                <label className="block text-sm font-semibold text-ink-800">
                  Ask the business for
                  <input className={field} value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="Signed delivery note for invoice 2231" />
                </label>
                <label className="block text-sm font-semibold text-ink-800">
                  By
                  <input type="date" className={field} value={due} onChange={(e) => setDue(e.target.value)} />
                </label>
                <Button
                  onClick={() => {
                    const r = requestInformation(refId, ask, due);
                    setResult(r);
                    if (r.ok) setAsk("");
                  }}
                >
                  Send request
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-7">
            <Label>History</Label>
            <ol className="mt-4 space-y-4">
              {history.length === 0 && <li className="text-sm text-ink-600">Every action on this application is recorded here.</li>}
              {history.map((e) => (
                <li key={e.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-aubergine-400" aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-ink-900">{e.action}</span>
                    <span className="text-ink-600"> · {e.actor}, {e.role}</span>
                    {e.reason && <span className="block text-ink-600">&ldquo;{e.reason}&rdquo;</span>}
                    <span className="block font-mono text-[11px] text-ink-400">{date(e.at)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ── Campaigns: staged sign-off and publishing ──────────── */

export function CampaignsView() {
  const ws = useWorkspace();
  const [results, setResults] = useState<Record<string, Result>>({});
  return (
    <>
      <ActingAs />
      <div className="space-y-8">
        {ws.campaigns.map((c) => {
          const live = c.stageIndex === campaignStages.length - 1;
          const reserved = ws.interests.filter((i) => i.campaignId === c.id).reduce((t, i) => t + i.amount, 0);
          return (
            <Card key={c.id} className="p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-ink-500">
                    {c.ref} · drafted by {c.drafter}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-aubergine-800">{c.business}</h2>
                </div>
                <StatusPill tone={live ? "good" : "warn"}>{campaignStages[c.stageIndex]}</StatusPill>
              </div>
              <div className="mt-5 flex gap-1" role="img" aria-label={`Stage ${c.stageIndex + 1} of ${campaignStages.length}`}>
                {campaignStages.map((s, i) => (
                  <span key={s} title={s} className={`h-1.5 flex-1 rounded-sm ${i <= c.stageIndex ? "bg-aubergine-800" : "bg-ink-100"}`} />
                ))}
              </div>
              {live ? (
                <div className="mt-6 grid items-center gap-5 sm:grid-cols-[1fr_auto]">
                  <FundingBar target={c.target} cleared={c.cleared} pending={c.pending} />
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="inline-flex items-center gap-2">
                      <MoneyBadge state="cleared" />
                      <span className="font-mono">{percent(c.cleared, c.target)}%</span>
                    </span>
                    <span className="font-mono text-ink-600">Reserved {cedis(reserved)}</span>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-saffron-50 p-5">
                  <p className="text-sm text-saffron-900">
                    Next sign-off: <span className="font-semibold">{campaignStages[c.stageIndex + 1]}</span>. The drafter can&apos;t sign off, and no one signs two stages in a row.
                  </p>
                  <Button onClick={() => setResults((r) => ({ ...r, [c.id]: approveCampaignStage(c.id) }))}>
                    {c.stageIndex + 1 === campaignStages.length - 1 ? "Publish to investors" : "Sign off"}
                  </Button>
                </div>
              )}
              <ActionResult result={results[c.id] ?? null} />
              {ws.institution.allocations
                .filter((a) => a.campaignId === c.id)
                .map((a) => (
                  <div key={a.id} className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-ink-50 p-5">
                    <p className="text-sm text-ink-800">
                      <span className="font-semibold">{ws.institution.name}</span> wants {cedis(a.amount)} of this deal.
                    </p>
                    {a.status === "Requested" ? (
                      <Button variant="tonal" onClick={() => setResults((r) => ({ ...r, [c.id]: agreeAllocation(a.id) }))}>
                        Agree allocation
                      </Button>
                    ) : (
                      <StatusPill tone={a.status === "Paid" ? "good" : "brand"}>{a.status}</StatusPill>
                    )}
                  </div>
                ))}
              {c.approvals.length > 0 && (
                <p className="mt-4 text-xs text-ink-500">Signed off by {c.approvals.map((a) => `${a.by} (${a.stage})`).join(" · ")}</p>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}

/* ── Reconciliation: confirm payments against what arrived ── */

export function ReconciliationView() {
  const ws = useWorkspace();
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, Result>>({});
  const tone = { Matched: "good", Underpayment: "bad", Duplicate: "bad", "Awaiting authorisation": "warn", Pending: "brand", Confirmed: "brand" } as const;
  return (
    <>
      <ActingAs />
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-xs tracking-[0.08em] text-ink-500 uppercase">
              <th className="px-6 py-4 font-semibold">Payment</th>
              <th className="px-4 py-4 font-semibold">From</th>
              <th className="px-4 py-4 font-semibold">For</th>
              <th className="px-4 py-4 text-right font-semibold">Expected</th>
              <th className="px-4 py-4 text-right font-semibold">Received</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {ws.payments.map((p) => (
              <tr key={p.ref} className="align-top">
                <td className="px-6 py-4">
                  <p className="font-mono text-xs">{p.ref}</p>
                  <p className="text-xs text-ink-500">
                    {p.kind} · {p.method}
                  </p>
                </td>
                <td className="px-4 py-4">{p.from}</td>
                <td className="px-4 py-4 font-mono text-xs">{p.subject}</td>
                <td className="px-4 py-4 text-right font-mono tabular-nums">{cedis(p.expected)}</td>
                <td className={`px-4 py-4 text-right font-mono tabular-nums ${p.received < p.expected ? "text-danger-600" : ""}`}>{cedis(p.received)}</td>
                <td className="px-4 py-4">
                  <StatusPill tone={tone[p.status]}>{p.status}</StatusPill>
                </td>
                <td className="px-6 py-4">
                  {p.status === "Matched" ? (
                    <span className="text-xs text-ink-400">Done</span>
                  ) : (
                    <div className="flex min-w-64 gap-2">
                      <input
                        aria-label={`Reason for matching ${p.ref}`}
                        value={reasons[p.ref] ?? ""}
                        onChange={(e) => setReasons((r) => ({ ...r, [p.ref]: e.target.value }))}
                        placeholder="Reason, e.g. MoMo ID 448210"
                        className="min-w-0 flex-1 rounded-lg bg-white px-3 py-2 text-xs ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none"
                      />
                      <Button variant="tonal" onClick={() => setResults((r) => ({ ...r, [p.ref]: matchPayment(p.ref, reasons[p.ref] ?? "") }))}>
                        Match
                      </Button>
                    </div>
                  )}
                  {results[p.ref] && !results[p.ref].ok && <p className="mt-2 text-xs font-semibold text-danger-600">{results[p.ref].message}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
