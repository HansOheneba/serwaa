"use client";

// The working data for all three portals. Actions taken in one portal (a business
// submits, staff approve, an investor registers interest) are visible in the others.
// Persisted in this browser and synced live between open tabs, until the platform API
// is connected; every action below maps one-to-one onto a future API call.

import { useSyncExternalStore } from "react";
import { applicationStages, businessApplication, campaignStages, opportunities, opsCampaigns, opsQueue, reconciliation } from "./data";

export type Audience = "business" | "investor" | "institution" | "ops";
export type Disclosure = "public" | "investors";
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
  disclosure: Disclosure;
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
  /** Whether the business's name is shown publicly or only to signed-in investors. */
  disclosure: Disclosure;
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
  status: "Awaiting authorisation" | "Pending" | "Confirmed" | "Matched" | "Underpayment" | "Duplicate";
  at: string;
  lines?: number[];
  investmentId?: string;
};
export type Investor = "individual" | "institution";
export type Investment = {
  id: string;
  investor: Investor;
  campaignId: string;
  amount: number;
  fee: number;
  method: string;
  payRef: string;
  status: "Awaiting authorisation" | "Pending" | "Confirmed" | "Cleared";
  at: string;
};
export type CashEvent = { id: string; kind: "Repayment" | "Withdrawal" | "Reinvestment"; amount: number; note: string; at: string };
export type Fees = { originationPct: number; servicingPct: number; momoPct: number; bankFlat: number; payoutMomoPct: number; payoutBankFlat: number };
export type LedgerLine = { account: string; debit: number; credit: number };
export type LedgerEntry = { id: string; at: string; ref: string; memo: string; lines: LedgerLine[] };
export type StaffMember = { name: string; email: string; roles: string[] };
export type TeamMember = { name: string; email: string; role: "Administrator" | "Investment manager" | "Analyst (view only)" };
export type Allocation = { id: string; campaignId: string; amount: number; status: "Requested" | "Agreed" | "Paid"; at: string };
export type Institution = {
  name: string;
  mandate: { sectors: string[]; minTicket: number; maxTicket: number; maxTenor: number };
  team: TeamMember[];
  allocations: Allocation[];
};
export type AccountRecord = { name: string; type: "Business" | "Individual investor" | "Institution"; joined: string };
export type Prefs = { maxTenor: number; securedOnly: boolean; sectors: string[]; monthlyIncome: boolean; maxPerBusiness: number };

/** The sixteen operations roles from the platform specification. */
export const ROLES = [
  "Super administrator",
  "Operations administrator",
  "Business origination officer",
  "Business validation officer",
  "KYC and compliance officer",
  "Credit analyst",
  "Credit risk manager",
  "Structuring officer",
  "Investment committee member",
  "Portfolio manager",
  "Collections officer",
  "Investor relations officer",
  "Finance and reconciliation officer",
  "Institutional partnerships manager",
  "Customer support officer",
  "Read-only management",
];
export const approverRoles = ["Credit risk manager", "Investment committee member"];
const seedStaff: StaffMember[] = [
  { name: "A. Mensah", email: "a.mensah@serwaa.com", roles: ["Credit analyst"] },
  { name: "K. Boateng", email: "k.boateng@serwaa.com", roles: ["Credit risk manager"] },
  { name: "E. Owusu", email: "e.owusu@serwaa.com", roles: ["KYC and compliance officer"] },
  { name: "S. Asante", email: "s.asante@serwaa.com", roles: ["Structuring officer"] },
  { name: "Y. Darko", email: "y.darko@serwaa.com", roles: ["Investment committee member"] },
  { name: "N. Addo", email: "n.addo@serwaa.com", roles: ["Finance and reconciliation officer"] },
  { name: "M. Ofori", email: "m.ofori@serwaa.com", roles: ["Institutional partnerships manager"] },
  { name: "J. Quaye", email: "j.quaye@serwaa.com", roles: ["Super administrator"] },
];
export const INDIVIDUAL = "Ama Owusu";
export const INSTITUTION = "Gyata Capital Partners";

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
  staff: StaffMember[];
  investments: Investment[];
  cash: { available: number; paidOut: number; reinvested: number; history: CashEvent[] };
  fees: Fees;
  ledger: LedgerEntry[];
  accounts: AccountRecord[];
  restricted: string[];
  institution: Institution;
};

