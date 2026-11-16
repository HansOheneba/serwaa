"use client";

// The working data for all three portals. Actions taken in one portal (a business
// submits, staff approve, an investor registers interest) are visible in the others.
// Persisted in this browser and synced live between open tabs, until the platform API
// is connected; every action below maps one-to-one onto a future API call.

import { useSyncExternalStore } from "react";
import { applicationStages, businessApplication, campaignStages, opportunities, opsCampaigns, opsQueue, reconciliation } from "./data";

export type Audience = "business" | "investor" | "ops";
export type AppStatus = "In review" | "Information requested" | "Approved" | "Rejected" | "Returned for changes";

export type Application = {
  ref: string;
  business: string;
  industry: string;
  product: string;
  amount: number;
  purpose: string;
  submittedAt: string;
  stageIndex: number;
  status: AppStatus;
  officer: string;
  originator: string;
};

export type InfoRequest = {
  id: string;
  appRef: string;
  title: string;
  due: string;
  status: "Open" | "Responded" | "Accepted";
  files: string[];
  reply?: string;
  createdBy: string;
  createdAt: string;
};

export type Campaign = {
  id: string;
  ref: string;
  appRef?: string;
  business: string;
  sector: string;
  product: string;
  purpose: string;
  target: number;
  cleared: number;
  pending: number;
  minTicket: number;
  tenorMonths: number;
  expectedReturn: number;
  frequency: string;
  security: string;
  risk: "Lower" | "Moderate" | "Higher";
  closesInDays: number;
  investors: number;
  stageIndex: number;
  drafter: string;
  approvals: { stage: string; by: string; at: string }[];
};

export type Interest = { id: string; campaignId: string; amount: number; at: string };
export type Note = { id: string; audience: Audience; title: string; body: string; href?: string; at: string; read: boolean };
export type AuditEntry = { id: string; subject: string; actor: string; role: string; action: string; reason?: string; at: string };
export type ScheduleLine = { due: string; amount: number; principal: number; interest: number; status: "Paid" | "Pending" | "Due" | "Upcoming" };
export type Facility = { ref: string; product: string; principal: number; disbursedAt: string; autopay: boolean; payoutNumber: string; schedule: ScheduleLine[] };
export type Payment = {
  ref: string;
  from: string;
  kind: "Investment" | "Repayment";
  subject: string;
  method: string;
  expected: number;
  received: number;
  status: "Awaiting authorisation" | "Pending" | "Matched" | "Underpayment" | "Duplicate";
  at: string;
  lines?: number[];
};
export type Prefs = { maxTenor: number; securedOnly: boolean; sectors: string[]; monthlyIncome: boolean; maxPerBusiness: number };

export const staff = [
  { name: "A. Mensah", role: "Credit analyst" },
  { name: "K. Boateng", role: "Credit risk manager" },
  { name: "E. Owusu", role: "KYC and compliance officer" },
  { name: "S. Asante", role: "Structuring officer" },
  { name: "Y. Darko", role: "Investment committee member" },
] as const;
export const approverRoles = ["Credit risk manager", "Investment committee member"];

export type State = {
  version: number;
  applications: Application[];
  requests: InfoRequest[];
  campaigns: Campaign[];
  interests: Interest[];
  watchlist: string[];
  notes: Note[];
  audit: AuditEntry[];
  actingStaff: string;
  prefs: Prefs;
  alertsOn: boolean;
  facility: Facility;
  payments: Payment[];
  payout: { method: string; number: string; reinvest: boolean };
};

const VERSION = 2;
const KEY = "serwaa-workspace-v1";
const today = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);

