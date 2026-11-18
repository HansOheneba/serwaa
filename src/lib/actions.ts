"use server";

// Every change anyone makes on Serwaa goes through these server actions. Each one
// works out who is signed in, checks what their role allows, writes to the database,
// and returns a fresh view of the data that person is allowed to see.

import { updateTag } from "next/cache";
import { after } from "next/server";
import { applicationStages, campaignStages } from "./data";
import {
  LIVE_STAGE,
  approverRoles,
  cedisText,
  earlyPayoff,
  paymentFee,
  payoutFee,
  round,
  validEmail,
  type Audience,
  type Disclosure,
  type Fees,
  type Institution,
  type LedgerLine,
  type Prefs,
  type Result,
  type ScheduleLine,
  type StaffMember,
  type State,
  type TeamMember,
} from "./domain";
import type { OnboardingState } from "./onboarding";
import { SITE, sendMail, type Mail } from "./server/email";
import { db, sessionClient } from "./server/supabase";
import { displayName, getCtx, snapshot, toCampaign, type Ctx, type Profile } from "./server/workspace";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Out<E = object> = Result & Partial<E> & { ws: State };

const ok = (message: string) => ({ ok: true as const, message });
const fail = (message: string) => ({ ok: false as const, message });
const today = () => new Date().toISOString();
const short = () => Date.now().toString(36).slice(-5).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase();

/** Throws on a database error so the action reports a clean failure. */
async function must(q: PromiseLike<{ data: any; error: any }>): Promise<any> {
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data;
}

async function run<E = object>(fn: (ctx: Ctx) => Promise<Result & Partial<NoInfer<E>>>): Promise<Out<E>> {
  let r: Result & Partial<E>;
  try {
    r = await fn(await getCtx());
  } catch (e) {
    console.error("[action]", e);
    r = fail("Something went wrong on our side. Please try again.") as Result & Partial<E>;
  }
  return { ...r, ws: await snapshot(await getCtx()) };
}

/** Deals, totals or fees changed: everyone's next read gets fresh numbers. */
const dealsChanged = () => updateTag("deals");

class Denied extends Error {}
function as(ctx: Ctx, kind: Profile["kind"]): Profile {
  if (!ctx.profile || ctx.profile.kind !== kind) throw new Denied();
  return ctx.profile;
}
const denied = (e: unknown) => {
  if (e instanceof Denied) return fail("Sign in with the right account to do that.");
  throw e;
};
const can = (p: Profile, roles: string[]) => p.staff_roles.some((r) => roles.includes(r) || r === "Super administrator");
const roleOf = (p: Profile) => (p.kind === "staff" ? (p.staff_roles[0] ?? "Staff") : p.kind === "business" ? "Business" : p.kind === "institution" ? "Institution" : "Investor");

/* ── shared side effects ─────────────────────────────────────── */

type NoteIn = { audience: Audience; user_id?: string | null; title: string; body: string; href?: string };

async function notify(notes: NoteIn[], mails: Mail[] = []) {
  if (notes.length) await must(db().from("notifications").insert(notes.map((n) => ({ ...n, user_id: n.user_id ?? null }))));
  // Emails go out after the response, so nobody waits on them.
  if (mails.length) after(() => sendMail(mails).then(() => undefined));
}

async function audit(p: Profile | { name: string; role: string }, subject: string, action: string, reason?: string) {
  const who = "kind" in p ? { name: displayName(p), role: roleOf(p) } : p;
  await must(db().from("audit_log").insert({ subject, actor: who.name, role: who.role, action, reason: reason ?? null }));
}

const book = (ref: string, memo: string, lines: LedgerLine[]) => must(db().from("ledger_entries").insert({ ref, memo, lines }));

async function getFees(): Promise<Fees> {
  const row = await must(db().from("settings").select("value").eq("key", "fees").single());
  return row.value as Fees;
}

async function liveCampaign(id: string) {
  const [row, t] = await Promise.all([
    must(db().from("campaigns").select("*").eq("id", id).maybeSingle()),
    must(db().from("campaign_totals").select("*").eq("id", id).maybeSingle()),
  ]);
  return row ? { row, c: toCampaign(row, t, false) } : null;
}

async function isRestricted(p: Profile) {
  const rows = await must(db().from("restrictions").select("account").in("account", [displayName(p), p.name]));
  return rows.length > 0;
}

async function emailsOf(ids: string[]): Promise<{ id: string; email: string; name: string }[]> {
  if (!ids.length) return [] as { id: string; email: string; name: string }[];
  return must(db().from("profiles").select("id, email, name").in("id", ids));
}

/* ── accounts and sign-in ────────────────────────────────────── */

async function signInLink(email: string) {
  const { data, error } = await db().auth.admin.generateLink({ type: "magiclink", email });
  if (error || !data?.properties?.hashed_token) throw new Error(error?.message ?? "No link generated");
  return { userId: data.user.id, href: `${SITE}/auth/confirm?token_hash=${data.properties.hashed_token}&type=magiclink` };
}

/** Creates the sign-in identity for an email, or finds the one that exists. */
async function ensureUser(email: string) {
  const { data, error } = await db().auth.admin.createUser({ email, email_confirm: true });
  if (data?.user) return data.user.id;
  if (error && !/already|exists|registered/i.test(error.message)) throw new Error(error.message);
  return (await signInLink(email)).userId;
}

export async function loadWorkspace(): Promise<State> {
  return snapshot(await getCtx());
}

export async function requestSignIn(rawEmail: string): Promise<Result> {
  const email = rawEmail.trim().toLowerCase();
  if (!validEmail(email)) return fail("Enter a valid email address.");
  try {
    const admins = (process.env.SERWAA_ADMIN_EMAILS ?? "").toLowerCase().split(",").map((e) => e.trim());
    const profile = await must(db().from("profiles").select("name").eq("email", email).maybeSingle());
    if (!profile && !admins.includes(email)) return fail("We can't find an account with that email. Create one to get started.");
    if (!profile) await ensureUser(email);
    const link = await signInLink(email);
    const sent = await sendMail([{ to: email, title: "Your Serwaa sign-in link", body: "Use the button below to sign in. The link works once and expires in one hour. If you didn't ask for it, you can ignore this email.", cta: { label: "Sign in to Serwaa", href: link.href } }]);
    if (!sent) return fail("We couldn't send the email just now. Please try again in a minute.");
    return ok(`We've sent a sign-in link to ${email}. It expires in one hour.`);
  } catch (e) {
    console.error("[sign-in]", e);
    return fail("We couldn't send the email just now. Please try again in a minute.");
  }
}

export async function signOut() {
  const auth = await sessionClient();
  await auth.auth.signOut();
}

