"use client";

import { createAccount } from "@/lib/actions";
import { Briefcase, Building2, ChevronRight, Landmark, Plus, Trash2, TrendingUp, UserRound } from "lucide-react";
import { useState } from "react";
import {
  copy,
  investorProfile,
  isEmail,
  isPhone,
  options,
  ownershipTotal,
  type Mode,
  type OnboardingState,
  type Person,
  type StepId,
} from "@/lib/onboarding";
import { Chips, OptionalDetails, OptionCards, Section, StepHeader, StepNav, TextField } from "./fields";

export type StepProps = {
  s: OnboardingState;
  /** Pass a patch, or a function of the latest state so rapid changes never overwrite each other. */
  set: (patch: Partial<OnboardingState> | ((prev: OnboardingState) => Partial<OnboardingState>)) => void;
  next: () => void;
  back?: () => void;
};

/* ─── 1. Who is signing up ─────────────────────────────── */
export function ModeStep({ s, set, next }: StepProps) {
  return (
    <div className="space-y-8">
      <StepHeader title="How will you use Serwaa?" sub="We'll tailor every step to fit." note="You can add another account type later." />
      <OptionCards
        name="Account type"
        value={s.mode}
        onChange={(v) => set({ mode: v as Mode })}
        options={[
          { value: "business", label: "My business needs financing", body: "Invoices, purchase orders, contracts or working capital.", icon: <Briefcase className="size-5" /> },
          { value: "investor", label: "I want to invest", body: "Lend to verified businesses from GH₵100.", icon: <TrendingUp className="size-5" /> },
          { value: "institution", label: "I represent an institution", body: "A fund, bank, DFI, family office or corporate investor.", icon: <Landmark className="size-5" /> },
        ]}
      />
      <StepNav onNext={next} canNext />
    </div>
  );
}

/* ─── 2. Account holder ────────────────────────────────── */
export function AccountStep({ s, set, next, back }: StepProps) {
  const a = s.account;
  const up = (patch: Partial<typeof a>) => set((prev) => ({ account: { ...prev.account, ...patch } }));
  const emailError = a.email && !isEmail(a.email) ? "Enter an email like name@company.com" : undefined;
  const phoneError = a.phone && !isPhone(a.phone) ? "Enter a full phone number" : undefined;
  const ok = a.firstName.trim() && a.lastName.trim() && isEmail(a.email) && isPhone(a.phone);
  return (
    <div className="space-y-8">
      <StepHeader title={copy.account.heading[s.mode]} sub={copy.account.sub[s.mode]} />
      <Section label="Your details">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="First name" value={a.firstName} onChange={(v) => up({ firstName: v })} autoComplete="given-name" />
          <TextField label="Last name" value={a.lastName} onChange={(v) => up({ lastName: v })} autoComplete="family-name" />
          <TextField
            label={s.mode === "investor" ? "Email" : "Work email"}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={a.email}
            onChange={(v) => up({ email: v })}
            placeholder="you@company.com"
            error={emailError}
            className="sm:col-span-2"
          />
          <TextField
            label="Mobile number"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            prefix="+233"
            value={a.phone}
            onChange={(v) => up({ phone: v })}
            placeholder="24 123 4567"
            error={phoneError}
            hint="We'll send a code to confirm it."
            className="sm:col-span-2"
          />
        </div>
        {s.mode === "investor" && (
          <Chips label="Country of residence" options={["Ghana", "Nigeria", "United Kingdom", "United States", "Other"]} value={a.country} onChange={(v) => up({ country: v as string })} />
        )}
      </Section>
      <StepNav onBack={back} onNext={next} canNext={!!ok} />
    </div>
  );
}