function seed(): State {
  const stageOf = (name: string) => Math.max(0, applicationStages.indexOf(name));
  const applications: Application[] = opsQueue.map((q) => ({
    ref: q.ref,
    business: q.business,
    industry: q.industry,
    product: q.ref === businessApplication.ref ? businessApplication.product : q.industry === "Energy" ? "Purchase order financing" : "Working capital financing",
    amount: q.amount,
    purpose: q.ref === businessApplication.ref ? "Advance against an invoice to a national supermarket chain." : "Working capital for confirmed orders.",
    submittedAt: "2026-11-02T09:00:00.000Z",
    stageIndex: stageOf(q.stage),
    status: q.outstanding > 0 && q.ref === businessApplication.ref ? "Information requested" : "In review",
    officer: q.officer,
    originator: q.ref === "SRW-APP-2026-00421" ? "K. Boateng" : "Business",
  }));
  const requests: InfoRequest[] = businessApplication.requests.map((r) => ({
    id: uid(),
    appRef: businessApplication.ref,
    title: r.title,
    due: "2026-11-20",
    status: "Open",
    files: [],
    createdBy: "A. Mensah",
    createdAt: "2026-11-12T10:00:00.000Z",
  }));
  const fromOpp = opportunities.map((o, i) => ({ ...o, stageIndex: 8, drafter: "S. Asante", approvals: [], appRef: undefined, ref: o.ref, id: o.id, i }));
  const campaigns: Campaign[] = [
    ...fromOpp.map(({ match, matched, unmatched, i, ...c }) => {
      void match;
      void matched;
      void unmatched;
      void i;
      return c;
    }),
    ...opsCampaigns
      .filter((c) => !opportunities.some((o) => o.ref === c.ref))
      .map((c) => ({
        id: c.ref.toLowerCase(),
        ref: c.ref,
        business: c.business,
        sector: "Construction",
        product: "Contract financing",
        purpose: "Materials for a signed school construction contract.",
        target: c.target,
        cleared: c.cleared,
        pending: c.pending,
        minTicket: 100,
        tenorMonths: 6,
        expectedReturn: 16,
        frequency: "Monthly interest, principal at maturity",
        security: "Assigned contract receivables",
        risk: "Moderate" as const,
        closesInDays: 30,
        investors: 0,
        stageIndex: c.stageIndex,
        drafter: "S. Asante",
        approvals: [],
      })),
  ];
  return {
    version: VERSION,
    applications,
    requests,
    campaigns,
    interests: [],
    watchlist: [],
    notes: [
      { id: uid(), audience: "business", title: "Bank statements needed", body: "Upload August to October 2026 statements by 20 Nov.", href: "/business/applications", at: "2026-11-12T10:00:00.000Z", read: false },
      { id: uid(), audience: "investor", title: "Repayment received", body: "GH₵ 2,706.25 from Asaase Textiles Ltd.", href: "/invest", at: "2026-11-10T08:00:00.000Z", read: false },
      { id: uid(), audience: "ops", title: "Response overdue soon", body: "Abrewa Trading Ltd has a request due 20 Nov.", href: "/ops/applications/SRW-APP-2026-00418", at: "2026-11-14T08:00:00.000Z", read: false },
    ],
    audit: [],
    actingStaff: "A. Mensah",
    prefs: { maxTenor: 6, securedOnly: true, sectors: ["Trade and distribution", "Manufacturing", "Logistics"], monthlyIncome: true, maxPerBusiness: 30 },
    alertsOn: true,
    facility: {
      ref: "SRW-FAC-0031",
      product: "Contract financing",
      principal: 120_000,
      disbursedAt: "2026-08-01",
      autopay: false,
      payoutNumber: "",
      schedule: ["2026-09-01", "2026-10-01", "2026-11-01", "2026-12-01", "2027-01-02", "2027-02-01"].map((due, i) => ({
        due,
        amount: 21_800,
        principal: 20_000,
        interest: 1_800,
        status: i < 3 ? ("Paid" as const) : i === 3 ? ("Due" as const) : ("Upcoming" as const),
      })),
    },
    payments: reconciliation.map((r) => ({
      ref: r.ref,
      from: r.investor,
      kind: "Investment" as const,
      subject: r.campaign,
      method: r.method,
      expected: r.expected,
      received: r.received,
      status: r.status as Payment["status"],
      at: "2026-11-14T09:00:00.000Z",
    })),
    payout: { method: "MTN MoMo", number: "", reinvest: false },
  };
}

/* ── tiny external store ─────────────────────────────────────── */

let state: State | null = null;
const listeners = new Set<() => void>();
const serverState = seed();

function load(): State {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as State) : null;
    state = parsed && parsed.version === VERSION ? parsed : seed();
  } catch {
    state = seed();
  }
  return state;
}

function commit(next: State) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: changes last for this session */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    try {
      state = e.newValue ? (JSON.parse(e.newValue) as State) : seed();
    } catch {
      state = seed();
    }
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useWorkspace(): State {
  return useSyncExternalStore(subscribe, load, () => serverState);
}

