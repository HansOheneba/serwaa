import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BadgeCheck, Building2, Fingerprint, Link2, Repeat, ScanFace, ShieldCheck, Smartphone, Users, Wallet } from "lucide-react";
import { ContentSection, InfoCard } from "@/components/content";
import { ButtonLink, Label, StatusPill } from "@/components/ui";
import { VerifyAccessForm } from "@/components/verify-access-form";
import { Weave } from "@/components/weave";

export const metadata: Metadata = {
  title: "Serwaa Verify",
  description: "Identity and business checks for Ghanaian lenders, fintechs and corporates, run by the team that verifies every business on Serwaa.",
};

const heroChecks = [
  { label: "Ghana Card matches the person", d: 700 },
  { label: "Selfie shows a real, live person", d: 1300 },
  { label: "Company registration confirmed", d: 1900 },
  { label: "Every owner identified and checked", d: 2500 },
  { label: "No sanctions or political exposure", d: 3100 },
];

const checks = [
  {
    icon: Fingerprint,
    title: "Identity",
    body: "Is this person who they say they are?",
    items: ["Ghana Card details matched", "Selfie and liveness check", "Phone and email confirmed"],
  },
  {
    icon: Building2,
    title: "Business",
    body: "Is the company real, and is it allowed to trade?",
    items: ["Registration and status", "Tax identification number", "Operating address and licences"],
  },
  {
    icon: Users,
    title: "Owners",
    body: "Who really controls it?",
    items: ["Every director and real owner", "Each one checked like an individual", "Shareholdings mapped"],
  },
  {
    icon: Wallet,
    title: "Money",
    body: "Is the money clean, and can they pay?",
    items: ["Sanctions and politically exposed people", "Source of funds", "Bank statement review (optional)"],
  },
];

const steps = [
  { icon: Link2, title: "You send a link", body: "Enter a name and a phone number or email. We send them a secure link with your name on it." },
  { icon: Smartphone, title: "They verify on their phone", body: "About five minutes: their Ghana Card, a selfie, and the company papers if it's a business. No app to download." },
  { icon: BadgeCheck, title: "You get the report", body: "Our system runs the checks and our compliance team settles anything it can't, then you get a signed report." },
];

const buyers = [
  { title: "Banks and savings and loans", body: "Onboard customers faster without growing the compliance team every time volumes rise.", meta: "Customer onboarding" },
  { title: "Lenders and fintechs", body: "Check borrowers and merchants before money moves, with a report you can show your regulator.", meta: "Before you lend" },
  { title: "Corporates and distributors", body: "Know which suppliers and distributors are genuine before you give them credit or a contract.", meta: "Supplier vetting" },
  { title: "Property and rentals", body: "Check tenants and the companies behind them before you hand over keys or equipment.", meta: "Tenant checks" },
];

const pricing = [
  { title: "Pay per check", body: "For occasional checks. You only pay for each report you order, with no monthly fee.", meta: "Individuals and businesses" },
  { title: "Monthly bundle", body: "For teams that onboard every week. A set number of checks a month at a lower price per check, plus monitoring.", meta: "Most popular for lenders" },
  { title: "API", body: "For platforms with high volume. Start checks from your own systems and get results back automatically.", meta: "Coming after the pilot" },
];

const promises = [
  { title: "Nothing without consent", body: "The person being checked sees who asked, what will be checked, and agrees before anything starts." },
  { title: "Handled under Ghana's law", body: "Personal data is processed under the Data Protection Act, 2012 (Act 843), and only seen by the people who need it." },
  { title: "Kept only as long as needed", body: "Reports and documents are kept for the period the law requires, then deleted." },
  { title: "Clear about who decides", body: "Our report is evidence for your own checks. Under Ghana's anti-money-laundering rules, the decision to take someone on stays yours." },
];