const VERSION = 3;
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
    disclosure: "investors",
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
  const fromOpp = opportunities.map((o, i) => ({ ...o, stageIndex: 8, drafter: "S. Asante", approvals: [], appRef: undefined, ref: o.ref, id: o.id, i, disclosure: (i === 1 ? "public" : "investors") as Disclosure }));
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
        disclosure: "investors" as Disclosure,
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
    staff: seedStaff,
    investments: [],
    cash: {
      available: 2_706.25,
      paidOut: 1_284.5,
      reinvested: 0,
      history: [
        { id: uid(), kind: "Repayment", amount: 2_706.25, note: "Asaase Textiles Ltd, instalment 3", at: "2026-11-10T08:00:00.000Z" },
        { id: uid(), kind: "Withdrawal", amount: 1_284.5, note: "Paid to MTN MoMo", at: "2026-10-12T08:00:00.000Z" },
      ],
    },
    fees: { originationPct: 2, servicingPct: 1, momoPct: 1, bankFlat: 10, payoutMomoPct: 0.5, payoutBankFlat: 25 },
    ledger: [],
    accounts: [
      ...Array.from(new Set(applications.map((a) => a.business))).map((name) => ({ name, type: "Business" as const, joined: "2026-10-04" })),
      { name: INDIVIDUAL, type: "Individual investor" as const, joined: "2026-09-18" },
      { name: "Kwame Asiedu", type: "Individual investor" as const, joined: "2026-10-02" },
      { name: "Efua Mensah", type: "Individual investor" as const, joined: "2026-10-21" },
      { name: INSTITUTION, type: "Institution" as const, joined: "2026-09-30" },
    ],
    restricted: [],
    institution: {
      name: INSTITUTION,
      mandate: { sectors: ["Trade and distribution", "Energy", "Manufacturing", "Healthcare"], minTicket: 50_000, maxTicket: 500_000, maxTenor: 12 },
      team: [
        { name: "Akosua Frimpong", email: "akosua@gyatacapital.com", role: "Administrator" },
        { name: "Daniel Tetteh", email: "daniel@gyatacapital.com", role: "Investment manager" },
      ],
      allocations: [],
    },
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

const actor = (s: State) => {
  const m = s.staff.find((x) => x.name === s.actingStaff) ?? s.staff[0];
  return { name: m.name, role: m.roles[0] ?? "No role", roles: m.roles };
};
const note = (audience: Audience, title: string, body: string, href?: string): Note => ({ id: uid(), audience, title, body, href, at: today(), read: false });
const log = (s: State, subject: string, action: string, reason?: string, who?: { name: string; role: string }): AuditEntry => {
  const a = who ?? actor(s);
  return { id: uid(), subject, actor: a.name, role: a.role, action, reason, at: today() };
};

export type Result = { ok: true; message: string } | { ok: false; message: string };

/* ── business actions ────────────────────────────────────────── */

export function submitApplication(input: { product: string; amount: number; purpose: string; disclosure: Disclosure }): string {
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
    disclosure: input.disclosure,
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
    if (!me.roles.some((r) => approverRoles.includes(r))) return { ok: false, message: `A ${me.role.toLowerCase()} can't approve credit. Switch to a credit risk manager or committee member.` };
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
        disclosure: a.disclosure,
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
          ...(st.institution.mandate.sectors.includes(c.sector) ? [note("institution", "New deal in your mandate", `${c.business} · ${c.product}`, "/institution/pipeline")] : []),
          note("business", "Your deal is live", "Investors can now back your deal.", "/business"),
          ...st.notes,
        ]
      : st.notes,
    audit: [log(st, c.ref, publishing ? "Published to investors" : `Signed off: ${nextStage}`), ...st.audit],
  }));
  return { ok: true, message: publishing ? "Published. Matching investors have been notified." : `Signed off: ${nextStage}.` };
}

/** Double-entry booking: every money movement records equal debits and credits. */
const book = (ref: string, memo: string, lines: LedgerLine[]): LedgerEntry => ({ id: uid(), at: today(), ref, memo, lines });
const round = (n: number) => Math.round(n * 100) / 100;