function update(fn: (s: State) => State) {
  commit(fn(load()));
}

/* ── helpers ─────────────────────────────────────────────────── */

const actor = (s: State) => staff.find((x) => x.name === s.actingStaff) ?? staff[0];
const note = (audience: Audience, title: string, body: string, href?: string): Note => ({ id: uid(), audience, title, body, href, at: today(), read: false });
const log = (s: State, subject: string, action: string, reason?: string, who?: { name: string; role: string }): AuditEntry => {
  const a = who ?? actor(s);
  return { id: uid(), subject, actor: a.name, role: a.role, action, reason, at: today() };
};

export type Result = { ok: true; message: string } | { ok: false; message: string };

/* ── business actions ────────────────────────────────────────── */

export function submitApplication(input: { product: string; amount: number; purpose: string }): string {
  const s = load();
  const n = 440 + s.applications.length;
  const ref = `SRW-APP-2026-00${n}`;
  const app: Application = {
    ref,
    business: "Abrewa Trading Ltd",
    industry: "Trade and distribution",
    product: input.product,
    amount: input.amount,
    purpose: input.purpose,
    submittedAt: today(),
    stageIndex: 0,
    status: "In review",
    officer: "Unassigned",
    originator: "Business",
  };
  update((st) => ({
    ...st,
    applications: [app, ...st.applications],
    notes: [
      note("business", "Application received", `${ref} · ${input.product}. We'll be in touch if we need anything.`, `/business/applications?ref=${ref}`),
      note("ops", "New application", `Abrewa Trading Ltd · ${input.product}`, `/ops/applications/${ref}`),
      ...st.notes,
    ],
    audit: [log(st, ref, "Application submitted", undefined, { name: "Abrewa Trading Ltd", role: "Business" }), ...st.audit],
  }));
  return ref;
}

export function respondToRequest(id: string, files: string[], reply: string) {
  update((s) => {
    const r = s.requests.find((x) => x.id === id);
    if (!r) return s;
    return {
      ...s,
      requests: s.requests.map((x) => (x.id === id ? { ...x, status: "Responded", files, reply } : x)),
      notes: [note("ops", "Response received", `${r.appRef}: ${r.title}`, `/ops/applications/${r.appRef}`), ...s.notes],
      audit: [log(s, r.appRef, `Responded to "${r.title}"`, files.join(", "), { name: "Abrewa Trading Ltd", role: "Business" }), ...s.audit],
    };
  });
}

/** Pay the next instalment, or settle everything left (early repayment). Goes to staff to confirm. */
export function payFacility(mode: "next" | "all", method: string, number: string): Result {
  const s = load();
  if (method !== "Bank transfer" && number.replace(/\D/g, "").length < 9) return { ok: false, message: "Enter the Mobile Money number to charge." };
  const open = s.facility.schedule.map((l, i) => ({ l, i })).filter(({ l }) => l.status === "Due" || l.status === "Upcoming");
  if (!open.length) return { ok: false, message: "Nothing left to pay." };
  const lines = mode === "next" ? [open[0].i] : open.map((o) => o.i);
  const amount = mode === "next" ? open[0].l.amount : earlyPayoff(s.facility).total;
  const ref = `PAY-${90000 + s.payments.length}`;
  update((st) => ({
    ...st,
    facility: { ...st.facility, schedule: st.facility.schedule.map((l, i) => (lines.includes(i) ? { ...l, status: "Pending" } : l)) },
    payments: [{ ref, from: "Abrewa Trading Ltd", kind: "Repayment", subject: st.facility.ref, method, expected: amount, received: amount, status: "Pending", at: today(), lines }, ...st.payments],
    notes: [
      note("business", "Payment on its way", `GH₵ ${amount.toLocaleString()} via ${method}. We'll confirm when it arrives.`, "/business/facilities"),
      note("ops", "Repayment to confirm", `${ref} · GH₵ ${amount.toLocaleString()} from Abrewa Trading Ltd`, "/ops/reconciliation"),
      ...st.notes,
    ],
  }));
  return { ok: true, message: method === "Bank transfer" ? `Use reference ${ref} on your transfer.` : "Approve the prompt on your phone to complete the payment." };
}

