// Seed records used until the platform API is connected.

export type MoneyState = "expected" | "pending" | "confirmed" | "cleared" | "received" | "overdue";

export type Opportunity = {
  id: string;
  ref: string;
  business: string;
  sector: string;
  product: string;
  purpose: string;
  target: number;
  cleared: number;
  pending: number;
  minTicket: number;
  tenorMonths: number;
  expectedReturn: number; // annual %, expected and never guaranteed
  frequency: string;
  security: string;
  risk: "Lower" | "Moderate" | "Higher";
  closesInDays: number;
  investors: number;
  match: number;
  matched: string[];
  unmatched: string[];
};

export const opportunities: Opportunity[] = [
  {
    id: "invoice-food-processor",
    ref: "SRW-CMP-0042",
    business: "Abrewa Agro Processing Ltd",
    sector: "Agro-processing",
    product: "Invoice financing",
    purpose: "Advance against a verified invoice to a national supermarket chain.",
    target: 400_000,
    cleared: 248_000,
    pending: 56_000,
    minTicket: 100,
    tenorMonths: 3,
    expectedReturn: 14.5,
    frequency: "At maturity",
    security: "Assigned receivable",
    risk: "Lower",
    closesInDays: 9,
    investors: 212,
    match: 92,
    matched: ["Short tenor (under 6 months)", "Secured exposure", "Agriculture sector"],
    unmatched: [],
  },
  {
    id: "po-solar-distributor",
    ref: "SRW-CMP-0045",
    business: "Kpong Solar Distribution Ltd",
    sector: "Energy",
    product: "Purchase order financing",
    purpose: "Fund the supplier deposit on a confirmed purchase order from a regional utility.",
    target: 750_000,
    cleared: 180_000,
    pending: 42_500,
    minTicket: 100,
    tenorMonths: 6,
    expectedReturn: 17,
    frequency: "Monthly interest, principal at maturity",
    security: "Purchase order and goods in transit",
    risk: "Moderate",
    closesInDays: 21,
    investors: 97,
    match: 78,
    matched: ["Monthly income", "Tenor within your 6-month limit"],
    unmatched: ["Energy is not one of your preferred sectors"],
  },
  {
    id: "wc-pharmacy-chain",
    ref: "SRW-CMP-0047",
    business: "Nsoromma Pharmacy Group",
    sector: "Healthcare",
    product: "Working capital financing",
    purpose: "Stock up ahead of the rainy season across 14 outlets.",
    target: 1_200_000,
    cleared: 1_020_000,
    pending: 30_000,
    minTicket: 500,
    tenorMonths: 12,
    expectedReturn: 19.5,
    frequency: "Monthly amortising",
    security: "Unsecured, director guarantee",
    risk: "Higher",
    closesInDays: 4,
    investors: 388,
    match: 61,
    matched: ["Monthly income"],
    unmatched: ["12-month tenor is longer than your preference", "Unsecured exposure"],
  },
];

export const portfolio = {
  asOf: "16 Nov 2026, 09:00",
  committed: 25_000,
  invested: 22_500,
  outstandingPrincipal: 18_750,
  principalRepaid: 3_750,
  returnsReceived: 1_284.5,
  expectedFutureReturns: 2_310,
  overdue: 0,
  pending: 2_500,
  holdings: [
    {
      business: "Asaase Textiles Ltd",
      product: "Contract financing",
      amount: 10_000,
      outstanding: 7_500,
      received: 812.4,
      nextPayment: "30 Nov 2026",
      nextAmount: 2_706.25,
      status: "Repaying",
    },
    {
      business: "Ofie Logistics Ltd",
      product: "Invoice financing",
      amount: 7_500,
      outstanding: 6_250,
      received: 472.1,
      nextPayment: "12 Dec 2026",
      nextAmount: 1_402.5,
      status: "Repaying",
    },
    {
      business: "Abrewa Agro Processing Ltd",
      product: "Invoice financing",
      amount: 5_000,
      outstanding: 5_000,
      received: 0,
      nextPayment: "Opens after funding",
      nextAmount: 0,
      status: "Allocated",
    },
  ],
};