export function paymentFee(fees: Fees, method: string, amount: number) {
  return method === "Bank transfer" ? fees.bankFlat : round((amount * fees.momoPct) / 100);
}
export function payoutFee(fees: Fees, method: string, amount: number) {
  return method === "Bank account" ? fees.payoutBankFlat : round((amount * fees.payoutMomoPct) / 100);
}

export function matchPayment(ref: string, reason: string): Result {
  if (!reason.trim()) return { ok: false, message: "Give a reason for the match. It goes on the record." };
  const s = load();
  const pay = s.payments.find((p) => p.ref === ref);
  if (!pay) return { ok: false, message: "Payment not found." };
  const inv = pay.investmentId ? s.investments.find((i) => i.id === pay.investmentId) : undefined;
  if (inv && inv.status === "Awaiting authorisation") return { ok: false, message: "The payer hasn't approved this Mobile Money prompt yet." };
  update((st) => {
    const entries: LedgerEntry[] = [];
    let campaigns = st.campaigns;
    let investments = st.investments;
    let notes = st.notes;
    let institution = st.institution;
    if (pay.kind === "Investment" && inv) {
      const c = st.campaigns.find((x) => x.id === inv.campaignId);
      campaigns = st.campaigns.map((x) =>
        x.id === inv.campaignId ? { ...x, pending: Math.max(0, x.pending - inv.amount), cleared: x.cleared + inv.amount, investors: x.investors + 1 } : x,
      );
      investments = st.investments.map((i) => (i.id === inv.id ? { ...i, status: "Cleared" } : i));
      if (inv.investor === "institution")
        institution = { ...st.institution, allocations: st.institution.allocations.map((a) => (a.campaignId === inv.campaignId ? { ...a, status: "Paid" } : a)) };
      entries.push(
        book(pay.ref, `Investment cleared for ${c?.ref ?? inv.campaignId}`, [
          { account: "Custodian bank: investor money", debit: inv.amount + inv.fee, credit: 0 },
          { account: `Campaign funds: ${c?.ref ?? inv.campaignId}`, debit: 0, credit: inv.amount },
          { account: "Fee income: payments", debit: 0, credit: inv.fee },
        ]),
      );
      notes = [
        note(inv.investor === "institution" ? "institution" : "investor", "Your investment is confirmed", `${cedisText(inv.amount)} in ${c?.business ?? "the deal"} has cleared.`, inv.investor === "institution" ? "/institution" : "/invest"),
        ...notes,
      ];
    }
    if (pay.kind === "Repayment") {
      const servicing = round((pay.expected * st.fees.servicingPct) / 100);
      entries.push(
        book(pay.ref, `Repayment received for ${pay.subject}`, [
          { account: "Custodian bank: collections", debit: pay.expected, credit: 0 },
          { account: "Investor payables", debit: 0, credit: round(pay.expected - servicing) },
          { account: "Fee income: servicing", debit: 0, credit: servicing },
        ]),
      );
      notes = [
        note("business", "Payment received", `${cedisText(pay.expected)} confirmed. Thank you.`, "/business/facilities"),
        note("investor", "Repayment received", `Your share of a ${cedisText(pay.expected)} repayment from ${pay.from}.`, "/invest"),
        ...notes,
      ];
    }
    return {
      ...st,
      campaigns,
      investments,
      institution,
      payments: st.payments.map((p) => (p.ref === ref ? { ...p, status: "Matched", received: p.expected } : p)),
      facility:
        pay.kind === "Repayment" && pay.lines
          ? { ...st.facility, schedule: st.facility.schedule.map((l, i) => (pay.lines!.includes(i) ? { ...l, status: "Paid" } : l)) }
          : st.facility,
      ledger: [...entries, ...st.ledger],
      notes,
      audit: [log(st, ref, "Payment matched", reason.trim()), ...st.audit],
    };
  });
  return { ok: true, message: "Matched and booked to the ledger." };
}

const cedisText = (n: number) => `GH₵ ${n.toLocaleString("en-GH", { maximumFractionDigits: 2 })}`;

/* ── investing ───────────────────────────────────────────────── */