const parseMonths = (t: string) => {
  const n = (t.match(/\d+/g) ?? []).map(Number);
  return n.length ? Math.max(...n) : 6;
};
const parseCedis = (t: string) =>
  (t.match(/[\d,.]+\s*(million|k)?/gi) ?? []).map((m) => parseFloat(m.replace(/,/g, "")) * (/million/i.test(m) ? 1_000_000 : /k/i.test(m) ? 1_000 : 1));

export async function createAccount(s: OnboardingState): Promise<Result> {
  const email = s.account.email.trim().toLowerCase();
  const name = `${s.account.firstName.trim()} ${s.account.lastName.trim()}`.trim();
  if (!name || !validEmail(email)) return fail("Add your name and a valid email.");
  if (!s.consent) return fail("Tick the box to agree to the terms.");
  try {
    const existing = await must(db().from("profiles").select("id").eq("email", email).maybeSingle());
    if (existing) return fail("You already have an account with this email. Sign in instead.");
    const id = await ensureUser(email);
    const base = { id, email, name, phone: s.account.phone ? `+233 ${s.account.phone}` : null };
    let ops = "";
    if (s.mode === "business") {
      await must(
        db()
          .from("profiles")
          .insert({ ...base, kind: "business", org_name: s.business.legalName.trim(), industry: s.business.industry, details: { business: s.business, people: s.people, need: s.need, country: s.account.country } }),
      );
      ops = `${s.business.legalName} · ${s.business.industry}`;
    } else if (s.mode === "investor") {
      const prefs: Prefs = {
        maxTenor: parseMonths(s.investor.tenor),
        securedOnly: s.investor.secured === "Secured only",
        sectors: s.investor.sectors,
        monthlyIncome: s.investor.objectives.some((o) => /income/i.test(o)),
        maxPerBusiness: 30,
      };
      await must(db().from("profiles").insert({ ...base, kind: "investor", prefs, details: { investor: s.investor, country: s.account.country } }));
      ops = `${name} · individual investor`;
    } else {
      const amounts = parseCedis(s.institution.ticket);
      const mandate: Institution["mandate"] = {
        sectors: s.institution.sectors,
        minTicket: amounts.length > 1 ? Math.min(...amounts) : 50_000,
        maxTicket: amounts.length ? Math.max(...amounts) : 500_000,
        maxTenor: parseMonths(s.institution.tenor),
      };
      const inst = await must(db().from("institutions").insert({ name: s.institution.orgName.trim(), org_type: s.institution.orgType, mandate }).select("id").single());
      await must(db().from("profiles").insert({ ...base, kind: "institution", institution_id: inst.id, team_role: "Administrator", details: { role: s.institution.role } }));
      ops = `${s.institution.orgName} · corporate investor`;
    }
    const link = await signInLink(email);
    await notify(
      [{ audience: "ops", title: "New account", body: ops, href: "/ops/accounts" }],
      [{ to: email, title: "Welcome to Serwaa", body: `Hi ${s.account.firstName.trim()}, your account is ready. Confirm your email to sign in. The link works once and expires in one hour.`, cta: { label: "Confirm and sign in", href: link.href } }],
    );
    return ok(`We've sent a link to ${email}. Open it to sign in.`);
  } catch (e) {
    console.error("[create-account]", e);
    return fail("We couldn't create your account just now. Please try again.");
  }
}

/* ── business ────────────────────────────────────────────────── */

export async function submitApplication(input: { product: string; amount: number; purpose: string; disclosure: Disclosure }) {
  return run<{ ref: string }>(async (ctx) => {
    try {
      const p = as(ctx, "business");
      if (!input.amount || input.amount <= 0) return fail("Enter how much you need.");
      if (!input.purpose.trim()) return fail("Say what the money is for.");
      const ref = `SRW-APP-${new Date().getFullYear()}-${short()}`;
      const business = displayName(p);
      await must(
        db()
          .from("applications")
          .insert({ ref, business_id: p.id, business, industry: p.industry ?? "Other", product: input.product, amount: input.amount, purpose: input.purpose.trim(), disclosure: input.disclosure }),
      );
      await notify([
        { audience: "business", user_id: p.id, title: "Application received", body: `${ref} · ${input.product}. We'll be in touch if we need anything.`, href: `/business/applications?ref=${ref}` },
        { audience: "ops", title: "New application", body: `${business} · ${input.product}`, href: `/ops/applications/${ref}` },
      ]);
      await audit(p, ref, "Application submitted");
      return { ...ok("Application submitted."), ref };
    } catch (e) {
      return denied(e);
    }
  });
}

export async function respondToRequest(id: string, files: string[], reply: string) {
  return run(async (ctx) => {
    try {
      const p = as(ctx, "business");
      const r = await must(db().from("info_requests").select("*, applications!inner(business_id)").eq("id", id).maybeSingle());
      if (!r || r.applications.business_id !== p.id) return fail("Request not found.");
      await must(db().from("info_requests").update({ status: "Responded", files, reply }).eq("id", id));
      await notify([{ audience: "ops", title: "Response received", body: `${r.app_ref}: ${r.title}`, href: `/ops/applications/${r.app_ref}` }]);
      await audit(p, r.app_ref, `Responded to "${r.title}"`, files.join(", "));
      return ok("Sent. We'll review it and let you know.");
    } catch (e) {
      return denied(e);
    }
  });
}

async function myFacility(p: Profile) {
  return must(db().from("facilities").select("*").eq("business_id", p.id).order("disbursed_at", { ascending: false }).limit(1).maybeSingle());
}

export async function payFacility(mode: "next" | "all", method: string, number: string) {
  return run(async (ctx) => {
    try {
      const p = as(ctx, "business");
      if (method !== "Bank transfer" && number.replace(/\D/g, "").length < 9) return fail("Enter the Mobile Money number to charge.");
      const f = await myFacility(p);
      if (!f) return fail("You don't have an active facility.");
      const schedule = f.schedule as ScheduleLine[];
      const open = schedule.map((l, i) => ({ l, i })).filter(({ l }) => l.status === "Due" || l.status === "Upcoming");
      if (!open.length) return fail("Nothing left to pay.");
      const lines = mode === "next" ? [open[0].i] : open.map((o) => o.i);
      const amount = mode === "next" ? open[0].l.amount : earlyPayoff({ ...f, schedule }).total;
      const ref = `PAY-${short()}`;
      await must(db().from("facilities").update({ schedule: schedule.map((l, i) => (lines.includes(i) ? { ...l, status: "Pending" } : l)) }).eq("ref", f.ref));
      await must(
        db().from("payments").insert({ ref, payer_id: p.id, from_name: displayName(p), kind: "Repayment", subject: f.ref, method, expected: amount, received: amount, status: "Pending", lines }),
      );
      await notify([
        { audience: "business", user_id: p.id, title: "Payment on its way", body: `${cedisText(amount)} via ${method}. We'll confirm when it arrives.`, href: "/business/facilities" },
        { audience: "ops", title: "Repayment to confirm", body: `${ref} · ${cedisText(amount)} from ${displayName(p)}`, href: "/ops/reconciliation" },
      ]);
      return ok(method === "Bank transfer" ? `Use reference ${ref} on your transfer.` : "Approve the prompt on your phone to complete the payment.");
    } catch (e) {
      return denied(e);
    }
  });
}