export const kybStages = [
  { name: "Business identity", done: 100 },
  { name: "Ownership and management", done: 80 },
  { name: "Corporate documents", done: 100 },
  { name: "Financial documents", done: 60 },
  { name: "Commercial evidence", done: 90 },
];

export const applicationStages = [
  "Received",
  "Initial screening",
  "Document verification",
  "Business and ownership verification",
  "KYC and compliance review",
  "Financial analysis",
  "Commercial and transaction verification",
  "Credit assessment",
  "Risk review",
  "Credit committee",
  "Transaction structuring",
  "Final approval",
];

export const businessApplication = {
  ref: "SRW-APP-2026-00418",
  product: "Invoice financing",
  amount: 400_000,
  submitted: "2 Nov 2026",
  stageIndex: 5,
  requests: [{ title: "Upload bank statements for August to October 2026", due: "20 Nov 2026" }],
};

export const opsQueue = [
  { ref: "SRW-APP-2026-00418", business: "Abrewa Agro Processing Ltd", industry: "Agro-processing", amount: 400_000, stage: "Financial analysis", officer: "A. Mensah", outstanding: 1, next: "Review bank statements" },
  { ref: "SRW-APP-2026-00421", business: "Kpong Solar Distribution Ltd", industry: "Energy", amount: 750_000, stage: "Credit committee", officer: "K. Boateng", outstanding: 0, next: "Committee decision" },
  { ref: "SRW-APP-2026-00430", business: "Nsuo Building Supplies Ltd", industry: "Construction", amount: 260_000, stage: "Document verification", officer: "E. Owusu", outstanding: 3, next: "Request director IDs" },
  { ref: "SRW-APP-2026-00433", business: "Awia Cold Chain Ltd", industry: "Logistics", amount: 540_000, stage: "Initial screening", officer: "Unassigned", outstanding: 5, next: "Assign officer" },
  { ref: "SRW-APP-2026-00437", business: "Ntoma Uniforms Ltd", industry: "Manufacturing", amount: 180_000, stage: "KYC and compliance review", officer: "E. Owusu", outstanding: 0, next: "Screening hit review" },
];

export const campaignStages = [
  "Transaction approved",
  "Drafted",
  "Financial terms validated",
  "Documentation reviewed",
  "Compliance review",
  "Committee approval",
  "Final approval",
  "Scheduled",
  "Published",
];

export const opsCampaigns = [
  { ref: "SRW-CMP-0042", business: "Abrewa Agro Processing Ltd", target: 400_000, stageIndex: 8, cleared: 248_000, pending: 56_000 },
  { ref: "SRW-CMP-0045", business: "Kpong Solar Distribution Ltd", target: 750_000, stageIndex: 8, cleared: 180_000, pending: 42_500 },
  { ref: "SRW-CMP-0049", business: "Nsuo Building Supplies Ltd", target: 260_000, stageIndex: 4, cleared: 0, pending: 0 },
];

export const reconciliation = [
  { ref: "PAY-88213", investor: "Investor 1043", campaign: "SRW-CMP-0042", method: "MTN MoMo", expected: 2_000, received: 2_000, status: "Matched" },
  { ref: "PAY-88217", investor: "Investor 0877", campaign: "SRW-CMP-0045", method: "Bank transfer", expected: 15_000, received: 14_500, status: "Underpayment" },
  { ref: "PAY-88220", investor: "Investor 1201", campaign: "SRW-CMP-0042", method: "Telecel Cash", expected: 500, received: 0, status: "Awaiting authorisation" },
  { ref: "PAY-88224", investor: "Investor 0412", campaign: "SRW-CMP-0042", method: "Bank transfer", expected: 5_000, received: 5_000, status: "Duplicate" },
];