export function earlyPayoff(f: Facility) {
  const open = f.schedule.filter((l) => l.status === "Due" || l.status === "Upcoming");
  const principal = open.reduce((t, l) => t + l.principal, 0);
  const interestNow = open.length ? open[0].interest : 0;
  const saved = open.slice(1).reduce((t, l) => t + l.interest, 0);
  return { principal, interestNow, saved, total: principal + interestNow };
}

export function setAutopay(on: boolean, number: string): Result {
  if (on && number.replace(/\D/g, "").length < 9) return { ok: false, message: "Enter the Mobile Money number to debit." };
  update((s) => ({ ...s, facility: { ...s.facility, autopay: on, payoutNumber: number } }));
  return { ok: true, message: on ? "Automatic repayments are on." : "Automatic repayments are off." };
}

/* ── investor actions ────────────────────────────────────────── */

export function setPayout(payout: { method: string; number: string; reinvest: boolean }): Result {
  if (payout.method !== "Bank account" && payout.number.replace(/\D/g, "").length < 9) return { ok: false, message: "Enter a full Mobile Money number." };
  update((s) => ({ ...s, payout }));
  return { ok: true, message: "Payout settings saved." };
}

export function registerInterest(campaignId: string, amount: number): Result {
  const s = load();
  const c = s.campaigns.find((x) => x.id === campaignId);
  if (!c) return { ok: false, message: "That opportunity is no longer available." };
  if (amount < c.minTicket) return { ok: false, message: `The minimum for this opportunity is GH₵ ${c.minTicket.toLocaleString()}.` };
  const remaining = c.target - c.cleared - c.pending;
  if (amount > remaining) return { ok: false, message: `Only GH₵ ${remaining.toLocaleString()} is still available.` };
  update((st) => ({
    ...st,
    interests: [{ id: uid(), campaignId, amount, at: today() }, ...st.interests.filter((i) => i.campaignId !== campaignId)],
    notes: [
      note("investor", "Place reserved", `GH₵ ${amount.toLocaleString()} in ${c.business}. We'll tell you when payments open.`, `/invest/opportunities/${c.id}`),
      note("ops", "Interest registered", `GH₵ ${amount.toLocaleString()} for ${c.ref}`, "/ops/campaigns"),
      ...st.notes,
    ],
  }));
  return { ok: true, message: "Your place is reserved." };
}

export function withdrawInterest(campaignId: string) {
  update((s) => ({ ...s, interests: s.interests.filter((i) => i.campaignId !== campaignId) }));
}

export function toggleWatch(campaignId: string) {
  update((s) => ({ ...s, watchlist: s.watchlist.includes(campaignId) ? s.watchlist.filter((x) => x !== campaignId) : [...s.watchlist, campaignId] }));
}

export function updatePrefs(prefs: Prefs) {
  update((s) => ({ ...s, prefs }));
}

export function setAlerts(on: boolean) {
  update((s) => ({ ...s, alertsOn: on }));
}

/* ── operations actions (each one checks who is allowed) ─────── */

export function setActingStaff(name: string) {
  update((s) => ({ ...s, actingStaff: name }));
}

export function assignOfficer(ref: string, officer: string) {
  update((s) => ({
    ...s,
    applications: s.applications.map((a) => (a.ref === ref ? { ...a, officer } : a)),
    audit: [log(s, ref, `Assigned to ${officer}`), ...s.audit],
  }));
}

export function requestInformation(ref: string, title: string, due: string): Result {
  if (!title.trim()) return { ok: false, message: "Say what you need from the business." };
  update((s) => ({
    ...s,
    requests: [{ id: uid(), appRef: ref, title: title.trim(), due, status: "Open", files: [], createdBy: s.actingStaff, createdAt: today() }, ...s.requests],
    applications: s.applications.map((a) => (a.ref === ref ? { ...a, status: "Information requested" } : a)),
    notes: [note("business", "We need something from you", `${title.trim()} · due ${due}`, `/business/applications?ref=${ref}`), ...s.notes],
    audit: [log(s, ref, "Requested information", title.trim()), ...s.audit],
  }));
  return { ok: true, message: "Request sent to the business." };
}