export async function setAutopay(on: boolean, number: string) {
  return run(async (ctx) => {
    try {
      const p = as(ctx, "business");
      if (on && number.replace(/\D/g, "").length < 9) return fail("Enter the Mobile Money number to debit.");
      const f = await myFacility(p);
      if (!f) return fail("You don't have an active facility.");
      await must(db().from("facilities").update({ autopay: on, payout_number: number }).eq("ref", f.ref));
      return ok(on ? "Automatic repayments are on." : "Automatic repayments are off.");
    } catch (e) {
      return denied(e);
    }
  });
}

/* ── individual investors ────────────────────────────────────── */

const updateMe = (p: Profile, patch: Record<string, unknown>) => must(db().from("profiles").update(patch).eq("id", p.id));

export async function setPayout(payout: { method: string; number: string; reinvest: boolean }) {
  return run(async (ctx) => {
    try {
      const p = as(ctx, "investor");
      if (payout.method !== "Bank account" && payout.number.replace(/\D/g, "").length < 9) return fail("Enter a full Mobile Money number.");
      await updateMe(p, { payout });
      return ok("Payout settings saved.");
    } catch (e) {
      return denied(e);
    }
  });
}

export async function registerInterest(campaignId: string, amount: number) {
  return run(async (ctx) => {
    try {
      const p = as(ctx, "investor");
      const live = await liveCampaign(campaignId);
      if (!live || live.row.disbursed_at) return fail("That opportunity is no longer available.");
      const { c } = live;
      if (amount < c.minTicket) return fail(`The minimum for this opportunity is ${cedisText(c.minTicket)}.`);
      const remaining = c.target - c.cleared - c.pending;
      if (amount > remaining) return fail(`Only ${cedisText(remaining)} is still available.`);
      await must(db().from("interests").upsert({ investor_id: p.id, campaign_id: campaignId, amount }, { onConflict: "investor_id,campaign_id" }));
      await notify([
        { audience: "investor", user_id: p.id, title: "Place reserved", body: `${cedisText(amount)} in ${c.business}. We'll tell you when payments open.`, href: `/invest/opportunities/${c.id}` },
        { audience: "ops", title: "Interest registered", body: `${cedisText(amount)} for ${c.ref}`, href: "/ops/campaigns" },
      ]);
      return ok("Your place is reserved.");
    } catch (e) {
      return denied(e);
    }
  });
}

export async function withdrawInterest(campaignId: string) {
  return run(async (ctx) => {
    try {
      const p = as(ctx, "investor");
      await must(db().from("interests").delete().eq("investor_id", p.id).eq("campaign_id", campaignId));
      return ok("Reservation cancelled.");
    } catch (e) {
      return denied(e);
    }
  });
}

export async function toggleWatch(campaignId: string) {
  return run(async (ctx) => {
    try {
      const p = as(ctx, "investor");
      const list = p.watchlist.includes(campaignId) ? p.watchlist.filter((x) => x !== campaignId) : [...p.watchlist, campaignId];
      await updateMe(p, { watchlist: list });
      return ok("Saved.");
    } catch (e) {
      return denied(e);
    }
  });
}

export async function updatePrefs(prefs: Prefs) {
  return run(async (ctx) => {
    try {
      await updateMe(as(ctx, "investor"), { prefs });
      return ok("Preferences saved.");
    } catch (e) {
      return denied(e);
    }
  });
}

export async function setAlerts(on: boolean) {
  return run(async (ctx) => {
    try {
      const p = ctx.profile;
      if (!p) throw new Denied();
      await updateMe(p, { alerts_on: on });
      return ok(on ? "Alerts are on." : "Alerts are off.");
    } catch (e) {
      return denied(e);
    }
  });
}

/** Invest in a live deal. Money goes to the custodian; it counts only once staff confirm it arrived. */
export async function invest(campaignId: string, amount: number, method: string, number: string) {
  return run<{ id: string; payRef: string }>(async (ctx) => {
    const p = ctx.profile;
    if (!p || (p.kind !== "investor" && p.kind !== "institution")) return fail("Sign in as an investor to invest.");
    if (await isRestricted(p)) return fail("Your account is under review. Contact support before investing.");
    const live = await liveCampaign(campaignId);
    if (!live || live.c.stageIndex !== LIVE_STAGE || live.row.disbursed_at) return fail("This deal isn't open for investment.");
    const { c } = live;
    if (p.kind === "institution") {
      if (p.team_role === "Analyst (view only)") return fail("Your role is view only. Ask an administrator or investment manager.");
      const alloc = await must(db().from("allocations").select("status").eq("institution_id", p.institution_id).eq("campaign_id", campaignId).maybeSingle());
      if (alloc?.status !== "Agreed") return fail("Your allocation needs to be agreed before you pay.");
    }
    if (!amount || amount < c.minTicket) return fail(`The minimum for this deal is ${cedisText(c.minTicket)}.`);
    const remaining = c.target - c.cleared - c.pending;
    if (amount > remaining) return fail(`Only ${cedisText(remaining)} is still available.`);
    if (method !== "Bank transfer" && number.replace(/\D/g, "").length < 9) return fail("Enter the Mobile Money number to charge.");
    const fee = paymentFee(await getFees(), method, amount);
    const payRef = `SRW-${short()}`;
    const momo = method !== "Bank transfer";
    const status = momo ? "Awaiting authorisation" : "Pending";
    const who = p.kind === "institution" ? (await must(db().from("institutions").select("name").eq("id", p.institution_id).single())).name : p.name;
    const inv = await must(
      db().from("investments").insert({ investor_id: p.id, institution_id: p.institution_id, campaign_id: campaignId, amount, fee, method, pay_ref: payRef, status }).select("id").single(),
    );
    await must(
      db().from("payments").insert({ ref: payRef, payer_id: p.id, from_name: who, kind: "Investment", subject: c.ref, method, expected: amount, received: 0, status, investment_id: inv.id }),
    );
    if (p.kind === "investor") await must(db().from("interests").delete().eq("investor_id", p.id).eq("campaign_id", campaignId));
    await notify([{ audience: "ops", title: "Investment payment to confirm", body: `${payRef} · ${cedisText(amount)} from ${who}`, href: "/ops/reconciliation" }]);
    await audit({ name: who, role: p.kind === "institution" ? "Institution" : "Investor" }, c.ref, `${cedisText(amount)} invested by ${method}`, payRef);
    dealsChanged();
    return { ...ok(momo ? "Check your phone and approve the payment." : `Transfer ${cedisText(amount + fee)} using reference ${payRef}.`), id: inv.id, payRef };
  });
}