/* ─── Business: company ────────────────────────────────── */
export function BusinessStep({ s, set, next, back }: StepProps) {
  const b = s.business;
  const up = (patch: Partial<typeof b>) => set((prev) => ({ business: { ...prev.business, ...patch } }));
  const ok = b.legalName.trim() && b.regNumber.trim() && b.type && b.industry;
  return (
    <div className="space-y-8">
      <StepHeader title="Tell us about your business" sub="Just the essentials for now. Documents come after you've created your account." />
      <Section label="Company">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Registered business name" value={b.legalName} onChange={(v) => up({ legalName: v })} autoComplete="organization" className="sm:col-span-2" />
          <TextField label="Registration number" value={b.regNumber} onChange={(v) => up({ regNumber: v })} placeholder="CS123456789" hint="As shown on your certificate of incorporation" />
          <TextField label="Year started" value={b.year} onChange={(v) => up({ year: v.replace(/\D/g, "").slice(0, 4) })} inputMode="numeric" placeholder="2018" />
        </div>
        <Chips label="Business type" options={options.businessTypes} value={b.type} onChange={(v) => up({ type: v as string })} />
        <Chips label="Industry" options={options.industries} value={b.industry} onChange={(v) => up({ industry: v as string })} />
        <OptionalDetails label="trading name, website and TIN">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Trading name" value={b.tradingName} onChange={(v) => up({ tradingName: v })} hint="If different from the registered name" />
            <TextField label="Tax identification number" value={b.tin} onChange={(v) => up({ tin: v })} />
            <TextField label="Website" value={b.website} onChange={(v) => up({ website: v })} inputMode="url" placeholder="www.yourbusiness.com" className="sm:col-span-2" />
          </div>
        </OptionalDetails>
      </Section>
      <StepNav onBack={back} onNext={next} canNext={!!ok} />
    </div>
  );
}

/* ─── Business: owners and directors ───────────────────── */
export function PeopleStep({ s, set, next, back }: StepProps) {
  const [draft, setDraft] = useState<{ name: string; role: string; ownership: string }>({ name: "", role: "", ownership: "" });
  const [showForm, setShowForm] = useState(s.people.length === 0);
  const total = ownershipTotal(s.people);
  const holdsShares = draft.role === "Shareholder" || draft.role === "Director and shareholder";
  const canSave = draft.name.trim() && draft.role && (!holdsShares || Number(draft.ownership) > 0);

  function save() {
    const person: Person = { name: draft.name.trim(), role: draft.role, ownership: holdsShares ? Math.min(100, Number(draft.ownership)) : 0 };
    set((prev) => ({ people: [...prev.people, person] }));
    setDraft({ name: "", role: "", ownership: "" });
    setShowForm(false);
  }
  function remove(i: number) {
    const people = s.people.filter((_, idx) => idx !== i);
    set({ people });
    if (people.length === 0) setShowForm(true);
  }

  return (
    <div className="space-y-8">
      <StepHeader
        title="Who owns and runs the business?"
        sub="Add directors and anyone who owns shares, one at a time. Each person gets a short identity check by link later."
      />

      {showForm && (
        <Section label={s.people.length === 0 ? "Add the first person" : "Add another person"}>
          <TextField label="Full name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <Chips label="Role" options={options.roles} value={draft.role} onChange={(v) => setDraft({ ...draft, role: v as string })} />
          {holdsShares && (
            <TextField
              label="Shareholding (%)"
              value={draft.ownership}
              onChange={(v) => setDraft({ ...draft, ownership: v.replace(/[^\d.]/g, "").slice(0, 5) })}
              inputMode="numeric"
              placeholder="60"
              className="sm:max-w-40"
            />
          )}
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-aubergine-800 text-sm font-semibold text-white hover:bg-aubergine-700 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-500"
          >
            <Plus className="size-4" aria-hidden="true" />
            Save person
          </button>
        </Section>
      )}

      {s.people.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[0.08em] text-ink-400 uppercase">People ({s.people.length})</p>
            <p className={`font-mono text-xs ${total >= 100 ? "text-success-600" : "text-saffron-800"}`}>{total}% of shares added</p>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
            <div className={`h-full transition-[width] duration-300 ${total >= 100 ? "bg-success-600" : "bg-saffron-500"}`} style={{ width: `${Math.min(100, total)}%` }} />
          </div>
          {s.people.map((p, i) => (
            <div key={`${p.name}-${i}`} className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-ink-100">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-aubergine-50 text-aubergine-700">
                  <UserRound className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{p.name}</p>
                  <p className="text-xs text-ink-500">
                    {p.role}
                    {p.ownership > 0 && ` · ${p.ownership}%`}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => remove(i)} aria-label={`Remove ${p.name}`} className="text-ink-300 transition-colors hover:text-danger-600">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 py-3 text-sm font-semibold text-ink-600 transition-colors hover:border-aubergine-500 hover:text-aubergine-800"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add another person
            </button>
          )}
          {total > 0 && total < 100 && (
            <p className="text-xs text-ink-500">You can continue now and add the remaining shareholders before credit review.</p>
          )}
          {total > 100 && <p className="text-xs text-danger-600">Shareholdings add up to more than 100%. Check the percentages.</p>}
        </div>
      )}

      <StepNav onBack={back} onNext={next} canNext={s.people.length > 0 && total <= 100} missingHint="Add at least one director or owner to continue." />
    </div>
  );
}