/** Invest in a live deal. Money goes to the custodian; it counts only once staff confirm it arrived. */
export function invest(campaignId: string, amount: number, method: string, number: string, investor: Investor = "individual"): Result & { id?: string; payRef?: string } {
  const s = load();
  const c = s.campaigns.find((x) => x.id === campaignId);
  const who = investor === "institution" ? INSTITUTION : INDIVIDUAL;
  if (s.restricted.includes(who)) return { ok: false, message: "Your account is under review. Contact support before investing." };
  if (!c || !isLive(c)) return { ok: false, message: "This deal isn't open for investment." };
  if (!amount || amount < c.minTicket) return { ok: false, message: `The minimum for this deal is ${cedisText(c.minTicket)}.` };
  const remaining = c.target - c.cleared - c.pending;
  if (amount > remaining) return { ok: false, message: `Only ${cedisText(remaining)} is still available.` };
  if (method !== "Bank transfer" && number.replace(/\D/g, "").length < 9) return { ok: false, message: "Enter the Mobile Money number to charge." };
  const fee = paymentFee(s.fees, method, amount);
  const id = uid();
  const payRef = `SRW-${(Date.now() % 1_000_000).toString().padStart(6, "0")}`;
  const momo = method !== "Bank transfer";
  update((st) => ({
    ...st,
    investments: [{ id, investor, campaignId, amount, fee, method, payRef, status: momo ? "Awaiting authorisation" : "Pending", at: today() }, ...st.investments],
    campaigns: st.campaigns.map((x) => (x.id === campaignId ? { ...x, pending: x.pending + amount } : x)),
    payments: [
      { ref: payRef, from: who, kind: "Investment", subject: c.ref, method, expected: amount, received: momo ? 0 : 0, status: momo ? "Awaiting authorisation" : "Pending", at: today(), investmentId: id },
      ...st.payments,
    ],
    notes: [note("ops", "Investment payment to confirm", `${payRef} · ${cedisText(amount)} from ${who}`, "/ops/reconciliation"), ...st.notes],
    audit: [log(st, c.ref, `${cedisText(amount)} invested by ${method}`, payRef, { name: who, role: investor === "institution" ? "Institution" : "Investor" }), ...st.audit],
  }));
  return { ok: true, id, payRef, message: momo ? "Check your phone and approve the payment." : `Transfer ${cedisText(amount + fee)} using reference ${payRef}.` };
}

/** The Mobile Money provider reports the payer approved the prompt. */
export function confirmMomo(id: string) {
  update((s) => ({
    ...s,
    investments: s.investments.map((i) => (i.id === id && i.status === "Awaiting authorisation" ? { ...i, status: "Confirmed" } : i)),
    payments: s.payments.map((p) => (p.investmentId === id && p.status === "Awaiting authorisation" ? { ...p, status: "Confirmed", received: p.expected } : p)),
  }));
}

export function withdrawCash(amount: number): Result {
  const s = load();
  if (s.restricted.includes(INDIVIDUAL)) return { ok: false, message: "Your account is under review. Contact support before withdrawing." };
  if (!amount || amount <= 0) return { ok: false, message: "Enter an amount to withdraw." };
  if (amount > s.cash.available) return { ok: false, message: `You have ${cedisText(s.cash.available)} available.` };
  if (s.payout.method !== "Bank account" && s.payout.number.replace(/\D/g, "").length < 9) return { ok: false, message: "Add a Mobile Money number under payout settings first." };
  const fee = payoutFee(s.fees, s.payout.method, amount);
  update((st) => ({
    ...st,
    cash: {
      available: round(st.cash.available - amount),
      paidOut: round(st.cash.paidOut + amount),
      reinvested: st.cash.reinvested,
      history: [{ id: uid(), kind: "Withdrawal", amount, note: `Paid to ${st.payout.method}${fee ? `, ${cedisText(fee)} fee` : ""}`, at: today() }, ...st.cash.history],
    },
    ledger: [
      book(`WD-${uid()}`, `Withdrawal to ${INDIVIDUAL}`, [
        { account: "Investor payables", debit: amount, credit: 0 },
        { account: "Custodian bank: payouts", debit: 0, credit: amount - fee },
        { account: "Fee income: payouts", debit: 0, credit: fee },
      ]),
      ...st.ledger,
    ],
    notes: [note("investor", "Withdrawal on its way", `${cedisText(amount - fee)} to your ${st.payout.method}.`, "/invest"), ...st.notes],
  }));
  return { ok: true, message: `${cedisText(amount - fee)} is on its way to your ${s.payout.method}${fee ? ` after a ${cedisText(fee)} fee` : ""}.` };
}

