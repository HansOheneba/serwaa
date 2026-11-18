import "server-only";
import { db, sessionClient } from "./supabase";
import {
  LIVE_STAGE,
  defaultFees,
  emptyState,
  noFacility,
  noInstitution,
  type AccountRecord,
  type Audience,
  type Campaign,
  type Fees,
  type Me,
  type State,
} from "@/lib/domain";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Profile = {
  id: string;
  kind: Me["kind"];
  name: string;
  email: string;
  phone: string | null;
  org_name: string | null;
  industry: string | null;
  institution_id: string | null;
  team_role: string | null;
  staff_roles: string[];
  prefs: any;
  payout: any;
  alerts_on: boolean;
  watchlist: string[];
  notes_read_at: string;
};

export type Ctx = { profile: Profile | null };

const admins = () =>
  (process.env.SERWAA_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

/** Who is asking. The session cookie is verified locally (no network call when keys are asymmetric). */
export async function getCtx(): Promise<Ctx> {
  const auth = await sessionClient();
  const { data } = await auth.auth.getClaims();
  const id = data?.claims?.sub as string | undefined;
  const email = (data?.claims?.email as string | undefined)?.toLowerCase();
  if (!id) return { profile: null };
  const { data: p } = await db().from("profiles").select("*").eq("id", id).maybeSingle();
  if (p) return { profile: p as Profile };
  // The people named in SERWAA_ADMIN_EMAILS become super administrators on first sign-in.
  if (email && admins().includes(email)) {
    const name = email.split("@")[0];
    const { data: created } = await db()
      .from("profiles")
      .insert({ id, kind: "staff", name, email, staff_roles: ["Super administrator"] })
      .select("*")
      .single();
    return { profile: created as Profile };
  }
  return { profile: null };
}

export const audienceOf = (kind: Me["kind"]): Audience => (kind === "staff" ? "ops" : kind);
export const displayName = (p: Profile) => (p.kind === "business" ? (p.org_name ?? p.name) : p.name);
const daysLeft = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
const num = (v: unknown) => Number(v ?? 0);

export function toCampaign(r: any, t: any, hideName: boolean): Campaign {
  return {
    id: r.id,
    ref: r.ref,
    appRef: r.app_ref ?? undefined,
    business: hideName && r.disclosure !== "public" ? `${r.sector} business` : r.business,
    sector: r.sector,
    product: r.product,
    purpose: r.purpose,
    target: num(r.target),
    cleared: num(t?.cleared ?? r.base_cleared),
    pending: num(t?.pending ?? r.base_pending),
    minTicket: num(r.min_ticket),
    tenorMonths: r.tenor_months,
    expectedReturn: num(r.expected_return),
    frequency: r.frequency,
    security: r.security,
    risk: r.risk,
    closesInDays: daysLeft(r.closes_at),
    investors: num(t?.investors ?? r.base_investors),
    stageIndex: r.stage_index,
    drafter: r.drafter,
    approvals: r.approvals ?? [],
    disclosure: r.disclosure,
    disbursed: !!r.disbursed_at,
  };
}

const none = Promise.resolve({ data: [] as any[] });

/** Everything one person is allowed to see, in a single round of parallel queries. */
export async function snapshot(ctx: Ctx): Promise<State> {
  const d = db();
  const p = ctx.profile;
  const kind = p?.kind;
  const staff = kind === "staff";
  const ownerId = kind === "institution" ? p!.institution_id : p?.id;

  const [fees, camps, totals, apps, invs, pays, facs, cash, ints, allocs, inst, team, staffRows, ledger, audit, notes, restr, accts] = await Promise.all([
    d.from("settings").select("value").eq("key", "fees").maybeSingle(),
    staff ? d.from("campaigns").select("*").order("created_at", { ascending: false }) : d.from("campaigns").select("*").eq("stage_index", LIVE_STAGE),
    d.from("campaign_totals").select("*"),
    staff
      ? d.from("applications").select("*").order("submitted_at", { ascending: false }).limit(300)
      : kind === "business"
        ? d.from("applications").select("*").eq("business_id", p!.id).order("submitted_at", { ascending: false })
        : none,
    staff
      ? d.from("investments").select("*").order("created_at", { ascending: false }).limit(500)
      : kind === "investor"
        ? d.from("investments").select("*").eq("investor_id", p!.id).order("created_at", { ascending: false })
        : kind === "institution" && p!.institution_id
          ? d.from("investments").select("*").eq("institution_id", p!.institution_id).order("created_at", { ascending: false })
          : none,
    staff ? d.from("payments").select("*").order("created_at", { ascending: false }).limit(300) : p ? d.from("payments").select("*").eq("payer_id", p.id).order("created_at", { ascending: false }).limit(100) : none,
    kind === "business" ? d.from("facilities").select("*").eq("business_id", p!.id).order("disbursed_at", { ascending: false }).limit(1) : none,
    (kind === "investor" || kind === "institution") && ownerId ? d.from("cash_events").select("*").eq("owner_id", ownerId).order("created_at", { ascending: false }).limit(100) : none,
    kind === "investor" ? d.from("interests").select("*").eq("investor_id", p!.id) : none,
    staff
      ? d.from("allocations").select("*, institutions(name)").order("created_at", { ascending: false })
      : kind === "institution" && p!.institution_id
        ? d.from("allocations").select("*").eq("institution_id", p!.institution_id).order("created_at", { ascending: false })
        : none,
    kind === "institution" && p!.institution_id ? d.from("institutions").select("*").eq("id", p!.institution_id).maybeSingle() : Promise.resolve({ data: null }),
    kind === "institution" && p!.institution_id ? d.from("profiles").select("name, email, team_role").eq("institution_id", p!.institution_id).order("created_at") : none,
    staff ? d.from("profiles").select("name, email, staff_roles").eq("kind", "staff").order("created_at") : none,
    staff ? d.from("ledger_entries").select("*").order("created_at", { ascending: false }).limit(300) : none,
    staff ? d.from("audit_log").select("*").order("created_at", { ascending: false }).limit(400) : none,
    p
      ? d
          .from("notifications")
          .select("*")
          .eq("audience", audienceOf(p.kind))
          .or(`user_id.is.null,user_id.eq.${p.id}`)
          .order("created_at", { ascending: false })
          .limit(30)
      : none,
    staff ? d.from("restrictions").select("account") : p ? d.from("restrictions").select("account").in("account", [displayName(p), p.name]) : none,
    staff ? Promise.all([d.from("profiles").select("name, org_name, kind, created_at").neq("kind", "staff"), d.from("institutions").select("name, created_at")]) : Promise.resolve(null),
  ]);

  const totalsById = new Map((totals.data ?? []).map((t: any) => [t.id, t]));
  const hideName = !(staff || kind === "investor" || kind === "institution");
  const campaigns = (camps.data ?? []).map((r: any) => toCampaign(r, totalsById.get(r.id), hideName));
  const appRows = apps.data ?? [];

  const requests = appRows.length
    ? ((
        await (staff
          ? d.from("info_requests").select("*").order("created_at", { ascending: false }).limit(500)
          : d
              .from("info_requests")
              .select("*")
              .in(
                "app_ref",
                appRows.map((a: any) => a.ref),
              )
              .order("created_at", { ascending: false }))
      ).data ?? [])
    : [];

  const cashRows = cash.data ?? [];
  const sum = (k: string) => cashRows.filter((c: any) => c.kind === k).reduce((t: number, c: any) => t + num(c.amount), 0);

  let accounts: AccountRecord[] = [];
  if (accts) {
    const [profiles, institutions] = accts;
    const seen = new Set<string>();
    const add = (a: AccountRecord) => !seen.has(a.name) && (seen.add(a.name), accounts.push(a));
    (profiles.data ?? []).forEach((r: any) => {
      if (r.kind === "business") add({ name: r.org_name ?? r.name, type: "Business", joined: r.created_at });
      if (r.kind === "investor") add({ name: r.name, type: "Individual investor", joined: r.created_at });
    });
    (institutions.data ?? []).forEach((r: any) => add({ name: r.name, type: "Institution", joined: r.created_at }));
    appRows.forEach((a: any) => add({ name: a.business, type: "Business", joined: a.submitted_at }));
    accounts = accounts.sort((a, b) => a.name.localeCompare(b.name));
  }

  const fac = (facs.data ?? [])[0];
  const instRow = (inst as any).data;
  const readAt = p ? new Date(p.notes_read_at).getTime() : 0;

  return {
    ...emptyState,
    ready: true,
    me: p ? { id: p.id, kind: p.kind, name: displayName(p), email: p.email } : null,
    applications: appRows.map((a: any) => ({
      ref: a.ref,
      business: a.business,
      industry: a.industry,
      product: a.product,
      amount: num(a.amount),
      purpose: a.purpose,
      submittedAt: a.submitted_at,
      stageIndex: a.stage_index,
      status: a.status,
      officer: a.officer,
      originator: a.originator,
      disclosure: a.disclosure,
    })),
    requests: requests.map((r: any) => ({
      id: r.id,
      appRef: r.app_ref,
      title: r.title,
      due: r.due,
      status: r.status,
      files: r.files ?? [],
      reply: r.reply ?? undefined,
      createdBy: r.created_by,
      createdAt: r.created_at,
    })),
    campaigns,
    interests: (ints.data ?? []).map((i: any) => ({ id: i.id, campaignId: i.campaign_id, amount: num(i.amount), at: i.created_at })),
    watchlist: kind === "investor" ? p!.watchlist : [],
    notes: (notes.data ?? []).map((n: any) => ({
      id: n.id,
      audience: n.audience,
      title: n.title,
      body: n.body,
      href: n.href ?? undefined,
      at: n.created_at,
      read: new Date(n.created_at).getTime() <= readAt,
    })),
    audit: (audit.data ?? []).map((a: any) => ({ id: a.id, subject: a.subject, actor: a.actor, role: a.role, action: a.action, reason: a.reason ?? undefined, at: a.created_at })),
    actingStaff: staff ? p!.name : "",
    prefs: kind === "investor" ? { ...emptyState.prefs, ...p!.prefs } : emptyState.prefs,
    alertsOn: p?.alerts_on ?? true,
    facility: fac
      ? { ref: fac.ref, product: fac.product, principal: num(fac.principal), disbursedAt: fac.disbursed_at, autopay: fac.autopay, payoutNumber: fac.payout_number, schedule: fac.schedule }
      : noFacility,
    payments: (pays.data ?? []).map((x: any) => ({
      ref: x.ref,
      from: x.from_name,
      kind: x.kind,
      subject: x.subject,
      method: x.method,
      expected: num(x.expected),
      received: num(x.received),
      status: x.status,
      at: x.created_at,
      lines: x.lines ?? undefined,
      investmentId: x.investment_id ?? undefined,
    })),
    payout: kind === "investor" ? { ...emptyState.payout, ...p!.payout } : emptyState.payout,
    staff: (staffRows.data ?? []).map((s: any) => ({ name: s.name, email: s.email, roles: s.staff_roles })),
    investments: (invs.data ?? []).map((i: any) => ({
      id: i.id,
      investor: i.institution_id ? "institution" : "individual",
      campaignId: i.campaign_id,
      amount: num(i.amount),
      fee: num(i.fee),
      method: i.method,
      payRef: i.pay_ref,
      status: i.status,
      at: i.created_at,
    })),
    cash: {
      available: Math.round((sum("Repayment") - sum("Withdrawal") - sum("Reinvestment")) * 100) / 100,
      paidOut: sum("Withdrawal"),
      reinvested: sum("Reinvestment"),
      history: cashRows.map((c: any) => ({ id: c.id, kind: c.kind, amount: num(c.amount), note: c.note, at: c.created_at })),
    },
    fees: { ...defaultFees, ...((fees.data?.value as Fees | undefined) ?? {}) },
    ledger: (ledger.data ?? []).map((e: any) => ({ id: e.id, at: e.created_at, ref: e.ref, memo: e.memo, lines: e.lines })),
    accounts,
    restricted: (restr.data ?? []).map((r: any) => r.account),
    institution: instRow
      ? {
          name: instRow.name,
          mandate: instRow.mandate,
          team: (team.data ?? []).map((t: any) => ({ name: t.name, email: t.email, role: t.team_role ?? "Analyst (view only)" })),
          allocations: (allocs.data ?? []).map((a: any) => ({ id: a.id, campaignId: a.campaign_id, amount: num(a.amount), status: a.status, at: a.created_at })),
        }
      : noInstitution,
    allocations: staff
      ? (allocs.data ?? []).map((a: any) => ({ id: a.id, campaignId: a.campaign_id, amount: num(a.amount), status: a.status, at: a.created_at, institution: a.institutions?.name ?? "" }))
      : [],
  };
}