/* ─── Business: what they need ─────────────────────────── */
export function NeedStep({ s, set, next, back }: StepProps) {
  const n = s.need;
  const up = (patch: Partial<typeof n>) => set((prev) => ({ need: { ...prev.need, ...patch } }));
  return (
    <div className="space-y-8">
      <StepHeader title="What kind of financing do you need?" sub="A rough idea is enough. You'll give the full details when you apply." />
      <OptionCards name="Financing type" value={n.product} onChange={(v) => up({ product: v })} options={options.products} />
      <Section label="Size and timing">
        <Chips label="Roughly how much?" options={options.amounts} value={n.amount} onChange={(v) => up({ amount: v as string })} />
        <Chips label="When do you need it?" options={options.timing} value={n.timing} onChange={(v) => up({ timing: v as string })} />
      </Section>
      <StepNav onBack={back} onNext={next} canNext={!!(n.product && n.amount && n.timing)} />
    </div>
  );
}

/* ─── Investor: goals and experience ───────────────────── */
export function GoalsStep({ s, set, next, back }: StepProps) {
  const inv = s.investor;
  const up = (patch: Partial<typeof inv>) => set((prev) => ({ investor: { ...prev.investor, ...patch } }));
  return (
    <div className="space-y-8">
      <StepHeader title="What do you want your money to do?" sub="Pick all that apply. We use this to decide which opportunities to show you first." />
      <Chips options={options.objectives.map((o) => o.value)} value={inv.objectives} onChange={(v) => up({ objectives: v as string[] })} multiple />
      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink-800">How much investing have you done?</p>
        <OptionCards name="Investing experience" value={inv.experience} onChange={(v) => up({ experience: v })} options={options.experience} />
      </div>
      <StepNav onBack={back} onNext={next} canNext={inv.objectives.length > 0 && !!inv.experience} />
    </div>
  );
}

/* ─── Investor: risk (willingness and capacity, kept apart) ── */
export function RiskStep({ s, set, next, back }: StepProps) {
  const inv = s.investor;
  const up = (patch: Partial<typeof inv>) => set((prev) => ({ investor: { ...prev.investor, ...patch } }));
  return (
    <div className="space-y-8">
      <StepHeader title="Two honest questions about risk" sub="Businesses sometimes repay late, and sometimes not in full. Your answers help us show you the right level of risk." />
      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink-800">If a repayment arrived three months late, how would you feel?</p>
        <OptionCards name="Reaction to a late repayment" value={inv.lateReaction} onChange={(v) => up({ lateReaction: v })} options={options.lateReaction} />
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink-800">How much of your savings would you put into Serwaa?</p>
        <OptionCards name="Share of savings" value={inv.shareOfSavings} onChange={(v) => up({ shareOfSavings: v })} options={options.shareOfSavings} />
      </div>
      <StepNav onBack={back} onNext={next} canNext={!!(inv.lateReaction && inv.shareOfSavings)} />
    </div>
  );
}

