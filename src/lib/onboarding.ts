// Onboarding model: who is signing up drives which steps, stages and copy they see.

export type Mode = "business" | "investor" | "institution";

export type StepId =
  | "mode"
  | "account"
  | "business"
  | "people"
  | "need"
  | "goals"
  | "risk"
  | "preferences"
  | "organisation"
  | "mandate"
  | "review"
  | "done";

export type Person = { name: string; role: string; ownership: number };

export type OnboardingState = {
  mode: Mode;
  step: StepId;
  account: { firstName: string; lastName: string; email: string; phone: string; country: string };
  business: {
    legalName: string;
    regNumber: string;
    type: string;
    industry: string;
    year: string;
    tradingName: string;
    website: string;
    tin: string;
  };
  people: Person[];
  need: { product: string; amount: string; timing: string };
  investor: {
    objectives: string[];
    experience: string;
    lateReaction: string;
    shareOfSavings: string;
    ticket: string;
    tenor: string;
    sectors: string[];
    secured: string;
  };
  institution: { orgName: string; orgType: string; role: string; ticket: string; tenor: string; sectors: string[] };
  consent: boolean;
};

export const initialState: OnboardingState = {
  mode: "business",
  step: "mode",
  account: { firstName: "", lastName: "", email: "", phone: "", country: "Ghana" },
  business: { legalName: "", regNumber: "", type: "", industry: "", year: "", tradingName: "", website: "", tin: "" },
  people: [],
  need: { product: "", amount: "", timing: "" },
  investor: { objectives: [], experience: "", lateReaction: "", shareOfSavings: "", ticket: "", tenor: "", sectors: [], secured: "" },
  institution: { orgName: "", orgType: "", role: "", ticket: "", tenor: "", sectors: [] },
  consent: false,
};

export const flows: Record<Mode, StepId[]> = {
  business: ["mode", "account", "business", "people", "need", "review", "done"],
  investor: ["mode", "account", "goals", "risk", "preferences", "review", "done"],
  institution: ["mode", "account", "organisation", "mandate", "review", "done"],
};

/** A handful of named stages, each covering one or more steps (shown in the indicator). */
export const stages: Record<Mode, { label: string; steps: StepId[] }[]> = {
  business: [
    { label: "Account", steps: ["mode", "account"] },
    { label: "Business", steps: ["business", "people"] },
    { label: "Financing", steps: ["need"] },
    { label: "Review", steps: ["review", "done"] },
  ],
  investor: [
    { label: "Account", steps: ["mode", "account"] },
    { label: "Profile", steps: ["goals", "risk"] },
    { label: "Preferences", steps: ["preferences"] },
    { label: "Review", steps: ["review", "done"] },
  ],
  institution: [
    { label: "Account", steps: ["mode", "account"] },
    { label: "Organisation", steps: ["organisation"] },
    { label: "Mandate", steps: ["mandate"] },
    { label: "Review", steps: ["review", "done"] },
  ],
};

/** Copy that changes with the account type lives here, in one place. */
export const copy = {
  account: {
    heading: {
      business: "Let's start with you",
      investor: "Let's get to know you",
      institution: "Who should we work with?",
    },
    sub: {
      business: "You'll manage the business account. We'll verify your email and phone before credit review.",
      investor: "We use this to verify your identity, as the law requires for every investor.",
      institution: "The main contact for your organisation. You can invite colleagues later.",
    },
  },
  review: {
    heading: {
      business: "Check your business details",
      investor: "Check your investor profile",
      institution: "Check your organisation details",
    },
    consent: {
      business:
        "I'm authorised to act for this business, and I consent to Serwaa verifying the business, its owners and its directors.",
      investor:
        "I understand that private credit is illiquid, that returns are not guaranteed and that I could lose some or all of my money.",
      institution: "I'm authorised to register this organisation and consent to Serwaa verifying it and its signatories.",
    },
    submit: { business: "Create business account", investor: "Create investor account", institution: "Submit for review" },
  },
} as const;

