"use client";

import { CalendarClock, Download, FileUp, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { DashboardBand } from "./dashboard-band";
import { ActionResult } from "./notifications";
import { StageTracker } from "./stage-tracker";
import { Button, ButtonLink, Card, Label, StatusPill } from "./ui";
import { applicationStages, kybStages } from "@/lib/data";
import { cedis } from "@/lib/format";
import {
  earlyPayoff,
  payFacility,
  respondToRequest,
  setAutopay,
  submitApplication,
  useWorkspace,
  type AppStatus,
  type Result,
} from "@/lib/store";

const BUSINESS = "Abrewa Trading Ltd";
const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const statusTone = (s: AppStatus) =>
  s === "Approved" ? "good" : s === "Rejected" ? "bad" : s === "Information requested" || s === "Returned for changes" ? "warn" : "brand";

function downloadCsv(name: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Overview ─────────────────────────────────────────────── */

export function BusinessOverview() {
  const ws = useWorkspace();
  const apps = ws.applications.filter((a) => a.business === BUSINESS);
  const current = apps[0];
  const open = ws.requests.filter((r) => apps.some((a) => a.ref === r.appRef) && r.status === "Open");
  const next = ws.facility.schedule.find((l) => l.status === "Due" || l.status === "Upcoming");
  const verified = Math.round(kybStages.reduce((t, k) => t + k.done, 0) / kybStages.length);
  const outstanding = ws.facility.schedule.filter((l) => l.status !== "Paid").reduce((t, l) => t + l.principal, 0);

  return (
    <div className="space-y-10">
      <DashboardBand
        eyebrow="Business overview"
        greeting="Good morning, Abrewa Trading"
        figureLabel="Still to repay on your facility"
        figure={cedis(outstanding)}
        action={<ButtonLink href="/business/applications/new" variant="accent">New application</ButtonLink>}
        stats={[
          { label: "Next repayment", value: next ? cedis(next.amount) : "None", hint: next ? `Due ${date(next.due)}` : "All paid" },
          { label: "Applications", value: String(apps.length), hint: current ? current.status : "None yet" },
          { label: "Needs your reply", value: String(open.length), hint: open[0] ? `Due ${date(open[0].due)}` : "Nothing waiting" },
          { label: "Verified", value: `${verified}%`, hint: "Complete it to raise faster" },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Label>Latest application</Label>
              {current ? (
                <>
                  <h2 className="mt-2 text-xl font-bold text-aubergine-800">
                    {current.product} · {cedis(current.amount)}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-ink-500">{current.ref}</p>
                </>
              ) : (
                <p className="mt-2 text-ink-600">No applications yet.</p>
              )}
            </div>
            {current && <StatusPill tone={statusTone(current.status)}>{current.status}</StatusPill>}
          </div>
          {current && (
            <>
              <div className="mt-7 flex justify-between text-sm">
                <span className="font-semibold text-ink-800">{applicationStages[current.stageIndex]}</span>
                <span className="font-mono text-ink-500">
                  Stage {current.stageIndex + 1} of {applicationStages.length}
                </span>
              </div>
              <div className="mt-3 flex gap-1" aria-hidden="true">
                {applicationStages.map((s, i) => (
                  <span key={s} className={`h-2 flex-1 rounded-sm ${i < current.stageIndex ? "bg-aubergine-800" : i === current.stageIndex ? "bg-saffron-500" : "bg-ink-100"}`} />
                ))}
              </div>
              <ButtonLink href={`/business/applications?ref=${current.ref}`} variant="text" className="mt-6 -ml-3">
                Open application
              </ButtonLink>
            </>
          )}
        </Card>

        <Card className="p-7">
          <Label>Needs your reply</Label>
          {open.length === 0 ? (
            <p className="mt-3 text-ink-600">Nothing is waiting on you. We&apos;ll let you know if we need anything.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {open.map((r) => (
                <li key={r.id} className="rounded-xl bg-saffron-50 p-4">
                  <p className="font-semibold text-ink-900">{r.title}</p>
                  <p className="mt-1 text-sm text-ink-600">Due {date(r.due)}</p>
                  <ButtonLink href={`/business/applications?ref=${r.appRef}`} variant="tonal" className="mt-3">
                    Reply
                  </ButtonLink>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {next && (
        <Card className="flex flex-wrap items-center justify-between gap-6 p-7">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-aubergine-50 text-aubergine-700">
              <CalendarClock className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold text-ink-900">
                {cedis(next.amount)} due {date(next.due)}
              </p>
              <p className="text-sm text-ink-600">
                {ws.facility.product} · {ws.facility.ref}
                {ws.facility.autopay ? " · paid automatically" : ""}
              </p>
            </div>
          </div>
          <ButtonLink href="/business/facilities">Pay or manage</ButtonLink>
        </Card>
      )}
    </div>
  );
}

/* ── New application ──────────────────────────────────────── */

const products = ["Invoice financing", "Purchase order financing", "Contract financing", "Working capital financing", "Inventory financing", "Equipment financing"];
const field = "mt-1.5 w-full rounded-xl bg-white px-3.5 py-3 text-sm ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none";

export function NewApplicationForm() {
  const router = useRouter();
  const [product, setProduct] = useState(products[0]);
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [disclosure, setDisclosure] = useState<"public" | "investors">("investors");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount.replace(/[^\d.]/g, ""));
    if (!value || value < 10_000) return setError("Enter an amount of at least GH₵ 10,000.");
    if (purpose.trim().length < 10) return setError("Tell us briefly what the money is for.");
    const ref = submitApplication({ product, amount: value, purpose: purpose.trim(), disclosure });
    router.push(`/business/applications?ref=${ref}`);
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <label className="block text-sm font-semibold text-ink-800">
        What do you need financed?
        <select className={field} value={product} onChange={(e) => setProduct(e.target.value)}>
          {products.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold text-ink-800">
        How much? (GH₵)
        <input className={`${field} font-mono`} inputMode="numeric" value={amount} onChange={(e) => (setAmount(e.target.value), setError(""))} placeholder="400,000" />
      </label>
      <label className="block text-sm font-semibold text-ink-800">
        What&apos;s it for?
        <textarea className={field} rows={4} value={purpose} onChange={(e) => (setPurpose(e.target.value), setError(""))} placeholder="Stock for a supermarket order due on 28 February" />
      </label>
      <fieldset>
        <legend className="text-sm font-semibold text-ink-800">Who can see your business name?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["investors", "Signed-in investors only", "The public sees your industry, not your name."],
              ["public", "Everyone", "Your name appears on the public marketplace."],
            ] as const
          ).map(([value, title, body]) => (
            <label
              key={value}
              className={`flex cursor-pointer gap-3 rounded-xl p-4 ring-1 ${disclosure === value ? "bg-aubergine-50 ring-2 ring-aubergine-800" : "ring-ink-200"}`}
            >
              <input type="radio" name="disclosure" className="mt-1 accent-aubergine-800" checked={disclosure === value} onChange={() => setDisclosure(value)} />
              <span>
                <span className="block text-sm font-semibold text-ink-900">{title}</span>
                <span className="block text-sm text-ink-600">{body}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {error && <p className="text-sm font-semibold text-danger-600">{error}</p>}
      <Button type="submit">Submit application</Button>
    </form>
  );
}

/* ── Applications and replies ─────────────────────────────── */

function ReplyBox({ id }: { id: string }) {
  const [files, setFiles] = useState<string[]>([]);
  const [reply, setReply] = useState("");
  return (
    <div className="mt-4 space-y-3">
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-ink-200 p-4 text-sm text-ink-600 hover:border-aubergine-300 hover:bg-aubergine-50">
        <FileUp className="size-5 shrink-0 text-aubergine-500" aria-hidden="true" />
        <input type="file" multiple className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} />
        {files.length ? files.join(", ") : "Choose files to attach"}
      </label>
      <textarea
        rows={2}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Add a note for your analyst (optional)"
        className="w-full rounded-xl bg-white px-3.5 py-3 text-sm ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none"
      />
      <Button onClick={() => respondToRequest(id, files, reply)} disabled={files.length === 0}>
        Send reply
      </Button>
    </div>
  );
}

export function BusinessApplications() {
  const ws = useWorkspace();
  const params = useSearchParams();
  const apps = ws.applications.filter((a) => a.business === BUSINESS);
  const selected = apps.find((a) => a.ref === params.get("ref")) ?? apps[0];
  if (!selected) return <p className="text-ink-600">No applications yet.</p>;
  const requests = ws.requests.filter((r) => r.appRef === selected.ref);
  const history = ws.audit.filter((e) => e.subject === selected.ref);

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <nav aria-label="Your applications" className="space-y-2">
        {apps.map((a) => (
          <Link
            key={a.ref}
            href={`/business/applications?ref=${a.ref}`}
            aria-current={a.ref === selected.ref ? "page" : undefined}
            className={`state-layer block rounded-2xl p-4 ring-1 ${a.ref === selected.ref ? "bg-aubergine-50 ring-aubergine-200" : "ring-ink-200"}`}
          >
            <p className="text-sm font-bold text-ink-900">{a.product}</p>
            <p className="mt-0.5 font-mono text-xs text-ink-500">
              {cedis(a.amount)} · {a.ref}
            </p>
            <p className="mt-2">
              <StatusPill tone={statusTone(a.status)}>{a.status}</StatusPill>
            </p>
          </Link>
        ))}
        <ButtonLink href="/business/applications/new" variant="outlined" className="mt-2 w-full">
          New application
        </ButtonLink>
      </nav>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card className="p-7">
          <Label>Progress</Label>
          <p className="mt-1 mb-6 font-mono text-xs text-ink-500">
            {selected.ref} · submitted {date(selected.submittedAt)}
          </p>
          <StageTracker stages={applicationStages} current={selected.stageIndex} />
        </Card>
        <div className="space-y-8">
          <Card className="p-7">
            <Label>What we need from you</Label>
            {requests.length === 0 && <p className="mt-3 text-ink-600">Nothing at the moment.</p>}
            <ul className="mt-2 divide-y divide-ink-100">
              {requests.map((r) => (
                <li key={r.id} className="py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink-900">{r.title}</p>
                      <p className="mt-1 text-sm text-ink-600">
                        Asked by {r.createdBy} · due {date(r.due)}
                      </p>
                    </div>
                    <StatusPill tone={r.status === "Open" ? "warn" : r.status === "Accepted" ? "good" : "brand"}>{r.status === "Responded" ? "Sent" : r.status}</StatusPill>
                  </div>
                  {r.status === "Open" ? (
                    <ReplyBox id={r.id} />
                  ) : (
                    r.files.length > 0 && <p className="mt-2 text-sm text-ink-600">Sent: {r.files.join(", ")}</p>
                  )}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-7">
            <Label>History</Label>
            <ol className="mt-4 space-y-3">
              {history.length === 0 && <li className="text-sm text-ink-600">Updates on your application will appear here.</li>}
              {history.map((e) => (
                <li key={e.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-aubergine-400" aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-ink-900">{e.action}</span>
                    <span className="block text-xs text-ink-500">{date(e.at)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ── Facility: schedule, payments, autopay, early repayment ── */

const networks = ["MTN MoMo", "Telecel Cash", "AT Money", "Bank transfer"];

export function FacilityView() {
  const ws = useWorkspace();
  const f = ws.facility;
  const [method, setMethod] = useState(networks[0]);
  const [number, setNumber] = useState(f.payoutNumber);
  const [result, setResult] = useState<Result | null>(null);
  const [autoNumber, setAutoNumber] = useState(f.payoutNumber);
  const [autoResult, setAutoResult] = useState<Result | null>(null);
  const payoff = earlyPayoff(f);
  const next = f.schedule.find((l) => l.status === "Due" || l.status === "Upcoming");
  const paid = f.schedule.filter((l) => l.status === "Paid").reduce((t, l) => t + l.amount, 0);
  const pending = f.schedule.some((l) => l.status === "Pending");

  return (
    <div className="space-y-10">
      <DashboardBand
        eyebrow={`${f.product} · ${f.ref}`}
        greeting="Your facility"
        figureLabel="Principal still to repay"
        figure={cedis(payoff.principal)}
        stats={[
          { label: "Borrowed", value: cedis(f.principal), hint: `On ${date(f.disbursedAt)}` },
          { label: "Repaid so far", value: cedis(paid) },
          { label: "Next payment", value: next ? cedis(next.amount) : "None", hint: next ? `Due ${date(next.due)}` : "Fully repaid" },
          { label: "Automatic", value: f.autopay ? "On" : "Off", hint: f.autopay ? `From ${f.payoutNumber}` : "Pay each month yourself" },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-7">
          <Label>Make a payment</Label>
          <div className="mt-5 flex flex-wrap gap-2">
            {networks.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={method === n}
                onClick={() => setMethod(n)}
                className={`state-layer h-9 rounded-lg px-4 text-sm font-semibold ${method === n ? "bg-aubergine-100 text-aubergine-900" : "text-ink-700 ring-1 ring-inset ring-ink-300"}`}
              >
                {n}
              </button>
            ))}
          </div>
          {method !== "Bank transfer" && (
            <label className="mt-5 block text-sm font-semibold text-ink-800">
              Mobile Money number
              <input className={`${field} font-mono`} inputMode="tel" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="024 123 4567" />
            </label>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => setResult(payFacility("next", method, number))} disabled={!next || pending}>
              <Smartphone aria-hidden="true" />
              Pay {next ? cedis(next.amount) : ""}
            </Button>
          </div>
          {pending && <p className="mt-3 text-sm text-ink-600">A payment is on its way. We&apos;ll confirm it as soon as it arrives.</p>}
          <ActionResult result={result} />
        </Card>

        <Card className="p-7">
          <Label>Repay early</Label>
          <p className="mt-3 text-ink-600">Settle everything today and skip the interest on future months.</p>
          <dl className="mt-5 grid grid-cols-3 gap-4">
            <div>
              <dt className="text-xs text-ink-500">Principal</dt>
              <dd className="font-mono text-sm font-medium">{cedis(payoff.principal)}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-500">This month&apos;s interest</dt>
              <dd className="font-mono text-sm font-medium">{cedis(payoff.interestNow)}</dd>
            </div>
            <div>
              <dt className="text-xs text-success-600">You save</dt>
              <dd className="font-mono text-sm font-medium text-success-600">{cedis(payoff.saved)}</dd>
            </div>
          </dl>
          <Button variant="outlined" className="mt-6" onClick={() => setResult(payFacility("all", method, number))} disabled={!next || pending}>
            Pay off {cedis(payoff.total)}
          </Button>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-x-auto p-0">
          <div className="flex items-center justify-between gap-3 px-7 pt-6">
            <Label>Repayment schedule</Label>
            <Button
              variant="text"
              onClick={() => downloadCsv(`${f.ref}-statement.csv`, [["Due", "Amount", "Principal", "Interest", "Status"], ...f.schedule.map((l) => [l.due, l.amount, l.principal, l.interest, l.status])])}
            >
              <Download aria-hidden="true" />
              Statement
            </Button>
          </div>
          <table className="mt-3 w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs tracking-[0.08em] text-ink-500 uppercase">
                <th className="px-7 py-3 font-semibold">Due</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
                <th className="px-4 py-3 text-right font-semibold">Interest</th>
                <th className="px-7 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {f.schedule.map((l) => (
                <tr key={l.due}>
                  <td className="px-7 py-4">{date(l.due)}</td>
                  <td className="px-4 py-4 text-right font-mono tabular-nums">{cedis(l.amount)}</td>
                  <td className="px-4 py-4 text-right font-mono tabular-nums text-ink-500">{cedis(l.interest)}</td>
                  <td className="px-7 py-4">
                    <StatusPill tone={l.status === "Paid" ? "good" : l.status === "Due" ? "warn" : l.status === "Pending" ? "brand" : "neutral"}>{l.status}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-7">
          <Label>Automatic repayments</Label>
          <p className="mt-3 text-ink-600">We&apos;ll request each instalment from your Mobile Money on the due date. You approve once.</p>
          <label className="mt-5 block text-sm font-semibold text-ink-800">
            Number to debit
            <input className={`${field} font-mono`} inputMode="tel" value={autoNumber} onChange={(e) => setAutoNumber(e.target.value)} placeholder="024 123 4567" />
          </label>
          <Button className="mt-6" variant={f.autopay ? "outlined" : "filled"} onClick={() => setAutoResult(setAutopay(!f.autopay, autoNumber))}>
            {f.autopay ? "Turn off" : "Turn on"}
          </Button>
          <ActionResult result={autoResult} />
        </Card>
      </div>
    </div>
  );
}