/** The Mobile Money provider reports that the payer approved the prompt. */
export async function confirmMomo(id: string) {
  return run(async (ctx) => {
    const p = ctx.profile;
    if (!p) return fail("Sign in first.");
    const inv = await must(db().from("investments").select("id, status").eq("id", id).eq("investor_id", p.id).maybeSingle());
    if (!inv || inv.status !== "Awaiting authorisation") return ok("Already confirmed.");
    await must(db().from("investments").update({ status: "Confirmed" }).eq("id", id));
    const pay = await must(db().from("payments").select("ref, expected").eq("investment_id", id).single());
    await must(db().from("payments").update({ status: "Confirmed", received: pay.expected }).eq("ref", pay.ref));
    dealsChanged();
    return ok("Payment approved.");
  });
}

async function available(ownerId: string) {
  const rows = await must(db().from("cash_events").select("kind, amount").eq("owner_id", ownerId));
  return round(rows.reduce((t: number, r: any) => t + (r.kind === "Repayment" ? 1 : -1) * Number(r.amount), 0));
}

export async function withdrawCash(amount: number) {
  return run(async (ctx) => {
    try {
      const p = as(ctx, "investor");
      if (await isRestricted(p)) return fail("Your account is under review. Contact support before withdrawing.");
      if (!amount || amount <= 0) return fail("Enter an amount to withdraw.");
      const cash = await available(p.id);
      if (amount > cash) return fail(`You have ${cedisText(cash)} available.`);
      const payout = p.payout as { method: string; number: string };
      if (payout.method !== "Bank account" && payout.number.replace(/\D/g, "").length < 9) return fail("Add a Mobile Money number under payout settings first.");
      const fee = payoutFee(await getFees(), payout.method, amount);
      await must(db().from("cash_events").insert({ owner_id: p.id, kind: "Withdrawal", amount, note: `Paid to ${payout.method}${fee ? `, ${cedisText(fee)} fee` : ""}` }));
      await book(`WD-${short()}`, `Withdrawal to ${p.name}`, [
        { account: "Investor payables", debit: amount, credit: 0 },
        { account: "Custodian bank: payouts", debit: 0, credit: round(amount - fee) },
        { account: "Fee income: payouts", debit: 0, credit: fee },
      ]);
      await notify(
        [{ audience: "investor", user_id: p.id, title: "Withdrawal on its way", body: `${cedisText(amount - fee)} to your ${payout.method}.`, href: "/invest" }],
        [{ to: p.email, title: "Your withdrawal is on its way", body: `${cedisText(amount - fee)} is being paid to your ${payout.method}.`, cta: { label: "See your portfolio", href: "/invest" } }],
      );
      return ok(`${cedisText(amount - fee)} is on its way to your ${payout.method}${fee ? ` after a ${cedisText(fee)} fee` : ""}.`);
    } catch (e) {
      return denied(e);
    }
  });
}

export async function reinvestCash(campaignId: string, amount: number) {
  return run(async (ctx) => {
    try {
      const p = as(ctx, "investor");
      const live = await liveCampaign(campaignId);
      if (!live || live.c.stageIndex !== LIVE_STAGE || live.row.disbursed_at) return fail("Pick a deal that's open for investment.");
      const { c } = live;
      const cash = await available(p.id);
      if (amount > cash) return fail(`You have ${cedisText(cash)} available.`);
      if (amount < c.minTicket) return fail(`The minimum for this deal is ${cedisText(c.minTicket)}.`);
      if (amount > c.target - c.cleared - c.pending) return fail(`Only ${cedisText(c.target - c.cleared - c.pending)} is still available.`);
      const ref = `RI-${short()}`;
      await must(db().from("cash_events").insert({ owner_id: p.id, kind: "Reinvestment", amount, note: c.business }));
      await must(db().from("investments").insert({ investor_id: p.id, campaign_id: campaignId, amount, fee: 0, method: "Reinvested repayments", pay_ref: ref, status: "Cleared" }));
      await book(ref, `Reinvestment into ${c.ref}`, [
        { account: "Investor payables", debit: amount, credit: 0 },
        { account: `Campaign funds: ${c.ref}`, debit: 0, credit: amount },
      ]);
      dealsChanged();
      return ok(`${cedisText(amount)} reinvested in ${c.business}. No new payment needed.`);
    } catch (e) {
      return denied(e);
    }
  });
}

/* ── corporate investors ─────────────────────────────────────── */

function member(ctx: Ctx, roles: TeamMember["role"][]) {
  const p = as(ctx, "institution");
  if (!p.institution_id || !roles.includes(p.team_role as TeamMember["role"])) throw new Denied();
  return p;
}
const institutionOf = (p: Profile) => must(db().from("institutions").select("*").eq("id", p.institution_id).single());

export async function requestAllocation(campaignId: string, amount: number) {
  return run(async (ctx) => {
    try {
      const p = member(ctx, ["Administrator", "Investment manager"]);
      const inst = await institutionOf(p);
      const m = inst.mandate as Institution["mandate"];
      const live = await liveCampaign(campaignId);
      if (!live) return fail("Deal not found.");
      const { c } = live;
      if (amount < m.minTicket || amount > m.maxTicket) return fail(`Your mandate allows ${cedisText(m.minTicket)} to ${cedisText(m.maxTicket)} per deal.`);
      const remaining = c.target - c.cleared - c.pending;
      if (amount > remaining) return fail(`Only ${cedisText(remaining)} is still available.`);
      await must(db().from("allocations").upsert({ institution_id: inst.id, campaign_id: campaignId, amount, status: "Requested" }, { onConflict: "institution_id,campaign_id" }));
      await notify([{ audience: "ops", title: "Allocation requested", body: `${inst.name} · ${cedisText(amount)} in ${c.ref}`, href: "/ops/campaigns" }]);
      return ok("Allocation requested. Our partnerships team will confirm it.");
    } catch (e) {
      if (e instanceof Denied) return fail("Only an administrator or investment manager can request allocations.");
      throw e;
    }
  });
}

export async function updateMandate(m: Institution["mandate"]) {
  return run(async (ctx) => {
    try {
      const p = member(ctx, ["Administrator", "Investment manager"]);
      if (m.minTicket > m.maxTicket) return fail("The minimum can't be above the maximum.");
      await must(db().from("institutions").update({ mandate: m }).eq("id", p.institution_id));
      return ok("Mandate saved. Your pipeline has been updated.");
    } catch (e) {
      if (e instanceof Denied) return fail("Only an administrator or investment manager can change the mandate.");
      throw e;
    }
  });
}

