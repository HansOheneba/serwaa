"use client";

import { Download, UserPlus } from "lucide-react";
import { useState } from "react";
import { ActionResult } from "./notifications";
import { ActingAs } from "./ops-views";
import { Button, Card, FilterChip, Label, StatusPill } from "./ui";
import { cedis } from "@/lib/format";
import {
  ROLES,
  addStaff,
  setRestricted,
  setStaffRoles,
  updateFees,
  useWorkspace,
  type Fees,
  type Result,
  type StaffMember,
} from "@/lib/store";

const field = "mt-1.5 w-full rounded-xl bg-white px-3.5 py-2.5 text-sm ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none";
const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/* ── Team and roles ─────────────────────────────────────── */

function RolePicker({ value, onChange }: { value: string[]; onChange: (r: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ROLES.map((r) => (
        <FilterChip key={r} selected={value.includes(r)} onClick={() => onChange(value.includes(r) ? value.filter((x) => x !== r) : [...value, r])}>
          {r}
        </FilterChip>
      ))}
    </div>
  );
}

export function TeamView() {
  const ws = useWorkspace();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [m, setM] = useState<StaffMember>({ name: "", email: "", roles: [] });
  const [addResult, setAddResult] = useState<Result | null>(null);
  return (
    <>
      <ActingAs />
      <Card className="p-0">
        <ul className="divide-y divide-ink-100">
          {ws.staff.map((s) => (
            <li key={s.name} className="px-7 py-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink-900">{s.name}</p>
                  <p className="text-sm text-ink-500">{s.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.roles.map((r) => (
                    <StatusPill key={r} tone="brand">
                      {r}
                    </StatusPill>
                  ))}
                </div>
                <Button variant="text" onClick={() => (setEditing(editing === s.name ? null : s.name), setDraft(s.roles))}>
                  {editing === s.name ? "Close" : "Change roles"}
                </Button>
              </div>
              {editing === s.name && (
                <div className="rise-in mt-5 rounded-xl bg-ink-50 p-5">
                  <RolePicker value={draft} onChange={setDraft} />
                  <Button className="mt-5" onClick={() => setResults((r) => ({ ...r, [s.name]: setStaffRoles(s.name, draft) }))}>
                    Save roles
                  </Button>
                  <ActionResult result={results[s.name] ?? null} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>
      <Card className="mt-8 p-7">
        <Label>Add a person</Label>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-ink-800">
            Name
            <input className={field} value={m.name} onChange={(e) => setM({ ...m, name: e.target.value })} placeholder="P. Agyeman" />
          </label>
          <label className="block text-sm font-semibold text-ink-800">
            Work email
            <input className={field} type="email" value={m.email} onChange={(e) => setM({ ...m, email: e.target.value })} placeholder="p.agyeman@serwaa.com" />
          </label>
        </div>
        <p className="mt-6 text-sm font-semibold text-ink-800">Roles</p>
        <div className="mt-3">
          <RolePicker value={m.roles} onChange={(roles) => setM({ ...m, roles })} />
        </div>
        <Button
          className="mt-6"
          onClick={() => {
            const r = addStaff(m);
            setAddResult(r);
            if (r.ok) setM({ name: "", email: "", roles: [] });
          }}
        >
          <UserPlus aria-hidden="true" />
          Add person
        </Button>
        <p className="mt-3 text-xs text-ink-500">Only a super administrator can add people or change roles. Every change is recorded.</p>
        <ActionResult result={addResult} />
      </Card>
    </>
  );
}

/* ── Fees ───────────────────────────────────────────────── */

const feeFields: { key: keyof Fees; label: string; unit: "%" | "GH₵"; help: string }[] = [
  { key: "originationPct", label: "Arrangement fee", unit: "%", help: "Charged to the business on the amount raised" },
  { key: "servicingPct", label: "Servicing fee", unit: "%", help: "Taken from each repayment before investors are paid" },
  { key: "momoPct", label: "Mobile Money collection", unit: "%", help: "Added when an investor pays by Mobile Money" },
  { key: "bankFlat", label: "Bank transfer collection", unit: "GH₵", help: "Flat charge when an investor pays by bank transfer" },
  { key: "payoutMomoPct", label: "Mobile Money payout", unit: "%", help: "Deducted when money is paid out to Mobile Money" },
  { key: "payoutBankFlat", label: "Bank payout", unit: "GH₵", help: "Flat charge when money is paid out to a bank" },
];

export function FeesView() {
  const ws = useWorkspace();
  const [f, setF] = useState<Fees>(ws.fees);
  const [reason, setReason] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const history = ws.audit.filter((a) => a.subject === "Fees");
  return (
    <>
      <ActingAs />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-7">
          <div className="grid gap-6 sm:grid-cols-2">
            {feeFields.map((x) => (
              <label key={x.key} className="block text-sm font-semibold text-ink-800">
                {x.label} ({x.unit})
                <input
                  className={`${field} font-mono`}
                  inputMode="decimal"
                  value={f[x.key]}
                  onChange={(e) => setF({ ...f, [x.key]: Number(e.target.value.replace(/[^\d.]/g, "")) })}
                />
                <span className="mt-1.5 block text-xs font-normal text-ink-500">{x.help}</span>
              </label>
            ))}
          </div>
          <label className="mt-6 block text-sm font-semibold text-ink-800">
            Reason for the change
            <textarea rows={2} className={field} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="New MTN MoMo collection rate from 1 December" />
          </label>
          <Button className="mt-6" onClick={() => setResult(updateFees(f, reason))}>
            Save fees
          </Button>
          <ActionResult result={result} />
        </Card>
        <div className="space-y-8">
          <Card className="p-7">
            <Label>What this means</Label>
            <ul className="mt-4 space-y-3 text-sm text-ink-700">
              <li>
                Investing {cedis(1000)} by Mobile Money costs <span className="font-mono">{cedis((1000 * f.momoPct) / 100, true)}</span> extra.
              </li>
              <li>
                Investing by bank transfer costs <span className="font-mono">{cedis(f.bankFlat, true)}</span> extra.
              </li>
              <li>
                From a {cedis(10000)} repayment, <span className="font-mono">{cedis((10000 * f.servicingPct) / 100, true)}</span> goes to servicing.
              </li>
              <li>
                Withdrawing {cedis(1000)} to Mobile Money costs <span className="font-mono">{cedis((1000 * f.payoutMomoPct) / 100, true)}</span>.
              </li>
            </ul>
          </Card>
          <Card className="p-7">
            <Label>Changes</Label>
            <ul className="mt-4 space-y-4 text-sm">
              {history.length === 0 && <li className="text-ink-600">No changes yet.</li>}
              {history.map((h) => (
                <li key={h.id}>
                  <p className="font-semibold text-ink-900">{h.action}</p>
                  <p className="text-ink-600">
                    {h.actor} · {day(h.at)}
                    {h.reason && <> · &ldquo;{h.reason}&rdquo;</>}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ── Accounts ───────────────────────────────────────────── */

export function AccountsView() {
  const ws = useWorkspace();
  const [type, setType] = useState<string | null>(null);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, Result>>({});
  const activity = (name: string, kind: string) => {
    if (kind === "Business") {
      const apps = ws.applications.filter((a) => a.business === name);
      return `${apps.length} application${apps.length === 1 ? "" : "s"} · ${cedis(apps.reduce((t, a) => t + a.amount, 0))} requested`;
    }
    const inv = ws.investments.filter((i) => (kind === "Institution" ? i.investor === "institution" : i.investor === "individual" && name === "Ama Owusu"));
    return `${inv.length} new investment${inv.length === 1 ? "" : "s"} · ${cedis(inv.reduce((t, i) => t + i.amount, 0))}`;
  };
  const rows = ws.accounts.filter((a) => !type || a.type === type);
  return (
    <>
      <ActingAs />
      <div className="mb-6 flex flex-wrap gap-2">
        {[null, "Business", "Individual investor", "Institution"].map((t) => (
          <FilterChip key={t ?? "all"} selected={type === t} onClick={() => setType(t)}>
            {t ?? "All accounts"}
          </FilterChip>
        ))}
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-xs tracking-[0.08em] text-ink-500 uppercase">
              <th className="px-7 py-4 font-semibold">Account</th>
              <th className="px-4 py-4 font-semibold">Activity</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-7 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((a) => {
              const restricted = ws.restricted.includes(a.name);
              return (
                <tr key={a.name} className="align-top">
                  <td className="px-7 py-4">
                    <p className="font-semibold text-ink-900">{a.name}</p>
                    <p className="text-xs text-ink-500">
                      {a.type} · joined {day(a.joined)}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-ink-700">{activity(a.name, a.type)}</td>
                  <td className="px-4 py-4">
                    <StatusPill tone={restricted ? "bad" : "good"}>{restricted ? "Restricted" : "Active"}</StatusPill>
                  </td>
                  <td className="px-7 py-4">
                    <div className="flex min-w-72 gap-2">
                      <input
                        aria-label={`Reason for ${a.name}`}
                        value={reasons[a.name] ?? ""}
                        onChange={(e) => setReasons((r) => ({ ...r, [a.name]: e.target.value }))}
                        placeholder={restricted ? "Why reopen?" : "Why restrict?"}
                        className="min-w-0 flex-1 rounded-lg bg-white px-3 py-2 text-xs ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none"
                      />
                      <Button variant={restricted ? "tonal" : "outlined"} onClick={() => setResults((r) => ({ ...r, [a.name]: setRestricted(a.name, !restricted, reasons[a.name] ?? "") }))}>
                        {restricted ? "Reopen" : "Restrict"}
                      </Button>
                    </div>
                    {results[a.name] && <p className={`mt-2 text-xs font-semibold ${results[a.name].ok ? "text-success-600" : "text-danger-600"}`}>{results[a.name].message}</p>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ── Ledger ─────────────────────────────────────────────── */

export function LedgerView() {
  const ws = useWorkspace();
  const balances: Record<string, number> = {};
  ws.ledger.forEach((e) => e.lines.forEach((l) => (balances[l.account] = (balances[l.account] ?? 0) + l.debit - l.credit)));
  const debits = ws.ledger.reduce((t, e) => t + e.lines.reduce((s, l) => s + l.debit, 0), 0);
  const credits = ws.ledger.reduce((t, e) => t + e.lines.reduce((s, l) => s + l.credit, 0), 0);
  const balanced = Math.abs(debits - credits) < 0.005;
  const exportCsv = () => {
    const rows = [["Date", "Reference", "Memo", "Account", "Debit", "Credit"], ...ws.ledger.flatMap((e) => e.lines.map((l) => [e.at.slice(0, 10), e.ref, e.memo, l.account, l.debit, l.credit]))];
    const text = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: "serwaa-ledger.csv" }).click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-ink-50 p-6">
          <p className="text-sm text-ink-600">Total debits</p>
          <p className="mt-2 font-mono text-2xl">{cedis(debits, true)}</p>
        </div>
        <div className="rounded-2xl bg-ink-50 p-6">
          <p className="text-sm text-ink-600">Total credits</p>
          <p className="mt-2 font-mono text-2xl">{cedis(credits, true)}</p>
        </div>
        <div className={`rounded-2xl p-6 ${balanced ? "bg-success-50" : "bg-danger-50"}`}>
          <p className="text-sm text-ink-600">Books</p>
          <p className={`mt-2 text-2xl font-bold ${balanced ? "text-success-600" : "text-danger-600"}`}>{balanced ? "Balanced" : "Out of balance"}</p>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <Card className="p-7">
          <Label>Account balances</Label>
          <ul className="mt-4 divide-y divide-ink-100">
            {Object.keys(balances).length === 0 && <li className="py-4 text-sm text-ink-600">Balances appear once payments are confirmed.</li>}
            {Object.entries(balances).map(([acct, bal]) => (
              <li key={acct} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-ink-800">{acct}</span>
                <span className="font-mono tabular-nums">
                  {bal < 0 ? "(" : ""}
                  {cedis(Math.abs(bal), true)}
                  {bal < 0 ? ")" : ""}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-500">Debit balances are positive; credit balances are shown in brackets.</p>
        </Card>
        <Card className="overflow-x-auto p-0">
          <div className="flex items-center justify-between gap-3 px-7 pt-6">
            <Label>Bookings</Label>
            <Button variant="text" onClick={exportCsv} disabled={!ws.ledger.length}>
              <Download aria-hidden="true" />
              Export
            </Button>
          </div>
          {ws.ledger.length === 0 && <p className="px-7 py-8 text-sm text-ink-600">Every confirmed payment, payout and reinvestment is booked here as a balanced entry.</p>}
          <ul className="divide-y divide-ink-100">
            {ws.ledger.map((e) => (
              <li key={e.id} className="px-7 py-5">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-semibold text-ink-900">{e.memo}</p>
                  <p className="font-mono text-xs text-ink-500">
                    {e.ref} · {day(e.at)}
                  </p>
                </div>
                <table className="mt-3 w-full min-w-[480px] text-sm">
                  <tbody>
                    {e.lines.map((l, i) => (
                      <tr key={i}>
                        <td className={`py-1 ${l.credit ? "pl-8" : ""} text-ink-700`}>{l.account}</td>
                        <td className="w-32 py-1 text-right font-mono tabular-nums">{l.debit ? cedis(l.debit, true) : ""}</td>
                        <td className="w-32 py-1 text-right font-mono tabular-nums">{l.credit ? cedis(l.credit, true) : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
