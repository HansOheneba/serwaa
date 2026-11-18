// Shared by the server and the browser: the shapes of Serwaa's records and the
// rules that don't need the database.

import { campaignStages } from "./data";

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
  /** Set once the money raised has been paid out to the business. */
  disbursed?: boolean;
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

export type Me = { id: string; kind: "business" | "investor" | "institution" | "staff"; name: string; email: string };
export type StaffAllocation = Allocation & { institution: string };

export type State = {
  ready: boolean;
  me: Me | null;
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
  /** Every corporate allocation request, for the Serwaa team. */
  allocations: StaffAllocation[];
};

export type Result = { ok: true; message: string } | { ok: false; message: string };

export const defaultFees: Fees = { originationPct: 2, servicingPct: 1, momoPct: 1, bankFlat: 10, payoutMomoPct: 0.5, payoutBankFlat: 25 };
export const defaultPrefs: Prefs = { maxTenor: 6, securedOnly: true, sectors: [], monthlyIncome: true, maxPerBusiness: 30 };
export const noFacility: Facility = { ref: "", product: "", principal: 0, disbursedAt: "", autopay: false, payoutNumber: "", schedule: [] };
export const noInstitution: Institution = { name: "", mandate: { sectors: [], minTicket: 50_000, maxTicket: 500_000, maxTenor: 12 }, team: [], allocations: [] };

export const emptyState: State = {
  ready: false,
  me: null,
  applications: [],
  requests: [],
  campaigns: [],
  interests: [],
  watchlist: [],
  notes: [],
  audit: [],
  actingStaff: "",
  prefs: defaultPrefs,
  alertsOn: true,
  facility: noFacility,
  payments: [],
  payout: { method: "MTN MoMo", number: "", reinvest: false },
  staff: [],
  investments: [],
  cash: { available: 0, paidOut: 0, reinvested: 0, history: [] },
  fees: defaultFees,
  ledger: [],
  accounts: [],
  restricted: [],
  institution: noInstitution,
  allocations: [],
};

export const round = (n: number) => Math.round(n * 100) / 100;
export const cedisText = (n: number) => `GH₵ ${n.toLocaleString("en-GH", { maximumFractionDigits: 2 })}`;

export function paymentFee(fees: Fees, method: string, amount: number) {
  return method === "Bank transfer" ? fees.bankFlat : round((amount * fees.momoPct) / 100);
}
export function payoutFee(fees: Fees, method: string, amount: number) {
  return method === "Bank account" ? fees.payoutBankFlat : round((amount * fees.payoutMomoPct) / 100);
}

export function earlyPayoff(f: Facility) {
  const open = f.schedule.filter((l) => l.status === "Due" || l.status === "Upcoming");
  const principal = open.reduce((t, l) => t + l.principal, 0);
  const interestNow = open.length ? open[0].interest : 0;
  const saved = open.slice(1).reduce((t, l) => t + l.interest, 0);
  return { principal, interestNow, saved, total: principal + interestNow };
}

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


export const LIVE_STAGE = campaignStages.length - 1;
export const isLive = (c: Campaign) => c.stageIndex === LIVE_STAGE;
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
export const isOpen = (c: Campaign) => isLive(c) && !c.disbursed;