export default function VerifyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pt-20 pb-20 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:pt-28">
          <div>
            <div className="rise-in flex flex-wrap items-center gap-3">
              <Label>Serwaa Verify</Label>
              <StatusPill tone="warn">Early access</StatusPill>
            </div>
            <h1 className="rise-in mt-4 text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-aubergine-800 text-balance">
              Know who you&apos;re dealing with
            </h1>
            <p className="rise-in mt-6 max-w-xl text-lg leading-8 text-ink-600" style={{ animationDelay: "120ms" }}>
              Identity and business checks for lenders, fintechs and companies in Ghana, run by the same team that verifies every business on
              Serwaa down to its owners.
            </p>
            <div className="rise-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
              <ButtonLink href="#access">Request early access</ButtonLink>
              <ButtonLink href="#report" variant="outlined">
                See a sample report
              </ButtonLink>
            </div>
          </div>

          {/* A check running live: each line resolves in turn. */}
          <div className="rise-in relative" style={{ animationDelay: "250ms" }}>
            <Weave fade="b" className="-inset-x-6 -top-6 h-40 opacity-70" />
            <div className="relative rounded-3xl bg-white p-6 shadow-[0_30px_60px_-30px_rgba(58,24,70,0.45)] ring-1 ring-ink-200 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-aubergine-100 text-sm font-bold text-aubergine-800">AM</span>
                  <div>
                    <p className="font-bold text-aubergine-800">Abena Mensah</p>
                    <p className="text-xs text-ink-500">Director, Abrewa Trading Ltd</p>
                  </div>
                </div>
                <ScanFace className="size-6 text-aubergine-500" aria-hidden="true" />
              </div>
              <ul className="mt-6 divide-y divide-ink-100">
                {heroChecks.map((c) => (
                  <li key={c.label} className="flex items-center justify-between gap-3 py-3 text-sm" style={{ ["--d" as string]: `${c.d}ms` }}>
                    <span className="text-ink-800">{c.label}</span>
                    <span className="relative grid shrink-0 place-items-end">
                      <span className="check-pending col-start-1 row-start-1 text-xs font-semibold text-ink-400">Checking…</span>
                      <span className="check-done col-start-1 row-start-1">
                        <StatusPill tone="good">Passed</StatusPill>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-success-50 px-4 py-3 check-done" style={{ ["--d" as string]: "3600ms" }}>
                <p className="text-sm font-bold text-success-600">Verified · report ready</p>
                <p className="font-mono text-xs text-success-600">4 min 52 s</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContentSection
        tone="tint"
        eyebrow="What we check"
        title="Four questions, answered with evidence"
        lead="Pick the checks you need for each person or business. Every result comes with the evidence behind it, not just a tick."
      >
        <div data-reveal-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {checks.map((c) => (
            <div key={c.title} className="flex h-full flex-col rounded-2xl bg-white p-7 ring-1 ring-ink-200">
              <c.icon className="size-7 text-aubergine-500" aria-hidden="true" />
              <h3 className="mt-5 text-lg font-bold text-aubergine-800">{c.title}</h3>
              <p className="mt-1 text-sm leading-6 text-ink-600">{c.body}</p>
              <ul className="mt-5 space-y-2 border-t border-ink-100 pt-5">
                {c.items.map((i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-800">
                    <span className="mt-2 size-1.5 shrink-0 bg-saffron-500" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection eyebrow="How it works" title="Three steps, and nobody has to visit an office">
        <ol data-reveal-stagger className="grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-aubergine-800 pt-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs tracking-[0.08em] text-saffron-700">0{i + 1}</p>
                <s.icon className="size-6 text-aubergine-500" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-xl font-bold text-aubergine-800">{s.title}</h3>
              <p className="mt-2 leading-7 text-ink-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </ContentSection>

      <ContentSection
        id="report"
        tone="tint"
        eyebrow="The report"
        title="What you actually get"
        lead="One clear answer at the top, the evidence underneath, and named people accountable for it. This is a sample with made-up details."
      >
        <SampleReport />
      </ContentSection>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-8 lg:grid-cols-2 lg:py-28">
          <div data-reveal>
            <Label>For businesses</Label>
            <h2 className="mt-3 text-3xl leading-[1.08] font-extrabold tracking-[-0.03em] text-balance text-aubergine-800 sm:text-4xl">
              Verified once, trusted everywhere
            </h2>
            <p className="mt-4 text-lg leading-8 text-ink-600">
              A business that passes our checks gets a verified profile it can share with a link. Banks, suppliers and tender boards see what
              was checked and when, so the business stops handing over the same documents again and again.
            </p>
            <ul className="mt-6 space-y-3 text-ink-800">
              <li className="flex gap-3">
                <Repeat className="mt-0.5 size-5 shrink-0 text-aubergine-500" aria-hidden="true" />
                Kept up to date: if a director changes or a document expires, the profile says so.
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-aubergine-500" aria-hidden="true" />
                The business decides who sees it. Documents are never public, only the results.
              </li>
            </ul>
            <p className="mt-6 text-sm text-ink-500">Free for every business that raises financing on Serwaa.</p>
          </div>
          <SharedProfile />
        </div>
      </section>

      <ContentSection tone="tint" eyebrow="Who it's for" title="Anyone who has to be sure before money or goods change hands">
        <div data-reveal-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {buyers.map((b) => (
            <InfoCard key={b.title} {...b} />
          ))}
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Pricing"
        title="Pay for what you check"
        lead="We're setting prices with our first pilot clients. Join early access to help shape them and lock in pilot pricing."
      >
        <div data-reveal-stagger className="grid gap-6 md:grid-cols-3">
          {pricing.map((p) => (
            <InfoCard key={p.title} {...p} />
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-ink-500">
          Businesses and investors are never charged for the checks they need to raise or invest on Serwaa.
        </p>
      </ContentSection>

      <ContentSection tone="dark" eyebrow="Privacy and the law" title="Careful with people's data, and honest about our role">
        <div data-reveal-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p) => (
            <InfoCard key={p.title} tone="dark" title={p.title} body={p.body} />
          ))}
        </div>
      </ContentSection>

      <section id="access" className="scroll-mt-24 bg-ink-50">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:py-28">
          <div data-reveal>
            <Label>Early access</Label>
            <h2 className="mt-3 text-3xl leading-[1.08] font-extrabold tracking-[-0.03em] text-balance text-aubergine-800 sm:text-4xl">
              Be one of our first clients
            </h2>
            <p className="mt-4 text-lg leading-8 text-ink-600">
              We&apos;re opening Serwaa Verify to a small group of pilot clients first. Tell us what you need to check and we&apos;ll get in
              touch.
            </p>
          </div>
          <div data-reveal>
            <VerifyAccessForm />
          </div>
        </div>
      </section>
    </>
  );
}

/* ——— Sample report: a document with numbered notes explaining each part. ——— */

const notes = [
  { n: 1, title: "One answer first", body: "Passed, passed with notes, or failed. You know where you stand before you read a line." },
  { n: 2, title: "Every owner, not just the applicant", body: "Each director and real owner is checked as thoroughly as the person who applied." },
  { n: 3, title: "Flags are explained, never hidden", body: "If something needed a closer look, you see what it was and how it was settled." },
  { n: 4, title: "Named people sign off", body: "A compliance officer reviews the result and a second person checks their work." },
  { n: 5, title: "A date it runs out", body: "Reports expire, and monitoring tells you if anything changes before then." },
];

function Pin({ n }: { n: number }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-saffron-500 text-xs font-bold text-aubergine-950" aria-label={`Note ${n}`}>
      {n}
    </span>
  );
}

function Row({ k, v, mono }: { k: string; v: ReactNode; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-3 py-2 text-sm">
      <dt className="text-ink-500">{k}</dt>
      <dd className={`text-ink-900 ${mono ? "font-mono text-[13px]" : ""}`}>{v}</dd>
    </div>
  );
}

function SampleReport() {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.5fr_1fr]">
      <article data-reveal className="relative overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-30px_rgba(58,24,70,0.35)] ring-1 ring-ink-200">
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] text-[5rem] font-extrabold tracking-[0.2em] text-ink-900/[0.04] select-none sm:text-[8rem]"
          aria-hidden="true"
        >
          SAMPLE
        </span>
        <header className="flex flex-wrap items-center justify-between gap-3 bg-aubergine-800 px-6 py-4 text-white sm:px-8">
          <p className="font-bold">
            serwaa<span className="text-saffron-500">.</span> verify
          </p>
          <p className="font-mono text-xs text-aubergine-200">Report SV-2026-01482</p>
        </header>

        <div className="relative space-y-7 p-6 sm:p-8">
          <section className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.08em] text-ink-500 uppercase">Business check</p>
              <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-aubergine-800">Abrewa Trading Ltd</h3>
              <p className="text-sm text-ink-600">Wholesale distribution · Kumasi</p>
            </div>
            <div className="flex items-center gap-2">
              <Pin n={1} />
              <span className="rounded-xl bg-success-50 px-4 py-2 text-sm font-bold text-success-600">Passed with 1 note</span>
            </div>
          </section>

          <section>
            <p className="text-xs font-semibold tracking-[0.08em] text-aubergine-500 uppercase">Company</p>
            <dl className="mt-2 divide-y divide-ink-100 border-y border-ink-100">
              <Row k="Registration" v={<>CS-SAMPLE-0418 · Active <StatusPill tone="good">Confirmed</StatusPill></>} />
              <Row k="Tax number" v={<>C00-SAMPLE-77 <StatusPill tone="good">Confirmed</StatusPill></>} />
              <Row k="Address" v="Adum, Kumasi · confirmed by utility bill" />
            </dl>
          </section>

          <section>
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold tracking-[0.08em] text-aubergine-500 uppercase">Owners and directors</p>
              <Pin n={2} />
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[30rem] text-left text-sm">
                <thead className="text-xs text-ink-500">
                  <tr className="border-b border-ink-100">
                    <th className="py-2 font-semibold">Person</th>
                    <th className="py-2 font-semibold">Share</th>
                    <th className="py-2 font-semibold">Ghana Card</th>
                    <th className="py-2 font-semibold">Liveness</th>
                    <th className="py-2 font-semibold">Screening</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  <tr>
                    <td className="py-2.5 font-semibold text-ink-900">Abena Mensah</td>
                    <td className="py-2.5 font-mono">60%</td>
                    <td className="py-2.5"><StatusPill tone="good">Match</StatusPill></td>
                    <td className="py-2.5"><StatusPill tone="good">Passed</StatusPill></td>
                    <td className="py-2.5"><StatusPill tone="good">Clear</StatusPill></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-ink-900">Kofi Asare</td>
                    <td className="py-2.5 font-mono">40%</td>
                    <td className="py-2.5"><StatusPill tone="good">Match</StatusPill></td>
                    <td className="py-2.5"><StatusPill tone="good">Passed</StatusPill></td>
                    <td className="py-2.5"><StatusPill tone="warn">Reviewed</StatusPill></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex gap-3 rounded-xl bg-saffron-50 p-4">
            <Pin n={3} />
            <div className="text-sm leading-6">
              <p className="font-bold text-saffron-800">Note: possible name match, cleared</p>
              <p className="text-ink-700">
                &ldquo;Kofi Asare&rdquo; partly matched a public-office holder. Date of birth and Ghana Card number differ, so this is a different
                person. No further action needed.
              </p>
            </div>
          </section>

          <section>
            <p className="text-xs font-semibold tracking-[0.08em] text-aubergine-500 uppercase">Money</p>
            <dl className="mt-2 divide-y divide-ink-100 border-y border-ink-100">
              <Row k="Source of funds" v="Trading income, supported by bank statements" />
              <Row k="Bank statements" v="6 months reviewed · average monthly inflow GH₵ 184,300 · no bounced payments" />
            </dl>
          </section>

          <section className="grid gap-4 border-t border-ink-200 pt-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <Pin n={4} />
              <div className="text-sm">
                <p className="text-ink-500">Checked by</p>
                <p className="font-semibold text-ink-900">E. Owusu, compliance officer</p>
                <p className="text-ink-500">Second review by K. Boateng</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Pin n={5} />
              <div className="text-sm">
                <p className="text-ink-500">Valid until</p>
                <p className="font-semibold text-ink-900">24 May 2027</p>
                <p className="text-ink-500">Monitoring on: re-screened monthly</p>
              </div>
            </div>
          </section>
        </div>
      </article>

      <ol data-reveal-stagger className="space-y-5 lg:sticky lg:top-28">
        {notes.map((n) => (
          <li key={n.n} className="flex gap-4">
            <Pin n={n.n} />
            <div>
              <p className="font-bold text-aubergine-800">{n.title}</p>
              <p className="mt-1 text-sm leading-6 text-ink-600">{n.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ——— The shareable verified profile a business can send to anyone. ——— */

function SharedProfile() {
  return (
    <div data-reveal className="overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-30px_rgba(58,24,70,0.35)] ring-1 ring-ink-200">
      <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50 px-4 py-3">
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-ink-200" aria-hidden="true" />
        <span className="ml-3 truncate rounded-md bg-white px-3 py-1 font-mono text-xs text-ink-600 ring-1 ring-ink-200">serwaa / verified / abrewa-trading</span>
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xl font-extrabold tracking-tight text-aubergine-800">Abrewa Trading Ltd</p>
            <p className="text-sm text-ink-600">Wholesale distribution · Kumasi</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-aubergine-800 px-3 py-1 text-xs font-bold text-white">
            <BadgeCheck className="size-4 text-saffron-500" aria-hidden="true" /> Verified
          </span>
        </div>
        <ul className="mt-6 divide-y divide-ink-100 border-y border-ink-100 text-sm">
          {[
            ["Registration and tax number", "Checked 24 Nov 2026"],
            ["2 directors and owners", "Checked 24 Nov 2026"],
            ["Sanctions screening", "Re-checked monthly"],
            ["Operating address", "Checked 24 Nov 2026"],
          ].map(([k, v]) => (
            <li key={k} className="flex items-center justify-between gap-3 py-3">
              <span className="flex items-center gap-2 text-ink-900">
                <BadgeCheck className="size-4 text-success-600" aria-hidden="true" />
                {k}
              </span>
              <span className="text-xs text-ink-500">{v}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-500">Documents are private. This page shows results only.</p>
      </div>
    </div>
  );
}