export function reinvestCash(campaignId: string, amount: number): Result {
  const s = load();
  const c = s.campaigns.find((x) => x.id === campaignId);
  if (!c || !isLive(c)) return { ok: false, message: "Pick a deal that's open for investment." };
  if (amount > s.cash.available) return { ok: false, message: `You have ${cedisText(s.cash.available)} available.` };
  if (amount < c.minTicket) return { ok: false, message: `The minimum for this deal is ${cedisText(c.minTicket)}.` };
  const id = uid();
  update((st) => ({
    ...st,
    cash: {
      available: round(st.cash.available - amount),
      paidOut: st.cash.paidOut,
      reinvested: round(st.cash.reinvested + amount),
      history: [{ id: uid(), kind: "Reinvestment", amount, note: c.business, at: today() }, ...st.cash.history],
    },
    investments: [{ id, investor: "individual", campaignId, amount, fee: 0, method: "Reinvested repayments", payRef: `RI-${id}`, status: "Cleared", at: today() }, ...st.investments],
    campaigns: st.campaigns.map((x) => (x.id === campaignId ? { ...x, cleared: x.cleared + amount, investors: x.investors + 1 } : x)),
    ledger: [
      book(`RI-${id}`, `Reinvestment into ${c.ref}`, [
        { account: "Investor payables", debit: amount, credit: 0 },
        { account: `Campaign funds: ${c.ref}`, debit: 0, credit: amount },
      ]),
      ...st.ledger,
    ],
  }));
  return { ok: true, message: `${cedisText(amount)} reinvested in ${c.business}. No new payment needed.` };
}

/* ── corporate investors ─────────────────────────────────────── */

export function requestAllocation(campaignId: string, amount: number): Result {
  const s = load();
  const c = s.campaigns.find((x) => x.id === campaignId);
  const m = s.institution.mandate;
  if (!c) return { ok: false, message: "Deal not found." };
  if (amount < m.minTicket || amount > m.maxTicket) return { ok: false, message: `Your mandate allows ${cedisText(m.minTicket)} to ${cedisText(m.maxTicket)} per deal.` };
  const remaining = c.target - c.cleared - c.pending;
  if (amount > remaining) return { ok: false, message: `Only ${cedisText(remaining)} is still available.` };
  update((st) => ({
    ...st,
    institution: { ...st.institution, allocations: [{ id: uid(), campaignId, amount, status: "Requested", at: today() }, ...st.institution.allocations.filter((a) => a.campaignId !== campaignId)] },
    notes: [note("ops", "Allocation requested", `${INSTITUTION} · ${cedisText(amount)} in ${c.ref}`, "/ops/campaigns"), ...st.notes],
  }));
  return { ok: true, message: "Allocation requested. Our partnerships team will confirm it." };
}

export function agreeAllocation(id: string): Result {
  const s = load();
  const me = actor(s);
  if (!me.roles.some((r) => r === "Institutional partnerships manager" || r === "Super administrator"))
    return { ok: false, message: "Only an institutional partnerships manager can agree allocations." };
  const a = s.institution.allocations.find((x) => x.id === id);
  if (!a) return { ok: false, message: "Allocation not found." };
  update((st) => ({
    ...st,
    institution: { ...st.institution, allocations: st.institution.allocations.map((x) => (x.id === id ? { ...x, status: "Agreed" } : x)) },
    notes: [note("institution", "Allocation agreed", `${cedisText(a.amount)} confirmed. You can now pay by bank transfer.`, "/institution/pipeline"), ...st.notes],
    audit: [log(st, INSTITUTION, `Agreed allocation of ${cedisText(a.amount)}`), ...st.audit],
  }));
  return { ok: true, message: "Agreed. The institution can now pay." };
}

export function updateMandate(m: Institution["mandate"]): Result {
  if (m.minTicket > m.maxTicket) return { ok: false, message: "The minimum can't be above the maximum." };
  update((s) => ({ ...s, institution: { ...s.institution, mandate: m } }));
  return { ok: true, message: "Mandate saved. Your pipeline has been updated." };
}