export async function inviteMember(m: TeamMember) {
  return run(async (ctx) => {
    try {
      const p = member(ctx, ["Administrator"]);
      const email = m.email.trim().toLowerCase();
      if (!m.name.trim() || !validEmail(email)) return fail("Add a name and a valid email.");
      const existing = await must(db().from("profiles").select("id").eq("email", email).maybeSingle());
      if (existing) return fail("That email already has a Serwaa account.");
      const inst = await institutionOf(p);
      const id = await ensureUser(email);
      await must(db().from("profiles").insert({ id, kind: "institution", name: m.name.trim(), email, institution_id: inst.id, team_role: m.role }));
      const link = await signInLink(email);
      await notify(
        [],
        [{ to: email, title: `${p.name} invited you to ${inst.name} on Serwaa`, body: `You've been added as ${m.role.toLowerCase()}. Use the button to sign in.`, cta: { label: "Accept and sign in", href: link.href } }],
      );
      return ok(`Invitation sent to ${email}.`);
    } catch (e) {
      if (e instanceof Denied) return fail("Only an administrator can invite people.");
      throw e;
    }
  });
}

async function teamCheck(p: Profile, email: string, nextRole: TeamMember["role"] | null) {
  const team = await must(db().from("profiles").select("email, team_role").eq("institution_id", p.institution_id));
  const target = team.find((t: any) => t.email === email);
  if (!target) return "That person isn't on your team.";
  const admins = team.filter((t: any) => t.team_role === "Administrator");
  if (target.team_role === "Administrator" && nextRole !== "Administrator" && admins.length === 1) return "Keep at least one administrator on the team.";
  return null;
}

export async function setMemberRole(email: string, role: TeamMember["role"]) {
  return run(async (ctx) => {
    try {
      const p = member(ctx, ["Administrator"]);
      const problem = await teamCheck(p, email, role);
      if (problem) return fail(problem);
      await must(db().from("profiles").update({ team_role: role }).eq("email", email).eq("institution_id", p.institution_id));
      return ok("Role updated.");
    } catch (e) {
      if (e instanceof Denied) return fail("Only an administrator can change roles.");
      throw e;
    }
  });
}

export async function removeMember(email: string) {
  return run(async (ctx) => {
    try {
      const p = member(ctx, ["Administrator"]);
      const problem = await teamCheck(p, email, null);
      if (problem) return fail(problem);
      // Their past investments stay with the institution; they just lose access.
      await must(db().from("profiles").update({ institution_id: null, team_role: null }).eq("email", email).eq("institution_id", p.institution_id));
      return ok("Removed from the team.");
    } catch (e) {
      if (e instanceof Denied) return fail("Only an administrator can remove people.");
      throw e;
    }
  });
}

/* ── Serwaa team: credit and deals ───────────────────────────── */

function staff(ctx: Ctx, roles?: string[], message?: string) {
  const p = as(ctx, "staff");
  if (roles && !can(p, roles)) throw Object.assign(new Denied(), { message });
  if (!roles && p.staff_roles.every((r) => r === "Read-only management")) throw Object.assign(new Denied(), { message: "Your role is read only." });
  return p;
}
const staffDenied = (e: unknown) => {
  if (e instanceof Denied) return fail(e.message || "Sign in with a Serwaa team account to do that.");
  throw e;
};

async function application(ref: string) {
  return must(db().from("applications").select("*").eq("ref", ref).maybeSingle());
}

export async function assignOfficer(ref: string, officer: string) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx);
      await must(db().from("applications").update({ officer }).eq("ref", ref));
      await audit(p, ref, `Assigned to ${officer}`);
      const o = await must(db().from("profiles").select("id, email").eq("kind", "staff").eq("name", officer).maybeSingle());
      if (o)
        await notify(
          [{ audience: "ops", user_id: o.id, title: "Case assigned to you", body: ref, href: `/ops/applications/${ref}` }],
          o.id === p.id ? [] : [{ to: o.email, title: "A case has been assigned to you", body: `${p.name} assigned ${ref} to you.`, cta: { label: "Open the case", href: `/ops/applications/${ref}` } }],
        );
      return ok(`Assigned to ${officer}.`);
    } catch (e) {
      return staffDenied(e);
    }
  });
}

export async function requestInformation(ref: string, title: string, due: string) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx);
      if (!title.trim()) return fail("Say what you need from the business.");
      const a = await application(ref);
      if (!a) return fail("Application not found.");
      await must(db().from("info_requests").insert({ app_ref: ref, title: title.trim(), due, created_by: p.name }));
      await must(db().from("applications").update({ status: "Information requested" }).eq("ref", ref));
      const biz = await emailsOf(a.business_id ? [a.business_id] : []);
      await notify(
        [{ audience: "business", user_id: a.business_id, title: "We need something from you", body: `${title.trim()} · due ${due}`, href: `/business/applications?ref=${ref}` }],
        biz.map((b) => ({ to: b.email, title: "We need something from you", body: `To keep application ${ref} moving: ${title.trim()}. Please send it by ${due}.`, cta: { label: "Reply now", href: `/business/applications?ref=${ref}` } })),
      );
      await audit(p, ref, "Requested information", title.trim());
      return ok("Request sent to the business.");
    } catch (e) {
      return staffDenied(e);
    }
  });
}

export async function acceptResponse(id: string) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx);
      const r = await must(db().from("info_requests").select("*").eq("id", id).maybeSingle());
      if (!r) return fail("Request not found.");
      await must(db().from("info_requests").update({ status: "Accepted" }).eq("id", id));
      const open = await must(db().from("info_requests").select("id").eq("app_ref", r.app_ref).neq("status", "Accepted"));
      if (!open.length) await must(db().from("applications").update({ status: "In review" }).eq("ref", r.app_ref));
      await audit(p, r.app_ref, `Accepted response to "${r.title}"`);
      return ok("Accepted.");
    } catch (e) {
      return staffDenied(e);
    }
  });
}

export async function advanceStage(ref: string) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx);
      const a = await application(ref);
      if (!a) return fail("Application not found.");
      if (a.status === "Information requested") return fail("Wait for the business to answer the open request first.");
      if (a.stage_index >= applicationStages.length - 2) return fail("This application is ready for a credit decision.");
      const next = applicationStages[a.stage_index + 1];
      await must(db().from("applications").update({ stage_index: a.stage_index + 1 }).eq("ref", ref).eq("stage_index", a.stage_index));
      await audit(p, ref, `Moved to ${next}`);
      return ok(`Moved to ${next}.`);
    } catch (e) {
      return staffDenied(e);
    }
  });
}