/* ─── Investor: preferences ────────────────────────────── */
export function PreferencesStep({ s, set, next, back }: StepProps) {
  const inv = s.investor;
  const up = (patch: Partial<typeof inv>) => set((prev) => ({ investor: { ...prev.investor, ...patch } }));
  return (
    <div className="space-y-8">
      <StepHeader title="What should we show you?" sub="These shape your matches. You can change them any time." />
      <Section label="Amount and term">
        <Chips label="Typical amount per investment" options={options.tickets} value={inv.ticket} onChange={(v) => up({ ticket: v as string })} />
        <Chips label="How long can you lock money away?" options={options.tenors} value={inv.tenor} onChange={(v) => up({ tenor: v as string })} />
      </Section>
      <Section label="Sectors and security">
        <Chips label="Sectors you'd like to support (optional)" options={options.industries} value={inv.sectors} onChange={(v) => up({ sectors: v as string[] })} multiple />
        <Chips label="Security" options={options.secured} value={inv.secured} onChange={(v) => up({ secured: v as string })} />
      </Section>
      <StepNav onBack={back} onNext={next} canNext={!!(inv.ticket && inv.tenor && inv.secured)} />
    </div>
  );
}

/* ─── Institution: organisation ────────────────────────── */
export function OrganisationStep({ s, set, next, back }: StepProps) {
  const o = s.institution;
  const up = (patch: Partial<typeof o>) => set((prev) => ({ institution: { ...prev.institution, ...patch } }));
  return (
    <div className="space-y-8">
      <StepHeader title="Tell us about your organisation" sub="Our partnerships team reviews every institution before granting pipeline access." />
      <Section label="Organisation">
        <TextField label="Organisation name" value={o.orgName} onChange={(v) => up({ orgName: v })} autoComplete="organization" />
        <TextField label="Your role" value={o.role} onChange={(v) => up({ role: v })} placeholder="Head of private credit" autoComplete="organization-title" />
        <Chips label="Type" options={options.orgTypes} value={o.orgType} onChange={(v) => up({ orgType: v as string })} />
      </Section>
      <StepNav onBack={back} onNext={next} canNext={!!(o.orgName.trim() && o.role.trim() && o.orgType)} />
    </div>
  );
}

/* ─── Institution: mandate ─────────────────────────────── */
export function MandateStep({ s, set, next, back }: StepProps) {
  const o = s.institution;
  const up = (patch: Partial<typeof o>) => set((prev) => ({ institution: { ...prev.institution, ...patch } }));
  return (
    <div className="space-y-8">
      <StepHeader title="What's your mandate?" sub="A starting point for your pipeline. You can set exact parameters with our team." />
      <Section label="Mandate">
        <Chips label="Ticket size per transaction" options={options.institutionTickets} value={o.ticket} onChange={(v) => up({ ticket: v as string })} />
        <Chips label="Tenor" options={options.tenors} value={o.tenor} onChange={(v) => up({ tenor: v as string })} />
        <Chips label="Sectors" options={options.industries} value={o.sectors} onChange={(v) => up({ sectors: v as string[] })} multiple />
      </Section>
      <StepNav onBack={back} onNext={next} canNext={!!(o.ticket && o.tenor && o.sectors.length)} />
    </div>
  );
}

/* ─── Review ───────────────────────────────────────────── */
function ReviewRow({ icon, title, summary, onEdit }: { icon: React.ReactNode; title: string; summary: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-ink-100">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-aubergine-50 text-aubergine-700">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-900">{title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{summary}</p>
        </div>
      </div>
      <button type="button" onClick={onEdit} className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-aubergine-500 hover:underline">
        Edit <ChevronRight className="size-3" aria-hidden="true" />
      </button>
    </div>
  );
}