export function inviteMember(member: TeamMember): Result {
  if (!member.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) return { ok: false, message: "Add a name and a valid email." };
  const s = load();
  if (s.institution.team.some((t) => t.email === member.email)) return { ok: false, message: "That person is already on your team." };
  update((st) => ({ ...st, institution: { ...st.institution, team: [...st.institution.team, member] } }));
  return { ok: true, message: `Invitation sent to ${member.email}.` };
}

export function setMemberRole(email: string, role: TeamMember["role"]) {
  update((s) => ({ ...s, institution: { ...s.institution, team: s.institution.team.map((t) => (t.email === email ? { ...t, role } : t)) } }));
}

export function removeMember(email: string): Result {
  const s = load();
  const admins = s.institution.team.filter((t) => t.role === "Administrator");
  if (admins.length === 1 && admins[0].email === email) return { ok: false, message: "Keep at least one administrator on the team." };
  update((st) => ({ ...st, institution: { ...st.institution, team: st.institution.team.filter((t) => t.email !== email) } }));
  return { ok: true, message: "Removed from the team." };
}

/* ── back office ─────────────────────────────────────────────── */

const isAdmin = (s: State) => actor(s).roles.includes("Super administrator");

export function addStaff(member: StaffMember): Result {
  const s = load();
  if (!isAdmin(s)) return { ok: false, message: "Only a super administrator can add people." };
  if (!member.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) return { ok: false, message: "Add a name and a valid email." };
  if (!member.roles.length) return { ok: false, message: "Give them at least one role." };
  if (s.staff.some((x) => x.email === member.email)) return { ok: false, message: "Someone with that email already exists." };
  update((st) => ({ ...st, staff: [...st.staff, member], audit: [log(st, member.name, `Added with roles: ${member.roles.join(", ")}`), ...st.audit] }));
  return { ok: true, message: `${member.name} added.` };
}

export function setStaffRoles(name: string, roles: string[]): Result {
  const s = load();
  if (!isAdmin(s)) return { ok: false, message: "Only a super administrator can change roles." };
  if (!roles.length) return { ok: false, message: "Everyone needs at least one role." };
  if (name === s.actingStaff && !roles.includes("Super administrator") && s.staff.filter((x) => x.roles.includes("Super administrator")).length === 1)
    return { ok: false, message: "You're the only super administrator. Add another before removing your own access." };
  update((st) => ({ ...st, staff: st.staff.map((x) => (x.name === name ? { ...x, roles } : x)), audit: [log(st, name, `Roles set to ${roles.join(", ")}`), ...st.audit] }));
  return { ok: true, message: "Roles updated." };
}

export function updateFees(fees: Fees, reason: string): Result {
  const s = load();
  const me = actor(s);
  if (!me.roles.some((r) => r === "Super administrator" || r === "Finance and reconciliation officer"))
    return { ok: false, message: "Only finance or a super administrator can change fees." };
  if (!reason.trim()) return { ok: false, message: "Say why the fees are changing. It goes on the record." };
  if (Object.values(fees).some((v) => !Number.isFinite(v) || v < 0)) return { ok: false, message: "Fees can't be negative." };
  const changes = (Object.keys(fees) as (keyof Fees)[]).filter((k) => fees[k] !== s.fees[k]).map((k) => `${k} ${s.fees[k]} → ${fees[k]}`);
  if (!changes.length) return { ok: false, message: "Nothing has changed." };
  update((st) => ({ ...st, fees, audit: [log(st, "Fees", `Changed ${changes.join("; ")}`, reason.trim()), ...st.audit] }));
  return { ok: true, message: "Fees updated. New charges apply from now on." };
}

export function setRestricted(name: string, on: boolean, reason: string): Result {
  const s = load();
  const me = actor(s);
  if (!me.roles.some((r) => r === "KYC and compliance officer" || r === "Super administrator"))
    return { ok: false, message: "Only compliance can restrict or reopen an account." };
  if (!reason.trim()) return { ok: false, message: "Give a reason. It goes on the record." };
  update((st) => ({
    ...st,
    restricted: on ? [...st.restricted, name] : st.restricted.filter((x) => x !== name),
    audit: [log(st, name, on ? "Account restricted" : "Account reopened", reason.trim()), ...st.audit],
  }));
  return { ok: true, message: on ? `${name} is restricted.` : `${name} is active again.` };
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
