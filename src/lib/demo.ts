// Demo accounts: a complete, believable view of each portal for anyone who isn't
// signed in. Built in the browser from sample data, so browsing the demo never
// touches the database. Nothing here is saved.

import { applicationStages, businessApplication, opportunities, opsCampaigns, opsQueue, reconciliation } from "./data";
import { ROLES, emptyState, type Audience, type Campaign, type State } from "./domain";

export const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const at = (daysAgo: number) => new Date(Date.now() - daysAgo * 86_400_000).toISOString();
const due = (months: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  d.setDate(d.getDate() + 6);
  return d.toISOString().slice(0, 10);
};

const live: Campaign[] = opportunities.map((o, i) => ({
  id: o.id,
  ref: o.ref,
  business: o.business,
  sector: o.sector,
  product: o.product,
  purpose: o.purpose,
  target: o.target,
  cleared: o.cleared,
  pending: o.pending,
  minTicket: o.minTicket,
  tenorMonths: o.tenorMonths,
  expectedReturn: o.expectedReturn,
  frequency: o.frequency,
  security: o.security,
  risk: o.risk,
  closesInDays: o.closesInDays,
  investors: o.investors,
  stageIndex: 8,
  drafter: "S. Asante",
  approvals: [
    { stage: "Committee approval", by: "Y. Darko", at: at(9) },
    { stage: "Final approval", by: "K. Boateng", at: at(8) },
    { stage: "Published", by: "J. Quaye", at: at(7) },
  ],
  disclosure: i === 1 ? "public" : "investors",
}));

const drafts: Campaign[] = opsCampaigns
  .filter((c) => !opportunities.some((o) => o.ref === c.ref))
  .map((c) => ({
    id: c.ref.toLowerCase(),
    ref: c.ref,
    business: c.business,
    sector: "Construction",
    product: "Contract financing",
    purpose: "Materials for a signed school construction contract.",
    target: c.target,
    cleared: 0,
    pending: 0,
    minTicket: 100,
    tenorMonths: 6,
    expectedReturn: 16,
    frequency: "Monthly interest, principal at maturity",
    security: "Assigned contract receivables",
    risk: "Moderate",
    closesInDays: 30,
    investors: 0,
    stageIndex: c.stageIndex,
    drafter: "S. Asante",
    approvals: [{ stage: "Financial terms validated", by: "N. Addo", at: at(3) }],
    disclosure: "investors",
  }));

const staff = [
  { name: "A. Mensah", email: "a.mensah@serwaa.example", roles: ["Credit analyst"] },
  { name: "K. Boateng", email: "k.boateng@serwaa.example", roles: ["Credit risk manager"] },
  { name: "E. Owusu", email: "e.owusu@serwaa.example", roles: ["KYC and compliance officer"] },
  { name: "S. Asante", email: "s.asante@serwaa.example", roles: ["Structuring officer"] },
  { name: "Y. Darko", email: "y.darko@serwaa.example", roles: ["Investment committee member"] },
  { name: "N. Addo", email: "n.addo@serwaa.example", roles: ["Finance and reconciliation officer"] },
  { name: "M. Ofori", email: "m.ofori@serwaa.example", roles: ["Institutional partnerships manager"] },
  { name: "J. Quaye", email: "j.quaye@serwaa.example", roles: [ROLES[0]] },
];

const applications = opsQueue.map((q) => ({
  ref: q.ref,
  business: q.business,
  industry: q.industry,
  product: q.ref === businessApplication.ref ? businessApplication.product : q.industry === "Energy" ? "Purchase order financing" : "Working capital financing",
  amount: q.amount,
  purpose: q.ref === businessApplication.ref ? "Advance against an invoice to a national supermarket chain." : "Working capital for confirmed orders.",
  submittedAt: at(16),
  stageIndex: Math.max(0, applicationStages.indexOf(q.stage)),
  status: (q.ref === businessApplication.ref ? "Information requested" : "In review") as State["applications"][number]["status"],
  officer: q.officer,
  originator: q.ref === "SRW-APP-2026-00421" ? "K. Boateng" : "Business",
  disclosure: "investors" as const,
}));