export async function decide(ref: string, decision: "approve" | "reject" | "return", reason: string) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx);
      const a = await application(ref);
      if (!a) return fail("Application not found.");
      if (!reason.trim()) return fail("Give a reason. It goes on the record.");
      if (decision === "approve") {
        if (!p.staff_roles.some((r) => approverRoles.includes(r))) return fail(`A ${(p.staff_roles[0] ?? "staff member").toLowerCase()} can't approve credit. A credit risk manager or committee member has to.`);
        if (a.originator === p.name) return fail("You brought this application in, so someone else has to approve it.");
        if (a.status === "Information requested") return fail("There's an open information request on this application.");
      }
      const status = decision === "approve" ? "Approved" : decision === "reject" ? "Rejected" : "Returned for changes";
      await must(
        db()
          .from("applications")
          .update({ status, ...(decision === "approve" ? { stage_index: applicationStages.length - 1 } : {}) })
          .eq("ref", ref),
      );
      if (decision === "approve") {
        const exists = await must(db().from("campaigns").select("id").eq("app_ref", ref).maybeSingle());
        if (!exists) {
          const structurer = await must(db().from("profiles").select("name").eq("kind", "staff").contains("staff_roles", ["Structuring officer"]).limit(1).maybeSingle());
          const invoice = a.product === "Invoice financing";
          await must(
            db()
              .from("campaigns")
              .insert({
                id: ref.toLowerCase(),
                ref: `SRW-CMP-${short()}`,
                app_ref: ref,
                business_id: a.business_id,
                business: a.business,
                sector: a.industry,
                product: a.product,
                purpose: a.purpose,
                target: a.amount,
                tenor_months: invoice ? 3 : 6,
                expected_return: invoice ? 15 : 17.5,
                frequency: invoice ? "At maturity" : "Monthly interest, principal at maturity",
                security: invoice ? "Assigned receivable" : "Director guarantee",
                drafter: structurer?.name ?? p.name,
                disclosure: a.disclosure,
              }),
          );
        }
      }
      const title = decision === "approve" ? "Your application is approved" : decision === "reject" ? "Decision on your application" : "Your application needs changes";
      const body = decision === "approve" ? "We're preparing your deal for investors." : reason.trim();
      const biz = await emailsOf(a.business_id ? [a.business_id] : []);
      await notify(
        [{ audience: "business", user_id: a.business_id, title, body, href: `/business/applications?ref=${ref}` }],
        biz.map((b) => ({ to: b.email, title, body: `${ref}: ${body}`, cta: { label: "See your application", href: `/business/applications?ref=${ref}` } })),
      );
      await audit(p, ref, decision === "approve" ? "Approved credit" : status, reason.trim());
      dealsChanged();
      return ok(decision === "approve" ? "Approved. A campaign draft has been created." : `Marked as ${status.toLowerCase()}.`);
    } catch (e) {
      return staffDenied(e);
    }
  });
}

export async function approveCampaignStage(id: string) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx);
      const row = await must(db().from("campaigns").select("*").eq("id", id).maybeSingle());
      if (!row) return fail("Campaign not found.");
      if (row.stage_index >= LIVE_STAGE) return fail("Already published.");
      if (p.name === row.drafter) return fail("You drafted this campaign, so a different person has to sign off each stage.");
      const approvals = row.approvals as { stage: string; by: string; at: string }[];
      const last = approvals[approvals.length - 1];
      if (last && last.by === p.name) return fail("You signed off the previous stage. Someone else needs to approve this one.");
      const nextStage = campaignStages[row.stage_index + 1];
      const publishing = row.stage_index + 1 === LIVE_STAGE;
      // The stage check in the update stops two people signing the same stage at once.
      const updated = await must(
        db()
          .from("campaigns")
          .update({ stage_index: row.stage_index + 1, approvals: [...approvals, { stage: nextStage, by: p.name, at: today() }], ...(publishing ? { closes_at: new Date(Date.now() + 30 * 86_400_000).toISOString() } : {}) })
          .eq("id", id)
          .eq("stage_index", row.stage_index)
          .select("id"),
      );
      if (!updated.length) return fail("Someone else just signed this stage. Refresh to see it.");
      await audit(p, row.ref, publishing ? "Published to investors" : `Signed off: ${nextStage}`);
      if (publishing) await announce(row);
      dealsChanged();
      return ok(publishing ? "Published. Matching investors have been notified." : `Signed off: ${nextStage}.`);
    } catch (e) {
      return staffDenied(e);
    }
  });
}

/** Tell the business, matching investors and institutions whose mandate covers the sector. */
async function announce(row: any) {
  const [investors, members] = await Promise.all([
    must(db().from("profiles").select("id, email, name, prefs").eq("kind", "investor").eq("alerts_on", true)),
    must(db().from("profiles").select("id, email, name, institutions!inner(mandate)").eq("kind", "institution")),
  ]);
  const fits = (sectors: string[] | undefined) => !sectors?.length || sectors.includes(row.sector);
  const inv = investors.filter((i: any) => fits(i.prefs?.sectors));
  const inst = members.filter((m: any) => (m.institutions.mandate.sectors ?? []).includes(row.sector));
  const biz = await emailsOf(row.business_id ? [row.business_id] : []);
  const what = `${row.disclosure === "public" ? row.business : `A ${row.sector.toLowerCase()} business`} · ${row.product} · ${row.expected_return}% a year`;
  await notify(
    [
      ...inv.map((i: any) => ({ audience: "investor" as const, user_id: i.id, title: "New opportunity for you", body: `${row.business} · ${row.product}`, href: `/invest/opportunities/${row.id}` })),
      ...inst.map((m: any) => ({ audience: "institution" as const, user_id: m.id, title: "New deal in your mandate", body: `${row.business} · ${row.product}`, href: "/institution/pipeline" })),
      { audience: "business", user_id: row.business_id, title: "Your deal is live", body: "Investors can now back your deal.", href: "/business" },
    ],
    [
      ...inv.map((i: any) => ({ to: i.email, title: "A new deal matches what you look for", body: what, cta: { label: "See the deal", href: `/invest/opportunities/${row.id}` } })),
      ...inst.map((m: any) => ({ to: m.email, title: "A new deal fits your mandate", body: what, cta: { label: "Open your pipeline", href: "/institution/pipeline" } })),
      ...biz.map((b) => ({ to: b.email, title: "Your deal is live", body: "Investors can now see and back your deal. We'll keep you posted as money comes in.", cta: { label: "Open your dashboard", href: "/business" } })),
    ],
  );
}