export function acceptResponse(id: string) {
  update((s) => {
    const r = s.requests.find((x) => x.id === id);
    if (!r) return s;
    const requests = s.requests.map((x) => (x.id === id ? { ...x, status: "Accepted" as const } : x));
    const stillOpen = requests.some((x) => x.appRef === r.appRef && x.status !== "Accepted");
    return {
      ...s,
      requests,
      applications: s.applications.map((a) => (a.ref === r.appRef && !stillOpen ? { ...a, status: "In review" } : a)),
      audit: [log(s, r.appRef, `Accepted response to "${r.title}"`), ...s.audit],
    };
  });
}

export function advanceStage(ref: string): Result {
  const s = load();
  const a = s.applications.find((x) => x.ref === ref);
  if (!a) return { ok: false, message: "Application not found." };
  if (a.status === "Information requested") return { ok: false, message: "Wait for the business to answer the open request first." };
  const finalIndex = applicationStages.length - 1;
  if (a.stageIndex >= finalIndex - 1) return { ok: false, message: "This application is ready for a credit decision." };
  const next = applicationStages[a.stageIndex + 1];
  update((st) => ({
    ...st,
    applications: st.applications.map((x) => (x.ref === ref ? { ...x, stageIndex: x.stageIndex + 1 } : x)),
    audit: [log(st, ref, `Moved to ${next}`), ...st.audit],
  }));
  return { ok: true, message: `Moved to ${next}.` };
}

export function decide(ref: string, decision: "approve" | "reject" | "return", reason: string): Result {
  const s = load();
  const a = s.applications.find((x) => x.ref === ref);
  const me = actor(s);
  if (!a) return { ok: false, message: "Application not found." };
  if (!reason.trim()) return { ok: false, message: "Give a reason. It goes on the record." };
  if (decision === "approve") {
    if (!approverRoles.includes(me.role)) return { ok: false, message: `A ${me.role.toLowerCase()} can't approve credit. Switch to a credit risk manager or committee member.` };
    if (a.originator === me.name) return { ok: false, message: "You brought this application in, so someone else has to approve it." };
    if (a.status === "Information requested") return { ok: false, message: "There's an open information request on this application." };
  }
  const status: AppStatus = decision === "approve" ? "Approved" : decision === "reject" ? "Rejected" : "Returned for changes";
  update((st) => {
    const campaigns = [...st.campaigns];
    if (decision === "approve" && !campaigns.some((c) => c.appRef === ref)) {
      campaigns.unshift({
        id: ref.toLowerCase(),
        ref: `SRW-CMP-00${50 + campaigns.length}`,
        appRef: ref,
        business: a.business,
        sector: a.industry,
        product: a.product,
        purpose: a.purpose,
        target: a.amount,
        cleared: 0,
        pending: 0,
        minTicket: 100,
        tenorMonths: a.product === "Invoice financing" ? 3 : 6,
        expectedReturn: a.product === "Invoice financing" ? 15 : 17.5,
        frequency: a.product === "Invoice financing" ? "At maturity" : "Monthly interest, principal at maturity",
        security: a.product === "Invoice financing" ? "Assigned receivable" : "Director guarantee",
        risk: "Moderate",
        closesInDays: 30,
        investors: 0,
        stageIndex: 1,
        drafter: "S. Asante",
        approvals: [],
      });
    }
    return {
      ...st,
      campaigns,
      applications: st.applications.map((x) =>
        x.ref === ref ? { ...x, status, stageIndex: decision === "approve" ? applicationStages.length - 1 : x.stageIndex } : x,
      ),
      notes: [
        note(
          "business",
          decision === "approve" ? "Your application is approved" : decision === "reject" ? "Decision on your application" : "Your application needs changes",
          decision === "approve" ? "We're preparing your deal for investors." : reason.trim(),
          `/business/applications?ref=${ref}`,
        ),
        ...st.notes,
      ],
      audit: [log(st, ref, decision === "approve" ? "Approved credit" : decision === "reject" ? "Rejected" : "Returned for changes", reason.trim()), ...st.audit],
    };
  });
  return { ok: true, message: decision === "approve" ? "Approved. A campaign draft has been created." : `Marked as ${status.toLowerCase()}.` };
}