const requests = businessApplication.requests.map((r, i) => ({
  id: `demo-req-${i}`,
  appRef: businessApplication.ref,
  title: r.title,
  due: due(1),
  status: "Open" as const,
  files: [],
  createdBy: "A. Mensah",
  createdAt: at(6),
}));

const investments: State["investments"] = [
  { id: "demo-inv-1", investor: "individual", campaignId: live[0].id, amount: 10_000, fee: 100, method: "MTN MoMo", payRef: "SRW-DEMO01", status: "Cleared", at: at(40) },
  { id: "demo-inv-2", investor: "individual", campaignId: live[1].id, amount: 7_500, fee: 10, method: "Bank transfer", payRef: "SRW-DEMO02", status: "Cleared", at: at(22) },
  { id: "demo-inv-3", investor: "individual", campaignId: live[2]?.id ?? live[0].id, amount: 2_500, fee: 25, method: "Telecel Cash", payRef: "SRW-DEMO03", status: "Pending", at: at(1) },
];

const ledger: State["ledger"] = [
  {
    id: "demo-led-1",
    at: at(10),
    ref: "PAY-88213",
    memo: `Investment cleared for ${live[0].ref}`,
    lines: [
      { account: "Custodian bank: investor money", debit: 2_020, credit: 0 },
      { account: `Campaign funds: ${live[0].ref}`, debit: 0, credit: 2_000 },
      { account: "Fee income: payments", debit: 0, credit: 20 },
    ],
  },
  {
    id: "demo-led-2",
    at: at(8),
    ref: "PAY-90011",
    memo: "Repayment received for SRW-FAC-0031",
    lines: [
      { account: "Custodian bank: collections", debit: 21_800, credit: 0 },
      { account: "Investor payables", debit: 0, credit: 21_582 },
      { account: "Fee income: servicing", debit: 0, credit: 218 },
    ],
  },
];

const audit: State["audit"] = [
  { id: "demo-a1", subject: "SRW-APP-2026-00421", actor: "K. Boateng", role: "Credit risk manager", action: "Moved to Credit committee", at: at(2) },
  { id: "demo-a2", subject: businessApplication.ref, actor: "A. Mensah", role: "Credit analyst", action: "Requested information", reason: "Bank statements for August to October", at: at(6) },
  { id: "demo-a3", subject: "Fees", actor: "N. Addo", role: "Finance and reconciliation officer", action: "Changed momoPct 1.2 → 1", reason: "New MTN collection rate", at: at(12) },
];

const facility: State["facility"] = {
  ref: "SRW-FAC-0031",
  product: "Contract financing",
  principal: 120_000,
  disbursedAt: at(110).slice(0, 10),
  autopay: false,
  payoutNumber: "",
  schedule: [-3, -2, -1, 0, 1, 2].map((m, i) => ({
    due: due(m),
    amount: 21_800,
    principal: 20_000,
    interest: 1_800,
    status: i < 3 ? "Paid" : i === 3 ? "Due" : "Upcoming",
  })),
};

const note = (audience: Audience, title: string, body: string, href: string, daysAgo: number, read = false) => ({ id: `demo-n-${audience}-${title}`, audience, title, body, href, at: at(daysAgo), read });

