// Loads sample deals, applications and team members so a fresh Serwaa project has
// something to look at. Safe to run more than once. Usage: node --env-file=.env.local scripts/seed.mts
import { createClient } from "@supabase/supabase-js";
import { applicationStages, businessApplication, opportunities, opsCampaigns, opsQueue, reconciliation } from "../src/lib/data.ts";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } });
const must = async (label: string, q: PromiseLike<{ error: { message: string } | null }>) => {
  const { error } = await q;
  if (error) throw new Error(`${label}: ${error.message}`);
};

// Sample colleagues use the reserved .example domain, so they can never receive email.
const team = [
  ["A. Mensah", "Credit analyst"],
  ["K. Boateng", "Credit risk manager"],
  ["E. Owusu", "KYC and compliance officer"],
  ["S. Asante", "Structuring officer"],
  ["Y. Darko", "Investment committee member"],
  ["N. Addo", "Finance and reconciliation officer"],
  ["M. Ofori", "Institutional partnerships manager"],
];
const { data: existing } = await db.from("profiles").select("email").eq("kind", "staff");
for (const [name, role] of team) {
  const email = `${name.replace(/\W+/g, ".").replace(/^\.|\.$/g, "").toLowerCase()}@serwaa.example`;
  if (existing?.some((e) => e.email === email)) continue;
  const { data, error } = await db.auth.admin.createUser({ email, email_confirm: true });
  if (error) throw new Error(`user ${email}: ${error.message}`);
  await must("staff", db.from("profiles").insert({ id: data.user.id, kind: "staff", name, email, staff_roles: [role] }));
}

await must(
  "applications",
  db.from("applications").upsert(
    opsQueue.map((q) => ({
      ref: q.ref,
      business: q.business,
      industry: q.industry,
      product: q.ref === businessApplication.ref ? businessApplication.product : q.industry === "Energy" ? "Purchase order financing" : "Working capital financing",
      amount: q.amount,
      purpose: q.ref === businessApplication.ref ? "Advance against an invoice to a national supermarket chain." : "Working capital for confirmed orders.",
      stage_index: Math.max(0, applicationStages.indexOf(q.stage)),
      status: q.ref === businessApplication.ref ? "Information requested" : "In review",
      officer: q.officer,
      originator: q.ref === "SRW-APP-2026-00421" ? "K. Boateng" : "Business",
      submitted_at: "2026-11-02T09:00:00Z",
    })),
  ),
);

const { count } = await db.from("info_requests").select("id", { count: "exact", head: true }).eq("app_ref", businessApplication.ref);
if (!count)
  await must(
    "requests",
    db.from("info_requests").insert(businessApplication.requests.map((r) => ({ app_ref: businessApplication.ref, title: r.title, due: "2026-12-05", created_by: "A. Mensah" }))),
  );

const days = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();
await must(
  "campaigns",
  db.from("campaigns").upsert([
    ...opportunities.map((o, i) => ({
      id: o.id,
      ref: o.ref,
      business: o.business,
      sector: o.sector,
      product: o.product,
      purpose: o.purpose,
      target: o.target,
      min_ticket: o.minTicket,
      tenor_months: o.tenorMonths,
      expected_return: o.expectedReturn,
      frequency: o.frequency,
      security: o.security,
      risk: o.risk,
      closes_at: days(o.closesInDays),
      stage_index: 8,
      drafter: "S. Asante",
      disclosure: i === 1 ? "public" : "investors",
      base_cleared: o.cleared + o.pending,
      base_investors: o.investors,
    })),
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
        tenor_months: 6,
        expected_return: 16,
        frequency: "Monthly interest, principal at maturity",
        security: "Assigned contract receivables",
        stage_index: c.stageIndex,
        drafter: "S. Asante",
        // Every row in one upsert needs the same columns.
        min_ticket: 100,
        risk: "Moderate",
        closes_at: days(30),
        disclosure: "investors",
        base_cleared: 0,
        base_investors: 0,
      })),
  ]),
);

await must(
  "payments",
  db.from("payments").upsert(
    reconciliation.map((r) => ({ ref: r.ref, from_name: r.investor, kind: "Investment", subject: r.campaign, method: r.method, expected: r.expected, received: r.received, status: r.status, created_at: "2026-11-14T09:00:00Z" })),
  ),
);

console.log("Sample data loaded.");