export const options = {
  businessTypes: ["Limited liability company", "Sole proprietorship", "Partnership", "Other"],
  industries: [
    "Trade and distribution",
    "Manufacturing",
    "Construction",
    "Services",
    "Healthcare",
    "Logistics",
    "Energy",
    "Agriculture and agro-processing",
  ],
  roles: ["Director", "Shareholder", "Director and shareholder", "Authorised representative"],
  products: [
    { value: "Invoice financing", body: "Get paid now on invoices your customers will settle later." },
    { value: "Purchase order financing", body: "Fund the supplies you need to deliver a confirmed order." },
    { value: "Working capital", body: "Cover stock, payroll or seasonal gaps in cash flow." },
    { value: "Contract financing", body: "Finance the delivery of a signed contract." },
    { value: "Not sure yet", body: "Tell us what you need and we'll suggest a structure." },
  ],
  amounts: ["Under GH₵100,000", "GH₵100,000 – 500,000", "GH₵500,000 – 2 million", "Over GH₵2 million"],
  timing: ["Within a month", "In 1–3 months", "Just exploring"],
  objectives: [
    { value: "Regular income", key: "income" },
    { value: "Protect my capital", key: "preserve" },
    { value: "Grow my wealth", key: "growth" },
    { value: "Diversify my investments", key: "diversify" },
    { value: "Support local businesses", key: "impact" },
  ],
  experience: [
    { value: "New to investing", body: "I've mostly used savings accounts." },
    { value: "Some experience", body: "I've invested in treasury bills, bonds or mutual funds." },
    { value: "Experienced", body: "I've invested in private credit, shares or similar." },
  ],
  lateReaction: [
    { value: "I'd be very worried", body: "I'd need that money back on time.", score: 0 },
    { value: "I'd be concerned but patient", body: "I can wait if there's a plan to recover it.", score: 1 },
    { value: "I'd be comfortable", body: "Delays are part of lending to businesses.", score: 2 },
  ],
  shareOfSavings: [
    { value: "Most of my savings", body: "Losing it would affect my daily life.", score: 0 },
    { value: "A meaningful part", body: "A loss would hurt but I'd manage.", score: 1 },
    { value: "A small part", body: "I could absorb a loss comfortably.", score: 2 },
  ],
  tickets: ["GH₵100 – 1,000", "GH₵1,000 – 10,000", "GH₵10,000 – 50,000", "Over GH₵50,000"],
  tenors: ["Up to 3 months", "3 – 6 months", "6 – 12 months", "Over 12 months"],
  secured: ["Secured only", "Secured or unsecured", "No preference"],
  orgTypes: ["Private credit fund", "Bank", "Development finance institution", "Family office", "Corporate investor", "Other"],
  institutionTickets: ["Under GH₵1 million", "GH₵1 – 5 million", "GH₵5 – 20 million", "Over GH₵20 million"],
};

export type Profile = { category: string; summary: string; capped: boolean };

/** Willingness and capacity are scored separately; capacity always caps the result. */
export function investorProfile(inv: OnboardingState["investor"]): Profile | null {
  const will = options.lateReaction.find((o) => o.value === inv.lateReaction)?.score;
  const cap = options.shareOfSavings.find((o) => o.value === inv.shareOfSavings)?.score;
  if (will === undefined || cap === undefined) return null;
  const level = Math.min(will, cap);
  const wantsIncome = inv.objectives.includes("Regular income");
  const wantsGrowth = inv.objectives.includes("Grow my wealth");
  const category =
    level === 0 ? "Conservative" : level === 1 ? (wantsIncome ? "Income focused" : "Balanced") : wantsGrowth ? "Growth oriented" : "Balanced";
  const summaries: Record<string, string> = {
    Conservative: "We'll show shorter, secured opportunities first and warn you before you concentrate in one place.",
    "Income focused": "We'll favour opportunities with regular repayments and moderate risk.",
    Balanced: "We'll show a mix of tenors and structures, with concentration warnings as you build a portfolio.",
    "Growth oriented": "We'll include higher-return opportunities, with clear risk labels on each.",
  };
  return { category, summary: summaries[category], capped: will > cap };
}

export function ownershipTotal(people: Person[]) {
  return people.reduce((s, p) => s + (Number.isFinite(p.ownership) ? p.ownership : 0), 0);
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const isPhone = (v: string) => v.replace(/\D/g, "").length >= 9;