/** Pay the money raised out to the business and set up its repayment schedule. */
export async function disburseCampaign(id: string) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx, ["Finance and reconciliation officer", "Portfolio manager"], "Only finance or a portfolio manager can disburse.");
      const live = await liveCampaign(id);
      if (!live || live.c.stageIndex !== LIVE_STAGE) return fail("Only a published deal can be disbursed.");
      const { row, c } = live;
      if (row.disbursed_at) return fail("Already disbursed.");
      if (c.pending > 0) return fail("Some investor payments are still being confirmed.");
      if (c.cleared <= 0) return fail("No money has cleared for this deal yet.");
      const fees = await getFees();
      const principal = c.cleared;
      const monthly = /monthly/i.test(c.frequency);
      const interest = round((principal * c.expectedReturn) / 100 / 12);
      const start = new Date();
      const due = (m: number) => new Date(start.getFullYear(), start.getMonth() + m, start.getDate()).toISOString().slice(0, 10);
      const schedule: ScheduleLine[] = monthly
        ? Array.from({ length: c.tenorMonths }, (_, i) => {
            const lastLine = i === c.tenorMonths - 1;
            return { due: due(i + 1), amount: round(interest + (lastLine ? principal : 0)), principal: lastLine ? principal : 0, interest, status: i === 0 ? "Due" : "Upcoming" };
          })
        : [{ due: due(c.tenorMonths), amount: round(principal + interest * c.tenorMonths), principal, interest: round(interest * c.tenorMonths), status: c.tenorMonths <= 1 ? "Due" : "Upcoming" }];
      const ref = `SRW-FAC-${short()}`;
      await must(
        db().from("facilities").insert({ ref, business_id: row.business_id, business: row.business, campaign_id: id, product: c.product, principal, disbursed_at: start.toISOString().slice(0, 10), schedule }),
      );
      await must(db().from("campaigns").update({ disbursed_at: today() }).eq("id", id));
      const arrangement = round((principal * fees.originationPct) / 100);
      await book(ref, `Disbursed ${c.ref} to ${row.business}`, [
        { account: `Campaign funds: ${c.ref}`, debit: principal, credit: 0 },
        { account: "Custodian bank: disbursements", debit: 0, credit: round(principal - arrangement) },
        { account: "Fee income: arrangement", debit: 0, credit: arrangement },
      ]);
      const biz = await emailsOf(row.business_id ? [row.business_id] : []);
      await notify(
        [{ audience: "business", user_id: row.business_id, title: "Your funds are on the way", body: `${cedisText(principal - arrangement)} after the arrangement fee. Your repayment schedule is ready.`, href: "/business/facilities" }],
        biz.map((b) => ({ to: b.email, title: "Your funds are on the way", body: `${cedisText(principal - arrangement)} is being paid to you (${cedisText(principal)} raised, less a ${cedisText(arrangement)} arrangement fee). Your repayment schedule is in your dashboard.`, cta: { label: "See your schedule", href: "/business/facilities" } })),
      );
      await audit(p, c.ref, `Disbursed ${cedisText(principal)}`);
      dealsChanged();
      return ok(`Disbursed. ${ref} is set up with ${schedule.length} repayment${schedule.length === 1 ? "" : "s"}.`);
    } catch (e) {
      return staffDenied(e);
    }
  });
}

export async function agreeAllocation(id: string) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx, ["Institutional partnerships manager"], "Only an institutional partnerships manager can agree allocations.");
      const a = await must(db().from("allocations").select("*, institutions(name)").eq("id", id).maybeSingle());
      if (!a) return fail("Allocation not found.");
      await must(db().from("allocations").update({ status: "Agreed" }).eq("id", id));
      const team = await must(db().from("profiles").select("id, email").eq("institution_id", a.institution_id).in("team_role", ["Administrator", "Investment manager"]));
      await notify(
        team.map((t: any) => ({ audience: "institution" as const, user_id: t.id, title: "Allocation agreed", body: `${cedisText(Number(a.amount))} confirmed. You can now pay.`, href: "/institution/pipeline" })),
        team.map((t: any) => ({ to: t.email, title: "Your allocation is agreed", body: `${cedisText(Number(a.amount))} is confirmed for ${a.institutions.name}. You can now pay from your pipeline.`, cta: { label: "Open your pipeline", href: "/institution/pipeline" } })),
      );
      await audit(p, a.institutions.name, `Agreed allocation of ${cedisText(Number(a.amount))}`);
      return ok("Agreed. The institution can now pay.");
    } catch (e) {
      return staffDenied(e);
    }
  });
}

/* ── Serwaa team: money ──────────────────────────────────────── */