/** The sample account shown for a portal when nobody is signed in. */
export function demoState(audience: Audience): State {
  const base: State = {
    ...emptyState,
    ready: true,
    campaigns: audience === "ops" ? [...live, ...drafts] : live,
    fees: emptyState.fees,
    staff: audience === "ops" ? staff : [],
  };
  if (audience === "business")
    return {
      ...base,
      me: { id: "demo", kind: "business", name: "Abrewa Trading Ltd", email: "demo@serwaa.example" },
      applications: applications.filter((a) => a.business === "Abrewa Trading Ltd"),
      requests,
      facility,
      notes: [note("business", "We need something from you", "Bank statements for August to October", "/business/applications", 6), note("business", "Payment received", "GH₵ 21,800 confirmed. Thank you.", "/business/facilities", 30, true)],
    };
  if (audience === "investor")
    return {
      ...base,
      me: { id: "demo", kind: "investor", name: "Ama Owusu", email: "demo@serwaa.example" },
      investments,
      watchlist: [live[3]?.id ?? live[0].id],
      prefs: { maxTenor: 6, securedOnly: true, sectors: ["Trade and distribution", "Manufacturing", "Energy"], monthlyIncome: true, maxPerBusiness: 30 },
      payout: { method: "MTN MoMo", number: "024 555 0199", reinvest: false },
      cash: {
        available: 2_706.25,
        paidOut: 1_284.5,
        reinvested: 0,
        history: [
          { id: "demo-c1", kind: "Repayment", amount: 2_706.25, note: `${live[0].business}, instalment 3`, at: at(8) },
          { id: "demo-c2", kind: "Withdrawal", amount: 1_284.5, note: "Paid to MTN MoMo", at: at(37) },
          { id: "demo-c3", kind: "Repayment", amount: 1_284.5, note: `${live[0].business}, instalment 2`, at: at(38) },
        ],
      },
      notes: [note("investor", "Repayment received", `GH₵ 2,706.25 from ${live[0].business}.`, "/invest", 8), note("investor", "New opportunity for you", `${live[1].business} · ${live[1].product}`, `/invest/opportunities/${live[1].id}`, 7, true)],
    };
  if (audience === "institution")
    return {
      ...base,
      me: { id: "demo", kind: "institution", name: "Akosua Frimpong", email: "demo@serwaa.example" },
      investments: [{ id: "demo-ii-1", investor: "institution", campaignId: live[1].id, amount: 150_000, fee: 10, method: "Bank transfer", payRef: "SRW-DEMO10", status: "Cleared", at: at(20) }],
      institution: {
        name: "Gyata Capital Partners",
        mandate: { sectors: ["Trade and distribution", "Energy", "Manufacturing", "Healthcare"], minTicket: 50_000, maxTicket: 500_000, maxTenor: 12 },
        team: [
          { name: "Akosua Frimpong", email: "akosua@gyata.example", role: "Administrator" },
          { name: "Daniel Tetteh", email: "daniel@gyata.example", role: "Investment manager" },
          { name: "Esi Boakye", email: "esi@gyata.example", role: "Analyst (view only)" },
        ],
        allocations: [
          { id: "demo-al-1", campaignId: live[1].id, amount: 150_000, status: "Paid", at: at(24) },
          { id: "demo-al-2", campaignId: live[0].id, amount: 80_000, status: "Agreed", at: at(3) },
        ],
      },
      notes: [note("institution", "Allocation agreed", "GH₵ 80,000 confirmed. You can now pay.", "/institution/pipeline", 3)],
    };
  return {
    ...base,
    me: { id: "demo", kind: "staff", name: "J. Quaye", email: "demo@serwaa.example" },
    actingStaff: "J. Quaye",
    applications,
    requests,
    payments: reconciliation.map((r) => ({ ref: r.ref, from: r.investor, kind: "Investment" as const, subject: r.campaign, method: r.method, expected: r.expected, received: r.received, status: r.status as State["payments"][number]["status"], at: at(4) })),
    investments,
    ledger,
    audit,
    accounts: [
      ...Array.from(new Set(applications.map((a) => a.business))).map((name) => ({ name, type: "Business" as const, joined: at(45) })),
      { name: "Ama Owusu", type: "Individual investor" as const, joined: at(60) },
      { name: "Kwame Asiedu", type: "Individual investor" as const, joined: at(47) },
      { name: "Gyata Capital Partners", type: "Institution" as const, joined: at(49) },
    ],
    allocations: [{ id: "demo-al-2", campaignId: live[0].id, amount: 80_000, status: "Requested", at: at(1), institution: "Gyata Capital Partners" }],
    notes: [note("ops", "New application", "Ntoma Uniforms Ltd · Working capital financing", "/ops", 1), note("ops", "Response overdue soon", `${businessApplication.ref} has a request due soon.`, `/ops/applications/${businessApplication.ref}`, 2, true)],
  };
}