export function approveCampaignStage(id: string): Result {
  const s = load();
  const c = s.campaigns.find((x) => x.id === id);
  const me = actor(s);
  if (!c) return { ok: false, message: "Campaign not found." };
  if (c.stageIndex >= campaignStages.length - 1) return { ok: false, message: "Already published." };
  if (me.name === c.drafter) return { ok: false, message: "You drafted this campaign, so a different person has to sign off each stage." };
  const last = c.approvals[c.approvals.length - 1];
  if (last && last.by === me.name) return { ok: false, message: "You signed off the previous stage. Someone else needs to approve this one." };
  const nextStage = campaignStages[c.stageIndex + 1];
  const publishing = c.stageIndex + 1 === campaignStages.length - 1;
  update((st) => ({
    ...st,
    campaigns: st.campaigns.map((x) =>
      x.id === id ? { ...x, stageIndex: x.stageIndex + 1, approvals: [...x.approvals, { stage: nextStage, by: me.name, at: today() }] } : x,
    ),
    notes: publishing
      ? [
          ...(st.alertsOn ? [note("investor", "New opportunity for you", `${c.business} · ${c.product}`, `/invest/opportunities/${c.id}`)] : []),
          note("business", "Your deal is live", "Investors can now back your deal.", "/business"),
          ...st.notes,
        ]
      : st.notes,
    audit: [log(st, c.ref, publishing ? "Published to investors" : `Signed off: ${nextStage}`), ...st.audit],
  }));
  return { ok: true, message: publishing ? "Published. Matching investors have been notified." : `Signed off: ${nextStage}.` };
}

export function matchPayment(ref: string, reason: string): Result {
  if (!reason.trim()) return { ok: false, message: "Give a reason for the match. It goes on the record." };
  const s = load();
  const pay = s.payments.find((p) => p.ref === ref);
  if (!pay) return { ok: false, message: "Payment not found." };
  update((st) => ({
    ...st,
    payments: st.payments.map((p) => (p.ref === ref ? { ...p, status: "Matched", received: p.expected } : p)),
    facility:
      pay.kind === "Repayment" && pay.lines
        ? { ...st.facility, schedule: st.facility.schedule.map((l, i) => (pay.lines!.includes(i) ? { ...l, status: "Paid" } : l)) }
        : st.facility,
    notes:
      pay.kind === "Repayment"
        ? [
            note("business", "Payment received", `GH₵ ${pay.expected.toLocaleString()} confirmed. Thank you.`, "/business/facilities"),
            note("investor", "Repayment received", `Your share of a GH₵ ${pay.expected.toLocaleString()} repayment from ${pay.from}.`, "/invest"),
            ...st.notes,
          ]
        : st.notes,
    audit: [log(st, ref, "Payment matched", reason.trim()), ...st.audit],
  }));
  return { ok: true, message: "Matched." };
}

/* ── notifications ───────────────────────────────────────────── */

export function markAllRead(audience: Audience) {
  update((s) => ({ ...s, notes: s.notes.map((n) => (n.audience === audience ? { ...n, read: true } : n)) }));
}

export function resetWorkspace() {
  commit(seed());
}

/* ── derived ─────────────────────────────────────────────────── */

export function matchFor(c: Campaign, p: Prefs) {
  const matched: string[] = [];
  const unmatched: string[] = [];
  (c.tenorMonths <= p.maxTenor ? matched : unmatched).push(
    c.tenorMonths <= p.maxTenor ? `${c.tenorMonths}-month term, within your ${p.maxTenor}-month limit` : `${c.tenorMonths}-month term is longer than your ${p.maxTenor}-month limit`,
  );
  const secured = !/unsecured/i.test(c.security);
  if (p.securedOnly) (secured ? matched : unmatched).push(secured ? "Secured" : "Unsecured, and you prefer secured");
  (p.sectors.includes(c.sector) ? matched : unmatched).push(p.sectors.includes(c.sector) ? `${c.sector} is one of your sectors` : `${c.sector} isn't one of your sectors`);
  if (p.monthlyIncome) (/monthly/i.test(c.frequency) ? matched : unmatched).push(/monthly/i.test(c.frequency) ? "Pays you monthly" : "Pays at the end, not monthly");
  const score = Math.round(40 + (matched.length / (matched.length + unmatched.length)) * 58);
  return { score, matched, unmatched };
}

export const isLive = (c: Campaign) => c.stageIndex === campaignStages.length - 1;
