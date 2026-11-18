"use client";

import { Download, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { DashboardBand, hello } from "./dashboard-band";
import { InvestPanel } from "./invest-panel";
import { ActionResult } from "./notifications";
import { Button, ButtonLink, Card, FilterChip, FundingBar, Label, StatusPill } from "./ui";
import { cedis, percent } from "@/lib/format";
import {
  inviteMember,
  isOpen,
  removeMember,
  requestAllocation,
  setMemberRole,
  updateMandate,
  useWorkspace,
  type Campaign,
  type Result,
  type State,
  type TeamMember,
} from "@/lib/store";

const field = "mt-1.5 w-full rounded-xl bg-white px-3.5 py-3 text-sm ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none";
const fits = (c: Campaign, ws: State) => isOpen(c) && ws.institution.mandate.sectors.includes(c.sector) && c.tenorMonths <= ws.institution.mandate.maxTenor;
const mine = (ws: State) => ws.investments.filter((i) => i.investor === "institution");

function csv(name: string, rows: (string | number)[][]) {
  const text = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
  Object.assign(document.createElement("a"), { href: url, download: name }).click();
  URL.revokeObjectURL(url);
}

export function InstitutionOverview() {
  const ws = useWorkspace();
  const inv = mine(ws);
  const deployed = inv.filter((i) => i.status === "Cleared").reduce((t, i) => t + i.amount, 0);
  const inFlight = inv.filter((i) => i.status !== "Cleared").reduce((t, i) => t + i.amount, 0);
  const agreed = ws.institution.allocations.filter((a) => a.status === "Agreed").reduce((t, a) => t + a.amount, 0);
  const pipeline = ws.campaigns.filter((c) => fits(c, ws));
  return (
    <div className="space-y-10">
      <DashboardBand
        eyebrow={`${ws.institution.name} · corporate account`}
        greeting={hello(ws.me?.name)}
        figureLabel="Deployed through Serwaa"
        figure={cedis(deployed)}
        figureState="cleared"
        action={<ButtonLink href="/institution/pipeline" variant="accent">Review pipeline</ButtonLink>}
        stats={[
          { label: "Deals in your mandate", value: String(pipeline.length) },
          { label: "Allocations agreed", value: cedis(agreed), hint: "Ready to pay" },
          { label: "Payments in flight", value: cedis(inFlight), state: "pending" },
          { label: "Team", value: String(ws.institution.team.length), hint: "People with access" },
        ]}
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-7">
          <Label>Your allocations</Label>
          {ws.institution.allocations.length === 0 ? (
            <p className="mt-3 text-ink-600">You haven&apos;t requested any allocations yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink-100">
              {ws.institution.allocations.map((a) => {
                const c = ws.campaigns.find((x) => x.id === a.campaignId);
                return (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-4">
                    <div>
                      <p className="font-semibold text-ink-900">{c?.business}</p>
                      <p className="font-mono text-xs text-ink-500">{cedis(a.amount)}</p>
                    </div>
                    <StatusPill tone={a.status === "Paid" ? "good" : a.status === "Agreed" ? "brand" : "warn"}>{a.status}</StatusPill>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <Card className="p-7">
          <Label>Your mandate</Label>
          <dl className="mt-4 grid grid-cols-2 gap-5">
            <div>
              <dt className="text-xs text-ink-500">Ticket size</dt>
              <dd className="mt-1 font-mono text-sm">
                {cedis(ws.institution.mandate.minTicket)} – {cedis(ws.institution.mandate.maxTicket)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-500">Longest term</dt>
              <dd className="mt-1 font-mono text-sm">{ws.institution.mandate.maxTenor} months</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-ink-500">Sectors</dt>
              <dd className="mt-1 text-sm font-semibold text-ink-800">{ws.institution.mandate.sectors.join(", ")}</dd>
            </div>
          </dl>
          <ButtonLink href="/institution/mandate" variant="text" className="mt-4 -ml-3">
            Edit mandate
          </ButtonLink>
        </Card>
      </div>
    </div>
  );
}

function DealRow({ c }: { c: Campaign }) {
  const ws = useWorkspace();
  const alloc = ws.institution.allocations.find((a) => a.campaignId === c.id);
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  return (
    <Card className="p-7">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Label>
              {c.sector} · {c.product}
            </Label>
            <StatusPill tone={c.risk === "Lower" ? "good" : c.risk === "Moderate" ? "warn" : "bad"}>{c.risk} risk</StatusPill>
          </div>
          <h2 className="mt-2 text-xl font-bold text-aubergine-800">{c.business}</h2>
          <p className="mt-2 text-ink-600">{c.purpose}</p>
          <div className="mt-5">
            <FundingBar target={c.target} cleared={c.cleared} pending={c.pending} />
            <p className="mt-2 text-sm text-ink-600">
              {cedis(c.cleared)} of {cedis(c.target)} raised ({percent(c.cleared, c.target)}%) · {c.expectedReturn}% a year · {c.tenorMonths} months ·{" "}
              {c.security}
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-aubergine-800 p-6 text-white">
          {!alloc || alloc.status === "Requested" ? (
            <>
              <p className="text-xs font-semibold tracking-[0.08em] text-saffron-300 uppercase">{alloc ? "Allocation requested" : "Request an allocation"}</p>
              {alloc ? (
                <p className="mt-3 text-sm leading-6 text-aubergine-100">
                  {cedis(alloc.amount)} requested. Our partnerships team will confirm it, usually within a working day.
                </p>
              ) : (
                <>
                  <label className="mt-3 block text-sm font-semibold">
                    Amount (GH₵)
                    <input
                      className="mt-1.5 w-full rounded-xl bg-white px-3.5 py-3 font-mono text-sm text-ink-900 focus:ring-2 focus:ring-saffron-400 focus:outline-none"
                      inputMode="numeric"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={ws.institution.mandate.minTicket.toLocaleString()}
                    />
                  </label>
                  <Button variant="accent" className="mt-4 w-full" onClick={() => requestAllocation(c.id, Number(amount.replace(/[^\d.]/g, ""))).then(setResult)}>
                    Request allocation
                  </Button>
                  {result && <p className="mt-3 text-sm font-semibold text-saffron-200">{result.message}</p>}
                </>
              )}
            </>
          ) : alloc.status === "Agreed" ? (
            <>
              <p className="mb-4 text-xs font-semibold tracking-[0.08em] text-saffron-300 uppercase">Allocation agreed · {cedis(alloc.amount)}</p>
              <InvestPanel c={c} investor="institution" afterHref="/institution/portfolio" />
            </>
          ) : (
            <p className="text-sm font-semibold text-saffron-200">Paid. See it in your portfolio.</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export function InstitutionPipeline() {
  const ws = useWorkspace();
  const deals = ws.campaigns.filter((c) => fits(c, ws));
  const others = ws.campaigns.filter((c) => isOpen(c) && !fits(c, ws)).length;
  return (
    <div className="space-y-8">
      {deals.length === 0 && <p className="rounded-2xl bg-ink-50 p-12 text-center text-ink-600">No live deals fit your mandate right now. We&apos;ll notify you when one does.</p>}
      {deals.map((c) => (
        <DealRow key={c.id} c={c} />
      ))}
      {others > 0 && (
        <p className="text-sm text-ink-500">
          {others} other live deal{others === 1 ? "" : "s"} sit outside your mandate.{" "}
          <ButtonLink href="/institution/mandate" variant="text">
            Adjust mandate
          </ButtonLink>
        </p>
      )}
    </div>
  );
}

export function InstitutionPortfolio() {
  const ws = useWorkspace();
  const inv = mine(ws);
  return (
    <Card className="overflow-x-auto p-0">
      <div className="flex items-center justify-between gap-3 px-7 pt-6">
        <Label>Investments</Label>
        <Button
          variant="text"
          onClick={() =>
            csv("gyata-serwaa-report.csv", [
              ["Deal", "Business", "Sector", "Amount", "Method", "Reference", "Status", "Date"],
              ...inv.map((i) => {
                const c = ws.campaigns.find((x) => x.id === i.campaignId);
                return [c?.ref ?? "", c?.business ?? "", c?.sector ?? "", i.amount, i.method, i.payRef, i.status, i.at.slice(0, 10)];
              }),
            ])
          }
        >
          <Download aria-hidden="true" />
          Export report
        </Button>
      </div>
      <table className="mt-3 w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-left text-xs tracking-[0.08em] text-ink-500 uppercase">
            <th className="px-7 py-3 font-semibold">Deal</th>
            <th className="px-4 py-3 text-right font-semibold">Amount</th>
            <th className="px-4 py-3 font-semibold">Paid by</th>
            <th className="px-7 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {inv.length === 0 && (
            <tr>
              <td colSpan={4} className="px-7 py-10 text-center text-ink-600">
                Nothing yet. Agreed allocations you pay for will appear here.
              </td>
            </tr>
          )}
          {inv.map((i) => {
            const c = ws.campaigns.find((x) => x.id === i.campaignId);
            return (
              <tr key={i.id}>
                <td className="px-7 py-4">
                  <p className="font-semibold text-ink-900">{c?.business}</p>
                  <p className="font-mono text-xs text-ink-500">{c?.ref}</p>
                </td>
                <td className="px-4 py-4 text-right font-mono tabular-nums">{cedis(i.amount)}</td>
                <td className="px-4 py-4 text-ink-700">
                  {i.method} · <span className="font-mono text-xs">{i.payRef}</span>
                </td>
                <td className="px-7 py-4">
                  <StatusPill tone={i.status === "Cleared" ? "good" : "warn"}>{i.status}</StatusPill>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

const teamRoles: TeamMember["role"][] = ["Administrator", "Investment manager", "Analyst (view only)"];
const roleHelp: Record<TeamMember["role"], string> = {
  Administrator: "Everything, including team and mandate",
  "Investment manager": "Request allocations and pay",
  "Analyst (view only)": "See deals and reports",
};

export function InstitutionTeam() {
  const ws = useWorkspace();
  const [m, setM] = useState<TeamMember>({ name: "", email: "", role: "Analyst (view only)" });
  const [result, setResult] = useState<Result | null>(null);
  return (
    <div className="space-y-8">
      <Card className="p-0">
        <ul className="divide-y divide-ink-100">
          {ws.institution.team.map((t) => (
            <li key={t.email} className="flex flex-wrap items-center gap-4 px-7 py-5">
              <span className="flex size-10 items-center justify-center rounded-full bg-aubergine-100 text-sm font-bold text-aubergine-800">
                {t.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink-900">{t.name}</p>
                <p className="text-sm text-ink-500">{t.email}</p>
              </div>
              <select
                aria-label={`Role for ${t.name}`}
                value={t.role}
                onChange={(e) => setMemberRole(t.email, e.target.value as TeamMember["role"])}
                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none"
              >
                {teamRoles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <button type="button" aria-label={`Remove ${t.name}`} onClick={() => removeMember(t.email).then(setResult)} className="state-layer flex size-10 items-center justify-center rounded-full text-ink-400 hover:text-danger-600">
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-7">
        <Label>Invite a colleague</Label>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_14rem_auto] md:items-end">
          <label className="block text-sm font-semibold text-ink-800">
            Name
            <input className={field} value={m.name} onChange={(e) => setM({ ...m, name: e.target.value })} placeholder="Kofi Mensah" />
          </label>
          <label className="block text-sm font-semibold text-ink-800">
            Work email
            <input className={field} type="email" value={m.email} onChange={(e) => setM({ ...m, email: e.target.value })} placeholder="kofi@gyatacapital.com" />
          </label>
          <label className="block text-sm font-semibold text-ink-800">
            Role
            <select className={field} value={m.role} onChange={(e) => setM({ ...m, role: e.target.value as TeamMember["role"] })}>
              {teamRoles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <Button
            onClick={async () => {
              const r = await inviteMember(m);
              setResult(r);
              if (r.ok) setM({ name: "", email: "", role: "Analyst (view only)" });
            }}
          >
            <UserPlus aria-hidden="true" />
            Invite
          </Button>
        </div>
        <p className="mt-3 text-sm text-ink-500">{roleHelp[m.role]}.</p>
        <ActionResult result={result} />
      </Card>
    </div>
  );
}

const sectors = ["Trade and distribution", "Manufacturing", "Construction", "Services", "Healthcare", "Logistics", "Energy", "Agriculture and agro-processing"];

export function MandateEditor() {
  const ws = useWorkspace();
  const [m, setM] = useState(ws.institution.mandate);
  const [result, setResult] = useState<Result | null>(null);
  return (
    <Card className="p-7 sm:p-9">
      <div className="grid gap-6 md:grid-cols-3">
        <label className="block text-sm font-semibold text-ink-800">
          Smallest ticket (GH₵)
          <input className={`${field} font-mono`} inputMode="numeric" value={m.minTicket} onChange={(e) => setM({ ...m, minTicket: Number(e.target.value.replace(/\D/g, "")) })} />
        </label>
        <label className="block text-sm font-semibold text-ink-800">
          Largest ticket (GH₵)
          <input className={`${field} font-mono`} inputMode="numeric" value={m.maxTicket} onChange={(e) => setM({ ...m, maxTicket: Number(e.target.value.replace(/\D/g, "")) })} />
        </label>
        <label className="block text-sm font-semibold text-ink-800">
          Longest term
          <select className={field} value={m.maxTenor} onChange={(e) => setM({ ...m, maxTenor: Number(e.target.value) })}>
            {[3, 6, 12, 24, 36].map((n) => (
              <option key={n} value={n}>
                {n} months
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-ink-800">Sectors</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {sectors.map((s) => (
            <FilterChip key={s} selected={m.sectors.includes(s)} onClick={() => setM({ ...m, sectors: m.sectors.includes(s) ? m.sectors.filter((x) => x !== s) : [...m.sectors, s] })}>
              {s}
            </FilterChip>
          ))}
        </div>
      </fieldset>
      <Button className="mt-8" onClick={() => updateMandate(m).then(setResult)}>
        Save mandate
      </Button>
      <ActionResult result={result} />
    </Card>
  );
}