export async function matchPayment(ref: string, reason: string) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx, ["Finance and reconciliation officer", "Operations administrator"], "Only finance can match payments.");
      if (!reason.trim()) return fail("Give a reason for the match. It goes on the record.");
      const pay = await must(db().from("payments").select("*").eq("ref", ref).maybeSingle());
      if (!pay) return fail("Payment not found.");
      if (pay.status === "Matched") return fail("Already matched.");
      const fees = await getFees();
      if (pay.kind === "Investment" && pay.investment_id) {
        const inv = await must(db().from("investments").select("*").eq("id", pay.investment_id).single());
        if (inv.status === "Awaiting authorisation") return fail("The payer hasn't approved this Mobile Money prompt yet.");
        const camp = await must(db().from("campaigns").select("ref, business").eq("id", inv.campaign_id).single());
        await must(db().from("investments").update({ status: "Cleared" }).eq("id", inv.id));
        if (inv.institution_id) await must(db().from("allocations").update({ status: "Paid" }).eq("institution_id", inv.institution_id).eq("campaign_id", inv.campaign_id));
        await book(pay.ref, `Investment cleared for ${camp.ref}`, [
          { account: "Custodian bank: investor money", debit: round(Number(inv.amount) + Number(inv.fee)), credit: 0 },
          { account: `Campaign funds: ${camp.ref}`, debit: 0, credit: Number(inv.amount) },
          { account: "Fee income: payments", debit: 0, credit: Number(inv.fee) },
        ]);
        const payer = await emailsOf([inv.investor_id]);
        const aud: Audience = inv.institution_id ? "institution" : "investor";
        const href = inv.institution_id ? "/institution/portfolio" : "/invest";
        await notify(
          [{ audience: aud, user_id: inv.investor_id, title: "Your investment is confirmed", body: `${cedisText(Number(inv.amount))} in ${camp.business} has cleared.`, href }],
          payer.map((x) => ({ to: x.email, title: "Your investment is confirmed", body: `${cedisText(Number(inv.amount))} in ${camp.business} has reached the custodian and cleared.`, cta: { label: "See your portfolio", href } })),
        );
      }
      if (pay.kind === "Repayment") {
        const amount = Number(pay.expected);
        const servicing = round((amount * fees.servicingPct) / 100);
        const toInvestors = round(amount - servicing);
        const fac = await must(db().from("facilities").select("*").eq("ref", pay.subject).maybeSingle());
        if (fac && pay.lines)
          await must(db().from("facilities").update({ schedule: (fac.schedule as ScheduleLine[]).map((l, i) => (pay.lines.includes(i) ? { ...l, status: "Paid" } : l)) }).eq("ref", fac.ref));
        await book(pay.ref, `Repayment received for ${pay.subject}`, [
          { account: "Custodian bank: collections", debit: amount, credit: 0 },
          { account: "Investor payables", debit: 0, credit: toInvestors },
          { account: "Fee income: servicing", debit: 0, credit: servicing },
        ]);
        // Share the repayment between the deal's investors in proportion to what each put in.
        const holders = fac?.campaign_id ? await must(db().from("investments").select("investor_id, institution_id, amount").eq("campaign_id", fac.campaign_id).eq("status", "Cleared")) : [];
        const byOwner = new Map<string, { amount: number; userId: string; institution: boolean }>();
        holders.forEach((h: any) => {
          const key = h.institution_id ?? h.investor_id;
          const cur = byOwner.get(key) ?? { amount: 0, userId: h.investor_id, institution: !!h.institution_id };
          byOwner.set(key, { ...cur, amount: cur.amount + Number(h.amount) });
        });
        const total = [...byOwner.values()].reduce((t, h) => t + h.amount, 0);
        if (total > 0)
          await must(
            db()
              .from("cash_events")
              .insert([...byOwner.entries()].map(([owner, h]) => ({ owner_id: owner, kind: "Repayment", amount: round((toInvestors * h.amount) / total), note: `${pay.from_name}, repayment ${pay.ref}` }))),
          );
        const people = await emailsOf([...byOwner.values()].map((h) => h.userId));
        const biz = await emailsOf(pay.payer_id ? [pay.payer_id] : []);
        await notify(
          [
            { audience: "business", user_id: pay.payer_id, title: "Payment received", body: `${cedisText(amount)} confirmed. Thank you.`, href: "/business/facilities" },
            ...[...byOwner.values()].map((h) => ({ audience: (h.institution ? "institution" : "investor") as Audience, user_id: h.userId, title: "Repayment received", body: `Your share of a ${cedisText(amount)} repayment from ${pay.from_name}.`, href: h.institution ? "/institution/portfolio" : "/invest" })),
          ],
          [
            ...biz.map((b) => ({ to: b.email, title: "Payment received", body: `We've received your ${cedisText(amount)} repayment for ${pay.subject}. Thank you.`, cta: { label: "See your schedule", href: "/business/facilities" } })),
            ...people.map((x) => ({ to: x.email, title: "You've been repaid", body: `Your share of a repayment from ${pay.from_name} is now in your available balance.`, cta: { label: "See your balance", href: "/invest" } })),
          ],
        );
      }
      await must(db().from("payments").update({ status: "Matched", received: pay.expected }).eq("ref", ref));
      await audit(p, ref, "Payment matched", reason.trim());
      dealsChanged();
      return ok("Matched and booked to the ledger.");
    } catch (e) {
      return staffDenied(e);
    }
  });
}

/* ── Serwaa team: back office ────────────────────────────────── */

export async function addStaff(m: StaffMember) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx, [], "Only a super administrator can add people.");
      const email = m.email.trim().toLowerCase();
      if (!m.name.trim() || !validEmail(email)) return fail("Add a name and a valid email.");
      if (!m.roles.length) return fail("Give them at least one role.");
      const existing = await must(db().from("profiles").select("id").eq("email", email).maybeSingle());
      if (existing) return fail("Someone with that email already has an account.");
      const id = await ensureUser(email);
      await must(db().from("profiles").insert({ id, kind: "staff", name: m.name.trim(), email, staff_roles: m.roles }));
      const link = await signInLink(email);
      await notify([], [{ to: email, title: "You've been added to the Serwaa team", body: `${p.name} added you as ${m.roles.join(", ").toLowerCase()}.`, cta: { label: "Sign in", href: link.href } }]);
      await audit(p, m.name.trim(), `Added with roles: ${m.roles.join(", ")}`);
      return ok(`${m.name.trim()} added and emailed a sign-in link.`);
    } catch (e) {
      return staffDenied(e);
    }
  });
}

export async function setStaffRoles(name: string, roles: string[]) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx, [], "Only a super administrator can change roles.");
      if (!roles.length) return fail("Everyone needs at least one role.");
      const supers = await must(db().from("profiles").select("name").eq("kind", "staff").contains("staff_roles", ["Super administrator"]));
      if (!roles.includes("Super administrator") && supers.length === 1 && supers[0].name === name) return fail("This is the only super administrator. Add another before removing that access.");
      await must(db().from("profiles").update({ staff_roles: roles }).eq("kind", "staff").eq("name", name));
      await audit(p, name, `Roles set to ${roles.join(", ")}`);
      return ok("Roles updated.");
    } catch (e) {
      return staffDenied(e);
    }
  });
}

export async function updateFees(fees: Fees, reason: string) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx, ["Finance and reconciliation officer"], "Only finance or a super administrator can change fees.");
      if (!reason.trim()) return fail("Say why the fees are changing. It goes on the record.");
      if (Object.values(fees).some((v) => !Number.isFinite(v) || v < 0)) return fail("Fees can't be negative.");
      const current = await getFees();
      const changes = (Object.keys(fees) as (keyof Fees)[]).filter((k) => fees[k] !== current[k]).map((k) => `${k} ${current[k]} → ${fees[k]}`);
      if (!changes.length) return fail("Nothing has changed.");
      await must(db().from("settings").update({ value: fees }).eq("key", "fees"));
      await audit(p, "Fees", `Changed ${changes.join("; ")}`, reason.trim());
      dealsChanged();
      return ok("Fees updated. New charges apply from now on.");
    } catch (e) {
      return staffDenied(e);
    }
  });
}

export async function setRestricted(name: string, on: boolean, reason: string) {
  return run(async (ctx) => {
    try {
      const p = staff(ctx, ["KYC and compliance officer"], "Only compliance can restrict or reopen an account.");
      if (!reason.trim()) return fail("Give a reason. It goes on the record.");
      if (on) await must(db().from("restrictions").upsert({ account: name, reason: reason.trim() }));
      else await must(db().from("restrictions").delete().eq("account", name));
      await audit(p, name, on ? "Account restricted" : "Account reopened", reason.trim());
      return ok(on ? `${name} is restricted.` : `${name} is active again.`);
    } catch (e) {
      return staffDenied(e);
    }
  });
}

/* ── notifications ───────────────────────────────────────────── */

export async function markAllRead() {
  return run(async (ctx) => {
    if (!ctx.profile) return fail("Sign in first.");
    await updateMe(ctx.profile, { notes_read_at: today() });
    return ok("All caught up.");
  });
}