export function ReviewStep({ s, set, next, back, goTo }: StepProps & { goTo: (step: StepId) => void }) {
  const a = s.account;
  const profile = investorProfile(s.investor);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const rows: { icon: React.ReactNode; title: string; summary: string; step: StepId }[] = [
    { icon: <UserRound className="size-4" />, title: `${a.firstName} ${a.lastName}`, summary: `${a.email} · +233 ${a.phone}`, step: "account" },
  ];
  if (s.mode === "business") {
    rows.push(
      { icon: <Building2 className="size-4" />, title: s.business.legalName, summary: `${s.business.type} · ${s.business.industry} · ${s.business.regNumber}`, step: "business" },
      { icon: <UserRound className="size-4" />, title: "Owners and directors", summary: s.people.map((p) => p.name).join(", "), step: "people" },
      { icon: <Briefcase className="size-4" />, title: s.need.product, summary: `${s.need.amount} · ${s.need.timing}`, step: "need" },
    );
  } else if (s.mode === "investor") {
    rows.push(
      { icon: <TrendingUp className="size-4" />, title: "Goals", summary: `${s.investor.objectives.join(", ")} · ${s.investor.experience}`, step: "goals" },
      { icon: <Briefcase className="size-4" />, title: "Risk", summary: `${s.investor.lateReaction} · ${s.investor.shareOfSavings}`, step: "risk" },
      { icon: <Landmark className="size-4" />, title: "Preferences", summary: `${s.investor.ticket} · ${s.investor.tenor} · ${s.investor.secured}`, step: "preferences" },
    );
  } else {
    rows.push(
      { icon: <Building2 className="size-4" />, title: s.institution.orgName, summary: `${s.institution.orgType} · ${s.institution.role}`, step: "organisation" },
      { icon: <Landmark className="size-4" />, title: "Mandate", summary: `${s.institution.ticket} · ${s.institution.tenor} · ${s.institution.sectors.join(", ")}`, step: "mandate" },
    );
  }

  return (
    <div className="space-y-8">
      <StepHeader title={copy.review.heading[s.mode]} sub="Make sure everything looks right. You can edit any section." />

      {s.mode === "investor" && profile && (
        <div className="rounded-2xl bg-aubergine-800 p-5 text-white sm:p-6">
          <p className="text-xs font-semibold tracking-[0.08em] text-saffron-300 uppercase">Your investor profile</p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight">{profile.category}</p>
          <p className="mt-2 text-sm leading-6 text-aubergine-100">{profile.summary}</p>
          {profile.capped && (
            <p className="mt-3 rounded-lg bg-aubergine-700 p-3 text-xs leading-5 text-aubergine-100">
              You&apos;re comfortable with more risk than your savings can absorb, so we&apos;ve matched your profile to what you can afford to lose.
            </p>
          )}
          <p className="mt-3 text-xs text-aubergine-200">This guides what we show you. It isn&apos;t financial advice.</p>
        </div>
      )}

      <div className="space-y-3">
        {rows.map((r) => (
          <ReviewRow key={r.title + r.step} icon={r.icon} title={r.title} summary={r.summary} onEdit={() => goTo(r.step)} />
        ))}
      </div>

      <label className="flex cursor-pointer gap-3 rounded-xl bg-ink-50 p-4 text-sm leading-6 text-ink-700">
        <input
          type="checkbox"
          checked={s.consent}
          onChange={(e) => set({ consent: e.target.checked })}
          className="mt-1 size-4 shrink-0 accent-aubergine-800"
        />
        <span>
          {copy.review.consent[s.mode]} I agree to Serwaa&apos;s terms and privacy policy.
        </span>
      </label>

      {error && (
        <p className="rounded-xl bg-danger-50 p-4 text-sm font-semibold text-danger-600" role="alert">
          {error}
        </p>
      )}

      <StepNav
        onBack={back}
        onNext={async () => {
          setBusy(true);
          setError("");
          const r = await createAccount(s);
          setBusy(false);
          if (r.ok) next();
          else setError(r.message);
        }}
        canNext={s.consent && !busy}
        nextLabel={busy ? "Creating your account…" : copy.review.submit[s.mode]}
        missingHint="Tick the box above to continue."
      />
    </div>
  );
}
